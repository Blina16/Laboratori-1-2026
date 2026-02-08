const mysql = require('mysql2/promise');

async function testBookingFlow() {
  try {
    console.log('🧪 Testing Booking Flow...\n');
    
    // Connect to database
    const connection = await mysql.createConnection({
      host: 'localhost',
      user: 'root',
      password: '',
      database: 'laboratori_1_2026'
    });
    
    console.log('✅ Connected to database');
    
    // 1. Check if we have tutors
    const [tutors] = await connection.query(
      'SELECT u.id, u.name, tp.subject, tp.price_per_hour FROM users u LEFT JOIN teacher_profiles tp ON u.id = tp.user_id WHERE u.role = "teacher" LIMIT 3'
    );
    
    if (tutors.length === 0) {
      console.log('❌ No tutors found. Please create tutors first via admin panel.');
      return;
    }
    
    console.log(`\n📚 Found ${tutors.length} tutor(s):`);
    tutors.forEach((tutor, index) => {
      console.log(`${index + 1}. ${tutor.name} - ${tutor.subject || 'General'} - $${tutor.price_per_hour || 50}/hr`);
    });
    
    // 2. Check if we have students
    const [students] = await connection.query(
      'SELECT id, name FROM users WHERE role = "student" LIMIT 3'
    );
    
    if (students.length === 0) {
      console.log('\n❌ No students found. Creating a test student...');
      const [result] = await connection.query(
        'INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, "student")',
        ['Test Student', 'student@test.com', 'password123']
      );
      students.push({ id: result.insertId, name: 'Test Student' });
      console.log('✅ Created test student');
    }
    
    console.log(`\n👤 Found ${students.length} student(s):`);
    students.forEach((student, index) => {
      console.log(`${index + 1}. ${student.name} (ID: ${student.id})`);
    });
    
    // 3. Test creating a booking
    const selectedTutor = tutors[0];
    const selectedStudent = students[0];
    
    console.log(`\n📅 Creating test booking...`);
    console.log(`   Student: ${selectedStudent.name}`);
    console.log(`   Tutor: ${selectedTutor.name}`);
    console.log(`   Subject: ${selectedTutor.subject || 'Mathematics'}`);
    
    // Schedule for tomorrow
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(15, 0, 0, 0); // 3 PM
    
    const [bookingResult] = await connection.query(
      `INSERT INTO student_tutor_sessions 
       (student_id, tutor_id, subject, session_date, duration_minutes, price, status, notes) 
       VALUES (?, ?, ?, ?, ?, ?, 'scheduled', ?)`,
      [
        selectedStudent.id,
        selectedTutor.id,
        selectedTutor.subject || 'Mathematics',
        tomorrow.toISOString().slice(0, 19).replace('T', ' '),
        60, // 1 hour
        selectedTutor.price_per_hour || 50,
        'Test booking created via script'
      ]
    );
    
    console.log(`✅ Booking created successfully! ID: ${bookingResult.insertId}`);
    
    // 4. Fetch and display the booking
    const [bookings] = await connection.query(
      `SELECT sts.*, u.name as student_name, t.name as tutor_name
       FROM student_tutor_sessions sts
       JOIN users u ON sts.student_id = u.id
       JOIN users t ON sts.tutor_id = t.id
       WHERE sts.id = ?`,
      [bookingResult.insertId]
    );
    
    const booking = bookings[0];
    console.log(`\n📋 Booking Details:`);
    console.log(`   ID: ${booking.id}`);
    console.log(`   Student: ${booking.student_name}`);
    console.log(`   Tutor: ${booking.tutor_name}`);
    console.log(`   Subject: ${booking.subject}`);
    console.log(`   Date: ${booking.session_date}`);
    console.log(`   Duration: ${booking.duration_minutes} minutes`);
    console.log(`   Price: $${booking.price}`);
    console.log(`   Status: ${booking.status}`);
    
    await connection.end();
    
    console.log('\n🎉 Booking flow test completed successfully!');
    console.log('\n💡 To test in the app:');
    console.log('1. Start the backend: cd Backend && node index.js');
    console.log('2. Start the frontend: cd Frontend && npm run dev');
    console.log('3. Login as a student and go to dashboard');
    console.log('4. Click "View Profile" on a tutor, then "Book Session"');
    
  } catch (error) {
    console.error('❌ Test failed:', error.message);
    
    if (error.code === 'ER_ACCESS_DENIED_ERROR') {
      console.log('\n💡 Database access denied. Check MySQL credentials.');
    } else if (error.code === 'ER_BAD_DB_ERROR') {
      console.log('\n💡 Database not found. Run: node run_setup.js');
    } else if (error.code === 'ER_NO_SUCH_TABLE') {
      console.log('\n💡 Tables not found. Run: node run_setup.js');
    }
  }
}

testBookingFlow();
