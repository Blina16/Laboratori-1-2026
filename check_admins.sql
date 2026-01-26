-- SQL Query to Find All Admin Users
SELECT id, name, email, created_at 
FROM users 
WHERE role = 'admin';

-- Example Output:
-- +----+----------------------+-------------------+---------------------+
-- | id | name                 | email             | created_at          |
-- +----+----------------------+-------------------+---------------------+
-- | 1  | System Administrator | admin@example.com | 2024-01-21 15:20:00 |
-- +----+----------------------+-------------------+---------------------+
