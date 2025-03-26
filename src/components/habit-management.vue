<script setup>
import { getHobbies, removeFromHobbies, saveToHobbies } from '@/utils/localstorage'
import { ref, onMounted } from 'vue'

const hobbies = ref([])
const isEditing = ref(false)
const editingHobby = ref(null)
const newHobbyName = ref('')

onMounted(() => {
  hobbies.value = getHobbies()
})

const startEditing = (hobby) => {
  editingHobby.value = hobby
  newHobbyName.value = hobby.name
  isEditing.value = true
}

const saveEdit = () => {
  if (!newHobbyName.value.trim()) return

  // Remove the old hobby
  removeFromHobbies(editingHobby.value.id)
  // Add the new hobby
  saveToHobbies(newHobbyName.value)

  // Refresh the list
  hobbies.value = getHobbies()
  isEditing.value = false
  editingHobby.value = null
  newHobbyName.value = ''
}

const cancelEdit = () => {
  isEditing.value = false
  editingHobby.value = null
  newHobbyName.value = ''
}

const deleteHabit = (hobby) => {
  if (confirm('Are you sure you want to delete this habit? This will remove all its records.')) {
    removeFromHobbies(hobby.id)
    hobbies.value = getHobbies()
  }
}

const stopHabit = (hobby) => {
  if (confirm('Are you sure you want to stop this habit? It will be removed from future days.')) {
    // TODO: Implement stop habit functionality
    // This will require adding a new field to the hobby object to track if it's active
    console.log('Stop habit:', hobby)
  }
}
</script>

<template>
  <div class="habit-management">
    <h2>Habit Management</h2>
    <div class="add-habit">
      <input
        v-model="newHobbyName"
        type="text"
        class="form-control"
        placeholder="Add new habit"
        @keydown.enter="(
          saveToHobbies(newHobbyName),
          newHobbyName = '',
          hobbies = getHobbies())
        "
      />
      <button
        class="btn btn-primary"
        @click="(
          saveToHobbies(newHobbyName),
          newHobbyName = '',
          hobbies = getHobbies())
        "
      >
        Add
      </button>
    </div>

    <ul class="habit-list">
      <li v-for="hobby in hobbies" :key="hobby.id" class="habit-item">
        <div v-if="isEditing && editingHobby?.id === hobby.id" class="edit-mode">
          <input
            v-model="newHobbyName"
            type="text"
            class="form-control"
            @keydown.enter="saveEdit"
          />
          <button class="btn btn-success" @click="saveEdit">Save</button>
          <button class="btn btn-secondary" @click="cancelEdit">Cancel</button>
        </div>
        <div v-else class="view-mode">
          <span class="habit-name">{{ hobby.name }}</span>
          <div class="habit-actions">
            <button class="btn btn-primary" @click="startEditing(hobby)">
              <i class="bi bi-pencil"></i>
            </button>
            <button class="btn btn-warning" @click="stopHabit(hobby)">
              <i class="bi bi-pause"></i>
            </button>
            <button class="btn btn-danger" @click="deleteHabit(hobby)">
              <i class="bi bi-trash"></i>
            </button>
          </div>
        </div>
      </li>
    </ul>
  </div>
</template>

<style scoped>
.habit-management {
  max-width: 600px;
  margin: 0 auto;
  padding: 20px;
}

.add-habit {
  display: flex;
  gap: 10px;
  margin-bottom: 20px;
}

.habit-list {
  list-style: none;
  padding: 0;
}

.habit-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px;
  margin-bottom: 10px;
  border: 1px solid #ddd;
  border-radius: 4px;
}

.edit-mode {
  display: flex;
  gap: 10px;
  width: 100%;
}

.view-mode {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
}

.habit-actions {
  display: flex;
  gap: 5px;
}

.habit-name {
  font-size: 1.1em;
}

.btn {
  padding: 5px 10px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.btn-primary {
  background-color: #007bff;
  color: white;
}

.btn-success {
  background-color: #28a745;
  color: white;
}

.btn-warning {
  background-color: #ffc107;
  color: black;
}

.btn-danger {
  background-color: #dc3545;
  color: white;
}

.btn-secondary {
  background-color: #6c757d;
  color: white;
}
</style>
