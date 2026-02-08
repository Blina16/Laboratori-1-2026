const mysql = require('mysql2/promise');
const fs = require('fs');

async function setupBookingTables() {
  try {
    console.log('🚀 Setting up booking tables...');
    
    // Connect to database
    const connection = await mysql.createConnection({
      host: 'localhost',
      user: 'root',
      password: '',
      database: 'laboratori_1_2026'
    });
    
    console.log('✅ Connected to database');
    
    // Read and execute the booking tables SQL
    const sqlContent = fs.readFileSync('create_booking_tables.sql', 'utf8');
    const statements = sqlContent.split(';').filter(stmt => stmt.trim());
    
    for (const statement of statements) {
      if (statement.trim() && !statement.trim().startsWith('--')) {
        await connection.execute(statement);
        console.log('✅ Executed:', statement.substring(0, 50) + '...');
      }
    }
    
    // Verify tables were created
    const [tables] = await connection.execute('SHOW TABLES LIKE \"student_tutor_sessions\"');
    if (tables.length > 0) {
      console.log('✅ student_tutor_sessions table created successfully');
    } else {
      console.log('❌ student_tutor_sessions table was not created');
    }
    
    await connection.end();
    console.log('🎉 Booking tables setup completed!');
    
  } catch (error) {
    console.error('❌ Setup failed:', error.message);
    
    if (error.code === 'ER_ACCESS_DENIED_ERROR') {
      console.log('💡 Database access denied. Check MySQL credentials.');
    } else if (error.code === 'ER_BAD_DB_ERROR') {
      console.log('💡 Database not found. Make sure laboratori_1_2026 exists.');
    } else if (error.code === 'ER_NO_SUCH_TABLE') {
      console.log('💡 Users table not found. Run: node run_setup.js');
    }
  }
}

setupBookingTables();
