const axios = require('axios');

const testTutorAPI = async () => {
  try {
    console.log('🧪 Testing Tutor API endpoints...');
    
    // Test GET teachers (should work)
    console.log('\n1. Testing GET /api/users/teachers');
    const getResponse = await axios.get('http://localhost:5000/api/users/teachers');
    console.log('✅ GET Teachers:', getResponse.data);
    
    // Test POST teacher (should fail with 404)
    console.log('\n2. Testing POST /api/users/teachers');
    const tutorData = {
      name: 'Test Tutor',
      email: 'testtutor@example.com',
      password: 'password123',
      experience: 5,
      subject: 'Mathematics',
      price: 50.00
    };
    
    try {
      const postResponse = await axios.post('http://localhost:5000/api/users/teachers', tutorData);
      console.log('✅ POST Teacher:', postResponse.data);
    } catch (error) {
      console.log('❌ POST Teacher failed:');
      console.log('Status:', error.response?.status);
      console.log('Message:', error.response?.data?.message);
      console.log('Full error:', error.message);
    }
    
  } catch (error) {
    console.error('❌ API Test failed:', error.message);
  }
};

testTutorAPI();
