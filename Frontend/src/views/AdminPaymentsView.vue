<template>
  <div class="flex">
    <AdminSidebar />
    <div class="flex-1 ml-64">
      <div class="min-h-[calc(100vh-4rem)] bg-gray-50 p-8">
        <div class="max-w-7xl mx-auto">
          <!-- Header -->
          <div class="mb-8 flex items-center justify-between">
            <div>
              <h1 class="text-3xl font-bold text-gray-900 mb-2">Payment Invoice Management</h1>
              <p class="text-gray-600">Manage payment invoices, track transactions, and monitor payment status</p>
            </div>
            <button
              @click="openAddModal"
              class="btn-primary flex items-center gap-2"
            >
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
              </svg>
              Add Invoice
            </button>
          </div>

          <!-- Payment Invoices Table -->
          <div class="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div class="overflow-x-auto">
              <table class="min-w-full divide-y divide-gray-200">
                <thead class="bg-gray-50">
                  <tr>
                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Invoice ID
                    </th>
                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Student
                    </th>
                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Tutor
                    </th>
                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Course
                    </th>
                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Amount
                    </th>
                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Date
                    </th>
                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody class="bg-white divide-y divide-gray-200">
                  <tr v-if="payments.length === 0">
                    <td colspan="8" class="px-6 py-12 text-center text-gray-500">
                      <svg class="mx-auto h-12 w-12 text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
                      </svg>
                      <p>No invoices found. Click "Add Invoice" to get started.</p>
                    </td>
                  </tr>
                  <tr
                    v-for="payment in payments"
                    :key="payment.id"
                    class="hover:bg-gray-50 transition"
                  >
                    <td class="px-6 py-4">
                      <div class="flex items-center">
                        <div class="w-10 h-10 bg-gradient-to-br from-green-500 to-emerald-600 rounded-lg flex items-center justify-center text-white font-semibold mr-3">
                          INV-{{ payment.id }}
                        </div>
                        <div>
                          <div class="text-sm font-medium text-gray-900">
                            Invoice #{{ payment.id }}
                          </div>
                          <div v-if="payment.transaction_id" class="text-xs text-gray-500 truncate max-w-xs">
                            {{ payment.transaction_id }}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td class="px-6 py-4">
                      <div class="text-sm text-gray-900">{{ payment.student_name }}</div>
                      <div v-if="payment.student_email" class="text-xs text-gray-500">{{ payment.student_email }}</div>
                    </td>
                    <td class="px-6 py-4">
                      <div class="text-sm text-gray-900">{{ payment.tutor_name }}</div>
                      <div v-if="payment.tutor_email" class="text-xs text-gray-500">{{ payment.tutor_email }}</div>
                    </td>
                    <td class="px-6 py-4">
                      <div v-if="payment.course_title" class="text-sm text-gray-900">{{ payment.course_title }}</div>
                      <div v-else class="text-sm text-gray-400">No course</div>
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap">
                      <span class="text-sm font-medium text-gray-900">${{ payment.amount.toFixed(2) }}</span>
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap">
                      <span class="text-sm text-gray-900">{{ payment.payment_date }}</span>
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap">
                      <span
                        class="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium"
                        :class="{
                          'bg-yellow-100 text-yellow-800': payment.status === 'pending',
                          'bg-green-100 text-green-800': payment.status === 'completed',
                          'bg-red-100 text-red-800': payment.status === 'failed',
                          'bg-gray-100 text-gray-800': payment.status === 'refunded'
                        }"
                      >
                        {{ payment.status }}
                      </span>
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button
                        @click="openEditModal(payment)"
                        class="text-blue-600 hover:text-blue-900 mr-4"
                      >
                        Edit
                      </button>
                      <button
                        @click="confirmDelete(payment)"
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

    <!-- Add/Edit Payment Invoice Modal -->
    <PaymentModal
      v-if="showModal"
      :payment="selectedPayment"
      :students="students"
      :tutors="tutors"
      :courses="courses"
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
        <h3 class="text-lg font-semibold text-gray-900 mb-2">Delete Invoice</h3>
        <p class="text-gray-600 mb-6">
          Are you sure you want to delete invoice <strong>#{{ paymentToDelete?.id }}</strong>? This action cannot be undone.
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
import { usePaymentsStore } from '@/stores/payments'
import { useStudentsStore } from '@/stores/students'
import { useTutorsStore } from '@/stores/tutors'
import { useCoursesStore } from '@/stores/courses'
import PaymentModal from '../components/PaymentModal.vue'
import AdminSidebar from '../components/AdminSidebar.vue'

