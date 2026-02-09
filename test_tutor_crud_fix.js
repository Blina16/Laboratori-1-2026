// Test script to verify tutor CRUD fixes
const axios = require('axios');

const API_BASE = 'http://localhost:5000/api';

async function testTutorCRUD() {
  console.log('🧪 Testing Tutor CRUD Operations...\n');

  try {
    // Test 1: Fetch all tutors
    console.log('1. Testing GET /tutors');
    try {
      const response = await axios.get(`${API_BASE}/tutors`);
      console.log('✅ GET /tutors - Success:', response.data.length, 'tutors found');
    } catch (error) {
      console.log('❌ GET /tutors - Failed:', error.message);
    }

    // Test 2: Create a new tutor
    console.log('\n2. Testing POST /tutors');
    const newTutor = {
      name: 'Test',
      surname: 'Tutor',
      email: 'test.tutor@example.com',
      password: 'password123',
      subject: 'Mathematics',
      experience: 5,
      price: 50
    };

    try {
      const createResponse = await axios.post(`${API_BASE}/tutors`, newTutor);
      console.log('✅ POST /tutors - Success:', createResponse.data);
      const tutorId = createResponse.data.tutor.id;

      // Test 3: Update the tutor
      console.log('\n3. Testing PUT /tutors/:id');
      const updateData = {
        name: 'Updated',
        surname: 'Tutor',
        email: 'updated.tutor@example.com',
        subject: 'Physics',
        experience: 6,
        price: 60
      };

      try {
        const updateResponse = await axios.put(`${API_BASE}/tutors/${tutorId}`, updateData);
        console.log('✅ PUT /tutors/:id - Success:', updateResponse.data);
      } catch (updateError) {
        console.log('❌ PUT /tutors/:id - Failed:', updateError.response?.data || updateError.message);
      }

      // Test 4: Delete the tutor
      console.log('\n4. Testing DELETE /tutors/:id');
      try {
        const deleteResponse = await axios.delete(`${API_BASE}/tutors/${tutorId}`);
        console.log('✅ DELETE /tutors/:id - Success:', deleteResponse.data);
      } catch (deleteError) {
        console.log('❌ DELETE /tutors/:id - Failed:', deleteError.response?.data || deleteError.message);
      }

    } catch (createError) {
      console.log('❌ POST /tutors - Failed:', createError.response?.data || createError.message);
    }

  } catch (error) {
    console.error('❌ Test failed - Backend server may not be running:', error.message);
    console.log('\n💡 Make sure the backend server is running on port 5000');
    console.log('   Run: cd Backend && node server.js');
  }
}

testTutorCRUD();
