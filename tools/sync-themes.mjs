#!/usr/bin/env node
/* ThemeShelf — build the shelf's data from the one theme list.
 *
 *   node tools/sync-themes.mjs           write js/themes.generated.js + IMAGE-PROMPTS.md
 *   node tools/sync-themes.mjs --check   exit 1 if either file is out of date
 *
 * hud-kit/themes.js is the source of truth for tokens; this never copies them by
 * hand. Paper is `{}` there (it IS hud.css's :root), so the base tokens are read
 * out of hud.css's first :root block and every theme is emitted RESOLVED — base
 * plus overrides — because the shelf scopes a theme to an element (a hero slide,
 * a deck thumbnail) and a partial set would inherit the rest from whichever
 * theme the page is showing.
 *
 * The generated file is committed, so the site deploys without hud-kit present.
 * Hero images are picked up from img/heroes/<slug>.{webp,jpg,jpeg,png}: drop the
 * files in, re-run this, and the manifest tells the page which ones exist (no
 * probing, so no 404s in the console for the ones that do not).
 */
import { readFile, writeFile, readdir } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { META, SKIP } from './theme-meta.mjs';
import { EXTRA_THEMES as EXTRA_1 } from './extra-themes.mjs';
import { EXTRA_THEMES_2 } from './extra-themes-2.mjs';
import { HERO, PROMPT_SUFFIX_BY_LAYOUT } from './hero-copy.mjs';

const EXTRA_THEMES = [...EXTRA_1, ...EXTRA_THEMES_2];
const dupe = EXTRA_THEMES.map((t) => t.slug).find((x, i, a) => a.indexOf(x) !== i);
if (dupe) throw new Error(`extra themes: slug "${dupe}" is defined twice`);

const here = dirname(fileURLToPath(import.meta.url));
const root = resolve(here, '..');
const HUD = process.env.HUD_KIT || resolve(root, '..', '..', 'Dev Tools', 'hud-kit');
const OUT_JS = join(root, 'js', 'themes.generated.js');
const OUT_MD = join(root, 'IMAGE-PROMPTS.md');
const HEROES = join(root, 'img', 'heroes');
const check = process.argv.includes('--check');

/* Only what the shelf draws with. The kit's stacking ladder, status colours,
   deed-card and dark-screen palettes are real tokens but mean nothing here, and
   they would triple the "copy tokens" block for no reader. */
const KEEP = [
  /^--color-scheme$/, /^--font-(display|body|pixel|mono)$/,
  /^--c-(bg|surface|surface-2|panel|ink|ink-dim|ink-faint|line|line-bright|neon|cyan|amber|danger|violet)$/,
  /^--shadow(-sm|-lg|-focus|-color)?$/, /^--radius(-sm|-pill)?$/,
  /^--panel-(bg|backdrop|texture)$/, /^--sheen$/,
  /^--(grid|glow)-(color|opacity)$/, /^--scanline-opacity$/, /^--art-[ab]$/,
];
const keep = (k) => KEEP.some((re) => re.test(k));

