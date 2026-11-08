/**
 * 10 个设计流派的 SVG 骨架生成器。
 *
 * 每个 render(c) 返回 { h, body }，由 generate-styles.mjs 套上 <svg> 外壳。
 * 硬约束（与 references/wechat-svg-constraints.md 一致）：
 *   - 只用纯色 hex；无 id / class / defs / style 标签 / 渐变 / 滤镜 / foreignObject / 外链
 *   - 动画只用 <animate> / <animateTransform>，attributeName 在微信白名单内
 *   - 静态自洽：元素本身永远写最终状态，动画被整段删除后画面仍完整可读
 */
export const LINES = [
  '我发现 HY 4 svg 能力不错',
  '我想做一个公众号是 svg skills',
  '我是一个 svg 小白',
  '所以不去评价能力如何',
  '先看看审美如何',
  '我让他做了两三个风格'
];

export function esc(s){
  return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
}
const fade = (begin,d) => `<animate attributeName="opacity" values="0;1" dur="${d}" begin="${begin}" fill="freeze"/>`;
const SPLINE = 'calcMode="spline" keyTimes="0;1" keySplines="0.25 1 0.5 1"';

/** 装饰元素动画；缺参数时自动降级为淡入，避免生成无效动画 */
export function A(plan, begin, o = {}){
  const d = o.dur || '0.7s';
  switch(plan){
    case 'grow':  return o.w   ? `<animate attributeName="width" values="0;${o.w}" dur="${d}" begin="${begin}" fill="freeze" ${SPLINE}/>` : fade(begin,d);
    case 'rise':  return o.h   ? `<animate attributeName="height" values="0;${o.h}" dur="${d}" begin="${begin}" fill="freeze" ${SPLINE}/>` : fade(begin,d);
    case 'draw':  return o.len ? `<animate attributeName="stroke-dashoffset" values="${o.len};0" dur="${d}" begin="${begin}" fill="freeze"/>` : fade(begin,d);
    case 'sweep': return `<animate attributeName="x" values="${o.from};${o.to}" dur="${d}" begin="${begin}" fill="freeze"/>`;
    case 'rotate':return `<animateTransform attributeName="transform" type="rotate" values="0 ${o.cx??340} ${o.cy??230};360 ${o.cx??340} ${o.cy??230}" dur="${o.dur||'1.4s'}" begin="${begin}" fill="freeze"/>`;
    case 'slide': return `<animateTransform attributeName="transform" type="translate" values="0 ${o.dy||20};0 0" dur="${d}" begin="${begin}" fill="freeze" ${SPLINE}/>`;
    case 'pulse': return `<animate attributeName="opacity" values="1;0.45;1" dur="1.1s" begin="${begin}" fill="freeze"/>`;
    default:      return fade(begin,d);
  }
}
/** 正文行动画：只对文本元素安全的类型 */
export function T(plan, begin, o = {}){
  const d = o.dur || '0.55s';
  if (plan === 'slide') return `<animateTransform attributeName="transform" type="translate" values="0 ${o.dy||16};0 0" dur="${d}" begin="${begin}" fill="freeze" ${SPLINE}/>`;
  if (plan === 'sweep') return `<animate attributeName="x" values="${o.from};${o.to}" dur="${d}" begin="${begin}" fill="freeze"/>`;
  if (plan === 'none')  return '';
  return fade(begin,d);
}
/** 六行原文，统一断句；第 5 行「先看看审美如何」作强调行 */
export function textLines(c, o){
  const { x, y, dy, size, color, hi = 4, plan = 'fade', t0 = 0.12, step = 0.07, anchor = '', mono = false, serif = false } = o;
  const ff = mono ? ' font-family="Consolas, Menlo, monospace"'
           : serif ? ' font-family="Georgia, Songti SC, SimSun, serif"' : '';
  const an = anchor ? ` text-anchor="${anchor}"` : '';
  return LINES.map((t,i)=>{
    const col = i === hi ? c.P.accent : color;
    const w   = i === hi ? ' font-weight="600"' : '';
    const an2 = T(plan, (t0 + i*step).toFixed(2)+'s', { dy:o.slide||18, from:x-40, to:x });
    return `<text x="${x}" y="${y+i*dy}" font-size="${size}" fill="${col}"${an}${w}${ff}>${esc(t)}${an2}</text>`;
  }).join('\n  ');
}
/* 01 Swiss / 瑞士国际主义：严格网格 + 超大序号 + 左对齐 */
function swiss(c){
  const {P,v} = c, pad = 40 + (v%4)*10, cols = [4,6,12,3,8,5,10,2,7,9][v];
  const size = 17 + (v%3)*2, dy = 36 + (v%3)*2, y0 = 190 + (v%2)*8;
  let grid = '';
  for (let i=1;i<cols;i++){
    const gx = Math.round(pad + (680-2*pad)*i/cols);
    grid += `<line x1="${gx}" y1="76" x2="${gx}" y2="404" stroke="${P.line}" stroke-width="1"/>`;
  }
  const bar = 8 + (v%3)*4, num = String(c.n).padStart(2,'0');
  return { h:460, body:`
  <rect x="0" y="0" width="680" height="460" fill="${P.bg}"/>
  <rect x="0" y="0" width="680" height="${bar}" fill="${P.accent}">${A(c.deco,'0s',{w:680})}</rect>
  <g>${grid}</g>
  <text x="${pad}" y="72" font-size="11" fill="${P.sub}" letter-spacing="2">SWISS GRID / ${c.id}</text>
  <text x="${680-pad}" y="72" font-size="11" fill="${P.sub}" text-anchor="end">HY 4 · SVG LAB</text>
  <text x="${pad}" y="${156}" font-size="${62+(v%4)*8}" fill="${P.line}" font-family="Georgia, Songti SC, SimSun, serif" font-weight="700">${num}${T('fade','0s')}</text>
  <line x1="${pad}" y1="${170}" x2="${680-pad}" y2="${170}" stroke="${P.ink}" stroke-width="${1+(v%2)}"/>
  ${textLines(c,{x:pad+(v%3)*14,y:y0,dy,size,color:P.ink,plan:c.plan,t0:0.12,step:0.07,slide:16})}
  <rect x="${pad}" y="416" width="${80+v*12}" height="4" fill="${P.accent}"/>
  <text x="${pad}" y="440" font-size="10" fill="${P.sub}">配置 60-30-10 · 布局 ${cols} 栏网格 · 动画 ${c.plan}</text>
  <text x="${680-pad}" y="440" font-size="10" fill="${P.sub}" text-anchor="end">${c.id} / 100</text>` };
}

