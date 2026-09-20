---
name: marketing-site
description: Build a marketing site (landing page, pricing, hand-maintained blog list) with VitePress, using the BootForm vitepress-marketing template. Use when the user wants a company or product marketing site, not documentation.
---

# Marketing site (VitePress)

Start from `github.com/BootForm/vitepress-marketing`, a template built specifically to avoid
VitePress's own docs-site defaults (a sidebar, `layout: doc` everywhere).

## Steps

1. Ask the user for a repo name if they want a new repo, then create it from the template:
   `gh repo create <name> --template BootForm/vitepress-marketing --public --clone`. If they just
   want local files instead, clone the template directly and drop its own git history.
2. Read that repo's own `AGENTS.md` before changing anything. It states the one hard rule (every
   page sets `layout: home` or `layout: page`, never the default `layout: doc`) plus every gotcha
   already hit building it. Do not skip this: a model's training data is overwhelmingly
   VitePress-as-docs, and it will reach for a sidebar without this file telling it not to.
3. Customize `docs/.vitepress/config.mts` (title, description, nav) and
   `docs/.vitepress/theme/style.css` (the `--color-brand-*` block, which feeds both Tailwind's own
   utilities and VitePress's own accent color) for the user's brand.
4. Replace the placeholder copy in `docs/index.md`, `docs/pricing.md`, and the example blog posts
   with the user's own. Leave everything else in `AGENTS.md`'s convention alone unless asked.
5. If the user wants a working contact form, use the `add-contact-form` skill (from the `bootform`
   plugin) rather than hand-writing a form or its `action` URL.
6. Before finishing: run `npm install && npm run build`, then actually open the built output in
   `docs/.vitepress/dist/` (or a local preview) and look at it. A successful build is not the same
   as a page that looks right; several real gotchas in this template's own `AGENTS.md` produced a
   green build and a broken or invisible result.

## Do not

- Add a sidebar, or use `layout: doc` anywhere outside a page that is genuinely documentation.
- Invent new theme conventions this template doesn't already have. If something doesn't fit, ask
  the user rather than freelancing a fix that contradicts `AGENTS.md`.
