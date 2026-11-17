export interface KnowledgeNode {
  id: string;
  label: string;
  category: '408计算机' | '考研数学' | '考研英语' | '考研政治';
  x: number;
  y: number;
  status: 'danger' | 'warning' | 'mastered';
  accuracy: number;
  detail: string;
  rescueTip: string;
}

export interface CoreForgeScreenshot {
  id: string;
  title: string;
  badge: string;
  src: string;
  description: string;
  liveUrl: string;
}

export interface AntigravitySkinPreset {
  id: string;
  name: string;
  subtitle: string;
  description: string;
  bg: string;
  sidebar: string;
  titleBar: string;
  statusBar: string;
  panel: string;
  border: string;
  accent: string;
  fg: string;
  muted: string;
  radius: number;
  blur: number;
  opacity: number;
  glow: string;
  petName: string;
  petRole: string;
  petEmoji: string;
  petQuote: string;
  petBackdrop?: string;
}

export interface ProjectDirectoryItem {
  id: string;
  name: string;
  codename: string;
  flagship?: boolean;
  accentColor: string;
  summary: string;
  highlights: string[];
  techStack: string[];
  primaryUrl: string;
  primaryLabel: string;
  repoUrl: string;
  extraLinks?: { label: string; url: string }[];
  cloneCmd?: string;
}

export interface BlogPost {
  id: string;
  title: string;
  subtitle: string;
  category: '桌面内核 & Rust' | '知识大脑 & 可视化' | '光学 UI 工程';
  date: string;
  readTime: string;
  tags: string[];
  relatedProject: 'CoreForge 研核' | 'Antigravity Studio';
  relatedUrl: string;
  summary: string;
  sections: {
    heading: string;
    paragraphs: string[];
    codeSnippet?: {
      lang: string;
      filename: string;
      code: string;
    };
  }[];
}

export const AUTHOR_PROFILE = {
  name: 'QTS · 天选',
  handle: '@qts2218346424-cyber',
  title: '全栈独立架构师 · 桌面内核与智能知识系统造物主',
  githubUrl: 'https://github.com/qts2218346424-cyber',
  qq: '2218346424',
  bilibiliUid: '366624717',
  bilibiliUrl: 'https://space.bilibili.com/366624717?spm_id_from=333.1007.0.0',
  email: 'qts2218346424@gmail.com',
  coreforgeSite: 'https://claudexxb.online',
  coreforgeLabs: 'https://claudexxb.online/#preview',
  coreforgeDownload: 'https://claudexxb.online/#download',
  coreforgeShowroom: 'https://qts2218346424-cyber.github.io/obsidian-knowledge-viz/',
  coreforgeRepo: 'https://github.com/qts2218346424-cyber/obsidian-knowledge-viz',
  antigravityRepo: 'https://github.com/qts2218346424-cyber/antigravity-zh-cn',
  antigravityReleases: 'https://github.com/qts2218346424-cyber/antigravity-zh-cn/releases',
};

