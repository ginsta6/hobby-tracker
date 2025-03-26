<script setup>
import datePicker from '@/components/date-picker.vue';
import hobbyList from '@/components/hobby-list.vue';
const props = defineProps(['date']); // `date` comes from the route
</script>

<template>
  <datePicker :date="props.date"/>
  <hobbyList :date="props.date"/>
</template>
