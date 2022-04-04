<script setup>
import { pitchColor } from '~/use/chromatone'
import { useMidi } from '~/use/midi.js'
import { useElementBounding, useRafFn } from "@vueuse/core";
import SimplexNoise from 'simplex-noise';


const scene = reactive({
  width: 1000,
  height: 1000,
})

onMounted(() => {
  const content = document.getElementById('content')
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
svg#visual(
  version="1.1",
  baseProfile="full",
  :viewBox="`0 0  ${scene.width} ${scene.height}`",
  xmlns="http://www.w3.org/2000/svg",
)
  rect(
    opacity="0.01"
    :width="scene.width"
    :height="scene.height"
  )
  line(
    style="transition: stroke-width 0.2s ease-out;"
    :stroke-width="midi?.note?.number * midi?.note?.velocity / 200"
    :stroke="pitchColor(midi?.note?.number - 21)"
    :x1="actors[0].x * scene.width"
    :x2="actors[1].x * scene.width"
    :y1="actors[0].y * scene.height"
    :y2="actors[1].y * scene.height"
  )
  g(
    v-for="actor in actors" :key="actor"
    :transform="`translate(${actor.x * scene.width},${actor.y * scene.height}) rotate(${actor.angle * 360})`"
    )

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
</template>