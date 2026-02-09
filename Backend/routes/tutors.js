const express = require("express")
const bcrypt = require("bcryptjs")
const db = require("../config/db")
const router = express.Router()

 // Search tutors by subject or name
 router.get("/search", async (req, res) => {
   const { subject, name, minPrice, maxPrice, minExperience } = req.query
 
   try {
     let query = `
       SELECT u.id, u.name, u.email, u.created_at,
              tp.experience, tp.subject, tp.price_per_hour, tp.bio,
              AVG(sr.rating) as average_rating,
              COUNT(sr.id) as total_reviews
       FROM users u
       LEFT JOIN teacher_profiles tp ON u.id = tp.user_id
       LEFT JOIN student_reviews sr ON u.id = sr.tutor_id
       WHERE u.role = 'teacher'
     `
     
     const params = []
 
     if (subject) {
       query += " AND tp.subject LIKE ?"
       params.push(`%${subject}%`)
     }
 
     if (name) {
       query += " AND u.name LIKE ?"
       params.push(`%${name}%`)
     }
 
     if (minPrice) {
       query += " AND tp.price_per_hour >= ?"
       params.push(parseFloat(minPrice))
     }
 
     if (maxPrice) {
       query += " AND tp.price_per_hour <= ?"
       params.push(parseFloat(maxPrice))
     }
 
     if (minExperience) {
       query += " AND tp.experience >= ?"
       params.push(parseInt(minExperience))
     }
 
     query += " GROUP BY u.id, u.name, u.email, u.created_at, tp.experience, tp.subject, tp.price_per_hour, tp.bio ORDER BY tp.price_per_hour ASC"
 
     const [tutors] = await db.query(query, params)
     res.json(tutors)
   } catch (err) {
     console.error('Failed to search tutors:', err)
     res.status(500).json({ message: "Failed to search tutors", error: err.message })
   }
 })
 
// Get all tutors with full profile information
 router.get("", async (req, res) => {
   try {
     const [tutors] = await db.query(
       `SELECT u.id, u.name, u.email, u.created_at,
               tp.experience, tp.subject, tp.price_per_hour, tp.bio,
               COUNT(s.id) as total_sessions
        FROM users u
        LEFT JOIN teacher_profiles tp ON u.id = tp.user_id
        LEFT JOIN sessions s ON u.id = s.teacher_id
        WHERE u.role = 'teacher'
        GROUP BY u.id, u.name, u.email, u.created_at, tp.experience, tp.subject, tp.price_per_hour, tp.bio
        ORDER BY u.created_at DESC`
     )
     res.json(tutors)
   } catch (err) {
     console.error('Failed to fetch tutors:', err)
     res.status(500).json({ message: "Failed to fetch tutors", error: err.message })
   }
 })

// Get single tutor by ID
router.get("/:id", async (req, res) => {
  const { id } = req.params

  try {
    const [tutor] = await db.query(
      `SELECT u.id, u.name, u.email, u.created_at,
              tp.experience, tp.subject, tp.price_per_hour, tp.bio,
              COUNT(s.id) as total_sessions
       FROM users u
       LEFT JOIN teacher_profiles tp ON u.id = tp.user_id
       LEFT JOIN sessions s ON u.id = s.teacher_id
       WHERE u.role = 'teacher' AND u.id = ?
       GROUP BY u.id, u.name, u.email, u.created_at, tp.experience, tp.subject, tp.price_per_hour, tp.bio`,
      [id]
    )
    
    if (tutor.length === 0) {
      return res.status(404).json({ message: "Tutor not found" })
    }
    
    res.json(tutor[0])
  } catch (err) {
    console.error('Failed to fetch tutor:', err)
    res.status(500).json({ message: "Failed to fetch tutor", error: err.message })
  }
})

// Create new tutor
router.post("/", async (req, res) => {
  const { name, email, password, surname, experience, subject, price, bio } = req.body

  if (!name || !email || !password) {
    return res.status(400).json({ 
      message: "Name, email, and password are required",
      required: ["name", "email", "password"]
    })
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
    const fullName = surname ? `${name} ${surname}` : name

    // Create user account
    const [userResult] = await db.query(
      "INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, 'teacher')",
      [fullName, email, hashedPassword]
    )

    const userId = userResult.insertId

    // Create teacher profile
    const [profileResult] = await db.query(
      `INSERT INTO teacher_profiles (user_id, experience, subject, price_per_hour, bio) 
       VALUES (?, ?, ?, ?, ?)`,
      [userId, experience || 0, subject || null, price || 0, bio || null]
    )

    // Fetch created tutor with full details
    const [newTutor] = await db.query(
      `SELECT u.id, u.name, u.email, u.created_at,
              tp.experience, tp.subject, tp.price_per_hour, tp.bio,
              COUNT(sts.id) as total_sessions,
              AVG(sr.rating) as average_rating,
              COUNT(sr.id) as total_reviews
       FROM users u
       LEFT JOIN teacher_profiles tp ON u.id = tp.user_id
       LEFT JOIN student_tutor_sessions sts ON u.id = sts.tutor_id
       LEFT JOIN student_reviews sr ON u.id = sr.tutor_id
       WHERE u.id = ?
       GROUP BY u.id, u.name, u.email, u.created_at, tp.experience, tp.subject, tp.price_per_hour, tp.bio`,
      [userId]
    )

    res.status(201).json({ 
      message: "Tutor created successfully",
      tutor: newTutor[0]
    })
  } catch (err) {
    console.error('Failed to create tutor:', err)
    
    // Handle specific database errors
    if (err.code === 'ER_NO_SUCH_TABLE') {
      return res.status(500).json({ 
        message: "Database tables not found. Please run database initialization.", 
        error: err.message 
      })
    }
    
    if (err.code === 'ER_DUP_ENTRY') {
      return res.status(400).json({ 
        message: "A user with this email already exists", 
        error: err.message 
      })
    }
    
    if (err.code === 'ER_NO_REFERENCED_ROW_2') {
      return res.status(500).json({ 
        message: "Database constraint error. Please check database setup.", 
        error: err.message 
      })
    }
    
    res.status(500).json({ message: "Failed to create tutor", error: err.message })
  }
})

