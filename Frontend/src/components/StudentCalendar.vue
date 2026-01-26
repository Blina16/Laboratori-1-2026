<template>
  <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
    <div class="flex items-center justify-between mb-4">
      <h2 class="text-lg font-semibold text-gray-900">Lesson Calendar</h2>
      <div class="flex items-center gap-1">
        <button
          @click="previousMonth"
          class="p-1 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded transition"
        >
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <div class="text-xs font-medium text-gray-900 min-w-[80px] text-center">
          {{ currentMonthYear }}
        </div>
        <button
          @click="nextMonth"
          class="p-1 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded transition"
        >
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>
    </div>

    <!-- Calendar Grid -->
    <div class="grid grid-cols-7 gap-px bg-gray-200 rounded overflow-hidden mb-3">
      <!-- Weekday headers -->
      <div
        v-for="day in weekDays"
        :key="day"
        class="bg-gray-50 p-1 text-center text-xs font-medium text-gray-700"
      >
        {{ day }}
      </div>

      <!-- Calendar days -->
      <div
        v-for="day in calendarDays"
        :key="day.date"
        class="bg-white min-h-[50px] p-1 cursor-pointer hover:bg-gray-50 transition"
        :class="{
          'bg-blue-50': isToday(day.date),
          'text-gray-900': day.currentMonth,
          'text-gray-400': !day.currentMonth
        }"
        @click="selectDate(day.date)"
      >
        <div class="flex flex-col h-full">
          <div class="text-xs font-medium mb-1">
            {{ day.dayNumber }}
          </div>
          
          <!-- Lessons for this day -->
          <div class="space-y-1 flex-1">
            <div
              v-for="lesson in day.lessons.slice(0, 2)"
              :key="lesson.id"
              class="text-xs p-1 rounded bg-blue-100 text-blue-800 truncate hover:bg-blue-200 transition cursor-pointer"
              @click.stop="viewLesson(lesson)"
              :title="`${lesson.time} - ${lesson.tutorName}`"
            >
              {{ lesson.time }}
            </div>
            <div
              v-if="day.lessons.length > 2"
              class="text-xs text-gray-500 text-center"
            >
              +{{ day.lessons.length - 2 }} more
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Selected Date Details -->
    <div v-if="selectedDate && selectedDateLessons.length > 0" class="mb-3 p-3 bg-gray-50 rounded-lg">
      <h3 class="font-medium text-gray-900 mb-2 text-sm">
        {{ formatDate(selectedDate) }}
      </h3>
      <div class="space-y-2">
        <div
          v-for="lesson in selectedDateLessons"
          :key="lesson.id"
          class="flex items-center justify-between p-2 bg-white rounded border border-gray-200"
        >
          <div class="flex items-center space-x-2">
            <div class="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
              <svg class="w-3 h-3 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div class="min-w-0">
              <p class="font-medium text-gray-900 text-xs truncate">{{ lesson.tutorName }}</p>
              <p class="text-xs text-gray-600">{{ lesson.time }}</p>
            </div>
          </div>
          <div class="flex space-x-1">
            <button
              @click="joinLesson(lesson)"
              class="px-2 py-1 bg-green-600 text-white text-xs rounded hover:bg-green-700 transition"
            >
              Join
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Mini Legend -->
    <div class="flex items-center justify-center space-x-4 text-xs text-gray-600">
      <div class="flex items-center space-x-1">
        <div class="w-3 h-3 bg-blue-100 rounded"></div>
        <span>Lesson</span>
      </div>
      <div class="flex items-center space-x-1">
        <div class="w-3 h-3 bg-blue-50 rounded border border-blue-200"></div>
        <span>Today</span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import api from '@/services/api'

defineOptions({
  name: 'StudentCalendar'
})

const props = defineProps({
  studentId: {
    type: Number,
    required: true
  }
})

const lessons = ref([])
const currentMonth = ref(new Date().getMonth())
const currentYear = ref(new Date().getFullYear())
const selectedDate = ref(null)

const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

const currentMonthYear = computed(() => {
  const date = new Date(currentYear.value, currentMonth.value)
  return date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
})

const calendarDays = computed(() => {
  const firstDay = new Date(currentYear.value, currentMonth.value, 1)
  const lastDay = new Date(currentYear.value, currentMonth.value + 1, 0)
  const startDate = new Date(firstDay)
  startDate.setDate(startDate.getDate() - firstDay.getDay())
  
  const days = []
  const current = new Date(startDate)
  
  for (let i = 0; i < 42; i++) {
    const dateStr = current.toISOString().split('T')[0]
    const isCurrentMonth = current.getMonth() === currentMonth.value
    
    days.push({
      date: dateStr,
      dayNumber: current.getDate(),
      currentMonth: isCurrentMonth,
      lessons: getLessonsForDate(dateStr)
    })
    
    current.setDate(current.getDate() + 1)
  }
  
  return days
})

const selectedDateLessons = computed(() => {
  if (!selectedDate.value) return []
  return getLessonsForDate(selectedDate.value)
})

const fetchLessons = async () => {
  try {
    const response = await api.get(`/api/sessions/student/${props.studentId}`)
    lessons.value = response.data.map(session => ({
      id: session.id,
      tutorName: session.teacher_name,
      subject: session.course_title || session.title || 'General Tutoring',
      date: new Date(session.scheduled_at).toISOString().split('T')[0],
      time: new Date(session.scheduled_at).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}),
      status: session.status
    }))
  } catch (error) {
    console.error('Failed to fetch lessons:', error)
    lessons.value = []
  }
}

const getLessonsForDate = (date) => {
  return lessons.value.filter(lesson => lesson.date === date)
}

const isToday = (date) => {
  const today = new Date().toISOString().split('T')[0]
  return date === today
}

const formatDate = (date) => {
  return new Date(date).toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}

const previousMonth = () => {
  if (currentMonth.value === 0) {
    currentMonth.value = 11
    currentYear.value--
  } else {
    currentMonth.value--
  }
}

const nextMonth = () => {
  if (currentMonth.value === 11) {
    currentMonth.value = 0
    currentYear.value++
  } else {
    currentMonth.value++
  }
}

const selectDate = (date) => {
  selectedDate.value = date
}

const viewLesson = (lesson) => {
  selectedDate.value = lesson.date
}

const joinLesson = (lesson) => {
  // TODO: Implement join lesson functionality
  alert(`Joining lesson with ${lesson.tutorName} at ${lesson.time}`)
}

const rescheduleLesson = (lesson) => {
  // TODO: Implement reschedule functionality
  alert(`Reschedule lesson with ${lesson.tutorName}`)
}

onMounted(() => {
  fetchLessons()
})
</script>
