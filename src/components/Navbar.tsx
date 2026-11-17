import React, { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react';
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
  { id: 'hero', label: '樱坡序章' },
  { id: 'coreforge', label: 'CoreForge 研核' },
  { id: 'antigravity', label: '反重力汉化' },
  { id: 'clannad', label: '光坂纪念馆' },
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
  const [isWide, setIsWide] = useState<boolean>(true);
  const [menuOpen, setMenuOpen] = useState<boolean>(false);

  const rowRef = useRef<HTMLDivElement | null>(null);
  const brandRef = useRef<HTMLAnchorElement | null>(null);
  const triggerRef = useRef<HTMLButtonElement | null>(null);
  const menuListRef = useRef<HTMLUListElement | null>(null);
  const actionsRef = useRef<HTMLDivElement | null>(null);
  const navInlineWidthRef = useRef<number>(540);
  const isWideStateRef = useRef<boolean>(true);

  isWideStateRef.current = isWide;

  const measureAndSyncLayout = useCallback(() => {
    const rowEl = rowRef.current;
    const brandEl = brandRef.current;
    const actionsEl = actionsRef.current;
    const menuEl = menuListRef.current;
    if (!rowEl || !brandEl || !actionsEl) return;

    if (scenicMode) {
      setIsWide(false);
      setMenuOpen(false);
      return;
    }

    // 当前处于内联展开态时，实时刷新 7 个导航胶囊的真实总像素宽度
    if (isWideStateRef.current && menuEl && menuEl.offsetWidth > 0) {
      navInlineWidthRef.current = menuEl.offsetWidth;
    }

    const availableWidth = rowEl.clientWidth;
    const requiredWidth =
      brandEl.offsetWidth + navInlineWidthRef.current + actionsEl.offsetWidth + 44;
    const nextIsWide = requiredWidth <= availableWidth;

    setIsWide((prev) => {
      if (prev !== nextIsWide && nextIsWide) {
        setMenuOpen(false);
      }
      return nextIsWide;
    });
  }, [scenicMode]);

  // 首帧绘制前同步测量，消除窄屏/高缩放首屏闪烁
  useLayoutEffect(() => {
    measureAndSyncLayout();
  }, [measureAndSyncLayout]);

  useEffect(() => {
    const rowEl = rowRef.current;
    const actionsEl = actionsRef.current;

    const ro =
      typeof ResizeObserver !== 'undefined'
        ? new ResizeObserver(() => {
            measureAndSyncLayout();
          })
        : null;

    if (ro && rowEl) {
      ro.observe(rowEl);
      if (actionsEl) ro.observe(actionsEl);
    }

    window.addEventListener('resize', measureAndSyncLayout, { passive: true });
    window.visualViewport?.addEventListener('resize', measureAndSyncLayout, { passive: true });
    void document.fonts?.ready?.then(() => {
      measureAndSyncLayout();
    });

    return () => {
      ro?.disconnect();
      window.removeEventListener('resize', measureAndSyncLayout);
      window.visualViewport?.removeEventListener('resize', measureAndSyncLayout);
    };
  }, [measureAndSyncLayout]);

  // 导览下拉面板打开时：点击外部空白区域或按 Esc 键自动轻触关闭
  useEffect(() => {
    if (!menuOpen) return;

    const handlePointerDownOutside = (e: PointerEvent) => {
      const target = e.target as Node | null;
      if (!target) return;
      if (menuListRef.current?.contains(target) || triggerRef.current?.contains(target)) {
        return;
      }
      setMenuOpen(false);
    };

    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setMenuOpen(false);
        triggerRef.current?.focus();
      }
    };

    document.addEventListener('pointerdown', handlePointerDownOutside);
    document.addEventListener('keydown', handleEscape);
    return () => {
      document.removeEventListener('pointerdown', handlePointerDownOutside);
      document.removeEventListener('keydown', handleEscape);
    };
  }, [menuOpen]);

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
          className={`site-header-shell ${isWide && !scenicMode ? 'is-wide' : ''} relative mx-auto max-w-[86rem] pointer-events-auto transition-all duration-300 rounded-full border ${
            scrolled
              ? 'bg-[#19162b]/76 border-pink-200/35 shadow-[0_20px_50px_-15px_rgba(10,8,24,0.72),inset_0_1px_0_rgba(255,248,252,0.35)] backdrop-blur-2xl py-2 px-3.5 sm:px-5'
              : 'bg-[#1b172e]/58 border-pink-100/28 shadow-[0_14px_38px_-12px_rgba(10,8,24,0.52),inset_0_1px_0_rgba(255,248,252,0.3)] backdrop-blur-2xl py-2 px-3.5 sm:px-5'
          }`}
        >
          {/* 顶栏上沿香槟樱金微距流光丝线 */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-x-14 top-0 h-[1px] bg-gradient-to-r from-transparent via-amber-200/65 to-transparent"
          />

          <div ref={rowRef} className="site-header-row flex items-center justify-between gap-2 sm:gap-3">
            {/* 左侧：高定微立体粉团子 × 主理人铭牌 */}
            <a
              ref={brandRef}
              href="#hero"
              className="site-brand group flex items-center gap-2 sm:gap-2.5 rounded-full pr-1 focus:outline-none focus-visible:ring-2 focus-visible:ring-pink-200"
            >
              <div className="relative flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-pink-200 via-amber-200 to-sky-200 p-[1px] shadow-[0_0_18px_rgba(249,168,212,0.45)]">
                <div className="flex h-full w-full items-center justify-center rounded-full bg-gradient-to-b from-[#2a203b] to-[#1a1528]">
                  <DangoCharmIcon
                    color="#fbcfe8"
                    cheekColor="#f43f5e"
                    className="h-5 w-5 transition-transform duration-300 group-hover:scale-110 group-hover:-rotate-6"
                  />
                </div>
                <SakuraBlossomIcon
                  aria-hidden="true"
                  className="absolute -top-1 -right-1 h-3 w-3 drop-shadow"
                />
              </div>

              <div className="flex flex-col leading-tight">
                <span className="text-sm font-bold tracking-wide text-white flex items-center gap-1.5">
                  <span className="font-clannad-serif tracking-wider">{AUTHOR_PROFILE.name}</span>
                  <HikariOrbIcon aria-hidden="true" className="h-3.5 w-3.5 animate-pulse" />
                </span>
                <span className="text-[10px] tracking-wider text-pink-100/70 hidden 2xl:inline">
                  光坂春樱 · 极客造物空间
                </span>
              </div>
            </a>

            {/* 中部：单一语义导航树（宽屏内联展开，空间不足时由“导览”按钮一键开关右下方琉璃面板） */}
            {!scenicMode && (
              <nav aria-label="主导航" className="site-nav flex items-center">
                <button
                  ref={triggerRef}
                  type="button"
                  onClick={() => setMenuOpen((prev) => !prev)}
                  aria-controls="site-nav-menu"
                  aria-expanded={menuOpen}
                  className={`nav-menu-trigger flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-medium cursor-pointer transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-pink-200 ${
                    menuOpen
                      ? 'border border-pink-200/65 bg-pink-300/25 text-white shadow-[0_0_16px_rgba(249,168,212,0.35)]'
                      : 'clannad-pill-btn text-pink-50'
                  }`}
                >
                  {menuOpen ? (
                    <X aria-hidden="true" className="h-3.5 w-3.5" />
                  ) : (
                    <Menu aria-hidden="true" className="h-3.5 w-3.5" />
                  )}
                  <span>导览</span>
                </button>

                <ul
                  id="site-nav-menu"
                  ref={menuListRef}
                  className={`site-nav-list ${menuOpen ? 'is-open' : ''}`}
                >
                  <li className="site-nav-popover-header px-2.5 py-1.5 text-[11px] text-pink-200/85 flex items-center justify-between border-b border-pink-200/15 mb-1">
                    <span>光坂坡道 · 章节导览</span>
                    <DangoTrioCrest />
                  </li>
                  {NAV_ITEMS.map((item) => {
                    const isActive = activeId === item.id;
                    return (
                      <li key={item.id}>
                        <a
                          href={`#${item.id}`}
                          aria-current={isActive ? 'page' : undefined}
                          onClick={() => setMenuOpen(false)}
                          className="site-nav-link flex items-center gap-1.5 rounded-full px-2.5 py-1.5 text-xs font-medium tracking-wide text-pink-50/85 hover:text-white hover:bg-white/12 border border-transparent transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-pink-200"
                        >
                          <SakuraBlossomIcon
                            aria-hidden="true"
                            className={`h-3 w-3 shrink-0 transition-opacity ${
                              isActive ? 'opacity-100' : isWide ? 'hidden' : 'opacity-50'
                            }`}
                          />
                          <span>{item.label}</span>
                        </a>
                      </li>
                    );
                  })}
                </ul>
              </nav>
            )}

            {/* 右侧：全缩放比例自适应工具舱 */}
            <div ref={actionsRef} className="site-actions flex items-center gap-1.5">
              {/* 画境切换胶囊 */}
              <button
                type="button"
                onClick={cycleNextWallpaper}
                className="clannad-pill-btn flex items-center justify-center gap-1.5 rounded-full h-8 w-8 md:w-auto md:px-3 text-xs font-medium text-pink-50 cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-pink-200"
                title={`当前画境：${currentWallpaperObj.label}（点击切换《CLANNAD》原作背景）`}
              >
                <SakuraBlossomIcon aria-hidden="true" className="h-3.5 w-3.5 shrink-0" />
                <span className="hidden md:inline">{currentWallpaperObj.shortLabel}</span>
              </button>

              {/* 光玉快速指令钮 (Ctrl K) */}
              <button
                type="button"
                onClick={onOpenPalette}
                aria-label="打开全局指令与点歌面板 (Ctrl + K)"
                title="唤起光玉全局指令与原声点歌台 (Ctrl + K)"
                className="clannad-pill-btn flex items-center justify-center gap-1.5 rounded-full h-8 w-8 md:w-auto md:px-2.5 text-xs font-medium text-pink-50 cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-pink-200"
              >
                <HikariOrbIcon aria-hidden="true" className="h-3.5 w-3.5 shrink-0" />
                <kbd className="hidden md:inline-block rounded-md bg-[#231b34]/85 px-1.5 py-0.5 font-mono text-[10px] leading-none text-amber-100/95 border border-pink-200/25">
                  Ctrl K
                </kbd>
              </button>

              {/* 纯净赏景模式钮 */}
              <button
                type="button"
                onClick={onToggleScenicMode}
                aria-label={scenicMode ? '退出赏景模式并恢复界面' : '进入纯净赏景模式'}
                title={scenicMode ? '恢复页面卡片' : '纯净赏景：隐藏文字卡片，全屏欣赏 CLANNAD 原作风景与配乐'}
                className={`flex items-center justify-center gap-1.5 rounded-full text-xs font-medium cursor-pointer transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-200 ${
                  scenicMode
                    ? 'border border-amber-200/70 bg-amber-300/30 text-amber-50 h-8 px-3 shadow-[0_0_18px_rgba(253,230,138,0.45)]'
                    : 'clannad-pill-btn h-8 w-8 text-pink-50/90'
                }`}
              >
                {scenicMode ? (
                  <>
                    <EyeOff aria-hidden="true" className="h-3.5 w-3.5 text-amber-200" />
                    <span>恢复界面</span>
                  </>
                ) : (
                  <Eye aria-hidden="true" className="h-3.5 w-3.5 text-pink-200" />
                )}
              </button>

              {/* 飘樱与光玉动效启停钮 */}
              <button
                type="button"
                onClick={onToggleMotion}
                aria-label={motionPaused ? '恢复樱花飘落动效' : '暂停樱花飘落动效'}
                title={motionPaused ? '恢复樱花飘落与光玉动效' : '暂停飘樱与流光动效'}
                className="clannad-pill-btn hidden sm:flex h-8 w-8 items-center justify-center rounded-full text-amber-100 cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-pink-200"
              >
                {motionPaused ? (
                  <Play aria-hidden="true" className="h-3.5 w-3.5 text-emerald-200" />
                ) : (
                  <Pause aria-hidden="true" className="h-3.5 w-3.5 text-amber-200" />
                )}
              </button>

              {/* 哔哩哔哩入口 */}
              <a
                href={AUTHOR_PROFILE.bilibiliUrl}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="前往哔哩哔哩主页"
                title={`前往哔哩哔哩主页 (UID: ${AUTHOR_PROFILE.bilibiliUid})`}
                className="clannad-pill-btn hidden sm:flex h-8 w-8 lg:w-auto lg:px-2.5 items-center justify-center gap-1.5 rounded-full text-xs font-medium text-pink-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-pink-200"
              >
                <BilibiliIcon aria-hidden="true" className="h-3.5 w-3.5 text-pink-300 shrink-0" />
                <span className="hidden lg:inline">B站</span>
              </a>

              {/* GitHub 入口 */}
              <a
                href={AUTHOR_PROFILE.githubUrl}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="访问 GitHub 开源主页"
                title="访问 GitHub 开源主页"
                className="clannad-pill-btn hidden sm:flex h-8 w-8 lg:w-auto lg:px-2.5 items-center justify-center gap-1.5 rounded-full text-xs font-medium text-pink-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-pink-200"
              >
                <Github aria-hidden="true" className="h-3.5 w-3.5 text-amber-100 shrink-0" />
                <span className="hidden lg:inline">GitHub</span>
              </a>
            </div>
          </div>
        </div>
      </header>
    </>
  );
};
