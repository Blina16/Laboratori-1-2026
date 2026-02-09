const express = require("express");
const db = require("../config/db");
const router = express.Router();

// =========================
// GET all payments
// =========================
router.get("/", async (req, res) => {
  try {
    const [payments] = await db.query(`
      SELECT p.*, 
             s.name as student_name, s.email as student_email,
             t.name as tutor_name, t.email as tutor_email,
             c.title as course_title
      FROM payments p
      LEFT JOIN users s ON p.student_id = s.id
      LEFT JOIN users t ON p.tutor_id = t.id
      LEFT JOIN courses c ON p.course_id = c.id
      ORDER BY p.created_at DESC
    `);
    res.json(payments);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch payments", error: err.message });
  }
});

// =========================
// GET single payment
// =========================
router.get("/:id", async (req, res) => {
  try {
    const [payments] = await db.query(`
      SELECT p.*, 
             s.name as student_name, s.email as student_email,
             t.name as tutor_name, t.email as tutor_email,
             c.title as course_title
      FROM payments p
      LEFT JOIN users s ON p.student_id = s.id
      LEFT JOIN users t ON p.tutor_id = t.id
      LEFT JOIN courses c ON p.course_id = c.id
      WHERE p.id = ?
    `, [req.params.id]);

    if (payments.length === 0) {
      return res.status(404).json({ message: "Payment not found" });
    }

    res.json(payments[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch payment", error: err.message });
  }
});

// =========================
// CREATE payment
// =========================
router.post("/", async (req, res) => {
  const {
    student_id,
    tutor_id,
    course_id,
    amount,
    payment_date,
    payment_method = 'credit_card',
    status = 'pending',
    transaction_id,
    notes
  } = req.body;

  if (!student_id || !tutor_id || !amount || !payment_date) {
    return res.status(400).json({ 
      message: "Student ID, tutor ID, amount, and payment date are required" 
    });
  }

  try {
    const [result] = await db.query(
      `INSERT INTO payments 
       (student_id, tutor_id, course_id, amount, payment_date, payment_method, status, transaction_id, notes)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        student_id,
        tutor_id,
        course_id || null,
        amount,
        payment_date,
        payment_method,
        status,
        transaction_id || null,
        notes || null
      ]
    );

    const [newPayment] = await db.query(`
      SELECT p.*, 
             s.name as student_name, s.email as student_email,
             t.name as tutor_name, t.email as tutor_email,
             c.title as course_title
      FROM payments p
      LEFT JOIN users s ON p.student_id = s.id
      LEFT JOIN users t ON p.tutor_id = t.id
      LEFT JOIN courses c ON p.course_id = c.id
      WHERE p.id = ?
    `, [result.insertId]);

    res.status(201).json(newPayment[0]);
  } catch (err) {
    console.error('Failed to create payment:', err);
    
    // Handle specific database errors - same as tutors
    if (err.code === 'ER_NO_SUCH_TABLE') {
      return res.status(500).json({ 
        message: "Database tables not found. Please run database initialization.", 
        error: err.message 
      });
    }
    
    if (err.code === 'ER_DUP_ENTRY') {
      return res.status(400).json({ 
        message: "A payment with this transaction ID already exists", 
        error: err.message 
      });
    }
    
    if (err.code === 'ER_NO_REFERENCED_ROW_2') {
      return res.status(500).json({ 
        message: "Invalid student, tutor, or course ID. Please check references.", 
        error: err.message 
      });
    }
    
    res.status(500).json({ message: "Failed to create payment", error: err.message });
  }
});

// =========================
// UPDATE payment
// =========================
router.put("/:id", async (req, res) => {
  const {
    student_id,
    tutor_id,
    course_id,
    amount,
    payment_date,
    payment_method,
    status,
    transaction_id,
    notes
  } = req.body;

  try {
    const [result] = await db.query(
      `UPDATE payments 
       SET student_id = ?, tutor_id = ?, course_id = ?, amount = ?, 
           payment_date = ?, payment_method = ?, status = ?, 
           transaction_id = ?, notes = ?, updated_at = CURRENT_TIMESTAMP
       WHERE id = ?`,
      [
        student_id,
        tutor_id,
        course_id || null,
        amount,
        payment_date,
        payment_method,
        status,
        transaction_id || null,
        notes || null,
        req.params.id
      ]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Payment not found" });
    }

    const [updatedPayment] = await db.query(`
      SELECT p.*, 
             s.name as student_name, s.email as student_email,
             t.name as tutor_name, t.email as tutor_email,
             c.title as course_title
      FROM payments p
      LEFT JOIN users s ON p.student_id = s.id
      LEFT JOIN users t ON p.tutor_id = t.id
      LEFT JOIN courses c ON p.course_id = c.id
      WHERE p.id = ?
    `, [req.params.id]);

    res.json(updatedPayment[0]);
  } catch (err) {
    console.error('Failed to update payment:', err);
    
    if (err.code === 'ER_NO_REFERENCED_ROW_2') {
      return res.status(500).json({ 
        message: "Invalid student, tutor, or course ID. Please check references.", 
        error: err.message 
      });
    }
    
    res.status(500).json({ message: "Failed to update payment", error: err.message });
  }
});

// =========================
// DELETE payment
// =========================
router.delete("/:id", async (req, res) => {
  try {
    const [result] = await db.query("DELETE FROM payments WHERE id = ?", [req.params.id]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Payment not found" });
    }

    res.json({ message: "Payment deleted successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to delete payment", error: err.message });
  }
});

module.exports = router;
