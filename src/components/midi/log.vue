<script setup>
import { pitchColor } from '~/use/chromatone'
import { useMidi } from '~/use/midi.js'
import { Utilities } from 'webmidi'
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
.flex.flex-col.gap-1.mb-4.overflow-x-scroll.font-mono.pt-4
  transition-group(name="fall" mode="out-in")
    .flex.text-xs.fall.whitespace-nowrap.justify-between(v-for="ev in midi.log" :key="ev")
      .p-2(:style="{ backgroundColor: pitchColor(ev.message.dataBytes[0] + 3 || 0) }")
      .txt.whitespace-nowrap {{ Utilities.toNoteIdentifier(ev.message.dataBytes[0] || 1) }}
      .txt {{ ev.message?.type }}
      .txt {{ ((ev.message.dataBytes[1]) / 127).toFixed(2) }}
      .txt.text-center {{ ev.data.join(',') }}
      .txt.text-right CH{{ ev.message?.channel }}

      
</template>


<style lang="postcss" scoped>
.txt {
  @apply p-1;
  flex: 10 1 30px;
}
</style>

<route lang="yaml">
title: Log
subtitle: by Chromatone 
</route>