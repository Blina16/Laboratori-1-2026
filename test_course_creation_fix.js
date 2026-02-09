// Quick test for course creation fix
const axios = require('axios');

const API_BASE = 'http://localhost:5000/api';

async function testCourseCreation() {
  console.log('🧪 Testing Course Creation Fix...\n');

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

    // Test 2: Create a simple course
    console.log('\n2. Testing course creation...');
    const testCourse = {
      title: 'Test Course ' + Date.now(),
      description: 'This is a test course',
      duration: '5 weeks',
      level: 'Beginner',
      price: 49.99,
      teacher_id: null
    };

    try {
      const createResponse = await axios.post(`${API_BASE}/courses`, testCourse);
      console.log('✅ Course created successfully!');
      console.log('📝 Course details:', createResponse.data);
      console.log('🎉 Course creation is working!');
      
      // Clean up - delete the test course
      await axios.delete(`${API_BASE}/courses/${createResponse.data.id}`);
      console.log('🧹 Test course cleaned up');
      
    } catch (createError) {
      console.log('❌ Course creation failed:', createError.response?.data || createError.message);
      
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

testCourseCreation();
