# ThemeShelf

A slideshow of UI themes. The hero is the selector — a DJ-style panel, an infinite strip of
themes and a PowerPoint-style reflection under the picture — and below it every theme shows
the *same* buttons, slides, cards, type, controls, palette and tokens, so the only thing that
changes as you slide through is the theme.

88 themes. Static site, no build step, no dependencies. Open `index.html` through any web server:

A visit to the bare URL opens on a theme drawn at random (never the same one twice running); a URL that names one —
`#terminal`, `#win95` — opens on that. The draw happens in the inline boot script, before first paint, so nothing flashes.

```bash
python -m http.server 4517 --bind 127.0.0.1
```

## Where the themes come from

`Dev Tools/hud-kit/themes.js` is the one theme list, and this site does not copy it by hand.
`tools/sync-themes.mjs` reads it (plus the Paper base tokens out of `hud.css`'s `:root`) and
writes `js/themes.generated.js`. Everything a showcase needs that is *not* a token — image
prompt, font names, display-face scale, flourish — lives in `tools/theme-meta.mjs`.

```bash
node tools/sync-themes.mjs          # regenerate js/themes.generated.js + IMAGE-PROMPTS.md
node tools/sync-themes.mjs --check  # exit 1 if either is stale
```

Adding a theme to hud-kit and re-running fails loudly until `theme-meta.mjs` has an entry for
it. `custom` is skipped on purpose: it is a colour picker, and on a shelf it is Paper.

### Themes that are only on the shelf

`tools/extra-themes.mjs` holds themes that are **not** in hud-kit, in the same shape, and the
sync script appends them after the kit's. They stay out of the kit on purpose: its list is the
cycle order of the theme picker in Command Center and every tool, so a theme added there moves
somebody's next click in six apps. The twenty-two there now are the visual styles from the
talhaxcodes reel (Claymorphism … Wabi-Sabi), in the order its pinned comment lists them.

Each entry carries its own `meta` (fonts, scale, flourish, image prompt) and a `webfont` list;
the generated file turns those into one extra Google Fonts stylesheet that the page injects,
so `index.html` never needs editing for a new face. A slug that collides with a kit theme
fails the sync.

Two themes differ from the kit here, deliberately: **Glassmorphia** and **Discord** are
labelled "System sans" in the registry but never set `--font-display`, so in the tools they
inherit Paper's pixel face. The shelf applies the face the registry names (see `tokens:` in
`theme-meta.mjs`). Delete those two overrides to show them exactly as the tools render them.

## The hero is a landing page

Every theme's hero is a landing page designed *in* the style, not a caption over a picture: a
nav (brand, section links, *All themes*), the style's name as the headline, a tagline in the
style's own voice, two real calls to action (*Explore components* scrolls to the kit, *Save
theme* is the heart), and a showcase. `tools/hero-copy.mjs` gives each theme a `tagline` and one
of four compositions:

| layout | composition | for |
|---|---|---|
| `split` | copy left; a browser-framed UI mock with two floating cards right | the interface styles — Glassmorphia, Claymorphism, Neumorphism, Bento… |
| `center` | one huge centred title over the full-bleed scene, a halo behind it, a card either side | the atmospheric styles — Synthwave (the halo becomes the striped sun over a perspective grid), Cyberpunk, Luxury… |
| `poster` | print: rules above and below, a wide title, a portrait plate with a figure caption | the typographic and craft styles — Editorial, Swiss, Minimalism, Wabi-Sabi… |
| `collage` | a rotated polaroid, a note card, a sticker | the cut-and-paste styles — Scrapbook, Neo-Brutalism, Maximalism, Pixel Art… |

The showcase is built from the real component classes (`.card`, `.btn`, `.badge`, `.stat`), so
whatever a theme does to a card — frosts it, bevels it, tapes it down, clips its corners — it
does to the hero as well, and the two cannot drift apart. It is decoration: `aria-hidden`, with
nothing focusable in it. Under 1000px wide the landing is copy only and the picture takes the
lower half.

The hero is one screen tall minus 84px, so the top of the reflection is always in view. The
image prompt's last sentence depends on the layout, because where the type sits decides where
the picture has to be quiet.

### Every style has its own scene

The four layouts above are only the fallback. A style is shown by what its hero is BUILT from,
not by its colours: Bento Grid's hero is a box of eight tiles, Windows 95's is a desktop with a
dialog and a taskbar, Poker's is a table with a royal flush dealt, Terminal's is a shell session,
Newspaper's is a front page with a masthead. `js/scenes.js` (kit themes + the reel's styles) and
`js/scenes-2.js` (the later forty-eight) say what each scene is made of; `css/heroes.css` and
`css/heroes-2.css` place it. The words never change — name, tagline, blurb, two buttons — only
what they are set into.

