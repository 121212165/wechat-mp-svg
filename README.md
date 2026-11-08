# wechat-mp-svg · 公众号 SVG Skill 第一版

> 起因：用户发现 HY 4 的 SVG 能力不错，想做一个公众号 SVG skills；
> 自认 SVG 小白，所以**不评价能力，先看审美** —— 让他做两三个风格。
>
> 本仓库就是这件事的产物：一个 Skill 包 + 一个 HTML 展示页 + 一份带来源的调研报告。
> 三个风格展示的**是同一段原文**（原文照录，仅作断句分行，未改字、未润色）。

**文案原文**
> 我发现HY 4 svg 能力不错 我想做一个公众号是svg skills 我是一个svg 小白 所以不去评价能力如何先看看审美如何 我让他做了两三个风格

---

## 目录

```
wechat-svg-skills/
├── README.md                              ← 本文件：调研报告 + 使用说明
├── SKILL.md                               ← Skill 定义（可安装到 ~/.workbuddy/skills）
├── index.html                             ← 展示页：3 风格预览 + 一键复制 + 合规自检
├── styles/
│   ├── 01-notion-note.svg                 ← 风格 01：极简笔记
│   ├── 02-linear-terminal.svg             ← 风格 02：暗色终端
│   └── 03-stripe-editorial.svg            ← 风格 03：暖色杂志
└── references/
    └── wechat-svg-constraints.md          ← 公众号 SVG 硬约束 + 全部来源 URL
```

---

# 一、公开 SVG Skills 调研（7 个参考 / 3 个深入）

检索时间 2026-11-08。以下均为真实存在的公开仓库/注册表条目，附可访问 URL。

## 1.1 参考清单

| # | 名称 | 来源 | 定位 | 对本 skill 的启发 |
| --- | --- | --- | --- | --- |
| 1 | **anthropics/skills**（官方） | https://github.com/anthropics/skills ／ https://vibecodes.net/skills/anthropic-skills | Agent Skills 规范参考实现；含 `algorithmic-art`、`canvas-design`、`theme-factory`、`brand-guidelines`、`skill-creator` 等约 20 个技能 | 确立 `SKILL.md` + YAML frontmatter + 按需加载 `references/` 的标准结构；`theme-factory` 的"风格可切换"思路 |
| 2 | **ymmt2005/draw-svg** ⭐深入 | https://github.com/ymmt2005/draw-svg | 自然语言 → 独立 SVG 流程图/架构图/ER 图 | 固定网格 + 分层输出 + 稳定 ID + 按需加载 references |
| 3 | **pkt-lab/svg-diagram** ⭐深入 | https://github.com/pkt-lab/svg-diagram | 架构/流程 SVG，带闭环校验与视觉自审 | 「结构校验 → 渲染 → 视觉复核 → 修复」的客观验证回路 |
| 4 | **yizhiyanhua-ai/fireworks-tech-graph** ⭐深入 | https://github.com/yizhiyanhua-ai/fireworks-tech-graph ／ https://skillsllm.com/skill/fireworks-tech-graph | 12 种技术图风格矩阵、JSON 生成器、SVG→PNG/GIF/HTML 多出口 | 风格矩阵 + 可执行 composition contract + "命令成功 ≠ 视觉合格" |
| 5 | **kv0906/cc-skills · svg-art** | https://skillselion.com/skills/kv0906/cc-skills/svg-art | 8 个 Python 脚本程序化生成图标/网格/分形/波形/图表，`--seed` 可复现 | `--seed` 可复现 + `optimize_svg.py` 产物精简；说明"脚本生成"与"模型直写"是两条路线 |
| 6 | **claudskills · svg**（DSL 信息图） | https://claudskills.com/skills/svg | 用紧凑 DSL 生成品牌感知 SVG 信息图，颜色从 brand pack 解析 | 配色不写死在技能里，从配置注入 —— 对应本 skill 的「配置」维度 |
| 7 | **claudskills · delivery-svg-markdown** | https://claudskills.com/skills/delivery-svg-markdown | 纯静态 SVG 面板，内嵌 Markdown；**无 JS、无外部 CSS、无构建步骤、inline styles** | 与公众号约束高度同构：强约束环境里"自包含 + 内联样式"才有存活率 |

