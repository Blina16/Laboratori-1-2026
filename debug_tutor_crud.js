// Debug script to check tutor CRUD issues
const fetch = require('node-fetch');

async function debugTutorCRUD() {
  console.log('🔍 Debugging Tutor CRUD Issues...\n');
  
  const API_BASE = 'http://localhost:5000/api';
  
  try {
    // Step 1: Check if backend is running
    console.log('1️⃣ Testing backend connectivity...');
    try {
      const response = await fetch(`${API_BASE}/message`);
      if (response.ok) {
        console.log('✅ Backend is running');
      } else {
        console.log('❌ Backend responded with error:', response.status);
        return;
      }
    } catch (error) {
      console.log('❌ Cannot connect to backend. Make sure it\'s running on port 5000');
      return;
    }

    // Step 2: Check current tutors in database
    console.log('\n2️⃣ Checking current tutors...');
    try {
      const tutorsResponse = await fetch(`${API_BASE}/tutors`);
      if (tutorsResponse.ok) {
        const tutors = await tutorsResponse.json();
        console.log(`✅ Found ${tutors.length} tutors in database:`);
        tutors.forEach((tutor, index) => {
          console.log(`   ${index + 1}. ID: ${tutor.id}, Name: ${tutor.name}, Email: ${tutor.email}, Subject: ${tutor.subject}`);
        });
      } else {
        console.log('❌ Failed to get tutors:', tutorsResponse.status);
        const error = await tutorsResponse.json();
        console.log('Error:', error);
      }
    } catch (error) {
      console.log('❌ Error fetching tutors:', error.message);
    }

    // Step 3: Create a test tutor
    console.log('\n3️⃣ Creating a test tutor...');
    const testTutor = {
      name: 'Test',
      surname: 'Tutor',
      email: `test${Date.now()}@example.com`,
      password: 'password123',
      subject: 'Test Subject',
      experience: 3,
      price: 35.00,
      bio: 'This is a test tutor for debugging purposes.'
    };

    try {
      const createResponse = await fetch(`${API_BASE}/tutors`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(testTutor)
      });

      if (createResponse.ok) {
        const result = await createResponse.json();
        console.log('✅ Test tutor created successfully!');
        console.log(`   - ID: ${result.tutor.id}`);
        console.log(`   - Name: ${result.tutor.name}`);
        console.log(`   - Email: ${result.tutor.email}`);
        
        const newTutorId = result.tutor.id;

        // Step 4: Immediately check if tutor appears in list
        console.log('\n4️⃣ Checking if new tutor appears in list...');
        const checkResponse = await fetch(`${API_BASE}/tutors`);
        if (checkResponse.ok) {
          const updatedTutors = await checkResponse.json();
          const newTutor = updatedTutors.find(t => t.id === newTutorId);
          
          if (newTutor) {
            console.log('✅ New tutor found in list!');
            console.log(`   - Name: ${newTutor.name}`);
            console.log(`   - Subject: ${newTutor.subject}`);
            console.log(`   - Price: $${newTutor.price_per_hour}/hr`);
          } else {
            console.log('❌ New tutor NOT found in list after creation');
            console.log('   This indicates a database or API issue');
          }
        }

        // Step 5: Test getting specific tutor
        console.log('\n5️⃣ Testing get specific tutor...');
        const getSpecificResponse = await fetch(`${API_BASE}/tutors/${newTutorId}`);
        if (getSpecificResponse.ok) {
          const specificTutor = await getSpecificResponse.json();
          console.log('✅ Can retrieve specific tutor:');
          console.log(`   - Name: ${specificTutor.name}`);
          console.log(`   - Subject: ${specificTutor.subject}`);
        } else {
          console.log('❌ Cannot retrieve specific tutor');
        }

      } else {
        console.log('❌ Failed to create test tutor');
        const error = await createResponse.json();
        console.log('Error:', error);
      }
    } catch (error) {
      console.log('❌ Error creating tutor:', error.message);
    }

    console.log('\n🎯 Debug Summary:');
    console.log('   - Backend connectivity: ✅');
    console.log('   - Database queries: Check logs above');
    console.log('   - API responses: Check logs above');
    console.log('   - If tutors are created but not showing, the issue might be:');
    console.log('     1. Frontend caching issue');
    console.log('     2. Frontend not refreshing after creation');
    console.log('     3. Frontend API call error');
    
  } catch (error) {
    console.error('❌ Debug script failed:', error.message);
  }
}

// Run the debug
debugTutorCRUD();
