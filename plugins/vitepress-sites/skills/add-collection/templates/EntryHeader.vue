<script setup lang="ts">
import { computed } from 'vue'
import { useData, withBase } from 'vitepress'

// The top of every entry's own page: its image, title, description, a row of chips, and an
// optional "visit" button. Everything comes from the entry's own frontmatter, so an entry file
// holds only its frontmatter, one `<EntryHeader>` line and its body text. Changing how every
// entry page looks means editing this one file, not every entry.
//
// `chips` lists which frontmatter fields to show as chips, in order: `:chips="['author', 'year']"`.
// A field that is missing on an entry is skipped; a list field (`tags: [a, b]`) shows one chip per
// item. `link` in frontmatter, if present, renders as an external button.
const props = withDefaults(
  defineProps<{
    chips?: string[]
    linkText?: string
    aspect?: 'video' | 'square' | 'portrait'
  }>(),
  { chips: () => [], linkText: 'Visit', aspect: 'video' },
)

const { frontmatter } = useData()

const chipValues = computed(() =>
  props.chips
    .flatMap((field) => [frontmatter.value[field]].flat())
    .filter((value) => value !== null && value !== undefined && value !== ''),
)
</script>

<template>
  <!-- A wide banner for landscape pictures; a cover beside the text for book covers, portraits and
       other upright images, which look wrong stretched across the whole page. -->
  <img
    v-if="frontmatter.image && aspect === 'video'"
    :src="withBase(frontmatter.image)"
    alt=""
    class="aspect-video max-h-[480px] w-full object-cover"
  >

  <div class="mx-auto flex max-w-2xl flex-col gap-6 px-6 pt-12 sm:flex-row sm:items-start">
    <img
      v-if="frontmatter.image && aspect !== 'video'"
      :src="withBase(frontmatter.image)"
      alt=""
      :class="aspect === 'portrait' ? 'aspect-[3/4]' : 'aspect-square'"
      class="w-40 shrink-0 rounded-md object-cover shadow-md"
    >
    <div>
      <h1 class="text-3xl! font-bold! leading-tight! tracking-tight">{{ frontmatter.title }}</h1>
      <p v-if="frontmatter.description" class="mt-3! text-lg text-black/70! dark:text-white/70!">{{ frontmatter.description }}</p>
      <div v-if="chipValues.length" class="mt-4 flex flex-wrap gap-2">
        <span
          v-for="chip in chipValues"
          :key="String(chip)"
          class="rounded-full bg-brand-50 px-2.5 py-0.5 text-xs font-medium text-brand-600 dark:bg-brand-500/30 dark:text-white/90"
        >{{ chip }}</span>
      </div>
      <a
        v-if="frontmatter.link"
        :href="frontmatter.link"
        target="_blank"
        rel="noopener"
        class="mt-5 inline-block rounded-md bg-brand-500 px-4 py-2 text-sm font-medium text-white! no-underline! hover:bg-brand-600"
      >{{ linkText }} ↗</a>
    </div>
  </div>
</template>
