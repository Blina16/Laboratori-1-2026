<template>
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
    <div class="text-center">
      <h1 class="text-4xl font-bold text-gray-900 mb-4">Welcome to TutorRemote</h1>
      <p class="text-xl text-gray-600 mb-8">Find the perfect tutor for your learning journey</p>
      <router-link to="/tutors" class="btn-primary inline-block">
        Browse Tutors
      </router-link>
    </div>
  </div>
</template>

<script setup>
defineOptions({
  name: 'HomeView'
})
</script>

