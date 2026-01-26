-- ========================================
-- Create Availability Tables
-- ========================================

-- Create teacher availability table
CREATE TABLE IF NOT EXISTS teacher_availability (
    id INT AUTO_INCREMENT PRIMARY KEY,
    teacher_id INT NOT NULL,
    date DATE NOT NULL,
    start_time TIME NOT NULL,
    end_time TIME NOT NULL,
    max_students INT DEFAULT 1,
    current_students INT DEFAULT 0,
    recurring_pattern VARCHAR(20) DEFAULT NULL,
    recurring_end_date DATE DEFAULT NULL,
    notes TEXT,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (teacher_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_teacher_date (teacher_id, date),
    INDEX idx_date_time (date, start_time),
    INDEX idx_active (is_active)
);

-- Create booked sessions table (for actual bookings)
CREATE TABLE IF NOT EXISTS booked_sessions (
    id INT AUTO_INCREMENT PRIMARY KEY,
    availability_id INT NOT NULL,
    teacher_id INT NOT NULL,
    student_id INT NOT NULL,
    subject VARCHAR(255) NOT NULL,
    notes TEXT,
    status ENUM('scheduled', 'completed', 'cancelled', 'no_show') DEFAULT 'scheduled',
    price DECIMAL(10, 2) NOT NULL,
    duration_minutes INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (availability_id) REFERENCES teacher_availability(id) ON DELETE CASCADE,
    FOREIGN KEY (teacher_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (student_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_teacher_student (teacher_id, student_id),
    INDEX idx_status (status),
    INDEX idx_date (availability_id)
);

-- Insert sample availability for our sample tutors
INSERT INTO teacher_availability (teacher_id, date, start_time, end_time, max_students, notes) VALUES
-- John Smith (Mathematics) - Next 2 weeks
(1, DATE_ADD(CURRENT_DATE, INTERVAL 1 DAY), '09:00:00', '10:00:00', 2, 'Algebra and Calculus tutoring'),
(1, DATE_ADD(CURRENT_DATE, INTERVAL 1 DAY), '14:00:00', '15:00:00', 1, 'Advanced Calculus'),
(1, DATE_ADD(CURRENT_DATE, INTERVAL 2 DAY), '10:00:00', '11:30:00', 3, 'Linear Algebra'),
(1, DATE_ADD(CURRENT_DATE, INTERVAL 3 DAY), '09:00:00', '10:00:00', 2, 'General Mathematics'),
(1, DATE_ADD(CURRENT_DATE, INTERVAL 4 DAY), '13:00:00', '14:00:00', 1, 'Test Preparation'),
(1, DATE_ADD(CURRENT_DATE, INTERVAL 7 DAY), '09:00:00', '10:00:00', 2, 'Weekly Math Session'),
(1, DATE_ADD(CURRENT_DATE, INTERVAL 8 DAY), '14:00:00', '15:00:00', 1, 'Advanced Topics'),

-- Sarah Johnson (English Literature)
(2, DATE_ADD(CURRENT_DATE, INTERVAL 1 DAY), '11:00:00', '12:00:00', 2, 'Creative Writing Workshop'),
(2, DATE_ADD(CURRENT_DATE, INTERVAL 2 DAY), '15:00:00', '16:30:00', 3, 'Literature Analysis'),
(2, DATE_ADD(CURRENT_DATE, INTERVAL 3 DAY), '10:00:00', '11:00:00', 1, 'Essay Writing Help'),
(2, DATE_ADD(CURRENT_DATE, INTERVAL 5 DAY), '14:00:00', '15:00:00', 2, 'Shakespeare Studies'),
(2, DATE_ADD(CURRENT_DATE, INTERVAL 6 DAY), '11:00:00', '12:30:00', 3, 'Reading Comprehension'),
(2, DATE_ADD(CURRENT_DATE, INTERVAL 8 DAY), '15:00:00', '16:00:00', 2, 'Writing Skills'),

-- Michael Brown (Physics)
(3, DATE_ADD(CURRENT_DATE, INTERVAL 1 DAY), '13:00:00', '14:30:00', 2, 'Classical Mechanics'),
(3, DATE_ADD(CURRENT_DATE, INTERVAL 2 DAY), '09:00:00', '10:00:00', 1, 'Quantum Physics'),
(3, DATE_ADD(CURRENT_DATE, INTERVAL 4 DAY), '14:00:00', '15:00:00', 3, 'Physics Lab Help'),
(3, DATE_ADD(CURRENT_DATE, INTERVAL 5 DAY), '10:00:00', '11:30:00', 2, 'Electromagnetism'),
(3, DATE_ADD(CURRENT_DATE, INTERVAL 7 DAY), '13:00:00', '14:00:00', 1, 'Advanced Physics'),
(3, DATE_ADD(CURRENT_DATE, INTERVAL 9 DAY), '09:00:00', '10:00:00', 2, 'Physics Review'),

-- Emily Davis (Chemistry)
(4, DATE_ADD(CURRENT_DATE, INTERVAL 1 DAY), '10:00:00', '11:00:00', 2, 'Organic Chemistry'),
(4, DATE_ADD(CURRENT_DATE, INTERVAL 3 DAY), '14:00:00', '15:30:00', 3, 'Chemistry Lab'),
(4, DATE_ADD(CURRENT_DATE, INTERVAL 4 DAY), '09:00:00', '10:00:00', 1, 'Inorganic Chemistry'),
(4, DATE_ADD(CURRENT_DATE, INTERVAL 6 DAY), '13:00:00', '14:00:00', 2, 'Chemistry Basics'),
(4, DATE_ADD(CURRENT_DATE, INTERVAL 8 DAY), '10:00:00', '11:30:00', 3, 'Chemistry Review'),

-- David Wilson (Computer Science)
(5, DATE_ADD(CURRENT_DATE, INTERVAL 1 DAY), '16:00:00', '17:30:00', 3, 'Python Programming'),
(5, DATE_ADD(CURRENT_DATE, INTERVAL 2 DAY), '10:00:00', '11:00:00', 2, 'Web Development'),
(5, DATE_ADD(CURRENT_DATE, INTERVAL 3 DAY), '14:00:00', '15:00:00', 1, 'Data Structures'),
(5, DATE_ADD(CURRENT_DATE, INTERVAL 5 DAY), '09:00:00', '10:30:00', 3, 'Algorithms'),
(5, DATE_ADD(CURRENT_DATE, INTERVAL 7 DAY), '16:00:00', '17:00:00', 2, 'Programming Basics'),
(5, DATE_ADD(CURRENT_DATE, INTERVAL 9 DAY), '10:00:00', '11:30:00', 3, 'Full-stack Development');

-- Verify the inserted availability
SELECT 
    ta.id,
    u.name as teacher_name,
    ta.date,
    ta.start_time,
    ta.end_time,
    ta.max_students,
    ta.current_students,
    ta.notes
FROM teacher_availability ta
JOIN users u ON ta.teacher_id = u.id
ORDER BY ta.date, ta.start_time;
