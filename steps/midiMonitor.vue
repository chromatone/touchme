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
.flex.flex-col.w-full.flex-auto
  .flex.flex-col.flex-col-reverse.flex-wrap.max-h-70vh(v-for="ch in midi.channels", :key="ch.num")
    .p-4.transition(
      v-for="note in sortNotes(ch.notes)", 
      :key="note.number"
        :style="{ backgroundColor: pitchColor(note.pitch, note.octA - 1, note.velocity) }"
    ) {{ note.identifier }}
</template>