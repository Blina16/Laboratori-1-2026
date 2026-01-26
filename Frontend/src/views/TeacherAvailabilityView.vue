<template>
  <div class="min-h-[calc(100vh-4rem)] bg-gray-50">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <!-- Header -->
      <div class="mb-8 flex justify-between items-start">
        <div>
          <h1 class="text-3xl font-bold text-gray-900 mb-2">
            My Availability - Welcome back, {{ user.name || 'Teacher' }}!
          </h1>
          <p class="text-gray-600">Manage your teaching schedule and availability</p>
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

      <!-- Teacher Profile Card -->
      <div class="bg-white rounded-xl shadow-sm p-6 border border-gray-100 mb-8">
        <div class="flex items-start space-x-6">
          <div class="w-20 h-20 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center text-white text-2xl font-bold flex-shrink-0">
            {{ (user.name && user.name.charAt(0)) || 'T' }}
          </div>
          <div class="flex-1">
            <h2 class="text-2xl font-bold text-gray-900 mb-2">{{ user.name || 'Teacher Name' }}</h2>
            <p class="text-gray-600 mb-4">{{ teacherProfile.bio || 'Experienced tutor passionate about helping students succeed' }}</p>
            <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div class="flex items-center space-x-2">
                <svg class="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                </svg>
                <span class="text-sm text-gray-600">${{ teacherProfile.price_per_hour || '50' }}/hour</span>
              </div>
              <div class="flex items-center space-x-2">
                <svg class="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
                <span class="text-sm text-gray-600">{{ teacherProfile.experience || '5+ years' }} experience</span>
              </div>
              <div class="flex items-center space-x-2">
                <svg class="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span class="text-sm text-gray-600">{{ teacherProfile.subject || 'Multiple Subjects' }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Stats Cards -->
      <div class="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div class="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm font-medium text-gray-600">Total Sessions</p>
              <p class="text-2xl font-bold text-gray-900 mt-1">{{ statsData.totalSessions }}</p>
            </div>
            <div class="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <svg class="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
        </div>

        <div class="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm font-medium text-gray-600">This Week</p>
              <p class="text-2xl font-bold text-gray-900 mt-1">{{ statsData.thisWeek }}</p>
            </div>
            <div class="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <svg class="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
          </div>
        </div>

        <div class="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm font-medium text-gray-600">Available Hours</p>
              <p class="text-2xl font-bold text-gray-900 mt-1">{{ statsData.availableHours }}</p>
            </div>
            <div class="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
              <svg class="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
        </div>

        <div class="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm font-medium text-gray-600">Active Students</p>
              <p class="text-2xl font-bold text-gray-900 mt-1">{{ statsData.activeStudents }}</p>
            </div>
            <div class="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
              <svg class="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
          </div>
        </div>
      </div>

      <!-- Quick Actions -->
      <div class="bg-white rounded-xl shadow-sm p-6 border border-gray-100 mb-8">
        <h2 class="text-xl font-semibold text-gray-900 mb-4">Quick Actions</h2>
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <!-- Availability Button -->
          <button @click="openNewAvailabilityModal" class="px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition flex items-center justify-center">
            <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span class="font-medium">Add Availability</span>
          </button>
          
          <button
            @click="viewFullSchedule"
            class="flex items-center justify-center px-4 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition transform hover:scale-105 active:scale-95"
          >
            <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <span class="font-medium">View Schedule</span>
          </button>
          <button
            @click="exportCalendar"
            class="flex items-center justify-center px-4 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition transform hover:scale-105 active:scale-95"
          >
            <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <span class="font-medium">Export Calendar</span>
          </button>
        </div>
      </div>

      <!-- Availability Calendar -->
      <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
        <div class="flex items-center justify-between mb-6">
          <h2 class="text-2xl font-semibold text-gray-900">{{ currentMonthYear }}</h2>
          <div class="flex items-center gap-2">
            <button
              @click="previousMonth"
              class="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition"
            >
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <button
              @click="goToToday"
              class="px-3 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
            >
              Today
            </button>
            <button
              @click="nextMonth"
              class="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition"
            >
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        </div>

        <!-- Calendar Grid -->
        <div class="grid grid-cols-7 gap-px bg-gray-200 rounded-lg overflow-hidden">
          <!-- Weekday headers -->
          <div
            v-for="day in weekDays"
            :key="day"
            class="bg-gray-50 p-3 text-center text-sm font-medium text-gray-700"
          >
            {{ day }}
          </div>

          <!-- Calendar days -->
          <div
            v-for="day in calendarDays"
            :key="day.date"
            class="bg-white min-h-[100px] p-3 cursor-pointer hover:bg-gray-50 transition"
            :class="{
              'bg-blue-50': isToday(day.date),
              'text-gray-900': day.currentMonth,
              'text-gray-400': !day.currentMonth
            }"
            @click="selectDate(day.date)"
          >
            <div class="flex flex-col h-full">
              <div class="text-sm font-medium mb-2">
                {{ day.dayNumber }}
              </div>
              
              <!-- Availability slots for this day -->
              <div class="space-y-1 flex-1 overflow-y-auto">
                <div
                  v-for="slot in day.slots"
                  :key="slot.id"
                  class="text-xs p-2 rounded cursor-pointer transition"
                  :class="{
                    'bg-green-100 text-green-800 hover:bg-green-200': slot.available,
                    'bg-red-100 text-red-800 hover:bg-red-200': !slot.available
                  }"
                  @click.stop="toggleSlot(slot)"
                >
                  <div class="font-medium">{{ slot.time }}</div>
                  <div class="truncate">{{ slot.status }}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Selected Date Details -->
      <div v-if="selectedDate" class="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h3 class="text-xl font-semibold text-gray-900 mb-4">
          Availability for {{ formatDate(selectedDate) }}
        </h3>
        
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <!-- Available Slots -->
          <div>
            <h4 class="font-medium text-gray-900 mb-3">Available Time Slots</h4>
            <div v-if="selectedDateSlots.available.length > 0" class="space-y-2">
              <div
                v-for="slot in selectedDateSlots.available"
                :key="slot.id"
                class="flex items-center justify-between p-3 bg-green-50 rounded-lg border border-green-200"
              >
                <div>
                  <p class="font-medium text-green-900">{{ slot.time }}</p>
                  <p class="text-sm text-green-600">{{ slot.duration }} minutes</p>
                </div>
                <button
                  @click="removeSlot(slot)"
                  class="px-3 py-1 bg-red-600 text-white text-sm rounded hover:bg-red-700 transition"
                >
                  Remove
                </button>
              </div>
            </div>
            <div v-else class="text-center py-4 text-gray-500">
              <p>No available time slots</p>
            </div>
          </div>

          <!-- Booked Slots -->
          <div>
            <h4 class="font-medium text-gray-900 mb-3">Booked Sessions</h4>
            <div v-if="selectedDateSlots.booked.length > 0" class="space-y-2">
              <div
                v-for="slot in selectedDateSlots.booked"
                :key="slot.id"
                class="flex items-center justify-between p-3 bg-blue-50 rounded-lg border border-blue-200"
              >
                <div>
                  <p class="font-medium text-blue-900">{{ slot.time }}</p>
                  <p class="text-sm text-blue-600">{{ slot.studentName }} • {{ slot.subject }}</p>
                </div>
                <button
                  @click="viewSession(slot)"
                  class="px-3 py-1 bg-blue-600 text-white text-sm rounded hover:bg-blue-700 transition"
                >
                  View
                </button>
              </div>
            </div>
            <div v-else class="text-center py-4 text-gray-500">
              <p>No booked sessions</p>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Old Modal Removed - Using Simple Prompts Now -->
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import api from '@/services/api'
import { logout } from '@/utils/auth'
import AvailabilityModal from '../components/AvailabilityModal.vue'

