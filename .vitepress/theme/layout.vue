<script setup>
import { useData, useRoute } from 'vitepress'
import { getColor } from '~/use/colors'

const route = useRoute()

const { frontmatter } = useData()


const backgroundColor = computed(() => getColor.hex(frontmatter.value?.title || '0'))

</script>

<template lang="pug">
.app(
  :style="{ backgroundColor }"
)
  state-fullscreen.absolute.top-4.right-4.text-2xl.z-400
  state-dark.absolute.top-16.right-4.text-2xl.z-400
  state-midi.absolute.top-28.right-4.text-2xl
  //- state-shop.absolute.bottom-4.left-4.z-400

  .flex.flex-col.h-100vh.w-full.pt-32
    nav-up
    content.content
    .flex-auto
    nav-prev-next
//debug
</template>

<style>
.app {
  @apply transition-all duration-800ms relative overflow-y-scroll absolute min-h-full flex flex-col items-center text-left w-full;
}

.content > div {
  @apply flex w-full p-4 hyphens-auto text-left;
}

.nav {
  @apply rounded-lg flex items-center flex-1 p-4 w-full bg-light-50/10 hover_no-underline hover_shadow transition-all;
}
</style>
