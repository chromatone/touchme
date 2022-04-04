<script setup>
import { isDark } from '~/use/state.js'

</script>

<template lang="pug">
button(@click="isDark = !isDark" aria-label="Toggle dark mode")
  carbon-moon(v-show="isDark")
  ion-ios-sunny(v-show="!isDark")
</template>
