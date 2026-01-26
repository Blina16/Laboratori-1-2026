const axios = require('axios');

// Test with exact frontend configuration
const api = axios.create({
  baseURL: "http://localhost:5000/api"
});

api.interceptors.request.use(config => {
  const token = localStorage.getItem("token")
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
});

const testFrontendAPI = async () => {
  try {
    console.log('🧪 Testing frontend API configuration...');
    
    // Test GET teachers (with potential token)
    console.log('\n1. Testing GET /api/users/teachers');
    try {
      const getResponse = await api.get('/users/teachers');
      console.log('✅ GET Teachers:', getResponse.data);
    } catch (error) {
      console.log('❌ GET Teachers failed:');
      console.log('Status:', error.response?.status);
      console.log('Message:', error.response?.data?.message);
      console.log('Headers:', error.response?.config?.headers);
    }
    
    // Test POST teacher (without token)
    console.log('\n2. Testing POST /api/users/teachers');
    const tutorData = {
      name: 'Frontend Test Tutor',
      email: 'frontendtest@example.com',
      password: 'password123',
      experience: 3,
      subject: 'Physics',
      price: 45.00
    };
    
    try {
      const postResponse = await api.post('/users/teachers', tutorData);
      console.log('✅ POST Teacher:', postResponse.data);
    } catch (error) {
      console.log('❌ POST Teacher failed:');
      console.log('Status:', error.response?.status);
      console.log('Message:', error.response?.data?.message);
      console.log('Headers:', error.response?.config?.headers);
    }
    
  } catch (error) {
    console.error('❌ API Test failed:', error.message);
  }
};

testFrontendAPI();
