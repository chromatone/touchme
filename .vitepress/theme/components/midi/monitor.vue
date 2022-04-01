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
.flex.flex-wrap.max-h-70vh.gap-2.mb-8
  template(v-if="midi.channels?.[1] && Object.keys(midi.channels?.[1]?.notes).length > 0")
    .p-2.transition.font-bold.flex-1.border-4.rounded-xl.items-center.flex.flex-col(
      v-for="note in sortNotes(midi.channels?.[1]?.notes)", 
      :key="note.number"
        :style="{ order: note.number, borderColor: pitchColor(note.pitch, note.octA - 1, note.velocity) }"
    ) {{ note.identifier }} 
  template(v-else)
    .text-4xl.text-center.mt-10 Play some notes
</template>