// Update tutor
router.put("/:id", async (req, res) => {
  const { id } = req.params
  const { name, email, surname, experience, subject, price, bio } = req.body

  try {
    // Check if tutor exists
    const [existing] = await db.query(
      "SELECT id FROM users WHERE id = ? AND role = 'teacher'",
      [id]
    )

    if (existing.length === 0) {
      return res.status(404).json({ message: "Tutor not found" })
    }

    const fullName = surname ? `${name} ${surname}` : name

    // Update user basic info
    if (name || email) {
      await db.query(
        "UPDATE users SET name = ?, email = ? WHERE id = ?",
        [fullName, email, id]
      )
    }

    // Update teacher profile
    if (experience !== undefined || subject !== undefined || price !== undefined || bio !== undefined) {
      await db.query(
        `UPDATE teacher_profiles 
         SET experience = ?, subject = ?, price_per_hour = ?, bio = ?
         WHERE user_id = ?`,
        [experience, subject, price, bio, id]
      )
    }

    // Fetch updated tutor
    const [updatedTutor] = await db.query(
      `SELECT u.id, u.name, u.email, u.created_at,
              tp.experience, tp.subject, tp.price_per_hour, tp.bio,
              COUNT(sts.id) as total_sessions,
              AVG(sr.rating) as average_rating,
              COUNT(sr.id) as total_reviews
       FROM users u
       LEFT JOIN teacher_profiles tp ON u.id = tp.user_id
       LEFT JOIN student_tutor_sessions sts ON u.id = sts.tutor_id
       LEFT JOIN student_reviews sr ON u.id = sr.tutor_id
       WHERE u.id = ?
       GROUP BY u.id, u.name, u.email, u.created_at, tp.experience, tp.subject, tp.price_per_hour, tp.bio`,
      [id]
    )

    res.json({ 
      message: "Tutor updated successfully",
      tutor: updatedTutor[0]
    })
  } catch (err) {
    console.error('Failed to update tutor:', err)
    res.status(500).json({ message: "Failed to update tutor", error: err.message })
  }
})

// Delete tutor
router.delete("/:id", async (req, res) => {
  const { id } = req.params

  try {
    // Check if tutor exists
    const [existing] = await db.query(
      "SELECT id FROM users WHERE id = ? AND role = 'teacher'",
      [id]
    )

    if (existing.length === 0) {
      return res.status(404).json({ message: "Tutor not found" })
    }

    // Delete related records first (foreign key constraints)
    await db.query("DELETE FROM student_reviews WHERE tutor_id = ?", [id])
    await db.query("DELETE FROM student_tutor_sessions WHERE tutor_id = ?", [id])
    await db.query("DELETE FROM teacher_profiles WHERE user_id = ?", [id])
    await db.query("DELETE FROM users WHERE id = ?", [id])

    res.json({ message: "Tutor deleted successfully" })
  } catch (err) {
    console.error('Failed to delete tutor:', err)
    res.status(500).json({ message: "Failed to delete tutor", error: err.message })
  }
})

// Get tutor availability/schedule
router.get("/:id/schedule", async (req, res) => {
  const { id } = req.params

  try {
    const [schedule] = await db.query(
      `SELECT sts.id, sts.subject, sts.session_date, sts.duration_minutes, 
              sts.price, sts.status, sts.notes,
              u.name as student_name
       FROM student_tutor_sessions sts
       JOIN users u ON sts.student_id = u.id
       WHERE sts.tutor_id = ? AND sts.status = 'scheduled'
       ORDER BY sts.session_date ASC`,
      [id]
    )
    res.json(schedule)
  } catch (err) {
    console.error('Failed to fetch tutor schedule:', err)
    res.status(500).json({ message: "Failed to fetch tutor schedule", error: err.message })
  }
})

// Get tutor reviews
router.get("/:id/reviews", async (req, res) => {
  const { id } = req.params

  try {
    const [reviews] = await db.query(
      `SELECT sr.id, sr.rating, sr.review_text, sr.created_at,
              u.name as student_name
       FROM student_reviews sr
       JOIN users u ON sr.student_id = u.id
       WHERE sr.tutor_id = ?
       ORDER BY sr.created_at DESC`,
      [id]
    )
    res.json(reviews)
  } catch (err) {
    console.error('Failed to fetch tutor reviews:', err)
    res.status(500).json({ message: "Failed to fetch tutor reviews", error: err.message })
  }
})

module.exports = router
