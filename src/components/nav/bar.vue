<script setup>
import { useRoute } from 'vue-router'
import { useParents, pages, routes } from '~/use/pages'
import { lchToHsl } from '~/use/colors'

const route = useRoute()

const list = computed(() => useParents(route.path))
</script>

<template lang='pug'>
nav.flex.flex-wrap.w-full.left-0.gap-2.p-2.items-center
  transition-group(name="list" mode="out-in")
    router-link(v-for="page in routes" :key="page" :to="page.path") {{ page?.title }} 

  //- state-dark.absolute.top-16.right-4.text-2xl.z-400
  .flex-auto
  state-midi
  state-synth
  state-quantize
  state-octave
  state-fullscreen
</template>

<style lang="postcss" scoped>
nav > button {
  @apply text-2xl;
}
</style>