// Quick and dirty fix for courses
const mysql = require("mysql2/promise");
require("dotenv").config();

async function fixCoursesNow() {
  try {
    const db = mysql.createPool({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
    });

    console.log('🔧 Fixing courses table...');

    // Drop and recreate courses table
    await db.query('DROP TABLE IF EXISTS courses');
    console.log('🗑️ Dropped existing courses table');

    await db.query(`
      CREATE TABLE courses (
        id INT PRIMARY KEY AUTO_INCREMENT,
        title VARCHAR(255) NOT NULL,
        description TEXT,
        duration VARCHAR(100),
        level VARCHAR(50),
        price DECIMAL(10,2) DEFAULT 0.00,
        teacher_id INT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (teacher_id) REFERENCES users(id) ON DELETE SET NULL
      )
    `);
    console.log('✅ Created courses table');

    // Insert sample course
    await db.query(`
      INSERT INTO courses (title, description, duration, level, price, teacher_id) 
      VALUES ('Sample Course', 'This is a sample course', '10 weeks', 'Beginner', 99.99, NULL)
    `);
    console.log('✅ Inserted sample course');

    // Verify
    const [courses] = await db.query('SELECT * FROM courses');
    console.log('📊 Courses in database:', courses.length);
    courses.forEach(c => {
      console.log(`  - ${c.title} (ID: ${c.id})`);
    });

    await db.end();
    console.log('🎉 Courses table fixed successfully!');
  } catch (error) {
    console.error('❌ Fix failed:', error.message);
  }
}

fixCoursesNow();
