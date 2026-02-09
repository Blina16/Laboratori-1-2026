const mysql = require("mysql2/promise");
require("dotenv").config();

const initDatabase = async () => {
  try {
    const db = mysql.createPool({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
    });

    console.log('🔧 Initializing database...');

    // Create users table
    await db.query(`
      CREATE TABLE IF NOT EXISTS users (
        id INT PRIMARY KEY AUTO_INCREMENT,
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255) NOT NULL UNIQUE,
        password VARCHAR(255) NOT NULL,
        role ENUM('admin', 'student', 'teacher') DEFAULT 'student',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      )
    `);
    console.log('✅ Users table created/verified');

    // Create teacher_profiles table
    await db.query(`
      CREATE TABLE IF NOT EXISTS teacher_profiles (
        id INT PRIMARY KEY AUTO_INCREMENT,
        user_id INT NOT NULL,
        experience INT DEFAULT 0,
        subject VARCHAR(100),
        price_per_hour DECIMAL(10,2) DEFAULT 0.00,
        bio TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
      )
    `);
    console.log('✅ Teacher profiles table created/verified');

    // Create courses table
    await db.query(`
      CREATE TABLE IF NOT EXISTS courses (
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
    console.log('✅ Courses table created/verified');

    // Create payments table
    await db.query(`
      CREATE TABLE IF NOT EXISTS payments (
        id INT PRIMARY KEY AUTO_INCREMENT,
        student_id INT NOT NULL,
        tutor_id INT NOT NULL,
        course_id INT,
        amount DECIMAL(10,2) NOT NULL,
        payment_date DATE NOT NULL,
        payment_method VARCHAR(50) DEFAULT 'credit_card',
        status ENUM('pending', 'completed', 'failed', 'refunded') DEFAULT 'pending',
        transaction_id VARCHAR(255),
        notes TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (student_id) REFERENCES users(id) ON DELETE CASCADE,
        FOREIGN KEY (tutor_id) REFERENCES users(id) ON DELETE CASCADE,
        FOREIGN KEY (course_id) REFERENCES courses(id) ON DELETE SET NULL
      )
    `);
    console.log('✅ Payments table created/verified');

    // Create student_reviews table
    await db.query(`
      CREATE TABLE IF NOT EXISTS student_reviews (
        id INT PRIMARY KEY AUTO_INCREMENT,
        student_id INT NOT NULL,
        tutor_id INT NOT NULL,
        rating INT CHECK (rating >= 1 AND rating <= 5),
        review_text TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (student_id) REFERENCES users(id) ON DELETE CASCADE,
        FOREIGN KEY (tutor_id) REFERENCES users(id) ON DELETE CASCADE
      )
    `);
    console.log('✅ Student reviews table created/verified');

    // Create student_tutor_sessions table
    await db.query(`
      CREATE TABLE IF NOT EXISTS student_tutor_sessions (
        id INT PRIMARY KEY AUTO_INCREMENT,
        student_id INT,
        tutor_id INT NOT NULL,
        subject VARCHAR(100),
        session_date DATETIME NOT NULL,
        duration_minutes INT DEFAULT 60,
        price DECIMAL(10,2) DEFAULT 0.00,
        status ENUM('scheduled', 'completed', 'cancelled') DEFAULT 'scheduled',
        notes TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (student_id) REFERENCES users(id) ON DELETE SET NULL,
        FOREIGN KEY (tutor_id) REFERENCES users(id) ON DELETE CASCADE
      )
    `);
    console.log('✅ Student tutor sessions table created/verified');

    // Check if admin user exists, create if not
    const [adminCheck] = await db.query("SELECT id FROM users WHERE email = 'admin@example.com'");
    if (adminCheck.length === 0) {
      const bcrypt = require("bcryptjs");
      const hashedPassword = await bcrypt.hash("admin123", 10);
      await db.query(
        "INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)",
        ['Admin User', 'admin@example.com', hashedPassword, 'admin']
      );
      console.log('✅ Admin user created');
    }

    // Check tables
    const [tables] = await db.query('SHOW TABLES');
    console.log('📋 Database tables:', tables.map(t => Object.values(t)[0]));

    await db.end();
    console.log('🎉 Database initialization completed successfully!');
  } catch (error) {
    console.error('❌ Database initialization failed:', error.message);
    process.exit(1);
  }
};

initDatabase();
