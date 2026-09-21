#!/usr/bin/env node
/* ThemeShelf — look at the heroes.
 *
 *   node tools/shoot-heroes.mjs                 every theme, six to a contact sheet
 *   node tools/shoot-heroes.mjs bento swiss     just those
 *   SHOT_W=1024 SHOT_H=768 node tools/…         another viewport (default 1280x800)
 *   SHOT_FULL=1 node tools/… bento              one full-size PNG per theme instead
 *   SHOT_W=390 SHOT_H=844 SHOT_SCALE=0.6 SHOT_COLS=5 SHOT_PER=10 node tools/…   phones, ten to a sheet
 *
 * Measurement clears a layout — nothing overlaps, nothing is clipped — and says
 * nothing about whether it looks right. This is the other half. Same approach as
 * Dev Tools/design-shots: headless Chrome over the DevTools Protocol with Node's
 * own fetch and WebSocket, so there is nothing to install. One page load, then
 * `themeshelf.go(i)` per theme; sheets are composed on a canvas inside the page.
 *
 * Serve the site first (python -m http.server 4517). Output goes to SHOT_DIR,
 * default ./.shots (git-ignore it).
 */
import { spawn } from 'node:child_process';
import { writeFileSync, mkdirSync, rmSync } from 'node:fs';
import { setTimeout as sleep } from 'node:timers/promises';
import { resolve } from 'node:path';

const CHROME = process.env.CHROME || 'C:/Program Files/Google/Chrome/Application/chrome.exe';
const PORT = 9334;
const URL_ = process.env.SHOT_URL || 'http://localhost:4517/';
const OUT = resolve(process.env.SHOT_DIR || '.shots');
const W = Number(process.env.SHOT_W || 1280), H = Number(process.env.SHOT_H || 800);
const FULL = !!process.env.SHOT_FULL;
const SCALE = Number(process.env.SHOT_SCALE || 0.5), COLS = Number(process.env.SHOT_COLS || 2), PER = Number(process.env.SHOT_PER || COLS * 3);
const want = process.argv.slice(2);
mkdirSync(OUT, { recursive: true });
rmSync(OUT + '/profile', { recursive: true, force: true });

const chrome = spawn(CHROME, ['--headless=new', '--hide-scrollbars', '--no-first-run', '--no-default-browser-check', '--disable-extensions',
  '--disable-http-cache', '--incognito', '--force-device-scale-factor=1', `--remote-debugging-port=${PORT}`, '--user-data-dir=' + OUT + '/profile', 'about:blank'], { stdio: 'ignore' });

async function targets() {
  for (let i = 0; i < 60; i++) { try { const r = await fetch(`http://127.0.0.1:${PORT}/json/list`); if (r.ok) return await r.json(); } catch {} await sleep(250); }
  throw new Error('Chrome never exposed its debugging port');
}
const ws = new WebSocket((await targets()).find((t) => t.type === 'page').webSocketDebuggerUrl);
await new Promise((r) => ws.addEventListener('open', r, { once: true }));
let id = 0; const pending = new Map();
ws.addEventListener('message', (ev) => { const m = JSON.parse(ev.data); if (m.id && pending.has(m.id)) { pending.get(m.id)(m); pending.delete(m.id); } });
const send = (method, params = {}) => new Promise((res, rej) => { const n = ++id; pending.set(n, (m) => (m.error ? rej(new Error(method + ': ' + m.error.message)) : res(m.result))); ws.send(JSON.stringify({ id: n, method, params })); });
const evalJs = async (expression) => { const r = await send('Runtime.evaluate', { expression, awaitPromise: true, returnByValue: true }); if (r.exceptionDetails) throw new Error(r.exceptionDetails.exception?.description || r.exceptionDetails.text); return r.result.value; };

try {
  await send('Page.enable'); await send('Runtime.enable');
  await send('Emulation.setDeviceMetricsOverride', { width: W, height: H, deviceScaleFactor: 1, mobile: W < 700 });
  await send('Page.navigate', { url: URL_ });
  await sleep(2200);
  const slugs = await evalJs(`(async()=>{ await document.fonts.ready; const ts=window.themeshelf; if(ts.state.playing) document.querySelector('[data-action=play]').click(); return ts.THEMES.map(t=>t.slug); })()`);
  const list = want.length ? want.filter((s) => slugs.includes(s)) : slugs;
  const missing = want.filter((s) => !slugs.includes(s));
  if (missing.length) console.log('unknown slugs: ' + missing.join(', '));

  const shots = [];
  for (const slug of list) {
    await evalJs(`(async()=>{ const ts=window.themeshelf; scrollTo(0,0); ts.go(ts.THEMES.findIndex(t=>t.slug==='${slug}'),1,{announce:false}); await new Promise(r=>setTimeout(r,950)); await document.fonts.ready; await new Promise(r=>setTimeout(r,250)); })()`);
    if (FULL) {
      const { data } = await send('Page.captureScreenshot', { format: 'png' });
      writeFileSync(`${OUT}/${slug}.png`, Buffer.from(data, 'base64'));
    } else {
      const { data } = await send('Page.captureScreenshot', { format: 'jpeg', quality: 80, clip: { x: 0, y: 0, width: W, height: H, scale: SCALE } });
      shots.push({ slug, data });
    }
  }

  if (!FULL) {
    await send('Page.navigate', { url: 'about:blank' }); await sleep(300);
    const cw = Math.round(W * SCALE), chh = Math.round(H * SCALE), per = PER, cols = COLS;
    for (let s = 0; s < shots.length; s += per) {
      const group = shots.slice(s, s + per);
      const rows = Math.ceil(group.length / cols);
      const url = await evalJs(`(async()=>{ const G=${JSON.stringify(group)}; const c=document.createElement('canvas'); c.width=${cw * cols}; c.height=${chh}*${rows}; const g=c.getContext('2d'); g.fillStyle='#111'; g.fillRect(0,0,c.width,c.height);
        for(let i=0;i<G.length;i++){ const im=new Image(); im.src='data:image/jpeg;base64,'+G[i].data; await im.decode(); const x=(i%${cols})*${cw}, y=Math.floor(i/${cols})*${chh}; g.drawImage(im,x,y,${cw},${chh}); g.fillStyle='rgba(0,0,0,.72)'; g.fillRect(x,y,8+G[i].slug.length*8.4,20); g.fillStyle='#fff'; g.font='700 13px monospace'; g.fillText(G[i].slug,x+5,y+14); g.strokeStyle='#ff0'; g.strokeRect(x+.5,y+.5,${cw}-1,${chh}-1); }
        return c.toDataURL('image/jpeg',0.78); })()`);
      const name = `sheet-${String(s / per + 1).padStart(2, '0')}.jpg`;
      writeFileSync(`${OUT}/${name}`, Buffer.from(url.split(',')[1], 'base64'));
      console.log(name + '  ' + group.map((x) => x.slug).join(' '));
    }
  } else console.log('wrote ' + list.length + ' PNGs to ' + OUT);
} finally {
  ws.close(); chrome.kill();
  /* Chrome can still be letting go of its profile for a moment after kill(); a leftover temp dir is not a failed run */
  await sleep(300); try { rmSync(OUT + '/profile', { recursive: true, force: true, maxRetries: 6, retryDelay: 250 }); } catch {}
}
