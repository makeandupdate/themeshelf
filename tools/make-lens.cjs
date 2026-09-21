const fs = require('fs');
/* One displacement pass per axis, so neither map has to blend channels (mix-blend-mode is not honoured inside an
   feImage). In each map the ramp is in one channel and blue is a constant 128, which the other axis reads as "stay".
   rx / ry are the rim widths as a fraction of the box, which is why there are three filters: a bar, a pill and a
   bead need very different fractions to get a rim of about the same thickness. */
const hex = (v) => Math.max(0, Math.min(255, Math.round(v))).toString(16).padStart(2, '0');
/* ch: which channel carries the curve ('r' or 'g'); blue stays 128. Eight stops a side approximate (1 - t/r)^2. */
const stops = (ch, r) => { const out = []; const col = (v) => ch === 'r' ? `#${hex(v)}0080` : `#00${hex(v)}80`; const K = 8;
  for (let k = 0; k <= K; k++) { const t = (k / K) * r; out.push([t, 128 + 127 * (1 - k / K) ** 2]); }
  for (let k = K; k >= 0; k--) { const t = 1 - (k / K) * r; out.push([t, 128 - 128 * (1 - k / K) ** 2]); }
  return out.map(([t, v]) => `<stop offset='${+t.toFixed(4)}' stop-color='${col(v)}'/>`).join(''); };
const svg = (body) => 'data:image/svg+xml;utf8,' + encodeURIComponent(`<svg xmlns='http://www.w3.org/2000/svg' width='256' height='256'><defs>${body}</defs><rect width='256' height='256' fill='url(#g)'/></svg>`);
const xMap = (r) => svg(`<linearGradient id='g'>${stops('r', r)}</linearGradient>`);
const yMap = (r) => svg(`<linearGradient id='g' x2='0' y2='1'>${stops('g', r)}</linearGradient>`);
const filter = (id, rx, ry, scale) =>
  `<filter id="${id}" x="0" y="0" width="1" height="1" filterUnits="objectBoundingBox" primitiveUnits="objectBoundingBox" color-interpolation-filters="sRGB">` +
  `<feImage href="${xMap(rx)}" x="0" y="0" width="1" height="1" preserveAspectRatio="none" result="mx"/>` +
  `<feImage href="${yMap(ry)}" x="0" y="0" width="1" height="1" preserveAspectRatio="none" result="my"/>` +
  `<feDisplacementMap in="SourceGraphic" in2="mx" scale="${scale}" xChannelSelector="R" yChannelSelector="B" result="dx"/>` +
  `<feDisplacementMap in="dx" in2="my" scale="${scale}" xChannelSelector="B" yChannelSelector="G"/></filter>`;
const all = filter('lq-lens-bar', 0.06, 0.42, 0.03) + '\n    ' + filter('lq-lens-pill', 0.16, 0.45, 0.085) + '\n    ' + filter('lq-lens-bead', 0.42, 0.42, 0.42) + '\n    ';

let h = fs.readFileSync('index.html', 'utf8');
const start = h.indexOf('<filter id="lq-lens-bar"');
if (start < 0) throw new Error('old filter missing');
const end = h.lastIndexOf('</filter>') + '</filter>'.length;
h = h.slice(0, start) + all.trimEnd() + h.slice(end);
fs.writeFileSync('index.html', h);

console.log('maps rebuilt');
