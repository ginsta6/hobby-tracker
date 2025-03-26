<script setup>
import {
  createDailyProgress,
  getHobbies,
  getProgress,
  markHabitAsCompleted,
  removeFromHobbies,
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
  progress.value = storedProgress[props.date] || {}
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

const removeHobby = (hobby) => {
  removeFromHobbies(hobby.id)
  hobbyList.value = getHobbies()
  createDailyProgress(hobbyList.value, props.date)
  loadProgress()
}

const markDone = (hobby) => {
  markHabitAsCompleted(hobby.id, props.date)
  loadProgress()
}
</script>

<template>
  <ul>
    <li
      v-for="hobby in hobbyList"
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
      <button class="rounded-circle round-button" @click="removeHobby(hobby)">
        <i class="bi bi-x"></i>
      </button>
    </li>
    <div class="d-inline-block">
      <button v-if="!isEditing" class="rounded-circle round-button" @click="startEditing">
        <i class="bi bi-plus"></i>
      </button>

      <input
        v-else
        v-model="hobbyInput"
        ref="inputFieldHobby"
        type="text"
        class="form-control input-field"
        @blur="isEditing = false"
        @keydown.enter="submitInput"
      />
    </div>
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