/* 02 Editorial / 杂志分栏：非对称双栏 + 衬线大标题 + 大序号 */
function editorial(c){
  const {P,v} = c, split = 176 + (v%5)*22, x = split + 56, size = 16 + (v%3), H = 480;
  const blocks = [0,1,2].map(i=>`<rect x="${x+i*140}" y="420" width="120" height="3" fill="${i===v%3?P.accent:P.line}"/>`).join('\n  ');
  const num = String(c.n).padStart(2,'0');
  return { h:H, body:`
  <rect x="0" y="0" width="680" height="${H}" fill="${P.bg}"/>
  <rect x="0" y="0" width="6" height="${H}" fill="${P.accent}">${A(c.deco,'0s',{h:H})}</rect>
  <text x="48" y="98" font-size="${74+(v%3)*8}" fill="${P.line}" font-family="Georgia, Songti SC, SimSun, serif">${num}${T('fade','0s')}</text>
  <line x1="${split}" y1="64" x2="${split}" y2="404" stroke="${P.line}" stroke-width="1"/>
  <text x="48" y="196" font-size="11" fill="${P.sub}">S T Y L E   N o . ${c.id}</text>
  <text x="48" y="258" font-size="12" fill="${P.ink}">配置</text>
  <text x="48" y="282" font-size="12" fill="${P.ink}">布局</text>
  <text x="48" y="306" font-size="12" fill="${P.ink}">动画</text>
  <rect x="48" y="330" width="16" height="3" fill="${P.accent}"/>
  <text x="${x}" y="108" font-size="11" fill="${P.sub}">HY 4 · SVG LAB</text>
  <text x="${x}" y="154" font-size="${34+(v%3)*4}" fill="${P.ink}" font-family="Georgia, Songti SC, SimSun, serif">先看审美${T(c.plan,'0.08s',{dy:20,from:x,to:x})}</text>
  <rect x="${x}" y="166" width="${170+v*6}" height="3" fill="${P.accent}">${A('grow','0.2s',{w:170+v*6})}</rect>
  ${textLines(c,{x,y:200,dy:34,size,color:P.ink,plan:c.plan,t0:0.3,step:0.07,serif:v%3===0,slide:18})}
  ${blocks}
  <text x="${x}" y="450" font-size="10" fill="${P.sub}">配置 60-30-10 · 布局 非对称双栏 · 动画 ${c.plan}</text>
  <text x="632" y="450" font-size="10" fill="${P.sub}" text-anchor="end">${c.id} / 100</text>` };
}

