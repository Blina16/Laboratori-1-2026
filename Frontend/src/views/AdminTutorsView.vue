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
                  Experience
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Students
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Courses
                </th>
                <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-200">
              <tr v-if="tutors.length === 0">
                <td colspan="5" class="px-6 py-12 text-center text-gray-500">
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
                      {{ tutor.name.charAt(0) }}{{ tutor.surname.charAt(0) }}
                    </div>
                    <div>
                      <div class="text-sm font-medium text-gray-900">
                        {{ tutor.name }} {{ tutor.surname }}
                      </div>
                    </div>
                  </div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <span class="text-sm text-gray-900">{{ tutor.experience }} years</span>
                </td>
                <td class="px-6 py-4">
                  <div class="flex flex-wrap gap-1">
                    <span
                      v-for="(student, index) in tutor.students.slice(0, 3)"
                      :key="index"
                      class="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-blue-100 text-blue-800"
                    >
                      {{ student }}
                    </span>
                    <span
                      v-if="tutor.students.length > 3"
                      class="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-gray-100 text-gray-800"
                    >
                      +{{ tutor.students.length - 3 }} more
                    </span>
                    <span
                      v-if="tutor.students.length === 0"
                      class="text-sm text-gray-400"
                    >
                      No students
                    </span>
                  </div>
                </td>
                <td class="px-6 py-4">
                  <div class="flex flex-wrap gap-1">
                    <span
                      v-for="(course, index) in tutor.courses.slice(0, 3)"
                      :key="index"
                      class="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-green-100 text-green-800"
                    >
                      {{ course }}
                    </span>
                    <span
                      v-if="tutor.courses.length > 3"
                      class="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-gray-100 text-gray-800"
                    >
                      +{{ tutor.courses.length - 3 }} more
                    </span>
                    <span
                      v-if="tutor.courses.length === 0"
                      class="text-sm text-gray-400"
                    >
                      No courses
                    </span>
                  </div>
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
import { ref, computed } from 'vue'
import { useTutorsStore } from '../stores/tutors'
import TutorModal from '../components/TutorModal.vue'
import AdminSidebar from '../components/AdminSidebar.vue'

defineOptions({
  name: 'AdminTutorsView'
})

const tutorsStore = useTutorsStore()
const showModal = ref(false)
const showDeleteModal = ref(false)
const selectedTutor = ref(null)
const tutorToDelete = ref(null)

const tutors = computed(() => tutorsStore.getAllTutors)

const openAddModal = () => {
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

const handleSave = (tutorData) => {
  if (selectedTutor.value && selectedTutor.value.id) {
    // Update existing tutor
    tutorsStore.updateTutor(selectedTutor.value.id, tutorData)
  } else {
    // Add new tutor
    tutorsStore.addTutor(tutorData)
  }
  closeModal()
}

const confirmDelete = (tutor) => {
  tutorToDelete.value = tutor
  showDeleteModal.value = true
}

const handleDelete = () => {
  if (tutorToDelete.value) {
    tutorsStore.deleteTutor(tutorToDelete.value.id)
    showDeleteModal.value = false
    tutorToDelete.value = null
  }
}
</script>

