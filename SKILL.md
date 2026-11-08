---
name: wechat-mp-svg
description: >-
  生成可直接复制粘贴进微信公众号编辑器的 SVG 图文卡片（静态排版 / 轻量动效 / 点击交互）。
  内置 100 个风格（20 构图原型 × 5 变体），支持「整篇一键复制」把整页内容编译成公众号安全版 HTML。
  当用户提到「公众号 SVG」「微信排版 SVG」「推文卡片」「一键复制到公众号」「整个 html 发公众号」
  或要求把一段文案做成公众号可粘贴的视觉卡片时使用。
  也适用于排查「粘贴后动画失效 / 样式丢失 / 文字错位」。
version: 0.2.0
---

# 公众号 SVG Skill · v0.3.0（100 风格）

> v0.1（历史）：只做简单的 SVG 内容，3 个风格；模板已归档到 `styles/legacy-v0.1/`，当前版本请勿引用。
> v0.2：按「堆料」扩到 100 个风格，并支持**整篇一键复制**——把整页内容编译成公众号安全版 HTML。
> v0.3：独立盲评判定 v0.2 视觉可区分度仅 2.20/5，重构为 **20 个构图原型 × 5 变体**，
> 新增 10 套信息架构、13 种画布高度，并移除画面上的设计说明文字。
> 两版共同的底线：从第一笔就按微信白名单画，不追求突破限制的高级交互。

---

## 0. 心法

微信公众号的 SVG 不是网页 SVG，是**强约束环境下的 SVG**。
它的审美恰恰来自限制：没有渐变、没有阴影滤镜、没有 JS、没有 `@keyframes`、没有 `id`。
能用的只有纯色几何、系统字体和 SMIL 声明式动画。
所以不要先画得花再想办法降级——**从第一笔就按白名单画**。

一条来自实践的总结：「有时候限制反而让设计变得更干净。」
（腾讯云开发者社区《公众号也能做交互？我用 SVG 给阿嬷的情书写了三封信》）

---

## 1. 触发与路由

| 用户说了什么 | 做什么 |
| --- | --- |
| 做一张公众号卡片 / 把这段话做成 SVG | 走 §3 工作流，从 100 风格矩阵里选 2–3 个对照 |
| 堆料 / 风格越多越好 / 来 100 种 | 用 `tools/generate-styles.mjs` 生成矩阵，不要手写换色 ×100 |
| 整个 html 都要发公众号 / 整篇一键复制 | 走 §3.5：编译成公众号安全版全文 fragment，写 `text/html` 富文本 |
| 只要某个风格 / 再来一版 | 从 `styles/NNN.svg` 取对应模板改文案 |
| 粘贴后样式丢了 / 动画不动 / 文字错位 | 直接跳到 §5 合规自检 + `references/wechat-svg-constraints.md` |
| 要复杂交互（点击展开长图文、无限选择器） | 不做，明确告知超出范围并给出参考方向 |

不要为了"展示能力"而加交互。评估维度始终是**审美**：配置、布局、动画。

## 1.1 风格矩阵（v0.3.0 · 100 种）

20 个构图原型 × 5 变体。前 10 个是 v0.2 的设计流派，后 10 个（`tools/families-extra.mjs`）是**全新的信息架构**：
竖排卷轴 / 居中诗页 / 分屏对照 / 卡片阶梯 / 字阶 / 清单表格 / 对角构图 / 满幅海报 / 便签 / 横幅飘带。
各维度组合方式：

| 维度 | 组合方式 |
| --- | --- |
| 构图原型 | 20 套独立骨架，见 §4 矩阵；后 10 套改变的是信息架构而非栏数参数 |
| 色板 | 10 套浅色板 + 10 套深色底，`base=n%10`、`accent=floor((n-1)/10)%10` → 100 套互不重复 |
| 字体栈 | 无衬线 / 衬线 / 等宽 / 系统栈，按 `(n+fi)%4` 轮换 |
| 画布比例 | 13 种高度，320（横幅飘带）— 760（竖排卷轴） |
| 布局参数 | 每个骨架内部按 `v` 改栏数、间距、字号、圆角、错位量、装饰密度 |
| 动效编排 | 正文 `fade/slide/sweep` + 装饰 `grow/rise/draw/rotate/pulse/slide`，每流派独立编排池 |

产物：`styles/001.svg … 100.svg` + `styles/catalog.json`（含每条的色板、参数、动效、校验契约）。
生成器与校验：

