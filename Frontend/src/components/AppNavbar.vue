<template>
  <nav class="bg-white/90 backdrop-blur-md border-b border-gray-200 sticky top-0 z-50 shadow-sm">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex items-center justify-between h-16">
        
        <!-- Logo -->
        <router-link to="/" class="flex items-center gap-3 cursor-pointer group">
          <div
            class="w-10 h-10 bg-gradient-to-br from-blue-600 to-indigo-600
                   text-white flex items-center justify-center rounded-xl
                   font-bold text-lg shadow-md group-hover:shadow-lg transition-shadow"
          >
            TR
          </div>
          <span class="text-xl font-semibold text-gray-800 tracking-tight group-hover:text-blue-600 transition-colors">
            TutorRemote
          </span>
        </router-link>

        <!-- Desktop Menu -->
        <div class="hidden md:flex items-center gap-1">
          <router-link
            to="/"
            class="nav-link"
            active-class="text-blue-600 font-semibold"
          >
            Home
          </router-link>
          <router-link
            to="/tutoring"
            class="nav-link"
            active-class="text-blue-600 font-semibold"
          >
            Find Tutor
          </router-link>
          <router-link
            to="/tutors"
            class="nav-link"
            active-class="text-blue-600 font-semibold"
          >
            Tutors
          </router-link>
          <router-link
            to="/about"
            class="nav-link"
            active-class="text-blue-600 font-semibold"
          >
            About
          </router-link>
          <router-link
            to="/contact"
            class="nav-link"
            active-class="text-blue-600 font-semibold"
          >
            Contact
          </router-link>
          <router-link
            to="/admin/dashboard"
            class="nav-link text-purple-600 hover:text-purple-700"
            active-class="text-purple-600 font-semibold"
          >
            Dashboard
          </router-link>
          <router-link
            to="/admin"
            class="nav-link text-purple-600 hover:text-purple-700"
            active-class="text-purple-600 font-semibold"
          >
            Admin
          </router-link>
        </div>

        <!-- Desktop Auth Buttons -->
        <div class="hidden md:flex items-center gap-4">
          <router-link
            to="/login"
            class="text-gray-600 font-medium hover:text-blue-600 transition-colors"
          >
            Log In
          </router-link>
          <router-link
            to="/signup"
            class="btn-primary"
          >
            Sign Up
          </router-link>
        </div>

        <!-- Mobile Menu Button -->
        <button
          @click="mobileMenuOpen = !mobileMenuOpen"
          class="md:hidden p-2 rounded-lg text-gray-600 hover:text-blue-600 hover:bg-gray-100 transition-colors"
          aria-label="Toggle menu"
        >
          <svg
            v-if="!mobileMenuOpen"
            class="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M4 6h16M4 12h16M4 18h16"
            />
          </svg>
          <svg
            v-else
            class="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
      </div>

      <!-- Mobile Menu -->
      <transition
        enter-active-class="transition ease-out duration-200"
        enter-from-class="opacity-0 -translate-y-1"
        enter-to-class="opacity-100 translate-y-0"
        leave-active-class="transition ease-in duration-150"
        leave-from-class="opacity-100 translate-y-0"
        leave-to-class="opacity-0 -translate-y-1"
      >
        <div
          v-if="mobileMenuOpen"
          class="md:hidden border-t border-gray-200 py-4 space-y-1"
        >
          <router-link
            to="/"
            @click="mobileMenuOpen = false"
            class="block px-4 py-2 text-gray-600 hover:text-blue-600 hover:bg-gray-50 rounded-lg transition-colors"
            active-class="text-blue-600 font-semibold bg-blue-50"
          >
            Home
          </router-link>
          <router-link
            to="/tutoring"
            @click="mobileMenuOpen = false"
            class="block px-4 py-2 text-gray-600 hover:text-blue-600 hover:bg-gray-50 rounded-lg transition-colors"
            active-class="text-blue-600 font-semibold bg-blue-50"
          >
            Find Tutor
          </router-link>
          <router-link
            to="/tutors"
            @click="mobileMenuOpen = false"
            class="block px-4 py-2 text-gray-600 hover:text-blue-600 hover:bg-gray-50 rounded-lg transition-colors"
            active-class="text-blue-600 font-semibold bg-blue-50"
          >
            Tutors
          </router-link>
          <router-link
            to="/about"
            @click="mobileMenuOpen = false"
            class="block px-4 py-2 text-gray-600 hover:text-blue-600 hover:bg-gray-50 rounded-lg transition-colors"
            active-class="text-blue-600 font-semibold bg-blue-50"
          >
            About
          </router-link>
          <router-link
            to="/contact"
            @click="mobileMenuOpen = false"
            class="block px-4 py-2 text-gray-600 hover:text-blue-600 hover:bg-gray-50 rounded-lg transition-colors"
            active-class="text-blue-600 font-semibold bg-blue-50"
          >
            Contact
          </router-link>
          <router-link
            to="/admin/dashboard"
            @click="mobileMenuOpen = false"
            class="block px-4 py-2 text-purple-600 hover:text-purple-700 hover:bg-purple-50 rounded-lg transition-colors"
            active-class="text-purple-600 font-semibold bg-purple-50"
          >
            Dashboard
          </router-link>
          <router-link
            to="/admin"
            @click="mobileMenuOpen = false"
            class="block px-4 py-2 text-purple-600 hover:text-purple-700 hover:bg-purple-50 rounded-lg transition-colors"
            active-class="text-purple-600 font-semibold bg-purple-50"
          >
            Admin
          </router-link>
          <div class="pt-4 border-t border-gray-200 space-y-2">
            <router-link
              to="/login"
              @click="mobileMenuOpen = false"
              class="block px-4 py-2 text-gray-600 hover:text-blue-600 hover:bg-gray-50 rounded-lg transition-colors text-center"
            >
              Log In
            </router-link>
            <router-link
              to="/signup"
              @click="mobileMenuOpen = false"
              class="block px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-center font-medium"
            >
              Sign Up
            </router-link>
          </div>
        </div>
      </transition>
    </div>
  </nav>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'

defineOptions({
  name: "AppNavbar"
})

const router = useRouter()
const mobileMenuOpen = ref(false)

// Close mobile menu when route changes
router.afterEach(() => {
  mobileMenuOpen.value = false
})
</script>
