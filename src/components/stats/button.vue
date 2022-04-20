<script setup>
import { useStorage } from '@vueuse/core';
import { computed, reactive, ref } from 'vue';
import { nanoid } from 'nanoid'

const updateRequest = {
  method: 'PUT',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ title: 'Fetch PUT Request Example' })
};
const server = reactive({
  // url: 'https://powerful-scented-galley.glitch.me',
  url: 'http://localhost:2242',
  response: null
})

const stat = ref({})
const user = reactive({
  nid: useStorage('nano-id', ''),
  accessToken: '',
  authedAt: 0,
  exists: false,
  profile: {}
})

const interact = async () => {
  if (!user.accessToken && Date.now() - user.authedAt > 2000) {
    generateUser()
  } else {
    console.log(user.accessToken)
  }
  //gets current user stats
  // fetch('http://localhost:2242/api/db')
  //   .then(res => res.json())
  //   .then(data => stat.value = data)
  return stat
}

async function generateUser() {
  user.nid = user.nid || nanoid()
  let res = await fetch(`${server.url}/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      "email": user.nid + '@touch.me',
      "password": user.nid,
      "name": user.nid,
    })
  })
    .then(r => r.ok ? r : Promise.reject(r))
    .then(r => r.json())
    .catch(e => {
      console.log(e)
      if (e.status == 400) {
        user.exists = true
        console.log(user)
      }
    })
  if (res?.accessToken) {
    user.accessToken = res?.accessToken
    user.profile = res?.user
    user.authedAt = Date.now()
  }

}
</script>

<template lang='pug'>
.flex
  button.button(@click="interact()")
    icon-la-server
</template>