```bash
node tools/generate-styles.mjs   # 生成 + 注入展示页 + 100/100 白名单/静态自洽/原文校验
node tools/build-article.mjs     # 导出 wechat-article.html + 20 项校验（1800 项逐张自检）
node tools/verify-page.mjs       # 29 项页面逻辑验证
```

**硬性体积认知**（UTF-8 字节口径）：100 张 SVG 约 318 KiB，编译成全文 **412.9 KiB / 422,774 B**。微信编辑器对单篇长度与 SVG 数量有限制，
一次粘贴 100 张极可能超时、截断或被清洗。默认提供范围选择（全部 / 当前筛选 / 当前页 12 / 仅收藏），
并在 > 12 张或 > 150 KiB 时显式警告，建议分批。**不要声称「100 张已上线可用」**。

## 1.2 整篇一键复制（§3.5 摘要）

复制的是**编译后的文章内容**，不是展示页源码（含 JS/按钮，粘进去会被清洗）。
全文 fragment 契约：全部内联样式、只用 `section/p/br`、无 `class/id/script/style/外链 <a>`、
N 张 SVG 原样嵌入且 `style="display:block;width:100%;height:auto;"`。
剪贴板用 `ClipboardItem` 同时写 `text/html`（图文）与 `text/plain`（降级文案），
`file://` 下降级到 `execCommand` + contentEditable 选区复制。

---

## 2. 硬约束（违反任何一条，粘贴后大概率废）

### 2.1 绝对禁止

- `<script>`、任何 `on*` 内联事件、`javascript:` / `data:` 协议
- `<style>` 标签、`@keyframes`、`animation`、`transition`、`@media`、`@font-face`
- `id` 属性（**所有元素，包括 SVG 内，都会被删除**）
- `class`（保留但不生效，因为没有 `<style>` 承载）
- `position: absolute / fixed / relative`、`float`、`z-index`（无 flex 父级时失效）
- `foreignObject`、`<image>` 外链 / base64、`<use>`、`<mpath>`
- `clipPath`、`filter`、`linearGradient` / `radialGradient`、`<pattern>`
  （白名单文档明确要求「不含剪切路径、滤镜、渐变、网格等矢量特征」）
- 任何试图突破白名单的技巧 —— 会被视为**对抗开发**，有封禁风险

### 2.2 允许

- `<svg>` 及其常规子元素（`rect` / `circle` / `line` / `path` / `text` / `tspan` / `g` / `polyline` / `polygon`）
- 样式写成**元素属性**或 `style=""` 内联；只用确认可用的 CSS：
  `color, background-color, font-size, font-weight, font-style, font-family(系统字体栈),
  margin, padding(px), border, border-radius, text-align, line-height, letter-spacing,
  text-decoration, opacity, display, box-shadow, overflow, pointer-events`
- `<text>` 用系统字体栈，不要 webfont：
  `font-family="PingFang SC, Hiragino Sans GB, Microsoft YaHei, sans-serif"`
- 中文字换行**手写多行 `<text>`**（每行一个元素），不要依赖自动换行

### 2.3 SMIL 动画 · AttributeName 白名单

只有下表中的 `attributeName` 在微信保存后仍然有效：

| 元素 | 允许的 attributeName |
| --- | --- |
| `<animate>` | `x` `y` `width` `height` `r` `opacity` `d` `points` `fill` `stroke` `stroke-width` `stroke-linecap` `stroke-dashoffset` |
| `<set>` | `visibility` |
| `<animateTransform>` | `translate` `scale` `rotate` `skewX` `skewY` |
| `<animateMotion>` | `path` |

配套属性可用：`from` `to` `values` `fill` `additive` `accumulate` `calcMode`
`begin` `end` `rotate` `repeatCount` `keyTimes` `keySplines` `restart` `dur`。

约束细节：
- `begin="click"` / `begin="touchstart"` 可用（**事件目标写被动画元素自身，不要用 `id.event`，因为 id 会被删**）
- `fill="freeze"` 保留终态
- `restart="never"` 在 **iOS 无效**，别依赖它做"只播一次"的逻辑
- `height` / `width` 动画**不要用 `repeatCount="indefinite"`**，用具体数值（如 `3`）
- `transform` 写成属性形式 `<g transform="...">`；`<g style="transform-origin:...">` 在 iOS 失效

### 2.4 鲁棒性原则（最重要的一条）

> **静态画面必须自洽。动画只是加分项，不能是显示的前提。**

