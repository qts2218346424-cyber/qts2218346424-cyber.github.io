import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  Activity,
  ArrowUpRight,
  BookOpen,
  CheckCircle2,
  Compass,
  ExternalLink,
  Flame,
  Github,
  LineChart,
  Maximize2,
  Play,
  RefreshCw,
  ShieldCheck,
  Sparkles,
  X,
  Zap,
} from 'lucide-react';
import {
  AUTHOR_PROFILE,
  COREFORGE_SCREENSHOTS,
  CoreForgeScreenshot,
  INITIAL_KNOWLEDGE_NODES,
  KNOWLEDGE_EDGES,
  KnowledgeNode,
} from '../data/siteData';
import { attachDialogEnhancements, closeDialogSmoothly } from '../utils/dialogHelper';

type LabTab = 'star-map' | 'taylor-lab' | 'gallery';

function factorial(n: number): number {
  let res = 1;
  for (let i = 2; i <= n; i++) res *= i;
  return res;
}

function evalTaylorSin(x: number, maxOddOrder: number): number {
  let sum = 0;
  let sign = 1;
  for (let k = 1; k <= maxOddOrder; k += 2) {
    sum += sign * (Math.pow(x, k) / factorial(k));
    sign *= -1;
  }
  return sum;
}

function evalTaylorCos(x: number, maxEvenOrder: number): number {
  let sum = 0;
  let sign = 1;
  for (let k = 0; k <= maxEvenOrder; k += 2) {
    sum += sign * (Math.pow(x, k) / factorial(k));
    sign *= -1;
  }
  return sum;
}

