<template>
  <div v-if="show" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" @click="$emit('close')">
    <div class="bg-white rounded-xl shadow-xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto" @click.stop>
      <div class="p-6">
        <!-- Header -->
        <div class="flex justify-between items-start mb-6">
          <div>
            <h2 class="text-2xl font-bold text-gray-900">Contact Tutor</h2>
            <p class="text-gray-600 mt-1">Send a message to {{ tutor.name }} {{ tutor.surname }}</p>
          </div>
          <button 
            @click="$emit('close')"
            class="text-gray-400 hover:text-gray-600 transition"
          >
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        
        <!-- Tutor Info -->
        <div class="flex items-center space-x-4 mb-6 p-4 bg-gray-50 rounded-lg">
          <img 
            :src="tutor.photo" 
            :alt="tutor.name"
            class="w-16 h-16 rounded-full object-cover"
          >
          <div class="flex-1">
            <h3 class="font-semibold text-gray-900">{{ tutor.name }} {{ tutor.surname }}</h3>
            <p class="text-sm text-gray-600">{{ tutor.specialty }}</p>
            <p class="text-sm font-semibold text-blue-600">${{ tutor.cost }}/hour</p>
          </div>
        </div>
        
        <!-- Message Form -->
        <form @submit.prevent="sendMessage" class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Subject</label>
            <input 
              v-model="messageForm.subject"
              type="text" 
              class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="e.g., Math Tutoring Inquiry"
              required
            >
          </div>
          
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Message</label>
            <textarea 
              v-model="messageForm.message"
              rows="5"
              class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Hi! I'm interested in learning more about your tutoring services..."
              required
            ></textarea>
          </div>
          
          <!-- Quick Message Templates -->
          <div>
            <p class="text-sm font-medium text-gray-700 mb-2">Quick Templates:</p>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-2">
              <button
                type="button"
                @click="useTemplate('availability')"
                class="text-left px-3 py-2 text-sm border border-gray-200 rounded-lg hover:bg-gray-50 transition"
              >
                <div class="font-medium text-gray-900">Availability Inquiry</div>
                <div class="text-gray-600">Ask about available times</div>
              </button>
              <button
                type="button"
                @click="useTemplate('pricing')"
                class="text-left px-3 py-2 text-sm border border-gray-200 rounded-lg hover:bg-gray-50 transition"
              >
                <div class="font-medium text-gray-900">Pricing Question</div>
                <div class="text-gray-600">Ask about rates and packages</div>
              </button>
              <button
                type="button"
                @click="useTemplate('subject')"
                class="text-left px-3 py-2 text-sm border border-gray-200 rounded-lg hover:bg-gray-50 transition"
              >
                <div class="font-medium text-gray-900">Subject Specific</div>
                <div class="text-gray-600">Ask about specific topics</div>
              </button>
              <button
                type="button"
                @click="useTemplate('general')"
                class="text-left px-3 py-2 text-sm border border-gray-200 rounded-lg hover:bg-gray-50 transition"
              >
                <div class="font-medium text-gray-900">General Inquiry</div>
                <div class="text-gray-600">General introduction question</div>
              </button>
            </div>
          </div>
          
          <!-- Action Buttons -->
          <div class="flex space-x-4 pt-4">
            <button 
              type="submit"
              :disabled="isSending"
              class="flex-1 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {{ isSending ? 'Sending...' : 'Send Message' }}
            </button>
            <button 
              type="button"
              @click="$emit('close')"
              class="flex-1 px-6 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import api from '@/services/api'

const props = defineProps({
  show: {
    type: Boolean,
    required: true
  },
  tutor: {
    type: Object,
    required: true
  }
})

const emit = defineEmits(['close', 'sent'])

const isSending = ref(false)
const messageForm = ref({
  subject: '',
  message: ''
})

const templates = {
  availability: {
    subject: 'Availability Inquiry',
    message: `Hi ${props.tutor.name},\n\nI'm interested in booking tutoring sessions with you. I wanted to check your availability for the upcoming week. What days and times work best for you?\n\nLooking forward to hearing from you!`
  },
  pricing: {
    subject: 'Pricing Question',
    message: `Hi ${props.tutor.name},\n\nI saw your profile and I'm interested in your tutoring services. I had a few questions about your pricing:\n\n1. Do you offer any package deals for multiple sessions?\n2. Are there different rates for different subjects?\n3. Do you offer a free trial session?\n\nThank you for your time!`
  },
  subject: {
    subject: `${props.tutor.specialty} Tutoring`,
    message: `Hi ${props.tutor.name},\n\nI'm looking for help with ${props.tutor.specialty}. Specifically, I'm struggling with [mention specific topics]. \n\nI saw that you specialize in this area and I'd love to learn more about your teaching approach and how you might be able to help me improve.\n\nThanks!`
  },
  general: {
    subject: 'Tutoring Inquiry',
    message: `Hi ${props.tutor.name},\n\nI found your profile and I'm very interested in working with you. I'm a [student level/grade] student looking for help with [subjects].\n\nCould you tell me a bit more about your teaching style and experience? I'd also love to know what makes your tutoring approach effective.\n\nLooking forward to your response!`
  }
}

const useTemplate = (templateType) => {
  const template = templates[templateType]
  messageForm.value.subject = template.subject
  messageForm.value.message = template.message
}

const sendMessage = async () => {
  if (!messageForm.value.subject || !messageForm.value.message) {
    alert('Please fill in both subject and message')
    return
  }

  isSending.value = true
  
  try {
    // Get current user from localStorage
    const userData = localStorage.getItem('user')
    if (!userData) {
      throw new Error('User not logged in')
    }
    
    const user = JSON.parse(userData)
    
    const messageData = {
      sender_id: user.id,
      receiver_id: props.tutor.id,
      subject: messageForm.value.subject,
      message: messageForm.value.message,
      tutor_id: props.tutor.id
    }

    console.log('Sending message:', messageData)
    
    const response = await api.post('/messages', messageData)
    const result = response.data
    
    console.log('Message sent:', result)
    
    // Reset form
    messageForm.value = {
      subject: '',
      message: ''
    }
    
    // Show success message
    alert('Message sent successfully! 🎉')
    
    // Emit events
    emit('sent', result.message_data)
    emit('close')
    
  } catch (error) {
    console.error('Message error:', error)
    
    // Show detailed error message
    let errorMessage = 'Failed to send message. Please try again.'
    
    if (error.response) {
      errorMessage = error.response.data?.message || errorMessage
    } else if (error.request) {
      errorMessage = 'Network error. Please check your connection.'
    } else {
      errorMessage = error.message || errorMessage
    }
    
    alert(errorMessage)
  } finally {
    isSending.value = false
  }
}
</script>
