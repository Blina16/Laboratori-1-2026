<template>
  <div class="flex h-screen bg-gray-50">
    <!-- Sidebar -->
    <div class="w-80 bg-white shadow-lg overflow-y-auto">
      <div class="p-6 border-b border-gray-200">
        <h2 class="text-xl font-bold text-gray-900">Available Tutors</h2>
        <p class="text-sm text-gray-600 mt-1">Find your perfect tutor</p>
      </div>
      
      <!-- Search Bar -->
      <div class="p-4 border-b border-gray-200">
        <div class="relative">
          <input
            v-model="searchQuery"
            type="text"
            placeholder="Search tutors..."
            class="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
          />
          <svg class="absolute left-3 top-2.5 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
      </div>

      <!-- Teacher List -->
      <div class="p-4 space-y-3">
        <div
          v-for="teacher in filteredTeachers"
          :key="teacher.id"
          @click="selectTeacher(teacher)"
          :class="[
            'p-4 rounded-lg cursor-pointer transition-all duration-200 border',
            selectedTeacher?.id === teacher.id
              ? 'bg-blue-50 border-blue-300 shadow-md'
              : 'bg-white border-gray-200 hover:bg-gray-50 hover:border-gray-300'
          ]"
        >
          <div class="flex items-center space-x-3">
            <div class="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center text-white font-bold flex-shrink-0">
              {{ teacher.name?.charAt(0) || 'T' }}
            </div>
            <div class="flex-1 min-w-0">
              <h3 class="font-semibold text-gray-900 truncate">{{ teacher.name }}</h3>
              <p class="text-sm text-gray-600 truncate">{{ teacher.subject || 'Multiple Subjects' }}</p>
              <div class="flex items-center mt-1">
                <span class="text-xs text-gray-500">${{ teacher.price_per_hour || '50' }}/hour</span>
                <span class="mx-2 text-gray-300">•</span>
                <span class="text-xs text-green-600">{{ teacher.available ? 'Available' : 'Unavailable' }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Main Content -->
    <div class="flex-1 overflow-y-auto">
      <div class="max-w-6xl mx-auto p-8">
        <!-- Header -->
        <div class="mb-8">
          <h1 class="text-3xl font-bold text-gray-900">Find Your Tutor</h1>
          <p class="text-gray-600 mt-2">Browse available tutors and book sessions that fit your schedule</p>
        </div>

        <!-- Teacher Details -->
        <div v-if="selectedTeacher" class="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <div class="flex items-start space-x-6 mb-6">
            <div class="w-20 h-20 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center text-white text-2xl font-bold flex-shrink-0">
              {{ selectedTeacher.name?.charAt(0) || 'T' }}
            </div>
            <div class="flex-1">
              <h2 class="text-2xl font-bold text-gray-900 mb-2">{{ selectedTeacher.name }}</h2>
              <p class="text-gray-600 mb-4">{{ selectedTeacher.bio || 'Experienced tutor passionate about helping students succeed' }}</p>
              <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div class="flex items-center space-x-2">
                  <svg class="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                  </svg>
                  <span class="text-sm text-gray-600">${{ selectedTeacher.price_per_hour || '50' }}/hour</span>
                </div>
                <div class="flex items-center space-x-2">
                  <svg class="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                  </svg>
                  <span class="text-sm text-gray-600">{{ selectedTeacher.experience || '5+ years' }} experience</span>
                </div>
                <div class="flex items-center space-x-2">
                  <svg class="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span class="text-sm text-gray-600">{{ selectedTeacher.subject || 'Multiple Subjects' }}</span>
                </div>
              </div>
            </div>
          </div>

          <!-- Booking Section -->
          <div class="border-t border-gray-200 pt-6">
            <h3 class="text-lg font-semibold text-gray-900 mb-4">Book a Session</h3>
            
            <div v-if="!selectedTeacher.available" class="text-center py-8">
              <svg class="w-16 h-16 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <p class="text-gray-500">Teacher is currently unavailable</p>
              <p class="text-sm text-gray-400 mt-1">Please check back later</p>
            </div>

            <div v-else class="space-y-6">
              <!-- Booking Form -->
              <div class="bg-gray-50 rounded-lg p-6">
                <h4 class="font-medium text-gray-900 mb-4">Schedule Your Session</h4>
                
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">Date</label>
                    <input
                      v-model="bookingForm.date"
                      type="date"
                      :min="minDate"
                      class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                    />
                  </div>
                  
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">Time</label>
                    <input
                      v-model="bookingForm.time"
                      type="time"
                      class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                    />
                  </div>
                  
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">Duration (minutes)</label>
                    <select
                      v-model="bookingForm.duration"
                      class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                    >
                      <option value="30">30 minutes</option>
                      <option value="60">60 minutes</option>
                      <option value="90">90 minutes</option>
                      <option value="120">120 minutes</option>
                    </select>
                  </div>
                  
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">Subject</label>
                    <input
                      v-model="bookingForm.subject"
                      type="text"
                      :placeholder="selectedTeacher.subject"
                      class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                    />
                  </div>
                </div>
                
                <div class="mt-4">
                  <label class="block text-sm font-medium text-gray-700 mb-2">Notes (optional)</label>
                  <textarea
                    v-model="bookingForm.notes"
                    rows="3"
                    placeholder="Any specific topics or areas you'd like to focus on..."
                    class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none resize-none"
                  ></textarea>
                </div>
                
                <div class="mt-6 flex items-center justify-between">
                  <div class="text-sm text-gray-600">
                    <span class="font-medium">Estimated cost:</span>
                    ${{ calculateCost() }}
                  </div>
                  
                  <button
                    @click="bookDirectSession"
                    :disabled="!canBook()"
                    class="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {{ isBooking ? 'Booking...' : 'Book Session' }}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- No Teacher Selected -->
        <div v-else class="bg-white rounded-xl shadow-sm p-12 border border-gray-100 text-center">
          <svg class="w-24 h-24 text-gray-300 mx-auto mb-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
          </svg>
          <h3 class="text-xl font-semibold text-gray-900 mb-2">Select a Tutor</h3>
          <p class="text-gray-600">Choose a tutor from the sidebar to view their availability and book sessions</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import api from '@/services/api'

defineOptions({
  name: 'TutoringPage'
})

const teachers = ref([])
const selectedTeacher = ref(null)
const searchQuery = ref('')
const isBooking = ref(false)

// Booking form data
const bookingForm = ref({
  date: '',
  time: '',
  duration: 60,
  subject: '',
  notes: ''
})

const filteredTeachers = computed(() => {
  if (!searchQuery.value) return teachers.value
  
  const query = searchQuery.value.toLowerCase()
  return teachers.value.filter(teacher => 
    teacher.name?.toLowerCase().includes(query) ||
    teacher.subject?.toLowerCase().includes(query) ||
    teacher.bio?.toLowerCase().includes(query)
  )
})

const minDate = computed(() => {
  const today = new Date()
  return today.toISOString().split('T')[0]
})

const fetchTeachers = async () => {
  try {
    const response = await api.get('/tutors')
    teachers.value = response.data
    console.log('Fetched real teachers:', teachers.value)
  } catch (error) {
    console.error('Failed to fetch teachers:', error)
    // Fallback data
    teachers.value = [
      {
        id: 1,
        name: 'John Smith',
        subject: 'Mathematics',
        bio: 'Experienced math tutor with 10+ years of teaching experience',
        price_per_hour: 50,
        experience: '10+ years',
        available: true
      }
    ]
  }
}

const selectTeacher = (teacher) => {
  selectedTeacher.value = teacher
  // Reset form
  bookingForm.value = {
    date: '',
    time: '',
    duration: 60,
    subject: teacher.subject || '',
    notes: ''
  }
}

const calculateCost = () => {
  if (!selectedTeacher.value || !bookingForm.value.duration) return 0
  const hourlyRate = selectedTeacher.value.price_per_hour || 50
  const duration = bookingForm.value.duration
  return Math.round((hourlyRate * duration / 60) * 100) / 100
}

const canBook = () => {
  return selectedTeacher.value?.available && 
         bookingForm.value.date && 
         bookingForm.value.time && 
         !isBooking.value
}

const bookDirectSession = async () => {
  if (!canBook()) return
  
  try {
    // Get current user from localStorage
    const userData = localStorage.getItem('user')
    if (!userData) {
      alert('Please log in to book sessions')
      return
    }
    
    const user = JSON.parse(userData)
    if (user.role !== 'student') {
      alert('Only students can book sessions')
      return
    }
    
    // Confirm booking
    const confirmed = confirm(
      `Book session with ${selectedTeacher.value.name}?\n` +
      `Date: ${bookingForm.value.date}\n` +
      `Time: ${bookingForm.value.time}\n` +
      `Duration: ${bookingForm.value.duration} minutes\n` +
      `Cost: $${calculateCost()}`
    )
    
    if (!confirmed) return
    
    isBooking.value = true
    
    // Create booking data
    const bookingData = {
      teacher_id: selectedTeacher.value.id,
      student_id: user.id,
      scheduled_at: `${bookingForm.value.date}T${bookingForm.value.time}:00`,
      course_title: bookingForm.value.subject || `${selectedTeacher.value.subject} Tutoring`,
      duration: bookingForm.value.duration,
      price: calculateCost(),
      notes: bookingForm.value.notes
    }
    
    console.log('Creating direct booking:', bookingData)
    
    // Make booking request
    const response = await api.post('/sessions', bookingData)
    
    alert('✅ Session booked successfully!')
    
    // Reset form
    bookingForm.value = {
      date: '',
      time: '',
      duration: 60,
      subject: selectedTeacher.value.subject || '',
      notes: ''
    }
    
  } catch (error) {
    console.error('Failed to book session:', error)
    alert('❌ Failed to book session: ' + (error.response?.data?.error || error.message))
  } finally {
    isBooking.value = false
  }
}

onMounted(() => {
  fetchTeachers()
})
</script>
