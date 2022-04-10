<script setup>
import { useRoute } from 'vue-router'
import { useParents, pages, routes } from '~/use/pages'
import { lchToHsl } from '~/use/colors'

const route = useRoute()

const list = computed(() => useParents(route.path))
</script>

<template lang='pug'>
.flex.gap-4.absolute.flex-col.right-2.bottom-2.text-xl.items-center.opacity-40.hover_opacity-100.transition
  state-dark
  midi-state
  synth-state
  state-fullscreen
</template>

<style lang="postcss" scoped>
nav button {
  @apply text-2xl;
}
</style>