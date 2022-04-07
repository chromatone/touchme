<script setup>
import * as scenes from './scene'
import { useScene } from '~/use/scene';
import { useStorage } from '@vueuse/core';
const { visual, width, height } = useScene()

const activeScene = useStorage('active-scene', 'Rose')

</script>

<template lang='pug'>
svg#visual.h-full(
  ref="visual"
  version="1.1",
  baseProfile="full",
  :viewBox="`0 0  ${width} ${height}`",
  xmlns="http://www.w3.org/2000/svg",
)

  defs
    filter#noiseFilter
      feTurbulence(type="fractalNoise", basefrequency="6.29", numoctaves="6", stitchtiles="stitch").

  rect(
    filter="url(#noiseFilter)"
    fill="hsl(20,70%,60%)"
    opacity="0.1"
    :width="width"
    :height="height"
  )

  transition(name="fade" mode="out-in")
    keep-alive
      component( :is="scenes[activeScene]")

  scene-overlay

  g
    g.cursor-pointer(
      @click="activeScene = scene"
      v-for="(c, scene, i) in scenes" :key="scene"
      :transform="`translate(0 ${i * 50 + 50})`"
    )
      rect(width="100" height="40" rx="10" ry="10" fill="hsla(0,0%,0%,0.1)")
      text(fill="currentColor" y="25" x="10" :font-weight="scene == activeScene ? 'bold' : 'normal'") {{ scene }}

</template>

<route lang="yaml">
title: Experience
subtitle: by Chromatone 
</route>

