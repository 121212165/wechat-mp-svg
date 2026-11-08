/**
 * v0.3.0 新增的 10 个构图原型。
 *
 * 独立审核（AUDIT-REPORT.md）判定 v0.2.0 的「10 骨架 × 10 参数变体」视觉可区分度只有 2.20/5，
 * 25 张抽样只落在约 9 个版式骨架上。这里补的不是新配色，而是**新的信息架构**：
 * 竖排卷轴 / 居中诗页 / 分屏对照 / 卡片阶梯 / 字阶 / 清单表格 / 对角 / 满幅海报 / 便签 / 横幅飘带，
 * 且画布高度横跨 320–760，长宽比本身就是可区分信号。
 *
 * 与 v0.2.0 的两个刻意差异：
 *   1. 画面上不再印「配置 60-30-10 · 布局 N 栏 · 动画 fade」这类设计说明文字（破盲 + 让所有图同构）；
 *   2. 六行原文不再统一左对齐等距排列，每个原型用不同的 x/y/字号/对齐/容器处理。
 *
 * 硬约束不变：纯色 hex、无 id/class/style/defs/渐变/滤镜/foreignObject/外链；
 * 动画只用白名单 attributeName；静态终态自洽；六行原文逐行完整（可被独立校验器逐字比对）。
 */
import { LINES, esc, A, T } from './families.mjs';

const SPLINE = 'calcMode="spline" keyTimes="0;1" keySplines="0.25 1 0.5 1"';
const fade = (begin, d = '0.6s') => `<animate attributeName="opacity" values="0;1" dur="${d}" begin="${begin}" fill="freeze"/>`;

/** 按位置表排出六行原文；每行仍是完整字符串，便于逐字校验 */
function lines(c, spec, o = {}) {
  const plan = o.plan || c.plan, t0 = o.t0 ?? 0.12, step = o.step ?? 0.07;
  return LINES.map((t, i) => {
    const s = spec[i];
    const an = s.anchor ? ` text-anchor="${s.anchor}"` : '';
    const rot = s.rot ? ` transform="rotate(${s.rot} ${s.x} ${s.y})"` : '';
    const ff = s.serif ? ' font-family="Georgia, Songti SC, SimSun, serif"'
             : s.mono ? ' font-family="Consolas, Menlo, monospace"' : '';
    const wt = i === 4 ? ' font-weight="600"' : '';
    const col = i === 4 ? c.P.accent : (s.color || o.color || c.P.ink);
    const anim = T(plan, (t0 + i * step).toFixed(2) + 's', { dy: o.slide || 18, from: s.x - 36, to: s.x });
    return `<text x="${s.x}" y="${s.y}" font-size="${s.size}" fill="${col}"${an}${rot}${ff}${wt}>${esc(t)}${anim}</text>`;
  }).join('\n  ');
}

/* 11 竖排卷轴：六条横向色带纵向堆叠，x 阶梯错位，窄高画布 */
function scroll(c) {
  const { P, v } = c, H = 760, w = 460 + (v % 3) * 40, x0 = 56 + (v % 3) * 12;
  const bars = LINES.map((_, i) => {
    const x = x0 + i * 20, y = 118 + i * 100, ww = w - i * 16;
    return `<rect x="${x}" y="${y}" width="${ww}" height="70" fill="${i % 2 ? P.surface : P.bg}" stroke="${P.line}" stroke-width="1">${A(c.deco, (i * 0.08).toFixed(2) + 's', { w: ww })}</rect>` +
      `<rect x="${x}" y="${y}" width="4" height="70" fill="${i === 4 ? P.accent : P.second}"/>`;
  }).join('\n  ');
  const spec = LINES.map((_, i) => ({ x: x0 + i * 20 + 20, y: 118 + i * 100 + 44, size: 16 + (v % 2) }));
  return { h: H, body: `
  <rect x="0" y="0" width="680" height="${H}" fill="${P.bg}"/>
  <rect x="0" y="0" width="680" height="6" fill="${P.accent}">${A('grow', '0s', { w: 680 })}</rect>
  <text x="${x0}" y="76" font-size="26" fill="${P.ink}">先看审美${fade('0s')}</text>
  <line x1="${x0}" y1="88" x2="624" y2="88" stroke="${P.ink}" stroke-width="1"/>
  ${bars}
  ${lines(c, spec, { plan: c.plan, t0: 0.18, step: 0.08 })}
  <line x1="${x0}" y1="${H - 40}" x2="624" y2="${H - 40}" stroke="${P.line}" stroke-width="1"/>` };
}

