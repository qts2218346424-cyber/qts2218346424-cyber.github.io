export type ClannadTrackId =
  | 'dango-family'
  | 'ushio-pocket'
  | 'nagisa-slope'
  | 'town-flow-of-time';

export interface LyricLine {
  time: number; // 秒
  jp?: string;
  zh: string;
}

export interface ClannadTrack {
  id: ClannadTrackId;
  title: string;
  jpTitle: string;
  artist: string;
  durationHint: string;
  src: string;
  coverSrc: string;
  moodTag: string;
  accent: string;
  dangoColor: string;
  description: string;
  lyrics: LyricLine[];
}

export interface ClannadGalleryScene {
  id: string;
  title: string;
  episodeTag: string;
  badge: string;
  imageSrc: string;
  linkedTrackId: ClannadTrackId;
  accent: string;
  quote: string;
  speaker: string;
  story: string;
  dialogues: { speaker: string; line: string }[];
}

export interface ClannadCharacterCard {
  id: string;
  name: string;
  roleBadge: string;
  avatarSrc: string;
  accent: string;
  keepsake: string;
  quote: string;
  bio: string;
}

export interface UshioPoseVoice {
  id: string;
  label: string;
  poseTitle: string;
  spriteSrc: string;
  voiceSrc: string;
  quoteZh: string;
  quoteJp: string;
  accent: string;
}

export interface DangoMember {
  id: string;
  name: string;
  role: string;
  bodyColor: string;
  cheekColor: string;
  eyeStyle: 'line' | 'happy' | 'elder' | 'wink';
  accessory?: 'ribbon' | 'ahoge' | 'sword' | 'crown';
  noteFreq: number; // WebAudio 八音盒音高频率 Hz
  noteName: string;
  blessing: string;
}