defineOptions({
  name: 'TeacherAvailabilityView'
})

const user = ref({})
const teacherProfile = ref({})
const stats = ref({
  totalSessions: 0,
  thisWeek: 0,
  availableHours: 0,
  activeStudents: 0
})
const isLoading = ref(true)

// Calendar state
const currentDate = ref(new Date())
const currentMonth = ref(new Date().getMonth())
const currentYear = ref(new Date().getFullYear())
const selectedDate = ref(null)
const availabilitySlots = ref([])
const showAvailabilityModal = ref(false)

// Data arrays
const sessions = ref([])
const availability = ref([])

const weekDays = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']

const currentMonthYear = computed(() => {
  const date = new Date(currentYear.value, currentMonth.value)
  return date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
})

const calendarDays = computed(() => {
  const firstDay = new Date(currentYear.value, currentMonth.value, 1)
  const lastDay = new Date(currentYear.value, currentMonth.value + 1, 0)
  const startDate = new Date(firstDay)
  startDate.setDate(startDate.getDate() - firstDay.getDay())
  
  const days = []
  const current = new Date(startDate)
  
  for (let i = 0; i < 42; i++) {
    const dateStr = current.toISOString().split('T')[0]
    const isCurrentMonth = current.getMonth() === currentMonth.value
    
    days.push({
      date: dateStr,
      dayNumber: current.getDate(),
      currentMonth: isCurrentMonth,
      slots: getSlotsForDate(dateStr)
    })
    
    current.setDate(current.getDate() + 1)
  }
  
  return days
})

const selectedDateSlots = computed(() => {
  if (!selectedDate.value) return { available: [], booked: [] }
  
  const slots = getSlotsForDate(selectedDate.value)
  return {
    available: slots.filter(slot => slot.available),
    booked: slots.filter(slot => !slot.available && slot.studentName)
  }
})

