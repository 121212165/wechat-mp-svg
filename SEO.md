# SEO 推广报告 · wechat-mp-svg

> 执行日期：2026-11-09 · 配套文案：[PROMOTION.md](PROMOTION.md) · 客观校验：`node tools/verify-seo.mjs`
> **这是执行与验证记录，不是效果报告。** 没有任何收录、排名、点击率或流量数据，也不承诺这些结果。

---

## 0. 一句话结论

原先唯一的线上地址（WorkBuddy 分享链接）对搜索引擎**不可索引**：裸域与根路径文件返回 403 且带 `noindex,nofollow`。因此这次 SEO 的重心不是「往旧页面塞几个 meta」，而是**新建一个可索引的规范站点（GitHub Pages）+ 一份纯静态、爬虫可读的着陆页**，并把仓库可发现性从「topics 为空、description 仍是第一版」修到可检索状态。

---

## 1. 基线实测（改之前，2026-11-09 00:56 UTC）

用 `curl` 直接取，不是推测：

| 请求 | 结果 |
| --- | --- |
| `GET /` | **HTTP 403**，返回「链接不完整」页，含 `<meta name="robots" content="noindex,nofollow">` |
| `GET /robots.txt` | **HTTP 403**，同一「链接不完整」页 |
| `GET /sitemap.xml` | **HTTP 403** / 2988 B |
| `GET /?sharecode=ABASRVDAE5` | HTTP 200 / 513,995 B，`Server: CloudStudio Gateway`，`Set-Cookie: __wb_rsc=…` |
| `GET /robots.txt?sharecode=…` | HTTP 404 / 335 B |
| 线上 `<title>` | 「公众号 SVG Skill · **第一版** · 先看审美」，**无任何 description / OG / canonical / JSON-LD** |

GitHub 仓库元数据（`gh api repos/121212165/wechat-mp-svg`）：

| 字段 | 改前 |
| --- | --- |
| `description` | 「公众号 SVG Skill **第一版**：3 个风格 + 一键复制到公众号 + 微信白名单合规自检」 |
| `topics` | `[]`（**空**） |
| `homepage` | `null` |
| `has_pages` | `false` |
| `stargazers_count` / `forks_count` | `0` / `0` |

两个结构性诊断：

1. **域名层面**：只有带 `?sharecode=` 的分享 URL 才返回内容，且依赖 Cookie；搜索引擎访问的是裸域 → 403 + noindex。站内 meta 在这个域名上**基本无效**。
2. **页面层面**：展示页的 100 张卡片全部由 JavaScript 从 `<script type="text/plain">` 源码块生成；爬虫拿到的第一份 HTML 里几乎没有正文。这正是公开资料反复强调的「JS 渲染空壳」问题（见 §6 的 W6 / W7）。

---

## 2. 策略转向

| 原做法 | 改为 |
| --- | --- |
| 把 meta 加到 WorkBuddy 分享页，指望被收录 | 以 **GitHub Pages** 为规范站点，canonical / sitemap / og:url 全部指向它；WorkBuddy 链接保留为「在线交互版」 |
| 只有 JS 驱动的展示页 | 新增 **纯静态 `guide.html`**（约 2,000 汉字、白名单表、20 原型表、6 条 FAQ、来源、边界），不依赖 JS；`index.html` 另加 `<noscript>` 正文兜底 |
| 仓库 topics 空、description 过时 | 重写 description（关键词前置）、设 homepage、加 12 个**实测存在**的 topics |
| 无社交预览 | OG 1200×630 + GitHub Social Preview 1280×640，均由脚本可复现生成 |

**为什么 sitemap 只列 2 个 URL**：`wechat-article.html` 是 100 张同文案的模板化全文，公开资料把「批量模板化静态页、文字高度同质化」列为易被判低质的红线（W8，证据等级低但方向一致），因此不主动提交；`index.html`（工具页）与 `guide.html`（说明页）内容不同，各自 self-canonical。

---

## 3. 交付清单

### 新增文件

