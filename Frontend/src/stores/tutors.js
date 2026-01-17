import { ref, computed } from 'vue'
import { defineStore } from 'pinia'

export const useTutorsStore = defineStore('tutors', () => {
  // Load tutors from localStorage or use default data
  const loadTutors = () => {
    const stored = localStorage.getItem('tutors')
    return stored ? JSON.parse(stored) : []
  }

  const tutors = ref(loadTutors())

  // Save tutors to localStorage
  const saveTutors = () => {
    localStorage.setItem('tutors', JSON.stringify(tutors.value))
  }

  // Get all tutors
  const getAllTutors = computed(() => tutors.value)

  // Get tutor by ID
  const getTutorById = (id) => {
    return tutors.value.find(tutor => tutor.id === id)
  }

  // Add new tutor
  const addTutor = (tutorData) => {
    const newTutor = {
      id: Date.now().toString(),
      name: tutorData.name,
      surname: tutorData.surname,
      experience: tutorData.experience,
      students: tutorData.students || [],
      courses: tutorData.courses || [],
      createdAt: new Date().toISOString()
    }
    tutors.value.push(newTutor)
    saveTutors()
    return newTutor
  }

  // Update tutor
  const updateTutor = (id, tutorData) => {
    const index = tutors.value.findIndex(tutor => tutor.id === id)
    if (index !== -1) {
      tutors.value[index] = {
        ...tutors.value[index],
        ...tutorData,
        updatedAt: new Date().toISOString()
      }
      saveTutors()
      return tutors.value[index]
    }
    return null
  }

  // Delete tutor
  const deleteTutor = (id) => {
    const index = tutors.value.findIndex(tutor => tutor.id === id)
    if (index !== -1) {
      tutors.value.splice(index, 1)
      saveTutors()
      return true
    }
    return false
  }

  return {
    tutors,
    getAllTutors,
    getTutorById,
    addTutor,
    updateTutor,
    deleteTutor
  }
})

