// Logout utility function
export const logout = () => {
  localStorage.removeItem('token')
  localStorage.removeItem('user')
  window.location.href = '/login'
}

// Check if user is authenticated
export const isAuthenticated = () => {
  return !!localStorage.getItem('token')
}

// Get current user
export const getCurrentUser = () => {
  const user = localStorage.getItem('user')
  return user ? JSON.parse(user) : null
}