| 文件 | 作用 |
| --- | --- |
| `guide.html` | 纯静态 SEO 着陆页：核心词前置的 H1 / TDK、20 原型表、白名单速查、6 条 FAQ（与 JSON-LD 逐字一致）、3 张真实 SVG 示例（带 alt 与尺寸）、已知限制、来源 |
| `index.html`（改动） | 补 title / description / keywords / author / robots / theme-color / canonical / favicon / OG 10 项 / Twitter 4 项 / JSON-LD `WebApplication`；`<noscript>` 静态正文；可见的规范站点入口；`hc-title` 升级为语义化 `<h2>` |
| `robots.txt` | `Allow: /`、屏蔽工具源与联系表 HTML、AI 爬虫允许声明、Sitemap 绝对 URL |
| `sitemap.xml` | 2 个规范 URL + `lastmod`（日期由 `date -u` 取得，未手算） |
| `llms.txt` | 按 llmstxt.org 提案结构（H1 / blockquote / H2 链接分组 / Optional），含未验证项 |
| `favicon.svg` | 品牌图标 |
| `og-image.png` / `social-preview.png` | 1200×630 / 1280×640 社交卡，视觉已栅格化复核 |
| `assets/og-*.html` | 两张卡的 HTML 源，供复现 |
| `tools/make-cards.mjs` | 生成 HTML 源 + 调 Edge 无头截图 + 轮询校验 PNG 头与尺寸 |
| `tools/verify-seo.mjs` | 67 项客观校验（meta / OG / JSON-LD / FAQ 一致性 / 站点文件 / 图片 / 无回归） |
| `PROMOTION.md` | 关键词矩阵、分发顺序、公众号 / 知乎 / 掘金 / 小红书 / X / Discussion 六套可复制文案、落地清单、禁止事项 |
| `.nojekyll` | 避免 GitHub Pages 的 Jekyll 构建干扰静态文件 |
| `README.md`（改动） | 首屏改为 Answer-First 价值主张 + 3 步快速开始 + 4 个真实徽章 + 在线入口；起因移入折叠区；目录补新文件；标注「零」章节参数是 v0.2.0 历史编号 |

### 仓库元数据（已通过 GitHub API 生效并回读确认）

- `description`：关键词前置的 130 字描述（上限 350 字符）
- `homepage`：`https://121212165.github.io/wechat-mp-svg/guide.html`
- `topics`（12 个，全部先用 `gh api search/repositories?q=topic:…` 实测存在）：
  `svg` (14,570) · `wechat` (5,501) · `wechat-official-account` (238) · `wechat-mp` (85) · `svg-animation` (471) · `smil` (73) · `agent-skills` (40,832) · `claude-skills` (14,948) · `design-system` (9,101) · `typography` (2,866) · `static-site` (18,068) · `chinese` (10,994)
  （括号内为 2026-11-09 实测仓库数，用于选已有热门 slug，不是本项目的流量数据）

---

## 4. 客观验证结果

| 命令 | 结果 |
| --- | --- |
| `node tools/verify-seo.mjs` | **67 / 67 通过**（meta、OG、Twitter、canonical、JSON-LD 可解析、FAQ 问句与答案逐字匹配可见文本、sitemap/robots/llms、PNG 尺寸、主脚本语法、100 源码块、导出标记） |
| `node tools/verify-page.mjs` | **29 / 29 通过**（0.3s），展示页逻辑无回归 |
| `node tools/build-article.mjs` | **20 / 20 通过**，全文导出同源 |
| `node tools/generate-styles.mjs` | **100 / 100** 白名单 / 静态自洽 / 原文完整 / 结构唯一 |
| `node --check` / `vm.Script` | 主脚本与新增 `.mjs` 语法通过 |
| Edge 无头栅格化 | 两张社交卡尺寸正确；`ViewImage` 人工复核发现并修复了 2 次裁切（footer 被切、卡片标题被挤出） |

**过程中修正的真实错误**（不藏）：
- 社交卡第一版 footer 被裁、第二版三张小卡文字溢出 → 调整间距与卡片内部排版后复核通过。
- 校验脚本最初有 2 处**断言本身写错**：用「静态 H2 ≥ 3」衡量 JS 卡片页不合理（改为「H1 唯一 + H2/H3 层级 ≥ 4」），以及 ARTICLE_BEGIN 标记字符串多写了 ` */`（与源码不符）。同时把 `hc-title` 真升级为 `<h2>`，不是单纯放宽检查。
- `README「零」章节`仍用 v0.2.0 的 001–010 编号，与 v0.3.0 的 001–005 冲突，已加醒目标注指向 §3.2 当前矩阵。

---

## 5. 无法验证 / 零结果（必须读）

