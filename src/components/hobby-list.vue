<script setup>
import {
  createDailyProgress,
  getHobbies,
  getProgress,
  markHabitAsCompleted,
  saveToHobbies,
} from '@/utils/localstorage'
import { nextTick, onMounted, ref, watch } from 'vue'

const props = defineProps(['date']) // `date` comes from the route
const hobbyList = ref([])
const isEditing = ref(false)
const hobbyInput = ref('')
const inputFieldHobby = ref(null)
const progress = ref({})

onMounted(() => {
  hobbyList.value = getHobbies()
  createDailyProgress(hobbyList.value, props.date)
  loadProgress()
})

// Watch for date changes
watch(
  () => props.date,
  (newDate) => {
    createDailyProgress(hobbyList.value, newDate)
    loadProgress()
  },
)

const loadProgress = () => {
  const storedProgress = getProgress()
  progress.value = { ...storedProgress[props.date] } || {}
}

const startEditing = () => {
  isEditing.value = true
  nextTick(() => inputFieldHobby.value.focus())
}

const submitInput = () => {
  if (!isEditing.value) return
  if (hobbyInput.value !== '') {
    saveToHobbies(hobbyInput.value)
    hobbyInput.value = ''
    hobbyList.value = getHobbies()
    createDailyProgress(hobbyList.value, props.date)
    loadProgress()
  }
}

const removeFromDay = (hobby) => {
  const storedProgress = getProgress()
  if (storedProgress[props.date]?.[hobby.id]) {
    delete storedProgress[props.date][hobby.id]
    localStorage.setItem('habitProgress', JSON.stringify(storedProgress))
    if (progress.value[hobby.id]) {
      delete progress.value[hobby.id]
    }
  }
}

const markDone = (hobby) => {
  markHabitAsCompleted(hobby.id, props.date)
  if (!progress.value[hobby.id]) {
    progress.value[hobby.id] = {}
  }
  progress.value[hobby.id].completed = !progress.value[hobby.id].completed
}
</script>

<template>
  <ul>
    <li
      v-for="hobby in hobbyList.filter((h) => progress[h.id])"
      :key="hobby.id"
      :class="{ completed: progress[hobby.id]?.completed }"
    >
      <button
        class="rounded-circle round-button"
        @click="markDone(hobby)"
        :class="{ completed: progress[hobby.id]?.completed }"
      >
        <i
          class="bi"
          :class="progress[hobby.id]?.completed ? 'bi-check-circle-fill' : 'bi-check'"
        ></i>
      </button>
      <span :class="{ 'completed-text': progress[hobby.id]?.completed }">{{ hobby.name }}</span>
      <button class="rounded-circle round-button" @click="removeFromDay(hobby)">
        <i class="bi bi-x"></i>
      </button>
    </li>
  </ul>
</template>

<style scoped>
.round-button {
  width: 25px;
  height: 25px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24px;
  padding: 0;
}

li {
  display: flex;
  justify-content: space-between;
}

.completed {
  opacity: 0.7;
}

.completed-text {
  text-decoration: line-through;
  color: #6c757d;
}

.round-button.completed {
  background-color: #28a745;
  color: white;
}
</style>
