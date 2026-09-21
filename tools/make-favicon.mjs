#!/usr/bin/env node
/* ThemeShelf — rasterise favicon.svg.
 *
 *   node tools/make-favicon.mjs
 *
 * favicon.svg is the source; this writes favicon-32.png, apple-touch-icon.png (180, square white
 * ground — iOS rounds the corners itself and paints transparency black) and favicon.ico (16/32/48,
 * PNG-in-ICO). Same approach as shoot-heroes.mjs: headless Chrome over the DevTools Protocol with
 * Node's own fetch and WebSocket, nothing to install. Prints the colour found at the centre of each
 * bar and the shelf at every size, so a bad render is visible in the output.
 */
import { spawn } from 'node:child_process';
import { readFileSync, writeFileSync, rmSync, mkdirSync } from 'node:fs';
import { setTimeout as sleep } from 'node:timers/promises';
import { tmpdir } from 'node:os';

const CHROME = process.env.CHROME || 'C:/Program Files/Google/Chrome/Application/chrome.exe';
const PORT = 9338, PROFILE = tmpdir() + '/ts-favicon-profile';
const svg = readFileSync('favicon.svg', 'utf8');
const touch = svg.replace('rx="14" fill="#fff"', 'fill="#fff"');   // full-bleed ground for iOS
rmSync(PROFILE, { recursive: true, force: true }); mkdirSync(PROFILE, { recursive: true });
const chrome = spawn(CHROME, ['--headless=new', '--no-first-run', '--disable-extensions', '--force-device-scale-factor=1', `--remote-debugging-port=${PORT}`, '--user-data-dir=' + PROFILE, 'about:blank'], { stdio: 'ignore' });
async function targets() { for (let i = 0; i < 60; i++) { try { const r = await fetch(`http://127.0.0.1:${PORT}/json/list`); if (r.ok) return await r.json(); } catch {} await sleep(250); } throw new Error('Chrome never exposed its debugging port'); }
const ws = new WebSocket((await targets()).find((t) => t.type === 'page').webSocketDebuggerUrl);
await new Promise((r) => ws.addEventListener('open', r, { once: true }));
let id = 0; const pending = new Map();
ws.addEventListener('message', (ev) => { const m = JSON.parse(ev.data); if (m.id && pending.has(m.id)) { pending.get(m.id)(m); pending.delete(m.id); } });
const send = (method, params = {}) => new Promise((res, rej) => { const n = ++id; pending.set(n, (m) => (m.error ? rej(new Error(method + ': ' + m.error.message)) : res(m.result))); ws.send(JSON.stringify({ id: n, method, params })); });

/* draw on a canvas inside the page: exact pixels, real alpha, and the samples come back with the PNG */
async function render(source, size) {
  const r = await send('Runtime.evaluate', { awaitPromise: true, returnByValue: true, expression: `(async()=>{ const im=new Image(); im.src='data:image/svg+xml;base64,${Buffer.from(source, 'utf8').toString('base64')}'; await im.decode(); const c=document.createElement('canvas'); c.width=c.height=${size}; const g=c.getContext('2d'); g.drawImage(im,0,0,${size},${size}); const px=(x,y)=>{const d=g.getImageData(Math.floor(x/64*${size}),Math.floor(y/64*${size}),1,1).data; return '#'+[d[0],d[1],d[2]].map(v=>v.toString(16).padStart(2,'0')).join('')+(d[3]<255?'/a'+d[3]:'');}; return {png:c.toDataURL('image/png').split(',')[1], blue:px(16,35), red:px(32,31), yellow:px(48,38), green:px(32,53), corner:px(1,1)}; })()` });
  if (r.exceptionDetails) throw new Error(r.exceptionDetails.exception?.description || r.exceptionDetails.text);
  const { png, ...samples } = r.result.value;
  console.log(String(size).padStart(3) + 'px', JSON.stringify(samples));
  return Buffer.from(png, 'base64');
}

try {
  await send('Runtime.enable');
  const p16 = await render(svg, 16), p32 = await render(svg, 32), p48 = await render(svg, 48);
  writeFileSync('favicon-32.png', p32);
  writeFileSync('apple-touch-icon.png', await render(touch, 180));
  const imgs = [[16, p16], [32, p32], [48, p48]];
  const head = Buffer.alloc(6 + 16 * imgs.length); head.writeUInt16LE(0, 0); head.writeUInt16LE(1, 2); head.writeUInt16LE(imgs.length, 4);
  let off = head.length;
  imgs.forEach(([s, b], i) => { const o = 6 + 16 * i; head.writeUInt8(s, o); head.writeUInt8(s, o + 1); head.writeUInt8(0, o + 2); head.writeUInt8(0, o + 3); head.writeUInt16LE(1, o + 4); head.writeUInt16LE(32, o + 6); head.writeUInt32LE(b.length, o + 8); head.writeUInt32LE(off, o + 12); off += b.length; });
  writeFileSync('favicon.ico', Buffer.concat([head, ...imgs.map(([, b]) => b)]));
  console.log('wrote favicon-32.png, apple-touch-icon.png, favicon.ico');
} finally { ws.close(); chrome.kill(); await sleep(300); rmSync(PROFILE, { recursive: true, force: true }); }
