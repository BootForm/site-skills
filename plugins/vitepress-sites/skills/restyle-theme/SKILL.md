---
name: restyle-theme
description: Restyle an existing VitePress site built from a BootForm template (brand colors, fonts, a more distinctive hero) without breaking its layout conventions. Use when the user already has one of these sites and wants it to look different, not when building a new one from scratch.
---

# Restyle a VitePress site's theme

Applies to any site built from `vitepress-marketing`, `vitepress-portfolio`, `vitepress-blog`, or
`vitepress-villa` (via the `marketing-site`, `portfolio-site`, or `blog-site` skills, or their
template repos directly).

## Where the actual styling lives

- `docs/.vitepress/theme/style.css`: a `@theme { --color-brand-50/500/600: ... }` block feeds
  both Tailwind's own utility classes (`bg-brand-500`, `text-brand-600`, etc.) and a `:root`
  block right below it feeds VitePress's own `--vp-c-brand-*` variables. **Change both blocks
  together.** Changing only one leaves buttons and links using two different palettes.
- Every page uses Tailwind utility classes directly in the markdown (`class="..."` on raw HTML),
  not a separate hand-written CSS file. Restyling almost always means changing utility classes on
  existing elements, not adding new CSS rules.

## The CSS-layering trap (read this before touching headings, paragraphs, or form controls)

Several of Tailwind's own base resets in these templates' compiled CSS end up unlayered while
Tailwind's own utility classes are layered, so a plain utility class on an `h1`-`h6`, a `p`'s
margin/centering, or a form control's border/padding/background can silently lose to the reset,
with no error anywhere. If a heading looks smaller than it should, a paragraph isn't actually
centered despite `mx-auto`/`text-center`, or an input has no visible border or padding, this is
almost always why, not a typo in the class name. **Fix by appending `!` to the specific class
that needs to win** (`text-3xl!`, `mx-auto!`, `border-gray-300!`, `bg-brand-500!`). Confirm with
a real `npm run build` and a look at the actual rendered page (or its computed styles), not a
guess, and don't apply `!` everywhere by default: only the properties this reset actually touches
need it.

## Hero variety

The default `layout: home` hero (a title, tagline, and up to two buttons, optionally an
`hero.image` beside the text) works but reads the same across every site using it. A
backdrop-style hero, a real photo as a full-width background with a dark overlay for contrast and
the title/tagline/buttons layered on top, shorter than the default hero, reads more distinctive.
This requires dropping the `hero:` frontmatter key entirely (VitePress only renders its own
`VPHero` when that key is present) and hand-building the section in the page's own markdown body
instead; see `vitepress-blog`'s `docs/index.md` for a working example, including how to reorder
it ahead of a `features` section (also moved out of frontmatter, for the same reason: sections
built from frontmatter always render before the page's own markdown body, with no way to
reorder them against each other).

## Before finishing

Run `npm run build`, open the actual output, and check it in both light and dark mode. Restyling
work is exactly the kind of change that looks fine in the editor and wrong in the browser.
