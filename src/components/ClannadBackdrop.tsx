import React, { useEffect, useRef } from 'react';

export type ClannadWorldTheme =
  | 'auto'
  | 'sakura'
  | 'sunflower'
  | 'orbs'
  | 'reunion';

export interface WorldBackdropOption {
  id: ClannadWorldTheme;
  label: string;
  shortLabel: string;
  badge: string;
}

export const WORLD_BACKDROP_OPTIONS: WorldBackdropOption[] = [
  { id: 'auto', label: '四季流转', shortLabel: '四季流转', badge: '随滚动自动切换名场面背景' },
  { id: 'sakura', label: '光坂春樱', shortLabel: '春樱坡道', badge: '清晨满开吉野樱与蔚蓝晴空' },
  { id: 'sunflower', label: '盛夏花海', shortLabel: '盛夏花海', badge: '第18话向日葵花田与积雨云' },
  { id: 'orbs', label: '星海光玉', shortLabel: '星海光玉', badge: '璀璨银河与漫天升腾心愿光玉' },
  { id: 'reunion', label: '全员重逢', shortLabel: '全员合照', badge: '朋也·渚·汐与伙伴们全员大合照' },
];

const SCENE_WALLPAPERS: Record<Exclude<ClannadWorldTheme, 'auto'>, {
  src: string;
  tintOverlay: string;
}> = {
  sakura: {
    src: './clannad/gallery/clannad_bg_sakura_slope.jpg',
    tintOverlay:
      'linear-gradient(180deg, rgba(16, 20, 42, 0.24) 0%, rgba(20, 16, 36, 0.34) 55%, rgba(12, 14, 28, 0.52) 100%)',
  },
  sunflower: {
    src: './clannad/gallery/clannad_bg_sunflower_sea.jpg',
    tintOverlay:
      'linear-gradient(180deg, rgba(14, 24, 48, 0.22) 0%, rgba(26, 20, 32, 0.36) 58%, rgba(12, 14, 28, 0.54) 100%)',
  },
  orbs: {
    src: './clannad/gallery/clannad_bg_illusionary_world.jpg',
    tintOverlay:
      'linear-gradient(180deg, rgba(8, 12, 28, 0.22) 0%, rgba(12, 16, 36, 0.34) 58%, rgba(8, 10, 22, 0.50) 100%)',
  },
  reunion: {
    src: './clannad/gallery/clannad_grand_reunion.jpg',
    tintOverlay:
      'linear-gradient(180deg, rgba(16, 18, 38, 0.30) 0%, rgba(22, 16, 36, 0.42) 55%, rgba(12, 14, 28, 0.58) 100%)',
  },
};

interface ClannadBackdropProps {
  theme: ClannadWorldTheme;
  activeScrollScene: Exclude<ClannadWorldTheme, 'auto'>;
  motionPaused: boolean;
  scenicMode: boolean;
}

interface SakuraOrOrbParticle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  kind: 'petal' | 'orb';
  angle: number;
  spin: number;
  flipPhase: number;
  flipSpeed: number;
  alpha: number;
  warmGold: boolean;
}

