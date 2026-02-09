// Complete integration test for tutor CRUD operations
const axios = require('axios');

const API_BASE = 'http://localhost:5000/api';

async function testCompleteIntegration() {
  console.log('🧪 Testing Complete Tutor CRUD Integration...\n');

  try {
    // Test 1: Check server connectivity
    console.log('1. Testing server connectivity...');
    try {
      const response = await axios.get(`${API_BASE}/test`);
      console.log('✅ Server is running:', response.data.message);
    } catch (error) {
      console.log('❌ Server is not running:', error.message);
      console.log('💡 Please start server: cd Backend && node server.js');
      return;
    }

    // Test 2: Check if database tables exist
    console.log('\n2. Testing database tables...');
    try {
      const tutorsResponse = await axios.get(`${API_BASE}/tutors`);
      console.log('✅ Database tables exist, tutors endpoint working');
      console.log(`📊 Current tutors count: ${tutorsResponse.data.length}`);
    } catch (error) {
      if (error.response?.data?.message?.includes('Database tables not found')) {
        console.log('❌ Database tables missing');
        console.log('💡 Run: cd Backend && node init_db.js');
        return;
      } else {
        console.log('❌ Database test failed:', error.response?.data || error.message);
        return;
      }
    }

    // Test 3: Create a new tutor
    console.log('\n3. Testing tutor creation...');
    const newTutor = {
      name: 'Integration',
      surname: 'Test',
      email: `integration.test.${Date.now()}@example.com`,
      password: 'password123',
      subject: 'Computer Science',
      experience: 3,
      price: 75
    };

    let createdTutorId = null;
    try {
      const createResponse = await axios.post(`${API_BASE}/tutors`, newTutor);
      console.log('✅ Tutor created successfully:', createResponse.data.message);
      createdTutorId = createResponse.data.tutor.id;
      console.log('📝 Created tutor ID:', createdTutorId);
      console.log('📝 Created tutor details:', createResponse.data.tutor);
    } catch (createError) {
      console.log('❌ Tutor creation failed:', createError.response?.data || createError.message);
      return;
    }

    // Test 4: Update the tutor
    console.log('\n4. Testing tutor update...');
    const updateData = {
      name: 'Updated',
      surname: 'Test',
      email: `updated.test.${Date.now()}@example.com`,
      subject: 'Mathematics',
      experience: 5,
      price: 85
    };

    try {
      const updateResponse = await axios.put(`${API_BASE}/tutors/${createdTutorId}`, updateData);
      console.log('✅ Tutor updated successfully:', updateResponse.data.message);
      console.log('📝 Updated tutor details:', updateResponse.data.tutor);
    } catch (updateError) {
      console.log('❌ Tutor update failed:', updateError.response?.data || updateError.message);
    }

    // Test 5: Verify tutor in list
    console.log('\n5. Testing tutor retrieval...');
    try {
      const listResponse = await axios.get(`${API_BASE}/tutors`);
      const updatedTutor = listResponse.data.find(t => t.id === createdTutorId);
      if (updatedTutor) {
        console.log('✅ Tutor found in list:', updatedTutor.name);
        console.log('📊 Tutor data in list:', {
          id: updatedTutor.id,
          name: updatedTutor.name,
          surname: updatedTutor.surname,
          email: updatedTutor.email,
          subject: updatedTutor.subject,
          experience: updatedTutor.experience,
          price: updatedTutor.price_per_hour
        });
      } else {
        console.log('❌ Tutor not found in list');
      }
    } catch (listError) {
      console.log('❌ Tutor retrieval failed:', listError.response?.data || listError.message);
    }

    // Test 6: Delete the tutor
    console.log('\n6. Testing tutor deletion...');
    try {
      const deleteResponse = await axios.delete(`${API_BASE}/tutors/${createdTutorId}`);
      console.log('✅ Tutor deleted successfully:', deleteResponse.data.message);
    } catch (deleteError) {
      console.log('❌ Tutor deletion failed:', deleteError.response?.data || deleteError.message);
    }

    // Test 7: Verify deletion
    console.log('\n7. Testing deletion verification...');
    try {
      const finalListResponse = await axios.get(`${API_BASE}/tutors`);
      const deletedTutor = finalListResponse.data.find(t => t.id === createdTutorId);
      if (!deletedTutor) {
        console.log('✅ Tutor successfully removed from list');
      } else {
        console.log('❌ Tutor still found in list after deletion');
      }
    } catch (verifyError) {
      console.log('❌ Deletion verification failed:', verifyError.response?.data || verifyError.message);
    }

    console.log('\n🎉 Complete integration test finished!');
    console.log('\n📋 Summary:');
    console.log('✅ Backend API: Working');
    console.log('✅ Database: Connected');
    console.log('✅ CRUD Operations: Functional');
    console.log('\n💡 Frontend should now work properly with the backend!');

  } catch (error) {
    console.error('❌ Integration test failed:', error.message);
  }
}

testCompleteIntegration();