A scene may declare `as: '<base>'` to inherit another scene's placement: DOS, CRT Terminal and
Hacker Console are terminal sessions; Newspaper is an editorial spread; Zine, Punk Flyer and
Polaroid are scrapbooks; Outrun and Vaporwave stand on Synthwave's sun and grid. `copy: 'card …'`
turns the copy block into a panel, so whatever a theme does to a card it does to its own
headline. Scenery is desktop-only (>= 1000px); the copy treatment applies everywhere, which is
how a phone still sees the style.

The second forty-eight themes (`tools/extra-themes-2.mjs`) are written through a factory that
derives dim ink, lines and legible accents and enforces the contrast floors at build time, so a
new one is eight colours, corners, a shadow style and two faces.

### The background moves

Every slide has a `.bgfx` layer between the picture and the scrim (`css/bgfx.css`): sixteen
elements with seeded positions, turned into one of eleven kinds by the style — equaliser bars,
orbs, bubbles, steam, a perspective grid running at you, rain, a CRT sweep, stars, floating
shapes, clouds, or dust in a shaft of light. `BG` in `js/app.js` maps slugs to kinds; anything
unlisted falls back by brightness. It sits under the scrim, so the copy's contrast is unchanged;
it animates only `transform` and `opacity`; it pauses when the hero is scrolled away; and under
`prefers-reduced-motion` nothing moves. With a real hero image the same layer plays over it and
the image pushes in slowly. The logo is animated the same way: three bars as an equaliser, each
at its own tempo, with a hop on every theme change.

### The strip of themes can be pulled

The strip under the panel scrolls by itself and pauses under the pointer. It can also be grabbed:
click (or touch) and drag to pull it either way, flick to throw it, and a trackpad's sideways swipe
does the same. It is still one CSS animation over two identical halves — dragging scrubs that
animation's `currentTime` (pixels → milliseconds, wrapped at the duration), so the loop stays
seamless in both directions and nothing fights the autoplay. A press that moves under 5px is still
a click on the chip; past that the click is swallowed. With reduced motion the strip is a plain
scroller and the same drag moves `scrollLeft`. (`dragMarquee()` in `js/app.js`.)

### Looking at the heroes

A bounding-box check clears a layout and says nothing about whether it looks right — a skyline
collapsed into a 100px sliver, mountains drawn in front of the animated floor and a typewriter
face turning the control panel's labels into noise all measured as "fine". So the heroes are
reviewed by eye, from contact sheets:

```bash
node tools/shoot-heroes.mjs                # every theme at 1280x800, six to a sheet, into .shots/
node tools/shoot-heroes.mjs bento swiss    # just those
SHOT_W=390 SHOT_H=844 SHOT_SCALE=0.6 SHOT_COLS=5 SHOT_PER=10 node tools/shoot-heroes.mjs   # phones
```

Headless Chrome over the DevTools Protocol with Node's own `fetch` and `WebSocket` — nothing to
install. Serve the site first.

## Favicon

`favicon.svg` is the ThemeShelf mark — square, rounded, round: the three button shapes — standing
on a shelf, in Google's four brand colours. It is the source; `node tools/make-favicon.mjs`
rasterises it to `favicon-32.png`, `apple-touch-icon.png` (180px, square white ground) and
`favicon.ico` (16/32/48), and prints the colour it found at the centre of each bar at every size.

## Open source

The repository address is one `<meta name="themeshelf:repo">` in `index.html`. The GitHub
button in the hero and the link in the footer both read it; empty it and both disappear. The
licence is MIT (`LICENSE`).

The site itself needs nothing but a web server: `js/themes.generated.js` is committed. Only *regenerating* it
(`node tools/sync-themes.mjs`) needs the seventeen base themes from MakeAndUpdate's `hud-kit`, which lives outside this
repository — point the tool at a copy with `HUD_KIT=/path/to/hud-kit`. The screenshot and favicon tools expect Chrome
at its default Windows path; set `CHROME=/path/to/chrome` elsewhere.

## Hero images

The prompts are in `IMAGE-PROMPTS.md` (and on the page: **Copy image prompt**, top right of
any hero that has no image yet). Generate each at 16:9, save as `img/heroes/<slug>.jpg`
(`.webp` / `.png` work too), then run `node tools/sync-themes.mjs` — the manifest is how the
page knows a file exists, so there are no 404s for the ones that do not. Until then the hero
is drawn from the theme's palette, equaliser bars and all, so nothing looks unfinished.

