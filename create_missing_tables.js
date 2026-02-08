// Create missing database tables
const db = require('./Backend/config/db');

async function createTables() {
  try {
    console.log('🔧 Creating missing database tables...');
    
    // Create sessions table
    await db.query(`
      CREATE TABLE IF NOT EXISTS sessions (
        id INT PRIMARY KEY AUTO_INCREMENT,
        student_id INT NOT NULL,
        teacher_id INT NOT NULL,
        course_id INT NULL,
        title VARCHAR(255),
        description TEXT,
        scheduled_at DATETIME NOT NULL,
        duration INT DEFAULT 60,
        status ENUM('scheduled', 'completed', 'cancelled') DEFAULT 'scheduled',
        price DECIMAL(10, 2) DEFAULT 0.00,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (student_id) REFERENCES users(id) ON DELETE CASCADE,
        FOREIGN KEY (teacher_id) REFERENCES users(id) ON DELETE CASCADE,
        FOREIGN KEY (course_id) REFERENCES courses(id) ON DELETE SET NULL
      )
    `);
    console.log('✅ Sessions table created');
    
    // Create courses table
    await db.query(`
      CREATE TABLE IF NOT EXISTS courses (
        id INT PRIMARY KEY AUTO_INCREMENT,
        title VARCHAR(255) NOT NULL,
        description TEXT,
        teacher_id INT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (teacher_id) REFERENCES users(id) ON DELETE CASCADE
      )
    `);
    console.log('✅ Courses table created');
    
    // Test tutors query
    console.log('\n🧪 Testing tutors query...');
    const [tutors] = await db.query(
      `SELECT u.id, u.name, u.email, u.created_at,
              tp.experience, tp.subject, tp.price_per_hour, tp.bio,
              COUNT(s.id) as total_sessions
       FROM users u
       LEFT JOIN teacher_profiles tp ON u.id = tp.user_id
       LEFT JOIN sessions s ON u.id = s.teacher_id
       WHERE u.role = 'teacher'
       GROUP BY u.id, u.name, u.email, u.created_at, tp.experience, tp.subject, tp.price_per_hour, tp.bio
       ORDER BY u.created_at DESC`
    );
    
    console.log(`✅ Found ${tutors.length} tutors`);
    if (tutors.length > 0) {
      console.log('   First tutor:', tutors[0]);
    }
    
    console.log('\n✅ Database setup complete!');
    
  } catch (error) {
    console.error('❌ Database setup failed:', error);
  } finally {
    process.exit(0);
  }
}

createTables();
