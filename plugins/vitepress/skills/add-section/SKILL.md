---
name: add-section
description: Add a ready-made page section (a hero, a features grid, tabs, how it works, testimonials, a logo strip, stats, pricing tiers, a comparison table, an FAQ, a call-to-action band, a newsletter signup, a footer, a card grid, a team grid or a photo gallery) to a page, from BootForm's site-sections library. Use when the user wants to add, swap or redesign a section of a page ("add a pricing section", "give the home page a better hero", "I need an FAQ", "add testimonials"), on a VitePress site built from a BootForm template or on any site using Tailwind CSS v4.
---

# Add a page section

The sections come from [`BootForm/site-sections`](https://github.com/BootForm/site-sections)
(live gallery: https://bootform.github.io/site-sections/). Each is one plain HTML file, written to
work when pasted into a VitePress markdown page. **Fetch the real file and adapt it; never write a
section from memory**, because the file carries the `!` overrides VitePress needs, and a
hand-written one won't.

## 1. Pick the section

Match the request to one of these. If it's genuinely ambiguous (say "a hero" on a page with no
photo), pick the most fitting one and say which you chose; offer the gallery link so the user can
see the alternatives.

Asked for more than one ("pricing and an FAQ")? Fetch each file, and place them in the order the
user gave, or in the usual page order (hero, features, how it works, social proof, pricing, FAQ,
call to action) if they didn't say.

| Category (`<category>`) | Section (`<id>`): when to use it |
|---|---|
| `heroes` | `centered`: text only, the safe default. `split-image`: text beside a photo. `backdrop`: text over a full-width photo. `with-form`: a pitch plus a short enquiry form. `announcement`: a "New" badge, headline and product screenshot |
| `features` | `icon-grid`: six short features. `alternating`: two or three big features with images. `tabbed`: one feature at a time, CSS-only tabs. `sticky`: heading stays put while features scroll. `bento`: an uneven grid of cards |
| `steps` | `numbered`: three steps side by side. `timeline`: steps down a vertical line |
| `social-proof` | `testimonial-cards`: three quotes. `testimonial-banner`: one big quote. `logo-strip`: customer names or logos. `stats`: three or four numbers |
| `pricing` | `two-tiers`, `three-tiers` (middle one highlighted), `comparison-table`, `faq` (accordion) |
| `cta-footers` | `cta-band`: a coloured panel with two buttons. `newsletter`: email signup. `footer-simple`, `footer-columns` |
| `content` | `card-grid`: posts, projects or services. `team`: people with initials avatars. `gallery`: a photo grid |

## 2. Fetch it exactly

```bash
curl -sfL https://raw.githubusercontent.com/BootForm/site-sections/main/sections/<category>/<id>.html
```

Use `curl` (or any tool that returns the raw bytes). Don't use a web-fetch tool that summarises
pages: it hands back a paraphrase, not the markup. If `curl` fails, the full list of files is at
`https://raw.githubusercontent.com/BootForm/site-sections/main/sections.json`.

## 3. Read the site before pasting

- Is it a VitePress site from a BootForm template (`docs/.vitepress/`, an `AGENTS.md` mentioning
  `layout: home`)? Read that `AGENTS.md` first.
- Is Tailwind **v4** set up (`@import "tailwindcss"` in the CSS, `tailwindcss` 4.x in
  `package.json`)? The snippets use v4 syntax, including the trailing `!`. On v3 or no Tailwind,
  stop and tell the user rather than pasting something that half works.
- Are `--color-brand-50`, `--color-brand-500` and `--color-brand-600` defined in the `@theme`
  block? The BootForm templates define exactly these three. If the site has no brand tokens, add
  those three with its main colour, or replace `brand` in the snippet with a Tailwind colour it
  already uses.

## 4. Paste and adapt

**Where it goes.** In a markdown page, the snippet sits at the top level of the page body, with a
blank line before and after it. Never inside a `prose` wrapper (Typography would restyle it) and
never inside another section's `<div>`. On a `layout: home` page, sections go in the body in the
order they should appear; a frontmatter `hero:` block, if there is one, always renders first.

The templates' existing sections are `<div>` blocks that contain blank lines and markdown, so
finding where one ends by eye is error-prone. Each starts with a marker comment
(`<!-- ───── Rooms teaser ───── -->`): to put a section after "Selected work", insert it directly
before the next marker comment, or before the page's final section if it's last.

**Keep the snippet's structure and classes.** Don't remove a `!`, don't reformat it, and **never
add a blank line inside it**: in markdown a blank line ends the HTML block, and an indented line
after it renders as a code block. Don't introduce `{{ }}` or a `<script>` tag inside it.

**Replace the example content** with the user's own: headings, text, prices, plan names, people,
FAQ answers. If you don't have the real content, keep the example copy but make it plausible for
this site, put a `<!-- CHANGE ME: ... -->` comment directly above the section saying which parts
are placeholders, and tell the user the same. Never invent testimonials, customer
logos, ratings or statistics and present them as real. Leave those as clearly-marked examples
(for instance a `<!-- CHANGE ME: replace with real quotes -->` comment directly above the
section) and say so.

**Links.** Each `href="#"` points somewhere real on the site, or gets removed.
- On a VitePress site, an internal link inside a pasted section must be
  `:href="withBase('/contact.html')"`, with `import { withBase } from 'vitepress'` in the page's
  `<script setup>` (add one after the frontmatter if the page has none, or add the import to the
  existing one). A plain `href="/contact"` works in `npm run dev` and 404s on GitHub Pages.
- Write the path the way the site's own markdown links build it: `/contact.html` by default, or
  `/contact` if `config.mts` sets `cleanUrls: true`. A folder page stays `/work/`.
- The templates' `AGENTS.md` prefers plain markdown links for internal links. That's for links
  written as markdown text; inside a pasted section (an HTML block) markdown isn't parsed without
  adding blank lines, which the snippet can't have. So inside a section, `withBase()` is correct.
- An in-page anchor (`href="#pricing"`) and an external URL stay as plain `href`.

**Images.** Replace each `https://picsum.photos/...` placeholder with the user's own image when
there is one: in VitePress, put it in `docs/public/` and write `:src="withBase('/photos/pool.jpg')"`.
If there's no real image yet, leave the Picsum URL and say so. Give every meaningful image a real
`alt`.

**Forms** (`heroes/with-form`, `cta-footers/newsletter`). Keep the hidden `_honeypot` input. For
the `action` URL, use the `add-contact-form` skill from the `bootform` plugin to get a real form
ID and its claim link, if that plugin is installed. Otherwise leave
`https://f.bootform.com/__YOUR_FORM_ID__` and tell the user to generate their own ID at
https://bootform.com/uuidgenerator and claim it before the page goes live. Never make up a form ID.

**Section-specific details.**
- `features/tabbed`: the radio `id`s (`feature-tab-1`...) and the `group-has-[#feature-tab-1:checked]`
  classes must match, and must be unique on the page. Rename both together if there are two sets
  of tabs. Adding or removing a tab means adding or removing a label, a radio and a panel.
- `pricing/faq`: the shared `name="faq"` makes it open one answer at a time. Keep it unless the
  user wants several open at once.
- `pricing/two-tiers`, `pricing/three-tiers`: a price that isn't a number ("Custom") keeps the
  same two spans: the big one holds the word, the small one a short note ("quoted per project").
- `pricing/comparison-table`: keep every `!` on `table`, `tr`, `th` and `td`; they're what stop
  VitePress's own table styles taking over.
- `cta-footers/footer-*`: in a BootForm VitePress template the footer is rendered by
  `docs/.vitepress/theme/index.ts` (the `layout-bottom` slot), not by a page. To use one of these
  as the site footer, put the snippet in `docs/.vitepress/theme/components/SiteFooter.vue` as its
  `<template>` (converting internal links to `:href="withBase(...)"` with `withBase` imported in
  the component), and render it from that slot with `h(SiteFooter)`. Keep the "Built with" credit
  line if the template had one, unless the user asks to remove it.

## 5. Check it

1. `npm run build` (or the site's own build).
2. In the built HTML, confirm the section is there, that no `<pre>` appeared where it shouldn't,
   and that every internal link carries the `base` from `config.mts`, e.g.
   `grep -o 'href="/<base>/[^"]*"' docs/.vitepress/dist/index.html | sort | uniq -c` (the base is
   `/vitepress-villa/` in the villa template, and `/` on a custom domain), plus
   `grep -c 'href="#"'` for leftover placeholders.
3. Open the page (`npm run preview`) at a desktop width and at phone width (about 390px, via the
   browser's device toolbar or an iframe of that width), in light and dark mode. Switch modes with
   the site's own appearance toggle, or `localStorage.setItem('vitepress-theme-appearance', 'light')`
   (or `'dark'`) and a reload. Don't just toggle the `dark` class by hand: computed styles can go
   stale and send you chasing bugs that aren't there.
4. Look for: a heading at body-text size, a stray line above a heading, underlined button text,
   bullets on a list, text that disappears in one of the modes, buttons not stacking on a phone.
   Each of those means a `!` got lost or a blank line crept in. If screenshots aren't practical,
   check computed styles instead: an `h2`'s `font-size` and `border-top-width`, a button link's
   `text-decoration-line`, a `ul`'s `list-style-type`.

## Do not

- Write a section from scratch, or from memory of this library, when one here fits.
- Copy sections from a component library (Tailwind UI, CodyHouse, Flowbite or others) into the
  site. Their licences usually forbid it, and they aren't written for VitePress.
- Use em dashes or en dashes in any copy you write.
