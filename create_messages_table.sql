-- ========================================
-- Create Messages Table for Tutoring Platform
-- ========================================

-- Create messages table for student-tutor communication
CREATE TABLE IF NOT EXISTS messages (
    id INT AUTO_INCREMENT PRIMARY KEY,
    sender_id INT NOT NULL,
    receiver_id INT NOT NULL,
    subject VARCHAR(255),
    message TEXT NOT NULL,
    tutor_id INT NULL, -- Reference to tutor if this is a tutoring inquiry
    is_read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (sender_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (receiver_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (tutor_id) REFERENCES users(id) ON DELETE SET NULL,
    INDEX idx_sender_receiver (sender_id, receiver_id),
    INDEX idx_receiver_read (receiver_id, is_read),
    INDEX idx_tutor_messages (tutor_id),
    INDEX idx_created_at (created_at)
);

-- Verify table creation
SHOW TABLES LIKE 'messages';

-- Sample messages (optional - uncomment for testing)
/*
INSERT INTO messages (sender_id, receiver_id, subject, message, tutor_id) VALUES
(1, 2, 'Math Tutoring Inquiry', 'Hi! I\'m interested in booking a math tutoring session. Are you available this week?', 2),
(2, 1, 'Re: Math Tutoring Inquiry', 'Hello! Yes, I\'m available on Tuesday and Thursday afternoons. What works best for you?', 2);
*/
