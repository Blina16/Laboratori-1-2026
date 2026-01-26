const express = require("express");
const cors = require("cors");
const userRoutes = require("./routes/users_debug");

const app = express();
app.use(cors());
app.use(express.json());

app.use("/api/users", userRoutes);

app.get("/", (req, res) => {
  res.send("Debug API is running 🚀");
});

app.listen(5002, () => {
  console.log("🚀 Debug server running on http://localhost:5002");
  
  setTimeout(async () => {
    try {
      const response = await fetch('http://localhost:5002/api/users/teachers');
      const data = await response.json();
      console.log('✅ Debug test successful:', data);
    } catch (error) {
      console.error('❌ Debug test failed:', error.message);
    }
    process.exit(0);
  }, 1000);
});
