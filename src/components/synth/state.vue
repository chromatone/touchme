<script setup>
import { useSynth } from '~/use/synth'
import { onClickOutside } from '@vueuse/core'

const { synthOptions, synthOnce, init } = useSynth();

const open = ref(false)

const target = ref(null)
onClickOutside(target, () => {
  open.value = false
})


</script>

<template lang="pug">
.p-0
  button.button(
    @click.stop.prevent="synthOnce(); !synthOptions.initiated && init(); open = !open"
    aria-label="Synth panel"
    )
    icon-la-wave-square
  transition(name="fade")
    .panel(v-if="open" ref="target")
      .button.cursor-pointer.p-1.absolute.top-8.right-8(@click="open = false")
        icon-la-times
      synth-panel
</template>

<style lang="postcss" scoped>
</style>