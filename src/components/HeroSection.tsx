import React, { useRef, useState } from 'react';
import {
  ArrowUpRight,
  Check,
  ChevronRight,
  Copy,
  Cpu,
  ExternalLink,
  Github,
  Layers,
  Mail,
  MessageCircle,
  Music,
} from 'lucide-react';
import { AUTHOR_PROFILE } from '../data/siteData';
import { ClannadTrackId } from '../data/clannadData';
import { ClannadWorldTheme, WORLD_BACKDROP_OPTIONS } from './ClannadBackdrop';
import {
  BilibiliIcon,
  DangoCharmIcon,
  DangoTrioCrest,
  HikariOrbIcon,
  SakuraBlossomIcon,
  SakuraCornerFiligree,
  StarfishCharmIcon,
} from './ClannadMotifs';

interface HeroSectionProps {
  motionPaused: boolean;
  onPlayClannadTrack: (trackId: ClannadTrackId) => void;
  worldTheme: ClannadWorldTheme;
  onChangeWorldTheme: (theme: ClannadWorldTheme) => void;
}

const MagneticWrap: React.FC<{ children: React.ReactNode; disabled?: boolean }> = ({
  children,
  disabled,
}) => {
  const ref = useRef<HTMLDivElement | null>(null);
  const [offset, setOffset] = useState({ x: 0, y: 0 });

  const handleMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (disabled || !ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const dx = e.clientX - (rect.left + rect.width / 2);
    const dy = e.clientY - (rect.top + rect.height / 2);
    setOffset({ x: dx * 0.16, y: dy * 0.2 });
  };

  const handleLeave = () => setOffset({ x: 0, y: 0 });

  return (
    <div
      ref={ref}
      onMouseMove={handleMove}
      onMouseLeave={handleLeave}
      style={{
        transform: `translate3d(${offset.x}px, ${offset.y}px, 0)`,
        transition:
          offset.x === 0
            ? 'transform 0.45s cubic-bezier(0.16, 1, 0.3, 1)'
            : 'transform 0.08s linear',
      }}
    >
      {children}
    </div>
  );
};

