// Function to get progress from localStorage
export const getProgress = () => {
  return JSON.parse(localStorage.getItem('habitProgress')) || {}
}

// Function to get hobbies from localStorage (returns an array of objects)
export const getHobbies = () => {
  return JSON.parse(localStorage.getItem('hobbies')) || []
}

// Function to save a hobby as an object { id, name }
export const saveToHobbies = (hobbyName) => {
  const hobbies = getHobbies()
  const storedProgress = getProgress()
  const today = new Date().toISOString().split('T')[0]

  // Check if the hobby already exists (case-insensitive match)
  if (!hobbies.some((hobby) => hobby.name.toLowerCase() === hobbyName.toLowerCase())) {
    const newHobby = {
      id: hobbies.length + 1, // Assign next ID
      name: hobbyName,
      active: true, // New hobbies are active by default
    }
    hobbies.push(newHobby)
    localStorage.setItem('hobbies', JSON.stringify(hobbies))

    // Add the new hobby to today's progress
    if (storedProgress[today]) {
      storedProgress[today][newHobby.id] = { name: hobbyName, completed: false }
      localStorage.setItem('habitProgress', JSON.stringify(storedProgress))
    }
  }
}

// Function to remove a hobby by name
export const removeFromHobbies = (hobbyID) => {
  let hobbies = getHobbies()
  const storedProgress = getProgress()

  // Filter out the hobby (case-insensitive match)
  hobbies = hobbies.filter((hobby) => hobby.id !== hobbyID)

  // Create a mapping of old IDs to new IDs
  const idMapping = {}
  hobbies.forEach((hobby, index) => {
    idMapping[hobby.id] = index + 1
    hobby.id = index + 1
  })

  // Update progress data with new IDs
  Object.keys(storedProgress).forEach((date) => {
    const newProgress = {}
    Object.entries(storedProgress[date]).forEach(([oldId, data]) => {
      if (idMapping[oldId]) {
        newProgress[idMapping[oldId]] = data
      }
    })
    storedProgress[date] = newProgress
  })

  localStorage.setItem('hobbies', JSON.stringify(hobbies))
  localStorage.setItem('habitProgress', JSON.stringify(storedProgress))
}

export const createDailyProgress = (habits, date) => {
  const storedProgress = getProgress()

  // If the date doesn't exist or has no entries, create/update it with current habits
  if (!storedProgress[date] || Object.keys(storedProgress[date]).length === 0) {
    storedProgress[date] = habits
      .filter((habit) => habit.active) // Only include active habits
      .reduce((acc, habit) => {
        acc[habit.id] = { name: habit.name, completed: false } // Store name + completion
        return acc
      }, {})

    localStorage.setItem('habitProgress', JSON.stringify(storedProgress))
  }
}

export const markHabitAsCompleted = (habitId, date) => {
  const storedProgress = getProgress()

  // Check if the date exists and the habit exists for that day
  if (storedProgress[date]?.[habitId]) {
    // Toggle the completion status
    storedProgress[date][habitId].completed = !storedProgress[date][habitId].completed
    localStorage.setItem('habitProgress', JSON.stringify(storedProgress))
  }
}

// Function to remove a habit from a specific day
export const removeFromDay = (habitId, date) => {
  const storedProgress = getProgress()
  if (storedProgress[date]?.[habitId]) {
    delete storedProgress[date][habitId]
    localStorage.setItem('habitProgress', JSON.stringify(storedProgress))
    return true
  }
  return false
}

// Function to update habit status (active/inactive)
export const updateHabitStatus = (habitId, isActive) => {
  const currentHobbies = getHobbies()
  const updatedHobbies = currentHobbies.map((h) => {
    if (h.id === habitId) {
      return { ...h, active: isActive }
    }
    return h
  })
  localStorage.setItem('hobbies', JSON.stringify(updatedHobbies))
  return updatedHobbies
}
