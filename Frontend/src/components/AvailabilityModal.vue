<template>
  <div
    v-if="showModal"
    class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
    @click.self="$emit('close')"
  >
    <div class="bg-white rounded-xl shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
      <!-- Header -->
      <div class="p-6 border-b border-gray-200">
        <div class="flex items-center justify-between">
          <h2 class="text-2xl font-semibold text-gray-900">Manage Availability</h2>
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

      <!-- Form Content -->
      <div class="p-6">
        <form @submit.prevent="handleSubmit">
          <!-- Date Selection -->
          <div class="mb-6">
            <label class="block text-sm font-medium text-gray-700 mb-2">
              Select Date(s) <span class="text-red-500">*</span>
            </label>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <!-- Single Date -->
              <div>
                <label class="block text-xs text-gray-600 mb-1">Single Date</label>
                <input
                  v-model="form.date"
                  type="date"
                  :min="minDate"
                  class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                />
              </div>
              
              <!-- Recurring Pattern -->
              <div>
                <label class="block text-xs text-gray-600 mb-1">Recurring Pattern</label>
                <select
                  v-model="form.recurring"
                  class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                >
                  <option value="">No recurrence</option>
                  <option value="daily">Daily</option>
                  <option value="weekly">Weekly</option>
                  <option value="weekdays">Weekdays (Mon-Fri)</option>
                  <option value="weekends">Weekends</option>
                </select>
              </div>
            </div>
          </div>

          <!-- Time Slots -->
          <div class="mb-6">
            <label class="block text-sm font-medium text-gray-700 mb-2">
              Time Slots <span class="text-red-500">*</span>
            </label>
            <div class="space-y-3">
              <div
                v-for="(slot, index) in form.timeSlots"
                :key="index"
                class="flex items-center gap-3 p-4 bg-gray-50 rounded-lg"
              >
                <div class="flex-1 grid grid-cols-1 md:grid-cols-3 gap-3">
                  <div>
                    <label class="block text-xs text-gray-600 mb-1">Start Time</label>
                    <input
                      v-model="slot.startTime"
                      type="time"
                      required
                      class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                    />
                  </div>
                  <div>
                    <label class="block text-xs text-gray-600 mb-1">End Time</label>
                    <input
                      v-model="slot.endTime"
                      type="time"
                      required
                      class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                    />
                  </div>
                  <div>
                    <label class="block text-xs text-gray-600 mb-1">Max Students</label>
                    <select
                      v-model="slot.maxStudents"
                      class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                    >
                      <option value="1">1 Student</option>
                      <option value="2">2 Students</option>
                      <option value="3">3 Students</option>
                      <option value="4">4 Students</option>
                      <option value="5">5 Students</option>
                    </select>
                  </div>
                </div>
                <button
                  type="button"
                  @click="removeTimeSlot(index)"
                  class="p-2 text-red-600 hover:bg-red-50 rounded-lg transition"
                >
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              </div>
            </div>
            
            <button
              type="button"
              @click="addTimeSlot"
              class="mt-3 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
            >
              Add Time Slot
            </button>
          </div>

          <!-- Date Range for Recurring -->
          <div v-if="form.recurring" class="mb-6">
            <label class="block text-sm font-medium text-gray-700 mb-2">
              Recurrence End Date <span class="text-red-500">*</span>
            </label>
            <input
              v-model="form.endDate"
              type="date"
              :min="form.date || minDate"
              required
              class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
            />
          </div>

          <!-- Notes -->
          <div class="mb-6">
            <label class="block text-sm font-medium text-gray-700 mb-2">
              Notes (Optional)
            </label>
            <textarea
              v-model="form.notes"
              rows="3"
              placeholder="Any additional information about your availability..."
              class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none resize-none"
            ></textarea>
          </div>

          <!-- Preview -->
          <div v-if="previewSlots.length > 0" class="mb-6 p-4 bg-blue-50 rounded-lg">
            <h4 class="font-medium text-blue-900 mb-2">Preview</h4>
            <p class="text-sm text-blue-700 mb-2">{{ previewSlots.length }} time slots will be created:</p>
            <div class="max-h-32 overflow-y-auto space-y-1">
              <div
                v-for="(slot, index) in previewSlots.slice(0, 10)"
                :key="index"
                class="text-sm text-blue-600"
              >
                {{ slot.date }} - {{ slot.startTime }} to {{ slot.endTime }}
              </div>
              <div v-if="previewSlots.length > 10" class="text-sm text-blue-600">
                ... and {{ previewSlots.length - 10 }} more
              </div>
            </div>
          </div>

          <!-- Action Buttons -->
          <div class="flex justify-end gap-3">
            <button
              type="button"
              @click="$emit('close')"
              class="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              :disabled="isSubmitting || !form.date || form.timeSlots.length === 0"
              class="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <span v-if="isSubmitting" class="flex items-center">
                <svg class="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V4H4v8z"></path>
                </svg>
                Creating...
              </span>
              <span v-else>Create Availability</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import api from '@/services/api'

