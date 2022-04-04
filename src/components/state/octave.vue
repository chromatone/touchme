<script setup>
import { useSynth } from '~/use/synth'
const { synthOptions } = useSynth();

const modes = [-2, -1, 0, 1, 2]

let count = 0

function cycle() {
  count++
  synthOptions.octave = modes[count % modes.length]

}

</script>

<template lang="pug">
button.icon(
  @click="cycle()"
  aria-label="Synth panel"
  ) {{ synthOptions.octave }}
</template>

<style lang="postcss" scoped>
</style>