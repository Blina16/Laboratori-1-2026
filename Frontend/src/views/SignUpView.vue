<template>
  <div class="min-h-[calc(100vh-4rem)] flex items-center justify-center px-4 py-12">
    <div class="max-w-md w-full">
      <div class="text-center mb-8">
        <h1 class="text-3xl font-bold text-gray-900">Create Account</h1>
        <p class="text-gray-600">Sign up to get started</p>
      </div>

      <div class="bg-white p-8 rounded-xl shadow-lg border">
        <form @submit.prevent="handleSignUp" class="space-y-6">

          <!-- Name -->
          <div>
            <label class="block text-sm font-medium mb-2">Full Name</label>
            <input
              v-model="form.name"
              type="text"
              required
              class="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
              placeholder="John Doe"
            />
          </div>

          <!-- Email -->
          <div>
            <label class="block text-sm font-medium mb-2">Email</label>
            <input
              v-model="form.email"
              type="email"
              required
              class="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
              placeholder="you@example.com"
            />
          </div>

          <!-- Password -->
          <div>
            <label class="block text-sm font-medium mb-2">Password</label>
            <input
              v-model="form.password"
              type="password"
              required
              minlength="6"
              class="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
              placeholder="Enter password"
            />
          </div>

          <!-- Role Selection -->
          <div>
            <label class="block text-sm font-medium mb-2">I am a</label>
            <select
              v-model="form.role"
              required
              class="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Select your role</option>
              <option value="student">Student</option>
              <option value="teacher">Teacher</option>
            </select>
          </div>

          <!-- Submit -->
          <button
            type="submit"
            :disabled="isLoading"
            class="w-full btn-primary py-3 disabled:opacity-50"
          >
            <span v-if="!isLoading">Sign Up</span>
            <span v-else>Creating account...</span>
          </button>

        </form>

        <p class="mt-6 text-center text-sm">
          Already have an account?
          <router-link to="/login" class="text-blue-600 font-medium">
            Sign in
          </router-link>
        </p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import api from '@/services/api'

defineOptions({
  name: 'SignUpView'
})

const router = useRouter()
const isLoading = ref(false)

const form = ref({
  name: '',
  email: '',
  password: '',
  role: ''
})

const handleSignUp = async () => {
  isLoading.value = true

  try {
    const res = await api.post('/auth/register', {
      name: form.value.name,
      email: form.value.email,
      password: form.value.password,
      role: form.value.role
    })

    const { token, user } = res.data

    // Save auth
    localStorage.setItem('token', token)
    localStorage.setItem('user', JSON.stringify(user))

    // Redirect based on role
    if (user.role === 'admin') {
      router.push('/admin/dashboard')
    } else if (user.role === 'teacher') {
      router.push('/teacher/availability')
    } else if (user.role === 'student') {
      router.push('/student/dashboard')
    } else {
      router.push('/dashboard')
    }

  } catch (error) {
    const message = error.response?.data?.message || 'Sign up failed'
    alert(message)
  } finally {
    isLoading.value = false
  }
}
</script>