export const CoreForgeShowcase: React.FC = () => {
  const [activeTab, setActiveTab] = useState<LabTab>('star-map');

  // 模式 1：红黄绿知识星图状态
  const [nodes, setNodes] = useState<KnowledgeNode[]>(INITIAL_KNOWLEDGE_NODES);
  const [selectedNodeId, setSelectedNodeId] = useState<string>('avl');
  const [rescueBanner, setRescueBanner] = useState<string | null>(null);

  // 模式 2：泰勒逼近实验室状态
  const [targetFn, setTargetFn] = useState<'sin' | 'cos'>('sin');
  const [orderStep, setOrderStep] = useState<number>(3); // 对应第几个展开项索引 0..4

  // 模式 3：实机高清截图画廊与灯箱状态
  const [shotIndex, setShotIndex] = useState<number>(0);
  const [lightboxShot, setLightboxShot] = useState<CoreForgeScreenshot | null>(null);
  const lightboxRef = useRef<HTMLDialogElement | null>(null);

  // 3D 视差倾斜状态
  const stageRef = useRef<HTMLDivElement | null>(null);
  const [tilt, setTilt] = useState({ rx: 0, ry: 0, gx: 50, gy: 50 });

  useEffect(() => {
    return attachDialogEnhancements(lightboxRef.current, () => setLightboxShot(null));
  }, []);

  const openLightbox = (shot: CoreForgeScreenshot) => {
    setLightboxShot(shot);
    requestAnimationFrame(() => {
      if (lightboxRef.current && !lightboxRef.current.open) {
        lightboxRef.current.showModal();
      }
    });
  };

  const selectedNode = useMemo(
    () => nodes.find((n) => n.id === selectedNodeId) ?? nodes[0],
    [nodes, selectedNodeId]
  );

  const avgMastery = useMemo(() => {
    const total = nodes.reduce((acc, item) => acc + item.accuracy, 0);
    return Math.round(total / nodes.length);
  }, [nodes]);

  const dangerCount = useMemo(
    () => nodes.filter((n) => n.status === 'danger').length,
    [nodes]
  );

  const handleRescueNode = (id: string) => {
    setNodes((prev) =>
      prev.map((node) =>
        node.id === id
          ? {
              ...node,
              status: 'mastered',
              accuracy: Math.max(node.accuracy, 94 + (id.length % 5)),
            }
          : node
      )
    );
    const target = nodes.find((n) => n.id === id);
    if (target) {
      setRescueBanner(`⚡ 「${target.label}」已完成 5 题靶向急救，节点成功转绿！`);
    }
  };

  const handleRescueAll = () => {
    setNodes((prev) =>
      prev.map((node) => ({
        ...node,
        status: 'mastered',
        accuracy: Math.max(node.accuracy, 96),
      }))
    );
    setRescueBanner('🔥 全考纲盲区已完成靶向突击闭环，掌握热力星图全绿通关！');
  };

  const handleResetNodes = () => {
    setNodes(INITIAL_KNOWLEDGE_NODES);
    setRescueBanner(null);
  };

  // 计算泰勒展开 SVG 路径
  const taylorDegree = targetFn === 'sin' ? orderStep * 2 + 1 : orderStep * 2;
  const { truePath, approxPath, formulaText } = useMemo(() => {
    const w = 560;
    const h = 230;
    const xMin = -Math.PI * 1.65;
    const xMax = Math.PI * 1.65;
    const yScale = 58;
    const cy = h / 2;

    const toSvg = (x: number, y: number) => {
      const sx = ((x - xMin) / (xMax - xMin)) * w;
      const clampedY = Math.max(-2.1, Math.min(2.1, y));
      const sy = cy - clampedY * yScale;
      return `${sx.toFixed(1)},${sy.toFixed(1)}`;
    };

    const truePts: string[] = [];
    const approxPts: string[] = [];
    const steps = 120;
    for (let i = 0; i <= steps; i++) {
      const x = xMin + ((xMax - xMin) * i) / steps;
      const ty = targetFn === 'sin' ? Math.sin(x) : Math.cos(x);
      const ay =
        targetFn === 'sin'
          ? evalTaylorSin(x, taylorDegree)
          : evalTaylorCos(x, taylorDegree);
      truePts.push(`${i === 0 ? 'M' : 'L'}${toSvg(x, ty)}`);
      approxPts.push(`${i === 0 ? 'M' : 'L'}${toSvg(x, ay)}`);
    }

    const sinTerms = ['x', '- x³/3!', '+ x⁵/5!', '- x⁷/7!', '+ x⁹/9!'];
    const cosTerms = ['1', '- x²/2!', '+ x⁴/4!', '- x⁶/6!', '+ x⁸/8!'];
    const terms = (targetFn === 'sin' ? sinTerms : cosTerms).slice(0, orderStep + 1).join(' ');
    const prefix = targetFn === 'sin' ? 'sin(x) ≈ ' : 'cos(x) ≈ ';

    return {
      truePath: truePts.join(' '),
      approxPath: approxPts.join(' '),
      formulaText: `${prefix}${terms} + o(x^${taylorDegree})`,
    };
  }, [targetFn, orderStep, taylorDegree]);

  const handleStageMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!stageRef.current) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const rect = stageRef.current.getBoundingClientRect();
    const px = (e.clientX - rect.left) / rect.width;
    const py = (e.clientY - rect.top) / rect.height;
    setTilt({
      rx: (0.5 - py) * 5.5,
      ry: (px - 0.5) * 6.5,
      gx: px * 100,
      gy: py * 100,
    });
  };

  const handleStageLeave = () => {
    setTilt({ rx: 0, ry: 0, gx: 50, gy: 50 });
  };

  const currentShot = COREFORGE_SCREENSHOTS[shotIndex];

  return (
    <section id="coreforge" className="relative py-24 sm:py-32 overflow-hidden">
      {/* 氛围背光 */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute top-1/3 -left-32 h-[480px] w-[480px] rounded-full bg-cyan-500/12 blur-[130px]"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute bottom-12 right-0 h-[420px] w-[460px] rounded-full bg-indigo-500/12 blur-[130px]"
      />

      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        {/* 顶部旗舰章节导语 */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-cyan-400/30 bg-cyan-500/10 px-3.5 py-1 text-xs font-semibold text-cyan-300 mb-4">
              <Zap className="h-3.5 w-3.5" />
              <span>重点旗舰项目 01 · 本地优先知识库与全栈智能研学系统</span>
            </div>
            <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white">
              <span className="text-coreforge-gradient">CoreForge 研核</span>
              <span className="text-slate-200"> · 研你所学，核力致胜</span>
            </h2>
            <p className="mt-4 max-w-2xl text-slate-300 text-base leading-relaxed">
              打破“刷题软件、PDF 讲义、Markdown 笔记”碎片化割裂困局。专为 <strong className="text-white">408 计算机综合与考研数/英/政</strong> 打造的一体化智能研学操作系统，与本机 <strong className="text-cyan-300">Obsidian 知识库 100% 双向实时同步</strong>。
            </p>
          </div>

          {/* 右上角强导流双按钮 */}
          <div className="flex flex-wrap items-center gap-3 shrink-0">
            <a
              href={AUTHOR_PROFILE.coreforgeSite}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-cyan-400 to-indigo-500 px-5 py-3 text-sm font-bold text-slate-950 shadow-[0_0_30px_rgba(56,189,248,0.45)] hover:brightness-110 transition-all"
            >
              <span>🌐 立即在线体验官网</span>
              <ArrowUpRight className="h-4 w-4" />
            </a>
            <a
              href={AUTHOR_PROFILE.coreforgeRepo}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-full border border-slate-700 bg-slate-900/80 px-4 py-3 text-sm font-semibold text-slate-200 hover:border-cyan-400/60 hover:text-white transition-colors"
            >
              <Github className="h-4 w-4" />
              <span>GitHub 源码</span>
            </a>
          </div>
        </div>

        {/* 主体双栏：左侧硬核价值矩阵 + 右侧可交互全息沙盒 */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-7 items-stretch">
          {/* 左侧 5 列：核心数据指标与全入口传送阵 */}
          <div className="lg:col-span-5 flex flex-col justify-between gap-5">
            <div className="clannad-crystal-panel rounded-3xl p-6">
              <div className="flex items-center gap-3 mb-5">
                <img
                  src="./showcase/coreforge-logo.png"
                  alt="CoreForge 标志"
                  className="h-11 w-11 rounded-xl border border-cyan-400/30"
                />
                <div>
                  <div className="text-sm font-bold text-white">全栈知识大脑核心矩阵</div>
                  <div className="text-xs font-mono text-cyan-300">https://claudexxb.online</div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 mb-5">
                {[
                  { num: '1987–2024', desc: '统考真题精校库', accent: 'text-cyan-300' },
                  { num: '22+ 实验室', desc: '单步算法与高数仿真', accent: 'text-indigo-300' },
                  { num: '1839–2026', desc: '矢量中国史纲地图', accent: 'text-purple-300' },
                  { num: '100% 主权', desc: 'Obsidian 原生 .md 互通', accent: 'text-emerald-300' },
                ].map((stat) => (
                  <div
                    key={stat.num}
                    className="rounded-xl border border-slate-800/80 bg-slate-950/65 p-3.5"
                  >
                    <div className={`text-lg font-extrabold tracking-tight ${stat.accent}`}>
                      {stat.num}
                    </div>
                    <div className="mt-0.5 text-xs text-slate-400">{stat.desc}</div>
                  </div>
                ))}
              </div>

              <ul className="space-y-2.5 text-xs sm:text-sm text-slate-300">
                <li className="flex items-start gap-2">
                  <Flame className="h-4 w-4 text-rose-400 shrink-0 mt-0.5" />
                  <span>
                    <strong className="text-white">红黄绿热力急救舱：</strong>三色星图定位薄弱盲区，点击红灯一键串联「错题复盘 → 动画课件 → 5题靶向突击」当场救绿。
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <BookOpen className="h-4 w-4 text-cyan-400 shrink-0 mt-0.5" />
                  <span>
                    <strong className="text-white">PDF 双栏精读 & 1.2s 作文精批：</strong>左看原卷右写 KaTeX 公式双链笔记；英语作文 20 分制四维秒批与高阶点词升格。
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <Sparkles className="h-4 w-4 text-amber-300 shrink-0 mt-0.5" />
                  <span>
                    <strong className="text-white">四师思考流 + 奶龙×大肥鱼伴学：</strong>支持透视 DeepSeek 破题思考链、本机 Claude/Codex CLI 桥接与 30+ 条真人趣味配音。
                  </span>
                </li>
              </ul>
            </div>

            {/* 四大直达入口矩阵卡片 */}
            <div className="clannad-crystal-panel rounded-3xl p-5">
              <div className="text-xs font-semibold uppercase tracking-wider text-cyan-300 mb-3 flex items-center gap-1.5">
                <Compass className="h-3.5 w-3.5" />
                <span>CoreForge 研核 · 官方直达传送门</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs">
                <a
                  href={AUTHOR_PROFILE.coreforgeSite}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between rounded-xl border border-cyan-400/35 bg-cyan-400/12 px-3.5 py-2.5 font-semibold text-cyan-100 hover:bg-cyan-400/22 transition-colors"
                >
                  <span>🌐 线上体验主站</span>
                  <ExternalLink className="h-3.5 w-3.5 text-cyan-300" />
                </a>
                <a
                  href={AUTHOR_PROFILE.coreforgeLabs}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between rounded-xl border border-indigo-400/35 bg-indigo-400/12 px-3.5 py-2.5 font-semibold text-indigo-100 hover:bg-indigo-400/22 transition-colors"
                >
                  <span>🎮 免登录五大实验室</span>
                  <Play className="h-3.5 w-3.5 text-indigo-300" />
                </a>
                <a
                  href={AUTHOR_PROFILE.coreforgeShowroom}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between rounded-xl border border-purple-400/30 bg-purple-400/10 px-3.5 py-2.5 font-medium text-purple-100 hover:bg-purple-400/20 transition-colors"
                >
                  <span>🎬 实机互动宣传展厅</span>
                  <ArrowUpRight className="h-3.5 w-3.5 text-purple-300" />
                </a>
                <a
                  href={AUTHOR_PROFILE.coreforgeRepo}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between rounded-xl border border-slate-700 bg-slate-900/80 px-3.5 py-2.5 font-medium text-slate-200 hover:border-slate-500 transition-colors"
                >
                  <span>📦 GitHub 开源仓库</span>
                  <Github className="h-3.5 w-3.5 text-slate-300" />
                </a>
              </div>
            </div>
          </div>

          {/* 右侧 7 列：3D 视差全息实时交互实验舱 */}
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
              {/* 动态高光镜面反射层 */}
              <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-0 opacity-50"
                style={{
                  background: `radial-gradient(480px circle at ${tilt.gx}% ${tilt.gy}%, rgba(56,189,248,0.11), transparent 60%)`,
                }}
              />

              {/* 交互舱顶栏：仿 macOS 信号灯 + 三模式切换 */}
              <div className="relative z-10 flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-slate-800/90">
                <div className="flex items-center gap-2">
                  <span className="h-3 w-3 rounded-full bg-rose-500/80" />
                  <span className="h-3 w-3 rounded-full bg-amber-400/80" />
                  <span className="h-3 w-3 rounded-full bg-emerald-400/80" />
                  <span className="ml-2 text-xs font-mono text-slate-400">
                    CoreForge 全息交互沙盒 · 现场动手试玩
                  </span>
                </div>

                <div
                  role="tablist"
                  aria-label="CoreForge 交互演示模式"
                  className="flex items-center gap-1 rounded-xl bg-slate-900/90 p-1 border border-slate-800"
                >
                  {(
                    [
                      { id: 'star-map', label: '🔥 热力星图急救', icon: Activity },
                      { id: 'taylor-lab', label: '📐 泰勒动态拟合', icon: LineChart },
                      { id: 'gallery', label: '🖼️ 实机高清画廊', icon: Maximize2 },
                    ] as const
                  ).map(({ id, label }) => (
                    <button
                      key={id}
                      role="tab"
                      aria-selected={activeTab === id}
                      type="button"
                      onClick={() => setActiveTab(id)}
                      className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition-all cursor-pointer ${
                        activeTab === id
                          ? 'bg-cyan-400/20 text-cyan-200 border border-cyan-400/35 shadow-[0_0_12px_rgba(56,189,248,0.25)]'
                          : 'text-slate-400 hover:text-slate-200'
                      }`}
                    >
                      {label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Tab 1: 红黄绿热力星图交互沙盒 */}
              {activeTab === 'star-map' && (
                <div className="relative z-10 mt-4 flex-1 flex flex-col justify-between gap-4">
                  <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
                    <div className="flex items-center gap-3">
                      <span className="inline-flex items-center gap-1.5 text-rose-300">
                        <span className="h-2.5 w-2.5 rounded-full bg-rose-500 animate-pulse" />
                        盲区红灯 ({dangerCount})
                      </span>
                      <span className="inline-flex items-center gap-1.5 text-amber-300">
                        <span className="h-2.5 w-2.5 rounded-full bg-amber-400" />
                        待巩固
                      </span>
                      <span className="inline-flex items-center gap-1.5 text-emerald-300">
                        <span className="h-2.5 w-2.5 rounded-full bg-emerald-400" />
                        已稳固掌握
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="font-mono text-cyan-300 font-semibold">
                        全库掌握度：{avgMastery}%
                      </span>
                      {dangerCount > 0 ? (
                        <button
                          type="button"
                          onClick={handleRescueAll}
                          className="rounded-lg bg-emerald-500/20 border border-emerald-400/40 px-2.5 py-1 text-emerald-200 hover:bg-emerald-500/30 font-semibold cursor-pointer transition-colors"
                        >
                          ⚡ 一键全量救绿
                        </button>
                      ) : (
                        <button
                          type="button"
                          onClick={handleResetNodes}
                          className="inline-flex items-center gap-1 rounded-lg bg-slate-800 border border-slate-700 px-2.5 py-1 text-slate-300 hover:text-white cursor-pointer"
                        >
                          <RefreshCw className="h-3 w-3" />
                          重置盲区演示
                        </button>
                      )}
                    </div>
                  </div>

                  {/* 拓扑画布 */}
                  <div className="relative h-64 sm:h-72 w-full rounded-xl border border-slate-800/90 bg-[#040711] overflow-hidden">
                    <svg
                      viewBox="0 0 100 100"
                      preserveAspectRatio="none"
                      className="absolute inset-0 h-full w-full pointer-events-none"
                    >
                      {KNOWLEDGE_EDGES.map(([fromId, toId]) => {
                        const a = nodes.find((n) => n.id === fromId);
                        const b = nodes.find((n) => n.id === toId);
                        if (!a || !b) return null;
                        const bothGreen = a.status === 'mastered' && b.status === 'mastered';
                        return (
                          <line
                            key={`${fromId}-${toId}`}
                            x1={a.x}
                            y1={a.y}
                            x2={b.x}
                            y2={b.y}
                            stroke={bothGreen ? 'rgba(52, 211, 153, 0.42)' : 'rgba(56, 189, 248, 0.22)'}
                            strokeWidth="0.45"
                            strokeDasharray={bothGreen ? undefined : '1.5 1.2'}
                          />
                        );
                      })}
                    </svg>

                    {nodes.map((node) => {
                      const isSelected = node.id === selectedNode.id;
                      const colorStyles =
                        node.status === 'danger'
                          ? 'border-rose-400/80 bg-rose-950/85 text-rose-100 shadow-[0_0_20px_rgba(244,63,94,0.55)]'
                          : node.status === 'warning'
                          ? 'border-amber-400/75 bg-amber-950/80 text-amber-100 shadow-[0_0_16px_rgba(251,191,36,0.35)]'
                          : 'border-emerald-400/75 bg-emerald-950/80 text-emerald-100 shadow-[0_0_18px_rgba(52,211,153,0.4)]';

                      return (
                        <button
                          key={node.id}
                          type="button"
                          onClick={() => setSelectedNodeId(node.id)}
                          style={{ left: `${node.x}%`, top: `${node.y}%` }}
                          className={`-translate-x-1/2 -translate-y-1/2 absolute rounded-full border px-3 py-1.5 text-[11px] sm:text-xs font-semibold transition-all cursor-pointer flex items-center gap-1.5 ${colorStyles} ${
                            isSelected ? 'scale-110 ring-2 ring-white/60 z-20' : 'hover:scale-105 z-10'
                          }`}
                        >
                          <span
                            className={`h-2 w-2 rounded-full ${
                              node.status === 'danger'
                                ? 'bg-rose-400 animate-ping'
                                : node.status === 'warning'
                                ? 'bg-amber-300'
                                : 'bg-emerald-400'
                            }`}
                          />
                          <span className="whitespace-nowrap">{node.label}</span>
                          <span className="font-mono opacity-80">{node.accuracy}%</span>
                        </button>
                      );
                    })}

                    <div className="absolute bottom-2.5 left-3 text-[11px] text-slate-400 pointer-events-none">
                      👆 点击图中任意闪烁考点节点查看诊断，亲手体验「提分急救舱」当场救绿
                    </div>
                  </div>

                  {/* 底部选中节点急救详情卡 */}
                  <div className="rounded-xl border border-slate-800 bg-slate-900/75 p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="rounded bg-cyan-500/15 px-2 py-0.5 text-[11px] font-medium text-cyan-300">
                          {selectedNode.category}
                        </span>
                        <h3 className="text-sm font-bold text-white">{selectedNode.label}</h3>
                        <span className="text-xs font-mono text-slate-400">
                          正确率 {selectedNode.accuracy}%
                        </span>
                      </div>
                      <p className="mt-1.5 text-xs text-slate-300">
                        {selectedNode.status === 'mastered'
                          ? selectedNode.rescueTip
                          : selectedNode.detail}
                      </p>
                      {rescueBanner && (
                        <p className="mt-1 text-xs font-medium text-emerald-300">{rescueBanner}</p>
                      )}
                    </div>

                    {selectedNode.status !== 'mastered' ? (
                      <button
                        type="button"
                        onClick={() => handleRescueNode(selectedNode.id)}
                        className="shrink-0 rounded-xl bg-gradient-to-r from-rose-500 to-amber-500 px-4 py-2.5 text-xs font-bold text-white shadow-[0_0_20px_rgba(244,63,94,0.4)] hover:brightness-110 cursor-pointer transition-all"
                      >
                        ⚡ 5 题靶向突击救绿
                      </button>
                    ) : (
                      <span className="shrink-0 inline-flex items-center gap-1.5 rounded-xl border border-emerald-400/35 bg-emerald-500/15 px-3.5 py-2 text-xs font-semibold text-emerald-300">
                        <CheckCircle2 className="h-4 w-4" />
                        该节点已救绿稳固
                      </span>
                    )}
                  </div>
                </div>
              )}

              {/* Tab 2: 考研高数泰勒展开动态逼近实验室 */}
              {activeTab === 'taylor-lab' && (
                <div className="relative z-10 mt-4 flex-1 flex flex-col justify-between gap-4">
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => setTargetFn('sin')}
                        className={`rounded-lg px-3 py-1 text-xs font-mono font-semibold cursor-pointer ${
                          targetFn === 'sin'
                            ? 'bg-cyan-400/20 text-cyan-200 border border-cyan-400/40'
                            : 'bg-slate-900 text-slate-400 border border-slate-800'
                        }`}
                      >
                        f(x) = sin(x)
                      </button>
                      <button
                        type="button"
                        onClick={() => setTargetFn('cos')}
                        className={`rounded-lg px-3 py-1 text-xs font-mono font-semibold cursor-pointer ${
                          targetFn === 'cos'
                            ? 'bg-cyan-400/20 text-cyan-200 border border-cyan-400/40'
                            : 'bg-slate-900 text-slate-400 border border-slate-800'
                        }`}
                      >
                        f(x) = cos(x)
                      </button>
                    </div>

                    <div className="flex items-center gap-3 text-xs">
                      <label htmlFor="taylor-slider" className="text-slate-300 font-medium">
                        展开阶数 N = <strong className="text-pink-300 font-mono">{taylorDegree}</strong>
                      </label>
                      <input
                        id="taylor-slider"
                        type="range"
                        min={0}
                        max={4}
                        step={1}
                        value={orderStep}
                        onChange={(e) => setOrderStep(Number(e.target.value))}
                        className="w-32 accent-cyan-400 cursor-pointer"
                      />
                    </div>
                  </div>

                  <div className="relative rounded-xl border border-slate-800 bg-[#040711] p-3 overflow-hidden">
                    <svg viewBox="0 0 560 230" className="w-full h-56">
                      {/* 坐标轴 */}
                      <line x1="0" y1="115" x2="560" y2="115" stroke="#1e293b" strokeWidth="1" />
                      <line x1="280" y1="0" x2="280" y2="230" stroke="#1e293b" strokeWidth="1" />
                      {/* 真实曲线 */}
                      <path
                        d={truePath}
                        fill="none"
                        stroke="#38bdf8"
                        strokeWidth="2.6"
                        strokeLinecap="round"
                      />
                      {/* 泰勒多项式拟合曲线 */}
                      <path
                        d={approxPath}
                        fill="none"
                        stroke="#f472b6"
                        strokeWidth="2.4"
                        strokeDasharray="6 4"
                        strokeLinecap="round"
                      />
                    </svg>
                    <div className="flex items-center justify-between text-[11px] px-2 pt-1 text-slate-400">
                      <span className="inline-flex items-center gap-1.5">
                        <span className="h-0.5 w-4 bg-cyan-400 inline-block" /> 真实函数曲线
                      </span>
                      <span className="inline-flex items-center gap-1.5">
                        <span className="h-0.5 w-4 bg-pink-400 inline-block" /> 麦克劳林 {taylorDegree} 阶拟合曲线
                      </span>
                    </div>
                  </div>

                  <div className="rounded-xl border border-slate-800 bg-slate-900/80 p-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div>
                      <div className="font-mono text-xs sm:text-sm text-cyan-200">{formulaText}</div>
                      <p className="mt-1 text-xs text-slate-400">
                        拖动上方阶数滑块可直观观测高阶多项式紧贴原函数的包络扩张过程——完整版尽在官网实验室！
                      </p>
                    </div>
                    <a
                      href={AUTHOR_PROFILE.coreforgeLabs}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="shrink-0 inline-flex items-center gap-1.5 rounded-xl bg-cyan-500/20 border border-cyan-400/40 px-3.5 py-2 text-xs font-semibold text-cyan-200 hover:bg-cyan-500/30"
                    >
                      <span>进入完整版高数实验室</span>
                      <ArrowUpRight className="h-3.5 w-3.5" />
                    </a>
                  </div>
                </div>
              )}

              {/* Tab 3: 官方实机高清画廊 */}
              {activeTab === 'gallery' && (
                <div className="relative z-10 mt-4 flex-1 flex flex-col justify-between gap-4">
                  <div className="group relative rounded-xl border border-slate-800 bg-[#040711] overflow-hidden aspect-[16/9]">
                    <img
                      src={currentShot.src}
                      alt={currentShot.title}
                      className="h-full w-full object-cover object-top transition-transform duration-500 group-hover:scale-[1.02]"
                    />
                    <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-slate-950 via-slate-950/75 to-transparent p-4 flex items-end justify-between gap-3">
                      <div>
                        <span className="rounded-full bg-cyan-400/20 border border-cyan-400/35 px-2.5 py-0.5 text-[10px] font-semibold text-cyan-200">
                          {currentShot.badge}
                        </span>
                        <h3 className="mt-1 text-sm font-bold text-white">{currentShot.title}</h3>
                        <p className="mt-0.5 text-xs text-slate-300 line-clamp-2">
                          {currentShot.description}
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={() => openLightbox(currentShot)}
                        className="shrink-0 inline-flex items-center gap-1.5 rounded-lg bg-white/15 hover:bg-white/25 backdrop-blur-md px-3 py-1.5 text-xs font-semibold text-white cursor-pointer"
                      >
                        <Maximize2 className="h-3.5 w-3.5" />
                        <span>全屏高清</span>
                      </button>
                    </div>
                  </div>

                  {/* 缩略图切换条 */}
                  <div className="grid grid-cols-5 gap-2">
                    {COREFORGE_SCREENSHOTS.map((shot, idx) => (
                      <button
                        key={shot.id}
                        type="button"
                        onClick={() => setShotIndex(idx)}
                        className={`relative rounded-lg overflow-hidden border aspect-[16/10] cursor-pointer transition-all ${
                          idx === shotIndex
                            ? 'border-cyan-400 ring-2 ring-cyan-400/40 scale-[1.02]'
                            : 'border-slate-800 opacity-60 hover:opacity-95'
                        }`}
                      >
                        <img src={shot.src} alt={shot.badge} className="h-full w-full object-cover" />
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* 原生 Top-Layer 高清实机截图灯箱模态框 */}
      <dialog
        ref={lightboxRef}
        {...({ closedby: 'any' } as React.DialogHTMLAttributes<HTMLDialogElement>)}
        aria-label="CoreForge 研核实机高清预览"
        className="cyber-dialog w-full"
      >
        {lightboxShot && (
          <div className="rounded-2xl border border-slate-700/80 bg-[#070b16]/95 p-4 sm:p-6 shadow-2xl backdrop-blur-2xl">
            <div className="flex items-center justify-between gap-4 pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2.5">
                <ShieldCheck className="h-4 w-4 text-cyan-400" />
                <h3 className="text-sm sm:text-base font-bold text-white">{lightboxShot.title}</h3>
              </div>
              <button
                type="button"
                onClick={() => void closeDialogSmoothly(lightboxRef.current)}
                aria-label="关闭大图预览"
                className="rounded-full border border-slate-700 bg-slate-900 p-1.5 text-slate-300 hover:text-white cursor-pointer"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
            <div className="mt-4 overflow-hidden rounded-xl border border-slate-800 bg-black">
              <img
                src={lightboxShot.src}
                alt={lightboxShot.title}
                className="max-h-[70vh] w-full object-contain"
              />
            </div>
            <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
              <p className="text-xs sm:text-sm text-slate-300 max-w-2xl">
                {lightboxShot.description}
              </p>
              <a
                href={lightboxShot.liveUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 rounded-full bg-cyan-400 px-4 py-2 text-xs font-bold text-slate-950 hover:brightness-110"
              >
                <span>前往线上环境亲手试玩</span>
                <ArrowUpRight className="h-3.5 w-3.5" />
              </a>
            </div>
          </div>
        )}
      </dialog>
    </section>
  );
};
