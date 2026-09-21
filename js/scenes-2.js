/* ThemeShelf — hero scenes, part 2: the forty-eight later aesthetics.
 *
 * Several of these are relatives of a scene in part 1 — a DOS prompt is a terminal
 * session, a newspaper is an editorial spread, a zine is a scrapbook with a
 * photocopier. Those declare `as: '<base>'`: the slide then carries the base
 * scene's class as well as its own, so the base placement in heroes.css applies
 * and heroes-2.css only has to say what is different. Everything else is its own
 * scene, prefixed two or three letters like part 1.
 */
(() => {
  const S = window.THEMESHELF_SCENES;
  const rep = (n, f) => Array.from({ length: n }, (_, k) => f(k)).join('');
  /* the shelf's size, spelled out — several scenes quote it, and it changes whenever a theme is added */
  const words = (n) => { const o = ['', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine'], t = ['', '', 'twenty', 'thirty', 'forty', 'fifty', 'sixty', 'seventy', 'eighty', 'ninety']; return n >= 20 && n < 100 ? t[Math.floor(n / 10)] + (n % 10 ? '-' + o[n % 10] : '') : String(n); };
  const ico = (id, s = 14) => `<svg width="${s}" height="${s}" aria-hidden="true"><use href="#i-${id}"/></svg>`;
  const log = (l, r) => `<pre class="tm-log tm-l">${l}</pre><pre class="tm-log tm-r">${r}</pre>`;
  const win = (title, url, page, cls = '') =>
    `<div class="nt-win card ${cls}"><div class="nt-title"><span>${title}</span><b>_ &#9633; &times;</b></div>` +
    `<div class="nt-tool"><span class="btn btn--secondary btn--sm">Back</span><span class="btn btn--secondary btn--sm">Home</span><span class="nt-url">${url}</span></div><div class="nt-page">${page}</div></div>`;
  const pols = (p, a, b) =>
    `<div class="sb-pol card a"><div class="sb-pic" data-hero-art></div><p class="disp">${a}</p></div><div class="sb-pol card b"><div class="sb-pic" data-hero-art></div><p class="disp">${b}</p></div>`;

  Object.assign(S, {
    /* ---------------------------------------------------------- geometric --- */
    bauhaus: { show: () => `<i class="bh c"></i><i class="bh s"></i><i class="bh t"></i><i class="bh q"></i><i class="bh b1"></i><i class="bh b2"></i><i class="bh r"></i>` },
    constructivist: { show: (p) => `<i class="cv w"></i><i class="cv c"></i><i class="cv b1"></i><i class="cv b2"></i><i class="cv b3"></i><span class="cv-t disp">${p.tagline}</span><span class="cv-n disp">${p.n}</span>` },
    memphis: {
      show: (p) =>
        `<i class="mp tri"></i><i class="mp cir"></i><i class="mp dots"></i><i class="mp zig"></i><i class="mp half"></i><i class="mp grid"></i>` +
        `<svg class="mp-sq a" viewBox="0 0 120 30" aria-hidden="true"><path d="M2 15 q10 -18 20 0 t20 0 t20 0 t20 0 t20 0 t16 0"/></svg><svg class="mp-sq b" viewBox="0 0 120 30" aria-hidden="true"><path d="M2 15 q10 -18 20 0 t20 0 t20 0 t20 0 t20 0 t16 0"/></svg>` +
        `<div class="mp-card card"><b class="disp">1981</b><span>${p.tagline}</span></div>`,
    },
    midcentury: { show: () => `<i class="mc boom a"></i><i class="mc boom b"></i><div class="mc-clock"><i></i></div><div class="mc-lamp"><i></i></div><div class="mc-side"><i></i><i></i></div><i class="mc-plant"></i>` },
    atomic: { show: () => `${rep(3, (k) => `<i class="at star s${k}"></i>`)}<div class="at-atom"><i></i><i></i><i></i><b></b></div><i class="at boom a"></i><i class="at boom b"></i><i class="at diamond"></i>` },
    corpmemphis: { show: () => `<i class="cm blob a"></i><i class="cm blob b"></i><div class="cm-fig"><i class="h"></i><i class="bd"></i><i class="a1"></i><i class="a2"></i><i class="l1"></i><i class="l2"></i></div><i class="cm plant"></i><i class="cm pot"></i><span class="cm-bub card">Let&rsquo;s sync!</span>` },
    artdeco: { show: () => `<i class="ad fan l"></i><i class="ad fan r"></i><i class="ad zig l"></i><i class="ad zig r"></i><i class="ad rays"></i><i class="ad chev t"></i><i class="ad chev b"></i>` },
    metro: { show: () => `<i class="mt swirl a"></i><i class="mt swirl b"></i><i class="mt swirl c"></i><div class="mt-city">${[30, 52, 40, 70, 46, 84, 58, 36, 64].map((h) => `<i style="--h:${h}"></i>`).join('')}</div><i class="mt arrow a"></i><i class="mt arrow b"></i>${rep(4, (k) => `<i class="mt dot d${k}"></i>`)}` },
    brutalism: {
      show: (p) => `<pre class="br-src">&lt;table border=1 width=100%&gt;\n &lt;tr&gt;&lt;td&gt;no&lt;/td&gt;&lt;td&gt;decoration&lt;/td&gt;&lt;/tr&gt;\n&lt;/table&gt;</pre><table class="br-t"><tr><th>#</th><th>Element</th><th>Status</th></tr><tr><td>01</td><td><u>header</u></td><td>raw</td></tr><tr><td>02</td><td><u>grid</u></td><td>exposed</td></tr><tr><td>03</td><td><u>${p.label}</u></td><td>200 OK</td></tr></table><i class="br-mark"></i>`,
    },
    artnouveau: {
      show: () =>
        `<div class="an-arch"><div class="bo-pic" data-hero-art></div></div><svg class="an-vine l" viewBox="0 0 120 400" aria-hidden="true"><path d="M60 400 C0 320 120 260 50 190 C-10 130 110 90 60 10"/><path d="M52 300 c-30 -6 -44 -30 -40 -52 c26 4 42 24 40 52z M66 200 c30 -6 44 -30 40 -52 c-26 4 -42 24 -40 52z M54 110 c-26 -8 -36 -30 -30 -48 c22 6 34 24 30 48z"/></svg>` +
        `<svg class="an-vine r" viewBox="0 0 120 400" aria-hidden="true"><path d="M60 400 C0 320 120 260 50 190 C-10 130 110 90 60 10"/><path d="M52 300 c-30 -6 -44 -30 -40 -52 c26 4 42 24 40 52z M66 200 c30 -6 44 -30 40 -52 c-26 4 -42 24 -40 52z M54 110 c-26 -8 -36 -30 -30 -48 c22 6 34 24 30 48z"/></svg><i class="an-flower a"></i><i class="an-flower b"></i>`,
    },

    /* ------------------------------------------------------ neon horizons --- */
    outrun: { as: 'synthwave', show: (p) => `<i class="sy-stars"></i><i class="sy-mtn m1"></i><i class="sy-mtn m2"></i><i class="or-road"></i><div class="or-car"><i></i></div>${p.stat}${p.pal}` },
    vaporwave: {
      as: 'synthwave',
      show: (p) => `<i class="sy-stars"></i><i class="sy-mtn m2"></i><i class="vw-palm l"></i><i class="vw-palm r"></i><div class="vw-win card"><div class="yk-bar"><span>aesthetic.exe</span><b>&times;</b></div><p>it is 1996 forever</p><span class="btn btn--secondary btn--sm">OK</span></div><div class="vw-bust"></div>${p.pal}`,
    },
    noir: {
      as: 'cyberpunk',
      show: () => `<div class="cp-city">${[38, 62, 46, 84, 56, 96, 70, 44, 78, 52, 66, 40].map((h, k) => `<i style="--h:${h}" class="${k % 3 === 0 ? 'c' : ''}"></i>`).join('')}</div><i class="nr-rain"></i><span class="nr-sign a">HOTEL</span><span class="nr-sign b">BAR</span><i class="nr-lamp"></i>`,
    },

    /* ------------------------------------------------ operating systems --- */
    web1: {
      as: 'nineties',
      show: (p) => win('Mosaic - Home Page', 'http://www.themeshelf.dev/index.html', `<h3>${p.label}</h3><hr><p>Welcome to my <u>home page</u>. It is under <u>construction</u>.</p><table border="1"><tr><td><u>About me</u></td><td><u>My links</u></td><td><u>Guestbook</u></td></tr></table><hr><p><small>Best viewed at 800&times;600 in <u>Netscape 2.0</u> · You are visitor <b>000394</b></small></p>`, 'w1'),
    },
    geocities: {
      as: 'nineties',
      show: (p) => win('~*~ my geocities page ~*~', 'geocities.com/SiliconValley/Heights/3938', `<p class="gc-rb">W E L C O M E ! ! !</p><i class="gc-fire"></i><p class="nt-uc"><span>UNDER CONSTRUCTION</span></p><p class="nt-vis">hits: <b>000394</b> &nbsp; <span class="nt-new">NEW!</span></p><p class="nt-links"><u>sign my guestbook</u> | <u>webring</u> | <u>e-mail me</u></p><i class="gc-fire"></i>`, 'gc'),
    },
    macclassic: {
      copy: 'card mac-win',
      show: () => `<div class="mac-menu"><b></b><span>File</span><span>Edit</span><span>View</span><span>Special</span></div><ul class="mac-ic"><li><i class="hd"></i>Macintosh HD</li><li><i class="fl"></i>Themes</li><li><i class="tr"></i>Trash</li></ul><div class="mac-dlg card"><i class="mac-face"></i><p>Welcome to Macintosh.</p></div>`,
    },
    winxp: {
      copy: 'card xp-win',
      show: (p) => `<i class="xp-hill"></i><i class="xp-cloud a"></i><i class="xp-cloud b"></i><ul class="xp-ic"><li><i></i>My Computer</li><li><i class="b"></i>My Themes</li><li><i class="c"></i>Recycle Bin</li></ul><div class="xp-bal card"><b>${p.label}</b><span>${p.tagline}</span></div><div class="xp-task"><span class="xp-start">start</span><span class="xp-app">ThemeShelf</span><span class="xp-clock">4:20 PM</span></div>`,
    },
    vista: {
      copy: 'card gl-copy',
      show: (p) => `<div class="vs-side"><div class="vs-g card"><div class="vs-clock"><i></i><b></b></div></div><div class="vs-g card"><span class="label">CPU</span><b class="stat disp">38%</b></div><div class="vs-g card">${p.spark}</div></div><i class="vs-aur a"></i><i class="vs-aur b"></i><div class="vs-task"><i class="vs-orb"></i><span></span><span></span><span></span></div>`,
    },

    /* ---------------------------------------------------------- consoles --- */
    dos: {
      as: 'terminal', copy: 'card tm-win dos',
      extra: (p) => `<p class="tm-line">C:\\THEMES&gt; dir /w<br><span>PAPER.CSS &nbsp; NIGHT.CSS &nbsp; DOS.CSS &nbsp; ${p.N} file(s)</span><br>C:\\THEMES&gt;<i class="tm-cur"></i></p>`,
      show: (p) => log('Starting MS-DOS...\n\nHIMEM is testing extended memory...done.\nC:\\>SET BLASTER=A220 I5 D1\nC:\\>MOUSE.COM\nC:\\>CD THEMES', ' Volume in drive C is THEMESHELF\n Directory of C:\\THEMES\n\n        ' + p.N + ' file(s)    640,000 bytes\n                      38,912 bytes free'),
    },
    crt: {
      as: 'terminal', copy: 'card tm-win',
      extra: () => `<p class="tm-line">LOGIN: guest<br><span>LAST LOGIN 09/19/86 ON TTY03</span><i class="tm-cur"></i></p>`,
      show: () => `<i class="crt-bezel"></i>` + log('VT-100 SELF TEST ........ OK\nPHOSPHOR P1 ............ WARM\nBAUD 9600 8N1\nCARRIER DETECT', 'H-HOLD  [====|====]\nV-HOLD  [===|=====]\nBRIGHT  [=======|=]\nCONTRAST[======|==]'),
    },
    hacker: {
      as: 'terminal', copy: 'card tm-win',
      extra: (p) => `<p class="tm-line">$ ./breach --target themeshelf<br><span>[+] handshake ok &nbsp; [+] ${p.N} themes dumped</span><i class="tm-cur"></i></p>`,
      show: () => `<div class="hk-rain">${rep(22, (k) => `<i style="--d:${(k * 37) % 9}s;--x:${k * 4.6}%">${'01ｱ7Z9#XΩ4E2&'.split('').sort(() => (k % 3) - 1).join('<br>')}</i>`)}</div>` + log('nmap -sS 10.0.0.0/24\n22/tcp  open  ssh\n80/tcp  open  http\n443/tcp open  https\nroot@shelf:~#', 'CPU ▮▮▮▮▮▮▯▯ 74%\nNET ▮▮▮▯▯▯▯▯ 38%\nENC AES-256 ✓\nVPN 7 hops'),
    },
    bios: {
      copy: 'card bi-box',
      show: (p) => `<p class="bi-top">ThemeShelf BIOS Setup Utility &mdash; Copyright (C) 1984-2026</p><p class="bi-tabs"><b>Main</b><span>Advanced</span><span>Themes</span><span>Boot</span><span>Exit</span></p><pre class="bi-l">System Time    [16:20:38]\nSystem Date    [09/19/2026]\nTheme Count    [${p.N}]\nPrimary Font   [IBM Plex Mono]\nBorder Radius  [0 px]</pre><pre class="bi-r">Item Specific Help\n\n&lt;Enter&gt; to select a\ntheme, &lt;F10&gt; to save\nand exit.</pre><p class="bi-keys">F1 Help &nbsp; ↑↓ Select Item &nbsp; ←→ Select Menu &nbsp; Enter Select &nbsp; F10 Save and Exit &nbsp; ESC Exit</p>`,
    },
    cyberdeck: {
      as: 'cybercore',
      show: () => `${rep(4, (k) => `<div class="cd-p card p${k}"><span class="label">${['PWR', 'RF', 'TTY0', 'I/O'][k]}</span>${k === 2 ? '<pre>&gt; mount /dev/sda1\n&gt; ok\n&gt; _</pre>' : k === 1 ? '<div class="cd-wave"></div>' : `<div class="cd-led">${rep(8, (j) => `<i class="${(j + k) % 3 ? 'on' : ''}"></i>`)}</div>`}</div>`)}<i class="cc-cross"></i>`,
    },

    /* ------------------------------------------------------------- games --- */
    eightbit: { as: 'pixel', copy: 'card px-dlg', extra: S.pixel.extra, show: S.pixel.show },
    sixteenbit: { as: 'pixel', copy: 'card px-dlg', extra: S.pixel.extra, show: (p) => `<i class="sx-sky"></i><i class="px-hill h2 sx-far"></i>` + S.pixel.show(p) },
    pixelui: {
      as: 'pixel', copy: 'card px-dlg', extra: S.pixel.extra,
      show: (p) => `<div class="px-hud"><span>♥ ♥ ♥ ♡</span><span>GOLD 0${p.n}0</span><span>LV ${Number(p.n)}</span></div><div class="pu-inv card"><span class="label">Inventory</span><div>${rep(12, (k) => `<i class="${['sw', 'po', 'ke', '', 'sh', '', 'po', '', '', 'ge', '', ''][k]}"></i>`)}</div></div><div class="pu-bar card"><span>HP</span><i><b></b></i><span>MP</span><i class="m"><b></b></i></div>`,
    },
    /* A cabinet, top to bottom: the lit marquee with a speaker grille either side, the bezel round the screen (the
       copy), then the control deck — high-score table, the coin door with two lit 25¢ slots and their reject buttons and
       a coin return, player-start buttons, the stick and four action buttons. */
    arcade: {
      show: (p) =>
        `<div class="ar-marq ar2-marq"><i class="ar2-grille"></i><span>THEMESHELF ARCADE</span><b>HI 0${p.n}8700</b><i class="ar2-grille"></i></div><i class="ar-frame"></i>` +
        `<table class="ar-t"><tr><td>1ST</td><td>NIC</td><td>98700</td></tr><tr><td>2ND</td><td>CLD</td><td>87000</td></tr><tr><td>3RD</td><td>AAA</td><td>38000</td></tr></table>` +
        `<div class="ar2-door"><p class="ar-coin">INSERT COIN</p><div class="ar2-slots">${rep(2, () => '<div class="ar2-slot"><b>25&cent;</b><i class="s"></i><i class="r"></i></div>')}</div><i class="ar2-return"></i></div>` +
        `<div class="ar-ctl ar2-ctl"><span class="ar2-start"><i>1P</i><i>2P</i></span><i class="stick"></i>${rep(4, (k) => `<i class="b b${k}"></i>`)}</div>`,
    },
    /* The DMG's controls, as they are on the unit: a one-piece cross with a dimple in the middle and a grip ridge on
       each arm, sunk in a dished circle; A and B as domed magenta buttons sharing one slanted groove, lettered
       underneath; SELECT and START as rubber pills in their own slanted slots; six speaker slots in the corner. */
    gameboy: {
      copy: 'gb-screen',
      show: () =>
        `<i class="gb-body"></i><span class="gb-brand">Nintendo-ish <b>THEME BOY</b></span>` +
        `<div class="gb-pad"><i class="v"></i><i class="h"></i><i class="c"></i></div>` +
        `<div class="gb-ab"><span><i></i><b>B</b></span><span><i></i><b>A</b></span></div>` +
        `<div class="gb-ss2"><span><i></i>SELECT</span><span><i></i>START</span></div>` +
        `<div class="gb-grille">${rep(6, () => '<i></i>')}</div>`,
    },

    /* ---------------------------------------------------------- hardware --- */
    cassette: {
      show: () => `<div class="cs-panel card"><div class="cs-tape"><i></i><i></i><span>SIDE A · 60 MIN</span></div><div class="cs-vu"><i></i></div><div class="cs-row">${rep(5, (k) => `<i class="sw ${k % 2 ? 'on' : ''}"></i>`)}</div><div class="cs-row">${rep(3, () => '<i class="kn"></i>')}<span class="cs-lamps">${rep(4, (k) => `<b class="${k < 2 ? 'on' : ''}"></b>`)}</span></div></div>`,
    },
    spaceage: { show: () => `<i class="sa orbit a"></i><i class="sa orbit b"></i><i class="sa planet"></i><div class="sa-pod"><i></i></div><i class="sa port a"></i><i class="sa port b"></i><i class="sa port c"></i><i class="sa lamp"></i>` },
    retrofuture: { show: () => `<i class="rf planet"></i><i class="rf ring"></i><div class="rf-rocket"><i></i></div><div class="rf-city">${rep(5, (k) => `<i class="d${k}"></i>`)}</div><i class="rf star a"></i><i class="rf star b"></i><i class="rf car"></i>` },
    /* An engineering drawing, because that is what the style is made of: a launch vehicle in side elevation as line
       art (SVG, so it stays crisp), numbered leaders, a dimension string, a title block — on a drawing sheet, with the
       hazard band down its edge, the mission patch over one corner and a telemetry card over the other. */
    nasapunk: {
      show: (p) =>
        `<div class="np2-sheet"><i class="np2-haz"></i>` +
        `<svg class="np2-dwg" viewBox="0 0 300 430" aria-hidden="true"><g fill="none" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round">` +
        `<path d="M120 6V34M114 12h12M116 22h8"/><path d="M108 58 120 34 132 58Z" fill="#fff"/><rect x="108" y="58" width="24" height="26" fill="#fff"/><path d="M108 84h24l10 22H98Z" fill="#fff"/>` +
        `<rect x="98" y="106" width="44" height="58" fill="#fff"/><path d="M98 164h44l12 22H86Z" fill="#fff"/><rect x="86" y="186" width="68" height="92" fill="#fff"/><rect x="86" y="278" width="68" height="104" fill="#fff"/>` +
        `<path d="M86 330 62 398 86 384ZM154 330 178 398 154 384Z" fill="#fff"/><path d="M92 382h14l4 20H88ZM113 382h14l4 20h-22ZM134 382h14l4 20h-22Z" fill="#fff"/></g>` +
        `<g fill="currentColor"><rect x="86" y="206" width="68" height="9" class="np2-red"/><rect x="86" y="278" width="17" height="30"/><rect x="120" y="278" width="17" height="30"/><rect x="103" y="308" width="17" height="30"/><rect x="137" y="308" width="17" height="30"/><rect x="98" y="120" width="44" height="5" class="np2-red"/></g>` +
        `<path d="M120 0V424" stroke="currentColor" stroke-width=".7" stroke-dasharray="14 4 2 4" opacity=".55"/>` +
        `<g stroke="currentColor" stroke-width=".9" fill="none"><path d="M214 34V402M208 34h12M208 402h12"/></g><text x="226" y="222" class="np2-dim" transform="rotate(90 226 222)" text-anchor="middle">110.6 m</text>` +
        `${[['FAIRING', 70], ['STAGE III', 136], ['STAGE II', 236], ['STAGE I', 336]].map(([t, y], k) => `<path d="M${k ? 154 - (k === 1 ? 12 : 0) : 132} ${y}H186" stroke="currentColor" stroke-width=".9"/><circle cx="192" cy="${y}" r="7" class="np2-dot"/><text x="192" y="${y + 3}" class="np2-n" text-anchor="middle">${k + 1}</text><text x="12" y="${y + 3}" class="np2-lab">${t}</text>`).join('')}</svg>` +
        `<p class="np2-title"><span>DWG</span><b>TS-${p.n}</b><span>SCALE</span><b>1:96</b></p></div>` +
        `<div class="np2-patch"><b class="disp">TS-${p.n}</b><span>THEMESHELF &middot; MISSION</span></div>` +
        `<dl class="np2-tlm card"><dt>T-MINUS</dt><dd>00:38:00</dd><dt>ALT</dt><dd>000.0 km</dd><dt>VEL</dt><dd>0000 m/s</dd><dt>FUEL</dt><dd><i style="--v:92%"></i></dd><dt>LOX</dt><dd><i style="--v:78%"></i></dd></dl>`,
    },
    solarpunk: { show: () => `<i class="sl sun"></i><div class="sl-dome"><div class="bo-pic" data-hero-art></div></div><div class="sl-panels">${rep(6, () => '<i></i>')}</div><i class="sl leaf a"></i><i class="sl leaf b"></i><i class="sl leaf c"></i><i class="sl turb"></i>` },
    biopunk: { show: () => `<div class="bp-dish a"><i></i><i></i><i></i></div><div class="bp-dish b"><i></i><i></i></div><i class="bp-cell a"></i><i class="bp-cell b"></i><div class="bp-dna">${rep(9, (k) => `<i style="--k:${k}"></i>`)}</div><div class="bp-read card"><span class="label">Culture 38</span><b class="stat disp">98.6%</b><span>viability</span></div>` },
    aero: {
      show: (p) => `<i class="ae-hill"></i><i class="ae-flare"></i>${rep(6, (k) => `<i class="ae-bub b${k}"></i>`)}<div class="ae-win card"><div class="ae-bar"><span>${p.label}</span><b></b><b></b><b class="x"></b></div><div class="card__body"><span class="label">Now playing</span><b>${p.tagline}</b><div class="progress"><i style="width:62%"></i></div><span class="btn btn--primary btn--sm">Play ${ico('play', 12)}</span></div></div>`,
    },

    /* -------------------------------------------------------------- 2025 --- */
    /* Apple's Liquid Glass, as its WWDC25 key art shows it: a pale ruled backdrop and one piece of clear glass made of
       two shapes that have run together. The glass has no tint and almost no blur; everything it does, it does to the
       grid behind it. So the scene is one SVG that draws the backdrop twice — once for the page, once more inside the
       blob's outline — and refracts the second copy: the blob's own alpha is blurred into a height field, its slope
       becomes a displacement map (x in red, y in green), and the grid is pulled inward wherever the glass curves, i.e.
       only near the rim. It is an ordinary `filter`, not a backdrop-filter, so every engine draws it. The inner copy is
       counter-transformed by the blob's own translate/scale, which is what keeps its grid registered with the page's. */
    liquidglass: {
      show: (p) =>
        `<svg class="lq-stage${p.t.image ? ' lq-stage--img' : ''}" width="100%" height="100%" aria-hidden="true"><defs>` +
        `<linearGradient id="lqSky" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#f1f2f5"/><stop offset=".5" stop-color="#d9dbe0"/><stop offset="1" stop-color="#b3b7c0"/></linearGradient>` +
        `<pattern id="lqGrid" width="176" height="176" patternUnits="userSpaceOnUse"><path d="M176 .5H.5V176" fill="none" stroke="#1d1d1f" stroke-opacity=".42" stroke-width="1.1"/></pattern><pattern id="lqGridIn" width="176" height="176" patternUnits="userSpaceOnUse"><path d="M176 .5H.5V176" fill="none" stroke="#1d1d1f" stroke-opacity=".55" stroke-width="2.1"/></pattern>` +
        `<linearGradient id="lqRim" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#fff" stop-opacity=".95"/><stop offset=".45" stop-color="#fff" stop-opacity=".25"/><stop offset=".7" stop-color="#fff" stop-opacity=".12"/><stop offset="1" stop-color="#fff" stop-opacity=".8"/></linearGradient>` +
        `<linearGradient id="lqHue" x1="0" x2="1"><stop offset="0" stop-color="#ff5b8a" stop-opacity="0"/><stop offset=".2" stop-color="#ff9f43"/><stop offset=".45" stop-color="#ffe66d"/><stop offset=".65" stop-color="#5ce1a5"/><stop offset=".85" stop-color="#5aa9ff"/><stop offset="1" stop-color="#a97bff" stop-opacity="0"/></linearGradient>` +
        `<path id="lqBlob" pathLength="100" d="M120 0C186 0 215 52 255 52C295 52 324 0 390 0L540 0C606 0 660 54 660 120C660 186 606 240 540 240L390 240C324 240 295 188 255 188C215 188 186 240 120 240C54 240 0 186 0 120C0 54 54 0 120 0Z"><animate attributeName="d" dur="14s" repeatCount="indefinite" calcMode="spline" keyTimes="0;0.22;0.5;0.72;1" keySplines=".45 0 .25 1;.45 0 .25 1;.45 0 .25 1;.45 0 .25 1" values="M120 0C186 0 215 52 255 52C295 52 324 0 390 0L540 0C606 0 660 54 660 120C660 186 606 240 540 240L390 240C324 240 295 188 255 188C215 188 186 240 120 240C54 240 0 186 0 120C0 54 54 0 120 0Z;M120 0C186 0 198 16 238 16C278 16 290 0 356 0L506 0C572 0 626 54 626 120C626 186 572 240 506 240L356 240C290 240 278 224 238 224C198 224 186 240 120 240C54 240 0 186 0 120C0 54 54 0 120 0Z;M120 0C186 0 215 52 255 52C295 52 324 0 390 0L540 0C606 0 660 54 660 120C660 186 606 240 540 240L390 240C324 240 295 188 255 188C215 188 186 240 120 240C54 240 0 186 0 120C0 54 54 0 120 0Z;M120 0C186 0 237 92 277 92C317 92 368 0 434 0L584 0C650 0 704 54 704 120C704 186 650 240 584 240L434 240C368 240 317 148 277 148C237 148 186 240 120 240C54 240 0 186 0 120C0 54 54 0 120 0Z;M120 0C186 0 215 52 255 52C295 52 324 0 390 0L540 0C606 0 660 54 660 120C660 186 606 240 540 240L390 240C324 240 295 188 255 188C215 188 186 240 120 240C54 240 0 186 0 120C0 54 54 0 120 0Z"/></path>` +
        `<clipPath id="lqClip"><use href="#lqBlob"/></clipPath>` +
        `<filter id="lqRefract" filterUnits="userSpaceOnUse" x="-80" y="-80" width="920" height="400" color-interpolation-filters="sRGB">` +
        `<feGaussianBlur in="SourceAlpha" stdDeviation="14"/><feColorMatrix values="0 0 0 1 0  0 0 0 1 0  0 0 0 1 0  0 0 0 0 1" result="h"/>` +
        `<feOffset in="h" dx="9"/><feColorMatrix values="1 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 0 1" result="xp"/><feOffset in="h" dx="-9"/><feColorMatrix values="0 0 0 0 0  1 0 0 0 0  0 0 0 0 0  0 0 0 0 1" result="xm"/>` +
        `<feComposite in="xp" in2="xm" operator="arithmetic" k2="1" k3="1"/><feColorMatrix values="-1 1 0 0 .5  0 0 0 0 0  0 0 0 0 0  0 0 0 0 1" result="gx"/>` +
        `<feOffset in="h" dy="9"/><feColorMatrix values="1 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 0 1" result="yp"/><feOffset in="h" dy="-9"/><feColorMatrix values="0 0 0 0 0  1 0 0 0 0  0 0 0 0 0  0 0 0 0 1" result="ym"/>` +
        `<feComposite in="yp" in2="ym" operator="arithmetic" k2="1" k3="1"/><feColorMatrix values="0 0 0 0 0  -1 1 0 0 .5  0 0 0 0 0  0 0 0 0 1" result="gy"/>` +
        `<feComposite in="gx" in2="gy" operator="arithmetic" k2="1" k3="1" result="map"/><feDisplacementMap in="SourceGraphic" in2="map" scale="88" xChannelSelector="R" yChannelSelector="G"/><feGaussianBlur stdDeviation=".35"/></filter>` +
        `<filter id="lqSoft" x="-30%" y="-60%" width="160%" height="240%"><feGaussianBlur stdDeviation="20"/></filter><filter id="lqBloom" x="-10%" y="-20%" width="120%" height="140%"><feGaussianBlur stdDeviation="7"/></filter></defs>` +
        `${p.t.image ? `<image class="lq-bg lq-r" href="${p.t.image}" width="100%" height="100%" preserveAspectRatio="xMaxYMid slice"/><image class="lq-bg lq-c" href="${p.t.image}" width="100%" height="100%" preserveAspectRatio="xMidYMid slice"/>` : `<rect class="lq-bg" width="100%" height="100%" fill="url(#lqSky)"/><rect class="lq-bg" width="100%" height="100%" fill="url(#lqGrid)"/>`}` +
        `<g class="lq-blob"><use href="#lqBlob" class="lq-shadow" filter="url(#lqSoft)"/>` +
        `<g clip-path="url(#lqClip)"><g filter="url(#lqRefract)"><g clip-path="url(#lqClip)"><g class="lq-in">${p.t.image ? `<image class="lq-r" href="${p.t.image}" width="100%" height="100%" preserveAspectRatio="xMaxYMid slice"/><image class="lq-c" href="${p.t.image}" width="100%" height="100%" preserveAspectRatio="xMidYMid slice"/>` : `<rect width="100%" height="100%" fill="url(#lqSky)"/><rect width="100%" height="100%" fill="url(#lqGridIn)"/>`}</g><use href="#lqBlob" fill="#fff" fill-opacity=".05"/></g></g></g>` +
        `<g clip-path="url(#lqClip)"><use href="#lqBlob" class="lq-bloom" filter="url(#lqBloom)"/><use href="#lqBlob" class="lq-shade" filter="url(#lqBloom)"/></g>` +
        `<use href="#lqBlob" class="lq-rim"/><use href="#lqBlob" class="lq-hue"/></g></svg>`,
    },

    /* ------------------------------------------------------------- paper --- */
    /* A front page: nameplate and dateline, then a lead story built the way a desk builds one — headline, byline, a
       halftone staff photograph of the shelf itself (book spines, screened in dots), a cutline, two columns of copy. */
    newspaper: {
      as: 'editorial',
      show: (p) =>
        `<p class="ed-mast"><b class="disp">The Daily Shelf</b><span>Late Edition &middot; No. ${p.n} &middot; Saturday, September 19, 2026 &middot; 50&cent;</span></p>` +
        `<div class="nw-page"><h3 class="nw-head disp">EXTRA! ${p.tagline}</h3><p class="nw-by">By Our Design Correspondent</p>` +
        `<figure class="nw-fig"><div class="nw-photo">${[0, 1].map((r) => `<div class="nw-row">${rep(17, (k) => `<i style="--h:${58 + ((k * 37 + r * 53) % 40)};--w:${10 + ((k * 13 + r * 7) % 9)};--g:${28 + ((k * 29 + r * 17) % 52)}"></i>`)}</div>`).join('')}</div><figcaption>The shelf as it appeared yesterday, all ${p.N} themes in place. (Staff photo)</figcaption></figure>` +
        `<p class="nw-cols">THEMESHELF &mdash; Readers woke today to ${words(p.N)} themes on a single shelf. Officials confirmed the columns were dense, the stock off-white and the ink black. No injuries were reported among the default styles. Continued on page ${p.n}.</p></div>`,
    },
    journal: {
      as: 'academic', copy: 'ac-page',
      extra: () => `<p class="ac-auth">N. Cabel<sup>1</sup>, C. Fable<sup>2</sup> · <i>J. Interface Stud.</i> <b>38</b>, 87–126 (2026) · doi:10.0000/shelf.87</p>`,
      show: (p) => `<figure class="ac-fig card"><div class="jr-chart"><i style="--v:22"></i><i style="--v:34"></i><i style="--v:31"></i><i style="--v:52"></i><i style="--v:70"></i><i style="--v:88"></i></div><figcaption><b>Fig. 2.</b> Legibility against contrast ratio (n = ${p.N}). Error bars show ±1 s.d.</figcaption></figure><p class="ac-foot"><sup>1</sup> ThemeShelf Institute. <sup>2</sup> Corresponding author. Received 19 Sept 2026; accepted without revision.</p>`,
    },
    /* The machine itself: a carriage with the page coming up out of it, the typebar basket, two ribbon spools and
       three rows of glass-top keys. The copy is still the typed sheet on the left; this is what typed it. */
    typewriter: {
      copy: 'tw-sheet',
      show: (p) =>
        `<div class="tw2"><div class="tw2-paper"><p>Now is the time for all good themes to come to the aid of the shelf. The quick brown fox jumps over the lazy default<i class="tw2-cur"></i></p></div>` +
        `<div class="tw2-carriage"><i class="tw2-knob l"></i><i class="tw2-knob r"></i><i class="tw2-platen"></i><i class="tw2-bail"></i><i class="tw2-lever"></i></div>` +
        `<div class="tw2-body"><i class="tw2-basket"></i><i class="tw2-spool l"></i><i class="tw2-spool r"></i><i class="tw2-ribbon"></i><b class="tw2-brand">ThemeShelf &nbsp;No. ${p.n}</b>` +
        `<div class="tw2-keys">${['QWERTYUIOP', 'ASDFGHJKL', 'ZXCVBNM,.'].map((row, r) => `<div class="r${r}">${row.split('').map((k) => `<i>${k}</i>`).join('')}</div>`).join('')}</div><i class="tw2-space"></i></div></div>`,
    },
    /* The card where it lives: in its pocket, pulled up far enough to read, with the date-due slip pasted beside it.
       Names are handwritten, dates are rubber-stamped — each at its own small angle, in whichever ink pad was open. */
    librarycard: {
      show: (p) =>
        `<div class="lc2-pocket"><div class="lc2-card"><p class="lc2-call">745.4 &middot; THM &middot; ${p.n}</p><p class="lc2-author">ThemeShelf, The.</p><p class="lc2-title">${p.label} : a theme in cream, red and ink.</p>` +
        `<table><tr><th>Date due</th><th>Borrower&rsquo;s name</th></tr>${[['SEP 19 1986', 'M. Reyes', ''], ['OCT 03 1991', 'J. Kowalski', 'b'], ['MAR 27 2004', 'A. Lindqvist', 'k'], ['JUN 09 2025', 'N. Cabel', '']].map(([d, n, c], k) => `<tr><td><span class="st ${c}" style="--r:${[-3, 2, -1.5, 3][k]}deg">${d}</span></td><td class="hw">${n}</td></tr>`).join('')}<tr><td></td><td></td></tr></table></div>` +
        `<div class="lc2-front"><b>ThemeShelf Public Library</b><span>Please do not remove<br>cards from this pocket</span><small>A fine of five cents a day is charged for overdue themes.</small></div></div>` +
        `<div class="lc2-slip"><b>Date due</b><div>${['SEP 19 86', 'OCT 03 91', 'FEB 11 93', 'MAR 27 04', 'AUG 30 11', 'JUN 09 25'].map((d, k) => `<span class="st ${['', 'b', 'k', '', 'b', ''][k]}" style="--r:${[-4, 3, -2, 5, -3, 2][k]}deg;--o:${[0.55, 0.7, 0.6, 0.8, 0.85, 1][k]}">${d}</span>`).join('')}</div></div><span class="lc-stamp">DISCARD</span>`,
    },
    archive: {
      show: (p) => `<figure class="ar-obj card"><div class="ed-pic" data-hero-art></div></figure><div class="ar-label card"><b>${p.label}</b><span>Interface, mixed media, 2026</span><span>Gift of the ThemeShelf Collection</span><em>Acc. No. 1986.${p.n}</em></div><span class="ar-tag">№ ${p.n}</span>`,
    },
    postal: {
      show: (p) => `<div class="po-env card"><div class="po-addr"><b>To the Reader</b><span>${p.n} Shelf Street</span><span>Themeville, TS 00087</span></div><div class="po-stamps"><i class="a"></i><i class="b"></i></div><i class="po-cancel"></i><span class="po-air">PAR AVION · BY AIR MAIL</span></div><span class="po-mark">SEP 19<br>2026</span>`,
    },
    /* A manila file folder, built the way one is: a back leaf that carries the tab, the papers, then a front leaf
       cut a little shorter so the tab and the top of the papers show above it. The memo has been pulled half out,
       which is what makes its redactions readable; the typed sheet on the left (the copy) is the page that came
       out of it. */
    classified: {
      copy: 'cl-doc',
      show: (p) =>
        `<div class="cf-folder"><div class="cf-back"><i class="cf-tab"><b>CASE FILE ${p.n}-TS</b></i></div>` +
        `<div class="cf-sheet s3"></div><div class="cf-sheet s2"><p>APPENDIX C &mdash; FIELD PHOTOGRAPHS (${p.N})</p></div>` +
        `<div class="cf-sheet s1"><i class="cf-clip"></i><p class="cf-head"><b>MEMORANDUM</b><span>${p.n}-TS / 1 of 3</span></p>` +
        `<p class="cf-red">Subject was last seen near <i>the shelf</i>. Agents report <i>${words(p.N)}</i> themes and <i>no survivors</i> among the default styles.</p></div>` +
        `<div class="cf-front"><span class="cf-stamp a">TOP SECRET</span><dl class="cf-form"><dt>Subject</dt><dd>THEMESHELF</dd><dt>File no.</dt><dd>${p.n}-TS</dd><dt>Clearance</dt><dd>LEVEL 5</dd><dt>Custodian</dt><dd><i>redacted</i></dd></dl>` +
        `<span class="cf-stamp b">EYES ONLY</span><small class="cf-warn">DO NOT REMOVE FROM FACILITY &middot; RETURN TO REGISTRY</small></div></div>`,
    },
    techmanual: {
      show: () => `<div class="tm2-dia"><i class="p1"></i><i class="p2"></i><i class="p3"></i><i class="ax"></i>${rep(3, (k) => `<b class="c${k}">${k + 1}</b>`)}</div><table class="tm2-t"><tr><th>Item</th><th>Part</th><th>Qty</th></tr><tr><td>1</td><td>Cover plate</td><td>1</td></tr><tr><td>2</td><td>Spacer ring</td><td>2</td></tr><tr><td>3</td><td>Base housing</td><td>1</td></tr></table><p class="tm2-cap">Fig. 3 — Exploded view. Torque to 3.8 N·m.</p>`,
    },
    blueprint: {
      show: (p) => `<div class="bl-plan"><i class="w a"></i><i class="w b"></i><i class="arc"></i><i class="dim h"></i><i class="dim v"></i><span class="dh">12 400</span><span class="dv">8 700</span></div><div class="bl-block"><span>PROJECT</span><b>${p.label}</b><span>SHEET</span><b>A-${p.n}</b><span>SCALE</span><b>1 : 50</b></div>`,
    },
    graphpaper: {
      as: 'sketch',
      show: (p) => `<svg class="gp-plot" viewBox="0 0 300 220" aria-hidden="true"><path class="ax" d="M30 10 V190 H290"/><path class="cv" d="M30 180 C90 176 120 150 150 110 S220 30 285 22"/><path class="cv b" d="M30 150 C100 140 160 170 285 120"/><circle cx="150" cy="110" r="5"/></svg><span class="sk-note n1">inflection<br>here!</span><span class="sk-note n2">y = themes(x)</span><span class="sk-note n3">n = ${p.N} ✓</span><i class="gp-ruler"></i>`,
    },
    /* Three instant photographs. Each "photo" is painted in CSS (.ph--sea, --peak, --dusk) — a beach at sunset, a lake
       under a mountain, a skyline at dusk — then faded the way the film fades: low contrast, a warm cast, a light leak. */
    polaroid: { as: 'scrapbook', show: (p) => `<div class="sb-pol card a"><div class="sb-pic ph ph--sea"><i></i></div><p class="disp">june, maybe?</p></div><div class="sb-pol card b"><div class="sb-pic ph ph--peak"><i></i><i></i></div><p class="disp">the lake, day 2</p></div><div class="sb-pol card c"><div class="sb-pic ph ph--dusk"><i></i></div><p class="disp">keep this one</p></div><i class="sb-washi w1"></i><span class="sb-tick">10 exposures · colour</span>` },
    /* An actual zine: a folded, stapled cover off a photocopier — ransom-note title, a screened sun, cut strips, a price
       sticker, a second copy under it. */
    zine: { as: 'scrapbook', show: (p) => `<div class="zn-copy"></div><div class="zn-cover"><i class="zn-stp a"></i><i class="zn-stp b"></i><div class="zn-sun"></div><i class="zn-bolt"></i><p class="zn-title">${'ZINE'.split('').map((c, k) => `<b class="l${k}">${c}</b>`).join('')}</p><span class="zn-strip a">${p.tagline}</span><span class="zn-strip b">ISSUE #${p.n}</span><span class="zn-price">FREE<small>or trade</small></span><p class="zn-foot">cut &middot; paste &middot; copy &middot; staple &middot; repeat</p></div><i class="sb-washi w1"></i>` },
    punk: {
      as: 'scrapbook',
      show: (p) => pols(p, 'LIVE!', 'ALL AGES') + `<p class="pk-ransom">${'NO FUTURE'.split('').map((c, k) => (c === ' ' ? '<br>' : `<i class="r${k % 5}">${c}</i>`)).join('')}</p><div class="zn-strip a">SAT ${p.n} SEPT · DOORS 8PM · £3</div><i class="pk-pin"></i><i class="zn-half"></i>`,
    },
  });
})();
