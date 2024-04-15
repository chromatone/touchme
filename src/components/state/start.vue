<script setup>
import { init, synthOptions } from '~/use/synth'
import { midi } from '~/use/midi'
import { useStorage } from '@vueuse/core';


const started = ref(false)

const steps = reactive({
  browser: {
    text: 'MIDI enabled browser',
    checked: computed(() => midi?.enabled),
    disabled: true
  },
  controller: {
    text: 'TouchMe (or any other MIDI controller)',
    checked: useStorage('touch-me', false)
  },
  usb: {
    text: "USB cable (you have it in your package)",
    checked: useStorage('usb-cable', false)
  },
  adapter: {
    text: "Special adapter, if your device doesn’t have a usb port ",
    checked: useStorage('usb-adapter', false)
  },
  friend: {
    text: "Your best friend ",
    checked: useStorage('your-friend', false)
  }
})

</script>

<template lang='pug'>
.text-center.absolute.z-500.p-4.rounded-xl.shadow-xl.bg-light-200.mx-auto.dark-bg-dark-200.min-w-80(
  style="left: 50%; top: 50%; transform: translate(-50%, -50%);"
  v-if="!synthOptions.initiated"
  )
  h2.text-center.text-2xl.my-4 Let's play music with touch 
  .p-4.flex.flex-col.gap-2(v-if="!midi.enabled") This interactive experience needs Web MIDI API support. Unfortunately, your current browser doesn't provide it. Is it Firefox or Safari? Please, use another one here.

    a.button.p-4.flex.items-center(href="https://chrome.google.com" target="_blank")
      icon-la-chrome.text-2xl
      .ml-2 Google Chrome for Desktop or Android

    a.button.p-4.flex.items-center(href="https://apps.apple.com/ru/app/web-midi-browser/id953846217" target="_blank")
      icon-la-apple.text-2xl
      .ml-2 Web MIDI Browser for iOS
    a.button.p-4.flex.items-center(href="https://caniuse.com/?search=midi" target="_blank")
      icon-ic-baseline-checklist.text-2xl
      .ml-2 Other options
    .mt-4 Or play notes with your PC keyboard 
    img(src="/pc-keyboard.svg")
  .px-4(v-else)
    .flex.items-center.my-4(v-for="(step, name) in steps" :key="name")
      input.transform.scale-200(type="checkbox" :disabled="step.disabled" :id="name" v-model="step.checked")
      label.ml-4(:for="name") {{ step.text }}
  button.button.mx-auto.w-full.font-bold(@click="init(); started = true") Start
</template>

<style lang="postcss" scoped></style>