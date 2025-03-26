<script setup>
import datePicker from '@/components/date-picker.vue'
import hobbyList from '@/components/hobby-list.vue'
import { RouterLink } from 'vue-router'
const props = defineProps(['date']) // `date` comes from the route
</script>

<template>
  <div class="day-view">
    <datePicker :date="props.date" />

    <hobbyList :date="props.date" />
  </div>
</template>

<style scoped>
.day-view {
  max-width: 600px;
  margin: 0 auto;
  padding: 20px;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.btn {
  padding: 8px 16px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  text-decoration: none;
  display: inline-flex;
  align-items: center;
  gap: 8px;
}

.btn-primary {
  background-color: #007bff;
  color: white;
}

.btn-primary:hover {
  background-color: #0056b3;
}
</style>
