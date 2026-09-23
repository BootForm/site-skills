---
name: add-collection
description: Add a new kind of content to a VitePress site built from a BootForm template, such as projects, books, team members, events, services, products, recipes or testimonials. Each one gets its own folder of markdown files, a generated listing page, a page per entry, and optionally cards on the home page. Also use it to add one more entry to a collection that already exists. Use when the user says "add a books section", "I want a page listing my projects", "add team members", "add a new type of page", or similar, on vitepress-marketing, vitepress-portfolio, vitepress-blog, vitepress-villa, or a site built from one of them.
---

# Add a collection (VitePress)

A **collection** is a folder of markdown files that all describe the same kind of thing: projects,
books, team members, events. Every BootForm VitePress template already has one or two
(`docs/rooms/` in `vitepress-villa`, `docs/work/` in `vitepress-portfolio`, `docs/posts/` in
`vitepress-blog`). This skill adds another one the same way, from the ready-made files in
`templates/` next to this `SKILL.md`. Copy them; don't write these files from scratch.

When it's done, adding an entry means adding one `.md` file. Nothing else to touch.

## 0. Adding an entry to a collection that already exists?

Then this is the whole job: copy an existing entry file in that folder, change its frontmatter and
body, and add its image under `docs/public/<folder>/`. The listing page and home page pick it up by
themselves. Check the folder's `*.data.ts` for the fields it expects. Stop here.

## 1. Pin down the collection

From the request, or by asking in one short question if it's genuinely unclear:

- **Folder**: plural, lowercase, URL-safe: `books`, `projects`, `team`, `events`. It becomes the URL
  (`/books/`). Must not clash with an existing folder under `docs/`.
- **Type name** for the TypeScript interface: singular, PascalCase: `Book`, `Project`, `Member`.
- **Page title and nav label**: `Books`, `Projects`, `Team`.
- **Extra fields** beyond title, description and image. Suggest sensible ones instead of asking:
  books get `author`, `year`, `link`; team gets `role`; events get `date`, `location`; products get
  `price`, `link`. Keep it to two or three.
- **Order**: hand-picked (`order: 1, 2, 3`) for most things; newest first (`date`) for events,
  press, releases.
- **Picture shape**: `video` (landscape photos, screenshots), `portrait` (book covers, headshots),
  `square` (logos, album art).

Skip the questions when the request already says enough. "Add a books section" is enough: go with
`books`, `Book`, `author`/`year`/`link`, hand-picked order, portrait.

## 2. Read the repo's own AGENTS.md

Before editing. It has the conventions and the gotchas this template has already hit. The ones
that matter most here: every page sets `layout: page` or `layout: home`, never `layout: doc`; no
`sidebar` key; `!`-suffixed Tailwind classes where an unlayered reset would otherwise win; every
runtime `href`/`src` goes through `withBase()`.

## 3. Install the two shared components (once per site)

`templates/EntryCard.vue` and `templates/EntryHeader.vue` are shared by every collection this
skill adds, so they only get installed once.

- If `docs/.vitepress/theme/components/EntryCard.vue` already exists, skip this step.
- Otherwise copy both files there unchanged, and register them in `docs/.vitepress/theme/index.ts`:

  ```ts
  import EntryCard from './components/EntryCard.vue'
  import EntryHeader from './components/EntryHeader.vue'

  export default {
    extends: DefaultTheme,
    enhanceApp({ app }) {
      app.component('EntryCard', EntryCard)
      app.component('EntryHeader', EntryHeader)
    },
    Layout: /* keep the existing footer override exactly as it is */,
  }
  ```

  If `enhanceApp` already exists (it does in `vitepress-portfolio` and `vitepress-villa`), add the
  two `app.component` lines to it. `vitepress-marketing` has no `enhanceApp` yet: add one.

Leave the site's existing card components (`RoomCard`, `ProductCard`) and existing collections
alone. Don't migrate them unless the user asks.

Also check `docs/.vitepress/theme/style.css` for a rule containing `revert-layer`. Sites made from
these templates before 2026-09-23 don't have it, and without it every entry page's markdown body
renders flat: `# Headings` at body size, no paragraph spacing, no list bullets. If it's missing,
append `templates/prose-fix.css` to the end of `style.css` unchanged.

## 4. Create the collection

Copy from `templates/`, replacing the `__PLACEHOLDERS__`:

| Template | Goes to | Fill in |
|---|---|---|
| `collection.data.ts` | `docs/<folder>/<folder>.data.ts` | `__FOLDER__`, `__TYPE__`, one interface line and one `map` line per extra field, keep one sort line |
| `index.md` | `docs/<folder>/index.md` | `__FOLDER__`, `__TITLE__`, `__INTRO__` (one real sentence), `:meta` and `aspect` |
| `entry.md` | `docs/<folder>/<slug>.md`, one per entry | frontmatter, `:chips`, `aspect`, body, the "All ..." link |