export const INITIAL_KNOWLEDGE_NODES: KnowledgeNode[] = [
  {
    id: 'avl',
    label: 'AVL 平衡树四种旋转',
    category: '408计算机',
    x: 22,
    y: 28,
    status: 'danger',
    accuracy: 52,
    detail: 'LR / RL 双旋指针挂载顺序与平衡因子 (BF) 重算高频易错点。',
    rescueTip: '已调取单步旋转动画课件 + 完成 5 道统考树结构变式靶向实测，成功救绿！',
  },
  {
    id: 'pagetable',
    label: '两级页表虚实地址转换',
    category: '408计算机',
    x: 48,
    y: 19,
    status: 'warning',
    accuracy: 74,
    detail: '页目录号、页表索引与页内偏移位宽切分及 TLB 快表命中耗时计算。',
    rescueTip: '已联动 OS 地址变换位级拆解沙盒完成强化巩固，正确率跃升至 96%！',
  },
  {
    id: 'taylor',
    label: '泰勒展开与皮亚诺余项',
    category: '考研数学',
    x: 74,
    y: 30,
    status: 'danger',
    accuracy: 48,
    detail: '求极限分式“上下同阶、首项抵消必展开”阶数截断判定盲区。',
    rescueTip: '已启动高数多项式动态逼近拟合仪 + 3 道数一极限压轴真题精批，盲区清零！',
  },
  {
    id: 'eigen',
    label: '实对称矩阵正交对角化',
    category: '考研数学',
    x: 68,
    y: 68,
    status: 'mastered',
    accuracy: 95,
    detail: '施密特正交化几何投影与重特征值特征向量正交基构造。',
    rescueTip: 'SM-2 艾宾浩斯记忆稳固度极佳，下次复习排期：14 天后。',
  },
  {
    id: 'timeline',
    label: '1839–2026 史纲同城会议',
    category: '考研政治',
    x: 26,
    y: 72,
    status: 'danger',
    accuracy: 56,
    detail: '遵义、瓦窑堡、洛川与延安时期土地政策及重要纲领横向易混排雷。',
    rescueTip: '已唤醒中国矢量时空地图同城史实循环对比卡，混淆项已彻底击穿！',
  },
  {
    id: 'essay',
    label: '英语 20 分制四维升格',
    category: '考研英语',
    x: 49,
    y: 52,
    status: 'mastered',
    accuracy: 92,
    detail: '黄金三段论逻辑衔接与平庸表达一键替换学术高阶词汇。',
    rescueTip: 'AI 四维阅卷引擎评分 18.5 / 20，逻辑连贯度与词汇丰富度拉满！',
  },
];

export const KNOWLEDGE_EDGES: [string, string][] = [
  ['avl', 'pagetable'],
  ['pagetable', 'essay'],
  ['avl', 'essay'],
  ['taylor', 'essay'],
  ['taylor', 'eigen'],
  ['timeline', 'essay'],
  ['avl', 'timeline'],
  ['pagetable', 'taylor'],
];

export const COREFORGE_SCREENSHOTS: CoreForgeScreenshot[] = [
  {
    id: 'hero',
    title: 'CoreForge 研核 · 全栈智能研学总控台',
    badge: '首屏全景总览',
    src: './showcase/01_hero_overview.png',
    description:
      '集历年统考精校题库、PDF 双栏精读、Obsidian 本地双链笔记、红黄绿热力星图与双魂桌宠语音伴学于一体的全科研学操作系统。',
    liveUrl: 'https://claudexxb.online',
  },
  {
    id: 'avl',
    title: '实验室 01 · 408 数据结构 AVL 平衡树旋转仿真',
    badge: '408 动态仿真',
    src: './showcase/02_lab_408_avl.png',
    description:
      '实时交互演示 LL / RR / LR / RL 四种失衡自平衡旋转，左侧同步高亮 C 语言核心指针变换代码与平衡因子追踪日志。',
    liveUrl: 'https://claudexxb.online/#preview',
  },
  {
    id: 'taylor',
    title: '实验室 02 · 考研高数泰勒与麦克劳林动态逼近',
    badge: '高数可视化',
    src: './showcase/03_lab_math_taylor.png',
    description:
      '自由拖动展开阶数滑块、切换目标函数，直观观测高阶多项式曲线对真实函数的拟合过程与收敛域。',
    liveUrl: 'https://claudexxb.online/#preview',
  },
  {
    id: 'politics',
    title: '实验室 03 · 1839–2026 史纲全景矢量中国地图',
    badge: '时空地理联动',
    src: './showcase/04_lab_politics_timeline.png',
    description:
      '横跨百年近代史至“十五五”规划新质生产力热点，高精度矢量地图支持同城多史实循环联动与混淆项排雷。',
    liveUrl: 'https://claudexxb.online/#preview',
  },
  {
    id: 'tutors',
    title: '实验室 04 · 四大分科 AI 导师零缓冲思考流',
    badge: '双师同台会诊',
    src: './showcase/05_lab_ai_tutors.png',
    description:
      '内置研小核、数小通、英小研、政小思四位分科导师，支持深度思考链流式直出与严谨推导 / 考前冲刺 / 苏格拉底追问三模切换。',
    liveUrl: 'https://claudexxb.online/#preview',
  },
];

