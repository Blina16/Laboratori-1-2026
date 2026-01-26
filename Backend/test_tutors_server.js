const express = require("express");
const cors = require("cors");
const tutorRoutes = require("./routes/tutors");

const app = express();
app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Test server running 🚀");
});

app.use("/api/tutors", tutorRoutes);

app.listen(5001, () => {
  console.log("🚀 Test server running on http://localhost:5001");
  
  // Test the route
  setTimeout(async () => {
    try {
      const response = await fetch('http://localhost:5001/api/tutors');
      const data = await response.json();
      console.log('✅ Tutors API working:', data);
      process.exit(0);
    } catch (error) {
      console.error('❌ Tutors API failed:', error.message);
      process.exit(1);
    }
  }, 1000);
});
