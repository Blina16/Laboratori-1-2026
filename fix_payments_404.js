// Fix for 404 error on payments endpoint
const axios = require('axios');

const API_BASE = 'http://localhost:5000/api';

async function fixPayments404() {
  console.log('🔧 Fixing Payments 404 Error...\n');

  try {
    // Step 1: Check if server is running
    console.log('1. Checking server status...');
    try {
      const response = await axios.get(`${API_BASE}/test`);
      console.log('✅ Server is running:', response.data.message);
    } catch (error) {
      console.log('❌ Server is not running');
      console.log('💡 SOLUTION: Start the server first');
      console.log('   cd Backend && node server.js');
      return;
    }

    // Step 2: Check if payments table exists
    console.log('\n2. Checking payments table...');
    try {
      const paymentsResponse = await axios.get(`${API_BASE}/payments`);
      console.log('✅ Payments endpoint working!');
      console.log('📊 Current payments:', paymentsResponse.data.length);
      console.log('\n🎉 ISSUE RESOLVED!');
      console.log('The payments endpoint is working correctly.');
    } catch (error) {
      if (error.response?.status === 404) {
        console.log('❌ Payments endpoint returning 404');
        console.log('\n🔧 SOLUTIONS:');
        console.log('1. Restart the server to load new routes:');
        console.log('   - Stop the current server (Ctrl+C)');
        console.log('   - Run: cd Backend && node server.js');
        console.log('\n2. Initialize database (if not done):');
        console.log('   - Run: cd Backend && node init_db.js');
        console.log('\n3. Check server logs for route loading errors');
      } else if (error.response?.data?.message?.includes('table not found')) {
        console.log('❌ Payments table missing');
        console.log('\n🔧 SOLUTION: Initialize database');
        console.log('   cd Backend && node init_db.js');
      } else {
        console.log('❌ Other error:', error.response?.data || error.message);
      }
    }

  } catch (error) {
    console.error('❌ Fix failed:', error.message);
  }
}

fixPayments404();
