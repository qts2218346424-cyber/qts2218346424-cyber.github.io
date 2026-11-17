export interface PersonaScriptSpec {
  id: string;
  title: string;
  homageTag: string;
  heroine: string;
  roleTitle: string;
  playerIdentity: string;
  accent: string;
  stageScene: string;
  innerThought: string;
  openingLine: string;
  choices: {
    id: string;
    label: string;
    thoughtReply: string;
    spokenReply: string;
    heartDelta: number;
    trustDelta: number;
  }[];
}

export interface PersonaCompanionSpec {
  id: string;
  name: string;
  styleTag: string;
  voiceTag: string;
  imageSrc: string;
  accent: string;
  personality: string;
  pokeQuote: string;
}

export interface PersonaScreenshotItem {
  id: string;
  title: string;
  badge: string;
  src: string;
  description: string;
  liveUrl: string;
}

export interface QuantSandboxLevel {
  level: 'L1' | 'L2' | 'L3' | 'L4' | 'L5';
  code: string;
  name: string;
  marketStream: string;
  orderLock: string;
  accent: string;
  desc: string;
}

export interface QuantStrategyPreview {
  id: string;
  name: string;
  category: string;
  timeframe: string;
  winRate: string;
  sharpe: string;
  maxDrawdown: string;
  logic: string;
  isCurve: number[]; // 70% 样本内归一化净值点
  oosCurve: number[]; // 30% 样本外盲测净值点
  habits: [number, number, number, number, number]; // 纪律性, 耐心度, 止损力, 顺势度, 抗FOMO (0-100)
}