补充参照：`skills.md` 的 `logo-design`（导出 vector SVG + usage notes + manifest，
见 http://skills.md/）、`skills.sh` 注册表、`claudeskills.com` 目录。

## 1.2 深入分析 ① `draw-svg` —— 把"审美"变成可执行的几何协议

**结构**（遵循 `agentskills.io/specification` 的 `skills/*/SKILL.md` 约定）：

```
skills/draw-svg/
├── SKILL.md            # 主入口，简单流程图自给自足
├── references/         # shapes / connectors / layout / colors / flowchart / architecture / er-diagram
└── examples/           # 每个模板一个成品 SVG，构成 visual portfolio
```

**四条核心方法**（从 draw.io XML 参考中蒸馏，但**不产出** draw.io XML）：

1. **Reasoning budget** — 不在主题、布局、坐标上反复纠结，选第一个合理结构就定下来；
2. **Rigid grid** — `column x = col * 180 + 40`、`row y = row * 120 + 40`，固定形状尺寸；
   位置可预测 → 连线就是可预测的 L 形路径；
3. **Layered output** — 每个 SVG 顶层必有 `#layer-nodes` / `#layer-edges`
   （有泳道时加 `#layer-containers`），后续修改可精确定位；
4. **Stable IDs** — `id="node-<slug>"` / `id="edge-<src>-<dst>"`，后续用 `Edit` 而非 `Write`。

**对本 skill 的取舍**：固定网格、分层、按需 references 全部采纳；
**Stable IDs 必须弃用** —— 微信会删除所有 `id`（见 §2.3）。
这正是「网页 SVG skill」与「公众号 SVG skill」的分水岭：
一个靠 id 建立可维护性，一个必须在**失去一切引用**后仍自洽。

来源：https://github.com/ymmt2005/draw-svg

## 1.3 深入分析 ② `pkt-lab/svg-diagram` —— 客观验证回路

**闭环 pipeline（5 步）**：

```
Plan layout（inventory → grid → size-to-text → route connections → canvas size）
  → Generate SVG（强制分层，connections 最后渲染）
  → Structural validation（validate_svg.py，14 项自动检查）
  → Visual self-review（render_svg.py 用 librsvg+cairo 转 PNG，Claude 读图挑审美问题）
  → Fix loop（任一失败即修改并重新校验）
```

- **GitHub-safe SVG**：无 `<foreignObject>`、无 JavaScript、无外部引用；
- **分层**：`<defs>` → `#background` → `#containers` → `#nodes` → `#labels` → `#connections`；
  连线永远最后画，箭头不会被方块盖住；
- **14 项结构检查**：方块重叠、文字溢出、箭头穿框、箭头穿字、marker 缺失、
  间距过紧、viewBox 不匹配、网格错位、层级违规等；
- **退出码**：`0` pass / `1` warnings / `2` errors；配套 pytest + CI。

**对本 skill 的取舍**：采纳「客观脚本校验 + 显式显示失败」这一层，落地为 `index.html`
里的 `auditSVG()`；**弃用** `<defs>` 与分层 id（微信删除 id），
并把检查项从"图形几何"换成"平台白名单合规"。
`render_svg.py` 的视觉自审思路保留为人工真机预览清单（见 §2.6）。

来源：https://github.com/pkt-lab/svg-diagram

## 1.4 深入分析 ③ `fireworks-tech-graph` —— 风格矩阵与"不自我认证"

- **风格矩阵**：11 个 JSON 生成器风格 + 1 个 AI 直写风格（Style 8 Dark Luxury）；
  无偏好时默认 Style 1 Flat Icon；**只在用户要求对比时才读其他风格文件**；
  每套风格有独立的 `references/style-N.md`，统一加载 `composition-quality-contract.md`。
- **可执行 composition contract**：零交叉、零桥跳、每条边 ≤2 弯、总弯数 ≤8、
  节点间距 ≥40px、容器留白 ≥20px、标签不压节点/连线/分区标题。
- **严格的文字策略**：`text_policy: "strict"` 时拒绝任何可见截断；
  默认 report 保留完整标签于 SVG 元数据，并报告截断警告。
- **最值得抄的一句**：
  > **「a successful command is not a visual quality verdict」**
  > （命令跑通不等于视觉合格）
  以及：「若无法查看渲染图，必须**显式标记视觉检查已跳过**，且不得声称视觉正确。」
