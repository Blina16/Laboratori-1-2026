const express = require("express")
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")
const db = require("../config/db")

const router = express.Router()

// =======================
// REGISTER
// =======================
router.post("/register", async (req, res) => {
  const { name, email, password, role } = req.body

  // LINE: basic validation
  if (!name || !email || !password) {
    return res.status(400).json({ message: "All fields are required" })
  }

  try {
    // LINE: check if user already exists
    const [existing] = await db.query(
      "SELECT id FROM users WHERE email = ?",
      [email]
    )

    if (existing.length > 0) {
      return res.status(400).json({ message: "User already exists" })
    }

    // =======================
    // LINE: ROLE LOGIC (ONLY ONE ADMIN)
    // =======================
    let userRole = "student"

    if (role === "admin") {
      const [admins] = await db.query(
        "SELECT id FROM users WHERE role = 'admin' LIMIT 1"
      )

      if (admins.length > 0) {
        return res.status(403).json({
          message: "Admin already exists"
        })
      }

      userRole = "admin"
    }

    // LINE: hash password
    const hashedPassword = await bcrypt.hash(password, 10)

    // LINE: insert user
    await db.query(
      "INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)",
      [name, email, hashedPassword, userRole]
    )

    // LINE: fetch created user
    const [rows] = await db.query(
      "SELECT * FROM users WHERE email = ?",
      [email]
    )

    const user = rows[0]

    // LINE: create JWT
    const token = jwt.sign(
      { id: user.id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    )

    // LINE: response
    res.status(201).json({
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    })
  } catch (err) {
    console.error(err)
    res.status(500).json({ message: "Signup failed" })
  }
})

// =======================
// LOGIN
// =======================
router.post("/login", async (req, res) => {
  const { email, password } = req.body

  try {
    // LINE: find user
    const [rows] = await db.query(
      "SELECT * FROM users WHERE email = ?",
      [email]
    )

    if (rows.length === 0) {
      return res.status(400).json({ message: "Invalid credentials" })
    }

    const user = rows[0]

    // LINE: check password
    const isMatch = await bcrypt.compare(password, user.password)

    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" })
    }

    // LINE: create JWT
    const token = jwt.sign(
      { id: user.id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    )

    // LINE: response
    res.json({
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    })
  } catch (err) {
    console.error(err)
    res.status(500).json({ message: "Login failed" })
  }
})

module.exports = router
