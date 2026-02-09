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

        <!-- Age and Location -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label for="age" class="block text-sm font-medium text-gray-700 mb-2">
              Age <span class="text-red-500">*</span>
            </label>
            <input
              id="age"
              v-model.number="form.age"
              type="number"
              min="1"
              max="120"
              required
              class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
              placeholder="25"
            />
          </div>
          <div>
            <label for="location" class="block text-sm font-medium text-gray-700 mb-2">
              Location <span class="text-red-500">*</span>
            </label>
            <input
              id="location"
              v-model="form.location"
              type="text"
              required
              class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
              placeholder="New York, USA"
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
            placeholder="john.doe@example.com"
          />
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
  age: '',
  location: '',
  email: ''
})

// Initialize form when student prop changes
watch(() => props.student, (newStudent) => {
  if (newStudent) {
    form.value = {
      name: newStudent.name || '',
      surname: newStudent.surname || '',
      age: newStudent.age || '',
      location: newStudent.location || '',
      email: newStudent.email || ''
    }
  } else {
    form.value = {
      name: '',
      surname: '',
      age: '',
      location: '',
      email: ''
    }
  }
}, { immediate: true })


const handleSubmit = () => {
  console.log('🔍 Student form submission triggered');
  console.log('📝 Form data:', form.value);
  
  // Check if required fields are filled
  if (!form.value.name.trim()) {
    console.log('❌ Missing name');
    alert('Please fill in the student name');
    return;
  }
  
  if (!form.value.email.trim()) {
    console.log('❌ Missing email');
    alert('Please fill in the email address');
    return;
  }
  
  if (!form.value.age || form.value.age < 1 || form.value.age > 120) {
    console.log('❌ Invalid age');
    alert('Please enter a valid age (1-120)');
    return;
  }
  
  if (!form.value.location.trim()) {
    console.log('❌ Missing location');
    alert('Please fill in the location');
    return;
  }
  
  const studentData = {
    name: form.value.name.trim(),
    surname: form.value.surname.trim(),
    age: Number(form.value.age),
    location: form.value.location.trim(),
    email: form.value.email.trim()
  }
  
  console.log('✅ Emitting student data:', studentData);
  emit('save', studentData)
}
</script>