export const CLANNAD_TRACKS: ClannadTrack[] = [
  {
    id: 'dango-family',
    title: '团子大家族',
    jpTitle: 'だんご大家族 (茶太 原唱完整版)',
    artist: '茶太 · Key Sounds Label',
    durationHint: '04:33',
    src: './clannad/bgm/dango-family.mp3',
    coverSrc: './clannad/gallery/clannad_family_dango.jpg',
    moodTag: '温馨治愈 · ED 主题曲',
    accent: '#f472b6',
    dangoColor: '#fbcfe8',
    description:
      '古河渚最心爱的动画主题曲，也是串联起朋也、渚与小汐一家三口温柔羁绊的灵魂摇篮曲。百人团子手牵手围成温暖的大圆圈。',
    lyrics: [
      { time: 0, jp: '♪ だんご だんご だんご だんご だんご大家族 ♪', zh: '团子、团子、团子、团子，温暖的团子大家族 ♪' },
      { time: 18, jp: 'やんちゃな焼きだんご やさしいあんこだんご', zh: '顽皮的烧烤团子，温柔微笑的豆沙团子' },
      { time: 34, jp: 'すこし夢見がちな 月見だんご', zh: '还有总爱仰望星空做梦的赏月白团子' },
      { time: 52, jp: 'おすましごまだんご 四つ子串だんご', zh: '端庄害羞的芝麻团子，形影不离的四胞胎串团子' },
      { time: 72, jp: 'みんなみんなあわせて 百人家族', zh: '大家大家聚在一起，就是相亲相爱的百人大家庭' },
      { time: 98, jp: '赤ちゃん星だんご いつも幸せのなかで', zh: '小小的团子宝宝，永远依偎在满满的幸福中央' },
      { time: 126, jp: '年寄りだんごは 目を細めてる', zh: '年迈的长老团子，总是慈祥地眯起眼睛守望着大家' },
      { time: 158, jp: 'なかよしだんご 手をつなぎ 大きなまるい輪になるよ', zh: '友爱的团子们手牵着手，围成一个大大的温暖圆圈' },
      { time: 196, jp: '町をつくり だんご星の上 みんなで笑いあうよ', zh: '在团子星球上建起小镇，大家相视欢笑永不分离' },
      { time: 232, jp: '♪ ラララ… いつまでも一緒だよ ♪', zh: '愿这份微小却滚烫的幸福，陪伴屏幕前的你度过每个日夜 ✨' },
    ],
  },
  {
    id: 'ushio-pocket',
    title: '小小的手心',
    jpTitle: '小さな手のひら (After Story 终章原唱)',
    artist: 'Riya · 麻枝准',
    durationHint: '04:45',
    src: './clannad/bgm/ushio-pocket.mp3',
    coverSrc: './clannad/gallery/scene-sunflower.webp',
    moodTag: '催泪封神 · 奇迹终章',
    accent: '#fbbf24',
    dangoColor: '#fde68a',
    description:
      '《CLANNAD ~After Story~》大结局片尾神曲。当漫天心愿光玉跨越寒冬换回春日奇迹，那双小小的手心终于被稳稳牵起。',
    lyrics: [
      { time: 0, jp: '♪ 澄み渡る空 黄金のひまわり畑 ♪', zh: '晴空澄澈万里，微风拂过无边的黄金向日葵花海' },
      { time: 22, jp: '遠ざかる 雲を見つめてた', zh: '静静仰望着渐渐远去的夏云与季节流转' },
      { time: 48, jp: '小さなその手で 何をつかむの', zh: '那双稚嫩而小小的手心，正紧紧握着怎样的奇迹呢' },
      { time: 82, jp: '泣いていいのは おトイレか パパの胸の中だけ', zh: '「能哭的地方，只有厕所，和爸爸的怀里…」' },
      { time: 124, jp: '季節は巡り 春の桜が舞い降りる', zh: '四季轮回，坡道上的春樱再次漫天绽放' },
      { time: 170, jp: 'いつも いつまでも そばにいるよ', zh: '从今往后无论何时，爸爸妈妈都会一直陪在你身边' },
      { time: 220, jp: '小さなてのひら あたたかい奇跡', zh: '小小的手心里，盛满了这座小镇全部的温柔与奇迹' },
    ],
  },
  {
    id: 'nagisa-slope',
    title: '渚 · 光坂坡道的初遇',
    jpTitle: '渚 ~ 坂の下の別れ (原声钢琴版)',
    artist: '麻枝准 · Key Original Soundtrack',
    durationHint: '01:51',
    src: './clannad/bgm/nagisa-slope.mp3',
    coverSrc: './clannad/gallery/scene-sakura.webp',
    moodTag: '春樱悸动 · 命运起点',
    accent: '#fb7185',
    dangoColor: '#fda4af',
    description:
      '一切故事开始的地方。灰暗的世界在那个仰头轻声自语的少女面前瞬间染上绚烂春樱色彩：「我们一起开始攀登吧，这长长的坡道。」',
    lyrics: [
      { time: 0, jp: '「この学校は、好きですか？」', zh: '「你喜欢这所学校吗？我非常、非常喜欢这里。」' },
      { time: 26, jp: '桜並木の坂道で 止まっていた時間が動き出す', zh: '在洒满花瓣的樱花坡道下，原本停滞灰暗的时间悄然染上色彩' },
      { time: 58, jp: 'たとえ何度やり直しても 君に声をかける', zh: '哪怕时光重来千万次，我依然毫不犹豫地在坡道上喊出你的名字' },
      { time: 86, jp: '行こう、この長い長い坂道を一緒に', zh: '走吧，让我们手牵着手，一起攀登这长长的樱花坡道 🌸' },
    ],
  },
  {
    id: 'town-flow-of-time',
    title: '小镇、时光流逝、人们 · 潮鸣',
    jpTitle: '町、時の流れ、人 / 潮鳴り (OST 组曲)',
    artist: '折户伸治 · 户越麻嘉美',
    durationHint: '03:54',
    src: './clannad/bgm/town-flow-of-time.mp3',
    coverSrc: './clannad/gallery/scene-orbs.webp',
    moodTag: '空灵深邃 · 沉浸编码首选',
    accent: '#38bdf8',
    dangoColor: '#bae6fd',
    description:
      '静谧空灵的原声组曲，如同旧图书室窗外的暮色微风与幻想世界升腾的星海光玉，最适合在深夜沉思阅读或编写代码时循环聆听。',
    lyrics: [
      { time: 0, jp: '♪ 町の鼓動 穏やかに流れる時間 ♪', zh: '小镇温柔的脉搏，如溪水般静静流淌的岁月与人心' },
      { time: 38, jp: 'この町は ひとつの大きな家族みたい', zh: '这座小镇就像一个大家庭，收藏着每个人的眼泪与心愿' },
      { time: 92, jp: '潮鳴りの向こう 幻想の星空へ昇る光の玉', zh: '潮声彼岸，无数承载幸福的心愿光玉正缓缓升向银河' },
      { time: 165, jp: '夢の最後まで 木彫りのヒトデの約束', zh: '哪怕梦境醒来，掌心木雕海星的温度也永远不会消散 ✨' },
    ],
  },
];

