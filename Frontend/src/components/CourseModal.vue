<template>
  <div
    class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
    @click.self="$emit('close')"
  >
    <div class="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
      <div class="p-6 border-b border-gray-200">
        <div class="flex items-center justify-between">
          <h2 class="text-2xl font-bold text-gray-900">
            {{ isEditMode ? 'Edit Course' : 'Add New Course' }}
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
        <!-- Course Name -->
        <div>
          <label for="name" class="block text-sm font-medium text-gray-700 mb-2">
            Course Name <span class="text-red-500">*</span>
          </label>
          <input
            id="name"
            v-model="form.title"
            type="text"
            required
            class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
            placeholder="e.g., Mathematics 101"
          />
        </div>

        <!-- Description -->
        <div>
          <label for="description" class="block text-sm font-medium text-gray-700 mb-2">
            Description
          </label>
          <textarea
            id="description"
            v-model="form.description"
            rows="3"
            class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
            placeholder="Course description..."
          ></textarea>
        </div>

        <!-- Duration and Level -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label for="duration" class="block text-sm font-medium text-gray-700 mb-2">
              Duration
            </label>
            <input
              id="duration"
              v-model="form.duration"
              type="text"
              class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
              placeholder="e.g., 10 weeks, 3 months"
            />
          </div>
          <div>
            <label for="level" class="block text-sm font-medium text-gray-700 mb-2">
              Level
            </label>
            <select
              id="level"
              v-model="form.level"
              class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
            >
              <option value="">Select level</option>
              <option value="Beginner">Beginner</option>
              <option value="Intermediate">Intermediate</option>
              <option value="Advanced">Advanced</option>
              <option value="Expert">Expert</option>
            </select>
          </div>
        </div>

        <!-- Price and Tutor -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label for="price" class="block text-sm font-medium text-gray-700 mb-2">
              Price ($)
            </label>
            <input
              id="price"
              v-model.number="form.price"
              type="number"
              min="0"
              step="0.01"
              class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
              placeholder="0.00"
            />
          </div>
          <div>
            <label for="tutor" class="block text-sm font-medium text-gray-700 mb-2">
              Assigned Tutor
            </label>
            <select
              id="tutor"
              v-model="form.teacher_id"
              class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
            >
              <option value="">Select a tutor (optional)</option>
              <option
                v-for="tutor in tutors"
                :key="tutor.id"
                :value="tutor.id"
              >
                {{ tutor.name }} {{ tutor.surname || '' }}
              </option>
            </select>
          </div>
        </div>

        <!-- Students -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">
            Enrolled Students
          </label>
          <div class="space-y-2">
            <div
              v-for="(student, index) in form.students"
              :key="index"
              class="flex items-center gap-2"
            >
              <input
                v-model="form.students[index]"
                type="text"
                class="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                :placeholder="`Student ${index + 1} name`"
              />
              <button
                type="button"
                @click="removeStudent(index)"
                class="px-3 py-2 text-red-600 hover:bg-red-50 rounded-lg transition"
              >
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <button
              type="button"
              @click="addStudent"
              class="w-full px-4 py-2 border-2 border-dashed border-gray-300 rounded-lg text-gray-600 hover:border-blue-500 hover:text-blue-600 transition flex items-center justify-center gap-2"
            >
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
              </svg>
              Add Student
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
            {{ isEditMode ? 'Update Course' : 'Add Course' }}
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue'

const props = defineProps({
  course: {
    type: Object,
    default: null
  },
  tutors: {
    type: Array,
    default: () => []
  }
})

const emit = defineEmits(['close', 'save'])

const isEditMode = computed(() => !!props.course)

const form = ref({
  title: '',
  description: '',
  duration: '',
  level: '',
  price: 0,
  teacher_id: '',
  students: []
})

// Initialize form when course prop changes
watch(() => props.course, (newCourse) => {
  if (newCourse) {
    form.value = {
      title: newCourse.title || newCourse.name || '',
      description: newCourse.description || '',
      duration: newCourse.duration || '',
      level: newCourse.level || '',
      price: newCourse.price || 0,
      teacher_id: newCourse.teacher_id || '',
      students: newCourse.students ? [...newCourse.students] : []
    }
  } else {
    form.value = {
      title: '',
      description: '',
      duration: '',
      level: '',
      price: 0,
      teacher_id: '',
      students: []
    }
  }
}, { immediate: true })

const addStudent = () => {
  form.value.students.push('')
}

const removeStudent = (index) => {
  form.value.students.splice(index, 1)
}

const handleSubmit = () => {
  console.log('🔍 Course form submission triggered');
  console.log('📝 Form data:', form.value);
  
  // Check if required fields are filled
  if (!form.value.title.trim()) {
    console.log('❌ Missing required title');
    alert('Please fill in the course title');
    return;
  }
  
  // Filter out empty students
  const courseData = {
    title: form.value.title.trim(),
    description: form.value.description.trim(),
    duration: form.value.duration.trim(),
    level: form.value.level,
    price: form.value.price,
    teacher_id: form.value.teacher_id ? Number(form.value.teacher_id) : null,
    students: form.value.students.filter(s => s.trim() !== '')
  }
  
  console.log('✅ Emitting course data:', courseData);
  emit('save', courseData)
}
</script>