/* 12 居中诗页：方版 + 大留白 + 圆环，全部居中对齐 */
function ode(c) {
  const { P, v } = c, H = 680, gap = 62 + (v % 2) * 6;
  const spec = LINES.map((_, i) => ({ x: 340, y: 218 + i * gap, size: i === 4 ? 25 : 18 + (v % 2), anchor: 'middle', serif: v % 2 === 0 }));
  return { h: H, body: `
  <rect x="0" y="0" width="680" height="${H}" fill="${P.bg}"/>
  <circle cx="340" cy="340" r="${248 + (v % 3) * 12}" fill="none" stroke="${P.line}" stroke-width="1">${fade('0s')}</circle>
  <circle cx="340" cy="340" r="4" fill="${P.accent}"/>
  <line x1="40" y1="120" x2="150" y2="120" stroke="${P.accent}" stroke-width="2">${A('grow', '0s', { w: 110 })}</line>
  <line x1="530" y1="${H - 120}" x2="640" y2="${H - 120}" stroke="${P.accent}" stroke-width="2"/>
  ${lines(c, spec, { plan: c.plan, t0: 0.16, step: 0.09, slide: 12 })}` };
}

/* 13 分屏对照：左右两半不同底色，前三行 / 后三行分置 */
function split(c) {
  const { P, v } = c, H = 460, cut = 316 + (v % 3) * 16;
  const L = LINES.map((_, i) => ({ x: 36, y: 148 + (i % 3) * 88, size: 15, color: P.ink }));
  const R = LINES.map((_, i) => ({ x: cut + 28, y: 148 + (i % 3) * 88, size: 15, color: P.bg }));
  const spec = [L[0], L[1], L[2], R[3], R[4], R[5]];
  return { h: H, body: `
  <rect x="0" y="0" width="680" height="${H}" fill="${P.surface}"/>
  <rect x="0" y="0" width="${cut}" height="${H}" fill="${P.bg}">${A('grow', '0s', { w: cut })}</rect>
  <rect x="${cut}" y="0" width="${680 - cut}" height="${H}" fill="${P.ink}"/>
  <rect x="${cut}" y="0" width="3" height="${H}" fill="${P.accent}">${A('rise', '0s', { h: H })}</rect>
  <text x="36" y="76" font-size="30" fill="${P.ink}">A${fade('0s')}</text>
  <text x="${cut + 28}" y="76" font-size="30" fill="${P.bg}">B${fade('0.1s')}</text>
  ${lines(c, spec, { plan: c.plan, t0: 0.2, step: 0.08 })}` };
}

/* 14 卡片阶梯：六张错位卡片，每张一行 */
function cascade(c) {
  const { P, v } = c, H = 620;
  const cards = LINES.map((_, i) => {
    const x = 44 + i * (18 + (v % 2) * 4), y = 92 + i * 82, w = 500 - i * 10;
    return `<rect x="${x}" y="${y}" width="${w}" height="66" fill="${P.bg}" stroke="${i === 4 ? P.accent : P.ink}" stroke-width="${i === 4 ? 2 : 1}">${A(c.deco, (i * 0.07).toFixed(2) + 's', { w })}</rect>` +
      `<rect x="${x}" y="${y}" width="6" height="66" fill="${i === 4 ? P.accent : P.second}"/>`;
  }).join('\n  ');
  const spec = LINES.map((_, i) => ({ x: 44 + i * (18 + (v % 2) * 4) + 22, y: 92 + i * 82 + 41, size: 15 + (v % 2) }));
  return { h: H, body: `
  <rect x="0" y="0" width="680" height="${H}" fill="${P.surface}"/>
  <text x="44" y="56" font-size="13" fill="${P.sub}">01 — 06 / 阶梯卡片${fade('0s')}</text>
  ${cards}
  ${lines(c, spec, { plan: c.plan, t0: 0.16, step: 0.08 })}` };
}

/* 15 字阶：字号 14 → 34 递增，x 同步阶梯 */
function scale(c) {
  const { P, v } = c, H = 560;
  const spec = LINES.map((_, i) => ({ x: 48 + i * (14 + (v % 2) * 3), y: 116 + i * 76, size: 14 + i * 4, serif: v % 2 === 0 }));
  return { h: H, body: `
  <rect x="0" y="0" width="680" height="${H}" fill="${P.bg}"/>
  <rect x="0" y="0" width="12" height="${H}" fill="${P.accent}">${A('rise', '0s', { h: H })}</rect>
  <line x1="40" y1="72" x2="640" y2="72" stroke="${P.line}" stroke-width="1"/>
  ${lines(c, spec, { plan: c.plan, t0: 0.14, step: 0.09, slide: 14 })}
  <rect x="48" y="${H - 40}" width="${180 + v * 18}" height="3" fill="${P.accent}">${A('grow', '0.3s', { w: 180 + v * 18 })}</rect>` };
}