- **流程**：`validate` → `render` → `check` → `export-png`；
  `check` 校验 SVG 身份、marker 引用、通用碰撞、语义几何与构图；
  失败后用元素 ID 和几何做定点修复，两次无改善就换思路。

**对本 skill 的取舍**：风格矩阵 → 本仓库 3 个 `styles/*.svg`；
composition contract → 白名单合规契约；
**最重要的是态度**：本 skill 只声称"代码级合规自检通过"，
**不声称审美更好，也不声称已在公众号发布验收**（见 §4）。

来源：https://github.com/yizhiyanhua-ai/fireworks-tech-graph ／
https://skillsllm.com/skill/fireworks-tech-graph ／
https://agskills.dev/en/yizhiyanhua-ai/fireworks-tech-graph/fireworks-tech-graph

## 1.5 三个深入样本的横向对照

| 维度 | draw-svg | pkt-lab/svg-diagram | fireworks-tech-graph |
| --- | --- | --- | --- |
| 生成方式 | 模型直写 SVG | 模型直写 + 脚本校验 | JSON 生成器 + 1 个 AI 直写风格 |
| 坐标策略 | 刚性网格公式 | 5 步布局规划 | 语义几何 + composition contract |
| 质量保障 | 稳定 ID 便于迭代 | 14 项脚本校验 + PNG 视觉自审 | validate/render/check + 文字严格策略 |
| 风格机制 | 模板 references | 无固定色板，自由配色 | 12 风格矩阵，默认 Style 1 |
| 运行环境假设 | 浏览器 / GitHub | GitHub / GitLab | Codex + Claude Code，可导 PNG/GIF |
| **公众号适配** | ❌ 依赖 id | ❌ 依赖 defs/id | ❌ 依赖 id/脚本管线 |

**结论**：现有公开 SVG skills 全部面向「网页 / GitHub / 通用 Agent」环境，
**没有一个针对微信公众号的强约束环境**。它们的共同依赖（`id`、`<defs>`、
`<style>`、脚本管线、外部渲染器）恰好都是微信会删掉或跑不起来的东西。
这就是本 skill 存在的空位：**不是再做一个画图 skill，而是做一个"能粘进公众号"的约束层**。

---

# 二、公众号 SVG 生态深挖

完整约束与逐条来源见 [`references/wechat-svg-constraints.md`](references/wechat-svg-constraints.md)。
这里给结论。

## 2.1 机制：SVG 是被"整体放行"的命名空间

微信编辑器 sanitize HTML，但 **`<svg>` 及其全部子元素整体放行**。
原因是 SVG 的 SMIL 声明式动画属于 W3C 规范、不需要 JS、不发起网络请求、不读写 DOM，
安全风险可控；推测 sanitizer 只对 HTML 命名空间做深度解析。
Apple、小米、喜茶等品牌号长期使用 SVG 交互图文。

来源：https://blog.waistu.com/archives/GH6ijd6e ／
https://www.yeyulingfeng.com/626469.html §3.4 ／
https://cloud.tencent.com/developer/article/2739502

## 2.2 白名单：2016 年确立，约 20 个可用动画属性

2016 年 JZCreative（复旦计育韬、厦门嘉庚学院林喆）与微信团队共同测试发布，
最初筛选 27 个适配微信 APP 的动画标签；目前仍保留约 20 个。
该范式收录于《融媒体SVG交互设计技术规范》T/CASME 1609—2024。

| 元素 | 允许的 attributeName |
| --- | --- |
| `animate` | `x` `y` `width` `height` `r` `opacity` `d` `points` `fill` `stroke` `stroke-width` `stroke-linecap` `stroke-dashoffset` |
| `set` | `visibility` |
| `animateTransform` | `translate` `scale` `rotate` `skewX` `skewY`（`type` 取值） |
| `animateMotion` | `path` |

白名单文档明确要求：**不含剪切路径、滤镜、渐变、网格等矢量特征**；
`use` / `mpath` / `by` / `clipPath` / `filter` 受限。
并警告：试图突破白名单会被视为**对抗开发**，已有编辑器因"图文弹跳"被封禁。

来源：https://blog.waistu.com/archives/GH6ijd6e ／
http://mp.weixin.qq.com/s?__biz=Mzg2NjcwMzk3Mg==&mid=2247517501&idx=1&sn=65330f8e2b679bbb222ddc7e8adc2cf5

