<template>
  <div
    class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
    @click.self="$emit('close')"
  >
    <div class="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
      <div class="p-6 border-b border-gray-200">
        <div class="flex items-center justify-between">
          <h2 class="text-2xl font-bold text-gray-900">
            {{ isEditMode ? 'Edit Invoice' : 'Add New Invoice' }}
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
        <!-- Student and Tutor -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label for="student" class="block text-sm font-medium text-gray-700 mb-2">
              Student <span class="text-red-500">*</span>
            </label>
            <select
              id="student"
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
          <div>
            <label for="tutor" class="block text-sm font-medium text-gray-700 mb-2">
              Tutor <span class="text-red-500">*</span>
            </label>
            <select
              id="tutor"
              v-model="form.tutor_id"
              required
              class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
            >
              <option value="">Select a tutor</option>
              <option
                v-for="tutor in tutors"
                :key="tutor.id"
                :value="tutor.id"
              >
                {{ tutor.name }} {{ tutor.surname || '' }} ({{ tutor.email }})
              </option>
            </select>
          </div>
        </div>

        <!-- Course and Amount -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label for="course" class="block text-sm font-medium text-gray-700 mb-2">
              Course
            </label>
            <select
              id="course"
              v-model="form.course_id"
              class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
            >
              <option value="">Select a course (optional)</option>
              <option
                v-for="course in courses"
                :key="course.id"
                :value="course.id"
              >
                {{ course.title }} - ${{ course.price }}
              </option>
            </select>
          </div>
          <div>
            <label for="amount" class="block text-sm font-medium text-gray-700 mb-2">
              Amount ($) <span class="text-red-500">*</span>
            </label>
            <input
              id="amount"
              v-model.number="form.amount"
              type="number"
              min="0"
              step="0.01"
              required
              class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
              placeholder="0.00"
            />
          </div>
        </div>

        <!-- Payment Date and Method -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label for="payment_date" class="block text-sm font-medium text-gray-700 mb-2">
              Payment Date <span class="text-red-500">*</span>
            </label>
            <input
              id="payment_date"
              v-model="form.payment_date"
              type="date"
              required
              class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
            />
          </div>
          <div>
            <label for="payment_method" class="block text-sm font-medium text-gray-700 mb-2">
              Payment Method
            </label>
            <select
              id="payment_method"
              v-model="form.payment_method"
              class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
            >
              <option value="credit_card">Credit Card</option>
              <option value="debit_card">Debit Card</option>
              <option value="paypal">PayPal</option>
              <option value="bank_transfer">Bank Transfer</option>
              <option value="cash">Cash</option>
              <option value="other">Other</option>
            </select>
          </div>
        </div>

        <!-- Status and Transaction ID -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label for="status" class="block text-sm font-medium text-gray-700 mb-2">
              Payment Status
            </label>
            <select
              id="status"
              v-model="form.status"
              class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
            >
              <option value="pending">Pending</option>
              <option value="completed">Completed</option>
              <option value="failed">Failed</option>
              <option value="refunded">Refunded</option>
            </select>
          </div>
          <div>
            <label for="transaction_id" class="block text-sm font-medium text-gray-700 mb-2">
              Transaction ID
            </label>
            <input
              id="transaction_id"
              v-model="form.transaction_id"
              type="text"
              class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
              placeholder="e.g., TXN123456789"
            />
          </div>
        </div>

        <!-- Notes -->
        <div>
          <label for="notes" class="block text-sm font-medium text-gray-700 mb-2">
            Notes
          </label>
          <textarea
            id="notes"
            v-model="form.notes"
            rows="3"
            class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
            placeholder="Additional notes about this payment..."
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
            {{ isEditMode ? 'Update Invoice' : 'Add Invoice' }}
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue'

const props = defineProps({
  payment: {
    type: Object,
    default: null
  },
  students: {
    type: Array,
    default: () => []
  },
  tutors: {
    type: Array,
    default: () => []
  },
  courses: {
    type: Array,
    default: () => []
  }
})

const emit = defineEmits(['close', 'save'])

const isEditMode = computed(() => !!props.payment)

const form = ref({
  student_id: '',
  tutor_id: '',
  course_id: '',
  amount: 0,
  payment_date: '',
  payment_method: 'credit_card',
  status: 'pending',
  transaction_id: '',
  notes: ''
})

// Initialize form when payment prop changes
watch(() => props.payment, (newPayment) => {
  if (newPayment) {
    form.value = {
      student_id: newPayment.student_id || '',
      tutor_id: newPayment.tutor_id || '',
      course_id: newPayment.course_id || '',
      amount: newPayment.amount || 0,
      payment_date: newPayment.payment_date || '',
      payment_method: newPayment.payment_method || 'credit_card',
      status: newPayment.status || 'pending',
      transaction_id: newPayment.transaction_id || '',
      notes: newPayment.notes || ''
    }
  } else {
    form.value = {
      student_id: '',
      tutor_id: '',
      course_id: '',
      amount: 0,
      payment_date: new Date().toISOString().split('T')[0], // Today's date
      payment_method: 'credit_card',
      status: 'pending',
      transaction_id: '',
      notes: ''
    }
  }
}, { immediate: true })

const handleSubmit = () => {
  console.log('🔍 Invoice form submission triggered');
  console.log('📝 Form data:', form.value);
  
  // Check if required fields are filled
  if (!form.value.student_id) {
    console.log('❌ Missing student');
    alert('Please select a student');
    return;
  }
  
  if (!form.value.tutor_id) {
    console.log('❌ Missing tutor');
    alert('Please select a tutor');
    return;
  }
  
  if (!form.value.amount || form.value.amount <= 0) {
    console.log('❌ Invalid amount');
    alert('Please enter a valid amount');
    return;
  }
  
  if (!form.value.payment_date) {
    console.log('❌ Missing payment date');
    alert('Please select a payment date');
    return;
  }
  
  const paymentData = {
    student_id: Number(form.value.student_id),
    tutor_id: Number(form.value.tutor_id),
    course_id: form.value.course_id ? Number(form.value.course_id) : null,
    amount: Number(form.value.amount),
    payment_date: form.value.payment_date,
    payment_method: form.value.payment_method,
    status: form.value.status,
    transaction_id: form.value.transaction_id.trim(),
    notes: form.value.notes.trim()
  }
  
  console.log('✅ Emitting invoice data:', paymentData);
  emit('save', paymentData)
}
</script>
