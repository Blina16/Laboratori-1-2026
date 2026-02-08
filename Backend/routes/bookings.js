const express = require("express")
const db = require("../config/db")
const router = express.Router()

// Create a new booking
router.post("/", async (req, res) => {
  const { student_id, tutor_id, subject, scheduled_date, duration_minutes, notes, price } = req.body
  
  if (!student_id || !tutor_id || !scheduled_date) {
    return res.status(400).json({ 
      message: "Student, tutor, and scheduled date are required",
      required: ["student_id", "tutor_id", "scheduled_date"]
    })
  }

  try {
    // Check if tutor exists and get their pricing
    const [tutor] = await db.query(
      `SELECT u.id, u.name, tp.price_per_hour 
       FROM users u 
       LEFT JOIN teacher_profiles tp ON u.id = tp.user_id 
       WHERE u.id = ? AND u.role = 'teacher'`,
      [tutor_id]
    )

    if (tutor.length === 0) {
      return res.status(404).json({ message: "Tutor not found" })
    }

    // Calculate price if not provided
    const finalPrice = price || (tutor[0].price_per_hour * (duration_minutes || 60) / 60)

    // Create the booking
    const [result] = await db.query(
      `INSERT INTO student_tutor_sessions 
       (student_id, tutor_id, subject, session_date, duration_minutes, price, status, notes) 
       VALUES (?, ?, ?, ?, ?, ?, 'scheduled', ?)`,
      [student_id, tutor_id, subject || 'General Tutoring', scheduled_date, duration_minutes || 60, finalPrice, notes || null]
    )
    
    // Fetch the created booking with full details
    const [newBooking] = await db.query(
      `SELECT sts.*, u.name as student_name, t.name as tutor_name
       FROM student_tutor_sessions sts
       JOIN users u ON sts.student_id = u.id
       JOIN users t ON sts.tutor_id = t.id
       WHERE sts.id = ?`,
      [result.insertId]
    )
    
    res.status(201).json({ 
      message: "Booking created successfully",
      booking: newBooking[0]
    })
  } catch (err) {
    console.error('Failed to create booking:', err)
    res.status(500).json({ message: "Failed to create booking", error: err.message })
  }
})

// Get all bookings for a student
router.get("/student/:studentId", async (req, res) => {
  const { studentId } = req.params
  
  try {
    const [bookings] = await db.query(
      `SELECT sts.*, u.name as tutor_name, tp.subject as tutor_specialty, tp.price_per_hour
       FROM student_tutor_sessions sts
       JOIN users u ON sts.tutor_id = u.id
       LEFT JOIN teacher_profiles tp ON u.id = tp.user_id
       WHERE sts.student_id = ?
       ORDER BY sts.session_date DESC`,
      [studentId]
    )
    
    res.json(bookings)
  } catch (err) {
    console.error('Failed to fetch student bookings:', err)
    res.status(500).json({ message: "Failed to fetch student bookings", error: err.message })
  }
})

// Get all bookings for a tutor
router.get("/tutor/:tutorId", async (req, res) => {
  const { tutorId } = req.params
  
  try {
    const [bookings] = await db.query(
      `SELECT sts.*, u.name as student_name
       FROM student_tutor_sessions sts
       JOIN users u ON sts.student_id = u.id
       WHERE sts.tutor_id = ?
       ORDER BY sts.session_date DESC`,
      [tutorId]
    )
    
    res.json(bookings)
  } catch (err) {
    console.error('Failed to fetch tutor bookings:', err)
    res.status(500).json({ message: "Failed to fetch tutor bookings", error: err.message })
  }
})

// Get single booking by ID
router.get("/:id", async (req, res) => {
  const { id } = req.params
  
  try {
    const [booking] = await db.query(
      `SELECT sts.*, u.name as student_name, t.name as tutor_name, tp.subject as tutor_specialty
       FROM student_tutor_sessions sts
       JOIN users u ON sts.student_id = u.id
       JOIN users t ON sts.tutor_id = t.id
       LEFT JOIN teacher_profiles tp ON t.id = tp.user_id
       WHERE sts.id = ?`,
      [id]
    )
    
    if (booking.length === 0) {
      return res.status(404).json({ message: "Booking not found" })
    }
    
    res.json(booking[0])
  } catch (err) {
    console.error('Failed to fetch booking:', err)
    res.status(500).json({ message: "Failed to fetch booking", error: err.message })
  }
})

// Update booking status
router.patch("/:id/status", async (req, res) => {
  const { id } = req.params
  const { status } = req.body
  
  if (!status || !['scheduled', 'completed', 'cancelled', 'no_show'].includes(status)) {
    return res.status(400).json({ 
      message: "Valid status is required",
      valid_statuses: ['scheduled', 'completed', 'cancelled', 'no_show']
    })
  }
  
  try {
    await db.query(
      "UPDATE student_tutor_sessions SET status = ? WHERE id = ?",
      [status, id]
    )
    
    // Fetch updated booking
    const [updatedBooking] = await db.query(
      `SELECT sts.*, u.name as student_name, t.name as tutor_name
       FROM student_tutor_sessions sts
       JOIN users u ON sts.student_id = u.id
       JOIN users t ON sts.tutor_id = t.id
       WHERE sts.id = ?`,
      [id]
    )
    
    res.json({ 
      message: "Booking status updated successfully",
      booking: updatedBooking[0]
    })
  } catch (err) {
    console.error('Failed to update booking status:', err)
    res.status(500).json({ message: "Failed to update booking status", error: err.message })
  }
})

// Cancel booking
router.delete("/:id", async (req, res) => {
  const { id } = req.params
  
  try {
    // Check if booking exists
    const [existing] = await db.query(
      "SELECT id FROM student_tutor_sessions WHERE id = ?",
      [id]
    )

    if (existing.length === 0) {
      return res.status(404).json({ message: "Booking not found" })
    }

    // Soft delete by updating status to cancelled
    await db.query(
      "UPDATE student_tutor_sessions SET status = 'cancelled' WHERE id = ?",
      [id]
    )

    res.json({ message: "Booking cancelled successfully" })
  } catch (err) {
    console.error('Failed to cancel booking:', err)
    res.status(500).json({ message: "Failed to cancel booking", error: err.message })
  }
})

// Get tutor availability for a specific date
router.get("/tutor/:tutorId/availability", async (req, res) => {
  const { tutorId } = req.params
  const { date } = req.query
  
  if (!date) {
    return res.status(400).json({ message: "Date parameter is required" })
  }
  
  try {
    // Get all bookings for the tutor on the specified date
    const [bookings] = await db.query(
      `SELECT session_date, duration_minutes, status
       FROM student_tutor_sessions 
       WHERE tutor_id = ? AND DATE(session_date) = ? AND status IN ('scheduled', 'completed')
       ORDER BY session_date`,
      [tutorId, date]
    )
    
    res.json({
      date,
      tutor_id: tutorId,
      booked_slots: bookings,
      available: true // You can add logic here to check if tutor is available
    })
  } catch (err) {
    console.error('Failed to fetch tutor availability:', err)
    res.status(500).json({ message: "Failed to fetch tutor availability", error: err.message })
  }
})

module.exports = router
