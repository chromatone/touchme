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
.flex.flex-col.max-h-60vh.gap-1.mb-8.overflow-x-scroll.p-4.font-mono.whitespace-nowrap
  transition-group(name="fall" mode="out-in")
    .flex.flex-wrap.bg-light-400.text-sm(v-for="ev in midi.log" :key="ev")
      .p-1.flex-1 {{ ev.data }}
      .p-1.flex-1 CH {{ ev.message?.channel }}
      .p-1.flex-1 {{ ev.message?.type }}
      .p-1.flex-1.whitespace-nowrap  {{ Utilities.toNoteIdentifier(ev.message.dataBytes[0] || 1) }}
      .p-1 {{ ((ev.message.dataBytes[1]) / 127).toFixed(2) }}
</template>


<style lang="postcss" scoped>
.layer {
  @apply bg-light-200 dark_bg-dark-900 rounded-xl;
  backdrop-filter: blur(30px);
}

input.ch {
  @apply pl-2 w-2.5em bg-transparent;
}

.button {
  @apply p-2 m-2 border flex items-center rounded cursor-pointer select-none;
}
.button.active {
  @apply opacity-100;
}
</style>