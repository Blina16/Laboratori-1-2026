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
      path: '/tutoring',
      name: 'Tutoring',
      component: () => import('../views/TutoringPage.vue'),
      meta: { requiresAuth: true },
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
      meta: { requiresGuest: true },
    },
    {
      path: '/admin-signup',
      name: 'AdminSignUp',
      component: () => import('../views/AdminSignUpView.vue'),
      meta: { requiresGuest: true },
    },
    {
      path: '/dashboard',
      redirect: '/student/dashboard'
    },
        {
      path: '/teacher/availability',
      name: 'TeacherAvailability',
      component: () => import('../views/TeacherAvailabilityView.vue'),
      meta: { requiresAuth: true },
    },
    {
      path: '/student/dashboard',
      name: 'StudentDashboard',
      component: () => import('../views/StudentDashboardView.vue'),
      meta: { requiresAuth: true },
    },
    {
      path: '/student/dashboard-test',
      name: 'StudentDashboardTest',
      component: () => import('../views/StudentDashboardTestView.vue'),
      meta: { requiresAuth: true },
    },
    {
      path: '/student/calendar',
      name: 'StudentCalendar',
      component: () => import('../views/StudentCalendarView.vue'),
      meta: { requiresAuth: true },
    },
    {
      path: '/student/tutors',
      name: 'StudentTutors',
      component: () => import('../views/StudentTutorsView.vue'),
      meta: { requiresAuth: true },
    },
    {
      path: '/student/courses',
      name: 'StudentCourses',
      component: () => import('../views/StudentCoursesView.vue'),
      meta: { requiresAuth: true },
    },
    {
      path: '/admin',
      redirect: '/admin/tutors'
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
    {
      path: '/admin/payments',
      name: 'AdminPayments',
      component: () => import('../views/AdminPaymentsView.vue'),
      meta: { requiresAdmin: true },
    },
    {
      path: '/admin/grades',
      name: 'AdminGrades',
      component: () => import('../views/AdminGradesView.vue'),
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
