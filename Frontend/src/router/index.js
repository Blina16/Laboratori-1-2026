import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'Home',
      component: () => import('../views/HomeView.vue'),
    },
    {
      path: '/tutors',
      name: 'Tutors',
      component: () => import('../views/TutorsView.vue'),
    },
    {
      path: '/about',
      name: 'About',
      component: () => import('../views/AboutView.vue'),
    },
    {
      path: '/contact',
      name: 'Contact',
      component: () => import('../views/ContactView.vue'),
    },
    {
      path: '/login',
      name: 'Login',
      component: () => import('../views/LoginView.vue'),
    },
    {
      path: '/signup',
      name: 'SignUp',
      component: () => import('../views/SignUpView.vue'),
    },
    {
      path: '/dashboard',
      name: 'Dashboard',
      component: () => import('../views/DashboardView.vue'),
    },
    {
      path: '/admin',
      redirect: '/admin/dashboard'
    },
    {
      path: '/admin/dashboard',
      name: 'AdminDashboard',
      component: () => import('../views/AdminDashboardView.vue'),
    },
    {
      path: '/admin/tutors',
      name: 'AdminTutors',
      component: () => import('../views/AdminTutorsView.vue'),
    },
    {
      path: '/admin/students',
      name: 'AdminStudents',
      component: () => import('../views/AdminStudentsView.vue'),
    },
    {
      path: '/admin/courses',
      name: 'AdminCourses',
      component: () => import('../views/AdminCoursesView.vue'),
    },
  ],
})

export default router
