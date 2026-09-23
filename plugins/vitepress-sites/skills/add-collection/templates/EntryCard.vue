<script setup lang="ts">
import { computed } from 'vue'
import { withBase } from 'vitepress'

// One card for every collection on the site (projects, books, team, events, anything). A listing
// page or a home page teaser renders one of these per entry, fed by that collection's own
// `*.data.ts` loader. Adding a new kind of entry never needs a new card component: pass different
// `meta` chips and, if the pictures are a different shape, a different `aspect`.
//
// `href` and `src` are runtime values, so both go through withBase() by hand. A raw
// `<a href="/books/">` or an unwrapped `:src` works in `npm run dev` and 404s once the site is
// served from a subpath (GitHub Pages).
//
// The `!`-suffixed classes force these past VitePress's own unlayered `.vp-doc` link and heading
// styling, which otherwise wins over Tailwind's (layered) utilities on the home page.
const props = withDefaults(
  defineProps<{
    title: string
    to: string
    description?: string
    image?: string
    meta?: Array<string | number | null | undefined>
    aspect?: 'video' | 'square' | 'portrait'
  }>(),
  { description: '', image: '', meta: () => [], aspect: 'video' },
)

// Written out in full so Tailwind's scanner sees each class. Never build these from strings.
const aspectClass = computed(
  () => ({ video: 'aspect-video', square: 'aspect-square', portrait: 'aspect-[3/4]' })[props.aspect],
)

const chips = computed(() => props.meta.filter((value) => value !== null && value !== undefined && value !== ''))
</script>

<template>
  <a
    :href="withBase(to)"
    class="group flex flex-col overflow-hidden rounded-lg border border-black/10 no-underline! transition hover:border-brand-500 dark:border-white/10"
  >
    <img v-if="image" :src="withBase(image)" :alt="title" :class="aspectClass" class="w-full object-cover">
    <div class="flex flex-col gap-1 p-4">
      <h3 class="mt-0! font-semibold text-black! group-hover:text-brand-500! dark:text-white!">{{ title }}</h3>
      <p v-if="description" class="my-0! text-sm leading-snug text-black/70! dark:text-white/70!">{{ description }}</p>
      <div v-if="chips.length" class="mt-2 flex flex-wrap gap-2">
        <span
          v-for="chip in chips"
          :key="String(chip)"
          class="rounded-full bg-brand-50 px-2.5 py-0.5 text-xs font-medium text-brand-600 dark:bg-brand-500/30 dark:text-white/90"
        >{{ chip }}</span>
      </div>
    </div>
  </a>
</template>
