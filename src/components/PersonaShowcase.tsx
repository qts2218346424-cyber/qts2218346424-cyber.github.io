import React, { useEffect, useRef, useState } from 'react';
import {
  ArrowUpRight,
  BookOpen,
  Download,
  ExternalLink,
  Github,
  Heart,
  Maximize2,
  MessageSquareHeart,
  Play,
  RefreshCw,
  ShieldCheck,
  Smartphone,
  Sparkles,
  Volume2,
  X,
} from 'lucide-react';
import { AUTHOR_PROFILE } from '../data/siteData';
import {
  PERSONA_COMPANIONS,
  PERSONA_SCREENSHOTS,
  PERSONA_WORLD_SCRIPTS,
  PersonaCompanionSpec,
  PersonaScreenshotItem,
  PersonaScriptSpec,
} from '../data/personaAndQuantData';
import { attachDialogEnhancements, closeDialogSmoothly } from '../utils/dialogHelper';
import {
  DangoCharmIcon,
  HikariOrbIcon,
  SakuraBlossomIcon,
  SakuraCornerFiligree,
  StarfishCharmIcon,
} from './ClannadMotifs';

type PersonaTab = 'theater' | 'companions' | 'gallery';

export const PersonaShowcase: React.FC = () => {
  const [activeTab, setActiveTab] = useState<PersonaTab>('theater');

  // Tab 1: 互动剧场状态
  const [scriptIdx, setScriptIdx] = useState<number>(0);
  const [selectedChoiceId, setSelectedChoiceId] = useState<string | null>(null);
  const [heartScore, setHeartScore] = useState<number>(68);
  const [trustScore, setTrustScore] = useState<number>(72);

  // Tab 2: 2.5D 全息伴侣状态
  const [activeCompanion, setActiveCompanion] = useState<PersonaCompanionSpec>(
    PERSONA_COMPANIONS[0]
  );
  const [poking, setPoking] = useState<boolean>(false);
  const [pokeCount, setPokeCount] = useState<number>(0);

  // Tab 3: 线上实机画廊与灯箱
  const [shotIdx, setShotIdx] = useState<number>(0);
  const [lightboxShot, setLightboxShot] = useState<PersonaScreenshotItem | null>(null);
  const lightboxRef = useRef<HTMLDialogElement | null>(null);

  // 3D 视差舞台
  const stageRef = useRef<HTMLDivElement | null>(null);
  const [tilt, setTilt] = useState({ rx: 0, ry: 0, gx: 50, gy: 50 });

  useEffect(() => {
    return attachDialogEnhancements(lightboxRef.current, () => setLightboxShot(null));
  }, []);

  const currentScript: PersonaScriptSpec = PERSONA_WORLD_SCRIPTS[scriptIdx];
  const activeChoice = currentScript.choices.find((c) => c.id === selectedChoiceId) ?? null;
  const currentShot = PERSONA_SCREENSHOTS[shotIdx];

  const handleSelectScript = (idx: number) => {
    setScriptIdx(idx);
    setSelectedChoiceId(null);
    setHeartScore(68 + idx * 3);
    setTrustScore(72 + idx * 2);
  };

  const handleChooseBranch = (choice: PersonaScriptSpec['choices'][number]) => {
    setSelectedChoiceId(choice.id);
    setHeartScore(Math.min(100, 68 + choice.heartDelta));
    setTrustScore(Math.min(100, 72 + choice.trustDelta));
  };

  const handlePokeCompanion = () => {
    setPoking(true);
    setPokeCount((c) => c + 1);
    setTimeout(() => setPoking(false), 360);
  };

  const openLightbox = (shot: PersonaScreenshotItem) => {
    setLightboxShot(shot);
    requestAnimationFrame(() => {
      if (lightboxRef.current && !lightboxRef.current.open) {
        lightboxRef.current.showModal();
      }
    });
  };

  const handleStageMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!stageRef.current) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const rect = stageRef.current.getBoundingClientRect();
    const px = (e.clientX - rect.left) / rect.width;
    const py = (e.clientY - rect.top) / rect.height;
    setTilt({
      rx: (0.5 - py) * 5,
      ry: (px - 0.5) * 6,
      gx: px * 100,
      gy: py * 100,
    });
  };

  const handleStageLeave = () => setTilt({ rx: 0, ry: 0, gx: 50, gy: 50 });

  return (
    <section id="persona" className="relative py-24 sm:py-32 overflow-hidden">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        {/* 顶部典藏级章节导语 */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div>
            <div className="clannad-pill-btn inline-flex items-center gap-2 rounded-full px-3.5 py-1 text-xs font-medium tracking-wide text-pink-100 mb-4">
              <DangoCharmIcon color="#fbcfe8" cheekColor="#f43f5e" className="h-4 w-4" />
              <span>重点旗舰项目 03 · 番剧级人设扮演互动剧场与三层记忆伴侣系统</span>
            </div>
            <h2 className="font-clannad-serif text-3xl sm:text-5xl font-bold tracking-wider text-white">
              <span className="text-antigravity-gradient">Persona Chat Studio</span>
              <span className="text-pink-50"> · 星语恋庭</span>
            </h2>
            <p className="mt-4 max-w-2xl text-pink-50/90 text-base leading-relaxed">
              定制专属人设背景故事，镌刻不会遗忘的双向心动记忆。融合{' '}
              <strong className="text-white">仿 DeepSeek 纯净流式工作台</strong> 与{' '}
              <strong className="text-pink-200">番剧级多幕互动剧场</strong>（首发内置致敬《CLANNAD》的《樱坂坡道上的风》），服务端基于{' '}
              <strong className="text-amber-200">Node.js 22.5 原生 SQLite 零第三方依赖</strong> 构筑。
            </p>
          </div>

          {/* 右上角强导流双按钮 */}
          <div className="flex flex-wrap items-center gap-3 shrink-0">
            <a
              href={AUTHOR_PROFILE.personaDemo}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-pink-200 via-rose-200 to-amber-100 px-5 py-3 text-sm font-bold text-[#1d1630] shadow-[0_0_28px_rgba(249,168,212,0.48)] hover:brightness-105 transition-all"
            >
              <Play className="h-4 w-4 fill-[#1d1630]" />
              <span>免注册 1 秒在线开演</span>
              <ArrowUpRight className="h-4 w-4" />
            </a>
            <a
              href={AUTHOR_PROFILE.personaRepo}
              target="_blank"
              rel="noopener noreferrer"
              className="clannad-pill-btn inline-flex items-center gap-2 rounded-full px-4 py-3 text-sm font-semibold text-pink-50"
            >
              <Github className="h-4 w-4" />
              <span>GitHub 源码</span>
            </a>
          </div>
        </div>

        {/* 主体双栏：左侧核心架构与多端传送门 + 右侧 3D 视差星语恋庭互动剧场沙盒 */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-7 items-stretch">
          {/* 左侧 5 列 */}
          <div className="lg:col-span-5 flex flex-col justify-between gap-5">
            <div className="clannad-crystal-panel rounded-3xl p-6 overflow-hidden">
              <SakuraCornerFiligree position="top-right" />
              <div className="flex items-center gap-3.5 mb-5">
                <img
                  src="./showcase/persona/persona-logo.png"
                  alt="星语恋庭图标"
                  className="h-11 w-11 rounded-2xl border border-pink-200/40 object-cover shadow-[0_0_18px_rgba(249,168,212,0.35)]"
                />
                <div>
                  <div className="text-sm font-bold text-white">星语恋庭 · 云端全栈互动剧场</div>
                  <div className="text-xs font-mono text-pink-200">https://star.claudexxb.online</div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 mb-5">
                {[
                  { num: '0 第三方包', desc: 'node:sqlite 纯原生架构', accent: 'text-pink-200' },
                  { num: '三层记忆', desc: '艾宾浩斯遗忘曲线防失忆', accent: 'text-amber-200' },
                  { num: '4 大番剧', desc: '独立世界观两级防串戏', accent: 'text-sky-200' },
                  { num: '2.5D + 真声', desc: '破框伴侣与声优级克隆', accent: 'text-emerald-200' },
                ].map((stat) => (
                  <div key={stat.num} className="clannad-silk-subcard rounded-2xl p-3.5">
                    <div className={`text-lg font-bold tracking-wide ${stat.accent}`}>
                      {stat.num}
                    </div>
                    <div className="mt-0.5 text-xs text-pink-100/75">{stat.desc}</div>
                  </div>
                ))}
              </div>

              <ul className="space-y-2.5 text-xs sm:text-sm text-pink-50/90">
                <li className="flex items-start gap-2">
                  <MessageSquareHeart className="h-4 w-4 text-pink-300 shrink-0 mt-0.5" />
                  <span>
                    <strong className="text-white">流式「心声独白」与四阶羁绊手账：</strong>实时透视角色口是心非的潜台词，随心动、信任、默契演化解锁「梦境写日记」私密手札。
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <BookOpen className="h-4 w-4 text-amber-200 shrink-0 mt-0.5" />
                  <span>
                    <strong className="text-white">上传小说 AI 改剧本工坊 &amp; 共创广场：</strong>拖入小说草稿一键拆解为 4 幕互动章节与登场人设，支持社区一键克隆开演。
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <Smartphone className="h-4 w-4 text-sky-200 shrink-0 mt-0.5" />
                  <span>
                    <strong className="text-white">Web 云端 + DeepSeek 纯净态 + Android 随身版：</strong>同一账号一键无缝切回极简生产力工作台，并配备原生体验 APK 客户端。
                  </span>
                </li>
              </ul>
            </div>

            {/* 四大直达入口矩阵卡片 */}
            <div className="clannad-crystal-panel rounded-3xl p-5">
              <div className="text-xs font-semibold tracking-wider text-pink-200 mb-3 flex items-center gap-1.5">
                <SakuraBlossomIcon className="h-3.5 w-3.5" />
                <span>星语恋庭 · 多端直达传送门</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs">
                <a
                  href={AUTHOR_PROFILE.personaDemo}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="clannad-pill-btn flex items-center justify-between rounded-xl px-3.5 py-2.5 font-semibold text-pink-100"
                >
                  <span>免注册一键试玩剧场</span>
                  <Play className="h-3.5 w-3.5 text-pink-200" />
                </a>
                <a
                  href={AUTHOR_PROFILE.personaSite}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="clannad-pill-btn flex items-center justify-between rounded-xl px-3.5 py-2.5 font-semibold text-sky-100"
                >
                  <span>官方云端站主门扉</span>
                  <ExternalLink className="h-3.5 w-3.5 text-sky-200" />
                </a>
                <a
                  href={AUTHOR_PROFILE.personaApkRelease}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="clannad-pill-btn flex items-center justify-between rounded-xl px-3.5 py-2.5 font-medium text-amber-100"
                >
                  <span>下载 Android 随身版</span>
                  <Download className="h-3.5 w-3.5 text-amber-200" />
                </a>
                <a
                  href={AUTHOR_PROFILE.personaRepo}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="clannad-pill-btn flex items-center justify-between rounded-xl px-3.5 py-2.5 font-medium text-pink-50"
                >
                  <span>GitHub 开源仓库</span>
                  <Github className="h-3.5 w-3.5 text-pink-100" />
                </a>
              </div>
            </div>
          </div>

          {/* 右侧 7 列：3D 视差全息互动剧场沙盒 */}
          <div className="lg:col-span-7" style={{ perspective: '1400px' }}>
            <div
              ref={stageRef}
              onMouseMove={handleStageMove}
              onMouseLeave={handleStageLeave}
              style={{
                transform: `rotateX(${tilt.rx}deg) rotateY(${tilt.ry}deg)`,
                transition:
                  tilt.rx === 0 && tilt.ry === 0
                    ? 'transform 0.5s cubic-bezier(0.16, 1, 0.3, 1)'
                    : 'transform 0.08s linear',
              }}
              className="clannad-crystal-panel relative h-full rounded-3xl p-4 sm:p-6 overflow-hidden flex flex-col"
            >
              <SakuraCornerFiligree position="top-right" />
              <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-0 opacity-45"
                style={{
                  background: `radial-gradient(460px circle at ${tilt.gx}% ${tilt.gy}%, rgba(249,168,212,0.14), transparent 62%)`,
                }}
              />

              {/* 沙盒顶栏 */}
              <div className="relative z-10 flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-pink-200/20">
                <div className="flex items-center gap-2">
                  <span className="h-2.5 w-2.5 rounded-full bg-pink-300/85" />
                  <span className="h-2.5 w-2.5 rounded-full bg-amber-200/85" />
                  <span className="h-2.5 w-2.5 rounded-full bg-sky-300/85" />
                  <span className="ml-1.5 text-xs font-mono text-pink-100/75">
                    星语恋庭全息剧场 · 现场分支推演
                  </span>
                </div>

                <div
                  role="tablist"
                  aria-label="星语恋庭交互演示模式"
                  className="flex items-center gap-1 rounded-full bg-[#1a152d]/70 p-1 border border-pink-200/25"
                >
                  {(
                    [
                      { id: 'theater', label: '心声流式剧场' },
                      { id: 'companions', label: '2.5D 全息伴侣' },
                      { id: 'gallery', label: '线上实机画廊' },
                    ] as const
                  ).map(({ id, label }) => (
                    <button
                      key={id}
                      role="tab"
                      aria-selected={activeTab === id}
                      type="button"
                      onClick={() => setActiveTab(id)}
                      className={`rounded-full px-3 py-1.5 text-xs font-medium transition-all cursor-pointer ${
                        activeTab === id
                          ? 'bg-gradient-to-r from-pink-300/35 to-amber-200/25 text-white border border-pink-200/45 shadow-[0_0_12px_rgba(249,168,212,0.28)]'
                          : 'text-pink-100/75 hover:text-white'
                      }`}
                    >
                      {label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Tab 1: 番剧心声流式剧场 */}
              {activeTab === 'theater' && (
                <div className="relative z-10 mt-4 flex-1 flex flex-col justify-between gap-4">
                  {/* 剧本世界观切换栏 + 好感度状态 */}
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div className="flex flex-wrap gap-1.5">
                      {PERSONA_WORLD_SCRIPTS.map((scr, idx) => (
                        <button
                          key={scr.id}
                          type="button"
                          onClick={() => handleSelectScript(idx)}
                          className={`rounded-full px-3 py-1 text-xs font-medium transition-all cursor-pointer ${
                            idx === scriptIdx
                              ? 'bg-pink-300/25 text-white border border-pink-200/50'
                              : 'clannad-silk-subcard text-pink-100/75 hover:text-white'
                          }`}
                        >
                          {scr.title}
                        </button>
                      ))}
                    </div>

                    <div className="flex items-center gap-3 text-xs font-mono">
                      <span className="inline-flex items-center gap-1 text-pink-200">
                        <Heart className="h-3.5 w-3.5 fill-pink-300/50 text-pink-300" />
                        心动 {heartScore}%
                      </span>
                      <span className="inline-flex items-center gap-1 text-amber-200">
                        <HikariOrbIcon className="h-3.5 w-3.5" />
                        信任 {trustScore}%
                      </span>
                    </div>
                  </div>

                  {/* 剧场主舞台对话区 */}
                  <div className="rounded-2xl border border-pink-200/22 bg-[#171329]/74 p-4 space-y-3">
                    <div className="flex items-center justify-between text-[11px] text-pink-200/85 border-b border-pink-200/15 pb-2">
                      <span className="font-semibold flex items-center gap-1.5">
                        <SakuraBlossomIcon className="h-3.5 w-3.5" />
                        <span>
                          当前对手戏：{currentScript.heroine}（{currentScript.roleTitle}）
                        </span>
                      </span>
                      <span className="text-amber-200/85 hidden sm:inline">
                        你的身份：{currentScript.playerIdentity}
                      </span>
                    </div>

                    {/* 场景分镜描写 */}
                    <p className="text-xs italic text-pink-100/80 leading-relaxed">
                      {currentScript.stageScene}
                    </p>

                    {/* 角色潜台词「心声独白」折叠流 */}
                    <div className="clannad-silk-subcard rounded-xl px-3.5 py-2.5 text-xs">
                      <div className="text-[11px] font-semibold text-amber-200 mb-1 flex items-center gap-1.5">
                        <Sparkles className="h-3 w-3" />
                        <span>角色潜台词 · 心声独白实时推演</span>
                      </div>
                      <p className="text-pink-100/90 leading-relaxed">
                        {activeChoice ? activeChoice.thoughtReply : currentScript.innerThought}
                      </p>
                    </div>

                    {/* 正式语音对白 */}
                    <div className="rounded-xl bg-pink-300/12 border border-pink-200/30 p-3.5 text-xs sm:text-sm text-white leading-relaxed">
                      <span className="font-bold text-pink-200 mr-1.5">
                        {currentScript.heroine}：
                      </span>
                      <span>
                        {activeChoice ? activeChoice.spokenReply : currentScript.openingLine}
                      </span>
                    </div>
                  </div>

                  {/* 底部三条剧情推进胶囊 */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-[11px] text-pink-100/75">
                      <span>点击下方「剧情推进胶囊」体验双向心动演化：</span>
                      {activeChoice && (
                        <button
                          type="button"
                          onClick={() => setSelectedChoiceId(null)}
                          className="inline-flex items-center gap-1 text-amber-200 hover:underline cursor-pointer"
                        >
                          <RefreshCw className="h-3 w-3" /> 重置本幕开场
                        </button>
                      )}
                    </div>
                    <div className="grid grid-cols-1 gap-2">
                      {currentScript.choices.map((ch) => {
                        const chosen = selectedChoiceId === ch.id;
                        return (
                          <button
                            key={ch.id}
                            type="button"
                            onClick={() => handleChooseBranch(ch)}
                            className={`text-left rounded-xl px-3.5 py-2.5 text-xs font-medium transition-all cursor-pointer flex items-center justify-between gap-2 ${
                              chosen
                                ? 'bg-gradient-to-r from-pink-300/30 to-amber-200/25 border border-pink-200/55 text-white shadow-[0_0_16px_rgba(249,168,212,0.25)]'
                                : 'clannad-silk-subcard text-pink-50/90 hover:border-pink-200/45'
                            }`}
                          >
                            <span>{ch.label}</span>
                            <span className="shrink-0 font-mono text-[10px] text-amber-200">
                              心动 +{ch.heartDelta}
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>
              )}

              {/* Tab 2: 2.5D 全息视差伴侣橱窗 */}
              {activeTab === 'companions' && (
                <div className="relative z-10 mt-4 flex-1 flex flex-col justify-between gap-4">
                  <div className="grid grid-cols-1 sm:grid-cols-12 gap-4 items-center rounded-2xl border border-pink-200/22 bg-[#171329]/74 p-4">
                    <div className="sm:col-span-5 flex flex-col items-center">
                      <button
                        type="button"
                        onClick={handlePokeCompanion}
                        title="点击立绘体验阻尼弹簧「戳一戳」互动"
                        className={`relative overflow-hidden rounded-2xl border border-pink-200/35 w-44 aspect-[3/4] shadow-[0_14px_34px_rgba(0,0,0,0.5)] cursor-pointer transition-transform duration-300 ${
                          poking ? 'scale-95 -rotate-2' : 'hover:scale-[1.03]'
                        }`}
                      >
                        <img
                          src={activeCompanion.imageSrc}
                          alt={activeCompanion.name}
                          className="h-full w-full object-cover"
                        />
                        <span className="absolute bottom-2 inset-x-2 rounded-full bg-[#1a152d]/80 border border-pink-200/35 py-1 text-[10px] font-semibold text-pink-100 backdrop-blur-md">
                          轻触立绘戳一戳 ({pokeCount})
                        </span>
                      </button>
                    </div>

                    <div className="sm:col-span-7 space-y-3">
                      <div className="inline-flex items-center gap-1.5 rounded-full bg-pink-300/20 border border-pink-200/35 px-3 py-0.5 text-[11px] font-semibold text-pink-100">
                        <Volume2 className="h-3 w-3 text-amber-200" />
                        <span>{activeCompanion.voiceTag} · 零样本克隆支持</span>
                      </div>
                      <h3 className="font-clannad-serif text-xl font-bold text-white">
                        {activeCompanion.name}
                      </h3>
                      <p className="text-xs text-pink-100/80 leading-relaxed">
                        {activeCompanion.personality}
                      </p>
                      <div className="clannad-silk-subcard rounded-xl p-3 text-xs text-amber-100 leading-relaxed">
                        {activeCompanion.pokeQuote}
                      </div>
                      <a
                        href={AUTHOR_PROFILE.personaDemo}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 text-xs font-semibold text-pink-200 hover:text-white"
                      >
                        <StarfishCharmIcon className="h-3.5 w-3.5" />
                        <span>前往线上剧场唤醒全息伴侣与真声朗读</span>
                        <ArrowUpRight className="h-3.5 w-3.5" />
                      </a>
                    </div>
                  </div>

                  {/* 四款伴侣切换卡片 */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                    {PERSONA_COMPANIONS.map((comp) => {
                      const active = comp.id === activeCompanion.id;
                      return (
                        <button
                          key={comp.id}
                          type="button"
                          onClick={() => setActiveCompanion(comp)}
                          className={`rounded-2xl p-2 text-left transition-all cursor-pointer flex items-center gap-2.5 ${
                            active
                              ? 'bg-pink-300/25 border border-pink-200/55 shadow-[0_0_16px_rgba(249,168,212,0.25)]'
                              : 'clannad-silk-subcard hover:border-pink-200/40'
                          }`}
                        >
                          <img
                            src={comp.imageSrc}
                            alt={comp.name}
                            className="h-10 w-10 rounded-xl object-cover shrink-0 border border-white/20"
                          />
                          <div className="min-w-0">
                            <div className="text-xs font-bold text-white truncate">
                              {comp.name.split('·')[1]?.trim() ?? comp.name}
                            </div>
                            <div className="text-[10px] text-pink-100/70 truncate">
                              {comp.voiceTag}
                            </div>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Tab 3: 线上实机高清画廊 */}
              {activeTab === 'gallery' && (
                <div className="relative z-10 mt-4 flex-1 flex flex-col justify-between gap-4">
                  <div className="group relative rounded-2xl border border-pink-200/25 bg-[#120f22] overflow-hidden aspect-[16/9]">
                    <img
                      src={currentShot.src}
                      alt={currentShot.title}
                      className="h-full w-full object-cover object-top transition-transform duration-500 group-hover:scale-[1.02]"
                    />
                    <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-[#120e22] via-[#120e22]/75 to-transparent p-4 flex items-end justify-between gap-3">
                      <div>
                        <span className="rounded-full bg-pink-300/25 border border-pink-200/40 px-2.5 py-0.5 text-[10px] font-semibold text-pink-100">
                          {currentShot.badge}
                        </span>
                        <h3 className="mt-1 text-sm font-bold text-white">{currentShot.title}</h3>
                        <p className="mt-0.5 text-xs text-pink-50/85 line-clamp-2">
                          {currentShot.description}
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={() => openLightbox(currentShot)}
                        className="clannad-pill-btn shrink-0 inline-flex items-center gap-1.5 rounded-xl px-3 py-1.5 text-xs font-semibold text-white cursor-pointer"
                      >
                        <Maximize2 className="h-3.5 w-3.5" />
                        <span>全屏高清</span>
                      </button>
                    </div>
                  </div>

                  <div className="grid grid-cols-5 gap-2">
                    {PERSONA_SCREENSHOTS.map((shot, idx) => (
                      <button
                        key={shot.id}
                        type="button"
                        onClick={() => setShotIdx(idx)}
                        className={`relative rounded-xl overflow-hidden border aspect-[16/10] cursor-pointer transition-all ${
                          idx === shotIdx
                            ? 'border-pink-300 ring-2 ring-pink-300/40 scale-[1.02]'
                            : 'border-pink-200/20 opacity-65 hover:opacity-95'
                        }`}
                      >
                        <img src={shot.src} alt={shot.badge} className="h-full w-full object-cover" />
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* 原生 Top-Layer 实机高清预览灯箱 */}
      <dialog
        ref={lightboxRef}
        {...({ closedby: 'any' } as React.DialogHTMLAttributes<HTMLDialogElement>)}
        aria-label="星语恋庭线上实机高清预览"
        className="cyber-dialog w-full"
      >
        {lightboxShot && (
          <div className="rounded-3xl border border-pink-200/35 bg-[#1a152d]/95 p-4 sm:p-6 shadow-2xl backdrop-blur-2xl">
            <div className="flex items-center justify-between gap-4 pb-3 border-b border-pink-200/20">
              <div className="flex items-center gap-2.5">
                <ShieldCheck className="h-4 w-4 text-pink-300" />
                <h3 className="text-sm sm:text-base font-bold text-white">{lightboxShot.title}</h3>
              </div>
              <button
                type="button"
                onClick={() => void closeDialogSmoothly(lightboxRef.current)}
                aria-label="关闭大图预览"
                className="clannad-pill-btn rounded-full p-1.5 text-pink-100 cursor-pointer"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
            <div className="mt-4 overflow-hidden rounded-2xl border border-pink-200/20 bg-black/60">
              <img
                src={lightboxShot.src}
                alt={lightboxShot.title}
                className="max-h-[70vh] w-full object-contain"
              />
            </div>
            <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
              <p className="text-xs sm:text-sm text-pink-50/90 max-w-2xl">
                {lightboxShot.description}
              </p>
              <a
                href={lightboxShot.liveUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 rounded-full bg-gradient-to-r from-pink-200 to-amber-100 px-4 py-2 text-xs font-bold text-[#1d1630] hover:brightness-105"
              >
                <span>前往 star.claudexxb.online 立即开演</span>
                <ArrowUpRight className="h-3.5 w-3.5" />
              </a>
            </div>
          </div>
        )}
      </dialog>
    </section>
  );
};
