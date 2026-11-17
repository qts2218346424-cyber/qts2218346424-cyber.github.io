import React from 'react';

/** 高定五瓣吉野樱矢量图标（带真实樱瓣分叉缺口与花蕊细节） */
export const SakuraBlossomIcon: React.FC<{ className?: string }> = ({
  className = 'h-4 w-4',
}) => (
  <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
    <defs>
      <linearGradient id="sakuraPetalGrad" x1="2" y1="2" x2="22" y2="22" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stopColor="#ffe4ef" />
        <stop offset="55%" stopColor="#f9a8d4" />
        <stop offset="100%" stopColor="#f472b6" />
      </linearGradient>
    </defs>
    {[0, 72, 144, 216, 288].map((deg) => (
      <path
        key={deg}
        transform={`rotate(${deg} 12 12)`}
        d="M12 11.2 C9.6 8.6, 8.7 4.6, 10.7 2.4 L12 3.8 L13.3 2.4 C15.3 4.6, 14.4 8.6, 12 11.2 Z"
        fill="url(#sakuraPetalGrad)"
      />
    ))}
    <circle cx="12" cy="12" r="2.1" fill="#fde68a" />
  </svg>
);

/** 高定微立体团子纹章（圆润高光 + 经典两竖眼睛） */
export const DangoCharmIcon: React.FC<{
  color?: string;
  cheekColor?: string;
  className?: string;
}> = ({ color = '#fbcfe8', cheekColor = '#f472b6', className = 'h-5 w-5' }) => (
  <svg viewBox="0 0 28 24" fill="none" className={className} aria-hidden="true">
    <path
      d="M3.5 14.5 C3.5 7.5, 8.2 4, 14 4 C19.8 4, 24.5 7.5, 24.5 14.5 C24.5 19.5, 20.5 21.5, 14 21.5 C7.5 21.5, 3.5 19.5, 3.5 14.5 Z"
      fill={color}
      stroke="rgba(255,255,255,0.55)"
      strokeWidth="0.9"
    />
    <ellipse cx="10.5" cy="8" rx="4.5" ry="1.8" fill="rgba(255,255,255,0.55)" transform="rotate(-14 10.5 8)" />
    <line x1="11.2" y1="11.2" x2="11.2" y2="14.4" stroke="#2d2228" strokeWidth="1.6" strokeLinecap="round" />
    <line x1="16.8" y1="11.2" x2="16.8" y2="14.4" stroke="#2d2228" strokeWidth="1.6" strokeLinecap="round" />
    <ellipse cx="8.2" cy="15.2" rx="1.8" ry="1" fill={cheekColor} opacity="0.55" />
    <ellipse cx="19.8" cy="15.2" rx="1.8" ry="1" fill={cheekColor} opacity="0.55" />
  </svg>
);

/** 三色团子微雕组合徽章 */
export const DangoTrioCrest: React.FC<{ className?: string }> = ({ className = '' }) => (
  <span aria-hidden="true" className={`inline-flex items-end -space-x-1 ${className}`}>
    <DangoCharmIcon color="#fbcfe8" cheekColor="#f43f5e" className="h-4 w-4" />
    <DangoCharmIcon color="#bae6fd" cheekColor="#38bdf8" className="h-4.5 w-4.5 relative z-10" />
    <DangoCharmIcon color="#fde68a" cheekColor="#fb923c" className="h-3.5 w-3.5" />
  </span>
);

/** 幻想世界心愿光玉（Hikari Orb）呼吸星芒图标 */
export const HikariOrbIcon: React.FC<{ className?: string }> = ({ className = 'h-4 w-4' }) => (
  <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
    <defs>
      <radialGradient id="hikariGlow" cx="50%" cy="50%" r="50%">
        <stop offset="0%" stopColor="#fffef5" />
        <stop offset="42%" stopColor="#fde68a" />
        <stop offset="78%" stopColor="#f59e0b" stopOpacity="0.45" />
        <stop offset="100%" stopColor="#f59e0b" stopOpacity="0" />
      </radialGradient>
    </defs>
    <circle cx="12" cy="12" r="10" fill="url(#hikariGlow)" />
    <path
      d="M12 4.5 L13.4 10.6 L19.5 12 L13.4 13.4 L12 19.5 L10.6 13.4 L4.5 12 L10.6 10.6 Z"
      fill="#fffbeb"
      opacity="0.92"
    />
  </svg>
);

