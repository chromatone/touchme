---
title: MIDI Keys
subtitle: Digital music signals
date: 2022-03-02
---

<script setup>
import {midi} from '~/use/midi'

</script>

<client-only>
<midi-keys class="p-16" :pitch="(midi?.note?.number+3)%12" />
</client-only>
