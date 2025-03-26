<script setup>
import { onMounted, ref, watch } from 'vue'
import { useCalendar } from '../composables/useCalendar'
import { useRouter } from 'vue-router'

const props = defineProps(['date']) // `date` comes from the route
const containerRef = ref(null)
const selectedDay = ref(new Date(props.date))
const dateInput = ref(null)
const { squareNumbers, generateSquareNumbers } = useCalendar(selectedDay.value)

const router = useRouter()

// Watch for changes in selectedDay and regenerate square numbers when it changes
watch(selectedDay, (newSelectedDay) => {
  generateSquareNumbers(newSelectedDay)
})

// Scroll to the middle of the container on mounted
onMounted(() => scrollToMiddle())

const scrollToMiddle = () => {
  const container = containerRef.value
  const middlePosition = container.scrollWidth / 2 - container.clientWidth / 2
  container.scrollLeft = middlePosition
}

// Function to check if a date is selected
const isSelected = (date) => {
  return selectedDay.value.toDateString() === date.toDateString()
}

const handleDateClick = (date) => {
    selectedDay.value = date
    const newdate = date.toLocaleDateString('en-CA')
    router.replace(`/day/${newdate}`)
}

// Ensures the input is properly rendered before clicking it
const openDatePicker = async () => {
  dateInput.value?.showPicker?.() // Triggers the date picker in modern browsers
  if (!dateInput.value?.showPicker) {
    dateInput.value.click() // Fallback for older browsers
  }
}

// Updates `selectedDay` when user selects a date from the picker
const updateSelectedDay = (event) => {
  selectedDay.value = new Date(event.target.value)
  scrollToMiddle()
}

const todayButton = () => {
  handleDateClick(new Date())
  scrollToMiddle()
}
</script>

<template>
  <div class="scrolling-container" ref="containerRef">
    <div class="scrolling-row d-flex">
      <!-- Generate squares dynamically based on the date -->
      <div
        v-for="(date, index) in squareNumbers"
        :key="index"
        class="square m-2"
        :class="{ selected: isSelected(date), disabled: date > new Date() }"
        @click="handleDateClick(date)"
      >
        <!-- Top-left: Month abbreviation -->
        <span class="month-label">{{ date.toLocaleString('en-US', { month: 'short' }) }}</span>
        <!-- Top-right: Day abbreviation -->
        <span class="day-label">{{ date.toLocaleString('en-US', { weekday: 'short' }) }}</span>
        <!-- Center: Day of the month -->
        <span class="date-number">{{ date.getDate() }}</span>
      </div>
    </div>
  </div>

  <div class="button-group">
    <button @click="openDatePicker">Pick a Date</button>
    <button @click="todayButton()">Today</button>
  </div>

  <input
    type="date"
    ref="dateInput"
    @change="updateSelectedDay"
    :max="new Date().toISOString().split('T')[0]"
    style="opacity: 0; position: absolute; width: 0; height: 0"
  />
</template>

<style scoped>
.square {
  width: 100px;
  height: 100px;
  flex-shrink: 0; /* Prevent shrinking */
  display: flex;
  justify-content: center;
  align-items: center;
  color: white;
  font-size: 1.5rem;
  position: relative;
  text-align: center;
  background-color: #34d399; /* Mint green */
  border-radius: 12px; /* Rounded corners */
  transition: all 0.3s ease;
  cursor: pointer;
}

.square:hover {
  background-color: #10b981; /* Darker green on hover */
  box-shadow: 0 6px 12px rgba(0, 0, 0, 0.15);
  transform: translateY(-5px);
}

/* Selected square style */
.selected {
  background-color: #84cc16; /* Bright lime green */
  color: black;
  box-shadow: 0px 0px 12px rgba(132, 204, 22, 0.7); /* Glowing effect */
  transform: scale(1.1); /* Slightly enlarge when selected */
}

.scrolling-container {
  width: 100%;
  overflow-x: auto;
  white-space: nowrap;
  padding: 10px 0;
  background-color: #f4f7fb;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.scrolling-row {
  display: inline-flex;
  gap: 10px;
}

.date-number {
  font-size: 2rem;
  font-weight: bold;
}

.month-label {
  position: absolute;
  top: 5px;
  left: 8px;
  font-size: 0.75rem;
  font-weight: bold;
  opacity: 0.8;
}

/* Top-right: Weekday */
.day-label {
  position: absolute;
  top: 5px;
  right: 8px;
  font-size: 0.75rem;
  font-weight: bold;
  opacity: 0.8;
}

.disabled {
  opacity: 0.5;
  pointer-events: none;
  cursor: not-allowed;
}

.button-group {
  display: flex;
  justify-content: center;
  gap: 15px;
  margin-top: 20px;
}
</style>
