<template>
  <div class="flex">
    <AdminSidebar />
    <div class="flex-1 ml-64">
      <div class="min-h-[calc(100vh-4rem)] bg-gray-50">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <!-- Welcome Header -->
          <div class="mb-8 flex justify-between items-start">
            <div>
              <h1 class="text-3xl font-bold text-gray-900 mb-2">
                Welcome back, {{ user.name || 'Admin' }}!
              </h1>
              <p class="text-gray-600">Here's an overview of your account</p>
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
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <!-- Total Sessions -->
            <div class="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
              <div class="flex items-center justify-between">
                <div>
                  <p class="text-sm font-medium text-gray-600">Total Sessions</p>
                  <p class="text-2xl font-bold text-gray-900 mt-1">{{ stats.totalSessions }}</p>
                </div>
                <div class="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  <svg class="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
              </div>
            </div>

            <!-- Active Tutors -->
            <div class="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
              <div class="flex items-center justify-between">
                <div>
                  <p class="text-sm font-medium text-gray-600">Active Tutors</p>
                  <p class="text-2xl font-bold text-gray-900 mt-1">{{ stats.activeTutors }}</p>
                </div>
                <div class="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                  <svg class="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                </div>
              </div>
            </div>

            <!-- Upcoming Sessions -->
            <div class="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
              <div class="flex items-center justify-between">
                <div>
                  <p class="text-sm font-medium text-gray-600">Upcoming</p>
                  <p class="text-2xl font-bold text-gray-900 mt-1">{{ stats.upcomingSessions }}</p>
                </div>
                <div class="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                  <svg class="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
              </div>
            </div>

            <!-- Completion Rate -->
            <div class="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
              <div class="flex items-center justify-between">
                <div>
                  <p class="text-sm font-medium text-gray-600">Completion Rate</p>
                  <p class="text-2xl font-bold text-gray-900 mt-1">{{ stats.completionRate }}%</p>
                </div>
                <div class="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                  <svg class="w-6 h-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
              </div>
            </div>
          </div>

          <!-- Main Content Grid -->
          <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <!-- Upcoming Sessions -->
            <div class="lg:col-span-2 bg-white rounded-xl shadow-sm border border-gray-100">
              <div class="p-6 border-b border-gray-200">
                <h2 class="text-xl font-semibold text-gray-900">Upcoming Sessions</h2>
              </div>
              <div class="p-6">
                <div v-if="upcomingSessions.length === 0" class="text-center py-12">
                  <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <p class="mt-4 text-gray-500">No upcoming sessions</p>
                  <router-link to="/admin/tutors" class="mt-4 inline-block btn-primary">
                    Manage Tutors
                  </router-link>
                </div>
                <div v-else class="space-y-4">
                  <div
                    v-for="session in upcomingSessions"
                    :key="session.id"
                    class="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition"
                  >
                    <div class="flex items-center gap-4">
                      <div class="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center text-white font-semibold">
                        {{ session.tutorInitials }}
                      </div>
                      <div>
                        <p class="font-medium text-gray-900">{{ session.tutorName }}</p>
                        <p class="text-sm text-gray-500">{{ session.subject }}</p>
                      </div>
                    </div>
                    <div class="text-right">
                      <p class="font-medium text-gray-900">{{ session.date }}</p>
                      <p class="text-sm text-gray-500">{{ session.time }}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Quick Actions -->
            <div class="space-y-6">
              <div class="bg-white rounded-xl shadow-sm border border-gray-100">
                <div class="p-6 border-b border-gray-200">
                  <h2 class="text-xl font-semibold text-gray-900">Quick Actions</h2>
                </div>
                <div class="p-6 space-y-3">
                  <router-link
                    to="/admin/tutors"
                    class="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 transition text-gray-700"
                  >
                    <svg class="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                    <span class="font-medium">Find a Tutor</span>
                  </router-link>
                  <router-link
                    to="/admin/tutors"
                    class="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 transition text-gray-700"
                  >
                    <svg class="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <span class="font-medium">Schedule Session</span>
                  </router-link>
                  <router-link
                    to="/admin/students"
                    class="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 transition text-gray-700"
                  >
                    <svg class="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                    </svg>
                    <span class="font-medium">Get Support</span>
                  </router-link>
                  <router-link
                    to="/admin/tutors"
                    class="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 transition text-gray-700"
                  >
                    <svg class="w-5 h-5 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    <span class="font-medium">Admin Panel</span>
                  </router-link>
                </div>
              </div>
            </div>
          </div>
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
  name: 'AdminDashboardView'
})

const user = ref({})
const stats = ref({
  totalSessions: 0,
  activeTutors: 0,
  upcomingSessions: 0,
  completionRate: 0,
  totalCourses: 0
})

const upcomingSessions = ref([])
const recentUsers = ref([])
const isLoading = ref(true)

const handleLogout = () => {
  logout()
}

const fetchAdminData = async () => {
  try {
    // Fetch all data in parallel
    const [statsRes, sessionsRes, coursesRes, usersRes] = await Promise.all([
      api.get('/api/users/stats'),
      api.get('/api/sessions'),
      api.get('/api/courses'),
      api.get('/api/users/recent-users')
    ])
    
    const userStats = statsRes.data
    const sessions = sessionsRes.data
    const courses = coursesRes.data
    const users = usersRes.data
    
    // Calculate stats
    const totalSessions = sessions.length
    const upcomingSessions = sessions.filter(s => s.status === 'scheduled').length
    const completedSessions = sessions.filter(s => s.status === 'completed').length
    const completionRate = totalSessions > 0 ? Math.round((completedSessions / totalSessions) * 100) : 0
    
    stats.value = {
      totalSessions,
      activeTutors: userStats.teachers,
      upcomingSessions,
      completionRate,
      totalCourses: courses.length
    }
    
    // Format upcoming sessions
    upcomingSessions.value = sessions
      .filter(s => s.status === 'scheduled')
      .slice(0, 5)
      .map(session => ({
        id: session.id,
        tutorName: session.teacher_name,
        tutorInitials: session.teacher_name.split(' ').map(n => n[0]).join('').toUpperCase(),
        subject: session.course_title || session.title || 'General Tutoring',
        date: new Date(session.scheduled_at).toLocaleDateString(),
        time: new Date(session.scheduled_at).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})
      }))
    
    // Format recent users
    recentUsers.value = users.slice(0, 5)
    
  } catch (error) {
    console.error('Failed to fetch admin data:', error)
    // Set default values on error
    stats.value = {
      totalSessions: 0,
      activeTutors: 0,
      upcomingSessions: 0,
      completionRate: 0,
      totalCourses: 0
    }
  } finally {
    isLoading.value = false
  }
}

onMounted(() => {
  const userData = localStorage.getItem('user')
  if (userData) {
    user.value = JSON.parse(userData)
  }
  fetchAdminData()
})
</script>