export const PERSONA_WORLD_SCRIPTS: PersonaScriptSpec[] = [
  {
    id: 'sakura-slope-wind',
    title: '《樱坂坡道上的风》',
    homageTag: '青春催泪群像剧 · 致敬《CLANNAD》',
    heroine: '星野汐',
    roleTitle: '留级一年的演剧社部长 · 守护后山古樱与光玉',
    playerIdentity: '樱坂高中三年级同级生',
    accent: '#f9a8d4',
    stageScene:
      '*春日下午的斜阳透过旧校舍木窗，洒在堆满旧剧本的长桌上。双呆毛随微风轻晃的少女正抱着一只手工缝制的粉色圆团子，听见推门声后惊喜地抬起眼眸——*',
    innerThought:
      '（太好了……今天放学后他真的推门来活动室了！手心有点出汗，先把准备好的红豆面包递出去吧，希望演剧社的招募海报他会喜欢……）',
    openingLine:
      '「啊，欢迎来到演剧社！那个……如果你不嫌弃的话，要一边吃古河面包房刚出炉的红豆面包，一边听我讲这出关于团子星球的剧本吗？」',
    choices: [
      {
        id: 'bread',
        label: '接过红豆面包：「我来当演剧社的第二名部员吧」',
        thoughtReply:
          '（呜哇……！眼眶一下子热起来了，明明刚才还担心会被当成奇怪的剧本，原来真的有人愿意陪我一起走上这座坡道！）',
        spokenReply:
          '*少女紧抱着粉团子的指尖微微一颤，随即绽开比窗外满开春樱还要灿烂的笑容：*「嗯！！从今天起，请多多指教，我的第一号搭档！」',
        heartDelta: 18,
        trustDelta: 15,
      },
      {
        id: 'orb-dream',
        label: '轻声询问：「昨晚我也梦见了飘满金色光玉的星空」',
        thoughtReply:
          '（他……竟然也看见了那个无人世界里的光玉吗？难道从小困扰我的那个漫长梦境，一直在等待的人就是他……）',
        spokenReply:
          '*星野汐怔怔地望进你的眼睛，声音轻柔得像怕惊醒蝴蝶：*「原来那不是我一个人的幻觉……每一颗光玉，都是这座小镇曾发生过的小小奇迹哦。」',
        heartDelta: 22,
        trustDelta: 19,
      },
      {
        id: 'rehearse',
        label: '拿起桌上的手写台词本：「现在就开始第一幕对词吧」',
        thoughtReply:
          '（他翻开台词本认真的侧脸好让人安心……要把深呼吸稳住，绝对不能在第一句台词就紧张咬到舌头！）',
        spokenReply:
          '*她用力点点头，双手轻轻拍了拍脸颊鼓起勇气：*「好！第一幕——在世界尽头的樱花树下，旅人与守护星海的少女再度重逢……」',
        heartDelta: 15,
        trustDelta: 21,
      },
    ],
  },
  {
    id: 'august-observatory',
    title: '《第八月三十一日的观测站》',
    homageTag: '夏岛悬疑轮回剧 · 致敬《命运石之门》',
    heroine: '牧濑栖',
    roleTitle: '登岛监测引力波的天才物理少女',
    playerIdentity: '收到未来警告短信的观测共犯',
    accent: '#bae6fd',
    stageScene:
      '*海岛夏夜的蝉鸣在旧钟表铺外回荡，桌上辉光管世界线变动率定格在 1.048596%。少女推了推滑落的发丝，将写满公式的草稿纸推到你面前——*',
    innerThought:
      '（虽然嘴上说时间跳跃违反热力学定律……但这家伙精准说出了我三分钟前才推导出的边界常数，这次绝不能让他一个人去码头涉险。）',
    openingLine:
      '「事先声明，我可没有承认你的『第 17 次轮回假说』……不过既然数据吻合，今晚零点的潮汐奇点，本小姐就勉为其难陪你观测到底。」',
    choices: [
      {
        id: 'cola',
        label: '递上一罐冰镇博士胡椒饮料：「谢谢你每次都愿意相信我」',
        thoughtReply:
          '（什么叫『每次』啊……心跳莫名其妙漏了一拍，明明只是跨世界线的统计巧合而已，笨蛋！）',
        spokenReply:
          '*她微微别过微红的耳尖，拉开易拉罐拉环轻哼一声：*「少自作多情了，我只是对反常引力波样本负责而已……下一次轮回，也不准丢下助手。」',
        heartDelta: 19,
        trustDelta: 17,
      },
      {
        id: 'equation',
        label: '指着草稿第 4 行：「把相位偏移项修正就能跨过收束！」',
        thoughtReply:
          '（漂亮！这正是打通世界线屏障缺失的最后一块拼图，有他在身边，哪怕是神明设下的死局也能撕开裂缝！）',
        spokenReply:
          '*少女湛蓝的瞳孔瞬间亮起璀璨星芒，抓起红笔飞速验算：*「收敛成功了！抓紧我的手，我们这就跳向所有人都存活的九月一日！」',
        heartDelta: 16,
        trustDelta: 24,
      },
    ],
  },
  {
    id: 'iris-post-office',
    title: '《鸢尾邮局与无名信》',
    homageTag: '蒸汽时代书信公路剧 · 致敬《紫罗兰永恒花园》',
    heroine: '伊芙琳',
    roleTitle: '银白机械义肢自动手记人偶少女',
    playerIdentity: '鸢尾邮政公社引路搭档',
    accent: '#fde68a',
    stageScene:
      '*煤气灯映照着黄铜打字机的清脆敲击声，换上精密银白机械义肢的少女停下指尖，小心翼翼地将一枚火漆印章按在信封中央——*',
    innerThought:
      '（替无数人代笔写下了『爱』的字眼，可每当坐在他身旁的车厢里，皮箱夹层那十二页写给他的信稿却烫得让我不知如何落款……）',
    openingLine:
      '「搭档，发往北方雪国列车的委托信已经封装完毕。只是……关于『思念』这个词的温度，您能再教教我一次吗？」',
    choices: [
      {
        id: 'warm-hand',
        label: '替她披上羊毛披肩：「哪怕是金属指尖，写出的信也是滚烫的」',
        thoughtReply:
          '（肩上传来的温度一直蔓延到了胸口……原来这就是早苗夫人信里所说的，想要永远定格的瞬间。）',
        spokenReply:
          '*伊芙琳垂眸轻触肩头的披肩，蓝宝石般的眼眸泛起温柔水光：*「谢谢您……我想，第十二封信的结尾，我已经知道该如何落笔了。」',
        heartDelta: 21,
        trustDelta: 18,
      },
    ],
  },
];

