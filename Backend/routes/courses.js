const express = require("express")
const db = require("../config/db")
const router = express.Router()

// =========================
// GET all courses
// =========================
router.get("/", async (req, res) => {
  try {
    const [courses] = await db.query(
      `SELECT c.*, u.name as tutor_name 
       FROM courses c 
       LEFT JOIN users u ON c.assigned_tutor_id = u.id 
       ORDER BY c.created_at DESC`
    )
    res.json(courses)
  } catch (err) {
    console.error(err)
    res.status(500).json({ message: "Failed to fetch courses", error: err.message })
  }
})

// =========================
// GET courses by teacher
// =========================
router.get("/teacher/:teacherId", async (req, res) => {
  try {
    const [courses] = await db.query(
      "SELECT * FROM courses WHERE assigned_tutor_id = ? ORDER BY created_at DESC",
      [req.params.teacherId]
    )
    res.json(courses)
  } catch (err) {
    console.error(err)
    res.status(500).json({ message: "Failed to fetch teacher courses", error: err.message })
  }
})

// =========================
// GET course by ID
// =========================
router.get("/:id", async (req, res) => {
  try {
    const [courses] = await db.query(
      `SELECT c.*, u.name as tutor_name 
       FROM courses c 
       LEFT JOIN users u ON c.assigned_tutor_id = u.id 
       WHERE c.id = ?`,
      [req.params.id]
    )

    if (courses.length === 0) {
      return res.status(404).json({ message: "Course not found" })
    }

    res.json(courses[0])
  } catch (err) {
    console.error(err)
    res.status(500).json({ message: "Failed to fetch course", error: err.message })
  }
})

// =========================
// CREATE course
// =========================
router.post("/", async (req, res) => {
  const name = (req.body.name ?? req.body.title ?? "").toString()
  const description = (req.body.description ?? "").toString()
  const duration = (req.body.duration ?? "").toString()
  const level = (req.body.level ?? "").toString()
  const price = req.body.price ?? 0

  const assignedTutorId =
    req.body.assigned_tutor_id ??
    req.body.assignedTutorId ??
    req.body.teacher_id ??
    req.body.teacherId ??
    req.body.tutor_id ??
    req.body.tutorId ??
    null

  if (!name.trim()) {
    return res.status(400).json({ message: "Course name is required" })
  }

  try {
    const [result] = await db.query(
      `INSERT INTO courses 
       (name, description, duration, level, price, assigned_tutor_id)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [
        name.trim(),
        description.trim() || null,
        duration.trim() || null,
        level.trim() || null,
        price,
        assignedTutorId
      ]
    )

    const [newCourse] = await db.query(
      `SELECT c.*, u.name as tutor_name
       FROM courses c
       LEFT JOIN users u ON c.assigned_tutor_id = u.id
       WHERE c.id = ?`,
      [result.insertId]
    )

    res.status(201).json(newCourse[0])
  } catch (err) {
    console.error(err)
    res.status(500).json({ message: "Failed to create course", error: err.message })
  }
})

// =========================
// UPDATE course
// =========================
router.put("/:id", async (req, res) => {
  const name = (req.body.name ?? req.body.title ?? "").toString()
  const description = (req.body.description ?? "").toString()
  const duration = (req.body.duration ?? "").toString()
  const level = (req.body.level ?? "").toString()
  const price = req.body.price ?? 0

  const assignedTutorId =
    req.body.assigned_tutor_id ??
    req.body.assignedTutorId ??
    req.body.teacher_id ??
    req.body.teacherId ??
    req.body.tutor_id ??
    req.body.tutorId ??
    null

  if (!name.trim()) {
    return res.status(400).json({ message: "Course name is required" })
  }

  try {
    const [result] = await db.query(
      `UPDATE courses 
       SET name = ?, description = ?, duration = ?, level = ?, price = ?, assigned_tutor_id = ?
       WHERE id = ?`,
      [
        name.trim(),
        description.trim() || null,
        duration.trim() || null,
        level.trim() || null,
        price,
        assignedTutorId,
        req.params.id
      ]
    )

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Course not found" })
    }

    const [updatedCourse] = await db.query(
      `SELECT c.*, u.name as tutor_name
       FROM courses c
       LEFT JOIN users u ON c.assigned_tutor_id = u.id
       WHERE c.id = ?`,
      [req.params.id]
    )

    res.json(updatedCourse[0])
  } catch (err) {
    console.error(err)
    res.status(500).json({ message: "Failed to update course", error: err.message })
  }
})

// =========================
// DELETE course
// =========================
router.delete("/:id", async (req, res) => {
  try {
    const [result] = await db.query("DELETE FROM courses WHERE id = ?", [req.params.id])

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Course not found" })
    }

    res.json({ message: "Course deleted successfully" })
  } catch (err) {
    console.error(err)
    res.status(500).json({ message: "Failed to delete course", error: err.message })
  }
})

module.exports = router
