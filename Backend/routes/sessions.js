const express = require("express")
const db = require("../config/db")
const router = express.Router()

// Get all sessions
router.get("/", async (req, res) => {
  try {
    const [sessions] = await db.query(
      `SELECT s.*, u.name as student_name, t.name as teacher_name, c.title as course_title
       FROM sessions s
       JOIN users u ON s.student_id = u.id
       JOIN users t ON s.teacher_id = t.id
       LEFT JOIN courses c ON s.course_id = c.id
       ORDER BY s.scheduled_at DESC`
    )
    res.json(sessions)
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch sessions" })
  }
})

// Get sessions by student
router.get("/student/:studentId", async (req, res) => {
  try {
    const [sessions] = await db.query(
      `SELECT s.*, t.name as teacher_name, c.title as course_title
       FROM sessions s
       JOIN users t ON s.teacher_id = t.id
       LEFT JOIN courses c ON s.course_id = c.id
       WHERE s.student_id = ?
       ORDER BY s.scheduled_at DESC`,
      [req.params.studentId]
    )
    res.json(sessions)
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch student sessions" })
  }
})

// Get sessions by teacher
router.get("/teacher/:teacherId", async (req, res) => {
  try {
    const [sessions] = await db.query(
      `SELECT s.*, u.name as student_name, c.title as course_title
       FROM sessions s
       JOIN users u ON s.student_id = u.id
       LEFT JOIN courses c ON s.course_id = c.id
       WHERE s.teacher_id = ?
       ORDER BY s.scheduled_at DESC`,
      [req.params.teacherId]
    )
    res.json(sessions)
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch teacher sessions" })
  }
})

// Create session
router.post("/", async (req, res) => {
  const { student_id, teacher_id, course_id, scheduled_at, duration, status } = req.body
  
  if (!student_id || !teacher_id || !scheduled_at) {
    return res.status(400).json({ message: "Student, teacher, and scheduled time are required" })
  }

  try {
    const [result] = await db.query(
      "INSERT INTO sessions (student_id, teacher_id, course_id, scheduled_at, duration, status) VALUES (?, ?, ?, ?, ?, ?)",
      [student_id, teacher_id, course_id, scheduled_at, duration || 60, status || 'scheduled']
    )
    
    const [newSession] = await db.query(
      `SELECT s.*, u.name as student_name, t.name as teacher_name, c.title as course_title
       FROM sessions s
       JOIN users u ON s.student_id = u.id
       JOIN users t ON s.teacher_id = t.id
       LEFT JOIN courses c ON s.course_id = c.id
       WHERE s.id = ?`,
      [result.insertId]
    )
    
    res.status(201).json(newSession[0])
  } catch (err) {
    res.status(500).json({ message: "Failed to create session" })
  }
})

module.exports = router
