import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  ArrowUpRight,
  BookOpen,
  Compass,
  Github,
  Mail,
  MessageCircle,
  Music,
  Pause,
  Play,
  Search,
  Sparkles,
  Tv,
  X,
  Zap,
} from 'lucide-react';
import { AUTHOR_PROFILE, BLOG_POSTS, BlogPost } from '../data/siteData';
import { CLANNAD_TRACKS, ClannadTrackId } from '../data/clannadData';
import { attachDialogEnhancements, closeDialogSmoothly } from '../utils/dialogHelper';

interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
  motionPaused: boolean;
  onToggleMotion: () => void;
  onSelectBlogPost: (post: BlogPost) => void;
  onPlayClannadTrack: (trackId: ClannadTrackId) => void;
}

interface CommandItem {
  id: string;
  group: string;
  title: string;
  subtitle: string;
  icon: React.ComponentType<{ className?: string }>;
  external?: boolean;
  action: () => void;
}

export const CommandPalette: React.FC<CommandPaletteProps> = ({
  isOpen,
  onClose,
  motionPaused,
  onToggleMotion,
  onSelectBlogPost,
  onPlayClannadTrack,
}) => {
  const dialogRef = useRef<HTMLDialogElement | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [query, setQuery] = useState<string>('');
  const [selectedIndex, setSelectedIndex] = useState<number>(0);

  useEffect(() => {
    return attachDialogEnhancements(dialogRef.current, () => {
      setQuery('');
      onClose();
    });
  }, [onClose]);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    if (isOpen && !dialog.open) {
      dialog.showModal();
      requestAnimationFrame(() => inputRef.current?.focus());
    } else if (!isOpen && dialog.open) {
      void closeDialogSmoothly(dialog);
    }
  }, [isOpen]);

  const commands: CommandItem[] = useMemo(
    () => [
      {
        id: 'open-coreforge',
        group: '王牌旗舰直达',
        title: '立即体验 CoreForge 研核线上官网 (claudexxb.online)',
        subtitle: '全栈智能研学操作系统 & Obsidian 本地知识大脑',
        icon: Zap,
        external: true,
        action: () => window.open(AUTHOR_PROFILE.coreforgeSite, '_blank', 'noopener,noreferrer'),
      },
      {
        id: 'open-coreforge-labs',
        group: '王牌旗舰直达',
        title: '免登录试玩 CoreForge 五大动态交互实验室',
        subtitle: '408 AVL 旋转 / 泰勒逼近 / 1839-2026 史纲时空地图 / AI 四维批改',
        icon: Compass,
        external: true,
        action: () => window.open(AUTHOR_PROFILE.coreforgeLabs, '_blank', 'noopener,noreferrer'),
      },
      {
        id: 'open-antigravity-repo',
        group: '王牌旗舰直达',
        title: '访问 Antigravity Studio 反重力汉化 GitHub 仓库',
        subtitle: 'Tauri v2 + Rust 双层无损汉化、10 款光学材质与 7 角色桌面伴侣',
        icon: Sparkles,
        external: true,
        action: () => window.open(AUTHOR_PROFILE.antigravityRepo, '_blank', 'noopener,noreferrer'),
      },
      {
        id: 'open-antigravity-releases',
        group: '王牌旗舰直达',
        title: '下载 Antigravity Studio 最新桌面安装包 (Releases)',
        subtitle: '支持 Windows / macOS / Linux 与 Minisign 签名 OTA',
        icon: Github,
        external: true,
        action: () =>
          window.open(AUTHOR_PROFILE.antigravityReleases, '_blank', 'noopener,noreferrer'),
      },
      {
        id: 'jump-coreforge-sandbox',
        group: '站内全息导航',
        title: '定位至站内「CoreForge 研核」实时热力星图沙盒',
        subtitle: '现场点击红灯盲区体验靶向救绿与高数泰勒拟合',
        icon: Compass,
        action: () => {
          document.getElementById('coreforge')?.scrollIntoView({ behavior: 'smooth' });
        },
      },
      {
        id: 'jump-antigravity-sandbox',
        group: '站内全息导航',
        title: '定位至站内「Antigravity Studio」Color DNA 换肤实验室',
        subtitle: '现场切换 5 款光学皮肤与双层汉化对比开关',
        icon: Sparkles,
        action: () => {
          document.getElementById('antigravity')?.scrollIntoView({ behavior: 'smooth' });
        },
      },
      {
        id: 'jump-clannad-sanctuary',
        group: 'CLANNAD 永恒纪念馆',
        title: '定位至「🌸 光坂坡道与星海光玉 · CLANNAD 纪念馆」',
        subtitle: '全员奇迹大合照、朋也×渚×小汐全家福、小汐原声与团子八音盒',
        icon: Sparkles,
        action: () => {
          document.getElementById('clannad')?.scrollIntoView({ behavior: 'smooth' });
        },
      },
      ...CLANNAD_TRACKS.map((trk) => ({
        id: `bgm-${trk.id}`,
        group: 'CLANNAD 原声在线点播',
        title: `🎵 在线播放《${trk.title}》 (${trk.durationHint})`,
        subtitle: `${trk.jpTitle} · ${trk.moodTag}`,
        icon: Music,
        action: () => onPlayClannadTrack(trk.id),
      })),
      {
        id: 'social-bilibili',
        group: '社交与联络方式',
        title: `📺 访问哔哩哔哩 B站个人主页 (UID: ${AUTHOR_PROFILE.bilibiliUid})`,
        subtitle: AUTHOR_PROFILE.bilibiliUrl,
        icon: Tv,
        external: true,
        action: () => window.open(AUTHOR_PROFILE.bilibiliUrl, '_blank', 'noopener,noreferrer'),
      },
      {
        id: 'social-qq',
        group: '社交与联络方式',
        title: `💬 复制个人 QQ 号：${AUTHOR_PROFILE.qq}`,
        subtitle: '点击或回车自动复制 QQ 号至剪贴板',
        icon: MessageCircle,
        action: () => {
          void navigator.clipboard?.writeText(AUTHOR_PROFILE.qq);
        },
      },
      {
        id: 'social-email',
        group: '社交与联络方式',
        title: `✉️ 发送邮件 / 复制个人邮箱：${AUTHOR_PROFILE.email}`,
        subtitle: '复制邮箱并唤起默认邮件客户端',
        icon: Mail,
        action: () => {
          void navigator.clipboard?.writeText(AUTHOR_PROFILE.email);
          window.location.href = `mailto:${AUTHOR_PROFILE.email}`;
        },
      },
      {
        id: 'toggle-motion',
        group: '系统偏好控制',
        title: motionPaused ? '恢复全站粒子引力场与流光动效' : '切换为静默护眼模式（暂停持续动效）',
        subtitle: '符合现代无障碍视觉舒适度控制规范',
        icon: motionPaused ? Play : Pause,
        action: () => onToggleMotion(),
      },
      ...BLOG_POSTS.map((post) => ({
        id: `post-${post.id}`,
        group: '深度技术专栏',
        title: post.title,
        subtitle: `${post.category} · ${post.readTime}`,
        icon: BookOpen,
        action: () => onSelectBlogPost(post),
      })),
    ],
    [motionPaused, onPlayClannadTrack, onSelectBlogPost, onToggleMotion]
  );

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return commands;
    return commands.filter(
      (item) =>
        item.title.toLowerCase().includes(q) ||
        item.subtitle.toLowerCase().includes(q) ||
        item.group.toLowerCase().includes(q)
    );
  }, [commands, query]);

  useEffect(() => {
    setSelectedIndex(0);
  }, [query]);

  const runItem = (item: CommandItem) => {
    void closeDialogSmoothly(dialogRef.current).then(() => {
      item.action();
    });
  };

  return (
    <dialog
      ref={dialogRef}
      {...({ closedby: 'any' } as React.DialogHTMLAttributes<HTMLDialogElement>)}
      aria-label="空の光 全局指令面板"
      className="cyber-dialog w-full max-w-2xl"
    >
      <div
        onKeyDown={(e) => {
          if (e.key === 'ArrowDown') {
            e.preventDefault();
            setSelectedIndex((prev) => (filtered.length ? (prev + 1) % filtered.length : 0));
          } else if (e.key === 'ArrowUp') {
            e.preventDefault();
            setSelectedIndex((prev) =>
              filtered.length ? (prev - 1 + filtered.length) % filtered.length : 0
            );
          } else if (e.key === 'Enter' && filtered[selectedIndex]) {
            e.preventDefault();
            runItem(filtered[selectedIndex]);
          }
        }}
        className="rounded-3xl border border-pink-200/35 bg-[#1a152d]/92 shadow-[0_30px_90px_rgba(10,8,24,0.88)] backdrop-blur-2xl overflow-hidden"
      >
        <div className="flex items-center gap-3 px-4 py-3.5 border-b border-slate-800">
          <Search className="h-4 w-4 text-cyan-400 shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="搜索项目官网、反重力汉化、技术架构文章或快捷指令..."
            className="w-full bg-transparent text-sm text-white placeholder-slate-400 focus:outline-none"
          />
          <button
            type="button"
            onClick={() => void closeDialogSmoothly(dialogRef.current)}
            aria-label="关闭命令面板"
            className="rounded-lg border border-slate-700 bg-slate-900 px-2 py-1 text-[11px] text-slate-400 hover:text-white cursor-pointer"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        </div>

        <div className="max-h-[60vh] overflow-y-auto p-2 space-y-1">
          {filtered.length === 0 ? (
            <div className="py-10 text-center text-sm text-slate-400">
              未匹配到相关指令，请尝试输入「研核」「汉化」「Rust」或「Obsidian」
            </div>
          ) : (
            filtered.map((item, idx) => {
              const Icon = item.icon;
              const active = idx === selectedIndex;
              return (
                <button
                  key={item.id}
                  type="button"
                  onMouseEnter={() => setSelectedIndex(idx)}
                  onClick={() => runItem(item)}
                  className={`w-full text-left rounded-xl px-3.5 py-2.5 flex items-center justify-between gap-3 transition-colors cursor-pointer ${
                    active ? 'bg-cyan-400/15 border border-cyan-400/35' : 'border border-transparent'
                  }`}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="h-8 w-8 rounded-lg bg-slate-900 border border-slate-800 flex items-center justify-center shrink-0">
                      <Icon className="h-4 w-4 text-cyan-300" />
                    </div>
                    <div className="min-w-0">
                      <div className="text-xs sm:text-sm font-semibold text-white truncate">
                        {item.title}
                      </div>
                      <div className="text-[11px] text-slate-400 truncate">
                        [{item.group}] {item.subtitle}
                      </div>
                    </div>
                  </div>
                  {item.external && (
                    <ArrowUpRight className="h-4 w-4 text-cyan-300 shrink-0" />
                  )}
                </button>
              );
            })
          )}
        </div>

        <div className="px-4 py-2 border-t border-slate-800/90 bg-slate-950/80 flex items-center justify-between text-[11px] text-slate-400">
          <span>↑↓ 选择指令 · Enter 立即执行 · Esc 或点击遮罩关闭</span>
          <span className="font-mono text-cyan-300">{AUTHOR_PROFILE.name}</span>
        </div>
      </div>
    </dialog>
  );
};
