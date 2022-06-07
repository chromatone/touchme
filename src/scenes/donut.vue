<script setup>
//https://css-tricks.com/building-a-donut-chart-with-vue-and-svg/
import { pitchColor } from "~/use/chromatone";
import { midi } from "~/use/midi.js";
import { useScene } from "~/use/scene";
const { width, height } = useScene();

const radius = computed(() => (height.value < width.value ? height.value / 2 : width.value / 2) - 20);
const len = computed(() => 2 * Math.PI * radius.value);

const totalDur = computed(() => midi.total.durations.reduce((acc, val) => acc + val) || 1);

const parts = computed(() => midi.total.durations.map(el => (el / totalDur.value)))
const sum = computed(() => {
  let s = 0
  const arr = [0];
  parts.value.forEach(part => {
    s += Number(part)
    arr.push(s)
  })
  return arr
})

</script>

<template lang="pug">
g.donut 

  g(v-for="(value, index) in parts")
    scene-ring(
      style="transition: all 500ms ease-out"
      :cx="width / 2", 
      :cy="height / 2", 
      :radius="radius",
      :fill="pitchColor(index)", 
      :from="sum[index] * 360"
      :to="(sum[index] + parts[index]) * 360"
      :thickness="width / 3"
      )
  circle(
    style="transition: all 200ms ease-out"
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
