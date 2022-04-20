<script setup>
import { synthOptions } from '../../use/synth';

const octaves = [-2, -1, 0, 1, 2]
const modes = ['+0', '@16n', '@32n', '@8n']

function cycleOctaves() {
  let oct = octaves.findIndex(el => el == synthOptions.octave)
  synthOptions.octave = octaves[++oct % (octaves.length)]
}

function cycle() {
  let mode = modes.findIndex(el => el == synthOptions.quantize)
  synthOptions.quantize = modes[++mode % (modes.length)]
}


</script>

<template lang='pug'>
.flex.gap-4.absolute.flex-col.right-2.bottom-2.top-20.text-xl.items-center.opacity-40.hover_opacity-100.transition.justify-between.items-center
  .flex-0.flex.flex-col.gap-1
    state-fullscreen
    state-dark
    stats-button
  .flex-auto
  .flex-0.flex.flex-col.items-center.gap-2
    midi-state
    state-oscillator
    button.button.w-16.font-bold.select-none(
    @click="cycleOctaves()"
    aria-label="Synth panel"
    ) {{ synthOptions.octave > 0 ? '+' : '' }}{{ synthOptions.octave }}
    button.button.font-bold.text-sm.w-16.select-none(
      @click="cycle"
      aria-label="Synth panel"
      ) {{ synthOptions.quantize }}
</template>

<style lang="postcss" scoped>
nav button {
  @apply text-2xl;
}
</style>