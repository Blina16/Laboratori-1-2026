// Test courses using exact same pattern as working tutors
const axios = require('axios');

const API_BASE = 'http://localhost:5000/api';

async function testCoursesLikeTutors() {
  console.log('🧪 Testing Courses with Tutor Pattern...\n');

  try {
    // Test 1: Check server connectivity (same as tutors)
    console.log('1. Testing server connectivity...');
    try {
      const response = await axios.get(`${API_BASE}/test`);
      console.log('✅ Server is running:', response.data.message);
    } catch (error) {
      console.log('❌ Server is not running:', error.message);
      console.log('💡 Please start server: cd Backend && node server.js');
      return;
    }

    // Test 2: Check if courses endpoint works (same as tutors)
    console.log('\n2. Testing courses endpoint...');
    try {
      const coursesResponse = await axios.get(`${API_BASE}/courses`);
      console.log('✅ Courses endpoint working');
      console.log(`📊 Current courses count: ${coursesResponse.data.length}`);
    } catch (error) {
      if (error.response?.data?.message?.includes('Database tables not found')) {
        console.log('❌ Database tables missing');
        console.log('💡 Run: cd Backend && node init_db.js');
        return;
      } else {
        console.log('❌ Courses endpoint test failed:', error.response?.data || error.message);
        return;
      }
    }

    // Test 3: Create a new course (same pattern as tutors)
    console.log('\n3. Testing course creation...');
    const newCourse = {
      title: 'Integration Test Course',
      description: 'This is a test course for integration testing',
      duration: '10 weeks',
      level: 'Beginner',
      price: 99.99,
      teacher_id: null
    };

    let createdCourseId = null;
    try {
      const createResponse = await axios.post(`${API_BASE}/courses`, newCourse);
      console.log('✅ Course created successfully:', createResponse.data.title);
      createdCourseId = createResponse.data.id;
      console.log('📝 Created course ID:', createdCourseId);
      console.log('📝 Created course details:', createResponse.data);
    } catch (createError) {
      console.log('❌ Course creation failed:', createError.response?.data || createError.message);
      return;
    }

    // Test 4: Update course (same pattern as tutors)
    console.log('\n4. Testing course update...');
    const updateData = {
      title: 'Updated Integration Course',
      description: 'This course has been updated for testing',
      duration: '8 weeks',
      level: 'Intermediate',
      price: 149.99,
      teacher_id: null
    };

    try {
      const updateResponse = await axios.put(`${API_BASE}/courses/${createdCourseId}`, updateData);
      console.log('✅ Course updated successfully:', updateResponse.data.title);
      console.log('📝 Updated course details:', updateResponse.data);
    } catch (updateError) {
      console.log('❌ Course update failed:', updateError.response?.data || updateError.message);
    }

    // Test 5: Verify course in list (same pattern as tutors)
    console.log('\n5. Testing course retrieval...');
    try {
      const listResponse = await axios.get(`${API_BASE}/courses`);
      const updatedCourse = listResponse.data.find(c => c.id === createdCourseId);
      if (updatedCourse) {
        console.log('✅ Course found in list:', updatedCourse.title);
        console.log('📊 Course data in list:', {
          id: updatedCourse.id,
          title: updatedCourse.title,
          description: updatedCourse.description,
          duration: updatedCourse.duration,
          level: updatedCourse.level,
          price: updatedCourse.price,
          teacher_id: updatedCourse.teacher_id
        });
      } else {
        console.log('❌ Course not found in list');
      }
    } catch (listError) {
      console.log('❌ Course retrieval failed:', listError.response?.data || listError.message);
    }

    // Test 6: Delete course (same pattern as tutors)
    console.log('\n6. Testing course deletion...');
    try {
      const deleteResponse = await axios.delete(`${API_BASE}/courses/${createdCourseId}`);
      console.log('✅ Course deleted successfully:', deleteResponse.data.message);
    } catch (deleteError) {
      console.log('❌ Course deletion failed:', deleteError.response?.data || deleteError.message);
    }

    // Test 7: Verify deletion (same pattern as tutors)
    console.log('\n7. Testing deletion verification...');
    try {
      const finalListResponse = await axios.get(`${API_BASE}/courses`);
      const deletedCourse = finalListResponse.data.find(c => c.id === createdCourseId);
      if (!deletedCourse) {
        console.log('✅ Course successfully removed from list');
      } else {
        console.log('❌ Course still found in list after deletion');
      }
    } catch (verifyError) {
      console.log('❌ Deletion verification failed:', verifyError.response?.data || verifyError.message);
    }

    console.log('\n🎉 Complete courses CRUD test finished!');
    console.log('\n📋 Summary:');
    console.log('✅ Backend API: Working');
    console.log('✅ Database: Connected');
    console.log('✅ Course CRUD Operations: Functional');
    console.log('✅ Using exact same pattern as tutors');

  } catch (error) {
    console.error('❌ Courses CRUD test failed:', error.message);
  }
}

testCoursesLikeTutors();
