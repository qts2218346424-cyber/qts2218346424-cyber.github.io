import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  ArrowUpRight,
  Brain,
  Check,
  CheckCircle2,
  Copy,
  Github,
  LineChart,
  Lock,
  Maximize2,
  OctagonAlert,
  RotateCcw,
  Shield,
  ShieldAlert,
  Sparkles,
  X,
} from 'lucide-react';
import { AUTHOR_PROFILE } from '../data/siteData';
import {
  QUANT_SANDBOX_LEVELS,
  QUANT_STRATEGIES_PREVIEW,
  QuantSandboxLevel,
} from '../data/personaAndQuantData';
import { attachDialogEnhancements, closeDialogSmoothly } from '../utils/dialogHelper';
import {
  HikariOrbIcon,
  SakuraCornerFiligree,
  StarfishCharmIcon,
} from './ClannadMotifs';

type QuantTab = 'risk-gate' | 'evolution-radar' | 'cockpit-gallery';

const HABIT_LABELS = ['交易纪律', '持仓耐心', '止损执行', '顺势共振', '抗FOMO'];

export const AetherQuantShowcase: React.FC = () => {
  const [activeTab, setActiveTab] = useState<QuantTab>('risk-gate');

  // Tab 1: 五级沙盒与双系统风控门禁状态
  const [sandbox, setSandbox] = useState<QuantSandboxLevel>(QUANT_SANDBOX_LEVELS[0]);
  const [killSwitchActive, setKillSwitchActive] = useState<boolean>(false);
  const [signalType, setSignalType] = useState<'alpha' | 'fomo'>('alpha');
  const [copiedClone, setCopiedClone] = useState<boolean>(false);

  // Tab 2: 70/30 自进化曲线与五维习惯雷达
  const [stratIdx, setStratIdx] = useState<number>(0);

  // Tab 3: 模块化驾驶舱全景图与灯箱
  const [gallerySrc, setGallerySrc] = useState<string>('./showcase/quant/terminal-showcase.svg');
  const lightboxRef = useRef<HTMLDialogElement | null>(null);
  const [lightboxOpen, setLightboxOpen] = useState<boolean>(false);

  // 3D 视差倾斜
  const stageRef = useRef<HTMLDivElement | null>(null);
  const [tilt, setTilt] = useState({ rx: 0, ry: 0, gx: 50, gy: 50 });

  useEffect(() => {
    return attachDialogEnhancements(lightboxRef.current, () => setLightboxOpen(false));
  }, []);

  const currentStrat = QUANT_STRATEGIES_PREVIEW[stratIdx];

  const handleCopyClone = async () => {
    try {
      await navigator.clipboard.writeText(
        'git clone https://github.com/qts2218346424-cyber/aether-quant-studio.git'
      );
      setCopiedClone(true);
      setTimeout(() => setCopiedClone(false), 1800);
    } catch {
      // 忽略受限环境
    }
  };

  // 计算 70/30 IS & OOS 净值 SVG 折线与雷达多边形
  const { isPath, oosPath, splitX, radarPolygon } = useMemo(() => {
    const allPts = [...currentStrat.isCurve, ...currentStrat.oosCurve.slice(1)];
    const minVal = Math.min(...allPts) - 4;
    const maxVal = Math.max(...allPts) + 5;
    const w = 340;
    const h = 155;
    const padX = 16;
    const padY = 16;

    const toCoord = (idx: number, val: number) => {
      const x = padX + (idx / (allPts.length - 1)) * (w - padX * 2);
      const y = h - padY - ((val - minVal) / (maxVal - minVal)) * (h - padY * 2);
      return `${x.toFixed(1)},${y.toFixed(1)}`;
    };

    const isLen = currentStrat.isCurve.length;
    const isSegs = currentStrat.isCurve.map((v, i) => `${i === 0 ? 'M' : 'L'}${toCoord(i, v)}`);
    const oosSegs = currentStrat.oosCurve.map(
      (v, i) => `${i === 0 ? 'M' : 'L'}${toCoord(isLen - 1 + i, v)}`
    );
    const sx = padX + ((isLen - 1) / (allPts.length - 1)) * (w - padX * 2);

    // 五维行为金融学雷达坐标 (中心 90, 82, 半径 56)
    const cx = 90;
    const cy = 84;
    const maxR = 54;
    const poly = currentStrat.habits
      .map((score, i) => {
        const angle = -Math.PI / 2 + (i * 2 * Math.PI) / 5;
        const r = (score / 100) * maxR;
        return `${(cx + Math.cos(angle) * r).toFixed(1)},${(cy + Math.sin(angle) * r).toFixed(1)}`;
      })
      .join(' ');

    return {
      isPath: isSegs.join(' '),
      oosPath: oosSegs.join(' '),
      splitX: sx,
      radarPolygon: poly,
    };
  }, [currentStrat]);

  const openLightbox = () => {
    setLightboxOpen(true);
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

  // 四阶风控审查结论推导
  const gateVerdict = useMemo(() => {
    if (killSwitchActive) {
      return {
        passed: false,
        badge: '紧急急停物理闭锁中',
        detail: 'Kill Switch 已激活，底层已撤销全部活动挂单并物理阻断一切新开仓指令。',
      };
    }
    if (signalType === 'fomo') {
      return {
        passed: false,
        badge: 'System-One Jev 一票否决拦截',
        detail:
          '检测到近 2 小时连损后偏离 VWAP +2.3σ 追高，违纪概率评分 0.84 > 阈值 0.35，已归档至决策黑匣子！',
      };
    }
    if (sandbox.level === 'L1' || sandbox.level === 'L2') {
      return {
        passed: true,
        badge: `${sandbox.level} 安全旁路验证通过（零真实发单）`,
        detail:
          '1H 趋势共振 + Jev 概率校准 0.91 通过！当前处于零资金风险沙盒，已记录仿真信号快照。',
      };
    }
    return {
      passed: true,
      badge: `${sandbox.level} 四阶门禁全绿放行`,
      detail:
        '通过 Jev 校准与 RiskManager 敞口核验，已优先挂载 Post-Only Maker 限价单与 ATR 硬止损保护单！',
    };
  }, [killSwitchActive, signalType, sandbox]);

  return (
    <section id="quant" className="relative py-24 sm:py-32 overflow-hidden">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        {/* 顶部典藏级章节导语 */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div>
            <div className="clannad-pill-btn inline-flex items-center gap-2 rounded-full px-3.5 py-1 text-xs font-medium tracking-wide text-amber-100 mb-4">
              <StarfishCharmIcon className="h-3.5 w-3.5" />
              <span>重点旗舰项目 04 · 双系统智能风控与币安永续多策略量化终端</span>
            </div>
            <h2 className="font-clannad-serif text-3xl sm:text-5xl font-bold tracking-wider text-white">
              <span className="text-aurora-gradient">Aether Quant Studio</span>
              <span className="text-pink-50"> · 苍穹量枢</span>
            </h2>
            <p className="mt-4 max-w-2xl text-pink-50/90 text-base leading-relaxed">
              把冰冷的黑盒命令行脚本进化为可观测、可推演、可自进化的个人量化工程实验室。出厂默认锁定零风险{' '}
              <strong className="text-sky-200">READONLY / PAPER 安全沙盒</strong>，融合卡尼曼{' '}
              <strong className="text-amber-200">System-One (TypeSafe Jev) 概率门禁</strong>、12 套机构级策略、70/30 防过拟合自进化与{' '}
              <strong className="text-pink-200">Obsidian 行为金融学习惯雷达</strong>。
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 shrink-0">
            <a
              href={AUTHOR_PROFILE.quantRepo}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-amber-200 via-pink-200 to-sky-200 px-5 py-3 text-sm font-bold text-[#1d1630] shadow-[0_0_28px_rgba(253,230,138,0.45)] hover:brightness-105 transition-all"
            >
              <Github className="h-4 w-4" />
              <span>访问苍穹量枢开源仓库</span>
              <ArrowUpRight className="h-4 w-4" />
            </a>
          </div>
        </div>

        {/* 主体双栏 */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-7 items-stretch">
          {/* 左侧 5 列：工程护城河与一键克隆 */}
          <div className="lg:col-span-5 flex flex-col justify-between gap-5">
            <div className="clannad-crystal-panel rounded-3xl p-6 overflow-hidden">
              <SakuraCornerFiligree position="top-right" />

              <div className="flex items-center justify-between gap-3 mb-5">
                <div className="flex items-center gap-3">
                  <div className="h-11 w-11 rounded-2xl border border-amber-200/40 bg-gradient-to-br from-amber-200/25 to-pink-300/20 flex items-center justify-center shadow-[0_0_18px_rgba(253,230,138,0.3)]">
                    <HikariOrbIcon className="h-6 w-6" />
                  </div>
                  <div>
                    <div className="text-sm font-bold text-white">五层高内聚量化工程内核</div>
                    <div className="text-xs font-mono text-amber-200">
                      Python 3.10+ · FastAPI · 257 Tests Passed
                    </div>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 mb-5">
                {[
                  { num: 'L1 ~ L5', desc: '五级渐进实盘安全沙盒', accent: 'text-amber-200' },
                  { num: '12 套策略', desc: 'SMC / ICT 银弹 / 海龟 / POC', accent: 'text-sky-200' },
                  { num: '70 / 30', desc: '样本内外盲测防过拟合进化', accent: 'text-pink-200' },
                  { num: '257 单测', desc: '全链路自动化回归验证通过', accent: 'text-emerald-200' },
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
                  <Brain className="h-4 w-4 text-amber-200 shrink-0 mt-0.5" />
                  <span>
                    <strong className="text-white">卡尼曼快慢双系统协同决策：</strong>先由 System-One（TypeSafe Jev）执行毫秒级非生成式类型化概率校准，再联动多模型投委会，根治大模型价格幻觉。
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <Shield className="h-4 w-4 text-sky-200 shrink-0 mt-0.5" />
                  <span>
                    <strong className="text-white">六重全天候硬风控护城河：</strong>常驻一键急停 Kill Switch、实盘双向持仓对账、行情新鲜度熔断、日损硬上限与连亏强制冷静期。
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <Sparkles className="h-4 w-4 text-pink-200 shrink-0 mt-0.5" />
                  <span>
                    <strong className="text-white">Karpathy 范式 Obsidian 交易大脑：</strong>自动将交割单编译为本地双链知识库与「五维行为金融学习惯雷达」，用代码约束手痒扛单。
                  </span>
                </li>
              </ul>
            </div>

            {/* 快捷克隆命令卡 */}
            <div className="clannad-crystal-panel rounded-3xl p-4 flex items-center justify-between gap-3">
              <div className="min-w-0">
                <div className="text-[11px] text-amber-200 font-semibold mb-0.5">
                  开源 MIT 协议 · 默认锁定零风险只读沙盒安全体验
                </div>
                <code className="block truncate font-mono text-xs text-pink-50/85">
                  git clone https://github.com/qts2218346424-cyber/aether-quant-studio.git
                </code>
              </div>
              <button
                type="button"
                onClick={() => void handleCopyClone()}
                className="clannad-pill-btn shrink-0 inline-flex items-center gap-1.5 rounded-xl px-3 py-2 text-xs font-semibold text-amber-100 cursor-pointer"
              >
                {copiedClone ? (
                  <Check className="h-3.5 w-3.5 text-emerald-300" />
                ) : (
                  <Copy className="h-3.5 w-3.5" />
                )}
                <span>{copiedClone ? '已复制' : '复制命令'}</span>
              </button>
            </div>
          </div>

          {/* 右侧 7 列：3D 视差双系统风控与策略自进化实验舱 */}
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
                  background: `radial-gradient(460px circle at ${tilt.gx}% ${tilt.gy}%, rgba(253,230,138,0.13), transparent 62%)`,
                }}
              />

              {/* 交互舱顶栏 */}
              <div className="relative z-10 flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-pink-200/20">
                <div className="flex items-center gap-2">
                  <span className="h-2.5 w-2.5 rounded-full bg-rose-300/85" />
                  <span className="h-2.5 w-2.5 rounded-full bg-amber-200/85" />
                  <span className="h-2.5 w-2.5 rounded-full bg-emerald-300/85" />
                  <span className="ml-1.5 text-xs font-mono text-pink-100/75">
                    苍穹量枢驾驶舱 · 风控与进化推演
                  </span>
                </div>

                <div
                  role="tablist"
                  aria-label="苍穹量枢交互演示模式"
                  className="flex items-center gap-1 rounded-full bg-[#1a152d]/70 p-1 border border-pink-200/25"
                >
                  {(
                    [
                      { id: 'risk-gate', label: '五级沙盒与门禁' },
                      { id: 'evolution-radar', label: '70/30 进化与雷达' },
                      { id: 'cockpit-gallery', label: '驾驶舱全景视图' },
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
                          ? 'bg-gradient-to-r from-amber-200/30 to-pink-300/30 text-white border border-amber-200/50 shadow-[0_0_12px_rgba(253,230,138,0.25)]'
                          : 'text-pink-100/75 hover:text-white'
                      }`}
                    >
                      {label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Tab 1: 五级渐进安全沙盒 & 卡尼曼双系统风控模拟 */}
              {activeTab === 'risk-gate' && (
                <div className="relative z-10 mt-4 flex-1 flex flex-col justify-between gap-4">
                  {/* 五级沙盒选择器 + 常驻 Kill Switch */}
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div className="flex flex-wrap gap-1.5">
                      {QUANT_SANDBOX_LEVELS.map((lv) => {
                        const active = lv.level === sandbox.level;
                        return (
                          <button
                            key={lv.level}
                            type="button"
                            onClick={() => setSandbox(lv)}
                            className={`rounded-xl px-2.5 py-1.5 text-xs font-mono font-semibold transition-all cursor-pointer ${
                              active
                                ? 'bg-amber-200/25 text-amber-100 border border-amber-200/55 shadow-[0_0_14px_rgba(253,230,138,0.22)]'
                                : 'clannad-silk-subcard text-pink-100/70 hover:text-white'
                            }`}
                          >
                            {lv.level} · {lv.code}
                          </button>
                        );
                      })}
                    </div>

                    <button
                      type="button"
                      onClick={() => setKillSwitchActive((v) => !v)}
                      className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-bold transition-all cursor-pointer ${
                        killSwitchActive
                          ? 'bg-emerald-300/25 border border-emerald-200/50 text-emerald-100'
                          : 'bg-rose-400/25 border border-rose-300/50 text-rose-100 hover:bg-rose-400/35'
                      }`}
                    >
                      {killSwitchActive ? (
                        <>
                          <RotateCcw className="h-3.5 w-3.5" />
                          <span>解除紧急熔断</span>
                        </>
                      ) : (
                        <>
                          <OctagonAlert className="h-3.5 w-3.5" />
                          <span>触发紧急急停 (Kill Switch)</span>
                        </>
                      )}
                    </button>
                  </div>

                  {/* 当前沙盒详情卡 */}
                  <div className="rounded-2xl border border-pink-200/22 bg-[#171329]/74 p-4 space-y-3">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <Lock className="h-4 w-4 text-amber-200" />
                        <span className="text-sm font-bold text-white">
                          {sandbox.level} {sandbox.name}
                        </span>
                      </div>
                      <span className="rounded-full bg-white/10 border border-pink-200/25 px-2.5 py-0.5 text-[11px] font-mono text-sky-200">
                        {sandbox.orderLock}
                      </span>
                    </div>
                    <p className="text-xs text-pink-100/85 leading-relaxed">{sandbox.desc}</p>

                    {/* 信号推演切换测试 */}
                    <div className="pt-3 border-t border-pink-200/15 space-y-2.5">
                      <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
                        <span className="text-pink-100/75">点击注入测试信号检验四阶风控漏斗：</span>
                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() => setSignalType('alpha')}
                            className={`rounded-lg px-2.5 py-1 text-xs font-medium cursor-pointer ${
                              signalType === 'alpha'
                                ? 'bg-sky-300/25 border border-sky-200/50 text-sky-100'
                                : 'clannad-silk-subcard text-pink-100/70'
                            }`}
                          >
                            SMC 订单块共振信号
                          </button>
                          <button
                            type="button"
                            onClick={() => setSignalType('fomo')}
                            className={`rounded-lg px-2.5 py-1 text-xs font-medium cursor-pointer ${
                              signalType === 'fomo'
                                ? 'bg-rose-300/25 border border-rose-200/50 text-rose-100'
                                : 'clannad-silk-subcard text-pink-100/70'
                            }`}
                          >
                            连损后情绪追高信号
                          </button>
                        </div>
                      </div>

                      {/* 四阶漏斗节点条 */}
                      <div className="grid grid-cols-4 gap-1.5 text-center text-[10px] sm:text-[11px]">
                        {[
                          { step: '01 多因子聪明钱', ok: !killSwitchActive },
                          { step: '02 Obsidian 习惯', ok: !killSwitchActive && signalType === 'alpha' },
                          { step: '03 Jev 概率门禁', ok: !killSwitchActive && signalType === 'alpha' },
                          {
                            step: '04 硬风控发单层',
                            ok: !killSwitchActive && signalType === 'alpha',
                          },
                        ].map((s) => (
                          <div
                            key={s.step}
                            className={`rounded-xl border px-2 py-2 font-medium ${
                              s.ok
                                ? 'border-emerald-200/40 bg-emerald-300/12 text-emerald-100'
                                : 'border-rose-300/45 bg-rose-400/15 text-rose-100'
                            }`}
                          >
                            {s.step}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* 门禁裁决回显 */}
                  <div className="clannad-silk-subcard rounded-2xl p-3.5 flex items-start gap-3">
                    {gateVerdict.passed ? (
                      <CheckCircle2 className="h-5 w-5 text-emerald-300 shrink-0 mt-0.5" />
                    ) : (
                      <ShieldAlert className="h-5 w-5 text-rose-300 shrink-0 mt-0.5" />
                    )}
                    <div>
                      <div className="text-xs font-bold text-white">{gateVerdict.badge}</div>
                      <p className="mt-0.5 text-xs text-pink-100/85">{gateVerdict.detail}</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Tab 2: 70/30 样本内外防过拟合进化曲线 & 五维习惯雷达 */}
              {activeTab === 'evolution-radar' && (
                <div className="relative z-10 mt-4 flex-1 flex flex-col justify-between gap-4">
                  <div className="flex flex-wrap gap-1.5">
                    {QUANT_STRATEGIES_PREVIEW.map((st, idx) => (
                      <button
                        key={st.id}
                        type="button"
                        onClick={() => setStratIdx(idx)}
                        className={`rounded-full px-3 py-1 text-xs font-medium transition-all cursor-pointer ${
                          idx === stratIdx
                            ? 'bg-amber-200/25 text-white border border-amber-200/55'
                            : 'clannad-silk-subcard text-pink-100/75 hover:text-white'
                        }`}
                      >
                        {st.name}
                      </button>
                    ))}
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 items-stretch">
                    {/* 左侧 7 列：IS/OOS 净值曲线 */}
                    <div className="sm:col-span-7 rounded-2xl border border-pink-200/22 bg-[#171329]/74 p-3 flex flex-col justify-between">
                      <div className="flex items-center justify-between text-[11px] px-1">
                        <span className="font-semibold text-pink-100 flex items-center gap-1">
                          <LineChart className="h-3.5 w-3.5 text-amber-200" />
                          70% 样本内寻优 → 30% 样本外盲测
                        </span>
                        <span className="font-mono text-emerald-200">
                          Sharpe {currentStrat.sharpe}
                        </span>
                      </div>
                      <svg viewBox="0 0 340 155" className="w-full h-36">
                        <line
                          x1={splitX}
                          y1="12"
                          x2={splitX}
                          y2="142"
                          stroke="rgba(253,230,138,0.45)"
                          strokeDasharray="4 3"
                          strokeWidth="1.2"
                        />
                        <path
                          d={isPath}
                          fill="none"
                          stroke="#bae6fd"
                          strokeWidth="2.5"
                          strokeLinecap="round"
                        />
                        <path
                          d={oosPath}
                          fill="none"
                          stroke="#fde68a"
                          strokeWidth="2.8"
                          strokeLinecap="round"
                        />
                      </svg>
                      <div className="flex items-center justify-between text-[10px] text-pink-100/70 px-1">
                        <span>冰蓝实线：70% IS 训练集</span>
                        <span className="text-amber-200">香槟金线：30% OOS 盲测通过</span>
                      </div>
                    </div>

                    {/* 右侧 5 列：Obsidian 五维行为金融学习惯雷达 */}
                    <div className="sm:col-span-5 rounded-2xl border border-pink-200/22 bg-[#171329]/74 p-3 flex flex-col items-center justify-between">
                      <div className="text-[11px] font-semibold text-pink-100">
                        Obsidian 五维交易习惯雷达
                      </div>
                      <svg viewBox="0 0 180 165" className="w-40 h-36">
                        {[0.35, 0.68, 1].map((scale) => {
                          const ring = [0, 1, 2, 3, 4]
                            .map((i) => {
                              const a = -Math.PI / 2 + (i * 2 * Math.PI) / 5;
                              return `${(90 + Math.cos(a) * 54 * scale).toFixed(1)},${(
                                84 +
                                Math.sin(a) * 54 * scale
                              ).toFixed(1)}`;
                            })
                            .join(' ');
                          return (
                            <polygon
                              key={scale}
                              points={ring}
                              fill="none"
                              stroke="rgba(255,228,240,0.16)"
                              strokeWidth="1"
                            />
                          );
                        })}
                        <polygon
                          points={radarPolygon}
                          fill="rgba(249, 168, 212, 0.28)"
                          stroke="#fde68a"
                          strokeWidth="1.8"
                        />
                        {HABIT_LABELS.map((lbl, i) => {
                          const a = -Math.PI / 2 + (i * 2 * Math.PI) / 5;
                          const lx = 90 + Math.cos(a) * 69;
                          const ly = 86 + Math.sin(a) * 66;
                          return (
                            <text
                              key={lbl}
                              x={lx}
                              y={ly}
                              textAnchor="middle"
                              fill="#fce7f3"
                              fontSize="8.5"
                            >
                              {lbl}
                            </text>
                          );
                        })}
                      </svg>
                      <div className="text-[10px] font-mono text-pink-200">
                        胜率 {currentStrat.winRate} · 最大回撤 {currentStrat.maxDrawdown}
                      </div>
                    </div>
                  </div>

                  <div className="clannad-silk-subcard rounded-2xl p-3.5 text-xs text-pink-50/90">
                    <strong className="text-amber-200">{currentStrat.name}：</strong>
                    {currentStrat.logic}
                  </div>
                </div>
              )}

              {/* Tab 3: 模块化驾驶舱全景图谱 */}
              {activeTab === 'cockpit-gallery' && (
                <div className="relative z-10 mt-4 flex-1 flex flex-col justify-between gap-4">
                  <div className="group relative rounded-2xl border border-pink-200/25 bg-[#120f22]/90 p-2 overflow-hidden aspect-[16/9] flex items-center justify-center">
                    <img
                      src={gallerySrc}
                      alt="苍穹量枢模块化看盘终端全景视图"
                      className="max-h-full w-full object-contain"
                    />
                    <button
                      type="button"
                      onClick={openLightbox}
                      className="clannad-pill-btn absolute bottom-3 right-3 inline-flex items-center gap-1.5 rounded-xl px-3 py-1.5 text-xs font-semibold text-white cursor-pointer"
                    >
                      <Maximize2 className="h-3.5 w-3.5" />
                      <span>全屏检视架构图</span>
                    </button>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    {[
                      {
                        src: './showcase/quant/terminal-showcase.svg',
                        label: '模块化看盘驾驶舱与 Ctrl+K 命令面板全景',
                      },
                      {
                        src: './showcase/quant/hero-banner.svg',
                        label: 'Aether Quant Studio v2.0 品牌架构总览',
                      },
                    ].map((item) => (
                      <button
                        key={item.src}
                        type="button"
                        onClick={() => setGallerySrc(item.src)}
                        className={`rounded-xl px-3.5 py-2.5 text-xs font-medium text-left transition-all cursor-pointer ${
                          gallerySrc === item.src
                            ? 'bg-amber-200/25 border border-amber-200/55 text-white'
                            : 'clannad-silk-subcard text-pink-100/75 hover:text-white'
                        }`}
                      >
                        {item.label}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* 原生 Top-Layer 灯箱预览 */}
      <dialog
        ref={lightboxRef}
        {...({ closedby: 'any' } as React.DialogHTMLAttributes<HTMLDialogElement>)}
        aria-label="苍穹量枢终端全景预览"
        className="cyber-dialog w-full"
      >
        {lightboxOpen && (
          <div className="rounded-3xl border border-pink-200/35 bg-[#1a152d]/95 p-4 sm:p-6 shadow-2xl backdrop-blur-2xl">
            <div className="flex items-center justify-between gap-4 pb-3 border-b border-pink-200/20">
              <div className="flex items-center gap-2">
                <HikariOrbIcon className="h-4 w-4" />
                <h3 className="text-sm sm:text-base font-bold text-white">
                  Aether Quant Studio · 模块化量化驾驶舱全景视图
                </h3>
              </div>
              <button
                type="button"
                onClick={() => void closeDialogSmoothly(lightboxRef.current)}
                aria-label="关闭预览"
                className="clannad-pill-btn rounded-full p-1.5 text-pink-100 cursor-pointer"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
            <div className="mt-4 overflow-hidden rounded-2xl border border-pink-200/20 bg-[#0d0b18] p-3">
              <img
                src={gallerySrc}
                alt="苍穹量枢终端视图"
                className="max-h-[70vh] w-full object-contain"
              />
            </div>
          </div>
        )}
      </dialog>
    </section>
  );
};
