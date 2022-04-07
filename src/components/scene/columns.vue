<script setup>
import { midi } from '~/use/midi';
import { notes, pitchColor } from '~/use/chromatone';
import { useScene } from '~/use/scene';
const { width, height } = useScene()
</script>

<template lang='pug'>
g.stats

  g.grid
    g.note(v-for="(m, o) in 10" :key="m")
      rect(
        style="transition: all 300ms ease-out"
        v-for="(n, i) in 12" :key="i"
        :x="i * width / 12"
        :y="height - height / 9 * o"
        :width="width / 12"
        :height="height / 9"
        :transform-origin="`${width / 12} ${height - height / 9 * (o - 0.5)}`"
        :style="`transform: scale(1,${(n - 4 + m * 12) == midi?.note?.number && midi?.note?.attack ? midi?.duration / 300 + 1 : 1})`"
        :fill="pitchColor(i + 12 * n, 3, 1, (n - 4 + m * 12) == midi?.note?.number && midi?.note?.attack ? 1 : 0.05)"
      )
  g.stat(
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