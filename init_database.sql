-- Database initialization script for the tutoring platform
-- Run this script to create all necessary tables

-- Create users table
CREATE TABLE IF NOT EXISTS users (
  id INT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  role ENUM('admin', 'student', 'teacher') DEFAULT 'student',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Create teacher_profiles table for additional tutor information
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
);

-- Create student_profiles table
CREATE TABLE IF NOT EXISTS student_profiles (
  id INT PRIMARY KEY AUTO_INCREMENT,
  user_id INT NOT NULL,
  grade_level VARCHAR(50),
  interests TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Create courses table
CREATE TABLE IF NOT EXISTS courses (
  id INT PRIMARY KEY AUTO_INCREMENT,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  teacher_id INT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (teacher_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Create sessions table
CREATE TABLE IF NOT EXISTS sessions (
  id INT PRIMARY KEY AUTO_INCREMENT,
  student_id INT NOT NULL,
  teacher_id INT NOT NULL,
  course_id INT NULL,
  title VARCHAR(255),
  description TEXT,
  scheduled_at DATETIME NOT NULL,
  duration INT DEFAULT 60, -- in minutes
  status ENUM('scheduled', 'completed', 'cancelled') DEFAULT 'scheduled',
  price DECIMAL(10, 2) DEFAULT 0.00,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (student_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (teacher_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (course_id) REFERENCES courses(id) ON DELETE SET NULL
);

-- Create student_reviews table
CREATE TABLE IF NOT EXISTS student_reviews (
  id INT PRIMARY KEY AUTO_INCREMENT,
  student_id INT NOT NULL,
  tutor_id INT NOT NULL,
  rating INT CHECK (rating >= 1 AND rating <= 5),
  review_text TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (student_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (tutor_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Create student_tutor_sessions table (for availability)
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
);

-- Insert sample data for testing
INSERT IGNORE INTO users (id, name, email, password, role) VALUES 
(1, 'Admin User', 'admin@example.com', '$2a$10$rQZ8kHWKtGY5uKx4vV2qOePqXvYqK8mXy5zB2l7cN3nD6vE9fF0a', 'admin'),
(2, 'John Teacher', 'john@teacher.com', '$2a$10$rQZ8kHWKtGY5uKx4vV2qOePqXvYqK8mXy5zB2l7cN3nD6vE9fF0a', 'teacher'),
(3, 'Jane Student', 'jane@student.com', '$2a$10$rQZ8kHWKtGY5uKx4vV2qOePqXvYqK8mXy5zB2l7cN3nD6vE9fF0a', 'student');

-- Insert sample teacher profiles
INSERT IGNORE INTO teacher_profiles (user_id, experience, subject, price_per_hour, bio) VALUES 
(2, 5, 'Mathematics', 50.00, 'Experienced math teacher with a passion for helping students succeed.');

-- Insert sample courses
INSERT IGNORE INTO courses (title, description, teacher_id) VALUES 
('Mathematics 101', 'Basic mathematics and algebra', 2),
('Advanced Calculus', 'Calculus for advanced students', 2);

-- Verify the setup
SELECT 
  'Database setup completed successfully!' as status,
  (SELECT COUNT(*) FROM users) as user_count,
  (SELECT COUNT(*) FROM teacher_profiles) as teacher_profile_count,
  (SELECT COUNT(*) FROM courses) as course_count;
