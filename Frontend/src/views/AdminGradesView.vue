<template>
  <div class="flex">
    <AdminSidebar />
    <div class="flex-1 ml-64">
      <div class="min-h-[calc(100vh-4rem)] bg-gray-50 p-8">
        <div class="max-w-7xl mx-auto">
          <!-- Header -->
          <div class="mb-8 flex items-center justify-between">
            <div>
              <h1 class="text-3xl font-bold text-gray-900 mb-2">Grade Management</h1>
              <p class="text-gray-600">Manage student grades, assignments, and academic performance</p>
            </div>
            <button
              @click="showModal = true; selectedGrade = null"
              class="btn-primary flex items-center gap-2"
            >
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
              </svg>
              Add Grade
            </button>
          </div>

          <!-- Statistics Cards -->
          <div class="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div class="flex items-center justify-between">
                <div>
                  <p class="text-sm text-gray-600 mb-1">Total Grades</p>
                  <p class="text-2xl font-bold text-gray-900">{{ stats.total_grades || 0 }}</p>
                </div>
                <div class="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                  <svg class="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
              </div>
            </div>

            <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div class="flex items-center justify-between">
                <div>
                  <p class="text-sm text-gray-600 mb-1">Average Grade</p>
                  <p class="text-2xl font-bold text-gray-900">{{ Math.round(stats.average_grade || 0) }}%</p>
                </div>
                <div class="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                  <svg class="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                </div>
              </div>
            </div>

            <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div class="flex items-center justify-between">
                <div>
                  <p class="text-sm text-gray-600 mb-1">Highest Grade</p>
                  <p class="text-2xl font-bold text-gray-900">{{ Math.round(stats.highest_grade || 0) }}%</p>
                </div>
                <div class="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center">
                  <svg class="w-6 h-6 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                  </svg>
                </div>
              </div>
            </div>

            <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div class="flex items-center justify-between">
                <div>
                  <p class="text-sm text-gray-600 mb-1">Students with Grades</p>
                  <p class="text-2xl font-bold text-gray-900">{{ stats.students_with_grades || 0 }}</p>
                </div>
                <div class="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                  <svg class="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                  </svg>
                </div>
              </div>
            </div>
          </div>

          <!-- Filters -->
          <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
            <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Filter by Student</label>
                <select
                  v-model="filters.student_id"
                  class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                  @change="fetchGrades"
                >
                  <option value="">All Students</option>
                  <option
                    v-for="student in students"
                    :key="student.id"
                    :value="student.id"
                  >
                    {{ student.name }} {{ student.surname || '' }}
                  </option>
                </select>
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Filter by Subject</label>
                <select
                  v-model="filters.subject"
                  class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                  @change="fetchGrades"
                >
                  <option value="">All Subjects</option>
                  <option
                    v-for="subject in uniqueSubjects"
                    :key="subject"
                    :value="subject"
                  >
                    {{ subject }}
                  </option>
                </select>
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Sort by</label>
                <select
                  v-model="sortBy"
                  class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                  @change="sortGrades"
                >
                  <option value="date-desc">Date (Newest First)</option>
                  <option value="date-asc">Date (Oldest First)</option>
                  <option value="grade-desc">Grade (Highest First)</option>
                  <option value="grade-asc">Grade (Lowest First)</option>
                </select>
              </div>
            </div>
          </div>

          <!-- Grades Table -->
          <div class="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div class="overflow-x-auto">
              <table class="min-w-full divide-y divide-gray-200">
                <thead class="bg-gray-50">
                  <tr>
                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Student
                    </th>
                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Subject
                    </th>
                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Grade
                    </th>
                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Assignment
                    </th>
                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Date
                    </th>
                    <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody class="bg-white divide-y divide-gray-200">
                  <tr v-if="filteredGrades.length === 0">
                    <td colspan="6" class="px-6 py-12 text-center text-gray-500">
                      <svg class="mx-auto h-12 w-12 text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                      <p>No grades found. Click "Add Grade" to get started.</p>
                    </td>
                  </tr>
                  <tr
                    v-for="grade in filteredGrades"
                    :key="grade.id"
                    class="hover:bg-gray-50 transition"
                  >
                    <td class="px-6 py-4 whitespace-nowrap">
                      <div class="flex items-center">
                        <div class="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center text-white font-semibold mr-3">
                          {{ grade.student_name.charAt(0) }}{{ grade.surname?.charAt(0) || '' }}
                        </div>
                        <div>
                          <div class="text-sm font-medium text-gray-900">
                            {{ grade.student_name }} {{ grade.surname || '' }}
                          </div>
                          <div class="text-sm text-gray-500">{{ grade.student_email }}</div>
                        </div>
                      </div>
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap">
                      <div class="text-sm text-gray-900">{{ grade.subject }}</div>
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap">
                      <div class="flex items-center">
                        <span
                          :class="getGradeClass(grade.grade)"
                          class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium"
                        >
                          {{ grade.grade }}%
                        </span>
                      </div>
                    </td>
                    <td class="px-6 py-4">
                      <div class="text-sm text-gray-900">{{ grade.assignment_name || 'N/A' }}</div>
                      <div v-if="grade.comments" class="text-sm text-gray-500 truncate max-w-xs">{{ grade.comments }}</div>
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap">
                      <div class="text-sm text-gray-900">{{ formatDate(grade.date) }}</div>
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button
                        @click="openEditModal(grade)"
                        class="text-blue-600 hover:text-blue-900 mr-4"
                      >
                        Edit
                      </button>
                      <button
                        @click="confirmDelete(grade)"
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

    <!-- Add/Edit Grade Modal -->
    <GradeModal
      v-if="showModal"
      :grade="selectedGrade"
      :students="students"
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
        <h3 class="text-lg font-semibold text-gray-900 mb-2">Delete Grade</h3>
        <p class="text-gray-600 mb-6">
          Are you sure you want to delete the grade for <strong>{{ gradeToDelete?.student_name }}</strong> in <strong>{{ gradeToDelete?.subject }}</strong>? This action cannot be undone.
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
import { ref, onMounted, computed } from 'vue'
import api from '../services/api'
import GradeModal from '../components/GradeModal.vue'
import AdminSidebar from '../components/AdminSidebar.vue'