export const PERSONA_COMPANIONS: PersonaCompanionSpec[] = [
  {
    id: 'cute_chibi',
    name: '软萌可爱 · 兔耳团子',
    styleTag: '暖橙可可光晕 · 甜糯治愈系',
    voiceTag: '软萌糯米团子音',
    imageSrc: './showcase/persona/cute_chibi.jpg',
    accent: '#fda4af',
    personality: '捧着热可可陪你熬夜写代码与看故事的甜糯小团子，三层记忆记住你所有小习惯。',
    pokeQuote: '「唔呀~ 别戳兔耳朵啦！热可可刚泡好，今晚的梦境日记我也帮你在世界书里收好啰 ♪」',
  },
  {
    id: 'cool_silver',
    name: '高冷清隽 · 银发星眸',
    styleTag: '星辰微光粒子 · 清冷守护系',
    voiceTag: '乙游清冷禁欲音',
    imageSrc: './showcase/persona/cool_silver.jpg',
    accent: '#bae6fd',
    personality: '表面清润疏离，实则把你随口提过的愿望全部设成最高优先级记忆锚点。',
    pokeQuote: '「指尖这么凉？……过来坐近一点，星轨演算显示今晚适合早点休息，我守着你。」',
  },
  {
    id: 'cute_boy',
    name: '元气可爱 · 猫耳少年',
    styleTag: '心动粉樱粒子 · 阳光直球系',
    voiceTag: '乙游阳光奶狗音',
    imageSrc: './showcase/persona/cute_boy.jpg',
    accent: '#fbcfe8',
    personality: '清晨早安与深夜叮嘱从不缺席的直球少年，满眼都是藏不住的偏爱。',
    pokeQuote: '「抓到你偷戳我啦！今天在樱坂坡道剧本里玩得开心吗？不管哪个世界我都会第一时间认出你！」',
  },
  {
    id: 'cool_dark',
    name: '高冷禁欲 · 金丝墨发',
    styleTag: '暗夜玫瑰光晕 · 沉稳智性系',
    voiceTag: '漫剧低音共鸣音',
    imageSrc: './showcase/persona/cool_dark.jpg',
    accent: '#fde68a',
    personality: '兼具仿 DeepSeek 深度逻辑推理与克制深情凝视的双模全能搭档。',
    pokeQuote: '「工作台的难题交给我推演就好。至于你……只需要安心享受今晚的故事就够了。」',
  },
];

export const PERSONA_SCREENSHOTS: PersonaScreenshotItem[] = [
  {
    id: 'hero-theater',
    title: '番剧流式心声剧场 & 2.5D 全息伴侣同框舞台',
    badge: '线上主舞台实拍',
    src: './showcase/persona/02-hero-theater.png',
    description:
      '左侧剧本专属角色池严格隔离，中央实时流式推演角色「心声独白」与三条剧情推进胶囊，右侧 2.5D 全息视差伴侣实时守候。',
    liveUrl: 'https://star.claudexxb.online/?demo=1',
  },
  {
    id: 'story-scripts',
    title: '四大番剧独立世界观剧本库 & AI 改剧本工坊',
    badge: '两级防串戏容器',
    src: './showcase/persona/04-story-scripts.png',
    description:
      '预置《樱坂坡道上的风》等四部多幕互动剧，并支持拖入小说草稿一键由 AI 拆解重构为四幕剧本与登场人设。',
    liveUrl: 'https://star.claudexxb.online/?demo=1',
  },
  {
    id: 'memory-nurturing',
    title: '四阶双向羁绊手账 & 艾宾浩斯三层记忆世界书',
    badge: '永不失忆引擎',
    src: './showcase/persona/03-memory-nurturing.png',
    description:
      '动态追踪心动值、信任度与默契度演化，一键触发「梦境整理 & 写日记」翻阅角色写给你的私密心动手札。',
    liveUrl: 'https://star.claudexxb.online/?demo=1',
  },
  {
    id: 'community-square',
    title: '玩家共创设计广场 · 剧本包与人设卡一键克隆',
    badge: '二创共享生态',
    src: './showcase/persona/05-community-square.png',
    description:
      '浏览并一键克隆社区创作者分享的完整世界观剧本包与高人气独立人设卡，1 秒开演专属故事。',
    liveUrl: 'https://star.claudexxb.online/?demo=1',
  },
  {
    id: 'deepseek-native',
    title: '一键无损切换 · 仿 DeepSeek 纯净生产力工作台',
    badge: '娱乐 × 生产力双生',
    src: './showcase/persona/06-deepseek-native.png',
    description:
      '同一账号下随时在唯美角色剧场与洁净 DeepSeek 生产力推理工作台之间无缝切换，内置卡文灵感补写小助手。',
    liveUrl: 'https://star.claudexxb.online/',
  },
];