Details that are easy to get wrong:

- The data file must be named `<something>.data.ts`. VitePress only treats files with that suffix
  as build-time data loaders.
- The glob (`'books/*.md'`) is relative to `docs/`, not to the data file, and the filter URL is
  `'/books/'` with both slashes.
- `:meta` on the listing card takes values: `:meta="[entry.author, entry.year]"`. `:chips` on an
  entry page takes field **names**: `:chips="['author', 'year']"`. Keep the two in the same order.
- Use the same `aspect` on the listing page and on every entry page of a collection.
- Keep one `<EntryHeader>` line and plain markdown in each entry. Don't paste hero/chip markup into
  entry files: that's exactly the duplication `EntryHeader` exists to remove.
- An `order` or `date` field needs to be on every entry, or the sort order looks random.

**Entries**: write real ones from what the user gave you. If they gave nothing, write two or three
clearly-marked examples, and put a `*CHANGE ME: example entry...*` line at the top of the first
one's body, the same way the template's own examples do.

**Images**: under `docs/public/<folder>/`, referenced from frontmatter as `/<folder>/name.jpg`
(no `docs/public` prefix, no base path: `withBase()` adds that). Use the user's own pictures, or
free-to-use real photos (the templates ship Unsplash License photos via Picsum Photos, e.g.
`https://picsum.photos/seed/<word>/800/1066` for a 3:4 cover). Never leave a broken image path,
and don't use images that imply real client work or real people the user hasn't named. An entry
with no `image` field is fine: its card simply shows no picture.

## 5. Link it in

- **Nav**: add `{ text: '<Title>', link: '/<folder>/' }` to `themeConfig.nav` in
  `docs/.vitepress/config.mts`, before `Contact` if there is one.
- **Home page teaser** (offer it; do it if the user wants it or the home page already has one for
  another collection): in `docs/index.md`, import the loader in the existing `<script setup>`
  (`import { data as books } from './books/books.data.ts'`), then add a section matching the style
  of the page's existing ones:

  ```html
  <div class="mx-auto max-w-6xl px-6 py-16">

  <h2 class="mb-6 text-2xl! font-bold! tracking-tight">Books</h2>

  <div class="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
    <EntryCard v-for="book in books.slice(0, 3)" :key="book.url" :title="book.title" :description="book.description" :image="book.image" :to="book.url" :meta="[book.author, book.year]" aspect="portrait" />
  </div>

  <p class="mt-6 text-center">

  [See all books](/books/)

  </p>

  </div>
  ```

  Blank lines around the markdown link matter: without them it's rendered as raw text inside the
  HTML block. Don't hard-code a count ("See all 5 books"); it goes stale with the next entry.

- **Internal links** anywhere you add them: a markdown link (`[All books](/books/)`) or a
  `withBase()`-bound `:href`. **Never a raw `<a href="/books/">`**: it works in `npm run dev` and
  404s on GitHub Pages, because raw HTML skips VitePress's base-path handling.

## 6. Verify for real

1. `npm run build`. A failure here is usually a wrong placeholder, a typo in the glob, or a data file
   not ending in `.data.ts`.
2. Grep the built HTML for the new cards and their real links, including the base path, e.g.
   `grep -o 'href="/vitepress-villa/books/[^"]*"' docs/.vitepress/dist/books/index.html`. A card
   count of zero with a green build means the glob or the filter URL is wrong.
3. Add a throwaway entry file, rebuild, confirm it appears on the listing (and home page), then
   delete it. This is the whole promise of a collection; check it rather than assume it.
4. Open the pages (`npm run preview`) in light and dark mode: the listing, one entry, and the home
   page. Look for invisible or oversized text, stretched images, and chips with no contrast.

## 7. Tell the user how to add the next one

End with two lines they can follow without you: "To add a book, copy `docs/books/dune.md`, change
its frontmatter and text, and put its cover in `docs/public/books/`. It appears on the Books page
(and the home page) by itself." If the repo's `README.md` has a "Make it yours" list of folders,
add the new folder to it in the same style.

## Do not

- Write a new card or header component per collection. `EntryCard` and `EntryHeader` cover every
  kind of entry through `meta`, `chips` and `aspect`.
- Use `layout: doc`, add a `sidebar`, or use `<router-link>` around a card (it renders as nothing,
  with no error; see `vitepress-portfolio`'s `AGENTS.md`).
- Build Tailwind class names from strings (`` `aspect-${shape}` ``). The scanner only sees classes
  written out in full.
- Use em dashes or en dashes in any copy you write for the site.
