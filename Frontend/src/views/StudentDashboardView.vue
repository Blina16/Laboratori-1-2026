<template>
  <div class="min-h-screen bg-gray-50 flex">
    <!-- Left Sidebar -->
    <div class="w-64 bg-white shadow-lg">
      <div class="p-6">
        <h2 class="text-xl font-bold text-gray-900 mb-6">Menu</h2>
        <nav class="space-y-2">
          <button
            @click="showTutors = true"
            :class="['w-full text-left px-4 py-3 rounded-lg transition', showTutors ? 'bg-blue-600 text-white' : 'text-gray-700 hover:bg-gray-100']"
          >
            <div class="flex items-center">
              <svg class="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
              Tutors
            </div>
          </button>
        </nav>
      </div>
    </div>
    <!-- Main Content -->
    <div class="flex-1 relative">
      <!-- Favorites Menu (Corner) -->
      <div class="absolute top-4 right-4 z-40">
        <div class="relative">
          <button
            @click="showFavorites = !showFavorites"
            class="bg-white rounded-lg shadow-lg p-3 hover:shadow-xl transition relative"
          >
            <svg class="w-6 h-6 text-red-500" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
            </svg>
            <span v-if="favoriteTutors.length > 0" class="absolute -top-1 -right-1 bg-blue-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
              {{ favoriteTutors.length }}
            </span>
          </button>

          <!-- Favorites Dropdown -->
          <div v-if="showFavorites" class="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-xl border border-gray-200 max-h-96 overflow-y-auto">
            <div class="p-4 border-b border-gray-200">
              <h3 class="font-semibold text-gray-900">Favorite Tutors</h3>
            </div>
            <div v-if="favoriteTutors.length === 0" class="p-4 text-gray-500 text-center">
              No favorite tutors yet
            </div>
            <div v-else class="divide-y divide-gray-100">
              <div
                v-for="tutor in favoriteTutors"
                :key="tutor.id"
                @click="selectedTutor = tutor; showFavorites = false"
                class="p-4 hover:bg-gray-50 cursor-pointer transition"
              >
                <div class="flex items-center space-x-3">
                  <img
                    :src="tutor.photo"
                    :alt="tutor.name"
                    class="w-12 h-12 rounded-full object-cover"
                  >
                  <div class="flex-1">
                    <h4 class="font-medium text-gray-900">{{ tutor.name }} {{ tutor.surname }}</h4>
                    <p class="text-sm text-gray-600">{{ tutor.specialty }}</p>
                    <p class="text-sm font-semibold text-blue-600">${{ tutor.cost }}/hour</p>
                  </div>
                  <button
                    @click.stop="toggleFavorite(tutor)"
                    class="text-red-500 hover:text-red-600"
                  >
                    <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <!-- Tutors Section -->
        <div v-if="showTutors">
          <h1 class="text-3xl font-bold text-gray-900 mb-8">Available Tutors</h1>

          <!-- Loading State -->
          <div v-if="isLoading" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div v-for="i in 6" :key="i" class="bg-white rounded-xl shadow-sm p-6 border border-gray-100 animate-pulse">
              <div class="flex items-start justify-between mb-4">
                <div class="flex items-center space-x-4">
                  <div class="w-16 h-16 bg-gray-200 rounded-full"></div>
                  <div class="flex-1">
                    <div class="h-5 bg-gray-200 rounded mb-2"></div>
                    <div class="h-4 bg-gray-200 rounded w-3/4"></div>
                  </div>
                </div>
                <div class="w-9 h-9 bg-gray-200 rounded-full"></div>
              </div>
              <div class="space-y-2 mb-4">
                <div class="h-4 bg-gray-200 rounded"></div>
                <div class="h-4 bg-gray-200 rounded"></div>
                <div class="h-4 bg-gray-200 rounded w-5/6"></div>
              </div>
              <div class="flex items-center justify-between">
                <div class="h-6 bg-gray-200 rounded w-20"></div>
                <div class="h-8 bg-gray-200 rounded w-24"></div>
              </div>
            </div>
          </div>

          <!-- Tutors Grid -->
          <div v-else-if="tutors.length > 0" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div
              v-for="tutor in tutors"
              :key="tutor.id"
              class="bg-white rounded-xl shadow-sm p-6 border border-gray-100 hover:shadow-md transition"
            >
              <div class="flex items-start justify-between mb-4">
                <div class="flex items-center space-x-4">
                  <img
                    :src="tutor.photo"
                    :alt="tutor.name"
                    class="w-16 h-16 rounded-full object-cover"
                  >
                  <div>
                    <h3 class="text-lg font-semibold text-gray-900">{{ tutor.name }} {{ tutor.surname }}</h3>
                    <p class="text-sm text-gray-600">{{ tutor.specialty }}</p>
                  </div>
                </div>
                <button
                  @click="toggleFavorite(tutor)"
                  :class="['p-2 rounded-full transition', isFavorite(tutor) ? 'text-red-500 bg-red-50' : 'text-gray-400 hover:text-red-500']"
                >
                  <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
                  </svg>
                </button>
              </div>
              <p class="text-gray-700 text-sm mb-4 line-clamp-3">{{ tutor.bio }}</p>
              <div class="flex items-center justify-between">
                <span class="text-lg font-bold text-blue-600">${{ tutor.cost }}/hour</span>
                <button
                  @click="selectedTutor = tutor"
                  class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition text-sm"
                >
                  View Profile
                </button>
              </div>
            </div>
          </div>

          <!-- No Tutors State -->
          <div v-else class="text-center py-12">
            <div class="w-24 h-24 bg-gray-200 rounded-full mx-auto mb-4 flex items-center justify-center">
              <svg class="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
            </div>
            <h3 class="text-xl font-semibold text-gray-900 mb-2">No Tutors Available</h3>
            <p class="text-gray-600">Check back later for available tutors.</p>
          </div>
        </div>

        <!-- Selected Tutor Profile -->
        <div v-if="selectedTutor" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" @click="selectedTutor = null">
          <div class="bg-white rounded-xl shadow-xl max-w-2xl w-full mx-4" @click.stop>
            <div class="p-6">
              <div class="flex justify-between items-start mb-6">
                <h2 class="text-2xl font-bold text-gray-900">Tutor Profile</h2>
                <button
                  @click="selectedTutor = null"
                  class="text-gray-400 hover:text-gray-600"
                >
                  <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <div class="flex items-center space-x-6 mb-6">
                <img
                  :src="selectedTutor.photo"
                  :alt="selectedTutor.name"
                  class="w-24 h-24 rounded-full object-cover"
                >
                <div class="flex-1">
                  <div class="flex items-center space-x-3">
                    <h3 class="text-2xl font-bold text-gray-900">{{ selectedTutor.name }} {{ selectedTutor.surname }}</h3>
                    <button
                      @click="toggleFavorite(selectedTutor)"
                      :class="['p-2 rounded-full transition', isFavorite(selectedTutor) ? 'text-red-500 bg-red-50' : 'text-gray-400 hover:text-red-500']"
                    >
                      <svg class="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
                      </svg>
                    </button>
                  </div>
                  <p class="text-lg text-gray-600 mb-2">{{ selectedTutor.specialty }}</p>
                  <div class="flex items-center space-x-4 mb-2">
                    <p class="text-2xl font-bold text-blue-600">${{ selectedTutor.cost }}/hour</p>
                    <div v-if="selectedTutor.experience" class="flex items-center text-sm text-gray-600">
                      <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      {{ selectedTutor.experience }} years experience
                    </div>
                  </div>
                  <div v-if="selectedTutor.rating" class="flex items-center space-x-2">
                    <div class="flex items-center">
                      <svg class="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                      </svg>
                      <span class="ml-1 text-sm font-medium text-gray-900">{{ selectedTutor.rating.toFixed(1) }}</span>
                    </div>
                    <span class="text-sm text-gray-600">({{ selectedTutor.total_reviews }} reviews)</span>
                    <span class="text-sm text-gray-600">• {{ selectedTutor.total_sessions }} sessions</span>
                  </div>
                </div>
              </div>

              <div class="mb-6">
                <h4 class="text-lg font-semibold text-gray-900 mb-3">About</h4>
                <p class="text-gray-700">{{ selectedTutor.bio }}</p>
              </div>

              <div class="mb-6">
                <h4 class="text-lg font-semibold text-gray-900 mb-3">Expertise</h4>
                <div class="flex flex-wrap gap-2">
                  <span
                    v-for="skill in selectedTutor.skills"
                    :key="skill"
                    class="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm"
                  >
                    {{ skill }}
                  </span>
                </div>
              </div>

              <div class="flex space-x-4">
                <button
                  @click="openBookingModal(selectedTutor)"
                  class="flex-1 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                >
                  Book Session
                </button>
                <button class="flex-1 px-6 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition">
                  Send Message
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- Booking Modal -->
        <div v-if="showBookingModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" @click="closeBookingModal">
          <div class="bg-white rounded-xl shadow-xl max-w-md w-full mx-4" @click.stop>
            <div class="p-6">
              <div class="flex justify-between items-start mb-6">
                <h2 class="text-2xl font-bold text-gray-900">Book a Session</h2>
                <button
                  @click="closeBookingModal"
                  class="text-gray-400 hover:text-gray-600"
                >
                  <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <div class="mb-6">
                <div class="flex items-center space-x-4 mb-6">
                  <img
                    :src="bookingTutor.photo"
                    :alt="bookingTutor.name"
                    class="w-16 h-16 rounded-full object-cover"
                  >
                  <div>
                    <h3 class="text-lg font-semibold text-gray-900">{{ bookingTutor.name }} {{ bookingTutor.surname }}</h3>
                    <p class="text-sm text-gray-600">{{ bookingTutor.specialty }}</p>
                    <p class="text-lg font-bold text-blue-600">${{ bookingTutor.cost }}/hour</p>
                  </div>
                </div>

                <div class="space-y-4">
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">Subject</label>
                    <input
                      v-model="bookingForm.subject"
                      type="text"
                      class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="e.g., Mathematics, Physics, etc."
                    >
                  </div>

                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">Date</label>
                    <input
                      v-model="bookingForm.date"
                      type="date"
                      class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      :min="new Date().toISOString().split('T')[0]"
                    >
                  </div>

                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">Time</label>
                    <input
                      v-model="bookingForm.time"
                      type="time"
                      class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                  </div>

                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">Duration (minutes)</label>
                    <select
                      v-model="bookingForm.duration"
                      class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="30">30 minutes</option>
                      <option value="60">1 hour</option>
                      <option value="90">1.5 hours</option>
                      <option value="120">2 hours</option>
                    </select>
                  </div>

                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">Notes (optional)</label>
                    <textarea
                      v-model="bookingForm.notes"
                      rows="3"
                      class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Any specific topics or requirements..."
                    ></textarea>
                  </div>
                </div>

                <div class="mt-6 p-4 bg-gray-50 rounded-lg">
                  <div class="flex justify-between items-center">
                    <span class="text-gray-600">Estimated Cost:</span>
                    <span class="text-2xl font-bold text-blue-600">${{ estimatedCost }}</span>
                  </div>
                </div>
              </div>

              <div class="flex space-x-4">
                <button
                  @click="submitBooking"
                  :disabled="isSubmitting"
                  class="flex-1 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {{ isSubmitting ? 'Booking...' : 'Confirm Booking' }}
                </button>
                <button
                  @click="closeBookingModal"
                  class="flex-1 px-6 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import api from '@/services/api'