const props = defineProps({
  showModal: {
    type: Boolean,
    default: false
  },
  teacherId: {
    type: Number,
    required: true
  }
})

const emit = defineEmits(['close', 'created'])

const form = ref({
  date: '',
  endDate: '',
  recurring: '',
  timeSlots: [
    { startTime: '09:00', endTime: '10:00', maxStudents: 1 }
  ],
  notes: ''
})

const isSubmitting = ref(false)

// Set minimum date to today
const minDate = computed(() => {
  const today = new Date()
  return today.toISOString().split('T')[0]
})

// Generate preview of slots to be created
const previewSlots = computed(() => {
  if (!form.value.date || form.value.timeSlots.length === 0) return []
  
  const slots = []
  const startDate = new Date(form.value.date)
  const endDate = form.value.endDate ? new Date(form.value.endDate) : startDate
  
  // Generate dates based on recurrence pattern
  const dates = []
  let currentDate = new Date(startDate)
  
  while (currentDate <= endDate) {
    const dayOfWeek = currentDate.getDay()
    
    if (form.value.recurring === 'daily' ||
        form.value.recurring === 'weekly' ||
        (form.value.recurring === 'weekdays' && dayOfWeek >= 1 && dayOfWeek <= 5) ||
        (form.value.recurring === 'weekends' && (dayOfWeek === 0 || dayOfWeek === 6))) {
      dates.push(new Date(currentDate))
    }
    
    if (!form.value.recurring) break
    
    currentDate.setDate(currentDate.getDate() + 1)
  }
  
  // Create slots for each date
  dates.forEach(date => {
    form.value.timeSlots.forEach(timeSlot => {
      slots.push({
        date: date.toLocaleDateString(),
        startTime: timeSlot.startTime,
        endTime: timeSlot.endTime,
        maxStudents: timeSlot.maxStudents
      })
    })
  })
  
  return slots
})

const addTimeSlot = () => {
  form.value.timeSlots.push({ startTime: '10:00', endTime: '11:00', maxStudents: 1 })
}

const removeTimeSlot = (index) => {
  form.value.timeSlots.splice(index, 1)
}

const handleSubmit = async () => {
  isSubmitting.value = true
  
  try {
    console.log('Submitting availability form:', form.value)
    
    // Create availability data for each time slot
    const availabilityPromises = form.value.timeSlots.map(timeSlot => {
      const availabilityData = {
        teacher_id: props.teacherId,
        date: form.value.date,
        start_time: timeSlot.startTime,
        end_time: timeSlot.endTime,
        max_students: timeSlot.maxStudents,
        recurring_pattern: form.value.recurring || null,
        recurring_end_date: form.value.endDate || null,
        notes: form.value.notes
      }
      
      console.log('Creating availability slot:', availabilityData)
      
      // Call the real API
      return api.post('/availability', availabilityData)
    })
    
    // Wait for all availability slots to be created
    const responses = await Promise.all(availabilityPromises)
    
    console.log('Availability created successfully:', responses)
    
    emit('created', { success: true, count: responses.length })
    emit('close')
    
    // Reset form
    form.value = {
      date: '',
      endDate: '',
      recurring: '',
      timeSlots: [{ startTime: '09:00', endTime: '10:00', maxStudents: 1 }],
      notes: ''
    }
  } catch (error) {
    console.error('Failed to create availability:', error)
    console.error('Error response:', error.response?.data)
    console.error('Error status:', error.response?.status)
    
    // Show more detailed error message
    const errorMessage = error.response?.data?.error || error.message || 'Unknown error occurred'
    alert(`Failed to create availability: ${errorMessage}`)
  } finally {
    isSubmitting.value = false
  }
}

// Reset form when modal opens
watch(() => props.showModal, (newVal) => {
  if (newVal) {
    form.value = {
      date: '',
      endDate: '',
      recurring: '',
      timeSlots: [{ startTime: '09:00', endTime: '10:00', maxStudents: 1 }],
      notes: ''
    }
  }
})
</script>