export const CLANNAD_GALLERY_SCENES: ClannadGalleryScene[] = [
  {
    id: 'grand-reunion',
    title: '光坂坡道 · 春樱全员奇迹大合照',
    episodeTag: 'CLANNAD · 全家福终章纪念画卷',
    badge: '全员大合照 · 朋也 × 渚 × 汐 × 光坂伙伴 × 团子大家族',
    imageSrc: './clannad/gallery/clannad_grand_reunion.jpg',
    linkedTrackId: 'dango-family',
    accent: '#f472b6',
    speaker: '光坂大家族',
    quote: '「写作 CLANNAD，读作人生与家族——只要大家聚在一起，坡道尽头永远盛开着春樱。」',
    story:
      '冈崎朋也、古河渚与女儿冈崎汐在洒满阳光的樱花坡道中央温暖相依，身旁簇拥着杏、椋、智代、琴美、捧着海星的风子、阳平以及古河秋生与早苗夫妇，石阶上坐满了微笑的粉蓝黄团子大家族。',
    dialogues: [
      { speaker: '冈崎朋也', line: '「从来没有后悔遇见你，也从来没有后悔来到这座小镇。」' },
      { speaker: '古河渚', line: '「就像团子大家族一样，大家手牵着手，就变成了最温暖的大圆圈呢！」' },
      { speaker: '冈崎汐', line: '「爸爸、妈妈，还有大团子们，要一直一直在一起哦！」' },
    ],
  },
  {
    id: 'family-dango',
    title: '午后暖阳 · 朋也、渚与小汐的团子全家福',
    episodeTag: 'AFTER STORY · 幸福日常剪影',
    badge: '一家三口 · 团子大家族与古河面包店的香气',
    imageSrc: './clannad/gallery/clannad_family_dango.jpg',
    linkedTrackId: 'dango-family',
    accent: '#fb923c',
    speaker: '古河渚 & 冈崎汐',
    quote: '「哪怕是最平凡的午后，只要有热茶、团子抱枕和家人的笑声，就是全世界最珍贵的奇迹。」',
    story:
      '春日下午的和煦阳光穿过庭院樱花洒入木屋，朋也与渚温柔守护着怀抱粉团子开怀欢笑的小汐，身边堆满了圆滚滚的彩色团子玩偶。',
    dialogues: [
      { speaker: '古河渚', line: '「小汐和朋也君笑起来的样子，真的一模一样呢。」' },
      { speaker: '冈崎汐', line: '「粉团子是妈妈，蓝团子是爸爸，黄色小团子就是汐哦 ♪」' },
    ],
  },
  {
    id: 'sakura-slope',
    title: '光坂坡道 · 樱花雨中的初遇与回眸',
    episodeTag: 'CLANNAD · EP.01 & EP.22「桜並木の坂道」',
    badge: '男女主经典名场面 · 冈崎朋也 × 古河渚',
    imageSrc: './clannad/gallery/scene-sakura.webp',
    linkedTrackId: 'nagisa-slope',
    accent: '#fb7185',
    speaker: '古河渚 & 冈崎朋也',
    quote: '「无论时光倒流多少次，我依然会在洒满春樱的坡道上停下脚步，喊出你的名字。」',
    story:
      '原作最经典的命运起点。灰白单调的高三清晨，仰望坡道的双呆毛少女轻声询问「你喜欢这所学校吗？」，从此两个孤独的灵魂彼此照亮。',
    dialogues: [
      { speaker: '古河渚', line: '「红豆面包……！我今天也鼓起勇气往前迈出一步了哦。」' },
      { speaker: '冈崎朋也', line: '「走吧，笨蛋，我陪你一起去重建演剧部！」' },
    ],
  },
  {
    id: 'sunflower-field',
    title: '盛夏向日葵花海 · 在爸爸怀里放声哭泣',
    episodeTag: 'CLANNAD ~After Story~ · EP.18「大地の果て」',
    badge: '动画史封神回 · 朋也与冈崎汐父女和解',
    imageSrc: './clannad/gallery/scene-sunflower.webp',
    linkedTrackId: 'ushio-pocket',
    accent: '#fbbf24',
    speaker: '冈崎汐',
    quote: '「早苗阿姨说过……能哭的地方，只有厕所，和爸爸的怀里。」',
    story:
      '一望无际的金色向日葵花田中，寻找弄丢的小机器人的小汐终于卸下坚强伪装，扑进朋也怀中痛哭——父女五年的隔阂在夕阳下彻底融化。',
    dialogues: [
      { speaker: '冈崎汐', line: '「那个小机器人……是爸爸第一个买给我的，独一无二的宝物……」' },
      { speaker: '冈崎朋也', line: '「对不起，汐……从今以后，爸爸再也不会松开你的小手了。」' },
    ],
  },
  {
    id: 'illusionary-orbs',
    title: '幻想世界 · 漫天升向星海的心愿光玉',
    episodeTag: 'CLANNAD ~After Story~ · EP.22「小さなてのひら」',
    badge: '终章奇迹 · 守护整座小镇的温暖微光',
    imageSrc: './clannad/gallery/scene-orbs.webp',
    linkedTrackId: 'town-flow-of-time',
    accent: '#38bdf8',
    speaker: '幻想世界少女',
    quote: '「每一颗缓缓升向银河的光玉，都是小镇里人们用真心守护过的幸福。」',
    story:
      '横跨学园篇与家族篇的温柔伏笔在此收束：每一次善意的帮助、每一滴真诚的泪水都化作璀璨光玉，最终跨越时空唤醒奇迹。',
    dialogues: [
      { speaker: '幻想世界少女', line: '「呐，我已经全部想起来了……原来我就是这座小镇的心愿本身。」' },
    ],
  },
  {
    id: 'fuko-starfish',
    title: '木雕海星的约定 · 直到梦境的尽头',
    episodeTag: 'CLANNAD · EP.09「夢の最後まで」',
    badge: '学园催泪篇 · 伊吹风子真挚的婚礼请柬',
    imageSrc: './clannad/gallery/scene-starfish.webp',
    linkedTrackId: 'town-flow-of-time',
    accent: '#c084fc',
    speaker: '伊吹风子',
    quote: '「请收下这枚风子亲手雕刻的海星！哪怕梦醒后被大家遗忘，祝福也会永远留下！」',
    story:
      '为了姐姐伊吹公子的校园婚礼，笨拙而执着的风子日夜雕刻木头海星送给全校同学，成为光坂高校最温暖的青春印记。',
    dialogues: [
      { speaker: '伊吹风子', line: '「那不是面包，是超级可爱的宇宙第一海星啦！」' },
    ],
  },
];

