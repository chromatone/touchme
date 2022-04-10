<script setup>
import { isDark } from '~/use/state.js'

</script>

<template lang="pug">
button.button(@click="isDark = !isDark" aria-label="Toggle dark mode")
  icon-carbon-moon(v-show="isDark")
  icon-ion-ios-sunny(v-show="!isDark")
</template>
