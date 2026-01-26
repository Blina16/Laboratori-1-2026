const express = require("express")
const bcrypt = require("bcryptjs")
const db = require("../config/db")
const router = express.Router()

// Get all teachers
router.get("/teachers", async (req, res) => {
  try {
    const [teachers] = await db.query(
      `SELECT id, name, email, created_at 
       FROM users 
       WHERE role = 'teacher' 
       ORDER BY created_at DESC`
    )
    res.json(teachers)
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch teachers" })
  }
})

// Create new teacher
router.post("/teachers", async (req, res) => {
  const { name, email, password, experience, subject, price } = req.body

  if (!name || !email || !password) {
    return res.status(400).json({ message: "Name, email, and password are required" })
  }

  try {
    // Check if user exists
    const [existing] = await db.query(
      "SELECT id FROM users WHERE email = ?",
      [email]
    )

    if (existing.length > 0) {
      return res.status(400).json({ message: "User with this email already exists" })
    }

    const hashedPassword = await bcrypt.hash(password, 10)

    const [result] = await db.query(
      "INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, 'teacher')",
      [name, email, hashedPassword]
    )

    const userId = result.insertId

    // Insert additional teacher details
    if (experience || subject || price) {
      await db.query(
        `INSERT INTO teacher_profiles (user_id, experience, subject, price_per_hour) 
         VALUES (?, ?, ?, ?)`,
        [userId, experience || 0, subject || null, price || 0]
      )
    }

    res.status(201).json({ 
      message: "Teacher created successfully",
      teacher: {
        id: userId,
        name,
        email,
        role: 'teacher',
        experience: experience || 0,
        subject: subject || null,
        price_per_hour: price || 0
      }
    })
  } catch (err) {
    res.status(500).json({ message: "Failed to create teacher" })
  }
})

// Update teacher
router.put("/teachers/:id", async (req, res) => {
  const { name, email, experience, subject, price } = req.body
  const { id } = req.params

  try {
    // Update user basic info
    if (name || email) {
      await db.query(
        "UPDATE users SET name = ?, email = ? WHERE id = ?",
        [name, email, id]
      )
    }

    // Update teacher profile
    if (experience !== undefined || subject !== undefined || price !== undefined) {
      await db.query(
        `UPDATE teacher_profiles 
         SET experience = ?, subject = ?, price_per_hour = ? 
         WHERE user_id = ?`,
        [experience, subject, price, id]
      )
    }

    res.json({ message: "Teacher updated successfully" })
  } catch (err) {
    res.status(500).json({ message: "Failed to update teacher" })
  }
})

// Delete teacher
router.delete("/teachers/:id", async (req, res) => {
  const { id } = req.params

  try {
    // Delete teacher profile
    await db.query("DELETE FROM teacher_profiles WHERE user_id = ?", [id])
    
    // Delete user
    await db.query("DELETE FROM users WHERE id = ?", [id])

    res.json({ message: "Teacher deleted successfully" })
  } catch (err) {
    res.status(500).json({ message: "Failed to delete teacher" })
  }
})

// Get user stats
router.get("/stats", async (req, res) => {
  try {
    const [totalUsers] = await db.query("SELECT COUNT(*) as count FROM users")
    const [students] = await db.query("SELECT COUNT(*) as count FROM users WHERE role = 'student'")
    const [teachers] = await db.query("SELECT COUNT(*) as count FROM users WHERE role = 'teacher'")
    const [admins] = await db.query("SELECT COUNT(*) as count FROM users WHERE role = 'admin'")
    
    res.json({
      totalUsers: totalUsers[0].count,
      students: students[0].count,
      teachers: teachers[0].count,
      admins: admins[0].count
    })
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch stats" })
  }
})

// Get recent users
router.get("/recent-users", async (req, res) => {
  try {
    const [users] = await db.query(
      `SELECT id, name, email, role, created_at 
       FROM users 
       ORDER BY created_at DESC 
       LIMIT 10`
    )
    res.json(users)
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch recent users" })
  }
})

module.exports = router
