<script setup>
import { computed } from 'vue';
import { useSynth } from '~/use/synth'
import { midi } from '~/use/midi';

const types = {
  sine: 'SIN',
  triangle: 'TRI',
  square8: 'SQR',
  sawtooth8: 'SAW',
}

function cycle() {
  let arr = Object.keys(types)
  let index = arr.findIndex(el => el == synthOptions.params.oscillator.type)
  synthOptions.params.oscillator.type = arr[++index % arr.length]
}

const type = computed(() => synthOptions.params.oscillator.type)

const { synthOptions, synthOnce, init } = useSynth();


</script>

<template lang='pug'>
.button.flex-auto.flex.justify-center.m-1.cursor-pointer(@click="cycle(); synthOnce(midi?.note?.identifier); !synthOptions.initiated && init(); ")
  icon-ph-wave-sine-duotone(v-if="type == 'sine'")
  icon-ph-wave-triangle-duotone(v-if="type == 'triangle'")
  icon-ph-wave-square-duotone(v-if="type == 'square8'")
  icon-ph-wave-sawtooth-duotone(v-if="type == 'sawtooth8'")
</template>

<style lang="postcss" scoped>
</style>