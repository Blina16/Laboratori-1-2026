const mysql = require("mysql2/promise");
require("dotenv").config();

const testDb = async () => {
  try {
    const db = mysql.createPool({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
    });

    console.log('Testing database connection...');
    console.log('Host:', process.env.DB_HOST);
    console.log('User:', process.env.DB_USER);
    console.log('Database:', process.env.DB_NAME);
    
    // Test connection
    const [result] = await db.query('SELECT 1 as test');
    console.log('✅ Database connection successful:', result);
    
    // Check if users table exists
    const [tables] = await db.query('SHOW TABLES');
    console.log('📋 Tables in database:', tables.map(t => Object.values(t)[0]));
    
    // Check users table structure
    if (tables.some(t => Object.values(t)[0] === 'users')) {
      const [columns] = await db.query('DESCRIBE users');
      console.log('👥 Users table structure:', columns);
      
      // Check existing users
      const [users] = await db.query('SELECT id, name, email, role FROM users');
      console.log('👤 Existing users:', users);
    }
    
    await db.end();
  } catch (error) {
    console.error('❌ Database error:', error.message);
  }
};

testDb();
