import React, { useCallback, useEffect, useRef, useState } from 'react';
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
  const [manualOpen, setManualOpen] = useState<boolean>(false);
  const [popoverOpen, setPopoverOpen] = useState<boolean>(false);

  const shellRef = useRef<HTMLDivElement | null>(null);
  const rowRef = useRef<HTMLDivElement | null>(null);
  const brandRef = useRef<HTMLAnchorElement | null>(null);
  const navRef = useRef<HTMLElement | null>(null);
  const actionsRef = useRef<HTMLDivElement | null>(null);
  const menuListRef = useRef<HTMLUListElement | null>(null);
  const isWideRef = useRef<boolean>(false);
  const lastCollapsedWidthRef = useRef<number>(0);
  const manualOpenRef = useRef<boolean>(false);

  manualOpenRef.current = manualOpen;

  const supportsNativePopover =
    typeof HTMLElement !== 'undefined' && Object.hasOwn(HTMLElement.prototype, 'popover');

  const syncLayout = useCallback(
    (force = false) => {
      const shellEl = shellRef.current;
      const rowEl = rowRef.current;
      const brandEl = brandRef.current;
      const navEl = navRef.current;
      const actionsEl = actionsRef.current;
      const menuEl = menuListRef.current;
      if (!shellEl || !rowEl || !brandEl || !actionsEl || !menuEl) return;

      if (scenicMode || !navEl) {
        shellEl.classList.remove('is-wide');
        isWideRef.current = false;
        if (supportsNativePopover) {
          menuEl.removeAttribute('popover');
        }
        return;
      }

      const availableWidth = rowEl.clientWidth;
      if (!force && !isWideRef.current && availableWidth <= lastCollapsedWidthRef.current) {
        lastCollapsedWidthRef.current = availableWidth;
        return;
      }

      const wasOpen = supportsNativePopover
        ? menuEl.matches(':popover-open')
        : manualOpenRef.current;

      shellEl.classList.add('is-measuring', 'is-wide');
      if (supportsNativePopover) {
        menuEl.removeAttribute('popover');
      }

      // 精确累加左、中、右三段真实像素宽度并预留 44px 安全呼吸间距，确保最右侧 GitHub 按钮绝不被挤压或裁切
      const requiredWidth =
        brandEl.offsetWidth + navEl.offsetWidth + actionsEl.offsetWidth + 44;
      const fits = requiredWidth <= availableWidth;

      if (fits) {
        isWideRef.current = true;
        setPopoverOpen(false);
        if (!supportsNativePopover && manualOpenRef.current) {
          setManualOpen(false);
        }
      } else {
        shellEl.classList.remove('is-wide');
        isWideRef.current = false;
        lastCollapsedWidthRef.current = availableWidth;
        if (supportsNativePopover) {
          menuEl.setAttribute('popover', 'auto');
          if (wasOpen) {
            try {
              (menuEl as HTMLElement & { showPopover?: () => void }).showPopover?.();
            } catch {
              // 忽略重复唤起异常
            }
          }
        }
      }

      requestAnimationFrame(() => {
        shellEl.classList.remove('is-measuring');
      });
    },
    [scenicMode, supportsNativePopover],
  );

  useEffect(() => {
    syncLayout(true);

    const rowEl = rowRef.current;
    const menuEl = menuListRef.current;
    const actionsEl = actionsRef.current;

    const ro =
      typeof ResizeObserver !== 'undefined'
        ? new ResizeObserver(() => {
            syncLayout(false);
          })
        : null;

    if (ro && rowEl) {
      ro.observe(rowEl);
      if (menuEl) ro.observe(menuEl);
      if (actionsEl) ro.observe(actionsEl);
    }

    // 监听浏览器缩放 (Ctrl + 滚轮 / 系统 DPI 切换) 强制重算宽度
    const handleForceResize = () => syncLayout(true);
    window.addEventListener('resize', handleForceResize, { passive: true });
    window.visualViewport?.addEventListener('resize', handleForceResize, { passive: true });

    const handleToggle = (e: Event) => {
      const te = e as ToggleEvent;
      if (typeof te.newState === 'string') {
        setPopoverOpen(te.newState === 'open');
      }
    };
    menuEl?.addEventListener('toggle', handleToggle);

    return () => {
      ro?.disconnect();
      window.removeEventListener('resize', handleForceResize);
      window.visualViewport?.removeEventListener('resize', handleForceResize);
      menuEl?.removeEventListener('toggle', handleToggle);
    };
  }, [syncLayout]);

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

  const closeMenuAfterNavigate = () => {
    if (supportsNativePopover) {
      const menuEl = menuListRef.current as (HTMLElement & { hidePopover?: () => void }) | null;
      if (menuEl?.matches(':popover-open')) {
        menuEl.hidePopover?.();
      }
    } else {
      setManualOpen(false);
    }
  };

  const currentWallpaperObj =
    WORLD_BACKDROP_OPTIONS.find((o) => o.id === worldTheme) ?? WORLD_BACKDROP_OPTIONS[0];
  const isMenuOpen = supportsNativePopover ? popoverOpen : manualOpen;

  return (
    <>
      <div id="scroll-progress-bar" />

      <header className="fixed top-3.5 inset-x-0 z-50 px-3 sm:px-6 pointer-events-none">
        <div
          ref={shellRef}
          className={`site-header-shell relative mx-auto max-w-[86rem] pointer-events-auto transition-all duration-300 rounded-full border ${
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

            {/* 中部：单一语义导航树（空间宽裕时内联展开，浏览器放大缩放空间不足时提前收拢进“导览”弹出面板） */}
            {!scenicMode && (
              <nav ref={navRef} aria-label="主导航" className="site-nav flex items-center">
                <button
                  type="button"
                  {...(supportsNativePopover
                    ? ({
                        popovertarget: 'site-nav-menu',
                        popovertargetaction: 'toggle',
                      } as React.ButtonHTMLAttributes<HTMLButtonElement>)
                    : {
                        onClick: () => setManualOpen((prev) => !prev),
                      })}
                  aria-controls="site-nav-menu"
                  aria-expanded={isMenuOpen}
                  className="nav-menu-trigger clannad-pill-btn flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-medium text-pink-50 cursor-pointer"
                >
                  {isMenuOpen ? (
                    <X aria-hidden="true" className="h-3.5 w-3.5" />
                  ) : (
                    <Menu aria-hidden="true" className="h-3.5 w-3.5" />
                  )}
                  <span>导览</span>
                </button>

                <ul
                  id="site-nav-menu"
                  ref={menuListRef}
                  className={`site-nav-list ${!supportsNativePopover && manualOpen ? 'is-manual-open' : ''}`}
                >
                  <li className="site-nav-popover-header px-2.5 py-1 text-[11px] text-pink-200/80 flex items-center justify-between border-b border-pink-200/15 mb-1">
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
                          onClick={closeMenuAfterNavigate}
                          className="site-nav-link flex items-center gap-1.5 rounded-full px-2.5 py-1.5 text-xs font-medium tracking-wide text-pink-50/85 hover:text-white hover:bg-white/10 border border-transparent transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-pink-200"
                        >
                          {isActive && (
                            <SakuraBlossomIcon aria-hidden="true" className="h-3 w-3 shrink-0" />
                          )}
                          <span>{item.label}</span>
                        </a>
                      </li>
                    );
                  })}
                </ul>
              </nav>
            )}

            {/* 右侧：全缩放比例自适应工具舱（保留完整 B站 / GitHub 胶囊且窄屏自动缩为圆章，永不切边） */}
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

              {/* 哔哩哔哩入口（桌面完整显示“B站”，大幅放大缩放窄视口下自动变为完整圆章，绝不切边） */}
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

              {/* GitHub 入口（桌面完整显示“GitHub”，放大缩放空间变窄时先收起中部导航、再平滑缩为完整圆章，永不显示残缺半截） */}
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
