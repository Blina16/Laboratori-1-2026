const express = require("express")
const db = require("../config/db")
const router = express.Router()

// Create a new message from student to tutor
router.post("/", async (req, res) => {
  const { sender_id, receiver_id, subject, message, tutor_id } = req.body
  
  if (!sender_id || !receiver_id || !message) {
    return res.status(400).json({ 
      message: "Sender, receiver, and message are required",
      required: ["sender_id", "receiver_id", "message"]
    })
  }

  try {
    // Verify sender and receiver exist
    const [sender] = await db.query(
      "SELECT id, name, role FROM users WHERE id = ?",
      [sender_id]
    )
    
    const [receiver] = await db.query(
      "SELECT id, name, role FROM users WHERE id = ?",
      [receiver_id]
    )

    if (sender.length === 0 || receiver.length === 0) {
      return res.status(404).json({ message: "Sender or receiver not found" })
    }

    // Create the message
    const [result] = await db.query(
      `INSERT INTO messages (sender_id, receiver_id, subject, message, tutor_id) 
       VALUES (?, ?, ?, ?, ?)`,
      [sender_id, receiver_id, subject || 'New Message', message, tutor_id || null]
    )
    
    // Fetch the created message with full details
    const [newMessage] = await db.query(
      `SELECT m.*, s.name as sender_name, r.name as receiver_name
       FROM messages m
       JOIN users s ON m.sender_id = s.id
       JOIN users r ON m.receiver_id = r.id
       WHERE m.id = ?`,
      [result.insertId]
    )
    
    res.status(201).json({ 
      message: "Message sent successfully",
      message_data: newMessage[0]
    })
  } catch (err) {
    console.error('Failed to send message:', err)
    res.status(500).json({ message: "Failed to send message", error: err.message })
  }
})

// Get messages for a user (both sent and received)
router.get("/user/:userId", async (req, res) => {
  const { userId } = req.params
  
  try {
    const [messages] = await db.query(
      `SELECT m.*, s.name as sender_name, r.name as receiver_name,
              CASE WHEN m.sender_id = ? THEN 'sent' ELSE 'received' END as direction
       FROM messages m
       JOIN users s ON m.sender_id = s.id
       JOIN users r ON m.receiver_id = r.id
       WHERE m.sender_id = ? OR m.receiver_id = ?
       ORDER BY m.created_at DESC`,
      [userId, userId, userId]
    )
    
    res.json(messages)
  } catch (err) {
    console.error('Failed to fetch messages:', err)
    res.status(500).json({ message: "Failed to fetch messages", error: err.message })
  }
})

// Get conversation between two users
router.get("/conversation/:userId1/:userId2", async (req, res) => {
  const { userId1, userId2 } = req.params
  
  try {
    const [messages] = await db.query(
      `SELECT m.*, s.name as sender_name, r.name as receiver_name
       FROM messages m
       JOIN users s ON m.sender_id = s.id
       JOIN users r ON m.receiver_id = r.id
       WHERE (m.sender_id = ? AND m.receiver_id = ?) OR (m.sender_id = ? AND m.receiver_id = ?)
       ORDER BY m.created_at ASC`,
      [userId1, userId2, userId2, userId1]
    )
    
    res.json(messages)
  } catch (err) {
    console.error('Failed to fetch conversation:', err)
    res.status(500).json({ message: "Failed to fetch conversation", error: err.message })
  }
})

// Mark message as read
router.patch("/:id/read", async (req, res) => {
  const { id } = req.params
  
  try {
    await db.query(
      "UPDATE messages SET is_read = TRUE WHERE id = ?",
      [id]
    )
    
    res.json({ message: "Message marked as read" })
  } catch (err) {
    console.error('Failed to mark message as read:', err)
    res.status(500).json({ message: "Failed to mark message as read", error: err.message })
  }
})

// Delete message
router.delete("/:id", async (req, res) => {
  const { id } = req.params
  
  try {
    await db.query("DELETE FROM messages WHERE id = ?", [id])
    res.json({ message: "Message deleted successfully" })
  } catch (err) {
    console.error('Failed to delete message:', err)
    res.status(500).json({ message: "Failed to delete message", error: err.message })
  }
})

module.exports = router
