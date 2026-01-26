const axios = require('axios');

const testTutorsAPI = async () => {
  try {
    console.log('🧪 Testing new Tutors API endpoints...');
    
    // Test GET all tutors
    console.log('\n1. Testing GET /api/tutors');
    const getResponse = await axios.get('http://localhost:5000/api/tutors');
    console.log('✅ GET Tutors:', getResponse.data);
    
    // Test GET single tutor
    if (getResponse.data.length > 0) {
      const tutorId = getResponse.data[0].id;
      console.log('\n2. Testing GET /api/tutors/:id');
      const singleResponse = await axios.get(`http://localhost:5000/api/tutors/${tutorId}`);
      console.log('✅ GET Single Tutor:', singleResponse.data);
    }
    
    // Test POST new tutor
    console.log('\n3. Testing POST /api/tutors');
    const tutorData = {
      name: 'John Doe',
      email: 'john.doe@example.com',
      password: 'password123',
      surname: 'Doe',
      experience: 5,
      subject: 'Mathematics',
      price: 50.00,
      bio: 'Experienced math tutor with 5+ years teaching experience'
    };
    
    const postResponse = await axios.post('http://localhost:5000/api/tutors', tutorData);
    console.log('✅ POST Tutor:', postResponse.data);
    
    // Test search tutors
    console.log('\n4. Testing GET /api/tutors/search?subject=Mathematics');
    const searchResponse = await axios.get('http://localhost:5000/api/tutors/search?subject=Mathematics');
    console.log('✅ Search Tutors:', searchResponse.data);
    
    console.log('\n🎉 All Tutors API endpoints working!');
    
  } catch (error) {
    console.error('❌ Tutors API Test failed:', error.response?.data || error.message);
  }
};

testTutorsAPI();
