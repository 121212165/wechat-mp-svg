# 微信公众号 SVG 运行环境 · 约束速查

> 第一手资料整理，2026-11-08 联网检索。所有结论附来源 URL。
> 这一节是「公众号信息深入探索」的落点，也是 `SKILL.md` 硬约束的依据。

---

## 1. 底层机制：为什么 SVG 能活下来

微信图文编辑器会 sanitize HTML，但 **SVG 命名空间被整体放行**：

- 微信核心限制是不能写 JS、不能写 `<style>` 标签，导致常规交互动效不可行；
- 但 SVG 是 W3C 标准里的**声明式动画**载体，`<animate>` / `<animateTransform>` /
  `<animateMotion>` / `<set>` 不需要 JS，不发起网络请求、不读写 DOM，安全风险可控；
- 推测 sanitizer 只对 HTML 命名空间做深度解析，对 SVG 采用宽松放行策略；
- 产品侧也容忍：SVG 交互确实提升了文章质量，Apple、小米、喜茶等品牌号长期使用。

来源：
- 《微信公众号SVG交互图文实现原理说明》二歪同学 (2022-04-13) — https://blog.waistu.com/archives/GH6ijd6e
- 《AI slop 一则：若是要在公众号编辑器里玩 HTML/CSS 排版的花活》夜雨聆风 (2026-07) §3.4 — https://www.yeyulingfeng.com/626469.html
- 腾讯云开发者社区《公众号也能做交互？我用 SVG 给阿嬷的情书写了三封信》§5 踩坑清单 — https://cloud.tencent.com/developer/article/2739502

---

## 2. SVG AttributeName 白名单（核心）

最早于 **2016 年**由 JZCreative 团队（复旦计育韬、厦门嘉庚学院林喆）与微信团队
共同测试发布，最初筛选出 **27 个**适配微信 APP 的动画标签；
目前公众平台仍保留约 **20 个**可用动画属性。该范式被收录进
《融媒体SVG交互设计技术规范》T/CASME 1609—2024。

### 2021 版白名单明细

| 元素 | attributeName | 说明 |
| --- | --- | --- |
| `animate` | `x` | 简单几何体 x 轴移动（柱状图） |
| `animate` | `y` | 简单几何体 y 轴移动 |
| `animate` | `width` | 宽度变化（伸长式图文、宽度自适应） |
| `animate` | `height` | 高度变化（展开式图文、预占位） |
| `animate` | `r` | 圆形半径变化 |
| `animate` | `opacity` | 透明度 0–1 |
| `animate` | `d` | 贝塞尔补间，表现具随机性 |
| `animate` | `points` | 多边形补间，表现具随机性 |
| `animate` | `stroke` `stroke-width` `stroke-linecap` `stroke-dashoffset` | 遮罩动画、饼图、进度线 |
| `animate` | `fill` | 填充色过渡 |
| `set` | `visibility` | `visible / hidden / collapse / inherit`，防误触 |
| `animateTransform` | `translate` | 路径与编组位移 |
| `animateTransform` | `scale` | x/y 轴缩放，伪翻转 |
| `animateTransform` | `rotate` | 旋转 |
| `animateTransform` | `skewX` / `skewY` | 倾斜，台历/书籍翻阅 |
| `animateMotion` | `path` | 轨迹动画，可 `rotate` 定义朝向 |

配套控制参数均可用：`from | to | values | fill | additive | accumulate |
calcMode | begin | end | rotate | repeatCount | keyTimes | keySplines | restart | dur`
（分号等代码需注意系统适配性）。

**受限元素**：`use` `mpath` `by` `clipPath` `filter`。
白名单文档特别注明：**开发中不应含剪切路径、滤镜、渐变、网格等矢量特征**，
表现特性需转为位图载入。

来源：
- https://blog.waistu.com/archives/GH6ijd6e （2021 版白名单全文，部分参考 JZCreative）
- 《微信SVG高级交互排版：从理论根基到实战指南》公众号原文 — http://mp.weixin.qq.com/s?__biz=Mzg2NjcwMzk3Mg==&mid=2247517501&idx=1&sn=65330f8e2b679bbb222ddc7e8adc2cf5

> ⚠️ 白名单文档明确警告：**请勿使用突破白名单的规则**进行互动排版或模板设计，
> 否则可能被微信团队视为「对抗开发」。此前部分编辑器恶意发布的「图文弹跳」已被封禁。

