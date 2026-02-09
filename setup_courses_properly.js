// Complete setup to fix courses properly
const mysql = require("mysql2/promise");
require("dotenv").config();

async function setupCoursesProperly() {
  console.log('🔧 SETTING UP COURSES PROPERLY...\n');

  try {
    const db = mysql.createPool({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
    });

    console.log('1. Connected to database');

    // Step 1: Create users table if not exists
    console.log('\n2. Setting up users table...');
    await db.query(`
      CREATE TABLE IF NOT EXISTS users (
        id INT PRIMARY KEY AUTO_INCREMENT,
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        role ENUM('student', 'teacher', 'admin') NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    console.log('✅ Users table ready');

    // Step 2: Create courses table
    console.log('\n3. Creating courses table...');
    await db.query('DROP TABLE IF EXISTS courses');
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
    console.log('✅ Courses table created');

    // Step 3: Insert sample data
    console.log('\n4. Adding sample data...');
    
    // Insert sample teacher if not exists
    const [existingTeacher] = await db.query('SELECT id FROM users WHERE email = "teacher@example.com"');
    let teacherId = null;
    
    if (existingTeacher.length === 0) {
      const [teacherResult] = await db.query(`
        INSERT INTO users (name, email, password, role) 
        VALUES ('John Teacher', 'teacher@example.com', 'password123', 'teacher')
      `);
      teacherId = teacherResult.insertId;
      console.log('✅ Sample teacher created');
    } else {
      teacherId = existingTeacher[0].id;
      console.log('✅ Sample teacher already exists');
    }

    // Insert sample courses
    await db.query(`
      INSERT INTO courses (title, description, duration, level, price, teacher_id) VALUES
      ('Introduction to Programming', 'Learn programming basics', '8 weeks', 'Beginner', 99.99, ?),
      ('Advanced Web Development', 'Master modern web dev', '12 weeks', 'Advanced', 199.99, ?),
      ('Database Design', 'Learn database fundamentals', '6 weeks', 'Intermediate', 149.99, NULL)
    `, [teacherId, teacherId]);
    console.log('✅ Sample courses added');

    // Step 4: Verify setup
    console.log('\n5. Verifying setup...');
    const [courseCount] = await db.query('SELECT COUNT(*) as count FROM courses');
    console.log(`✅ Total courses: ${courseCount[0].count}`);

    const [courses] = await db.query('SELECT id, title, teacher_id FROM courses');
    courses.forEach(course => {
      console.log(`  - ${course.title} (ID: ${course.id}, Teacher ID: ${course.teacher_id})`);
    });

    await db.end();
    console.log('\n🎉 COURSES SETUP COMPLETE!');
    console.log('✅ Database tables created');
    console.log('✅ Sample data added');
    console.log('✅ Ready for course CRUD operations');

  } catch (error) {
    console.error('❌ Setup failed:', error.message);
    if (error.code === 'ER_ACCESS_DENIED_ERROR') {
      console.log('💡 Check MySQL credentials in .env file');
    }
    if (error.code === 'ECONNREFUSED') {
      console.log('💡 Make sure MySQL server is running');
    }
  }
}

setupCoursesProperly();
