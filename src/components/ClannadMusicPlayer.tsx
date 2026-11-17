import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  ChevronDown,
  ChevronUp,
  Disc3,
  ListMusic,
  Music,
  Pause,
  Play,
  Repeat,
  SkipBack,
  SkipForward,
  Volume2,
  VolumeX,
} from 'lucide-react';
import { CLANNAD_TRACKS, ClannadTrackId } from '../data/clannadData';
import { HikariOrbIcon, SakuraBlossomIcon } from './ClannadMotifs';

interface ClannadMusicPlayerProps {
  /** 外部（如名场面画廊或首屏按钮）请求切换并播放某首 CLANNAD 曲目 */
  requestedTrack: { id: ClannadTrackId; nonce: number } | null;
  /** 当冈崎汐原声台词播放时自动闪避（压低）BGM 音量 */
  voiceDucking: boolean;
}

function formatTime(sec: number): string {
  if (!Number.isFinite(sec) || sec < 0) return '00:00';
  const m = Math.floor(sec / 60);
  const s = Math.floor(sec % 60);
  return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
}

export const ClannadMusicPlayer: React.FC<ClannadMusicPlayerProps> = ({
  requestedTrack,
  voiceDucking,
}) => {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const audioCtxRef = useRef<AudioContext | null>(null);
  const rafRef = useRef<number>(0);

  const [trackIndex, setTrackIndex] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [expanded, setExpanded] = useState<boolean>(false);
  const [showPlaylist, setShowPlaylist] = useState<boolean>(false);
  const [loopOne, setLoopOne] = useState<boolean>(false);
  const [volume, setVolume] = useState<number>(0.68);
  const [muted, setMuted] = useState<boolean>(false);
  const [currentTime, setCurrentTime] = useState<number>(0);
  const [duration, setDuration] = useState<number>(0);
  const [bars, setBars] = useState<number[]>(() => Array(18).fill(18));

  const currentTrack = CLANNAD_TRACKS[trackIndex];

  // 初始化 WebAudio 频谱分析器（首次用户点击播放时挂载）
  const ensureAudioAnalyser = useCallback(() => {
    const audioEl = audioRef.current;
    if (!audioEl || analyserRef.current) return;
    try {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      const ctx = new AudioCtx();
      const source = ctx.createMediaElementSource(audioEl);
      const analyser = ctx.createAnalyser();
      analyser.fftSize = 64;
      analyser.smoothingTimeConstant = 0.8;
      source.connect(analyser);
      analyser.connect(ctx.destination);
      audioCtxRef.current = ctx;
      analyserRef.current = analyser;
    } catch {
      // 降级为节奏拟真动画，不影响音频原生播放
    }
  }, []);

  // 驱动频谱跳动光柱
  useEffect(() => {
    if (!isPlaying) {
      window.cancelAnimationFrame(rafRef.current);
      setBars((prev) => prev.map(() => 14));
      return;
    }

    const freqData = new Uint8Array(32);
    const updateSpectrum = (ts: number) => {
      const analyser = analyserRef.current;
      if (analyser) {
        analyser.getByteFrequencyData(freqData);
        const nextBars = Array.from({ length: 18 }, (_, idx) => {
          const val = freqData[idx + 1] ?? 0;
          return Math.max(12, Math.min(100, Math.round((val / 255) * 100)));
        });
        setBars(nextBars);
      } else {
        const fallbackBars = Array.from({ length: 18 }, (_, idx) =>
          Math.round(25 + 45 * Math.abs(Math.sin(ts * 0.004 + idx * 0.55)))
        );
        setBars(fallbackBars);
      }
      rafRef.current = window.requestAnimationFrame(updateSpectrum);
    };

    rafRef.current = window.requestAnimationFrame(updateSpectrum);
    return () => window.cancelAnimationFrame(rafRef.current);
  }, [isPlaying]);

  // 同步音量与智能语音闪避（Ducking）
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    const effectiveVol = muted ? 0 : voiceDucking ? volume * 0.22 : volume;
    audio.volume = Math.max(0, Math.min(1, effectiveVol));
  }, [volume, muted, voiceDucking]);

  // 响应外部组件点歌请求
  useEffect(() => {
    if (!requestedTrack) return;
    const targetIdx = CLANNAD_TRACKS.findIndex((t) => t.id === requestedTrack.id);
    if (targetIdx === -1) return;

    setTrackIndex(targetIdx);
    setExpanded(true);

    requestAnimationFrame(() => {
      const audio = audioRef.current;
      if (!audio) return;
      ensureAudioAnalyser();
      if (audioCtxRef.current?.state === 'suspended') {
        void audioCtxRef.current.resume();
      }
      audio.currentTime = 0;
      void audio
        .play()
        .then(() => setIsPlaying(true))
        .catch(() => setIsPlaying(false));
    });
  }, [requestedTrack, ensureAudioAnalyser]);

  const togglePlay = async () => {
    const audio = audioRef.current;
    if (!audio) return;
    ensureAudioAnalyser();
    if (audioCtxRef.current?.state === 'suspended') {
      await audioCtxRef.current.resume();
    }

    if (audio.paused) {
      try {
        await audio.play();
        setIsPlaying(true);
      } catch {
        setIsPlaying(false);
      }
    } else {
      audio.pause();
      setIsPlaying(false);
    }
  };

  const switchTrack = (nextIdx: number, autoPlay = true) => {
    const normalized = (nextIdx + CLANNAD_TRACKS.length) % CLANNAD_TRACKS.length;
    setTrackIndex(normalized);
    setCurrentTime(0);
    if (autoPlay || isPlaying) {
      requestAnimationFrame(() => {
        const audio = audioRef.current;
        if (!audio) return;
        ensureAudioAnalyser();
        if (audioCtxRef.current?.state === 'suspended') {
          void audioCtxRef.current.resume();
        }
        void audio
          .play()
          .then(() => setIsPlaying(true))
          .catch(() => setIsPlaying(false));
      });
    }
  };

  // 二分/线性匹配当前滚动双语歌词行
  const activeLyric = useMemo(() => {
    const list = currentTrack.lyrics;
    let matched = list[0];
    for (let i = 0; i < list.length; i++) {
      if (currentTime >= list[i].time) {
        matched = list[i];
      } else {
        break;
      }
    }
    return matched;
  }, [currentTrack, currentTime]);

  return (
    <aside
      aria-label="CLANNAD 原声背景音乐在线播放器"
      className="fixed bottom-4 right-4 z-50 max-w-[calc(100vw-2rem)]"
    >
      <audio
        ref={audioRef}
        src={currentTrack.src}
        preload="metadata"
        loop={loopOne}
        onTimeUpdate={(e) => setCurrentTime(e.currentTarget.currentTime)}
        onLoadedMetadata={(e) => setDuration(e.currentTarget.duration)}
        onEnded={() => {
          if (!loopOne) {
            switchTrack(trackIndex + 1, true);
          }
        }}
      />

      {/* 收起态：高定暮樱琉璃 × 旋转团子唱片灵动岛 */}
      {!expanded ? (
        <div
          style={{
            boxShadow: isPlaying
              ? `0 18px 44px -8px rgba(10,8,24,0.75), 0 0 28px ${currentTrack.accent}45`
              : '0 16px 40px -10px rgba(10,8,24,0.68)',
          }}
          className="flex items-center gap-2.5 rounded-full border border-pink-200/35 bg-[#1c162f]/82 p-1.5 pr-3.5 backdrop-blur-2xl transition-all"
        >
          {/* 团子唱片芯播放键 */}
          <button
            type="button"
            onClick={() => void togglePlay()}
            aria-label={isPlaying ? '暂停 CLANNAD 背景音乐' : '播放 CLANNAD 背景音乐'}
            className="relative h-10 w-10 rounded-full flex items-center justify-center shrink-0 cursor-pointer group"
            style={{
              background: `radial-gradient(circle at 35% 35%, ${currentTrack.dangoColor}, ${currentTrack.accent})`,
            }}
          >
            <div
              className={`h-full w-full rounded-full border-2 border-white/40 flex items-center justify-center ${
                isPlaying ? 'animate-[spin_9s_linear_infinite]' : ''
              }`}
            >
              {/* 可爱团子两竖小眼睛 */}
              <div className="flex items-center gap-1.5 -mt-0.5">
                <span className="h-2 w-0.5 rounded-full bg-slate-900/80" />
                <span className="h-2 w-0.5 rounded-full bg-slate-900/80" />
              </div>
            </div>
            <span className="absolute inset-0 rounded-full bg-black/45 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white">
              {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4 ml-0.5" />}
            </span>
          </button>

          {/* 曲目与微缩歌词跑马提示 */}
          <button
            type="button"
            onClick={() => setExpanded(true)}
            className="text-left min-w-0 max-w-[195px] sm:max-w-[240px] cursor-pointer"
          >
            <div className="flex items-center gap-1.5">
              <SakuraBlossomIcon className="h-3.5 w-3.5 shrink-0" />
              <span className="text-xs font-semibold tracking-wide text-white truncate">
                {isPlaying ? currentTrack.title : `原声八音盒 · ${currentTrack.title}`}
              </span>
            </div>
            <div className="text-[10px] text-pink-100/80 truncate">
              {isPlaying ? activeLyric.zh : '4 首 CLANNAD 全长原曲可切换 · 点击展开'}
            </div>
          </button>

          {/* 快捷切歌与展开 */}
          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={() => switchTrack(trackIndex + 1, true)}
              title="切换下一首 CLANNAD 原曲"
              aria-label="下一首"
              className="rounded-full p-1.5 text-slate-300 hover:bg-white/10 hover:text-white cursor-pointer"
            >
              <SkipForward className="h-3.5 w-3.5" />
            </button>
            <button
              type="button"
              onClick={() => setExpanded(true)}
              title="展开完整星海黑胶八音盒"
              aria-label="展开音乐播放器"
              className="rounded-full p-1.5 text-pink-300 hover:bg-white/10 cursor-pointer"
            >
              <ChevronUp className="h-4 w-4" />
            </button>
          </div>
        </div>
      ) : (
        /* 展开态：高定暮樱琉璃 × 星海八音盒黑胶唱机 */
        <div
          style={{
            boxShadow: `0 28px 80px -15px rgba(10,8,24,0.85), 0 0 42px ${currentTrack.accent}33`,
          }}
          className="w-[340px] sm:w-[385px] rounded-3xl border border-pink-200/35 bg-[#1b152d]/86 p-4 backdrop-blur-2xl text-pink-50"
        >
          {/* 顶部栏 */}
          <div className="flex items-center justify-between gap-2 pb-3 border-b border-pink-200/20">
            <div className="flex items-center gap-2 text-xs font-semibold tracking-wide text-pink-100">
              <HikariOrbIcon className="h-4 w-4" />
              <span className="font-clannad-serif">CLANNAD · 星海八音盒唱机</span>
            </div>
            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={() => setShowPlaylist((v) => !v)}
                className={`rounded-lg px-2 py-1 text-[11px] flex items-center gap-1 cursor-pointer ${
                  showPlaylist
                    ? 'bg-pink-500/25 text-pink-200 border border-pink-400/40'
                    : 'text-slate-300 hover:bg-white/10'
                }`}
              >
                <ListMusic className="h-3.5 w-3.5" />
                <span>曲库(4)</span>
              </button>
              <button
                type="button"
                onClick={() => setExpanded(false)}
                aria-label="最小化音乐播放器"
                className="rounded-lg p-1 text-slate-400 hover:bg-white/10 hover:text-white cursor-pointer"
              >
                <ChevronDown className="h-4 w-4" />
              </button>
            </div>
          </div>

          {/* 黑胶唱片 + 曲目详情 */}
          <div className="mt-3.5 flex items-center gap-3.5">
            <div className="relative h-16 w-16 shrink-0">
              <div
                className={`h-full w-full rounded-full border-2 border-slate-700 bg-gradient-to-br from-slate-900 via-slate-950 to-slate-800 p-1.5 shadow-inner ${
                  isPlaying ? 'animate-[spin_10s_linear_infinite]' : ''
                }`}
              >
                <img
                  src={currentTrack.coverSrc}
                  alt={currentTrack.title}
                  className="h-full w-full rounded-full object-cover border border-white/25"
                />
              </div>
              <span
                style={{ backgroundColor: currentTrack.accent }}
                className="absolute -bottom-0.5 -right-0.5 h-5 w-5 rounded-full border-2 border-[#080c18] flex items-center justify-center"
              >
                <Disc3 className="h-3 w-3 text-slate-950" />
              </span>
            </div>

            <div className="min-w-0 flex-1">
              <span
                style={{
                  borderColor: `${currentTrack.accent}55`,
                  backgroundColor: `${currentTrack.accent}1f`,
                  color: currentTrack.dangoColor,
                }}
                className="inline-block rounded-full border px-2 py-0.5 text-[10px] font-semibold"
              >
                {currentTrack.moodTag}
              </span>
              <h3 className="mt-1 text-sm font-extrabold text-white truncate">
                {currentTrack.title}
              </h3>
              <p className="text-[11px] text-slate-400 truncate">{currentTrack.jpTitle}</p>
            </div>
          </div>

          {/* 实时频谱光柱 */}
          <div
            aria-hidden="true"
            className="clannad-silk-subcard mt-3 flex h-7 items-end justify-between gap-1 rounded-xl px-3 py-1.5"
          >
            {bars.map((heightPct, idx) => (
              <span
                key={idx}
                style={{
                  height: `${heightPct}%`,
                  background: `linear-gradient(to top, ${currentTrack.accent}, ${currentTrack.dangoColor})`,
                }}
                className="w-1.5 rounded-full transition-[height] duration-75"
              />
            ))}
          </div>

          {/* 双语动态同步歌词舱 */}
          <div className="clannad-silk-subcard mt-2.5 rounded-xl px-3 py-2 text-center">
            {activeLyric.jp && (
              <div className="text-[10px] text-slate-400 truncate">{activeLyric.jp}</div>
            )}
            <div className="text-xs font-semibold text-pink-100 mt-0.5 leading-snug">
              {activeLyric.zh}
            </div>
          </div>

          {/* 进度条 */}
          <div className="mt-3">
            <input
              type="range"
              min={0}
              max={duration || 100}
              step={0.5}
              value={Math.min(currentTime, duration || 100)}
              onChange={(e) => {
                const next = Number(e.target.value);
                setCurrentTime(next);
                if (audioRef.current) {
                  audioRef.current.currentTime = next;
                }
              }}
              aria-label="音乐播放进度"
              className="w-full h-1.5 accent-pink-400 cursor-pointer"
            />
            <div className="flex justify-between font-mono text-[10px] text-slate-400 mt-0.5">
              <span>{formatTime(currentTime)}</span>
              <span>{duration ? formatTime(duration) : currentTrack.durationHint}</span>
            </div>
          </div>

          {/* 播放主控与音量控制 */}
          <div className="mt-2 flex items-center justify-between gap-2">
            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={() => setLoopOne((v) => !v)}
                title={loopOne ? '当前：单曲循环' : '当前：四曲列表循环'}
                className={`rounded-full p-2 text-xs cursor-pointer ${
                  loopOne ? 'bg-pink-500/20 text-pink-300' : 'text-slate-400 hover:text-white'
                }`}
              >
                <Repeat className="h-3.5 w-3.5" />
              </button>
              <button
                type="button"
                onClick={() => switchTrack(trackIndex - 1, true)}
                aria-label="上一曲"
                className="rounded-full p-2 text-slate-200 hover:bg-white/10 cursor-pointer"
              >
                <SkipBack className="h-4 w-4" />
              </button>
              <button
                type="button"
                onClick={() => void togglePlay()}
                aria-label={isPlaying ? '暂停' : '播放'}
                style={{ backgroundColor: currentTrack.accent }}
                className="h-10 w-10 rounded-full flex items-center justify-center text-slate-950 shadow-lg hover:brightness-110 cursor-pointer"
              >
                {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4 ml-0.5" />}
              </button>
              <button
                type="button"
                onClick={() => switchTrack(trackIndex + 1, true)}
                aria-label="下一曲"
                className="rounded-full p-2 text-slate-200 hover:bg-white/10 cursor-pointer"
              >
                <SkipForward className="h-4 w-4" />
              </button>
            </div>

            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={() => setMuted((m) => !m)}
                aria-label={muted ? '取消静音' : '静音'}
                className="text-slate-300 hover:text-white cursor-pointer"
              >
                {muted || volume === 0 ? (
                  <VolumeX className="h-4 w-4 text-rose-400" />
                ) : (
                  <Volume2 className="h-4 w-4 text-pink-300" />
                )}
              </button>
              <input
                type="range"
                min={0}
                max={1}
                step={0.02}
                value={muted ? 0 : volume}
                onChange={(e) => {
                  setMuted(false);
                  setVolume(Number(e.target.value));
                }}
                aria-label="音乐音量"
                className="w-16 accent-pink-400 cursor-pointer"
              />
            </div>
          </div>

          {/* 可折叠 4 首原曲切换清单 */}
          {showPlaylist && (
            <div className="mt-3 pt-3 border-t border-slate-800 space-y-1.5">
              {CLANNAD_TRACKS.map((track, idx) => {
                const active = idx === trackIndex;
                return (
                  <button
                    key={track.id}
                    type="button"
                    onClick={() => switchTrack(idx, true)}
                    className={`w-full text-left rounded-xl px-3 py-2 flex items-center justify-between gap-2 text-xs transition-colors cursor-pointer ${
                      active
                        ? 'bg-pink-500/20 border border-pink-400/40 text-white'
                        : 'bg-slate-900/60 border border-transparent text-slate-300 hover:bg-slate-900'
                    }`}
                  >
                    <div className="flex items-center gap-2 min-w-0">
                      <Music
                        className="h-3.5 w-3.5 shrink-0"
                        style={{ color: track.accent }}
                      />
                      <div className="truncate">
                        <span className="font-bold">{track.title}</span>
                        <span className="ml-1.5 text-[10px] text-slate-400">{track.moodTag}</span>
                      </div>
                    </div>
                    <span className="font-mono text-[10px] text-slate-400 shrink-0">
                      {track.durationHint}
                    </span>
                  </button>
                );
              })}
            </div>
          )}
        </div>
      )}
    </aside>
  );
};
