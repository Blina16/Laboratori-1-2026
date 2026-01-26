const http = require('http');

const testDirectAPI = () => {
  console.log('🧪 Testing direct API connection...');
  
  const options = {
    hostname: 'localhost',
    port: 5000,
    path: '/api/tutors',
    method: 'GET',
    headers: {
      'Content-Type': 'application/json'
    }
  };

  const req = http.request(options, (res) => {
    let data = '';
    
    res.on('data', (chunk) => {
      data += chunk;
    });
    
    res.on('end', () => {
      console.log('Response status:', res.statusCode);
      console.log('Response headers:', res.headers);
      
      if (res.statusCode === 200) {
        console.log('✅ API Response:', data);
      } else {
        console.log('❌ API Error:', data);
      }
    });
  });

  req.on('error', (err) => {
    console.error('❌ Request error:', err.message);
  });

  req.end();
};

testDirectAPI();
