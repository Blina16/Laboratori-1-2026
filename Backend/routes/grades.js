const express = require("express")
const db = require("../config/db")
const router = express.Router()

// =========================
// GET all grades
// =========================
router.get("/", async (req, res) => {
  try {
    const [grades] = await db.query(
      `SELECT g.id, g.student_id, g.subject, g.grade, g.assignment_name, 
              g.date, g.comments, g.created_at,
              u.name as student_name, u.email as student_email,
              sp.surname, sp.age, sp.location
       FROM grades g
       JOIN users u ON g.student_id = u.id
       LEFT JOIN student_profiles sp ON u.id = sp.user_id
       WHERE u.role = 'student'
       ORDER BY g.date DESC, g.created_at DESC`
    )
    res.json(grades)
  } catch (err) {
    console.error(err)
    res.status(500).json({ message: "Failed to fetch grades", error: err.message })
  }
})

// =========================
// GET grades by student ID
// =========================
router.get("/student/:studentId", async (req, res) => {
  try {
    const [grades] = await db.query(
      `SELECT g.id, g.student_id, g.subject, g.grade, g.assignment_name, 
              g.date, g.comments, g.created_at,
              u.name as student_name, u.email as student_email,
              sp.surname, sp.age, sp.location
       FROM grades g
       JOIN users u ON g.student_id = u.id
       LEFT JOIN student_profiles sp ON u.id = sp.user_id
       WHERE u.role = 'student' AND g.student_id = ?
       ORDER BY g.date DESC`,
      [req.params.studentId]
    )
    res.json(grades)
  } catch (err) {
    console.error(err)
    res.status(500).json({ message: "Failed to fetch student grades", error: err.message })
  }
})

// =========================
// GET grade by ID
// =========================
router.get("/:id", async (req, res) => {
  try {
    const [grades] = await db.query(
      `SELECT g.id, g.student_id, g.subject, g.grade, g.assignment_name, 
              g.date, g.comments, g.created_at,
              u.name as student_name, u.email as student_email,
              sp.surname, sp.age, sp.location
       FROM grades g
       JOIN users u ON g.student_id = u.id
       LEFT JOIN student_profiles sp ON u.id = sp.user_id
       WHERE g.id = ?`,
      [req.params.id]
    )

    if (grades.length === 0) {
      return res.status(404).json({ message: "Grade not found" })
    }

    res.json(grades[0])
  } catch (err) {
    console.error(err)
    res.status(500).json({ message: "Failed to fetch grade", error: err.message })
  }
})

// =========================
// CREATE grade
// =========================
router.post("/", async (req, res) => {
  const { student_id, subject, grade, assignment_name, date, comments } = req.body

  if (!student_id || !subject || !grade) {
    return res.status(400).json({ 
      message: "Student ID, subject, and grade are required",
      required: ["student_id", "subject", "grade"]
    })
  }

  // Validate grade range
  if (grade < 0 || grade > 100) {
    return res.status(400).json({ message: "Grade must be between 0 and 100" })
  }

  try {
    // Check if student exists
    const [students] = await db.query(
      `SELECT id, name FROM users WHERE id = ? AND role = 'student'`,
      [student_id]
    )

    if (students.length === 0) {
      return res.status(404).json({ message: "Student not found" })
    }

    const [result] = await db.query(
      `INSERT INTO grades (student_id, subject, grade, assignment_name, date, comments)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [student_id, subject.trim(), grade, assignment_name?.trim() || null, date || null, comments?.trim() || null]
    )

    // Get the created grade with student info
    const [newGrade] = await db.query(
      `SELECT g.id, g.student_id, g.subject, g.grade, g.assignment_name, 
              g.date, g.comments, g.created_at,
              u.name as student_name, u.email as student_email,
              sp.surname, sp.age, sp.location
       FROM grades g
       JOIN users u ON g.student_id = u.id
       LEFT JOIN student_profiles sp ON u.id = sp.user_id
       WHERE g.id = ?`,
      [result.insertId]
    )

    res.status(201).json(newGrade[0])
  } catch (err) {
    console.error(err)
    res.status(500).json({ message: "Failed to create grade", error: err.message })
  }
})

// =========================
// UPDATE grade
// =========================
router.put("/:id", async (req, res) => {
  const { subject, grade, assignment_name, date, comments } = req.body

  if (!subject || !grade) {
    return res.status(400).json({ 
      message: "Subject and grade are required",
      required: ["subject", "grade"]
    })
  }

  // Validate grade range
  if (grade < 0 || grade > 100) {
    return res.status(400).json({ message: "Grade must be between 0 and 100" })
  }

  try {
    // Check if grade exists
    const [existingGrades] = await db.query(
      `SELECT id FROM grades WHERE id = ?`,
      [req.params.id]
    )

    if (existingGrades.length === 0) {
      return res.status(404).json({ message: "Grade not found" })
    }

    await db.query(
      `UPDATE grades 
       SET subject = ?, grade = ?, assignment_name = ?, date = ?, comments = ?
       WHERE id = ?`,
      [subject.trim(), grade, assignment_name?.trim() || null, date || null, comments?.trim() || null, req.params.id]
    )

    // Get the updated grade with student info
    const [updatedGrade] = await db.query(
      `SELECT g.id, g.student_id, g.subject, g.grade, g.assignment_name, 
              g.date, g.comments, g.created_at,
              u.name as student_name, u.email as student_email,
              sp.surname, sp.age, sp.location
       FROM grades g
       JOIN users u ON g.student_id = u.id
       LEFT JOIN student_profiles sp ON u.id = sp.user_id
       WHERE g.id = ?`,
      [req.params.id]
    )

    res.json(updatedGrade[0])
  } catch (err) {
    console.error(err)
    res.status(500).json({ message: "Failed to update grade", error: err.message })
  }
})

// =========================
// DELETE grade
// =========================
router.delete("/:id", async (req, res) => {
  try {
    // Check if grade exists
    const [existingGrades] = await db.query(
      `SELECT id FROM grades WHERE id = ?`,
      [req.params.id]
    )

    if (existingGrades.length === 0) {
      return res.status(404).json({ message: "Grade not found" })
    }

    await db.query(
      `DELETE FROM grades WHERE id = ?`,
      [req.params.id]
    )

    res.json({ message: "Grade deleted successfully" })
  } catch (err) {
    console.error(err)
    res.status(500).json({ message: "Failed to delete grade", error: err.message })
  }
})

// =========================
// GET grade statistics
// =========================
router.get("/stats/overview", async (req, res) => {
  try {
    const [stats] = await db.query(
      `SELECT 
         COUNT(*) as total_grades,
         AVG(grade) as average_grade,
         MIN(grade) as lowest_grade,
         MAX(grade) as highest_grade,
         COUNT(DISTINCT student_id) as students_with_grades,
         COUNT(DISTINCT subject) as subjects_count
       FROM grades g
       JOIN users u ON g.student_id = u.id
       WHERE u.role = 'student'`
    )

    const [subjectStats] = await db.query(
      `SELECT 
         subject,
         COUNT(*) as grade_count,
         AVG(grade) as average_grade,
         MIN(grade) as lowest_grade,
         MAX(grade) as highest_grade
       FROM grades g
       JOIN users u ON g.student_id = u.id
       WHERE u.role = 'student'
       GROUP BY subject
       ORDER BY average_grade DESC`
    )

    res.json({
      overview: stats[0],
      by_subject: subjectStats
    })
  } catch (err) {
    console.error(err)
    res.status(500).json({ message: "Failed to fetch grade statistics", error: err.message })
  }
})

module.exports = router