| 项 | 状态 |
| --- | --- |
| 收录、索引状态、排名、点击率、流量 | **全部未验证**。无站长平台账号、无流量基线（star 0 / fork 0）。不承诺任何提升，也不编造数字 |
| 关键词搜索量 / 竞争度 | **未测**。未接入微信指数、百度指数或 Keyword Planner，`PROMOTION.md` 里没有编造这些数字 |
| WorkBuddy 分享域名 | **架构上不可索引**（403 + noindex）。上面的 meta 优化只在可索引的规范站点上有意义 |
| `llms.txt` | 是 Jeremy Howard / Answer.AI 的**提案**，非 W3C / IETF 正式标准；各 AI 平台是否读取无官方确认，只作低成本可读性投入 |
| FAQPage 富媒体结果 | 结构化数据是「清晰度层」而非排名技巧，公开资料明确「加了不保证富结果」；不承诺搜索结果里出现 FAQ 折叠 |
| 站外发布 | **本次没有代发**任何公众号 / 知乎 / 掘金 / 小红书 / X 内容，也没有提交站长平台、刷量或买 star。文案已备好，需要你的账号 |
| GitHub Social Preview | 需网页手动上传（GitHub 无 CLI / API），文件已生成但未上传 |
| 项目自身遗留 | 真实公众号真机验收、v0.3.0 独立盲评重测仍未做（详见 `AUDIT-REPORT.md`），SEO 不改变这两条 |

---

## 6. 来源与证据等级

**重要限定**：以下没有一份是 Google / 百度 / 微信的官方 SEO 文档。它们是 2026 年的开发者检查表、社区实践与平台机制汇编，用于指导**技术卫生**，不能当作平台规则引用。W11 / W12 是第三方对 GitHub 机制的整理，GitHub 官方未公布搜索排名算法。

| # | 来源 | 用于 | 等级 |
| --- | --- | --- | --- |
| W1 | https://lobehub.com/skills/joabgonzalez-ai-agents-skills-web-seo | title 50–60 / description 120–160 字符、OG 1200×630、canonical 绝对 URL、JSON-LD、robots+sitemap | 社区 Skill 汇编 |
| W2 | https://webpiki.com/en/blog/seo-guide-for-developers | 抓取→索引→排序三阶段、canonical 防重复、`WebApplication` schema、Core Web Vitals、「结构化数据不保证富结果」 | 开发者指南 |
| W3 | https://digiroth.com/seo-checklist-for-a-new-site/ | 2026 新站清单：meta keywords（Bing 仍读）、OG/Twitter 全套、robots、sitemap | 检查表 |
| W4 | https://www.websyro.com/blogs/seo-checklist-for-developers-what-actually-matters-in-2026 | H1 唯一、语义化标题层级、Schema 是 clarity layer、内链 | 检查表 |
| W5 | https://theproductguy.in/blogs/meta-tags-checklist | meta 分层、OG 图必须绝对 HTTPS URL、验证工具清单 | 检查表 |
| W6 | https://www.zz1984.com/1068.html | JS 渲染收录排查：用 `curl` 对比源代码与浏览器内容，「让爬虫在第一份 HTML 里读到核心内容」 | 实战博客（2026-09） |
| W7 | https://www.xycss.cn/FED/news/detail-1841.html | 2026 新站不收录五步排查：robots → sitemap → TDK → 内链 → 状态码 | 交付经验 |
| W8 | http://wanbonet.com/tgxx/13414 | 批量模板化静态页易被判低质、静态页 JS 渲染正文归零 | **低**（营销站，仅作方向参考，故 sitemap 保守只列 2 页） |
| W9 | https://cloud.tencent.cn/developer/article/2732411 | 微信搜一搜：People Rank、搜索开放权限与 sitemap、标题前 10–15 字嵌词 | 社区文章 |
| W10 | http://mo.xkwl.net/html/612.html | 微信 SEO：标题 ≤20 字、开篇 300 字埋核心词、文末 2–3 个精准标签 | 实操博客 |
| W11 | https://github.com/Stepkar2004/init-configurator/blob/main/.claude/skills/socials/references/github.md | **GitHub 默认搜索只扫 name + description + topics**（README 需 `in:readme`）、topics ≤20、Social Preview 1280×640 | 第三方汇编（明确标注非官方） |
| W12 | https://github.com/devkindhq/github-seo-skill/blob/main/skills/github-seo/SKILL.md | 发布前安全扫描、canonical write-up 优先、Social Preview 无 CLI/API、不刷 star | 社区 playbook |
| W13 | https://llmstxt.org/ | `llms.txt` 原始提案与格式（H1 / blockquote / H2 链接分组） | **一手（提案）** |
| W14 | https://www.monitoraeo.com/what-is-llms-txt | llms.txt 与 robots/sitemap 分工、AI 平台采纳程度不一、非正式标准 | 社区观察 |
| W15 | https://alignify.co/zh/blog/github-for-marketing | README Answer-First、Social Preview 提升分享点击、徽章不宜过多 | 二手营销文章 |

