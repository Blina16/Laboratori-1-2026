// Diagnostic script to find exact course creation issue
const mysql = require("mysql2/promise");
const axios = require('axios');
require("dotenv").config();

async function diagnoseCourses() {
  console.log('🔍 DIAGNOSING COURSE CREATION ISSUE...\n');

  try {
    // Step 1: Check database connection
    console.log('1. Testing database connection...');
    const db = mysql.createPool({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
    });

    await db.query('SELECT 1');
    console.log('✅ Database connection OK');

    // Step 2: Check if courses table exists
    console.log('\n2. Checking courses table...');
    try {
      const [tables] = await db.query("SHOW TABLES LIKE 'courses'");
      if (tables.length === 0) {
        console.log('❌ Courses table does NOT exist');
        console.log('🔧 Solution: Run node fix_courses_now.js');
        return;
      } else {
        console.log('✅ Courses table exists');
      }
    } catch (err) {
      console.log('❌ Error checking table:', err.message);
    }

    // Step 3: Check courses table structure
    console.log('\n3. Checking courses table structure...');
    try {
      const [columns] = await db.query('DESCRIBE courses');
      console.log('📊 Courses table columns:');
      columns.forEach(col => {
        console.log(`  - ${col.Field}: ${col.Type} ${col.Null === 'NO' ? '(NOT NULL)' : '(NULL)'}`);
      });
    } catch (err) {
      console.log('❌ Error checking structure:', err.message);
    }

    // Step 4: Check if server is running
    console.log('\n4. Testing API server...');
    try {
      const response = await axios.get('http://localhost:5000/api/test');
      console.log('✅ API server running:', response.data.message);
    } catch (err) {
      console.log('❌ API server not running:', err.message);
      console.log('🔧 Solution: cd Backend && node server.js');
      return;
    }

    // Step 5: Test course creation with detailed logging
    console.log('\n5. Testing actual course creation...');
    const testCourse = {
      title: 'Diagnostic Test Course ' + Date.now(),
      description: 'Testing course creation',
      duration: '5 weeks',
      level: 'Beginner',
      price: 49.99,
      teacher_id: null
    };

    try {
      const response = await axios.post('http://localhost:5000/api/courses', testCourse);
      console.log('🎉 SUCCESS! Course created:', response.data.title);
      console.log('📝 Course ID:', response.data.id);
      
      // Clean up
      await axios.delete(`http://localhost:5000/api/courses/${response.data.id}`);
      console.log('🧹 Test course cleaned up');
      
    } catch (error) {
      console.log('❌ Course creation FAILED:');
      console.log('Status:', error.response?.status);
      console.log('Error message:', error.response?.data?.message || error.message);
      console.log('Full error:', error.response?.data || error.message);
      
      // Analyze specific errors
      if (error.response?.data?.message?.includes('table not found')) {
        console.log('\n🔧 DIAGNOSIS: Courses table missing');
        console.log('SOLUTION: Run node fix_courses_now.js');
      }
      if (error.response?.data?.message?.includes('Database tables not found')) {
        console.log('\n🔧 DIAGNOSIS: Database tables missing');
        console.log('SOLUTION: Run node init_db.js');
      }
      if (error.code === 'ECONNREFUSED') {
        console.log('\n🔧 DIAGNOSIS: Server not running');
        console.log('SOLUTION: cd Backend && node server.js');
      }
    }

    await db.end();
    console.log('\n🏁 Diagnosis complete!');

  } catch (error) {
    console.error('❌ Diagnostic failed:', error.message);
  }
}

diagnoseCourses();
