<script setup>
import { midi } from '~/use/midi';
import { notes, pitchColor, getCircleCoord } from '~/use/chromatone';
import { useScene } from '~/use/scene';
import { useSpring } from '~/use/spring';
const { width, height } = useScene()

const { createSpring2D, updateSpring2D, createSpringValue, updateSpring, registerSpring } = useSpring()

// Spring physics state for 12 pitch classes
const smoothedCoords = reactive(
  new Array(12).fill(null).map(() => ({
    ...createSpring2D(),
    scale: createSpringValue(0)
  }))
)

const round = computed(() => new Array(12).fill(1).map((r, i) => {
  if (!midi.total.notes[i]) return {}
  return getCircleCoord(i, 12, midi.total.notes[i] / midi.total.hits * width.value * 1.2 + 50, width.value, height.value)
}))

// Apply spring physics in RAF loop
onMounted(() => {
  // Initialize at center
  smoothedCoords.forEach(c => {
    c.x = width.value / 2
    c.y = height.value / 2
  })

  const unregister = registerSpring((deltaTime) => {
    const targetRound = round.value

    for (let i = 0; i < 12; i++) {
      const target = targetRound[i]
      const current = smoothedCoords[i]

      if (target.x && target.y) {
        // Update position spring
        updateSpring2D(current, target, deltaTime)

        // Update scale spring
        const targetScale = 50 * midi.total.durations[i] / midi.total.duration || 0
        updateSpring(current.scale, targetScale, deltaTime)
      } else {
        // Decay to center when inactive
        updateSpring2D(current, { x: width.value / 2, y: height.value / 2 }, deltaTime)
        updateSpring(current.scale, 0, deltaTime)
      }
    }
  })
  onUnmounted(unregister)
})

const lines = computed(() => {
  const active = smoothedCoords.filter((c, i) => round.value[i].x && round.value[i].y)
  const lines = active.map((dot, i) => {
    return { x1: dot.x, y1: dot.y, x2: active[i == (active.length - 1) ? 0 : i + 1].x, y2: active[i == (active.length - 1) ? 0 : i + 1].y, }
  })
  return lines
})

</script>

<template lang='pug'>
g
  line(
    v-for="(l, i) in 12" :key="l"
    :x1="width / 2"
    :x2="width / 2"
    :y1="height / 2"
    :y2="-height / 2"
    stroke-linecap="round"
    :stroke-width="midi?.note?.pitch == i && midi?.note?.attack ? midi.duration / 10 : 2"
    :stroke="pitchColor(i, 4)"
    :transform-origin="`${width / 2} ${height / 2}`"
    :transform="`rotate(${30 * i})`"
  )
  circle.mix-blend-multiply.dark-mix-blend-difference(
    v-for="(coord, p) in smoothedCoords" :key="p"
    :cx="coord.x || width / 2"
    :r="10"
    :cy="coord.y || height / 2"
    :fill="pitchColor(p)"
    stroke-width="4"
    :transform-origin="`${coord.x || width / 2} ${coord.y || height / 2}`"
    :style="`transform: scale(${coord.scale.value})`"
  )
  line.mix-blend-exclusion(
    v-for="line in lines" :key="line"
    v-bind="line"
    stroke="currentColor"
    stroke-width="4"
    stroke-linecap="round"  
  )
  line.mix-blend-difference(
    :x1="width / 2"
    :x2="width / 2"
    :y1="height / 2 - midi.duration / 5 - 100"
    :y2="height / 2"
    :transform-origin="`${width / 2} ${height / 2}`"
    :transform="`rotate(${30 * midi?.note?.pitch || 0})`"
    stroke="white"
    stroke-width="4"
    stroke-linecap="round"
  )
  circle(
    :cx="width / 2"
    :cy="height / 2"
    :r="30"
    :style="`transform: scale(${midi.duration / 1000})`"
    :transform-origin="`${width / 2} ${height / 2}`"
    :fill="pitchColor(midi?.note?.pitch, 3, midi?.note?.attack)"
  )
</template>
