<script setup>
import { midi } from '~/use/midi';
import { notes, pitchColor } from '~/use/chromatone';
import { useScene } from '~/use/scene';
const { width, height } = useScene()
</script>

<template lang='pug'>
g.cross
  rect(
    style="transition: all 300ms ease-in-out"
    :x="width / 2 - 50"
    :y="0"
    :height="height"
    :width="100"
    :style="`transform: scale(${midi.duration / 60}, 1)`"
    :transform-origin="`${width / 2} ${0}`"
    :fill="pitchColor(midi?.note?.pitch - 24 + 7)"
  )
  line.mix-blend-multiply.dark-mix-blend-difference(
    style="transition: all 300ms ease-in-out"
    :x1="0"
    :x2="width"
    :y1="0"
    :y2="0"
    :stroke="pitchColor(midi?.note?.pitch)"
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
    :r="60"
    :fill="pitchColor((num + 3) % 12)"
    :opacity="midi?.note?.number == num ? 0.9 : 0"
    :style="`transform: scale(${midi?.note?.number == num ? midi.duration / 50 : 1})`"
  )

  rect.mix-blend-exclusion(
    style="transition: all 100ms ease-in-out"
    fill="white"
    opacity="0.1"
    :x="0"
    :y="0"
    :transform-origin="`${0} ${height}`"
    :style="`transform: scale(1,${midi.total.duration / (midi.time)})`"
    :width="width"
    :height="height"
  )
</template>