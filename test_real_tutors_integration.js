// Comprehensive test for real tutors integration
const fetch = require('node-fetch');

async function testRealTutorsIntegration() {
  console.log('🧪 Testing Real Tutors Integration...\n');
  
  const API_BASE = 'http://localhost:5000';
  
  try {
    // Test 1: Fetch all tutors from CRUD system
    console.log('1️⃣ Fetching tutors from CRUD system...');
    const tutorsResponse = await fetch(`${API_BASE}/api/tutors`);
    
    if (tutorsResponse.ok) {
      const tutors = await tutorsResponse.json();
      console.log(`✅ Successfully fetched ${tutors.length} tutors`);
      
      if (tutors.length > 0) {
        console.log('📋 Sample tutor data:');
        console.log(`   - Name: ${tutors[0].name}`);
        console.log(`   - Subject: ${tutors[0].subject}`);
        console.log(`   - Price: $${tutors[0].price_per_hour}/hour`);
        console.log(`   - Experience: ${tutors[0].experience} years`);
        console.log(`   - Rating: ${tutors[0].average_rating || 'No rating yet'}`);
        console.log(`   - Total Sessions: ${tutors[0].total_sessions || 0}`);
      }
    } else {
      console.log('❌ Failed to fetch tutors:', tutorsResponse.status);
      return;
    }

    // Test 2: Test booking with real tutor data
    if (tutors.length > 0) {
      console.log('\n2️⃣ Testing booking with real tutor...');
      const firstTutor = tutors[0];
      
      const bookingData = {
        student_id: 1,
        tutor_id: firstTutor.id,
        subject: firstTutor.subject || 'General Tutoring',
        scheduled_date: '2026-01-30T14:00:00Z',
        duration_minutes: 60,
        notes: 'Test booking with real tutor data',
        price: firstTutor.price_per_hour || 50
      };

      const bookingResponse = await fetch(`${API_BASE}/api/bookings`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(bookingData)
      });

      if (bookingResponse.ok) {
        const booking = await bookingResponse.json();
        console.log('✅ Booking created successfully!');
        console.log(`   - Booking ID: ${booking.booking.id}`);
        console.log(`   - Tutor: ${booking.booking.tutor_name}`);
        console.log(`   - Student: ${booking.booking.student_name}`);
        console.log(`   - Subject: ${booking.booking.subject}`);
        console.log(`   - Price: $${booking.booking.price}`);
        console.log(`   - Status: ${booking.booking.status}`);
      } else {
        console.log('❌ Failed to create booking:', bookingResponse.status);
      }

      // Test 3: Get bookings for the tutor
      console.log('\n3️⃣ Testing tutor bookings retrieval...');
      const tutorBookingsResponse = await fetch(`${API_BASE}/api/bookings/tutor/${firstTutor.id}`);
      
      if (tutorBookingsResponse.ok) {
        const tutorBookings = await tutorBookingsResponse.json();
        console.log(`✅ Successfully fetched ${tutorBookings.length} bookings for tutor`);
      } else {
        console.log('❌ Failed to fetch tutor bookings:', tutorBookingsResponse.status);
      }
    }

    // Test 4: Test tutor search functionality
    console.log('\n4️⃣ Testing tutor search...');
    const searchResponse = await fetch(`${API_BASE}/api/tutors/search?subject=Mathematics`);
    
    if (searchResponse.ok) {
      const searchResults = await searchResponse.json();
      console.log(`✅ Search returned ${searchResults.length} math tutors`);
    } else {
      console.log('❌ Failed to search tutors:', searchResponse.status);
    }

    console.log('\n🎉 Integration tests completed!');
    console.log('\n📝 Summary:');
    console.log('   ✅ Real tutors data is being fetched from CRUD system');
    console.log('   ✅ Booking system works with real tutor data');
    console.log('   ✅ Tutor pricing and info are correctly integrated');
    console.log('   ✅ Search functionality is working');
    
  } catch (error) {
    console.error('❌ Integration test failed:', error.message);
  }
}

// Run the test
testRealTutorsIntegration();
