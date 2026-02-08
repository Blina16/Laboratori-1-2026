// Test tutors CRUD operations
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

async function testTutorsCRUD() {
  try {
    console.log('🔍 Testing Tutors CRUD Operations...\n');

    // 1. Get all tutors
    console.log('1. Getting all tutors:');
    const getResponse = await makeRequest('/api/tutors');
    console.log(`   Status: ${getResponse.status}`);
    if (getResponse.status === 200) {
      console.log(`   ✅ Found ${getResponse.data.length} tutors`);
      if (getResponse.data.length > 0) {
        console.log('   First tutor:', {
          id: getResponse.data[0].id,
          name: getResponse.data[0].name,
          email: getResponse.data[0].email,
          subject: getResponse.data[0].subject
        });
      }
    } else {
      console.log('   ❌ Error:', getResponse.data);
    }

    // 2. Add a new tutor
    console.log('\n2. Adding a new tutor:');
    const newTutor = {
      name: 'Test',
      surname: 'Tutor',
      email: `test${Date.now()}@example.com`,
      password: 'password123',
      subject: 'Mathematics',
      experience: 5,
      price: 75.50
    };
    
    const addResponse = await makeRequest('/api/tutors', 'POST', newTutor);
    console.log(`   Status: ${addResponse.status}`);
    if (addResponse.status === 201) {
      console.log('   ✅ Tutor added successfully');
      console.log('   New tutor:', {
        id: addResponse.data.tutor.id,
        name: addResponse.data.tutor.name,
        email: addResponse.data.tutor.email
      });
    } else {
      console.log('   ❌ Error:', addResponse.data);
    }

    // 3. Get tutors again to verify
    console.log('\n3. Verifying tutor was added:');
    const verifyResponse = await makeRequest('/api/tutors');
    console.log(`   Status: ${verifyResponse.status}`);
    if (verifyResponse.status === 200) {
      console.log(`   ✅ Now found ${verifyResponse.data.length} tutors`);
    }

  } catch (error) {
    console.error('❌ Test failed:', error.message);
  }
}

testTutorsCRUD();
