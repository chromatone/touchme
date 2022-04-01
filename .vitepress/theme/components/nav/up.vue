<script setup>
import { useRoute } from 'vitepress'
import { useParents, pages } from '~/use/pages'
import { lchToHsl } from '~/use/colors'

const route = useRoute()

const list = computed(() => useParents(route.path))
</script>

<template lang='pug'>
nav.flex.flex-wrap.w-full.left-0.gap-2.p-2
  transition-group(name="list" mode="out-in")
    a.nav.p-4.max-w-42(href="/" key="shop" v-if="route.path == '/'") 
      la-arrow-left
      .ml-1 Back to shop
    a.nav.p-4.max-w-42(href="/" v-else key="Start") Start
    a.nav.p-4(v-for="page in list" :key="page" :href="page.path")
      .text-lg {{ page?.title }}
</template>

<style lang="postcss" scoped>
</style>