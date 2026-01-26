<template>
  <div class="min-h-[calc(100vh-4rem)] bg-gray-50">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <!-- Header -->
      <div class="mb-8 flex justify-between items-start">
        <div>
          <h1 class="text-3xl font-bold text-gray-900 mb-2">Find Tutors</h1>
          <p class="text-gray-600">Discover and connect with expert tutors for your learning needs</p>
        </div>
        <button
          @click="handleLogout"
          class="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition flex items-center gap-2"
        >
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
          </svg>
          Logout
        </button>
      </div>

      <!-- Search and Filters -->
      <div class="bg-white rounded-xl shadow-sm p-6 border border-gray-100 mb-8">
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
          <!-- Search -->
          <div class="md:col-span-2">
            <label class="block text-sm font-medium text-gray-700 mb-2">Search Tutors</label>
            <div class="relative">
              <input
                v-model="searchQuery"
                type="text"
                placeholder="Search by name, subject, or bio..."
                class="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
              />
              <svg class="w-5 h-5 text-gray-400 absolute left-3 top-2.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
          </div>
          
          <!-- Subject Filter -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Subject</label>
            <select
              v-model="selectedSubject"
              class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
            >
              <option value="">All Subjects</option>
              <option v-for="subject in subjects" :key="subject" :value="subject">
                {{ subject }}
              </option>
            </select>
          </div>
        </div>

        <!-- Price Range Filter -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Min Price: ${{ minPrice }}/hour</label>
            <input
              v-model="minPrice"
              type="range"
              min="0"
              max="200"
              step="10"
              class="w-full"
            />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Max Price: ${{ maxPrice }}/hour</label>
            <input
              v-model="maxPrice"
              type="range"
              min="0"
              max="200"
              step="10"
              class="w-full"
            />
          </div>
        </div>
      </div>

      <!-- Results Count -->
      <div class="mb-6 flex justify-between items-center">
        <p class="text-gray-600">
          Found <span class="font-semibold text-gray-900">{{ filteredTutors.length }}</span> tutors
        </p>
        <div class="flex items-center gap-2">
          <label class="text-sm text-gray-600">Sort by:</label>
          <select
            v-model="sortBy"
            class="px-3 py-1 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
          >
            <option value="name">Name</option>
            <option value="price">Price</option>
            <option value="rating">Rating</option>
          </select>
        </div>
      </div>

      <!-- Tutors Grid -->
      <div v-if="loading" class="flex justify-center py-12">
        <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>

      <div v-else-if="filteredTutors.length === 0" class="text-center py-12">
        <svg class="w-16 h-16 mx-auto mb-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
        </svg>
        <h3 class="text-lg font-medium text-gray-900 mb-2">No tutors found</h3>
        <p class="text-gray-600">Try adjusting your search criteria or filters</p>
      </div>

      <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div
          v-for="tutor in paginatedTutors"
          :key="tutor.id"
          class="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-lg transition"
        >
          <!-- Tutor Header -->
          <div class="p-6">
            <div class="flex items-start space-x-4">
              <div class="w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center text-white text-xl font-bold flex-shrink-0">
                {{ tutor.name.charAt(0) }}{{ tutor.surname ? tutor.surname.charAt(0) : '' }}
              </div>
              <div class="flex-1 min-w-0">
                <h3 class="text-lg font-semibold text-gray-900 truncate">{{ tutor.name }} {{ tutor.surname || '' }}</h3>
                <p class="text-sm text-gray-600 mb-2">{{ tutor.subject || 'General Tutoring' }}</p>
                <div class="flex items-center space-x-4 text-sm text-gray-500">
                  <div class="flex items-center">
                    <svg class="w-4 h-4 mr-1 text-yellow-400" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                    </svg>
                    <span>{{ tutor.rating || '4.8' }}</span>
                  </div>
                  <div class="flex items-center">
                    <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                    </svg>
                    <span>${{ tutor.price_per_hour || '50' }}/hr</span>
                  </div>
                </div>
              </div>
            </div>
            
            <!-- Bio -->
            <p class="text-gray-600 text-sm mt-4 line-clamp-3">
              {{ tutor.bio || 'Experienced tutor passionate about helping students succeed and achieve their academic goals.' }}
            </p>

            <!-- Experience -->
            <div class="flex items-center mt-4 text-sm text-gray-500">
              <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
              {{ tutor.experience || 0 }} years experience
            </div>
          </div>

          <!-- Actions -->
          <div class="px-6 pb-6">
            <div class="flex space-x-3">
              <button
                @click="viewProfile(tutor)"
                class="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition"
              >
                View Profile
              </button>
              <button
                @click="bookSession(tutor)"
                class="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
              >
                Book Session
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
import { logout } from '@/utils/auth'
import BookingModal from '../components/BookingModal.vue'

