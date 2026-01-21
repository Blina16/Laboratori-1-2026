const express = require("express");
const cors = require("cors");

const authRoutes = require("./routes/auth");

const app = express();
app.use(cors());
app.use(express.json());

// ROOT TEST
app.get("/", (req, res) => {
  res.send("API is running 🚀");
});

// AUTH ROUTES
app.use("/api/auth", authRoutes);

app.listen(5000, () => {
  console.log("🚀 Server running on http://localhost:5000");
});