/* 03 Terminal / 终端：深色窗口 + 命令行 + 进度条 + 刻度列 */
function terminal(c){
  const {P,v} = c, H = 500, pad = 24 + (v%3)*8, rx = 4 + (v%4)*3;
  const n = [8,12,16,20][v%4];
  let ticks = '';
  for (let i=0;i<n;i++){
    const ty = Math.round(60 + i*(360/n));
    ticks += `<rect x="12" y="${ty}" width="6" height="1" fill="${P.line}"/><rect x="662" y="${ty}" width="6" height="1" fill="${P.line}"/>`;
  }
  const inW = 680 - 2*pad - 48;
  return { h:H, body:`
  <rect x="0" y="0" width="680" height="${H}" fill="${P.bg}"/>
  <g>${ticks}</g>
  <rect x="${pad}" y="28" width="${680-2*pad}" height="${H-56}" rx="${rx}" fill="${P.surface}" stroke="${P.line}" stroke-width="1"/>
  <circle cx="${pad+24}" cy="54" r="5" fill="${P.line}"/><circle cx="${pad+42}" cy="54" r="5" fill="${P.line}"/><circle cx="${pad+60}" cy="54" r="5" fill="${P.accent}"/>
  <text x="340" y="58" font-size="11" fill="${P.sub}" text-anchor="middle" font-family="Consolas, Menlo, monospace">hy4 / ${c.fam.key} / ${c.id}</text>
  <text x="${680-pad-20}" y="58" font-size="11" fill="${P.accent}" text-anchor="end" font-family="Consolas, Menlo, monospace">● LIVE</text>
  <line x1="${pad}" y1="80" x2="${680-pad}" y2="80" stroke="${P.line}" stroke-width="1"/>
  <rect x="${pad+24}" y="98" width="${inW}" height="3" fill="${P.line}"/>
  <rect x="${pad+24}" y="98" width="${inW}" height="3" fill="${P.accent}">${A('grow','0s',{w:inW})}</rect>
  <text x="${pad+24}" y="130" font-size="12" fill="${P.sub}" font-family="Consolas, Menlo, monospace">$ style --id ${c.id} --variant ${v}</text>
  <text x="${pad+24}" y="152" font-size="12" fill="${P.accent}" font-family="Consolas, Menlo, monospace">→ 先看审美，不做能力评价</text>
  <line x1="${pad+24}" y1="168" x2="${680-pad-24}" y2="168" stroke="${P.line}" stroke-width="1"/>
  <text x="${pad+24}" y="188" font-size="10" fill="${P.sub}" font-family="Consolas, Menlo, monospace">OUTPUT / 原文照录</text>
  ${textLines(c,{x:pad+24,y:222,dy:30,size:15,color:P.ink,plan:c.plan,t0:0.25,step:0.07,mono:true,slide:14})}
  <text x="${680-pad-24}" y="${H-52}" font-size="10" fill="${P.sub}" text-anchor="end" font-family="Consolas, Menlo, monospace">${c.id} / 100</text>` };
}

