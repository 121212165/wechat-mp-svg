/**
 * 从 index.html 的 ARTICLE_BEGIN..ARTICLE_END 纯函数区间导出公众号全文。
 *
 * 设计原则：展示页里的「一键复制全文」和仓库里的 wechat-article.html
 * 必须来自同一份函数，避免两份内容漂移。本脚本不重写任何文案，
 * 只负责：提取函数 → 提取三张 SVG 源码 → 生成独立 HTML → 客观校验。
 *
 * 用法：node tools/build-article.mjs
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const page = fs.readFileSync(path.join(ROOT, 'index.html'), 'utf8').replace(/\r\n/g, '\n');

const BEGIN = '/* ===== ARTICLE_BEGIN =====';
const END = '/* ===== ARTICLE_END ===== */';
const a = page.indexOf(BEGIN), b = page.indexOf(END);
if (a < 0 || b < 0 || b <= a) throw new Error('ARTICLE_BEGIN / ARTICLE_END 标记缺失');

const code = page.slice(a, b + END.length);
const api = new Function(code + '\nreturn { buildStandaloneHTML, buildArticle, auditFragment, toPlainText, auditSVG, STYLES };')();

const svgMap = {};
for (const st of api.STYLES) {
  const tag = `<script type="text/plain" id="src-${st.id}">`;
  const x = page.indexOf(tag), y = page.indexOf('</script>', x);
  if (x < 0 || y < 0) throw new Error('找不到 SVG 源码块: ' + tag);
  svgMap[st.id] = page.slice(x + tag.length, y).trim();
  const tr = api.auditSVG(svgMap[st.id]).filter(c => !c.ok);
  if (tr.length) throw new Error(`styles/${st.id} 原始 SVG 合规自检失败: ` + tr.map(c => c.label).join(', '));
}

const standalone = api.buildStandaloneHTML(svgMap);
const frag = api.buildArticle(svgMap);
const outPath = path.join(ROOT, 'wechat-article.html');
fs.writeFileSync(outPath, standalone, 'utf8');

/* 客观校验：落盘文件 = 函数输出；fragment 原样嵌在其中；三张 SVG 无丢失 */
const onDisk = fs.readFileSync(outPath, 'utf8');
const checks = [
  ['落盘文件与函数输出逐字节一致', onDisk === standalone],
  ['独立文件内嵌完整 fragment', onDisk.indexOf(frag) >= 0],
  ['独立文件不含 script / style 标签', !/<script[\s>]|<style[\s>]/i.test(onDisk)],
  ['独立文件不含 class / id 属性', !/\s(?:class|id)\s*=/i.test(onDisk)],
  ['全部 ' + api.STYLES.length + ' 张 SVG 均保留', (onDisk.match(/<svg\b/gi) || []).length === api.STYLES.length],
  ['原文完整收录', frag.indexOf('我发现HY 4 svg 能力不错') >= 0],
  ...api.auditFragment(frag, api.STYLES.length).map(c => [c.label, c.ok, c.detail])
];
const fails = checks.filter(c => !c[1]);

console.log('wechat-article.html  ' + (fs.statSync(outPath).size / 1024).toFixed(1) + ' KB');
console.log('正文 ' + frag.replace(/<[^>]*>/g, '').replace(/\s/g, '').length + ' 字 · ' +
            (frag.match(/<svg\b/gi) || []).length + ' 张 SVG · ' +
            (frag.match(/<animate(?:Transform|Motion)?\b/gi) || []).length + ' 个 SMIL 动画');
for (const [label, ok, detail] of checks) {
  console.log('  ' + (ok ? 'PASS' : 'FAIL') + '  ' + label + (detail ? ' · ' + detail : ''));
}
console.log(fails.length ? `\n${fails.length} 项失败` : '\n全部通过');
if (fails.length) process.exitCode = 1;
