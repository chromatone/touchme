<script setup>
import { synthOptions } from '~/use/synth'

const types = {
  sine: 'SIN',
  triangle: 'TRI',
  square8: 'SQR',
  sawtooth8: 'SAW',
}



</script>

<template lang='pug'>
.flex.flex-wrap.justify-center.max-w-max
  .flex-auto.w-full.text-sm.text-center.border-b-1.border-dark-300.dark_border-light-300 OSCILLATOR TYPE
  .flex.relative.flex-auto.gap-2(v-for="(abbr, type) in types" :key="type")
    input.absolute.right-1.top-1.z-10(
      type="radio" v-model="synthOptions.params.oscillator.type" 
      @input="$emit('update:modelValue', type)"
      :id="type"
      :value="type"
      name="OSC" 
      :aria-label="`Select ${type} oscillator`"
      )
    label.button.flex-auto.flex.justify-center.m-1(
      :for="type" 
      :value="type"
      :class="{ active: synthOptions.params.oscillator.type == type }"
    )
      icon-ph-wave-sine-duotone(v-if="type == 'sine'")
      icon-ph-wave-triangle-duotone(v-if="type == 'triangle'")
      icon-ph-wave-square-duotone(v-if="type == 'square8'")
      icon-ph-wave-sawtooth-duotone(v-if="type == 'sawtooth8'")
</template>

<style lang="postcss" scoped>
</style>