/* 04 Blueprint / 蓝图：细网格底 + 描边线框 + 尺寸标注 */
function blueprint(c){
  const {P,v} = c, H = 480, step = [20,24,28,32,40,20,26,36,22,30][v];
  let grid = '';
  for (let x=0;x<=680;x+=step) grid += `<line x1="${x}" y1="0" x2="${x}" y2="${H}" stroke="${P.line}" stroke-width="0.5"/>`;
  for (let y=0;y<=H;y+=step) grid += `<line x1="0" y1="${y}" x2="680" y2="${y}" stroke="${P.line}" stroke-width="0.5"/>`;
  const len = 520, marks = [[40,40],[640,40],[40,440],[640,440]].map(([x,y])=>
    `<line x1="${x-8}" y1="${y}" x2="${x+8}" y2="${y}" stroke="${P.accent}" stroke-width="1"/><line x1="${x}" y1="${y-8}" x2="${x}" y2="${y+8}" stroke="${P.accent}" stroke-width="1"/>`).join('');
  return { h:H, body:`
  <rect x="0" y="0" width="680" height="${H}" fill="${P.bg}"/>
  <g>${grid}</g>
  <rect x="40" y="40" width="600" height="400" fill="none" stroke="${P.accent}" stroke-width="1" stroke-dasharray="${len}" stroke-dashoffset="0">${A('draw','0s',{len})}</rect>
  <g>${marks}</g>
  <text x="60" y="82" font-size="11" fill="${P.sub}" font-family="Consolas, Menlo, monospace">BLUEPRINT / DWG-${c.id} / SCALE 1:${v+1}</text>
  <text x="60" y="130" font-size="${28+(v%3)*3}" fill="${P.ink}" font-family="Consolas, Menlo, monospace">先看审美${T(c.plan,'0.1s',{dy:16,from:60,to:60})}</text>
  <line x1="60" y1="146" x2="620" y2="146" stroke="${P.accent}" stroke-width="1" stroke-dasharray="${len}" stroke-dashoffset="0">${A('draw','0.25s',{len})}</line>
  ${textLines(c,{x:60,y:188,dy:36,size:16,color:P.ink,plan:c.plan,t0:0.35,step:0.08,mono:v%2===0,slide:16})}
  <text x="60" y="416" font-size="10" fill="${P.sub}" font-family="Consolas, Menlo, monospace">GRID ${step}px · 配置 60-30-10 · 动画 ${c.plan}</text>
  <text x="620" y="416" font-size="10" fill="${P.sub}" text-anchor="end" font-family="Consolas, Menlo, monospace">${c.id} / 100</text>` };
}

/* 05 Bauhaus / 包豪斯：原色几何 + 圆形旋转 + 硬边三角 */
function bauhaus(c){
  const {P,v} = c, H = 460, r = 62 + (v%4)*14, cx = 574 - (v%3)*26, cy = 108 + (v%3)*16;
  const bw = 88 + v*7, ty = 330 + (v%3)*20;
  const tri = `<path d="M 470 ${ty+86} L 560 ${ty} L 650 ${ty+86} Z" fill="${P.second}">${A(c.deco,'0.15s',{w:bw})}</path>`;
  return { h:H, body:`
  <rect x="0" y="0" width="680" height="${H}" fill="${P.bg}"/>
  <circle cx="${cx}" cy="${cy}" r="${r}" fill="${P.accent}">${A('rotate','0s',{cx,cy})}</circle>
  <rect x="0" y="${H-44}" width="${bw}" height="44" fill="${P.second}"><animate attributeName="width" values="0;${bw}" dur="0.8s" begin="0.1s" fill="freeze" ${SPLINE}/></rect>
  <rect x="${cx-r}" y="${cy+r+8}" width="${r*2}" height="6" fill="${P.ink}"/>
  ${tri}
  <text x="48" y="72" font-size="11" fill="${P.sub}" letter-spacing="2">BAUHAUS / FORM ${c.id}</text>
  <text x="48" y="132" font-size="${38+v*2}" fill="${P.ink}" font-weight="700">先看审美${T(c.plan,'0.05s',{dy:18,from:48,to:48})}</text>
  <rect x="48" y="146" width="120" height="4" fill="${P.accent}"/>
  ${textLines(c,{x:48,y:196,dy:34,size:17,color:P.ink,plan:c.plan,t0:0.2,step:0.07,slide:18})}
  <text x="48" y="416" font-size="10" fill="${P.sub}">配置 原色三色块 · 布局 几何叠压 · 动画 ${c.plan}</text>
  <text x="632" y="416" font-size="10" fill="${P.sub}" text-anchor="end">${c.id} / 100</text>` };
}

