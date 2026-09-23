---
# One entry. Copy this file to add another; the file name becomes its URL (docs/books/dune.md is
# /books/dune.html). Replace __FOLDER__ and __TITLE__ in the "All" link at the bottom.
layout: page
title: The entry's name
description: One sentence, shown on its card and under its title.
image: /__FOLDER__/example.jpg
order: 1
# Extra fields for this kind of entry go here (author, year, role, price...), and into the
# collection's __FOLDER__.data.ts. `link` is optional: an external URL, shown as a button.
---

<EntryHeader :chips="[]" aspect="video" />

<div class="prose dark:prose-invert mx-auto max-w-2xl px-6 pb-16 pt-8">

The body is plain markdown. Write as much or as little as the entry needs.

[All __TITLE__](/__FOLDER__/)

</div>