## 2.3 会被删/会失效的东西

| 类别 | 具体 |
| --- | --- |
| 标签/属性 | `<script>` `<style>` `iframe` `embed` `object` **`id`（所有元素，含 SVG 内）**、`on*` 事件、`javascript:`/`data:` 协议 |
| CSS | `animation` `transition` `@keyframes` `@media` `@font-face`、`:hover` `::before`、`position: absolute/fixed/relative`、`float` |
| 资源 | SVG 内 `<image>` 外链与 base64 均不显示，必须用微信素材库链接；iOS 上 `<image>` 不写 `width/height` 不显示 |
| 类 | `class` 保留但不生效（没有 `<style>` 承载） |
| iOS 特有 | `restart="never"` 无效；`<g style="transform-origin:...">` 失效（要用属性形式 `<g transform="...">`） |
| 深色模式 | SVG 可能被包成 `<embed>` 上传图床，`currentColor` 继承断裂、层级混乱 |

来源：https://www.yeyulingfeng.com/626469.html §2.3 / §7 / §7.5 ／
https://cloud.tencent.com/developer/article/2739502 §5 ／
https://tsight.io/articles/11245390（风控边界）

## 2.4 一键复制为什么可行（三条真实路径）

1. **富文本直粘**：96 编辑器教程原文 ——
   「不支持同步到微信公众平台，可以直接点击微信复制，然后 Ctrl+V 粘贴到微信公众平台
   素材管理新建图文的正文里」（https://bj.96weixin.com/help/101.html）。
   秀米 / 135 / 壹伴 / E2.COOL 均提供「一键复制」。
2. **HTML 源码模式**：`shyboy/wechat-mp-html-source-helper`（Chrome MV3，v0.3.2）
   在 `mp.weixin.qq.com` 注入「HTML 源码」入口，**保留常见 SVG 图形和 SMIL 视觉动画，
   包括 `begin="click"`**，支持插入到记住的光标位置（https://github.com/shyboy/wechat-mp-html-source-helper）。
3. **白名单限定网页 + 手动复制**：《AI slop 一则》§8.4 直接给出路线 ——
   不用 `<style>` 标签、样式全写 `style=""`、浏览器 Ctrl+A/C → 微信编辑器 Ctrl+V
   （https://www.yeyulingfeng.com/626469.html）。

**源码模式实测原则**：「能写在 SVG 属性里，就不要写在 style 里」；
`style="animation: xx 1s infinite"` 这类 CSS 动画发布时会被清理
（https://blog.csdn.net/weixin_31115195/article/details/164636166）。

## 2.5 成熟清洗参考

`doocs/md` 的 `wechat-svg.ts` 沉淀了「微信公众号强约束 SVG」自动清洗，
目标是在**失去 `id` / `defs` / CSS / JS 后依然自洽**，
靠纯 SVG 冒泡驱动（绝对父子链、三层分法、施加→抵消→再施加），
用于修复「粘贴后箭头消失、图表超大、文字错位、动画失效」。
来源：https://blog.gitcode.com/871b3ef0eeda6abca09b805bb4c85a03.html ／ https://github.com/doocs/md

## 2.6 真机验收清单（发布前必做）

保存草稿 → 重新打开 → iOS + Android 双机、浅色 + 深色预览，检查：
动画是否自动播放、是否卡首帧、结束是否停留在完整画面
（部分安卓 WebView 忽略 `fill="freeze"`）、低端机是否掉帧。
来源：https://blog.csdn.net/weixin_31115195/article/details/164636166

---

# 三、审美考查：配置 / 布局 / 动画（6 处资源引用）

用户要求「风格考查审美，主要是演示配置、布局和动画」。
三个风格因此**共用同一段文案**，只在这三个维度上拉开差距。

## 3.1 引用资源