补充：本仓库自有的一手约束资料在 `references/wechat-svg-constraints.md`，独立审核零结果在 `AUDIT-REPORT.md`。

---

## 7. 部署与线上验证（2026-11-09 实测）

### GitHub Pages（规范站点，已上线）

`POST /repos/121212165/wechat-mp-svg/pages`，`build_type=legacy`、`source={branch: master, path: /}`，状态从 `building` → **`built`**，`https_enforced=true`，站点 URL：`https://121212165.github.io/wechat-mp-svg/`。根目录已放 `.nojekyll` 防止 Jekyll 干扰。

| 路径 | 实测 |
| --- | --- |
| `/`、`/index.html` | 200 / 438,453 B / `text/html; charset=utf-8` |
| `/guide.html` | 200 / 27,474 B / `text/html; charset=utf-8` |
| `/robots.txt` | 200 / 517 B / `text/plain` |
| `/sitemap.xml` | 200 / 470 B / `application/xml` |
| `/llms.txt` | 200 / 3,563 B / `text/plain` |
| `/favicon.svg` | 200 / 499 B / `image/svg+xml` |
| `/og-image.png` | 200 / 60,434 B / `image/png` |
| `/styles/001.svg` | 200 / 2,144 B / `image/svg+xml` |

内容与元数据复核：

- 线上 `guide.html` 与本地**逐字节一致**（`cmp` 通过），Jekyll 未改动；页面**无 `noindex`**，`robots=index,follow`，canonical、OG 10 项、JSON-LD 均在线上可见。
- 线上 `index.html` 含 description、canonical、JSON-LD 与 `<noscript>` 正文。
- Edge 无头截图 `guide-preview.png` 人工复核：H1、按钮组、chips、目录、章节标题、20 原型表格全部正常，无空白 / 错位 / 破图。

### Git

commit `7426158` 已推送到 `master`。推送时遇到全局 `~/.gitconfig` 写死旧代理 `127.0.0.1:7897`、而当前会话代理为 `127.0.0.1:63985` 的问题，用 `git -c http.proxy="$http_proxy" -c https.proxy="$https_proxy" push` 临时覆盖解决；**未修改用户全局配置**。若后续 push 仍失败，建议把 `.gitconfig` 里的代理改为当前端口或删掉让它走环境变量。

### WorkBuddy 在线应用

已按用户明确授权覆盖同一链接（不新建应用）：`https://wechat-svg-styles.app.workbuddy.host/?sharecode=ABASRVDAE5`。

带缓存绕过参数回读（`&v=seo20261109`）实测：HTTP 200 / 438,453 B，`<title>100 风格展示页 · 公众号 SVG 排版模板一键复制</title>`，description / canonical / JSON-LD / `<noscript>` / guide 入口全部存在，`100 STYLES` 与 `v0.3.0` 在，`第一版` 计数为 **0**。

注意该域名本身仍对无 sharecode 的请求 403 + noindex（§1），**它不是 SEO 载体**，只作交互分享入口；规范站点始终是 GitHub Pages。

---

## 8. 下一步（按性价比排序）

1. **补齐真机验收**：真实公众号保存草稿 → 重开 → iOS / Android 浅色深色预览。这是 `README` 挂了三轮的未验证项，比任何 SEO 动作都更能提升内容可信度。
2. **提交站长平台**：Google Search Console / Bing Webmaster / 百度搜索资源平台验证域名并提交 `sitemap.xml`；等 2–4 周再看「已收录 / 已排除及原因」，才有资格谈效果。
3. **发一篇 canonical 长文**（`PROMOTION.md §3` 或 §5），社区分发全部指向它而不是裸仓库。
4. **重做独立盲评**：v0.3.0 的视觉可区分度是否达标仍是开放问题，独立窗口评分比自我感觉可靠。
5. **观测基线**：当前 star 0 / fork 0 / 无流量数据，任何后续变化才有对照意义。
