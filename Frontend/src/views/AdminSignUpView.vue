<template>
  <div class="min-h-[calc(100vh-4rem)] flex items-center justify-center px-4 sm:px-6 lg:px-8 py-12">
    <div class="max-w-md w-full">
      <!-- Header -->
      <div class="text-center mb-8">
        <h1 class="text-3xl font-bold text-gray-900 mb-2">Admin Registration</h1>
        <p class="text-gray-600">Create an administrator account</p>
        <p class="text-sm text-red-600 mt-2">⚠️ Requires admin authorization key</p>
      </div>

      <div class="bg-white rounded-xl shadow-lg p-8 border border-gray-100">
        <form @submit.prevent="handleAdminSignUp" class="space-y-5">

          <!-- Full Name -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
            <input
              v-model="form.name"
              type="text"
              required
              placeholder="Admin Name"
              class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>

          <!-- Email -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
            <input
              v-model="form.email"
              type="email"
              required
              placeholder="admin@example.com"
              class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>

          <!-- Password -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Password</label>
            <input
              v-model="form.password"
              type="password"
              required
              placeholder="Create a strong password"
              @input="validatePassword"
              :class="[
                'w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none',
                passwordError ? 'border-red-300' : 'border-gray-300'
              ]"
            />
            <p v-if="passwordError" class="text-sm text-red-600 mt-1">
              {{ passwordError }}
            </p>
          </div>

          <!-- Confirm Password -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Confirm Password</label>
            <input
              v-model="form.confirmPassword"
              type="password"
              required
              placeholder="Confirm your password"
              @input="validateConfirmPassword"
              :class="[
                'w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none',
                confirmPasswordError ? 'border-red-300' : 'border-gray-300'
              ]"
            />
            <p v-if="confirmPasswordError" class="text-sm text-red-600 mt-1">
              {{ confirmPasswordError }}
            </p>
          </div>

          <!-- Admin Key -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Admin Authorization Key</label>
            <input
              v-model="form.adminKey"
              type="password"
              required
              placeholder="Enter admin key"
              class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
            />
            <p class="text-xs text-gray-500 mt-1">This key is required to create admin accounts</p>
          </div>

          <!-- Terms -->
          <div class="flex items-start">
            <input
              type="checkbox"
              v-model="form.acceptTerms"
              required
              class="mt-1 h-4 w-4 text-blue-600 border-gray-300 rounded"
            />
            <p class="ml-2 text-sm text-gray-700">
              I have the authority to create this admin account and accept the
              <span class="text-blue-600">Terms</span> and
              <span class="text-blue-600">Privacy Policy</span>
            </p>
          </div>

          <!-- Submit -->
          <button
            type="submit"
            :disabled="isLoading"
            class="w-full bg-red-600 text-white py-3 rounded-lg hover:bg-red-700 transition disabled:opacity-50"
          >
            <span v-if="!isLoading">Create Admin Account</span>
            <span v-else>Creating admin account...</span>
          </button>

        </form>

        <!-- Login -->
        <p class="mt-6 text-center text-sm text-gray-600">
          Already have an account?
          <router-link to="/login" class="text-blue-600 font-medium">
            Sign in
          </router-link>
        </p>

        <!-- Regular Signup -->
        <p class="mt-4 text-center text-sm text-gray-600">
          Not an admin?
          <router-link to="/signup" class="text-green-600 font-medium">
            Create regular account
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
  name: 'AdminSignUpView'
})

const router = useRouter()
const isLoading = ref(false)

const passwordError = ref('')
const confirmPasswordError = ref('')

const form = ref({
  name: '',
  email: '',
  password: '',
  confirmPassword: '',
  adminKey: '',
  acceptTerms: false
})

const validatePassword = () => {
  if (form.value.password.length < 8) {
    passwordError.value = 'Password must be at least 8 characters'
  } else {
    passwordError.value = ''
  }
  validateConfirmPassword()
}

const validateConfirmPassword = () => {
  if (form.value.confirmPassword && form.value.password !== form.value.confirmPassword) {
    confirmPasswordError.value = 'Passwords do not match'
  } else {
    confirmPasswordError.value = ''
  }
}

const handleAdminSignUp = async () => {
  validatePassword()
  validateConfirmPassword()

  if (passwordError.value || confirmPasswordError.value || !form.value.acceptTerms || !form.value.adminKey) {
    alert('Please fix the highlighted fields before signing up')
    return
  }

  isLoading.value = true

  try {
    const res = await api.post('/auth/register-admin', {
      name: form.value.name,
      email: form.value.email,
      password: form.value.password,
      adminKey: form.value.adminKey
    })

    const { token, user } = res.data

    localStorage.setItem('token', token)
    localStorage.setItem('user', JSON.stringify(user))

    alert('Admin account created successfully!')
    router.push('/admin/dashboard')
  } catch (err) {
    alert(err.response?.data?.message || 'Admin registration failed')
  } finally {
    isLoading.value = false
  }
}
</script>
