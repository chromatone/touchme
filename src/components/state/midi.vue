<script setup>
import { useMidi } from '~/use/midi'
import { pitchColor } from '~/use/chromatone'
import { onClickOutside } from '@vueuse/core'


const panel = useStorage('global-midi-panel', false)
const target = ref(null)
onClickOutside(target, () => {
  panel.value = false
})

const { midi } = useMidi();
</script>

<template lang="pug">
button(@click.stop="panel = !panel" aria-label="Toggle MIDI panel")
  icon-mdi-midi-input.transition-all.duration-200(
    :style=`{ opacity: midi.enabled ? 1 : 0.2, color: pitchColor(midi.enabled ? midi.note?.pitch : 0, midi.note?.octA) }`
  )
  transition(name="panel")
    midi-panel.panel(v-if="panel" ref="target")
</template>

<style lang="postcss" scoped>
.panel {
  @apply min-w-70 absolute right-0 top-0 w-full;
}
</style>