import React, { useEffect, useRef, useState } from 'react';
import {
  Maximize2,
  Music,
  Play,
  Sparkles,
  Users,
  Volume2,
  X,
} from 'lucide-react';
import {
  CLANNAD_CHARACTERS,
  CLANNAD_GALLERY_SCENES,
  CLANNAD_TRACKS,
  ClannadGalleryScene,
  ClannadTrackId,
  DANGO_FAMILY_MEMBERS,
  DangoMember,
  USHIO_POSES_VOICES,
  UshioPoseVoice,
} from '../data/clannadData';
import { attachDialogEnhancements, closeDialogSmoothly } from '../utils/dialogHelper';
import { SakuraBlossomIcon } from './ClannadMotifs';

interface ClannadSanctuaryProps {
  motionPaused: boolean;
  onPlayTrack: (trackId: ClannadTrackId) => void;
  onVoiceDuckChange: (ducking: boolean) => void;
}

/** 高精矢量 Q 弹团子 SVG 组件 */
const DangoSvg: React.FC<{ member: DangoMember; bouncing: boolean }> = ({ member, bouncing }) => {
  return (
    <svg
      viewBox="0 0 120 105"
      className={`w-20 h-18 sm:w-24 sm:h-20 overflow-visible transition-transform duration-300 ${
        bouncing ? 'scale-x-115 scale-y-85 -translate-y-3' : 'group-hover:-translate-y-1.5'
      }`}
    >
      {/* 底部柔和阴影 */}
      <ellipse cx="60" cy="94" rx="36" ry="7" fill="rgba(0,0,0,0.38)" />

      {/* 双呆毛配件（渚 / 汐） */}
      {member.accessory === 'ahoge' && (
        <g stroke={member.bodyColor} strokeWidth="3.2" fill="none" strokeLinecap="round">
          <path d="M56 22 C46 5, 36 10, 42 22" />
          <path d="M63 22 C72 4, 84 10, 76 22" />
        </g>
      )}

      {/* 小皇冠/茶杯盖配件（长老团子） */}
      {member.accessory === 'crown' && (
        <path
          d="M46 23 L51 12 L60 19 L69 12 L74 23 Z"
          fill="#fbbf24"
          stroke="#fef08a"
          strokeWidth="1.5"
          strokeLinejoin="round"
        />
      )}

      {/* 团子圆润身体 */}
      <path
        d="M18 64 C18 34, 40 20, 60 20 C80 20, 102 34, 102 64 C102 84, 86 92, 60 92 C34 92, 18 84, 18 64 Z"
        fill={member.bodyColor}
      />
      {/* 顶部温润高光 */}
      <ellipse cx="45" cy="36" rx="18" ry="8" fill="rgba(255,255,255,0.42)" transform="rotate(-14 45 36)" />

      {/* 蝴蝶结配件 */}
      {member.accessory === 'ribbon' && (
        <g transform="translate(76, 24) rotate(18)">
          <path d="M0 0 L-10 -6 L-10 6 Z" fill="#f43f5e" />
          <path d="M0 0 L10 -6 L10 6 Z" fill="#f43f5e" />
          <circle cx="0" cy="0" r="3" fill="#fda4af" />
        </g>
      )}

      {/* 团子标志性两竖小眼睛 / 笑眼 / 慈祥眯眯眼 */}
      {member.eyeStyle === 'line' && (
        <g stroke="#292524" strokeWidth="3.2" strokeLinecap="round">
          <line x1="48" y1="49" x2="48" y2="61" />
          <line x1="72" y1="49" x2="72" y2="61" />
        </g>
      )}
      {member.eyeStyle === 'happy' && (
        <g stroke="#292524" strokeWidth="3" fill="none" strokeLinecap="round">
          <path d="M42 56 Q48 47 54 56" />
          <path d="M66 56 Q72 47 78 56" />
        </g>
      )}
      {member.eyeStyle === 'wink' && (
        <g stroke="#292524" strokeWidth="3" fill="none" strokeLinecap="round">
          <line x1="48" y1="49" x2="48" y2="61" />
          <path d="M66 55 Q72 48 78 55" />
        </g>
      )}
      {member.eyeStyle === 'elder' && (
        <g stroke="#292524" strokeWidth="2.8" fill="none" strokeLinecap="round">
          <path d="M41 54 Q48 59 54 54" />
          <path d="M66 54 Q72 59 79 54" />
        </g>
      )}

      {/* 腮红 */}
      <ellipse cx="36" cy="64" rx="6.5" ry="3.6" fill={member.cheekColor} opacity="0.52" />
      <ellipse cx="84" cy="64" rx="6.5" ry="3.6" fill={member.cheekColor} opacity="0.52" />
    </svg>
  );
};

