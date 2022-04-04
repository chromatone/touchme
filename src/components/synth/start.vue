<script setup>
import { init, synthOptions } from '~/use/synth'
const started = ref(false)

const list = reactive({
  controller: {
    text: 'TouchMe (or any other MIDI controller)',
    checked: false
  },
  usb: {
    text: "USB (you have it in your package)",
    checked: false
  },
  device: {
    text: "Computer / tablet or phone",
    checked: false,
  },
  adapter: {
    text: "Special adapter, if your device doesn’t have a usb port (there is Android&Macbook and iPhone adapter in our shop)",
    checked: false,
  },
  friend: {
    text: "Your best friend ",
    checked: false,
  }
})

</script>

<template lang='pug'>
.absolute.z-500.p-4.rounded-xl.text-2xl.shadow-xl.bg-light-200.mx-auto(
  style="left: 50%; top: 50%; transform: translate(-50%, -50%);"
  v-if="!started"
  )
  h2.font-bold Let's play music with touch 
  p 
  .p-4
    .flex.items-center.my-2(v-for="(thing, name) in list" :key="name")
      input.transform.scale-200(type="checkbox" :id="name" :value="thing.checked") 
      label.ml-4(:for="name") {{ thing.text }}
  button.button.mx-auto.w-full.font-bold(@click="init(); started = true") Start
</template>

<style lang="postcss" scoped>
</style>