export const CLANNAD_CHARACTERS: ClannadCharacterCard[] = [
  {
    id: 'tomoya',
    name: '冈崎朋也',
    roleBadge: '男主角 · 跨越迷茫的守护者',
    avatarSrc: './clannad/gallery/scene-sakura.webp',
    accent: '#38bdf8',
    keepsake: '🌸 光坂校徽 · 蓝色团子',
    quote: '「就算青春曾满是伤痕，遇见渚与汐的那一刻，一切苦难都化作了温柔的答案。」',
    bio: '从叛逆迷茫的不良少年，成长为用宽厚肩膀扛起家庭重担的温柔父亲。用行动诠释了何为真正的责任与深情。',
  },
  {
    id: 'nagisa',
    name: '古河渚',
    roleBadge: '女主角 · 双呆毛与团子的温柔灵魂',
    avatarSrc: './clannad/gallery/clannad_family_dango.jpg',
    accent: '#f472b6',
    keepsake: '🍡 粉色大团子 · 红豆面包',
    quote: '「虽然我很笨拙又爱哭，但只要和朋也君在一起，再高的坡道我也敢微笑着走上去。」',
    bio: '深爱着演剧部与《团子大家族》的坚韧少女。看似柔弱却拥有照亮身边每一个人的强大治愈能量。',
  },
  {
    id: 'ushio',
    name: '冈崎汐',
    roleBadge: '奇迹结晶 · 向日葵与小机器人少女',
    avatarSrc: './clannad/ushio/ushio_action_sunflower.webp',
    accent: '#fbbf24',
    keepsake: '🌻 草帽与红色小机器人',
    quote: '「能哭的地方，只有厕所，和爸爸的怀里……」',
    bio: '朋也与渚最珍贵的女儿，继承了妈妈标志性的两根灵动双呆毛与早苗奶奶教导的坚强懂事，一颦一笑都牵动人心。',
  },
  {
    id: 'friends',
    name: '光坂小镇大家族',
    roleBadge: '群像羁绊 · 秋生/早苗/杏/智代/琴美/风子/阳平',
    avatarSrc: './clannad/gallery/clannad_grand_reunion.jpg',
    accent: '#a78bfa',
    keepsake: '⭐ 木雕海星 · 彩虹面包 · 小提琴',
    quote: '「追逐梦想也好，摔倒哭泣也好，回头看时古河面包店的灯光永远为你亮着。」',
    bio: '豪爽护犊的秋生大叔、爱哭却无比坚强的早苗阿姨、挚友阳平与演剧部众少女——正是他们共同编织了名为「家族」的奇迹之网。',
  },
];

