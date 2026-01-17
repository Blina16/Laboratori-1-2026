<template>
  <div class="min-h-[calc(100vh-4rem)] bg-gray-50">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div class="mb-8">
        <h1 class="text-3xl font-bold text-gray-900 mb-2">Our Tutors</h1>
        <p class="text-gray-600">Browse our selection of qualified tutors</p>
      </div>

      <div v-if="tutors.length === 0" class="text-center py-16 bg-white rounded-xl shadow-sm border border-gray-200">
        <svg class="mx-auto h-16 w-16 text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
        </svg>
        <p class="text-gray-500 mb-4">No tutors available yet</p>
        <router-link to="/admin/tutors" class="btn-primary inline-block">
          Add Tutors (Admin)
        </router-link>
      </div>

      <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div
          v-for="tutor in tutors"
          :key="tutor.id"
          class="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition"
        >
          <div class="flex items-center gap-4 mb-4">
            <div class="w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center text-white text-xl font-bold">
              {{ tutor.name.charAt(0) }}{{ tutor.surname.charAt(0) }}
            </div>
            <div>
              <h3 class="text-lg font-semibold text-gray-900">
                {{ tutor.name }} {{ tutor.surname }}
              </h3>
              <p class="text-sm text-gray-500">{{ tutor.experience }} years experience</p>
            </div>
          </div>

          <div v-if="tutor.courses.length > 0" class="mb-4">
            <p class="text-sm font-medium text-gray-700 mb-2">Courses:</p>
            <div class="flex flex-wrap gap-2">
              <span
                v-for="(course, index) in tutor.courses"
                :key="index"
                class="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-green-100 text-green-800"
              >
                {{ course }}
              </span>
            </div>
          </div>

          <div v-if="tutor.students.length > 0" class="mb-4">
            <p class="text-sm font-medium text-gray-700 mb-2">
              Students: <span class="text-blue-600 font-semibold">{{ tutor.students.length }}</span>
            </p>
          </div>

          <button class="w-full btn-primary mt-4">
            Contact Tutor
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useTutorsStore } from '../stores/tutors'

defineOptions({
  name: 'TutorsView'
})

const tutorsStore = useTutorsStore()
const tutors = computed(() => tutorsStore.getAllTutors)
</script>

