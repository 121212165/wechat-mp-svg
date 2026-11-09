# 推广内容包 · wechat-mp-svg

> 配套报告见 [SEO.md](SEO.md)。本文件是**可直接复制使用的文案与分发清单**，不是效果报告。
> 生成日期：2026-11-09。所有链接、数字均取自本仓库当前交付物，未编造流量、排名或搜索量数据。

---

## 0. 先说清楚：什么能做，什么没做

| 状态 | 内容 |
| --- | --- |
| ✅ 已由本项目完成 | 站内元数据 / 结构化数据 / 静态着陆页 / sitemap / robots / llms.txt / 社交卡 / GitHub description + topics + homepage / README 首屏 |
| ⚠️ 需部署后生效 | GitHub Pages 站点、WorkBuddy 在线版覆盖更新 |
| ❌ 本次**没有**做（需要账号或人工） | 提交百度 / Google / Bing 站长平台、发布公众号推文、发帖到知乎 / 掘金 / 小红书 / X、上传 GitHub Social Preview 图片、提交 awesome 列表 PR、刷任何形式的量 |
| ❌ 不承诺 | 收录、排名、点击率、涨粉、star 数。没有任何流量基线，也不存在可归因的「SEO 效果」数字 |

**我不会代发到任何账号。** 外部发布属于公开动作，需要你本人确认内容后手动执行；下面每份文案都写成「复制即用」。

---

## 1. 关键词矩阵

