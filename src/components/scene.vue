<script setup>

import { useScene } from '~/use/scene';
const { visual, width, height } = useScene()

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
  //- scene-grid
  //- scene-circle
  //- scene-cross
  //- scene-columns
  scene-rose
  scene-overlay

</template>

<route lang="yaml">
title: Experience
subtitle: by Chromatone 
</route>

