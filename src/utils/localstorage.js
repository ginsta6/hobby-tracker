// Function to get hobbies from localStorage (returns an array of objects)
export const getHobbies = () => {
  return JSON.parse(localStorage.getItem('hobbies')) || []
}

// Function to save a hobby as an object { id, name }
export const saveToHobbies = (hobbyName) => {
  const hobbies = getHobbies()

  // Check if the hobby already exists (case-insensitive match)
  if (!hobbies.some((hobby) => hobby.name.toLowerCase() === hobbyName.toLowerCase())) {
    const newHobby = {
      id: hobbies.length + 1, // Assign next ID
      name: hobbyName,
    }
    hobbies.push(newHobby)
    localStorage.setItem('hobbies', JSON.stringify(hobbies))
  }
}

// Function to remove a hobby by name
export const removeFromHobbies = (hobbyID) => {
  let hobbies = getHobbies()

  // Filter out the hobby (case-insensitive match)
  hobbies = hobbies.filter((hobby) => hobby.id !== hobbyID)

  // Reassign IDs after removal
  hobbies = hobbies.map((hobby, index) => ({
    id: index + 1,
    name: hobby.name,
  }))

  localStorage.setItem('hobbies', JSON.stringify(hobbies))
}

export const createDailyProgress = (habits, date) => {
  const storedProgress = JSON.parse(localStorage.getItem('habitProgress')) || {}

  if (!storedProgress[date]) {
    storedProgress[date] = habits.reduce((acc, habit) => {
      acc[habit.id] = { name: habit.name, completed: false } // Store name + completion
      return acc
    }, {})

    localStorage.setItem('habitProgress', JSON.stringify(storedProgress))
  }
}

export const markHabitAsCompleted = (habitId, date) => {
  const storedProgress = JSON.parse(localStorage.getItem('habitProgress')) || {}

  // Check if the date exists and the habit exists for that day
  if (storedProgress[date]?.[habitId]) {
    storedProgress[date][habitId].completed = true // Mark as completed
    localStorage.setItem('habitProgress', JSON.stringify(storedProgress))
  }
}

