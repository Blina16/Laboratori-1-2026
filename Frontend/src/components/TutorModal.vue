<template>
  <div
    class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
    @click.self="$emit('close')"
  >
    <div class="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
      <div class="p-6 border-b border-gray-200">
        <div class="flex items-center justify-between">
          <h2 class="text-2xl font-bold text-gray-900">
            {{ isEditMode ? 'Edit Tutor' : 'Add New Tutor' }}
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

        <!-- Email -->
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
            placeholder="tutor@example.com"
          />
        </div>

        <!-- Password -->
        <div>
          <label for="password" class="block text-sm font-medium text-gray-700 mb-2">
            Password <span class="text-red-500">*</span>
          </label>
          <input
            id="password"
            v-model="form.password"
            type="password"
            :required="!isEditMode"
            class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
            :placeholder="isEditMode ? 'Leave blank to keep current' : 'Enter password'"
          />
        </div>

        <!-- Subject -->
        <div>
          <label for="subject" class="block text-sm font-medium text-gray-700 mb-2">
            Subject <span class="text-red-500">*</span>
          </label>
          <select
            id="subject"
            v-model="form.subject"
            required
            class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
          >
            <option value="">Select a subject</option>
            <option value="Mathematics">Mathematics</option>
            <option value="Physics">Physics</option>
            <option value="Chemistry">Chemistry</option>
            <option value="Biology">Biology</option>
            <option value="Computer Science">Computer Science</option>
            <option value="English">English</option>
            <option value="History">History</option>
            <option value="Other">Other</option>
          </select>
        </div>

        <!-- Experience -->
        <div>
          <label for="experience" class="block text-sm font-medium text-gray-700 mb-2">
            Experience (years) <span class="text-red-500">*</span>
          </label>
          <input
            id="experience"
            v-model.number="form.experience"
            type="number"
            min="0"
            required
            class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
            placeholder="5"
          />
        </div>

        <!-- Price/Hour -->
        <div>
          <label for="price" class="block text-sm font-medium text-gray-700 mb-2">
            Price/Hour ($) <span class="text-red-500">*</span>
          </label>
          <input
            id="price"
            v-model.number="form.price"
            type="number"
            min="0"
            step="0.01"
            required
            class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
            placeholder="50.00"
          />
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
            {{ isEditMode ? 'Update Tutor' : 'Add Tutor' }}
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue'

const props = defineProps({
  tutor: {
    type: Object,
    default: null
  }
})

const emit = defineEmits(['close', 'save'])

const isEditMode = computed(() => !!props.tutor)

const form = ref({
  name: '',
  surname: '',
  email: '',
  subject: '',
  experience: 0,
  price: 0,
  students: [],
  courses: []
})

// Initialize form when tutor prop changes
watch(() => props.tutor, (newTutor) => {
  if (newTutor) {
    form.value = {
      name: newTutor.name || '',
      surname: newTutor.surname || '',
      email: newTutor.email || '',
      password: '', // Don't pre-fill password for security
      subject: newTutor.subject || '',
      experience: newTutor.experience || 0,
      price: newTutor.price || 0,
      students: newTutor.students ? [...newTutor.students] : [],
      courses: newTutor.courses ? [...newTutor.courses] : []
    }
  } else {
    form.value = {
      name: '',
      surname: '',
      email: '',
      password: '',
      subject: '',
      experience: 0,
      price: 0,
      students: [],
      courses: []
    }
  }
}, { immediate: true })

const addStudent = () => {
  form.value.students.push('')
}

const removeStudent = (index) => {
  form.value.students.splice(index, 1)
}

const addCourse = () => {
  form.value.courses.push('')
}

const removeCourse = (index) => {
  form.value.courses.splice(index, 1)
}

const handleSubmit = () => {
  console.log('🔍 Form submission triggered');
  console.log('📝 Form data:', form.value);
  
  // Check if required fields are filled
  if (!form.value.name || !form.value.surname || !form.value.email || !form.value.subject || (!isEditMode && !form.value.password)) {
    console.log('❌ Missing required fields');
    alert('Please fill in all required fields (Name, Surname, Email, Password, Subject)');
    return;
  }
  
  // Filter out empty students and courses
  const tutorData = {
    name: form.value.name.trim(),
    surname: form.value.surname.trim(),
    email: form.value.email.trim(),
    subject: form.value.subject,
    experience: form.value.experience,
    price: form.value.price,
    students: form.value.students.filter(s => s.trim() !== ''),
    courses: form.value.courses.filter(c => c.trim() !== '')
  }
  
  // Only include password for new tutors or when it's provided
  if (form.value.password.trim()) {
    tutorData.password = form.value.password.trim()
  }
  
  console.log('✅ Emitting tutor data:', tutorData);
  emit('save', tutorData)
}
</script>

