// Simple database connection test
const mysql = require("mysql2/promise");
require("dotenv").config();

async function testDB() {
  console.log('🔍 Testing database connection...');
  
  try {
    const db = mysql.createPool({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
    });

    console.log('✅ Database pool created');
    
    // Test simple query
    const [result] = await db.query('SELECT 1 as test');
    console.log('✅ Database query successful:', result);
    
    // Test users table
    const [users] = await db.query('SELECT COUNT(*) as count FROM users WHERE role = ?', ['teacher']);
    console.log(`✅ Found ${users[0].count} teachers in database`);
    
    await db.end();
    console.log('✅ Database connection closed');
    
  } catch (error) {
    console.error('❌ Database connection failed:', error.message);
    console.log('Check your .env file configuration');
  }
}

testDB();