const statsData = computed(() => {
  const now = new Date()
  const currentWeek = getWeekNumber(now)
  
  const thisWeekSessions = sessions.value.filter(session => {
    const sessionDate = new Date(session.scheduled_at)
    return getWeekNumber(sessionDate) === currentWeek
  })
  
  const uniqueStudents = new Set(sessions.value.map(session => session.student_name))
  
  return {
    totalSessions: sessions.value.length,
    thisWeek: thisWeekSessions.length,
    availableHours: availability.value.length * 1, // Assuming 1 hour per slot
    activeStudents: uniqueStudents.size
  }
})

const getWeekNumber = (date) => {
  const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()))
  const dayNum = d.getUTCDay() || 7
  d.setUTCDate(d.getUTCDate() + 4 - dayNum)
  const yearStart = new Date(Date.UTC(d.getUTCFullYear(),0,1))
  return Math.ceil((((d - yearStart) / 86400000) + 1)/7)
}

const fetchAvailability = async () => {
  try {
    console.log('Fetching availability for teacher:', user.value.id)
    // Fetch real availability data from the database
    const response = await api.get(`/availability/teacher/${user.value.id}`)
    console.log('Availability response:', response.data)
    availability.value = response.data
  } catch (error) {
    console.error('Failed to fetch availability:', error)
    // Fallback to empty array if API fails
    availability.value = []
  }
}

const fetchSessions = async () => {
  try {
    const response = await api.get(`/sessions/teacher/${user.value.id}`)
    sessions.value = response.data
  } catch (error) {
    console.error('Failed to fetch sessions:', error)
    sessions.value = []
  }
}

const getSlotsForDate = (date) => {
  const slots = []
  
  // Add availability slots from database
  const dayAvailability = availability.value.filter(slot => slot.date === date)
  dayAvailability.forEach(slot => {
    const isAvailable = slot.current_students < slot.max_students
    slots.push({
      id: `avail-${slot.id}`,
      time: `${formatTime(slot.start_time)} - ${formatTime(slot.end_time)}`,
      status: isAvailable ? 'Available' : 'Full',
      available: isAvailable,
      duration: calculateDuration(slot.start_time, slot.end_time),
      maxStudents: slot.max_students,
      currentStudents: slot.current_students,
      notes: slot.notes
    })
  })
  
  // Add booked sessions
  const daySessions = sessions.value.filter(session => {
    return (session.scheduled_at && session.scheduled_at.split('T')[0]) === date
  })
  
  daySessions.forEach(session => {
    const startTime = new Date(session.scheduled_at).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})
    const endTime = new Date(new Date(session.scheduled_at).getTime() + (session.duration || 60) * 60 * 1000).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})
    
    slots.push({
      id: `session-${session.id}`,
      time: `${startTime} - ${endTime}`,
      status: `${session.student_name}`,
      available: false,
      studentName: session.student_name,
      subject: session.course_title || session.title,
      duration: session.duration || 60
    })
  })
  
  return slots.sort((a, b) => a.time.localeCompare(b.time))
}

const formatTime = (time) => {
  const [hours, minutes] = time.split(':')
  const hour = parseInt(hours)
  const ampm = hour >= 12 ? 'PM' : 'AM'
  const displayHour = hour > 12 ? hour - 12 : (hour === 0 ? 12 : hour)
  return `${displayHour}:${minutes} ${ampm}`
}

const calculateDuration = (startTime, endTime) => {
  const start = new Date(`2000-01-01T${startTime}`)
  const end = new Date(`2000-01-01T${endTime}`)
  return Math.round((end - start) / (1000 * 60)) // Duration in minutes
}

const isToday = (date) => {
  const today = new Date().toISOString().split('T')[0]
  return date === today
}

const formatDate = (date) => {
  return new Date(date).toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}

const previousMonth = () => {
  if (currentMonth.value === 0) {
    currentMonth.value = 11
    currentYear.value--
  } else {
    currentMonth.value--
  }
}

const nextMonth = () => {
  if (currentMonth.value === 11) {
    currentMonth.value = 0
    currentYear.value++
  } else {
    currentMonth.value++
  }
}

const goToToday = () => {
  const today = new Date()
  currentMonth.value = today.getMonth()
  currentYear.value = today.getFullYear()
  selectedDate.value = today.toISOString().split('T')[0]
}

const selectDate = (date) => {
  selectedDate.value = date
}

const toggleSlot = (slot) => {
  if (slot.available) {
    removeSlot(slot)
  } else {
    // Booked slot - view details
    viewSession(slot)
  }
}

