<template>
  <div
    class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
    @click.self="$emit('close')"
  >
    <div class="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
      <div class="p-6 border-b border-gray-200">
        <div class="flex items-center justify-between">
          <h2 class="text-2xl font-bold text-gray-900">
            {{ isEditMode ? 'Edit Student' : 'Add New Student' }}
          </h2>
          <button
            @click="$emit('close')"
            class="text-gray-400 hover:text-gray-600 transition"
          >
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      </div>

      <form @submit.prevent="handleSubmit" class="p-6 space-y-6">
        <!-- Name and Surname -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label for="name" class="block text-sm font-medium text-gray-700 mb-2">
              Name <span class="text-red-500">*</span>
            </label>
            <input
              id="name"
              v-model="form.name"
              type="text"
              required
              class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
              placeholder="John"
            />
          </div>
          <div>
            <label for="surname" class="block text-sm font-medium text-gray-700 mb-2">
              Surname <span class="text-red-500">*</span>
            </label>
            <input
              id="surname"
              v-model="form.surname"
              type="text"
              required
              class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
              placeholder="Doe"
            />
          </div>
        </div>

        <!-- Email and Phone -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label for="email" class="block text-sm font-medium text-gray-700 mb-2">
              Email <span class="text-red-500">*</span>
            </label>
            <input
              id="email"
              v-model="form.email"
              type="email"
              required
              class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
              placeholder="john.doe@example.com"
            />
          </div>
          <div>
            <label for="phone" class="block text-sm font-medium text-gray-700 mb-2">
              Phone
            </label>
            <input
              id="phone"
              v-model="form.phone"
              type="tel"
              class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
              placeholder="+1 234 567 8900"
            />
          </div>
        </div>

        <!-- Assigned Tutor -->
        <div>
          <label for="tutor" class="block text-sm font-medium text-gray-700 mb-2">
            Assigned Tutor
          </label>
          <select
            id="tutor"
            v-model="form.tutor"
            class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
          >
            <option value="">Select a tutor (optional)</option>
            <option
              v-for="tutor in tutors"
              :key="tutor.id"
              :value="`${tutor.name} ${tutor.surname}`"
            >
              {{ tutor.name }} {{ tutor.surname }}
            </option>
          </select>
        </div>

        <!-- Courses -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">
            Courses
          </label>
          <div class="space-y-2">
            <div
              v-for="(course, index) in form.courses"
              :key="index"
              class="flex items-center gap-2"
            >
              <input
                v-model="form.courses[index]"
                type="text"
                class="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                :placeholder="`Course ${index + 1} name`"
              />
              <button
                type="button"
                @click="removeCourse(index)"
                class="px-3 py-2 text-red-600 hover:bg-red-50 rounded-lg transition"
              >
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <button
              type="button"
              @click="addCourse"
              class="w-full px-4 py-2 border-2 border-dashed border-gray-300 rounded-lg text-gray-600 hover:border-blue-500 hover:text-blue-600 transition flex items-center justify-center gap-2"
            >
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
              </svg>
              Add Course
            </button>
          </div>
        </div>

        <!-- Form Actions -->
        <div class="flex justify-end gap-3 pt-4 border-t border-gray-200">
          <button
            type="button"
            @click="$emit('close')"
            class="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition"
          >
            Cancel
          </button>
          <button
            type="submit"
            class="btn-primary px-6 py-2"
          >
            {{ isEditMode ? 'Update Student' : 'Add Student' }}
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue'

const props = defineProps({
  student: {
    type: Object,
    default: null
  },
  tutors: {
    type: Array,
    default: () => []
  }
})

const emit = defineEmits(['close', 'save'])

const isEditMode = computed(() => !!props.student)

const form = ref({
  name: '',
  surname: '',
  email: '',
  phone: '',
  tutor: '',
  courses: []
})

// Initialize form when student prop changes
watch(() => props.student, (newStudent) => {
  if (newStudent) {
    form.value = {
      name: newStudent.name || '',
      surname: newStudent.surname || '',
      email: newStudent.email || '',
      phone: newStudent.phone || '',
      tutor: newStudent.tutor || '',
      courses: newStudent.courses ? [...newStudent.courses] : []
    }
  } else {
    form.value = {
      name: '',
      surname: '',
      email: '',
      phone: '',
      tutor: '',
      courses: []
    }
  }
}, { immediate: true })

const addCourse = () => {
  form.value.courses.push('')
}

const removeCourse = (index) => {
  form.value.courses.splice(index, 1)
}

const handleSubmit = () => {
  // Filter out empty courses
  const studentData = {
    name: form.value.name.trim(),
    surname: form.value.surname.trim(),
    email: form.value.email.trim(),
    phone: form.value.phone.trim(),
    tutor: form.value.tutor.trim(),
    courses: form.value.courses.filter(c => c.trim() !== '')
  }
  
  emit('save', studentData)
}
</script>

