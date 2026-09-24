// Turns one brand colour into every colour token a BootForm VitePress template needs, and checks
// that the result is readable. Plain Node, no dependencies:
//
//   node palette.mjs "#0f6f8c"
//
// Prints the @theme block (Tailwind's brand-50/500/600), the :root block (VitePress's
// --vp-c-brand-1/2/3) and a .dark block (a lighter brand-1 so links stay readable on VitePress's
// dark background), then a contrast report. Paste the three blocks into
// docs/.vitepress/theme/style.css in place of the existing ones.

const input = process.argv[2]
if (!/^#?[0-9a-f]{6}$/i.test(input ?? '')) {
  console.error('Usage: node palette.mjs "#rrggbb"')
  process.exit(1)
}

const parse = (hex) => hex.replace('#', '').match(/../g).map((h) => parseInt(h, 16))
const toHex = (rgb) => '#' + rgb.map((c) => Math.round(Math.min(255, Math.max(0, c))).toString(16).padStart(2, '0')).join('')
const mix = (rgb, target, amount) => rgb.map((c, i) => c + (target[i] - c) * amount)
const WHITE = [255, 255, 255]
const BLACK = [0, 0, 0]

// WCAG relative luminance and contrast ratio.
const luminance = (rgb) => {
  const [r, g, b] = rgb.map((c) => {
    const s = c / 255
    return s <= 0.03928 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4
  })
  return 0.2126 * r + 0.7152 * g + 0.0722 * b
}
const contrast = (a, b) => {
  const [hi, lo] = [luminance(a), luminance(b)].sort((x, y) => y - x)
  return (hi + 0.05) / (lo + 0.05)
}

let base = parse(input)
const notes = []

// Buttons put white text on brand-500, so it needs 4.5:1 against white. Darken until it has it.
let darkened = 0
while (contrast(base, WHITE) < 4.5 && darkened < 20) {
  base = mix(base, BLACK, 0.06)
  darkened++
}
if (darkened) notes.push(`Darkened your colour to ${toHex(base)} so white button text on it is readable (4.5:1).`)

const brand50 = mix(base, WHITE, 0.92)
const brand600 = mix(base, BLACK, 0.18)
const brand3 = mix(base, BLACK, 0.32)

// VitePress uses --vp-c-brand-1 for links and accents, including on its dark background
// (#1b1b1f). Lighten it for dark mode until it reads there.
const DARK_BG = parse('#1b1b1f')
let darkBrand = base
let lightened = 0
while (contrast(darkBrand, DARK_BG) < 4.5 && lightened < 20) {
  darkBrand = mix(darkBrand, WHITE, 0.08)
  lightened++
}

const rows = [
  ['White text on brand-500 (buttons)', contrast(base, WHITE)],
  ['brand-600 text on white (links, eyebrows)', contrast(brand600, WHITE)],
  ['brand-600 text on brand-50 (chips, badges)', contrast(brand600, brand50)],
  ['Dark-mode brand-1 on #1b1b1f (links)', contrast(darkBrand, DARK_BG)],
]

console.log(`@theme {
  --color-brand-50: ${toHex(brand50)};
  --color-brand-500: ${toHex(base)};
  --color-brand-600: ${toHex(brand600)};
}

:root {
  --vp-c-brand-1: ${toHex(base)};
  --vp-c-brand-2: ${toHex(brand600)};
  --vp-c-brand-3: ${toHex(brand3)};
}

.dark {
  --vp-c-brand-1: ${toHex(darkBrand)};
}
`)
console.log('Contrast (4.5:1 is the minimum for body text):')
for (const [label, ratio] of rows) console.log(`  ${ratio >= 4.5 ? 'ok  ' : 'LOW '} ${ratio.toFixed(2)}:1  ${label}`)
for (const note of notes) console.log(`\n${note}`)
