const express = require("express");
const cors = require("cors");
const userRoutes = require("./routes/users_test");

const app = express();
app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Test API is running 🚀");
});

app.use("/api/users", userRoutes);

const PORT = 5003;
app.listen(PORT, () => {
  console.log(`🚀 Test server running on http://localhost:${PORT}`);
  
  // Test the routes
  setTimeout(async () => {
    try {
      console.log('🧪 Testing /api/users/test...');
      const response = await fetch(`http://localhost:${PORT}/api/users/test`);
      const data = await response.json();
      console.log('✅ Test endpoint:', data);
      
      console.log('🧪 Testing /api/users/teachers...');
      const teachersResponse = await fetch(`http://localhost:${PORT}/api/users/teachers`);
      const teachersData = await teachersResponse.json();
      console.log('✅ Teachers endpoint:', teachersData);
      
      process.exit(0);
    } catch (error) {
      console.error('❌ Test failed:', error.message);
      process.exit(1);
    }
  }, 1000);
});
