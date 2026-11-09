/**
 * 生成社交分享卡：og-image.png (1200x630) 与 social-preview.png (1280x640)。
 *
 * 做法：先输出两份零依赖的 HTML 卡片源到 assets/，再调用本机 Edge 无头模式栅格化。
 * 注意：Edge 的截图是异步落盘的，命令返回时文件可能尚未写完，必须轮询 + 校验 PNG 头。
 * 若本机没有 Edge，脚本仍会生成 HTML 源并打印手动截图命令，不阻塞其他流程。
 *
 * 运行：node tools/make-cards.mjs
 */
import fs from 'node:fs';
import path from 'node:path';
import os from 'node:os';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { spawnSync } from 'node:child_process';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const ASSETS = path.join(ROOT, 'assets');
fs.mkdirSync(ASSETS, { recursive: true });

const EDGE_CANDIDATES = [
  'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe',
  'C:\\Program Files\\Microsoft\\Edge\\Application\\msedge.exe',
  '/usr/bin/microsoft-edge',
  '/usr/bin/chromium',
];
const edge = EDGE_CANDIDATES.find(p => fs.existsSync(p)) || null;

function cardHTML(w, h) {
  const pad = Math.round(w * 0.072);
  const title = Math.round(h * 0.102);
  const sub = Math.round(h * 0.033);
  const eyebrow = Math.round(h * 0.024);
  const foot = Math.round(h * 0.028);
  const cardH = Math.round(h * 0.200);
  const gap = Math.round(w * 0.018);
  const cardW = Math.round((w - pad * 2 - gap * 2) / 3);
  const cards = [
    { name: '瑞士网格', bars: [0.86, 0.62, 0.74, 0.48], accent: '#635BFF', bg: '#F5F5F4' },
    { name: '分屏对照', bars: [0.55, 0.78, 0.42, 0.68], accent: '#B4462F', bg: '#18181B' },
    { name: '满幅海报', bars: [0.94, 0.38, 0.70, 0.52], accent: '#2F6B4F', bg: '#F0EFFF' },
  ];
  const cardDivs = cards.map((c, i) => {
    const dark = i === 1;
    const ink = dark ? '#FAFAF9' : '#18181B';
    const bars = c.bars.slice(0, 3).map((v, j) =>
      `<div style="height:${j === 0 ? 6 : 5}px;width:${Math.round(v * 100)}%;background:${j === 0 ? c.accent : (dark ? '#57534E' : '#D6D3D1')};border-radius:2px;margin-bottom:${j === 0 ? 8 : 6}px"></div>`
    ).join('');
    return `<div style="width:${cardW}px;height:${cardH}px;background:${c.bg};border:1px solid ${dark ? '#3F3F46' : '#E7E5E4'};border-radius:8px;padding:${Math.round(h * 0.026)}px;box-sizing:border-box;display:flex;flex-direction:column;justify-content:space-between;overflow:hidden">
      <div><div style="font-size:${Math.round(h * 0.020)}px;color:${c.accent};font-weight:700;letter-spacing:.08em;margin-bottom:${Math.round(h * 0.016)}px">0${i + 1}</div>${bars}</div>
      <div style="font-size:${Math.round(h * 0.026)}px;color:${ink};font-weight:600">${c.name}</div>
    </div>`;
  }).join('');

  return `<!DOCTYPE html>
<html lang="zh-CN"><head><meta charset="UTF-8">
<style>
  *{margin:0;padding:0;box-sizing:border-box}
  html,body{width:${w}px;height:${h}px;overflow:hidden;background:#FAFAF9;
    font-family:"PingFang SC","Microsoft YaHei","Hiragino Sans GB",-apple-system,"Segoe UI",sans-serif;
    -webkit-font-smoothing:antialiased;color:#18181B}
  .wrap{width:${w}px;height:${h}px;padding:${Math.round(pad * 0.88)}px ${pad}px ${Math.round(pad * 0.52)}px;display:flex;flex-direction:column;position:relative}
  .top{width:100%;height:6px;background:#635BFF;border-radius:3px;position:absolute;left:0;top:0}
  .eyebrow{font-size:${eyebrow}px;letter-spacing:.16em;color:#A8A29E;font-weight:700;text-transform:uppercase;margin-top:${Math.round(h * 0.014)}px}
  h1{font-size:${title}px;line-height:1.22;letter-spacing:-.025em;margin-top:${Math.round(h * 0.022)}px}
  h1 em{font-style:normal;color:#635BFF}
  .sub{font-size:${sub}px;color:#57534E;margin-top:${Math.round(h * 0.018)}px;line-height:1.6}
  .chips{margin-top:${Math.round(h * 0.020)}px;display:flex;gap:8px}
  .chip{font-size:${Math.round(h * 0.024)}px;padding:5px 13px;border:1px solid #D6D3D1;border-radius:999px;color:#57534E;background:#FFFFFF}
  .cards{margin-top:auto;display:flex;gap:${gap}px}
  .foot{margin-top:${Math.round(h * 0.020)}px;display:flex;justify-content:space-between;align-items:center;
    font-size:${foot}px;color:#A8A29E;border-top:1px solid #E7E5E4;padding-top:${Math.round(h * 0.016)}px}
  .foot b{color:#18181B;font-weight:600}
</style></head><body>
<div class="wrap">
  <div class="top"></div>
  <div class="eyebrow">WeChat MP SVG Skill · v0.3.0 · MIT</div>
  <h1>公众号 SVG 排版<br><em>100 种风格，一键复制进微信</em></h1>
  <div class="sub">纯 SMIL 声明式动画 · 无 JS / 无 style / 无 id · 20 个构图原型 · 整篇富文本一键复制</div>
  <div class="chips"><span class="chip">100 模板</span><span class="chip">930 动画</span><span class="chip">白名单合规</span><span class="chip">开源免费</span></div>
  <div class="cards">${cardDivs}</div>
  <div class="foot"><span>先看审美，不评价能力</span><span><b>github.com/121212165/wechat-mp-svg</b></span></div>
</div>
</body></html>`;
}

