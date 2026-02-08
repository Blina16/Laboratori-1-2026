<template>
  <div class="min-h-[calc(100vh-4rem)] bg-gray-50">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <!-- Header -->
      <div class="mb-8">
        <h1 class="text-3xl font-bold text-gray-900 mb-2">Available Courses</h1>
        <p class="text-gray-600">Explore our comprehensive course offerings and find the perfect fit for your learning goals</p>
      </div>

      <!-- Search and Filters -->
      <div class="bg-white rounded-xl shadow-sm p-6 border border-gray-100 mb-8">
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
          <!-- Search -->
          <div class="md:col-span-2">
            <label class="block text-sm font-medium text-gray-700 mb-2">Search Courses</label>
            <div class="relative">
              <input
                v-model="searchQuery"
                type="text"
                placeholder="Search by course name, description, or tutor..."
                class="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
              />
              <svg class="w-5 h-5 text-gray-400 absolute left-3 top-2.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
          </div>
          
          <!-- Level Filter -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Level</label>
            <select
              v-model="selectedLevel"
              class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
            >
              <option value="">All Levels</option>
              <option value="Beginner">Beginner</option>
              <option value="Intermediate">Intermediate</option>
              <option value="Advanced">Advanced</option>
              <option value="Expert">Expert</option>
            </select>
          </div>
        </div>

        <!-- Price Range Filter -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Min Price: ${{ minPrice }}</label>
            <input
              v-model="minPrice"
              type="range"
              min="0"
              max="500"
              step="10"
              class="w-full"
            />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Max Price: ${{ maxPrice }}</label>
            <input
              v-model="maxPrice"
              type="range"
              min="0"
              max="500"
              step="10"
              class="w-full"
            />
          </div>
        </div>
      </div>

      <!-- Results Count -->
      <div class="mb-6 flex justify-between items-center">
        <p class="text-gray-600">
          Found <span class="font-semibold text-gray-900">{{ filteredCourses.length }}</span> courses
        </p>
        <div class="flex items-center gap-2">
          <label class="text-sm text-gray-600">Sort by:</label>
          <select
            v-model="sortBy"
            class="px-3 py-1 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
          >
            <option value="name">Name</option>
            <option value="price">Price</option>
            <option value="level">Level</option>
          </select>
        </div>
      </div>

      <!-- Courses Grid -->
      <div v-if="loading" class="flex justify-center py-12">
        <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>

      <div v-if="!loading && filteredCourses.length === 0" class="text-center py-12">
        <svg class="w-16 h-16 mx-auto mb-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
        </svg>
        <h3 class="text-lg font-medium text-gray-900 mb-2">No courses found</h3>
        <p class="text-gray-600">Try adjusting your search criteria or filters</p>
      </div>

      <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div
          v-for="course in paginatedCourses"
          :key="course.id"
          class="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-lg transition"
        >
          <!-- Course Header -->
          <div class="p-6">
            <div class="flex items-start space-x-4">
              <div class="w-16 h-16 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-lg flex items-center justify-center text-white text-xl font-bold flex-shrink-0">
                {{ course.name.charAt(0) }}
              </div>
              <div class="flex-1 min-w-0">
                <h3 class="text-lg font-semibold text-gray-900 truncate">{{ course.name }}</h3>
                <p class="text-sm text-gray-600 mb-2">{{ course.description || 'Comprehensive course covering essential topics' }}</p>
                
                <!-- Level Badge -->
                <span
                  v-if="course.level"
                  class="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium mb-2"
                  :class="{
                    'bg-green-100 text-green-800': course.level === 'Beginner',
                    'bg-blue-100 text-blue-800': course.level === 'Intermediate',
                    'bg-purple-100 text-purple-800': course.level === 'Advanced',
                    'bg-red-100 text-red-800': course.level === 'Expert'
                  }"
                >
                  {{ course.level }}
                </span>
              </div>
            </div>
          </div>

            <!-- Course Details -->
            <div class="space-y-3 mt-4">
              <!-- Duration -->
              <div class="flex items-center text-sm text-gray-600">
                <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                {{ course.duration || 'Flexible duration' }}
              </div>

              <!-- Price -->
              <div class="flex items-center justify-between">
                <div class="flex items-center text-sm">
                  <svg class="w-4 h-4 mr-2 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                  </svg>
                  <span class="font-semibold text-gray-900">
                    {{ course.price ? `$${course.price.toFixed(2)}` : 'Free' }}
                  </span>
                </div>
              </div>

              <!-- Tutor -->
              <div v-if="course.tutor" class="flex items-center text-sm text-gray-600">
                <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
                {{ course.tutor }}
              </div>

              <!-- Students Count -->
              <div class="flex items-center text-sm text-gray-600">
                <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
                {{ course.students ? course.students.length : 0 }} students enrolled
              </div>
            </div>
          </div>

          <!-- Actions -->
          <div class="px-6 pb-6">
            <div class="flex space-x-3">
              <button
                @click="viewCourseDetails(course)"
                class="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition"
              >
                View Details
              </button>
              <button
                @click="enrollCourse(course)"
                class="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
              >
                Enroll Now
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Pagination -->
      <div v-if="totalPages > 1" class="mt-8 flex justify-center">
        <div class="flex items-center space-x-2">
          <button
            @click="currentPage--"
            :disabled="currentPage === 1"
            class="px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition"
          >
            Previous
          </button>
          <span class="px-4 py-2 text-sm text-gray-600">
            Page {{ currentPage }} of {{ totalPages }}
          </span>
          <button
            @click="currentPage++"
            :disabled="currentPage === totalPages"
            class="px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import api from '@/services/api'

