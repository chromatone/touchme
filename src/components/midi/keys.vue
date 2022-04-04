<script setup>
import { midi } from '~/use/midi'
import { pitchColor, rotateArray } from '~/use/chromatone'
import { chordType, scaleType, notes } from '~/use/theory'
import { colord } from 'colord'

const props = defineProps({
  chroma: { type: String, default: '100000000000' },
  letters: { type: Boolean, defualt: false },
  pitch: { type: Number, default: 0 },
  scale: { type: String },
  roman: { type: String, default: '' },
  title: { type: Boolean, default: true }
});

const emit = defineEmits(['update:pitch'])



const keys = reactive({
  white: [3, 5, 7, 8, 10, 0, 2],
  black: [4, 6, null, 9, 11, 1],
  chroma: computed(() => rotateArray(props.chroma.split(''), -props.pitch)),
});

function isInChroma(note) {
  return note != null && keys.chroma[note] == '1'
}

function isInScale(note) {
  return props.scale && note != null && keys.chroma[note] == '1'
}

function keyColor(key, off) {
  if (key == null) return 'transparent'
  if (key == props.pitch) return colord(pitchColor(key, 4)).toHex()
  return isInChroma(key) && !off ? colord(pitchColor(key, 3.5)).toHex() : notes[key].length != 2 ? '#eee' : '#999'
}

</script>

<template lang="pug">
svg.w-full.mt-2#chroma-keys(
  version="1.1",
  baseProfile="full",
  :viewBox="`-10 -20 720 360`",
  xmlns="http://www.w3.org/2000/svg",
  font-family="Commissioner, sans-serif"
  font-weight="600"
  font-size="40"
  text-anchor="middle",
  dominant-baseline="middle"
  )
  defs
    filter#shadowButton(x="-50%" height="200%" width="300%")
      feDropShadow(dx="0" dy="3" stdDeviation="4" flood-color="#2225")
  g.white
    g.key(
      v-for="(key, k) in keys.white" :key="key"
      :transform="`translate(${k * 100 + 5} 30)`"
    )
      rect.transition-all.duration-300.ease-out(
        @click="$emit('update:pitch', key)"
        width="90"
        height="290"
        rx="45"
        :fill="keyColor(key, true)"
        style="filter:url(#shadowButton);transition: fill 1200ms ease-out"
      )
      circle.transition-all.duration-300.ease-out(
        @click="$emit('update:pitch', key)"
        cy="245"
        cx="45"
        r="45"
        :fill="keyColor(key)"
      )
      text.pointer-events-none(
        v-show="isInChroma(key)"
        y="250"
        x="45"
        :fill="!isInChroma(key) ? 'black' : 'white'"
      ) {{ notes[key] }}
  g.black 
    g.key(
      v-for="(key, k) in keys.black" :key="key"
      :transform="`translate(${k * 100 + 55} -10)`"
    )
      rect.transition-all.duration-300.ease-out(
        @click="$emit('update:pitch', key)"
        v-if="key"
        width="90"
        height="220"
        rx="45"
        style="filter:url(#shadowButton);transition: fill 1200ms ease-out"
        :fill="keyColor(key, true)"
        :data-check="key"
      )
      circle.transition-all.duration-300.ease-out(
        @click="$emit('update:pitch', key)"
        v-if="key"
        cy="175"
        cx="45"
        r="45"
        :fill="keyColor(key)"
        stroke-width="8"
        :stroke="isInScale(key) ? pitchColor(key, 3) : 'transparent'"
      )
      text.pointer-events-none(
        v-show="isInChroma(key)"
        y="180"
        x="45"
        fill="white"
      ) {{ notes[key] }}
</template>

<style lang="postcss" scoped>
.key text {
  transition: all 300ms ease;
}

.letters .key .text {
  opacity: 1;
}
.key:hover text {
  opacity: 1;
}
</style>