- ❌ 不要写 `<text opacity="0">` + 动画淡入。一旦 `<animate>` 被过滤，文字永久不可见。
- ✅ 元素**保持默认可见**；把 `from="0"` / `values="0;1"` 只写在 `<animate>` 里。
  动画在 → 有淡入；动画被删 → 直接显示完整终态。
- 同理，`height` 生长的线条，元素本身写完整 `height`，动画里写 `values="0;完整值"`。

### 2.5 保存层的额外风险

微信可能在保存时把整段 SVG **包成 `<embed>` 并上传到图床**，
导致 `currentColor` 继承断裂、深色模式下颜色不跟随。
对策：所有颜色写成**显式 hex 硬编码**，不要用 `currentColor` / CSS 变量继承。

---

## 3. 工作流

1. **读文案**：原文照录，只做断句分行，不改字、不润色、不纠错。
2. **选风格**：从 §4 的 20 个构图原型里取 2–3 个**不同原型**，优先跨原型而非同原型换变体。
3. **画 SVG**：单文件、无外部依赖、`viewBox` + `width="100%"`、显式 hex 颜色、
   系统字体栈、手写多行文本。宽度基准 `680`，高度按内容定。
4. **跑合规自检**：见 §5。不通过就改，不要先交付再解释。
5. **出展示页**：`index.html` 内嵌 N 份 SVG 源码（保证双击本地文件即可用，
   不依赖 fetch），每个风格配：
   - SVG 预览
   - 「配置 / 布局 / 动画」参数表
   - 【一键复制到公众号】富文本按钮
   - 【复制 SVG 源码】纯文本按钮
   - 【重播动画】按钮
6. **说清粘贴路径**：见 §6。不要承诺"100% 可用"。

---

## 4. 风格矩阵（v0.3.0 · 20 构图原型 / 100 种）

100 个模板共用同一段文案。**按原型挑差异最大的几张对照，不要在同一原型内挑 2–3 张**。

| 编号 | 构图原型 | 配置 | 布局骨架 | 画布高 |
| --- | --- | --- | --- | --- |
| 001–005 | 瑞士网格 | 浅色板 + 超大序号 | 2–12 栏刚性网格 | 460 |
| 006–010 | 杂志分栏 | 衬线标题 + 无衬线正文 | 非对称双栏 | 480 |
| 011–015 | 终端卡片 | 深色底 + 等宽字体 | 窗口 chrome + 进度条 | 500 |
| 016–020 | 工程蓝图 | 深色网格 + 描边 | 网格 + 尺寸标注 | 480 |
| 021–025 | 包豪斯 | 原色几何 | 圆 / 三角 / 色块 | 460 |
| 026–030 | 孔版叠印 | 双专色 | 错位 + 网点 | 470 |
| 031–035 | 孟菲斯 | 撞色 + 荧光 | 波点 / 斜线 / 锯齿 | 480 |
| 036–040 | 报纸铅字 | 报头 + 双细线 | 多栏铅字 | 500 |
| 041–045 | 粗野主义 | 粗框 + 荧光强调 | 硬阴影 + 粗边框 | 440 |
| 046–050 | 极简笔记 | 大留白 + 1px 竖线 | 单栏笔记流 | 440 |
| 051–055 | 竖排卷轴 | 六条横向色带 | 纵向堆叠 + x 阶梯 | 760 |
| 056–060 | 居中诗页 | 方版 + 圆环 | 全居中大留白 | 680 |
| 061–065 | 分屏对照 | 左右反白双底 | 三行 / 三行分置 | 460 |
| 066–070 | 卡片阶梯 | 六张 1px 边框卡片 | 逐行错位递进 | 620 |
| 071–075 | 字阶 | 字号 14→34 | x 同步阶梯缩进 | 560 |
| 076–080 | 清单表格 | 序号列 + 底线 | 六行等距表格 | 540 |
| 081–085 | 对角构图 | 斜切大色块 | 沿对角线排字 | 600 |
| 086–090 | 满幅海报 | 反白巨字 | 上部巨字 / 下部六行 | 700 |
| 091–095 | 便签 | 三张旋转便签 | 每张两行错落 | 540 |
| 096–100 | 横幅飘带 | 极宽横幅 | 两列 × 三行 | 320 |

模板在 `styles/001.svg … 100.svg`，元数据在 `styles/catalog.json`；初版 3 张归档在 `styles/legacy-v0.1/`。

