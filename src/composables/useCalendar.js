import { ref } from 'vue'

// Helper function to get the number of days in a month
const getDaysInMonth = (month, year) => new Date(year, month + 1, 0).getDate()

// Helper function to adjust day to the correct month and year
const adjustDayToMonth = (day, month, year) => {
  const daysInMonth = getDaysInMonth(month, year)

  if (day > daysInMonth) {
    // Move to next month
    const nextMonth = (month + 1) % 12
    const nextYear = nextMonth === 0 ? year + 1 : year
    return { day: day - daysInMonth, month: nextMonth, year: nextYear }
  } else if (day < 1) {
    // Move to previous month
    const prevMonth = (month - 1 + 12) % 12
    const prevYear = prevMonth === 11 ? year - 1 : year
    const daysInPrevMonth = getDaysInMonth(prevMonth, prevYear)
    return { day: day + daysInPrevMonth, month: prevMonth, year: prevYear }
  }

  return { day, month, year }
}

// Main composable function
// In useCalendar.js

export const useCalendar = (input = new Date()) => {
  const today = new Date(input)

  const squareNumbers = ref([])

  // Generate the square numbers
  const generateSquareNumbers = (date) => {
    const todayDate = date.getDate()
    const currentMonth = date.getMonth()
    const currentYear = date.getFullYear()

    squareNumbers.value = Array.from({ length: 21 }, (_, i) => {
      const dayOffset = i - 10
      let day = todayDate + dayOffset

      const {
        day: finalDay,
        month: finalMonth,
        year: finalYear,
      } = adjustDayToMonth(day, currentMonth, currentYear)
      return new Date(finalYear, finalMonth, finalDay)
    })
  }

  // Initial call to generate the square numbers
  generateSquareNumbers(today)

  return { squareNumbers, generateSquareNumbers }
}
