import React, { useState } from 'react';
import {
  ArrowUpRight,
  Check,
  Copy,
  Download,
  Github,
  Languages,
  Palette,
  RefreshCcw,
  Shield,
  Sliders,
  Sparkles,
  Volume2,
} from 'lucide-react';
import { ANTIGRAVITY_SKINS, AUTHOR_PROFILE, AntigravitySkinPreset } from '../data/siteData';

export const AntigravityShowcase: React.FC = () => {
  const defaultClannadSkin =
    ANTIGRAVITY_SKINS.find((s) => s.id === 'clannad-illusionary-orbs') ?? ANTIGRAVITY_SKINS[0];
  const [selectedSkin, setSelectedSkin] = useState<AntigravitySkinPreset>(defaultClannadSkin);
  const [localized, setLocalized] = useState<boolean>(true);
  const [glassBlur, setGlassBlur] = useState<number>(defaultClannadSkin.blur);
  const [cardOpacity, setCardOpacity] = useState<number>(defaultClannadSkin.opacity);
  const [borderRadius, setBorderRadius] = useState<number>(defaultClannadSkin.radius);
  const [quotaPercent, setQuotaPercent] = useState<number>(22);
  const [accountIndex, setAccountIndex] = useState<number>(1);
  const [petPingCount, setPetPingCount] = useState<number>(0);
  const [copiedCmd, setCopiedCmd] = useState<boolean>(false);

  const handleSelectSkin = (skin: AntigravitySkinPreset) => {
    setSelectedSkin(skin);
    setGlassBlur(skin.blur);
    setCardOpacity(skin.opacity);
    setBorderRadius(skin.radius);
  };

  const handleSwitchAccount = () => {
    setAccountIndex((prev) => (prev % 4) + 1);
    setQuotaPercent(98);
  };

  const handleCopyReleaseCmd = async () => {
    try {
      await navigator.clipboard.writeText(
        'git clone https://github.com/qts2218346424-cyber/antigravity-zh-cn.git'
      );
      setCopiedCmd(true);
      setTimeout(() => setCopiedCmd(false), 2000);
    } catch {
      // 忽略无剪贴板权限环境
    }
  };

  const petExtraQuotes = [
    selectedSkin.petQuote,
    '「Tokio 守护哨兵巡检完毕：app.asar SHA-256 签名一致，代码区 100% 纯净未误翻！」',
    '「双端光学材质热重载已生效，连智能体思考折叠面板也全汉化啦！」',
  ];
  const currentQuote = petExtraQuotes[petPingCount % petExtraQuotes.length];

  return (
    <section id="antigravity" className="relative py-24 sm:py-32 overflow-hidden">
      {/* 极光洋红×暖金体积光 */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute top-20 right-[-10%] h-[500px] w-[520px] rounded-full bg-pink-500/12 blur-[140px]"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute bottom-10 left-[-8%] h-[420px] w-[440px] rounded-full bg-amber-500/10 blur-[130px]"
      />

      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        {/* 章节头部 */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-pink-400/30 bg-pink-500/10 px-3.5 py-1 text-xs font-semibold text-pink-300 mb-4">
              <Sparkles className="h-3.5 w-3.5" />
              <span>重点旗舰项目 02 · Tauri v2 + Rust 原生反重力汉化与美学控制中心</span>
            </div>
            <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white">
              <span className="text-antigravity-gradient">Antigravity Studio</span>
              <span className="text-slate-200"> · 反重力全能汉化引擎</span>
            </h2>
            <p className="mt-4 max-w-2xl text-slate-300 text-base leading-relaxed">
              彻底告别早期零散批处理与破坏性脚本。以高性能 <strong className="text-white">Rust 原生桌面内核</strong> 统一集成「<strong className="text-pink-300">全量双层无损汉化</strong>」、「<strong className="text-amber-200">10 款高定光学材质包</strong>」、「<strong className="text-emerald-300">7 角色动漫语音独立桌面伴侣</strong>」与「多账号配额反代网关」。
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 shrink-0">
            <a
              href={AUTHOR_PROFILE.antigravityReleases}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-pink-500 via-rose-500 to-amber-400 px-5 py-3 text-sm font-bold text-slate-950 shadow-[0_0_32px_rgba(244,114,182,0.45)] hover:brightness-110 transition-all"
            >
              <Download className="h-4 w-4" />
              <span>下载最新安装包 (Releases)</span>
            </a>
            <a
              href={AUTHOR_PROFILE.antigravityRepo}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-full border border-slate-700 bg-slate-900/80 px-4 py-3 text-sm font-semibold text-slate-200 hover:border-pink-400/60 hover:text-white transition-colors"
            >
              <Github className="h-4 w-4" />
              <span>antigravity-zh-cn 仓库</span>
              <ArrowUpRight className="h-4 w-4" />
            </a>
          </div>
        </div>

        {/* 核心交互大展台：左侧 Color DNA 实时编译器 + 右侧拟真 Antigravity IDE 实时换肤/汉化预览窗 */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-7 items-stretch">
          {/* 左侧 5 列：Color DNA 光学控制台 + 汉化注入开关 */}
          <div className="lg:col-span-5 flex flex-col justify-between gap-5">
            <div className="clannad-crystal-panel rounded-3xl p-5 sm:p-6">
              {/* 双层无损汉化实时对比开关 */}
              <div className="rounded-xl border border-pink-400/30 bg-pink-500/8 p-4 mb-5">
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-2.5">
                    <Languages className="h-5 w-5 text-pink-400" />
                    <div>
                      <div className="text-sm font-bold text-white">双层无损汉化实时对比</div>
                      <div className="text-[11px] text-slate-300">
                        拨动右侧开关，观察拟真 IDE 菜单与思考流变化
                      </div>
                    </div>
                  </div>
                  <button
                    type="button"
                    role="switch"
                    aria-checked={localized}
                    onClick={() => setLocalized((prev) => !prev)}
                    className={`relative inline-flex h-7 w-14 shrink-0 items-center rounded-full transition-colors cursor-pointer ${
                      localized ? 'bg-pink-500' : 'bg-slate-700'
                    }`}
                  >
                    <span
                      className={`inline-block h-5 w-5 transform rounded-full bg-white shadow transition-transform ${
                        localized ? 'translate-x-8' : 'translate-x-1'
                      }`}
                    />
                  </button>
                </div>
                <div className="mt-2.5 flex items-center justify-between text-[11px] font-mono">
                  <span className={!localized ? 'text-amber-300 font-bold' : 'text-slate-400'}>
                    [Raw English UI]
                  </span>
                  <span className={localized ? 'text-emerald-300 font-bold' : 'text-slate-400'}>
                    [✓ zh-CN 双层精校 + 代码避让]
                  </span>
                </div>
              </div>

              {/* 5 款精选高定光学皮肤选择器 */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
                    <Palette className="h-3.5 w-3.5 text-pink-400" />
                    <span>高定光学材质画廊（精选 5 / 10 款）</span>
                  </span>
                  <span className="text-[11px] font-mono text-pink-300">{selectedSkin.id}</span>
                </div>

                <div className="space-y-2">
                  {ANTIGRAVITY_SKINS.map((skin) => {
                    const active = skin.id === selectedSkin.id;
                    return (
                      <button
                        key={skin.id}
                        type="button"
                        onClick={() => handleSelectSkin(skin)}
                        className={`w-full text-left rounded-xl border p-3 transition-all cursor-pointer flex items-center justify-between gap-3 ${
                          active
                            ? 'border-pink-400/65 bg-white/8 shadow-[0_0_24px_rgba(244,114,182,0.16)]'
                            : 'border-slate-800/80 bg-slate-950/60 hover:border-slate-700'
                        }`}
                      >
                        <div className="flex items-center gap-3 min-w-0">
                          <span
                            className="h-7 w-7 rounded-lg shrink-0 border border-white/20 shadow-inner"
                            style={{
                              background: `linear-gradient(135deg, ${skin.bg} 40%, ${skin.accent} 100%)`,
                            }}
                          />
                          <div className="truncate">
                            <div className="text-xs sm:text-sm font-bold text-white truncate">
                              {skin.name}
                            </div>
                            <div className="text-[11px] text-slate-400 truncate">
                              伴侣联动：{skin.petEmoji} {skin.petName}
                            </div>
                          </div>
                        </div>
                        <span
                          className="h-2.5 w-2.5 rounded-full shrink-0"
                          style={{
                            backgroundColor: skin.accent,
                            boxShadow: `0 0 10px ${skin.accent}`,
                          }}
                        />
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Color DNA 物理表面实时参数滑块 */}
              <div className="mt-5 pt-4 border-t border-slate-800/80 space-y-3">
                <div className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
                  <Sliders className="h-3.5 w-3.5 text-amber-300" />
                  <span>Color DNA 物理表面实时编译器</span>
                </div>

                <div className="grid grid-cols-3 gap-3 text-[11px]">
                  <label className="block">
                    <span className="text-slate-400 flex justify-between">
                      <span>磨玻璃</span>
                      <strong className="text-slate-200 font-mono">{glassBlur}px</strong>
                    </span>
                    <input
                      type="range"
                      min={4}
                      max={32}
                      value={glassBlur}
                      onChange={(e) => setGlassBlur(Number(e.target.value))}
                      className="mt-1 w-full accent-pink-400 cursor-pointer"
                    />
                  </label>
                  <label className="block">
                    <span className="text-slate-400 flex justify-between">
                      <span>通透度</span>
                      <strong className="text-slate-200 font-mono">{cardOpacity}%</strong>
                    </span>
                    <input
                      type="range"
                      min={55}
                      max={96}
                      value={cardOpacity}
                      onChange={(e) => setCardOpacity(Number(e.target.value))}
                      className="mt-1 w-full accent-pink-400 cursor-pointer"
                    />
                  </label>
                  <label className="block">
                    <span className="text-slate-400 flex justify-between">
                      <span>圆角曲率</span>
                      <strong className="text-slate-200 font-mono">{borderRadius}px</strong>
                    </span>
                    <input
                      type="range"
                      min={4}
                      max={24}
                      value={borderRadius}
                      onChange={(e) => setBorderRadius(Number(e.target.value))}
                      className="mt-1 w-full accent-pink-400 cursor-pointer"
                    />
                  </label>
                </div>
              </div>
            </div>

            {/* 快捷克隆命令条 */}
            <div className="clannad-crystal-panel rounded-3xl p-4 flex items-center justify-between gap-3">
              <div className="min-w-0">
                <div className="text-[11px] text-pink-300 font-semibold mb-0.5">
                  开源 MIT 协议 · 支持一键本地构建与 Minisign OTA
                </div>
                <code className="block truncate font-mono text-xs text-slate-300">
                  git clone https://github.com/qts2218346424-cyber/antigravity-zh-cn.git
                </code>
              </div>
              <button
                type="button"
                onClick={() => void handleCopyReleaseCmd()}
                className="shrink-0 inline-flex items-center gap-1.5 rounded-xl border border-pink-400/35 bg-pink-500/15 px-3 py-2 text-xs font-semibold text-pink-200 hover:bg-pink-500/25 cursor-pointer"
              >
                {copiedCmd ? <Check className="h-3.5 w-3.5 text-emerald-300" /> : <Copy className="h-3.5 w-3.5" />}
                <span>{copiedCmd ? '已复制' : '复制命令'}</span>
              </button>
            </div>
          </div>

          {/* 右侧 7 列：拟真微缩 Antigravity IDE + 独立灵动桌面伴侣实时渲染窗 */}
          <div className="lg:col-span-7 flex flex-col">
            <div
              style={{
                borderRadius: `${borderRadius}px`,
                borderColor: selectedSkin.border,
                backgroundColor: selectedSkin.bg,
                color: selectedSkin.fg,
                boxShadow: `0 30px 80px -18px rgba(0,0,0,0.85), 0 0 42px ${selectedSkin.glow}`,
              }}
              className="relative flex-1 border overflow-hidden transition-all duration-300 flex flex-col justify-between min-h-[510px]"
            >
              {/* 若皮肤带场景氛围底图（如 CLANNAD 光玉 / 樱雪）则柔和叠底 */}
              {selectedSkin.petBackdrop && (
                <img
                  src={selectedSkin.petBackdrop}
                  alt=""
                  aria-hidden="true"
                  className="pointer-events-none absolute inset-0 h-full w-full object-cover opacity-15 mix-blend-screen"
                />
              )}

              {/* 拟真客户端顶栏菜单（展示主进程汉化对比） */}
              <div
                style={{
                  backgroundColor: selectedSkin.titleBar,
                  borderBottomColor: selectedSkin.border,
                }}
                className="relative z-10 flex items-center justify-between px-4 py-2.5 border-b text-xs"
              >
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-1.5">
                    <span className="h-2.5 w-2.5 rounded-full bg-rose-500/85" />
                    <span className="h-2.5 w-2.5 rounded-full bg-amber-400/85" />
                    <span className="h-2.5 w-2.5 rounded-full bg-emerald-400/85" />
                  </div>
                  <div className="hidden sm:flex items-center gap-3 text-[11px] opacity-85">
                    {localized ? (
                      <>
                        <span>文件(F)</span>
                        <span>编辑(E)</span>
                        <span>视图(V)</span>
                        <span>智能体(A)</span>
                        <span>终端(T)</span>
                      </>
                    ) : (
                      <>
                        <span>File</span>
                        <span>Edit</span>
                        <span>View</span>
                        <span>Agents</span>
                        <span>Terminal</span>
                      </>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span
                    style={{
                      borderColor: `${selectedSkin.accent}55`,
                      color: selectedSkin.accent,
                    }}
                    className="rounded-full border px-2.5 py-0.5 text-[10px] font-mono font-semibold"
                  >
                    {selectedSkin.name} · Blur {glassBlur}px
                  </span>
                </div>
              </div>

              {/* 拟真 IDE 主体工作区：左侧资源树 + 中央代码（永不误翻！） + 右侧中文思考流 */}
              <div className="relative z-10 flex-1 grid grid-cols-1 md:grid-cols-12">
                {/* 侧边栏（应用实时 glassBlur 与 cardOpacity） */}
                <div
                  style={{
                    backgroundColor: `color-mix(in oklab, ${selectedSkin.sidebar} ${cardOpacity}%, transparent)`,
                    backdropFilter: `blur(${glassBlur}px)`,
                    WebkitBackdropFilter: `blur(${glassBlur}px)`,
                    borderRightColor: selectedSkin.border,
                  }}
                  className="md:col-span-3 border-b md:border-b-0 md:border-r p-3.5 text-xs space-y-2.5"
                >
                  <div
                    style={{ color: selectedSkin.muted }}
                    className="text-[10px] font-bold uppercase tracking-wider"
                  >
                    {localized ? '资源管理器 · 工作区' : 'EXPLORER · WORKSPACE'}
                  </div>
                  <div className="space-y-1 font-mono text-[11px]">
                    <div
                      style={{
                        backgroundColor: `${selectedSkin.accent}22`,
                        boxShadow: `inset 2px 0 0 ${selectedSkin.accent}`,
                      }}
                      className="rounded px-2 py-1 font-semibold"
                    >
                      🦀 asar_patcher.rs
                    </div>
                    <div className="px-2 py-1 opacity-75">🎨 color_dna.ts</div>
                    <div className="px-2 py-1 opacity-75">🪐 pet_spring.ts</div>
                    <div className="px-2 py-1 opacity-75">🛡️ tokio_watchdog.rs</div>
                  </div>

                  <div className="pt-2 border-t border-white/10 space-y-1.5 text-[11px]">
                    <div className="flex items-center gap-1.5 font-semibold" style={{ color: selectedSkin.accent }}>
                      <Shield className="h-3.5 w-3.5" />
                      <span>{localized ? 'Tokio 守护哨兵已激活' : 'Watchdog Active'}</span>
                    </div>
                    <p style={{ color: selectedSkin.muted }} className="text-[10px] leading-relaxed">
                      {localized
                        ? '官方静默更新后自动无感重注汉化补丁与当前光学材质'
                        : 'Auto re-applies patches after upstream client updates'}
                    </p>
                  </div>
                </div>

                {/* 中央代码与右侧 AI 对话舱 */}
                <div className="md:col-span-9 p-4 flex flex-col justify-between gap-4">
                  {/* 代码编辑器展示：强调代码标识符精准避让绝不误翻 */}
                  <div
                    style={{
                      backgroundColor: `color-mix(in oklab, ${selectedSkin.panel} ${cardOpacity}%, transparent)`,
                      borderColor: selectedSkin.border,
                      borderRadius: `${Math.max(6, borderRadius - 4)}px`,
                    }}
                    className="border p-3.5 font-mono text-[11px] sm:text-xs leading-relaxed"
                  >
                    <div className="flex items-center justify-between pb-2 mb-2 border-b border-white/10 text-[10px]">
                      <span style={{ color: selectedSkin.muted }}>
                        src-tauri/src/modules/studio/asar_patcher.rs
                      </span>
                      <span className="rounded bg-emerald-500/15 text-emerald-300 px-2 py-0.5">
                        ✓ 代码与终端区域 100% 精准避让保护
                      </span>
                    </div>
                    <pre className="overflow-x-auto text-slate-200">
                      <code>{`pub fn rebuild_asar_integrity(archive: &Path) -> Result<String> {
    let digest = sha256_stream(archive)?;
    inject_optical_variables("--agzh-glass-blur", "${glassBlur}px");
    Ok(digest) // SHA-256 Verified Lossless
}`}</code>
                    </pre>
                  </div>

                  {/* 智能体思考面板对比（直观体现英文生肉 vs 纯正中文呈现） */}
                  <div
                    style={{
                      backgroundColor: `color-mix(in oklab, ${selectedSkin.panel} ${cardOpacity}%, transparent)`,
                      borderColor: selectedSkin.border,
                      borderRadius: `${Math.max(6, borderRadius - 4)}px`,
                    }}
                    className="border p-3.5 text-xs"
                  >
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="font-bold flex items-center gap-1.5" style={{ color: selectedSkin.accent }}>
                        <Sparkles className="h-3.5 w-3.5" />
                        <span>
                          {localized ? '智能体深度思考折叠面板（全中文协议）' : 'Agent Thinking Process'}
                        </span>
                      </span>
                      <span className="text-[10px] opacity-70">
                        {localized ? '已完成双层映射' : 'Unlocalized'}
                      </span>
                    </div>
                    <p style={{ color: selectedSkin.fg }} className="text-xs leading-relaxed opacity-90">
                      {localized
                        ? '正在巡检本地 OAuth 账号池配额与光学材质参数……已将自定义表面参数同步注入 BaseWindow 与全部 WebContentsView 子视图，零闪烁热重载完毕。'
                        : 'Checking local OAuth token pool quota and compiling surface parameters into BaseWindow & WebContentsView instances...'}
                    </p>
                  </div>

                  {/* 独立透明悬浮窗桌面伴侣 + 灵动岛配额预警互动区 */}
                  <div
                    style={{
                      borderColor: `${selectedSkin.accent}66`,
                      background: `linear-gradient(135deg, ${selectedSkin.panel}ee, ${selectedSkin.bg}f2)`,
                      borderRadius: `${Math.max(10, borderRadius)}px`,
                    }}
                    className="border p-3.5 shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                  >
                    <button
                      type="button"
                      onClick={() => setPetPingCount((c) => c + 1)}
                      className="flex items-center gap-3 text-left group cursor-pointer"
                      title="点击触发桌面伴侣离线语音台词互动"
                    >
                      <div
                        style={{
                          backgroundColor: `${selectedSkin.accent}24`,
                          borderColor: `${selectedSkin.accent}66`,
                        }}
                        className="h-11 w-11 rounded-2xl border flex items-center justify-center text-2xl shrink-0 transition-transform group-hover:scale-110 group-hover:-rotate-6"
                      >
                        {selectedSkin.petEmoji}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold text-white">
                            独立桌面伴侣 · {selectedSkin.petName}
                          </span>
                          <span className="inline-flex items-center gap-1 text-[10px] text-pink-300">
                            <Volume2 className="h-3 w-3" /> 点我互动切台词
                          </span>
                        </div>
                        <p className="mt-0.5 text-xs text-slate-200">{currentQuote}</p>
                      </div>
                    </button>

                    {/* 灵动岛算力配额舱一键切号演示 */}
                    <div className="shrink-0 rounded-xl border border-white/10 bg-black/35 px-3 py-2 flex items-center gap-2.5 text-[11px]">
                      <div>
                        <div className="text-slate-400">
                          账号 #{accountIndex} 算力池
                        </div>
                        <div
                          className={`font-mono font-bold ${
                            quotaPercent < 30 ? 'text-rose-400' : 'text-emerald-400'
                          }`}
                        >
                          {quotaPercent < 30 ? `⚠️ 低额预警 ${quotaPercent}%` : `● 充沛 ${quotaPercent}%`}
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={handleSwitchAccount}
                        className="inline-flex items-center gap-1 rounded-lg px-2.5 py-1.5 font-semibold text-slate-950 cursor-pointer transition-transform active:scale-95"
                        style={{ backgroundColor: selectedSkin.accent }}
                      >
                        <RefreshCcw className="h-3 w-3" />
                        <span>一键切号</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* 拟真 IDE 底部状态栏 */}
              <div
                style={{ backgroundColor: selectedSkin.statusBar }}
                className="relative z-10 px-4 py-1.5 flex flex-wrap items-center justify-between gap-2 text-[11px] font-mono text-white/90"
              >
                <span>
                  {localized
                    ? '⚡ 本地反代网关: 127.0.0.1:8787 [在线] · 词典覆盖率 100%'
                    : '⚡ Local API Proxy: 127.0.0.1:8787 [ONLINE]'}
                </span>
                <span>{selectedSkin.description.slice(0, 34)}…</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