defineOptions({
  name: 'StudentDashboard'
})

const showTutors = ref(true)
const selectedTutor = ref(null)
const showFavorites = ref(false)
const favoriteTutors = ref([])
const showBookingModal = ref(false)
const bookingTutor = ref(null)
const isSubmitting = ref(false)
const isLoading = ref(true)

const bookingForm = ref({
  subject: '',
  date: '',
  time: '',
  duration: '60',
  notes: ''
})

const tutors = ref([])

const estimatedCost = computed(() => {
  if (!bookingTutor.value || !bookingForm.value.duration) return 0
  const hourlyRate = bookingTutor.value.price_per_hour || bookingTutor.value.cost || 0
  const duration = parseInt(bookingForm.value.duration)
  return (hourlyRate * duration / 60).toFixed(2)
})

const isFavorite = (tutor) => {
  return favoriteTutors.value.some(fav => fav.id === tutor.id)
}

const toggleFavorite = (tutor) => {
  const index = favoriteTutors.value.findIndex(fav => fav.id === tutor.id)
  if (index > -1) {
    favoriteTutors.value.splice(index, 1)
  } else {
    favoriteTutors.value.push(tutor)
  }
  saveFavorites()
}

const saveFavorites = () => {
  localStorage.setItem('favoriteTutors', JSON.stringify(favoriteTutors.value))
}