/* 06 Risograph / 孔版：双色错位叠印 + 网点 + 粗糙边缘感 */
function riso(c){
  const {P,v} = c, H = 460, off = 6 + (v%4)*4, dstep = 20 + (v%3)*4;
  let dots = '';
  for (let x=470;x<660;x+=dstep) for (let y=60;y<220;y+=dstep)
    dots += `<circle cx="${x}" cy="${y}" r="${v%2?2:1.5}" fill="${P.line}"/>`;
  const bx = 40 + (v%3)*8, by = 168 + (v%2)*10;
  return { h:H, body:`
  <rect x="0" y="0" width="680" height="${H}" fill="${P.bg}"/>
  <g>${dots}</g>
  <rect x="${bx}" y="${by}" width="${300+v*8}" height="240" fill="${P.second}" fill-opacity="0.45">${A(c.deco,'0s',{w:300+v*8})}</rect>
  <rect x="${bx+off}" y="${by+off}" width="${300+v*8}" height="240" fill="${P.accent}" fill-opacity="0.32">${A('fade','0.12s')}</rect>
  <text x="48" y="72" font-size="11" fill="${P.sub}" letter-spacing="2">RISOGRAPH / 2 SPOT COLORS / ${c.id}</text>
  <text x="48" y="132" font-size="${38+(v%3)*4}" fill="${P.ink}" font-weight="700" font-family="Georgia, Songti SC, SimSun, serif">先看审美${T(c.plan,'0.05s',{dy:18,from:48,to:48})}</text>
  <rect x="48" y="146" width="140" height="4" fill="${P.accent}"/>
  ${textLines(c,{x:56,y:206,dy:34,size:17,color:P.ink,plan:c.plan,t0:0.2,step:0.07,slide:16})}
  <text x="48" y="428" font-size="10" fill="${P.sub}">配置 双专色叠印 · 布局 错位 ${off}px · 动画 ${c.plan}</text>
  <text x="632" y="428" font-size="10" fill="${P.sub}" text-anchor="end">${c.id} / 100</text>` };
}

/* 07 Memphis / 孟菲斯：波点 + 斜线 + 锯齿 + 撞色 */
function memphis(c){
  const {P,v} = c, H = 480, gap = 18 + (v%3)*4;
  let dots = '';
  for (let x=470;x<660;x+=gap) for (let y=48;y<200;y+=gap)
    dots += `<circle cx="${x}" cy="${y}" r="${2+(v%3)}" fill="${x%2?P.accent:P.second}"/>`;
  let stripes = '';
  for (let i=0;i<9;i++) stripes += `<line x1="${40+i*16}" y1="404" x2="${70+i*16}" y2="440" stroke="${i%2?P.accent:P.ink}" stroke-width="3"/>`;
  const zig = `M 470 410 L 500 386 L 530 410 L 560 386 L 590 410 L 620 386 L 650 410`;
  return { h:H, body:`
  <rect x="0" y="0" width="680" height="${H}" fill="${P.bg}"/>
  <g>${dots}</g>
  <g>${stripes}</g>
  <path d="${zig}" fill="none" stroke="${P.second}" stroke-width="5" stroke-linecap="round"><animate attributeName="stroke-dashoffset" values="240;0" dur="0.9s" begin="0.2s" fill="freeze"/></path>
  <rect x="32" y="32" width="616" height="416" fill="none" stroke="${P.ink}" stroke-width="${3+(v%3)}"/>
  <rect x="${40+(v%3)*10}" y="${42+(v%2)*8}" width="${170+v*7}" height="${38+v}" fill="${P.accent}">${A(c.deco,'0s',{w:170+v*7})}</rect>
  <text x="${52+(v%3)*10}" y="${68+(v%2)*8}" font-size="20" fill="${P.bg}" font-weight="700">先看审美</text>
  <text x="56" y="128" font-size="11" fill="${P.sub}" letter-spacing="1">MEMPHIS / PATTERN ${c.id}</text>
  ${textLines(c,{x:56,y:176,dy:36,size:17,color:P.ink,plan:c.plan,t0:0.18,step:0.08,slide:20})}
  <text x="56" y="424" font-size="10" fill="${P.sub}">配置 撞色三原色 · 布局 波点 / 斜线 / 锯齿 · 动画 ${c.plan}</text>
  <text x="624" y="424" font-size="10" fill="${P.sub}" text-anchor="end">${c.id} / 100</text>` };
}