依据：项目实际内容 + 公开 SEO 实践（见 [SEO.md §6 来源](#6-来源)）。**未接入微信指数、百度指数或任何关键词工具，因此不提供搜索量、竞争度、难度分数**——那些数字需要你用官方工具现查。

| 层级 | 关键词 | 用在何处 |
| --- | --- | --- |
| 核心品类词 | 公众号 SVG、微信公众号 SVG 排版、公众号 SVG 模板 | 仓库名 / description / guide.html H1 / title / 推文标题前 15 字 |
| 功能意图词 | 一键复制到公众号、公众号 SVG 交互图文、SVG 图文排版工具、公众号排版源码 | meta description / H2 / 推文首段 |
| 技术长尾词 | SVG AttributeName 白名单、SMIL 公众号动画、公众号 SVG 动画失效、微信编辑器过滤 id、foreignObject 公众号 | guide.html 白名单表 / FAQ / 掘金长文小标题 |
| 问题词（搜一搜 / 问一问承接） | 公众号 SVG 怎么做、粘贴后动画不动、公众号 SVG 和普通 SVG 区别、100 个风格是不是换色 | FAQ 的 6 个问句，逐字对应 JSON-LD |
| 英文词 | WeChat Official Account SVG、WeChat MP SVG template、SMIL animation whitelist | 仓库 description / topics / X 文案 / llms.txt |
| 品牌词 | wechat-mp-svg、公众号 SVG Skill | 所有平台统一使用，便于后续归因 |

**布局原则**：核心词前置、自然出现，不堆砌。当前 `guide.html` 的 H1、首段、H2 各含核心词一次，title 24 字、description 约 90 字，符合常见长度建议。

---

## 2. 分发顺序（有依赖，别跳步）

1. **先让规范站点可访问**：GitHub Pages + WorkBuddy 覆盖上线 → 验证 `guide.html`、`robots.txt`、`sitemap.xml`、`og-image.png` 都是 200。
2. **再发一篇长文（canonical write-up）**：优先公众号推文或掘金长文，链接指向 `guide.html`（不要只甩仓库地址）。
3. **社区二次分发**：知乎回答、X、小红书、GitHub Discussion，链接指向第 2 步的长文或 `guide.html`。
4. **生态内反链**：等有真实读者后再考虑 awesome 类列表 PR；先读对方 CONTRIBUTING 规则，低质量 PR 会被直接关。
5. **提交站长平台**：Google Search Console、Bing Webmaster Tools、百度搜索资源平台，提交 `sitemap.xml`。这一步需要你的账号与域名验证，本次未做。

---

## 3. 公众号推文（复制即用）

**标题（18 字，前 10 字含核心词）**
```
公众号 SVG 排版：100 种风格一键复制
```
备选：`公众号 SVG 模板：100 种风格怎么做的`、`公众号 SVG 白名单： paste 之后为什么动画不动`

**文末标签（2–3 个精准长尾词）**
```
#公众号SVG #SVG交互图文 #微信排版
```

**正文**

> 公众号 SVG 排版这件事，最麻烦的不是画得好看，而是「粘进去之后还在不在」。
>
> 我做了一套开源的公众号 SVG 模板：100 个风格、20 个构图原型、930 个 SMIL 动画标签，全部按微信编辑器的规则从第一笔写起。挑一个风格，点一下，整篇富文本就进了剪贴板，到公众号后台 Ctrl+V 就是一篇图文。
>
> 为什么不能直接拿网页 SVG 来用？因为公众号编辑器会过滤 script、style 标签，删掉所有元素上的 id，CSS @keyframes 和 JS 动画保存后全部失效。能活下来的只有 SVG 自带的声明式 SMIL 动画——animate、animateTransform、animateMotion、set——配合一份约 20 项的 attributeName 白名单。所以模板必须是纯色几何、内联属性、手写多行文本，而且把动画全删掉之后，画面和文字仍然要完整可读。
>
> 这套东西是怎么来的：一开始只做了 3 个风格，因为我是 SVG 小白，不想评价能力，只想先看看审美。后来「堆料，堆到不能堆为止」，扩到 100 个。但我没有自己打分，而是另开窗口做独立审核：两名盲评者给出的视觉可区分度只有 2.20 ± 1.04 / 5（阈值 3.0），判定「本质只是换色」的假设没被拒绝。
>
> 于是重做了一版：10 骨架 × 10 参数变体，改成 20 个构图原型 × 5 变体。新增竖排卷轴、居中诗页、分屏对照、卡片阶梯、清单表格、满幅海报、便签、横幅飘带这些真正不同的信息架构，画布高度从 320 到 760 共 13 种，还删掉了画面上印着的设计参数说明——它既干扰盲评，又让 100 张图看起来像同一张说明卡。
>
> 老老实实说三件没做的事：一是没在真实公众号账号里跑完「保存草稿 → 重开 → iOS / Android 浅色深色预览」；二是新版还没重做独立盲评，所以不声称可区分度已经达标；三是白名单资料全部来自个人博客和社区文章，不是微信官方文档，来源之间还互相矛盾。这些都写在仓库里了。
>
> 如果你也想试试，建议先用「当前页 12 张」小范围试粘。一次贴 100 张是 412.9 KiB，极可能超时、截断或被清洗。
>
> 图文说明与常见问题：https://121212165.github.io/wechat-mp-svg/guide.html
> 100 风格展示页：https://121212165.github.io/wechat-mp-svg/
> 源码与调研报告：https://github.com/121212165/wechat-mp-svg
> MIT 开源，可离线使用。

**排版提示**：首段 300 字内已出现「公众号 SVG」「微信公众号」类核心词；每 2–3 句分段；小标题可加「为什么网页 SVG 不能直接粘」「100 个风格是不是换色」「三件没做的事」；封面用 `og-image.png`。

---

## 4. 知乎回答（适配「公众号 SVG 是怎么做的 / 粘贴后动画失效」类问题）

```
先给结论：公众号里的交互动效不是 CSS 也不是 JS，是 SVG 的 SMIL 声明式动画，而且只能用一份很窄的 attributeName 白名单。

具体三层：

1）编辑器会清洗 HTML。script、style 被删，所有元素上的 id 会被移除，@keyframes / animation / position 保存后失效，class 保留但没有样式表可用。渐变、滤镜、clip-path、foreignObject、外链图片也都不能指望。

2）能留下的是 animate / animateTransform / animateMotion / set，配合大约 20 个可用属性：x、y、width、height、r、opacity、d、points、fill、stroke、stroke-width、stroke-linecap、stroke-dashoffset、visibility，以及 transform 的 translate / scale / rotate / skewX / skewY、animateMotion 的 path。这套范式 2016 年就有了，后来收进《融媒体SVG交互设计技术规范》T/CASME 1609—2024。

3）所以写法必须很克制：纯色几何、属性全部内联、文字手写分行，并且「动画被删掉之后画面仍然完整」——这叫静态自洽，是排查时最容易忽略的一条。

我按这套约束做了 100 个开源模板，含整篇富文本一键复制（ClipboardItem 同时写 text/html 和 text/plain，粘贴后编辑器才会渲染成图形）和逐张白名单合规自检：
https://121212165.github.io/wechat-mp-svg/guide.html

两点如实说明：这份白名单来自公开博客和社区资料，不是微信官方文档，来源之间还有冲突；另外我这边没做真机 iOS/Android 深色模式验收，实际发稿前请自己预览。
```

---

## 5. 掘金 / 技术博客长文提纲

标题：`公众号 SVG AttributeName 白名单实战：100 个模板、930 个动画与一次失败的盲评`

| 小节 | 要点 | 可放的代码 / 数据 |
| --- | --- | --- |
| 1. 一次粘贴引发的排查 | 网页 SVG 粘进公众号变空白 | `<meta robots>` / 编辑器清洗前后对比 |
| 2. 白名单到底有哪些 | 约 20 个 attributeName 明细 | `references/wechat-svg-constraints.md` 的表格 |
| 3. 静态自洽原则 | 移除全部 SMIL 后正文仍可读 | 项目实测 100/100 通过 |
| 4. 一键复制的实现 | ClipboardItem 双 MIME + execCommand 降级 | `index.html` 里的 `copyRich()` 片段 |
| 5. 100 个风格的生成 | 20 原型 × 5 变体、13 种画布高度 | `tools/families-extra.mjs` |
| 6. 独立审核与零结果 | 盲评 2.20 ± 1.04 / 5，H0 未拒绝 | `AUDIT-REPORT.md` |
| 7. 按零结果重构 | 删 150 处说明文字、新增 10 套信息架构 | `contact-v020.png` / `contact-v030.png` |
| 8. 还没解决的问题 | 真机未验收、新版未重评、白名单非官方 | README 边界章节 |

结尾统一指向 `guide.html`，再给仓库地址。

---

## 6. 小红书 / 短内容

```
公众号 SVG 排版，我做了 100 个能直接粘的模板

不用装插件，不用写代码。
选风格 → 一键复制 → 公众号后台 Ctrl+V，图文就出来了。

· 20 个构图原型：瑞士网格 / 居中诗页 / 满幅海报 / 便签 / 清单表格…
· 全部按微信白名单写，纯 SMIL 动画，无 JS、无 id
· 930 个动画标签，删掉动画正文也还在
· MIT 开源，可离线用

有个不太好看的数字：独立盲评给旧版的可区分度只有 2.20/5，说白了就是「换色」。所以重做了一版，把 10 骨架换成 20 套真正不同的信息架构。新版还没重评，不好看的地方欢迎直接说。

一次别贴 100 张，先用 12 张试粘，会超时。

链接在评论区 / 主页：guide.html
```

配图建议：`contact-v030.png`（20 张联系表） + `og-image.png`。

---

## 7. X / 英文

```
100 WeChat Official Account SVG templates, all written against the SVG AttributeName whitelist — no JS, no <style>, no ids, SMIL only.

One-click rich-text copy (text/html + text/plain) straight into the WeChat MP editor. 20 layout archetypes, 13 canvas ratios, 930 animations.

Independent blind rating of v0.2 scored visual distinctiveness 2.20/5 — basically "just recoloring". v0.3 rebuilt it with 20 composition prototypes. Not re-rated yet, so no claims.

Open source, MIT:
guide → https://121212165.github.io/wechat-mp-svg/guide.html
repo → https://github.com/121212165/wechat-mp-svg
```

---

## 8. GitHub Discussion / Release note

```
## v0.3.0 + SEO assets

- 100 SVG templates · 20 composition prototypes · 930 SMIL animations
- Static, crawler-readable guide.html (whitelist table + FAQ + honest limits)
- One-click rich-text copy for the whole article; wechat-article.html exported from the same pure functions
- Independent audit kept in AUDIT-REPORT.md, including the negative result (2.20 ± 1.04 / 5 distinctiveness)
- SEO: canonical + OG/Twitter cards + JSON-LD, sitemap.xml, robots.txt, llms.txt, 1200×630 OG image, 1280×640 social preview

Not verified: real WeChat MP account draft→reopen→iOS/Android light/dark preview; post-refactor blind re-rating. Please open an issue if you test either.
```

---

## 9. 落地清单（打勾用）

**技术侧（已做，待部署验证）**
- [x] `guide.html` 静态着陆页、`index.html` meta + JSON-LD + `<noscript>` 正文
- [x] `robots.txt` / `sitemap.xml` / `llms.txt` / `favicon.svg`
- [x] `og-image.png` (1200×630) / `social-preview.png` (1280×640)
- [x] 仓库 description / homepage / 12 个 topics
- [x] GitHub Pages 上线，9 个根文件实测 200、无 noindex、https_enforced
- [x] WorkBuddy 在线版已覆盖到 v0.3.0 + SEO 元信息（同一链接，回读确认）

**需要你的账号**
- [ ] Settings → General → Social preview 上传 `social-preview.png`（1280×640 / <1 MB；GitHub 无 CLI/API，只能网页点）
- [ ] Google Search Console / Bing Webmaster / 百度搜索资源平台：验证域名 + 提交 sitemap
- [ ] 微信指数查核心词热度、搜一搜下拉框记录长尾词（本文件不编这些数字）
- [ ] 发布第 3 节推文，文末按 2–3 个精准标签
- [ ] 知乎 / 掘金 / 小红书 / X 按 4–7 节分发
- [ ] 真机验收公众号粘贴链路（这是 README 里挂了三轮的未验证项，值得优先补）

**观测（至少 2–4 周后才有意义）**
- [ ] 站长平台的「已收录 / 已排除及原因」、抓取频次
- [ ] 微信搜一搜里搜「公众号 SVG」能否找到自己那篇
- [ ] GitHub 仓库 Insights → Traffic 的 referrer
- [ ] 记录基线：**当前 star 0、fork 0、无流量数据**。任何后续变化才有对照意义

---

## 10. 禁止事项

- 不买量、不刷 star / 阅读 / 在看、不互推群刷。
- 不堆砌关键词、不藏同色文字、不做 doorway 页、不批量生成同质化模板页抢收录。
- 不把「白名单」写成微信官方结论；不把盲评零结果藏起来；不声称已在公众号验收。
- 不在 awesome 列表里塞低质量 PR；不把 `wechat-article.html`（100 张重复文案）提交进 sitemap 抢收录。
- 不承诺任何排名或流量数字。SEO 是可验证的技术卫生，不是效果保证。
