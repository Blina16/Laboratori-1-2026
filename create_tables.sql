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

-- Insert sample data for testing
INSERT INTO courses (title, description, teacher_id) VALUES 
('Mathematics 101', 'Basic mathematics and algebra', 2),
('Physics Fundamentals', 'Introduction to physics concepts', 2),
('Web Development', 'Learn HTML, CSS, and JavaScript', 2);

INSERT INTO sessions (student_id, teacher_id, course_id, title, scheduled_at, duration, status, price) VALUES 
(3, 2, 1, 'Math Tutoring Session', '2024-01-22 15:00:00', 60, 'scheduled', 50.00),
(3, 2, 2, 'Physics Help', '2024-01-24 16:30:00', 45, 'scheduled', 45.00);
