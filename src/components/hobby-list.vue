<script setup>
import { createDailyProgress, getHobbies, markHabitAsCompleted, removeFromHobbies, saveToHobbies } from '@/utils/localstorage'
import { nextTick, onMounted, ref } from 'vue'

const props = defineProps(['date']) // `date` comes from the route
const hobbyList = ref([])
const isEditing = ref(false)
const hobbyInput = ref('')
const inputFieldHobby = ref(null)

onMounted(() => {
  hobbyList.value = getHobbies()
  createDailyProgress(hobbyList.value, props.date)
})

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
  }
}

const removeHobby = (hobby) => {
  removeFromHobbies(hobby.id)
  hobbyList.value = getHobbies()
}

const markDone = (hobby) => {
  markHabitAsCompleted(hobby.id, props.date)
}
</script>

<template>
  <ul>
    <li v-for="hobby in hobbyList" :key="hobby.id">
      <button class="rounded-circle round-button" @click="markDone(hobby)">
        <i class="bi bi-check"></i>
      </button>
      {{ hobby.name }}
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
</style>
