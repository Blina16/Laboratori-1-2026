-- ===================================
-- DATABASE SETUP FOR STUDENT MANAGEMENT
-- ===================================

-- 1. Create student_profiles table for additional student information
CREATE TABLE IF NOT EXISTS student_profiles (
  id INT PRIMARY KEY AUTO_INCREMENT,
  user_id INT NOT NULL,
  grade_level VARCHAR(20),
  subjects_of_interest TEXT,
  learning_goals TEXT,
  preferred_schedule VARCHAR(100),
  budget_range DECIMAL(10,2),
  bio TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- 2. Create student_tutor_sessions table for tracking sessions
CREATE TABLE IF NOT EXISTS student_tutor_sessions (
  id INT PRIMARY KEY AUTO_INCREMENT,
  student_id INT NOT NULL,
  tutor_id INT NOT NULL,
  subject VARCHAR(100),
  session_date DATETIME,
  duration_minutes INT DEFAULT 60,
  price DECIMAL(10,2),
  status ENUM('scheduled', 'completed', 'cancelled', 'no_show') DEFAULT 'scheduled',
  notes TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (student_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (tutor_id) REFERENCES users(id) ON DELETE CASCADE
);

-- 3. Create student_reviews table for rating tutors
CREATE TABLE IF NOT EXISTS student_reviews (
  id INT PRIMARY KEY AUTO_INCREMENT,
  student_id INT NOT NULL,
  tutor_id INT NOT NULL,
  session_id INT,
  rating INT CHECK (rating >= 1 AND rating <= 5),
  review_text TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (student_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (tutor_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (session_id) REFERENCES student_tutor_sessions(id) ON DELETE SET NULL
);

-- 4. Insert sample student data (assuming existing students have IDs)
INSERT INTO student_profiles (user_id, grade_level, subjects_of_interest, learning_goals, preferred_schedule, budget_range) VALUES 
(1, 'High School', 'Mathematics, Physics', 'Improve grades', 'Weekends', 50.00),
(8, 'College', 'Computer Science', 'Learn programming', 'Evenings', 75.00),
(9, 'Middle School', 'Mathematics, Science', 'Homework help', 'After school', 30.00);

-- 5. Insert sample session data
INSERT INTO student_tutor_sessions (student_id, tutor_id, subject, session_date, duration_minutes, price, status) VALUES 
(1, 17, 'Mathematics', '2026-01-22 15:00:00', 60, 50.00, 'scheduled'),
(8, 18, 'Computer Science', '2026-01-22 18:00:00', 90, 75.00, 'scheduled'),
(9, 17, 'Science', '2026-01-23 16:00:00', 60, 45.00, 'completed');

-- 6. Insert sample review data
INSERT INTO student_reviews (student_id, tutor_id, session_id, rating, review_text) VALUES 
(9, 17, 3, 5, 'Excellent tutor! Very patient and explains concepts clearly.'),
(1, 17, NULL, 4, 'Good teaching style, helped me understand difficult topics.');

-- 7. Create view for student statistics
CREATE OR REPLACE VIEW student_stats AS
SELECT 
  u.id,
  u.name,
  u.email,
  u.created_at,
  sp.grade_level,
  sp.subjects_of_interest,
  sp.budget_range,
  COUNT(sts.id) as total_sessions,
  COUNT(CASE WHEN sts.status = 'completed' THEN 1 END) as completed_sessions,
  AVG(sr.rating) as average_rating,
  COUNT(sr.id) as total_reviews
FROM users u
LEFT JOIN student_profiles sp ON u.id = sp.user_id
LEFT JOIN student_tutor_sessions sts ON u.id = sts.student_id
LEFT JOIN student_reviews sr ON u.id = sr.student_id
WHERE u.role = 'student'
GROUP BY u.id, u.name, u.email, u.created_at, sp.grade_level, sp.subjects_of_interest, sp.budget_range;

-- 8. Create view for recent student activity
CREATE OR REPLACE VIEW recent_student_activity AS
SELECT 
  u.id,
  u.name,
  u.email,
  sts.subject,
  sts.session_date,
  sts.status,
  t.name as tutor_name
FROM users u
JOIN student_tutor_sessions sts ON u.id = sts.student_id
JOIN users t ON sts.tutor_id = t.id
WHERE u.role = 'student'
ORDER BY sts.session_date DESC
LIMIT 20;

-- ===================================
-- HOW TO RUN THESE QUERIES:
-- ===================================

-- Method 1: Using MySQL Command Line
-- mysql -u root -p laboratori_1_2026 < student_setup.sql

-- Method 2: Using PHPMyAdmin or other DB tool
-- Copy and paste the queries above

-- Method 3: Using Node.js
-- node setup_student_database.js

-- ===================================
-- EXPECTED RESULTS:
-- ===================================
-- Students table should show: Name, Email, Grade Level, Subjects, Budget
-- Sessions table should track: Student-Tutor relationships, dates, status
-- Reviews table should show: Student ratings and feedback
-- ===================================
