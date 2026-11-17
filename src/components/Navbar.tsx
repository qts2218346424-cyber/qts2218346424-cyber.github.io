import React, { useEffect, useState } from 'react';
import {
  Command,
  Eye,
  EyeOff,
  Github,
  Heart,
  Menu,
  Pause,
  Play,
  Sparkles,
  X,
  Zap,
} from 'lucide-react';
import { AUTHOR_PROFILE } from '../data/siteData';
import { ClannadWorldTheme, WORLD_BACKDROP_OPTIONS } from './ClannadBackdrop';

interface NavbarProps {
  motionPaused: boolean;
  onToggleMotion: () => void;
  onOpenPalette: () => void;
  worldTheme: ClannadWorldTheme;
  onChangeWorldTheme: (theme: ClannadWorldTheme) => void;
  scenicMode: boolean;
  onToggleScenicMode: () => void;
}

const NAV_ITEMS = [
  { id: 'hero', label: '樱坡首页' },
  { id: 'coreforge', label: 'CoreForge 研核', highlight: 'cyan' },
  { id: 'antigravity', label: 'Antigravity 汉化', highlight: 'pink' },
  { id: 'clannad', label: '🌸 CLANNAD 羁绊馆', highlight: 'gold' },
  { id: 'matrix', label: '项目矩阵' },
  { id: 'blog', label: '架构专栏' },
  { id: 'contact', label: '社交联络' },
];

