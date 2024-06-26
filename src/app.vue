<script setup>
import { useRafFn } from '@vueuse/core'
import { createNoise2D } from 'simplex-noise';
import ColorHash from "color-hash";
import scenes from '~pages'
import { useScene, activeScene } from '~/use/scene';
import { useMidi, useKeyboard } from '~/use/midi'
import { useRoute, useRouter } from 'vue-router'
import { onKeyStroke } from '@vueuse/core';
import { init } from './use/synth';


const { midi } = useMidi()
const route = useRoute()
const router = useRouter()

const count = ref(0)

const noise2D = createNoise2D();

const angle = ref()

const { pause, resume } = useRafFn(() => {
  count.value++
  angle.value = noise2D(1, count.value / 2000);
})

const getColor = new ColorHash({
  saturation: [0.05, 0.28, 0.62],
  lightness: [0.75, 0.87, 0.9],
})

const color1 = computed(() => getColor.hex(Math.random() * 100000 + 'a'))
const color2 = computed(() => getColor.hex(Math.random() * 100000 + 'b'))
const background = computed(() => `linear-gradient(${angle.value * 360}deg, ${color1.value}, ${color2.value})`)

const { visual, width, height } = useScene()

const changed = ref(false)

watch(() => midi.total.hits, hits => {
  if (hits == 0) {
    router.push(randomScene())
  }
})

onKeyStroke([' ', 'Enter'], () => {
  init()
  router.push(randomScene())
})

function randomScene() {
  let rnd, scs, index, path
  for (let i = 0; i < 20; i++) {
    rnd = Math.random()
    scs = Object.values(scenes)
    index = rnd * (scs.length)
    path = scs[Math.floor(index)].path
    if (!route.path.includes(path)) break
  }

  changed.value = true
  return path
}

onMounted(() => {
  useKeyboard()
})


</script>

<template lang="pug">
.flex.flex-col.h-100vh.w-full 
  // (:style="{ background }"  )
  state-overlay
  .absolute.bottom-20.text-center.flex.flex-col.items-center.w-full(v-if="!changed")
    .text-sm Hold any note more than {{ midi.maxDuration / 1000 }} seconds or press Enter/Spacebar to randomly change current scene.
  state-start
  .h-full.w-full
    svg#visual.h-full.w-full(
      ref="visual"
      version="1.1",
      baseProfile="full",
      :viewBox="`0 0  ${width} ${height}`",
      xmlns="http://www.w3.org/2000/svg",
    )
      defs
        filter#noiseFilter
          feTurbulence(type="fractalNoise", basefrequency="6.29", numoctaves="6", stitchtiles="stitch").
      rect(
        filter="url(#noiseFilter)"
        fill="hsl(20,70%,60%)"
        opacity="0.1"
        :width="width"
        :height="height"
        )
      router-view(v-slot="{ Component }")
        transition(name="fade" mode="out-in")
          keep-alive
            component#content(:is="Component")
    .absolute.left-0.top-10.flex.flex-col.gap-2.m-2.opacity-20.hover-opacity-100.transition
      router-link.button.p-2.cursor-pointer.text-3xl( 
        v-for="(scene, i) in scenes" :key="scene.path"
        @click="changed = true"
        :to="scene"
        :class="{ active: $route.path == scene.path }"
        v-tooltip.right="scene.name.charAt(0).toUpperCase() + scene.name.slice(1) + ' scene'"
        )

        icon-ph-plugs-connected(v-if="scene.name == 'index'")
        icon-bx-tachometer(v-if="scene.name == 'level'")
        icon-bi-flower1(v-if="scene.name == 'rose'")
        icon-la-plus(v-if="scene.name == 'cross'")
        icon-ri-donut-chart-fill(v-if="scene.name == 'donut'")
        icon-ic-outline-bar-chart(v-if="scene.name == 'stats'")
        icon-ph-spiral(v-if="scene.name == 'spiral'")
//debug
</template>

<style lang="postcss">
.app {
  @apply transition duration-800ms relative overflow-y-scroll absolute min-h-full flex flex-col items-center text-left w-full;
}

.nav {
  @apply rounded-lg flex items-center flex-1 w-full bg-dark-50/40 hover-no-underline hover-shadow transition hover-bg-light-50/80;
}

.button {
  @apply p-4 shadow transition opacity-90 hover-opacity-100 flex transition flex-auto justify-center items-center rounded-xl bg-light-400 dark-bg-dark-500;

  &:hover {
    @apply bg-light-50 dark-bg-dark-50;
  }

  &.active {
    @apply bg-dark-50 text-light-200 dark-bg-light-200 dark-text-dark-500;
  }
}

.panel {
  @apply absolute p-4 m-4 bg-light-300 dark-bg-dark-300 z-20 flex flex-col gap-2 bg-opacity-90 dark-bg-opacity-90 flex items-center shadow-lg rounded-xl overflow-hidden right-2 bottom-2 max-w-sm overflow-y-scroll max-h-80vh;
}
</style>