export const USHIO_POSES_VOICES: UshioPoseVoice[] = [
  {
    id: 'toilet',
    label: '🌻 爸爸怀里 (封神原声)',
    poseTitle: '向日葵花田与小机器人态',
    spriteSrc: './clannad/ushio/ushio_action_sunflower.webp',
    voiceSrc: './clannad/voices/ushio_toilet.mp3',
    quoteZh: '「早苗奶奶说过……能哭的地方，只有厕所，和爸爸的怀里…」',
    quoteJp: '泣いていいのは、おトイレか、パパの胸の中だけだって…',
    accent: '#fbbf24',
  },
  {
    id: 'dango',
    label: '🍡 团子三兄弟叠叠乐',
    poseTitle: '头顶团子三兄弟开心态',
    spriteSrc: './clannad/ushio/ushio_action_happy.webp',
    voiceSrc: './clannad/voices/ushio_dango.mp3',
    quoteZh: '「团子，团子，团子，团子，团子大家族 ♪ 要一直在一起哦！」',
    quoteJp: '♪ だんご だんご だんご大家族 — 原动画真曲欢唱',
    accent: '#f472b6',
  },
  {
    id: 'robot',
    label: '🤖 独一无二的宝物',
    poseTitle: '怀抱粉团子灵动待机态',
    spriteSrc: './clannad/ushio/ushio_chibi_pet.webp',
    voiceSrc: './clannad/voices/ushio_robot.mp3',
    quoteZh: '「那个呀…是爸爸第一个买给我的，全世界独一无二的宝物哦 🌻」',
    quoteJp: 'パパが一番最初に買ってくれた、大事な宝物なの！',
    accent: '#fb923c',
  },
  {
    id: 'sanae',
    label: '✨ 漫天心愿光玉',
    poseTitle: '暖心抚摸治愈态',
    spriteSrc: './clannad/ushio/ushio_chibi_blink.webp',
    voiceSrc: './clannad/voices/ushio_sanae.mp3',
    quoteZh: '「早苗奶奶说已经不用再忍耐了…满天都是光玉，最喜欢爸爸了 ✨」',
    quoteJp: 'もう我慢しなくていいって…ほら、光の玉がいっぱいだよ！',
    accent: '#38bdf8',
  },
  {
    id: 'trip',
    label: '🎒 抱团子出门旅行',
    poseTitle: '轻快小跑出游态',
    spriteSrc: './clannad/ushio/ushio_action_walk.webp',
    voiceSrc: './clannad/voices/ushio_trip.mp3',
    quoteZh: '「嗯！一起出门旅行好开心呀！粉色大团子也要一起去哦，嘿嘿 ♪」',
    quoteJp: 'うん！お出かけたのしいね！おっきいだんごも一緒に行くの♪',
    accent: '#34d399',
  },
  {
    id: 'sleep',
    label: '🌙 团子大家族甜睡',
    poseTitle: '趴在三色大团子上酣睡态',
    spriteSrc: './clannad/ushio/ushio_action_sleep.webp',
    voiceSrc: './clannad/voices/ushio_sleep.mp3',
    quoteZh: '「唔…眼皮快合上啦…晚安呀，愿你也能做个暖呼呼的好梦…」',
    quoteJp: 'おやすみなさい、あったかい夢が見られますように…',
    accent: '#c084fc',
  },
];

