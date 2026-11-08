/**
 * 页面逻辑的独立验证（不依赖浏览器视觉）。
 *
 * 用一个最小 DOM stub 在 Node 里真实执行 index.html 的主脚本，检查：
 * 100 风格目录 / 分页懒渲染 / 流派筛选 / 收藏 / 复制范围 /
 * 全文预览 / 合规自检 / 强调色 / 静止终态 / 内容开关。
 *
 * 注意：这是逻辑验证，不等价于浏览器视觉验收，也不等价于公众号后台验收。
 * 用法：node tools/verify-page.mjs
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const page = fs.readFileSync(path.join(ROOT, 'index.html'), 'utf8').replace(/\r\n/g, '\n');
// 必须按行边界定位：自检规则的文案里本身含有 "<script>" 字面量，
// 用 lastIndexOf('<script>') 会误命中 JS 字符串而不是真正的脚本块。
const marker = '\n<script>\n';
const s = page.lastIndexOf(marker) + marker.length;
const e = page.indexOf('\n</script>', s);
if (s < marker.length || e < 0) throw new Error('找不到主脚本块');
const js = page.slice(s, e);

class El {
  constructor(id){
    this.id = id; this.innerHTML = ''; this.textContent = ''; this.className = '';
    this.checked = true; this.hidden = false; this.value = ''; this.disabled = false;
    this.dataset = {}; this.style = { cssText: '' }; this.attrs = {}; this.listeners = {};
  }
  addEventListener(t, fn){ (this.listeners[t] ||= []).push(fn); }
  setAttribute(k, v){ this.attrs[k] = v; }
  hasAttribute(k){ return Object.prototype.hasOwnProperty.call(this.attrs, k); }
  removeAttribute(k){ delete this.attrs[k]; }
  appendChild(){} removeChild(){} select(){} click(){}
  fire(t, ev){ (this.listeners[t] || []).forEach(fn => fn(ev)); }
}
const els = new Map();
const doc = {
  getElementById(id){ if (!els.has(id)) els.set(id, new El(id)); return els.get(id); },
  querySelectorAll(){ return []; },
  createElement(){ return new El('created'); },
  body: { appendChild(){}, removeChild(){} },
  execCommand(){ return true; }
};
const win = {
  getSelection(){ return { removeAllRanges(){}, addRange(){} }; },
  scrollTo(){}
};
const nav = { clipboard: null };
const get = id => doc.getElementById(id);

// 浏览器会解析 <script type="text/plain"> 并提供 textContent；stub 不会，需回填 100 个源码块。
let prefilled = 0;
for (const m of page.matchAll(/<script type="text\/plain" id="src-([^"]+)">([\s\S]*?)<\/script>/g)) {
  get('src-' + m[1]).textContent = m[2].trim(); prefilled++;
}

const t0 = Date.now();
new Function('document', 'window', 'navigator', 'setTimeout', 'clearTimeout', js)(
  doc, win, nav, () => 0, () => {}
);
const checks = [];
const ck = (label, ok, detail) => checks.push({ label, ok, detail: detail || '' });
const svgCount = h => (h.match(/<svg\b/g) || []).length;
const cardCount = () => (get('cards').innerHTML.match(/class="card"/g) || []).length;
const stat = () => get('wholeStat').textContent;
const preview = () => get('wholePreview').innerHTML;

ck('100 个 SVG 源码块已回填', prefilled === 100, '实测 ' + prefilled);
ck('目录显示 20 个构图原型 + 全部', (get('familyBar').innerHTML.match(/class="fam"/g) || []).length === 21);
ck('初始渲染 12 张卡片（分页懒渲染）', cardCount() === 12, '实测 ' + cardCount());
ck('分页控件共 9 页', (get('pager').innerHTML.match(/data-p="\d+"/g) || []).length === 11,
   '9 页码 + 上/下一页');
let allAuditOK = true, allPreviewOK = true;
for (let i=1;i<=12;i++){
  const id = String(i).padStart(3,'0');
  if (get('preview-'+id).innerHTML.indexOf('<svg') < 0) allPreviewOK = false;
  const a = get('audit-'+id).innerHTML;
  if (a.indexOf('合规自检') < 0 || a.indexOf('项失败') >= 0) allAuditOK = false;
}
ck('当前页 12 张预览均注入 SVG', allPreviewOK);
ck('当前页 12 张合规自检均通过', allAuditOK);

ck('全文预览默认限量 6 张（避免 100 张动画同播）', svgCount(preview()) === 6,
   '实测 ' + svgCount(preview()) + ' 张');
ck('全文预览标注省略数量', preview().indexOf('预览仅显示前 6 个风格') >= 0);
ck('全文预览含原文', preview().indexOf('我发现HY 4 svg 能力不错') >= 0);
ck('全文预览含操作说明与来源', preview().indexOf('资源引用') >= 0 && preview().indexOf('wechat-mp-html-source-helper') >= 0);
ck('全文合规自检通过且逐张校验 100 张', get('wholeAudit').innerHTML.indexOf('✓ 全文合规自检') >= 0 &&
   get('wholeAudit').innerHTML.indexOf('100 张 SVG 逐张校验') >= 0);
ck('统计信息显示 100 张 SVG', stat().indexOf('100 张 SVG') >= 0, stat());
ck('大范围体积警告已显示', get('sizeWarn').hidden === false && get('sizeWarn').textContent.indexOf('100 张极可能') >= 0);

/* 联动：强调色 */
get('accentSeg').fire('click', { target: { closest: () => ({ dataset: { i: '1' } }) } });
ck('切换强调色后全文同步', stat().indexOf('森绿') >= 0, stat());
ck('切换强调色后 SVG 同步换色', preview().indexOf('#2F6B4F') >= 0);

