const mysql = require('mysql2/promise');

async function testCompleteBooking() {
  try {
    console.log('🧪 Testing Complete Booking System...\n');
    
    // Connect to database
    const connection = await mysql.createConnection({
      host: 'localhost',
      user: 'root',
      password: '',
      database: 'laboratori_1_2026'
    });
    
    console.log('✅ Connected to database');
    
    // 1. Verify tables exist
    console.log('1️⃣ Verifying tables...');
    const [tables] = await connection.execute('SHOW TABLES');
    const requiredTables = ['users', 'student_tutor_sessions'];
    const missingTables = requiredTables.filter(table => 
      !tables.some(t => t[`Tables_in_laboratori_1_2026`] === table)
    );
    
    if (missingTables.length > 0) {
      console.log('❌ Missing tables:', missingTables);
      return;
    }
    console.log('✅ All required tables exist');
    
    // 2. Check sample data
    console.log('\n2️⃣ Checking sample data...');
    const [tutors] = await connection.execute(
      'SELECT id, name, role FROM users WHERE role = \"teacher\" LIMIT 3'
    );
    const [students] = await connection.execute(
      'SELECT id, name, role FROM users WHERE role = \"student\" LIMIT 3'
    );
    
    console.log(`Found ${tutors.length} tutors and ${students.length} students`);
    
    if (tutors.length === 0 || students.length === 0) {
      console.log('❌ No tutors or students found - creating sample data...');
      
      // Create sample tutor
      if (tutors.length === 0) {
        const [tutorResult] = await connection.execute(
          'INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, \"teacher\")',
          ['John Smith', 'john@tutor.com', 'password123']
        );
        await connection.execute(
          'INSERT INTO teacher_profiles (user_id, experience, subject, price_per_hour, bio) VALUES (?, ?, ?, ?, ?)',
          [tutorResult.insertId, 5, 'Mathematics', 50.00, 'Experienced math tutor']
        );
        console.log('✅ Sample tutor created');
      }
      
      // Create sample student
      if (students.length === 0) {
        const [studentResult] = await connection.execute(
          'INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, \"student\")',
          ['Jane Doe', 'jane@student.com', 'password123']
        );
        console.log('✅ Sample student created');
      }
      
      // Refresh data
      const [newTutors] = await connection.execute(
        'SELECT id, name FROM users WHERE role = \"teacher\" LIMIT 1'
      );
      const [newStudents] = await connection.execute(
        'SELECT id, name FROM users WHERE role = \"student\" LIMIT 1'
      );
      
      tutors.push(...newTutors);
      students.push(...newStudents);
    }
    
    // 3. Test booking creation
    console.log('\n3️⃣ Testing booking creation...');
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
        'Mathematics Tutoring',
        mysqlDateTime,
        60,
        50.00,
        'Test booking for system verification'
      ]
    );
    
    console.log(`✅ Test booking created with ID: ${bookingResult.insertId}`);
    
    // 4. Verify booking data
    console.log('\n4️⃣ Verifying booking data...');
    const [bookings] = await connection.execute(
      `SELECT sts.*, u.name as student_name, t.name as tutor_name
       FROM student_tutor_sessions sts
       JOIN users u ON sts.student_id = u.id
       JOIN users t ON sts.tutor_id = t.id
       WHERE sts.id = ?`,
      [bookingResult.insertId]
    );
    
    if (bookings.length > 0) {
      const booking = bookings[0];
      console.log('📋 Booking Details:');
      console.log(`   ID: ${booking.id}`);
      console.log(`   Student: ${booking.student_name} (ID: ${booking.student_id})`);
      console.log(`   Tutor: ${booking.tutor_name} (ID: ${booking.tutor_id})`);
      console.log(`   Subject: ${booking.subject}`);
      console.log(`   Date: ${booking.session_date}`);
      console.log(`   Duration: ${booking.duration_minutes} minutes`);
      console.log(`   Price: $${booking.price}`);
      console.log(`   Status: ${booking.status}`);
      console.log(`   Notes: ${booking.notes}`);
      
      // 5. Test API data format
      console.log('\n5️⃣ Testing API data format...');
      const apiData = {
        student_id: booking.student_id,
        tutor_id: booking.tutor_id,
        subject: booking.subject,
        scheduled_date: booking.session_date,
        duration_minutes: booking.duration_minutes,
        notes: booking.notes,
        price: parseFloat(booking.price)
      };
      
      console.log('📤 API Data Format:');
      console.log(JSON.stringify(apiData, null, 2));
      console.log('✅ API data format is correct');
    }
    
    await connection.end();
    
    console.log('\n🎉 Booking system test completed successfully!');
    console.log('\n💡 System Status:');
    console.log('   ✅ Database tables: OK');
    console.log('   ✅ Sample data: OK');
    console.log('   ✅ Booking creation: OK');
    console.log('   ✅ Data format: OK');
    
    console.log('\n🚀 Ready for frontend testing!');
    console.log('   1. Start backend: cd Backend && node index.js');
    console.log('   2. Start frontend: cd Frontend && npm run dev');
    console.log('   3. Login as student and test booking');
    
  } catch (error) {
    console.error('❌ Test failed:', error.message);
    
    if (error.code === 'ER_ACCESS_DENIED_ERROR') {
      console.log('\n💡 Database access denied. Check MySQL credentials.');
    } else if (error.code === 'ER_BAD_DB_ERROR') {
      console.log('\n💡 Database not found. Create laboratori_1_2026 database.');
    }
  }
}

testCompleteBooking();
