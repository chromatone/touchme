<script setup>
import { useFullscreen } from '@vueuse/core'

const props = defineProps(['el'])

const element = ref()

onMounted(() => {
  nextTick(() => {
    if (props.el) {
      element.value = props.el
    } else {
      element.value = document.getElementById('screen')
    }
    full.value = useFullscreen(element.value)
  })


})

const full = ref()

function toggle() {
  if (!full.value) full.value = useFullscreen(element.value);
  full.value.toggle()
}

const supported = computed(() => full.value?.isSupported);

</script>

<template lang="pug">
button.button(
  v-show="supported"
  @click="toggle()"
)
  icon-la-expand
</template>

<style lang="postcss" scoped>
</style>