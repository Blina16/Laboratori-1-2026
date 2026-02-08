<template>
  <div class="flex">
    <!-- Sidebar -->
    <aside class="w-64 bg-white shadow-lg p-6 flex flex-col">
      <h2 class="text-xl font-bold mb-6">Admin Menu</h2>

      <button
        @click="activeTab = 'tutors'"
        class="w-full mb-2 px-4 py-3 rounded-lg text-left"
        :class="activeTab === 'tutors' ? 'bg-blue-600 text-white' : 'hover:bg-gray-100'"
      >
        Tutors
      </button>

      <button
        @click="activeTab = 'favorites'"
        class="w-full mb-2 px-4 py-3 rounded-lg text-left"
        :class="activeTab === 'favorites' ? 'bg-yellow-500 text-white' : 'hover:bg-yellow-100'"
      >
        Favorites
      </button>
    </aside>

    <!-- Main -->
    <div class="flex-1 ml-64">
      <div class="min-h-[calc(100vh-4rem)] bg-gray-50 p-8">
        <div class="max-w-7xl mx-auto">

          <!-- Tutors View -->
          <div v-if="activeTab === 'tutors'">
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
                  {{ isLoading ? 'Loading...' : 'Refresh' }}
                </button>
                <button
                  @click="openAddModal"
                  class="btn-primary flex items-center gap-2"
                >
                  Add Tutor
                </button>
              </div>
            </div>

            <div class="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
              <div class="overflow-x-auto">
                <table class="min-w-full divide-y divide-gray-200">
                  <thead class="bg-gray-50">
                    <tr>
                      <th>Name</th>
                      <th>Email</th>
                      <th>Subject</th>
                      <th>Experience</th>
                      <th>Price/Hour</th>
                      <th class="text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody class="bg-white divide-y divide-gray-200">
                    <tr v-if="isLoading">
                      <td colspan="6" class="px-6 py-12 text-center text-gray-500">
                        Loading tutors...
                      </td>
                    </tr>
                    <tr v-else-if="tutors.length === 0">
                      <td colspan="6" class="px-6 py-12 text-center text-gray-500">
                        No tutors found.
                      </td>
                    </tr>
                    <tr v-for="tutor in tutors" :key="tutor.id">
                      <td>{{ tutor.name }} {{ tutor.surname }}</td>
                      <td>{{ tutor.email }}</td>
                      <td>{{ tutor.subject }}</td>
                      <td>{{ tutor.experience }} yrs</td>
                      <td>${{ tutor.price }}/hr</td>
                      <td class="text-right">
                        <button @click="openEditModal(tutor)" class="text-blue-600 mr-2">Edit</button>
                        <button @click="confirmDelete(tutor)" class="text-red-600">Delete</button>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          <!-- Favorites View -->
          <div v-else-if="activeTab === 'favorites'">
            <h2 class="text-2xl font-bold mb-4">Favorite Tutors</h2>
            <ul>
              <li v-for="t in favoriteTutors" :key="t.id" class="mb-2 p-4 bg-white rounded-lg shadow">
                {{ t.name }} {{ t.surname }}
              </li>
              <li v-if="favoriteTutors.length === 0" class="text-gray-500">No favorites yet.</li>
            </ul>
          </div>

        </div>
      </div>
    </div>

    <!-- Modals -->
    <TutorModal
      v-if="showModal"
      :tutor="selectedTutor"
      @close="closeModal"
      @save="handleSave"
    />

    <div v-if="showDeleteModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div class="bg-white p-6 rounded-xl">
        <p>Delete {{ tutorToDelete?.name }}?</p>
        <button @click="showDeleteModal = false">Cancel</button>
        <button @click="handleDelete">Delete</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import api from '@/services/api'
import TutorModal from '../components/TutorModal.vue'

const tutors = ref([])
const isLoading = ref(true)
const showModal = ref(false)
const showDeleteModal = ref(false)
const selectedTutor = ref(null)
const tutorToDelete = ref(null)
const activeTab = ref('tutors')
const favorites = ref(new Set(JSON.parse(localStorage.getItem('favorites') || '[]')))

const fetchTutors = async () => {
  try {
    isLoading.value = true
    const res = await api.get('/tutors')
    tutors.value = res.data.map(t => ({
      ...t,
      surname: t.name.split(' ').slice(1).join(' '),
      name: t.name.split(' ')[0],
    }))
  } catch (e) {
    console.error(e)
    tutors.value = []
  } finally {
    isLoading.value = false
  }
}

const openAddModal = () => showModal.value = true
const openEditModal = (t) => { selectedTutor.value = { ...t }; showModal.value = true }
const closeModal = () => { showModal.value = false; selectedTutor.value = null }
const confirmDelete = (t) => { tutorToDelete.value = t; showDeleteModal.value = true }
const handleDelete = async () => {
  if (!tutorToDelete.value) return
  await api.delete(`/tutors/${tutorToDelete.value.id}`)
  await fetchTutors()
  showDeleteModal.value = false
  tutorToDelete.value = null
}
const handleSave = async (data) => {
  if (selectedTutor.value && selectedTutor.value.id) {
    await api.put(`/tutors/${selectedTutor.value.id}`, data)
  } else {
    await api.post('/tutors', data)
  }
  await fetchTutors()
  closeModal()
}

const favoriteTutors = computed(() => tutors.value.filter(t => favorites.value.has(t.id)))

onMounted(fetchTutors)
</script>
