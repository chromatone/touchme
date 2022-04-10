<script setup>
import { midi } from '~/use/midi';
import { useScene } from '~/use/scene';
const { width, height } = useScene()
</script>

<template lang='pug'>

g.text-overlay
  text(
    fill="currentColor"
    :x="30"
    :y="30"
  ) {{ midi?.total?.hits }} 
  g(@click="midi.total.reset()")
    circle(cx="18" cy="22" r="14" fill="transparent")
    icon-ic-baseline-refresh(
      x="8"
      y="12"
    )
  g(:transform="`translate(${width - width / 3},22)`")
    rect(
      width="50"
      height="10"
      stroke="currentColor"
      fill="none"
      rx="4"
    )
    rect(
      :transform="`scale(${midi.duration / midi.maxDuration},1)`"
      width="50"
      height="10"
      fill="currentColor"
      rx="4"
    )
  text(
    text-anchor="middle"
    fill="currentColor"
    :x="width / 2"
    :y="30"
  ) {{ midi?.note?.identifier }}
  text(
    fill="currentColor"
    :x="width - 10"
    :y="30"
    text-anchor="end"
  ) {{ (midi?.total?.duration / 1000).toFixed() }} / {{ (midi.time / 1000).toFixed() }}s
</template>