export const ClannadBackdrop: React.FC<ClannadBackdropProps> = ({
  theme,
  activeScrollScene,
  motionPaused,
  scenicMode,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const pausedRef = useRef<boolean>(motionPaused);
  const effectiveScene: Exclude<ClannadWorldTheme, 'auto'> =
    theme === 'auto' ? activeScrollScene : theme;
  const sceneRef = useRef(effectiveScene);

  pausedRef.current = motionPaused;
  sceneRef.current = effectiveScene;

  // 全屏京都动画级立体飘樱 + 升腾心愿光玉粒子画布
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);
    let rafId = 0;

    const pointer = { x: -9999, y: -9999, active: false };

    const createParticles = (): SakuraOrOrbParticle[] => {
      const total = Math.min(68, Math.max(36, Math.floor((width * height) / 26000)));
      return Array.from({ length: total }, (_, i) => {
        const isOrb = i % 3 === 0;
        return {
          x: Math.random() * width,
          y: Math.random() * height,
          vx: isOrb ? (Math.random() - 0.5) * 0.28 : Math.random() * 0.65 + 0.35,
          vy: isOrb ? -(Math.random() * 0.45 + 0.22) : Math.random() * 0.68 + 0.38,
          size: isOrb ? Math.random() * 7 + 4.5 : Math.random() * 6.5 + 5.2,
          kind: isOrb ? 'orb' : 'petal',
          angle: Math.random() * Math.PI * 2,
          spin: (Math.random() - 0.5) * 0.022,
          flipPhase: Math.random() * Math.PI * 2,
          flipSpeed: Math.random() * 0.028 + 0.012,
          alpha: Math.random() * 0.42 + 0.42,
          warmGold: i % 2 === 0,
        };
      });
    };

    let particles = createParticles();

    const onResize = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
      particles = createParticles();
    };

    const onMove = (e: PointerEvent) => {
      pointer.x = e.clientX;
      pointer.y = e.clientY;
      pointer.active = true;
    };

    const onLeave = () => {
      pointer.active = false;
    };

    window.addEventListener('resize', onResize, { passive: true });
    window.addEventListener('pointermove', onMove, { passive: true });
    window.addEventListener('pointerleave', onLeave, { passive: true });

    const render = (ts: number) => {
      ctx.clearRect(0, 0, width, height);
      const frozen = pausedRef.current || prefersReducedMotion;

      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];

        if (!frozen) {
          const breeze = Math.sin(ts * 0.0011 + p.flipPhase) * 0.28;
          p.x += p.vx + breeze;
          p.y += p.vy;
          p.angle += p.spin;
          p.flipPhase += p.flipSpeed;

          if (pointer.active) {
            const dx = p.x - pointer.x;
            const dy = p.y - pointer.y;
            const dSq = dx * dx + dy * dy;
            if (dSq > 1 && dSq < 180 * 180) {
              const d = Math.sqrt(dSq);
              const push = ((180 - d) / 180) * 0.85;
              p.x += (dx / d) * push;
              p.y += (dy / d) * push;
            }
          }

          if (p.x > width + 30) p.x = -25;
          if (p.x < -30) p.x = width + 25;
          if (p.y > height + 30) p.y = -25;
          if (p.y < -30) p.y = height + 25;
        }

        const pulse = frozen ? 1 : 0.78 + 0.22 * Math.sin(ts * 0.0022 + p.flipPhase);

        if (p.kind === 'orb') {
          // 幻想世界温暖发光光玉
          const r = p.size * pulse;
          const g = ctx.createRadialGradient(p.x, p.y, 0.5, p.x, p.y, r * 3.1);
          if (p.warmGold) {
            g.addColorStop(0, `rgba(255, 252, 232, ${0.92 * p.alpha})`);
            g.addColorStop(0.32, `rgba(251, 191, 36, ${0.52 * p.alpha})`);
            g.addColorStop(1, 'rgba(251, 191, 36, 0)');
          } else {
            g.addColorStop(0, `rgba(255, 240, 250, ${0.88 * p.alpha})`);
            g.addColorStop(0.35, `rgba(244, 114, 182, ${0.46 * p.alpha})`);
            g.addColorStop(1, 'rgba(244, 114, 182, 0)');
          }
          ctx.fillStyle = g;
          ctx.beginPath();
          ctx.arc(p.x, p.y, r * 3.1, 0, Math.PI * 2);
          ctx.fill();
        } else {
          // 带缺口刻痕的京都动画风立体樱花花瓣
          ctx.save();
          ctx.translate(p.x, p.y);
          ctx.rotate(p.angle);
          const flipScaleY = Math.max(0.28, Math.abs(Math.cos(p.flipPhase)));
          ctx.scale(1, flipScaleY);

          const s = p.size;
          const petalGrad = ctx.createLinearGradient(0, -s, 0, s);
          petalGrad.addColorStop(0, `rgba(255, 245, 250, ${0.9 * p.alpha})`);
          petalGrad.addColorStop(0.65, `rgba(251, 182, 212, ${0.82 * p.alpha})`);
          petalGrad.addColorStop(1, `rgba(244, 114, 182, ${0.72 * p.alpha})`);

          ctx.fillStyle = petalGrad;
          ctx.beginPath();
          // 顶部小分叉樱花缺口
          ctx.moveTo(0, -s * 0.68);
          ctx.lineTo(s * 0.2, -s);
          ctx.bezierCurveTo(s * 0.95, -s * 0.55, s * 0.85, s * 0.55, 0, s);
          ctx.bezierCurveTo(-s * 0.85, s * 0.55, -s * 0.95, -s * 0.55, -s * 0.2, -s);
          ctx.closePath();
          ctx.fill();
          ctx.restore();
        }
      }

      if (!frozen) {
        rafId = window.requestAnimationFrame(render);
      }
    };

    rafId = window.requestAnimationFrame(render);

    return () => {
      window.cancelAnimationFrame(rafId);
      window.removeEventListener('resize', onResize);
      window.removeEventListener('pointermove', onMove);
      window.removeEventListener('pointerleave', onLeave);
    };
  }, [motionPaused]);

  return (
    <div aria-hidden="true" className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
      {/* 多层高清 CLANNAD 原作风景壁纸交叉淡入淡出层 */}
      {(Object.keys(SCENE_WALLPAPERS) as Array<Exclude<ClannadWorldTheme, 'auto'>>).map((key) => {
        const active = effectiveScene === key;
        const spec = SCENE_WALLPAPERS[key];
        return (
          <div
            key={key}
            className={`absolute inset-0 transition-opacity duration-[1200ms] ease-out ${
              active ? 'opacity-100' : 'opacity-0'
            }`}
          >
            <img
              src={spec.src}
              alt=""
              className={`h-full w-full object-cover object-center transition-transform duration-[14000ms] ease-out ${
                active && !motionPaused ? 'scale-[1.05]' : 'scale-100'
              }`}
            />
            {/* 纯净赏景模式下完全移开柔光暗角，正常浏览时仅保留极轻透大气渐变以衬托水晶玻璃文字 */}
            <div
              className="absolute inset-0 transition-opacity duration-500"
              style={{
                background: spec.tintOverlay,
                opacity: scenicMode ? 0.08 : 1,
              }}
            />
          </div>
        );
      })}

      {/* 顶部柔和春樱晨曦辉光 */}
      <div
        className="absolute inset-x-0 top-0 h-56 opacity-65"
        style={{
          background:
            'radial-gradient(ellipse 80% 100% at 50% 0%, rgba(255, 228, 242, 0.22), transparent 75%)',
        }}
      />

      {/* 全屏飘舞春樱花瓣与升腾心愿光玉 */}
      <canvas ref={canvasRef} className="absolute inset-0 h-full w-full" />
    </div>
  );
};
