<script setup>
import { pitchColor } from '~/use/chromatone'
import { useMidi } from '~/use/midi.js'
import { useScene } from '~/use/scene';
const { width, height } = useScene()


const { midi, } = useMidi();

const time = computed(() => (midi.time / 1000).toFixed())

</script>

<template lang='pug'>
g.arrows.pointer-events-none.transition(transform="translate(0 40)")
  g.ticks
    g(
      v-for="dot in 120" :key="dot" 
      :transform-origin="`${width / 2} ${height / 2}`"
      :style="{ transform: `rotate(${dot - 60}deg)` }"
    )
      line(
        :x1="width / 2"
        :x2="width / 2"
        :y1="10"
        :y2="70"
        :stroke-width="midi.note?.number == dot && midi.note?.attack ? (2 + 50 * midi.duration / 1000) : 2"
        :stroke="midi.note?.number == dot && midi.note?.attack ? pitchColor((dot + 3) % 12) : 'currentColor'"
        stroke-linecap="round"
      )
  line.arrow.transition(
    :x1="width / 2"
    :y1="height / 2"
    stroke-width="4"
    stroke="currentColor"
    stroke-linecap="round"
    :x2="width / 2"
    :y2="20"
    :transform-origin="`${width / 2} ${height / 2}`"
    :style="{ transform: `rotate(${midi.note?.number - 60}deg)` }"
  )
  circle.center.transition(
    :cx="width / 2"
    :cy="height / 2"
    :fill="midi.note?.attack > 0 ? pitchColor((midi.note?.number - 9) % 12) : 'currentColor'"
    :r="5"
    :transform-origin="`${width / 2} ${height / 2}`"
    :style="{ transform: `scale(${midi.note?.attack * 10 + 1})` }"
  )
  g(
    :fill="midi.note?.attack > 0 ? pitchColor((midi.note?.number - 9) % 12) : 'currentColor'"
  )
    text.transition.font-bold(
      text-anchor="middle"
      alignment-baseline="central"

      :x="width / 2"
      :y="height / 2 * 1.5"
      font-size="4em"
      :transform-origin="`${width / 2} ${height / 2 * 1.5}`"
      :transform="`scale(${midi?.note?.attack || 0})`"
      ) {{ midi.note?.identifier || '' }} 
    rect(
      :width="width / 2"
      :x="width / 2 - width / 4"
      :y="height / 2 * 1.6"
      :height="300"
      :transform-origin="`${width / 2} ${height / 2 * 1.5}`"
      :transform="`scale(${midi.duration / 2000} 1)`"
    )
</template>

<route lang="yaml">
title: Electric
subtitle: by Chromatone 
</route>