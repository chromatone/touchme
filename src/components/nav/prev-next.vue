<script setup>
import { useRoute } from 'vue-router'
import { useSiblings, pages, useParents } from '~/use/pages'

const route = useRoute()

const pn = computed(() => useSiblings(route.path))
const parent = computed(() => [...useParents(route.path)].pop())
const list = computed(() => pages[route.path])
</script>

<template lang='pug'>
nav.flex.flex-wrap.w-full.gap-2.p-2
  router-link.nav.p-4.sm_p-8(v-for="page in list" :key="page" :to="page.path")
    .flex.flex-col.gap-1
      .text-2xl {{ page?.title }} 
      .font-normal {{ page?.subtitle }}
nav.flex.flex-wrap.bottom-0.w-full.left-0.gap-2.p-2.justify-between(:key="route.path")
  transition-group(name="fade" type="out-in")
    a.nav.p-4(v-if="pn?.prev" :key="pn.prev.path" :href="pn.prev.path")
      la-arrow-left
      .flex-1
      .flex.flex-col.gap-1.text-right
        .text-lg {{ pn.prev?.title }}
        .font-normal {{ pn.prev?.subtitle }}
    a.nav.p-4(v-if="pn?.next" :key="pn.next.path" :href="pn.next.path")
      .flex.flex-col.gap-1
        .text-lg {{ pn.next?.title }}
        .font-normal {{ pn.next?.subtitle }}
      .flex-1
      la-arrow-right
    a.nav.p-4(v-if="pn?.total > 1 && !pn?.next && route.path != '/'" key="parent" href="../")
      .flex.flex-col.gap-1 
        .text-lg {{ parent?.title || 'Back' }}
        .font-normal {{ parent?.subtitle }}
      .flex-1
      la-arrow-up
</template>

<style lang="postcss" scoped>
</style>