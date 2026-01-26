const express = require("express");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

// Database connection (using the existing db config)
const db = require('./config/db');

// Add tutors endpoint - fetch real teachers from database (simplified)
app.get("/api/tutors", async (req, res) => {
  try {
    console.log('Fetching real teachers from database (simplified)');
    
    // Query to get teachers with their profiles - no availability needed
    const query = `
      SELECT 
        u.id,
        u.name,
        u.email,
        tp.subject,
        tp.bio,
        tp.price_per_hour,
        tp.experience
      FROM users u
      LEFT JOIN teacher_profiles tp ON u.id = tp.user_id
      WHERE u.role = 'teacher'
      ORDER BY u.name
    `;
    
    const [rows] = await db.execute(query);
    
    // Format the data - teachers are always available
    const tutors = rows.map(row => ({
      id: row.id,
      name: row.name,
      email: row.email,
      subject: row.subject || 'Multiple Subjects',
      bio: row.bio || 'Experienced tutor passionate about helping students succeed',
      price_per_hour: row.price_per_hour || 50,
      experience: row.experience || 0,
      rating: 4.5, // Default rating since no rating column
      available: true, // Teachers are always available
      status: 'Available for booking'
    }));
    
    console.log(`Found ${tutors.length} real teachers (always available)`);
    res.json(tutors);
    
  } catch (error) {
    console.error('Error fetching teachers from database:', error);
    // Fallback to sample data if database fails
    res.json([
      {
        id: 1,
        name: 'John Smith',
        subject: 'Mathematics',
        bio: 'Experienced math tutor with 10+ years of teaching experience. Specialized in algebra, calculus, and statistics.',
        price_per_hour: 50,
        experience: 10,
        email: 'john.smith@example.com',
        rating: 4.8,
        available: true,
        status: 'Available for booking'
      }
    ]);
  }
});

// Add root route for testing
app.get("/", (req, res) => {
  res.json({ message: "Simple test server is running!" });
});

// Add explicit POST route logging
app.use("/api/availability", (req, res, next) => {
  console.log(`${req.method} /api/availability - Body:`, req.body);
  next();
});

// Simple test endpoint
app.post("/api/availability/test", (req, res) => {
  console.log('Test endpoint hit!', req.body);
  res.json({ 
    message: "Test working!",
    received: req.body,
    timestamp: new Date().toISOString()
  });
});

// Simple availability creation
app.post("/api/availability", async (req, res) => {
  try {
    console.log('Availability creation:', req.body);
    
    const {
      teacher_id,
      date,
      start_time,
      end_time,
      max_students = 1,
      recurring_pattern,
      recurring_end_date,
      notes
    } = req.body;

    // Insert availability into database
    const insertQuery = `
      INSERT INTO teacher_availability 
      (teacher_id, date, start_time, end_time, max_students, recurring_pattern, recurring_end_date, notes)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `;
    
    const [result] = await db.execute(insertQuery, [
      teacher_id,
      date,
      start_time,
      end_time,
      max_students,
      recurring_pattern || null,
      recurring_end_date || null,
      notes || null
    ]);
    
    res.json({ 
      message: "Availability created successfully!",
      data: { ...req.body, id: result.insertId },
      id: result.insertId
    });
    
  } catch (error) {
    console.error('Error creating availability:', error);
    res.status(500).json({ error: 'Failed to create availability: ' + error.message });
  }
});