function baseTokens(css) {
  const start = css.indexOf(':root {');
  if (start < 0) throw new Error('hud.css: no :root block');
  const block = css.slice(start, css.indexOf('\n}', start)).replace(/\/\*[\s\S]*?\*\//g, '');
  const out = {};
  for (const m of block.matchAll(/(--[\w-]+)\s*:\s*([^;]+);/g)) out[m[1]] = m[2].trim().replace(/\s+/g, ' ');
  return out;
}

const lin = (c) => ((c /= 255) <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4);
const lum = (ch) => { const [r, g, b] = ch.split(' ').map(Number); return 0.2126 * lin(r) + 0.7152 * lin(g) + 0.0722 * lin(b); };
const ratio = (a, b) => { const [x, y] = [lum(a), lum(b)].sort((p, q) => q - p); return (x + 0.05) / (y + 0.05); };
const WHITE = '255 255 255';
const BLACK = '12 12 14';
/** Text colour for a filled button: whichever of near-black / white reads better. */
const on = (ch) => (ratio(ch, WHITE) >= ratio(ch, BLACK) ? WHITE : BLACK);
const hex = (ch) => '#' + ch.split(' ').map((n) => Number(n).toString(16).padStart(2, '0')).join('');

async function build() {
  const { THEMES } = await import(pathToFileURL(join(HUD, 'themes.js')).href);
  const base = baseTokens(await readFile(join(HUD, 'hud.css'), 'utf8'));
  const files = existsSync(HEROES) ? await readdir(HEROES) : [];

  const clash = EXTRA_THEMES.find((x) => THEMES.some((t) => t.slug === x.slug));
  if (clash) throw new Error(`extra-themes.mjs: slug "${clash.slug}" already exists in hud-kit`);
  const themes = [...THEMES.filter((t) => !SKIP.includes(t.slug)), ...EXTRA_THEMES].map((t) => {
    const meta = t.meta || META[t.slug];
    if (!meta) throw new Error(`theme-meta.mjs has no entry for "${t.slug}" — add a prompt and fonts for it`);
    const hero = t.hero || HERO[t.slug];
    if (!hero) throw new Error(`hero-copy.mjs has no entry for "${t.slug}" — give it a layout and a tagline`);
    if (!PROMPT_SUFFIX_BY_LAYOUT[hero.layout]) throw new Error(`hero-copy.mjs: "${t.slug}" has unknown layout "${hero.layout}"`);
    const all = { ...base, ...t.tokens, ...(meta.tokens || {}) };
    const tokens = Object.fromEntries(Object.entries(all).filter(([k]) => keep(k)));
    tokens['--on-accent'] = on(tokens['--c-neon']);
    tokens['--on-accent-2'] = on(tokens['--c-cyan']);
    tokens['--on-danger'] = on(tokens['--c-danger']);
    tokens['--display-scale'] = String(meta.displayScale ?? 1);
    tokens['--body-scale'] = String(meta.bodyScale ?? 1);
    const image = ['webp', 'jpg', 'jpeg', 'png'].map((e) => `${t.slug}.${e}`).find((f) => files.includes(f));
    return {
      slug: t.slug,
      source: t.meta ? 'shelf' : 'hud-kit',
      kind: t.meta ? 'Design aesthetic' : 'UI theme',
      layout: hero.layout,
      label: meta.label || t.label,
      tagline: hero.tagline,
      blurb: t.blurb,
      dark: !!t.dark,
      swatches: t.swatches,
      displayFont: meta.displayFont,
      bodyFont: meta.bodyFont,
      fx: meta.fx || '',
      image: image ? `img/heroes/${image}` : null,
      prompt: `${meta.prompt} ${PROMPT_SUFFIX_BY_LAYOUT[hero.layout]}`,
      accentHex: hex(tokens['--c-neon']),
      tokens,
    };
  });

  /* Faces the static <link> in index.html does not cover. */
  const families = [...new Set(EXTRA_THEMES.flatMap((t) => t.meta.webfont || []))];
  const extraFonts = families.length ? 'https://fonts.googleapis.com/css2?' + families.map((f) => 'family=' + f).join('&') + '&display=swap' : null;

  const js =
    '/* GENERATED by tools/sync-themes.mjs from hud-kit/themes.js — do not edit by hand. */\n' +
    'window.THEMESHELF = ' + JSON.stringify({ extraFonts, themes }, null, 2) + ';\n';

  const md = [
    '# ThemeShelf — hero image prompts',
    '',
    'GENERATED by `tools/sync-themes.mjs` from `tools/theme-meta.mjs`. Edit the prompts there.',
    '',
    'Paste each prompt into ChatGPT (image generation), ask for **16:9 / landscape**, and save the',
    'result as `img/heroes/<slug>.jpg` (`.webp` / `.png` also work). Then run',
    '`node tools/sync-themes.mjs` so the page knows the file exists. Until then each hero shows',
    'generated palette art, so nothing looks broken.',
    '',
    ...themes.flatMap((t, i) => [
      `## ${String(i + 1).padStart(2, '0')} · ${t.label}`,
      '',
      `Save as: \`img/heroes/${t.slug}.jpg\`${t.image ? '  ✅ present' : ''}`,
      '',
      '> ' + t.prompt,
      '',
    ]),
  ].join('\n');

  return { js, md, themes };
}

const { js, md, themes } = await build();
if (check) {
  const same = async (p, want) => existsSync(p) && (await readFile(p, 'utf8')) === want;
  const stale = [];
  if (!(await same(OUT_JS, js))) stale.push('js/themes.generated.js');
  if (!(await same(OUT_MD, md))) stale.push('IMAGE-PROMPTS.md');
  if (stale.length) { console.error('out of date: ' + stale.join(', ') + ' — run node tools/sync-themes.mjs'); process.exit(1); }
  console.log(`ok — ${themes.length} themes, ${themes.filter((t) => t.image).length} hero images`);
} else {
  await writeFile(OUT_JS, js);
  await writeFile(OUT_MD, md);
  console.log(`wrote ${themes.length} themes (${themes.filter((t) => t.image).length} with hero images)`);
}
