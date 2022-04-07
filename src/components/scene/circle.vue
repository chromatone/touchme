<script setup>
import { midi } from '~/use/midi';
import { notes, pitchColor, getCircleCoord } from '~/use/chromatone';
import { useScene } from '~/use/scene';
const { width, height } = useScene()

const round = computed(() => new Array(12).fill(1).map((r, i) => getCircleCoord(i, 12, width.value / 3, width.value, height.value)))
</script>

<template lang='pug'>
g
  circle.mix-blend-multiply.dark_mix-blend-difference(
    style="transition: all 400ms ease-in-out"
    v-for="(coord, p) in round" :key="p"
    :cx="coord.x"
    :r="10"
    :cy="coord.y"
    :fill="pitchColor(p)"
    :transform-origin="`${coord.x} ${coord.y}`"
    :style="`transform: scale(${midi.total.hits[p] / 5})`"
    )
</template>