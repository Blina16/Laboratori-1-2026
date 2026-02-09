<template>
  <div class="flex">
    <AdminSidebar />
    <div class="flex-1 ml-64">
      <div class="min-h-[calc(100vh-4rem)] bg-gray-50 p-8">
        <div class="max-w-7xl mx-auto">
          <!-- Header -->
          <div class="mb-8 flex items-center justify-between">
            <div>
              <h1 class="text-3xl font-bold text-gray-900 mb-2">Course Management</h1>
              <p class="text-gray-600">Manage courses, their details, tutors, and enrolled students</p>
            </div>
            <button
              @click="openAddModal"
              class="btn-primary flex items-center gap-2"
            >
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
              </svg>
              Add Course
            </button>
          </div>

          <!-- Courses Table -->
          <div class="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div class="overflow-x-auto">
              <table class="min-w-full divide-y divide-gray-200">
                <thead class="bg-gray-50">
                  <tr>
                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Course Name
                    </th>
                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Level
                    </th>
                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Duration
                    </th>
                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Price
                    </th>
                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Tutor
                    </th>
                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Students
                    </th>
                    <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody class="bg-white divide-y divide-gray-200">
                  <tr v-if="courses.length === 0">
                    <td colspan="7" class="px-6 py-12 text-center text-gray-500">
                      <svg class="mx-auto h-12 w-12 text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                      </svg>
                      <p>No courses found. Click "Add Course" to get started.</p>
                    </td>
                  </tr>
                  <tr
                    v-for="course in courses"
                    :key="course.id"
                    class="hover:bg-gray-50 transition"
                  >
                    <td class="px-6 py-4">
                      <div class="flex items-center">
                        <div class="w-10 h-10 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-lg flex items-center justify-center text-white font-semibold mr-3">
                          {{ course.name.charAt(0) }}
                        </div>
                        <div>
                          <div class="text-sm font-medium text-gray-900">
                            {{ course.name }}
                          </div>
                          <div v-if="course.description" class="text-xs text-gray-500 truncate max-w-xs">
                            {{ course.description }}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap">
                      <span
                        v-if="course.level"
                        class="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium"
                        :class="{
                          'bg-green-100 text-green-800': course.level === 'Beginner',
                          'bg-blue-100 text-blue-800': course.level === 'Intermediate',
                          'bg-purple-100 text-purple-800': course.level === 'Advanced',
                          'bg-red-100 text-red-800': course.level === 'Expert'
                        }"
                      >
                        {{ course.level }}
                      </span>
                      <span v-else class="text-sm text-gray-400">Not set</span>
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap">
                      <span v-if="course.duration" class="text-sm text-gray-900">{{ course.duration }}</span>
                      <span v-else class="text-sm text-gray-400">Not set</span>
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap">
                      <span v-if="course.price" class="text-sm font-medium text-gray-900">${{ course.price.toFixed(2) }}</span>
                      <span v-else class="text-sm text-gray-400">Free</span>
                    </td>
                    <td class="px-6 py-4">
                      <span v-if="course.tutor" class="text-sm text-gray-900">{{ course.tutor }}</span>
                      <span v-else class="text-sm text-gray-400">Not assigned</span>
                    </td>
                    <td class="px-6 py-4">
                      <div class="flex flex-wrap gap-1">
                        <span
                          v-for="(student, index) in course.students.slice(0, 2)"
                          :key="index"
                          class="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-green-100 text-green-800"
                        >
                          {{ student }}
                        </span>
                        <span
                          v-if="course.students.length > 2"
                          class="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-gray-100 text-gray-800"
                        >
                          +{{ course.students.length - 2 }} more
                        </span>
                        <span
                          v-if="course.students.length === 0"
                          class="text-sm text-gray-400"
                        >
                          No students
                        </span>
                      </div>
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button
                        @click="openEditModal(course)"
                        class="text-blue-600 hover:text-blue-900 mr-4"
                      >
                        Edit
                      </button>
                      <button
                        @click="confirmDelete(course)"
                        class="text-red-600 hover:text-red-900"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Add/Edit Course Modal -->
    <CourseModal
      v-if="showModal"
      :course="selectedCourse"
      :tutors="tutors"
      @close="closeModal"
      @save="handleSave"
    />

    <!-- Delete Confirmation Modal -->
    <div
      v-if="showDeleteModal"
      class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
      @click.self="showDeleteModal = false"
    >
      <div class="bg-white rounded-xl shadow-xl p-6 max-w-md w-full mx-4">
        <h3 class="text-lg font-semibold text-gray-900 mb-2">Delete Course</h3>
        <p class="text-gray-600 mb-6">
          Are you sure you want to delete <strong>{{ courseToDelete?.name }}</strong>? This action cannot be undone.
        </p>
        <div class="flex justify-end gap-3">
          <button
            @click="showDeleteModal = false"
            class="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition"
          >
            Cancel
          </button>
          <button
            @click="handleDelete"
            class="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import api from '../services/api'
import CourseModal from '../components/CourseModal.vue'
import AdminSidebar from '../components/AdminSidebar.vue'

defineOptions({
  name: 'AdminCoursesView'
})

const showModal = ref(false)
const showDeleteModal = ref(false)
const selectedCourse = ref(null)
const courseToDelete = ref(null)

const courses = ref([])
const tutors = ref([])

const fetchCourses = async () => {
  try {
    const res = await api.get('/courses')
    courses.value = (res.data || []).map(c => ({
      id: c.id,
      name: c.name,
      description: c.description || '',
      duration: c.duration || '',
      level: c.level || '',
      price: typeof c.price === 'number' ? c.price : (c.price ? Number(c.price) : 0),
      tutor: c.tutor_name || '',
      teacher_id: c.assigned_tutor_id,
      students: c.students || []
    }))
  } catch (error) {
    console.error('Failed to fetch courses:', error)
  }
}

const fetchTutors = async () => {
  try {
    const res = await api.get('/users/teachers')
    tutors.value = (res.data || []).map(t => ({
      ...t,
      surname: t.surname || ''
    }))
  } catch (error) {
    console.error('Failed to fetch tutors:', error)
  }
}

onMounted(async () => {
  await Promise.all([fetchCourses(), fetchTutors()])
})

const openAddModal = () => {
  selectedCourse.value = null
  showModal.value = true
}

const openEditModal = (course) => {
  selectedCourse.value = { ...course }
  showModal.value = true
}

const closeModal = () => {
  showModal.value = false
  selectedCourse.value = null
}

const handleSave = async (courseData) => {
  try {
    const payload = {
      name: courseData.title ?? courseData.name,
      description: courseData.description,
      duration: courseData.duration,
      level: courseData.level,
      price: courseData.price,
      assigned_tutor_id: courseData.teacher_id ?? courseData.teacherId
    }

    if (selectedCourse.value && selectedCourse.value.id) {
      await api.put(`/courses/${selectedCourse.value.id}`, payload)
    } else {
      await api.post('/courses', payload)
    }

    await fetchCourses()
    closeModal()
  } catch (error) {
    console.error('Failed to save course:', error)
    alert('Failed to save course')
  }
}

const confirmDelete = (course) => {
  courseToDelete.value = course
  showDeleteModal.value = true
}

const handleDelete = async () => {
  if (!courseToDelete.value) return

  try {
    await api.delete(`/courses/${courseToDelete.value.id}`)
    await fetchCourses()
    showDeleteModal.value = false
    courseToDelete.value = null
  } catch (error) {
    console.error('Failed to delete course:', error)
    alert('Failed to delete course')
  }
}
</script>


