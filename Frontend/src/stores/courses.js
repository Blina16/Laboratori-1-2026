import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import api from '@/services/api'

export const useCoursesStore = defineStore('courses', () => {
  // STATE
  const courses = ref([])
  const isLoading = ref(false)

  // GETTERS
  const getAllCourses = computed(() => courses.value)

  const getCourseById = (id) => {
    return courses.value.find(course => course.id === id)
  }

  // ACTIONS

  // 🔹 Fetch all courses
  const fetchCourses = async () => {
    isLoading.value = true
    try {
      const response = await api.get('/courses')
      console.log('📡 Raw courses response:', response.data)

      courses.value = response.data.map(course => ({
        ...course,
        name: course.title || course.name,
        title: course.title || course.name,
        description: course.description || '',
        duration: course.duration || '',
        level: course.level || '',
        price: typeof course.price === 'number' ? course.price : (course.price ? Number(course.price) : 0),
        tutor: course.tutor_name || '',
        teacher_id: course.teacher_id || course.assigned_tutor_id,
        students: course.students || []
      }))
      
      console.log('✅ Processed courses:', courses.value)
    } catch (error) {
      console.error('Failed to fetch courses:', error)
      throw error
    } finally {
      isLoading.value = false
    }
  }

  // 🔹 Add course (CREATE) - Using exact tutor logic
  const addCourse = async (courseData) => {
    try {
      console.log('📝 Adding course with data:', courseData)
      
      // Prepare data for backend - exact same pattern as tutors
      const backendData = {
        title: courseData.title || courseData.name,
        description: courseData.description,
        duration: courseData.duration,
        level: courseData.level,
        price: courseData.price,
        teacher_id: courseData.teacher_id || courseData.assigned_tutor_id
      }

      const response = await api.post('/courses', backendData)
      console.log('📡 Add course response:', response.data)
      
      const course = response.data.course || response.data
      const formattedCourse = {
        ...course,
        id: course.id || course._id,
        name: course.title || course.name,
        title: course.title || course.name,
        description: course.description || '',
        duration: course.duration || '',
        level: course.level || '',
        price: typeof course.price === 'number' ? course.price : (course.price ? Number(course.price) : 0),
        tutor: course.tutor_name || '',
        teacher_id: course.teacher_id || course.assigned_tutor_id,
        students: course.students || []
      }

      courses.value.push(formattedCourse)
      console.log('✅ Added course to store:', formattedCourse)
      return formattedCourse
    } catch (error) {
      console.error('Failed to add course:', error)
      throw error
    }
  }

  // 🔹 Update course (UPDATE) - Using exact tutor logic
  const updateCourse = async (id, courseData) => {
    try {
      console.log('📝 Updating course with ID:', id, 'data:', courseData)
      
      // Prepare data for backend - exact same pattern as tutors
      const backendData = {
        title: courseData.title || courseData.name,
        description: courseData.description,
        duration: courseData.duration,
        level: courseData.level,
        price: courseData.price,
        teacher_id: courseData.teacher_id || courseData.assigned_tutor_id
      }

      const response = await api.put(`/courses/${id}`, backendData)
      console.log('📡 Update course response:', response.data)
      
      const course = response.data.course || response.data
      const formattedCourse = {
        ...course,
        id: course.id || course._id,
        name: course.title || course.name,
        title: course.title || course.name,
        description: course.description || '',
        duration: course.duration || '',
        level: course.level || '',
        price: typeof course.price === 'number' ? course.price : (course.price ? Number(course.price) : 0),
        tutor: course.tutor_name || '',
        teacher_id: course.teacher_id || course.assigned_tutor_id,
        students: course.students || []
      }

      const index = courses.value.findIndex(c => c.id === id)
      if (index !== -1) {
        courses.value[index] = formattedCourse
        console.log('✅ Updated course in store:', formattedCourse)
      }

      return formattedCourse
    } catch (error) {
      console.error('Failed to update course:', error)
      throw error
    }
  }

  // 🔹 Delete course (DELETE) - Using exact tutor logic
  const deleteCourse = async (id) => {
    try {
      console.log('🗑️ Deleting course with ID:', id)
      
      await api.delete(`/courses/${id}`)
      courses.value = courses.value.filter(c => c.id !== id)
      
      console.log('✅ Deleted course from store')
    } catch (error) {
      console.error('Failed to delete course:', error)
      throw error
    }
  }

  // EXPORT
  return {
    courses,
    isLoading,
    getAllCourses,
    getCourseById,
    fetchCourses,
    addCourse,
    updateCourse,
    deleteCourse
  }
})

