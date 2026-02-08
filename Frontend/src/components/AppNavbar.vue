<template>
  <nav class="bg-white shadow-sm border-b sticky top-0 z-50">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex items-center justify-between h-16">
        
        <!-- Logo -->
        <router-link to="/" class="flex items-center gap-2">
          <div
            class="w-8 h-8 bg-gradient-to-br from-blue-600 to-indigo-600
                   text-white flex items-center justify-center rounded-lg
                   font-bold text-sm"
          >
            TR
          </div>
          <span class="text-lg font-semibold text-gray-800">TutorRemote</span>
        </router-link>

        <!-- Desktop Menu -->
        <div class="hidden md:flex items-center gap-6">
          <router-link
            to="/tutors"
            class="text-gray-600 hover:text-blue-600 transition-colors font-medium"
          >
            Find Tutors
          </router-link>
          <router-link
            to="/about"
            class="text-gray-600 hover:text-blue-600 transition-colors font-medium"
          >
            About
          </router-link>
          <router-link
            to="/contact"
            class="text-gray-600 hover:text-blue-600 transition-colors font-medium"
          >
            Contact
          </router-link>
        </div>

        <!-- Desktop Auth/User Menu -->
        <div class="hidden md:flex items-center gap-3">
          <!-- Not logged in -->
          <div v-if="!user" class="flex items-center gap-3">
            <router-link
              to="/login"
              class="text-gray-600 hover:text-blue-600 transition-colors font-medium"
            >
              Log In
            </router-link>
            <router-link
              to="/signup"
              class="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors font-medium"
            >
              Sign Up
            </router-link>
          </div>
          
          <!-- Logged in -->
          <div v-else class="flex items-center gap-4">
            <!-- User Menu -->
            <div class="relative">
              <button
                @click="userMenuOpen = !userMenuOpen"
                class="flex items-center gap-2 p-2 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <div class="w-8 h-8 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center text-white text-sm font-bold">
                  {{ user.name.charAt(0).toUpperCase() }}
                </div>
                <span class="text-gray-700 font-medium">{{ user.name }}</span>
                <svg class="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              
              <!-- User Dropdown -->
              <div
                v-if="userMenuOpen"
                class="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-lg border border-gray-200 py-2"
              >
                <!-- Role-based navigation -->
                <router-link
                  v-if="user.role === 'student'"
                  to="/student/dashboard"
                  @click="userMenuOpen = false"
                  class="block px-4 py-2 text-gray-700 hover:bg-gray-50"
                >
                  <div class="flex items-center gap-2">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                    </svg>
                    Dashboard
                  </div>
                </router-link>
                
                <router-link
                  v-if="user.role === 'student'"
                  to="/student/tutors"
                  @click="userMenuOpen = false"
                  class="block px-4 py-2 text-gray-700 hover:bg-gray-50"
                >
                  <div class="flex items-center gap-2">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                    </svg>
                    My Tutors
                  </div>
                </router-link>
                
                <router-link
                  v-if="user.role === 'student'"
                  to="/student/courses"
                  @click="userMenuOpen = false"
                  class="block px-4 py-2 text-gray-700 hover:bg-gray-50"
                >
                  <div class="flex items-center gap-2">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                    </svg>
                    Courses
                  </div>
                </router-link>
                
                <router-link
                  v-if="user.role === 'student'"
                  to="/student/calendar"
                  @click="userMenuOpen = false"
                  class="block px-4 py-2 text-gray-700 hover:bg-gray-50"
                >
                  <div class="flex items-center gap-2">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    Calendar
                  </div>
                </router-link>
                
                <router-link
                  v-if="user.role === 'admin'"
                  to="/admin/tutors"
                  @click="userMenuOpen = false"
                  class="block px-4 py-2 text-gray-700 hover:bg-gray-50"
                >
                  <div class="flex items-center gap-2">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    Admin Panel
                  </div>
                </router-link>
                
                <router-link
                  v-if="user.role === 'admin'"
                  to="/admin/tutors"
                  @click="userMenuOpen = false"
                  class="block px-4 py-2 text-gray-700 hover:bg-gray-50"
                >
                  <div class="flex items-center gap-2">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                    </svg>
                    Manage Tutors
                  </div>
                </router-link>
                
                <router-link
                  v-if="user.role === 'teacher'"
                  to="/teacher/availability"
                  @click="userMenuOpen = false"
                  class="block px-4 py-2 text-gray-700 hover:bg-gray-50"
                >
                  <div class="flex items-center gap-2">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    My Availability
                  </div>
                </router-link>
                
                <div class="border-t pt-2 mt-2">
                  <button
                    @click="handleLogout"
                    class="block w-full text-left px-4 py-2 text-red-600 hover:bg-red-50"
                  >
                    <div class="flex items-center gap-2">
                      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                      </svg>
                      Logout
                    </div>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Mobile Menu Button -->
        <button
          @click="mobileMenuOpen = !mobileMenuOpen"
          class="md:hidden p-2 rounded-lg text-gray-600 hover:text-blue-600 hover:bg-gray-50"
        >
          <svg
            v-if="!mobileMenuOpen"
            class="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
          </svg>
          <svg
            v-else
            class="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      <!-- Mobile Menu -->
      <div
        v-if="mobileMenuOpen"
        class="md:hidden border-t py-4 space-y-2"
      >
        <router-link
          to="/tutors"
          @click="mobileMenuOpen = false"
          class="block px-4 py-2 text-gray-600 hover:text-blue-600 hover:bg-gray-50 rounded-lg"
        >
          Find Tutors
        </router-link>
        <router-link
          to="/about"
          @click="mobileMenuOpen = false"
          class="block px-4 py-2 text-gray-600 hover:text-blue-600 hover:bg-gray-50 rounded-lg"
        >
          About
        </router-link>
        <router-link
          to="/contact"
          @click="mobileMenuOpen = false"
          class="block px-4 py-2 text-gray-600 hover:text-blue-600 hover:bg-gray-50 rounded-lg"
        >
          Contact
        </router-link>
        
        <!-- Mobile Auth -->
        <div v-if="!user" class="pt-2 border-t space-y-2">
          <router-link
            to="/login"
            @click="mobileMenuOpen = false"
            class="block px-4 py-2 text-gray-600 hover:text-blue-600 hover:bg-gray-50 rounded-lg text-center"
          >
            Log In
          </router-link>
          <router-link
            to="/signup"
            @click="mobileMenuOpen = false"
            class="block px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-center font-medium"
          >
            Sign Up
          </router-link>
        </div>
        
        <!-- Mobile User Menu -->
        <div v-else class="pt-2 border-t">
          <div class="px-4 py-2 flex items-center gap-2">
            <div class="w-8 h-8 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center text-white text-sm font-bold">
              {{ user.name.charAt(0).toUpperCase() }}
            </div>
            <span class="text-gray-700 font-medium">{{ user.name }}</span>
          </div>
          
          <!-- Role-based mobile navigation -->
          <router-link
            v-if="user.role === 'student'"
            to="/student/dashboard"
            @click="mobileMenuOpen = false"
            class="block px-4 py-2 text-gray-700 hover:bg-gray-50"
          >
            Dashboard
          </router-link>
          <router-link
            v-if="user.role === 'student'"
            to="/student/tutors"
            @click="mobileMenuOpen = false"
            class="block px-4 py-2 text-gray-700 hover:bg-gray-50"
          >
            My Tutors
          </router-link>
          <router-link
            v-if="user.role === 'student'"
            to="/student/courses"
            @click="mobileMenuOpen = false"
            class="block px-4 py-2 text-gray-700 hover:bg-gray-50"
          >
            Courses
          </router-link>
          <router-link
            v-if="user.role === 'student'"
            to="/student/calendar"
            @click="mobileMenuOpen = false"
            class="block px-4 py-2 text-gray-700 hover:bg-gray-50"
          >
            Calendar
          </router-link>
          <router-link
            v-if="user.role === 'admin'"
            to="/admin/tutors"
            @click="mobileMenuOpen = false"
            class="block px-4 py-2 text-gray-700 hover:bg-gray-50"
          >
            Admin Panel
          </router-link>
          <router-link
            v-if="user.role === 'admin'"
            to="/admin/tutors"
            @click="mobileMenuOpen = false"
            class="block px-4 py-2 text-gray-700 hover:bg-gray-50"
          >
            Manage Tutors
          </router-link>
          <router-link
            v-if="user.role === 'teacher'"
            to="/teacher/availability"
            @click="mobileMenuOpen = false"
            class="block px-4 py-2 text-gray-700 hover:bg-gray-50"
          >
            My Availability
          </router-link>
          
          <button
            @click="handleLogout"
            class="block w-full text-left px-4 py-2 text-red-600 hover:bg-red-50"
          >
            Logout
          </button>
        </div>
      </div>
    </div>
  </nav>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'

