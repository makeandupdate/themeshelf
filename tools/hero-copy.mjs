/* ThemeShelf — the landing hero of every theme: how it is composed and what it says.
 *
 * The hero is not a caption over a picture; it is a landing page designed IN the
 * style. Four compositions cover the shelf, and a style is assigned the one it
 * would actually be laid out with:
 *
 *   split    product landing — copy left, a browser-framed UI mock and floating
 *            cards right. For the interface styles, where the UI is the subject.
 *   center   one huge centred title over a full-bleed scene, a halo behind it.
 *            For the atmospheric styles, where the mood is the subject.
 *   poster   print layout — issue number, rules, a portrait plate with a caption.
 *            For the typographic and craft styles.
 *   collage  overlapping, rotated cards, a polaroid and a sticker. For the styles
 *            that are made of cut-out parts.
 *
 * `tagline` is the landing headline under the style's name: short, and in the
 * style's own voice.
 */
export const HERO = {
  paper: { layout: 'split', tagline: 'Warm paper, sharp pixels.' },
  night: { layout: 'split', tagline: 'The quiet shift.' },
  nineties: { layout: 'collage', tagline: 'Beige box energy.' },
  vacation: { layout: 'split', tagline: 'Out of office, on brand.' },
  steampunk: { layout: 'center', tagline: 'Brass, steam and ambition.' },
  neon: { layout: 'center', tagline: 'Lights on. World off.' },
  glass: { layout: 'split', tagline: 'See through the interface.' },
  circle: { layout: 'split', tagline: 'No sharp edges.' },
  ai: { layout: 'split', tagline: 'Calm software for busy minds.' },
  poker: { layout: 'center', tagline: 'Deal yourself in.' },
  discord: { layout: 'split', tagline: 'Where the chat lives.' },
  terminal: { layout: 'center', tagline: 'Type. Enter. Done.' },
  academic: { layout: 'poster', tagline: 'Footnotes included.' },
  money: { layout: 'split', tagline: 'Every cent accounted for.' },
  y2k: { layout: 'split', tagline: 'The future, circa 2003.' },
  win97: { layout: 'collage', tagline: 'It is now safe to explore.' },
  deed: { layout: 'poster', tagline: 'Own the board.' },
  clay: { layout: 'split', tagline: 'Soft to the touch.' },
  cybercore: { layout: 'split', tagline: 'Cold chrome, clear signal.' },
  brutal: { layout: 'collage', tagline: 'Loud by design.' },
  scrapbook: { layout: 'collage', tagline: 'Cut, paste, keep.' },
  surreal: { layout: 'center', tagline: 'Logic is optional here.' },
  y2kchrome: { layout: 'center', tagline: 'Shiny, happy, online.' },
  pixel: { layout: 'collage', tagline: 'Every pixel placed by hand.' },
  synthwave: { layout: 'center', tagline: 'Drive into the sunset.' },
  glassmorphism: { layout: 'split', tagline: 'Light, held in glass.' },
  neu: { layout: 'split', tagline: 'Pressed from one surface.' },
  bento: { layout: 'split', tagline: 'Everything in its box.' },
  editorial: { layout: 'poster', tagline: 'Stories set in type.' },
  swiss: { layout: 'poster', tagline: 'Form follows the grid.' },
  minimal: { layout: 'poster', tagline: 'Only what matters.' },
  maximal: { layout: 'collage', tagline: 'More is more is more.' },
  luxury: { layout: 'center', tagline: 'Quietly expensive.' },
  sketch: { layout: 'collage', tagline: 'Ideas before pixels.' },
  ethereal: { layout: 'split', tagline: 'Lighter than air.' },
  boho: { layout: 'poster', tagline: 'Made slowly, worn in.' },
  victorian: { layout: 'center', tagline: 'Ornament is not a crime.' },
  cyberpunk: { layout: 'center', tagline: 'High tech. Low battery.' },
  wabisabi: { layout: 'poster', tagline: 'Perfectly imperfect.' },
};

/* The image has to leave room for the type, and where the type is depends on
   the composition. */
export const PROMPT_SUFFIX_BY_LAYOUT = {
  split: 'Wide 16:9 composition, calm empty space on the left half for a headline, no text, no logos.',
  collage: 'Wide 16:9 composition, calm empty space on the left half for a headline, no text, no logos.',
  poster: 'Wide 16:9 composition, subject kept to the right third, quiet plain space on the left, no text, no logos.',
  center: 'Wide 16:9 symmetrical composition with a calm, darker centre for a large title, detail pushed to the edges, no text, no logos.',
};
