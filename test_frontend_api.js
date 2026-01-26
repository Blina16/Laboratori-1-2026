// Test API from frontend perspective
const testFromFrontend = async () => {
  try {
    console.log('🧪 Testing API from frontend perspective...');
    
    // Test without authentication first
    const response = await fetch('http://localhost:5000/api/users/teachers', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    });
    
    console.log('Response status:', response.status);
    console.log('Response headers:', response.headers);
    
    if (response.ok) {
      const data = await response.json();
      console.log('✅ API Response:', data);
    } else {
      const errorText = await response.text();
      console.log('❌ API Error:', errorText);
    }
  } catch (error) {
    console.error('❌ Network Error:', error.message);
  }
};

testFromFrontend();
