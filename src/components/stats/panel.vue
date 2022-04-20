<script setup>
import { enter, server, useUser, useUserSession, useUserSessions, formatDate, useUsers, useSessions } from '~/use/stats';
import { userColor } from '~/use/colors';
import { useTimeAgo } from '@vueuse/core';
import { computed } from 'vue';
import ms from 'ms';

const user = useUser()

const age = computed(() => useTimeAgo(user.value.createdAt))


const session = useUserSession()


const sessions = useUserSessions()

const users = useUsers()

const { sessionCount, totalTime, avgTime } = useSessions()

</script>

<template lang='pug'>
.flex.flex-col.overflow-hidden.rounded-lg.shadow-xl.z-1000.absolute.bg-light-100.dark_bg-dark-400.left-20.right-20.top-20(v-if="server.open")
  .p-2.text-xs(v-if="user?.id" :style="{ backgroundColor: userColor.hex(user?.email) }") {{ user?.email }}
  .p-4.flex.flex-col.gap-2
    .text-xl STATISTICS
    .border-2.rounded-lg.p-2
      p Total players: {{ users.length }}
      p Total sessions: {{ sessionCount }}
      p Total time: {{ ms(totalTime || 0) }} 
      p Average session time: {{ ms(avgTime || 0) }}
    .p-0 First started {{ age.value }}
    .text-md Current session: {{ ms(session.pulse - session.started || 0) }}
    .font-bold My sessions
    .flex.flex-col.gap-1.max-h-50.overflow-y-scroll.overscroll-y-contain
      .py-1.px-2.flex.items-center.gap-2.bg-light-800.dark_bg-dark-50.rounded(v-for="s in sessions" :key="s")
        .text-sm.font-bold {{ s.id }}
        .p-0 {{ formatDate(s.started).full }}
        .flex-1
        .font-bold {{ ms(s.pulse - s.started || 0) }}

</template>