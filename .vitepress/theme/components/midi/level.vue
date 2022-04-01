<script setup>
import { pitchColor } from '~/use/chromatone'
import { useMidi } from '~/use/midi.js'
const active = ref(false)

const { midi, midiAttack, midiRelease, setCC } = useMidi();

function sortNotes(notes) {
  if (!notes) return []
  let arr = Object.values(notes)
  return arr.sort((a, b) => {
    return a.number < b.number ? -1 : 1
  })
}
</script>

<template lang='pug'>
svg#visual.max-h-70vh(
  version="1.1",
  baseProfile="full",
  :viewBox="`0 0 1000 600`",
  xmlns="http://www.w3.org/2000/svg",
)
  rect(width="1000" height="1000" fill="#eeee")
  g.arrows.pointer-events-none.transition(
  )
    line(
      v-for="dot in 120" :key="dot"
      x1="500"
      x2="500"
      y1="20"
      y2="70"
      stroke-width="1"
      stroke="currentColor"
      stroke-linecap="cound"
      transform-origin="500 500"
      :style="{ transform: `rotate(${dot - 60}deg)` }"
    )
    line.transition(
      :x1="500"
      :y1="500"
      stroke-width="4"
      stroke="currentColor"
      stroke-linecap="cound"
      :x2="500"
      :y2="20"
      transform-origin="500 500"
      :style="{ transform: `rotate(${midi.note?.number * midi.note?.attack - 60}deg)` }"
    )
    circle.transition(
      :cx="500"
      :cy="500"
      :fill="midi.note?.attack > 0 ? 'yellow' : currentColor"
      :r="5"
      transform-origin="500 500"
      :style="{ transform: `scale(${midi.note?.attack * 10 + 1})` }"
    )
    //- text.transition(
    //-   text-anchor="middle"
    //-   x="500"
    //-   y="300"
    //-   font-size="4em"
    //-   ) {{ midi.note?.identifier || 'Play notes' }}
</template>