-- ========================================
-- Student Profiles Table Setup
-- ========================================

-- Create student_profiles table for additional student information
CREATE TABLE IF NOT EXISTS student_profiles (
  id INT PRIMARY KEY AUTO_INCREMENT,
  user_id INT NOT NULL,
  surname VARCHAR(100) DEFAULT NULL,
  age INT DEFAULT NULL,
  location VARCHAR(255) DEFAULT NULL,
  bio TEXT DEFAULT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  INDEX idx_student_user_id (user_id)
);

-- ========================================
-- Grades Table Setup
-- ========================================

-- Create grades table for student grades
CREATE TABLE IF NOT EXISTS grades (
  id INT PRIMARY KEY AUTO_INCREMENT,
  student_id INT NOT NULL,
  subject VARCHAR(100) NOT NULL,
  grade DECIMAL(5,2) NOT NULL,
  assignment_name VARCHAR(255) DEFAULT NULL,
  date DATE DEFAULT NULL,
  comments TEXT DEFAULT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (student_id) REFERENCES users(id) ON DELETE CASCADE,
  INDEX idx_grade_student (student_id),
  INDEX idx_grade_subject (subject),
  INDEX idx_grade_date (date)
);

-- ========================================
-- Sample Grade Data (Optional)
-- ========================================

-- Insert sample grades (assuming students with IDs 16-20 exist)
INSERT INTO grades (student_id, subject, grade, assignment_name, date, comments) VALUES 
-- Grades for Student 1 (ID 16)
(16, 'Mathematics', 85.5, 'Midterm Exam', '2024-01-15', 'Good performance on algebra'),
(16, 'Physics', 78.0, 'Lab Report', '2024-01-20', 'Needs improvement in calculations'),
(16, 'Computer Science', 92.0, 'Programming Project', '2024-01-25', 'Excellent coding skills'),

-- Grades for Student 2 (ID 17)
(17, 'Mathematics', 88.0, 'Midterm Exam', '2024-01-15', 'Strong problem-solving skills'),
(17, 'Chemistry', 76.5, 'Quiz', '2024-01-18', 'Better understanding needed'),
(17, 'English', 91.0, 'Essay', '2024-01-22', 'Well-written analysis'),

-- Grades for Student 3 (ID 18)
(18, 'Physics', 82.0, 'Midterm Exam', '2024-01-15', 'Good grasp of concepts'),
(18, 'Mathematics', 79.5, 'Homework', '2024-01-19', 'Consistent effort'),
(18, 'Engineering', 87.0, 'Design Project', '2024-01-24', 'Creative solution'),

-- Grades for Student 4 (ID 19)
(19, 'Biology', 94.0, 'Lab Exam', '2024-01-16', 'Outstanding practical skills'),
(19, 'Chemistry', 81.5, 'Midterm Exam', '2024-01-21', 'Good theoretical knowledge'),
(19, 'Mathematics', 77.0, 'Quiz', '2024-01-23', 'Needs more practice'),

-- Grades for Student 5 (ID 20)
(20, 'Business', 89.0, 'Case Study', '2024-01-17', 'Excellent analysis'),
(20, 'Finance', 85.5, 'Midterm Exam', '2024-01-20', 'Strong financial concepts'),
(20, 'Mathematics', 83.0, 'Project', '2024-01-25', 'Good application of theory');

-- ========================================
-- Sample Student Data (Optional)
-- ========================================

-- Insert sample student profiles (assuming users with role='student' already exist)
-- Note: Replace the user_id values with actual student IDs from your users table

INSERT INTO student_profiles (user_id, surname, age, location, bio) VALUES 
-- Sample Student 1
(16, 'Smith', 20, 'New York, USA', 'Computer science student interested in web development'),

-- Sample Student 2  
(17, 'Johnson', 22, 'Los Angeles, USA', 'Mathematics major looking for help with calculus'),

-- Sample Student 3
(18, 'Williams', 19, 'Chicago, USA', 'Engineering student needing physics tutoring'),

-- Sample Student 4
(19, 'Brown', 21, 'Houston, USA', 'Biology student preparing for medical school'),

-- Sample Student 5
(20, 'Davis', 23, 'Phoenix, USA', 'Business student studying finance and accounting');

-- ========================================
-- View to See Complete Student Information
-- ========================================

-- Create a view to easily see complete student information
CREATE OR REPLACE VIEW student_complete_info AS
SELECT 
    u.id,
    u.name,
    u.email,
    u.created_at as user_created_at,
    sp.surname,
    sp.age,
    sp.location,
    sp.bio,
    sp.created_at as profile_created_at,
    sp.updated_at as profile_updated_at
FROM users u
LEFT JOIN student_profiles sp ON u.id = sp.user_id
WHERE u.role = 'student'
ORDER BY u.created_at DESC;

-- ========================================
-- Useful Queries
-- ========================================

-- Query 1: View all students with their complete information
SELECT 
    u.id,
    u.name,
    u.email,
    sp.surname,
    sp.age,
    sp.location,
    sp.bio
FROM users u
LEFT JOIN student_profiles sp ON u.id = sp.user_id
WHERE u.role = 'student'
ORDER BY u.created_at DESC;

-- Query 2: Find students by location
SELECT 
    u.name,
    sp.surname,
    sp.age,
    sp.location
FROM users u
LEFT JOIN student_profiles sp ON u.id = sp.user_id
WHERE u.role = 'student' 
  AND sp.location LIKE '%New York%';

-- Query 3: Find students by age range
SELECT 
    u.name,
    sp.surname,
    sp.age,
    sp.location
FROM users u
LEFT JOIN student_profiles sp ON u.id = sp.user_id
WHERE u.role = 'student' 
  AND sp.age BETWEEN 18 AND 25;

-- Query 4: Count students by location
SELECT 
    sp.location,
    COUNT(*) as student_count
FROM users u
LEFT JOIN student_profiles sp ON u.id = sp.user_id
WHERE u.role = 'student' 
  AND sp.location IS NOT NULL
GROUP BY sp.location
ORDER BY student_count DESC;

-- Query 5: Students without profiles (for data cleanup)
SELECT 
    u.id,
    u.name,
    u.email,
    u.created_at
FROM users u
LEFT JOIN student_profiles sp ON u.id = sp.user_id
WHERE u.role = 'student' 
  AND sp.user_id IS NULL;

-- ========================================
-- Manual Insert Example
-- ========================================

-- Example: Manually add a new student with profile
-- Step 1: Create the user account first
INSERT INTO users (name, email, password, role) VALUES 
('Alice', 'alice@example.com', 'hashed_password_here', 'student');

-- Step 2: Get the user ID (assuming it's 21 for this example)
-- Step 3: Add the student profile
INSERT INTO student_profiles (user_id, surname, age, location, bio) VALUES 
(21, 'Anderson', 20, 'Boston, USA', 'Computer science student passionate about AI');

-- ========================================
-- Table Structure Check
-- ========================================

-- Check the structure of your student_profiles table
DESCRIBE student_profiles;

-- Check the structure of your users table  
DESCRIBE users;

-- ========================================
-- Cleanup Script (Optional)
-- ========================================

-- If you need to reset the student_profiles table
-- DROP TABLE IF EXISTS student_profiles;
-- Then run the CREATE TABLE statement above again
