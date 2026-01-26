const db = require('./config/db');

async function testAvailability() {
  try {
    console.log('Testing database connection...');
    
    // Test basic connection
    const [rows] = await db.execute('SELECT 1 as test');
    console.log('Database connection OK:', rows);
    
    // Check if teacher_availability table exists
    const [tables] = await db.execute('SHOW TABLES LIKE "teacher_availability"');
    console.log('teacher_availability table exists:', tables.length > 0);
    
    // Check if there are any users with teacher role
    const [teachers] = await db.execute('SELECT id, name, role FROM users WHERE role = "teacher"');
    console.log('Teachers in database:', teachers);
    
    // Check if there's any availability data
    const [availability] = await db.execute('SELECT * FROM teacher_availability LIMIT 5');
    console.log('Availability data:', availability);
    
    process.exit(0);
  } catch (error) {
    console.error('Test failed:', error);
    process.exit(1);
  }
}

testAvailability();
