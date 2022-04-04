<script setup>
import { midi } from '~/use/midi'
</script>

<template lang='pug'>
midi-keys(:pitch="(midi?.note?.number + 3) % 12" )
</template>


<route lang="yaml">
title: Keys
subtitle: by Chromatone 
</route>