<script setup>
import { pitchColor } from '~/use/chromatone'
import { useMidi } from '~/use/midi.js'
import { useElementBounding, useRafFn } from "@vueuse/core";
import SimplexNoise from 'simplex-noise';

import { useScene } from '~/use/scene';
const { width, height } = useScene()


const { midi } = useMidi();

const simplex = new SimplexNoise();

function useActor() {
  const actor = reactive({
    x: 100,
    y: 100,
    angle: 0,
  })
  const count = ref(0)

  const initial = Math.random()

  const { pause, resume } = useRafFn(() => {
    count.value++
    actor.x = (simplex.noise2D(initial * 100, count.value / 2000) + 1) / 2;
    actor.y = (simplex.noise2D(initial * 200, count.value / 2000) + 1) / 2;
    actor.angle = (simplex.noise2D(initial * 300, count.value / 2000) + 1) / 2;
  })
  return actor
}

const actors = reactive([])

actors.push(useActor())
actors.push(useActor())


</script>

<template lang='pug'>

svg#visual.h-full(
  version="1.1",
  baseProfile="full",
  :viewBox="`0 0  ${width} ${height}`",
  xmlns="http://www.w3.org/2000/svg",
)
  defs
    filter#blur(x="-300%" y="-300%" width="600%" height="600%")
      feGaussianBlur(in="SourceGraphic" stdDeviation="50")
  rect(
    opacity="0.1"
    :width="width"
    :height="height"
  )
  line(
    style="transition: stroke-width 0.2s ease-out;"
    :stroke-width="midi?.note?.number * midi?.note?.velocity / 200 * midi.duration / 100"
    :stroke="pitchColor(midi?.note?.number - 21)"
    stroke-linecap="round"
    :x1="actors[0].x * width"
    :x2="actors[1].x * width"
    :y1="actors[0].y * height"
    :y2="actors[1].y * height"
  )

  g(
    style="transition: transform 0.1s ease-out;"
    v-for="actor in actors" :key="actor"
    :style="`transform: translate(${actor.x * width}px,${actor.y * height}px) rotate(${actor.angle * 360}deg) scale(${midi.duration / 1000 + 1})`"
    )
    //- circle(
    //-   opacity="0.5"
    //-   r="40"
    //-   filter="url(#blur)"
    //- )
    circle(
      stroke-width="2"
      stroke="white"
      fill="hsl(30,90%,80%)"
      r="30"
    )
    circle(
      r="3"
      cx="20"
    )
    circle(
      r="3"
      cx="10"
    )
  circle(
    :cx="(actors[0].x + actors[1].x) * width / 2"
    :cy="(actors[0].y + actors[1].y) * height / 2"
    :r="midi.duration / 20 + 25"
    :fill="pitchColor(midi?.note?.number - 9)"
    :opacity="0.75 * midi?.note?.attack || 0"
  )
</template>

<route lang="yaml">
title: Floating
subtitle: by Chromatone 
</route>