export const ANTIGRAVITY_SKINS: AntigravitySkinPreset[] = [
  {
    id: 'obsidian-glass',
    name: '黑曜石 · 液态光学',
    subtitle: 'Obsidian Glass (默认旗舰)',
    description:
      '受 VisionOS 与线性极简工业美学启发：深邃黑曜石基底搭配 20px 液态亚克力模糊、钛银微距折射边框与冰川蓝信号光束。',
    bg: '#080a0f',
    sidebar: '#0c1018',
    titleBar: '#07090e',
    statusBar: '#0e1726',
    panel: '#0f141f',
    border: '#1f293b',
    accent: '#38bdf8',
    fg: '#e6edf7',
    muted: '#7e8ca6',
    radius: 14,
    blur: 20,
    opacity: 76,
    glow: 'rgba(56, 189, 248, 0.28)',
    petName: 'B612 小王子',
    petRole: '星海守望伴侣',
    petEmoji: '👑',
    petQuote: '「真正重要的东西，用眼睛是看不见的，唯有用心才能看清。」',
  },
  {
    id: 'vermilion-lacquer',
    name: '朱漆 · 黑金莳绘',
    subtitle: 'Vermilion Lacquer',
    description:
      '融合中国传统大漆工艺与宋刻人文美学：温润如玉的碳墨大漆底色、故宫朱砂红与赤金微光描边，夜战架构沉思首选。',
    bg: '#110c0d',
    sidebar: '#160f11',
    titleBar: '#0e0a0b',
    statusBar: '#3b1715',
    panel: '#1a1214',
    border: '#3b2622',
    accent: '#e15b47',
    fg: '#f5ebe4',
    muted: '#a88f88',
    radius: 10,
    blur: 14,
    opacity: 84,
    glow: 'rgba(214, 164, 94, 0.30)',
    petName: '灶门祢豆子',
    petRole: '大正木箱守护',
    petEmoji: '🎋',
    petQuote: '「唔姆！唔姆！（配额健康度 94%，今日代码状态绝佳！）」',
  },
  {
    id: 'clannad-illusionary-orbs',
    name: 'CLANNAD · 幻想世界光玉',
    subtitle: 'Illusionary Orbs',
    description:
      '承载小镇每一份温柔心愿与奇迹的光玉：深宵苍穹蓝基底搭配暖金光玉微光、22px 液态亚克力折射与静谧星尘。',
    bg: '#090d18',
    sidebar: '#0d1324',
    titleBar: '#080c16',
    statusBar: '#172542',
    panel: '#0c1221',
    border: '#243557',
    accent: '#f6c453',
    fg: '#e8eef9',
    muted: '#8294b8',
    radius: 16,
    blur: 22,
    opacity: 74,
    glow: 'rgba(246, 196, 83, 0.30)',
    petName: '冈崎汐 & 团子大家族',
    petRole: '光玉八音盒伴侣',
    petEmoji: '🍡',
    petQuote: '「能哭的地方，只有厕所，和爸爸的怀里……团子大家族~♪」',
    petBackdrop: './showcase/scene-orbs.webp',
  },
  {
    id: 'nordic-aurora',
    name: '北境极光 · 冰川矿',
    subtitle: 'Nordic Aurora',
    description:
      '斯堪的纳维亚低饱和护眼方案：冷杉深潭岩灰底色辅以幽微极光青翠高亮，久看不疲，兼顾精准语法层次。',
    bg: '#0b1417',
    sidebar: '#0e1a1e',
    titleBar: '#091114',
    statusBar: '#112b30',
    panel: '#111f24',
    border: '#1e333a',
    accent: '#2dd4bf',
    fg: '#dbe8eb',
    muted: '#7b9ba3',
    radius: 12,
    blur: 16,
    opacity: 78,
    glow: 'rgba(45, 212, 191, 0.25)',
    petName: 'B612 小王子',
    petRole: '极光玫瑰巡航',
    petEmoji: '🌹',
    petQuote: '「正是你为你的玫瑰花费的时间，才使你的玫瑰变得如此重要。」',
  },
  {
    id: 'nezuko-bamboo',
    name: '祢豆子 · 竹筒与麻叶',
    subtitle: 'Nezuko Bamboo',
    description:
      '以祢豆子和服麻叶织纹与绯樱竹翠撞色为灵感：细腻暗纹侧边栏搭配高辨识度状态胶囊与专属原声互动。',
    bg: '#1a0e14',
    sidebar: '#24111b',
    titleBar: '#160a10',
    statusBar: '#8e1d47',
    panel: '#1e0f17',
    border: '#4a1f33',
    accent: '#f06292',
    fg: '#f6e3ea',
    muted: '#b98aa0',
    radius: 14,
    blur: 18,
    opacity: 80,
    glow: 'rgba(240, 98, 146, 0.30)',
    petName: '米豆子 (阳光克服态)',
    petRole: '离线原声语音包',
    petEmoji: '🌸',
    petQuote: '「早安呀！Tokio 守护哨兵已就绪，客户端双层汉化补丁完整性 100%！」',
    petBackdrop: './showcase/scene-sakura.webp',
  },
];