/* 16 清单表格：每行一条底线 + 序号列 */
function ledger(c) {
  const { P, v } = c, H = 540;
  const rows = LINES.map((_, i) => {
    const y = 116 + i * 68;
    return `<line x1="40" y1="${y + 16}" x2="640" y2="${y + 16}" stroke="${P.line}" stroke-width="1"/>` +
      `<text x="40" y="${y}" font-size="12" fill="${P.sub}">${String(i + 1).padStart(2, '0')}${fade((i * 0.05).toFixed(2) + 's')}</text>`;
  }).join('\n  ');
  const spec = LINES.map((_, i) => ({ x: 88, y: 116 + i * 68, size: 17 + (v % 2), mono: v % 2 === 1 }));
  return { h: H, body: `
  <rect x="0" y="0" width="680" height="${H}" fill="${P.bg}"/>
  <rect x="0" y="0" width="680" height="56" fill="${P.ink}"/>
  <text x="40" y="37" font-size="15" fill="${P.bg}">INDEX / 六行原文${fade('0s')}</text>
  <text x="640" y="37" font-size="12" fill="${P.bg}" text-anchor="end">${fade('0s')}</text>
  ${rows}
  ${lines(c, spec, { plan: c.plan, t0: 0.18, step: 0.08 })}` };
}

/* 17 对角构图：六行沿对角线递进，背景斜切色块 */
function diagonal(c) {
  const { P, v } = c, H = 600, dx = 44 + (v % 2) * 6;
  const spec = LINES.map((_, i) => ({ x: 56 + i * dx, y: 132 + i * 78, size: 16 + (v % 2), rot: -2 }));
  return { h: H, body: `
  <rect x="0" y="0" width="680" height="${H}" fill="${P.bg}"/>
  <rect x="-60" y="70" width="800" height="150" fill="${P.surface}" transform="rotate(-8 340 145)">${fade('0s')}</rect>
  <rect x="-60" y="${H - 190}" width="800" height="90" fill="${P.line}" transform="rotate(-8 340 ${H - 145})"/>
  <rect x="40" y="52" width="${100 + v * 16}" height="5" fill="${P.accent}">${A('grow', '0s', { w: 100 + v * 16 })}</rect>
  ${lines(c, spec, { plan: c.plan, t0: 0.16, step: 0.09 })}` };
}

/* 18 满幅海报：上部 2/3 反白巨字，下部六行紧凑小字 */
function poster(c) {
  const { P, v } = c, H = 700, cut = 400 + (v % 3) * 20;
  const spec = LINES.map((_, i) => ({ x: 48, y: cut + 56 + i * 36, size: 14 + (v % 2) }));
  return { h: H, body: `
  <rect x="0" y="0" width="680" height="${H}" fill="${P.bg}"/>
  <rect x="0" y="0" width="680" height="${cut}" fill="${P.accent}">${A('rise', '0s', { h: cut })}</rect>
  <text x="48" y="180" font-size="${78 + (v % 3) * 8}" fill="${P.bg}" font-weight="600">先看${fade('0s')}</text>
  <text x="48" y="290" font-size="${78 + (v % 3) * 8}" fill="${P.bg}" font-weight="600">审美${fade('0.1s')}</text>
  <line x1="48" y1="330" x2="632" y2="330" stroke="${P.bg}" stroke-width="2"/>
  <text x="48" y="368" font-size="16" fill="${P.bg}">不评价能力如何${fade('0.2s')}</text>
  ${lines(c, spec, { plan: c.plan, t0: 0.24, step: 0.06, slide: 12 })}` };
}

