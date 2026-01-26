<template>
  <div
    class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
    @click.self="$emit('close')"
  >
    <div class="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
      <div class="p-6 border-b border-gray-200">
        <div class="flex items-center justify-between">
          <h2 class="text-2xl font-bold text-gray-900">
            {{ isEditMode ? 'Edit Grade' : 'Add New Grade' }}
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
        <!-- Student Selection -->
        <div>
          <label for="student_id" class="block text-sm font-medium text-gray-700 mb-2">
            Student <span class="text-red-500">*</span>
          </label>
          <select
            id="student_id"
            v-model="form.student_id"
            required
            class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
          >
            <option value="">Select a student</option>
            <option
              v-for="student in students"
              :key="student.id"
              :value="student.id"
            >
              {{ student.name }} {{ student.surname || '' }} ({{ student.email }})
            </option>
          </select>
        </div>

        <!-- Subject and Grade -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label for="subject" class="block text-sm font-medium text-gray-700 mb-2">
              Subject <span class="text-red-500">*</span>
            </label>
            <input
              id="subject"
              v-model="form.subject"
              type="text"
              required
              class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
              placeholder="Mathematics"
            />
          </div>
          <div>
            <label for="grade" class="block text-sm font-medium text-gray-700 mb-2">
              Grade (0-100) <span class="text-red-500">*</span>
            </label>
            <input
              id="grade"
              v-model.number="form.grade"
              type="number"
              min="0"
              max="100"
              step="0.1"
              required
              class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
              placeholder="85.5"
            />
          </div>
        </div>

        <!-- Assignment Name and Date -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label for="assignment_name" class="block text-sm font-medium text-gray-700 mb-2">
              Assignment Name
            </label>
            <input
              id="assignment_name"
              v-model="form.assignment_name"
              type="text"
              class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
              placeholder="Midterm Exam"
            />
          </div>
          <div>
            <label for="date" class="block text-sm font-medium text-gray-700 mb-2">
              Date
            </label>
            <input
              id="date"
              v-model="form.date"
              type="date"
              class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
            />
          </div>
        </div>

        <!-- Comments -->
        <div>
          <label for="comments" class="block text-sm font-medium text-gray-700 mb-2">
            Comments
          </label>
          <textarea
            id="comments"
            v-model="form.comments"
            rows="3"
            class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
            placeholder="Additional notes about the student's performance..."
          ></textarea>
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
            {{ isEditMode ? 'Update Grade' : 'Add Grade' }}
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue'

const props = defineProps({
  grade: {
    type: Object,
    default: null
  },
  students: {
    type: Array,
    default: () => []
  }
})

const emit = defineEmits(['close', 'save'])

const isEditMode = computed(() => !!props.grade)

const form = ref({
  student_id: '',
  subject: '',
  grade: '',
  assignment_name: '',
  date: '',
  comments: ''
})

// Initialize form when grade prop changes
watch(() => props.grade, (newGrade) => {
  if (newGrade) {
    form.value = {
      student_id: newGrade.student_id || '',
      subject: newGrade.subject || '',
      grade: newGrade.grade || '',
      assignment_name: newGrade.assignment_name || '',
      date: newGrade.date || '',
      comments: newGrade.comments || ''
    }
  } else {
    form.value = {
      student_id: '',
      subject: '',
      grade: '',
      assignment_name: '',
      date: '',
      comments: ''
    }
  }
}, { immediate: true })

const handleSubmit = () => {
  const gradeData = {
    student_id: form.value.student_id,
    subject: form.value.subject.trim(),
    grade: form.value.grade,
    assignment_name: form.value.assignment_name?.trim() || '',
    date: form.value.date || '',
    comments: form.value.comments?.trim() || ''
  }
  
  emit('save', gradeData)
}
</script>
