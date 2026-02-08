<template>
  <div class="min-h-screen bg-gray-50 flex">
    <!-- Sidebar -->
    <aside class="w-64 bg-white shadow-lg p-6">
      <h2 class="text-xl font-bold mb-6">Menu</h2>

      <button
        @click="showTutors = true"
        class="w-full mb-2 px-4 py-3 rounded-lg"
        :class="showTutors ? 'bg-blue-600 text-white' : 'hover:bg-gray-100'"
      >
        Tutors
      </button>

      <button
        @click="showTutors = false"
        class="w-full px-4 py-3 rounded-lg hover:bg-gray-100"
      >
        Dashboard
      </button>
    </aside>

    <!-- Main -->
    <main class="flex-1 p-8">
      <!-- Header -->
      <h1 class="text-3xl font-bold mb-6">
        Welcome back, {{ user?.name || 'Student' }}!
      </h1>

      <!-- Tutors -->
      <section v-if="showTutors">
        <h2 class="text-2xl font-bold mb-6">Available Tutors</h2>

        <div v-if="isLoading" class="text-gray-500">Loading tutors...</div>

        <div
          v-else
          class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          <div
            v-for="tutor in tutors"
            :key="tutor.id"
            class="bg-white p-6 rounded-xl shadow"
          >
            <img
              :src="tutor.photo"
              class="w-16 h-16 rounded-full mb-3"
            />

            <h3 class="font-bold">
              {{ tutor.name }} {{ tutor.surname }}
            </h3>

            <p class="text-sm text-gray-600 mb-2">
              {{ tutor.specialty }}
            </p>

            <p class="text-sm mb-4 line-clamp-3">
              {{ tutor.bio }}
            </p>

            <div class="flex justify-between items-center">
              <span class="font-bold text-blue-600">
                ${{ tutor.cost }}/hr
              </span>

              <button
                @click="selectedTutor = tutor"
                class="bg-blue-600 text-white px-4 py-2 rounded-lg"
              >
                View
              </button>
            </div>
          </div>
        </div>
      </section>

      <!-- Dashboard Overview -->
      <section v-if="!showTutors">
        <h2 class="text-2xl font-bold mb-6">Dashboard Overview</h2>
        
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div class="bg-white p-6 rounded-xl shadow">
            <h3 class="text-lg font-semibold mb-2">Active Tutors</h3>
            <p class="text-3xl font-bold text-blue-600">8</p>
          </div>
          
          <div class="bg-white p-6 rounded-xl shadow">
            <h3 class="text-lg font-semibold mb-2">Learning Hours</h3>
            <p class="text-3xl font-bold text-green-600">24.5</p>
          </div>
          
          <div class="bg-white p-6 rounded-xl shadow">
            <h3 class="text-lg font-semibold mb-2">Completion Rate</h3>
            <p class="text-3xl font-bold text-purple-600">92%</p>
          </div>
          
          <div class="bg-white p-6 rounded-xl shadow">
            <h3 class="text-lg font-semibold mb-2">Day Streak</h3>
            <p class="text-3xl font-bold text-orange-600">7 🔥</p>
          </div>
        </div>

        <div class="bg-white p-6 rounded-xl shadow">
          <h3 class="text-lg font-semibold mb-4">Recent Activity</h3>
          <div class="space-y-3">
            <div class="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div>
                <p class="font-medium">Completed Math session with Dr. Smith</p>
                <p class="text-sm text-gray-500">2 hours ago</p>
              </div>
              <span class="px-2 py-1 bg-green-100 text-green-700 rounded-full text-xs">Completed</span>
            </div>
            <div class="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div>
                <p class="font-medium">Achieved 90% in Physics quiz</p>
                <p class="text-sm text-gray-500">1 day ago</p>
              </div>
              <span class="px-2 py-1 bg-yellow-100 text-yellow-700 rounded-full text-xs">Achievement</span>
            </div>
            <div class="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div>
                <p class="font-medium">Booked Chemistry tutor for tomorrow</p>
                <p class="text-sm text-gray-500">2 days ago</p>
              </div>
              <span class="px-2 py-1 bg-blue-100 text-blue-700 rounded-full text-xs">Scheduled</span>
            </div>
          </div>
        </div>
      </section>
    </main>

    <!-- Tutor Profile Modal -->
    <div
      v-if="selectedTutor"
      class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
      @click="selectedTutor = null"
    >
      <div
        class="bg-white rounded-xl max-w-lg w-full p-6"
        @click.stop
      >
        <div class="flex justify-between mb-4">
          <h2 class="text-xl font-bold">
            {{ selectedTutor.name }} {{ selectedTutor.surname }}
          </h2>
          <button @click="selectedTutor = null">✕</button>
        </div>

        <img
          :src="selectedTutor.photo"
          class="w-24 h-24 rounded-full mx-auto mb-4"
        />

        <p class="text-gray-700 mb-4">
          {{ selectedTutor.bio }}
        </p>

        <div class="flex flex-wrap gap-2 mb-6">
          <span
            v-for="skill in selectedTutor.skills"
            :key="skill"
            class="px-3 py-1 bg-blue-100 rounded-full text-sm"
          >
            {{ skill }}
          </span>
        </div>

        <button
          @click="openBookingModal(selectedTutor)"
          class="w-full bg-blue-600 text-white py-3 rounded-lg"
        >
          Book Session
        </button>
      </div>
    </div>

    <!-- Booking Modal -->
    <div
      v-if="showBookingModal && bookingTutor"
      class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
      @click="closeBookingModal"
    >
      <div
        class="bg-white rounded-xl max-w-md w-full p-6"
        @click.stop
      >
        <h2 class="text-2xl font-bold mb-4">Book Session</h2>

        <label class="block mb-2">Subject</label>
        <input v-model="bookingForm.subject" class="input" />

        <label class="block mt-4 mb-2">Date</label>
        <input type="date" v-model="bookingForm.date" class="input" />

        <label class="block mt-4 mb-2">Time</label>
        <input type="time" v-model="bookingForm.time" class="input" />

        <label class="block mt-4 mb-2">Duration</label>
        <select v-model="bookingForm.duration" class="input">
          <option value="30">30 min</option>
          <option value="60">1 hour</option>
          <option value="90">1.5 hours</option>
        </select>

        <div class="mt-4 font-bold">
          Cost: ${{ estimatedCost }}
        </div>

        <div class="flex gap-3 mt-6">
          <button
            @click="submitBooking"
            class="flex-1 bg-blue-600 text-white py-3 rounded-lg"
          >
            Confirm
          </button>

          <button
            @click="closeBookingModal"
            class="flex-1 bg-gray-300 py-3 rounded-lg"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import api from '@/services/api'

const user = ref(null)
const tutors = ref([])
const isLoading = ref(true)
const showTutors = ref(true)
const selectedTutor = ref(null)

onMounted(async () => {
  user.value = JSON.parse(localStorage.getItem('user'))

  const res = await api.get('/tutors')
  tutors.value = res.data.map(t => ({
    id: t.id,
    name: t.name.split(' ')[0],
    surname: t.name.split(' ').slice(1).join(' '),
    specialty: t.subject || 'General',
    bio: t.bio || 'Experienced tutor',
    cost: t.price_per_hour || 50,
    photo: `https://picsum.photos/seed/${t.id}/200`,
    skills: t.courses || []
  }))

  isLoading.value = false
})
</script>

<style scoped>
.input {
  width: 100%;
  padding: 8px;
  border: 1px solid #ccc;
  border-radius: 6px;
}
</style>
