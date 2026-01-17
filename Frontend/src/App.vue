<template>
  <div class="min-h-screen bg-gray-50">
    <Navbar />
    <main>
      <router-view />
    </main>
  </div>
</template>

<script setup>
import Navbar from "./components/AppNavbar.vue"
</script>
