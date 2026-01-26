const express = require("express");
const cors = require("cors");

const authRoutes = require("./routes/auth");
const userRoutes = require("./routes/users");
const tutorRoutes = require("./routes/tutors");
const courseRoutes = require("./routes/courses");
const sessionRoutes = require("./routes/sessions");
const studentRoutes = require("./routes/students");
const gradeRoutes = require("./routes/grades");

try {
  const availabilityRoutes = require("./routes/availability");
  console.log('✅ Availability routes loaded successfully');
  
  const app = express();
  app.use(cors());
  app.use(express.json());

  app.get("/", (req, res) => {
    res.send("API is running 🚀");
  });

  // Test endpoint for debugging
  app.get("/test", (req, res) => {
    res.json({ 
      message: "Test endpoint working",
      timestamp: new Date().toISOString(),
      method: req.method,
      url: req.url
    });
  });

  // Simple availability test
  app.post("/api/availability/test", (req, res) => {
    console.log('Availability test endpoint hit!', req.body);
    res.json({ 
      message: "Availability test working",
      received: req.body
    });
  });

  app.use("/api/auth", authRoutes);
  app.use("/api/users", userRoutes);
  app.use("/api/tutors", tutorRoutes);
  app.use("/api/courses", courseRoutes);
  app.use("/api/sessions", sessionRoutes);
  app.use("/api/students", studentRoutes);
  app.use("/api/grades", gradeRoutes);
  app.use("/api/availability", availabilityRoutes);

  app.listen(5000, () => {
    console.log("🚀 Server running on http://localhost:5000");
    console.log("📊 Available endpoints:");
    console.log("   GET  /");
    console.log("   GET  /test");
    console.log("   GET  /api/auth/*");
    console.log("   GET  /api/users/*");
    console.log("   GET  /api/tutors/*");
    console.log("   GET  /api/courses/*");
    console.log("   GET  /api/sessions/*");
    console.log("   GET  /api/students/*");
    console.log("   GET  /api/grades/*");
    console.log("   GET  /api/availability/*");
  });
} catch (error) {
  console.error('❌ Error loading availability routes:', error);
  console.error('Stack trace:', error.stack);
}
