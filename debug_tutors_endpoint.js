// Simple test to debug the tutors endpoint
const http = require('http');

function makeRequest(path, method = 'GET', data = null) {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: 'localhost',
      port: 5000,
      path: path,
      method: method,
      headers: {
        'Content-Type': 'application/json',
      }
    };

    const req = http.request(options, (res) => {
      let responseData = '';
      res.on('data', (chunk) => {
        responseData += chunk;
      });
      
      res.on('end', () => {
        try {
          const parsed = JSON.parse(responseData);
          resolve({ status: res.statusCode, data: parsed });
        } catch (err) {
          resolve({ status: res.statusCode, data: responseData });
        }
      });
    });

    req.on('error', (err) => {
      reject(err);
    });

    if (data) {
      req.write(JSON.stringify(data));
    }
    req.end();
  });
}

async function debugTutorsEndpoint() {
  try {
    console.log('🔍 Debugging tutors endpoint...\n');

    // Test basic connection first
    console.log('1. Testing basic connection:');
    const basicResponse = await makeRequest('/api/message');
    console.log(`   Status: ${basicResponse.status}`);
    console.log(`   Data: ${basicResponse.data}`);

    // Test tutors endpoint
    console.log('\n2. Testing tutors endpoint:');
    const tutorsResponse = await makeRequest('/api/tutors');
    console.log(`   Status: ${tutorsResponse.status}`);
    console.log(`   Data: ${JSON.stringify(tutorsResponse.data, null, 2)}`);

    // Test a simple query to see if teachers exist
    console.log('\n3. Testing simple users query:');
    const usersResponse = await makeRequest('/api/test');
    console.log(`   Status: ${usersResponse.status}`);
    console.log(`   Data: ${JSON.stringify(usersResponse.data, null, 2)}`);

  } catch (error) {
    console.error('❌ Debug failed:', error.message);
  }
}

debugTutorsEndpoint();
