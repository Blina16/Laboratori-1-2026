<template>
  <div class="min-h-screen bg-gray-50 p-8">
    <h1 class="text-4xl font-bold text-blue-600 mb-4">Student Dashboard Test</h1>
    <p class="text-lg mb-4">If you can see this, the basic routing and component loading works.</p>
    
    <div class="bg-white p-6 rounded-lg shadow">
      <h2 class="text-2xl font-semibold mb-4">Debug Information:</h2>
      
      <div class="space-y-2">
        <p><strong>User:</strong> {{ user ? JSON.stringify(user) : 'Not loaded' }}</p>
        <p><strong>Token:</strong> {{ token ? 'Present' : 'Missing' }}</p>
        <p><strong>Show Tutors:</strong> {{ showTutors }}</p>
        <p><strong>Loading:</strong> {{ isLoading }}</p>
      </div>
      
      <div class="mt-6">
        <button 
          @click="testAPI" 
          class="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Test API Connection
        </button>
        
        <div v-if="apiResult" class="mt-4 p-4 bg-gray-100 rounded">
          <strong>API Result:</strong> {{ apiResult }}
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import api from '@/services/api'

const user = ref(null)
const token = ref(null)
const showTutors = ref(true)
const isLoading = ref(false)
const apiResult = ref(null)

const loadUser = () => {
  const savedUser = localStorage.getItem('user')
  const savedToken = localStorage.getItem('token')
  if (savedUser) {
    user.value = JSON.parse(savedUser)
  }
  token.value = savedToken
}

const testAPI = async () => {
  try {
    isLoading.value = true
    const response = await api.get('/tutors')
    apiResult.value = `Success: Found ${response.data?.length || 0} tutors`
  } catch (error) {
    apiResult.value = `Error: ${error.message}`
  } finally {
    isLoading.value = false
  }
}

onMounted(() => {
  loadUser()
})
</script>
