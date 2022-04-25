import { useStorage, createFetch, useIntervalFn, watchOnce } from '@vueuse/core';
import { computed, reactive, ref, toRaw, watch } from 'vue';
import { nanoid } from 'nanoid'
import ms from 'ms';

export const server = reactive({
  accessToken: null,
  nid: useStorage('stats-nid'),
  open: false
})

export const useMyFetch = createFetch({
  baseUrl: import.meta.env.PROD ? 'https://powerful-scented-galley.glitch.me' : 'http://localhost:2042',
  options: {
    async beforeFetch({ options }) {
      options.headers = options.headers || {}
      options.headers['Content-Type'] = 'application/json'
      if (server.accessToken) {
        options.headers.Authorization = `Bearer ${server.accessToken}`
      }
      return { options }
    },
  },
  fetchOptions: {
    mode: 'cors',
  },
})

export const user = ref({})
const nid = useStorage('stat-nid')

export function useUser() {
  if (!user.value.id) {
    enter()
    useIntervalFn(() => {
      const { data } = useMyFetch(`users/${user.value?.id}`).patch({
        pulse: Date.now()
      }).json()

      watch(data, d => {
        user.value = d
      })
    }, 5000)
  }
  return user
}

export async function enter() {
  if (!nid.value) {
    nid.value = nanoid().slice(0, 12)
    let timestamp = Date.now()

    const { data } = useMyFetch('register').post({
      "email": nid.value + '@touch.me',
      "password": nid.value,
      "createdAt": timestamp,
      "pulse": timestamp
    }).json()

    watch(data, d => {
      user.value = d.user
      server.accessToken = d.accessToken
    })
  } else {
    const { data } = useMyFetch('login').post({
      "email": nid.value + '@touch.me',
      "password": nid.value,
    }).json()

    watch(data, d => {
      user.value = d?.user
      server.accessToken = d?.accessToken
    })
  }

}


const session = ref()

export function useUserSession() {
  if (session.value) return session

  watch(() => user.value?.id, id => {
    if (!id) return
    let timestamp = Date.now()
    const { data } = useMyFetch(`sessions`).post({
      userId: id,
      started: timestamp,
      pulse: timestamp
    }).json()

    watch(data, d => {
      session.value = d
    })

    useIntervalFn(() => {
      const { data } = useMyFetch(`sessions/${session.value.id}`).patch({
        pulse: Date.now()
      }).json()

      watch(data, d => {
        session.value = d
      })
    }, 5000)
  })

  return session
}

export function useUserSessions() {
  const list = ref()
  watch(() => user.value?.id, id => {
    if (!id) return
    const { data } = useMyFetch(`sessions?userId=${user.value.id}&_sort=started&_order=desc`).get().json()

    watch(data, d => {
      list.value = d
    })
  })
  return list
}



export function useUsers() {
  const list = ref({})
  watch(() => user.value?.id, () => {
    const { data } = useMyFetch('users').get().json()
    watch(data, d => {
      list.value = d
    })
  })
  return list
}

export function useSessions() {
  const list = ref([])
  watch(() => user.value?.id, () => {
    const { data } = useMyFetch('sessions').get().json()
    watch(data, d => {
      list.value = d
    })
  })
  const sessionCount = computed(() => list.value?.length)
  const totalTime = computed(() => {
    let time = 0
    if (!list.value) return 0
    list.value?.forEach(s => {
      time += s.pulse - s.started
    })
    return time
  })
  const avgTime = computed(() => totalTime.value / sessionCount.value)
  return { sessionCount, totalTime, avgTime }
}


export function formatDate(timestamp) {
  if (!timestamp) return
  const theDate = new Date(timestamp)
  const date = theDate.toLocaleDateString('en-CA')
  const time = theDate.toLocaleTimeString('ru-RU')
  return {
    full: date + ' ' + time,
    date,
    time,
    // ms: ms(Date.now() - theDate.getTime()),
  }
}
