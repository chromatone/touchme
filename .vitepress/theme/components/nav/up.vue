<script setup>
import { useRoute } from 'vitepress'
import { useParents } from '~/use/pages'
import { lchToHsl } from '~/use/colors'

const route = useRoute()

const list = computed(() => useParents(route.path))
</script>

<template lang='pug'>
nav.flex.flex-wrap.absolute.top-0.w-full.left-0.gap-2.p-2
  transition-group(name="fade")
    a.nav.max-w-42(href="/" key="shop") 
      la-arrow-left
      .ml-1 Back to shop
    a.nav(href="/" v-if="route.path != '/'" key="Start") Start
    a.nav(v-for="page in list" :key="page" :href="page.path")
      .text-lg {{ page?.title }}
</template>

<style lang="postcss" scoped>
</style>