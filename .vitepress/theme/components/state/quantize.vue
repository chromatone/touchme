<script setup>
import { useSynth } from '~/use/synth'
const { synthOptions } = useSynth();

const modes = ['@16n', '@32n', '@8n', '+0']

let count = 0

function cycle() {
  count++
  synthOptions.quantize = modes[count % modes.length]
  console.log(modes[count % modes.length])
}

</script>

<template lang="pug">
button.icon(
  @click="cycle"
  aria-label="Synth panel"
  ) {{ synthOptions.quantize }}
</template>

<style lang="postcss" scoped>
</style>