export const DANGO_FAMILY_MEMBERS: DangoMember[] = [
  {
    id: 'dango-pink',
    name: '樱粉团子 · 渚',
    role: '温柔妈妈团子',
    bodyColor: '#f9a8d4',
    cheekColor: '#f43f5e',
    eyeStyle: 'line',
    accessory: 'ahoge',
    noteFreq: 523.25, // C5 (Do)
    noteName: 'Do (C5)',
    blessing: '愿你的每一份热爱都被温柔回应 🌸',
  },
  {
    id: 'dango-blue',
    name: '晴空团子 · 朋也',
    role: '可靠爸爸团子',
    bodyColor: '#93c5fd',
    cheekColor: '#60a5fa',
    eyeStyle: 'line',
    noteFreq: 587.33, // D5 (Re)
    noteName: 'Re (D5)',
    blessing: '跨越迷茫坡道，守护最重要的人 🌊',
  },
  {
    id: 'dango-yellow',
    name: '暖阳团子 · 小汐',
    role: '元气宝宝团子',
    bodyColor: '#fde047',
    cheekColor: '#fb923c',
    eyeStyle: 'happy',
    accessory: 'ahoge',
    noteFreq: 659.25, // E5 (Mi)
    noteName: 'Mi (E5)',
    blessing: '小小的手心里装满了金色的阳光 🌻',
  },
  {
    id: 'dango-green',
    name: '若叶团子 · 风子',
    role: '海星许愿团子',
    bodyColor: '#86efac',
    cheekColor: '#f472b6',
    eyeStyle: 'wink',
    accessory: 'ribbon',
    noteFreq: 698.46, // F5 (Fa)
    noteName: 'Fa (F5)',
    blessing: '收下木雕海星，幸运与灵感常伴 ⭐',
  },
  {
    id: 'dango-lavender',
    name: '紫藤团子 · 杏&琴美',
    role: '书香提琴团子',
    bodyColor: '#d8b4fe',
    cheekColor: '#e879f9',
    eyeStyle: 'line',
    accessory: 'ribbon',
    noteFreq: 783.99, // G5 (Sol)
    noteName: 'Sol (G5)',
    blessing: '愿代码与旋律都如诗篇般优雅流淌 🎻',
  },
  {
    id: 'dango-anko',
    name: '豆沙长老团子',
    role: '慈祥守望大家长',
    bodyColor: '#d6b49d',
    cheekColor: '#f87171',
    eyeStyle: 'elder',
    accessory: 'crown',
    noteFreq: 880.0, // A5 (La)
    noteName: 'La (A5)',
    blessing: '百人团子大家族永远做你温暖的后盾 🍵',
  },
];
