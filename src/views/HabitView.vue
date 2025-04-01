<script setup>
import { useHabitStore } from '@/stores/habitStore'
import ConfirmModal from '@/components/confirm-modal.vue'
import '@/assets/habit-management.css'

const store = useHabitStore()

const startEditing = (hobby) => {
  store.editingHobby = hobby
  store.newHobbyName = hobby.name
  store.isEditing = true
}

const saveEdit = () => {
  if (!store.newHobbyName.trim()) return
  store.editHobby(store.editingHobby.id, store.newHobbyName)
  store.isEditing = false
  store.editingHobby = null
  store.newHobbyName = ''
}

const cancelEdit = () => {
  store.isEditing = false
  store.editingHobby = null
  store.newHobbyName = ''
}

const deleteHabit = (hobby) => {
  store.showModal({
    title: 'Delete Habit',
    message: 'Are you sure you want to delete this habit? This will remove all its records.',
    confirmText: 'Delete',
    cancelText: 'Cancel',
    onConfirm: () => {
      store.deleteHobby(hobby.id)
    },
  })
}

const stopHabit = (hobby) => {
  const action = hobby.active ? 'stop' : 'resume'
  store.showModal({
    title: `${action.charAt(0).toUpperCase() + action.slice(1)} Habit`,
    message: `Are you sure you want to ${action} this habit?`,
    confirmText: action.charAt(0).toUpperCase() + action.slice(1),
    cancelText: 'Cancel',
    onConfirm: () => {
      store.updateHobbyStatus(hobby.id, !hobby.active)
    },
  })
}

const saveToHobbiesFormatted = (name) => {
  if (!name.trim()) return
  store.addHobby(name)
  store.newHobbyName = ''
}
</script>

<template>
  <div class="habit-management container">
    <h2>Habit Management</h2>
    <div class="add-habit">
      <div class="add-habit-section">
        <input
          v-model="store.newHobbyName"
          type="text"
          class="form-control"
          placeholder="Add new habit"
          required
          title="Enter the name of your new habit"
          @keydown.enter="saveToHobbiesFormatted(store.newHobbyName)"
        />
        <button @click="saveToHobbiesFormatted(store.newHobbyName)" title="Add new habit">
          Add
        </button>
      </div>
    </div>

    <div class="habit-list">
      <div v-if="store.hobbies.length === 0" class="empty-state">
        <p>No habits added yet. Add your first habit above!</p>
      </div>
      <div v-else class="habit-item" v-for="hobby in store.hobbies" :key="hobby.id">
        <div v-if="store.isEditing && store.editingHobby?.id === hobby.id" class="edit-mode">
          <input
            v-model="store.newHobbyName"
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
      v-bind="store.modalConfig"
      @confirm="store.handleModalConfirm"
      @cancel="store.handleModalCancel"
      @close="store.handleModalCancel"
    />
  </div>
</template>