const loadFavorites = () => {
  const saved = localStorage.getItem('favoriteTutors')
  if (saved) {
    favoriteTutors.value = JSON.parse(saved)
  }
}

const fetchTutors = async () => {
  try {
    isLoading.value = true
    const response = await api.get('/tutors')

    // Transform the data to match the frontend structure
    tutors.value = response.data.map(tutor => ({
      id: tutor.id,
      name: tutor.name.split(' ')[0] || tutor.name || 'Unknown',
      surname: tutor.name.split(' ').slice(1).join(' ') || '',
      photo: `https://picsum.photos/seed/tutor${tutor.id}/200/200.jpg`,
      specialty: tutor.subject || 'General Tutoring',
      bio: tutor.bio || 'Experienced tutor passionate about helping students succeed and achieve their academic goals.',
      cost: tutor.price_per_hour || 50,
      skills: tutor.courses || [], // Use courses as skills
      experience: tutor.experience || 0,
      rating: 4.8, // Default rating since backend doesn't provide it yet
      total_sessions: tutor.total_sessions || 0,
      total_reviews: 0 // Default since backend doesn't provide it yet
    }))

    console.log('Fetched tutors from admin panel:', tutors.value)
  } catch (error) {
    console.error('Error fetching tutors:', error)
    tutors.value = []
  } finally {
    isLoading.value = false
  }
}

