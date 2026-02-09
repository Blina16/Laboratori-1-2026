import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import api from '@/services/api'

export const useStudentsStore = defineStore('students', () => {
  // STATE
  const students = ref([])
  const isLoading = ref(false)

  // GETTERS
  const getAllStudents = computed(() => students.value)

  const getStudentById = (id) => {
    return students.value.find(student => student.id === id)
  }

  // ACTIONS

  // 🔹 Fetch all students
  const fetchStudents = async () => {
    isLoading.value = true
    try {
      const response = await api.get('/students')
      console.log('📡 Raw students response:', response.data)

      students.value = response.data.map(student => ({
        ...student,
        name: student.name || '',
        surname: student.surname || '',
        email: student.email || '',
        age: student.age || null,
        location: student.location || ''
      }))
      
      console.log('✅ Processed students:', students.value)
    } catch (error) {
      console.error('Failed to fetch students:', error)
      throw error
    } finally {
      isLoading.value = false
    }
  }

  // 🔹 Add student (CREATE) - Using exact same pattern as tutors
  const addStudent = async (studentData) => {
    try {
      console.log('📝 Adding student with data:', studentData)
      
      // Prepare data for backend - exact same pattern as tutors
      const backendData = {
        name: studentData.name,
        surname: studentData.surname || '',
        email: studentData.email,
        age: studentData.age || null,
        location: studentData.location || ''
      }

      const response = await api.post('/students', backendData)
      console.log('📡 Add student response:', response.data)
      
      const student = response.data.student || response.data
      const formattedStudent = {
        ...student,
        id: student.id || student._id,
        name: student.name || '',
        surname: student.surname || '',
        email: student.email || '',
        age: student.age || null,
        location: student.location || ''
      }

      students.value.push(formattedStudent)
      console.log('✅ Added student to store:', formattedStudent)
      return formattedStudent
    } catch (error) {
      console.error('Failed to add student:', error)
      throw error
    }
  }

  // 🔹 Update student (UPDATE) - Using exact same pattern as tutors
  const updateStudent = async (id, studentData) => {
    try {
      console.log('📝 Updating student with ID:', id, 'data:', studentData)
      
      // Prepare data for backend - exact same pattern as tutors
      const backendData = {
        name: studentData.name,
        surname: studentData.surname || '',
        email: studentData.email,
        age: studentData.age || null,
        location: studentData.location || ''
      }

      const response = await api.put(`/students/${id}`, backendData)
      console.log('📡 Update student response:', response.data)
      
      const student = response.data.student || response.data
      const formattedStudent = {
        ...student,
        id: student.id || student._id,
        name: student.name || '',
        surname: student.surname || '',
        email: student.email || '',
        age: student.age || null,
        location: student.location || ''
      }

      const index = students.value.findIndex(s => s.id === id)
      if (index !== -1) {
        students.value[index] = formattedStudent
        console.log('✅ Updated student in store:', formattedStudent)
      }

      return formattedStudent
    } catch (error) {
      console.error('Failed to update student:', error)
      throw error
    }
  }

  // 🔹 Delete student (DELETE) - Using exact same pattern as tutors
  const deleteStudent = async (id) => {
    try {
      console.log('🗑️ Deleting student with ID:', id)
      
      await api.delete(`/students/${id}`)
      students.value = students.value.filter(s => s.id !== id)
      
      console.log('✅ Deleted student from store')
    } catch (error) {
      console.error('Failed to delete student:', error)
      throw error
    }
  }

  // EXPORT
  return {
    students,
    isLoading,
    getAllStudents,
    getStudentById,
    fetchStudents,
    addStudent,
    updateStudent,
    deleteStudent
  }
})

