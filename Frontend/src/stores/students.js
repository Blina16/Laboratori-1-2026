import { ref, computed } from 'vue'
import { defineStore } from 'pinia'

export const useStudentsStore = defineStore('students', () => {
  // Load students from localStorage or use default data
  const loadStudents = () => {
    const stored = localStorage.getItem('students')
    return stored ? JSON.parse(stored) : []
  }

  const students = ref(loadStudents())

  // Save students to localStorage
  const saveStudents = () => {
    localStorage.setItem('students', JSON.stringify(students.value))
  }

  // Get all students
  const getAllStudents = computed(() => students.value)

  // Get student by ID
  const getStudentById = (id) => {
    return students.value.find(student => student.id === id)
  }

  // Add new student
  const addStudent = (studentData) => {
    const newStudent = {
      id: Date.now().toString(),
      name: studentData.name,
      surname: studentData.surname,
      email: studentData.email,
      phone: studentData.phone || '',
      courses: studentData.courses || [],
      tutor: studentData.tutor || '',
      createdAt: new Date().toISOString()
    }
    students.value.push(newStudent)
    saveStudents()
    return newStudent
  }

  // Update student
  const updateStudent = (id, studentData) => {
    const index = students.value.findIndex(student => student.id === id)
    if (index !== -1) {
      students.value[index] = {
        ...students.value[index],
        ...studentData,
        updatedAt: new Date().toISOString()
      }
      saveStudents()
      return students.value[index]
    }
    return null
  }

  // Delete student
  const deleteStudent = (id) => {
    const index = students.value.findIndex(student => student.id === id)
    if (index !== -1) {
      students.value.splice(index, 1)
      saveStudents()
      return true
    }
    return false
  }

  return {
    students,
    getAllStudents,
    getStudentById,
    addStudent,
    updateStudent,
    deleteStudent
  }
})

