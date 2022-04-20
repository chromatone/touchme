<script setup>
import { server, useUserSession, useUser } from '~/use/stats';

const user = useUser()
const session = useUserSession()

</script>

<template lang='pug'>
button.button(@click="server.open = !server.open")
  icon-la-server
</template>