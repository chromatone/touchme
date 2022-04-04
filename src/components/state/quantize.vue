<script setup>
import { useSynth } from '~/use/synth'
const { synthOptions } = useSynth();

const modes = ['+0', '@16n', '@32n', '@8n']

let count = 0

function cycle() {
  count++
  synthOptions.quantize = modes[count % modes.length]
}

</script>

<template lang="pug">
button.button(
  @click="cycle"
  aria-label="Synth panel"
  ) Quantize {{ synthOptions.quantize }}
</template>

<style lang="postcss" scoped>
</style>