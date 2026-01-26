const express = require("express");
const cors = require("cors");

// Test routes import
const userRoutes = require("./routes/users");

const app = express();
app.use(cors());
app.use(express.json());

// Test route mounting
app.use("/api/users", userRoutes);

// Test endpoint
app.get("/", (req, res) => {
  res.send("Test API is running 🚀");
});

// Test route registration
app.get("/test-routes", (req, res) => {
  res.json({ message: "Routes are working", routes: "mounted" });
});

const PORT = 5001; // Use different port to avoid conflicts

app.listen(PORT, () => {
  console.log(`🚀 Test server running on http://localhost:${PORT}`);
  
  // Test the routes
  setTimeout(async () => {
    try {
      const response = await fetch(`http://localhost:${PORT}/api/users/teachers`);
      const data = await response.json();
      console.log('✅ Routes test successful:', data);
    } catch (error) {
      console.error('❌ Routes test failed:', error.message);
    }
    process.exit(0);
  }, 1000);
});
