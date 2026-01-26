-- ========================================
-- Insert Sample Tutors
-- ========================================

-- Insert sample users with teacher role
INSERT INTO users (name, email, password, role, created_at) VALUES
('John Smith', 'john.smith@tutoring.com', 'password123', 'teacher', NOW()),
('Sarah Johnson', 'sarah.johnson@tutoring.com', 'password123', 'teacher', NOW()),
('Michael Brown', 'michael.brown@tutoring.com', 'password123', 'teacher', NOW()),
('Emily Davis', 'emily.davis@tutoring.com', 'password123', 'teacher', NOW()),
('David Wilson', 'david.wilson@tutoring.com', 'password123', 'teacher', NOW());

-- Insert teacher profiles for the sample tutors
INSERT INTO teacher_profiles (user_id, experience, subject, price_per_hour, bio) VALUES
(1, 8, 'Mathematics', 45.00, 'Experienced mathematics tutor with 8+ years of teaching experience. Specializing in algebra, calculus, and test preparation. Passionate about making math accessible and enjoyable for all students.'),
(2, 6, 'English Literature', 40.00, 'English literature and writing tutor with a background in education. I help students develop strong reading comprehension, writing skills, and literary analysis. Experienced with both high school and college level students.'),
(3, 10, 'Physics', 50.00, 'Physics tutor with a PhD in Physics and 10 years of teaching experience. I specialize in mechanics, electromagnetism, and quantum physics. My goal is to make complex physics concepts understandable and engaging.'),
(4, 5, 'Chemistry', 42.00, 'Chemistry tutor with a Master''s degree in Chemistry. I help students with organic chemistry, inorganic chemistry, and lab techniques. My approach focuses on building strong foundational knowledge.'),
(5, 7, 'Computer Science', 55.00, 'Computer science tutor with industry experience in software development. I teach programming languages, algorithms, data structures, and web development. Perfect for students looking to enter the tech industry.');

-- Add some courses for each tutor
INSERT INTO courses (title, description, teacher_id, created_at) VALUES
('Advanced Calculus', 'Comprehensive course covering differential and integral calculus, multivariable calculus, and differential equations.', 1, NOW()),
('Linear Algebra', 'Introduction to linear algebra, vectors, matrices, and their applications in mathematics and engineering.', 1, NOW()),
('Creative Writing Workshop', 'Develop your creative writing skills through exercises, feedback, and peer review sessions.', 2, NOW()),
('Shakespeare Studies', 'In-depth analysis of Shakespeare''s major works, including sonnets, tragedies, and comedies.', 2, NOW()),
'Classical Mechanics', 'Study of motion, forces, energy, and momentum in classical physics systems.', 3, NOW()),
'Quantum Physics Basics', 'Introduction to quantum mechanics, wave-particle duality, and quantum states.', 3, NOW()),
'Organic Chemistry Fundamentals', 'Learn the basics of organic chemistry, including nomenclature, reactions, and mechanisms.', 4, NOW()),
'Chemistry Lab Techniques', 'Practical laboratory skills for chemistry students, including safety, measurements, and analysis.', 4, NOW()),
'Python Programming', 'Learn Python programming from basics to advanced concepts including data structures and algorithms.', 5, NOW()),
'Web Development Bootcamp', 'Full-stack web development course covering HTML, CSS, JavaScript, and modern frameworks.', 5, NOW());

-- Verify the inserted tutors
SELECT 
    u.id,
    u.name,
    u.email,
    u.role,
    tp.experience,
    tp.subject,
    tp.price_per_hour,
    tp.bio
FROM users u
JOIN teacher_profiles tp ON u.id = tp.user_id
WHERE u.role = 'teacher'
ORDER BY u.id;