defineOptions({
  name: "AppNavbar"
})

const router = useRouter()
const mobileMenuOpen = ref(false)
const userMenuOpen = ref(false)
const user = ref(null)

// Load user from localStorage on component mount
const loadUser = () => {
  const userData = localStorage.getItem('user')
  if (userData) {
    try {
      user.value = JSON.parse(userData)
    } catch (error) {
      console.error('Failed to parse user data:', error)
      localStorage.removeItem('user')
    }
  }
}

// Handle logout
const handleLogout = () => {
  localStorage.removeItem('user')
  localStorage.removeItem('token')
  user.value = null
  userMenuOpen.value = false
  mobileMenuOpen.value = false
  router.push('/login')
}

// Close menus when clicking outside
const handleClickOutside = (event) => {
  if (!event.target.closest('.relative')) {
    userMenuOpen.value = false
  }
}

// Load user on mount
onMounted(() => {
  loadUser()
  
  // Listen for storage changes (for login/logout sync)
  window.addEventListener('storage', (e) => {
    if (e.key === 'user') {
      loadUser()
    }
  })
  
  // Add click outside listener
  document.addEventListener('click', handleClickOutside)
})

// Close mobile menu when route changes
router.afterEach(() => {
  mobileMenuOpen.value = false
})
</script>
