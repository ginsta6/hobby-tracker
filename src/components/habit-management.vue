<script setup>
import { useHabitManagement } from '@/composables/useHabitManagement'
import ConfirmModal from './confirm-modal.vue'
import '@/assets/styles/habit-management.css'

const {
  hobbies,
  isEditing,
  editingHobby,
  newHobbyName,
  modalConfig,
  startEditing,
  saveEdit,
  cancelEdit,
  handleModalConfirm,
  handleModalCancel,
  deleteHabit,
  stopHabit,
  saveToHobbiesFormatted,
} = useHabitManagement()
</script>

<template>
  <div class="habit-management container">
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
