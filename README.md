# 🌸 空の光 | 光坂春樱与星海造物空间 · 双旗舰交互博客站

> 基于 **React 19 + TypeScript + Vite + Tailwind CSS v4** 构建的光坂典藏级（Hikarizaka Haute）个人博客与造物空间。在京都动画《CLANNAD》四季画境与液态水晶玻璃界面之上，沉浸式呈现 **CoreForge 研核（知识库系统）**、**Antigravity Studio（反重力汉化中心）**、**Persona Chat Studio · 星语恋庭（番剧互动剧场）** 与 **Aether Quant Studio · 苍穹量枢（币安永续量化终端）** 四大核心开源旗舰。

---

## ✨ 视觉炫技与交互亮点

1. **60fps 反重力 × 神经突触交互物理场 (`AntigravityCanvas.tsx`)**
   - 首屏支持实时切换「反重力斥力透镜」「知识突触引力网」「深空微尘」三种物理场模式，鼠标划过触发丝滑粒子流体偏转与极光连线。
2. **双王牌旗舰沉浸式现场试玩展台**
   - **⚡ CoreForge 研核实时实验舱 (`CoreForgeShowcase.tsx`)**：内置 3D 视差倾斜视窗，支持现场点击「红黄绿热力星图」闪烁盲区触发靶向救绿、拖动滑块实时观测「考研高数泰勒展开多项式曲线逼近」，以及浏览 5 张高清实机截图（支持原生顶层灯箱全屏预览），强力引导直达 `https://claudexxb.online` 与 GitHub 仓库。
   - **🪐 Antigravity Studio 光学换肤与汉化体验舱 (`AntigravityShowcase.tsx`)**：1:1 复刻 `skin.json` 色彩体系，支持一键切换 5 款高定光学主题（黑曜石、东方朱漆、CLANNAD 光玉、北境极光、祢豆子竹林）、实时拖动 3 项 Color DNA 物理表面滑块、拨动「英文原生 ↔ 简体中文双层精校汉化」开关，并与独立桌面伴侣语音气泡及算力配额灵动岛互动。
3. **Raycast / Linear 级跨卡片聚光灯 Bento 工程矩阵 (`BentoMatrix.tsx`)**
   - 全局追踪鼠标相对坐标，相邻卡片的 1px 钛银边框实时折射渐变聚光高光；内置全项目传送门（支持一键复制 `git clone`）、双轨无限流光技术带与可输入执行的交互式极客终端。
4. **深度架构专栏与 `Ctrl + K` 全局命令中心**
   - 内置 4 篇围绕 Rust ASAR 无损补丁、Obsidian 防回环同步、独立透明窗口物理弹簧与 Color DNA 光学渲染的原创技术长文；支持随时按下 `Ctrl + K` 唤起全局模糊检索命令面板。

---

## 🚀 本地开发与生产构建

```bash
# 1. 安装依赖
pnpm install

# 2. 启动本地开发服务器（默认 http://localhost:5180）
pnpm dev

# 3. 执行 TypeScript 类型校验并构建生产静态包（输出至 dist/）
pnpm build

# 4. 本地预览生产构建产物
pnpm preview
```

## 🛠️ 如何新增项目或博客文章？

全站数据集中维护于 [`src/data/siteData.ts`](./src/data/siteData.ts)：
- 修改 `PROJECTS_DIRECTORY` 数组即可添加新的开源项目与克隆命令；
- 修改 `BLOG_POSTS` 数组即可发布新的深度技术专栏文章（支持内嵌代码高亮块与关联项目导流卡）。
