import React, { useState } from 'react';
import {
  ArrowUpRight,
  Check,
  Copy,
  Github,
  Heart,
  Mail,
  MessageCircle,
  Orbit,
  Sparkles,
  Zap,
} from 'lucide-react';
import { AUTHOR_PROFILE } from '../data/siteData';
import { BilibiliIcon, HikariOrbIcon } from './ClannadMotifs';

export const FooterSection: React.FC = () => {
  const [copiedField, setCopiedField] = useState<'qq' | 'uid' | 'email' | null>(null);

  const handleCopy = async (field: 'qq' | 'uid' | 'email', value: string) => {
    try {
      await navigator.clipboard.writeText(value);
      setCopiedField(field);
      setTimeout(() => setCopiedField(null), 1800);
    } catch {
      // 忽略受限环境
    }
  };

  return (
    <footer id="contact" className="relative pt-20 pb-20 border-t border-slate-800/80 overflow-hidden">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute bottom-0 left-1/2 -translate-x-1/2 h-72 w-[820px] rounded-full bg-gradient-to-r from-cyan-500/15 via-indigo-500/15 to-pink-500/15 blur-[120px]"
      />

      <div className="relative z-10 mx-auto max-w-6xl px-4 sm:px-6">
        {/* 第一层：星海电波 · 个人社交与开源联络矩阵 */}
        <div className="mb-12">
          <div className="clannad-pill-btn inline-flex items-center gap-2 rounded-full px-3.5 py-1 text-xs font-medium tracking-wide text-pink-100 mb-3">
            <HikariOrbIcon className="h-3.5 w-3.5" />
            <span>星海电波 · 社交关注与即时联络</span>
          </div>
          <h2 className="font-clannad-serif text-2xl sm:text-4xl font-bold tracking-wider text-white">
            随时与我取得联系 <span className="text-aurora-gradient">· 共话技术与热爱</span>
          </h2>
          <p className="mt-2 text-sm sm:text-base text-pink-50/85 max-w-2xl">
            欢迎在 B 站关注我的最新项目实机演示动态，或通过 QQ 与个人邮箱交流全栈开发、桌面汉化内核与《CLANNAD》同好话题。
          </p>

          <div className="mt-7 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* 1. 哔哩哔哩 B站主页 */}
            <div className="clannad-crystal-panel rounded-2xl p-5 hover:border-pink-300/65 transition-all flex flex-col justify-between gap-4">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="h-10 w-10 rounded-xl bg-pink-400/20 border border-pink-200/35 flex items-center justify-center text-pink-200">
                    <BilibiliIcon className="h-5 w-5" />
                  </span>
                  <span className="rounded-full bg-pink-500/15 px-2.5 py-0.5 text-[10px] font-bold text-pink-200 border border-pink-400/25">
                    视频与动态主页
                  </span>
                </div>
                <div className="text-xs text-slate-400">哔哩哔哩（B站）</div>
                <div className="mt-0.5 text-base font-extrabold text-white font-mono">
                  UID: {AUTHOR_PROFILE.bilibiliUid}
                </div>
              </div>

              <div className="flex items-center gap-2 pt-3 border-t border-slate-800/80 text-xs">
                <a
                  href={AUTHOR_PROFILE.bilibiliUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 inline-flex items-center justify-center gap-1 rounded-xl bg-pink-500/20 hover:bg-pink-500/30 border border-pink-400/40 py-2 font-bold text-pink-100 transition-colors"
                >
                  <span>直达 B站空间</span>
                  <ArrowUpRight className="h-3.5 w-3.5" />
                </a>
                <button
                  type="button"
                  onClick={() => void handleCopy('uid', AUTHOR_PROFILE.bilibiliUid)}
                  className="rounded-xl border border-slate-700 bg-slate-900 px-2.5 py-2 text-slate-300 hover:text-white cursor-pointer"
                  title="复制 B站 UID"
                >
                  {copiedField === 'uid' ? (
                    <Check className="h-3.5 w-3.5 text-emerald-400" />
                  ) : (
                    <Copy className="h-3.5 w-3.5" />
                  )}
                </button>
              </div>
            </div>

            {/* 2. QQ 交流联系 */}
            <div className="clannad-crystal-panel rounded-2xl p-5 hover:border-sky-300/65 transition-all flex flex-col justify-between gap-4">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="h-10 w-10 rounded-xl bg-cyan-500/15 border border-cyan-400/35 flex items-center justify-center text-cyan-300">
                    <MessageCircle className="h-5 w-5" />
                  </span>
                  <span className="rounded-full bg-cyan-500/15 px-2.5 py-0.5 text-[10px] font-bold text-cyan-200 border border-cyan-400/25">
                    即时通讯交流
                  </span>
                </div>
                <div className="text-xs text-slate-400">腾讯 QQ</div>
                <div className="mt-0.5 text-base font-extrabold text-white font-mono">
                  {AUTHOR_PROFILE.qq}
                </div>
              </div>

              <div className="flex items-center gap-2 pt-3 border-t border-slate-800/80 text-xs">
                <button
                  type="button"
                  onClick={() => void handleCopy('qq', AUTHOR_PROFILE.qq)}
                  className="flex-1 inline-flex items-center justify-center gap-1.5 rounded-xl bg-cyan-500/20 hover:bg-cyan-500/30 border border-cyan-400/40 py-2 font-bold text-cyan-100 transition-colors cursor-pointer"
                >
                  {copiedField === 'qq' ? (
                    <>
                      <Check className="h-3.5 w-3.5 text-emerald-300" />
                      <span className="text-emerald-200">已复制 QQ 号</span>
                    </>
                  ) : (
                    <>
                      <Copy className="h-3.5 w-3.5" />
                      <span>一键复制 QQ 号</span>
                    </>
                  )}
                </button>
                <a
                  href={`tencent://message/?uin=${AUTHOR_PROFILE.qq}&Site=&Menu=yes`}
                  className="rounded-xl border border-slate-700 bg-slate-900 px-2.5 py-2 text-slate-300 hover:text-white"
                  title="唤起桌面 QQ 会话"
                >
                  <ArrowUpRight className="h-3.5 w-3.5" />
                </a>
              </div>
            </div>

            {/* 3. 个人电子邮箱 */}
            <div className="clannad-crystal-panel rounded-2xl p-5 hover:border-indigo-300/65 transition-all flex flex-col justify-between gap-4">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="h-10 w-10 rounded-xl bg-indigo-500/15 border border-indigo-400/35 flex items-center justify-center text-indigo-300">
                    <Mail className="h-5 w-5" />
                  </span>
                  <span className="rounded-full bg-indigo-500/15 px-2.5 py-0.5 text-[10px] font-bold text-indigo-200 border border-indigo-400/25">
                    开源协作与来信
                  </span>
                </div>
                <div className="text-xs text-slate-400">个人邮箱 (Gmail)</div>
                <div className="mt-0.5 text-sm font-extrabold text-white font-mono break-all">
                  {AUTHOR_PROFILE.email}
                </div>
              </div>

              <div className="flex items-center gap-2 pt-3 border-t border-slate-800/80 text-xs">
                <a
                  href={`mailto:${AUTHOR_PROFILE.email}`}
                  className="flex-1 inline-flex items-center justify-center gap-1.5 rounded-xl bg-indigo-500/20 hover:bg-indigo-500/30 border border-indigo-400/40 py-2 font-bold text-indigo-100 transition-colors"
                >
                  <span>发送邮件</span>
                  <ArrowUpRight className="h-3.5 w-3.5" />
                </a>
                <button
                  type="button"
                  onClick={() => void handleCopy('email', AUTHOR_PROFILE.email)}
                  className="rounded-xl border border-slate-700 bg-slate-900 px-2.5 py-2 text-slate-300 hover:text-white cursor-pointer"
                  title="复制邮箱地址"
                >
                  {copiedField === 'email' ? (
                    <Check className="h-3.5 w-3.5 text-emerald-400" />
                  ) : (
                    <Copy className="h-3.5 w-3.5" />
                  )}
                </button>
              </div>
            </div>

            {/* 4. GitHub 开源主页 */}
            <div className="clannad-crystal-panel rounded-2xl p-5 hover:border-emerald-300/65 transition-all flex flex-col justify-between gap-4">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="h-10 w-10 rounded-xl bg-emerald-500/15 border border-emerald-400/35 flex items-center justify-center text-emerald-300">
                    <Github className="h-5 w-5" />
                  </span>
                  <span className="rounded-full bg-emerald-500/15 px-2.5 py-0.5 text-[10px] font-bold text-emerald-200 border border-emerald-400/25">
                    代码仓库矩阵
                  </span>
                </div>
                <div className="text-xs text-slate-400">GitHub 开源主页</div>
                <div className="mt-0.5 text-sm font-extrabold text-white font-mono truncate">
                  {AUTHOR_PROFILE.handle}
                </div>
              </div>

              <div className="flex items-center gap-2 pt-3 border-t border-slate-800/80 text-xs">
                <a
                  href={AUTHOR_PROFILE.githubUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 inline-flex items-center justify-center gap-1.5 rounded-xl bg-emerald-500/20 hover:bg-emerald-500/30 border border-emerald-400/40 py-2 font-bold text-emerald-100 transition-colors"
                >
                  <span>访问 GitHub</span>
                  <ArrowUpRight className="h-3.5 w-3.5" />
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* 第二层：双旗舰巨幅星门召唤舱 */}
        <div className="clannad-crystal-panel rounded-3xl p-8 sm:p-11 mb-12">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8">
            <div className="max-w-xl">
              <div className="inline-flex items-center gap-2 text-xs font-mono text-amber-200 mb-3">
                <Orbit className="h-4 w-4" />
                <span>星门已就绪 · 四大旗舰全生态直连</span>
              </div>
              <h2 className="font-clannad-serif text-2xl sm:text-3xl font-bold text-white leading-snug">
                从智能知识大脑、高定桌面汉化，到番剧互动剧场与量化风控实验室
              </h2>
              <p className="mt-3 text-sm sm:text-base text-pink-50/85">
                如果这四个开源项目为你节省了时间或带来了感动，欢迎在线体验或在 GitHub 与 B站支持关注。
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 shrink-0">
              <a
                href={AUTHOR_PROFILE.coreforgeSite}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-sky-200 to-pink-200 px-5 py-3.5 text-xs sm:text-sm font-bold text-[#1d1630] shadow-[0_0_24px_rgba(186,230,253,0.35)] hover:brightness-105 transition-all"
              >
                <Zap className="h-4 w-4" />
                <span>CoreForge 研核官网</span>
                <ArrowUpRight className="h-4 w-4" />
              </a>

              <a
                href={AUTHOR_PROFILE.personaDemo}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-pink-200 to-amber-100 px-5 py-3.5 text-xs sm:text-sm font-bold text-[#1d1630] shadow-[0_0_24px_rgba(249,168,212,0.35)] hover:brightness-105 transition-all"
              >
                <Sparkles className="h-4 w-4" />
                <span>星语恋庭在线剧场</span>
                <ArrowUpRight className="h-4 w-4" />
              </a>

              <a
                href={AUTHOR_PROFILE.antigravityRepo}
                target="_blank"
                rel="noopener noreferrer"
                className="clannad-pill-btn inline-flex items-center justify-center gap-2 rounded-2xl px-5 py-3.5 text-xs sm:text-sm font-semibold text-pink-100"
              >
                <span>Antigravity 汉化仓库</span>
                <ArrowUpRight className="h-4 w-4" />
              </a>

              <a
                href={AUTHOR_PROFILE.quantRepo}
                target="_blank"
                rel="noopener noreferrer"
                className="clannad-pill-btn inline-flex items-center justify-center gap-2 rounded-2xl px-5 py-3.5 text-xs sm:text-sm font-semibold text-amber-100"
              >
                <span>苍穹量枢量化仓库</span>
                <ArrowUpRight className="h-4 w-4" />
              </a>
            </div>
          </div>
        </div>

        {/* 底部版权与全渠道快捷栏 */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400">
          <div className="flex items-center gap-2">
            <span className="font-bold text-slate-200">{AUTHOR_PROFILE.name}</span>
            <span>·</span>
            <span className="inline-flex items-center gap-1">
              基于 <Heart className="h-3.5 w-3.5 text-rose-400 fill-rose-400/30" /> 与 Rust / React 19 匠心构筑
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-4">
            <a
              href={AUTHOR_PROFILE.bilibiliUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-pink-300 transition-colors"
            >
              B站 UID:{AUTHOR_PROFILE.bilibiliUid}
            </a>
            <span>QQ:{AUTHOR_PROFILE.qq}</span>
            <a
              href={`mailto:${AUTHOR_PROFILE.email}`}
              className="hover:text-indigo-300 transition-colors"
            >
              {AUTHOR_PROFILE.email}
            </a>
            <a
              href={AUTHOR_PROFILE.githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-slate-200 hover:text-white"
            >
              <Github className="h-3.5 w-3.5" />
              <span>{AUTHOR_PROFILE.handle}</span>
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};
