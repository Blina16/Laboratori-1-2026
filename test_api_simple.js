// Simple API test without node-fetch
const http = require('http');

function testAPI() {
  console.log('🔍 Testing API connection...');
  
  const options = {
    hostname: 'localhost',
    port: 5000,
    path: '/api/message',
    method: 'GET'
  };

  const req = http.request(options, (res) => {
    console.log(`✅ Status: ${res.statusCode}`);
    
    let data = '';
    res.on('data', (chunk) => {
      data += chunk;
    });
    
    res.on('end', () => {
      console.log('✅ Response:', data);
      
      // Now test tutors endpoint
      testTutorsEndpoint();
    });
  });

  req.on('error', (err) => {
    console.error('❌ API Error:', err.message);
  });

  req.end();
}

function testTutorsEndpoint() {
  console.log('\n🔍 Testing tutors endpoint...');
  
  const options = {
    hostname: 'localhost',
    port: 5000,
    path: '/api/tutors',
    method: 'GET'
  };

  const req = http.request(options, (res) => {
    console.log(`✅ Tutors Status: ${res.statusCode}`);
    
    let data = '';
    res.on('data', (chunk) => {
      data += chunk;
    });
    
    res.on('end', () => {
      try {
        const tutors = JSON.parse(data);
        console.log(`✅ Found ${tutors.length} tutors`);
        if (tutors.length > 0) {
          console.log('   First tutor:', tutors[0].name);
        }
      } catch (err) {
        console.error('❌ Failed to parse response:', err.message);
        console.log('Raw response:', data);
      }
    });
  });

  req.on('error', (err) => {
    console.error('❌ Tutors API Error:', err.message);
  });

  req.end();
}

testAPI();