export const PROJECTS_DIRECTORY: ProjectDirectoryItem[] = [
  {
    id: 'coreforge',
    name: 'CoreForge 研核',
    codename: 'obsidian-knowledge-viz',
    flagship: true,
    accentColor: '#38bdf8',
    summary:
      '面向 408 计算机与考研数学 / 英语 / 政治的全栈智能研学操作系统 & Obsidian 本地优先知识大脑。内置 1987–2024 真题库、22+ 单步动态仿真课件、红黄绿热力急救舱与双宠语音伴学。',
    highlights: [
      '免登录在线体验 5 大动态交互实验室（AVL 旋转 / 泰勒逼近 / 史纲地图 / AI 批改）',
      '100% 兼容本地 Obsidian .md 实时双向同步，杜绝私有云格式绑架',
      'Express 5 + React 19 + Electron 42 + KaTeX 出版级公式毫秒渲染',
    ],
    techStack: ['React 19', 'TypeScript 6', 'Vite 8', 'Express 5', 'Electron 42', 'KaTeX', 'D3 / xyflow'],
    primaryUrl: 'https://claudexxb.online',
    primaryLabel: '立即体验官网 claudexxb.online',
    repoUrl: 'https://github.com/qts2218346424-cyber/obsidian-knowledge-viz',
    extraLinks: [
      { label: '五大免登录实验室', url: 'https://claudexxb.online/#preview' },
      { label: '客户端与 PWA 下载', url: 'https://claudexxb.online/#download' },
      { label: '在线实机互动展厅', url: 'https://qts2218346424-cyber.github.io/obsidian-knowledge-viz/' },
    ],
    cloneCmd: 'git clone https://github.com/qts2218346424-cyber/obsidian-knowledge-viz.git',
  },
  {
    id: 'antigravity-studio',
    name: 'Antigravity Studio (反重力汉化中心)',
    codename: 'antigravity-zh-cn',
    flagship: true,
    accentColor: '#f472b6',
    summary:
      '基于 Tauri v2 + React 19 + Rust 原生重构的新一代 Antigravity 全能中文控制中心与高定美学引擎。集全量双层无损汉化、10 款光学材质热重载、7 角色独立桌面伴侣与多账号配额反代于一体。',
    highlights: [
      '原生 Rust 解包重建 app.asar + SHA-256 完整性校验，精准避让代码与终端',
      '内置 10 款光学材质包（含 CLANNAD 四重奏）与 Color DNA 物理表面编译器',
      '独立透明窗口灵动桌面伴侣（22 条离线动漫原声 + LRC 黑胶歌词舱 + 一键切号）',
    ],
    techStack: ['Tauri v2', 'Rust', 'React 19', 'TypeScript', 'Tailwind CSS', 'Tokio', 'Minisign OTA'],
    primaryUrl: 'https://github.com/qts2218346424-cyber/antigravity-zh-cn/releases',
    primaryLabel: '下载最新桌面端 Release',
    repoUrl: 'https://github.com/qts2218346424-cyber/antigravity-zh-cn',
    extraLinks: [
      { label: 'GitHub Actions OTA 流水线', url: 'https://github.com/qts2218346424-cyber/antigravity-zh-cn/actions' },
    ],
    cloneCmd: 'git clone https://github.com/qts2218346424-cyber/antigravity-zh-cn.git',
  },
  {
    id: 'coreforge-showroom',
    name: 'CoreForge 实机全息宣传展厅',
    codename: 'obsidian-knowledge-viz-pages',
    flagship: false,
    accentColor: '#a78bfa',
    summary:
      '部署于 GitHub Pages 的零后端纯静态高帧率互动实机展厅，浓缩展示 CoreForge 研核的全套学科工具链、视觉规范与三阶段通关路径。',
    highlights: ['极速 CDN 全球直连秒开', '沉浸式交互镜头语言与特性拆解'],
    techStack: ['HTML5', 'CSS3 Motion', 'GitHub Pages'],
    primaryUrl: 'https://qts2218346424-cyber.github.io/obsidian-knowledge-viz/',
    primaryLabel: '打开在线互动展厅',
    repoUrl: 'https://github.com/qts2218346424-cyber/obsidian-knowledge-viz',
  },
  {
    id: 'qts-cyber-nexus',
    name: 'QTS · 天选 全息个人极客门户',
    codename: 'qts-cyber-blog',
    flagship: false,
    accentColor: '#34d399',
    summary:
      '你当前正在浏览的个人数字造物空间。搭载 60fps 反重力神经引力场、OKLCH 光学流光系统、Raycast 级鼠标感应聚光灯 Bento 矩阵与双旗舰微缩交互沙盒。',
    highlights: ['现代 CSS Scroll-Driven 零阻塞光轨与 Top-Layer 原生模态过渡', '内置 Ctrl+K 极客命令中心与可交互终端'],
    techStack: ['React 19', 'TypeScript', 'Tailwind v4', 'Canvas 2D Physics'],
    primaryUrl: 'https://github.com/qts2218346424-cyber',
    primaryLabel: '访问 GitHub 主页',
    repoUrl: 'https://github.com/qts2218346424-cyber',
  },
];

