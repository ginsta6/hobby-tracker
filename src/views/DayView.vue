<script setup>
import datePicker from '@/components/date-picker.vue'
import hobbyList from '@/components/hobby-list.vue'

const props = defineProps(['date']) // `date` comes from the route
</script>

<template>
  <div class="day-view">
    <datePicker :date="props.date" />

    <hobbyList :date="props.date" />
  </div>
</template>