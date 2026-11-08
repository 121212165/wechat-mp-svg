/**
 * 生成「新 / 旧视觉对照联系表」。
 *
 * v0.2.0 的 SVG 从 git commit ea54fc8 取回，v0.3.0 从当前 styles/ 读取，
 * 两版取相同编号（每个构图原型 / 流派的首张）：001, 006, 011 … 096。
 * 产出两个可离线打开的 HTML，用 Edge 无头截图即可得到视觉对照证据。
 *
 * 用法：node tools/contact-sheet.mjs
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { execFileSync } from 'node:child_process';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const BASE_COMMIT = 'ea54fc8';
const picks = Array.from({ length: 20 }, (_, i) => String(i * 5 + 1).padStart(3, '0'));

const head = (title, note) => `<!doctype html>
<meta charset="utf-8">
<title>${title}</title>
<style>
  *{box-sizing:border-box}
  body{margin:0;padding:24px;background:#F1EFE8;font:14px/1.5 -apple-system,BlinkMacSystemFont,'Segoe UI','Microsoft YaHei',sans-serif;color:#2C2C2A}
  h1{font-size:20px;font-weight:500;margin:0 0 4px}
  p{margin:0 0 20px;color:#5F5E5A;font-size:13px}
  .grid{display:grid;grid-template-columns:repeat(4,1fr);gap:14px;align-items:start}
  .cell{background:#fff;border:1px solid #D3D1C7;overflow:hidden}
  .cap{padding:6px 10px;border-bottom:1px solid #D3D1C7;font-size:12px;color:#5F5E5A;display:flex;justify-content:space-between}
  .cell svg{display:block;width:100%;height:auto}
</style>
<h1>${title}</h1>
<p>${note}</p>
<div class="grid">`;

const readNew = id => fs.readFileSync(path.join(ROOT, 'styles', id + '.svg'), 'utf8');
const readOld = id => execFileSync('git', ['-C', ROOT, 'show', `${BASE_COMMIT}:styles/${id}.svg`], { encoding: 'utf8' });

function build(title, note, reader) {
  let cells = '';
  for (const id of picks) {
    const svg = reader(id).trim();
    const h = (svg.match(/viewBox="0 0 680 (\d+)"/) || [])[1] || '?';
    cells += `<div class="cell"><div class="cap"><span>${id}</span><span>canvas 680 × ${h}</span></div>${svg}</div>`;
  }
  return head(title, note) + cells + '</div>';
}

const newOut = path.join(ROOT, 'contact-sheet-v030.html');
const oldOut = path.join(ROOT, 'contact-sheet-v020.html');
fs.writeFileSync(newOut, build(
  'v0.3.0 · 20 个构图原型各取 1 张',
  '独立审核判定 v0.2.0 视觉可区分度 2.20/5 后重构：20 套信息架构 × 5 变体，画布高度 320–760，画面上不再印设计参数说明。',
  readNew), 'utf8');
fs.writeFileSync(oldOut, build(
  'v0.2.0 · 同编号 20 张（审核基线）',
  '取自 git commit ea54fc8：10 个流派 × 10 参数变体，画面上印有「配置 / 布局 / 动画」说明文字。',
  readOld), 'utf8');

console.log('写出 ' + path.basename(newOut) + ' / ' + path.basename(oldOut));
console.log('抽样编号 ' + picks.join(', '));
console.log('v0.3.0 画布高度集合: ' + [...new Set(picks.map(id => (readNew(id).match(/viewBox="0 0 680 (\d+)"/) || [])[1]))].sort((a, b) => a - b).join(', '));