// Add simplified booking endpoint - no availability slots needed
app.post("/api/sessions", async (req, res) => {
  try {
    console.log('Creating direct teacher booking:', req.body);
    
    const {
      teacher_id,
      student_id,
      scheduled_at,
      course_title,
      duration = 60,
      price,
      notes
    } = req.body;

    // Create the session directly - no availability slot needed
    const sessionQuery = `
      INSERT INTO sessions 
      (teacher_id, student_id, scheduled_at, title, description, duration, price, status)
      VALUES (?, ?, ?, ?, ?, ?, ?, 'scheduled')
    `;
    
    const [sessionResult] = await db.execute(sessionQuery, [
      teacher_id,
      student_id,
      scheduled_at,
      course_title || 'Tutoring Session',
      notes || null,
      duration,
      price
    ]);
    
    res.json({ 
      message: "Session booked successfully!",
      sessionId: sessionResult.insertId
    });
    
  } catch (error) {
    console.error('Error booking session:', error);
    res.status(500).json({ error: 'Failed to book session: ' + error.message });
  }
});

// Also add GET endpoints for fetching - fetch real availability from database
app.get("/api/availability/teacher/:teacherId", async (req, res) => {
  try {
    const { teacherId } = req.params;
    console.log(`Fetching real availability for teacher: ${teacherId}`);
    
    // Query to get availability slots for this teacher
    const query = `
      SELECT 
        ta.id,
        ta.teacher_id,
        ta.date,
        ta.start_time,
        ta.end_time,
        ta.max_students,
        ta.current_students,
        ta.notes,
        ta.is_active
      FROM teacher_availability ta
      WHERE ta.teacher_id = ? 
        AND ta.date >= CURDATE()
        AND ta.is_active = TRUE
        AND ta.current_students < ta.max_students
      ORDER BY ta.date, ta.start_time
    `;
    
    const [rows] = await db.execute(query, [teacherId]);
    
    console.log(`Found ${rows.length} available slots for teacher ${teacherId}`);
    res.json(rows);
    
  } catch (error) {
    console.error('Error fetching availability from database:', error);
    // Fallback to sample data if database fails
    res.json([
      {
        id: 1,
        teacher_id: parseInt(teacherId),
        date: new Date().toISOString().split('T')[0],
        start_time: '09:00:00',
        end_time: '10:00:00',
        max_students: 3,
        current_students: 1,
        notes: 'Available for tutoring',
        is_active: 1
      }
    ]);
  }
});

app.get("/api/sessions/teacher/:teacherId", async (req, res) => {
  try {
    const { teacherId } = req.params;
    console.log(`Fetching real sessions for teacher: ${teacherId}`);
    
    // Query to get scheduled sessions for this teacher
    const query = `
      SELECT 
        s.id,
        s.teacher_id,
        s.student_id,
        s.scheduled_at,
        s.duration,
        s.status,
        s.course_title,
        u.name as student_name
      FROM sessions s
      JOIN users u ON s.student_id = u.id
      WHERE s.teacher_id = ? 
        AND s.status IN ('scheduled', 'completed')
        AND s.scheduled_at >= DATE_SUB(NOW(), INTERVAL 30 DAY)
      ORDER BY s.scheduled_at DESC
      LIMIT 10
    `;
    
    const [rows] = await db.execute(query, [teacherId]);
    
    console.log(`Found ${rows.length} sessions for teacher ${teacherId}`);
    res.json(rows);
    
  } catch (error) {
    console.error('Error fetching sessions from database:', error);
    // Fallback to sample data if database fails
    res.json([
      {
        id: 1,
        teacher_id: parseInt(teacherId),
        student_name: 'Sample Student',
        scheduled_at: new Date().toISOString(),
        course_title: 'Sample Course',
        duration: 60,
        status: 'scheduled'
      }
    ]);
  }
});

// Add 404 handler for debugging
app.use((req, res, next) => {
  console.log('404 - Route not found:', req.method, req.url);
  res.status(404).json({ error: 'Route not found', method: req.method, url: req.url });
});

app.listen(5000, () => {
  console.log("🚀 Simple test server running on http://localhost:5000");
  console.log("📊 Available endpoints:");
  console.log("   GET  /");
  console.log("   GET  /api/tutors");
  console.log("   POST /api/availability/test");
  console.log("   POST /api/availability");
  console.log("   GET /api/availability/teacher/:id");
  console.log("   GET /api/sessions/teacher/:id");
});
