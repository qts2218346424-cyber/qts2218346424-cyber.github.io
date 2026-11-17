import React, { useCallback, useEffect, useState } from 'react';
import { Navbar } from './components/Navbar';
import { HeroSection } from './components/HeroSection';
import { CoreForgeShowcase } from './components/CoreForgeShowcase';
import { AntigravityShowcase } from './components/AntigravityShowcase';
import { ClannadSanctuary } from './components/ClannadSanctuary';
import { ClannadMusicPlayer } from './components/ClannadMusicPlayer';
import { ClannadBackdrop, ClannadWorldTheme } from './components/ClannadBackdrop';
import { BentoMatrix } from './components/BentoMatrix';
import { BlogSection } from './components/BlogSection';
import { CommandPalette } from './components/CommandPalette';
import { FooterSection } from './components/FooterSection';
import { BlogPost } from './data/siteData';
import { ClannadTrackId } from './data/clannadData';

/** 章节之间温馨的 CLANNAD 三色团子与光玉分隔饰带 */
const DangoSectionDivider: React.FC = () => (
  <div aria-hidden="true" className="mx-auto max-w-4xl py-2 flex items-center justify-center gap-4">
    <div className="h-px flex-1 bg-gradient-to-r from-transparent via-pink-200/45 to-amber-200/55" />
    <div className="flex items-center gap-2 rounded-full border border-white/25 bg-[#181834]/45 px-3 py-1 backdrop-blur-md shadow-sm">
      <span className="h-2.5 w-2.5 rounded-full bg-pink-300 shadow-[0_0_8px_#f9a8d4]" />
      <span className="h-2.5 w-2.5 rounded-full bg-sky-300 shadow-[0_0_8px_#7dd3fc]" />
      <span className="h-2.5 w-2.5 rounded-full bg-amber-200 shadow-[0_0_8px_#fde68a]" />
    </div>
    <div className="h-px flex-1 bg-gradient-to-l from-transparent via-pink-200/45 to-amber-200/55" />
  </div>
);

