// Complete test and fix for courses
const axios = require('axios');

const API_BASE = 'http://localhost:5000/api';

async function testAndFix() {
  console.log('🚀 Testing and Fixing Courses...\n');

  try {
    // Step 1: Test basic connectivity
    console.log('1. Testing API...');
    const testResponse = await axios.get(`${API_BASE}/test`);
    console.log('✅ API working:', testResponse.data.message);

    // Step 2: Try to create a course
    console.log('\n2. Testing course creation...');
    const courseData = {
      title: 'Fix Test Course ' + Date.now(),
      description: 'This course should work now',
      duration: '5 weeks',
      level: 'Beginner',
      price: 29.99,
      teacher_id: null
    };

    try {
      const createResponse = await axios.post(`${API_BASE}/courses`, courseData);
      console.log('🎉 SUCCESS! Course created:', createResponse.data.title);
      console.log('📝 Course ID:', createResponse.data.id);
      
      // Step 3: Verify it's in the list
      const listResponse = await axios.get(`${API_BASE}/courses`);
      const found = listResponse.data.find(c => c.id === createResponse.data.id);
      if (found) {
        console.log('✅ Course found in list!');
      }

      // Step 4: Clean up
      await axios.delete(`${API_BASE}/courses/${createResponse.data.id}`);
      console.log('🧹 Test course deleted');

    } catch (error) {
      console.log('❌ Course creation failed:', error.response?.data || error.message);
      
      if (error.response?.data?.message?.includes('table not found')) {
        console.log('\n🔧 RUNNING AUTO FIX...');
        console.log('Please run: node fix_courses_now.js');
        console.log('Then restart the server and try again.');
      }
    }

  } catch (error) {
    console.error('❌ Test failed:', error.message);
  }
}

testAndFix();
