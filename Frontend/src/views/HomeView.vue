<template>
  <div>
    <!-- Hero Section -->
    <section class="bg-gradient-to-br from-blue-600 to-indigo-700 text-white">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div class="text-center">
          <h1 class="text-5xl font-bold mb-6">
            Find the Perfect Tutor for Your Learning Journey
          </h1>
          <p class="text-xl mb-8 text-blue-100 max-w-3xl mx-auto">
            Connect with expert tutors who are passionate about helping you achieve your academic goals.
            Personalized learning experiences tailored to your unique needs.
          </p>
          <div class="flex flex-col sm:flex-row gap-4 justify-center">
            <router-link
              to="/tutors"
              class="btn-primary bg-white text-blue-600 hover:bg-gray-100 px-8 py-4 text-lg font-semibold"
            >
              Browse Tutors
            </router-link>
            <router-link
              to="/signup"
              class="btn-secondary border-2 border-white text-white hover:bg-white hover:text-blue-600 px-8 py-4 text-lg font-semibold"
            >
              Become a Tutor
            </router-link>
          </div>
        </div>
      </div>
    </section>

    <!-- Stats Section -->
    <section class="py-16 bg-white">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="grid grid-cols-1 md:grid-cols-4 gap-8 text-center">
          <div class="stat-card">
            <div class="text-4xl font-bold text-blue-600 mb-2">500+</div>
            <div class="text-gray-600">Expert Tutors</div>
          </div>
          <div class="stat-card">
            <div class="text-4xl font-bold text-green-600 mb-2">10,000+</div>
            <div class="text-gray-600">Students Helped</div>
          </div>
          <div class="stat-card">
            <div class="text-4xl font-bold text-purple-600 mb-2">50+</div>
            <div class="text-gray-600">Subjects Covered</div>
          </div>
          <div class="stat-card">
            <div class="text-4xl font-bold text-orange-600 mb-2">4.9/5</div>
            <div class="text-gray-600">Average Rating</div>
          </div>
        </div>
      </div>
    </section>

    <!-- Features Section -->
    <section class="py-20 bg-gray-50">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="text-center mb-16">
          <h2 class="text-4xl font-bold text-gray-900 mb-4">
            Why Choose TutorRemote?
          </h2>
          <p class="text-xl text-gray-600 max-w-3xl mx-auto">
            We make quality education accessible to everyone through innovative technology
            and dedicated educators.
          </p>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div class="feature-card">
            <div class="icon-circle bg-blue-100 text-blue-600">
              📘
            </div>
            <h3 class="text-xl font-semibold mb-3">Expert Tutors</h3>
            <p class="text-gray-600">
              Carefully vetted professionals with real teaching experience.
            </p>
          </div>

          <div class="feature-card">
            <div class="icon-circle bg-green-100 text-green-600">
              ⏰
            </div>
            <h3 class="text-xl font-semibold mb-3">Flexible Scheduling</h3>
            <p class="text-gray-600">
              Learn at your own pace with schedules that fit your life.
            </p>
          </div>

          <div class="feature-card">
            <div class="icon-circle bg-purple-100 text-purple-600">
              🎯
            </div>
            <h3 class="text-xl font-semibold mb-3">Personalized Learning</h3>
            <p class="text-gray-600">
              Lessons tailored to your goals, pace, and learning style.
            </p>
          </div>
        </div>
      </div>
    </section>

    <!-- About Section -->
    <section class="py-20 bg-white">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-2 gap-12">
        <div>
          <h2 class="text-4xl font-bold mb-6">About TutorRemote</h2>
          <p class="text-lg text-gray-600 mb-4">
            TutorRemote connects students with professional tutors worldwide.
          </p>
          <p class="text-lg text-gray-600 mb-6">
            We believe education should be accessible, flexible, and effective.
          </p>
          <router-link to="/about" class="btn-primary inline-flex items-center gap-2">
            Learn More
            →
          </router-link>
        </div>

        <div class="grid grid-cols-2 gap-6">
          <div class="info-card bg-blue-50 text-blue-600">24/7 Support</div>
          <div class="info-card bg-green-50 text-green-600">100% Satisfaction</div>
          <div class="info-card bg-purple-50 text-purple-600">50+ Countries</div>
          <div class="info-card bg-orange-50 text-orange-600">1M+ Hours Taught</div>
        </div>
      </div>
    </section>

    <!-- CTA -->
    <section class="py-20 bg-gradient-to-r from-blue-600 to-indigo-700 text-white text-center">
      <h2 class="text-4xl font-bold mb-4">Ready to Start Learning?</h2>
      <p class="text-xl mb-8 text-blue-100">
        Join thousands of students learning with expert tutors.
      </p>
      <div class="flex justify-center gap-4 flex-wrap">
        <router-link to="/signup" class="btn-primary bg-white text-blue-600 px-8 py-4">
          Get Started
        </router-link>
        <router-link to="/tutors" class="btn-secondary border-2 border-white px-8 py-4">
          Browse Tutors
        </router-link>
      </div>
    </section>
  </div>
</template>

<script setup>
defineOptions({
  name: 'HomeView'
})
</script>

<style scoped>
.stat-card {
  @apply p-6 bg-white rounded-xl shadow border hover:shadow-lg transition;
}

.feature-card {
  @apply p-8 bg-white rounded-xl shadow border text-center hover:shadow-lg transition;
}

.icon-circle {
  @apply w-16 h-16 mx-auto mb-6 rounded-full flex items-center justify-center text-3xl;
}

.info-card {
  @apply p-6 rounded-xl font-bold text-center;
}
</style>
