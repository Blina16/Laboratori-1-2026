<template>
  <div class="min-h-[calc(100vh-4rem)] bg-gray-50">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <!-- Header -->
      <div class="mb-8 flex justify-between items-start">
        <div>
          <h1 class="text-3xl font-bold text-gray-900 mb-2">My Lesson Calendar</h1>
          <p class="text-gray-600">View and manage your scheduled lessons with tutors</p>
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

      <!-- Stats Cards -->
      <div class="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div class="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm font-medium text-gray-600">Total Lessons</p>
              <p class="text-2xl font-bold text-gray-900 mt-1">{{ stats.totalLessons }}</p>
            </div>
            <div class="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <svg class="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
          </div>
        </div>

        <div class="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm font-medium text-gray-600">This Month</p>
              <p class="text-2xl font-bold text-gray-900 mt-1">{{ stats.thisMonth }}</p>
            </div>
            <div class="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <svg class="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
        </div>

        <div class="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm font-medium text-gray-600">Next Lesson</p>
              <p class="text-lg font-bold text-gray-900 mt-1">{{ stats.nextLesson || 'TBD' }}</p>
            </div>
            <div class="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
              <svg class="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
              </svg>
            </div>
          </div>
        </div>

        <div class="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm font-medium text-gray-600">Active Tutors</p>
              <p class="text-2xl font-bold text-gray-900 mt-1">{{ stats.activeTutors }}</p>
            </div>
            <div class="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
              <svg class="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
          </div>
        </div>
      </div>

      <!-- Main Calendar -->
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
              
              <!-- Lessons for this day -->
              <div class="space-y-1 flex-1 overflow-y-auto">
                <div
                  v-for="lesson in day.lessons"
                  :key="lesson.id"
                  class="text-xs p-2 rounded bg-blue-100 text-blue-800 hover:bg-blue-200 transition cursor-pointer"
                  @click.stop="viewLesson(lesson)"
                >
                  <div class="font-medium">{{ lesson.time }}</div>
                  <div class="truncate">{{ lesson.tutorName }}</div>
                  <div class="text-xs text-blue-600 truncate">{{ lesson.subject }}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Selected Date Details -->
      <div v-if="selectedDate" class="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h3 class="text-xl font-semibold text-gray-900 mb-4">
          Lessons on {{ formatDate(selectedDate) }}
        </h3>
        
        <div v-if="selectedDateLessons.length > 0" class="space-y-4">
          <div
            v-for="lesson in selectedDateLessons"
            :key="lesson.id"
            class="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-200"
          >
            <div class="flex items-center space-x-4">
              <div class="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                <svg class="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <p class="font-medium text-gray-900">{{ lesson.tutorName }}</p>
                <p class="text-sm text-gray-600">{{ lesson.subject }} • {{ lesson.time }}</p>
                <p class="text-xs text-gray-500">Duration: {{ lesson.duration || '60' }} minutes</p>
              </div>
            </div>
            <div class="flex space-x-2">
              <button
                @click="joinLesson(lesson)"
                class="px-4 py-2 bg-green-600 text-white text-sm rounded-lg hover:bg-green-700 transition"
              >
                Join Lesson
              </button>
              <button
                @click="rescheduleLesson(lesson)"
                class="px-4 py-2 bg-gray-600 text-white text-sm rounded-lg hover:bg-gray-700 transition"
              >
                Reschedule
              </button>
            </div>
          </div>
        </div>

        <div v-else class="text-center py-8 text-gray-500">
          <svg class="w-12 h-12 mx-auto mb-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          <p>No lessons scheduled for this date</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import api from '@/services/api'
import { logout } from '@/utils/auth'

defineOptions({
  name: 'StudentCalendarView'
})

const user = ref({})
const lessons = ref([])
const currentMonth = ref(new Date().getMonth())
const currentYear = ref(new Date().getFullYear())
const selectedDate = ref(null)

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
      lessons: getLessonsForDate(dateStr)
    })
    
    current.setDate(current.getDate() + 1)
  }
  
  return days
})

const selectedDateLessons = computed(() => {
  if (!selectedDate.value) return []
  return getLessonsForDate(selectedDate.value)
})

const stats = computed(() => {
  const now = new Date()
  const currentMonth = now.getMonth()
  const currentYear = now.getFullYear()
  
  const thisMonthLessons = lessons.value.filter(lesson => {
    const lessonDate = new Date(lesson.date)
    return lessonDate.getMonth() === currentMonth && lessonDate.getFullYear() === currentYear
  })
  
  const upcomingLessons = lessons.value.filter(lesson => {
    return new Date(lesson.date + ' ' + lesson.time) > now
  }).sort((a, b) => new Date(a.date + ' ' + a.time) - new Date(b.date + ' ' + b.time))
  
  const uniqueTutors = new Set(lessons.value.map(lesson => lesson.tutorName))
  
  return {
    totalLessons: lessons.value.length,
    thisMonth: thisMonthLessons.length,
    nextLesson: upcomingLessons[0]?.time || null,
    activeTutors: uniqueTutors.size
  }
})

const fetchLessons = async () => {
  try {
    const response = await api.get(`/api/sessions/student/${user.value.id}`)
    lessons.value = response.data.map(session => ({
      id: session.id,
      tutorName: session.teacher_name,
      subject: session.course_title || session.title || 'General Tutoring',
      date: new Date(session.scheduled_at).toISOString().split('T')[0],
      time: new Date(session.scheduled_at).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}),
      duration: session.duration || 60,
      status: session.status
    }))
  } catch (error) {
    console.error('Failed to fetch lessons:', error)
    lessons.value = []
  }
}

const getLessonsForDate = (date) => {
  return lessons.value.filter(lesson => lesson.date === date)
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

const viewLesson = (lesson) => {
  selectedDate.value = lesson.date
}

const joinLesson = (lesson) => {
  // TODO: Implement join lesson functionality
  alert(`Joining lesson with ${lesson.tutorName} at ${lesson.time}`)
}

const rescheduleLesson = (lesson) => {
  // TODO: Implement reschedule functionality
  alert(`Reschedule lesson with ${lesson.tutorName}`)
}

const handleLogout = () => {
  logout()
}

onMounted(() => {
  const userData = localStorage.getItem('user')
  if (userData) {
    user.value = JSON.parse(userData)
    fetchLessons()
  }
})
</script>
