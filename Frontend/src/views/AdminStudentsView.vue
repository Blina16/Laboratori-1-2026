<template>
  <div class="flex">
    <AdminSidebar />
    <div class="flex-1 ml-64">
      <div class="min-h-[calc(100vh-4rem)] bg-gray-50 p-8">
        <div class="max-w-7xl mx-auto">
          <!-- Header -->
          <div class="mb-8 flex items-center justify-between">
            <div>
              <h1 class="text-3xl font-bold text-gray-900 mb-2">Student Management</h1>
              <p class="text-gray-600">Manage students, their information, courses, and assigned tutors</p>
            </div>
            <button
              @click="openAddModal"
              class="btn-primary flex items-center gap-2"
            >
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
              </svg>
              Add Student
            </button>
          </div>

          <!-- Students Table -->
          <div class="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div class="overflow-x-auto">
              <table class="min-w-full divide-y divide-gray-200">
                <thead class="bg-gray-50">
                  <tr>
                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Name
                    </th>
                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Contact
                    </th>
                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Courses
                    </th>
                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Tutor
                    </th>
                    <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody class="bg-white divide-y divide-gray-200">
                  <tr v-if="students.length === 0">
                    <td colspan="5" class="px-6 py-12 text-center text-gray-500">
                      <svg class="mx-auto h-12 w-12 text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                      </svg>
                      <p>No students found. Click "Add Student" to get started.</p>
                    </td>
                  </tr>
                  <tr
                    v-for="student in students"
                    :key="student.id"
                    class="hover:bg-gray-50 transition"
                  >
                    <td class="px-6 py-4 whitespace-nowrap">
                      <div class="flex items-center">
                        <div class="w-10 h-10 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full flex items-center justify-center text-white font-semibold mr-3">
                          {{ student.name.charAt(0) }}{{ student.surname.charAt(0) }}
                        </div>
                        <div>
                          <div class="text-sm font-medium text-gray-900">
                            {{ student.name }} {{ student.surname }}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td class="px-6 py-4">
                      <div class="text-sm text-gray-900">{{ student.email }}</div>
                      <div v-if="student.phone" class="text-sm text-gray-500">{{ student.phone }}</div>
                    </td>
                    <td class="px-6 py-4">
                      <div class="flex flex-wrap gap-1">
                        <span
                          v-for="(course, index) in student.courses.slice(0, 3)"
                          :key="index"
                          class="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-green-100 text-green-800"
                        >
                          {{ course }}
                        </span>
                        <span
                          v-if="student.courses.length > 3"
                          class="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-gray-100 text-gray-800"
                        >
                          +{{ student.courses.length - 3 }} more
                        </span>
                        <span
                          v-if="student.courses.length === 0"
                          class="text-sm text-gray-400"
                        >
                          No courses
                        </span>
                      </div>
                    </td>
                    <td class="px-6 py-4">
                      <span v-if="student.tutor" class="text-sm text-gray-900">{{ student.tutor }}</span>
                      <span v-else class="text-sm text-gray-400">Not assigned</span>
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button
                        @click="openEditModal(student)"
                        class="text-blue-600 hover:text-blue-900 mr-4"
                      >
                        Edit
                      </button>
                      <button
                        @click="confirmDelete(student)"
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

    <!-- Add/Edit Student Modal -->
    <StudentModal
      v-if="showModal"
      :student="selectedStudent"
      :tutors="tutors"
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
        <h3 class="text-lg font-semibold text-gray-900 mb-2">Delete Student</h3>
        <p class="text-gray-600 mb-6">
          Are you sure you want to delete <strong>{{ studentToDelete?.name }} {{ studentToDelete?.surname }}</strong>? This action cannot be undone.
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
import { useStudentsStore } from '../stores/students'
import { useTutorsStore } from '../stores/tutors'
import StudentModal from '../components/StudentModal.vue'
import AdminSidebar from '../components/AdminSidebar.vue'

defineOptions({
  name: 'AdminStudentsView'
})

const studentsStore = useStudentsStore()
const tutorsStore = useTutorsStore()
const showModal = ref(false)
const showDeleteModal = ref(false)
const selectedStudent = ref(null)
const studentToDelete = ref(null)

const students = computed(() => studentsStore.getAllStudents)
const tutors = computed(() => tutorsStore.getAllTutors)

const openAddModal = () => {
  selectedStudent.value = null
  showModal.value = true
}

const openEditModal = (student) => {
  selectedStudent.value = { ...student }
  showModal.value = true
}

const closeModal = () => {
  showModal.value = false
  selectedStudent.value = null
}

const handleSave = (studentData) => {
  if (selectedStudent.value && selectedStudent.value.id) {
    // Update existing student
    studentsStore.updateStudent(selectedStudent.value.id, studentData)
  } else {
    // Add new student
    studentsStore.addStudent(studentData)
  }
  closeModal()
}

const confirmDelete = (student) => {
  studentToDelete.value = student
  showDeleteModal.value = true
}

const handleDelete = () => {
  if (studentToDelete.value) {
    studentsStore.deleteStudent(studentToDelete.value.id)
    showDeleteModal.value = false
    studentToDelete.value = null
  }
}
</script>

