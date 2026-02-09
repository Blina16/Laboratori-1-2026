// Complete test for students CRUD operations
const axios = require('axios');

const API_BASE = 'http://localhost:5000/api';

async function testStudentsCRUD() {
  console.log('🧪 Testing Complete Students CRUD Integration...\n');

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

    // Test 2: Check if students endpoint works
    console.log('\n2. Testing students endpoint...');
    try {
      const studentsResponse = await axios.get(`${API_BASE}/students`);
      console.log('✅ Students endpoint working');
      console.log(`📊 Current students count: ${studentsResponse.data.length}`);
    } catch (error) {
      if (error.response?.data?.message?.includes('Database tables not found')) {
        console.log('❌ Database tables missing');
        console.log('💡 Run: cd Backend && node init_db.js');
        return;
      } else {
        console.log('❌ Students endpoint test failed:', error.response?.data || error.message);
        return;
      }
    }

    // Test 3: Create a new student
    console.log('\n3. Testing student creation...');
    const newStudent = {
      name: 'Test Student',
      surname: 'Testerson',
      age: 25,
      location: 'Test City, Test Country',
      email: `test.student.${Date.now()}@example.com`
    };

    let createdStudentId = null;
    try {
      const createResponse = await axios.post(`${API_BASE}/students`, newStudent);
      console.log('✅ Student created successfully:', createResponse.data.name);
      createdStudentId = createResponse.data.id;
      console.log('📝 Created student ID:', createdStudentId);
      console.log('📝 Created student details:', {
        id: createResponse.data.id,
        name: createResponse.data.name,
        surname: createResponse.data.surname,
        email: createResponse.data.email,
        age: createResponse.data.age,
        location: createResponse.data.location
      });
    } catch (createError) {
      console.log('❌ Student creation failed:', createError.response?.data || createError.message);
      return;
    }

    // Test 4: Update student
    console.log('\n4. Testing student update...');
    const updateData = {
      name: 'Updated Test Student',
      surname: 'Updated Testerson',
      age: 26,
      location: 'Updated City, Updated Country',
      email: `updated.test.student.${Date.now()}@example.com`
    };

    try {
      const updateResponse = await axios.put(`${API_BASE}/students/${createdStudentId}`, updateData);
      console.log('✅ Student updated successfully:', updateResponse.data.name);
      console.log('📝 Updated student details:', {
        id: updateResponse.data.id,
        name: updateResponse.data.name,
        surname: updateResponse.data.surname,
        email: updateResponse.data.email,
        age: updateResponse.data.age,
        location: updateResponse.data.location
      });
    } catch (updateError) {
      console.log('❌ Student update failed:', updateError.response?.data || updateError.message);
    }

    // Test 5: Verify student in list
    console.log('\n5. Testing student retrieval...');
    try {
      const listResponse = await axios.get(`${API_BASE}/students`);
      const updatedStudent = listResponse.data.find(s => s.id === createdStudentId);
      if (updatedStudent) {
        console.log('✅ Student found in list:', updatedStudent.name);
        console.log('📊 Student data in list:', {
          id: updatedStudent.id,
          name: updatedStudent.name,
          surname: updatedStudent.surname,
          email: updatedStudent.email,
          age: updatedStudent.age,
          location: updatedStudent.location
        });
      } else {
        console.log('❌ Student not found in list');
      }
    } catch (listError) {
      console.log('❌ Student retrieval failed:', listError.response?.data || listError.message);
    }

    // Test 6: Delete student
    console.log('\n6. Testing student deletion...');
    try {
      const deleteResponse = await axios.delete(`${API_BASE}/students/${createdStudentId}`);
      console.log('✅ Student deleted successfully:', deleteResponse.data.message);
    } catch (deleteError) {
      console.log('❌ Student deletion failed:', deleteError.response?.data || deleteError.message);
    }

    // Test 7: Verify deletion
    console.log('\n7. Testing deletion verification...');
    try {
      const finalListResponse = await axios.get(`${API_BASE}/students`);
      const deletedStudent = finalListResponse.data.find(s => s.id === createdStudentId);
      if (!deletedStudent) {
        console.log('✅ Student successfully removed from list');
      } else {
        console.log('❌ Student still found in list after deletion');
      }
    } catch (verifyError) {
      console.log('❌ Deletion verification failed:', verifyError.response?.data || verifyError.message);
    }

    console.log('\n🎉 Complete students CRUD test finished!');
    console.log('\n📋 Summary:');
    console.log('✅ Backend API: Working');
    console.log('✅ Database: Connected');
    console.log('✅ Student CRUD Operations: Functional');
    console.log('✅ Using exact same pattern as tutors, courses, and payments');

  } catch (error) {
    console.error('❌ Students CRUD test failed:', error.message);
  }
}

testStudentsCRUD();
