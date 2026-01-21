const express = require("express")
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")
const db = require("../config/db")

const router = express.Router()

// REGISTER (students only)
router.post("/register", async (req, res) => {
  const { name, email, password } = req.body

  if (!name || !email || !password) {
    return res.status(400).json({ message: "All fields are required" })
  }

  try {
    const [existing] = await db.query(
      "SELECT id FROM users WHERE email = ?",
      [email]
    )

    if (existing.length > 0) {
      return res.status(400).json({ message: "User already exists" })
    }

    const hashedPassword = await bcrypt.hash(password, 10)

    // 👇 FORCE role to student
    await db.query(
      "INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, 'student')",
      [name, email, hashedPassword]
    )

    res.status(201).json({ message: "Account created successfully" })
  } catch (err) {
    res.status(500).json({ message: "Signup failed" })
  }
})

// LOGIN
router.post("/login", async (req, res) => {
  const { email, password } = req.body

  const [rows] = await db.query(
    "SELECT * FROM users WHERE email = ?",
    [email]
  )

  if (rows.length === 0) {
    return res.status(400).json({ message: "Invalid credentials" })
  }

  const user = rows[0]
  const isMatch = await bcrypt.compare(password, user.password)

  if (!isMatch) {
    return res.status(400).json({ message: "Invalid credentials" })
  }

  const token = jwt.sign(
    { id: user.id, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: "1d" }
  )

  res.json({
    token,
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role
    }
  })
})

module.exports = router
