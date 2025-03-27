<script setup>
import { ref, onMounted, onUnmounted } from 'vue'

const props = defineProps({
  isOpen: Boolean,
  title: String,
  message: String,
  confirmText: {
    type: String,
    default: 'Confirm',
  },
  cancelText: {
    type: String,
    default: 'Cancel',
  },
})

const emit = defineEmits(['confirm', 'cancel', 'close'])

const handleEscape = (e) => {
  if (e.key === 'Escape') {
    emit('close')
  }
}

onMounted(() => {
  document.addEventListener('keydown', handleEscape)
})

onUnmounted(() => {
  document.removeEventListener('keydown', handleEscape)
})
</script>

<template>
  <div v-if="isOpen" class="modal-overlay" @click="emit('close')">
    <div class="modal-content" @click.stop>
      <button class="close-button" @click="emit('close')">
        <i class="bi bi-x-lg"></i>
      </button>
      <div class="modal-header">
        <h3 class="modal-title">{{ title }}</h3>
      </div>
      <p class="modal-message">{{ message }}</p>
      <div class="modal-actions">
        <button class="modal-button cancel" @click="emit('cancel')">
          {{ cancelText }}
        </button>
        <button class="modal-button confirm" @click="emit('confirm')">
          {{ confirmText }}
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.modal-content {
  background-color: var(--white);
  padding: 2rem;
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-lg);
  max-width: 90%;
  width: 400px;
  position: relative;
}

.modal-header {
  margin-bottom: 1.5rem;
}

.modal-title {
  font-size: 1.5rem;
  font-weight: 600;
  color: var(--text-primary);
  margin: 0;
}

.modal-message {
  color: var(--text-secondary);
  margin-bottom: 2rem;
  line-height: 1.5;
}

.modal-actions {
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
}

.modal-button {
  padding: 0.75rem 1.5rem;
  border-radius: var(--radius-md);
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
  border: none;
}

.modal-button.cancel {
  background-color: var(--text-secondary);
  color: var(--white);
}

.modal-button.cancel:hover {
  background-color: #4b5563;
}

.modal-button.confirm {
  background-color: var(--primary-color);
  color: var(--white);
}

.modal-button.confirm:hover {
  background-color: var(--primary-dark);
}

.close-button {
  position: absolute;
  top: 1rem;
  right: 1rem;
  background: none;
  border: none;
  color: var(--text-secondary);
  font-size: 1.5rem;
  cursor: pointer;
  padding: 0.5rem;
  line-height: 1;
  transition: color 0.3s ease;
}

.close-button:hover {
  color: var(--text-primary);
}

@media (max-width: 640px) {
  .modal-content {
    padding: 1.5rem;
    margin: 1rem;
  }

  .modal-title {
    font-size: 1.25rem;
  }

  .modal-button {
    padding: 0.5rem 1rem;
  }
}
</style>
