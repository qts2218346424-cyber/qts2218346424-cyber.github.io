import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  ArrowUpRight,
  BookOpenText,
  Calendar,
  Check,
  Clock,
  Copy,
  FileCode2,
  Sparkles,
  X,
} from 'lucide-react';
import { BLOG_POSTS, BlogPost } from '../data/siteData';
import { attachDialogEnhancements, closeDialogSmoothly } from '../utils/dialogHelper';

const CATEGORIES = ['全部文章', '桌面内核 & Rust', '知识大脑 & 可视化', '光学 UI 工程'] as const;

export const BlogSection: React.FC<{
  externalPostToOpen: BlogPost | null;
  onClearExternalPost: () => void;
}> = ({ externalPostToOpen, onClearExternalPost }) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('全部文章');
  const [activePost, setActivePost] = useState<BlogPost | null>(null);
  const [copiedCode, setCopiedCode] = useState<string | null>(null);
  const dialogRef = useRef<HTMLDialogElement | null>(null);

  useEffect(() => {
    return attachDialogEnhancements(dialogRef.current, () => {
      setActivePost(null);
      onClearExternalPost();
    });
  }, [onClearExternalPost]);

  const openArticle = (post: BlogPost) => {
    setActivePost(post);
    requestAnimationFrame(() => {
      if (dialogRef.current && !dialogRef.current.open) {
        dialogRef.current.showModal();
      }
    });
  };

  useEffect(() => {
    if (externalPostToOpen) {
      openArticle(externalPostToOpen);
    }
  }, [externalPostToOpen]);

  const filteredPosts = useMemo(() => {
    if (selectedCategory === '全部文章') return BLOG_POSTS;
    return BLOG_POSTS.filter((p) => p.category === selectedCategory);
  }, [selectedCategory]);

  const handleCopySnippet = async (filename: string, code: string) => {
    try {
      await navigator.clipboard.writeText(code);
      setCopiedCode(filename);
      setTimeout(() => setCopiedCode(null), 1800);
    } catch {
      // 忽略剪贴板受限环境
    }
  };

  return (
    <section id="blog" className="relative py-24 sm:py-32">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-emerald-400/30 bg-emerald-500/10 px-3.5 py-1 text-xs font-semibold text-emerald-300 mb-4">
              <BookOpenText className="h-3.5 w-3.5" />
              <span>硬核工程深潜 · 架构造物手记</span>
            </div>
            <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white">
              深度技术专栏 <span className="text-aurora-gradient">& 源码实战复盘</span>
            </h2>
            <p className="mt-3 max-w-2xl text-slate-300 text-base">
              不写空洞的概念堆砌，只记录在打磨 <strong className="text-white">CoreForge 研核</strong> 与{' '}
              <strong className="text-white">Antigravity Studio</strong> 过程中跨越过的真实系统级深水区。
            </p>
          </div>

          {/* 分类胶囊筛选 */}
          <div className="flex flex-wrap gap-1.5">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setSelectedCategory(cat)}
                className={`rounded-full px-3.5 py-1.5 text-xs font-semibold transition-all cursor-pointer ${
                  selectedCategory === cat
                    ? 'bg-white text-slate-950 shadow-[0_0_20px_rgba(255,255,255,0.3)]'
                    : 'border border-slate-800 bg-slate-900/75 text-slate-300 hover:border-slate-600'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* 博文卡片网格 */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredPosts.map((post) => {
            const isCoreForge = post.relatedProject === 'CoreForge 研核';
            return (
              <article
                key={post.id}
                onClick={() => openArticle(post)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    openArticle(post);
                  }
                }}
                tabIndex={0}
                role="button"
                aria-label={`阅读文章：${post.title}`}
                className="clannad-crystal-panel group relative rounded-3xl p-6 hover:border-pink-200/55 transition-all cursor-pointer flex flex-col justify-between gap-5 focus:outline-none focus-visible:ring-2 focus-visible:ring-pink-300"
              >
                <div>
                  <div className="flex flex-wrap items-center justify-between gap-2 text-xs mb-3">
                    <span
                      className={`rounded-full border px-2.5 py-0.5 font-semibold ${
                        isCoreForge
                          ? 'border-cyan-400/35 bg-cyan-500/12 text-cyan-300'
                          : 'border-pink-400/35 bg-pink-500/12 text-pink-300'
                      }`}
                    >
                      {post.category}
                    </span>
                    <div className="flex items-center gap-3 text-slate-400 font-mono text-[11px]">
                      <span className="inline-flex items-center gap-1">
                        <Calendar className="h-3 w-3" /> {post.date}
                      </span>
                      <span className="inline-flex items-center gap-1">
                        <Clock className="h-3 w-3" /> {post.readTime}
                      </span>
                    </div>
                  </div>

                  <h3 className="text-lg sm:text-xl font-bold text-white group-hover:text-cyan-200 transition-colors leading-snug">
                    {post.title}
                  </h3>
                  <p className="mt-2 text-sm text-slate-300/90 leading-relaxed line-clamp-3">
                    {post.summary}
                  </p>
                </div>

                <div className="pt-4 border-t border-slate-800/80 flex items-center justify-between gap-3">
                  <div className="flex flex-wrap gap-1.5">
                    {post.tags.map((tag) => (
                      <span
                        key={tag}
                        className="rounded bg-slate-900 border border-slate-800 px-2 py-0.5 font-mono text-[11px] text-slate-400"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                  <span className="shrink-0 text-xs font-bold text-cyan-300 group-hover:translate-x-1 transition-transform inline-flex items-center gap-1">
                    <span>展开全文</span>
                    <ArrowUpRight className="h-3.5 w-3.5" />
                  </span>
                </div>
              </article>
            );
          })}
        </div>
      </div>

      {/* 原生 Top-Layer 沉浸式技术长文阅读舱 */}
      <dialog
        ref={dialogRef}
        {...({ closedby: 'any' } as React.DialogHTMLAttributes<HTMLDialogElement>)}
        aria-label={activePost ? activePost.title : '技术博文阅读器'}
        className="cyber-dialog w-full"
      >
        {activePost && (
          <div className="rounded-2xl border border-slate-700/80 bg-[#070b16]/96 shadow-2xl backdrop-blur-2xl overflow-hidden flex flex-col max-h-[88vh]">
            {/* 阅读器固定顶栏 */}
            <div className="flex items-center justify-between gap-4 px-5 sm:px-7 py-4 border-b border-slate-800 bg-[#050811]/90">
              <div className="flex items-center gap-2 text-xs">
                <Sparkles className="h-4 w-4 text-cyan-400" />
                <span className="font-semibold text-cyan-300">{activePost.category}</span>
                <span className="text-slate-600">·</span>
                <span className="font-mono text-slate-400">{activePost.readTime}</span>
              </div>
              <button
                type="button"
                onClick={() => void closeDialogSmoothly(dialogRef.current)}
                aria-label="关闭文章阅读窗口"
                className="rounded-full border border-slate-700 bg-slate-900 p-1.5 text-slate-300 hover:text-white cursor-pointer"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* 阅读器正文滚动区 */}
            <div className="overflow-y-auto px-5 sm:px-9 py-6 sm:py-8 space-y-6">
              <div>
                <h2 className="text-2xl sm:text-3xl font-extrabold text-white leading-tight">
                  {activePost.title}
                </h2>
                <p className="mt-2.5 text-sm sm:text-base text-slate-300">
                  {activePost.subtitle}
                </p>
                <div className="mt-4 flex flex-wrap items-center gap-2">
                  {activePost.tags.map((t) => (
                    <span
                      key={t}
                      className="rounded-full border border-slate-800 bg-slate-900 px-2.5 py-0.5 font-mono text-xs text-slate-300"
                    >
                      #{t}
                    </span>
                  ))}
                </div>
              </div>

              <div className="space-y-6 border-t border-slate-800/80 pt-6">
                {activePost.sections.map((sec) => (
                  <div key={sec.heading} className="space-y-3">
                    <h3 className="text-lg font-bold text-cyan-200">{sec.heading}</h3>
                    {sec.paragraphs.map((p, idx) => (
                      <p key={idx} className="text-sm sm:text-base text-slate-200/95 leading-relaxed">
                        {p}
                      </p>
                    ))}
                    {sec.codeSnippet && (
                      <div className="rounded-xl border border-slate-800 bg-[#03050b] overflow-hidden my-3">
                        <div className="flex items-center justify-between px-4 py-2 border-b border-slate-800/90 bg-slate-900/60 text-xs font-mono text-slate-300">
                          <span className="inline-flex items-center gap-1.5">
                            <FileCode2 className="h-3.5 w-3.5 text-cyan-400" />
                            {sec.codeSnippet.filename}
                          </span>
                          <button
                            type="button"
                            onClick={() =>
                              void handleCopySnippet(
                                sec.codeSnippet!.filename,
                                sec.codeSnippet!.code
                              )
                            }
                            className="inline-flex items-center gap-1 text-slate-400 hover:text-white cursor-pointer"
                          >
                            {copiedCode === sec.codeSnippet.filename ? (
                              <>
                                <Check className="h-3.5 w-3.5 text-emerald-400" />
                                <span className="text-emerald-300">已复制</span>
                              </>
                            ) : (
                              <>
                                <Copy className="h-3.5 w-3.5" />
                                <span>复制源码</span>
                              </>
                            )}
                          </button>
                        </div>
                        <pre className="p-4 overflow-x-auto font-mono text-xs sm:text-[13px] leading-relaxed text-cyan-100">
                          <code>{sec.codeSnippet.code}</code>
                        </pre>
                      </div>
                    )}
                  </div>
                ))}
              </div>

              {/* 文章尾部关联项目强引导 */}
              <div className="rounded-2xl border border-cyan-400/30 bg-gradient-to-r from-cyan-950/40 via-slate-900 to-pink-950/35 p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <div className="text-xs font-semibold text-cyan-300">本文关联开源工程</div>
                  <div className="text-base font-bold text-white mt-0.5">
                    亲手体验「{activePost.relatedProject}」完整线上能力与源码
                  </div>
                </div>
                <a
                  href={activePost.relatedUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="shrink-0 inline-flex items-center gap-2 rounded-full bg-white px-5 py-2.5 text-xs font-bold text-slate-950 hover:bg-cyan-200 transition-colors"
                >
                  <span>立即前往 {activePost.relatedProject}</span>
                  <ArrowUpRight className="h-4 w-4" />
                </a>
              </div>
            </div>
          </div>
        )}
      </dialog>
    </section>
  );
};
