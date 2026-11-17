import React, { useRef, useState } from 'react';
import {
  ArrowUpRight,
  Check,
  ChevronRight,
  Copy,
  Cpu,
  ExternalLink,
  Github,
  Image,
  Layers,
  Mail,
  MessageCircle,
  Music,
  Sparkles,
  Tv,
  Zap,
} from 'lucide-react';
import { AUTHOR_PROFILE } from '../data/siteData';
import { ClannadTrackId } from '../data/clannadData';
import { ClannadWorldTheme, WORLD_BACKDROP_OPTIONS } from './ClannadBackdrop';

interface HeroSectionProps {
  motionPaused: boolean;
  onPlayClannadTrack: (trackId: ClannadTrackId) => void;
  worldTheme: ClannadWorldTheme;
  onChangeWorldTheme: (theme: ClannadWorldTheme) => void;
}

/** 鼠标磁吸包裹器 */
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

/** 精致首屏三色团子家族小徽章 */
const MiniDangoTrio: React.FC = () => (
  <span aria-hidden="true" className="inline-flex items-end gap-1 ml-1">
    <span className="inline-flex h-4 w-4 items-center justify-center rounded-full bg-pink-300 shadow-sm">
      <span className="h-1.5 w-[1.5px] bg-slate-800 mr-[2px]" />
      <span className="h-1.5 w-[1.5px] bg-slate-800" />
    </span>
    <span className="inline-flex h-4.5 w-4.5 items-center justify-center rounded-full bg-sky-300 shadow-sm">
      <span className="h-1.5 w-[1.5px] bg-slate-800 mr-[2px]" />
      <span className="h-1.5 w-[1.5px] bg-slate-800" />
    </span>
    <span className="inline-flex h-3.5 w-3.5 items-center justify-center rounded-full bg-amber-200 shadow-sm">
      <span className="h-1 w-[1.5px] bg-slate-800 mr-[2px]" />
      <span className="h-1 w-[1.5px] bg-slate-800" />
    </span>
  </span>
);

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
        {/* 顶部：CLANNAD 原作动漫全景壁纸切换器 */}
        <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
          <div className="inline-flex items-center gap-2 rounded-full border border-pink-200/40 bg-[#181632]/55 px-4 py-1.5 backdrop-blur-xl shadow-[0_8px_28px_rgba(14,10,30,0.45),inset_0_1px_1px_rgba(255,255,255,0.28)]">
            <span className="text-xs font-semibold tracking-wide text-pink-100 flex items-center gap-1.5">
              <span>🌸 光坂坡道与星海光玉 · 独立全栈架构师</span>
              <MiniDangoTrio />
            </span>
          </div>

          <div
            role="group"
            aria-label="切换全站 CLANNAD 动漫背景画境"
            className="inline-flex flex-wrap items-center gap-1 rounded-full border border-white/25 bg-[#161832]/58 p-1 backdrop-blur-xl shadow-lg text-[11px]"
          >
            <span className="px-2 text-pink-100/85 hidden sm:inline-flex items-center gap-1 font-medium">
              <Image className="h-3 w-3 text-pink-300" />
              动漫背景：
            </span>
            {WORLD_BACKDROP_OPTIONS.map((opt) => (
              <button
                key={opt.id}
                type="button"
                onClick={() => onChangeWorldTheme(opt.id)}
                title={opt.badge}
                className={`rounded-full px-2.5 py-1 font-semibold transition-all cursor-pointer ${
                  worldTheme === opt.id
                    ? 'bg-gradient-to-r from-pink-400/45 to-amber-300/40 text-white border border-pink-200/55 shadow-[0_0_14px_rgba(244,114,182,0.4)]'
                    : 'text-white/80 hover:text-white hover:bg-white/10'
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>

        {/* 主视觉通透樱雪水晶舞台舱（背后透出高清樱花坡道/向日葵花海/星海光玉） */}
        <div className="clannad-crystal-panel rounded-3xl p-6 sm:p-10 relative overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-8">
              <h1 className="text-3xl sm:text-5xl lg:text-[3.65rem] font-extrabold tracking-tight leading-[1.16] text-white drop-shadow-[0_4px_24px_rgba(12,10,28,0.6)]">
                在盛满春樱的漫长坡道上，
                <br />
                <span className="text-aurora-gradient">铸造有灵魂与温度的数字奇迹</span>
              </h1>

              <p className="mt-5 max-w-2xl text-sm sm:text-base lg:text-lg leading-relaxed text-pink-50/95 drop-shadow">
                你好，我是 <strong className="font-bold text-white">{AUTHOR_PROFILE.name}</strong>（
                <a
                  href={AUTHOR_PROFILE.githubUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-mono text-amber-200 hover:underline"
                >
                  {AUTHOR_PROFILE.handle}
                </a>
                ）。深爱着《CLANNAD》里关于家族与小镇微光的羁绊，也痴迷于用{' '}
                <span className="text-white font-semibold">Rust / Tauri v2 / React 19</span>{' '}
                打磨极致软件作品。欢迎在这里探索我的两大核心开源旗舰——
                <a href="#coreforge" className="text-sky-200 font-bold hover:underline mx-1">
                  ⚡ CoreForge 研核知识库
                </a>
                与
                <a href="#antigravity" className="text-pink-200 font-bold hover:underline mx-1">
                  🪐 Antigravity Studio 反重力汉化
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
                    <span className="flex items-center gap-2 rounded-full bg-[#1a1735]/90 px-5 py-3 text-xs sm:text-sm font-bold text-white transition-colors group-hover:bg-[#231d44]">
                      <Zap className="h-4 w-4 text-sky-300" />
                      <span>立即体验 CoreForge 研核官网</span>
                      <span className="rounded-full bg-sky-300/20 px-2 py-0.5 font-mono text-[11px] text-sky-100 border border-sky-200/35">
                        claudexxb.online
                      </span>
                      <ArrowUpRight className="h-4 w-4 text-sky-200 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                    </span>
                  </a>
                </MagneticWrap>

                <MagneticWrap disabled={motionPaused}>
                  <a
                    href={AUTHOR_PROFILE.antigravityRepo}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group inline-flex items-center gap-2 rounded-full border border-pink-200/45 bg-gradient-to-r from-pink-400/30 via-rose-400/25 to-amber-300/25 px-5 py-3 text-xs sm:text-sm font-bold text-white backdrop-blur-xl shadow-[0_10px_28px_-6px_rgba(244,114,182,0.45)] hover:brightness-110 transition-all"
                  >
                    <Sparkles className="h-4 w-4 text-amber-200" />
                    <span>探索 Antigravity 反重力汉化</span>
                    <ExternalLink className="h-4 w-4 text-pink-100" />
                  </a>
                </MagneticWrap>

                <button
                  type="button"
                  onClick={() => {
                    onPlayClannadTrack('dango-family');
                    document.getElementById('clannad')?.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className="inline-flex items-center gap-2 rounded-full border border-amber-200/50 bg-amber-300/22 px-4 py-3 text-xs sm:text-sm font-bold text-amber-50 hover:bg-amber-300/32 backdrop-blur-md transition-all cursor-pointer shadow-[0_0_24px_-6px_rgba(251,191,36,0.45)]"
                >
                  <Music className="h-4 w-4 text-amber-200" />
                  <span>播放《团子大家族》· 纪念馆</span>
                </button>
              </div>

              {/* 社交联络微光名片胶囊条 */}
              <div className="mt-5 flex flex-wrap items-center gap-2 text-xs">
                <a
                  href={AUTHOR_PROFILE.bilibiliUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 rounded-full border border-pink-200/35 bg-white/10 px-3 py-1.5 font-semibold text-pink-100 hover:bg-white/20 transition-colors"
                >
                  <Tv className="h-3.5 w-3.5 text-pink-300" />
                  <span>哔哩哔哩 B站 · UID {AUTHOR_PROFILE.bilibiliUid}</span>
                  <ArrowUpRight className="h-3.5 w-3.5 opacity-85" />
                </a>

                <button
                  type="button"
                  onClick={() => void copyQuickContact('qq', AUTHOR_PROFILE.qq)}
                  className="inline-flex items-center gap-1.5 rounded-full border border-white/25 bg-white/10 px-3 py-1.5 font-semibold text-sky-100 hover:bg-white/20 transition-colors cursor-pointer"
                  title="点击复制 QQ 号"
                >
                  <MessageCircle className="h-3.5 w-3.5 text-sky-300" />
                  <span>QQ：{AUTHOR_PROFILE.qq}</span>
                  {copiedKey === 'qq' ? (
                    <span className="inline-flex items-center gap-0.5 text-emerald-200 font-bold">
                      <Check className="h-3 w-3" /> 已复制
                    </span>
                  ) : (
                    <Copy className="h-3 w-3 opacity-75" />
                  )}
                </button>

                <button
                  type="button"
                  onClick={() => void copyQuickContact('email', AUTHOR_PROFILE.email)}
                  className="inline-flex items-center gap-1.5 rounded-full border border-white/25 bg-white/10 px-3 py-1.5 font-semibold text-amber-100 hover:bg-white/20 transition-colors cursor-pointer"
                  title="点击复制个人邮箱地址"
                >
                  <Mail className="h-3.5 w-3.5 text-amber-200" />
                  <span className="font-mono">{AUTHOR_PROFILE.email}</span>
                  {copiedKey === 'email' ? (
                    <span className="inline-flex items-center gap-0.5 text-emerald-200 font-bold">
                      <Check className="h-3 w-3" /> 已复制
                    </span>
                  ) : (
                    <Copy className="h-3 w-3 opacity-75" />
                  )}
                </button>
              </div>
            </div>

            {/* 首屏右侧：小冈崎汐向日葵团子迎宾立绘框 + 家族全家福画框 */}
            <div className="lg:col-span-4 flex flex-col items-center">
              <div className="relative w-full max-w-[300px] rounded-3xl border border-pink-200/35 bg-gradient-to-b from-white/18 to-pink-500/12 p-4 backdrop-blur-xl shadow-[0_20px_50px_-12px_rgba(12,8,28,0.55)] text-center">
                <div className="relative overflow-hidden rounded-2xl border border-white/25 aspect-[16/10] mb-3 shadow-md">
                  <img
                    src="./clannad/gallery/clannad_grand_reunion.jpg"
                    alt="CLANNAD 光坂坡道全员奇迹大合照"
                    className="h-full w-full object-cover"
                  />
                </div>
                <div className="flex items-center gap-3 text-left">
                  <img
                    src="./clannad/ushio/ushio_action_happy.webp"
                    alt="冈崎汐与团子三兄弟"
                    className="h-16 w-16 object-contain shrink-0 drop-shadow-[0_6px_14px_rgba(251,191,36,0.4)]"
                  />
                  <div>
                    <div className="text-xs font-extrabold text-amber-200">
                      🍡 冈崎汐 &amp; 团子大家族
                    </div>
                    <p className="mt-0.5 text-[11px] text-white/90 leading-snug">
                      「欢迎来到爸爸和大家的春樱秘密基地，点右下角唱片一起听歌吧 ♪」
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 首屏底部：高透光琉璃双旗舰核心引导双舱 */}
        <div className="mt-6 grid grid-cols-1 lg:grid-cols-2 gap-5">
          {/* 旗舰导流卡 01：CoreForge 研核 */}
          <div className="clannad-crystal-panel group relative rounded-3xl p-5 sm:p-6 hover:border-sky-200/55 transition-all">
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-center gap-3.5">
                <img
                  src="./showcase/coreforge-logo.png"
                  alt="CoreForge 研核图标"
                  className="h-12 w-12 rounded-2xl border border-sky-200/40 object-cover shadow-[0_0_20px_rgba(125,211,252,0.35)]"
                />
                <div>
                  <div className="flex items-center gap-2">
                    <span className="rounded-full bg-sky-400/25 px-2.5 py-0.5 text-[11px] font-bold text-sky-100 border border-sky-200/35">
                      重点旗舰 NO.01 · 知识库项目
                    </span>
                    <span className="text-[11px] font-semibold text-emerald-200">● 免登录在线试玩</span>
                  </div>
                  <h2 className="mt-1 text-xl font-extrabold text-white group-hover:text-sky-100 transition-colors">
                    CoreForge 研核 · 全栈智能研学与知识大脑
                  </h2>
                </div>
              </div>
              <a
                href="#coreforge"
                className="shrink-0 rounded-full border border-white/25 bg-white/12 px-3 py-1.5 text-xs font-semibold text-sky-100 hover:bg-white/22 flex items-center gap-1"
              >
                <span>实机试玩</span>
                <ChevronRight className="h-3.5 w-3.5" />
              </a>
            </div>

            <p className="mt-3 text-sm text-white/90 leading-relaxed">
              面向 408 计算机与考研数/英/政的一体化研学操作系统。内置{' '}
              <strong className="text-amber-100">1987–2024 精校真题库</strong>、
              <strong className="text-sky-100">22+ 单步算法与高数仿真实验室</strong>，100% 双向同步本机 Obsidian{' '}
              <code className="text-sky-200 font-mono text-xs">.md</code> 知识库。
            </p>

            <div className="mt-4 pt-3.5 border-t border-white/15 flex flex-wrap items-center justify-between gap-3 text-xs">
              <div className="flex flex-wrap items-center gap-2.5">
                <a
                  href={AUTHOR_PROFILE.coreforgeSite}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 font-bold text-sky-200 hover:text-white"
                >
                  <span>🌐 官网 claudexxb.online</span>
                  <ArrowUpRight className="h-3.5 w-3.5" />
                </a>
                <span className="text-white/30">|</span>
                <a
                  href={AUTHOR_PROFILE.coreforgeLabs}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-pink-100 hover:text-white"
                >
                  <span>🎮 五大交互实验室</span>
                </a>
                <span className="text-white/30">|</span>
                <a
                  href={AUTHOR_PROFILE.coreforgeRepo}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-white/85 hover:text-white"
                >
                  <Github className="h-3.5 w-3.5" />
                  <span>源码仓库</span>
                </a>
              </div>
              <span className="font-mono text-[11px] text-white/75 flex items-center gap-1">
                <Layers className="h-3.5 w-3.5 text-sky-300" />
                React 19 · Express 5 · Electron 42
              </span>
            </div>
          </div>

          {/* 旗舰导流卡 02：Antigravity Studio */}
          <div className="clannad-crystal-panel group relative rounded-3xl p-5 sm:p-6 hover:border-pink-200/60 transition-all">
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-center gap-3.5">
                <img
                  src="./showcase/antigravity-logo.png"
                  alt="Antigravity Studio 图标"
                  className="h-12 w-12 rounded-2xl border border-pink-200/40 object-cover shadow-[0_0_20px_rgba(244,114,182,0.35)]"
                />
                <div>
                  <div className="flex items-center gap-2">
                    <span className="rounded-full bg-pink-400/25 px-2.5 py-0.5 text-[11px] font-bold text-pink-100 border border-pink-200/35">
                      重点旗舰 NO.02 · 反重力汉化
                    </span>
                    <span className="text-[11px] font-semibold text-amber-200">★ 含 CLANNAD 四重奏皮肤</span>
                  </div>
                  <h2 className="mt-1 text-xl font-extrabold text-white group-hover:text-pink-100 transition-colors">
                    Antigravity Studio · 全能中文控制中心与美学引擎
                  </h2>
                </div>
              </div>
              <a
                href="#antigravity"
                className="shrink-0 rounded-full border border-white/25 bg-white/12 px-3 py-1.5 text-xs font-semibold text-pink-100 hover:bg-white/22 flex items-center gap-1"
              >
                <span>换肤体验</span>
                <ChevronRight className="h-3.5 w-3.5" />
              </a>
            </div>

            <p className="mt-3 text-sm text-white/90 leading-relaxed">
              原生 Rust 实现 <code className="text-pink-200 font-mono text-xs">app.asar</code> 双层无损汉化与 SHA-256 重建，搭载{' '}
              <strong className="text-pink-100">10 款高定光学皮肤（内置 CLANNAD 四大名场面主题）</strong>、
              <strong className="text-amber-100">冈崎汐/祢豆子等 7 角色语音桌面伴侣</strong>与多账号配额反代。
            </p>

            <div className="mt-4 pt-3.5 border-t border-white/15 flex flex-wrap items-center justify-between gap-3 text-xs">
              <div className="flex flex-wrap items-center gap-2.5">
                <a
                  href={AUTHOR_PROFILE.antigravityRepo}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 font-bold text-pink-200 hover:text-white"
                >
                  <Github className="h-3.5 w-3.5" />
                  <span>GitHub 仓库 antigravity-zh-cn</span>
                  <ArrowUpRight className="h-3.5 w-3.5" />
                </a>
                <span className="text-white/30">|</span>
                <a
                  href={AUTHOR_PROFILE.antigravityReleases}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-amber-200 hover:text-white font-semibold"
                >
                  <span>🚀 下载最新桌面端安装包</span>
                </a>
              </div>
              <span className="font-mono text-[11px] text-white/75 flex items-center gap-1">
                <Cpu className="h-3.5 w-3.5 text-pink-300" />
                Tauri v2 · Rust · Tokio
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
