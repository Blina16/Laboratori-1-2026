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
            <router-link to="/tutors" class="btn-primary bg-white text-blue-600 hover:bg-gray-100 px-8 py-4 text-lg font-semibold">
              Browse Tutors
            </router-link>
            <router-link to="/signup" class="btn-secondary border-2 border-white text-white hover:bg-white hover:text-blue-600 px-8 py-4 text-lg font-semibold">
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
          <h2 class="text-4xl font-bold text-gray-900 mb-4">Why Choose TutorRemote?</h2>
          <p class="text-xl text-gray-600 max-w-3xl mx-auto">
            We make quality education accessible to everyone through innovative technology and dedicated educators.
          </p>
        </div>
        
        <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div class="feature-card">
            <div class="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-6">
              <svg class="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
            </div>
            <h3 class="text-xl font-semibold text-gray-900 mb-4">Expert Tutors</h3>
            <p class="text-gray-600">
              All our tutors are carefully vetted professionals with proven teaching experience and subject matter expertise.
            </p>
          </div>

          <div class="feature-card">
            <div class="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-6">
              <svg class="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 class="text-xl font-semibold text-gray-900 mb-4">Flexible Scheduling</h3>
            <p class="text-gray-600">
              Learn at your own pace with flexible scheduling options that fit your busy lifestyle and timezone.
            </p>
          </div>

          <div class="feature-card">
            <div class="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mb-6">
              <svg class="w-8 h-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
            </div>
            <h3 class="text-xl font-semibold text-gray-900 mb-4">Personalized Learning</h3>
            <p class="text-gray-600">
              Customized lesson plans tailored to your learning style, pace, and specific academic goals.
            </p>
          </div>
        </div>
      </div>
    </section>

    <!-- About Us Section -->
    <section class="py-20 bg-white">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <h2 class="text-4xl font-bold text-gray-900 mb-6">About TutorRemote</h2>
            <p class="text-lg text-gray-600 mb-6">
              Founded in 2024, TutorRemote was born from a simple belief: quality education should be accessible to everyone, everywhere. 
              We bridge the gap between passionate educators and motivated students through innovative technology.
            </p>
            <p class="text-lg text-gray-600 mb-6">
              Our platform connects students with carefully vetted tutors who not only excel in their subjects but are also 
              passionate about teaching. We believe that the right tutor can transform a student's academic journey and 
              unlock their full potential.
            </p>
            <p class="text-lg text-gray-600 mb-8">
              Whether you're struggling with a specific subject, preparing for exams, or looking to advance your knowledge, 
              our tutors are here to support you every step of the way.
            </p>
            <router-link to="/about" class="btn-primary inline-flex items-center gap-2">
              Learn More About Us
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </router-link>
          </div>
          <div class="grid grid-cols-2 gap-6">
            <div class="text-center p-6 bg-blue-50 rounded-xl">
              <div class="text-3xl font-bold text-blue-600 mb-2">24/7</div>
              <div class="text-gray-700">Support Available</div>
            </div>
            <div class="text-center p-6 bg-green-50 rounded-xl">
              <div class="text-3xl font-bold text-green-600 mb-2">100%</div>
              <div class="text-gray-700">Satisfaction Rate</div>
            </div>
            <div class="text-center p-6 bg-purple-50 rounded-xl">
              <div class="text-3xl font-bold text-purple-600 mb-2">50+</div>
              <div class="text-gray-700">Countries Served</div>
            </div>
            <div class="text-center p-6 bg-orange-50 rounded-xl">
              <div class="text-3xl font-bold text-orange-600 mb-2">1M+</div>
              <div class="text-gray-700">Hours Taught</div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- CTA Section -->
    <section class="py-20 bg-gradient-to-r from-blue-600 to-indigo-700 text-white">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 class="text-4xl font-bold mb-4">Ready to Start Learning?</h2>
        <p class="text-xl mb-8 text-blue-100 max-w-2xl mx-auto">
          Join thousands of students who have transformed their academic journey with our expert tutors.
        </p>
        <div class="flex flex-col sm:flex-row gap-4 justify-center">
          <router-link to="/signup" class="btn-primary bg-white text-blue-600 hover:bg-gray-100 px-8 py-4 text-lg font-semibold">
            Get Started Free
          </router-link>
          <router-link to="/tutors" class="btn-secondary border-2 border-white text-white hover:bg-white hover:text-blue-600 px-8 py-4 text-lg font-semibold">
            Browse Tutors
          </router-link>
        </div>
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
  @apply p-6 bg-white rounded-xl shadow-lg border border-gray-100 hover:shadow-xl transition-shadow;
}

.feature-card {
  @apply p-8 bg-white rounded-xl shadow-lg border border-gray-100 hover:shadow-xl transition-shadow;
}
</style>