defineOptions({
  name: 'AdminGradesView'
})

const grades = ref([])
const students = ref([])
const stats = ref({})
const showModal = ref(false)
const showDeleteModal = ref(false)
const selectedGrade = ref(null)
const gradeToDelete = ref(null)

const filters = ref({
  student_id: '',
  subject: ''
})

const sortBy = ref('date-desc')

const fetchGrades = async () => {
  try {
    const response = await api.get('/grades')
    grades.value = response.data
  } catch (error) {
    console.error('Failed to fetch grades:', error)
  }
}

const fetchStudents = async () => {
  try {
    const response = await api.get('/students')
    students.value = response.data
  } catch (error) {
    console.error('Failed to fetch students:', error)
  }
}

const fetchStats = async () => {
  try {
    const response = await api.get('/grades/stats/overview')
    stats.value = response.data.overview
  } catch (error) {
    console.error('Failed to fetch stats:', error)
  }
}

const uniqueSubjects = computed(() => {
  const subjects = [...new Set(grades.value.map(grade => grade.subject))]
  return subjects.sort()
})

const filteredGrades = computed(() => {
  let filtered = [...grades.value]
  
  if (filters.value.student_id) {
    filtered = filtered.filter(grade => grade.student_id == filters.value.student_id)
  }
  
  if (filters.value.subject) {
    filtered = filtered.filter(grade => grade.subject === filters.value.subject)
  }
  
  return filtered
})

const sortGrades = () => {
  const [field, order] = sortBy.value.split('-')
  
  filteredGrades.value.sort((a, b) => {
    let aValue = a[field]
    let bValue = b[field]
    
    if (field === 'date') {
      aValue = new Date(aValue || '1970-01-01')
      bValue = new Date(bValue || '1970-01-01')
    }
    
    if (order === 'asc') {
      return aValue > bValue ? 1 : -1
    } else {
      return aValue < bValue ? 1 : -1
    }
  })
}

const getGradeClass = (grade) => {
  if (grade >= 90) return 'bg-green-100 text-green-800'
  if (grade >= 80) return 'bg-blue-100 text-blue-800'
  if (grade >= 70) return 'bg-yellow-100 text-yellow-800'
  if (grade >= 60) return 'bg-orange-100 text-orange-800'
  return 'bg-red-100 text-red-800'
}

const formatDate = (dateString) => {
  if (!dateString) return 'N/A'
  return new Date(dateString).toLocaleDateString()
}

const openEditModal = (grade) => {
  selectedGrade.value = { ...grade }
  showModal.value = true
}

const closeModal = () => {
  showModal.value = false
  selectedGrade.value = null
}

const handleSave = async (gradeData) => {
  try {
    if (selectedGrade.value && selectedGrade.value.id) {
      // Update existing grade
      await api.put(`/grades/${selectedGrade.value.id}`, gradeData)
    } else {
      // Add new grade
      await api.post('/grades', gradeData)
    }
    await fetchGrades()
    await fetchStats()
    closeModal()
  } catch (error) {
    console.error('Failed to save grade:', error)
    alert('Failed to save grade. Please try again.')
  }
}

const confirmDelete = (grade) => {
  gradeToDelete.value = grade
  showDeleteModal.value = true
}

const handleDelete = async () => {
  try {
    if (gradeToDelete.value) {
      await api.delete(`/grades/${gradeToDelete.value.id}`)
      await fetchGrades()
      await fetchStats()
      showDeleteModal.value = false
      gradeToDelete.value = null
    }
  } catch (error) {
    console.error('Failed to delete grade:', error)
    alert('Failed to delete grade. Please try again.')
  }
}

onMounted(() => {
  fetchGrades()
  fetchStudents()
  fetchStats()
})
</script>
