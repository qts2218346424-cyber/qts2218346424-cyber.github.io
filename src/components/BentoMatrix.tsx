import React, { useRef, useState } from 'react';
import {
  ArrowUpRight,
  Check,
  Code2,
  Copy,
  Cpu,
  ExternalLink,
  FolderGit2,
  Gauge,
  Github,
  Sparkles,
  Terminal,
} from 'lucide-react';
import {
  AUTHOR_PROFILE,
  PROJECTS_DIRECTORY,
  TECH_ARSENAL_ROW_1,
  TECH_ARSENAL_ROW_2,
} from '../data/siteData';

interface BentoMatrixProps {
  motionPaused: boolean;
}

interface TerminalLine {
  id: number;
  type: 'cmd' | 'output';
  text: string;
}

const INITIAL_LOGS: TerminalLine[] = [
  { id: 1, type: 'cmd', text: 'hikari@hikarizaka:~$ status --flagships' },
  {
    id: 2,
    type: 'output',
    text: '[OK] 四大旗舰就绪：CoreForge 研核 | Antigravity 汉化 | 星语恋庭 (star.claudexxb.online) | 苍穹量枢量化终端',
  },
  {
    id: 3,
    type: 'output',
    text: '[OK] Antigravity Studio (antigravity-zh-cn) — Rust ASAR 双层无损汉化 & 10 款光学材质引擎已装载',
  },
];