| # | 资源 | URL | 用在哪 |
| --- | --- | --- | --- |
| R1 | **60-30-10 Rule**（UX Quest） | https://www.uxqst.com/ux-laws/60-30-10-rule | 三套配色比例：60% 中性主导 / 30% 结构次要 / 10% 单一强调；强调色需过 4.5:1 对比度；"眯眼测试"找主行动点。文中直接以 Stripe、Linear 为例 |
| R2 | **配色公式与 HSL / Refactoring UI** | https://rar.design/posts/color-palette-formulas | Notion 红、Stripe 紫、Spotify 绿都守在 10% 以下（"注意力工程"）；主导色再切「真背景 / 容器背景」差 5–10% 明度堆层次；用 HSL 而非 HEX 思考调色 |
| R3 | **Visual Design Standards**（catlog22/Claude-Code-Workflow） | https://github.com/catlog22/Claude-Code-Workflow/blob/main/.claude/skills/team-ux-improve/specs/design-standards.md | 4pt 间距刻度 `0/4/8/12/16/20/24/32/40/48/64/96`；只动 `transform/opacity/clip-path`；`ease-out-quart cubic-bezier(0.25,1,0.5,1)`；时长 instant 100 / fast 150 / normal 250 / slow 400ms；`prefers-reduced-motion` 必需；禁止嵌套卡片 |
| R4 | **Design Principles Reference**（dinhanhthi/coding-friend） | https://github.com/dinhanhthi/coding-friend/blob/main/plugin-antigravity/skills/cf-design/scripts/design-principles.md | 3–4 级字号、2–3 级字重、modular scale 1.25/1.333、60–75ch 阅读宽度、Grid first、section 间距为组件间距 2–3 倍；"不要混用 8 种灰 / 3 种蓝" |
| R5 | **Material Design · Duration & easing** | https://m1.material.io/motion/duration-easing.html ／ https://material.io/go/design-easing | 移动端 300ms、进入 225ms、退出 195ms、桌面 150–200ms、>400ms 显得慢；standard `cubic-bezier(0.4,0,0.2,1)`、decelerate `cubic-bezier(0,0,0.2,1)`；减速段应长于加速段 |
| R6 | **Easing Functions Cheat Sheet** | https://easings.net | 缓动曲线速查；中文设计指南亦推荐 easings.net + cubic-bezier.com 作为参数来源（https://hellojasminelin.medium.com/the-guide-to-design-chapter-7-form-and-function-b206fa3fee24） |

> 说明：公众号**不能**用 CSS `cubic-bezier()`（无 `<style>`、无 `@keyframes`）。
> R3/R5/R6 的缓动参数通过 SMIL `calcMode="spline"` + `keySplines="0.25 1 0.5 1"`
> 近似表达 ease-out-quart；时长取 500–900ms 是因为公众号是**阅读型内容**而非 UI 反馈，
> 比 R5 的桌面 150–200ms 慢，但仍在"不产生等待感"的区间内。这是一次有意的偏离，记录下来。

## 3.2 三风格对照表

| # | 风格 | **配置**（60-30-10） | **布局** | **动画** |
| --- | --- | --- | --- | --- |
| 01 | Notion 白 · 编辑手记 | `#FBFAF9` / `#E7E5E4` / `#B4462F`；3 级字号；1px 线；4px 网格 | 单栏左对齐，左侧 1px 竖线锚定，大留白，纵向笔记流 | `opacity` 错峰淡入 + 竖线 `height` 生长；**零位移**，最克制 |
| 02 | Linear 暗 · 终端卡片 | `#0E0E12` / `#1A1A20` / `#8B7CFF`；等宽字体栈；窗口 chrome + 刻度列 | 卡片式，`$ command → output` 分块，进度条横贯顶部 | `width` 进度条 + 逐行淡入；`begin="click"` 点击反馈（公众号特有交互） |
| 03 | Stripe 暖 · 杂志分栏 | `#F7F5F1` / `#E4DDD1` / `#635BFF`；衬线标题 + 无衬线正文 | 非对称双栏，左侧大序号 + 参数栏，右侧标题与正文，底部三段色块 | 标题下划线 `width` 展开 + 底部 `animateTransform translate` 错峰滑入 |

三个风格分别把"审美"押在**留白 / 结构 / 节奏**上，便于对照判断，而不是比谁更花哨。

## 3.3 由限制倒推的设计决策

- 因为**不能用渐变/滤镜/阴影**，层次只能靠明度差与 1px 线 → 更接近 Notion/Linear；
- 因为**不能用 `<style>`/`class`**，所有样式是元素属性 → 天然强制"少即是多"；
- 因为**不能用 `id`**，事件只能绑自身 → 第一版只做一个 `begin="click"` 反馈，不做展开长图文；
- 因为**动画可能被过滤**，静态终态必须完整 → 元素不写 `opacity="0"`，
  `from="0"` 只写在 `<animate>` 内；
