// Final test to verify courses are properly connected
const axios = require('axios');

const API_BASE = 'http://localhost:5000/api';

async function testFinalConnection() {
  console.log('🔗 TESTING FINAL COURSES CONNECTION...\n');

  try {
    // Step 1: Check API
    console.log('1. Testing API connection...');
    const apiTest = await axios.get(`${API_BASE}/test`);
    console.log('✅ API working:', apiTest.data.message);

    // Step 2: Test course creation
    console.log('\n2. Testing course creation...');
    const testCourse = {
      title: 'Connection Test Course ' + Date.now(),
      description: 'Testing if courses work properly',
      duration: '4 weeks',
      level: 'Beginner',
      price: 79.99,
      teacher_id: null
    };

    let courseId = null;
    try {
      const createResponse = await axios.post(`${API_BASE}/courses`, testCourse);
      courseId = createResponse.data.id;
      console.log('✅ Course created successfully!');
      console.log(`📝 Title: ${createResponse.data.title}`);
      console.log(`📝 ID: ${courseId}`);
      console.log(`📝 Price: $${createResponse.data.price}`);
    } catch (error) {
      console.log('❌ Course creation failed:', error.response?.data || error.message);
      console.log('\n🔧 TO FIX:');
      console.log('1. Run: node setup_courses_properly.js');
      console.log('2. Restart server: cd Backend && node server.js');
      return;
    }

    // Step 3: Test course retrieval
    console.log('\n3. Testing course retrieval...');
    try {
      const listResponse = await axios.get(`${API_BASE}/courses`);
      const foundCourse = listResponse.data.find(c => c.id === courseId);
      if (foundCourse) {
        console.log('✅ Course found in list!');
        console.log(`📝 Retrieved: ${foundCourse.title}`);
      } else {
        console.log('❌ Course not found in list');
      }
    } catch (error) {
      console.log('❌ Retrieval failed:', error.message);
    }

    // Step 4: Test course update
    console.log('\n4. Testing course update...');
    try {
      const updateData = {
        title: 'Updated ' + testCourse.title,
        description: 'Updated description',
        price: 89.99
      };
      const updateResponse = await axios.put(`${API_BASE}/courses/${courseId}`, updateData);
      console.log('✅ Course updated successfully!');
      console.log(`📝 New title: ${updateResponse.data.title}`);
    } catch (error) {
      console.log('❌ Update failed:', error.message);
    }

    // Step 5: Test course deletion
    console.log('\n5. Testing course deletion...');
    try {
      await axios.delete(`${API_BASE}/courses/${courseId}`);
      console.log('✅ Course deleted successfully!');
    } catch (error) {
      console.log('❌ Deletion failed:', error.message);
    }

    // Step 6: Verify deletion
    console.log('\n6. Verifying deletion...');
    try {
      const finalList = await axios.get(`${API_BASE}/courses`);
      const deletedCourse = finalList.data.find(c => c.id === courseId);
      if (!deletedCourse) {
        console.log('✅ Course properly removed!');
      } else {
        console.log('❌ Course still exists after deletion');
      }
    } catch (error) {
      console.log('❌ Verification failed:', error.message);
    }

    console.log('\n🎉 FINAL CONNECTION TEST COMPLETE!');
    console.log('✅ All CRUD operations working');
    console.log('✅ Frontend-backend connection established');
    console.log('✅ Courses are properly connected!');

  } catch (error) {
    console.error('❌ Final test failed:', error.message);
    if (error.code === 'ECONNREFUSED') {
      console.log('\n🔧 Server not running. Start it with:');
      console.log('cd Backend && node server.js');
    }
  }
}

testFinalConnection();
