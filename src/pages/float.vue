<script setup>
import { pitchColor } from '~/use/chromatone'
import { useMidi } from '~/use/midi.js'
import { useElementBounding, useRafFn } from "@vueuse/core";
import SimplexNoise from 'simplex-noise';


const scene = reactive({
  width: 1000,
  height: 1000,
})

onMounted(() => {
  const content = document.getElementById('content')
  const { width, height } = useElementBounding(content)
  watchEffect(() => {
    scene.width = width.value
    scene.height = height.value
  })
})

const { midi } = useMidi();

const simplex = new SimplexNoise();

function useActor() {
  const actor = reactive({
    x: 100,
    y: 100,
    angle: 0,
  })
  const count = ref(0)

  const initial = Math.random()

  const { pause, resume } = useRafFn(() => {
    count.value++
    actor.x = (simplex.noise2D(initial * 100, count.value / 2000) + 1) / 2;
    actor.y = (simplex.noise2D(initial * 200, count.value / 2000) + 1) / 2;
    actor.angle = (simplex.noise2D(initial * 300, count.value / 2000) + 1) / 2;
  })
  return actor
}

const actors = reactive([])

actors.push(useActor())
actors.push(useActor())


</script>

<template lang='pug'>

svg#visual.h-full(
  version="1.1",
  baseProfile="full",
  :viewBox="`0 0  ${scene.width} ${scene.height}`",
  xmlns="http://www.w3.org/2000/svg",
)
  defs
    filter#blur(x="-300%" y="-300%" width="600%" height="600%")
      feGaussianBlur(in="SourceGraphic" stdDeviation="50")
  rect(
    opacity="0.1"
    :width="scene.width"
    :height="scene.height"
  )
  line(
    style="transition: stroke-width 0.2s ease-out;"
    :stroke-width="midi?.note?.number * midi?.note?.velocity / 200"
    :stroke="pitchColor(midi?.note?.number - 21)"
    :x1="actors[0].x * scene.width"
    :x2="actors[1].x * scene.width"
    :y1="actors[0].y * scene.height"
    :y2="actors[1].y * scene.height"
  )

  g(
    v-for="actor in actors" :key="actor"
    :transform="`translate(${actor.x * scene.width},${actor.y * scene.height}) rotate(${actor.angle * 360})`"
    )
    circle(
      opacity="0.5"
      r="40"
      filter="url(#blur)"
    )
    circle(
      stroke-width="2"
      stroke="white"
      fill="hsl(30,90%,80%)"
      r="30"
    )
    circle(
      r="3"
      cx="20"
    )
    circle(
      r="3"
      cx="10"
    )
  circle(
    :cx="(actors[0].x + actors[1].x) * scene.width / 2"
    :cy="(actors[0].y + actors[1].y) * scene.height / 2"
    :r="midi.duration / 20 + 25"
    :fill="pitchColor(midi?.note?.number - 9)"
    :opacity="0.75 * midi?.note?.attack || 0"
  )
</template>

<route lang="yaml">
title: Floating
subtitle: by Chromatone 
</route>