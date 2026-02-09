// Check what's actually in the database
const mysql = require("mysql2/promise");
require("dotenv").config();

async function checkDatabase() {
  console.log('🔍 CHECKING DATABASE STATE...\n');

  try {
    const db = mysql.createPool({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
    });

    // Check if database exists
    console.log('1. Database connection...');
    await db.query('SELECT 1');
    console.log('✅ Connected to database:', process.env.DB_NAME);

    // List all tables
    console.log('\n2. All tables in database:');
    const [tables] = await db.query('SHOW TABLES');
    if (tables.length === 0) {
      console.log('❌ No tables found!');
    } else {
      tables.forEach(table => {
        console.log(`  - ${Object.values(table)[0]}`);
      });
    }

    // Check courses table specifically
    console.log('\n3. Courses table details:');
    try {
      const [columns] = await db.query('DESCRIBE courses');
      console.log('📊 Columns:');
      columns.forEach(col => {
        console.log(`  - ${col.Field}: ${col.Type} ${col.Null === 'NO' ? '(NOT NULL)' : '(NULL)'}`);
      });

      const [count] = await db.query('SELECT COUNT(*) as count FROM courses');
      console.log(`📊 Records: ${count[0].count}`);

      if (count[0].count > 0) {
        const [courses] = await db.query('SELECT * FROM courses LIMIT 3');
        console.log('📝 Sample courses:');
        courses.forEach(c => {
          console.log(`  - ID: ${c.id}, Title: "${c.title}"`);
        });
      }
    } catch (err) {
      console.log('❌ Courses table error:', err.message);
    }

    await db.end();
  } catch (error) {
    console.error('❌ Database check failed:', error.message);
  }
}

checkDatabase();
