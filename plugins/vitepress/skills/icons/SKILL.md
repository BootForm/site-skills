---
name: icons
description: Change or add the icons on a VitePress site built from a BootForm template (feature and facility icons, contact details, checkmarks, social links in the header), using the openly licensed Lucide icon set, consistently sized and coloured. Use when the user wants different icons, icons that match what they actually offer, icons added to a section, or social links (Instagram, LinkedIn, WhatsApp and so on). For the logo and the browser tab icon (favicon), use the theme skill.
---

# Change the icons on a VitePress site

Icons on these sites come from three places:

| Where | What it is | How to change it |
|---|---|---|
| Page markdown and pasted sections | Inline `<svg>`: feature grids, facilities, contact details, checkmarks | Replace the `<svg>` element (below) |
| `themeConfig.socialLinks` in `docs/.vitepress/config.mts` | The icons at the right of the header | A Simple Icons name, or custom SVG (below) |
| `docs/public/logo.svg` and the favicon | The logo and the tab icon | The `theme` skill |

Read the site's `AGENTS.md` first.

## Inline icons

**Source them from [Lucide](https://lucide.dev/icons/)** (ISC license, 1,500+ icons, drawn on a
24px grid with a 2px stroke, the same style the templates' and `site-sections`' own icons use).
Don't draw icons by hand, and don't copy them from a paid or unclear-licence set.

1. **Pick by meaning**, one icon per idea: `waves` for a pool, `wifi`, `car` for parking,
   `utensils` for a kitchen, `map-pin`, `phone`, `mail`, `clock`, `shield-check`, `leaf`. Browse
   https://lucide.dev/icons/ for names; a name is the last part of an icon's URL there.
2. **Fetch the exact SVG** (a web-fetch tool that summarises pages won't do; use `curl`):

   ```bash
   curl -sfL https://cdn.jsdelivr.net/npm/lucide-static/icons/waves.svg
   ```

   A failure (exit code 22) means the name is wrong. Search again rather than guessing a
   similar name.
3. **Adapt it to the site's markup**, matching the icon you're replacing:
   - Put it on **one line**. A multi-line icon is fine in plain HTML, but in a VitePress markdown
     page a blank line inside HTML breaks the block, and one line can't contain one.
   - Drop Lucide's `class`, `width` and `height`. Keep `viewBox="0 0 24 24"`, `fill="none"`,
     `stroke="currentColor"`, `stroke-width`, `stroke-linecap` and `stroke-linejoin`.
   - Copy the **size and colour classes** from the icon it replaces (`class="size-5"`, often
     inside a wrapper with `text-brand-500` or `text-brand-600`). Colour always comes from
     `currentColor`: never hard-code a `stroke` or `fill` colour, or dark mode can't change it.
   - A **decorative** icon next to text gets `aria-hidden="true"`. An icon that is the **only**
     content of a link or button gets `role="img"` plus an `aria-label` on the link instead
     (`<a href="..." aria-label="Call us">`).
   - Drop the `<!-- @license ... -->` comment from each copy, and instead put **one** comment at
     the top of the page body: `<!-- Icons: Lucide (lucide.dev), ISC License -->`. If the site's
     README has a credits section, add Lucide there too.
4. **Keep one set, one size per group.** Every icon in a grid should come from Lucide with the
   same stroke width and size. If the site already uses a different set consistently (Heroicons,
   say), stay with that set instead, from its own official package.

Replacing the villa template's facilities icons, for example, means one `curl` per facility
(`waves` for the pool, `dumbbell` for the gym, `flame` for the BBQ) and swapping each `<svg>` in
`docs/index.md`, keeping the `class="text-brand-500"` wrapper and the 28px size the grid uses.

## Social links in the header

```ts
socialLinks: [
  { icon: 'instagram', link: 'https://instagram.com/yourname' },
  { icon: 'whatsapp', link: 'https://wa.me/15555550123', ariaLabel: 'WhatsApp' },
],
```

- `icon` is a [Simple Icons](https://simpleicons.org/) name (`github`, `instagram`, `linkedin`,
  `facebook`, `youtube`, `x`, `whatsapp`, `tiktok`, `bluesky`, `mastodon`). VitePress bundles
  the icons it finds at build time. An unknown name makes the browser fetch it from
  `api.iconify.design` instead, and shows nothing if that fails, so check every name exists on
  simpleicons.org.
- For anything that isn't a brand (an email or phone link), use a Lucide icon as custom SVG:
  `{ icon: { svg: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" ...>...</svg>' }, link: 'mailto:hello@example.com', ariaLabel: 'Email' }`.
  Custom SVG always needs `ariaLabel`.
- Brand icons are trademarks: use them only to link to the user's own profiles.
- Remove the template's placeholder `https://github.com/yourname` link if the user doesn't want
  a GitHub icon.

## Check it

1. `npm run build`.
2. Count what shipped against what you meant to add, e.g.
   `grep -o '<svg' docs/.vitepress/dist/index.html | wc -l`, and confirm no icon markup ended up
   inside a `<pre>` (a blank line crept in) or as escaped text.
3. Open the page (`npm run preview`) in light and dark mode: every icon visible, the same size
   within a group, and brand-coloured icons still readable on the dark background.

## Do not

- Hand-draw an icon when Lucide has one, or mix icon sets on one page.
- Hard-code icon colours instead of using `currentColor`.
- Use em dashes or en dashes in any copy you write.
