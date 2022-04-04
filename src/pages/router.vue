<script setup>
import { useMidi } from "~/use/midi.js";
const { midi } = useMidi();

</script>

<template lang="pug">
.flex.flex-wrap.gap-4.justify-center.p-8
  midi-input(
    :input="input"
    :iid="iid"
    v-for="(input, iid) in midi.inputs" 
    :key="iid"
    )
</template>

<style lang="postcss" scoped>
</style>

<route lang="yaml">
title: Router
subtitle: by Chromatone 
</route>