export const ClannadSanctuary: React.FC<ClannadSanctuaryProps> = ({
  motionPaused,
  onPlayTrack,
  onVoiceDuckChange,
}) => {
  const [sceneIndex, setSceneIndex] = useState<number>(0);
  const [lightboxScene, setLightboxScene] = useState<ClannadGalleryScene | null>(null);
  const lightboxRef = useRef<HTMLDialogElement | null>(null);

  // 冈崎汐互动语音状态
  const [activeUshio, setActiveUshio] = useState<UshioPoseVoice>(USHIO_POSES_VOICES[0]);
  const [voicePlayingId, setVoicePlayingId] = useState<string | null>(null);
  const voiceAudioRef = useRef<HTMLAudioElement | null>(null);

  // 团子大家族八音盒互动状态
  const [bouncingDangoId, setBouncingDangoId] = useState<string | null>(null);
  const [dangoToast, setDangoToast] = useState<string>(
    '👆 点击下方任意团子奏响清脆八音盒音符，或一键合奏《团子大家族》主旋律 ♪'
  );
  const [autoPlayingMelody, setAutoPlayingMelody] = useState<boolean>(false);
  const noteCtxRef = useRef<AudioContext | null>(null);

  useEffect(() => {
    return attachDialogEnhancements(lightboxRef.current, () => setLightboxScene(null));
  }, []);

  const currentScene = CLANNAD_GALLERY_SCENES[sceneIndex];
  const linkedTrack =
    CLANNAD_TRACKS.find((t) => t.id === currentScene.linkedTrackId) ?? CLANNAD_TRACKS[0];

  const openSceneLightbox = (scene: ClannadGalleryScene) => {
    setLightboxScene(scene);
    requestAnimationFrame(() => {
      if (lightboxRef.current && !lightboxRef.current.open) {
        lightboxRef.current.showModal();
      }
    });
  };

  // 播放冈崎汐原版日语语音，并自动压低背景音乐音量
  const handlePlayUshioVoice = (item: UshioPoseVoice) => {
    setActiveUshio(item);
    const audio = voiceAudioRef.current;
    if (!audio) return;

    if (voicePlayingId === item.id && !audio.paused) {
      audio.pause();
      audio.currentTime = 0;
      setVoicePlayingId(null);
      onVoiceDuckChange(false);
      return;
    }

    audio.src = item.voiceSrc;
    audio.volume = 0.95;
    onVoiceDuckChange(true);
    setVoicePlayingId(item.id);
    void audio.play().catch(() => {
      setVoicePlayingId(null);
      onVoiceDuckChange(false);
    });
  };

  // WebAudio 合成八音盒清脆泛音
  const playMusicBoxNote = (freq: number) => {
    try {
      const AudioCtx =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (!noteCtxRef.current) {
        noteCtxRef.current = new AudioCtx();
      }
      const ctx = noteCtxRef.current;
      if (ctx.state === 'suspended') {
        void ctx.resume();
      }
      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const harmonic = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, now);

      harmonic.type = 'triangle';
      harmonic.frequency.setValueAtTime(freq * 2, now);

      const harmonicGain = ctx.createGain();
      harmonicGain.gain.setValueAtTime(0.12, now);

      gain.gain.setValueAtTime(0.001, now);
      gain.gain.exponentialRampToValueAtTime(0.24, now + 0.018);
      gain.gain.exponentialRampToValueAtTime(0.0008, now + 1.15);

      osc.connect(gain);
      harmonic.connect(harmonicGain);
      harmonicGain.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now);
      harmonic.start(now);
      osc.stop(now + 1.2);
      harmonic.stop(now + 1.2);
    } catch {
      // 忽略受限环境
    }
  };

  const handleTapDango = (member: DangoMember) => {
    playMusicBoxNote(member.noteFreq);
    setBouncingDangoId(member.id);
    setDangoToast(`🎵 [${member.noteName}] ${member.name}：${member.blessing}`);
    setTimeout(() => {
      setBouncingDangoId((prev) => (prev === member.id ? null : prev));
    }, 320);
  };

  // 自动弹奏《团子大家族》经典八音盒前奏：Mi - Re - Do - Re - Mi - Mi - Sol - Mi - Re
  const handlePlayDangoMelody = () => {
    if (autoPlayingMelody) return;
    setAutoPlayingMelody(true);
    setDangoToast('🎼 团子大家族正在为你合奏八音盒旋律：♪ だんご だんご だんご大家族 ♪');

    // 对应 DANGO_FAMILY_MEMBERS 索引 (0:Do, 1:Re, 2:Mi, 4:Sol, 5:La)
    const score: { idx: number; delayMs: number }[] = [
      { idx: 2, delayMs: 0 }, // Mi
      { idx: 1, delayMs: 360 }, // Re
      { idx: 0, delayMs: 720 }, // Do
      { idx: 1, delayMs: 1120 }, // Re
      { idx: 2, delayMs: 1480 }, // Mi
      { idx: 2, delayMs: 1840 }, // Mi
      { idx: 4, delayMs: 2300 }, // Sol
      { idx: 4, delayMs: 2680 }, // Sol
      { idx: 5, delayMs: 3060 }, // La
      { idx: 4, delayMs: 3520 }, // Sol
      { idx: 2, delayMs: 4000 }, // Mi
    ];

    score.forEach(({ idx, delayMs }, stepIdx) => {
      setTimeout(() => {
        const target = DANGO_FAMILY_MEMBERS[idx];
        playMusicBoxNote(target.noteFreq);
        setBouncingDangoId(target.id);
        setTimeout(() => {
          setBouncingDangoId((prev) => (prev === target.id ? null : prev));
        }, 280);
        if (stepIdx === score.length - 1) {
          setTimeout(() => setAutoPlayingMelody(false), 500);
        }
      }, delayMs);
    });
  };

  return (
    <section id="clannad" className="relative py-24 sm:py-32 overflow-hidden">
      {/* 樱花粉 × 幻想世界暖金光玉氛围光晕 */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute top-16 left-1/2 -translate-x-1/2 h-[540px] w-[960px] rounded-full opacity-35 blur-[145px]"
        style={{
          background:
            'radial-gradient(ellipse at center, rgba(244,114,182,0.32), rgba(251,191,36,0.22) 48%, rgba(56,189,248,0.14) 80%, transparent 100%)',
        }}
      />

      <audio
        ref={voiceAudioRef}
        onEnded={() => {
          setVoicePlayingId(null);
          onVoiceDuckChange(false);
        }}
      />

      <div className="relative z-10 mx-auto max-w-6xl px-4 sm:px-6">
        {/* 章节大标题区 */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div>
            <div className="clannad-pill-btn inline-flex items-center gap-2 rounded-full px-3.5 py-1 text-xs font-medium tracking-wide text-pink-100 mb-4">
              <SakuraBlossomIcon className="h-3.5 w-3.5" />
              <span>精神原乡 · 写作 CLANNAD，读作人生与家族</span>
            </div>
            <h2 className="font-clannad-serif text-3xl sm:text-5xl font-bold tracking-wider text-white">
              光坂坡道与星海光玉 ·{' '}
              <span className="text-antigravity-gradient">CLANNAD 永恒纪念馆</span>
            </h2>
            <p className="mt-4 max-w-2xl text-slate-300 text-base leading-relaxed">
              冰冷的代码之外，总有一片温暖心灵的樱花坡道与黄金向日葵花田。这里珍藏着{' '}
              <strong className="text-pink-200">冈崎朋也、古河渚、小冈崎汐与光坂大家族的全员大合照</strong>、
              <strong className="text-amber-200">4 首原动画全长原声曲目在线点播</strong>，以及{' '}
              <strong className="text-white">团子大家族与小汐原声陪伴舱</strong>。
            </p>
          </div>

          {/* 一键在线播放全长原声带按钮组 */}
          <div className="flex flex-wrap items-center gap-2.5 shrink-0">
            <button
              type="button"
              onClick={() => onPlayTrack('dango-family')}
              className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-pink-400 via-rose-400 to-amber-300 px-5 py-3 text-xs sm:text-sm font-extrabold text-slate-950 shadow-[0_0_30px_rgba(244,114,182,0.45)] hover:brightness-110 cursor-pointer transition-all"
            >
              <Play className="h-4 w-4 fill-slate-950" />
              <span>在线播放《团子大家族》原曲</span>
            </button>
            <button
              type="button"
              onClick={() => onPlayTrack('ushio-pocket')}
              className="inline-flex items-center gap-2 rounded-full border border-amber-400/40 bg-amber-500/12 px-4 py-3 text-xs sm:text-sm font-bold text-amber-200 hover:bg-amber-500/22 cursor-pointer transition-colors"
            >
              <Music className="h-4 w-4 text-amber-300" />
              <span>切换《小小的手心》</span>
            </button>
          </div>
        </div>

        {/* 第一部分：全员奇迹大合照 & 六大封神名场面电影院画廊 */}
        <div className="clannad-crystal-panel rounded-3xl p-4 sm:p-7 mb-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
            {/* 左侧 8 列：16:9 宽幕高清画框 */}
            <div className="lg:col-span-8 flex flex-col justify-between gap-4">
              <div className="group relative rounded-2xl border border-white/15 bg-black overflow-hidden aspect-[16/9] shadow-2xl">
                <img
                  key={currentScene.id}
                  src={currentScene.imageSrc}
                  alt={currentScene.title}
                  className={`h-full w-full object-cover transition-transform duration-[9000ms] ease-out ${
                    motionPaused ? '' : 'scale-[1.03] group-hover:scale-[1.08]'
                  }`}
                />
                {/* 柔和底部渐变字幕遮罩 */}
                <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-[#05070f] via-[#05070f]/70 to-transparent p-4 sm:p-6 flex flex-col sm:flex-row sm:items-end justify-between gap-3">
                  <div>
                    <span
                      style={{
                        borderColor: `${currentScene.accent}66`,
                        backgroundColor: `${currentScene.accent}24`,
                      }}
                      className="inline-block rounded-full border px-3 py-0.5 text-[11px] font-bold text-white backdrop-blur-md"
                    >
                      {currentScene.badge}
                    </span>
                    <h3 className="mt-1.5 text-lg sm:text-2xl font-extrabold text-white drop-shadow">
                      {currentScene.title}
                    </h3>
                    <p className="mt-0.5 text-xs sm:text-sm text-pink-100/95 italic">
                      {currentScene.quote}
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={() => openSceneLightbox(currentScene)}
                    className="shrink-0 inline-flex items-center gap-1.5 rounded-xl bg-white/15 hover:bg-white/25 border border-white/20 backdrop-blur-md px-3.5 py-2 text-xs font-bold text-white cursor-pointer"
                  >
                    <Maximize2 className="h-3.5 w-3.5" />
                    <span>全屏赏析原画</span>
                  </button>
                </div>
              </div>

              {/* 6 张名场面缩略胶片切换栏 */}
              <div className="grid grid-cols-3 sm:grid-cols-6 gap-2.5">
                {CLANNAD_GALLERY_SCENES.map((scene, idx) => {
                  const active = idx === sceneIndex;
                  return (
                    <button
                      key={scene.id}
                      type="button"
                      onClick={() => setSceneIndex(idx)}
                      className={`group relative rounded-xl overflow-hidden border aspect-[16/10] cursor-pointer transition-all ${
                        active
                          ? 'border-pink-400 ring-2 ring-pink-400/45 scale-[1.03]'
                          : 'border-slate-800 opacity-65 hover:opacity-100'
                      }`}
                    >
                      <img
                        src={scene.imageSrc}
                        alt={scene.title}
                        className="h-full w-full object-cover"
                      />
                      <span className="absolute inset-x-0 bottom-0 bg-black/70 px-1.5 py-0.5 text-[10px] font-semibold text-white truncate">
                        {scene.title.split('·')[1]?.trim() ?? scene.title}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* 右侧 4 列：本幕剧本对白 & 专属原曲一键联动点播 */}
            <div className="clannad-silk-subcard lg:col-span-4 rounded-2xl p-5 flex flex-col justify-between gap-4">
              <div>
                <div className="text-[11px] font-mono text-pink-300 mb-1">
                  {currentScene.episodeTag}
                </div>
                <h4 className="text-base font-bold text-white">名场面记忆手札</h4>
                <p className="mt-2 text-xs sm:text-sm text-slate-300 leading-relaxed">
                  {currentScene.story}
                </p>

                <div className="mt-4 pt-4 border-t border-slate-800/90 space-y-2.5">
                  {currentScene.dialogues.map((dlg, i) => (
                    <div
                      key={i}
                      className="rounded-xl border border-slate-800/80 bg-slate-900/75 p-3 text-xs"
                    >
                      <span
                        style={{ color: currentScene.accent }}
                        className="font-bold block mb-0.5"
                      >
                        {dlg.speaker}
                      </span>
                      <span className="text-slate-200 leading-relaxed">{dlg.line}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* 场景推荐配乐一键播放 + 四曲快速切换条 */}
              <div className="pt-3 border-t border-slate-800/90 space-y-2.5">
                <button
                  type="button"
                  onClick={() => onPlayTrack(currentScene.linkedTrackId)}
                  style={{
                    borderColor: `${currentScene.accent}66`,
                    backgroundColor: `${currentScene.accent}22`,
                  }}
                  className="w-full rounded-xl border px-4 py-2.5 text-xs font-bold text-white flex items-center justify-between hover:brightness-125 cursor-pointer transition-all"
                >
                  <span className="flex items-center gap-2 truncate">
                    <Music className="h-4 w-4 shrink-0 text-pink-300" />
                    <span className="truncate">奏响本幕配乐：《{linkedTrack.title}》</span>
                  </span>
                  <Play className="h-3.5 w-3.5 shrink-0" />
                </button>

                <div className="grid grid-cols-2 gap-1.5">
                  {CLANNAD_TRACKS.map((trk) => (
                    <button
                      key={trk.id}
                      type="button"
                      onClick={() => onPlayTrack(trk.id)}
                      className="rounded-lg border border-slate-800 bg-slate-900/90 px-2.5 py-1.5 text-[11px] text-slate-300 hover:border-pink-400/50 hover:text-white truncate text-left cursor-pointer"
                    >
                      ♪ {trk.title}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 第二部分：男主朋也 · 女主渚 · 冈崎汐 · 光坂伙伴 人物羁绊卡片墙 */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
          {CLANNAD_CHARACTERS.map((char) => (
            <div
              key={char.id}
              className="clannad-crystal-panel group rounded-2xl p-5 hover:border-pink-200/55 transition-all flex flex-col justify-between gap-4"
            >
              <div>
                <div className="flex items-center gap-3 mb-3.5">
                  <img
                    src={char.avatarSrc}
                    alt={char.name}
                    className="h-12 w-12 rounded-2xl object-cover border border-white/20 shadow-md"
                  />
                  <div className="min-w-0">
                    <h3 className="text-base font-extrabold text-white flex items-center gap-1.5">
                      <span>{char.name}</span>
                    </h3>
                    <div
                      style={{ color: char.accent }}
                      className="text-[11px] font-semibold truncate"
                    >
                      {char.roleBadge}
                    </div>
                  </div>
                </div>

                <p className="text-xs text-slate-300 leading-relaxed">{char.bio}</p>
              </div>

              <div className="pt-3 border-t border-slate-800/80 space-y-1.5">
                <div className="text-[11px] italic text-pink-100/90">{char.quote}</div>
                <div className="text-[11px] font-mono text-slate-400 flex items-center gap-1">
                  <Users className="h-3 w-3 text-pink-400" />
                  <span>{char.keepsake}</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* 第三部分：左「冈崎汐 6 姿态原声陪伴舱」 + 右「Q弹团子大家族八音盒互动乐园」 */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
          {/* 冈崎汐 6 姿态零白边立绘与原生语音点播舱 */}
          <div className="clannad-crystal-panel lg:col-span-6 rounded-3xl p-6 flex flex-col justify-between gap-5">
            <div className="flex items-center justify-between gap-2">
              <div>
                <span className="text-[11px] font-semibold text-amber-300 flex items-center gap-1.5">
                  <Sparkles className="h-3.5 w-3.5" />
                  <span>6 态零白边原画 · 原版日语催泪语音实录</span>
                </span>
                <h3 className="text-xl font-extrabold text-white mt-0.5">
                  冈崎汐 · 向日葵与团子陪伴舱
                </h3>
              </div>
              <span className="rounded-full bg-amber-400/15 border border-amber-400/30 px-2.5 py-1 text-[10px] font-semibold text-amber-200">
                点击立绘或按钮即播原声
              </span>
            </div>

            {/* 小汐立绘舞台 + 台词气泡 */}
            <div className="clannad-silk-subcard rounded-2xl p-4 flex flex-col sm:flex-row items-center gap-4">
              <button
                type="button"
                onClick={() => handlePlayUshioVoice(activeUshio)}
                className="relative h-36 w-36 shrink-0 flex items-center justify-center rounded-2xl bg-gradient-to-b from-amber-500/10 to-pink-500/10 border border-white/10 cursor-pointer group"
                title="点击小汐播放原版语音"
              >
                <img
                  src={activeUshio.spriteSrc}
                  alt={activeUshio.poseTitle}
                  className="max-h-32 w-auto object-contain drop-shadow-[0_10px_20px_rgba(251,191,36,0.28)] transition-transform duration-300 group-hover:scale-108"
                />
                {voicePlayingId === activeUshio.id && (
                  <span className="absolute top-2 right-2 flex h-3 w-3">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75" />
                    <span className="relative inline-flex rounded-full h-3 w-3 bg-amber-300" />
                  </span>
                )}
              </button>

              <div className="flex-1 text-center sm:text-left">
                <div className="inline-flex items-center gap-1.5 rounded-full bg-white/8 px-2.5 py-0.5 text-[11px] font-semibold text-amber-200 mb-2">
                  <Volume2 className="h-3 w-3 text-amber-300" />
                  <span>{activeUshio.poseTitle}</span>
                </div>
                <p className="text-sm font-bold text-white leading-relaxed">
                  {activeUshio.quoteZh}
                </p>
                <p className="mt-1 text-xs text-slate-400">{activeUshio.quoteJp}</p>
              </div>
            </div>

            {/* 6 枚动作与原声切换胶囊 */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {USHIO_POSES_VOICES.map((uv) => {
                const isSelected = activeUshio.id === uv.id;
                const isSpeaking = voicePlayingId === uv.id;
                return (
                  <button
                    key={uv.id}
                    type="button"
                    onClick={() => handlePlayUshioVoice(uv)}
                    className={`rounded-xl border px-3 py-2 text-xs font-semibold text-left transition-all cursor-pointer flex items-center justify-between gap-1 ${
                      isSelected
                        ? 'border-amber-400/60 bg-amber-400/15 text-amber-100 shadow-[0_0_16px_rgba(251,191,36,0.2)]'
                        : 'border-slate-800 bg-slate-900/75 text-slate-300 hover:border-slate-700 hover:text-white'
                    }`}
                  >
                    <span className="truncate">{uv.label}</span>
                    {isSpeaking && <Volume2 className="h-3.5 w-3.5 text-amber-300 shrink-0 animate-pulse" />}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Q 弹物理团子大家族八音盒叠叠乐乐园 */}
          <div className="clannad-crystal-panel lg:col-span-6 rounded-3xl p-6 flex flex-col justify-between gap-5">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <span className="text-[11px] font-semibold text-pink-300 flex items-center gap-1.5">
                  <Music className="h-3.5 w-3.5" />
                  <span>WebAudio 晶莹八音盒合成器 · Q 弹果冻物理</span>
                </span>
                <h3 className="text-xl font-extrabold text-white mt-0.5">
                  团子大家族 · 手牵手八音盒琴键
                </h3>
              </div>

              <button
                type="button"
                onClick={handlePlayDangoMelody}
                disabled={autoPlayingMelody}
                className="rounded-full bg-pink-500/20 border border-pink-400/45 px-3.5 py-1.5 text-xs font-bold text-pink-100 hover:bg-pink-500/30 disabled:opacity-50 cursor-pointer transition-colors"
              >
                {autoPlayingMelody ? '🎵 团子合奏中…' : '🎼 自动合奏《团子歌》旋律'}
              </button>
            </div>

            {/* 6 只矢量团子琴键舞台 */}
            <div className="clannad-silk-subcard rounded-2xl px-3 py-6 grid grid-cols-3 sm:grid-cols-6 gap-2 place-items-center">
              {DANGO_FAMILY_MEMBERS.map((member) => (
                <button
                  key={member.id}
                  type="button"
                  onClick={() => handleTapDango(member)}
                  className="group flex flex-col items-center focus:outline-none cursor-pointer"
                >
                  <DangoSvg member={member} bouncing={bouncingDangoId === member.id} />
                  <span className="mt-1 text-[11px] font-bold text-slate-200 group-hover:text-pink-200 whitespace-nowrap">
                    {member.name.split('·')[0]}
                  </span>
                  <span className="font-mono text-[10px] text-slate-400">{member.noteName}</span>
                </button>
              ))}
            </div>

            {/* 底部祝福回显条 */}
            <div className="rounded-xl border border-pink-400/20 bg-pink-500/8 px-4 py-3 text-xs text-pink-100 flex items-center justify-between gap-3">
              <span>{dangoToast}</span>
              <button
                type="button"
                onClick={() => onPlayTrack('dango-family')}
                className="shrink-0 font-bold text-amber-300 hover:underline cursor-pointer"
              >
                播放茶太原唱 →
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* 原生 Top-Layer 全屏高清原画赏析灯箱 */}
      <dialog
        ref={lightboxRef}
        {...({ closedby: 'any' } as React.DialogHTMLAttributes<HTMLDialogElement>)}
        aria-label="CLANNAD 名场面全屏原画预览"
        className="cyber-dialog w-full"
      >
        {lightboxScene && (
          <div className="rounded-2xl border border-pink-400/35 bg-[#070a14]/96 p-4 sm:p-6 shadow-2xl backdrop-blur-2xl">
            <div className="flex items-center justify-between gap-4 pb-3 border-b border-slate-800">
              <div>
                <span className="text-[11px] font-mono text-pink-300">
                  {lightboxScene.episodeTag}
                </span>
                <h3 className="text-base sm:text-lg font-extrabold text-white">
                  {lightboxScene.title}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => void closeDialogSmoothly(lightboxRef.current)}
                aria-label="关闭原画预览"
                className="rounded-full border border-slate-700 bg-slate-900 p-1.5 text-slate-300 hover:text-white cursor-pointer"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="mt-4 overflow-hidden rounded-xl border border-slate-800 bg-black">
              <img
                src={lightboxScene.imageSrc}
                alt={lightboxScene.title}
                className="max-h-[72vh] w-full object-contain"
              />
            </div>

            <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
              <p className="text-xs sm:text-sm text-pink-100 italic max-w-2xl">
                {lightboxScene.quote}
              </p>
              <button
                type="button"
                onClick={() => {
                  onPlayTrack(lightboxScene.linkedTrackId);
                  void closeDialogSmoothly(lightboxRef.current);
                }}
                className="inline-flex items-center gap-1.5 rounded-full bg-gradient-to-r from-pink-400 to-amber-300 px-4 py-2 text-xs font-extrabold text-slate-950 cursor-pointer"
              >
                <Music className="h-3.5 w-3.5" />
                <span>边听本幕原声边浏览</span>
              </button>
            </div>
          </div>
        )}
      </dialog>
    </section>
  );
};
