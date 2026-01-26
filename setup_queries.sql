

-- 1. Create teacher_profiles table
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

-- 2. Insert sample teacher data (assuming existing teachers have IDs 2, 3, 4)
INSERT INTO teacher_profiles (user_id, experience, subject, price_per_hour) VALUES 
(2, 5, 'Mathematics', 50.00),
(3, 10, 'Physics', 60.00),
(4, 3, 'Chemistry', 45.00);

-- 3. Verify the setup
SELECT 
  u.id, u.name, u.email, u.role,
  tp.experience, tp.subject, tp.price_per_hour
FROM users u
LEFT JOIN teacher_profiles tp ON u.id = tp.user_id
WHERE u.role = 'teacher'
ORDER BY u.created_at DESC;