---

## 3. HTML / CSS 支持分层（交叉验证结论）

### 3.1 标签

| 状态 | 标签 |
| --- | --- |
| ✅ | `p` `div` `span` `section` `h1–h6` `strong/b/em/i/u/s/del/ins` `sup/sub` `ul/ol/li` `a` `img` `table` 系列 `blockquote` `pre/code` `br` **`svg` 及全部子元素** `mpvoice` `mpvideo` |
| ❌ | `script` `style` `iframe` `embed` `object` `form` `input` `button` `select` `textarea` `link` `audio` `video` **`id` 属性（所有元素，含 SVG 内）** |
| ⚠️ | `class` 保留但不生效（无 `<style>`） |

### 3.2 CSS

**确认可用**：`color` `background-color` `font-size` `font-weight` `font-style`
`font-family`（系统字体栈）`margin` `padding`(px) `border` `border-radius`
`text-align` `text-decoration` `text-indent` `letter-spacing` `word-break`
`line-height` `opacity` `pointer-events` `user-select` `display` `box-shadow` `overflow`

**有条件可用**：`transform`（SVG 属性形式 `<g transform="...">` 始终可用；
HTML 元素上不保证）、`z-index`（父级需 `display:flex`）、`linear-gradient`（兼容不稳）、
`%` 单位在特定场景失效。

**完全不可用**：`position: absolute/fixed/relative`（整行删除）、
`animation` `transition` `@keyframes` `@media` `@font-face`、
`:hover` `:active` `::before` `::after`。

### 3.3 平台怪癖

| 问题 | 表现 / 对策 |
| --- | --- |
| 连续空格被合并 | 用 `\u00A0` 替代 |
| `id` 全删 | 事件触发不能用 `begin="id.click"`，只能用 `begin="click"` 绑自身 |
| `<image href>` | **必须微信素材库链接**，外链与 base64 均不显示 |
| `<image>` 尺寸 | iOS 上不写 `width`/`height` 不显示 |
| `transform-origin` | 在 `<g style="...">` 中 iOS 失效 → 只用属性形式 |
| `restart="never"` | **iOS 无效**，再次点击仍会播放，目前无解 |
| 深色模式 | 叶子节点可能被跳过；iOS 可能给所有元素加 transform 导致层级混乱 |
| `currentColor` | 一旦 SVG 被包成 `<embed>` 上传图床，颜色继承断裂 |
| 展开长图文 | 不能用 `float`，浮动元素在 `height:0` 容器中仍可见 |
| 图片限制 | 普通图 ≤600 万像素、宽 ≤1080px；GIF >300 帧或 >10MB 被拒 |

来源：https://www.yeyulingfeng.com/626469.html §2.3 / §2.4 / §7 / §7.5（该报告声明方法为
「多轮联网检索 + 交叉验证多个社区来源」，附录列出 Axton Liu、haqiao、VerySmallWoods、
PingCode、mXSS 研究等来源）。

---

## 4. 保存层的「二次伤害」

即使编辑器里看到正确效果，服务器端保存时微信可能把整段 SVG
**包成 `<embed>` 并上传到图床（mmbiz.qpic.cn）**，使 SVG 变成独立嵌入文档：

- `currentColor` 继承断裂 → 深色模式不跟随；
- `<embed>` 尺寸由客户端决定，CSS 无法穿透；
- 二次编辑极易导致内容消失。

mpMath（公式 SVG 方案）的架构分析同样印证：Chrome 扩展能绕过编辑器层，
但绕不过保存层和客户端渲染层。

**对本 skill 的对策**：所有颜色显式 hex 硬编码，不依赖任何继承；
不引外部图片；保持 SVG 结构简单（纯图形 + 文本），降低被当作"外部资源"重包装的概率。

来源：https://www.yeyulingfeng.com/626469.html §4.2–4.5

---

## 5. 风控边界

微信审查针对的是**最终输出的代码表现**而非排版工具本身。高风险项：

| 风险来源 | 技术特征 | 建议 |
| --- | --- | --- |
| 纯静态 SVG | 纯 XML，无交互逻辑 | ✅ 推荐使用 |
| 脚本注入 | `<script>`、`onclick`、`onerror` | ❌ 严禁 |
| 非法协议 | `javascript:`、复杂 Base64 | ❌ 严禁 |
| 嵌入式外链 | 非白名单域名 URL | ❌ 严禁 |
| 资源超限 | 超大内嵌 data URI | ⚠️ 控制体积 |

