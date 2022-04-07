<script setup>
import { midi } from '~/use/midi';
import { notes, pitchColor } from '~/use/chromatone';
import { useScene } from '~/use/scene';
const { width, height } = useScene()
</script>

<template lang='pug'>
g.stats(
  v-for="(dur, p) in midi.total.durations" :key="p"
  :transform="`translate(${p * width / 12})`"
  )
  rect(
    :x="0"
    :y="0"
    :height="height"
    :width="width / 12"
    :fill="pitchColor(p, 2)"
    :transform-origin="`${0} ${height}`"
    style="transition: all 200ms ease-out"
    :style="`transform: scale(1,${dur / midi.total.duration || 0})`"
  )
  text(
    :x="width / 24"
    :y="height - 20"
    text-anchor="middle"
    fill="currentColor"
  ) {{ notes[p] }}
</template>