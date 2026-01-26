const express = require("express");
const cors = require("cors");

const authRoutes = require("./routes/auth");
const userRoutes = require("./routes/users");
const courseRoutes = require("./routes/courses");
const sessionRoutes = require("./routes/sessions");

const app = express();
app.use(cors());
app.use(express.json());

// ROOT TEST
app.get("/", (req, res) => {
  res.send("API is running 🚀");
});

// AUTH ROUTES
app.use("/api/auth", authRoutes);

// USER ROUTES
app.use("/api/users", userRoutes);

// COURSE ROUTES
app.use("/api/courses", courseRoutes);

// SESSION ROUTES
app.use("/api/sessions", sessionRoutes);

const PORT = 5000;
const server = app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
  console.log(`📊 Available endpoints:`);
  console.log(`   GET  /`);
  console.log(`   GET  /api/auth/*`);
  console.log(`   GET  /api/users/*`);
  console.log(`   GET  /api/courses/*`);
  console.log(`   GET  /api/sessions/*`);
});

// DEBUG: Log all registered routes
server._router.stack.forEach((middleware) => {
  if (middleware.route) {
    console.log(`📍 Route: ${middleware.route.path} [${Object.keys(middleware.route.methods).join(', ')}]`);
  }
});
