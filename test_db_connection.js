const db = require('./Backend/config/db');

async function testConnection() {
  try {
    console.log('Testing database connection...');
    
    // Test basic connection
    const [result] = await db.execute('SELECT 1 as test');
    console.log('Database connection successful:', result);
    
    // Show all tables
    const [tables] = await db.execute('SHOW TABLES');
    console.log('Available tables:', tables);
    
    // Test users table
    const [users] = await db.execute('SELECT id, name, role FROM users LIMIT 5');
    console.log('Sample users:', users);
    
    // Test teacher_profiles table
    const [profiles] = await db.execute('SELECT * FROM teacher_profiles LIMIT 5');
    console.log('Teacher profiles:', profiles);
    
  } catch (error) {
    console.error('Database error:', error);
  } finally {
    process.exit(0);
  }
}

testConnection();
