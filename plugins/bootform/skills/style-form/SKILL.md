---
name: style-form
description: Make an existing HTML form look good with Tailwind CSS (a visible border, correct padding, a working focus state, dark mode, a legible primary button). Use after add-contact-form, or whenever a form on the page looks broken, invisible, or unstyled.
---

# Style a form well

A bare `<input>`, `<textarea>`, or `<button>` with no explicit styling classes is often invisible
(no border, no background, no padding) depending on the site's own CSS reset. This has happened on
every BootForm VitePress template at least once; the fix is the same each time.

## The reliable pattern

Input, select, and textarea fields:

```html
<input class="rounded-md border border-gray-300 bg-white px-3 py-2 outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-500/25 dark:border-gray-600 dark:bg-white/5">
```

Explicit `border-gray-300` (not an opacity-based color like `border-black/15`, which reads as
invisible against most backgrounds), explicit padding, and an explicit background so dark mode
doesn't leave the field the same color as the page behind it.

Primary submit button:

```html
<button class="rounded-md bg-brand-500 px-5 py-2 font-medium text-white hover:bg-brand-600">Send</button>
```

`bg-brand-*` assumes the site already defines that color (every BootForm VitePress template
does, in `docs/.vitepress/theme/style.css`); substitute the site's own primary color if not.

## If the site is a VitePress BootForm template and this still doesn't show up

Check for the CSS-layering trap: several base element resets in these templates' compiled CSS end
up unlayered while Tailwind's own utility classes are layered, so a plain class on a form control
(or a heading, or a paragraph's margin/centering) can silently lose to the reset. If a real
`npm run build`, followed by actually looking at the built page (or its computed styles), shows
the classes above aren't taking effect, append `!` to the ones that need to win:
`border-gray-300!`, `bg-white!`, `px-3!`, `py-2!`, `bg-brand-500!`, and so on. See the
`restyle-theme` skill (from the `vitepress-sites` plugin) for the fuller explanation.

## Always verify

Build (or reload) the actual page and look at it, in both light and dark mode. Don't assume the
classes worked just because they're the right ones; the whole reason this skill exists is that
they don't always take effect.
