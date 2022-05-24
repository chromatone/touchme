<script setup>
import { midi } from '~/use/midi';
import { useScene } from '~/use/scene';
const { width, height } = useScene()

const acc = 200

</script>

<template lang='pug'>

g.text-overlay.select-none(fill="currentColor")
  text(
    v-tooltip.bottom-start="'Notes played'"
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
  g(:transform="`translate(${width / 2},${height - 60})`" opacity="0.7")
    rect(
      :x="-acc / 2"
      :width="acc"
      height="10"
      stroke="currentColor"
      fill="none"
      rx="4"
    )
    rect(
      :x="-acc / 2"
      :width="acc"
      :transform="`scale(${midi.duration / midi.maxDuration},1)`"
      height="10"
      fill="currentColor"
      rx="4"
    )
  text(
    text-anchor="middle"
    fill="currentColor"
    :x="width / 2"
    :y="30"
    v-tooltip.bottom="'Current note'"
  ) {{ midi?.note?.identifier }}
  text(
    v-tooltip.bottom-end="'Session time: playing / total'"
    fill="currentColor"
    :x="width - 10"
    :y="30"
    text-anchor="end"
  ) {{ (midi?.total?.duration / 1000).toFixed() }} / {{ (midi.time / 1000).toFixed() }}s
  text.text-16px(
    :y="height - 20"
    :x="width / 2"
    text-anchor="middle"
    opacity="0.6"
  ) 
    tspan.font-normal Made by
    tspan(dx="4")
      a(href="https://chromatone.center" target="_blank") Chromatone
    tspan(dx="4") for
    tspan(dx="4" )
      a(href="https://playtronica.com" target="_blank") Playtronica
    tspan(dx="4" )
      a(href="https://shop.playtronica.com/products/touchme" target="_blank") TouchMe
</template>