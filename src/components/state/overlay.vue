<script setup>

import { synthOptions, useSynth } from '~/use/synth';

const octaves = [-2, -1, 0, 1, 2]
const modes = ['+0', '@4n', '@8n', '@16n', '@32n']

const { synthReleaseAll } = useSynth()

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
    state-fullscreen(v-tooltip.left="'Toggle fullscreen mode'")
    state-dark(v-tooltip.left="'Toggle dark mode'")
    stats-button(v-tooltip.left="'App statistics'")
    midi-state(v-tooltip.left="'MIDI state'")
  .flex-auto
  .flex-0.flex.flex-col.items-center.gap-2

    state-oscillator(v-tooltip.left="'Synth oscillator type'")
    button.button.w-16.font-bold.select-none(
    @click="cycleOctaves()"
    aria-label="Octave offset"
    v-tooltip.left="'Octave offset'"
    ) {{ synthOptions.octave > 0 ? '+' : '' }}{{ synthOptions.octave }}
    button.button.font-bold.text-sm.w-16.select-none(
      @click="cycle"
      aria-label="Synth quantize"
      v-tooltip.left="'Synth quantize'"
      ) {{ synthOptions.quantize }}
    state-bpm(v-tooltip.left="'Increment tempo'")
    button.button.w-16(@click="synthReleaseAll('+1n')" v-tooltip.left="'Turn off all synth voices'")
      icon-la-times-circle
</template>

<style lang="postcss" scoped>
nav button {
  @apply text-2xl;
}
</style>