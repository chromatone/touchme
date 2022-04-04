<script setup>
import { init, synthOptions } from '~/use/synth'
const started = ref(false)

</script>

<template lang='pug'>
.absolute.z-500.p-4.rounded-full.text-2xl.bg-light-200.mx-auto(
  style="left: 50%; top: 50%; transform: translate(-50%, -50%);"
  @click="init(); started = true"
  v-if="!started"
  ) Start
</template>