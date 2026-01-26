const express = require("express");
const db = require("../config/db");
const router = express.Router();

// Simple test endpoint
router.get("/test", (req, res) => {
  res.json({ message: "Users route is working!" });
});

// Get all teachers
router.get("/teachers", async (req, res) => {
  try {
    console.log('🔍 Fetching teachers from database...');
    
    const [teachers] = await db.query(
      `SELECT id, name, email, created_at 
       FROM users 
       WHERE role = 'teacher' 
       ORDER BY created_at DESC`
    );
    
    console.log('✅ Teachers found:', teachers.length);
    res.json(teachers);
  } catch (err) {
    console.error('❌ Database error:', err);
    res.status(500).json({ message: "Failed to fetch teachers", error: err.message });
  }
});

module.exports = router;
