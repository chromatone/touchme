<script setup>
import { useSynth } from '~/use/synth'
const { synthOptions, synthOnce, init } = useSynth();
</script>

<template lang="pug">
button.icon(
  @click.stop.prevent="synthOnce(); !synthOptions.initiated && init()"
  aria-label="Synth panel"
  )
  la-wave-square
</template>

<style lang="postcss" scoped>
</style>