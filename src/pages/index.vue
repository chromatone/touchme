<script setup>
import { pitchColor, getCircleCoord, notes } from '~/use/chromatone'
import { useMidi } from '~/use/midi.js'
import { useElementBounding, useRafFn } from "@vueuse/core";
import SimplexNoise from 'simplex-noise';

const visual = ref()
const { width, height } = useElementBounding(visual)

const { midi } = useMidi();

const round = computed(() => new Array(12).fill(1).map((r, i) => getCircleCoord(i, 12, width.value / 3, width.value, height.value)))

</script>

<template lang='pug'>

svg#visual.h-full(
  ref="visual"
  version="1.1",
  baseProfile="full",
  :viewBox="`0 0  ${width} ${height}`",
  xmlns="http://www.w3.org/2000/svg",

)
  defs
    filter#blur(x="-300%" y="-300%" width="600%" height="600%")
      feGaussianBlur(in="SourceGraphic" stdDeviation="50")
    filter#gray(x="-20%", y="-20%", width="140%", height="140%", filterunits="objectBoundingBox", primitiveunits="userSpaceOnUse", color-interpolation-filters="linearRGB")
      feColorMatrix(type="saturate", values="0", in="SourceGraphic", result="colormatrix").
  rect(
    opacity="0.1"
    :width="width"
    :height="height"
  )
  //- g
  //-   circle.mix-blend-multiply.dark_mix-blend-difference(
  //-     style="transition: all 400ms ease-in-out"
  //-     v-for="(coord, p) in round" :key="p"
  //-     :cx="coord.x"
  //-     :r="10"
  //-     :cy="coord.y"
  //-     :fill="pitchColor(p)"
  //-     :transform-origin="`${coord.x} ${coord.y}`"
  //-     :style="`transform: scale(${midi.total.hits[p] / 5})`"
  //-   )

  g.grid(v-for="(m, o) in 10" :key="m")
    rect(
      style="transition: all 300ms ease-out"
      v-for="(n, i) in 12" :key="i"
      :x="i * width / 12"
      :y="height - height / 9 * o"
      :width="width / 12"
      :height="height / 9"
      :transform-origin="`${width / 12} ${height - height / 9 * (o - 0.5)}`"
      :style="`transform: scale(1,${(n - 4 + m * 12) == midi?.note?.number && midi?.note?.attack ? midi?.duration / 300 + 1 : 1})`"
      :fill="pitchColor(i, 3, 1, (n - 4 + m * 12) == midi?.note?.number && midi?.note?.attack ? 1 : 0)"

    )

  g.cross
    rect(
      style="transition: all 300ms ease-in-out"
      :x="width / 2 - 50"
      :y="0"
      :height="height"
      :width="100"
      :style="`transform: scale(${midi.duration / 500}, 1)`"
      :transform-origin="`${width / 2} ${0}`"
      :fill="pitchColor(midi?.note?.pitch - 24)"
    )
    line.mix-blend-multiply.dark_mix-blend-difference(
      style="transition: all 300ms ease-in-out"
      :x1="0"
      :x2="width"
      :y1="0"
      :y2="0"
      :stroke="pitchColor(midi?.note?.pitch)"
      :stroke-width="midi.duration / 5"
      :transform-origin="`${width / 2} ${0}`"
      :style="`transform: translateY(${(127 - midi?.note?.number) / 127 * height || 0}px)`"
    )
    circle(
      style="transition: all 300ms ease-in-out"
      v-for="num in 127" :key="num"
      :cx="width / 2"
      :cy="(127 - num) / 127 * height || 0"
      :transform-origin="`${width / 2} ${(127 - num) / 127 * height || 0}`"
      :r="10"
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
      :style="`transform: scale(1,${midi.total.duration / midi.time})`"
      :width="width"
      :height="height"
    )




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



  g.text-overlay
    text(
      fill="currentColor"
      :x="30"
      :y="30"
    ) {{ midi?.total?.hits }} 
    g(@click="midi.total.reset()")
      circle(cx="18" cy="22" r="14" fill="transparent")
      ic-baseline-refresh(
        x="8"
        y="12"
      )
    text(
      text-anchor="middle"
      fill="currentColor"
      :x="width / 2"
      :y="30"
    ) {{ midi?.note?.identifier }}
    text(
      fill="currentColor"
      :x="width - 10"
      :y="30"
      text-anchor="end"
    ) {{ (midi?.total?.duration / 1000).toFixed() }} / {{ (midi.time / 1000).toFixed() }}s
</template>

<route lang="yaml">
title: Experience
subtitle: by Chromatone 
</route>