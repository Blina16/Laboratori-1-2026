// Test script to verify tutor creation fix
const axios = require('axios');

const API_BASE = 'http://localhost:5000/api';

async function testTutorCreation() {
  console.log('🧪 Testing Tutor Creation Fix...\n');

  try {
    // Test 1: Check if server is running
    console.log('1. Testing server connectivity...');
    try {
      const response = await axios.get(`${API_BASE}/test`);
      console.log('✅ Server is running:', response.data.message);
    } catch (error) {
      console.log('❌ Server is not running:', error.message);
      console.log('💡 Please start the server: cd Backend && node server.js');
      return;
    }

    // Test 2: Create a new tutor
    console.log('\n2. Testing tutor creation...');
    const newTutor = {
      name: 'Test',
      surname: 'Tutor',
      email: `test.tutor.${Date.now()}@example.com`, // Unique email
      password: 'password123',
      subject: 'Mathematics',
      experience: 5,
      price: 50
    };

    try {
      const createResponse = await axios.post(`${API_BASE}/tutors`, newTutor);
      console.log('✅ Tutor created successfully:', createResponse.data.message);
      console.log('📝 Tutor details:', createResponse.data.tutor);
      
      // Test 3: Verify tutor appears in list
      console.log('\n3. Testing tutor retrieval...');
      const listResponse = await axios.get(`${API_BASE}/tutors`);
      const createdTutor = listResponse.data.find(t => t.email === newTutor.email);
      if (createdTutor) {
        console.log('✅ Tutor found in list:', createdTutor.name);
      } else {
        console.log('❌ Tutor not found in list');
      }

      // Test 4: Clean up - delete the test tutor
      console.log('\n4. Testing tutor deletion...');
      if (createdTutor) {
        const deleteResponse = await axios.delete(`${API_BASE}/tutors/${createdTutor.id}`);
        console.log('✅ Tutor deleted successfully:', deleteResponse.data.message);
      }

    } catch (createError) {
      console.log('❌ Tutor creation failed:', createError.response?.data || createError.message);
      
      if (createError.response?.data?.message?.includes('Database tables not found')) {
        console.log('\n💡 To fix this issue:');
        console.log('   1. Run: cd Backend');
        console.log('   2. Run: node init_db.js');
        console.log('   3. Restart the server');
      }
    }

  } catch (error) {
    console.error('❌ Test failed:', error.message);
  }
}

testTutorCreation();
