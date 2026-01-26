import axios from "axios"

const api = axios.create({
  baseURL: "http://localhost:5000/api"
})

api.interceptors.request.use(config => {
  console.log('🔍 API Request:', config.method?.toUpperCase(), config.url)
  console.log('📝 Request data:', config.data)
  console.log('🔑 Request headers:', config.headers)
  
  const token = localStorage.getItem("token")
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

api.interceptors.response.use(
  response => {
    console.log('✅ API Response:', response.status, response.config.url)
    return response
  },
  error => {
    console.log('❌ API Error:', error.response?.status, error.config?.url)
    console.log('❌ Error data:', error.response?.data)
    console.log('❌ Error message:', error.message)
    return Promise.reject(error)
  }
)

export default api
