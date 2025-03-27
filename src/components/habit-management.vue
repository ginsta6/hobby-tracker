<script setup>
import { getHobbies, removeFromHobbies, saveToHobbies } from '@/utils/localstorage'
import { ref, onMounted, onUnmounted } from 'vue'
import ConfirmModal from './confirm-modal.vue'

const hobbies = ref([])
const isEditing = ref(false)
const editingHobby = ref(null)
const newHobbyName = ref('')
const modalConfig = ref({
  isOpen: false,
  title: '',
  message: '',
  confirmText: '',
  cancelText: '',
  onConfirm: null,
})

// Custom event handler
const handleStorageChange = () => {
  hobbies.value = getHobbies()
}

onMounted(() => {
  hobbies.value = getHobbies()
  window.addEventListener('storage', handleStorageChange)
})

onUnmounted(() => {
  window.removeEventListener('storage', handleStorageChange)
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

  // Update the local ref
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

const showModal = (config) => {
  modalConfig.value = {
    isOpen: true,
    ...config,
  }
}

const handleModalConfirm = () => {
  if (modalConfig.value.onConfirm) {
    modalConfig.value.onConfirm()
  }
  modalConfig.value.isOpen = false
}

const handleModalCancel = () => {
  modalConfig.value.isOpen = false
}

const deleteHabit = (hobby) => {
  showModal({
    title: 'Delete Habit',
    message: 'Are you sure you want to delete this habit? This will remove all its records.',
    confirmText: 'Delete',
    cancelText: 'Cancel',
    onConfirm: () => {
      removeFromHobbies(hobby.id)
      hobbies.value = getHobbies()
    },
  })
}

const stopHabit = (hobby) => {
  const action = hobby.active ? 'stop' : 'resume'
  showModal({
    title: `${action.charAt(0).toUpperCase() + action.slice(1)} Habit`,
    message: `Are you sure you want to ${action} this habit?`,
    confirmText: action.charAt(0).toUpperCase() + action.slice(1),
    cancelText: 'Cancel',
    onConfirm: () => {
      const currentHobbies = getHobbies()
      const updatedHobbies = currentHobbies.map((h) => {
        if (h.id === hobby.id) {
          return { ...h, active: !h.active }
        }
        return h
      })
      localStorage.setItem('hobbies', JSON.stringify(updatedHobbies))
      hobbies.value = updatedHobbies
    },
  })
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
        @keydown.enter="
          (saveToHobbies(newHobbyName), (newHobbyName = ''), (hobbies = getHobbies()))
        "
      />
      <button
        class="btn btn-primary"
        @click="(saveToHobbies(newHobbyName), (newHobbyName = ''), (hobbies = getHobbies()))"
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
          <div class="habit-info">
            <span class="habit-name" :class="{ inactive: !hobby.active }">{{ hobby.name }}</span>
            <span class="status-indicator" :class="{ active: hobby.active }">
              {{ hobby.active ? 'Active' : 'Paused' }}
            </span>
          </div>
          <div class="habit-actions">
            <button class="btn btn-primary" @click="startEditing(hobby)">
              <i class="bi bi-pencil"></i>
            </button>
            <button
              class="btn"
              :class="hobby.active ? 'btn-warning' : 'btn-success'"
              @click="stopHabit(hobby)"
            >
              <i class="bi" :class="hobby.active ? 'bi-pause' : 'bi-play'"></i>
            </button>
            <button class="btn btn-danger" @click="deleteHabit(hobby)">
              <i class="bi bi-trash"></i>
            </button>
          </div>
        </div>
      </li>
    </ul>
    <ConfirmModal
      v-bind="modalConfig"
      @confirm="handleModalConfirm"
      @cancel="handleModalCancel"
      @close="handleModalCancel"
    />
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
  transition: all 0.3s ease;
}

.habit-item:hover {
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
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

.habit-info {
  display: flex;
  align-items: center;
  gap: 10px;
}

.status-indicator {
  font-size: 0.8em;
  padding: 2px 8px;
  border-radius: 12px;
  background-color: #e9ecef;
  color: #6c757d;
}

.status-indicator.active {
  background-color: #d4edda;
  color: #155724;
}

.habit-name.inactive {
  color: #6c757d;
  text-decoration: line-through;
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