defineOptions({
  name: 'StudentCoursesView'
})

const courses = ref([])
const loading = ref(true)
const searchQuery = ref('')
const selectedLevel = ref('')
const minPrice = ref(0)
const maxPrice = ref(500)
const sortBy = ref('name')
const currentPage = ref(1)
const coursesPerPage = 9

const fetchCourses = async () => {
  try {
    const response = await api.get('/courses')
    courses.value = (response.data || []).map(course => ({
      id: course.id,
      name: course.title || course.name,
      description: course.description || '',
      duration: course.duration || '',
      level: course.level || '',
      price: typeof course.price === 'number' ? course.price : (course.price ? Number(course.price) : 0),
      tutor: course.tutor_name || '',
      teacher_id: course.teacher_id,
      students: course.students || []
    }))
  } catch (error) {
    console.error('Failed to fetch courses:', error)
    courses.value = []
  } finally {
    loading.value = false
  }
}

const filteredCourses = computed(() => {
  let filtered = courses.value

  // Search filter
  if (searchQuery.value) {
    const search = searchQuery.value.toLowerCase()
    filtered = filtered.filter(course => 
      course.name.toLowerCase().includes(search) ||
      (course.description && course.description.toLowerCase().includes(search)) ||
      (course.tutor && course.tutor.toLowerCase().includes(search))
    )
  }

  // Level filter
  if (selectedLevel.value) {
    filtered = filtered.filter(course => course.level === selectedLevel.value)
  }

  // Price filter
  filtered = filtered.filter(course => {
    const price = course.price || 0
    return price >= minPrice.value && price <= maxPrice.value
  })

  // Sort
  filtered.sort((a, b) => {
    switch (sortBy.value) {
      case 'name':
        return a.name.localeCompare(b.name)
      case 'price':
        return a.price - b.price
      case 'level':
        const levelOrder = { 'Beginner': 1, 'Intermediate': 2, 'Advanced': 3, 'Expert': 4 }
        return (levelOrder[a.level] || 0) - (levelOrder[b.level] || 0)
      default:
        return 0
    }
  })

  return filtered
})

const totalPages = computed(() => {
  return Math.ceil(filteredCourses.value.length / coursesPerPage)
})

const paginatedCourses = computed(() => {
  const start = (currentPage.value - 1) * coursesPerPage
  const end = start + coursesPerPage
  return filteredCourses.value.slice(start, end)
})

const viewCourseDetails = (course) => {
  alert(`Course details for "${course.name}" - Full course page coming soon!`)
}

const enrollCourse = (course) => {
  alert(`Enrollment for "${course.name}" - Enrollment system coming soon!`)
}

// Reset pagination when filters change
const resetPagination = () => {
  currentPage.value = 1
}

// Watch for filter changes
watch([searchQuery, selectedLevel, minPrice, maxPrice, sortBy], resetPagination)

onMounted(() => {
  fetchCourses()
})
</script>
