# site-skills

A [Claude Code](https://claude.com/claude-code) plugin marketplace for building real static
sites, not tutorials about building sites. Two plugins:

- **`vitepress`**: start a VitePress site from a marketing, portfolio, blog or villa template,
  then grow it: add page sections, add new kinds of content, restyle it. Always the way that
  avoids VitePress's docs-site defaults (a sidebar, `layout: doc`). Useful on its own, whether or
  not you've ever heard of BootForm.
- **`bootform`**: add a real, working contact form to any site (any framework, not just
  VitePress), with no signup wall to get started, and style it so it doesn't come out invisible.

## Install

In Claude Code:

```
/plugin marketplace add BootForm/site-skills
/plugin install vitepress@site-skills
/plugin install bootform@site-skills
```

## Use

Run a command, or just describe what you want and Claude picks the right one.

**Start a site** (each one starts from a template repo in this org):

| Command | You get |
|---|---|
| `/vitepress:marketing-site` | A company or product site: home page, pricing, blog. From [vitepress-marketing](https://github.com/BootForm/vitepress-marketing) |
| `/vitepress:portfolio-site` | Case studies, a work grid and a hire-me form. From [vitepress-portfolio](https://github.com/BootForm/vitepress-portfolio) |
| `/vitepress:blog-site` | A real blog: post list, tags, RSS, authors. From [vitepress-blog](https://github.com/BootForm/vitepress-blog) |
| `/vitepress:villa-site` | Rooms, a gallery, a local guide and a booking enquiry form. From [vitepress-villa](https://github.com/BootForm/vitepress-villa) |

**Grow it:**

| Command | What it does |
|---|---|
| `/vitepress:add-section` | Adds a hero, features, testimonials, pricing, an FAQ, a footer and more, from the [site-sections](https://bootform.github.io/site-sections/) library, adapted to your page |
| `/vitepress:add-collection` | Adds a new kind of content (projects, books, team, events) with a listing page and a page per entry. After that, a new entry is one markdown file |
| `/vitepress:theme` | Changes the brand colour (with a contrast check), fonts, corner roundness, logo and tab icon, site-wide |
| `/vitepress:icons` | Swaps or adds icons (features, contact details, social links) from the openly licensed [Lucide](https://lucide.dev) set |

**Make the form work:**

| Command | What it does |
|---|---|
| `/bootform:add-contact-form` | Creates a real form endpoint with no account, wires it into your page, and gives you the link to claim it |
| `/bootform:style-form` | Makes a form look right: input types, states, dark mode |

For example:

```
/vitepress:portfolio-site  my name is Maya, I'm a product designer in Portland
/vitepress:add-section     a three-tier pricing section on the home page
/vitepress:add-collection  books, with the author and year on each card
/vitepress:theme           make it dark green, with a serif font for headings
/vitepress:icons           icons for pool, gym, parking and wifi, and my Instagram in the header
/bootform:add-contact-form
```

## Rather not use Claude Code?

Every skill is a thin layer over a template repo with an `AGENTS.md`, so you can do the same by
hand, or with any other AI coding agent:

1. Pick a template: [vitepress-marketing](https://github.com/BootForm/vitepress-marketing),
   [vitepress-portfolio](https://github.com/BootForm/vitepress-portfolio),
   [vitepress-blog](https://github.com/BootForm/vitepress-blog) or
   [vitepress-villa](https://github.com/BootForm/vitepress-villa). Click **Use this template** and
   follow its README.
2. Copy sections from [site-sections](https://bootform.github.io/site-sections/).
3. Follow [`add-collection`'s steps](plugins/vitepress/skills/add-collection/SKILL.md) for a new
   kind of content.

## How it's built

Skills here are thin on purpose: they don't generate a site from scratch (that drifts, can't be
tested, and produces something different every run). Each skill's real payload is a template
repo or a snippet library elsewhere in this org, with its own `AGENTS.md` stating its actual
conventions. The skill's job is knowing which one to start from and how to work within it.

```
.claude-plugin/marketplace.json     ← this marketplace's own manifest
plugins/
  vitepress/
    .claude-plugin/plugin.json
    skills/
      marketing-site/SKILL.md       ← github.com/BootForm/vitepress-marketing
      portfolio-site/SKILL.md       ← github.com/BootForm/vitepress-portfolio
      blog-site/SKILL.md            ← github.com/BootForm/vitepress-blog
      villa-site/SKILL.md           ← github.com/BootForm/vitepress-villa
      add-section/SKILL.md          ← github.com/BootForm/site-sections
      add-collection/               ← a new kind of content (books, team, events...) on any of them
        SKILL.md
        templates/                  ← the shared card, entry header, data loader, listing page and prose fix it copies
      theme/                        ← colours, fonts, radius, logo, favicon
        SKILL.md
        scripts/palette.mjs         ← one brand colour in, every colour token and a contrast report out
      icons/SKILL.md                ← Lucide icons and header social links
  bootform/
    .claude-plugin/plugin.json
    .mcp.json                       ← auto-connects mcp.bootform.com on install
    skills/
      add-contact-form/SKILL.md
      style-form/SKILL.md
```

## Why anonymous

`bootform`'s skills call `bootform_create_form` with no API key. That works: BootForm's MCP
server supports anonymous form creation, and every response carries a `claim_url` so the form's
owner can claim it before the page goes live. No account, no signup wall, before you've decided
whether the form backend is any good.

## Upgrading from `vitepress-sites`

The `vitepress` plugin was called `vitepress-sites` until 2026-09-23. If you installed it under
that name, run `/plugin uninstall vitepress-sites@site-skills`, then
`/plugin install vitepress@site-skills`.
