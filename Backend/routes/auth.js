const express = require("express")
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")
const db = require("../config/db")

const router = express.Router()

// REGISTER (with role selection)
router.post("/register", async (req, res) => {
  const { name, email, password, role } = req.body

  if (!name || !email || !password) {
    return res.status(400).json({ message: "All fields are required" })
  }

  // Validate role
  const validRoles = ['student', 'teacher']
  if (role && !validRoles.includes(role)) {
    return res.status(400).json({ message: "Invalid role. Must be 'student' or 'teacher'" })
  }

  // Default to student if no role provided
  const userRole = role || 'student'

  try {
    const [existing] = await db.query(
      "SELECT id FROM users WHERE email = ?",
      [email]
    )

    if (existing.length > 0) {
      return res.status(400).json({ message: "User already exists" })
    }

    const hashedPassword = await bcrypt.hash(password, 10)

    const [result] = await db.query(
      "INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)",
      [name, email, hashedPassword, userRole]
    )

    const userId = result.insertId
    const [rows] = await db.query(
      "SELECT id, name, email, role FROM users WHERE id = ?",
      [userId]
    )

    const createdUser = rows[0]
    const secret = process.env.JWT_SECRET || "dev_secret"
    const token = jwt.sign(
      { id: createdUser.id, role: createdUser.role },
      secret,
      { expiresIn: "1d" }
    )

    res.status(201).json({
      token,
      user: createdUser
    })
  } catch (err) {
    res.status(500).json({ message: "Signup failed" })
  }
})

// LOGIN
router.post("/login", async (req, res) => {
  const { email, password } = req.body

  try {
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

    const secret = process.env.JWT_SECRET || "dev_secret"
    const token = jwt.sign(
      { id: user.id, role: user.role },
      secret,
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
  } catch (err) {
    res.status(500).json({ message: "Login failed" })
  }
})

// ADMIN REGISTER (requires admin key)
router.post("/register-admin", async (req, res) => {
  const { name, email, password, adminKey } = req.body

  if (!name || !email || !password || !adminKey) {
    return res.status(400).json({ message: "All fields including admin key are required" })
  }

  // Verify admin key (you should use a more secure method in production)
  const ADMIN_SECRET_KEY = process.env.ADMIN_SECRET_KEY || "admin123"
  if (adminKey !== ADMIN_SECRET_KEY) {
    return res.status(403).json({ message: "Invalid admin key" })
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

    const [result] = await db.query(
      "INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)",
      [name, email, hashedPassword, 'admin']
    )

    const userId = result.insertId
    const [rows] = await db.query(
      "SELECT id, name, email, role FROM users WHERE id = ?",
      [userId]
    )

    const createdUser = rows[0]
    const secret = process.env.JWT_SECRET || "dev_secret"
    const token = jwt.sign(
      { id: createdUser.id, role: createdUser.role },
      secret,
      { expiresIn: "1d" }
    )

    res.status(201).json({
      token,
      user: createdUser
    })
  } catch (err) {
    res.status(500).json({ message: "Admin registration failed" })
  }
})

module.exports = router
