<template>
  <div class="flex">
    <AdminSidebar />
    <div class="flex-1 ml-64">
      <div class="min-h-[calc(100vh-4rem)] bg-gray-50 p-8">
        <div class="max-w-7xl mx-auto">
      <!-- Header -->
      <div class="mb-8 flex items-center justify-between">
        <div>
          <h1 class="text-3xl font-bold text-gray-900 mb-2">Tutor Management</h1>
          <p class="text-gray-600">Manage tutors, their experience, students, and courses</p>
        </div>
        <div class="flex gap-2">
          <button
            @click="fetchTutors"
            :disabled="isLoading"
            class="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition disabled:opacity-50 flex items-center gap-2"
          >
            <svg v-if="!isLoading" class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            <svg v-else class="w-5 h-5 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            {{ isLoading ? 'Loading...' : 'Refresh' }}
          </button>
          <button
            @click="testAPI"
            class="px-4 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition flex items-center gap-2"
          >
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
            </svg>
          </button>
          <button
            @click="openAddModal"
            class="btn-primary flex items-center gap-2"
          >
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
            </svg>
            Add Tutor
          </button>
        </div>
      </div>

      <!-- Tutors Table -->
      <div class="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div class="overflow-x-auto">
          <table class="min-w-full divide-y divide-gray-200">
            <thead class="bg-gray-50">
              <tr>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Name
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Email
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Subject
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Experience
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Price/Hour
                </th>
                <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-200">
              <tr v-if="isLoading">
                <td colspan="6" class="px-6 py-12 text-center text-gray-500">
                  <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
                  <p>Loading tutors...</p>
                </td>
              </tr>
              <tr v-else-if="tutors.length === 0">
                <td colspan="6" class="px-6 py-12 text-center text-gray-500">
                  <svg class="mx-auto h-12 w-12 text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                  <p>No tutors found. Click "Add Tutor" to get started.</p>
                </td>
              </tr>
              <tr
                v-for="tutor in tutors"
                :key="tutor.id"
                class="hover:bg-gray-50 transition"
              >
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="flex items-center">
                    <div class="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center text-white font-semibold mr-3">
                      {{ tutor.name.charAt(0) }}{{ tutor.surname ? tutor.surname.charAt(0) : '' }}
                    </div>
                    <div>
                      <div class="text-sm font-medium text-gray-900">
                        {{ tutor.name }} {{ tutor.surname || '' }}
                      </div>
                      <div class="text-xs text-gray-500">{{ tutor.email }}</div>
                    </div>
                  </div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <span class="text-sm text-gray-900">{{ tutor.subject || 'Not specified' }}</span>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <span class="text-sm text-gray-900">{{ tutor.experience }} years</span>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <span class="text-sm font-semibold text-green-600">${{ tutor.price || 0 }}/hr</span>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <button
                    @click="openEditModal(tutor)"
                    class="text-blue-600 hover:text-blue-900 mr-4"
                  >
                    Edit
                  </button>
                  <button
                    @click="confirmDelete(tutor)"
                    class="text-red-600 hover:text-red-900"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
        </div>
      </div>
    </div>

    <!-- Add/Edit Tutor Modal -->
    <TutorModal
      v-if="showModal"
      :tutor="selectedTutor"
      @close="closeModal"
      @save="handleSave"
    />

    <!-- Delete Confirmation Modal -->
    <div
      v-if="showDeleteModal"
      class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
      @click.self="showDeleteModal = false"
    >
      <div class="bg-white rounded-xl shadow-xl p-6 max-w-md w-full mx-4">
        <h3 class="text-lg font-semibold text-gray-900 mb-2">Delete Tutor</h3>
        <p class="text-gray-600 mb-6">
          Are you sure you want to delete <strong>{{ tutorToDelete?.name }} {{ tutorToDelete?.surname }}</strong>? This action cannot be undone.
        </p>
        <div class="flex justify-end gap-3">
          <button
            @click="showDeleteModal = false"
            class="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition"
          >
            Cancel
          </button>
          <button
            @click="handleDelete"
            class="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { useTutorsStore } from '@/stores/tutors'
import AdminSidebar from '../components/AdminSidebar.vue'
import TutorModal from '../components/TutorModal.vue'

defineOptions({
  name: 'AdminTutorsView'
})

// Store
const tutorsStore = useTutorsStore()

// Reactive state
const showModal = ref(false)
const showDeleteModal = ref(false)
const selectedTutor = ref(null)
const tutorToDelete = ref(null)

// Computed properties
const tutors = computed(() => tutorsStore.tutors)
const isLoading = computed(() => tutorsStore.isLoading)

// Methods
const fetchTutors = async () => {
  try {
    await tutorsStore.fetchTutors()
  } catch (error) {
    console.error('Failed to fetch tutors:', error)
    alert('Failed to load tutors: ' + (error.response?.data?.message || error.message))
  }
}

const testAPI = async () => {
  console.log('🧪 Testing API connectivity...');

  try {
    // Test basic connectivity
    console.log('1. Testing basic connectivity...');
    const response = await fetch('/api/test');
    const data = await response.json();
    console.log('✅ Basic connectivity test:', data);

    // Test teachers endpoint
    console.log('2. Testing tutors endpoint...');
    const tutorsResponse = await fetch('/api/tutors');
    const tutorsData = await tutorsResponse.json();
    console.log('✅ Tutors endpoint test:', tutorsData);

    alert('✅ API is working! Check console for details.');
  } catch (error) {
    console.error('❌ API Test failed:', error);
    alert('❌ API Test failed. Check console for details.');
  }
}

const openAddModal = () => {
  console.log('🔍 Opening Add Tutor modal');
  selectedTutor.value = null
  showModal.value = true
}

const openEditModal = (tutor) => {
  selectedTutor.value = { ...tutor }
  showModal.value = true
}

const closeModal = () => {
  showModal.value = false
  selectedTutor.value = null
}

const handleSave = async (tutorData) => {
  console.log('🔍 handleSave called with:', tutorData);

  try {
    if (selectedTutor.value && selectedTutor.value.id) {
      // Update existing tutor
      console.log('📝 Updating tutor:', selectedTutor.value.id);
      await tutorsStore.updateTutor(selectedTutor.value.id, tutorData)
      alert('Tutor updated successfully!')
    } else {
      // Add new tutor
      console.log('📝 Adding new tutor');
      await tutorsStore.addTutor(tutorData)
      alert('Tutor added successfully!')
    }

    closeModal()
  } catch (error) {
    console.error('❌ Failed to save tutor:', error.response?.data || error.message)
    const errorMessage = error.response?.data?.message || error.message
    alert('Failed to save tutor: ' + errorMessage)
  }
}

const confirmDelete = (tutor) => {
  tutorToDelete.value = tutor
  showDeleteModal.value = true
}

const handleDelete = async () => {
  try {
    if (tutorToDelete.value) {
      console.log('🗑️ Deleting tutor:', tutorToDelete.value.id);
      
      await tutorsStore.deleteTutor(tutorToDelete.value.id)
      
      // Show success message
      alert('Tutor deleted successfully!')
      
      // Close modal and clear selection
      showDeleteModal.value = false
      tutorToDelete.value = null
    }
  } catch (error) {
    console.error('❌ Failed to delete tutor:', error.response?.data || error.message)
    const errorMessage = error.response?.data?.message || error.message
    alert('Failed to delete tutor: ' + errorMessage)
  }
}

onMounted(() => {
  fetchTutors()
})
</script>

