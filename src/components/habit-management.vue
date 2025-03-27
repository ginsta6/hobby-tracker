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

const saveToHobbiesFormatted = (name) => {
  if (!name.trim()) return
  const formattedName = name
    .trim()
    .split(' ')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ')
  saveToHobbies(formattedName)
  newHobbyName.value = ''
  hobbies.value = getHobbies()
}
</script>

<template>
  <div class="habit-management">
    <h2>Habit Management</h2>
    <div class="add-habit">
      <div class="add-habit-section">
        <input
          v-model="newHobbyName"
          type="text"
          class="form-control"
          placeholder="Add new habit"
          required
          title="Enter the name of your new habit"
          @keydown.enter="saveToHobbiesFormatted(newHobbyName)"
        />
        <button
          class="btn btn-primary"
          @click="saveToHobbiesFormatted(newHobbyName)"
          title="Add new habit"
        >
          Add
        </button>
      </div>
    </div>

    <div class="habit-list">
      <div v-if="hobbies.length === 0" class="empty-state">
        <p>No habits added yet. Add your first habit above!</p>
      </div>
      <div v-else class="habit-item" v-for="hobby in hobbies" :key="hobby.id">
        <div v-if="isEditing && editingHobby?.id === hobby.id" class="edit-mode">
          <input
            v-model="newHobbyName"
            type="text"
            class="form-control"
            title="Edit habit name"
            @keydown.enter="saveEdit"
          />
          <button class="btn btn-success" @click="saveEdit" title="Save changes">
            <i class="bi bi-check-lg"></i>
          </button>
          <button class="btn btn-danger" @click="cancelEdit" title="Cancel editing">
            <i class="bi bi-x-lg"></i>
          </button>
        </div>
        <div v-else class="view-mode">
          <div class="habit-info">
            <span class="habit-name" :class="{ inactive: !hobby.active }">{{ hobby.name }}</span>
            <span class="status-indicator" :class="{ active: hobby.active }">
              {{ hobby.active ? 'Active' : 'Paused' }}
            </span>
          </div>
          <div class="habit-actions">
            <button
              class="btn btn-outline-primary"
              @click="startEditing(hobby)"
              title="Edit habit name"
            >
              <i class="bi bi-pencil"></i>
            </button>
            <button
              class="btn"
              :class="hobby.active ? 'btn-warning' : 'btn-success'"
              @click="stopHabit(hobby)"
              title="Stop/Resume habit"
            >
              <i class="bi" :class="hobby.active ? 'bi-pause' : 'bi-play'"></i>
            </button>
            <button class="btn btn-outline-danger" @click="deleteHabit(hobby)" title="Delete habit">
              <i class="bi bi-trash"></i>
            </button>
          </div>
        </div>
      </div>
    </div>
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
  max-width: 800px;
  margin: 2rem auto;
  padding: 0 1rem;
}

.habit-management h2 {
  color: var(--text-primary);
  margin-bottom: 1.5rem;
  font-size: 1.8rem;
  font-weight: 600;
}

.add-habit {
  display: flex;
  gap: 1rem;
  margin-bottom: 2rem;
}

.habit-list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.habit-item {
  background: var(--white);
  border-radius: var(--radius-md);
  margin-bottom: 1rem;
  box-shadow: var(--shadow-sm);
  transition: all 0.3s ease;
  overflow: hidden;
}

.habit-item:hover {
  box-shadow: var(--shadow-md);
  transform: translateY(-2px);
}

.edit-mode {
  display: flex;
  gap: 0.5rem;
  padding: 1rem;
  width: 100%;
}

.edit-mode .form-control {
  flex: 1;
}

.edit-mode .btn {
  width: 2.5rem;
  height: 2.5rem;
  padding: 0;
  display: flex;
  align-items: center;
  justify-content: center;
}

.edit-mode .btn i {
  font-size: 1.2rem;
}

.view-mode {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem;
}

.habit-info {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.habit-name {
  font-size: 1.1rem;
  font-weight: 500;
  color: var(--text-primary);
}

.habit-name.inactive {
  color: var(--text-secondary);
  text-decoration: line-through;
}

.status-indicator {
  font-size: 0.8rem;
  padding: 0.25rem 0.75rem;
  border-radius: 1rem;
  background-color: #e5e7eb;
  color: var(--text-secondary);
}

.status-indicator.active {
  background-color: #dcfce7;
  color: #166534;
}

.habit-actions {
  display: flex;
  gap: 0.5rem;
}

.btn {
  padding: 0.5rem;
  width: 2.5rem;
  height: 2.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: var(--radius-sm) !important;
}

.btn i {
  font-size: 1.1rem;
}

.btn-primary {
  background-color: var(--primary-color);
  color: var(--white);
}

.btn-success {
  background-color: #22c55e;
  color: var(--white);
}

.btn-warning {
  background-color: #f59e0b;
  color: var(--white);
}

.btn-danger {
  background-color: #ef4444;
  color: var(--white);
}

.btn-secondary {
  background-color: var(--text-secondary);
  color: var(--white);
}

.btn-outline-primary {
  border: 1px solid var(--primary-color);
  color: var(--primary-color);
  background: transparent;
}

.btn-outline-primary:hover {
  background-color: var(--primary-color);
  color: var(--white);
}

.btn-outline-danger {
  border: 1px solid #ef4444;
  color: #ef4444;
  background: transparent;
}

.btn-outline-danger:hover {
  background-color: #ef4444;
  color: var(--white);
}

.btn-warning:hover {
  background-color: #d97706;
}

.btn-success:hover {
  background-color: #16a34a;
}

@media (max-width: 640px) {
  .habit-management {
    margin: 1rem auto;
  }

  .habit-management h2 {
    font-size: 1.5rem;
    margin-bottom: 1rem;
  }

  .add-habit {
    flex-direction: column;
    gap: 0.5rem;
  }

  .view-mode {
    flex-direction: column;
    gap: 1rem;
    align-items: flex-start;
  }

  .habit-actions {
    width: 100%;
    justify-content: flex-end;
  }
}
</style>
