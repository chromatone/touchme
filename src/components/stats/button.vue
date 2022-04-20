<script setup>
import { useStorage } from '@vueuse/core';
import { computed, reactive, ref } from 'vue';

const updateRequest = {
  method: 'PUT',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ title: 'Fetch PUT Request Example' })
};
const server = reactive({
  url: 'http://localhost:2242/api',
  response: null
})

const stat = ref({})
const user = reactive({
  name: useStorage('user-name', ''),
  email: useStorage('user-email', ''),
  jwt: '',
  authedAt: 0,
})

const interact = async () => {
  if (!user.jwt && Date.now() - user.authedAt > 2000) {
    server.response = await fetch(`${server.url}/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        "email": "olivier@mail.com",
        "password": "bestPassw0rd"
      })
    })
  }
  //gets current user stats
  // fetch('http://localhost:2242/api/db')
  //   .then(res => res.json())
  //   .then(data => stat.value = data)
  return stat
}
</script>

<template lang='pug'>
.flex
  button.button(@click="interact()")
    icon-la-server
</template>