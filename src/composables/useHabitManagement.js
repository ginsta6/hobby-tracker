import { ref, onMounted, onUnmounted } from 'vue'
import {
  getHobbies,
  removeFromHobbies,
  saveToHobbies,
  updateHabitStatus,
} from '@/utils/localstorage'

export const useHabitManagement = () => {
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
        hobbies.value = updateHabitStatus(hobby.id, !hobby.active)
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

  return {
    hobbies,
    isEditing,
    editingHobby,
    newHobbyName,
    modalConfig,
    startEditing,
    saveEdit,
    cancelEdit,
    showModal,
    handleModalConfirm,
    handleModalCancel,
    deleteHabit,
    stopHabit,
    saveToHobbiesFormatted,
  }
}