**With a picture, the picture is the illustration.** Every scene's drawn pieces are keyed to `.has-img`
in `css/bgfx.css`. Scenery the picture already contains goes (a second sun, a second skyline), and so do
props, mascots and generic cards that would sit on top of a finished composition — Corporate Memphis's figure,
Mid-Century's sideboard, the chart in Art Nouveau's arch, Synthwave's stat cards. What stays is interface that
*is* the theme: OS windows, terminals, consoles and devices, documents (deed, library card, envelope, case file,
prints, plans, diagrams), Discord, the boarding pass, Bento's tiles, Clay's phone, Neon's signs, Steampunk's
gauges, Poker's hand and chips. Delete the image and the full drawn scene comes back.

## How it works

A theme is a bag of CSS custom properties. Written onto `<html>` it themes the page; written
onto one element (`.t-scope`) it themes just that — which is how a hero slide keeps its own
look while sliding out, and how every chip and every deck thumbnail wears its own theme at
once. `css/site.css` has no theme names in it except the `data-fx` flourishes
that a token cannot express. A theme opts into them by name from its meta, never by slug.

### A theme is its effects, not its palette

Colours alone do not make a style: Glassmorphia with the right blues and opaque white cards is
just a pale theme. Each style's signature lives in a `data-fx` flourish:

| fx | what it does | used by |
|---|---|---|
| `glass` (+`frost` dark, `soft` blurred) | fixed drifting orbs behind the page; every surface *and* every button, input and badge is a white gradient with `backdrop-filter` blur and a lit top-left rim | Glassmorphia, Glassmorphism, Ethereal |
| `liquid` | Apple's Liquid Glass: a clear, thick pane — ~16% white and 3px of blur against glassmorphism's 40–68% and 22px — where everything that says "glass" is at the rim (a hairline of light, a bloom under the upper lip, shade inside the lower one, a soft contact shadow). The page becomes a pale grey gradient under a 176px grid, because clear glass needs something ruled behind it. In Chromium the backdrop also bends at the rim of bars, pills and beads: three SVG displacement filters (`#lq-lens-bar`, `-pill`, `-bead`, from `node tools/make-lens.cjs`) inside `backdrop-filter`, switched on by `html.can-lens`; other engines keep the plain pane. The hero's blob does not depend on that: it is one SVG that refracts its own copy of the grid with an ordinary `filter`, and morphs with SMIL. |
| `clay` | raised things puffy (shadow tokens), inputs pressed in, bouncy press | Claymorphism |
| `neu` | no outlines; inset fields and pressed states | Neumorphism |
| `thick` / `pixelbox` | 3px ink borders / the four-shadow pixel outline with missing corners | Neo-Brutalism, Maximalism, Pixel Art |
| `bento` | the card grid becomes one big, one tall and two small tiles | Bento Grid |
| `rule` `heavy` `tight` `dropcap` | boxes become columns under a top rule; tight tracking; drop caps | Editorial, Swiss |
| `hud` `gloss` `glow` | corner brackets, metal banding, light bleed | Cybercore, Heavy Neon, Y2K |
| `chrometext` / `sunset` | gradient-filled display type and buttons | Y2K Aesthetic, Synthwave |
| `cut` `glitch` `notch` | clipped panel corners, misregistered type, notched buttons | Cyberpunk |
| `tilt` `tape` / `sketch` `hatch` | crooked taped cards / wobbly hand-drawn boxes with hatched fills | Scrapbook, Conceptual Sketch |
| `melt` / `organic` `grain` / `arch` | uneven corners, SVG-noise grit, doorway-shaped pictures | Surrealism, Wabi-Sabi, Bohemian |
| `clash` `dots` / `caps` `frame` / `double` `ornament` | a different colour per tile on a dotted wall / tracked capitals in a gold hairline / gilt double frame and fleurons | Maximalism, Luxury, Victorian |
| `bevel` `win` / `scan` | four-colour bevels / scanlines | 90's, Windows 95, Terminal, Cyberpunk |

The three fixed button-shape rows (square, rounded, round) are never reshaped by a flourish —
that comparison is the point of them. The *Theme default* row is.

Glass contrast is computed, not eyeballed: dim ink on the thinnest corner of a pane directly
over the strongest orb is 4.61:1 (Glassmorphia), 5.36 (Ethereal), 4.99 (Glassmorphism). Text
that sits straight on the page, with no pane under it, is full ink in a glass theme because
dim ink measured 3.31:1 there.

| | |
|---|---|
| Browse | `←` `→`, swipe the hero, the crossfader, any chip in the strip, `#slug` in the URL |
| Slideshow | `Space` or ▶. Tempo 3–12s. Only advances while the hero is on screen, the tab is visible and the deck is closed |
| Heart | `H` or ♥. Stored in the `ts_hearts` cookie (1 year, `SameSite=Lax`); falls back to localStorage only on `file://`, where browsers silently drop cookies |
| Deck | `D`, **All themes**, or the corner button (≥900px wide). Filter to hearted |
