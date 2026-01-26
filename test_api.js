const axios = require('axios');

const testAPI = async () => {
  try {
    console.log('🧪 Testing basic API...');
    
    // Test root endpoint
    const rootResponse = await axios.get('http://localhost:5000/');
    console.log('✅ Root endpoint:', rootResponse.data);
    
    // Test auth endpoint
    try {
      const authResponse = await axios.get('http://localhost:5000/api/auth');
      console.log('✅ Auth endpoint:', authResponse.data);
    } catch (error) {
      console.log('❌ Auth endpoint failed:', error.response?.status);
    }
    
    // Test users endpoint
    try {
      const usersResponse = await axios.get('http://localhost:5000/api/users/stats');
      console.log('✅ Users stats:', usersResponse.data);
    } catch (error) {
      console.log('❌ Users stats failed:', error.response?.status);
    }
    
    // Test teachers endpoint
    try {
      const teachersResponse = await axios.get('http://localhost:5000/api/users/teachers');
      console.log('✅ Teachers endpoint:', teachersResponse.data);
    } catch (error) {
      console.log('❌ Teachers endpoint failed:', error.response?.status);
      console.log('Error details:', error.response?.data);
    }
    
  } catch (error) {
    console.error('❌ API Test failed:', error.message);
  }
};

testAPI();
