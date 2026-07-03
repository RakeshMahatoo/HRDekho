const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const session = require("express-session");
const passport = require("./config/passport");
const connectDB = require("./config/db");

dotenv.config();

const app = express();

// Connect to MongoDB
connectDB();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/uploads", express.static("uploads"));

// Session middleware (must be before routes)
app.use(
  session({
    secret: process.env.JWT_SECRET,
    resave: false,
    saveUninitialized: false,
  })
);

// Passport middleware (must be before routes)
app.use(passport.initialize());
app.use(passport.session());

// Routes
const authRoutes = require("./routes/auth.routes");
const hrpostRoutes = require("./routes/hrpost.routes");
const communityRoutes = require("./routes/community.routes");
const commentRoutes = require("./routes/comment.routes");
const likeRoutes = require("./routes/like.routes");
const saveRoutes = require("./routes/save.routes");
const revealRoutes = require("./routes/reveal.routes");
const userRoutes = require("./routes/user.routes");

app.use("/api/auth", authRoutes);
app.use("/api/hrposts", hrpostRoutes);
app.use("/api/community", communityRoutes);
app.use("/api/comments", commentRoutes);
app.use("/api/likes", likeRoutes);
app.use("/api/saves", saveRoutes);
app.use("/api/reveals", revealRoutes);
app.use("/api/users", userRoutes);

// Base route
app.get("/", (req, res) => {
  res.json({ message: "Naukri API is running" });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ message: "Route not found" });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: "Internal server error" });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});