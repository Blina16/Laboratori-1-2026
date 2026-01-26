<template>
  <div class="min-h-screen bg-gray-50 flex">
    <!-- Left Sidebar -->
    <div class="w-64 bg-white shadow-lg">
      <div class="p-6">
        <h2 class="text-xl font-bold text-gray-900 mb-6">Navigation</h2>
        <nav class="space-y-2">
          <button 
            @click="showTutors = true"
            :class="['w-full text-left px-4 py-3 rounded-lg transition', showTutors ? 'bg-blue-600 text-white' : 'text-gray-700 hover:bg-gray-100']"
          >
            <div class="flex items-center">
              <svg class="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
              Tutors
            </div>
          </button>
        </nav>
      </div>
    </div>

    <!-- Main Content -->
    <div class="flex-1">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <!-- Tutors Section -->
        <div v-if="showTutors">
          <h1 class="text-3xl font-bold text-gray-900 mb-8">Available Tutors</h1>
          
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div 
              v-for="tutor in tutors" 
              :key="tutor.id"
              @click="selectedTutor = tutor"
              class="bg-white rounded-xl shadow-sm p-6 border border-gray-100 cursor-pointer hover:shadow-md transition"
            >
              <div class="flex items-center space-x-4 mb-4">
                <img 
                  :src="tutor.photo" 
                  :alt="tutor.name"
                  class="w-16 h-16 rounded-full object-cover"
                >
                <div>
                  <h3 class="text-lg font-semibold text-gray-900">{{ tutor.name }} {{ tutor.surname }}</h3>
                  <p class="text-sm text-gray-600">{{ tutor.specialty }}</p>
                </div>
              </div>
              <p class="text-gray-700 text-sm mb-4 line-clamp-3">{{ tutor.bio }}</p>
              <div class="flex items-center justify-between">
                <span class="text-lg font-bold text-blue-600">${{ tutor.cost }}/hour</span>
                <button class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition text-sm">
                  View Profile
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- Selected Tutor Profile -->
        <div v-if="selectedTutor" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" @click="selectedTutor = null">
          <div class="bg-white rounded-xl shadow-xl max-w-2xl w-full mx-4" @click.stop>
            <div class="p-6">
              <div class="flex justify-between items-start mb-6">
                <h2 class="text-2xl font-bold text-gray-900">Tutor Profile</h2>
                <button 
                  @click="selectedTutor = null"
                  class="text-gray-400 hover:text-gray-600"
                >
                  <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              
              <div class="flex items-center space-x-6 mb-6">
                <img 
                  :src="selectedTutor.photo" 
                  :alt="selectedTutor.name"
                  class="w-24 h-24 rounded-full object-cover"
                >
                <div>
                  <h3 class="text-2xl font-bold text-gray-900">{{ selectedTutor.name }} {{ selectedTutor.surname }}</h3>
                  <p class="text-lg text-gray-600 mb-2">{{ selectedTutor.specialty }}</p>
                  <p class="text-2xl font-bold text-blue-600">${{ selectedTutor.cost }}/hour</p>
                </div>
              </div>
              
              <div class="mb-6">
                <h4 class="text-lg font-semibold text-gray-900 mb-3">About</h4>
                <p class="text-gray-700">{{ selectedTutor.bio }}</p>
              </div>
              
              <div class="mb-6">
                <h4 class="text-lg font-semibold text-gray-900 mb-3">Expertise</h4>
                <div class="flex flex-wrap gap-2">
                  <span 
                    v-for="skill in selectedTutor.skills" 
                    :key="skill"
                    class="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm"
                  >
                    {{ skill }}
                  </span>
                </div>
              </div>
              
              <div class="flex space-x-4">
                <button class="flex-1 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition">
                  Book Session
                </button>
                <button class="flex-1 px-6 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition">
                  Send Message
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

defineOptions({
  name: 'StudentDashboard'
})

const showTutors = ref(true)
const selectedTutor = ref(null)

const tutors = ref([
  {
    id: 1,
    name: 'Sarah',
    surname: 'Johnson',
    photo: 'https://picsum.photos/seed/tutor1/200/200.jpg',
    specialty: 'Mathematics',
    bio: 'Experienced mathematics tutor with over 10 years of teaching experience. I specialize in calculus, algebra, and statistics. My goal is to make complex mathematical concepts easy to understand and apply.',
    cost: 45,
    skills: ['Calculus', 'Algebra', 'Statistics', 'Geometry', 'Trigonometry']
  },
  {
    id: 2,
    name: 'Michael',
    surname: 'Chen',
    photo: 'https://picsum.photos/seed/tutor2/200/200.jpg',
    specialty: 'Computer Science',
    bio: 'Software engineer with a passion for teaching programming. I help students learn web development, algorithms, and data structures. My approach is hands-on and project-based.',
    cost: 55,
    skills: ['JavaScript', 'Python', 'React', 'Node.js', 'Data Structures']
  },
  {
    id: 3,
    name: 'Emily',
    surname: 'Rodriguez',
    photo: 'https://picsum.photos/seed/tutor3/200/200.jpg',
    specialty: 'English Literature',
    bio: 'Literature enthusiast and writing coach. I help students improve their reading comprehension, writing skills, and critical thinking. Sessions are engaging and discussion-based.',
    cost: 40,
    skills: ['Essay Writing', 'Literature Analysis', 'Creative Writing', 'Grammar', 'Critical Thinking']
  },
  {
    id: 4,
    name: 'David',
    surname: 'Kim',
    photo: 'https://picsum.photos/seed/tutor4/200/200.jpg',
    specialty: 'Physics',
    bio: 'Physics professor with a focus on making science accessible. I teach mechanics, electromagnetism, and quantum physics using real-world examples and interactive demonstrations.',
    cost: 50,
    skills: ['Mechanics', 'Electromagnetism', 'Quantum Physics', 'Thermodynamics', 'Optics']
  },
  {
    id: 5,
    name: 'Lisa',
    surname: 'Anderson',
    photo: 'https://picsum.photos/seed/tutor5/200/200.jpg',
    specialty: 'Chemistry',
    bio: 'Chemistry tutor with industry experience in pharmaceutical research. I make chemistry practical and relevant by connecting concepts to everyday applications and career opportunities.',
    cost: 48,
    skills: ['Organic Chemistry', 'Inorganic Chemistry', 'Biochemistry', 'Lab Techniques', 'Molecular Biology']
  },
  {
    id: 6,
    name: 'James',
    surname: 'Wilson',
    photo: 'https://picsum.photos/seed/tutor6/200/200.jpg',
    specialty: 'History',
    bio: 'Historian specializing in world history and political science. I help students understand historical events and their impact on modern society through engaging storytelling and analysis.',
    cost: 38,
    skills: ['World History', 'US History', 'Political Science', 'Research Methods', 'Historical Analysis']
  }
])
</script>