/* 19 便签：三张旋转便签，每张两行 */
function sticky(c) {
  const { P, v } = c, H = 540;
  const angles = [-3, 2, -2], xs = [52, 300, 150], ys = [96, 210, 336];
  const notes = [0, 1, 2].map(k => {
    const x = xs[k], y = ys[k], a = angles[k];
    return `<g transform="rotate(${a} ${x + 140} ${y + 62})">` +
      `<rect x="${x}" y="${y}" width="290" height="124" fill="${k === 1 ? P.surface : P.bg}" stroke="${P.line}" stroke-width="1">${A(c.deco, (k * 0.12).toFixed(2) + 's', { w: 290 })}</rect>` +
      `<rect x="${x + 120}" y="${y - 8}" width="52" height="16" fill="${P.accent}"/>` +
      `</g>`;
  }).join('\n  ');
  const spec = LINES.map((_, i) => {
    const k = Math.floor(i / 2), j = i % 2;
    return { x: xs[k] + 20, y: ys[k] + 52 + j * 40, size: 14, rot: angles[k] };
  });
  return { h: H, body: `
  <rect x="0" y="0" width="680" height="${H}" fill="${P.surface}"/>
  <line x1="0" y1="56" x2="680" y2="56" stroke="${P.line}" stroke-width="1"/>
  ${notes}
  ${lines(c, spec, { plan: c.plan, t0: 0.18, step: 0.09, slide: 10 })}` };
}

/* 20 横幅飘带：极宽画布，两列 × 三行 */
function ribbon(c) {
  const { P, v } = c, H = 320, cut = 340 + (v % 2) * 10;
  const spec = LINES.map((_, i) => ({ x: i < 3 ? 40 : cut + 24, y: 108 + (i % 3) * 66, size: 14 + (v % 2), serif: v % 2 === 0 }));
  return { h: H, body: `
  <rect x="0" y="0" width="680" height="${H}" fill="${P.bg}"/>
  <rect x="0" y="0" width="680" height="18" fill="${P.accent}">${A('grow', '0s', { w: 680 })}</rect>
  <rect x="0" y="${H - 18}" width="680" height="18" fill="${P.ink}"/>
  <rect x="0" y="60" width="680" height="8" fill="${P.surface}" transform="rotate(-2 340 64)"/>
  <line x1="${cut}" y1="40" x2="${cut}" y2="${H - 40}" stroke="${P.line}" stroke-width="1"/>
  <text x="40" y="52" font-size="12" fill="${P.sub}">01 — 03${fade('0s')}</text>
  <text x="${cut + 24}" y="52" font-size="12" fill="${P.sub}">04 — 06${fade('0s')}</text>
  ${lines(c, spec, { plan: c.plan, t0: 0.18, step: 0.08, slide: 12 })}` };
}

const P1 = ['fade', 'slide', 'sweep', 'fade', 'slide'];
const P2 = ['slide', 'fade', 'fade', 'slide', 'fade'];
const D1 = ['grow', 'rise', 'fade', 'grow', 'rotate'];
const D2 = ['draw', 'grow', 'fade', 'slide', 'grow'];

/** 与 families.mjs 的 FAMILIES 同构，供 generate-styles.mjs 合并 */
export const EXTRA_FAMILIES = [
  { key:'scroll',   name:'竖排卷轴', en:'Scroll',    dark:false, render:scroll,
    plans:P1, decos:D1, tagline:'六条色带纵向堆叠 · 窄高画布' },
  { key:'ode',      name:'居中诗页', en:'Ode',       dark:false, render:ode,
    plans:P2, decos:D2, tagline:'方版 · 圆环 · 全居中大留白' },
  { key:'split',    name:'分屏对照', en:'Split',     dark:true,  render:split,
    plans:P1, decos:D2, tagline:'左右反白双底 · 三行 / 三行' },
  { key:'cascade',  name:'卡片阶梯', en:'Cascade',   dark:false, render:cascade,
    plans:P2, decos:D1, tagline:'六张错位卡片 · 逐行递进' },
  { key:'scale',    name:'字阶',     en:'Scale',     dark:false, render:scale,
    plans:P1, decos:D2, tagline:'字号 14→34 递增 · 阶梯缩进' },
  { key:'ledger',   name:'清单表格', en:'Ledger',    dark:false, render:ledger,
    plans:P2, decos:D1, tagline:'序号列 · 每行一条底线' },
  { key:'diagonal', name:'对角构图', en:'Diagonal',  dark:false, render:diagonal,
    plans:P1, decos:D2, tagline:'斜切色块 · 沿对角线排字' },
  { key:'poster',   name:'满幅海报', en:'Poster',    dark:true,  render:poster,
    plans:P2, decos:D1, tagline:'2/3 满幅色块 · 反白巨字' },
  { key:'sticky',   name:'便签',     en:'Sticky',    dark:false, render:sticky,
    plans:P1, decos:D2, tagline:'三张旋转便签 · 胶带' },
  { key:'ribbon',   name:'横幅飘带', en:'Ribbon',    dark:false, render:ribbon,
    plans:P2, decos:D1, tagline:'320 高宽幅 · 两列 × 三行' }
];
