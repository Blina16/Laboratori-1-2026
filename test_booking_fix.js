const mysql = require('mysql2/promise');

async function testBookingFix() {
  try {
    console.log('🔧 Testing Booking Fix...\n');
    
    // 1. Setup booking tables
    console.log('1️⃣ Setting up booking tables...');
    const connection = await mysql.createConnection({
      host: 'localhost',
      user: 'root',
      password: '',
      database: 'laboratori_1_2026'
    });
    
    // Create student_tutor_sessions table
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS student_tutor_sessions (
        id INT AUTO_INCREMENT PRIMARY KEY,
        student_id INT NOT NULL,
        tutor_id INT NOT NULL,
        subject VARCHAR(255) NOT NULL,
        session_date DATETIME NOT NULL,
        duration_minutes INT NOT NULL DEFAULT 60,
        price DECIMAL(10, 2) NOT NULL,
        status ENUM('scheduled', 'completed', 'cancelled', 'no_show') DEFAULT 'scheduled',
        notes TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (student_id) REFERENCES users(id) ON DELETE CASCADE,
        FOREIGN KEY (tutor_id) REFERENCES users(id) ON DELETE CASCADE
      )
    `);
    
    console.log('✅ student_tutor_sessions table created/verified');
    
    // 2. Check if we have tutors and students
    const [tutors] = await connection.execute(
      'SELECT id, name FROM users WHERE role = "teacher" LIMIT 1'
    );
    
    const [students] = await connection.execute(
      'SELECT id, name FROM users WHERE role = "student" LIMIT 1'
    );
    
    if (tutors.length === 0) {
      console.log('❌ No tutors found. Creating a test tutor...');
      const [tutorResult] = await connection.execute(
        'INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, "teacher")',
        ['Test Tutor', 'tutor@test.com', 'password123']
      );
      
      // Create teacher profile
      await connection.execute(
        'INSERT INTO teacher_profiles (user_id, experience, subject, price_per_hour, bio) VALUES (?, ?, ?, ?, ?)',
        [tutorResult.insertId, 5, 'Mathematics', 50.00, 'Experienced math tutor']
      );
      
      tutors.push({ id: tutorResult.insertId, name: 'Test Tutor' });
      console.log('✅ Test tutor created');
    }
    
    if (students.length === 0) {
      console.log('❌ No students found. Creating a test student...');
      const [studentResult] = await connection.execute(
        'INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, "student")',
        ['Test Student', 'student@test.com', 'password123']
      );
      students.push({ id: studentResult.insertId, name: 'Test Student' });
      console.log('✅ Test student created');
    }
    
    console.log(`\n📊 Current Status:`);
    console.log(`   Tutors: ${tutors.length} found`);
    console.log(`   Students: ${students.length} found`);
    
    // 3. Test a direct booking insert
    console.log(`\n2️⃣ Testing direct booking insert...`);
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(15, 0, 0, 0);
    
    const mysqlDateTime = tomorrow.toISOString().slice(0, 19).replace('T', ' ');
    
    const [bookingResult] = await connection.execute(
      `INSERT INTO student_tutor_sessions 
       (student_id, tutor_id, subject, session_date, duration_minutes, price, status, notes) 
       VALUES (?, ?, ?, ?, ?, ?, 'scheduled', ?)`,
      [
        students[0].id,
        tutors[0].id,
        'Mathematics',
        mysqlDateTime,
        60,
        50.00,
        'Test booking from fix script'
      ]
    );
    
    console.log(`✅ Test booking created! ID: ${bookingResult.insertId}`);
    
    // 4. Verify the booking
    const [bookings] = await connection.execute(
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
    console.log(`   Student: ${booking.student_name} (ID: ${booking.student_id})`);
    console.log(`   Tutor: ${booking.tutor_name} (ID: ${booking.tutor_id})`);
    console.log(`   Subject: ${booking.subject}`);
    console.log(`   Date: ${booking.session_date}`);
    console.log(`   Duration: ${booking.duration_minutes} minutes`);
    console.log(`   Price: $${booking.price}`);
    console.log(`   Status: ${booking.status}`);
    
    await connection.end();
    
    console.log(`\n🎉 Booking fix test completed successfully!`);
    console.log(`\n💡 Next steps:`);
    console.log(`   1. Start backend: cd Backend && node index.js`);
    console.log(`   2. Start frontend: cd Frontend && npm run dev`);
    console.log(`   3. Login as student and test booking in the UI`);
    
  } catch (error) {
    console.error('❌ Test failed:', error.message);
    
    if (error.code === 'ER_ACCESS_DENIED_ERROR') {
      console.log('\n💡 Database access denied. Check MySQL credentials.');
    } else if (error.code === 'ER_BAD_DB_ERROR') {
      console.log('\n💡 Database not found. Run: node run_setup.js');
    } else if (error.code === 'ER_NO_SUCH_TABLE') {
      console.log('\n💡 Users table not found. Run: node run_setup.js first');
    } else if (error.code === 'ER_NO_REFERENCED_ROW_2') {
      console.log('\n💡 Foreign key error. Make sure users exist before creating bookings.');
    }
  }
}

testBookingFix();