export const App: React.FC = () => {
  const [motionPaused, setMotionPaused] = useState<boolean>(false);
  const [paletteOpen, setPaletteOpen] = useState<boolean>(false);
  const [externalBlogPost, setExternalBlogPost] = useState<BlogPost | null>(null);
  const [requestedTrack, setRequestedTrack] = useState<{
    id: ClannadTrackId;
    nonce: number;
  } | null>(null);
  const [voiceDucking, setVoiceDucking] = useState<boolean>(false);

  // 全站 CLANNAD 原作高清动漫背景引擎状态（默认开启四季随滚动流转，首屏即光坂春樱坡道！）
  const [worldTheme, setWorldTheme] = useState<ClannadWorldTheme>('auto');
  const [activeScrollScene, setActiveScrollScene] =
    useState<Exclude<ClannadWorldTheme, 'auto'>>('sakura');
  const [scenicMode, setScenicMode] = useState<boolean>(false);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setPaletteOpen((prev) => !prev);
      } else if (e.key === 'Escape' && scenicMode) {
        setScenicMode(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [scenicMode]);

  // 监听滚动位置，在 auto 模式下平滑流转春樱坡道 → 盛夏向日葵花海 → 幻想世界星海光玉
  useEffect(() => {
    const updateSceneByScroll = () => {
      const y = window.scrollY;
      const vh = Math.max(700, window.innerHeight);
      if (y < vh * 0.85) {
        setActiveScrollScene('sakura');
      } else if (y < vh * 2.05) {
        setActiveScrollScene('sunflower');
      } else {
        setActiveScrollScene('orbs');
      }
    };
    window.addEventListener('scroll', updateSceneByScroll, { passive: true });
    updateSceneByScroll();
    return () => window.removeEventListener('scroll', updateSceneByScroll);
  }, []);

  const handleToggleMotion = useCallback(() => {
    setMotionPaused((prev) => !prev);
  }, []);

  const handleClearExternalPost = useCallback(() => {
    setExternalBlogPost(null);
  }, []);

  const handlePlayClannadTrack = useCallback((id: ClannadTrackId) => {
    setRequestedTrack({ id, nonce: Date.now() });
  }, []);

  return (
    <div className="relative min-h-screen text-[#fdf8fc]">
      {/* 全屏固定底层：CLANNAD 京都动画原作风超清风景画卷 + 立体樱花雨与心愿光玉 */}
      <ClannadBackdrop
        theme={worldTheme}
        activeScrollScene={activeScrollScene}
        motionPaused={motionPaused}
        scenicMode={scenicMode}
      />

      {/* 顶部悬浮水晶导航栏 */}
      <Navbar
        motionPaused={motionPaused}
        onToggleMotion={handleToggleMotion}
        onOpenPalette={() => setPaletteOpen(true)}
        worldTheme={worldTheme}
        onChangeWorldTheme={setWorldTheme}
        scenicMode={scenicMode}
        onToggleScenicMode={() => setScenicMode((v) => !v)}
      />

      {/* 纯净赏景模式浮动提示胶囊 */}
      {scenicMode && (
        <div className="fixed bottom-5 left-5 z-50 rounded-full border border-pink-200/45 bg-[#181632]/75 px-4 py-2 text-xs font-semibold text-pink-100 backdrop-blur-xl shadow-lg flex items-center gap-3">
          <span>🌸 正在沉浸欣赏《CLANNAD》高清动态画境（按 Esc 或点击顶栏「恢复界面」返回）</span>
        </div>
      )}

      {/* 主体内容流（赏景模式下丝滑淡出，完整露出背后的樱花坡道与向日葵花海） */}
      <main
        className={`relative z-10 transition-opacity duration-500 ${
          scenicMode ? 'opacity-0 pointer-events-none select-none' : 'opacity-100'
        }`}
      >
        <HeroSection
          motionPaused={motionPaused}
          onPlayClannadTrack={handlePlayClannadTrack}
          worldTheme={worldTheme}
          onChangeWorldTheme={setWorldTheme}
        />

        <DangoSectionDivider />

        {/* 王牌旗舰 01：CoreForge 研核沉浸式交互展台 */}
        <CoreForgeShowcase />

        <DangoSectionDivider />

        {/* 王牌旗舰 02：Antigravity Studio 反重力汉化与光学换肤实时体验舱 */}
        <AntigravityShowcase />

        <DangoSectionDivider />

        {/* 🌸 精神原乡：光坂坡道与星海光玉 · CLANNAD 永恒纪念馆 */}
        <ClannadSanctuary
          motionPaused={motionPaused}
          onPlayTrack={handlePlayClannadTrack}
          onVoiceDuckChange={setVoiceDucking}
        />

        <DangoSectionDivider />

        {/* 珠光水晶 Bento 工程矩阵与全部项目传送门 */}
        <BentoMatrix motionPaused={motionPaused} />

        <DangoSectionDivider />

        {/* 深度技术架构专栏与原生 Top-Layer 阅读器 */}
        <BlogSection
          externalPostToOpen={externalBlogPost}
          onClearExternalPost={handleClearExternalPost}
        />

        <FooterSection />
      </main>

      {/* 右下角全局悬浮：星海黑胶八音盒 · CLANNAD 4 首全长原声在线可切换播放器 */}
      <ClannadMusicPlayer
        requestedTrack={requestedTrack}
        voiceDucking={voiceDucking}
      />

      {/* Ctrl + K 全局命令与点歌面板 */}
      <CommandPalette
        isOpen={paletteOpen}
        onClose={() => setPaletteOpen(false)}
        motionPaused={motionPaused}
        onToggleMotion={handleToggleMotion}
        onSelectBlogPost={(post) => setExternalBlogPost(post)}
        onPlayClannadTrack={handlePlayClannadTrack}
      />
    </div>
  );
};

export default App;