const targets = [
  { w: 1200, h: 630, html: 'og-1200x630.html', png: 'og-image.png' },
  { w: 1280, h: 640, html: 'social-1280x640.html', png: 'social-preview.png' },
];

for (const t of targets) {
  const htmlPath = path.join(ASSETS, t.html);
  fs.writeFileSync(htmlPath, cardHTML(t.w, t.h), 'utf8');
  console.log(`HTML  ${t.html}  ${fs.statSync(htmlPath).size} B`);
}

function pngSize(file) {
  const b = fs.readFileSync(file);
  if (b.length < 24 || b[0] !== 0x89 || b.toString('ascii', 1, 4) !== 'PNG') return null;
  return { w: b.readUInt32BE(16), h: b.readUInt32BE(20), bytes: b.length };
}

if (!edge) {
  console.log('\n[WARN] 未找到 Edge/Chromium，仅生成 HTML 卡片源。');
  console.log('手动截图：用浏览器无头模式打开 assets/*.html，窗口尺寸设为对应像素即可。');
} else {
  console.log('\nEdge: ' + edge);
  for (const t of targets) {
    const out = path.join(ROOT, t.png);
    try { fs.unlinkSync(out); } catch {}
    const profile = path.join(os.tmpdir(), `wb-card-${t.w}x${t.h}`);
    const url = pathToFileURL(path.join(ASSETS, t.html)).href;
    const args = [
      '--headless=new', '--disable-gpu', '--no-sandbox', '--hide-scrollbars',
      '--disable-dev-shm-usage', '--force-device-scale-factor=1',
      `--user-data-dir=${profile}`, '--virtual-time-budget=5000',
      `--window-size=${t.w},${t.h}`, `--screenshot=${out}`, url,
    ];
    const r = spawnSync(edge, args, { timeout: 90000, windowsHide: true, stdio: 'ignore' });
    // Edge 截图异步落盘：轮询最多 20 秒，且必须校验 PNG 头
    let size = null;
    for (let i = 0; i < 40; i++) {
      if (fs.existsSync(out)) {
        size = pngSize(out);
        if (size && size.bytes > 10000) break;
      }
      spawnSync(process.execPath, ['-e', 'setTimeout(()=>{},500)'], { stdio: 'ignore' });
    }
    if (size && size.w === t.w && size.h === t.h) {
      console.log(`PNG   ${t.png}  ${size.w}x${size.h}  ${(size.bytes / 1024).toFixed(1)} KiB  OK`);
    } else {
      console.log(`[FAIL] ${t.png}: exit=${r.status} err=${r.error && r.error.message} size=${JSON.stringify(size)}`);
      console.log('       可手动用 Edge 打开 assets/' + t.html + ' 截图，或稍后重跑本脚本。');
    }
  }
}
