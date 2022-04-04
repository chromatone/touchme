<script setup>
import { useRafFn } from '@vueuse/core'
import SimplexNoise from 'simplex-noise';
import ColorHash from "color-hash";

import { useRoute } from 'vue-router'

const route = useRoute()

const count = ref(0)

const simplex = new SimplexNoise();
const angle = ref()

const { pause, resume } = useRafFn(() => {
  count.value++
  angle.value = simplex.noise2D(1, count.value / 2000);
})


const getColor = new ColorHash({
  saturation: [0.05, 0.28, 0.62],
  lightness: [0.75, 0.87, 0.9],
})


const color1 = computed(() => getColor.hex(Math.random() * 100000 + 'a'))
const color2 = computed(() => getColor.hex(Math.random() * 100000 + 'b'))


const background = computed(() => `linear-gradient(${angle.value * 360}deg, ${color1.value}, ${color2.value})`)

</script>

<template lang="pug">
.flex.flex-col.h-100vh.w-full(:style="{ background }"  )
  nav-bar
  synth-start
  router-view(v-slot="{ Component }")
    transition(name="fade" mode="out-in")
      component#content(:is="Component")
//debug
</template>

<style lang="postcss">
.app {
  @apply transition duration-800ms relative overflow-y-scroll absolute min-h-full flex flex-col items-center text-left w-full;
}

.nav {
  @apply rounded-lg flex items-center flex-1  w-full bg-light-50/40 hover_no-underline hover_shadow transition hover_bg-light-50/80;
}
</style>


