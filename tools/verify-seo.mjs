/**
 * 客观 SEO 校验：不评价审美、不预测排名，只检查交付物里可机器判定的事实。
 * 运行：node tools/verify-seo.mjs     （失败时退出码 1）
 */
import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const read = f => fs.readFileSync(path.join(ROOT, f), 'utf8').replace(/\r\n/g, '\n');
const exists = f => fs.existsSync(path.join(ROOT, f));
const CANON_HOST = 'https://121212165.github.io/wechat-mp-svg/';

let pass = 0, fail = 0;
const ck = (label, ok, detail = '') => {
  if (ok) { pass++; console.log('  PASS  ' + label); }
  else { fail++; console.log('  FAIL  ' + label + (detail ? '  → ' + detail : '')); }
};

/* ---------- 通用提取 ---------- */
const meta = (h, name) => {
  const m = h.match(new RegExp('<meta\\s+name="' + name + '"\\s+content="([^"]*)"', 'i'));
  return m ? m[1] : null;
};
const og = (h, prop) => {
  const m = h.match(new RegExp('<meta\\s+property="' + prop + '"\\s+content="([^"]*)"', 'i'));
  return m ? m[1] : null;
};
const canonical = h => (h.match(/<link\s+rel="canonical"\s+href="([^"]+)"/i) || [])[1] || null;
const ldBlocks = h => [...h.matchAll(/<script\s+type="application\/ld\+json">([\s\S]*?)<\/script>/g)].map(m => m[1]);
const cn = s => (s.match(/[\u4e00-\u9fff]/g) || []).length;

/* ---------- 1. 页面级元数据 ---------- */
console.log('\n[1] 页面元数据（index.html / guide.html）');
const pages = { 'index.html': read('index.html'), 'guide.html': read('guide.html') };
const titles = {}, descs = {}, canons = {};

