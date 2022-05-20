<script setup>
import { synthOptions } from '~/use/synth';

const bpms = [60, 80, 100, 120]

function cycle() {
  let index = bpms.findIndex(el => el == synthOptions.bpm)
  synthOptions.bpm = bpms[++index % bpms.length]
}

</script>

<template lang='pug'>
button.button.relative(@click="cycle()")
  .-mt-3.mb-1.font-bold {{ synthOptions.bpm }}
  .absolute.bottom-1.text-xs BPM
</template>