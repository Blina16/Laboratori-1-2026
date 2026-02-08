-- ========================================
-- Create Booking Tables for Tutoring Platform
-- ========================================

-- Create student_tutor_sessions table for bookings
CREATE TABLE IF NOT EXISTS student_tutor_sessions (
    id INT AUTO_INCREMENT PRIMARY KEY,
    student_id INT NOT NULL,
    tutor_id INT NOT NULL,
    subject VARCHAR(255) NOT NULL,
    session_date DATETIME NOT NULL,
    duration_minutes INT NOT NULL DEFAULT 60,
    price DECIMAL(10, 2) NOT NULL,
    status ENUM('scheduled', 'completed', 'cancelled', 'no_show') DEFAULT 'scheduled',
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (student_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (tutor_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_student_tutor (student_id, tutor_id),
    INDEX idx_tutor_date (tutor_id, session_date),
    INDEX idx_status (status),
    INDEX idx_session_date (session_date)
);

-- Create student_reviews table for tutor ratings
CREATE TABLE IF NOT EXISTS student_reviews (
    id INT AUTO_INCREMENT PRIMARY KEY,
    student_id INT NOT NULL,
    tutor_id INT NOT NULL,
    booking_id INT NULL,
    rating DECIMAL(2, 1) NOT NULL CHECK (rating >= 1 AND rating <= 5),
    review_text TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (student_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (tutor_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (booking_id) REFERENCES student_tutor_sessions(id) ON DELETE SET NULL,
    INDEX idx_tutor_rating (tutor_id, rating),
    INDEX idx_student_review (student_id, tutor_id)
);

-- Verify table creation
SHOW TABLES LIKE 'student_tutor_sessions';
SHOW TABLES LIKE 'student_reviews';

-- Sample booking data (if you have sample tutors and students)
-- Uncomment and modify IDs as needed
/*
INSERT INTO student_tutor_sessions (student_id, tutor_id, subject, session_date, duration_minutes, price, notes) VALUES
(1, 1, 'Mathematics', DATE_ADD(NOW(), INTERVAL 1 DAY), 60, 45.00, 'Algebra tutoring session'),
(1, 2, 'English Literature', DATE_ADD(NOW(), INTERVAL 2 DAY), 90, 40.00, 'Essay writing help'),
(2, 1, 'Calculus', DATE_ADD(NOW(), INTERVAL 3 DAY), 60, 45.00, 'Calculus problems review');
*/