const openBookingModal = (tutor) => {
  bookingTutor.value = tutor
  bookingForm.value = {
    subject: tutor.specialty,
    date: '',
    time: '',
    duration: '60',
    notes: ''
  }
  showBookingModal.value = true
}

const closeBookingModal = () => {
  showBookingModal.value = false
  bookingTutor.value = null
  bookingForm.value = {
    subject: '',
    date: '',
    time: '',
    duration: '60',
    notes: ''
  }
}

const submitBooking = async () => {
  if (!bookingForm.value.date || !bookingForm.value.time) {
    alert('Please select both date and time for the session')
    return
  }

  // Validate date is in the future
  const selectedDateTime = new Date(`${bookingForm.value.date}T${bookingForm.value.time}`)
  const now = new Date()
  if (selectedDateTime <= now) {
    alert('Please select a future date and time for your session')
    return
  }

  isSubmitting.value = true

  try {
    // Get current user from localStorage
    const userData = localStorage.getItem('user')
    if (!userData) {
      throw new Error('User not logged in')
    }

    const user = JSON.parse(userData)

    // Combine date and time - format properly for MySQL
    const scheduledDateTime = new Date(`${bookingForm.value.date}T${bookingForm.value.time}`)

    // Format date for MySQL (YYYY-MM-DD HH:MM:SS)
    const mysqlDateTime = scheduledDateTime.toISOString().slice(0, 19).replace('T', ' ')

    const bookingData = {
      student_id: user.id || 1,
      tutor_id: bookingTutor.value.id,
      subject: bookingForm.value.subject || bookingTutor.value.specialty,
      scheduled_date: mysqlDateTime,
      duration_minutes: parseInt(bookingForm.value.duration),
      notes: bookingForm.value.notes,
      price: parseFloat(estimatedCost.value)
    }

    console.log('Sending booking data:', bookingData)

    const response = await api.post('/bookings', bookingData)
    const result = response.data

    console.log('Booking response:', result)

    alert('Session booked successfully! 🎉')
    closeBookingModal()

  } catch (error) {
    console.error('Booking error:', error)

    // Show more detailed error message
    let errorMessage = 'Failed to book session. Please try again.'

    if (error.response) {
      // Server responded with error
      errorMessage = error.response.data?.message || errorMessage
      console.log('Server error:', error.response.data)
    } else if (error.request) {
      // Network error
      errorMessage = 'Network error. Please check your connection.'
    } else {
      // Other error
      errorMessage = error.message || errorMessage
    }

    alert(errorMessage)
  } finally {
    isSubmitting.value = false
  }
}

onMounted(() => {
  loadFavorites()
  fetchTutors()
})
</script>
