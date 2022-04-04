<script setup>
import { useSynth } from '~/use/synth'
import { onClickOutside } from '@vueuse/core'

const open = ref(false);

const panel = ref()

function toggle(ev) {
  open.value = !open.value
}

onClickOutside(panel, (ev) => {
  // if (open.value) ev.stopPropagation()
  open.value = false
})

const { synthOptions, synthOnce, init } = useSynth();
</script>

<template lang="pug">

.panel
  button.text-button.mute.p-2.flex.flex-col.items-center(
    :class="{ active: synthOptions.initiated }"
    @click="synthOnce()" 
    aria-label="Test synth sound"
    )
    la-wave-square.text-4xl
  synth-oscillators.flex-1(v-model="synthOptions.params.oscillator.type")
  .flex-auto.flex.gap-2
    state-quantize
    state-octave
</template>

<style lang="postcss" scoped>
.mute {
  font-size: 1.1em;
}

.panel {
  @apply p-4 m-4 bg-light-300 dark_bg-dark-300 z-20 flex flex-col bg-opacity-90 dark_bg-opacity-90 flex items-center shadow-lg;
}
</style>


<route lang="yaml">
title: Synth
subtitle: by Chromatone 
</route>