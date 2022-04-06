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

const visual = ref()
const { width, height } = useElementBounding(visual)

const { midi } = useMidi();

const circles = [
  { cx: Math.random(), cy: Math.random() },
]

</script>

<template lang='pug'>

svg#visual.h-full(
  ref="visual"
  version="1.1",
  baseProfile="full",
  :viewBox="`0 0  ${width} ${height}`",
  xmlns="http://www.w3.org/2000/svg",
)
  defs
    filter#blur(x="-300%" y="-300%" width="600%" height="600%")
      feGaussianBlur(in="SourceGraphic" stdDeviation="50")
  rect(
    opacity="0.1"
    :width="width"
    :height="height"
  )
  rect(
    :x="width / 2"
    :y="127 / midi?.note?.number * height || height / 2"
    :width="midi.duration / 5"
    :height="100"
    :fill="pitchColor(midi?.note?.pitch)"
  )
  rect(
    style="transition: all 300ms ease-in-out"
    :x="width / 2 - 50"
    :y="0"
    :height="height"
    :width="100"
    :style="`transform: scale(${midi.duration / 500}, 1)`"
    :transform-origin="`${width / 2} ${0}`"
    :fill="pitchColor(midi?.note?.pitch - 24)"
  )
  line(
    style="transition: all 300ms ease-in-out"
    :x1="0"
    :x2="width"
    :y1="0"
    :y2="0"
    :stroke="pitchColor(midi?.note?.pitch - 12)"
    :stroke-width="midi.duration"
    :transform-origin="`${width / 2} ${0}`"
    :style="`transform: translateY(${(127 - midi?.note?.number) / 127 * height || 0}px)`"
  )
  circle(
    style="transition: all 300ms ease-in-out"
    v-for="num in 127" :key="num"
    :cx="width / 2"
    :cy="(127 - num) / 127 * height || 0"
    :transform-origin="`${width / 2} ${(127 - num) / 127 * height || 0}`"
    :r="30"
    :fill="pitchColor((num + 3) % 12)"
    :opacity="midi?.note?.number == num ? 1 : 0"
    :style="`transform: scale(${midi?.note?.number == num ? midi.duration / 50 : 1})`"
  )

</template>

<route lang="yaml">
title: Experience
subtitle: by Chromatone 
</route>