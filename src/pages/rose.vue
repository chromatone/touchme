<script setup>
import { midi } from '~/use/midi';
import { notes, pitchColor, getCircleCoord } from '~/use/chromatone';
import { useScene } from '~/use/scene';
const { width, height } = useScene()

const round = computed(() => new Array(12).fill(1).map((r, i) => getCircleCoord(i, 12, midi.total.notes[i] / midi.total.hits * width.value * 1.2 + 50, width.value, height.value)))

const lines = computed(() => {
  const active = round.value.filter(dot => dot.x && dot.y)
  const lines = active.map((dot, i) => {
    return { x1: dot.x, y1: dot.y, x2: active[i == (active.length - 1) ? 0 : i + 1].x, y2: active[i == (active.length - 1) ? 0 : i + 1].y }
  })
  return lines
})

</script>

<template lang='pug'>
g
  line(
    style="transition: all 500ms ease-out"
    v-for="(l, i) in 12" :key="l"
    :x1="width / 2"
    :x2="width / 2"
    :y1="height / 2"
    :y2="-height / 2"
    stroke-linecap="round"
    :stroke-width="midi?.note?.pitch == i && midi?.note?.attack ? 60 : 2"
    :stroke="pitchColor(i, 4)"
    :transform-origin="`${width / 2} ${height / 2}`"
    :transform="`rotate(${30 * i})`"
  )
  circle.mix-blend-multiply.dark_mix-blend-difference(
    style="transition: all 400ms ease-out"
    v-for="(coord, p) in round" :key="p"
    :cx="coord.x || width / 2"
    :r="10"
    :cy="coord.y || height / 2"
    :fill="pitchColor(p)"
    :transform-origin="`${coord.x} ${coord.y}`"
    :style="`transform: scale(${50 * midi.total.durations[p] / midi.total.duration})`"
  )
  line.mix-blend-difference(
    v-for="line in lines" :key="line"
    v-bind="line"
    stroke-width="2"
    stroke="currentColor"
  )
  circle(
    style="transition: all 200ms ease-out"
    :cx="width / 2"
    :cy="height / 2"
    :r="30"
    :fill="pitchColor(midi?.note?.pitch, 3, midi?.note?.attack)"
  )
</template>
