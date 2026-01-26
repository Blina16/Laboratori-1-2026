const axios = require('axios');

const testAdminRegistration = async () => {
  try {
    console.log('🧪 Testing admin registration...');
    
    const testData = {
      name: 'Test Admin',
      email: 'testadmin@example.com',
      password: '12345678',
      adminKey: 'admin123'
    };
    
    console.log('📤 Sending data:', testData);
    
    const response = await axios.post('http://localhost:5000/api/auth/register-admin', testData);
    
    console.log('✅ Success! Response:', response.data);
    console.log('📋 Status:', response.status);
    
  } catch (error) {
    console.log('❌ Error occurred:');
    console.log('Status:', error.response?.status);
    console.log('Message:', error.response?.data?.message);
    console.log('Full error:', error.message);
    
    if (error.response?.status === 403) {
      console.log('🔑 Admin key issue - check your admin key');
    }
    
    if (error.response?.status === 400) {
      console.log('📝 Form validation issue - check required fields');
    }
  }
};

testAdminRegistration();
