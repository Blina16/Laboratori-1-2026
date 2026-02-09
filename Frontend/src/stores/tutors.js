import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import api from '@/services/api'

export const useTutorsStore = defineStore('tutors', () => {
  // STATE
  const tutors = ref([])
  const isLoading = ref(false)

  // GETTERS
  const getAllTutors = computed(() => tutors.value)

  const getTutorById = (id) => {
    return tutors.value.find(tutor => tutor.id === id)
  }

  // ACTIONS

  // 🔹 Fetch all tutors
  const fetchTutors = async () => {
    isLoading.value = true
    try {
      const response = await api.get('/tutors')
      console.log('📡 Raw tutors response:', response.data)

      tutors.value = response.data.map(tutor => {
        const nameParts = tutor.name?.split(' ') || []
        const firstName = nameParts[0] || ''
        const surname = nameParts.slice(1).join(' ') || ''

        return {
          ...tutor,
          id: tutor.id || tutor._id, // ✅ normalize ID
          name: firstName, // Keep only first name in name field
          surname: surname, // Store surname separately
          price: tutor.price_per_hour || 0,
          students: tutor.students || [],
          courses: tutor.courses || []
        }
      })
      
      console.log('✅ Processed tutors:', tutors.value)
    } catch (error) {
      console.error('Failed to fetch tutors:', error)
      throw error
    } finally {
      isLoading.value = false
    }
  }

  // 🔹 Add tutor (CREATE)
  const addTutor = async (tutorData) => {
    try {
      console.log('📝 Adding tutor with data:', tutorData)
      
      // Prepare data for backend
      const backendData = {
        name: tutorData.name,
        surname: tutorData.surname,
        email: tutorData.email,
        password: tutorData.password,
        subject: tutorData.subject,
        experience: tutorData.experience,
        price: tutorData.price,
        bio: tutorData.bio
      }

      const response = await api.post('/tutors', backendData)
      console.log('📡 Add tutor response:', response.data)
      
      const tutor = response.data.tutor || response.data
      const nameParts = tutor.name?.split(' ') || []
      const firstName = nameParts[0] || ''
      const surname = nameParts.slice(1).join(' ') || ''

      const formattedTutor = {
        ...tutor,
        id: tutor.id || tutor._id,
        name: firstName,
        surname: surname,
        price: tutor.price_per_hour || 0,
        students: [],
        courses: []
      }

      tutors.value.push(formattedTutor)
      console.log('✅ Added tutor to store:', formattedTutor)
      return formattedTutor
    } catch (error) {
      console.error('Failed to add tutor:', error)
      throw error
    }
  }

  // 🔹 Update tutor (UPDATE)
  const updateTutor = async (id, tutorData) => {
    try {
      console.log('📝 Updating tutor with ID:', id, 'data:', tutorData)
      
      // Prepare data for backend
      const backendData = {
        name: tutorData.name,
        surname: tutorData.surname,
        email: tutorData.email,
        subject: tutorData.subject,
        experience: tutorData.experience,
        price: tutorData.price,
        bio: tutorData.bio
      }

      const response = await api.put(`/tutors/${id}`, backendData)
      console.log('📡 Update tutor response:', response.data)
      
      const tutor = response.data.tutor || response.data
      const nameParts = tutor.name?.split(' ') || []
      const firstName = nameParts[0] || ''
      const surname = nameParts.slice(1).join(' ') || ''

      const formattedTutor = {
        ...tutor,
        id: tutor.id || tutor._id,
        name: firstName,
        surname: surname,
        price: tutor.price_per_hour || 0,
        students: tutor.students || [],
        courses: tutor.courses || []
      }

      const index = tutors.value.findIndex(t => t.id === id)
      if (index !== -1) {
        tutors.value[index] = formattedTutor
        console.log('✅ Updated tutor in store:', formattedTutor)
      }

      return formattedTutor
    } catch (error) {
      console.error('Failed to update tutor:', error)
      throw error
    }
  }

  // 🔹 Delete tutor (DELETE)
  const deleteTutor = async (id) => {
    try {
      console.log('🗑️ Deleting tutor with ID:', id)
      
      await api.delete(`/tutors/${id}`)
      tutors.value = tutors.value.filter(t => t.id !== id)
      
      console.log('✅ Deleted tutor from store')
    } catch (error) {
      console.error('Failed to delete tutor:', error)
      throw error
    }
  }

  // EXPORT
  return {
    tutors,
    isLoading,
    getAllTutors,
    getTutorById,
    fetchTutors,
    addTutor,
    updateTutor,
    deleteTutor
  }
})