- 腾讯云那篇实践文章的总结很贴切：「**有时候限制反而让设计变得更干净**」
  （https://cloud.tencent.com/developer/article/2739502）。

---

# 四、验收边界（诚实声明）

参照 `fireworks-tech-graph` 的「a successful command is not a visual quality verdict」：

| 已完成 | 未完成 |
| --- | --- |
| ✅ 真实联网检索，全部结论附 URL | ❌ **未**在真实公众号账号下完成保存草稿 → 重开 → iOS/Android 浅色/深色预览验收 |
| ✅ 3 个风格按公开白名单约束编写 | ❌ **未**声称审美优于任何方案（用户是 SVG 小白，本次只做视觉对照，不做能力评价） |
| ✅ 展示页 `auditSVG()` 客观脚本自检并显式显示失败 | ❌ 微信后台二次清洗结果无法在本地复现 |
| ✅ 代码级验证（详见下方记录） | ❌ **未**完成浏览器内真实渲染截图验证（本环境 Edge 无头模式无法启动，如实记录） |
| ✅ 富文本复制含 `text/html` + `text/plain` 与 execCommand 降级 | ❌ 未做跨设备 SMIL 兼容性实测（`restart` / `fill="freeze"` 的 iOS/安卓差异已知但未经本仓库实测） |

### 验证记录（2026-11-08，均为脚本客观结果）

| 检查 | 结果 |
| --- | --- |
| 三个 SVG 的 XML 合法性（`ElementTree.fromstring`） | 3 / 3 通过 |
| 禁用项扫描（`<style>` / `<script>` / `id` / `class` / `foreignObject` / `<image>` / 渐变 / 滤镜 / `on*` / CSS 动画 / `currentColor` / `href`） | 3 / 3 零命中 |
| 动画 `attributeName` 白名单 | 3 / 3 零违规；实际只用到 `opacity` `height` `width` `transform(translate)` |
| 展示页 JS 语法（`node --check`） | 通过 |
| 页面内 `auditSVG()` 对三份真实源码执行 | **18 / 18 项通过**（三个风格各 18 项，零失败） |
| 静态自洽：移除**全部** SMIL 动画标签后正文仍可见 | 01 = 7/7 行、02 = 10/10 行、03 = 13/13 行 |
| `styles/*.svg` 与 `index.html` 内嵌源码一致性 | 3 / 3 逐字节一致 |

> 浏览器渲染截图未跑通，是因为本环境的 Edge 无头进程启动后无任何输出，不是页面报错。
> 因此页面视觉效果**未经截图复核**，请打开 `index.html` 自行确认。

相关方也明确留了同样的免责：
`wechat-mp-html-source-helper` 作者写明「保留代码不代表微信一定接受」，
且「未完成真实微信公众号账号下的保存、重新打开及 iOS/Android 预览验收」。

因此本 skill 的措辞是：**"按公开白名单约束编写，并提供可复制的粘贴路径"**，
不是"已在公众号上线可用"。真机验收由使用者在发布前完成。

---

# 五、怎么用

1. 打开 `index.html`（双击本地文件或访问发布后的在线链接）。
2. 三个风格卡片，每张都有：SVG 预览、配置/布局/动画参数表、合规自检结果。
3. 点【一键复制到公众号】→ 到公众号后台正文 `Ctrl+V`。
   - 若样式被清洗，改用【复制 SVG 源码】→ 走 HTML 源码模式或第三方编辑器。
4. 保存草稿后**务必真机预览**（见 §2.6）。

安装成 Skill（用户级）：把本目录复制到 `~/.workbuddy/skills/wechat-mp-svg/`
（Windows：`%USERPROFILE%\.workbuddy\skills\wechat-mp-svg\`）。
Claude Code 用户对应 `~/.claude/skills/wechat-mp-svg/`。

---

# 六、第一版明确不做

点击展开长图文、无限选择器、视差滑动、音频、GIF 嵌套、`foreignObject` 嵌套 HTML、
深色模式自动适配、任何突破白名单的技巧。
这些属于「高级交互排版」，需要独立的验证流程与真机回归，不在"先看审美"的范围内。

---

## License

MIT · 调研引用归原作者所有，链接见正文。
