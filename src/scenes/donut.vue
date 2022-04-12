<script setup>
//https://css-tricks.com/building-a-donut-chart-with-vue-and-svg/
import { pitchColor } from "~/use/chromatone";
import { midi } from "~/use/midi.js";
import { useScene } from "~/use/scene";
const { width, height } = useScene();

const radius = computed(() => width.value / 3);
const circ = computed(() => 2 * Math.PI * radius.value);

const totalDur = computed(() => midi.total.durations.reduce((acc, val) => acc + val));

function getOffset(val) {
  return circ.value - (circ.value * val) / totalDur.value;
}

const chart = computed(() => {
  let angle = -90;
  const arr = [];
  midi.total.durations.forEach((val, i) => {
    arr.push(angle);
    angle = (360 * val) / totalDur.value + angle;
  });
  return arr;
});
</script>

<template lang="pug">
g.donut
  g(v-for="(value, index) in midi.total.durations")
    circle(
      style="transition: all 500ms ease-out"
      :cx="width / 2", 
      :cy="height / 2", 
      :r="(height < width ? height / 4 : width / 4)", 
      fill="transparent", 
      :stroke="pitchColor(index)", 
      :stroke-width="width / 4"
      :stroke-dasharray="circ"
      :stroke-dashoffset="getOffset(value)"
      :transform-origin="`${width / 2} ${height / 2}`"
      :transform="`rotate(${chart[index] || 0})`"
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
    font-size="24"
  ) {{ midi?.note?.identifier }}
</template>
