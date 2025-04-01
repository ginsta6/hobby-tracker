<script setup>
import { useHabitStore } from '@/stores/habitStore'
import { onMounted, ref, watch, computed } from 'vue'

const props = defineProps(['date']) // `date` comes from the route
const store = useHabitStore()
const progress = ref({})

// Initialize store and load hobbies
store.initialize()

onMounted(() => {
  store.createDailyProgress(props.date)
  loadProgress()
})

// Watch for date changes
watch(
  () => props.date,
  (newDate) => {
    store.createDailyProgress(newDate)
    loadProgress()
  },
)

const loadProgress = () => {
  progress.value = store.getProgressForDate(props.date)
}

// Get hobbies for the current date from progress
const currentHabits = computed(() => {
  return Object.entries(progress.value).map(([id, data]) => ({
    id: parseInt(id),
    name: data.name,
    completed: data.completed,
  }))
})

const removeFromDayHandler = (hobby) => {
  if (store.removeFromDay(hobby.id, props.date)) {
    if (progress.value[hobby.id]) {
      delete progress.value[hobby.id]
    }
  }
}

const markDone = (hobby) => {
  store.markHabitAsCompleted(hobby.id, props.date)
  if (!progress.value[hobby.id]) {
    progress.value[hobby.id] = {}
  }
  progress.value[hobby.id].completed = !progress.value[hobby.id].completed
}
</script>

<template>
  <div class="hobby-list-container">
    <ul class="hobby-list">
      <li
        v-for="hobby in currentHabits"
        :key="hobby.id"
        class="hobby-item"
        :class="{ completed: hobby.completed }"
      >
        <button
          class="round-button"
          @click="markDone(hobby)"
          :class="{ completed: hobby.completed }"
          :title="hobby.completed ? 'Mark as incomplete' : 'Mark as complete'"
        >
          <i class="bi" :class="hobby.completed ? 'bi-check-circle-fill' : 'bi-check'"></i>
        </button>
        <span class="hobby-name" :class="{ 'completed-text': hobby.completed }">
          {{ hobby.name }}
        </span>
        <button
          class="round-button"
          @click="removeFromDayHandler(hobby)"
          title="Remove from today's list"
        >
          <i class="bi bi-x"></i>
        </button>
      </li>
    </ul>
  </div>
</template>

<style scoped>
.hobby-list-container {
  max-width: 800px;
  margin: 2rem auto;
  padding: 0 1rem;
}

.hobby-list {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.hobby-item {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem;
  background: var(--white);
  border-radius: var(--radius-md);
  box-shadow: var(--shadow-sm);
  transition: all 0.3s ease;
}

.hobby-item:hover {
  box-shadow: var(--shadow-md);
  transform: translateY(-2px);
}

.hobby-item.completed {
  opacity: 0.7;
}

.hobby-name {
  flex: 1;
  font-size: 1.1rem;
  font-weight: 500;
  color: var(--text-primary);
}

.completed-text {
  text-decoration: line-through;
  color: var(--text-secondary);
}

.round-button {
  width: 2.5rem;
  height: 2.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  border: none;
  background-color: var(--primary-color);
  color: var(--white);
  font-size: 1.2rem;
  cursor: pointer;
  transition: all 0.3s ease;
  padding: 0;
}

.round-button:hover {
  transform: scale(1.1);
  box-shadow: var(--shadow-md);
}

.round-button.completed {
  background-color: #4caf50;
  color: var(--white);
  transform: scale(1.1);
}

.round-button.completed:hover {
  background-color: #45a049;
}

@media (max-width: 640px) {
  .hobby-list-container {
    margin: 1rem auto;
  }

  .hobby-item {
    padding: 0.75rem;
  }

  .hobby-name {
    font-size: 1rem;
  }

  .round-button {
    width: 2rem;
    height: 2rem;
    font-size: 1rem;
  }
}
</style>
