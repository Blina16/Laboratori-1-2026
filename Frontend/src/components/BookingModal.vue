<template>
  <div
    v-if="showModal"
    class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
    @click.self="$emit('close')"
  >
    <div class="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
      <!-- Header -->
      <div class="p-6 border-b border-gray-200">
        <div class="flex items-center justify-between">
          <h2 class="text-2xl font-semibold text-gray-900">Book Session</h2>
          <button
            @click="$emit('close')"
            class="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition"
          >
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      </div>

      <!-- Tutor Info -->
      <div class="p-6 border-b border-gray-200">
        <div class="flex items-start space-x-4">
          <div class="w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center text-white text-xl font-bold flex-shrink-0">
            {{ tutor.name.charAt(0) }}{{ tutor.surname ? tutor.surname.charAt(0) : '' }}
          </div>
          <div class="flex-1">
            <h3 class="text-lg font-semibold text-gray-900">{{ tutor.name }} {{ tutor.surname || '' }}</h3>
            <p class="text-sm text-gray-600 mb-2">{{ tutor.subject || 'General Tutoring' }}</p>
            <div class="flex items-center space-x-4 text-sm text-gray-500">
              <div class="flex items-center">
                <svg class="w-4 h-4 mr-1 text-yellow-400" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                </svg>
                <span>{{ tutor.rating || '4.8' }}</span>
              </div>
              <div class="flex items-center">
                <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                </svg>
                <span>${{ tutor.price_per_hour || 50 }}/hour</span>
              </div>
            </div>
            <p class="text-sm text-gray-600 mt-2">{{ tutor.bio || 'Experienced tutor ready to help you succeed!' }}</p>
          </div>
        </div>
      </div>

      <!-- Booking Form -->
      <form @submit.prevent="handleSubmit" class="p-6">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <!-- Date Selection -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">
              Select Date <span class="text-red-500">*</span>
            </label>
            <input
              v-model="form.date"
              type="date"
              :min="minDate"
              required
              class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
            />
          </div>

          <!-- Time Selection -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">
              Select Time <span class="text-red-500">*</span>
            </label>
            <select
              v-model="form.time"
              required
              :disabled="loadingSlots || availableSlots.length === 0"
              class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none disabled:opacity-50"
            >
              <option value="">
                {{ loadingSlots ? 'Loading available times...' : (availableSlots.length === 0 ? 'No available slots' : 'Select a time') }}
              </option>
              <option v-for="slot in availableSlots" :key="slot.id" :value="slot.start_time">
                {{ formatTime(slot.start_time) }} - {{ formatTime(slot.end_time) }}
                <span v-if="slot.max_students > 1">({{ slot.max_students - slot.current_students }} spots left)</span>
              </option>
            </select>
            <p v-if="!loadingSlots && availableSlots.length === 0" class="text-sm text-gray-500 mt-1">
              This tutor has no available time slots for the selected date.
            </p>
          </div>

          <!-- Duration -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">
              Duration <span class="text-red-500">*</span>
            </label>
            <select
              v-model="form.duration"
              required
              class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
            >
              <option value="60">1 hour</option>
              <option value="90">1.5 hours</option>
              <option value="120">2 hours</option>
            </select>
          </div>

          <!-- Subject -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">
              Subject <span class="text-red-500">*</span>
            </label>
            <input
              v-model="form.subject"
              type="text"
              :placeholder="tutor.subject || 'Enter subject'"
              required
              class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
            />
          </div>
        </div>

        <!-- Notes -->
        <div class="mt-6">
          <label class="block text-sm font-medium text-gray-700 mb-2">
            Additional Notes (Optional)
          </label>
          <textarea
            v-model="form.notes"
            rows="3"
            placeholder="Any specific topics you'd like to cover or questions you have..."
            class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none resize-none"
          ></textarea>
        </div>

        <!-- Price Summary -->
        <div class="mt-6 p-4 bg-gray-50 rounded-lg">
          <div class="flex justify-between items-center mb-2">
            <span class="text-sm text-gray-600">Tutor Rate:</span>
            <span class="text-sm font-medium">${{ tutor.price_per_hour || 50 }}/hour</span>
          </div>
          <div class="flex justify-between items-center mb-2">
            <span class="text-sm text-gray-600">Duration:</span>
            <span class="text-sm font-medium">{{ form.duration / 60 }} hour(s)</span>
          </div>
          <div class="flex justify-between items-center pt-2 border-t border-gray-200">
            <span class="text-base font-semibold text-gray-900">Total:</span>
            <span class="text-base font-bold text-blue-600">${{ calculateTotal() }}</span>
          </div>
        </div>

        <!-- Action Buttons -->
        <div class="mt-6 flex justify-end gap-3">
          <button
            type="button"
            @click="$emit('close')"
            class="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition"
          >
            Cancel
          </button>
          <button
            type="submit"
            :disabled="isSubmitting"
            class="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <span v-if="isSubmitting" class="flex items-center">
              <svg class="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V4H4v8z"></path>
              </svg>
              Booking...
            </span>
            <span v-else>Book Session</span>
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import api from '@/services/api'