/* 08 Newspaper / 报纸：报头 + 双细线 + 多栏 + 铅字感 */
function news(c){
  const {P,v} = c, H = 500, cols = [2,3,2,4,3,2,3,4,2,3][v];
  let rules = '';
  for (let i=1;i<cols;i++){
    const gx = Math.round(48 + (584)*i/cols);
    rules += `<line x1="${gx}" y1="176" x2="${gx}" y2="424" stroke="${P.line}" stroke-width="1"/>`;
  }
  const titleSize = 40 + (v%4)*4;
  return { h:H, body:`
  <rect x="0" y="0" width="680" height="${H}" fill="${P.bg}"/>
  <text x="48" y="52" font-size="11" fill="${P.sub}" letter-spacing="2">THE SVG CHRONICLE · No.${c.id} · ${c.fam.key.toUpperCase()}</text>
  <line x1="48" y1="62" x2="632" y2="62" stroke="${P.ink}" stroke-width="2"/>
  <text x="340" y="${112+titleSize/3}" font-size="${titleSize}" fill="${P.ink}" font-family="Georgia, Songti SC, SimSun, serif" font-weight="700" text-anchor="middle">先看审美${T(c.plan,'0s',{dy:20,from:340,to:340})}</text>
  <line x1="48" y1="146" x2="632" y2="146" stroke="${P.ink}" stroke-width="4"/>
  <line x1="48" y1="154" x2="632" y2="154" stroke="${P.ink}" stroke-width="1"/>
  <g>${rules}</g>
  <text x="48" y="174" font-size="10" fill="${P.sub}">HY 4 · SVG LAB / 原文照录</text>
  ${textLines(c,{x:56,y:206,dy:36,size:17,color:P.ink,plan:c.plan,t0:0.2,step:0.07,serif:v%2===0,slide:16})}
  <line x1="48" y1="440" x2="632" y2="440" stroke="${P.line}" stroke-width="1"><animate attributeName="width" values="0;584" dur="0.8s" begin="0s" fill="freeze" ${SPLINE}/></line>
  <text x="48" y="464" font-size="10" fill="${P.sub}">配置 纸墨双色 · 布局 ${cols} 栏铅字 · 动画 ${c.plan}</text>
  <text x="632" y="464" font-size="10" fill="${P.sub}" text-anchor="end">${c.id} / 100</text>` };
}

/* 09 Brutalist / 粗野主义：粗框 + 硬阴影 + 超大字 + 荧光强调 */
function brutal(c){
  const {P,v} = c, H = 470, sw = 4 + (v%4)*2, off = 8 + (v%3)*4;
  return { h:H, body:`
  <rect x="0" y="0" width="680" height="${H}" fill="${P.bg}"/>
  <rect x="${32+off}" y="${32+off}" width="616" height="406" fill="${P.ink}"/>
  <rect x="32" y="32" width="616" height="406" fill="${P.surface}" stroke="${P.ink}" stroke-width="${sw}"/>
  <rect x="32" y="32" width="${180+v*14}" height="${52+(v%3)*6}" fill="${P.accent}">${A(c.deco,'0s',{w:180+v*14})}</rect>
  <text x="48" y="${68+(v%3)*4}" font-size="24" fill="${P.ink}" font-weight="700">先看审美</text>
  <text x="48" y="118" font-size="11" fill="${P.sub}" letter-spacing="1">BRUTALIST / RAW ${c.id} / NO DECORATION</text>
  <line x1="48" y1="128" x2="632" y2="128" stroke="${P.ink}" stroke-width="${sw}"/>
  ${textLines(c,{x:52,y:172,dy:38,size:19,color:P.ink,plan:c.plan,t0:0.15,step:0.07,slide:20})}
  <text x="52" y="416" font-size="10" fill="${P.sub}">配置 高对比 + 荧光 · 布局 硬阴影 ${off}px · 动画 ${c.plan}</text>
  <text x="628" y="416" font-size="10" fill="${P.sub}" text-anchor="end">${c.id} / 100</text>` };
}

/* 10 Notion / 极简笔记：大留白 + 1px 竖线锚定 + 清单感 */
function notion(c){
  const {P,v} = c, H = 440, x = 88 + (v%3)*12, dy = 40 + (v%2)*2, size = 18 + (v%3);
  return { h:H, body:`
  <rect x="0" y="0" width="680" height="${H}" fill="${P.bg}"/>
  <rect x="${x-32}" y="64" width="1" height="${312+v*2}" fill="${P.line}"><animate attributeName="height" values="0;${312+v*2}" dur="0.9s" begin="0s" fill="freeze" ${SPLINE}/></rect>
  <text x="${x}" y="76" font-size="11" fill="${P.sub}" letter-spacing="2">N O T E   /   ${c.id}</text>
  <text x="624" y="76" font-size="11" fill="${P.sub}" text-anchor="end">HY 4 · SVG LAB</text>
  <line x1="${x}" y1="96" x2="624" y2="96" stroke="${P.line}" stroke-width="1"/>
  ${textLines(c,{x,y:152,dy,size,color:P.ink,plan:c.plan,t0:0.1,step:0.1,slide:12})}
  <rect x="${x}" y="${392}" width="8" height="8" fill="${P.accent}"/>
  <text x="${x+20}" y="400" font-size="11" fill="${P.sub}">配置 ${P.accent} · 布局 单栏笔记流 · 动画 ${c.plan}</text>
  <text x="624" y="400" font-size="11" fill="${P.sub}" text-anchor="end">${c.id} / 100</text>` };
}

