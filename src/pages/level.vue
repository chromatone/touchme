<script setup>
import { pitchColor } from '~/use/chromatone'
import { useMidi } from '~/use/midi.js'
import { useElementBounding, useRafFn } from "@vueuse/core";


const scene = reactive({
  width: 1000,
  height: 1000,
})

onMounted(() => {
  const content = document.getElementById('app')
  Object.assign(scene, useElementBounding(content))
})


const active = ref(false)

const { midi, midiAttack, midiRelease, setCC } = useMidi();

function sortNotes(notes) {
  if (!notes) return []
  let arr = Object.values(notes)
  return arr.sort((a, b) => {
    return a.number < b.number ? -1 : 1
  })
}

const center = computed(() => {
  return {
    x: scene.width / 2,
    y: scene.height / 2
  }
})
</script>

<template lang='pug'>
svg#visual(
  version="1.1",
  baseProfile="full",
  :viewBox="`0 0  ${scene.width} ${scene.height}`",
  xmlns="http://www.w3.org/2000/svg",
)
  g.arrows.pointer-events-none.transition(
  )
    line(
      v-for="dot in 120" :key="dot"
      :x1="center.x"
      :x2="center.x"
      y1="20"
      y2="70"
      stroke-width="1"
      stroke="currentColor"
      stroke-linecap="round"
      :transform-origin="`${center.x} ${center.y}`"
      :style="{ transform: `rotate(${dot - 60}deg)` }"
    )
    line.transition(
      :x1="center.x"
      :y1="center.y"
      stroke-width="4"
      stroke="currentColor"
      stroke-linecap="cound"
      :x2="center.x"
      :y2="20"
      :transform-origin="`${center.x} ${center.y}`"
      :style="{ transform: `rotate(${midi.note?.number * midi.note?.attack - 60}deg)` }"
    )
    circle.transition(
      :cx="center.x"
      :cy="center.y"
      :fill="midi.note?.attack > 0 ? pitchColor((midi.note?.number - 9) % 12) : 'currentColor'"
      :r="5"
      :transform-origin="`${center.x} ${center.y}`"
      :style="{ transform: `scale(${midi.note?.attack * 10 + 1})` }"
    )
    g(
      :fill="midi.note?.attack > 0 ? pitchColor((midi.note?.number - 9) % 12) : 'currentColor'"
    )
      text.transition.font-bold(
        text-anchor="middle"
        alignment-baseline="central"

        :x="center.x"
        :y="center.y * 1.5"
        font-size="4em"
        :transform-origin="`${center.x} ${center.y * 1.5}`"
        :transform="`scale(${midi?.note?.attack || 0})`"
        ) {{ midi.note?.identifier || '' }} 
      rect(
        :width="scene.width / 2"
        :x="center.x - scene.width / 4"
        :y="center.y * 1.6"
        :height="20"
        :transform-origin="`${center.x} ${center.y * 1.5}`"
        :transform="`scale(${midi.duration / 2000} 1)`"
      )
</template>

<route lang="yaml">
title: Electric
subtitle: by Chromatone 
</route>