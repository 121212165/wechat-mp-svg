/**
 * 生成 100 个公众号安全 SVG 风格，并注入展示页。
 *
 * v0.3.0：20 个构图原型 × 5 个变体 = 100。
 * 独立审核判定 v0.2.0「10 骨架 × 10 参数变体」视觉可区分度仅 2.20/5，
 * 因此把「同骨架换参数」改为「更多真正不同的信息架构 + 不同画布比例」，并删掉画面上的设计说明文字。
 * 变体仍然不是「换个颜色」：
 *   - 色板：10 套浅色板 / 10 套深色底，accent 按家族与变体双重错位取用
 *   - 字体：无衬线 / 衬线 / 等宽 / 系统栈 轮换
 *   - 布局：每个流派内部由 v 驱动栏数、间距、字号、圆角、错位量、装饰密度
 *   - 动效：每个流派有独立的文本编排池 + 装饰动效池，10 个变体各不相同
 *
 * 用法：node tools/generate-styles.mjs
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { FAMILIES, LINES } from './families.mjs';
import { EXTRA_FAMILIES } from './families-extra.mjs';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const STYLES_DIR = path.join(ROOT, 'styles');
const INDEX = path.join(ROOT, 'index.html');

const ALL_FAMILIES = [...FAMILIES, ...EXTRA_FAMILIES];
const VARIANTS = 5;

/* 10 套浅色板：bg / surface / ink / sub / accent / line / second */
const PALETTES = [
  { bg:'#FBFAF9', surface:'#F1EFEC', ink:'#292524', sub:'#78716C', accent:'#B4462F', line:'#E7E5E4', second:'#D6D3D1' },
  { bg:'#F7F5F1', surface:'#EDE8DE', ink:'#23201B', sub:'#8C8172', accent:'#635BFF', line:'#DCD5C9', second:'#C9BFAE' },
  { bg:'#F8FAF9', surface:'#EAF1ED', ink:'#1B2B24', sub:'#6E8579', accent:'#2F6B4F', line:'#D7E3DC', second:'#9FC5AF' },
  { bg:'#F5F8FC', surface:'#E6EEF7', ink:'#16283B', sub:'#6D8299', accent:'#1D4E89', line:'#D6E1EE', second:'#A9C2DC' },
  { bg:'#FDF7FA', surface:'#F4E7EF', ink:'#33152A', sub:'#8A6A7E', accent:'#C2185B', line:'#EBD7E2', second:'#E8A9C6' },
  { bg:'#FFF8F0', surface:'#FBE9D7', ink:'#2B2118', sub:'#8A7563', accent:'#FF6B35', line:'#EBD5BE', second:'#2EC4B6' },
  { bg:'#F3FBF8', surface:'#DFF2EA', ink:'#12332A', sub:'#5C8577', accent:'#0E9F6E', line:'#CDE9DE', second:'#7FD1B3' },
  { bg:'#F6F3EA', surface:'#EAE4D3', ink:'#1C1A17', sub:'#6F675A', accent:'#B4472F', line:'#CFC7B2', second:'#1D4E89' },
  { bg:'#F4F4F0', surface:'#E2E2DC', ink:'#0A0A0A', sub:'#5C5C55', accent:'#5B8C00', line:'#C9C9C0', second:'#FF5C35' },
  { bg:'#FAF7F2', surface:'#EEE6D8', ink:'#241D14', sub:'#7E6E5B', accent:'#8B5CF6', line:'#E0D5C2', second:'#D9A441' }
];
/* 深色家族：每变体不同的暗底，网格线亮度随 v 递增 */
const DARK_BGS = ['#0D0F14','#0B1220','#111318','#0A1418','#12101A','#0E1411','#141017','#0B1119','#141210','#0D1216'];
const FONTS = [
  { label:'无衬线', v:"'PingFang SC','Hiragino Sans GB','Microsoft YaHei',sans-serif" },
  { label:'衬线',   v:"Georgia,'Songti SC','SimSun',serif" },
  { label:'等宽',   v:"Consolas,Menlo,'Courier New',monospace" },
  { label:'系统栈', v:"-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif" }
];
const TAGS = ['极简','密排','左锚','居中','大字号','细线','粗框','错位','双色','高对比',
              '疏朗','紧凑','衬线','等宽','描边','叠印','网格','留白','荧光','硬边'];

function paletteFor(fam, n){
  // n = 1..100；(n%10, floor((n-1)/10)) 构成 100 个互不重复的 (base, accent) 对
  const base = PALETTES[n % PALETTES.length];
  const accent = PALETTES[Math.floor((n-1)/10) % PALETTES.length].accent;
  if (!fam.dark) return { ...base, accent, deep:'#111111' };
  const g = (30 + (n % 20) * 2).toString(16).padStart(2,'0');
  return {
    bg: DARK_BGS[n % DARK_BGS.length], surface:'#191D26',
    ink:'#F2F2F5', sub:'#9096A6', accent, line:'#'+g+g+g,
    second: base.second, deep:'#0A0A0A'
  };
}

