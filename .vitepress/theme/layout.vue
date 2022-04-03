<script setup>
import { useData, useRoute } from 'vitepress'
import { useRafFn } from '@vueuse/core'
import SimplexNoise from 'simplex-noise';


const route = useRoute()

const { frontmatter } = useData()

const count = ref(0)

const simplex = new SimplexNoise();
const angle = ref()

const { pause, resume } = useRafFn(() => {
  count.value++
  angle.value = simplex.noise2D(1, count.value / 2000);
})

import ColorHash from "color-hash";

const getColor = new ColorHash({
  saturation: [0.05, 0.28, 0.62],
  lightness: [0.75, 0.87, 0.9],
})


const color1 = computed(() => getColor.hex(frontmatter.value?.title || '0'))
const color2 = computed(() => getColor.hex(route.path || '2'))


const background = computed(() => `linear-gradient(${angle.value * 360}deg, ${color1.value}, ${color2.value})`)

</script>

<template lang="pug">
transition(name="fade")
  .app(    :style="{ background }"  )
    state-fullscreen.absolute.top-4.right-4.text-2xl.z-400
    //- state-dark.absolute.top-16.right-4.text-2xl.z-400
    state-midi.absolute.top-16.right-4.text-2xl
    state-synth.absolute.top-28.right-4.text-2xl
    state-quantize.absolute.top-42.right-4.text-2xl.z-400
    state-octave.absolute.top-54.right-4.text-2xl.z-400
    //- state-shop.absolute.bottom-4.left-4.z-400

    .flex.flex-col.h-100vh.w-full
      nav-up
      .bg-light-50.p-4.bg-opacity-30
        .text-2xl.font-bold {{ frontmatter?.title }}
        .text-xl {{ frontmatter?.subtitle }}
      content#content.flex-auto
      nav-prev-next
  //debug
</template>

<style>
.app {
  @apply transition duration-800ms relative overflow-y-scroll absolute min-h-full flex flex-col items-center text-left w-full;
}

#content > div {
  @apply flex flex-col w-full hyphens-auto text-left;
  h1,
  h2,
  h3,
  h4,
  h5,
  h6,
  p,
  li {
    @apply max-w-lg;
  }
}

.nav {
  @apply rounded-lg flex items-center flex-1  w-full bg-light-50/40 hover_no-underline hover_shadow transition hover_bg-light-50/80;
}
</style>
