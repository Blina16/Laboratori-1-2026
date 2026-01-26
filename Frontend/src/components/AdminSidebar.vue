<template>
  <aside class="w-64 bg-gray-900 border-r border-gray-200 h-[calc(100vh-4rem)] fixed left-0 top-16 z-50 overflow-y-auto shadow-lg">
    <nav class="p-4 space-y-1">
      <router-link
        to="/admin/dashboard"
        class="flex items-center gap-3 px-4 py-3 rounded-lg transition-colors"
        :class="isActive('/admin/dashboard') ? 'bg-blue-600 text-white font-semibold' : 'text-gray-300 hover:bg-gray-800'"
      >
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
        </svg>
        <span>Dashboard</span>
      </router-link>

      <router-link
        to="/admin/tutors"
        class="flex items-center gap-3 px-4 py-3 rounded-lg transition-colors"
        :class="isActive('/admin/tutors') ? 'bg-blue-600 text-white font-semibold' : 'text-gray-300 hover:bg-gray-800'"
      >
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
        </svg>
        <span>Tutors</span>
      </router-link>

      <router-link
        to="/admin/students"
        class="flex items-center gap-3 px-4 py-3 rounded-lg transition-colors"
        :class="isActive('/admin/students') ? 'bg-blue-600 text-white font-semibold' : 'text-gray-300 hover:bg-gray-800'"
      >
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
        </svg>
        <span>Students</span>
      </router-link>

      <router-link
        to="/admin/courses"
        class="flex items-center gap-3 px-4 py-3 rounded-lg transition-colors"
        :class="isActive('/admin/courses') ? 'bg-blue-600 text-white font-semibold' : 'text-gray-300 hover:bg-gray-800'"
      >
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
        </svg>
        <span>Courses</span>
      </router-link>

      <router-link
        to="/admin/grades"
        class="flex items-center gap-3 px-4 py-3 rounded-lg transition-colors"
        :class="isActive('/admin/grades') ? 'bg-blue-600 text-white font-semibold' : 'text-gray-300 hover:bg-gray-800'"
      >
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
        <span>Grades</span>
      </router-link>
    </nav>
  </aside>
</template>

<script setup>
import { useRoute } from 'vue-router'

defineOptions({
  name: 'AdminSidebar'
})

const route = useRoute()

const isActive = (path) => {
  return route.path === path
}
</script>