for (const [name, h] of Object.entries(pages)) {
  const title = (h.match(/<title>([^<]*)<\/title>/i) || [])[1] || '';
  const desc = meta(h, 'description') || '';
  const can = canonical(h);
  titles[name] = title; descs[name] = desc; canons[name] = can;

  ck(`${name} · title 存在且 ≤ 60 字符`, title.length > 0 && title.length <= 60, `${title.length} 字符`);
  ck(`${name} · description 70–170 字符`, desc.length >= 70 && desc.length <= 170, `${desc.length} 字符`);
  ck(`${name} · keywords / author / robots`, !!meta(h, 'keywords') && !!meta(h, 'author') && /index,\s*follow/.test(meta(h, 'robots') || ''));
  ck(`${name} · charset + viewport`, /<meta charset="UTF-8">/i.test(h) && !!meta(h, 'viewport'));
  ck(`${name} · canonical 绝对 URL 且指向规范站点`, !!can && can.startsWith(CANON_HOST), can);
  ck(`${name} · theme-color + favicon`, !!meta(h, 'theme-color') && /rel="icon"/.test(h));
  ck(`${name} · H1 唯一`, (h.match(/<h1[\s>]/gi) || []).length === 1);
  // 工具页的卡片标题由 JS 在运行时生成，静态 HTML 里 H2 天然少；
  // 正确度量是「H1 唯一 + 存在层级化的 H2/H3 结构」，而不是硬卡静态 H2 数量。
  const heads = (h.match(/<h[23][\s>]/gi) || []).length;
  ck(`${name} · 静态 H2/H3 层级结构 ≥ 4`, heads >= 4, heads + ' 个');
  ck(`${name} · 核心词「公众号 SVG」在 title`, title.includes('公众号 SVG'));

  const ogTags = ['og:type', 'og:site_name', 'og:locale', 'og:title', 'og:description', 'og:url', 'og:image', 'og:image:width', 'og:image:height', 'og:image:alt'];
  ck(`${name} · Open Graph 10 项齐全`, ogTags.every(t => !!og(h, t)), ogTags.filter(t => !og(h, t)).join(','));
  ck(`${name} · og:image 为绝对 HTTPS URL`, /^https:\/\//.test(og(h, 'og:image') || ''));
  ck(`${name} · og:url 与 canonical 一致`, og(h, 'og:url') === can);
  ck(`${name} · og:image 声明 1200×630`, og(h, 'og:image:width') === '1200' && og(h, 'og:image:height') === '630');
  const tw = ['twitter:card', 'twitter:title', 'twitter:description', 'twitter:image'];
  ck(`${name} · Twitter Card 4 项齐全`, tw.every(t => !!meta(h, t)), tw.filter(t => !meta(h, t)).join(','));
  ck(`${name} · twitter:card = summary_large_image`, meta(h, 'twitter:card') === 'summary_large_image');

  const lds = ldBlocks(h);
  let parsed = [];
  try { parsed = lds.map(x => JSON.parse(x)); } catch (e) { /* handled below */ }
  ck(`${name} · JSON-LD 可解析`, lds.length >= 1 && parsed.length === lds.length, `${lds.length} 块`);
  const flat = JSON.stringify(parsed);
  ck(`${name} · JSON-LD 含 @context 与类型`, flat.includes('"@context"') && (flat.includes('"@type"')));
  ck(`${name} · 未自造 aggregateRating / review`, !/aggregateRating|reviewCount|ratingValue/.test(flat));
}

ck('两页 title 不重复', titles['index.html'] !== titles['guide.html']);
ck('两页 description 不重复', descs['index.html'] !== descs['guide.html']);
ck('两页 canonical 不重复', canons['index.html'] !== canons['guide.html']);

/* ---------- 2. 静态可读内容（解决 JS 空壳） ---------- */
console.log('\n[2] 爬虫可读内容');
const guide = pages['guide.html'];
const index = pages['index.html'];
const noscript = (index.match(/<noscript>([\s\S]*?)<\/noscript>/i) || [])[1] || '';
const guideText = guide.replace(/<script[\s\S]*?<\/script>/gi, '').replace(/<style[\s\S]*?<\/style>/gi, '').replace(/<[^>]+>/g, ' ');
ck('guide.html 静态正文 ≥ 1200 个汉字', cn(guideText) >= 1200, cn(guideText) + ' 字');
ck('guide.html 无外部 JS（JSON-LD 除外）', ![...guide.matchAll(/<script([^>]*)>/gi)].some(m => !/application\/ld\+json/.test(m[1])));
ck('guide.html 图片全部有 alt', [...guide.matchAll(/<img\b([^>]*)>/gi)].every(m => /\balt="[^"]+"/.test(m[1])));
ck('guide.html 图片全部有 width/height（防 CLS）', [...guide.matchAll(/<img\b([^>]*)>/gi)].every(m => /\bwidth="\d+"/.test(m[1]) && /\bheight="\d+"/.test(m[1])));
ck('index.html 含 <noscript> 且正文 ≥ 350 汉字', cn(noscript) >= 350, cn(noscript) + ' 字');
ck('index.html 有指向 guide.html 的可见链接', /href="https:\/\/121212165\.github\.io\/wechat-mp-svg\/guide\.html"/.test(index));
ck('guide.html 内链到展示页 / 仓库 / 全文 HTML', /href="index\.html"/.test(guide) && /github\.com\/121212165\/wechat-mp-svg/.test(guide) && /href="wechat-article\.html"/.test(guide));
ck('guide.html 引用的 SVG 示例文件真实存在', [...guide.matchAll(/<img[^>]+src="(styles\/[^"]+)"/gi)].every(m => exists(m[1])));

/* ---------- 3. FAQ 结构化数据与可见文本一致性 ---------- */
console.log('\n[3] FAQ 结构化数据一致性');
const ld = JSON.parse(ldBlocks(guide)[0]);
const faq = (ld['@graph'] || []).find(x => x['@type'] === 'FAQPage');
ck('guide.html 含 FAQPage', !!faq);
if (faq) {
  const dts = [...guide.matchAll(/<dt>([^<]+)<\/dt>/g)].map(m => m[1].trim());
  const dds = [...guide.matchAll(/<dd>([\s\S]*?)<\/dd>/g)].map(m => m[1].replace(/<[^>]+>/g, '').trim());
  const qs = faq.mainEntity.map(x => x.name);
  const as = faq.mainEntity.map(x => x.acceptedAnswer.text);
  ck('FAQ 问句数量 = 可见 dt 数量', qs.length === dts.length, `${qs.length} vs ${dts.length}`);
  ck('FAQ 问句逐字匹配可见 dt', qs.every((q, i) => q === dts[i]), qs.find((q, i) => q !== dts[i]) || '');
  ck('FAQ 答案逐字匹配可见 dd', as.every((a, i) => a === dds[i]), as.find((a, i) => a !== dds[i])?.slice(0, 40) || '');
}

/* ---------- 4. 站点文件 ---------- */
console.log('\n[4] robots / sitemap / llms.txt / favicon');
const robots = read('robots.txt');
const sitemap = read('sitemap.xml');
const llms = read('llms.txt');
ck('robots.txt 有 User-agent: * 与 Allow: /', /User-agent:\s*\*/.test(robots) && /Allow:\s*\//.test(robots));
ck('robots.txt Sitemap 为绝对 URL 且指向规范站点', (robots.match(/Sitemap:\s*(\S+)/) || [])[1] === CANON_HOST + 'sitemap.xml');
const locs = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map(m => m[1]);
ck('sitemap.xml 合法 XML 头 + urlset', /^<\?xml version="1\.0" encoding="UTF-8"\?>/.test(sitemap) && /<urlset[^>]*sitemaps\.org/.test(sitemap));
ck('sitemap.xml 含 2 个 URL 且全部同域', locs.length === 2 && locs.every(u => u.startsWith(CANON_HOST)), String(locs.length));
ck('sitemap.xml 未提交模板化重复页 wechat-article.html', !locs.some(u => u.includes('wechat-article.html')));
ck('sitemap.xml lastmod 为有效 ISO 日期', [...sitemap.matchAll(/<lastmod>(\d{4}-\d{2}-\d{2})<\/lastmod>/g)].every(m => !Number.isNaN(Date.parse(m[1]))));
ck('llms.txt 符合提案结构（H1 / blockquote / H2 分组）', /^#\s+\S/.test(llms) && /^>\s+\S/m.test(llms) && (llms.match(/^##\s+\S/gm) || []).length >= 2);
ck('llms.txt 链接均为绝对 URL', [...llms.matchAll(/\]\(([^)]+)\)/g)].every(m => /^https:\/\//.test(m[1])));
const fav = read('favicon.svg');
ck('favicon.svg 合法 SVG 根', /<svg[^>]+xmlns="http:\/\/www\.w3\.org\/2000\/svg"/.test(fav) && fav.trim().endsWith('</svg>'));

/* ---------- 5. 图片资源 ---------- */
console.log('\n[5] 社交分享卡');
function png(f) {
  if (!exists(f)) return null;
  const b = fs.readFileSync(path.join(ROOT, f));
  if (b.length < 24 || b[0] !== 0x89 || b.toString('ascii', 1, 4) !== 'PNG') return null;
  return { w: b.readUInt32BE(16), h: b.readUInt32BE(20), bytes: b.length };
}
const a = png('og-image.png'), b = png('social-preview.png');
ck('og-image.png = 1200×630 且 < 1 MB', !!a && a.w === 1200 && a.h === 630 && a.bytes < 1048576, a ? `${a.w}x${a.h} ${a.bytes}B` : 'missing');
ck('social-preview.png = 1280×640 且 < 1 MB', !!b && b.w === 1280 && b.h === 640 && b.bytes < 1048576, b ? `${b.w}x${b.h} ${b.bytes}B` : 'missing');
ck('卡片源 HTML 可复现', exists('assets/og-1200x630.html') && exists('assets/social-1280x640.html') && exists('tools/make-cards.mjs'));

/* ---------- 6. 未破坏展示页主脚本 ---------- */
console.log('\n[6] 展示页无回归');
const marker = '\n<script>\n';
const st = index.lastIndexOf(marker);
const en = index.indexOf('\n</script>', st + marker.length);
const mainJs = st > 0 ? index.slice(st + marker.length, en) : '';
ck('主脚本块仍可精确定位', mainJs.length > 10000, mainJs.length + ' bytes');
let syntaxOK = true;
try { new vm.Script(mainJs); } catch (e) { syntaxOK = false; }
ck('主脚本语法可编译（vm.Script，不执行）', syntaxOK);
ck('100 个 SVG 源码块仍在', (index.match(/type="text\/plain"\s+id="src-\d+"/g) || []).length === 100);
ck('ARTICLE 导出标记仍完整', index.includes('/* ===== ARTICLE_BEGIN =====') && index.includes('/* ===== ARTICLE_END ===== */'));

/* ---------- 汇总 ---------- */
console.log(`\n${fail ? '存在失败项' : '全部通过'}（${pass} 项通过 / ${fail} 项失败）`);
if (fail) process.exitCode = 1;
