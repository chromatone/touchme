<script setup>
import { server, useUser } from '~/use/stats';

const user = useUser()

</script>

<template lang='pug'>
button.button(@click="server.open = !server.open")
  icon-la-server
</template>