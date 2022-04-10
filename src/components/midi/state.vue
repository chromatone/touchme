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
.p-0
  button.button.text-2xl(@click.stop="panel = !panel" aria-label="Toggle MIDI panel")
    icon-mdi-midi-input.transition-all.duration-200(
      :style=`{ opacity: midi.enabled ? 1 : 0.2, color: pitchColor(midi.enabled ? midi.note?.pitch : 0, midi.note?.octA) }`
    )
  transition(name="fade")
    .panel(v-if="panel" ref="target")
      .button.cursor-pointer.p-1.absolute.top-4.right-4.z-100(@click="panel = false")
        icon-la-times
      midi-panel
</template>

<style lang="postcss" scoped>
</style>