/* ThemeShelf — everything about a theme that is NOT a token.
 *
 * The tokens come from hud-kit/themes.js, which stays the one list. This file
 * only adds what a showcase needs on top: the hero image prompt, the names of
 * the faces for the type specimen, how much to scale the display face so every
 * hero title lands at a similar optical size, and which hand-written flourish
 * (`fx`) the stylesheet should switch on.
 *
 * `skip` lists slugs the shelf leaves out. Custom is a colour picker, not a
 * look — on a shelf it is indistinguishable from Paper.
 */

export const SKIP = ['custom'];

export const META = {
  paper: {
    displayFont: 'Press Start 2P',
    bodyFont: 'JetBrains Mono',
    displayScale: 0.5,
    prompt:
      'Warm editorial desk flat-lay: cream paper sheets, a sage-green notebook and a pencil in soft morning window light, subtle paper grain, muted beige and sage palette.',
  },
  night: {
    displayFont: 'Press Start 2P',
    bodyFont: 'JetBrains Mono',
    displayScale: 0.5,
    prompt:
      'A quiet desk after dark: charcoal-blue room, one sage-green lamp glowing on paper and a closed laptop, cool grey shadows, minimal and still.',
  },
  nineties: {
    displayFont: 'Press Start 2P',
    bodyFont: 'Tahoma',
    displayScale: 0.5,
    fx: 'bevel',
    prompt:
      '1990s beige CRT computer on a grey office desk against a teal wall, chunky keyboard and floppy disks, flat on-camera flash, grey and teal palette.',
  },
  vacation: {
    displayFont: 'Poppins',
    bodyFont: 'Poppins',
    displayScale: 1,
    prompt:
      'Sunny tropical beach from above: turquoise water, white sand, a coral-red umbrella and striped towel, soft rounded shapes, bright airy light, teal and coral palette.',
  },
  steampunk: {
    displayFont: 'IM Fell English',
    bodyFont: 'Georgia',
    displayScale: 1.05,
    prompt:
      'Victorian steampunk workshop: brass gears, copper pipes and pressure gauges, aged leather, warm lamplight and drifting steam, deep brown and brass palette.',
  },
  neon: {
    displayFont: 'Orbitron',
    bodyFont: 'Orbitron',
    displayScale: 0.8,
    bodyScale: 0.92, /* Orbitron runs wide as a text face */
    fx: 'glow',
    prompt:
      'Rain-slick cyberpunk alley at night inside a black void, glowing cyan and magenta neon tubes reflected in puddles, light haze, very high contrast.',
  },
  glass: {
    displayFont: 'System sans',
    bodyFont: 'System sans',
    displayScale: 1,
    fx: 'glass',
    /* The registry calls this theme "System sans" but its tokens never set a
       face, so in the tools it inherits Paper's pixel font. On a shelf that reads
       as a mistake, so the shelf applies what the registry says. */
    tokens: { '--font-display': "system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif", '--font-body': "system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif" },
    prompt:
      'Abstract frosted-glass panels floating over a soft blue-to-lavender gradient, translucent layers with gentle refraction and blur, pastel blue and violet, clean and airy.',
  },
  circle: {
    displayFont: 'Press Start 2P',
    bodyFont: 'JetBrains Mono',
    displayScale: 0.5,
    prompt:
      'Smooth rounded pebbles and soft clay shapes stacked on cream paper, sage green and beige, gentle studio shadows, every form curved with no sharp edges.',
  },
  ai: {
    displayFont: 'Inter',
    bodyFont: 'Inter',
    displayScale: 1,
    prompt:
      'Minimal abstract 3D scene: a soft indigo-violet gradient orb with flowing ribbons on a near-white background, subtle soft shadows, clean modern tech aesthetic.',
  },
  poker: {
    displayFont: 'Playfair Display',
    bodyFont: 'Georgia',
    displayScale: 1,
    prompt:
      'Overhead casino poker table: deep green felt, stacks of gold and red chips, a fanned hand of cards, warm spotlight with a dark vignette, green, gold and card-red palette.',
  },
  discord: {
    displayFont: 'System sans',
    bodyFont: 'System sans',
    displayScale: 1,
    /* Same story as Glassmorphia: body is set, display is not. */
    tokens: { '--font-display': "system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif" },
    prompt:
      'Cozy dark gaming room at night: desk with headset and keyboard lit by a blurple and soft-blue monitor glow, charcoal-grey walls, relaxed late-night mood.',
  },
  terminal: {
    displayFont: 'VT323',
    bodyFont: 'VT323',
    displayScale: 1.35,
    bodyScale: 1.3, /* VT323's x-height is tiny; the kit measured the same bump */
    fx: 'scan glow',
    prompt:
      'Old CRT monitor in a pitch-black room glowing phosphor green, visible scanlines and curved glass, out-of-focus abstract green glyph rain, pure black and green only.',
  },
  academic: {
    displayFont: 'Georgia',
    bodyFont: 'Georgia',
    displayScale: 1,
    prompt:
      'Old university library reading table: leather-bound books, cream pages, a burgundy cloth bookmark and a brass lamp, soft daylight through tall windows, cream and burgundy palette.',
  },
  money: {
    displayFont: 'Press Start 2P',
    bodyFont: 'Roboto Mono',
    displayScale: 0.5,
    prompt:
      "Dark green banker's desk: gold coins, a brass pen, a ledger book and engraved guilloche patterns, moody low light with gold highlights, deep green and gold palette, no real currency.",
  },
  y2k: {
    displayFont: 'Tahoma',
    bodyFont: 'Tahoma',
    displayScale: 1,
    fx: 'gloss',
    prompt:
      'Early-2000s glossy aqua aesthetic: shiny blue gel bubbles, chrome orbs and lens flares over a sky-blue gradient, wet glass highlights, Frutiger Aero style.',
  },
  win97: {
    /* hud-kit calls this "Windows 97", a release that never existed; the shelf shows it under the name of the one that
       did. The slug stays win97 — it is the key into hud-kit, the image file name and every existing #win97 link. */
    label: 'Windows 95',
    displayFont: 'Tahoma',
    bodyFont: 'Tahoma',
    displayScale: 1,
    fx: 'bevel win',
    prompt:
      'Late-90s desktop nostalgia: solid teal backdrop, a beige tower PC and CRT, grey beveled 3D blocks floating like interface windows, flat even lighting, teal, grey and navy palette.',
  },
  deed: {
    displayFont: 'Press Start 2P',
    bodyFont: 'JetBrains Mono',
    displayScale: 0.5,
    prompt:
      'Vintage board-game still life on pale green: cream property deed cards with coloured bands, small green houses, a red hotel, dice and a brass token, flat print-like lighting.',
  },
};
