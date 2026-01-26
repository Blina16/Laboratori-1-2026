// Must be logged in (student OR admin)
export const requireAuth = (to, from, next) => {
  const token = localStorage.getItem("token")

  // LINE 6–8: Not logged in → login
  if (!token) {
    return next("/login")
  }

  next()
}

// Must be admin
export const requireAdmin = (to, from, next) => {
  const token = localStorage.getItem("token")
  const user = JSON.parse(localStorage.getItem("user"))

  // LINE 20–22: Not logged in → login
  if (!token) {
    return next("/login")
  }

  // LINE 25–27: Logged in but NOT admin → redirect by role
  if (user?.role !== "admin") {
    if (user?.role === "teacher") {
      return next("/teacher/availability")
    }
    return next("/student/dashboard")
  }

  next()
}

// ONLY for guests (login & signup)
export const requireGuest = (to, from, next) => {
  const token = localStorage.getItem("token")
  const user = JSON.parse(localStorage.getItem("user"))

  // LINE 38–47: Redirect logged-in users by role
  if (token && user) {
    if (user.role === "admin") {
      return next("/admin/dashboard")
    } else if (user.role === "teacher") {
      return next("/teacher/availability")
    }
    return next("/student/dashboard")
  }

  // LINE 50: Not logged in → allow access
  next()
}
