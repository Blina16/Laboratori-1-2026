// Test file for booking API
const fetch = require('node-fetch');

async function testBookingAPI() {
  console.log('Testing Booking API...');
  
  try {
    // Test 1: Create a new booking
    console.log('\n1. Creating a new booking...');
    const bookingData = {
      student_id: 1,
      tutor_id: 1,
      subject: 'Mathematics - Calculus',
      scheduled_date: '2026-01-30T10:00:00Z',
      duration_minutes: 60,
      notes: 'Need help with derivatives and integrals',
      price: 45
    };

    const response = await fetch('http://localhost:5000/api/bookings', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(bookingData)
    });

    if (response.ok) {
      const result = await response.json();
      console.log('✅ Booking created successfully:', result);
    } else {
      console.log('❌ Failed to create booking:', response.status, response.statusText);
    }

    // Test 2: Get bookings for a student
    console.log('\n2. Getting bookings for student...');
    const studentResponse = await fetch('http://localhost:5000/api/bookings/student/1');
    
    if (studentResponse.ok) {
      const studentBookings = await studentResponse.json();
      console.log('✅ Student bookings:', studentBookings);
    } else {
      console.log('❌ Failed to get student bookings:', studentResponse.status);
    }

    // Test 3: Get bookings for a tutor
    console.log('\n3. Getting bookings for tutor...');
    const tutorResponse = await fetch('http://localhost:5000/api/bookings/tutor/1');
    
    if (tutorResponse.ok) {
      const tutorBookings = await tutorResponse.json();
      console.log('✅ Tutor bookings:', tutorBookings);
    } else {
      console.log('❌ Failed to get tutor bookings:', tutorResponse.status);
    }

  } catch (error) {
    console.error('❌ Error testing booking API:', error.message);
  }
}

// Run the test
testBookingAPI();
