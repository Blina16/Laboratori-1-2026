import { ref, computed } from 'vue'
import { defineStore } from 'pinia'

export const useCoursesStore = defineStore('courses', () => {
  // Load courses from localStorage or use default data
  const loadCourses = () => {
    const stored = localStorage.getItem('courses')
    return stored ? JSON.parse(stored) : []
  }

  const courses = ref(loadCourses())

  // Save courses to localStorage
  const saveCourses = () => {
    localStorage.setItem('courses', JSON.stringify(courses.value))
  }

  // Get all courses
  const getAllCourses = computed(() => courses.value)

  // Get course by ID
  const getCourseById = (id) => {
    return courses.value.find(course => course.id === id)
  }

  // Add new course
  const addCourse = (courseData) => {
    const newCourse = {
      id: Date.now().toString(),
      name: courseData.name,
      description: courseData.description || '',
      duration: courseData.duration || '',
      level: courseData.level || '',
      price: courseData.price || 0,
      tutor: courseData.tutor || '',
      students: courseData.students || [],
      createdAt: new Date().toISOString()
    }
    courses.value.push(newCourse)
    saveCourses()
    return newCourse
  }

  // Update course
  const updateCourse = (id, courseData) => {
    const index = courses.value.findIndex(course => course.id === id)
    if (index !== -1) {
      courses.value[index] = {
        ...courses.value[index],
        ...courseData,
        updatedAt: new Date().toISOString()
      }
      saveCourses()
      return courses.value[index]
    }
    return null
  }

  // Delete course
  const deleteCourse = (id) => {
    const index = courses.value.findIndex(course => course.id === id)
    if (index !== -1) {
      courses.value.splice(index, 1)
      saveCourses()
      return true
    }
    return false
  }

  return {
    courses,
    getAllCourses,
    getCourseById,
    addCourse,
    updateCourse,
    deleteCourse
  }
})