来源：《解构算法风控：LED矩阵编辑器与微信内容安全机制的真相》 — https://tsight.io/articles/11245390

---

## 6. 一键复制的可行性依据

### 6.1 官方生态里的同类做法

- 96 编辑器教程：「**不支持同步到微信公众平台，可以直接点击微信复制，然后 Ctrl+V
  粘贴到微信公众平台素材管理新建图文的正文里**」 — https://bj.96weixin.com/help/101.html
- 秀米 / 135 / 壹伴 / E2 编辑器均提供「一键复制」能力 — https://www.yeyulingfeng.com/626469.html §6.1
- 《AI slop 一则》§8.4 直接给出「白名单限定网页 + 手动复制」路线：
  不用 `<style>` 标签、样式全写 `style=""`、浏览器 Ctrl+A/C → 微信编辑器 Ctrl+V — https://www.yeyulingfeng.com/626469.html

### 6.2 HTML 源码模式

`shyboy/wechat-mp-html-source-helper`（Chrome MV3 扩展，v0.3.2，2026-11-02）：
- 在 `mp.weixin.qq.com` 图文编辑页注入「HTML 源码」入口；
- **保留常见 SVG 图形和 SMIL 视觉动画，包括 `begin="click"`**；
- 支持粘贴 HTML / SVG 插入到记住的光标位置；
- 导入前移除 `script` `iframe` `object` `embed` `style` `template` `foreignObject`、
  所有 `on*` 事件、危险 URL 协议；
- 明确提示：「样式表会被移除而非自动转为行内样式」「**保留代码不代表微信一定接受**」；
- 已知限制：「微信公众号后台会再次清洗标签、属性和样式，最终结果可能与原始 HTML
  不一致」，且作者声明**未完成真实公众号账号下的保存/重开/iOS/Android 预览验收**。

来源：https://github.com/shyboy/wechat-mp-html-source-helper

### 6.3 源码模式实测

《公众号SVG开场动画实战》：微信公众平台源码模式会做白名单过滤，
简单 SMIL 动画标签实测可保留，但 `style="animation: xx 1s infinite"` 这类
**CSS 动画发布时会被清理**。作者原则：「**能写在 SVG 属性里，就不要写在 style 里**」。
另给出真机预览清单：iOS + 安卓双机、动画是否自动播放、是否卡首帧、
结束是否停留在完整画面（部分安卓 WebView 会忽略 `fill="freeze"`）、低端机掉帧。

来源：https://blog.csdn.net/weixin_31115195/article/details/164636166

---

## 7. 成熟的自动清洗参考

`doocs/md` 项目沉淀了「微信公众号强约束 SVG」规范，`wechat-svg.ts` 提供自动化清洗：
目标是在**失去 `id` / `defs` / CSS / JS 之后依然自洽**，
靠纯 SVG 冒泡驱动交互动画（绝对父子链、三层分法、施加→抵消→再施加），
用于修复「粘贴后箭头消失、图表超大、文字错位、动画失效」。

来源：《微信公众号 SVG 适配实战：doocs/md 的无 ID 冒泡编组与约束规避指南》 — https://blog.gitcode.com/871b3ef0eeda6abca09b805bb4c85a03.html
仓库：https://github.com/doocs/md

---

## 8. 案例与学习资源

- iSVG 公益 SVG 交互案例搜索引擎 — https://www.isvg.com/ 、https://svg.show/
- E2.COOL 黑科技 SVG 编辑器（点击切换 / 无限选择器 / 视差滑动等组件）
- 《硬核运营：新媒体技术流养成》计育韬；复旦《新媒体SVG交互设计学发凡》
- 行业标准《融媒体SVG交互设计技术规范》T/CASME 1609—2024
- 五大基石：白名单体系、伸长动画、穿透触发（pointer-events）、双层触发、
  零高结构（height:0 + overflow:visible）

---

## 9. 本 skill 的验收边界（诚实声明）

本仓库完成的是：代码级合规自检 + 浏览器内渲染验证。
**未**在真实公众号账号下完成「保存草稿 → 重新打开 → iOS/Android 浅色/深色预览」验收。
因此不声称"已在公众号上线可用"，只声称"按公开白名单约束编写，并提供可复制的粘贴路径"。
真机验收由使用者在发布前完成。
