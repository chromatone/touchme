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
  circle.center(
    style="transition: all 400ms ease-out;"
    :cx="width / 2"
    :cy="height / 2"
    :fill="midi.note?.attack > 0 ? pitchColor((midi.note?.number - 9) % 12) : 'currentColor'"
    :r="5"
    :transform-origin="`${width / 2} ${height / 2}`"
    :style="{ transform: `scale(${midi.note?.attack * midi.duration / 20 + 1})` }"
  )
  g.ticks
    g(
      v-for="dot in 120" :key="dot" 
      :transform-origin="`${width / 2} ${height / 2}`"
      :style="{ transform: `rotate(${dot - 60}deg)` }"
    )
      line(
        style="transition: all 400ms ease-out;"
        :x1="width / 2"
        :x2="width / 2"
        :y1="10"
        :y2="100"
        :stroke-width="midi.note?.number == dot && midi.note?.attack ? 50 * (1 + midi.duration / 1000) : 2"
        :stroke="midi.note?.number == dot && midi.note?.attack ? pitchColor((dot + 3) % 12) : 'currentColor'"
        stroke-linecap="round"
        :transform-origin="`${width / 2} ${height / 2}`"
        :transform="`rotate(${dot * midi.time / 50000}) scale(${1 - (dot / 120) * midi.time / 1000000})`"
      )
  line.arrow(
    style="transition: all 400ms ease-out;"
    :x1="width / 2"
    :y1="height / 2"
    stroke-width="4"
    stroke="currentColor"
    stroke-linecap="round"
    :x2="width / 2"
    :y2="20"
    :transform-origin="`${width / 2} ${height / 2}`"
    :style="{ transform: `rotate(${(midi.note?.number * midi.note?.attack) * (1 + midi.time / 50000) - 60}deg)` }"
  )

  //- g(
    :fill="midi.note?.attack > 0 ? pitchColor((midi.note?.number - 9) % 12) : 'currentColor'"
    )
    text.transition(
      text-anchor="middle"
      alignment-baseline="central"
      fill="currentColor"
      :x="width / 2"
      :y="height / 2 * 1.2"
      font-size="4em"
      :transform-origin="`${width / 2} ${height / 2 * 1.5}`"
      :transform="`scale(${midi?.note?.attack || 0})`"
      ) {{ midi.note?.identifier || '' }}
    //- rect(
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