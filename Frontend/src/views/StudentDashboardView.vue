<template>
  <div class="min-h-[calc(100vh-4rem)] bg-gray-50">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <!-- Welcome Header -->
      <div class="mb-8 flex justify-between items-start">
        <div>
          <h1 class="text-3xl font-bold text-gray-900 mb-2">
            Student Dashboard - Welcome back, {{ user.name || 'Student' }}!
          </h1>
          <p class="text-gray-600">Track your learning progress and schedule sessions</p>
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

      <!-- Stats Grid -->
      <div v-if="isLoading" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div v-for="i in 4" :key="i" class="bg-white rounded-xl shadow-sm p-6 border border-gray-100 animate-pulse">
          <div class="flex items-center justify-between">
            <div class="flex-1">
              <div class="h-4 bg-gray-200 rounded mb-2"></div>
              <div class="h-8 bg-gray-200 rounded"></div>
            </div>
            <div class="w-12 h-12 bg-gray-200 rounded-lg"></div>
          </div>
        </div>
      </div>
      
      <div v-else class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <!-- Completed Sessions -->
        <div class="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm font-medium text-gray-600">Completed Sessions</p>
              <p class="text-2xl font-bold text-gray-900 mt-1">{{ stats.completedSessions }}</p>
            </div>
            <div class="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <svg class="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
        </div>

        <!-- Upcoming Sessions -->
        <div class="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm font-medium text-gray-600">Upcoming Sessions</p>
              <p class="text-2xl font-bold text-gray-900 mt-1">{{ stats.upcomingSessions }}</p>
            </div>
            <div class="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <svg class="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
        </div>

        <!-- Learning Hours -->
        <div class="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm font-medium text-gray-600">Learning Hours</p>
              <p class="text-2xl font-bold text-gray-900 mt-1">{{ stats.learningHours }}</p>
            </div>
            <div class="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
              <svg class="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
            </div>
          </div>
        </div>
      </div>

      <!-- Quick Actions -->
      <div class="bg-white rounded-xl shadow-sm p-6 border border-gray-100 mb-8">
        <h2 class="text-xl font-semibold text-gray-900 mb-4">Quick Actions</h2>
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <router-link to="/student/calendar" class="flex items-center justify-center px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition">
            <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            View Calendar
          </router-link>
          <router-link to="/tutoring" class="flex items-center justify-center px-4 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition">
            <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            Find Tutors
          </router-link>
          <router-link to="/tutoring" class="flex items-center justify-center px-4 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition">
            <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            Book Session
          </router-link>
          <button class="flex items-center justify-center px-4 py-3 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition">
            <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
            </svg>
            View Progress
          </button>
        </div>
      </div>

      <!-- Upcoming Sessions -->
      <div class="bg-white rounded-xl shadow-sm p-6 border border-gray-100 mb-8">
        <h2 class="text-xl font-semibold text-gray-900 mb-4">Upcoming Sessions</h2>
        <div class="space-y-4">
          <div v-for="session in upcomingSessions" :key="session.id" class="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <div class="flex items-center space-x-4">
              <div class="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                <svg class="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
              <div>
                <p class="font-medium text-gray-900">{{ session.tutorName }}</p>
                <p class="text-sm text-gray-600">{{ session.subject }} • {{ session.date }} at {{ session.time }}</p>
              </div>
            </div>
            <div class="flex space-x-2">
              <button class="px-3 py-1 bg-green-600 text-white text-sm rounded hover:bg-green-700 transition">
                Join
              </button>
              <button class="px-3 py-1 bg-gray-600 text-white text-sm rounded hover:bg-gray-700 transition">
                Reschedule
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Recent Activity -->
      <div class="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
        <h2 class="text-xl font-semibold text-gray-900 mb-4">Recent Activity</h2>
        <div class="space-y-4">
          <div v-for="activity in recentActivity" :key="activity.id" class="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg">
            <div class="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
              <svg class="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <p class="font-medium text-gray-900">{{ activity.title }}</p>
              <p class="text-sm text-gray-600">{{ activity.description }} • {{ activity.date }}</p>
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
import { logout } from '@/utils/auth'

defineOptions({
  name: 'StudentDashboard'
})

const user = ref({})
const stats = ref({
  completedSessions: 0,
  upcomingSessions: 0,
  learningHours: 0
})

const upcomingSessions = ref([])
const recentActivity = ref([])
const isLoading = ref(true)

const handleLogout = () => {
  logout()
}

const fetchStudentData = async () => {
  try {
    // Fetch student sessions
    const sessionsRes = await api.get(`/api/sessions/student/${user.value.id}`)
    const sessions = sessionsRes.data
    
    // Calculate stats
    const completed = sessions.filter(s => s.status === 'completed').length
    const upcoming = sessions.filter(s => s.status === 'scheduled').length
    const totalHours = sessions.reduce((acc, s) => acc + (s.duration || 0), 0) / 60
    
    stats.value = {
      completedSessions: completed,
      upcomingSessions: upcoming,
      learningHours: Math.round(totalHours * 10) / 10
    }
    
    // Format upcoming sessions
    upcomingSessions.value = sessions
      .filter(s => s.status === 'scheduled')
      .slice(0, 5)
      .map(session => ({
        id: session.id,
        tutorName: session.teacher_name,
        subject: session.course_title || session.title || 'General Tutoring',
        date: new Date(session.scheduled_at).toLocaleDateString(),
        time: new Date(session.scheduled_at).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})
      }))
    
    // Format recent activity
    recentActivity.value = sessions
      .slice(0, 5)
      .map(session => ({
        id: session.id,
        title: session.status === 'completed' ? 'Completed Session' : 'Booked Session',
        description: `${session.course_title || session.title} with ${session.teacher_name}`,
        date: new Date(session.created_at).toLocaleDateString()
      }))
    
  } catch (error) {
    console.error('Failed to fetch student data:', error)
    // Set default values on error
    stats.value = {
      completedSessions: 0,
      upcomingSessions: 0,
      learningHours: 0
    }
  } finally {
    isLoading.value = false
  }
}

onMounted(() => {
  const userData = localStorage.getItem('user')
  if (userData) {
    user.value = JSON.parse(userData)
    fetchStudentData()
  }
})
</script>
