<script setup>
//https://css-tricks.com/building-a-donut-chart-with-vue-and-svg/
import { pitchColor } from "~/use/chromatone";
import { midi } from "~/use/midi.js";
import { useScene } from "~/use/scene";
const { width, height } = useScene();

const radius = computed(() => (height.value < width.value ? height.value / 2 : width.value / 2) - 20);
const len = computed(() => 2 * Math.PI * radius.value);

const totalDur = computed(() => midi.total.durations.reduce((acc, val) => acc + val) || 1);

// Only include pitches that have actual duration data
const segments = computed(() => {
  return midi.total.durations
    .map((dur, index) => ({ dur, index }))
    .filter(seg => seg.dur > 0)
    .map(seg => ({
      index: seg.index,
      part: seg.dur / totalDur.value
    }))
})

const sum = computed(() => {
  let s = 0
  const arr = [0];
  segments.value.forEach(seg => {
    s += seg.part
    arr.push(s)
  })
  return arr
})

</script>

<template lang="pug">
g.donut

  g(v-for="(seg, i) in segments" :key="seg.index")
    scene-ring(
      :cx="width / 2",
      :cy="height / 2",
      :radius="radius",
      :fill="pitchColor(seg.index)",
      :from="sum[i] * 360"
      :to="(sum[i] + seg.part) * 360"
      :thickness="radius * 0.8"
      )
  circle(
    :cx="width / 2"
    :cy="height / 2"
    :r="30"
    opacity="0.9"
    :transform="`scale(${midi?.note?.attack * midi.duration / 500 + 1 || 1})`"
    :transform-origin="`${width / 2} ${height / 2}`"
    :fill="pitchColor(midi?.note?.pitch, 3, midi?.note?.attack)"
  )
  text(
    :x="width / 2"
    :y="height / 2 + 8"
    text-anchor="middle"
    font-size="14"
  ) {{ midi?.note?.identifier }}
</template>