export const BentoMatrix: React.FC<BentoMatrixProps> = ({ motionPaused }) => {
  const gridRef = useRef<HTMLDivElement | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [logs, setLogs] = useState<TerminalLine[]>(INITIAL_LOGS);
  const [cmdInput, setCmdInput] = useState<string>('');

  // Raycast 风格跨卡片鼠标距离感应聚光灯引擎
  const handleGridMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!gridRef.current) return;
    const cards = gridRef.current.querySelectorAll<HTMLElement>('.spotlight-card');
    cards.forEach((card) => {
      const rect = card.getBoundingClientRect();
      card.style.setProperty('--mouse-x', `${e.clientX - rect.left}px`);
      card.style.setProperty('--mouse-y', `${e.clientY - rect.top}px`);
    });
  };

  const handleCopy = async (id: string, content: string) => {
    try {
      await navigator.clipboard.writeText(content);
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 1800);
    } catch {
      // 忽略剪贴板受限环境
    }
  };

  const executeTerminalCommand = (raw: string) => {
    const cmd = raw.trim().toLowerCase();
    if (!cmd) return;

    if (cmd === 'clear') {
      setLogs([]);
      setCmdInput('');
      return;
    }

    let reply = '';
    if (cmd === 'whoami') {
      reply = `${AUTHOR_PROFILE.name} (${AUTHOR_PROFILE.handle}) — 独立全栈架构师 / Rust & React 造物极客`;
    } else if (cmd === 'projects') {
      reply =
        '1) CoreForge 研核 (claudexxb.online) | 2) Antigravity Studio | 3) 星语恋庭 (star.claudexxb.online) | 4) 苍穹量枢 (aether-quant-studio)';
    } else if (cmd === 'open coreforge') {
      reply = '正在新标签页为你开启 CoreForge 研核线上官网 https://claudexxb.online ...';
      window.open(AUTHOR_PROFILE.coreforgeSite, '_blank', 'noopener,noreferrer');
    } else if (cmd === 'open antigravity') {
      reply = '正在新标签页为你开启 Antigravity Studio 开源仓库 ...';
      window.open(AUTHOR_PROFILE.antigravityRepo, '_blank', 'noopener,noreferrer');
    } else if (cmd === 'open persona') {
      reply = '正在新标签页为你开启星语恋庭免注册互动剧场 https://star.claudexxb.online/?demo=1 ...';
      window.open(AUTHOR_PROFILE.personaDemo, '_blank', 'noopener,noreferrer');
    } else if (cmd === 'open quant') {
      reply = '正在新标签页为你开启苍穹量枢币安量化开源仓库 ...';
      window.open(AUTHOR_PROFILE.quantRepo, '_blank', 'noopener,noreferrer');
    } else if (cmd === 'stack') {
      reply =
        'Rust · Tauri v2 · Python FastAPI · Node.js 22.5 SQLite · React 19 · TypeScript 6 · TypeSafe Jev · Obsidian AST';
    } else if (cmd === 'contact') {
      reply = `QQ: ${AUTHOR_PROFILE.qq} | B站 UID: ${AUTHOR_PROFILE.bilibiliUid} | 邮箱: ${AUTHOR_PROFILE.email}`;
    } else if (cmd === 'help') {
      reply =
        '可用指令: whoami | contact | projects | stack | open coreforge | open antigravity | open persona | open quant | clear';
    } else {
      reply = `未知指令 "${raw}"。输入 help 查看支持的极客快捷命令。`;
    }

    setLogs((prev) => [
      ...prev.slice(-7),
      { id: Date.now(), type: 'cmd', text: `hikari@hikarizaka:~$ ${raw}` },
      { id: Date.now() + 1, type: 'output', text: reply },
    ]);
    setCmdInput('');
  };

  return (
    <section id="matrix" className="relative py-24 sm:py-32">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="mb-12">
          <div className="clannad-pill-btn inline-flex items-center gap-2 rounded-full px-3.5 py-1 text-xs font-medium tracking-wide text-pink-100 mb-4">
            <FolderGit2 className="h-3.5 w-3.5 text-amber-200" />
            <span>全项目仓库传送门 · 光坂工程矩阵</span>
          </div>
          <h2 className="font-clannad-serif text-3xl sm:text-5xl font-bold tracking-wider text-white">
            开源项目全景传送门 <span className="text-aurora-gradient">&amp; 琉璃工程矩阵</span>
          </h2>
          <p className="mt-3 max-w-2xl text-pink-50/85 text-base">
            移动鼠标感受跨卡片香槟光玉与春樱珠光边框折射。所有核心仓库地址、线上直连站点与克隆指令均一站式汇总于此。
          </p>
        </div>

        {/* 聚光灯 Bento 大矩阵 */}
        <div
          ref={gridRef}
          onMouseMove={handleGridMouseMove}
          className="grid grid-cols-1 lg:grid-cols-12 gap-5"
        >
          {/* 项目目录主卡片组（遍历全部项目，突出双旗舰） */}
          {PROJECTS_DIRECTORY.map((proj) => (
            <article
              key={proj.id}
              style={
                {
                  '--spotlight-color': `${proj.accentColor}aa`,
                  '--spotlight-surface': `${proj.accentColor}16`,
                } as React.CSSProperties
              }
              className={`spotlight-card p-6 flex flex-col justify-between gap-5 ${
                proj.flagship ? 'lg:col-span-6' : 'lg:col-span-6'
              }`}
            >
              <div className="relative z-10">
                <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
                  <div className="flex items-center gap-2">
                    {proj.flagship && (
                      <span
                        style={{
                          borderColor: `${proj.accentColor}55`,
                          backgroundColor: `${proj.accentColor}1a`,
                          color: proj.accentColor,
                        }}
                        className="rounded-full border px-2.5 py-0.5 text-[11px] font-bold"
                      >
                        ★ 核心主推旗舰
                      </span>
                    )}
                    <span className="font-mono text-xs text-slate-400">{proj.codename}</span>
                  </div>

                  <a
                    href={proj.repoUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-xs text-slate-300 hover:text-white"
                  >
                    <Github className="h-3.5 w-3.5" />
                    <span>GitHub</span>
                    <ArrowUpRight className="h-3.5 w-3.5" />
                  </a>
                </div>

                <h3 className="text-xl font-bold text-white">{proj.name}</h3>
                <p className="mt-2 text-sm text-slate-300 leading-relaxed">{proj.summary}</p>

                <ul className="mt-3.5 space-y-1.5 text-xs text-slate-300/90">
                  {proj.highlights.map((item) => (
                    <li key={item} className="flex items-start gap-2">
                      <Sparkles
                        className="h-3.5 w-3.5 shrink-0 mt-0.5"
                        style={{ color: proj.accentColor }}
                      />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="relative z-10 pt-4 border-t border-slate-800/80 space-y-3">
                {/* 技术栈胶囊 */}
                <div className="flex flex-wrap gap-1.5">
                  {proj.techStack.map((tech) => (
                    <span
                      key={tech}
                      className="rounded-md border border-slate-800 bg-slate-950/75 px-2 py-0.5 font-mono text-[11px] text-slate-300"
                    >
                      {tech}
                    </span>
                  ))}
                </div>

                {/* 附加子链接 */}
                {proj.extraLinks && proj.extraLinks.length > 0 && (
                  <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs">
                    {proj.extraLinks.map((lnk) => (
                      <a
                        key={lnk.url}
                        href={lnk.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 text-cyan-300 hover:underline"
                      >
                        <span>{lnk.label}</span>
                        <ExternalLink className="h-3 w-3" />
                      </a>
                    ))}
                  </div>
                )}

                {/* 主跳转按钮 + 克隆复制按钮 */}
                <div className="flex flex-wrap items-center justify-between gap-2 pt-1">
                  <a
                    href={proj.primaryUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      backgroundColor: `${proj.accentColor}22`,
                      borderColor: `${proj.accentColor}55`,
                      color: '#ffffff',
                    }}
                    className="inline-flex items-center gap-1.5 rounded-xl border px-4 py-2 text-xs font-bold hover:brightness-125 transition-all"
                  >
                    <span>{proj.primaryLabel}</span>
                    <ArrowUpRight className="h-3.5 w-3.5" />
                  </a>

                  {proj.cloneCmd && (
                    <button
                      type="button"
                      onClick={() => void handleCopy(proj.id, proj.cloneCmd!)}
                      className="inline-flex items-center gap-1.5 rounded-xl border border-slate-700/80 bg-slate-900/85 px-3 py-2 text-xs text-slate-300 hover:text-white cursor-pointer"
                    >
                      {copiedId === proj.id ? (
                        <>
                          <Check className="h-3.5 w-3.5 text-emerald-400" />
                          <span className="text-emerald-300">已复制 git clone</span>
                        </>
                      ) : (
                        <>
                          <Copy className="h-3.5 w-3.5" />
                          <span>复制克隆命令</span>
                        </>
                      )}
                    </button>
                  )}
                </div>
              </div>
            </article>
          ))}

          {/* Bento 宽卡：全栈军火库双轨流光跑马灯 */}
          <div className="spotlight-card lg:col-span-7 p-6 flex flex-col justify-between gap-5">
            <div className="relative z-10 flex items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <Code2 className="h-4 w-4 text-cyan-400" />
                <h3 className="text-base font-bold text-white">全栈工程军火库 · Tech Arsenal</h3>
              </div>
              <span className="text-[11px] font-mono text-slate-400">
                悬停可定格细看 · 跨端原生与现代前端全覆盖
              </span>
            </div>

            <div className="relative z-10 space-y-3 overflow-hidden py-1 [mask-image:linear-gradient(to_right,transparent,#000_10%,#000_90%,transparent)]">
              <div
                data-paused={motionPaused ? 'true' : 'false'}
                className="marquee-track-left gap-3"
              >
                {[...TECH_ARSENAL_ROW_1, ...TECH_ARSENAL_ROW_1].map((item, idx) => (
                  <span
                    key={`r1-${idx}`}
                    className="rounded-xl border border-cyan-400/25 bg-cyan-950/30 px-3.5 py-2 text-xs font-medium text-cyan-100 whitespace-nowrap"
                  >
                    ✦ {item}
                  </span>
                ))}
              </div>

              <div
                data-paused={motionPaused ? 'true' : 'false'}
                className="marquee-track-right gap-3"
              >
                {[...TECH_ARSENAL_ROW_2, ...TECH_ARSENAL_ROW_2].map((item, idx) => (
                  <span
                    key={`r2-${idx}`}
                    className="rounded-xl border border-pink-400/25 bg-pink-950/25 px-3.5 py-2 text-xs font-medium text-pink-100 whitespace-nowrap"
                  >
                    ◈ {item}
                  </span>
                ))}
              </div>
            </div>

            {/* 底层性能信仰四宫格 */}
            <div className="relative z-10 grid grid-cols-2 sm:grid-cols-4 gap-2.5 pt-2">
              {[
                { label: '后端极速打包', val: '8ms esbuild' },
                { label: 'ASAR 签名校验', val: 'SHA-256 零损' },
                { label: 'AI 阅卷响应', val: '~1.2s 四维批改' },
                { label: '渲染管线标准', val: '60fps 合成器' },
              ].map((m) => (
                <div
                  key={m.label}
                  className="rounded-xl border border-slate-800/90 bg-slate-950/70 px-3 py-2.5"
                >
                  <div className="text-xs font-mono font-bold text-white flex items-center gap-1">
                    <Gauge className="h-3 w-3 text-emerald-400" />
                    <span>{m.val}</span>
                  </div>
                  <div className="mt-0.5 text-[11px] text-slate-400">{m.label}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Bento 终端卡：可交互极客命令行 */}
          <div className="spotlight-card lg:col-span-5 p-5 flex flex-col justify-between gap-3">
            <div className="relative z-10 flex items-center justify-between border-b border-slate-800 pb-2.5">
              <div className="flex items-center gap-2 text-xs font-bold text-white">
                <Terminal className="h-4 w-4 text-amber-200" />
                <span>空の光 · 光坂星夜手札终端</span>
              </div>
              <span className="font-mono text-[10px] text-emerald-400 flex items-center gap-1">
                <Cpu className="h-3 w-3" /> interactive
              </span>
            </div>

            {/* 快捷指令胶囊 */}
            <div className="relative z-10 flex flex-wrap gap-1.5 text-[11px] font-mono">
              {[
                'whoami',
                'contact',
                'projects',
                'open coreforge',
                'open persona',
                'open quant',
                'open antigravity',
                'clear',
              ].map((preset) => (
                  <button
                    key={preset}
                    type="button"
                    onClick={() => executeTerminalCommand(preset)}
                    className="rounded-md border border-slate-700/80 bg-slate-900/90 px-2 py-0.5 text-cyan-300 hover:border-cyan-400 cursor-pointer"
                  >
                    {preset}
                  </button>
                )
              )}
            </div>

            {/* 终端日志视窗 */}
            <div className="relative z-10 h-36 overflow-y-auto rounded-2xl border border-pink-200/20 bg-[#171329]/75 p-3 font-mono text-[11px] space-y-1.5">
              {logs.length === 0 ? (
                <div className="text-pink-100/55">手札已清空，点击上方快捷指令或直接输入命令回车…</div>
              ) : (
                logs.map((line) => (
                  <div
                    key={line.id}
                    className={
                      line.type === 'cmd' ? 'text-amber-200 font-semibold' : 'text-pink-50/90'
                    }
                  >
                    {line.text}
                  </div>
                ))
              )}
            </div>

            {/* 命令行输入框 */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                executeTerminalCommand(cmdInput);
              }}
              className="clannad-silk-subcard relative z-10 flex items-center gap-2 rounded-xl px-3 py-1.5 font-mono text-xs"
            >
              <span className="text-pink-300 select-none">✿</span>
              <input
                type="text"
                value={cmdInput}
                onChange={(e) => setCmdInput(e.target.value)}
                placeholder="输入 help 或点击上方胶囊执行..."
                aria-label="极客终端命令输入"
                className="w-full bg-transparent text-white placeholder-pink-100/45 focus:outline-none"
              />
              <button
                type="submit"
                className="shrink-0 whitespace-nowrap rounded-lg bg-pink-300/25 border border-pink-200/35 px-2.5 py-0.5 text-[11px] text-pink-100 hover:bg-pink-300/35 cursor-pointer"
              >
                执行
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};
