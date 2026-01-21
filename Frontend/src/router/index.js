import { createRouter, createWebHistory } from 'vue-router'
import { requireAuth, requireAdmin, requireGuest } from './guards'

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
      meta: { requiresGuest: true },
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
      meta: { requiresAuth: true },
    },
    {
      path: '/admin',
      redirect: '/admin/dashboard'
    },
    {
      path: '/admin/dashboard',
      name: 'AdminDashboard',
      component: () => import('../views/AdminDashboardView.vue'),
      meta: { requiresAdmin: true },
    },
    {
      path: '/admin/tutors',
      name: 'AdminTutors',
      component: () => import('../views/AdminTutorsView.vue'),
      meta: { requiresAdmin: true },
    },
    {
      path: '/admin/students',
      name: 'AdminStudents',
      component: () => import('../views/AdminStudentsView.vue'),
      meta: { requiresAdmin: true },
    },
    {
      path: '/admin/courses',
      name: 'AdminCourses',
      component: () => import('../views/AdminCoursesView.vue'),
      meta: { requiresAdmin: true },
    },
  ],
})

router.beforeEach((to, from, next) => {
  if (to.meta.requiresAdmin) {
    return requireAdmin(to, from, next)
  }

  if (to.meta.requiresAuth) {
    return requireAuth(to, from, next)
  }

  if (to.meta.requiresGuest) {
    return requireGuest(to, from, next)
  }

  next()
})

export default router
