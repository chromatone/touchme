<script setup>
import { useRoute } from 'vitepress'
import { pages } from '~/use/pages'
import { lchToHsl } from '~/use/colors'

const route = useRoute()

const list = computed(() => pages[route.path])
</script>

<template lang='pug'>
nav.flex.flex-wrap.w-full.gap-2.p-2
  a.page(v-for="page in list" :key="page" :href="page.path")
    .text-lg {{ page?.title }}
    .font-normal {{ page?.subtitle }}
</template>

<style lang="postcss" scoped>
.page {
  @apply p-8 bg-light-100/20 flex-1 hover_shadow transition-all;
}
</style>