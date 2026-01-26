const express = require("express")
const bcrypt = require("bcryptjs")
const db = require("../config/db")
const router = express.Router()

// =========================
// GET all students (role = 'student')
// =========================
router.get("/", async (req, res) => {
  try {
    let students
    try {
      // Try to get students with profile data
      students = await db.query(
        `SELECT u.id, u.name, u.email, u.created_at,
                sp.surname, sp.age, sp.location
         FROM users u
         LEFT JOIN student_profiles sp ON u.id = sp.user_id
         WHERE u.role = 'student'
         ORDER BY u.created_at DESC`
      )
    } catch (err) {
      // Fallback to basic user data if profile table doesn't exist
      console.log('Student profile table might not exist, fetching basic user data:', err.message)
      students = await db.query(
        `SELECT id, name, email, created_at FROM users 
         WHERE role = 'student'
         ORDER BY created_at DESC`
      )
    }
    res.json(students[0])
  } catch (err) {
    console.error(err)
    res.status(500).json({ message: "Failed to fetch students", error: err.message })
  }
})

// =========================
// GET student by ID
// =========================
router.get("/:id", async (req, res) => {
  try {
    const [students] = await db.query(
      `SELECT u.id, u.name, u.email, u.created_at,
              sp.surname, sp.age, sp.location
       FROM users u
       LEFT JOIN student_profiles sp ON u.id = sp.user_id
       WHERE u.role = 'student' AND u.id = ?`,
      [req.params.id]
    )

    if (students.length === 0) {
      return res.status(404).json({ message: "Student not found" })
    }

    res.json(students[0])
  } catch (err) {
    console.error(err)
    res.status(500).json({ message: "Failed to fetch student", error: err.message })
  }
})

// =========================
// CREATE student
// =========================
router.post("/", async (req, res) => {
  const { name, surname, age, location, email } = req.body

  if (!name?.trim() || !email?.trim()) {
    return res.status(400).json({ message: "Name and email are required" })
  }

  try {
    const [result] = await db.query(
      `INSERT INTO users (name, email, password, role)
       VALUES (?, ?, ?, 'student')`,
      [name.trim(), email.trim().toLowerCase(), 'defaultpassword']
    )

    const userId = result.insertId

    // Try to create student profile, but don't fail if table doesn't exist
    try {
      const [profileResult] = await db.query(
        `INSERT INTO student_profiles (user_id, surname, age, location) 
         VALUES (?, ?, ?, ?)`,
        [userId, surname?.trim() || null, age || null, location?.trim() || null]
      )
    } catch (profileErr) {
      console.log('Student profile table might not exist, continuing without profile data:', profileErr.message)
      // Continue without profile data - table might not exist yet
    }

    // Try to get student with profile data, fallback to basic user data
    let newStudent
    try {
      const [students] = await db.query(
        `SELECT u.id, u.name, u.email, u.created_at,
                sp.surname, sp.age, sp.location
         FROM users u
         LEFT JOIN student_profiles sp ON u.id = sp.user_id
         WHERE u.id = ?`,
        [result.insertId]
      )
      newStudent = students[0]
    } catch (selectErr) {
      // Fallback to basic user data if profile table doesn't exist
      const [basicStudents] = await db.query(
        `SELECT id, name, email, created_at FROM users WHERE id = ?`,
        [result.insertId]
      )
      newStudent = basicStudents[0]
    }

    res.status(201).json(newStudent)
  } catch (err) {
    console.error(err)
    if (err.code === 'ER_DUP_ENTRY') {
      return res.status(409).json({ message: "Email already exists" })
    }
    res.status(500).json({ message: "Failed to create student", error: err.message })
  }
})

// =========================
// UPDATE student
// =========================
router.put("/:id", async (req, res) => {
  const { name, email } = req.body

  if (!name?.trim() || !email?.trim()) {
    return res.status(400).json({ message: "Name and email are required" })
  }

  try {
    const [result] = await db.query(
      `UPDATE users
       SET name = ?, email = ?
       WHERE id = ? AND role = 'student'`,
      [name.trim(), email.trim().toLowerCase(), req.params.id]
    )

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Student not found" })
    }

    const [updatedStudent] = await db.query(
      `SELECT id, name, email, created_at
       FROM users
       WHERE id = ?`,
      [req.params.id]
    )

    res.json(updatedStudent[0])
  } catch (err) {
    console.error(err)
    if (err.code === 'ER_DUP_ENTRY') {
      return res.status(409).json({ message: "Email already exists" })
    }
    res.status(500).json({ message: "Failed to update student", error: err.message })
  }
})

// =========================
// DELETE student
// =========================
router.delete("/:id", async (req, res) => {
  try {
    const [result] = await db.query(
      `DELETE FROM users WHERE id = ? AND role = 'student'`,
      [req.params.id]
    )

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Student not found" })
    }

    res.json({ message: "Student deleted successfully" })
  } catch (err) {
    console.error(err)
    res.status(500).json({ message: "Failed to delete student", error: err.message })
  }
})

module.exports = router
