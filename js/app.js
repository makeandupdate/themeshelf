/* ThemeShelf — the behaviour.
 *
 * One idea runs through all of it: a theme is a bag of CSS custom properties,
 * and "showing a theme" means writing that bag onto an element. Written onto
 * <html> it themes the page; written onto a hero slide, a marquee chip or a deck
 * thumbnail it themes just that, which is how every theme is on screen at
 * once and how the outgoing slide keeps its own look while the page has already
 * moved on to the next one.
 */
(() => {
  'use strict';

  const THEMES = window.THEMESHELF.themes;
  const N = THEMES.length;
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const pad = (n) => String(n).padStart(2, '0');
  const mod = (i) => ((i % N) + N) % N;
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  const root = document.documentElement;

  /* Site-only tokens: real on the page, noise in the block people copy. */
  const PRIVATE = /^--(on-|display-scale|body-scale|art-)/;

  /* ------------------------------------------------------------ hearts ----
     A cookie, as asked: one name, slugs joined with dots, a year's life. The
     write is read back, because on file:// a browser accepts document.cookie
     and stores nothing — there, and only there, localStorage stands in so the
     page still works when it is opened straight off the disk. */
  const Hearts = (() => {
    const NAME = 'ts_hearts';
    const valid = (s) => THEMES.some((t) => t.slug === s);
    const readCookie = () => {
      const m = document.cookie.match(/(?:^|;\s*)ts_hearts=([^;]*)/);
      return m ? decodeURIComponent(m[1]) : null;
    };
    const writeCookie = (v) => {
      const secure = location.protocol === 'https:' ? '; Secure' : '';
      document.cookie = `${NAME}=${encodeURIComponent(v)}; max-age=31536000; path=/; SameSite=Lax${secure}`;
      return readCookie() === v;
    };
    let raw = readCookie();
    let via = 'cookie';
    if (raw === null) {
      try { const ls = localStorage.getItem(NAME); if (ls !== null) { raw = ls; via = 'localStorage'; } } catch (e) { /* private mode */ }
    }
    const set = new Set((raw || '').split('.').filter(valid));
    const save = () => {
      const v = THEMES.map((t) => t.slug).filter((s) => set.has(s)).join('.');
      if (writeCookie(v)) { via = 'cookie'; return; }
      try { localStorage.setItem(NAME, v); via = 'localStorage'; } catch (e) { via = 'memory'; }
    };
    return {
      has: (s) => set.has(s),
      get size() { return set.size; },
      get via() { return via; },
      toggle(s) { set.has(s) ? set.delete(s) : set.add(s); save(); return set.has(s); },
    };
  })();

  /* ------------------------------------------------------------- state ---- */
  const state = { index: 0, playing: !reduced.matches, hold: 6, timer: 0, heroVisible: true, deckBuilt: false, filter: 'all' };

  const stage = $('#stage');
  const dj = $('#dj');
  const fader = $('#fader');
  const tempo = $('#tempo');
  const deck = $('#deck');
  const live = $('#live');

  const el = (tag, cls, html) => {
    const n = document.createElement(tag);
    if (cls) n.className = cls;
    if (html != null) n.innerHTML = html;
    return n;
  };
  const hex = (ch) => '#' + ch.split(' ').map((n) => Number(n).toString(16).padStart(2, '0')).join('');
  const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));

  /* Themes do not all carry the same keys (--art-a is on two of them), so a node
     that is re-themed — only <html> is — has to drop what the last theme set and
     this one does not, or Minimalism's beige glow follows you to Terminal. */
  const applied = new WeakMap();
  function applyTokens(node, theme) {
    for (const k of applied.get(node) || []) if (!(k in theme.tokens)) node.style.removeProperty(k);
    applied.set(node, Object.keys(theme.tokens));
    for (const k in theme.tokens) node.style.setProperty(k, theme.tokens[k]);
    node.dataset.fx = theme.fx;
  }

  /* `drawn` forces the generated art even when the theme has a picture: a figure
     plate or a bento tile inside the hero is part of the UI and keeps showing its
     chart, rather than a thumbnail of the wallpaper it is standing on. */
  function art(theme, drawn) {
    const a = el('div', 'art');
    if (theme.image && !drawn) {
      a.classList.add('art--img');
      a.style.backgroundImage = `url("${theme.image}")`;
    } else {
      a.innerHTML = '<i class="art__shape art__shape--sq"></i><i class="art__shape art__shape--rd"></i><i class="art__shape art__shape--ci"></i>';
    }
    return a;
  }

  /* -------------------------------------------------------- hero slide ---- */
  const BARS = [32, 41, 38, 57, 73, 94];
  const SPARK = '<svg class="spark" viewBox="0 0 200 60" preserveAspectRatio="none"><path class="spark__fill" d="M0 48 L25 42 L50 45 L75 30 L100 34 L125 22 L150 26 L175 12 L200 8 V60 H0Z"/><path class="spark__line" d="M0 48 L25 42 L50 45 L75 30 L100 34 L125 22 L150 26 L175 12 L200 8"/></svg>';

  /* The right-hand side of the landing. It is built from the real component
     classes (.card, .btn, .badge, .stat) on purpose: whatever a theme does to a
     card — frosts it, bevels it, tapes it down — it does to the hero too, so the
     hero cannot drift out of step with the kit below it. All of it is
     decoration: aria-hidden, nothing focusable. */
  const SCENES = window.THEMESHELF_SCENES || {};

  function buildShow(theme, i) {
    const scene = SCENES[theme.slug];
    const show = el('div', scene ? 'show show--scene show--' + theme.slug + (scene.as ? ' show--' + scene.as : '') : 'show show--' + theme.layout);
    show.setAttribute('aria-hidden', 'true');
    const sw = theme.swatches.concat(hex(theme.tokens['--c-cyan'])).map((c) => `<i style="--sw:${c}"></i>`).join('');
    const stat = `<div class="show__float show__float--stat card"><div class="card__body"><span class="label">Growth</span><b class="stat disp">+38%</b>${SPARK}</div></div>`;
    const pal = `<div class="show__float show__float--pal card"><div class="card__body"><span class="label">Palette</span><span class="show__sw">${sw}</span><span class="show__font"><b class="disp">Aa</b> ${esc(theme.displayFont)}</span></div></div>`;

    if (scene) {
      /* everything a scene may want to set its words and swatches into */
      show.innerHTML = scene.show({ t: theme, n: pad(i + 1), N, label: esc(theme.label), tagline: esc(theme.tagline), font: esc(theme.displayFont), sw, spark: SPARK, stat, pal });
    } else if (theme.layout === 'split') {
      show.innerHTML =
        `<div class="show__frame card"><div class="show__bar"><i></i><i></i><i></i><span>themeshelf.dev/${theme.slug}</span></div>` +
        `<div class="show__body"><div class="show__side"><b class="disp">Aa</b><i></i><i></i><i></i><i></i></div>` +
        `<div class="show__main"><span class="label">Overview</span><p class="show__h disp">${esc(theme.label)}</p>` +
        `<div class="show__chart mchart">${BARS.map((v, k) => `<i style="--v:${v}"${k === 2 || k === 4 ? ' class="alt"' : k === 5 ? ' class="hi"' : ''}></i>`).join('')}</div>` +
        `<div class="show__btns"><span class="btn btn--primary btn--sm">Get started</span><span class="btn btn--secondary btn--sm">Preview</span><span class="badge badge--accent">New</span></div></div></div></div>` + stat + pal;
    } else if (theme.layout === 'collage') {
      show.innerHTML =
        `<div class="show__polaroid card"><div class="show__pic" data-hero-art></div><p class="disp">${esc(theme.label)}</p></div>` +
        `<div class="show__note card"><div class="card__body"><span class="label">Note to self</span><p class="show__quote disp">${esc(theme.tagline)}</p><div class="show__btns"><span class="btn btn--primary btn--sm">Yes</span><span class="btn btn--secondary btn--sm">Later</span></div></div></div>` +
        `<div class="show__sticker"><span>No.</span><b>${pad(i + 1)}</b></div>` + pal;
    } else if (theme.layout === 'poster') {
      show.innerHTML =
        `<figure class="show__plate card"><div class="show__pic" data-hero-art></div><figcaption><span>Fig. ${pad(i + 1)}</span><span>${esc(theme.label)}</span></figcaption></figure>`;
    } else {
      show.innerHTML = stat + pal;
    }
    $$('[data-hero-art]', show).forEach((n) => n.append(art(theme, true)));
    return show;
  }

  /* Which moving background a style gets. Anything not named falls back by
     brightness: light themes get dust in a shaft of light, dark ones get orbs. */
  const BG = {};
  Object.entries({
    eq: 'circle discord money bento cassette',
    orbs: 'neon glass ai glassmorphism luxury ethereal artdeco vista',
    bubbles: 'y2k clay aero biopunk',
    steam: 'steampunk poker',
    grid: 'synthwave vaporwave outrun',
    rain: 'cyberpunk noir',
    scan: 'terminal cybercore dos crt hacker bios cyberdeck blueprint',
    stars: 'night nineties y2kchrome geocities pixelui arcade spaceage nasapunk retrofuture',
    shapes: 'brutal swiss maximal bauhaus midcentury constructivist corpmemphis memphis metro atomic',
    clouds: 'vacation win97 surreal pixel winxp eightbit sixteenbit gameboy solarpunk',
  }).forEach(([kind, slugs]) => slugs.split(' ').forEach((s) => { BG[s] = kind; }));

  function bgfx(theme, i) {
    const b = el('div', 'bgfx bgfx--' + (BG[theme.slug] || (theme.dark ? 'orbs' : 'dust')));
    b.setAttribute('aria-hidden', 'true');
    /* seeded, not random: the same theme scatters the same way every visit */
    const r = (k, n) => ((i * 7919 + k * 104729 + n * 1299709) % 1000) / 10;
    let h = '';
    for (let k = 0; k < 16; k++) h += `<i style="--k:${k};--x:${r(k, 1)};--y:${r(k, 2)};--s:${r(k, 3)}"></i>`;
    b.innerHTML = h;
    return b;
  }

  function buildSlide(theme, i) {
    const scene = SCENES[theme.slug];
    const s = el('article', 'slide t-scope lay-' + theme.layout + (scene ? ' scene scene--' + theme.slug + (scene.as ? ' scene--' + scene.as : '') : '') + (theme.image ? ' has-img' : '') + (theme.displayFont === 'Press Start 2P' ? ' px-face' : ''));
    s.dataset.slug = theme.slug;
    s.setAttribute('aria-roledescription', 'slide');
    s.setAttribute('aria-label', `${i + 1} of ${N}: ${theme.label}`);
    applyTokens(s, theme);

    const img = el('div', 'slide__img');
    img.append(art(theme), bgfx(theme, i), el('div', 'slide__scrim'));
    const land = el('div', 'land wrap');
    land.append(el('div', 'land__copy' + (scene && scene.copy ? ' ' + scene.copy : ''),
      `<p class="slide__index"><b>${pad(i + 1)}</b> / ${pad(N)}<span>${esc(theme.kind)}</span></p>` +
      `<h1 class="slide__name">${esc(theme.label)}</h1>` +
      `<p class="land__tag">${esc(theme.tagline)}</p>` +
      `<p class="slide__blurb">${esc(theme.blurb)}</p>` +
      (scene && scene.extra ? scene.extra({ t: theme, n: pad(i + 1), N }) : '') +
      `<div class="land__cta"><a class="btn btn--primary btn--lg" href="#buttons">Explore components <svg width="14" height="14" aria-hidden="true"><use href="#i-arrow"/></svg></a>` +
      `<button class="btn btn--secondary btn--lg" type="button" data-action="heart" aria-pressed="false"><svg width="16" height="16" aria-hidden="true"><use href="#i-heart"/></svg><span data-heart-label>Save theme</span></button></div>` +
      `<div class="land__sw" aria-hidden="true">${theme.swatches.concat(hex(theme.tokens['--c-cyan']), hex(theme.tokens['--c-amber'])).map((c) => `<i style="--sw:${c}"></i>`).join('')}</div>` +
      `<ul class="slide__tags"><li>${theme.dark ? 'Dark' : 'Light'}</li><li>${esc(theme.displayFont)}</li><li>${esc(theme.tokens['--radius'])} radius</li></ul>`));
    land.append(buildShow(theme, i));
    img.append(land);

    const refl = el('div', 'slide__refl');
    refl.setAttribute('aria-hidden', 'true');
    refl.append(art(theme));

    s.append(img, refl);
    return s;
  }

  function showSlide(theme, i, dir) {
    const incoming = buildSlide(theme, i);
    const old = $$('.slide', stage);
    /* A click that lands mid-slide: everything but the newest goes at once, so
       the stage never holds more than the pair that is actually moving. */
    old.slice(0, -1).forEach((n) => n.remove());
    const outgoing = old[old.length - 1];
    stage.append(incoming);
    pauseSvg();
    if (!outgoing) return;
    /* A hidden tab does not tick animations, so a slide started there would sit
       at its first keyframe — off screen — until someone looked. Nobody is
       watching; just swap. */
    if (document.hidden) { outgoing.remove(); return; }

    outgoing.getAnimations().forEach((a) => a.cancel());
    outgoing.setAttribute('aria-hidden', 'true');
    const opts = { duration: reduced.matches ? 180 : 680, easing: 'cubic-bezier(0.7, 0, 0.2, 1)', fill: 'both' };
    if (reduced.matches) {
      incoming.animate([{ opacity: 0 }, { opacity: 1 }], opts);
    } else {
      incoming.animate([{ transform: `translateX(${100 * dir}%)` }, { transform: 'none' }], opts);
      outgoing.animate([{ transform: 'none' }, { transform: `translateX(${-100 * dir}%)` }], opts);
    }
    setTimeout(() => outgoing.remove(), opts.duration + 40);
  }

  /* ------------------------------------------------------ page chrome ---- */
  const SWATCHES = [
    ['Background', '--c-bg'], ['Surface', '--c-surface'], ['Surface 2', '--c-surface-2'], ['Ink', '--c-ink'],
    ['Ink dim', '--c-ink-dim'], ['Line', '--c-line-bright'], ['Accent', '--c-neon'], ['Accent 2', '--c-cyan'],
    ['Amber', '--c-amber'], ['Danger', '--c-danger'], ['Violet', '--c-violet'],
  ];

  function tokensCss(theme) {
    const lines = Object.entries(theme.tokens).filter(([k]) => !PRIVATE.test(k)).map(([k, v]) => `  ${k}: ${v};`);
    return `:root[data-theme="${theme.slug}"] {\n${lines.join('\n')}\n}`;
  }

  function renderChrome(theme, i) {
    applyTokens(root, theme);
    root.dataset.theme = theme.slug;
    $('meta[name="theme-color"]').content = hex(theme.tokens['--c-bg']);
    document.title = `${theme.label} · ThemeShelf`;

    const bound = { ...theme, number: pad(i + 1), count: N, radius: theme.tokens['--radius'] };
    $$('[data-bind]').forEach((n) => { n.textContent = bound[n.dataset.bind] ?? ''; });
    $('#djName').textContent = theme.label;
    $('#djCount').textContent = `${pad(i + 1)} / ${pad(N)}`;
    $('#vinyl').style.setProperty('--vinyl', `conic-gradient(${theme.swatches.map((c, k, a) => `${c} ${(k / a.length) * 100}% ${((k + 1) / a.length) * 100}%`).join(', ')})`);
    fader.value = i + 1;
    fader.setAttribute('aria-valuetext', theme.label);
    $('#promptBtn').hidden = !!theme.image;

    $$('[data-art]').forEach((n) => { n.querySelector(':scope > .art')?.remove(); n.prepend(art(theme)); });

    $('#swatches').innerHTML = SWATCHES.map(([name, key]) => {
      const h = hex(theme.tokens[key]);
      return `<button class="swatch" type="button" data-copy="${h}" aria-label="Copy ${name} ${h}"><span class="swatch__chip" style="--sw:${h}"></span><span class="swatch__txt"><b>${name}</b><span>${h}</span></span></button>`;
    }).join('');

    $('#tokensName').textContent = `${theme.slug}.css`;
    $('#tokensCode').innerHTML = esc(tokensCss(theme)).replace(/^( {2}--[\w-]+)(:)/gm, '<span class="k">$1</span>$2');

    $$('.mchip').forEach((c) => c.classList.toggle('is-current', c.dataset.slug === theme.slug));
    $$('.thumb').forEach((c) => c.classList.toggle('is-current', c.dataset.slug === theme.slug));
    renderHearts();
  }

  function renderHearts() {
    const cur = THEMES[state.index].slug;
    $$('[data-action="heart"]').forEach((b) => {
      b.setAttribute('aria-pressed', String(Hearts.has(cur)));
      b.setAttribute('aria-label', (Hearts.has(cur) ? 'Remove heart from ' : 'Heart ') + THEMES[state.index].label);
    });
    $$('[data-heart-label]').forEach((n) => { n.textContent = Hearts.has(cur) ? 'Saved' : 'Save theme'; });
    $$('[data-heart-count]').forEach((n) => {
      n.textContent = Hearts.size;
      if (n.classList.contains('fab__badge')) n.hidden = Hearts.size === 0;
    });
    $$('.mchip').forEach((c) => c.classList.toggle('is-hearted', Hearts.has(c.dataset.slug)));
    $$('.thumb').forEach((t) => {
      const on = Hearts.has(t.dataset.slug);
      const b = $('.heart', t);
      b.setAttribute('aria-pressed', String(on));
      t.hidden = state.filter === 'hearted' && !on;
    });
    const empty = $('#deckEmpty');
    if (empty) empty.hidden = !(state.filter === 'hearted' && Hearts.size === 0);
  }

  /* ---------------------------------------------------------------- go ---- */
  function go(target, dir, { announce = true } = {}) {
    target = mod(target);
    const first = !stage.firstChild;
    if (target === state.index && !first) return;
    if (dir == null) dir = target > state.index ? 1 : -1;
    state.index = target;
    const theme = THEMES[target];

    if (!first && !document.hidden) {
      root.classList.add('is-switching');
      clearTimeout(go.t);
      go.t = setTimeout(() => root.classList.remove('is-switching'), 750);
    }
    renderChrome(theme, target);
    showSlide(theme, target, dir);
    renderHearts(); /* the new slide carries its own Save button */
    if (!first) history.replaceState(null, '', '#' + theme.slug);
    if (announce && !first) live.textContent = `Theme ${target + 1} of ${N}: ${theme.label}. ${theme.blurb}`;
    /* the neighbours' pictures, so the next slide never arrives blank */
    [target + 1, target - 1].forEach((k) => { const im = THEMES[mod(k)].image; if (im) new Image().src = im; });
    schedule();
  }

  /* ---------------------------------------------------------- autoplay ----
     Runs only while someone could be watching it: the hero on screen, the tab
     visible, the deck closed. Scrolled down into the components the theme stays
     put, which is the whole point of having the same components on every page. */
  const progress = $('#djProgress');
  const canTick = () => state.playing && state.heroVisible && !document.hidden && !deck.open;

  function schedule() {
    clearTimeout(state.timer);
    progress.getAnimations().forEach((a) => a.cancel());
    dj.classList.toggle('is-playing', canTick() && !reduced.matches);
    if (!canTick()) return;
    const ms = state.hold * 1000;
    progress.animate([{ transform: 'scaleX(0)' }, { transform: 'scaleX(1)' }], { duration: ms, easing: 'linear', fill: 'forwards' });
    state.timer = setTimeout(() => go(state.index + 1, 1, { announce: false }), ms);
  }

  function setPlaying(on) {
    state.playing = on;
    const b = $('#btnPlay');
    b.setAttribute('aria-pressed', String(on));
    b.setAttribute('aria-label', on ? 'Pause slideshow' : 'Play slideshow');
    $('#playIcon').setAttribute('href', on ? '#i-pause' : '#i-play');
    schedule();
  }

  /* ------------------------------------------------------------ marquee ---- */
  /* Scenes may animate with SMIL (Liquid Glass morphs a path), which neither animation-play-state nor
     prefers-reduced-motion reaches. Same rules as the CSS animations: still when reduced, paused when off screen. */
  function pauseSvg() {
    const still = reduced.matches || stage.classList.contains('is-idle');
    $$('svg', stage).forEach((s) => { if (s.pauseAnimations) (still ? s.pauseAnimations() : s.unpauseAnimations()); });
  }

  /* a theme whose display name moved on from its slug still answers to the name people will type */
  const ALIAS = { win95: 'win97' };
  const fromHash = () => { const s = location.hash.replace(/^#\/?/, ''); return ALIAS[s] || s; };

  function buildMarquee() {
    const track = $('#marqueeTrack');
    const half = (clone) => {
      const g = el('div');
      g.style.display = 'flex';
      if (clone) g.setAttribute('aria-hidden', 'true');
      THEMES.forEach((t, i) => {
        const c = el('button', 'mchip t-scope',
          `<span class="mchip__sw">${t.swatches.map((s) => `<i style="--sw:${s}"></i>`).join('')}</span>` +
          `<span class="mchip__no">${pad(i + 1)}</span><span>${esc(t.label)}</span>` +
          `<svg class="mchip__heart" width="12" height="12" aria-hidden="true"><use href="#i-heart"/></svg>`);
        c.type = 'button';
        c.dataset.slug = t.slug;
        c.dataset.go = i;
        if (clone) c.tabIndex = -1;
        applyTokens(c, t);
        g.append(c);
      });
      return g;
    };
    track.append(half(false), half(true));
    /* constant speed, not constant duration: ~4s of travel per chip however many there are */
    track.style.animationDuration = N * 4 + 's';
  }

  /* Grab the bar and pull it. The strip is one CSS animation (translateX 0 → -50% over two
     identical halves), so dragging does not fight it — it scrubs it: pixels become milliseconds of
     that animation's currentTime, wrapped at the duration, and the loop stays seamless in both
     directions. CSS owns play/pause (.is-dragging pauses it); this only ever sets the time.
     A press that moves less than 5px is still a click on the chip under it; past that the click is
     swallowed. With reduced motion there is no animation and the bar is a plain scroller, so the
     same drag moves scrollLeft instead. */
  function dragMarquee() {
    const bar = $('#marquee'), track = $('#marqueeTrack');
    const anim = () => track.getAnimations().find((a) => a.animationName === 'marquee');
    const nudge = (px) => {
      const a = anim();
      if (!a) { bar.scrollLeft -= px; return; }
      const D = a.effect.getComputedTiming().duration, half = track.scrollWidth / 2;
      if (!D || !half) return;
      const t = (Number(a.currentTime) || 0) - (px / half) * D;
      a.currentTime = ((t % D) + D) % D;
    };
    let id = null, lastX = 0, moved = 0, dragging = false, v = 0, lastT = 0, coast = 0, swallow = false;

    bar.addEventListener('pointerdown', (e) => {
      if (e.button !== 0 || (e.pointerType === 'touch' && !anim())) return; // reduced motion on touch: the native scroller already does this
      cancelAnimationFrame(coast);
      id = e.pointerId; lastX = e.clientX; lastT = e.timeStamp; moved = 0; v = 0; dragging = false;
    });
    bar.addEventListener('pointermove', (e) => {
      if (e.pointerId !== id) return;
      const dx = e.clientX - lastX, dt = Math.max(1, e.timeStamp - lastT);
      lastX = e.clientX; lastT = e.timeStamp; moved += dx;
      if (!dragging) {
        if (Math.abs(moved) < 5) return;
        dragging = true;
        bar.classList.add('is-dragging');
        try { bar.setPointerCapture(id); } catch {}
        nudge(moved - dx); // the first 5px were the threshold; give them back so the chip stays under the pointer
      }
      nudge(dx);
      v = Math.max(-4, Math.min(4, 0.7 * v + 0.3 * (dx / dt))); // px/ms; a hard flick is 2–4
      e.preventDefault();
    });
    const end = (e) => {
      if (e.pointerId !== id) return;
      id = null;
      if (!dragging) return;
      dragging = false; swallow = e.type === 'pointerup';
      if (e.timeStamp - lastT > 80) v = 0; // held still before letting go: that is a placement, not a throw
      setTimeout(() => { swallow = false; }, 0);
      /* pressing a chip focused it, and :focus-within holds the strip still — after a drag that reads as "it broke" */
      if (bar.contains(document.activeElement)) document.activeElement.blur();
      let prev = performance.now();
      const glide = (now) => {
        const dt = Math.min(48, now - prev); prev = now;
        nudge(v * dt);
        v *= Math.pow(0.94, dt / 16);
        if (Math.abs(v) > 0.02) coast = requestAnimationFrame(glide); else bar.classList.remove('is-dragging');
      };
      /* no glide on cancel, with reduced motion, or in a hidden tab (rAF barely ticks there and the bar would sit paused) */
      if (e.type === 'pointerup' && !reduced.matches && !document.hidden && Math.abs(v) > 0.05) coast = requestAnimationFrame(glide); else bar.classList.remove('is-dragging');
    };
    bar.addEventListener('pointerup', end);
    bar.addEventListener('pointercancel', end);
    bar.addEventListener('click', (e) => { if (swallow) { swallow = false; e.preventDefault(); e.stopPropagation(); } }, true);
    bar.addEventListener('dragstart', (e) => e.preventDefault());
    /* a trackpad's sideways swipe does the same job; vertical wheel is left to the page */
    bar.addEventListener('wheel', (e) => {
      if (Math.abs(e.deltaX) <= Math.abs(e.deltaY)) return;
      e.preventDefault(); nudge(-e.deltaX);
    }, { passive: false });
  }

  /* --------------------------------------------------------------- deck ---- */
  function buildDeck() {
    if (state.deckBuilt) return;
    state.deckBuilt = true;
    const grid = $('#deckGrid');
    THEMES.forEach((t, i) => {
      const th = el('div', 'thumb t-scope');
      th.dataset.slug = t.slug;
      applyTokens(th, t);
      const open = el('button', 'thumb__open');
      open.type = 'button';
      open.dataset.go = i;
      open.setAttribute('aria-label', `Show ${t.label}`);
      open.append(art(t), el('span', 'thumb__scrim'),
        el('span', 'thumb__txt', `<span class="thumb__no">${pad(i + 1)}</span><span class="thumb__name">${esc(t.label)}</span><span class="thumb__row"><i></i><i></i><i></i></span>`));
      const heart = el('button', 'heart', '<svg width="17" height="17" aria-hidden="true"><use href="#i-heart"/></svg>');
      heart.type = 'button';
      heart.dataset.heart = t.slug;
      heart.setAttribute('aria-label', `Heart ${t.label}`);
      th.append(open, heart);
      grid.append(th);
    });
    $('#deckAll').textContent = N;
  }

  function openDeck() {
    buildDeck();
    $$('.thumb').forEach((c) => c.classList.toggle('is-current', c.dataset.slug === THEMES[state.index].slug));
    renderHearts();
    if (!deck.open) deck.showModal();
    const cur = $('.thumb.is-current:not([hidden]) .thumb__open', deck);
    if (cur) { cur.focus({ preventScroll: true }); cur.scrollIntoView({ block: 'center' }); }
    schedule();
  }

  function setFilter(f) {
    state.filter = f;
    $$('[data-filter]').forEach((b) => { const on = b.dataset.filter === f; b.classList.toggle('is-on', on); b.setAttribute('aria-pressed', String(on)); });
    renderHearts();
  }

  /* ------------------------------------------------------------- toast ---- */
  function toast(msg) {
    const t = $('#toast');
    t.textContent = msg;
    t.classList.add('is-on');
    clearTimeout(toast.t);
    toast.t = setTimeout(() => t.classList.remove('is-on'), 1600);
  }
  async function copy(text, msg) {
    try { await navigator.clipboard.writeText(text); }
    catch (e) {
      const ta = el('textarea'); ta.value = text; ta.style.position = 'fixed'; ta.style.opacity = '0';
      document.body.append(ta); ta.select();
      try { document.execCommand('copy'); } finally { ta.remove(); }
    }
    toast(msg);
  }

  function heart(slug, btn) {
    const on = Hearts.toggle(slug);
    const label = THEMES.find((t) => t.slug === slug).label;
    renderHearts();
    if (btn && on) { btn.classList.remove('is-pop'); void btn.offsetWidth; btn.classList.add('is-pop'); }
    toast(on ? `♥ ${label} saved` : `${label} removed`);
  }

  /* ---------------------------------------------------- mini slide deck ---- */
  const rail = $('#mdeckRail');
  const railStep = (d) => {
    const s = $('.mslide', rail);
    rail.scrollBy({ left: d * (s.offsetWidth + 22), behavior: reduced.matches ? 'auto' : 'smooth' });
  };
  rail.addEventListener('scroll', () => {
    const s = $('.mslide', rail);
    const k = Math.round(rail.scrollLeft / (s.offsetWidth + 22));
    $$('#mdeckDots i').forEach((d, j) => d.classList.toggle('is-on', j === Math.min(k, 3)));
  }, { passive: true });

  /* ------------------------------------------------------------- events ---- */
  const ACTIONS = {
    prev: () => go(state.index - 1, -1),
    next: () => go(state.index + 1, 1),
    shuffle: () => { let k; do { k = Math.floor(Math.random() * N); } while (k === state.index); go(k); },
    play: () => setPlaying(!state.playing),
    heart: (b) => heart(THEMES[state.index].slug, b),
    deck: () => openDeck(),
    'deck-close': () => deck.close(),
    prompt: () => copy(THEMES[state.index].prompt, 'Image prompt copied'),
    'copy-tokens': () => copy(tokensCss(THEMES[state.index]), 'Tokens copied'),
    'mdeck-prev': () => railStep(-1),
    'mdeck-next': () => railStep(1),
  };

  document.addEventListener('click', (e) => {
    const t = e.target;
    const a = t.closest('[data-action]');
    if (a) return ACTIONS[a.dataset.action]?.(a);
    const h = t.closest('[data-heart]');
    if (h) return heart(h.dataset.heart, h);
    const g = t.closest('[data-go]');
    if (g) { go(Number(g.dataset.go)); if (deck.open) deck.close(); return; }
    const c = t.closest('[data-copy]');
    if (c) return copy(c.dataset.copy, `Copied ${c.dataset.copy}`);
    const f = t.closest('[data-filter]');
    if (f) return setFilter(f.dataset.filter);
    const tab = t.closest('[data-tab]');
    if (tab) {
      const k = Number(tab.dataset.tab);
      $$('.tab').forEach((b, j) => { b.classList.toggle('is-on', j === k); b.setAttribute('aria-selected', String(j === k)); });
      $$('.tabpane').forEach((p, j) => { p.hidden = j !== k; });
      return;
    }
    const seg = t.closest('.btn-group .btn');
    if (seg) $$('.btn', seg.parentNode).forEach((b) => { const on = b === seg; b.classList.toggle('is-on', on); b.setAttribute('aria-pressed', String(on)); });
    if (t === deck) deck.close(); /* the backdrop */
  });

  fader.addEventListener('input', () => go(Number(fader.value) - 1));
  tempo.addEventListener('input', () => {
    state.hold = 13 - Number(tempo.value); /* right is faster: 1 → 12s, 10 → 3s */
    $('#tempoOut').textContent = state.hold + 's';
    schedule();
  });

  document.addEventListener('keydown', (e) => {
    if (e.defaultPrevented || e.altKey || e.ctrlKey || e.metaKey) return;
    const tag = e.target.tagName;
    if (tag === 'INPUT' || tag === 'SELECT' || tag === 'TEXTAREA') return;
    if (deck.open) return; /* the dialog handles Escape itself */
    if (e.target === rail && (e.key === 'ArrowLeft' || e.key === 'ArrowRight')) return;
    const k = e.key;
    if (k === 'ArrowLeft') ACTIONS.prev();
    else if (k === 'ArrowRight') ACTIONS.next();
    else if (k === ' ' && tag !== 'BUTTON' && tag !== 'A') { e.preventDefault(); ACTIONS.play(); }
    else if (k === 'h' || k === 'H') ACTIONS.heart();
    else if (k === 'd' || k === 'D' || k === 'l' || k === 'L') ACTIONS.deck(); /* L for library; D kept so nobody's habit breaks */
  });

  /* swipe the hero */
  let down = null;
  stage.addEventListener('pointerdown', (e) => { down = { x: e.clientX, y: e.clientY }; });
  stage.addEventListener('pointerup', (e) => {
    if (!down) return;
    const dx = e.clientX - down.x, dy = e.clientY - down.y;
    down = null;
    if (Math.abs(dx) > 56 && Math.abs(dx) > Math.abs(dy) * 1.4) dx < 0 ? ACTIONS.next() : ACTIONS.prev();
  });
  stage.addEventListener('pointercancel', () => { down = null; });

  deck.addEventListener('close', schedule);
  document.addEventListener('visibilitychange', schedule);
  addEventListener('hashchange', () => {
    const k = THEMES.findIndex((t) => t.slug === fromHash());
    if (k >= 0) go(k);
  });
  new IntersectionObserver(([en]) => { state.heroVisible = en.intersectionRatio > 0.45; stage.classList.toggle('is-idle', en.intersectionRatio < 0.05); pauseSvg(); schedule(); }, { threshold: [0, 0.45, 1] }).observe(stage);
  new ResizeObserver(([en]) => root.style.setProperty('--dock-h', Math.ceil(en.contentRect.height) + 'px')).observe($('#dock'));

  /* The repository address is stated once, in a <meta>; the links follow it. */
  const repo = (document.querySelector('meta[name="themeshelf:repo"]') || {}).content || '';
  document.querySelectorAll('[data-repo-link]').forEach((n) => { if (repo) n.href = repo; else (n.closest('[data-repo-wrap]') || n).hidden = true; });

  /* --------------------------------------------------------------- boot ---- */
  fader.max = N;
  $('.ticks').style.setProperty('--n', N);
  $('#footCount').textContent = N;
  state.hold = 13 - Number(tempo.value);
  $('#tempoOut').textContent = state.hold + 's';
  /* Liquid Glass bends its backdrop with an SVG filter inside backdrop-filter. Only Chromium renders that; elsewhere
     the declaration parses and then draws nothing at all, so it is opt-in by engine, not by @supports. */
  if (window.chrome && CSS.supports('backdrop-filter', 'url(#a)')) document.documentElement.classList.add('can-lens');
  buildMarquee();
  dragMarquee();
  /* the URL's theme if it names one; otherwise whichever one index.html's boot script drew at random for this visit */
  let start = THEMES.findIndex((t) => t.slug === fromHash());
  if (start < 0) start = THEMES.findIndex((t) => t.slug === window.THEMESHELF.start);
  state.index = -1;
  go(Math.max(0, start), 1, { announce: false });
  setPlaying(state.playing);

  /* a handle for tests and for poking at it from the console */
  window.themeshelf = { go, state, Hearts, THEMES };
})();