/** 伊吹风子木雕海星精致金线纹章 */
export const StarfishCharmIcon: React.FC<{ className?: string }> = ({
  className = 'h-4 w-4',
}) => (
  <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
    <path
      d="M12 2.6 L14.7 8.5 L21.1 9.3 L16.3 13.7 L17.6 20.1 L12 16.9 L6.4 20.1 L7.7 13.7 L2.9 9.3 L9.3 8.5 Z"
      fill="rgba(253, 230, 138, 0.25)"
      stroke="#fcd34d"
      strokeWidth="1.5"
      strokeLinejoin="round"
    />
    <circle cx="12" cy="12.2" r="1.3" fill="#fde68a" />
  </svg>
);

/** 官方比例精雕纯矢量 Bilibili 小电视图标（替代粗糙 Emoji） */
export const BilibiliIcon: React.FC<{ className?: string }> = ({ className = 'h-3.5 w-3.5' }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
    <path d="M17.813 4.653h.854c1.51.054 2.769.578 3.773 1.574 1.004.995 1.524 2.249 1.56 3.76v7.36c-.036 1.51-.556 2.769-1.56 3.773s-2.262 1.524-3.773 1.56H5.333c-1.51-.036-2.769-.556-3.773-1.56S.036 18.858 0 17.347v-7.36c.036-1.511.556-2.765 1.56-3.76 1.004-.996 2.262-1.52 3.773-1.574h.774l-1.174-1.12a1.234 1.234 0 0 1-.373-.906c0-.356.124-.658.373-.907l.027-.027c.267-.249.573-.373.92-.373.347 0 .653.124.92.373L9.653 4.44c.071.071.134.142.187.213h4.267a.836.836 0 0 1 .16-.213l2.853-2.747c.267-.249.573-.373.92-.373.347 0 .662.151.929.4.267.249.391.551.391.907 0 .355-.124.657-.373.906zM5.333 7.24c-.746.018-1.373.276-1.88.773-.506.498-.769 1.13-.786 1.894v7.52c.017.764.28 1.395.786 1.893.507.498 1.134.756 1.88.773h13.334c.746-.017 1.373-.275 1.88-.773.506-.498.769-1.129.786-1.893v-7.52c-.017-.765-.28-1.396-.786-1.894-.507-.497-1.134-.755-1.88-.773zM8 11.107c.373 0 .684.124.933.373.25.249.383.569.4.96v1.173c-.017.391-.15.711-.4.96-.249.25-.56.374-.933.374s-.684-.125-.933-.374c-.25-.249-.383-.569-.4-.96V12.44c0-.373.129-.689.386-.947.258-.257.574-.386.947-.386zm8 0c.373 0 .684.124.933.373.25.249.383.569.4.96v1.173c-.017.391-.15.711-.4.96-.249.25-.56.374-.933.374s-.684-.125-.933-.374c-.25-.249-.383-.569-.4-.96V12.44c.017-.391.15-.711.4-.96.249-.249.56-.373.933-.373z" />
  </svg>
);

/** 卡片角落高定烫金樱花细线暗纹（增添京都动画典藏画册高级感） */
export const SakuraCornerFiligree: React.FC<{ position?: 'top-right' | 'bottom-left' }> = ({
  position = 'top-right',
}) => (
  <svg
    viewBox="0 0 120 120"
    fill="none"
    aria-hidden="true"
    className={`pointer-events-none absolute h-28 w-28 opacity-30 ${
      position === 'top-right' ? 'top-0 right-0' : 'bottom-0 left-0 rotate-180'
    }`}
  >
    <path
      d="M120 0 C92 12, 74 34, 62 66 M95 16 C82 14, 70 18, 62 28 M104 38 C95 44, 86 54, 84 68"
      stroke="url(#filigreeGold)"
      strokeWidth="1.1"
      strokeLinecap="round"
    />
    <circle cx="62" cy="66" r="2.5" fill="#fde68a" />
    <circle cx="62" cy="28" r="2" fill="#fbcfe8" />
    <circle cx="84" cy="68" r="1.8" fill="#fbcfe8" />
    <defs>
      <linearGradient id="filigreeGold" x1="120" y1="0" x2="50" y2="80" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stopColor="#fde68a" />
        <stop offset="60%" stopColor="#f9a8d4" />
        <stop offset="100%" stopColor="#f9a8d4" stopOpacity="0" />
      </linearGradient>
    </defs>
  </svg>
);
