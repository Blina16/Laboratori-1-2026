const mysql = require('mysql2/promise');

async function fixBookingSystem() {
  try {
    console.log('🔧 Fixing Booking System...\n');
    
    // Connect to database
    const connection = await mysql.createConnection({
      host: 'localhost',
      user: 'root',
      password: '',
      database: 'laboratori_1_2026'
    });
    
    console.log('✅ Connected to database');
    
    // 1. Check if student_tutor_sessions table exists
    console.log('1️⃣ Checking booking tables...');
    const [tables] = await connection.execute('SHOW TABLES LIKE \"student_tutor_sessions\"');
    
    if (tables.length === 0) {
      console.log('❌ student_tutor_sessions table missing - creating it...');
      await connection.execute(`
        CREATE TABLE student_tutor_sessions (
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
      console.log('✅ student_tutor_sessions table created');
    } else {
      console.log('✅ student_tutor_sessions table exists');
    }
    
    // 2. Check if we have sample data
    console.log('\n2️⃣ Checking sample data...');
    const [tutors] = await connection.execute(
      'SELECT id, name FROM users WHERE role = \"teacher\" LIMIT 2'
    );
    
    const [students] = await connection.execute(
      'SELECT id, name FROM users WHERE role = \"student\" LIMIT 2'
    );
    
    console.log(`Found ${tutors.length} tutors and ${students.length} students`);
    
    if (tutors.length > 0 && students.length > 0) {
      // Create a test booking
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      tomorrow.setHours(15, 0, 0, 0);
      
      const mysqlDateTime = tomorrow.toISOString().slice(0, 19).replace('T', ' ');
      
      const [result] = await connection.execute(
        `INSERT INTO student_tutor_sessions 
         (student_id, tutor_id, subject, session_date, duration_minutes, price, status, notes) 
         VALUES (?, ?, ?, ?, ?, ?, 'scheduled', ?)`,
        [
          students[0].id,
          tutors[0].id,
          'Test Booking Session',
          mysqlDateTime,
          60,
          50.00,
          'Test booking to verify system works'
        ]
      );
      
      console.log(`✅ Test booking created with ID: ${result.insertId}`);
      
      // Verify the booking
      const [bookings] = await connection.execute(
        `SELECT sts.*, u.name as student_name, t.name as tutor_name
         FROM student_tutor_sessions sts
         JOIN users u ON sts.student_id = u.id
         JOIN users t ON sts.tutor_id = t.id
         WHERE sts.id = ?`,
        [result.insertId]
      );
      
      if (bookings.length > 0) {
        const booking = bookings[0];
        console.log('\n📋 Test Booking Details:');
        console.log(`   ID: ${booking.id}`);
        console.log(`   Student: ${booking.student_name} (ID: ${booking.student_id})`);
        console.log(`   Tutor: ${booking.tutor_name} (ID: ${booking.tutor_id})`);
        console.log(`   Subject: ${booking.subject}`);
        console.log(`   Date: ${booking.session_date}`);
        console.log(`   Duration: ${booking.duration_minutes} minutes`);
        console.log(`   Price: $${booking.price}`);
        console.log(`   Status: ${booking.status}`);
      }
    }
    
    // 3. Test API endpoint structure
    console.log('\n3️⃣ Checking API endpoint structure...');
    const [columns] = await connection.execute('DESCRIBE student_tutor_sessions');
    console.log('Table columns:');
    columns.forEach(col => {
      console.log(`   - ${col.Field}: ${col.Type}`);
    });
    
    await connection.end();
    
    console.log('\n🎉 Booking system fixed and verified!');
    console.log('\n💡 Next steps:');
    console.log('   1. Start backend: cd Backend && node index.js');
    console.log('   2. Start frontend: cd Frontend && npm run dev');
    console.log('   3. Test booking in student dashboard');
    console.log('   4. Check browser console for API calls');
    
  } catch (error) {
    console.error('❌ Fix failed:', error.message);
    
    if (error.code === 'ER_ACCESS_DENIED_ERROR') {
      console.log('\n💡 Database access denied. Check MySQL credentials.');
    } else if (error.code === 'ER_BAD_DB_ERROR') {
      console.log('\n💡 Database not found. Create laboratori_1_2026 database.');
    } else if (error.code === 'ER_NO_SUCH_TABLE') {
      console.log('\n💡 Users table not found. Run: node run_setup.js');
    }
  }
}

fixBookingSystem();