defineOptions({
  name: 'StudentTutorsView'
})

const user = ref({})
const tutors = ref([])
const loading = ref(true)
const searchQuery = ref('')
const selectedSubject = ref('')
const minPrice = ref(0)
const maxPrice = ref(200)
const sortBy = ref('name')
const currentPage = ref(1)
const tutorsPerPage = 9

// Booking modal state
const showBookingModal = ref(false)
const selectedTutor = ref(null)

const subjects = computed(() => {
  const uniqueSubjects = new Set(tutors.value.map(tutor => tutor.subject).filter(Boolean))
  return Array.from(uniqueSubjects).sort()
})

const filteredTutors = computed(() => {
  let filtered = tutors.value

  // Search filter
  if (searchQuery.value) {
    const search = searchQuery.value.toLowerCase()
    filtered = filtered.filter(tutor => 
      tutor.name.toLowerCase().includes(search) ||
      (tutor.subject && tutor.subject.toLowerCase().includes(search)) ||
      (tutor.bio && tutor.bio.toLowerCase().includes(search))
    )
  }

  // Subject filter
  if (selectedSubject.value) {
    filtered = filtered.filter(tutor => tutor.subject === selectedSubject.value)
  }

  // Price filter
  filtered = filtered.filter(tutor => {
    const price = tutor.price_per_hour || 50
    return price >= minPrice.value && price <= maxPrice.value
  })

  // Sort
  filtered.sort((a, b) => {
    switch (sortBy.value) {
      case 'name':
        return a.name.localeCompare(b.name)
      case 'price':
        return (a.price_per_hour || 50) - (b.price_per_hour || 50)
      case 'rating':
        return (b.rating || 4.8) - (a.rating || 4.8)
      default:
        return 0
    }
  })

  return filtered
})

const totalPages = computed(() => {
  return Math.ceil(filteredTutors.value.length / tutorsPerPage)
})

const paginatedTutors = computed(() => {
  const start = (currentPage.value - 1) * tutorsPerPage
  const end = start + tutorsPerPage
  return filteredTutors.value.slice(start, end)
})

const fetchTutors = async () => {
  try {
    const response = await api.get('/tutors')
    tutors.value = response.data.map(teacher => ({
      ...teacher,
      // Ensure consistent data structure with admin page
      surname: teacher.name.split(' ').slice(1).join('') || '',
      email: teacher.email,
      subject: teacher.subject || 'Not specified',
      experience: teacher.experience || 0,
      price_per_hour: teacher.price_per_hour || 50,
      rating: teacher.rating || 4.8,
      bio: teacher.bio || 'Experienced tutor passionate about helping students succeed and achieve their academic goals.',
      students: teacher.students || [],
      courses: teacher.courses || []
    }))
  } catch (error) {
    console.error('Failed to fetch tutors:', error)
    tutors.value = []
  } finally {
    loading.value = false
  }
}

const viewProfile = (tutor) => {
  // TODO: Navigate to tutor profile page or show modal
  console.log('View profile:', tutor)
  alert(`Viewing profile for ${tutor.name} - Profile page coming soon!`)
}

const bookSession = (tutor) => {
  selectedTutor.value = tutor
  showBookingModal.value = true
}

const closeBookingModal = () => {
  showBookingModal.value = false
  selectedTutor.value = null
}

const handleBookingSuccess = (bookingData) => {
  // Show success message
  alert(`Session successfully booked with ${bookingData.teacher_name || selectedTutor.value.name}!`)
  // TODO: Refresh the student's sessions or redirect to calendar
}

const handleLogout = () => {
  logout()
}

// Reset pagination when filters change
const resetPagination = () => {
  currentPage.value = 1
}

// Watch for filter changes
watch([searchQuery, selectedSubject, minPrice, maxPrice, sortBy], resetPagination)

onMounted(() => {
  const userData = localStorage.getItem('user')
  if (userData) {
    user.value = JSON.parse(userData)
  }
  fetchTutors()
})
</script>

<style scoped>
.line-clamp-3 {
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>