export const Navbar: React.FC<NavbarProps> = ({
  motionPaused,
  onToggleMotion,
  onOpenPalette,
  worldTheme,
  onChangeWorldTheme,
  scenicMode,
  onToggleScenicMode,
}) => {
  const [activeId, setActiveId] = useState<string>('hero');
  const [scrolled, setScrolled] = useState<boolean>(false);
  const [mobileOpen, setMobileOpen] = useState<boolean>(false);

  useEffect(() => {
    const supportsScrollTimeline =
      typeof CSS !== 'undefined' && CSS.supports?.('animation-timeline', 'scroll()');
    const progressEl = document.getElementById('scroll-progress-bar');

    const handleScroll = () => {
      setScrolled(window.scrollY > 24);

      if (!supportsScrollTimeline && progressEl) {
        const scrollable = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
        const ratio = Math.min(1, Math.max(0, window.scrollY / scrollable));
        progressEl.style.transform = `scaleX(${ratio})`;
      }

      const offsets = NAV_ITEMS.map((item) => {
        const el = document.getElementById(item.id);
        if (!el) return { id: item.id, top: Infinity };
        return { id: item.id, top: Math.abs(el.getBoundingClientRect().top - 140) };
      });
      offsets.sort((a, b) => a.top - b.top);
      if (offsets[0]) {
        setActiveId(offsets[0].id);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const cycleNextWallpaper = () => {
    const idx = WORLD_BACKDROP_OPTIONS.findIndex((o) => o.id === worldTheme);
    const next = WORLD_BACKDROP_OPTIONS[(idx + 1) % WORLD_BACKDROP_OPTIONS.length];
    onChangeWorldTheme(next.id);
  };

  const currentWallpaperObj =
    WORLD_BACKDROP_OPTIONS.find((o) => o.id === worldTheme) ?? WORLD_BACKDROP_OPTIONS[0];

  return (
    <>
      <div id="scroll-progress-bar" />

      <header className="fixed top-3.5 inset-x-0 z-50 px-3 sm:px-6 pointer-events-none">
        <div
          className={`mx-auto max-w-6xl pointer-events-auto transition-all duration-300 rounded-full border ${
            scrolled
              ? 'bg-[#161832]/65 border-pink-200/30 shadow-[0_20px_50px_-15px_rgba(8,10,28,0.65),inset_0_1px_1px_rgba(255,255,255,0.28)] backdrop-blur-2xl py-2 px-3.5'
              : 'bg-[#181a36]/48 border-white/25 shadow-[inset_0_1px_1px_rgba(255,255,255,0.25)] backdrop-blur-xl py-2.5 px-4'
          }`}
        >
          <div className="flex items-center justify-between gap-2.5">
            {/* 左侧个人极客 × 团子徽标 */}
            <a
              href="#hero"
              className="group flex items-center gap-2.5 rounded-full pr-2 focus:outline-none focus-visible:ring-2 focus-visible:ring-pink-300"
            >
              <div className="relative flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-pink-300 via-amber-200 to-sky-300 p-[1.5px] shadow-[0_0_18px_rgba(244,114,182,0.55)]">
                <div className="flex h-full w-full items-center justify-center rounded-full bg-[#1a1630]">
                  <Heart className="h-3.5 w-3.5 text-pink-300 fill-pink-300/40 transition-transform duration-300 group-hover:scale-115" />
                </div>
              </div>
              <div className="flex flex-col">
                <span className="text-sm font-extrabold tracking-wide text-white flex items-center gap-1.5 drop-shadow">
                  {AUTHOR_PROFILE.name}
                  <span
                    className="inline-block h-2 w-2 rounded-full bg-pink-300 shadow-[0_0_8px_#f9a8d4]"
                    title="光坂春樱画境在线"
                  />
                </span>
                <span className="text-[10px] text-pink-100/80 hidden sm:inline">
                  光坂春樱 · 极客造物空间
                </span>
              </div>
            </a>

            {/* 中部导航胶囊（桌面端，赏景模式下自动收起更清爽） */}
            {!scenicMode && (
              <nav aria-label="主导航" className="hidden xl:flex items-center gap-1">
                {NAV_ITEMS.map((item) => {
                  const isActive = activeId === item.id;
                  return (
                    <a
                      key={item.id}
                      href={`#${item.id}`}
                      className={`relative rounded-full px-3 py-1.5 text-xs font-semibold transition-all ${
                        isActive
                          ? 'bg-pink-400/25 text-white border border-pink-200/40 shadow-[inset_0_1px_0_rgba(255,255,255,0.25)]'
                          : 'text-white/85 hover:text-white hover:bg-white/12'
                      }`}
                    >
                      <span className="flex items-center gap-1">
                        {item.highlight === 'cyan' && (
                          <Zap className="h-3 w-3 text-sky-300" />
                        )}
                        {item.highlight === 'pink' && (
                          <Sparkles className="h-3 w-3 text-pink-300" />
                        )}
                        {item.label}
                      </span>
                    </a>
                  );
                })}
              </nav>
            )}

            {/* 右侧工具舱：一键切背景画境 + 纯净赏景 + 命令面板 + B站/GitHub */}
            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={cycleNextWallpaper}
                className="flex items-center gap-1.5 rounded-full border border-pink-200/35 bg-pink-500/20 hover:bg-pink-500/32 px-3 py-1.5 text-xs font-semibold text-white transition-colors cursor-pointer"
                title="点击切换全站《CLANNAD》高清原作动漫背景"
              >
                <span>{currentWallpaperObj.label.split(' ')[0]}</span>
                <span className="hidden sm:inline">{currentWallpaperObj.shortLabel}</span>
              </button>

              <button
                type="button"
                onClick={onToggleScenicMode}
                className={`flex items-center gap-1 rounded-full border px-2.5 py-1.5 text-xs font-semibold transition-colors cursor-pointer ${
                  scenicMode
                    ? 'border-amber-300/70 bg-amber-400/30 text-amber-50 shadow-[0_0_16px_rgba(251,191,36,0.45)]'
                    : 'border-white/20 bg-white/10 text-white/90 hover:bg-white/20'
                }`}
                title={scenicMode ? '退出纯净赏景模式，恢复页面卡片' : '隐藏卡片文字，全屏欣赏 CLANNAD 动漫背景与音乐'}
              >
                {scenicMode ? <EyeOff className="h-3.5 w-3.5" /> : <Eye className="h-3.5 w-3.5" />}
                <span className="hidden md:inline">{scenicMode ? '恢复界面' : '赏景'}</span>
              </button>

              <button
                type="button"
                onClick={onOpenPalette}
                className="flex items-center gap-1.5 rounded-full border border-white/20 bg-white/10 px-2.5 py-1.5 text-xs text-white/90 hover:border-pink-200/50 hover:text-white transition-colors cursor-pointer"
                title="打开全局命令与点歌面板 (Ctrl + K)"
              >
                <Command className="h-3.5 w-3.5 text-amber-200" />
                <kbd className="hidden lg:inline-block rounded bg-black/30 px-1.5 py-0.5 font-mono text-[10px] text-pink-100 border border-white/15">
                  Ctrl K
                </kbd>
              </button>

              <button
                type="button"
                onClick={onToggleMotion}
                className="hidden sm:flex items-center gap-1 rounded-full border border-white/20 bg-white/10 px-2.5 py-1.5 text-xs text-white/90 hover:bg-white/20 transition-colors cursor-pointer"
                title={motionPaused ? '恢复樱花飘落与光玉动效' : '暂停飘樱与流光动效'}
              >
                {motionPaused ? (
                  <Play className="h-3.5 w-3.5 text-emerald-300" />
                ) : (
                  <Pause className="h-3.5 w-3.5 text-amber-200" />
                )}
              </button>

              <a
                href={AUTHOR_PROFILE.bilibiliUrl}
                target="_blank"
                rel="noopener noreferrer"
                title={`前往哔哩哔哩主页 (UID: ${AUTHOR_PROFILE.bilibiliUid})`}
                className="hidden md:flex items-center gap-1 rounded-full bg-pink-400/25 hover:bg-pink-400/35 border border-pink-200/35 px-2.5 py-1.5 text-xs font-bold text-white transition-colors"
              >
                <span>📺 B站</span>
              </a>

              <a
                href={AUTHOR_PROFILE.githubUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="hidden sm:flex items-center gap-1 rounded-full bg-white/15 hover:bg-white/25 border border-white/25 px-2.5 py-1.5 text-xs font-semibold text-white transition-colors"
              >
                <Github className="h-3.5 w-3.5" />
              </a>

              <button
                type="button"
                onClick={() => setMobileOpen((prev) => !prev)}
                aria-label={mobileOpen ? '收起导航菜单' : '展开导航菜单'}
                className="xl:hidden flex h-8 w-8 items-center justify-center rounded-full border border-white/25 bg-white/10 text-white"
              >
                {mobileOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
              </button>
            </div>
          </div>

          {/* 移动端折叠菜单 */}
          {mobileOpen && (
            <div className="mt-3 pt-3 border-t border-white/20 flex flex-col gap-1.5 xl:hidden px-2 pb-1">
              {NAV_ITEMS.map((item) => (
                <a
                  key={item.id}
                  href={`#${item.id}`}
                  onClick={() => setMobileOpen(false)}
                  className="rounded-xl px-3 py-2 text-sm font-semibold text-white hover:bg-white/15"
                >
                  {item.label}
                </a>
              ))}
            </div>
          )}
        </div>
      </header>
    </>
  );
};
