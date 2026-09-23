import { createContentLoader } from 'vitepress'

// Copy to docs/__FOLDER__/__FOLDER__.data.ts, then replace __FOLDER__ (the folder name, e.g.
// `books`) and __TYPE__ (one entry, e.g. `Book`) everywhere in this file.

// title/description/image/url are what every card needs. Add a line for each extra frontmatter
// field this collection uses (author, year, role, price...), so the listing page can show it.
export interface __TYPE__ {
  title: string
  description: string
  image: string
  order: number
  date: string
  url: string
}

declare const data: __TYPE__[]
export { data }

// The glob is relative to docs/ (VitePress's srcDir), not to this file. It matches every entry
// file in the folder, but not this .ts file and not the folder's own index.md, which is filtered
// out by URL below. Runs at build time and on save in `npm run dev`, so a new entry file shows up
// on every page that imports this loader with no other file to touch.
export default createContentLoader('__FOLDER__/*.md', {
  transform(raw): __TYPE__[] {
    return raw
      .filter(({ url }) => url !== '/__FOLDER__/')
      .map(({ url, frontmatter }) => ({
        title: frontmatter.title ?? 'Untitled',
        description: frontmatter.description ?? '',
        image: frontmatter.image ?? '',
        order: frontmatter.order ?? 0,
        date: frontmatter.date ? String(frontmatter.date) : '',
        // One line per extra field, matching the interface above, e.g.:
        // author: frontmatter.author ?? '',
        url,
      }))
      // Keep ONE of these two lines and delete the other.
      // Hand-picked order (projects, team, services): `order: 1`, `order: 2`... in each entry.
      .sort((a, b) => a.order - b.order || a.title.localeCompare(b.title))
      // Newest first (events, press, releases): `date: 2026-09-01` in each entry.
      // .sort((a, b) => +new Date(b.date) - +new Date(a.date))
  },
})
