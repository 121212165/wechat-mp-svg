# wechat-mp-svg · 公众号 SVG 排版模板（100 种风格，一键复制到微信）

![v0.3.0](https://img.shields.io/badge/version-v0.3.0-635BFF) ![MIT](https://img.shields.io/badge/license-MIT-2F6B4F) ![100 SVG](https://img.shields.io/badge/templates-100-18181B) ![SMIL whitelist](https://img.shields.io/badge/SMIL-whitelist--checked-57534E)

**一句话**：一个开源的微信公众号 SVG 图文排版模板库 —— 100 个按微信 `SVG AttributeName` 白名单从第一笔编写的风格模板，20 个构图原型、930 个 SMIL 动画标签，不用 JavaScript、不用 `<style>`、不用 `id`；打开 [100 风格展示页](https://121212165.github.io/wechat-mp-svg/)，点「一键复制全文」，到公众号后台 `Ctrl+V` 就是一篇完整图文。纯静态、MIT 许可、可离线使用。

**在线入口**：[图文说明与常见问题（纯静态，无需 JS）](https://121212165.github.io/wechat-mp-svg/guide.html) · [100 风格交互展示页](https://121212165.github.io/wechat-mp-svg/) · [WorkBuddy 在线版](https://wechat-svg-styles.app.workbuddy.host/?sharecode=ABASRVDAE5) · [GitHub 仓库](https://github.com/121212165/wechat-mp-svg)

### 快速开始

1. 打开 [100 风格展示页](https://121212165.github.io/wechat-mp-svg/)，按 20 个构图原型筛选、分页浏览。
2. 单张用卡片上的「一键复制到公众号」；整篇用顶部「一键复制全文」，范围可选全部 100 / 当前筛选 / 当前页 12 张 / 仅收藏。
3. 到公众号后台正文按 `Ctrl+V`。若富文本被清洗，改用「复制全文 HTML 源码」走 HTML 源码模式或第三方编辑器；保存草稿后**务必真机预览**。

> ⚠️ 一次粘贴 100 张 SVG（412.9 KiB / 422,774 字节）极可能超时或被清洗，建议先用「当前页 12 张」试粘再分批。
> 本项目**未**在真实公众号账号完成保存 → 重开 → iOS / Android 浅色深色预览验收，不声称「粘过去一定可用」。

<details>
<summary>项目起因与版本历史</summary>

起因：用户发现 HY 4 的 SVG 能力不错，想做一个公众号 SVG skills；自认 SVG 小白，所以**不评价能力，先看审美** —— 让他做两三个风格。

- **v0.1.0**：3 个风格，模板已归档到 `styles/legacy-v0.1/`。
- **v0.2.0**：按「堆料，堆到不能堆为止」扩到 100 个风格（10 骨架 × 10 参数变体）。
- **v0.3.0（当前）**：独立盲评判定 v0.2.0 视觉可区分度只有 2.20/5，重构为 **20 个构图原型 × 5 变体** —— 改变的是信息架构与画布比例，不再只是换色换参数。

本仓库 = Skill 包 + HTML 展示页（整篇一键复制）+ 编译好的公众号全文 + 带来源的调研报告 + 可复现的生成 / 校验脚本。100 个风格展示的**是同一段原文**（原文照录，仅作断句分行，未改字、未润色）。

</details>

**文案原文**
> 我发现HY 4 svg 能力不错 我想做一个公众号是svg skills 我是一个svg 小白 所以不去评价能力如何先看看审美如何 我让他做了两三个风格

---

## 目录

```
wechat-svg-skills/
├── README.md                          ← 调研报告 + 使用说明
├── SKILL.md                           ← Skill 定义（可安装到 ~/.workbuddy/skills）
├── index.html                         ← 展示页：100 风格 / 筛选 / 分页 / 整篇一键复制 / 合规自检
├── guide.html                         ← 纯静态 SEO 着陆页：白名单速查 / FAQ / 已知限制（无需 JS）
├── wechat-article.html                ← 编译好的公众号全文（100 张 SVG，无 JS，可离线打开）
├── robots.txt / sitemap.xml / llms.txt ← 站点与 AI 可读入口
├── favicon.svg / og-image.png / social-preview.png ← 图标与社交分享卡
├── SEO.md / PROMOTION.md              ← SEO 报告与关键词策略 / 多平台推广文案包
├── preview.png                        ← 展示页首屏截图（1280×2600）
├── contact-v020.png / contact-v030.png ← 新旧 20 张抽样联系表（视觉对照证据）
├── AUDIT.md / AUDIT-PROMPT.md / AUDIT-REPORT.md ← 独立审核计划 / 启动指令 / 审核报告
├── styles/
│   ├── 001.svg … 100.svg              ← 100 个独立 SVG
│   ├── catalog.json                   ← 100 条元数据（色板 / 参数 / 动效 / 校验契约）
│   └── legacy-v0.1/                   ← 初版 3 张，留作对照
├── tools/
│   ├── families.mjs                   ← 前 10 个设计流派的布局骨架
│   ├── families-extra.mjs             ← v0.3.0 新增的 10 个构图原型
│   ├── generate-styles.mjs            ← 生成 100 张 SVG + 注入展示页 + 全量白名单校验
│   ├── build-article.mjs              ← 从展示页纯函数导出 wechat-article.html
│   ├── verify-page.mjs                ← 模拟 DOM 执行页面脚本的逻辑验证
│   ├── contact-sheet.mjs              ← 生成新 / 旧视觉对照联系表
│   ├── make-cards.mjs                 ← 生成 OG / Social Preview 两张分享卡
│   └── verify-seo.mjs                 ← 校验 meta / JSON-LD / sitemap / 图片 / 内链
└── references/
    └── wechat-svg-constraints.md      ← 公众号 SVG 硬约束 + 全部来源 URL
```

---

# 零、v0.3.0：100 个风格是怎么堆出来的

> 下面这张参数表是 **v0.2.0 的历史编号**（001–010 瑞士网格、011–020 杂志分栏……）。
> v0.3.0 已重排为 **20 个构图原型 × 5 变体**（001–005 瑞士网格、006–010 杂志分栏……），
> 当前编号与画布高度请以 [§3.2 的 20 原型矩阵](#32-20-构图原型--100-风格对照表) 为准。

**v0.3.0 的关键改变**：独立盲评指出 v0.2.0 的「10 骨架 × 10 参数变体」在人眼里只有约 9 类。
现在改为 **20 个构图原型 × 5 变体**：前 10 个是原有流派，后 10 个（`tools/families-extra.mjs`）
是全新的信息架构（竖排卷轴 / 居中诗页 / 分屏对照 / 卡片阶梯 / 字阶 / 清单表格 / 对角 / 满幅海报 / 便签 / 横幅飘带），
画布高度横跨 **320–760（13 种）**；同时删掉画面上印着的 150 处「配置 / 布局 / 动画」说明文字。

| # | 流派 | 布局骨架（真实差异） | 装饰语言 | 装饰动效主轴 |
| --- | --- | --- | --- | --- |
| 001–010 | 瑞士网格 Swiss | 2/3/4/5/6/7/8/9/10/12 栏网格，栏数逐变体不同 | 超大序号、细分隔线、顶部色条 | width 生长 / height 生长 |
| 011–020 | 杂志分栏 Editorial | 左栏宽度 176–264px 逐变体不同 | 衬线大标题、三段色块、大序号 | 下划线展开 / translate |
| 021–030 | 终端卡片 Terminal | 深色窗口，内边距/圆角/刻度密度逐变体不同 | 命令行、进度条、窗口 chrome | width 进度 / pulse |
| 031–040 | 工程蓝图 Blueprint | 网格间距 20/22/24/26/28/30/32/36/40px 逐变体不同 | 描边线框、十字定位、尺寸标注 | stroke-dashoffset 描边 |
| 041–050 | 包豪斯 Bauhaus | 圆半径/位置、三角高度、底部色块宽度逐变体不同 | 原色几何、半圆、三角 | rotate 360° 回位 |
| 051–060 | 孔版叠印 Risograph | 错位量 6–18px、网点半径/间距逐变体不同 | 双专色叠印、网点 | opacity 叠印 |
| 061–070 | 孟菲斯 Memphis | 波点间距、斜线数量、边框粗细逐变体不同 | 波点、斜线、锯齿、撞色 | 描边 / rotate |
| 071–080 | 报纸铅字 Newspaper | 2/3/4 栏竖线、报头字号逐变体不同 | 报头双线、铅字衬线、刊号 | height 生长 |
| 081–090 | 粗野主义 Brutalist | 边框 4–10px、硬阴影 8–16px 逐变体不同 | 粗黑框、荧光色块、超大字 | x 位移 / width 生长 |
| 091–100 | 极简笔记 Notion | 留白间距、行距、竖线高度逐变体不同 | 1px 竖线、清单色块 | opacity 淡入 |

**五个独立维度，全部由生成器程序化组合**：

| 维度 | 取值 |
| --- | --- |
| 色板 | 10 套浅色板 + 10 套深色底；`base=(v*3+fi*7)%10`、`accent=(v+fi*2)%10` 双重错位 → **100 套互不重复** |
| 字体栈 | 无衬线 / 衬线 / 等宽 / 系统栈，按 `(v+fi)%4` 轮换 → 25 / 26 / 25 / 24 |
| 布局 | 上表逐变体的栏数、间距、字号、圆角、错位量、装饰密度 |
| 正文动效编排 | `fade` 59 / `slide` 35 / `sweep` 6 |
| 装饰动效 | `grow` 37 / `fade` 28 / `rise` 14 / `rotate` 7 / `slide` 6 / `draw` 5 / `pulse` 3 |

**生成器实测输出**（`node tools/generate-styles.mjs`）：

```
生成 100 个风格 · 20 个构图原型 · 每原型 5 变体
结构唯一 SVG: 100/100 · 唯一色板: 100/100 · 删除设计说明文字 150 处
总字节 317.9 KiB (UTF-8) · 动画标签 930
100/100 全部通过白名单 + 静态自洽 + 原文完整校验
```

### 整篇一键复制（「整个 html 都要发公众号」）

不能直接复制 `index.html` 源码：它含 JS、按钮、交互控件，粘进公众号会被清洗成空白。
展示页会把整页内容**编译**成一份公众号安全版 HTML：全部内联样式、无 class / id / 外链、100 张 SVG 原样嵌入。
主按钮用 `ClipboardItem` 同时写 `text/html` + `text/plain`，到编辑器 `Ctrl+V` 即成一篇完整图文。

- 复制范围可选：**全部 100 个 / 当前筛选 / 当前页 12 个 / 仅收藏**（默认全部）。
- 另有【复制全文 HTML 源码】【下载全文 .html】，供 `wechat-mp-html-source-helper` 或秀米 / 135 的 HTML 源码组件使用。
- `wechat-article.html` 是同一套纯函数导出的落盘成品（412.9 KiB / 422,774 B / 100 张 SVG / 930 个动画），无 JS，可离线打开。
- 展示页默认只把**前 6 张**塞进预览 DOM，避免 100 张 SMIL 动画同时播放；当前页也只渲染 12 张卡片。

> **必须说清的体积风险**：完整范围 **412.9 KiB（422,774 B，UTF-8 字节）/ 100 张 SVG**。微信编辑器对单篇长度与 SVG 数量有限制，
> 一次粘贴 100 张极可能超时、截断或被清洗。页面在范围 > 12 张或 > 150 KiB 时会显式红字警告（体积已改用 UTF-8 字节数；v0.2.0 误用 JS 字符数，中文内容低估约 13 KiB），
> 建议先选「当前页 12 个」试粘验证通路，再分批发送。本仓库**未**在真实公众号账号下完成 100 张的粘贴验收。

### 客观验证（可复现，非肉眼自评）

| 命令 | 检查内容 | 结果 |
| --- | --- | --- |
| `node tools/generate-styles.mjs` | 100 张 SVG：禁用项、animate 白名单、静态自洽、6 行原文、结构唯一性 | **100/100 通过** |
| `node tools/build-article.mjs` | 导出全文 + 20 项校验（含 100 张逐张白名单自检 **1800 项**） | **20/20 通过** |
| `node tools/verify-page.mjs` | 模拟 DOM 执行页面脚本，29 项：分页 / 筛选 / 收藏 / 范围 / 自检 / 联动 | **29/29 通过（0.4s）** |

`tools/build-article.mjs` 从 `index.html` 的 `ARTICLE_BEGIN..ARTICLE_END` 纯函数区间提取代码，
保证「按钮复制的内容」与「仓库里的 `wechat-article.html`」同源、零漂移。

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
| 7 | **claudskills · delivery-svg-markdown** | https://claudskills.com/skills/delivery-svg-markdown | 纯静态 SVG 面板，可嵌入 Markdown；**无 JS、无外部 CSS、无构建步骤、inline styles** | 与公众号约束高度同构：强约束环境里"自包含 + 内联样式"才有存活率 |

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
- **退出码**：`0` pass / `1` warnings / `2` errors。（独立审核复核：该仓库 workflows / tests 均为空，早期「配套 pytest + CI」的转述无依据，已删除）

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
- **最值得抄的态度**（语义转述，**非原文直引**）：该仓库 README 用
  `Evaluate, don't assert` 与 `visual_review: skipped` 表达「命令跑通不等于视觉合格」；
  早期转述把它加引号当作原文，独立审核已纠正。
  以及：「若无法查看渲染图，必须**显式标记视觉检查已跳过**，且不得声称视觉正确。」
- **流程**：`validate` → `render` → `check` → `export-png`；
  `check` 校验 SVG 身份、marker 引用、通用碰撞、语义几何与构图；
  失败后用元素 ID 和几何做定点修复，两次无改善就换思路。

**对本 skill 的取舍**：风格矩阵 → 本仓库 100 个 `styles/*.svg`；
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

微信编辑器 sanitize HTML；公开资料普遍把 SVG 描述为「**整体放行**」的命名空间（措辞见 §2.2.1 的冲突说明）。
原因是 SVG 的 SMIL 声明式动画属于 W3C 规范、不需要 JS、不发起网络请求、不读写 DOM，
安全风险可控。yeyulingfeng §3.4 原文写的是「**可能**」只对 HTML 命名空间深度解析，属推测而非微信官方机制说明。
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

### 2.2.1 来源之间的冲突（此前未披露，现补）

独立审核（2026-11-08）逐条复访后发现，本仓库引用的公开资料**互相矛盾**，此前只取了保守侧而未说明：

| 议题 | 一方说法 | 另一方说法 | 本项目取舍 |
| --- | --- | --- | --- |
| `<foreignObject>` / 渐变 / `clip-path` | W3（yeyulingfeng）称实测可用并建议使用 | W1 / W2 将其列为常规手段；本仓库 `SKILL.md §2.1` 列为绝对禁止 | 取**保守侧**（不用），不会导致实际失效 |
| `restart="never"` | W3 称 iOS 无效 | W4 草稿箱实测称可用 | 当前 100 张里该属性计数为 **0**，属空风险项 |
| `<image>` base64 | W3 称不显示 | W7 称可用 | 不使用 `<image>` |
| 「整体放行」 vs 「白名单过滤」 | W3 §3.1 描述为整体放行 | W1 描述为非白名单标签会被后台修改 | §2.1 与 §2.2 并列陈述，未解释两者关系 |

**更重要的元约束限制**：以上来源**没有一份是微信官方文档**。W1 是 2022 年个人博客对 2021 版清单的转述，
W2 是行业案例库（2025），清单距今 5 年，无 2026 年官方复核。因此「白名单在 2026 年仍有效」的置信度只能标 `[中]`。
另外 W8（tsight）自述为「技术溯源与**逻辑推演**」，非实测，不能当事实引用。

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
https://tsight.io/articles/11245390（风控边界；该文自述为逻辑推演，非实测，证据等级低）

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
100 个风格因此**共用同一段文案**，差异落在配置 / 布局 / 动画三个维度上。

## 3.1 引用资源

| # | 资源 | URL | 用在哪 |
| --- | --- | --- | --- |
| R1 | **60-30-10 Rule**（UX Quest） | https://www.uxqst.com/ux-laws/60-30-10-rule | 三套配色比例：60% 中性主导 / 30% 结构次要 / 10% 单一强调；强调色需过 4.5:1 对比度；"眯眼测试"找主行动点。文中直接以 Stripe、Linear 为例 |
| R2 | **配色公式与 HSL / Refactoring UI** | https://rar.design/posts/color-palette-formulas | Notion 红、Stripe 紫、Spotify 绿都守在 10% 以下（"注意力工程"）；主导色再切「真背景 / 容器背景」差 5–10% 明度堆层次；用 HSL 而非 HEX 思考调色 |
| R3 | **Visual Design Standards**（catlog22/Claude-Code-Workflow） | https://github.com/catlog22/Claude-Code-Workflow/blob/main/.claude/skills/team-ux-improve/specs/design-standards.md | 4pt 间距刻度 `0/4/8/12/16/20/24/32/40/48/64/96`；动效属性原文列 7 项（另含 background-color / color / box-shadow / filter），且明确 **NEVER animate: width, height**；`ease-out-quart cubic-bezier(0.25,1,0.5,1)`；时长 instant 100 / fast 150 / normal 250 / slow 400ms；`prefers-reduced-motion` 必需；禁止嵌套卡片 |
| R4 | **Design Principles Reference**（dinhanhthi/coding-friend） | https://github.com/dinhanhthi/coding-friend/blob/main/plugin-antigravity/skills/cf-design/scripts/design-principles.md | 3–4 级字号、2–3 级字重、modular scale 1.25/1.333、60–75ch 阅读宽度、Grid first、section 间距为组件间距 2–3 倍；"不要混用 8 种灰 / 3 种蓝" |
| R5 | **Material Design · Duration & easing** | https://m1.material.io/motion/duration-easing.html ／ https://material.io/go/design-easing | 移动端 300ms、进入 225ms、退出 195ms、桌面 150–200ms、>400ms 显得慢；standard `cubic-bezier(0.4,0,0.2,1)`、decelerate `cubic-bezier(0,0,0.2,1)`；减速段应长于加速段；⚠ 该页已标注「Material 1 is no longer maintained」，此处仅作历史时长依据 |
| R6 | **Easing Functions Cheat Sheet** | https://easings.net | 缓动曲线速查；中文设计指南亦推荐 easings.net + cubic-bezier.com 作为参数来源（https://hellojasminelin.medium.com/the-guide-to-design-chapter-7-form-and-function-b206fa3fee24） |

> 说明：公众号**不能**用 CSS `cubic-bezier()`（无 `<style>`、无 `@keyframes`）。
> R3/R5/R6 的缓动参数通过 SMIL `calcMode="spline"` + `keySplines="0.25 1 0.5 1"`
> 近似表达 ease-out-quart；时长取 500–900ms 是因为公众号是**阅读型内容**而非 UI 反馈，
> 比 R5 的桌面 150–200ms 慢，但仍在"不产生等待感"的区间内。这是一次有意的偏离，记录下来。
>
> **必须补记的根本冲突**：R3 原文明确 `NEVER animate: width, height…`，R4 §7 也把 animating width/height
> 列为反模式；而本项目 930 个 SMIL 动画里有 `width` 92、`height` 22、`x` 54（其余为 opacity 495 / transform 252 / stroke-dashoffset 15）。
> 原因是微信白名单**只允许**这些几何属性（不能用 CSS transform / opacity 之外的合成层方案），
> 属于平台约束下的有意取舍，但此前把 R3/R4 列为设计依据时未披露这一冲突。

## 3.2 20 构图原型 × 100 风格对照表

| 编号 | 构图原型 | 配置 / 字体 | 布局骨架 | 画布高 | 装饰动效 |
| --- | --- | --- | --- | --- | --- |
| 001–005 | 瑞士网格 | 10 套浅色板 + 超大序号 | 2–12 栏刚性网格 | 460 | width / height 生长 |
| 006–010 | 杂志分栏 | 衬线标题 + 无衬线正文 | 非对称双栏，左栏 176→264px | 480 | 下划线展开 + translate |
| 011–015 | 终端卡片 | 深色底 + 等宽字体 | 窗口 chrome + 命令行 + 进度条 | 500 | width 进度 + pulse |
| 016–020 | 工程蓝图 | 深色网格 + 描边线框 | 20→40px 网格 + 尺寸标注 | 480 | stroke-dashoffset 描边 |
| 021–025 | 包豪斯 | 原色几何 | 圆半径、三角高、色块宽 | 460 | rotate 360 回位 |
| 026–030 | 孔版叠印 | 双专色 | 错位 6→18px、网点密度 | 470 | 叠印淡入 |
| 031–035 | 孟菲斯 | 撞色 + 荧光 | 波点间距、斜线数、边框粗 | 480 | 描边 + rotate |
| 036–040 | 报纸铅字 | 报头 + 双细线 | 2/3/4 栏、报头字号 | 500 | height 生长 |
| 041–045 | 粗野主义 | 粗框 + 荧光强调 | 边框 4→10px、硬阴影 8→16px | 440 | x 位移 + width |
| 046–050 | 极简笔记 | 大留白 + 1px 竖线 | 留白、行距、竖线高 | 440 | opacity 淡入 |
| 051–055 | 竖排卷轴 | 六条横向色带 | 纵向堆叠 + x 阶梯错位 | 760 | 色带逐条展开 |
| 056–060 | 居中诗页 | 方版 + 圆环 | 全居中、大留白 | 680 | 圆环淡入 |
| 061–065 | 分屏对照 | 左右反白双底 | 前三行 / 后三行分置 | 460 | 竖线 height 生长 |
| 066–070 | 卡片阶梯 | 六张 1px 边框卡片 | 逐行 x/y 递进错位 | 620 | 卡片逐张展开 |
| 071–075 | 字阶 | 字号 14→34 递增 | x 同步阶梯缩进 | 560 | 底部色条生长 |
| 076–080 | 清单表格 | 序号列 + 每行底线 | 六行等距表格 | 540 | 底线逐行淡入 |
| 081–085 | 对角构图 | 斜切大色块 | 六行沿对角线排布 | 600 | 色块淡入 |
| 086–090 | 满幅海报 | 2/3 满幅强调色 + 反白巨字 | 上部巨字 / 下部紧凑六行 | 700 | 色块 height 生长 |
| 091–095 | 便签 | 三张旋转便签 + 胶带 | 每张两行，错落摆放 | 540 | 便签逐张淡入 |
| 096–100 | 横幅飘带 | 极宽横幅 + 飘带 | 两列 × 三行 | 320 | 顶条 width 生长 |

> **独立审核结论（v0.2.0 基线，2026-11-08）**：`AUDIT-REPORT.md` 的两名独立盲评者给出视觉可区分度
> **2.20 ± 1.04 / 5**（阈值 3.0），10 个流派平均分全部 < 4，判定「同骨架换色」假设**未被拒绝**。
> 该结论置信度 `[低]`（评分者为模型、抽样偏袒同骨架配对、客观脚本给出方向相反的证据），需人评复核。
>
> **v0.3.0 已据此重构**（20 原型 / 13 种画布高度 / 删掉 150 处画面上的设计说明文字），
> 视觉对照证据见 `contact-v020.png`（旧）与 `contact-v030.png`（新），
> 由 `node tools/contact-sheet.mjs` 生成 HTML 后经 Edge 无头栅格化。
> **但尚未重做独立盲评，因此不声称可区分度已达标** —— 这一步需要人眼或新一轮独立评分。

## 3.3 由限制倒推的设计决策

- 因为**不能用渐变/滤镜/阴影**，层次只能靠明度差与 1px 线 → 更接近 Notion/Linear；
- 因为**不能用 `<style>`/`class`**，所有样式是元素属性 → 天然强制"少即是多"；
- 因为**不能用 `id`**，事件只能绑自身 → v0.1 曾做 `begin="click"` 反馈；独立审核实测 v0.2.0 的 100 张里该属性计数为 **0**，不做展开长图文；
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
| ✅ 100 个风格按公开白名单约束编写，100/100 结构唯一（**代码级**指标，非视觉多样性证据） | ❌ **未**声称审美优于任何方案（用户是 SVG 小白，本次只做视觉对照，不做能力评价） |
| ✅ Edge 无头真实浏览器渲染截图（`preview.png` + 两张联系表） | ❌ 微信后台二次清洗结果无法在本地复现 |
| ✅ 四个独立脚本的客观验证（见下方记录） | ❌ **未**在真实公众号里粘贴过 100 张（412.9 KiB / 422,774 B），体积风险仅按公开限制推断 |
| ✅ 富文本复制含 `text/html` + `text/plain` 与 execCommand 降级 | ❌ 未做跨设备 SMIL 兼容性实测；实测 `fill="freeze"` 930 处、`begin="click"` 与 `restart` 均为 **0** |

### 验证记录（2026-11-08，均为脚本客观结果）

| 检查 | 结果 |
| --- | --- |
| `node tools/generate-styles.mjs`：100 张 SVG 的禁用项 / animate 白名单 / 静态自洽 / 6 行原文 / 结构唯一性 | **100 / 100 通过**；100 张结构互不重复、100 套色板互不重复 |
| `node tools/build-article.mjs`：导出全文 + 20 项校验 | **20 / 20 通过**；含 100 张逐张白名单自检 **1800 项**、移除全部 SMIL 后 100 张文字全部保留 |
| `node tools/verify-page.mjs`：模拟 DOM 执行页面脚本 | **29 / 29 通过（0.4s）**；覆盖分页、筛选、收藏、复制范围、强调色、静止终态、内容开关 |
| 展示页 JS 语法（`node --check`） | 通过 |
| Edge 无头真实渲染截图 | **通过** → `preview.png`（1280×2600）|
| 新旧视觉联系表 | **通过** → `contact-v020.png` / `contact-v030.png`（1400×2600，各 20 张，取相同编号 001/006/…/096）；v0.3.0 可见 13 种画布高度与多种信息架构，无空白卡片 |

> 上一版记录的「Edge 无头无法启动」在 v0.2.0 复核时解决：截图是**异步写出**的，
> 命令返回时文件尚未落盘，被误判为失败；实际生成了有效 1280×2600 PNG。
> 但这只是 Chromium 桌面渲染，**不等于**微信编辑器渲染，也不等于 iOS/Android 真机验收。

相关方也明确留了同样的免责：
`wechat-mp-html-source-helper` 作者写明「保留代码不代表微信一定接受」，
且「未完成真实微信公众号账号下的保存、重新打开及 iOS/Android 预览验收」。

因此本 skill 的措辞是：**"按公开白名单约束编写，并提供可复制的粘贴路径"**，
不是"已在公众号上线可用"。真机验收由使用者在发布前完成。

---

# 五、怎么用

1. 打开 `index.html`（推荐访问发布后的 **https** 在线链接；`file://` 下 `ClipboardItem` 富文本复制能力不完整）。
2. 用流派筛选 + 分页浏览 100 个风格；每张卡片有 SVG 预览、配置/布局/动画参数表、合规自检结果、单张复制与收藏。
3. 顶部【一键复制全文】→ 在下拉里选复制范围 → 到公众号后台正文 `Ctrl+V`。
   - 只要一张：用卡片里的【复制本张到公众号】。
   - 富文本被清洗：改用【复制全文 HTML 源码】走源码模式，或【下载全文 .html】导入第三方编辑器。
   - 想直接看成品：打开 `wechat-article.html`（100 张、无 JS）。
4. 保存草稿后**务必真机预览**（见 §2.6）。100 张一次性粘贴的风险见「零、v0.3.0」章节。
5. 看审美对照：打开 `contact-v020.png`（v0.2.0 基线）与 `contact-v030.png`（v0.3.0 重构），
   或用 `node tools/contact-sheet.mjs` 重新生成 `contact-sheet-*.html`。

配置演示：顶部可切换强调色（原色 / 森绿 / 靛蓝）、切「静止终态」（剥掉全部 SMIL 动画验证静态自洽）、全部重播、展开自检明细。切换会同步影响整篇复制内容。

复现 / 二次开发：

```bash
node tools/generate-styles.mjs   # 重生成 100 张 SVG + 注入展示页 + 全量校验
node tools/build-article.mjs     # 重新导出 wechat-article.html + 20 项校验
node tools/verify-page.mjs       # 29 项页面逻辑验证
```

安装成 Skill（用户级）：把本目录复制到 `~/.workbuddy/skills/wechat-mp-svg/`
（Windows：`%USERPROFILE%\.workbuddy\skills\wechat-mp-svg\`）。
Claude Code 用户对应 `~/.claude/skills/wechat-mp-svg/`。

---

# 六、明确不做

点击展开长图文、无限选择器、视差滑动、音频、GIF 嵌套、`foreignObject` 嵌套 HTML、
深色模式自动适配、任何突破白名单的技巧。
这些属于「高级交互排版」，需要独立的验证流程与真机回归，不在"先看审美"的范围内。

---

## License

MIT · 调研引用归原作者所有，链接见正文。