const removeSlot = async (slot) => {
  if (confirm('Are you sure you want to remove this availability?')) {
    try {
      // TODO: Implement API call to remove availability
      console.log('Removing slot:', slot)
      await fetchAvailability()
    } catch (error) {
      console.error('Failed to remove availability:', error)
    }
  }
}

const openNewAvailabilityModal = () => {
  console.log('New availability button clicked!')
  
  // Create a simple availability using prompt
  const date = prompt('Enter date (YYYY-MM-DD):', new Date().toISOString().split('T')[0])
  if (!date) return
  
  const startTime = prompt('Enter start time (HH:MM, e.g., 09:00):', '09:00')
  if (!startTime) return
  
  const endTime = prompt('Enter end time (HH:MM, e.g., 10:00):', '10:00')
  if (!endTime) return
  
  const maxStudents = prompt('Maximum number of students:', '1')
  if (!maxStudents) return
  
  const notes = prompt('Notes (optional):', 'Available for tutoring')
  
  // Create the availability
  createAvailabilitySlot({
    teacher_id: user.value.id,
    date: date,
    start_time: startTime,
    end_time: endTime,
    max_students: parseInt(maxStudents),
    notes: notes
  })
}

const createAvailabilitySlot = async (availabilityData) => {
  try {
    console.log('Creating availability:', availabilityData)
    
    // Create the availability
    const response = await api.post('/availability', availabilityData)
    console.log('Availability created:', response.data)
    
    alert('✅ Availability created successfully!')
    
    // Refresh the availability data
    fetchAvailability()
    
  } catch (error) {
    console.error('Failed to create availability:', error)
    console.error('Error details:', error.response?.data)
    alert('❌ Failed to create availability: ' + (error.response?.data?.error || error.message))
  }
}

const viewSession = (session) => {
  // TODO: Navigate to session details or show modal
  alert(`Session with ${session.studentName} at ${session.time}`)
}

const viewFullSchedule = () => {
  // Navigate to a detailed schedule view or show a modal
  alert('Full schedule view coming soon! This will show all your availability and bookings in a detailed format.')
}

const exportCalendar = () => {
  // Generate calendar export (iCal format)
  try {
    // Create iCal content
    let iCalContent = `BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//Teacher Availability//Calendar//EN
CALSCALE:GREGORIAN`

    // Add availability slots
    availability.value.forEach(slot => {
      const startDate = new Date(`${slot.date}T${slot.startTime}:00`)
      const endDate = new Date(`${slot.date}T${slot.endTime}:00`)
      
      iCalContent += `
BEGIN:VEVENT
UID:${slot.id}@teacher-availability
DTSTART:${formatDateForICal(startDate)}
DTEND:${formatDateForICal(endDate)}
SUMMARY:Available - ${slot.subject || 'Teaching'}
DESCRIPTION:${slot.notes || 'Available for tutoring'}
STATUS:CONFIRMED
END:VEVENT`
    })

    // Add booked sessions
    sessions.value.forEach(session => {
      const startDate = new Date(session.scheduled_at)
      const endDate = new Date(startDate.getTime() + (session.duration || 60) * 60 * 1000)
      
      iCalContent += `
BEGIN:VEVENT
UID:${session.id}@booked-session
DTSTART:${formatDateForICal(startDate)}
DTEND:${formatDateForICal(endDate)}
SUMMARY:Session with ${session.student_name}
DESCRIPTION:${session.subject || 'Tutoring session'}
STATUS:CONFIRMED
END:VEVENT`
    })

    iCalContent += '\nEND:VCALENDAR'

    // Create download link
    const blob = new Blob([iCalContent], { type: 'text/calendar' })
    const url = window.URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = `teacher-availability-${new Date().toISOString().split('T')[0]}.ics`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    window.URL.revokeObjectURL(url)

    alert('Calendar exported successfully! You can import this file into Google Calendar, Outlook, or other calendar apps.')
  } catch (error) {
    console.error('Failed to export calendar:', error)
    alert('Failed to export calendar. Please try again.')
  }
}

const formatDateForICal = (date) => {
  return date.toISOString().replace(/[-:]/g, '').replace(/\.\d{3}/, '')
}

const handleLogout = () => {
  logout()
}

const fetchTeacherProfile = async () => {
  try {
    const response = await api.get(`/tutors/${user.value.id}`)
    teacherProfile.value = response.data
  } catch (error) {
    console.error('Failed to fetch teacher profile:', error)
    // Set default profile values
    teacherProfile.value = {
      bio: 'Experienced tutor passionate about helping students succeed',
      price_per_hour: 50,
      experience: '5+ years',
      subject: 'Multiple Subjects'
    }
  }
}

onMounted(() => {
  const userData = localStorage.getItem('user')
  if (userData) {
    user.value = JSON.parse(userData)
    fetchTeacherProfile()
    fetchAvailability()
    fetchSessions()
  }
})
</script>