export const HeroSection: React.FC<HeroSectionProps> = ({
  motionPaused,
  onPlayClannadTrack,
  worldTheme,
  onChangeWorldTheme,
}) => {
  const [copiedKey, setCopiedKey] = useState<'qq' | 'email' | null>(null);

  const copyQuickContact = async (key: 'qq' | 'email', text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedKey(key);
      setTimeout(() => setCopiedKey(null), 1800);
    } catch {
      // 忽略受限环境
    }
  };

  return (
    <section
      id="hero"
      className="relative min-h-screen flex flex-col justify-center pt-28 pb-16 sm:pt-32 sm:pb-20"
    >
      <div className="relative z-10 mx-auto w-full max-w-6xl px-4 sm:px-6">
        {/* 顶部：光坂身份铭牌 × 典藏级画境选择器 */}
        <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
          <div className="clannad-pill-btn inline-flex items-center gap-2 rounded-full px-4 py-1.5 backdrop-blur-xl">
            <SakuraBlossomIcon className="h-4 w-4" />
            <span className="text-xs font-medium tracking-wider text-pink-50">
              光坂坡道与星海光玉 · 独立全栈架构师
            </span>
            <DangoTrioCrest className="ml-1" />
          </div>

          <div
            role="group"
            aria-label="切换全站 CLANNAD 动漫背景画境"
            className="inline-flex flex-wrap items-center gap-1 rounded-full border border-pink-200/30 bg-[#1a162d]/62 p-1 backdrop-blur-2xl shadow-lg text-[11px]"
          >
            <span className="px-2.5 text-pink-100/80 hidden sm:inline-flex items-center gap-1.5 font-medium tracking-wide">
              <HikariOrbIcon className="h-3.5 w-3.5" />
              <span>原作画境</span>
            </span>
            {WORLD_BACKDROP_OPTIONS.map((opt) => (
              <button
                key={opt.id}
                type="button"
                onClick={() => onChangeWorldTheme(opt.id)}
                title={opt.badge}
                className={`rounded-full px-3 py-1 font-medium tracking-wide transition-all cursor-pointer ${
                  worldTheme === opt.id
                    ? 'bg-gradient-to-r from-pink-300/35 via-amber-200/30 to-pink-300/35 text-white border border-pink-200/55 shadow-[0_0_16px_rgba(249,168,212,0.35)]'
                    : 'text-pink-50/75 hover:text-white hover:bg-white/10 border border-transparent'
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>

        {/* 主视觉典藏级水晶舞台舱（四角烫金樱枝暗纹 + 人文衬线标题） */}
        <div className="clannad-crystal-panel rounded-[2rem] p-6 sm:p-10 relative overflow-hidden">
          <SakuraCornerFiligree position="top-right" />
          <SakuraCornerFiligree position="bottom-left" />

          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-8">
              <h1 className="font-clannad-serif text-3xl sm:text-4xl lg:text-[2.7rem] xl:text-[3.05rem] font-bold tracking-wider leading-[1.28] text-white drop-shadow-[0_4px_24px_rgba(12,8,24,0.55)]">
                在盛满春樱的光坂坡道上
                <br />
                <span className="text-aurora-gradient">铸造有灵魂与温度的数字奇迹</span>
              </h1>

              <p className="mt-5 max-w-2xl text-sm sm:text-base leading-relaxed text-pink-50/92">
                你好，我是 <strong className="font-semibold text-white">{AUTHOR_PROFILE.name}</strong>（
                <a
                  href={AUTHOR_PROFILE.githubUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-mono text-amber-200 hover:underline"
                >
                  {AUTHOR_PROFILE.handle}
                </a>
                ）。深爱《CLANNAD》里关于家族与小镇微光的羁绊，也执着于用{' '}
                <span className="text-white font-semibold">Rust · Tauri v2 · React 19</span>{' '}
                雕琢高定桌面与智能软件。欢迎探索我的两大核心开源代表作——
                <a href="#coreforge" className="text-sky-200 font-semibold hover:underline mx-1">
                  CoreForge 研核知识库
                </a>
                与
                <a href="#antigravity" className="text-pink-200 font-semibold hover:underline mx-1">
                  Antigravity Studio 反重力汉化
                </a>
                。
              </p>

              {/* 核心旗舰导流与在线原声点播按钮组 */}
              <div className="mt-7 flex flex-wrap items-center gap-3.5">
                <MagneticWrap disabled={motionPaused}>
                  <a
                    href={AUTHOR_PROFILE.coreforgeSite}
                    target="_blank"
                    rel="noopener noreferrer"
                    data-motion={motionPaused ? 'paused' : 'active'}
                    className="conic-beam-btn inline-block group"
                  >
                    <span className="flex items-center gap-2 rounded-full bg-[#1e1833]/92 px-5 py-3 text-xs sm:text-sm font-semibold tracking-wide text-white transition-colors group-hover:bg-[#271f42]">
                      <HikariOrbIcon className="h-4 w-4" />
                      <span>立即体验 CoreForge 研核官网</span>
                      <span className="rounded-full bg-sky-200/15 px-2.5 py-0.5 font-mono text-[11px] text-sky-100 border border-sky-200/30">
                        claudexxb.online
                      </span>
                      <ArrowUpRight className="h-4 w-4 text-amber-200 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                    </span>
                  </a>
                </MagneticWrap>

                <MagneticWrap disabled={motionPaused}>
                  <a
                    href={AUTHOR_PROFILE.antigravityRepo}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="clannad-pill-btn group inline-flex items-center gap-2 rounded-full px-5 py-3 text-xs sm:text-sm font-semibold tracking-wide text-white"
                  >
                    <DangoCharmIcon color="#fbcfe8" cheekColor="#f43f5e" className="h-4 w-4" />
                    <span>探索 Antigravity 反重力汉化</span>
                    <ExternalLink className="h-3.5 w-3.5 text-pink-200" />
                  </a>
                </MagneticWrap>

                <button
                  type="button"
                  onClick={() => {
                    onPlayClannadTrack('dango-family');
                    document.getElementById('clannad')?.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className="clannad-pill-btn inline-flex items-center gap-2 rounded-full px-4 py-3 text-xs sm:text-sm font-semibold tracking-wide text-amber-100 cursor-pointer"
                >
                  <Music className="h-3.5 w-3.5 text-amber-200" />
                  <span>奏响《团子大家族》· 纪念馆</span>
                </button>
              </div>

              {/* 高定纯矢量社交联络珠光胶囊带（零 Emoji） */}
              <div className="mt-6 pt-5 border-t border-pink-200/18 flex flex-wrap items-center gap-2.5 text-xs">
                <a
                  href={AUTHOR_PROFILE.bilibiliUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="clannad-pill-btn inline-flex items-center gap-1.5 rounded-full px-3.5 py-1.5 font-medium text-pink-100"
                >
                  <BilibiliIcon className="h-3.5 w-3.5 text-pink-300" />
                  <span>哔哩哔哩 · UID {AUTHOR_PROFILE.bilibiliUid}</span>
                  <ArrowUpRight className="h-3.5 w-3.5 opacity-80" />
                </a>

                <button
                  type="button"
                  onClick={() => void copyQuickContact('qq', AUTHOR_PROFILE.qq)}
                  className="clannad-pill-btn inline-flex items-center gap-1.5 rounded-full px-3.5 py-1.5 font-medium text-sky-100 cursor-pointer"
                  title="点击复制 QQ 号"
                >
                  <MessageCircle className="h-3.5 w-3.5 text-sky-200" />
                  <span>QQ · {AUTHOR_PROFILE.qq}</span>
                  {copiedKey === 'qq' ? (
                    <span className="inline-flex items-center gap-0.5 text-emerald-200 font-semibold">
                      <Check className="h-3 w-3" /> 已复制
                    </span>
                  ) : (
                    <Copy className="h-3 w-3 opacity-70" />
                  )}
                </button>

                <button
                  type="button"
                  onClick={() => void copyQuickContact('email', AUTHOR_PROFILE.email)}
                  className="clannad-pill-btn inline-flex items-center gap-1.5 rounded-full px-3.5 py-1.5 font-medium text-amber-100 cursor-pointer"
                  title="点击复制个人邮箱地址"
                >
                  <Mail className="h-3.5 w-3.5 text-amber-200" />
                  <span className="font-mono">{AUTHOR_PROFILE.email}</span>
                  {copiedKey === 'email' ? (
                    <span className="inline-flex items-center gap-0.5 text-emerald-200 font-semibold">
                      <Check className="h-3 w-3" /> 已复制
                    </span>
                  ) : (
                    <Copy className="h-3 w-3 opacity-70" />
                  )}
                </button>
              </div>
            </div>

            {/* 首屏右侧：典藏相框式全员大合照与冈崎汐迎宾卡 */}
            <div className="lg:col-span-4 flex flex-col items-center">
              <div className="clannad-silk-subcard relative w-full max-w-[310px] rounded-3xl p-3.5 backdrop-blur-xl shadow-[0_20px_50px_-12px_rgba(12,8,28,0.55)]">
                <div className="relative overflow-hidden rounded-2xl border border-pink-200/30 aspect-[16/10] mb-3 shadow-md">
                  <img
                    src="./clannad/gallery/clannad_grand_reunion.jpg"
                    alt="CLANNAD 光坂坡道全员奇迹大合照"
                    className="h-full w-full object-cover"
                  />
                  <div className="absolute top-2 left-2 rounded-full bg-[#1a152b]/75 border border-pink-200/35 px-2.5 py-0.5 text-[10px] font-medium text-pink-100 backdrop-blur-md flex items-center gap-1">
                    <SakuraBlossomIcon className="h-3 w-3" />
                    <span>光坂大家族全员纪念</span>
                  </div>
                </div>

                <div className="flex items-center gap-3 px-1">
                  <img
                    src="./clannad/ushio/ushio_action_happy.webp"
                    alt="冈崎汐与团子三兄弟"
                    className="h-15 w-15 object-contain shrink-0 drop-shadow-[0_6px_14px_rgba(253,230,138,0.38)]"
                  />
                  <div>
                    <div className="text-xs font-bold text-amber-200 flex items-center gap-1.5">
                      <StarfishCharmIcon className="h-3.5 w-3.5" />
                      <span>冈崎汐 · 团子守望伴侣</span>
                    </div>
                    <p className="mt-1 text-[11px] text-pink-50/90 leading-relaxed">
                      「欢迎来到春樱坡道上的秘密基地，点右下角黑胶八音盒一起听歌吧 ♪」
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 首屏底部：典藏琉璃双旗舰强导流双舱 */}
        <div className="mt-6 grid grid-cols-1 lg:grid-cols-2 gap-5">
          {/* 旗舰导流卡 01：CoreForge 研核 */}
          <div className="clannad-crystal-panel group relative rounded-3xl p-5 sm:p-6 hover:border-sky-200/55 transition-all overflow-hidden">
            <SakuraCornerFiligree position="top-right" />
            <div className="relative z-10 flex items-start justify-between gap-4">
              <div className="flex items-center gap-3.5">
                <img
                  src="./showcase/coreforge-logo.png"
                  alt="CoreForge 研核图标"
                  className="h-12 w-12 rounded-2xl border border-pink-200/35 object-cover shadow-[0_0_20px_rgba(186,230,253,0.3)]"
                />
                <div>
                  <div className="flex items-center gap-2">
                    <span className="rounded-full bg-sky-300/20 px-2.5 py-0.5 text-[11px] font-semibold text-sky-100 border border-sky-200/35 flex items-center gap-1">
                      <HikariOrbIcon className="h-3 w-3" />
                      <span>核心旗舰 01 · 知识库系统</span>
                    </span>
                    <span className="text-[11px] font-medium text-amber-200">免登录在线试玩</span>
                  </div>
                  <h2 className="font-clannad-serif mt-1 text-lg sm:text-xl font-bold text-white group-hover:text-sky-100 transition-colors">
                    CoreForge 研核 · 全栈智能研学与知识大脑
                  </h2>
                </div>
              </div>
              <a
                href="#coreforge"
                className="clannad-pill-btn shrink-0 rounded-full px-3 py-1.5 text-xs font-medium text-sky-100 flex items-center gap-1"
              >
                <span>实机沙盒</span>
                <ChevronRight className="h-3.5 w-3.5" />
              </a>
            </div>

            <p className="relative z-10 mt-3 text-sm text-pink-50/90 leading-relaxed">
              面向 408 计算机与考研数/英/政的一体化研学系统。内置{' '}
              <strong className="text-amber-100">1987–2024 精校真题库</strong>、
              <strong className="text-sky-100">22+ 单步算法与高数仿真课件</strong>，100% 双向同步本地 Obsidian{' '}
              <code className="text-sky-200 font-mono text-xs">.md</code> 知识资产。
            </p>

            <div className="relative z-10 mt-4 pt-3.5 border-t border-pink-200/18 flex flex-wrap items-center justify-between gap-3 text-xs">
              <div className="flex flex-wrap items-center gap-3">
                <a
                  href={AUTHOR_PROFILE.coreforgeSite}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 font-semibold text-sky-200 hover:text-white"
                >
                  <span>线上官网 claudexxb.online</span>
                  <ArrowUpRight className="h-3.5 w-3.5" />
                </a>
                <span className="text-white/25">·</span>
                <a
                  href={AUTHOR_PROFILE.coreforgeLabs}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-pink-100 hover:text-white"
                >
                  <span>五大交互实验室</span>
                </a>
                <span className="text-white/25">·</span>
                <a
                  href={AUTHOR_PROFILE.coreforgeRepo}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-pink-50/85 hover:text-white"
                >
                  <Github className="h-3.5 w-3.5" />
                  <span>源码仓库</span>
                </a>
              </div>
              <span className="font-mono text-[11px] text-pink-100/70 flex items-center gap-1">
                <Layers className="h-3.5 w-3.5 text-sky-200" />
                React 19 · Express 5
              </span>
            </div>
          </div>

          {/* 旗舰导流卡 02：Antigravity Studio */}
          <div className="clannad-crystal-panel group relative rounded-3xl p-5 sm:p-6 hover:border-pink-200/60 transition-all overflow-hidden">
            <SakuraCornerFiligree position="top-right" />
            <div className="relative z-10 flex items-start justify-between gap-4">
              <div className="flex items-center gap-3.5">
                <img
                  src="./showcase/antigravity-logo.png"
                  alt="Antigravity Studio 图标"
                  className="h-12 w-12 rounded-2xl border border-pink-200/35 object-cover shadow-[0_0_20px_rgba(249,168,212,0.35)]"
                />
                <div>
                  <div className="flex items-center gap-2">
                    <span className="rounded-full bg-pink-300/20 px-2.5 py-0.5 text-[11px] font-semibold text-pink-100 border border-pink-200/35 flex items-center gap-1">
                      <SakuraBlossomIcon className="h-3 w-3" />
                      <span>核心旗舰 02 · 反重力汉化</span>
                    </span>
                    <span className="text-[11px] font-medium text-amber-200">内置 CLANNAD 四重奏皮肤</span>
                  </div>
                  <h2 className="font-clannad-serif mt-1 text-lg sm:text-xl font-bold text-white group-hover:text-pink-100 transition-colors">
                    Antigravity Studio · 全能中文控制中心与美学引擎
                  </h2>
                </div>
              </div>
              <a
                href="#antigravity"
                className="clannad-pill-btn shrink-0 rounded-full px-3 py-1.5 text-xs font-medium text-pink-100 flex items-center gap-1"
              >
                <span>光学换肤</span>
                <ChevronRight className="h-3.5 w-3.5" />
              </a>
            </div>

            <p className="relative z-10 mt-3 text-sm text-pink-50/90 leading-relaxed">
              原生 Rust 实现 <code className="text-pink-200 font-mono text-xs">app.asar</code> 双层无损汉化与 SHA-256 重建，搭载{' '}
              <strong className="text-pink-100">10 款高定光学材质主题</strong>、
              <strong className="text-amber-100">冈崎汐/祢豆子等 7 角色原声桌面伴侣</strong>与多账号配额反代。
            </p>

            <div className="relative z-10 mt-4 pt-3.5 border-t border-pink-200/18 flex flex-wrap items-center justify-between gap-3 text-xs">
              <div className="flex flex-wrap items-center gap-3">
                <a
                  href={AUTHOR_PROFILE.antigravityRepo}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 font-semibold text-pink-200 hover:text-white"
                >
                  <Github className="h-3.5 w-3.5" />
                  <span>开源仓库 antigravity-zh-cn</span>
                  <ArrowUpRight className="h-3.5 w-3.5" />
                </a>
                <span className="text-white/25">·</span>
                <a
                  href={AUTHOR_PROFILE.antigravityReleases}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-amber-200 hover:text-white font-semibold"
                >
                  <span>下载最新桌面安装包</span>
                </a>
              </div>
              <span className="font-mono text-[11px] text-pink-100/70 flex items-center gap-1">
                <Cpu className="h-3.5 w-3.5 text-pink-200" />
                Tauri v2 · Rust
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