export const QUANT_SANDBOX_LEVELS: QuantSandboxLevel[] = [
  {
    level: 'L1',
    code: 'READONLY',
    name: '只读预览沙盒 (出厂默认)',
    marketStream: '1s 币安实时共享流',
    orderLock: '底层物理锁死禁发单',
    accent: '#bae6fd',
    desc: '新克隆开箱零风险模式：完整运行 12 套阿尔法策略信号与 ECharts 多图层看盘，物理隔绝一切真实下单接口。',
  },
  {
    level: 'L2',
    code: 'SHADOW',
    name: '影子旁路观察态',
    marketStream: '真实盘口深度接入',
    orderLock: '零发单 · 全快照归档',
    accent: '#c4b5fd',
    desc: '在真实永续合约盘口旁路记录每一笔策略信号与 System-One Jev 校准评分，零资金成本检验实盘胜率。',
  },
  {
    level: 'L3',
    code: 'PAPER',
    name: '本地仿真撮合舱',
    marketStream: '实时盘口 + 滑点费率',
    orderLock: '本地模拟建仓结算',
    accent: '#fbcfe8',
    desc: '完整模拟 Maker/Taker 双边手续费、动态滑点、TP1 减仓与长线波段升级（Swing Upgrade）全生命周期。',
  },
  {
    level: 'L4',
    code: 'MICRO_LIVE',
    name: '小微资金受限实盘',
    marketStream: '双向持仓对账守护',
    orderLock: '强制微额保证金上限',
    accent: '#fde68a',
    desc: '强制压降单笔名义敞口上限，用极小实验仓位验证交易所真实挂单延迟与硬止损保护单同步链路。',
  },
  {
    level: 'L5',
    code: 'LIVE',
    name: '六重硬风控标准实盘',
    marketStream: '全链路熔断哨兵激活',
    orderLock: 'Jev + RiskManager 双重放行',
    accent: '#fda4af',
    desc: '在日损预算熔断、行情新鲜度熔断、连亏冷静期与常驻一键急停（Kill Switch）全副武装下执行策略。',
  },
];

export const QUANT_STRATEGIES_PREVIEW: QuantStrategyPreview[] = [
  {
    id: 'smart_money',
    name: 'SMC 聪明钱订单块劫持',
    category: '机构订单流 · 15m',
    timeframe: '15m + 1H 共振',
    winRate: '64.8%',
    sharpe: '2.42',
    maxDrawdown: '-6.3%',
    logic: '捕捉前高低点流动性猎杀（Liquidity Sweep）后回踩机构未缓解订单块（Order Block），Maker 限价精准入场。',
    isCurve: [100, 104, 103, 109, 114, 112, 119, 125, 129],
    oosCurve: [129, 133, 131, 138, 144],
    habits: [94, 88, 96, 91, 93],
  },
  {
    id: 'ict_silver_bullet',
    name: 'ICT 经典银弹与 FVG 缺口',
    category: '流动性失衡 · 15m',
    timeframe: '15m 纽约/伦敦银弹窗',
    winRate: '62.1%',
    sharpe: '2.28',
    maxDrawdown: '-5.8%',
    logic: '识别买/卖方流动性掠夺（BSL/SSL）引发市场结构突变（MSS），在公允价值缺口（FVG）均衡位挂单狙击。',
    isCurve: [100, 102, 107, 111, 110, 116, 121, 124, 128],
    oosCurve: [128, 130, 135, 139, 142],
    habits: [92, 85, 95, 89, 94],
  },
  {
    id: 'turtle_breakout',
    name: '海龟双向 ATR 通道突破',
    category: '宏观趋势突破 · 1h',
    timeframe: '1H 唐奇安极值',
    winRate: '53.6%',
    sharpe: '2.15',
    maxDrawdown: '-7.9%',
    logic: '唐奇安通道极值放量突破建仓 + 2.0×ATR 刚性结构止损，抵达 TP1 后剩余底仓自动升级长线波段赛道。',
    isCurve: [100, 99, 105, 113, 111, 120, 118, 127, 134],
    oosCurve: [134, 132, 141, 149, 155],
    habits: [90, 96, 93, 95, 87],
  },
  {
    id: 'wyckoff_spring',
    name: '威科夫吸筹与 Spring 弹簧',
    category: '量价筹码结构 · 15m',
    timeframe: '15m 箱体下沿',
    winRate: '66.2%',
    sharpe: '2.36',
    maxDrawdown: '-5.1%',
    logic: '识别吸筹震荡箱体下沿假跌破长下影收回（Spring）+ 缩量二次测试（ST）确认供应枯竭后点火做多。',
    isCurve: [100, 103, 106, 105, 110, 115, 119, 122, 126],
    oosCurve: [126, 129, 133, 136, 140],
    habits: [95, 91, 97, 88, 96],
  },
];