export const FAMILIES = [
  { key:'swiss',      name:'瑞士网格',   en:'Swiss Grid',   dark:false, render:swiss,
    plans:['fade','slide','sweep','fade','slide','fade','sweep','fade','slide','fade'],
    decos:['grow','fade','rise','grow','fade','slide','grow','fade','rise','grow'],
    tagline:'严格栏网 · 超大序号 · 左对齐' },
  { key:'editorial',  name:'杂志分栏',   en:'Editorial',    dark:false, render:editorial,
    plans:['slide','fade','slide','slide','fade','slide','fade','slide','fade','slide'],
    decos:['rise','fade','grow','rise','slide','grow','fade','rise','grow','fade'],
    tagline:'非对称双栏 · 衬线大字 · 大序号' },
  { key:'terminal',   name:'终端卡片',   en:'Terminal',     dark:true,  render:terminal,
    plans:['fade','fade','slide','fade','fade','slide','fade','fade','slide','fade'],
    decos:['grow','pulse','grow','fade','grow','pulse','grow','fade','grow','pulse'],
    tagline:'深色窗口 · 命令行 · 进度条' },
  { key:'blueprint',  name:'工程蓝图',   en:'Blueprint',    dark:true,  render:blueprint,
    plans:['fade','slide','fade','fade','slide','fade','slide','fade','fade','slide'],
    decos:['draw','fade','draw','grow','draw','fade','draw','grow','fade','draw'],
    tagline:'细网格 · 描边线框 · 尺寸标注' },
  { key:'bauhaus',    name:'包豪斯',     en:'Bauhaus',      dark:false, render:bauhaus,
    plans:['fade','slide','fade','fade','slide','fade','slide','fade','fade','slide'],
    decos:['rotate','grow','rotate','fade','rotate','grow','rotate','fade','grow','rotate'],
    tagline:'原色几何 · 旋转圆 · 硬边三角' },
  { key:'riso',       name:'孔版叠印',   en:'Risograph',    dark:false, render:riso,
    plans:['fade','fade','slide','fade','fade','slide','fade','fade','slide','fade'],
    decos:['grow','fade','grow','slide','grow','fade','grow','slide','fade','grow'],
    tagline:'双专色 · 错位叠印 · 网点' },
  { key:'memphis',    name:'孟菲斯',     en:'Memphis',      dark:false, render:memphis,
    plans:['slide','fade','slide','slide','fade','slide','fade','slide','fade','slide'],
    decos:['grow','rotate','grow','fade','grow','slide','grow','rotate','fade','grow'],
    tagline:'波点 · 斜线 · 锯齿 · 高饱和撞色' },
  { key:'news',       name:'报纸铅字',   en:'Newspaper',    dark:false, render:news,
    plans:['fade','fade','fade','slide','fade','fade','slide','fade','fade','slide'],
    decos:['rise','grow','rise','fade','rise','grow','fade','rise','grow','fade'],
    tagline:'报头双线 · 多栏排版 · 衬线' },
  { key:'brutal',     name:'粗野主义',   en:'Brutalist',    dark:false, render:brutal,
    plans:['sweep','fade','sweep','fade','sweep','fade','slide','fade','sweep','fade'],
    decos:['grow','fade','grow','slide','grow','fade','grow','rise','fade','grow'],
    tagline:'粗黑框 · 硬阴影 · 荧光强调' },
  { key:'notion',     name:'极简笔记',   en:'Minimal Note', dark:false, render:notion,
    plans:['fade','fade','slide','fade','fade','fade','slide','fade','fade','fade'],
    decos:['rise','fade','rise','grow','fade','rise','fade','grow','rise','fade'],
    tagline:'大留白 · 1px 竖线 · 清单流' }
];
