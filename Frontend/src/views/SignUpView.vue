<template>
  <div class="min-h-[calc(100vh-4rem)] flex items-center justify-center px-4 sm:px-6 lg:px-8 py-12">
    <div class="max-w-md w-full">
      <div class="text-center mb-8">
        <h1 class="text-3xl font-bold text-gray-900 mb-2">Create Account</h1>
        <p class="text-gray-600">Sign up to get started with TutorRemote</p>
      </div>

      <div class="bg-white rounded-xl shadow-lg p-8 border border-gray-100">
        <form @submit.prevent="handleSignUp" class="space-y-5">
          <!-- Full Name Field -->
          <div>
            <label for="name" class="block text-sm font-medium text-gray-700 mb-2">
              Full Name
            </label>
            <input
              id="name"
              v-model="form.name"
              type="text"
              required
              class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
              placeholder="John Doe"
            />
          </div>

          <!-- Email Field -->
          <div>
            <label for="email" class="block text-sm font-medium text-gray-700 mb-2">
              Email Address
            </label>
            <input
              id="email"
              v-model="form.email"
              type="email"
              required
              class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
              placeholder="you@example.com"
            />
          </div>

          <!-- Password Field -->
          <div>
            <label for="password" class="block text-sm font-medium text-gray-700 mb-2">
              Password
            </label>
            <input
              id="password"
              v-model="form.password"
              type="password"
              required
              :class="[
                'w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition',
                passwordError ? 'border-red-300' : 'border-gray-300'
              ]"
              placeholder="Create a password"
              @input="validatePassword"
            />
            <p v-if="passwordError" class="mt-1 text-sm text-red-600">{{ passwordError }}</p>
            <p v-else-if="form.password" class="mt-1 text-xs text-gray-500">
              Must be at least 8 characters
            </p>
          </div>

          <!-- Confirm Password Field -->
          <div>
            <label for="confirmPassword" class="block text-sm font-medium text-gray-700 mb-2">
              Confirm Password
            </label>
            <input
              id="confirmPassword"
              v-model="form.confirmPassword"
              type="password"
              required
              :class="[
                'w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition',
                confirmPasswordError ? 'border-red-300' : 'border-gray-300'
              ]"
              placeholder="Confirm your password"
              @input="validateConfirmPassword"
            />
            <p v-if="confirmPasswordError" class="mt-1 text-sm text-red-600">{{ confirmPasswordError }}</p>
          </div>

          <!-- Terms and Conditions -->
          <div class="flex items-start">
            <input
              id="terms"
              v-model="form.acceptTerms"
              type="checkbox"
              required
              class="mt-1 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <label for="terms" class="ml-2 block text-sm text-gray-700">
              I agree to the
              <a href="#" class="text-blue-600 hover:text-blue-700">Terms and Conditions</a>
              and
              <a href="#" class="text-blue-600 hover:text-blue-700">Privacy Policy</a>
            </label>
          </div>

          <!-- Submit Button -->
          <button
            type="submit"
            :disabled="isLoading || passwordError || confirmPasswordError"
            class="w-full btn-primary py-3 text-base font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <span v-if="!isLoading">Create Account</span>
            <span v-else class="flex items-center justify-center">
              <svg class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Creating account...
            </span>
          </button>
        </form>

        <!-- Divider -->
        <div class="mt-6">
          <div class="relative">
            <div class="absolute inset-0 flex items-center">
              <div class="w-full border-t border-gray-300"></div>
            </div>
            <div class="relative flex justify-center text-sm">
              <span class="px-2 bg-white text-gray-500">Or sign up with</span>
            </div>
          </div>
        </div>

        <!-- Social Sign Up Buttons -->
        <div class="mt-6 grid grid-cols-2 gap-3">
          <button
            type="button"
            class="w-full inline-flex justify-center py-2 px-4 border border-gray-300 rounded-lg shadow-sm bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 transition"
          >
            <svg class="h-5 w-5" viewBox="0 0 24 24">
              <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
              <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
            <span class="ml-2">Google</span>
          </button>
          <button
            type="button"
            class="w-full inline-flex justify-center py-2 px-4 border border-gray-300 rounded-lg shadow-sm bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 transition"
          >
            <svg class="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
            </svg>
            <span class="ml-2">GitHub</span>
          </button>
        </div>

        <!-- Login Link -->
        <p class="mt-6 text-center text-sm text-gray-600">
          Already have an account?
          <router-link to="/login" class="font-medium text-blue-600 hover:text-blue-700">
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

defineOptions({
  name: 'SignUpView'
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
  acceptTerms: false
})

const validatePassword = () => {
  if (form.value.password.length > 0 && form.value.password.length < 8) {
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

const handleSignUp = async () => {
  if (passwordError.value || confirmPasswordError.value) {
    return
  }

  isLoading.value = true
  
  try {
    // TODO: Add API call here
    console.log('Sign up attempt:', form.value)
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    // Save user data (in real app, this would come from API response)
    localStorage.setItem('userName', form.value.name)
    localStorage.setItem('userEmail', form.value.email)
    
    // Redirect to dashboard after successful signup
    router.push('/dashboard')
  } catch (error) {
    console.error('Sign up error:', error)
  } finally {
    isLoading.value = false
  }
}
</script>