const props = defineProps({
  tutor: {
    type: Object,
    required: true
  },
  studentId: {
    type: Number,
    required: true
  }
})

const emit = defineEmits(['close', 'booked'])

const form = ref({
  date: '',
  time: '',
  duration: 60,
  subject: '',
  notes: ''
})

const isSubmitting = ref(false)
const loadingSlots = ref(false)
const availableSlots = ref([])

// Set minimum date to today
const minDate = computed(() => {
  const today = new Date()
  return today.toISOString().split('T')[0]
})

const calculateTotal = () => {
  const hourlyRate = props.tutor.price_per_hour || 50
  const hours = form.value.duration / 60
  return (hourlyRate * hours).toFixed(2)
}

const formatTime = (time) => {
  const [hours, minutes] = time.split(':')
  const hour = parseInt(hours)
  const ampm = hour >= 12 ? 'PM' : 'AM'
  const displayHour = hour > 12 ? hour - 12 : (hour === 0 ? 12 : hour)
  return `${displayHour}:${minutes} ${ampm}`
}

// Fetch available slots when date changes
const fetchAvailableSlots = async () => {
  if (!form.value.date || !props.tutor.id) {
    availableSlots.value = []
    return
  }

  loadingSlots.value = true
  try {
    // TODO: Replace with actual API call when availability endpoint is ready
    // const response = await api.get(`/api/availability/${props.tutor.id}?date=${form.value.date}`)
    // availableSlots.value = response.data.filter(slot => slot.current_students < slot.max_students)
    
    // Mock data for now
    await new Promise(resolve => setTimeout(resolve, 500))
    availableSlots.value = [
      {
        id: 1,
        start_time: '09:00',
        end_time: '10:00',
        max_students: 2,
        current_students: 0
      },
      {
        id: 2,
        start_time: '14:00',
        end_time: '15:00',
        max_students: 1,
        current_students: 0
      },
      {
        id: 3,
        start_time: '16:00',
        end_time: '17:00',
        max_students: 3,
        current_students: 1
      }
    ]
  } catch (error) {
    console.error('Failed to fetch available slots:', error)
    availableSlots.value = []
  } finally {
    loadingSlots.value = false
  }
}

// Watch for date changes
watch(() => form.value.date, () => {
  form.value.time = '' // Reset time when date changes
  fetchAvailableSlots()
})

const handleSubmit = async () => {
  isSubmitting.value = true
  
  try {
    // Find the selected slot
    const selectedSlot = availableSlots.value.find(slot => slot.start_time === form.value.time)
    
    const bookingData = {
      availability_id: selectedSlot?.id,
      teacher_id: props.tutor.id,
      student_id: props.studentId,
      scheduled_at: new Date(`${form.value.date}T${form.value.time}:00`).toISOString(),
      duration: form.value.duration,
      subject: form.value.subject,
      notes: form.value.notes,
      status: 'scheduled',
      price: calculateTotal()
    }
    
    // TODO: Replace with actual API call when booking endpoint is ready
    console.log('Booking session:', bookingData)
    
    // For now, simulate successful booking
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    emit('booked', bookingData)
    emit('close')
    
    // Reset form
    form.value = {
      date: '',
      time: '',
      duration: 60,
      subject: '',
      notes: ''
    }
  } catch (error) {
    console.error('Failed to book session:', error)
    alert('Failed to book session. Please try again.')
  } finally {
    isSubmitting.value = false
  }
}

// Initialize form with tutor's subject
form.value.subject = props.tutor.subject || ''
</script>
