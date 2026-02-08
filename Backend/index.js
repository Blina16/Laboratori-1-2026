const express = require("express");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

// Import routes
const bookingsRouter = require("./routes/bookings")
const tutorsRouter = require("./routes/tutors")
const messagesRouter = require("./routes/messages");

// API Routes
app.get("/api/message", (req, res) => {
  res.json({ message: "Hello from backend 👋" });
});

// Bookings routes
app.use("/api/bookings", bookingsRouter);

// Tutors routes
app.use("/api/tutors", tutorsRouter);

// Messages routes
app.use("/api/messages", messagesRouter);

const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Backend running on http://localhost:${PORT}`);
});