> 审美边界：`AUDIT-REPORT.md` 对 **v0.2.0** 的独立盲评判定视觉可区分度仅 **2.20 / 5**。
> v0.3.0 已按此结论重构（对照证据 `contact-v020.png` / `contact-v030.png`），
> **但尚未重做独立盲评，不得声称可区分度已达标**；「结构唯一 100/100」是代码级指标，不是审美证据。

---

## 5. 合规自检（客观脚本判定，不靠肉眼自评）

展示页里的 `auditSVG()` 会对每份源码做硬检查，并把结果显式显示出来：

| 检查项 | 判定 |
| --- | --- |
| 禁用标签/属性 | `<style` `<script` `id=` `class=` `foreignObject` `<image` `on\w+=` `linearGradient` `radialGradient` `clipPath` `filter=` `<pattern` `currentColor` |
| 禁用 CSS | `@keyframes` `animation:` `transition:` `position:` `@font-face` |
| 动画白名单 | 每个 `attributeName` 必须在 §2.3 集合内 |
| 静态自洽 | 不得出现元素级 `opacity="0"` / `height="0"` 作为初始态 |
| 字体 | 必须含系统字体栈，不得出现 `@font-face` |
| 颜色 | 必须显式 hex，不得用 CSS 变量 / `currentColor` |

任一项失败就在页面上红字标出，**不要隐藏失败**。

---

## 6. 一键复制 → 粘贴路径（如实告知用户）

主按钮用 `ClipboardItem` 同时写 `text/html` + `text/plain` 两种格式，
`text/html` 让浏览器把 SVG 当成**富文本**而非代码，粘贴时才有机会被编辑器渲染：

```js
await navigator.clipboard.write([new ClipboardItem({
  'text/html':  new Blob([html], { type: 'text/html' }),
  'text/plain': new Blob([svg],  { type: 'text/plain' })
})]);
```

`ClipboardItem` 需要安全上下文（https / localhost）。本地 `file://` 打开时
自动降级到 `contenteditable` + `document.execCommand('copy')` 的富文本复制。

三条真实可用的粘贴路径，按成功率排序：

1. **富文本直粘**：点【一键复制到公众号】→ 公众号后台正文 `Ctrl+V`。
   这是 96 编辑器等工具采用的路径（「点击微信复制，然后 Ctrl+V 粘贴到微信公众平台」）。
2. **HTML 源码模式**：用 Chrome 扩展（如 `shyboy/wechat-mp-html-source-helper`）
   在 `mp.weixin.qq.com` 注入「HTML 源码」入口，粘贴源码 → 插入到光标位置。
   该扩展明确保留常见 SVG 图形与 SMIL 动画（含 `begin="click"`）。
3. **第三方编辑器中转**：秀米 / 135 / E2.COOL 的「HTML 源码组件」
   → 同步到公众号草稿箱。

**必须同时说明的风险**：
- 微信后台会**二次清洗**标签、属性和样式，最终结果可能与原始 HTML 不一致；
- 扩展作者也注明「保留代码不代表微信一定接受」；
- 保存草稿后请重新打开，并在 **iOS + Android 真机浅色/深色预览**中验收；
- 本 skill 未在真实公众号账号下完成发布验收，不声称"已上线可用"。

参考：微信白名单限定网页的手动复制流程见
《AI slop 一则》§8.4（浏览器打开 → Ctrl+A → Ctrl+C → 微信编辑器 Ctrl+V）。

---

## 7. 参考文件

- `references/wechat-svg-constraints.md` — 白名单、禁用清单、兼容坑、来源 URL
- `styles/001.svg` … `styles/100.svg` — 100 个可直接粘贴的模板（按 `styles/catalog.json` 检索）
- `styles/legacy-v0.1/` — 初版 3 张归档，仅作历史参考
- `index.html` — 展示页 + 一键复制 + 合规自检
- `tools/families-extra.mjs` — v0.3.0 新增的 10 个构图原型
- `tools/contact-sheet.mjs` — 生成新 / 旧视觉对照联系表
- `AUDIT-REPORT.md` — 独立审核报告（含 v0.2.0 盲评零结果）
- `README.md` — 公开 SVG Skills 调研（≥5 参考 / ≥3 深入）、公众号生态深挖、设计资源引用

---

## 8. 明确不做（v0.3.0）

点击展开长图文、无限选择器、视差滑动、音频、GIF 嵌套、深色模式自动适配、
foreignObject 嵌套 HTML、任何突破白名单的技巧。
这些属于「高级交互排版」，需要独立的验证流程与真机回归，不在"先看审美"的范围内。
