<template>
  <div class="min-h-screen bg-gray-50 flex">
    <!-- Sidebar -->
    <aside class="w-64 bg-white shadow-lg p-6">
      <h2 class="text-xl font-bold mb-6">Menu</h2>

      <button
        @click="activeTab = 'tutors'"
        class="w-full mb-2 px-4 py-3 rounded-lg"
        :class="activeTab === 'tutors' ? 'bg-blue-600 text-white' : 'hover:bg-gray-100'"
      >
        Tutors
      </button>

      <button
        @click="activeTab = 'sessions'"
        class="w-full mb-2 px-4 py-3 rounded-lg"
        :class="activeTab === 'sessions' ? 'bg-blue-600 text-white' : 'hover:bg-gray-100'"
      >
        My Sessions
      </button>

      <button
        @click="activeTab = 'dashboard'"
        class="w-full px-4 py-3 rounded-lg"
        :class="activeTab === 'dashboard' ? 'bg-blue-600 text-white' : 'hover:bg-gray-100'"
      >
        Dashboard
      </button>
    </aside>

    <!-- Main -->
    <main class="flex-1 p-8">
      <h1 class="text-3xl font-bold mb-6">
        Welcome back, {{ user?.name || 'Student' }} 👋
      </h1>

      <!-- ================= TUTORS ================= -->
      <section v-if="activeTab === 'tutors'">
        <h2 class="text-2xl font-bold mb-4">Available Tutors</h2>

        <input
          v-model="search"
          placeholder="Search tutor or subject..."
          class="input mb-6"
        />

        <div v-if="isLoading" class="text-gray-500">Loading tutors...</div>

        <div v-else-if="filteredTutors.length === 0" class="text-gray-500">
          No tutors found.
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div
            v-for="tutor in filteredTutors"
            :key="tutor.id"
            class="bg-white p-6 rounded-xl shadow"
          >
            <img :src="tutor.photo" class="w-16 h-16 rounded-full mb-3" />

            <h3 class="font-bold">
              {{ tutor.name }} {{ tutor.surname }}
            </h3>

            <p class="text-sm text-gray-600">{{ tutor.specialty }}</p>

            <p class="text-yellow-500 mb-2">
              ⭐ {{ tutor.rating }}/5
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

      <!-- ================= MY SESSIONS ================= -->
      <section v-if="activeTab === 'sessions'">
        <h2 class="text-2xl font-bold mb-6">My Sessions</h2>

        <div v-if="sessions.length === 0" class="text-gray-500">
          You have no booked sessions yet.
        </div>

        <div class="space-y-4">
          <div
            v-for="s in sessions"
            :key="s.id"
            class="bg-white p-5 rounded-xl shadow flex justify-between"
          >
            <div>
              <p class="font-bold">{{ s.subject }}</p>
              <p class="text-sm text-gray-600">
                {{ s.tutor }} — {{ s.date }} at {{ s.time }}
              </p>
            </div>
            <span
              class="px-3 py-1 rounded-full text-sm"
              :class="s.status === 'Upcoming'
                ? 'bg-blue-100 text-blue-700'
                : 'bg-green-100 text-green-700'"
            >
              {{ s.status }}
            </span>
          </div>
        </div>
      </section>

      <!-- ================= DASHBOARD ================= -->
      <section v-if="activeTab === 'dashboard'">
        <h2 class="text-2xl font-bold mb-6">Dashboard Overview</h2>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div class="bg-white p-6 rounded-xl shadow">
            <h3 class="font-semibold">Sessions Booked</h3>
            <p class="text-3xl font-bold text-blue-600">{{ sessions.length }}</p>
          </div>

          <div class="bg-white p-6 rounded-xl shadow">
            <h3 class="font-semibold">Tutors Tried</h3>
            <p class="text-3xl font-bold text-green-600">{{ uniqueTutors }}</p>
          </div>

          <div class="bg-white p-6 rounded-xl shadow">
            <h3 class="font-semibold">Learning Hours</h3>
            <p class="text-3xl font-bold text-purple-600">{{ totalHours }}</p>
          </div>
        </div>
      </section>
    </main>

    <!-- ================= TUTOR MODAL ================= -->
    <div
      v-if="selectedTutor"
      class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center"
      @click="selectedTutor = null"
    >
      <div class="bg-white p-6 rounded-xl max-w-md w-full" @click.stop>
        <h2 class="text-xl font-bold mb-3">
          {{ selectedTutor.name }} {{ selectedTutor.surname }}
        </h2>

        <p class="mb-3">{{ selectedTutor.bio }}</p>

        <button
          @click="openBookingModal(selectedTutor)"
          class="w-full bg-blue-600 text-white py-3 rounded-lg"
        >
          Book Session
        </button>
      </div>
    </div>

    <!-- ================= BOOKING MODAL ================= -->
    <div
      v-if="showBookingModal"
      class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center"
      @click="closeBookingModal"
    >
      <div class="bg-white p-6 rounded-xl max-w-md w-full" @click.stop>
        <h2 class="text-xl font-bold mb-4">Book Session</h2>

        <input v-model="bookingForm.subject" placeholder="Subject" class="input mb-3" />
        <input type="date" v-model="bookingForm.date" class="input mb-3" />
        <input type="time" v-model="bookingForm.time" class="input mb-3" />

        <button
          @click="submitBooking"
          class="w-full bg-blue-600 text-white py-3 rounded-lg"
        >
          Confirm Booking
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import api from '@/services/api'

const user = ref(null)
const tutors = ref([])
const sessions = ref([])
const isLoading = ref(true)

const activeTab = ref('tutors')
const selectedTutor = ref(null)
const showBookingModal = ref(false)
const bookingTutor = ref(null)
const search = ref('')

const bookingForm = ref({
  subject: '',
  date: '',
  time: ''
})

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
    rating: Math.floor(Math.random() * 2) + 4,
    photo: `https://picsum.photos/seed/${t.id}/200`
  }))

  isLoading.value = false
})

const filteredTutors = computed(() =>
  tutors.value.filter(t =>
    t.name.toLowerCase().includes(search.value.toLowerCase()) ||
    t.specialty.toLowerCase().includes(search.value.toLowerCase())
  )
)

const openBookingModal = tutor => {
  bookingTutor.value = tutor
  showBookingModal.value = true
}

const closeBookingModal = () => {
  showBookingModal.value = false
  selectedTutor.value = null
}

const submitBooking = () => {
  sessions.value.push({
    id: Date.now(),
    tutor: `${bookingTutor.value.name} ${bookingTutor.value.surname}`,
    subject: bookingForm.value.subject,
    date: bookingForm.value.date,
    time: bookingForm.value.time,
    status: 'Upcoming'
  })

  bookingForm.value = { subject: '', date: '', time: '' }
  closeBookingModal()
}

const uniqueTutors = computed(() =>
  new Set(sessions.value.map(s => s.tutor)).size
)

const totalHours = computed(() => sessions.value.length * 1)
</script>

<style scoped>
.input {
  width: 100%;
  padding: 8px;
  border: 1px solid #ccc;
  border-radius: 6px;
}
</style>