export const TECH_ARSENAL_ROW_1 = [
  'Rust 1.85+ 原生系统编程',
  'Tauri v2 跨端微内核',
  'React 19 并发渲染架构',
  'TypeScript 6 严苛类型体操',
  'Electron 42 深度定制与 ASAR 逆向',
  'Obsidian Markdown 双链 AST 引擎',
  'Vite 8 极速模块联邦',
  'Tokio 异步守护哨兵',
];

export const TECH_ARSENAL_ROW_2 = [
  'Express 5 & SSE 零缓冲思考流',
  'KaTeX 出版级微积分矩阵排版',
  'D3.js & xyflow 知识星图拓扑',
  'Color DNA 物理表面光学材质编译器',
  'Minisign 数字签名 OTA 热更新',
  'WebAudio 程序化合成声学引擎',
  'Tailwind CSS v4 & OKLCH 色彩空间',
  'Claude / Codex 本机多智能体沙箱桥接',
];

export const BLOG_POSTS: BlogPost[] = [
  {
    id: 'rust-asar-dual-i18n',
    title: '告别脚本拼凑：用 Rust 原生重构 Antigravity 双层无损汉化与光学热重载引擎',
    subtitle: '深入解析 app.asar 原生二进制解包、SHA-256 完整性重建与 BaseWindow 全子视图 CSS 变量注入机制',
    category: '桌面内核 & Rust',
    date: '2026-11-12',
    readTime: '9 分钟深度阅读',
    tags: ['Rust', 'Tauri v2', 'Electron ASAR', '热重载架构'],
    relatedProject: 'Antigravity Studio',
    relatedUrl: 'https://github.com/qts2218346424-cyber/antigravity-zh-cn',
    summary:
      '早期基于批处理脚本的汉化方案常面临官方升级即失效、FSWatcher 权限死锁、甚至误翻译代码标识符的顽疾。本文复盘 Antigravity Studio 如何通过 Rust 后端与 Tokio 哨兵彻底终结这些痛点。',
    sections: [
      {
        heading: '一、为什么传统前端注入补丁难以为继？',
        paragraphs: [
          '在现代基于 Electron 与多 WebContentsView 架构的 AI 桌面 IDE 中，界面由主进程原生菜单、系统托盘、主工作台渲染层以及独立沙箱子视图共同组成。单纯在渲染层挂载 MutationObserver 不仅无法触达主进程菜单，还极易在高频流式输出代码块时引发主线程抖动与误翻译。',
          '更棘手的是，客户端在校验资源包时会核对 app.asar Header 的 SHA-256 Integrity 摘要，且主进程文件监控在遇到粗暴替换时容易抛出 FSWatcher EPERM 崩溃。因此，我们决定使用 Tauri v2 + Rust 构建独立的原生控制中心 Antigravity Studio。',
        ],
      },
      {
        heading: '二、原生 Rust ASAR 无损修补与代码区精准避让',
        paragraphs: [
          '我们在 src-tauri/src/modules/studio 中完全用 Rust 实现了 ASAR 虚拟文件系统的流式解包、备份（自动生成 app.asar.bak）、AST/正则双模补丁注入与重封签名，全程保留官方原生 loadingOverlay 秒开流程。',
          '在渲染层 runtime-zh.js 中，我们采用精细的语义排除集：凡是处于 .monaco-editor、xterm、pre、code 以及模型正文的 DOM 子树一律在 TreeWalker 过滤器阶段短路跳过，确保 100% 纯净的编程心流。',
        ],
        codeSnippet: {
          lang: 'rust',
          filename: 'src-tauri/src/modules/studio/patcher.rs',
          code: `pub async fn apply_lossless_localization(target_dir: &Path, locale: LocaleCode) -> Result<PatchReport> {
    let asar_path = target_dir.join("resources").join("app.asar");
    ensure_clean_backup(&asar_path)?;

    let mut archive = AsarArchive::unpack_in_memory(&asar_path)?;
    archive.strip_legacy_embedded_pet("__AGY_NEZUKO_PET_INITIALIZED__");
    archive.inject_main_menu_dict(&load_desktop_dict(locale)?)?;
    archive.inject_renderer_hooks(&["runtime-zh.js", "skin-runtime.js"])?;

    let digest = archive.repack_and_compute_sha256(&asar_path)?;
    update_asar_integrity_manifest(target_dir, &digest)?;
    Ok(PatchReport { sha256: digest, status: "VERIFIED_LOSSLESS" })
}`,
        },
      },
      {
        heading: '三、Tokio 守护哨兵：官方自动升级后的静默自愈',
        paragraphs: [
          '通过后台轻量级 Tokio 异步轮询对比客户端二进制哈希，一旦侦测到官方版本静默更新覆盖了 app.asar 或 workbench 样式，守护哨兵会自动等待客户端窗口空闲后，毫秒级重新编译并注入用户当前激活的光学皮肤与汉化字典。',
        ],
      },
    ],
  },
  {
    id: 'coreforge-obsidian-engine',
    title: 'CoreForge 研核架构揭秘：如何让本地 Obsidian 笔记与 22+ 动态仿真实验室毫秒共生',
    subtitle: '揭秘防自写回环监听、红黄绿考纲热力星图与零缓冲 AI 导师思考流的全栈工程设计',
    category: '知识大脑 & 可视化',
    date: '2026-11-05',
    readTime: '11 分钟深度阅读',
    tags: ['CoreForge 研核', 'Obsidian', 'React 19', '算法可视化'],
    relatedProject: 'CoreForge 研核',
    relatedUrl: 'https://claudexxb.online',
    summary:
      '备战 408 计算机与考研高数最怕“刷题、看书、记笔记”三张皮割裂。本文拆解 CoreForge 研核如何在 100% 保持本地 .md 数据主权的前提下，构建起真题·PDF·双链图谱·仿真课件四位一体的研学闭环。',
    sections: [
      {
        heading: '一、100% 本地优先主权与防回环双向同步',
        paragraphs: [
          '许多云端笔记将用户的知识资产锁死在私有数据库中，一旦断网或停服便寸步难行。CoreForge 研核坚持直接读写本机原生 Markdown (.md) 目录，与 Obsidian 零配置双向互通。',
          '为解决“前端保存触发 chokidar 文件变动事件、进而导致 SSE 反向冲刷编辑器光标”的经典并发陷阱，我们在 server/context.ts 中设计了基于哈希指纹与时间窗的 selfWriteTracker 防自写回环追踪器，配合 10s 内存热缓存，实现丝滑双端协同。',
        ],
        codeSnippet: {
          lang: 'typescript',
          filename: 'obsidian-viz/server/context.ts',
          code: `export class SelfWriteTracker {
  private recentHashes = new Map<string, { hash: string; expiresAt: number }>();

  markInternalWrite(relPath: string, content: string, ttlMs = 1500) {
    const hash = fastContentDigest(content);
    this.recentHashes.set(relPath, { hash, expiresAt: Date.now() + ttlMs });
  }

  shouldIgnoreFsEvent(relPath: string, diskContent: string): boolean {
    const record = this.recentHashes.get(relPath);
    if (!record || Date.now() > record.expiresAt) return false;
    return record.hash === fastContentDigest(diskContent);
  }
}`,
        },
      },
      {
        heading: '二、从“死背结论”到可触摸的 22+ 交互仿真沙盒',
        paragraphs: [
          '面对 AVL 平衡二叉树 LR/RL 双旋、操作系统两级页表地址映射或高数泰勒余项收敛域，静态插图往往让人越看越懵。我们在前端用状态机驱动 SVG/Canvas 渲染单步指针变换，并与 C 语言伪代码行级高亮联动，访客在 claudexxb.online/#preview 无需注册即可亲手推演。',
          '当用户在真题演练中暴露出薄弱点，红黄绿掌握热力星图会自动将该考点置为闪烁红灯；点击红点即可呼出「提分急救舱」，一键串起历史错因归因、对应动态课件与 5 道同母体变式题，当场完成闭环救绿。',
        ],
      },
    ],
  },
  {
    id: 'tauri-transparent-pet-physics',
    title: '剥离主进程的浪漫：独立透明悬浮窗、弹簧动力学与毫秒级黑胶歌词舱设计',
    subtitle: '从祢豆子、B612 小王子到《CLANNAD》冈崎汐：打造不污染宿主客户端的 7 角色灵动伴侣生态',
    category: '桌面内核 & Rust',
    date: '2026-10-24',
    readTime: '7 分钟深度阅读',
    tags: ['桌面伴侣', '物理缓动', 'WebAudio', 'LRC 二分同步'],
    relatedProject: 'Antigravity Studio',
    relatedUrl: 'https://github.com/qts2218346424-cyber/antigravity-zh-cn',
    summary:
      '把桌宠塞进 IDE 渲染层不仅受限于窗口裁切，还会拖慢编辑器帧率。我们将伴侣彻底剥离为独立透明置顶窗口，结合 5px 物理防抖阈值、22 条离线动漫原声与算力灵动岛，赋予极客桌面温暖灵魂。',
    sections: [
      {
        heading: '一、5px 指针位移解耦：兼顾摸头互动与拎起拖拽',
        paragraphs: [
          '在无边框透明悬浮窗中，最核心的交互矛盾在于“单击触发摸头语音、双击触发角色绝技（如霹雳一闪）”与“按住拖动窗口位置”之间的冲突。如果直接在 pointerdown 调用原生 startDragging，点击事件将被系统吞没。',
          '我们在 petLogic.ts 中引入了 5px 欧氏距离物理阈值状态机：按下指针后先记录锚点，唯有移动距离突破 5px 才切换至拎起悬挂姿态并接管窗口位移；松手落回任务栏边缘时采用现代 CSS linear() 物理弹簧缓动，并自动适配 prefers-reduced-motion。',
        ],
      },
      {
        heading: '二、灵动岛算力预警与二分时间轴歌词同步',
        paragraphs: [
          '伴侣头顶的磨玻璃灵动岛不仅能以二分查找毫秒级同步本地音乐 LRC 多时间标签歌词，还与 Antigravity Studio 的多账号配额池实时打通——一旦当前账号主模型算力跌破安全线，伴侣立即弹出预警气泡，支持免切窗口一键丝滑切换备用账号。',
        ],
      },
    ],
  },
  {
    id: 'color-dna-optical-surfaces',
    title: '高帧率现代暗黑 UI 进阶：Color DNA 物理表面参数与 OKLCH 光学渲染实践',
    subtitle: '为什么顶级极客界面看起来“通透且昂贵”？拆解亚像素折射描边、微噪点与合成器动画铁律',
    category: '光学 UI 工程',
    date: '2026-10-11',
    readTime: '8 分钟深度阅读',
    tags: ['Design Engineering', 'OKLCH', 'Glassmorphism', '60fps'],
    relatedProject: 'Antigravity Studio',
    relatedUrl: 'https://github.com/qts2218346424-cyber/antigravity-zh-cn',
    summary:
      '廉价的毛玻璃只是一味调高 blur 导致文字发糊与 GPU 掉帧；真正高端的光学界面建立在精确的亮度阶梯、1px 顶部内高光、胶片微噪点防色带以及 OKLCH 感知均匀色彩空间之上。',
    sections: [
      {
        heading: '一、六个物理表面维度构建 Color DNA 编译器',
        paragraphs: [
          '在设计 Antigravity Studio 的 10 款内置皮肤（从黑曜石磨玻璃、东方朱漆到 CLANNAD 幻想世界光玉）以及本站的全息极光视觉时，我们将材质抽象为 6 个正交光学参数：圆角曲率 (radius)、高斯模糊半径 (glass_blur)、基底通透度 (card_opacity)、边缘辉光 (border_glow)、胶片颗粒度 (noise_grain) 与多层投影景深 (shadow_elevation)。',
          '配合 0.03 透明度的分形噪点纹理，能够彻底打散深色大面积径向渐变在 8-bit 屏幕上的色彩断层（Color Banding），赋予数字界面温润如黑曜石与大漆器物般的物理触感。',
        ],
      },
      {
        heading: '二、坚守合成器线程（Compositor-Only）与现代 Web 原语',
        paragraphs: [
          '炫技绝不意味着牺牲性能。无论是滚动进度条采用的 CSS Scroll-Driven Animations (animation-timeline: scroll())，还是聚光灯卡片采用的 CSS 自定义属性径向遮罩，均避免了昂贵的 Layout 重排，确保在高刷屏上稳定跑满丝滑帧率。',
        ],
      },
    ],
  },
];
