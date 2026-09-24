---
name: theme
description: Change how a VitePress site built from a BootForm template looks site-wide: its brand colour, fonts, corner roundness, logo and favicon, without breaking its layout conventions. Use when the user wants a different colour scheme, new fonts, a new logo or tab icon, or says the site looks generic, on vitepress-marketing, vitepress-portfolio, vitepress-blog, vitepress-villa or a site built from one of them. For the small icons inside the page (features, contact details, social links), use the icons skill instead.
---

# Theme a VitePress site

Applies to any site built from `vitepress-marketing`, `vitepress-portfolio`, `vitepress-blog` or
`vitepress-villa`. Everything site-wide lives in three places:

- `docs/.vitepress/theme/style.css`: the colour tokens, fonts and radius.
- `docs/.vitepress/config.mts`: the site title, the `logo`, and `head` (favicon, font links).
- `docs/public/logo.svg`: the logo, shown in the header and the footer.

Read the site's `AGENTS.md` first. Then do only the parts the user asked for.

## Colours

The templates use exactly five brand tokens, in two blocks of `style.css`. **Always change both
blocks together**, or buttons and links end up in two different palettes:

- `@theme { --color-brand-50/500/600 }` feeds Tailwind's classes (`bg-brand-500`, `text-brand-600`).
- `:root { --vp-c-brand-1/2/3 }` feeds VitePress's own nav, links and default buttons.

Don't pick the shades by eye. Run the script next to this file with the user's colour:

```bash
node <this skill's folder>/scripts/palette.mjs "#0f6f8c"
```

It prints the `@theme`, `:root` and `.dark` blocks to paste into `style.css` (replacing the
existing `@theme` and `:root` brand blocks, and adding the `.dark` block after them), plus a
contrast report. The `.dark` block lightens VitePress's link colour for dark mode so links stay
readable there. If the script says it darkened the colour (a light brand, such as yellow, can't
carry white button text), tell the user, and show them both the colour they asked for and the one
you used.

**No colour in mind?** Ask one question: what the business is and the feeling they want. Suggest
two or three colours with a one-line reason each. Don't default to indigo or blue without saying
it's a default.

Only ever define `brand-50`, `brand-500` and `brand-600` in `@theme`. Every template and every
`site-sections` snippet uses exactly those; a `brand-400` or `brand-700` that nothing defines
silently generates no CSS.

## Fonts

VitePress uses Inter by default, bundled with the theme. To change it:

1. **Self-host it with Fontsource**, not a Google Fonts `<link>`: no request to a third party, and
   no cookie-banner question for EU visitors. `npm install @fontsource-variable/<font>` (for
   example `@fontsource-variable/fraunces`), then `import '@fontsource-variable/fraunces'` at the
   top of `docs/.vitepress/theme/index.ts`. Check the package name exists on npm first; not every
   font has a variable build (then use `@fontsource/<font>` and import the weights you need, such
   as `import '@fontsource/lora/400.css'`).
2. **Tell both systems** in `style.css`:

   ```css
   @theme {
     --font-sans: "Fraunces Variable", ui-serif, Georgia, serif;
   }

   :root {
     --vp-font-family-base: "Fraunces Variable", ui-serif, Georgia, serif;
   }
   ```

   Use the family name the package's README gives (variable builds end in `Variable`).
3. **A separate heading font** is the usual pairing (a display font for headings, a plain one for
   text). Add `--font-display` to `@theme`, then one plain (unlayered) rule at the end of
   `style.css`:

   ```css
   h1, h2, h3, .VPHero .name, .VPHero .text {
     font-family: var(--font-display);
   }
   ```

4. **If Inter is no longer used anywhere**, change `import DefaultTheme from 'vitepress/theme'`
   to `import DefaultTheme from 'vitepress/theme-without-fonts'` in `theme/index.ts`, so the site
   stops downloading it.

Keep it to one or two families and the weights the site actually uses.

## Corner roundness

