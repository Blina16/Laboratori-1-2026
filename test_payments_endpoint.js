// Quick test to check if payments endpoint is working
const axios = require('axios');

const API_BASE = 'http://localhost:5000/api';

async function testPaymentsEndpoint() {
  console.log('🔍 Testing Payments Endpoint...\n');

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

    // Test 2: Check if payments endpoint exists
    console.log('\n2. Testing payments endpoint...');
    try {
      const paymentsResponse = await axios.get(`${API_BASE}/payments`);
      console.log('✅ Payments endpoint working!');
      console.log('📊 Current payments count:', paymentsResponse.data.length);
    } catch (error) {
      if (error.response?.status === 404) {
        console.log('❌ Payments endpoint not found (404)');
        console.log('🔧 Checking server configuration...');
        
        // Test other endpoints to see if server is working
        try {
          const tutorsResponse = await axios.get(`${API_BASE}/tutors`);
          console.log('✅ Tutors endpoint works - server is running');
          console.log('💡 Issue: Payments route not properly loaded in server.js');
        } catch (tutorError) {
          console.log('❌ Tutors endpoint also fails - server may have issues');
        }
      } else {
        console.log('❌ Payments endpoint failed:', error.response?.data || error.message);
      }
    }

    // Test 3: Try to create a payment
    console.log('\n3. Testing payment creation...');
    const testPayment = {
      student_id: 1,
      tutor_id: 1,
      amount: 99.99,
      payment_date: new Date().toISOString().split('T')[0],
      payment_method: 'credit_card',
      status: 'pending'
    };

    try {
      const createResponse = await axios.post(`${API_BASE}/payments`, testPayment);
      console.log('✅ Payment creation works!', createResponse.data);
    } catch (createError) {
      if (createError.response?.status === 404) {
        console.log('❌ Payment creation endpoint not found (404)');
        console.log('🔧 Same issue - payments route not loaded');
      } else {
        console.log('❌ Payment creation failed:', createError.response?.data || createError.message);
      }
    }

  } catch (error) {
    console.error('❌ Test failed:', error.message);
  }
}

testPaymentsEndpoint();
