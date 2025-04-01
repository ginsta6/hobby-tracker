import { defineStore } from 'pinia'

// Function to get and increment nextId from localStorage
const getNextId = () => {
  let nextId = parseInt(localStorage.getItem('nextId')) || 1
  localStorage.setItem('nextId', (nextId + 1).toString())
  return nextId
}

export const useHabitStore = defineStore('habits', {
  // State
  state: () => ({
    hobbies: [],
    isEditing: false,
    editingHobby: null,
    newHobbyName: '',
    modalConfig: {
      isOpen: false,
      title: '',
      message: '',
      confirmText: '',
      cancelText: '',
      onConfirm: null,
    },
  }),

  // Getters
  getters: {
    // Get all active hobbies
    activeHobbies: (state) => state.hobbies.filter((hobby) => hobby.active),

    // Get progress for a specific date
    getProgressForDate: () => (date) => {
      const progress = JSON.parse(localStorage.getItem('habitProgress')) || {}
      return progress[date] || {}
    },

    // Get all progress
    getAllProgress: () => {
      return JSON.parse(localStorage.getItem('habitProgress')) || {}
    },

    // Get completion status for a specific habit on a date
    isHabitCompleted: () => (habitId, date) => {
      const progress = JSON.parse(localStorage.getItem('habitProgress')) || {}
      return progress[date]?.[habitId]?.completed || false
    },

    // Get progress by date (for direct access)
    getProgress: () => {
      return JSON.parse(localStorage.getItem('habitProgress')) || {}
    },
  },

  // Actions
  actions: {
    // Load hobbies from localStorage
    loadHobbies() {
      this.hobbies = JSON.parse(localStorage.getItem('hobbies')) || []
    },

    // Save hobbies to localStorage
    saveHobbies() {
      localStorage.setItem('hobbies', JSON.stringify(this.hobbies))
    },

    // Save progress to localStorage
    saveProgress(progress) {
      localStorage.setItem('habitProgress', JSON.stringify(progress))
    },

    // Add new hobby
    addHobby(name) {
      if (!name.trim()) return

      const formattedName = name
        .trim()
        .split(' ')
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
        .join(' ')

      // Check if hobby already exists
      if (!this.hobbies.some((hobby) => hobby.name.toLowerCase() === formattedName.toLowerCase())) {
        const newHobby = {
          id: getNextId(),
          name: formattedName,
          active: true,
        }
        this.hobbies.push(newHobby)
        this.saveHobbies()

        // Add to today's progress
        const today = new Date().toISOString().split('T')[0]
        const progress = this.getAllProgress
        if (progress[today]) {
          progress[today][newHobby.id] = { name: formattedName, completed: false }
          this.saveProgress(progress)
        }
      }
    },

    // Delete hobby
    deleteHobby(hobbyId) {
      this.hobbies = this.hobbies.filter((hobby) => hobby.id !== hobbyId)
      this.saveHobbies()

      // Remove from progress data
      const progress = this.getAllProgress
      Object.keys(progress).forEach((date) => {
        if (progress[date][hobbyId]) {
          delete progress[date][hobbyId]
        }
      })
      this.saveProgress(progress)
    },

    // Update hobby status (active/inactive)
    updateHobbyStatus(hobbyId, isActive) {
      // Update the hobby's active status
      this.hobbies = this.hobbies.map((h) => {
        if (h.id === hobbyId) {
          return { ...h, active: isActive }
        }
        return h
      })
      this.saveHobbies()

      // If deactivating, remove from future dates only
      if (!isActive) {
        const progress = this.getAllProgress
        const today = new Date().toISOString().split('T')[0]

        Object.keys(progress).forEach((date) => {
          // Only remove from future dates
          if (date > today && progress[date]?.[hobbyId]) {
            delete progress[date][hobbyId]
          }
        })

        this.saveProgress(progress)
      }
    },

    // Edit hobby name
    editHobby(hobbyId, newName) {
      if (!newName.trim()) return

      const formattedName = newName
        .trim()
        .split(' ')
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
        .join(' ')

      // Update in hobbies
      this.hobbies = this.hobbies.map((h) => {
        if (h.id === hobbyId) {
          return { ...h, name: formattedName }
        }
        return h
      })
      this.saveHobbies()

      // Update in progress data
      const progress = this.getAllProgress
      Object.keys(progress).forEach((date) => {
        if (progress[date][hobbyId]) {
          progress[date][hobbyId].name = formattedName
        }
      })
      this.saveProgress(progress)
    },

    // Create daily progress
    createDailyProgress(date) {
      // Ensure hobbies are loaded
      if (this.hobbies.length === 0) {
        this.loadHobbies()
      }

      const progress = this.getAllProgress

      if (!progress[date] || Object.keys(progress[date]).length === 0) {
        progress[date] = this.activeHobbies.reduce((acc, habit) => {
          acc[habit.id] = { name: habit.name, completed: false }
          return acc
        }, {})

        this.saveProgress(progress)
      }
    },

    // Mark habit as completed
    markHabitAsCompleted(habitId, date) {
      const progress = this.getAllProgress

      if (progress[date]?.[habitId]) {
        progress[date][habitId].completed = !progress[date][habitId].completed
        this.saveProgress(progress)
      }
    },

    // Remove habit from specific day
    removeFromDay(habitId, date) {
      const progress = this.getAllProgress
      if (progress[date]?.[habitId]) {
        delete progress[date][habitId]
        this.saveProgress(progress)
        return true
      }
      return false
    },

    // Modal management
    showModal(config) {
      this.modalConfig = {
        isOpen: true,
        ...config,
      }
    },

    handleModalConfirm() {
      if (this.modalConfig.onConfirm) {
        this.modalConfig.onConfirm()
      }
      this.modalConfig.isOpen = false
    },

    handleModalCancel() {
      this.modalConfig.isOpen = false
    },

    // Initialize store
    initialize() {
      this.loadHobbies()
    },
  },
})