Tailwind v4 reads its radius scale from tokens, so the whole site's roundness changes in one
place. Add to the `@theme` block:

```css
--radius-md: 0.25rem;   /* buttons, inputs */
--radius-lg: 0.375rem;
--radius-xl: 0.5rem;    /* cards */
--radius-2xl: 0.75rem;
--radius-3xl: 1rem;     /* big panels */
```

Smaller values read more serious; larger ones friendlier. Don't find-and-replace `rounded-*`
classes across pages instead: it misses `site-sections` snippets pasted later.

## Logo

- **Changed the brand colour but kept the logo?** The templates' example `logo.svg` has its colour
  written into the file (a `stroke` or `fill` hex value). Change that value to the new `brand-500`,
  or the logo stays in the old colour.
- Replace `docs/public/logo.svg` with the user's logo, keeping the file name. The header gets it
  from `logo: '/logo.svg'` in `config.mts`, and the footer from `withBase('/logo.svg')` in
  `theme/index.ts`, so one file updates both.
- An SVG should be square-ish, use `currentColor` or the brand colour, and look right on both a
  white and a near-black background (the header is both, in light and dark mode). If it only
  works on white, add a second file and set `logo: { light: '/logo.svg', dark: '/logo-dark.svg' }`.
- A PNG or JPG works too: change the path in both places. Keep it small (under 50 KB).
- If the user has no logo yet, don't draw an elaborate one. A simple geometric mark in the brand
  colour next to the site name is fine; say that it's a placeholder.
- If the logo already contains the business name as text, set `siteTitle: false` in
  `themeConfig`, so the name isn't shown twice.

## Favicon (the tab icon)

The templates don't set one, so the browser shows a blank default. Add it to `head` in
`config.mts`:

```ts
head: [
  ['link', { rel: 'icon', type: 'image/svg+xml', href: '/vitepress-villa/logo.svg' }],
],
```

- `head` links are **not** base-prefixed by VitePress. Write the full path including the site's
  `base` (`/vitepress-villa/` above, `/` on a custom domain), and keep it in step with `base` if
  the repo is renamed. Some templates already have a `head` array (the RSS link): add to it.
- The logo usually works as the favicon. If it's detailed or wide, make a simpler square
  `docs/public/favicon.svg` (just the mark, no text) and point the link at that.
- Optional: a 180×180 `docs/public/apple-touch-icon.png` for iPhone home screens, linked with
  `['link', { rel: 'apple-touch-icon', href: '/<base>/apple-touch-icon.png' }]`. Only if you can
  produce a real PNG; never link a file that doesn't exist.

## The CSS-layering trap

Several base resets in these templates' compiled CSS sit outside any `@layer`, while Tailwind's
classes are layered, so a plain utility class on a heading, a paragraph's margin, or a form
control's border can silently lose. If a restyled heading looks smaller than it should, or an
input lost its border, append `!` to that specific class (`text-3xl!`, `border-gray-300!`). Don't
add `!` everywhere by default. Markdown inside a `prose` wrapper is handled once by the
`revert-layer` rule at the end of `style.css`: keep it. If an older site lacks it and its `prose`
text looks flat, append the `add-collection` skill's `templates/prose-fix.css`.

## A different hero or section

Use the `add-section` skill: it has five heroes (centered, split with image, photo backdrop, with
a form, announcement) and 22 other sections that already survive VitePress's styles.

## Before finishing

1. `npm run build`.
2. `grep -o 'rel="icon"[^>]*' docs/.vitepress/dist/index.html` shows the favicon link with the
   right base path, if you added one.
3. Open the site (`npm run preview`) in light and dark mode, at desktop and phone width: the
   header logo, a primary button, a link, a chip or badge, and body text. Restyling is exactly the
   kind of change that looks fine in the editor and wrong in the browser.

## Do not

- Change only one of the two colour blocks.
- Load fonts from a third-party CDN when Fontsource has them.
- Use em dashes or en dashes in any copy you write.
