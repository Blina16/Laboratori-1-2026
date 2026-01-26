<template>
  <div class="min-h-[calc(100vh-4rem)] flex items-center justify-center px-4 py-12">
    <div class="max-w-md w-full">
      <div class="text-center mb-8">
        <h1 class="text-3xl font-bold text-gray-900">Welcome Back</h1>
        <p class="text-gray-600">Sign in to continue</p>
      </div>

      <div class="bg-white p-8 rounded-xl shadow-lg border">
        <form @submit.prevent="handleLogin" class="space-y-6">

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
              class="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
              placeholder="Enter password"
            />
          </div>

          <!-- Submit -->
          <button
            type="submit"
            :disabled="isLoading"
            class="w-full btn-primary py-3 disabled:opacity-50"
          >
            <span v-if="!isLoading">Sign In</span>
            <span v-else>Signing in...</span>
          </button>

        </form>

        <p class="mt-6 text-center text-sm">
          Don’t have an account?
          <router-link to="/signup" class="text-blue-600 font-medium">
            Sign up
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
  name: 'LoginView'
})

const router = useRouter()
const isLoading = ref(false)

const form = ref({
  email: '',
  password: ''
})

const handleLogin = async () => {
  isLoading.value = true

  try {
    const res = await api.post('/auth/login', {
      email: form.value.email,
      password: form.value.password
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

  } catch {
    alert('Invalid email or password')
  } finally {
    isLoading.value = false
  }
}
</script>