/* 删掉画面上印着的「配置 / 布局 / 动画 / 编号 / 实验室」说明文字：
   独立审核指出它既破坏盲评，又让 100 张图共享同一套「设计说明卡」外观。
   只删 font-size<=12 且命中关键词的 <text>，六行正文（>=14px）不受影响。 */
let metaRemoved = 0;
function stripMeta(svg){
  return svg.replace(/<text\b([^>]*)>([\s\S]*?)<\/text>/g, (m, attrs, inner) => {
    const fs = Number((attrs.match(/font-size="(\d+)"/) || [])[1] || 0);
    const txt = inner.replace(/<[^>]*>/g, '');
    const isMeta = fs > 0 && fs <= 12 &&
      /配置|布局|动画|\/ 100|SVG LAB|GRID|S T Y L E|N O T E|STYLE|No\.|LAB|·/.test(txt);
    if (isMeta) { metaRemoved++; return ''; }
    return m;
  });
}

fs.mkdirSync(STYLES_DIR, { recursive:true });
const catalog = [];
for (let fi=0; fi<ALL_FAMILIES.length; fi++){
  const fam = ALL_FAMILIES[fi];
  for (let v=0; v<VARIANTS; v++){
    const n = fi*VARIANTS + v + 1, id = String(n).padStart(3,'0');
    const P = paletteFor(fam, n);
    const font = FONTS[(n + fi) % FONTS.length];
    const c = {
      id, n, v, fi, fam, P, font:font.v, fontLabel:font.label,
      plan: fam.plans[v], deco: fam.decos[v],
      tag: TAGS[(n*3 + fi) % TAGS.length]
    };
    const { h, body } = fam.render(c);
    const raw = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 680 ${h}" width="100%" preserveAspectRatio="xMidYMin meet" style="display:block;" font-family="${font.v}">\n  ${body.trim()}\n</svg>`;
    const svg = stripMeta(raw);
    const anims = (svg.match(/<animate(?:Transform|Motion)?\b/gi) || []).length;

    fs.writeFileSync(path.join(STYLES_DIR, id + '.svg'), svg + '\n', 'utf8');
    catalog.push({
      id, n, family:fam.key, familyName:fam.name, en:fam.en, tag:c.tag,
      name:`${fam.name} · ${c.tag}`, tagline:fam.tagline,
      badge:`${fam.en} / ${String(v+1).padStart(2,'0')}`, accent:P.accent,
      palette:P, fontLabel:font.label, height:h, animations:anims,
      params:{
        config:`${P.bg} / ${P.surface} / ${P.accent} · ${font.label} · 60-30-10`,
        layout:`${fam.tagline} · 变体 ${v+1}「${c.tag}」· 画布 680×${h}`,
        motion:`正文 ${c.plan} 编排 + 装饰 ${c.deco} · ${anims} 个 SMIL 动画标签`
      },
      motionPlan:c.plan, decoPlan:c.deco, file:`styles/${id}.svg`, svg
    });
  }
}

fs.writeFileSync(path.join(STYLES_DIR, 'catalog.json'),
  JSON.stringify({ version:'0.3.0', generated:'100 styles / 20 composition prototypes × 5 variants',
                   contract:'WeChat MP SVG whitelist · no id/class/style/defs/filter/gradient · SMIL only',
                   lines:LINES, items:catalog.map(({svg, ...rest})=>rest) }, null, 2) + '\n', 'utf8');

/* ---------- 注入 index.html：STYLES 数组 + 100 个源码块 ---------- */
let page = fs.readFileSync(INDEX, 'utf8').replace(/\r\n/g, '\n');
const jsStyles = catalog.map(({id,name,tagline,badge,accent,params,family,familyName}) => ({
  id, name, tagline, badge, accent, family, familyName, params
}));

const s1 = page.indexOf('const STYLES = [');
const e1 = page.indexOf('\n];', s1) + 3;
if (s1 < 0 || e1 < 3) throw new Error('找不到 STYLES 数组');
page = page.slice(0, s1) + 'const STYLES = ' + JSON.stringify(jsStyles, null, 2) + ';' + page.slice(e1);

const mainStart = page.lastIndexOf('\n<script>\n');
const s2 = page.indexOf('<script type="text/plain" id="src-');
const e2 = page.lastIndexOf('</script>', mainStart) + '</script>'.length;
if (mainStart < 0 || s2 < 0 || e2 < 10 || s2 >= mainStart) throw new Error('找不到 SVG 源码块区间');
const blocks = catalog.map(x => `<script type="text/plain" id="src-${x.id}">${x.svg}</script>`).join('\n');
page = page.slice(0, s2) + blocks + page.slice(e2);