/* 联动：静止终态 */
get('motionSeg').fire('click', { target: { closest: () => ({ dataset: { on: '0' } }) } });
ck('切到静止终态后全文同步', stat().indexOf('静止终态') >= 0, stat());
ck('静止终态下无 animate 标签', !/<animate/i.test(preview()));
ck('静止终态下正文仍完整', preview().indexOf('先看看审美如何') >= 0);

/* 联动：流派筛选 */
get('familyBar').fire('click', { target: { closest: () => ({ dataset: { f: 'swiss' } }) } });
ck('筛选瑞士网格后剩 5 个风格', cardCount() === 5 && get('familyBar').innerHTML.indexOf('当前 5 个风格') >= 0,
   '实测 ' + cardCount());
ck('筛选后全文范围仍可选', get('wholeStat').textContent.length > 0);

/* 联动：分页 */
get('familyBar').fire('click', { target: { closest: () => ({ dataset: { f: 'all' } }) } });
get('pager').fire('click', { target: { closest: () => ({ dataset: { p: '2' }, disabled:false }) } });
ck('第 2 页渲染 12 张且从 013 开始', cardCount() === 12 && get('cards').innerHTML.indexOf('013') >= 0);

/* 联动：复制范围 */
get('scopeSel').fire('change', { target: { value: 'page' } });
ck('范围=当前页时全文为 12 张', stat().indexOf('12 张 SVG') >= 0, stat());
ck('范围缩到 12 张后不再显示体积警告', get('sizeWarn').hidden === true);
get('scopeSel').fire('change', { target: { value: 'favorites' } });
ck('范围=收藏且未收藏时为 0 张', stat().indexOf('0 张 SVG') >= 0, stat());
ck('0 张时全文自检仍通过', get('wholeAudit').innerHTML.indexOf('✓ 全文合规自检') >= 0);

/* 联动：收藏 */
get('cards').fire('click', { target: { closest: () => ({ dataset: { act:'fav', id:'013' } }) } });
ck('收藏后目录计数更新', get('familyBar').innerHTML.indexOf('1 个收藏') >= 0);
ck('收藏后范围=收藏时有 1 张', stat().indexOf('1 张 SVG') >= 0, stat());

/* 联动：内容开关 */
get('scopeSel').fire('change', { target: { value: 'all' } });
get('includeOps').checked = false;
get('includeOps').fire('change', {});
ck('取消勾选后来源段落被移除', preview().indexOf('资源引用') < 0);
ck('取消勾选后预览 SVG 未丢失', svgCount(preview()) === 6);

const fails = checks.filter(c => !c.ok);
for (const c of checks) console.log('  ' + (c.ok ? 'PASS' : 'FAIL') + '  ' + c.label + (c.detail ? ' · ' + c.detail : ''));
console.log('\n执行耗时 ' + ((Date.now()-t0)/1000).toFixed(1) + 's · ' +
  (fails.length ? `${fails.length} 项失败` : `全部通过（${checks.length} 项）`));
if (fails.length) process.exitCode = 1;
