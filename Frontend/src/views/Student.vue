const express = require('express')
const mongoose = require('mongoose')

const router = express.Router()

/* =========================
   MODEL (INLINE)
========================= */
const StudentCommentSchema = new mongoose.Schema(
  {
    studentId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'Student'
    },
    adminId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User'
    },
    comment: {
      type: String,
      required: true
    }
  },
  { timestamps: true }
)

const StudentComment = mongoose.model(
  'StudentComment',
  StudentCommentSchema
)

/* =========================
   ROUTES (CRUD)
========================= */

// 🔹 GET all comments for ONE student
router.get('/student/:studentId', async (req, res) => {
  try {
    const comments = await StudentComment.find({
      studentId: req.params.studentId
    }).sort({ createdAt: -1 })

    res.json(comments)
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch comments' })
  }
})

// 🔹 CREATE comment (ADMIN)
router.post('/', async (req, res) => {
  try {
    const { studentId, adminId, comment } = req.body

    const newComment = new StudentComment({
      studentId,
      adminId,
      comment
    })

    const saved = await newComment.save()
    res.status(201).json(saved)
  } catch (error) {
    res.status(400).json({ message: 'Failed to create comment' })
  }
})

// 🔹 UPDATE comment
router.put('/:id', async (req, res) => {
  try {
    const updated = await StudentComment.findByIdAndUpdate(
      req.params.id,
      { comment: req.body.comment },
      { new: true }
    )

    if (!updated) {
      return res.status(404).json({ message: 'Comment not found' })
    }

    res.json(updated)
  } catch (error) {
    res.status(400).json({ message: 'Failed to update comment' })
  }
})

// 🔹 DELETE comment
router.delete('/:id', async (req, res) => {
  try {
    const deleted = await StudentComment.findByIdAndDelete(req.params.id)

    if (!deleted) {
      return res.status(404).json({ message: 'Comment not found' })
    }

    res.json({ message: 'Comment deleted successfully' })
  } catch (error) {
    res.status(400).json({ message: 'Failed to delete comment' })
  }
})

module.exports = router
