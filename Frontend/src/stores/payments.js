import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import api from '@/services/api'

export const usePaymentsStore = defineStore('payments', () => {
  // STATE
  const payments = ref([])
  const isLoading = ref(false)

  // GETTERS
  const getAllPayments = computed(() => payments.value)

  const getPaymentById = (id) => {
    return payments.value.find(payment => payment.id === id)
  }

  // ACTIONS

  // 🔹 Fetch all payments
  const fetchPayments = async () => {
    isLoading.value = true
    try {
      const response = await api.get('/payments')
      console.log('📡 Raw payments response:', response.data)

      payments.value = response.data.map(payment => ({
        ...payment,
        payment_date: payment.payment_date ? new Date(payment.payment_date).toISOString().split('T')[0] : '',
        amount: typeof payment.amount === 'number' ? payment.amount : (payment.amount ? Number(payment.amount) : 0),
        student_name: payment.student_name || '',
        tutor_name: payment.tutor_name || '',
        course_title: payment.course_title || ''
      }))
      
      console.log('✅ Processed payments:', payments.value)
    } catch (error) {
      console.error('Failed to fetch payments:', error)
      throw error
    } finally {
      isLoading.value = false
    }
  }

  // 🔹 Add payment (CREATE) - Using exact same pattern as tutors
  const addPayment = async (paymentData) => {
    try {
      console.log('📝 Adding payment with data:', paymentData)
      
      // Prepare data for backend - exact same pattern as tutors
      const backendData = {
        student_id: paymentData.student_id,
        tutor_id: paymentData.tutor_id,
        course_id: paymentData.course_id || null,
        amount: paymentData.amount,
        payment_date: paymentData.payment_date,
        payment_method: paymentData.payment_method || 'credit_card',
        status: paymentData.status || 'pending',
        transaction_id: paymentData.transaction_id || null,
        notes: paymentData.notes || ''
      }

      const response = await api.post('/payments', backendData)
      console.log('📡 Add payment response:', response.data)
      
      const payment = response.data.payment || response.data
      const formattedPayment = {
        ...payment,
        id: payment.id || payment._id,
        payment_date: payment.payment_date ? new Date(payment.payment_date).toISOString().split('T')[0] : '',
        amount: typeof payment.amount === 'number' ? payment.amount : (payment.amount ? Number(payment.amount) : 0),
        student_name: payment.student_name || '',
        tutor_name: payment.tutor_name || '',
        course_title: payment.course_title || ''
      }

      payments.value.push(formattedPayment)
      console.log('✅ Added payment to store:', formattedPayment)
      return formattedPayment
    } catch (error) {
      console.error('Failed to add payment:', error)
      throw error
    }
  }

  // 🔹 Update payment (UPDATE) - Using exact same pattern as tutors
  const updatePayment = async (id, paymentData) => {
    try {
      console.log('📝 Updating payment with ID:', id, 'data:', paymentData)
      
      // Prepare data for backend - exact same pattern as tutors
      const backendData = {
        student_id: paymentData.student_id,
        tutor_id: paymentData.tutor_id,
        course_id: paymentData.course_id || null,
        amount: paymentData.amount,
        payment_date: paymentData.payment_date,
        payment_method: paymentData.payment_method,
        status: paymentData.status,
        transaction_id: paymentData.transaction_id || null,
        notes: paymentData.notes || ''
      }

      const response = await api.put(`/payments/${id}`, backendData)
      console.log('📡 Update payment response:', response.data)
      
      const payment = response.data.payment || response.data
      const formattedPayment = {
        ...payment,
        id: payment.id || payment._id,
        payment_date: payment.payment_date ? new Date(payment.payment_date).toISOString().split('T')[0] : '',
        amount: typeof payment.amount === 'number' ? payment.amount : (payment.amount ? Number(payment.amount) : 0),
        student_name: payment.student_name || '',
        tutor_name: payment.tutor_name || '',
        course_title: payment.course_title || ''
      }

      const index = payments.value.findIndex(p => p.id === id)
      if (index !== -1) {
        payments.value[index] = formattedPayment
        console.log('✅ Updated payment in store:', formattedPayment)
      }

      return formattedPayment
    } catch (error) {
      console.error('Failed to update payment:', error)
      throw error
    }
  }

  // 🔹 Delete payment (DELETE) - Using exact same pattern as tutors
  const deletePayment = async (id) => {
    try {
      console.log('🗑️ Deleting payment with ID:', id)
      
      await api.delete(`/payments/${id}`)
      payments.value = payments.value.filter(p => p.id !== id)
      
      console.log('✅ Deleted payment from store')
    } catch (error) {
      console.error('Failed to delete payment:', error)
      throw error
    }
  }

  // EXPORT
  return {
    payments,
    isLoading,
    getAllPayments,
    getPaymentById,
    fetchPayments,
    addPayment,
    updatePayment,
    deletePayment
  }
})
