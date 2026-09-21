/* ThemeShelf — one hero scene per style.
 *
 * A palette does not make a style. A bento landing is a box of tiles; a Windows 95
 * landing is a desktop with a dialog on it; a poker landing is a table with a hand
 * dealt. So every theme can declare a SCENE: the structure its hero is built
 * from. The words stay the same on every slide (name, tagline, blurb, two calls
 * to action) — what they are set INTO is the style's.
 *
 *   SCENES[slug] = {
 *     copy:  extra classes for the copy block (e.g. 'card' makes it a panel, and
 *            then every flourish a theme gives a card applies to it for free)
 *     extra: (p) => html placed inside the copy, between the blurb and the buttons
 *     show:  (p) => html for the scene itself — decoration only, aria-hidden,
 *            nothing focusable
 *   }
 *
 * A theme with no entry gets the generic composition for its layout. All the
 * placement lives in css/heroes.css under `.scene--<slug>`; nothing here knows
 * where anything goes. Class prefixes are two letters per scene so no two scenes
 * can style each other.
 */
(() => {
  const ico = (id, s = 14) => `<svg width="${s}" height="${s}" aria-hidden="true"><use href="#i-${id}"/></svg>`;
  const rep = (n, f) => Array.from({ length: n }, (_, k) => f(k)).join('');

  window.THEMESHELF_SCENES = {
    /* ------------------------------------------------------------ kit themes */
    nineties: {
      show: (p) =>
        `<div class="nt-win card"><div class="nt-title"><span>Netscape - [Welcome to my homepage]</span><b>_ &#9633; &times;</b></div>` +
        `<div class="nt-tool"><span class="btn btn--secondary btn--sm">Back</span><span class="btn btn--secondary btn--sm">Reload</span><span class="btn btn--secondary btn--sm">Home</span><span class="nt-url">http://www.themeshelf.dev/~home</span></div>` +
        `<div class="nt-page"><p class="nt-h">~*~ WELCOME 2 MY HOMEPAGE ~*~</p><p class="nt-uc"><span>UNDER CONSTRUCTION</span></p>` +
        `<p class="nt-vis">You are visitor no. <b>000394</b></p><p class="nt-links"><u>Guestbook</u> | <u>Links</u> | <u>Webring</u> <span class="nt-new">NEW!</span></p></div></div>`,
    },
    win97: {
      copy: 'card w9-win',
      show: (p) =>
        `<ul class="w9-icons"><li><i class="a"></i>My Computer</li><li><i class="b"></i>Recycle Bin</li><li><i class="c"></i>Themes</li></ul>` +
        `<div class="w9-dlg card"><div class="w9-bar"><span>ThemeShelf</span><b>&times;</b></div><div class="w9-body"><i class="w9-info">i</i><p>${p.tagline}</p></div><div class="w9-ok"><span class="btn btn--secondary btn--sm">OK</span></div></div>` +
        `<div class="w9-task"><span class="btn btn--secondary btn--sm w9-start"><i></i>Start</span><span class="w9-app">ThemeShelf - ${p.label}</span><span class="w9-clock">4:20 PM</span></div>`,
    },
    terminal: {
      copy: 'card tm-win',
      extra: () => `<p class="tm-line">$ themeshelf apply --theme terminal<br><span>[ OK ] 38 tokens written in 12ms</span><i class="tm-cur"></i></p>`,
      show: () =>
        `<pre class="tm-log tm-l">[  0.000] boot: themeshelf 1.0\n[  0.012] fonts: VT323 ......... ok\n[  0.019] palette: 2 colours ... ok\n[  0.021] radius: 0px ........... ok\n[  0.030] scanlines ............. on\n[  0.044] phosphor: P1 green\n[  0.051] ready.</pre>` +
        `<pre class="tm-log tm-r">+---------------------+\n| CPU  [#####.....] 52 |\n| MEM  [########..] 81 |\n| NET  [##........] 17 |\n+---------------------+\n uptime 39 themes</pre>`,
    },
    neon: {
      show: () => `<i class="ne-wall"></i><i class="ne-frame"></i><span class="ne-sign ne-open">OPEN</span><span class="ne-sign ne-24">24h</span><i class="ne-arrow"></i>`,
    },
    steampunk: {
      copy: 'card sp-plate',
      show: () =>
        `<i class="sp-gear g1"></i><i class="sp-gear g2"></i><i class="sp-gear g3"></i><i class="sp-gear g4"></i>` +
        `<div class="sp-gauge ga"><i></i><span>PSI</span></div><div class="sp-gauge gb"><i></i><span>RPM</span></div><i class="sp-pipe"></i>`,
    },
    poker: {
      show: () =>
        `<div class="pk-hand">${[['10', '♠'], ['J', '♠'], ['Q', '♠'], ['K', '♠'], ['A', '♠']].map(([r, s], k) => `<div class="pk-card" style="--k:${k}"><b>${r}</b><i>${s}</i><em>${s}</em></div>`).join('')}</div>` +
        `<div class="pk-chips">${rep(3, (c) => `<div class="pk-stack s${c}">${rep(4 + c, () => '<i></i>')}</div>`)}</div><i class="pk-rail"></i>`,
    },
    discord: {
      show: (p) =>
        `<div class="dc-app card"><div class="dc-srv"><i class="on"></i><i></i><i></i><i></i><i class="add">+</i></div>` +
        `<div class="dc-chan"><b>ThemeShelf</b><span># general</span><span class="on"># themes</span><span># showcase</span><span># off-topic</span><div class="dc-me"><i></i>you</div></div>` +
        `<div class="dc-chat"><div class="dc-top"># themes</div>` +
        `<div class="dc-msg"><i class="a"></i><p><b>mara</b><small>today at 4:20</small><br>has anyone tried the new theme?</p></div>` +
        `<div class="dc-msg"><i class="b"></i><p><b>jonas</b><small>today at 4:21</small><br>${p.tagline} <span class="dc-react">♥ 12</span></p></div>` +
        `<div class="dc-msg"><i class="c"></i><p><b>ayo</b><small>today at 4:21</small><br>blurple supremacy</p></div>` +
        `<div class="dc-input">Message #themes</div></div></div>`,
    },
    /* A paper has figures and tables, not pictures: a scatter with its fitted line and confidence band, axis titles in
       italics, a numbered caption; then a booktabs table — three rules, no verticals — and the footnotes. */
    academic: {
      copy: 'ac-page',
      extra: () => `<p class="ac-auth">N. Cabel<sup>1</sup> · ThemeShelf Working Papers · Vol. 13 · 2026</p>`,
      show: (p) =>
        `<figure class="ac-fig ac2-fig card"><svg viewBox="0 0 320 206" aria-hidden="true"><g class="ac2-grid"><path d="M30 138H306M30 100H306M30 62H306M30 24H306"/></g>` +
        `<path class="ac2-band" d="M30 184 306 40V72L30 160Z"/><path class="ac2-fit" d="M30 172 306 52"/><g class="ac2-dots"><circle cx="34" cy="145" r="2.6"/><circle cx="44" cy="155" r="2.6"/><circle cx="55" cy="165" r="2.6"/><circle cx="65" cy="172" r="2.6"/><circle cx="76" cy="137" r="2.6"/><circle cx="86" cy="147" r="2.6"/><circle cx="96" cy="157" r="2.6"/><circle cx="107" cy="119" r="2.6"/><circle cx="117" cy="129" r="2.6"/><circle cx="128" cy="139" r="2.6"/><circle cx="138" cy="101" r="2.6"/><circle cx="148" cy="111" r="2.6"/><circle cx="159" cy="121" r="2.6"/><circle cx="169" cy="131" r="2.6"/><circle cx="180" cy="93" r="2.6"/><circle cx="190" cy="103" r="2.6"/><circle cx="200" cy="113" r="2.6"/><circle cx="211" cy="75" r="2.6"/><circle cx="221" cy="85" r="2.6"/><circle cx="232" cy="95" r="2.6"/><circle cx="242" cy="57" r="2.6"/><circle cx="252" cy="67" r="2.6"/><circle cx="263" cy="77" r="2.6"/><circle cx="273" cy="39" r="2.6"/><circle cx="284" cy="49" r="2.6"/><circle cx="294" cy="59" r="2.6"/></g>` +
        `<path class="ac2-axis" d="M30 14V176H310"/><g class="ac2-tick"><text x="30" y="190">1</text><text x="122" y="190">4.5</text><text x="214" y="190">7</text><text x="300" y="190">21</text><text x="22" y="178" text-anchor="end">0</text><text x="22" y="102" text-anchor="end">.5</text><text x="22" y="28" text-anchor="end">1</text></g>` +
        `<text class="ac2-lab" x="170" y="204" text-anchor="middle">contrast ratio (log)</text><text class="ac2-lab" x="9" y="96" text-anchor="middle" transform="rotate(-90 9 96)">legibility</text></svg>` +
        `<figcaption><b>Figure 1.</b> Legibility against contrast ratio across ${p.N} themes. Line: least-squares fit; band: 95% CI.</figcaption></figure>` +
        `<table class="ac2-tab"><caption><b>Table 1.</b> Summary by shelf.</caption><thead><tr><th>Shelf</th><th>n</th><th>Mean</th><th>s.d.</th></tr></thead><tbody><tr><td>UI themes</td><td>17</td><td>9.41</td><td>2.10</td></tr><tr><td>Aesthetics</td><td>${p.N - 17}</td><td>8.87</td><td>3.02</td></tr></tbody></table>` +
        `<p class="ac-foot"><sup>1</sup> Footnotes included. <sup>2</sup> Hairlines measured at one pixel. <sup>3</sup> <i>Ibid.</i></p>`,
    },
    /* A statement, not a list: the account and its closing balance over a sparkline, a journal with a running balance
       and a ruled-off total (single rule above, double below, as a bookkeeper would), and the tape underneath. */
    money: {
      show: (p) =>
        `<div class="ld-book ld2 card"><div class="ld-head"><div><span class="label">ThemeShelf Studio &middot; Operating</span><b class="stat disp">$48,290.00</b><small>Closing balance &middot; 19 Sep 2026</small></div>${p.spark}</div>` +
        `<table class="ld-t"><tr><th>Date</th><th>Entry</th><th>Debit</th><th>Credit</th><th>Balance</th></tr>` +
        [['09/14', 'Retainer — Studio', '', '4,200.00', '44,207.00'], ['09/15', 'Hosting', '38.00', '', '44,169.00'], ['09/17', 'Invoice #1042', '', '1,850.00', '46,019.00'], ['09/18', 'Fonts licence', '129.00', '', '45,890.00'], ['09/19', 'Invoice #1043', '', '2,400.00', '48,290.00']]
          .map((r) => `<tr><td>${r[0]}</td><td>${r[1]}</td><td class="d">${r[2]}</td><td class="c">${r[3]}</td><td class="b">${r[4]}</td></tr>`).join('') +
        `<tr class="tot"><td></td><td>Period total</td><td class="d">167.00</td><td class="c">8,450.00</td><td class="b">48,290.00</td></tr></table></div>` +
        `<div class="ld-tick"><span>${rep(2, () => 'THM +1.24% &nbsp; PXL −0.31% &nbsp; GLD +0.88% &nbsp; INK +2.02% &nbsp; ')}</span></div>`,
    },
    y2k: {
      show: () =>
        `<div class="w2-win card"><div class="w2-tabs"><span class="on">Home</span><span>Tour</span><span>Blog</span><span>Sign up</span></div>` +
        `<div class="w2-body"><b class="w2-logo disp">themeshelf</b><b class="w2-logo w2-refl disp" aria-hidden="true">themeshelf</b><span class="btn btn--primary">Sign up &mdash; it&rsquo;s free!</span>` +
        `<p class="w2-tags"><u>tags</u> <b>themes</b> design <b>css</b> gel <b>shiny</b> rss</p></div></div><span class="w2-burst"><b>BETA</b></span>`,
    },
    /* The card as the game prints it: a black keyline, the colour band with the property name, RENT on its own line,
       the house ladder with dotted leaders, the mortgage block, the small print — on top of two more deeds from other
       colour groups, with houses, a hotel and the dice on the table beside it. */
    deed: {
      show: (p) =>
        `<div class="dd2-stack"><div class="dd2 c2"><div class="dd2-band"></div></div><div class="dd2 c1"><div class="dd2-band"></div></div>` +
        `<div class="dd2 main"><div class="dd2-band"><small>TITLE DEED</small><b>THEMESHELF AVENUE</b></div><p class="dd2-rent">RENT $${Number(p.n)}.</p>` +
        `<ul>${[['With 1 House', '150'], ['With 2 Houses', '450'], ['With 3 Houses', '1000'], ['With 4 Houses', '1200'], ['With HOTEL', '1400']].map(([a, b]) => `<li><span>${a}</span><i></i><b>$ ${b}.</b></li>`).join('')}</ul>` +
        `<p class="dd2-m">Mortgage Value $200.<br>Houses cost $200. each<br>Hotels, $200. plus 4 houses</p><small>If a player owns ALL the themes of any colour-group, the rent is doubled on unimproved themes in that group.</small></div></div>` +
        `<div class="dd2-tok"><i class="hs"></i><i class="hs"></i><i class="hs"></i><i class="ht"></i></div><div class="dd-dice dd2-dice"><i></i><i class="b"></i></div>`,
    },
    /* A boarding pass with everything a boarding pass has: the carrier band, city names over the codes, a flight path
       between them, the passenger block, and a stub torn along a perforation with a notch punched at each end —
       plus the bag tag that goes with it. */
    vacation: {
      show: () =>
        `<div class="vc2-pass"><div class="vc2-main"><header><b>THEMESHELF AIR</b><span>Boarding pass</span></header>` +
        `<div class="vc2-route"><div><small>Lisbon</small><b class="disp">LIS</b></div><i class="vc2-path">${ico('arrow', 18)}</i><div><small>Honolulu</small><b class="disp">HNL</b></div></div>` +
        `<dl>${[['Passenger', 'READER / MX'], ['Flight', 'TS 0404'], ['Date', '19 SEP'], ['Gate', 'A12'], ['Boards', '09:40'], ['Seat', '14F']].map(([a, b]) => `<div><dt>${a}</dt><dd>${b}</dd></div>`).join('')}</dl></div>` +
        `<div class="vc2-stub"><small>Seat</small><b class="disp">14F</b><span>TS 0404 &middot; A12</span><i class="vc2-bar"></i></div></div>` +
        `<div class="vc2-tag"><i></i><b class="disp">HNL</b><span>ThemeShelf Air &middot; Priority</span></div><span class="vc-tag badge badge--accent">Out of office</span>`,
    },
    ai: {
      extra: () =>
        `<div class="ai-box card"><span class="ai-orb"></span><span class="ai-ph">Ask anything about this theme…</span><span class="ai-send">${ico('arrow', 16)}</span></div>` +
        `<p class="ai-chips"><span class="badge">Summarise the palette</span><span class="badge">Pick a font pairing</span><span class="badge">Export tokens</span></p>`,
      show: () => `<i class="ai-glow a"></i><i class="ai-glow b"></i>`,
    },

    /* ------------------------------------------------------ design aesthetics */
    clay: {
      show: () =>
        `<i class="cl-blob b1"></i><i class="cl-blob b2"></i><i class="cl-blob b3"></i><i class="cl-ring"></i>` +
        `<div class="cl-phone card"><i class="cl-notch"></i><i class="cl-av"></i><i class="cl-l"></i><i class="cl-l s"></i><span class="btn btn--primary btn--sm">Follow</span><div class="cl-g"><i></i><i></i><i></i><i></i></div></div>`,
    },
    cybercore: {
      show: () =>
        `<i class="cc-ring r1"></i><i class="cc-ring r2"></i><i class="cc-ring r3"></i><i class="cc-cross"></i><i class="cc-scan"></i>` +
        `<span class="cc-read tl">SYS.CORE // ONLINE<br>LAT 38.7223 · LON −9.1393</span><span class="cc-read tr">SIGNAL 98.2%<br>TEMP −12°C</span>` +
        `<span class="cc-read bl">NODE 19 / 39<br>CHROME.SHELL v5.1</span><span class="cc-read br">UPLINK ▮▮▮▮▮▯▯<br>LATENCY 04ms</span>`,
    },
    brutal: {
      show: () =>
        `<i class="bt-blk y"></i><i class="bt-blk p"></i><i class="bt-blk o"></i>` +
        `<div class="bt-card card"><b class="disp">LOUD</b><span>by design.</span><span class="btn btn--primary btn--sm">Click me ${ico('arrow')}</span></div>` +
        `<span class="bt-star"><b>NEW</b></span><span class="bt-arrow">${ico('arrow', 64)}</span>` +
        `<div class="bt-tape"><span>${rep(4, () => 'LOUD BY DESIGN ✦ NO GRADIENTS ✦ THICK BORDERS ✦ ')}</span></div>`,
    },
    scrapbook: {
      show: (p) =>
        `<div class="sb-pol card a"><div class="sb-pic" data-hero-art></div><p class="disp">summer ’26</p></div>` +
        `<div class="sb-pol card b"><div class="sb-pic" data-hero-art></div><p class="disp">${p.label}</p></div>` +
        `<div class="sb-note"><p class="disp">${p.tagline}</p></div><i class="sb-washi w1"></i><i class="sb-washi w2"></i>` +
        `<span class="sb-tick">ticket · admit one · no. ${p.n}</span><i class="sb-flower"></i>` +
        `<svg class="sb-doodle" viewBox="0 0 120 60" aria-hidden="true"><path d="M4 40 C30 4 60 70 84 24 l-12 2 m12 -2 l-2 12" /></svg>`,
    },
    surreal: {
      show: () =>
        `<i class="sr-floor"></i><i class="sr-moon"></i><div class="sr-door"><i></i></div><i class="sr-cloud c1"></i><i class="sr-cloud c2"></i><i class="sr-cloud c3"></i>` +
        `<i class="sr-ball"></i><i class="sr-cube"></i><i class="sr-stair"></i>`,
    },
    y2kchrome: {
      show: () =>
        `<i class="yk-globe"><i></i><i></i><i></i><i></i></i>${rep(6, (k) => `<span class="yk-star s${k}">✦</span>`)}` +
        `<div class="yk-win card"><div class="yk-bar"><span>welcome.exe</span><b>&times;</b></div><p>u have <b>1</b> new theme ♥</p><span class="btn btn--primary btn--sm">OK!!</span></div>` +
        `<div class="yk-load card"><span>loading the future…</span><div><i></i></div></div>`,
    },
    pixel: {
      copy: 'card px-dlg',
      extra: () => `<p class="px-start">▶ PRESS START</p>`,
      show: (p) =>
        `<i class="px-sun"></i><i class="px-cloud c1"></i><i class="px-cloud c2"></i><i class="px-hill h1"></i><i class="px-hill h2"></i><i class="px-ground"></i><i class="px-tree t1"></i><i class="px-tree t2"></i>` +
        `<div class="px-hud"><span>♥ ♥ ♥</span><span>SCORE 00${p.n}00</span><span>WORLD ${Number(p.n)}-1</span></div>`,
    },
    synthwave: {
      show: (p) => `<i class="sy-stars"></i><i class="sy-mtn m1"></i><i class="sy-mtn m2"></i>${p.stat}${p.pal}`,
    },
    glass: { copy: 'card gl-copy', show: (p) => glass(p) },
    glassmorphism: { copy: 'card gl-copy', show: (p) => glass(p) },
    neu: {
      show: (p) =>
        `<div class="nm-player card"><div class="nm-dial"><div class="nm-knob"><i></i></div></div>` +
        `<div class="nm-meta"><b>${p.tagline}</b><span>ThemeShelf Radio · 98.2</span></div><div class="nm-bar"><i></i></div>` +
        `<div class="nm-ctrl"><span class="nm-btn">${ico('prev', 16)}</span><span class="nm-btn on">${ico('pause', 18)}</span><span class="nm-btn">${ico('next', 16)}</span></div></div>` +
        `<div class="nm-tog card"><span class="label">Ambient</span><span class="nm-sw"><i></i></span></div>`,
    },
    bento: {
      copy: 'card',
      show: (p) =>
        `<div class="bn card bn-art"><div class="sc-art" data-hero-art></div><span class="badge badge--accent">Featured</span></div>` +
        `<div class="bn card bn-count"><b class="stat disp">${p.n}</b><span>of ${p.N} styles</span></div>` +
        `<div class="bn card bn-stat"><span class="label">Growth</span><b class="stat disp">+38%</b>${p.spark}</div>` +
        `<div class="bn card bn-pal"><span class="label">Palette</span><span class="show__sw">${p.sw}</span><span class="bn-hex">${p.t.accentHex}</span></div>` +
        `<div class="bn card bn-type"><b class="disp">Aa</b><span>${p.font}</span></div>` +
        `<div class="bn card bn-ppl"><span class="bn-avs"><i>MR</i><i>JK</i><i>AL</i></span><span>2.4k makers</span></div>` +
        `<div class="bn card bn-tog"><span class="label">Rounded</span><span class="switch"><input type="checkbox" checked tabindex="-1" disabled><i></i></span></div>`,
    },
    editorial: {
      show: (p) =>
        `<p class="ed-mast"><b class="disp">The Shelf</b><span>Quarterly · Vol. ${p.n} · Autumn 2026 · $12</span></p>` +
        `<figure class="ed-fig card"><div class="ed-pic" data-hero-art></div><figcaption>Above: ${p.label}, photographed for The Shelf.</figcaption></figure>` +
        `<blockquote class="ed-q disp">&ldquo;${p.tagline}&rdquo;</blockquote>` +
        `<p class="ed-col">A theme is a point of view. This one believes in hairlines, in a serif with opinions, and in one red used exactly once per page. Turn to page ${p.n}.</p>`,
    },
    swiss: {
      show: (p) =>
        `<i class="ss-circle"></i><i class="ss-bar"></i><i class="ss-sq"></i><ol class="ss-cols">${rep(6, (k) => `<li>0${k + 1}</li>`)}</ol>` +
        `<p class="ss-note"><b>Neue Grafik</b><br>Internationale Ausstellung<br>Zürich — ${p.n}.09.2026</p><p class="ss-big">${p.n}</p>`,
    },
    minimal: {
      show: () => `<i class="mi-dot"></i><i class="mi-line"></i><span class="mi-cap">Fig. 1 — a circle, a line.</span>`,
    },
    maximal: {
      show: (p) =>
        `<i class="mx-band b1"></i><i class="mx-band b2"></i><i class="mx-band b3"></i><i class="mx-band b4"></i><i class="mx-flower f1"></i><i class="mx-flower f2"></i><i class="mx-flower f3"></i>` +
        `<div class="mx-pol card"><div class="sb-pic" data-hero-art></div><p class="disp">${p.label}</p></div>` +
        `<span class="mx-st s1">MORE!</span><span class="mx-st s2">WOW</span><span class="mx-st s3">100%</span><span class="mx-echo disp" aria-hidden="true">MORE<br>MORE<br>MORE</span>`,
    },
    luxury: {
      extra: () => `<p class="lx-est"><i></i>EST · MMXXVI<i></i></p>`,
      show: () => `<i class="lx-frame"></i><span class="lx-mono disp">TS</span><span class="lx-city">PARIS &nbsp;·&nbsp; MILANO &nbsp;·&nbsp; NEW YORK</span>`,
    },
    sketch: {
      show: () =>
        `<div class="sk-wire card"><div class="sk-nav"><i></i><i></i><i></i><b></b></div><div class="sk-x"></div><i class="sk-l"></i><i class="sk-l s"></i><i class="sk-l"></i><span class="sk-btn">CTA</span><span class="sk-btn g">link</span></div>` +
        `<span class="sk-note n1">hero image<br>goes here?</span><span class="sk-note n2">make this pop!</span><span class="sk-note n3">v3 — FINAL (really)</span>` +
        `<svg class="sk-arr a1" viewBox="0 0 100 60" aria-hidden="true"><path d="M6 8 C40 0 70 20 88 50 m0 0 l-14 -4 m14 4 l2 -14"/></svg>` +
        `<svg class="sk-arr a2" viewBox="0 0 100 60" aria-hidden="true"><path d="M94 52 C60 60 30 40 10 10 m0 0 l14 2 m-14 -2 l0 14"/></svg><i class="sk-dim"></i>`,
    },
    ethereal: {
      copy: 'card gl-copy',
      show: () => `<i class="et-veil v1"></i><i class="et-veil v2"></i><i class="et-veil v3"></i><i class="et-ring"></i>${rep(7, (k) => `<span class="et-sp s${k}">✦</span>`)}`,
    },
    boho: {
      show: () =>
        `<i class="bo-sun"></i><i class="bo-rain"></i><div class="bo-arch"><div class="bo-pic" data-hero-art></div></div><div class="bo-arch sm"></div>` +
        `<i class="bo-leaf l1"></i><i class="bo-leaf l2"></i><i class="bo-leaf l3"></i><i class="bo-dots"></i>`,
    },
    victorian: {
      copy: 'card vt-plate',
      extra: () => `<p class="vt-est">❧ Established MDCCCXXXVII ☙</p>`,
      show: () => `<i class="vt-wall"></i><div class="vt-cameo l"><div class="vt-pic" data-hero-art></div></div><div class="vt-cameo r"><div class="vt-pic" data-hero-art></div></div><i class="vt-lamp l"></i><i class="vt-lamp r"></i>`,
    },
    cyberpunk: {
      show: () =>
        `<div class="cp-city">${[38, 62, 46, 84, 56, 96, 70, 44, 78, 52, 66, 40].map((h, k) => `<i style="--h:${h}" class="${k % 3 === 0 ? 'c' : ''}"></i>`).join('')}</div>` +
        `<div class="cp-panel card"><span class="label">SYS//BATTERY</span><b class="stat disp">12%</b><div class="cp-batt"><i></i></div><i class="cp-code"></i></div>` +
        `<div class="cp-tape"><span>${rep(5, () => 'WARNING // LOW BATTERY // HIGH TECH // ')}</span></div><span class="cp-id">NC-2077 · SECTOR 38</span>`,
    },
    wabisabi: {
      show: () =>
        `<i class="wb-enso"></i><i class="wb-bowl"></i><svg class="wb-crack" viewBox="0 0 200 120" aria-hidden="true"><path d="M8 20 L46 44 L70 38 L104 76 L132 70 L190 108 M70 38 L82 12 M104 76 L96 104"/></svg>` +
        `<span class="wb-vert">imperfect · impermanent · incomplete</span><i class="wb-stone"></i>`,
    },
  };

  /* Glassmorphia and Glassmorphism share a scene: the glass credit card, because
     that card over a pair of orbs is the image the style was named for. */
  function glass(p) {
    return (
      `<div class="gl-pane card p1"></div>` +
      `<div class="gl-pane card p2"><div class="card__body"><span class="label">Balance</span><b class="stat disp">$48,290</b>${p.spark}</div></div>` +
      `<div class="gl-pane card p3"><i class="gl-chip"></i><span class="gl-num">••••&nbsp; ••••&nbsp; ••••&nbsp; 4242</span><span class="gl-row"><span>THEMESHELF</span><span>09 / 29</span></span></div>`
    );
  }
})();
