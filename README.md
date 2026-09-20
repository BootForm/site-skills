# site-skills

A [Claude Code](https://claude.com/claude-code) plugin marketplace for building real static
sites, not tutorials about building sites. Two plugins:

- **`vitepress-sites`**: build a marketing site, portfolio, or blog with VitePress, the way that
  avoids VitePress's own docs-site defaults (a sidebar, `layout: doc`). Useful on its own, whether
  or not you've ever heard of BootForm.
- **`bootform`**: add a real, working contact form to any site (any framework, not just
  VitePress), with no signup wall to get started, and style it so it doesn't come out invisible.

Skills here are thin on purpose: they don't generate a site from scratch (that drifts, can't be
tested, and produces something different every run). Each skill's real payload is a template
repo, elsewhere in this org, with its own `AGENTS.md` stating its actual conventions. The skill's
job is knowing which template to start from and how to work within it, not reinventing the site
generator itself.

## Install

```
/plugin marketplace add BootForm/site-skills
/plugin install vitepress-sites@site-skills
/plugin install bootform@site-skills
```

Then just ask, for example:

> Build me a portfolio site with a working contact form.

## What's in here

```
.claude-plugin/marketplace.json     ← this marketplace's own manifest
plugins/
  vitepress-sites/
    .claude-plugin/plugin.json
    skills/
      marketing-site/SKILL.md       ← github.com/BootForm/vitepress-marketing
      portfolio-site/SKILL.md       ← github.com/BootForm/vitepress-portfolio
      blog-site/SKILL.md            ← github.com/BootForm/vitepress-blog
      restyle-theme/SKILL.md        ← restyle an existing site from one of the above
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
