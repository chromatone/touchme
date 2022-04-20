<script setup>
import { useUsers, useSessions } from '~/use/stats';

const users = useUsers()

const { sessionCount, totalTime } = useSessions()
</script>

<template lang='pug'>
.flex.flex-col.border-2.rounded-lg.p-2
  .text-xl STATISTICS
  p Total players {{ users.length }}
  p Total sessions {{ sessionCount }}
  p Total time {{ totalTime }} 
</template>