fs.writeFileSync(INDEX, page, 'utf8');

/* ---------- 独立客观校验（不依赖页面脚本） ---------- */
const BANNED = [
  [/<style[\s>]/i,'<style>'], [/<script[\s>]/i,'<script>'],
  [/<foreignObject[\s>]/i,'foreignObject'], [/<image[\s>]/i,'<image>'],
  [/linearGradient|radialGradient|clipPath|<pattern|<filter[\s>]|<use[\s>]|mpath/i,'渐变/滤镜/剪切'],
  [/\sid\s*=/i,'id'], [/\sclass\s*=/i,'class'], [/\son[a-z]+\s*=/i,'on* 事件'],
  [/javascript:|data:|vbscript:/i,'危险协议'],
  [/@keyframes|@font-face|\banimation:|\btransition:|\bposition:/i,'CSS 动画/定位'],
  [/var\(|currentColor/i,'CSS 变量'], [/\shref\s*=/i,'外部 href']
];
const ANIM_OK = new Set(['x','y','width','height','r','opacity','d','points','fill','stroke','stroke-width','stroke-linecap','stroke-dashoffset']);
const TRANS_OK = new Set(['translate','scale','rotate','skewX','skewY']);
let failures = 0;
const byFam = {}, byPlan = {}, byFont = {}, byDeco = {};
for (const it of catalog){
  const s = it.svg, errs = [];
  for (const [re,label] of BANNED) if (re.test(s)) errs.push('禁用项:'+label);
  for (const t of s.match(/<animate(?:Transform|Motion)?\b[^>]*>/gi) || []){
    const an = (t.match(/attributeName\s*=\s*"([^"]+)"/i)||[])[1];
    const low = t.toLowerCase();
    if (low.indexOf('<animatetransform') === 0){
      const ty = (t.match(/\btype\s*=\s*"([^"]+)"/i)||[])[1];
      if (an !== 'transform' || !TRANS_OK.has(ty)) errs.push('animateTransform:'+an+'/'+ty);
    } else if (low.indexOf('<animatemotion') === 0){
      if (an !== 'path') errs.push('animateMotion:'+an);
    } else if (!ANIM_OK.has(an)) errs.push('animate:'+an);
  }
  if (/<(?:rect|text|g|line|circle|path|svg)\b[^>]*\b(?:opacity|height)\s*=\s*"0"/i.test(s)) errs.push('静态初始态被隐藏');
  for (const l of LINES) if (!s.includes(l)) errs.push('缺原文行:'+l);
  const stripped = s.replace(/<animate(?:Transform|Motion)?\b[^>]*>/gi,'');
  for (const l of LINES) if (!stripped.includes(l)) errs.push('移除动画后丢字:'+l);
  if (!/<svg[^>]*viewBox=/i.test(s) || !/<svg[^>]*\swidth=/i.test(s)) errs.push('缺 viewBox/width');
  if (errs.length){ failures++; console.log('FAIL ' + it.id + ' ' + errs.slice(0,3).join(' | ')); }
  byFam[it.family] = (byFam[it.family]||0)+1;
  byPlan[it.motionPlan] = (byPlan[it.motionPlan]||0)+1;
  byFont[it.fontLabel] = (byFont[it.fontLabel]||0)+1;
  byDeco[it.decoPlan] = (byDeco[it.decoPlan]||0)+1;
}
const uniqueSvg = new Set(catalog.map(x=>x.svg)).size;
const uniquePalette = new Set(catalog.map(x=>JSON.stringify(x.palette))).size;
console.log('生成 ' + catalog.length + ' 个风格 · ' + Object.keys(byFam).length + ' 个构图原型 · 每原型 ' + VARIANTS + ' 变体');
console.log('结构唯一 SVG: ' + uniqueSvg + '/' + catalog.length + ' · 唯一色板: ' + uniquePalette + '/' + catalog.length + ' · 删除设计说明文字 ' + metaRemoved + ' 处');
console.log('字体分布 ' + JSON.stringify(byFont) + ' · 正文动效 ' + JSON.stringify(byPlan));
console.log('装饰动效 ' + JSON.stringify(byDeco));
const svgBytes = catalog.reduce((n,x)=>n+Buffer.byteLength(x.svg,'utf8'),0);
console.log('总字节 ' + (svgBytes/1024).toFixed(1) + ' KiB (UTF-8) · 动画标签 ' + catalog.reduce((n,x)=>n+x.animations,0));
console.log('index.html ' + (fs.statSync(INDEX).size/1024).toFixed(1) + ' KiB');
console.log(failures ? `\n${failures} 个风格校验失败` : `\n${catalog.length}/${catalog.length} 全部通过白名单 + 静态自洽 + 原文完整校验`);
if (failures || uniqueSvg !== catalog.length || uniquePalette !== catalog.length) process.exitCode = 1;
