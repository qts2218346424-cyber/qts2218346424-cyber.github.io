import React, { useEffect, useState } from 'react';
import {
  Eye,
  EyeOff,
  Github,
  Menu,
  Pause,
  Play,
  X,
} from 'lucide-react';
import { AUTHOR_PROFILE } from '../data/siteData';
import { ClannadWorldTheme, WORLD_BACKDROP_OPTIONS } from './ClannadBackdrop';
import {
  BilibiliIcon,
  DangoCharmIcon,
  DangoTrioCrest,
  HikariOrbIcon,
  SakuraBlossomIcon,
} from './ClannadMotifs';

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
  { id: 'hero', label: '樱坡序章', motif: 'sakura' },
  { id: 'coreforge', label: 'CoreForge 研核', motif: 'orb' },
  { id: 'antigravity', label: '反重力汉化', motif: 'dango' },
  { id: 'clannad', label: '光坂纪念馆', motif: 'starfish' },
  { id: 'matrix', label: '项目矩阵' },
  { id: 'blog', label: '架构手记' },
  { id: 'contact', label: '星海联络' },
] as const;

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
          className={`relative mx-auto max-w-7xl pointer-events-auto transition-all duration-300 rounded-full border overflow-hidden ${
            scrolled
              ? 'bg-[#19162b]/72 border-pink-200/35 shadow-[0_20px_50px_-15px_rgba(10,8,24,0.7),inset_0_1px_0_rgba(255,248,252,0.35)] backdrop-blur-2xl py-2 px-3.5 sm:px-4'
              : 'bg-[#1b172e]/56 border-pink-100/28 shadow-[0_14px_38px_-12px_rgba(10,8,24,0.5),inset_0_1px_0_rgba(255,248,252,0.3)] backdrop-blur-2xl py-2.5 px-4'
          }`}
        >
          {/* 顶栏上沿香槟樱金微距流光丝线 */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-x-12 top-0 h-[1px] bg-gradient-to-r from-transparent via-amber-200/65 to-transparent"
          />

          <div className="flex items-center justify-between gap-2 whitespace-nowrap">
            {/* 左侧：高定微立体粉团子 × 心愿光玉主理人铭牌 */}
            <a
              href="#hero"
              className="group shrink-0 flex items-center gap-2.5 rounded-full pr-1 focus:outline-none focus-visible:ring-2 focus-visible:ring-pink-200"
            >
              <div className="relative flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-pink-200 via-amber-200 to-sky-200 p-[1px] shadow-[0_0_20px_rgba(249,168,212,0.45)]">
                <div className="flex h-full w-full items-center justify-center rounded-full bg-gradient-to-b from-[#2a203b] to-[#1a1528]">
                  <DangoCharmIcon
                    color="#fbcfe8"
                    cheekColor="#f43f5e"
                    className="h-6 w-6 transition-transform duration-300 group-hover:scale-110 group-hover:-rotate-6"
                  />
                </div>
                <SakuraBlossomIcon className="absolute -top-1 -right-1 h-3.5 w-3.5 drop-shadow" />
              </div>

              <div className="flex flex-col">
                <span className="text-sm font-bold tracking-wide text-white flex items-center gap-1.5">
                  <span className="font-clannad-serif tracking-wider">{AUTHOR_PROFILE.name}</span>
                  <HikariOrbIcon className="h-4 w-4 animate-pulse" />
                </span>
                <span className="text-[10px] tracking-widest text-pink-100/75 hidden sm:inline">
                  光坂春樱 · 团子与星海造物所
                </span>
              </div>
            </a>

            {/* 中部：典藏级樱白丝绒导航胶囊（xl 展开全部，仅激活项点缀五瓣樱确保修长留白） */}
            {!scenicMode && (
              <nav aria-label="主导航" className="hidden xl:flex items-center gap-0.5 shrink-0">
                {NAV_ITEMS.map((item) => {
                  const isActive = activeId === item.id;
                  return (
                    <a
                      key={item.id}
                      href={`#${item.id}`}
                      className={`relative whitespace-nowrap rounded-full px-2.5 py-1.5 text-xs font-medium tracking-wide transition-all ${
                        isActive
                          ? 'bg-gradient-to-r from-pink-300/25 via-amber-200/20 to-pink-300/25 text-white border border-pink-200/45 shadow-[inset_0_1px_0_rgba(255,255,255,0.32),0_0_16px_rgba(249,168,212,0.25)]'
                          : 'text-pink-50/80 hover:text-white hover:bg-white/10 border border-transparent'
                      }`}
                    >
                      <span className="flex items-center gap-1">
                        {isActive && <SakuraBlossomIcon className="h-3 w-3 shrink-0" />}
                        <span>{item.label}</span>
                      </span>
                    </a>
                  );
                })}
              </nav>
            )}

            {/* 右侧：全套高定 CLANNAD 珠宝级微光胶囊控件组（零粗糙 Emoji） */}
            <div className="flex items-center gap-1.5 shrink-0 whitespace-nowrap">
              {/* 画境切换钮 */}
              <button
                type="button"
                onClick={cycleNextWallpaper}
                className="clannad-pill-btn flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-medium text-pink-50 cursor-pointer"
                title="切换全站《CLANNAD》高清原作动漫背景"
              >
                <SakuraBlossomIcon className="h-3.5 w-3.5" />
                <span className="hidden sm:inline">{currentWallpaperObj.shortLabel}</span>
              </button>

              {/* 纯净赏景模式钮 */}
              <button
                type="button"
                onClick={onToggleScenicMode}
                className={`flex items-center gap-1.5 rounded-full px-2.5 py-1.5 text-xs font-medium cursor-pointer transition-all ${
                  scenicMode
                    ? 'border border-amber-200/70 bg-amber-300/30 text-amber-50 shadow-[0_0_18px_rgba(253,230,138,0.45)]'
                    : 'clannad-pill-btn text-pink-50/90'
                }`}
                title={scenicMode ? '恢复页面卡片' : '隐藏文字卡片，全屏欣赏 CLANNAD 原作风景与配乐'}
              >
                {scenicMode ? (
                  <EyeOff className="h-3.5 w-3.5 text-amber-200" />
                ) : (
                  <Eye className="h-3.5 w-3.5 text-pink-200" />
                )}
                <span className="hidden md:inline">{scenicMode ? '恢复界面' : '赏景'}</span>
              </button>

              {/* 光玉快速指令钮 (Ctrl K) */}
              <button
                type="button"
                onClick={onOpenPalette}
                className="clannad-pill-btn flex items-center gap-1.5 rounded-full px-2.5 py-1.5 text-xs font-medium text-pink-50 cursor-pointer"
                title="唤起光玉全局指令与原声点歌台 (Ctrl + K)"
              >
                <HikariOrbIcon className="h-3.5 w-3.5 shrink-0" />
                <span className="hidden sm:inline">指令</span>
                <kbd className="hidden md:inline-block rounded-md bg-[#231b34]/85 px-1.5 py-0.5 font-mono text-[10px] text-amber-100/90 border border-pink-200/25 shadow-inner">
                  Ctrl K
                </kbd>
              </button>

              {/* 飘樱与光玉动效启停钮 */}
              <button
                type="button"
                onClick={onToggleMotion}
                aria-label={motionPaused ? '恢复樱花飘落动效' : '暂停樱花飘落动效'}
                title={motionPaused ? '恢复樱花飘落与光玉动效' : '暂停飘樱与流光动效'}
                className="clannad-pill-btn hidden sm:flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-amber-100 cursor-pointer"
              >
                {motionPaused ? (
                  <Play className="h-3.5 w-3.5 text-emerald-200" />
                ) : (
                  <Pause className="h-3.5 w-3.5 text-amber-200" />
                )}
              </button>

              {/* 纯矢量精雕 Bilibili 胶囊 */}
              <a
                href={AUTHOR_PROFILE.bilibiliUrl}
                target="_blank"
                rel="noopener noreferrer"
                title={`前往哔哩哔哩主页 (UID: ${AUTHOR_PROFILE.bilibiliUid})`}
                className="clannad-pill-btn hidden sm:flex items-center gap-1.5 rounded-full px-2.5 py-1.5 text-xs font-medium text-pink-100"
              >
                <BilibiliIcon className="h-3.5 w-3.5 text-pink-300 shrink-0" />
                <span>B站</span>
              </a>

              {/* GitHub 胶囊 */}
              <a
                href={AUTHOR_PROFILE.githubUrl}
                target="_blank"
                rel="noopener noreferrer"
                title="访问 GitHub 开源主页"
                className="clannad-pill-btn hidden sm:flex items-center gap-1.5 rounded-full px-2.5 py-1.5 text-xs font-medium text-pink-50"
              >
                <Github className="h-3.5 w-3.5 text-amber-100 shrink-0" />
                <span className="hidden 2xl:inline">GitHub</span>
              </a>

              {/* 窄屏折叠菜单按钮 */}
              <button
                type="button"
                onClick={() => setMobileOpen((prev) => !prev)}
                aria-label={mobileOpen ? '收起导航菜单' : '展开导航菜单'}
                className="clannad-pill-btn xl:hidden flex h-8 w-8 items-center justify-center rounded-full text-pink-50 cursor-pointer"
              >
                {mobileOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
              </button>
            </div>
          </div>

          {/* 展开态下拉菜单：融入团子徽章与温润雾樱卡片 */}
          {mobileOpen && (
            <div className="mt-3 pt-3 border-t border-pink-200/20 flex flex-col gap-1.5 xl:hidden px-2 pb-1.5">
              <div className="px-3 py-1 text-[11px] text-pink-200/80 flex items-center justify-between">
                <span>光坂坡道 · 章节导览</span>
                <DangoTrioCrest />
              </div>
              {NAV_ITEMS.map((item) => (
                <a
                  key={item.id}
                  href={`#${item.id}`}
                  onClick={() => setMobileOpen(false)}
                  className="rounded-xl px-3 py-2 text-sm font-medium text-pink-50 hover:bg-pink-300/15 flex items-center gap-2"
                >
                  <SakuraBlossomIcon className="h-3.5 w-3.5" />
                  <span>{item.label}</span>
                </a>
              ))}
            </div>
          )}
        </div>
      </header>
    </>
  );
};