defineOptions({
  name: 'AdminPaymentsView'
})

// Stores
const paymentsStore = usePaymentsStore()
const studentsStore = useStudentsStore()
const tutorsStore = useTutorsStore()
const coursesStore = useCoursesStore()

// Reactive state
const showModal = ref(false)
const showDeleteModal = ref(false)
const selectedPayment = ref(null)
const paymentToDelete = ref(null)

// Computed properties
const payments = computed(() => paymentsStore.payments)
const students = computed(() => studentsStore.students)
const tutors = computed(() => tutorsStore.tutors)
const courses = computed(() => coursesStore.courses)

// Methods
const fetchPayments = async () => {
  try {
    await paymentsStore.fetchPayments()
  } catch (error) {
    console.error('Failed to fetch invoices:', error)
    alert('Failed to load invoices: ' + (error.response?.data?.message || error.message))
  }
}

const fetchStudents = async () => {
  try {
    await studentsStore.fetchStudents()
  } catch (error) {
    console.error('Failed to fetch students:', error)
  }
}

const fetchTutors = async () => {
  try {
    await tutorsStore.fetchTutors()
  } catch (error) {
    console.error('Failed to fetch tutors:', error)
  }
}

const fetchCourses = async () => {
  try {
    await coursesStore.fetchCourses()
  } catch (error) {
    console.error('Failed to fetch courses:', error)
  }
}

onMounted(async () => {
  await Promise.all([fetchPayments(), fetchStudents(), fetchTutors(), fetchCourses()])
})

const openAddModal = () => {
  selectedPayment.value = null
  showModal.value = true
}

const openEditModal = (payment) => {
  selectedPayment.value = { ...payment }
  showModal.value = true
}

const closeModal = () => {
  showModal.value = false
  selectedPayment.value = null
}

const handleSave = async (paymentData) => {
  try {
    console.log('🔍 handleSave called with:', paymentData);

    if (selectedPayment.value && selectedPayment.value.id) {
      // Update existing invoice
      console.log('📝 Updating invoice:', selectedPayment.value.id);
      await paymentsStore.updatePayment(selectedPayment.value.id, paymentData)
      alert('Invoice updated successfully!')
    } else {
      // Add new invoice
      console.log('📝 Adding new invoice');
      await paymentsStore.addPayment(paymentData)
      alert('Invoice added successfully!')
    }

    closeModal()
  } catch (error) {
    console.error('❌ Failed to save invoice:', error.response?.data || error.message)
    const errorMessage = error.response?.data?.message || error.message
    alert('Failed to save invoice: ' + errorMessage)
  }
}

const confirmDelete = (payment) => {
  paymentToDelete.value = payment
  showDeleteModal.value = true
}

const handleDelete = async () => {
  try {
    if (paymentToDelete.value) {
      console.log('🗑️ Deleting invoice:', paymentToDelete.value.id);
      
      await paymentsStore.deletePayment(paymentToDelete.value.id)
      
      // Show success message
      alert('Invoice deleted successfully!')
      
      // Close modal and clear selection
      showDeleteModal.value = false
      paymentToDelete.value = null
    }
  } catch (error) {
    console.error('❌ Failed to delete invoice:', error.response?.data || error.message)
    const errorMessage = error.response?.data?.message || error.message
    alert('Failed to delete invoice: ' + errorMessage)
  }
}
</script>
