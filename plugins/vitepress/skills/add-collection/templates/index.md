---
# Copy to docs/__FOLDER__/index.md and replace __FOLDER__, __TITLE__ and __INTRO__.
# `layout: page` keeps this a plain site page: no docs sidebar, no prev/next links.
layout: page
title: __TITLE__
---

<script setup>
import { data as entries } from './__FOLDER__.data.ts'
</script>

<!-- Generated at build time by __FOLDER__.data.ts. Add a file next to this one and a card appears
     here automatically. `meta` picks which fields show as chips on each card; `aspect` is
     "video" (landscape), "square" or "portrait" (book covers, headshots). For portrait or square
     pictures, use more, narrower columns so the cards don't get too tall:
     grid-cols-2 sm:grid-cols-3 lg:grid-cols-4. -->

<div class="mx-auto max-w-6xl px-6 py-16">

<h1 class="mb-2! text-3xl! font-bold! tracking-tight">__TITLE__</h1>
<p class="mb-8! text-black/70! dark:text-white/70!">__INTRO__</p>

<div class="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
  <EntryCard
    v-for="entry in entries"
    :key="entry.url"
    :title="entry.title"
    :description="entry.description"
    :image="entry.image"
    :to="entry.url"
    :meta="[]"
    aspect="video"
  />
</div>

<p v-if="entries.length === 0" class="opacity-60">Nothing here yet.</p>

</div>
