const express = require("express");
const router = express.Router();
const passport = require("passport");
const {
  register,
  login,
  getMe,
  forgotPassword,
  resetPassword,
  googleCallback,
} = require("../controllers/auth.controller");
const { protect } = require("../middleware/auth.middleware");

router.post("/register", register);
router.post("/login", login);
router.get("/me", protect, getMe);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password/:token", resetPassword);

// Google OAuth routes
router.get(
  "/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

router.get(
  "/google/callback",
  passport.authenticate("google", { failureRedirect: "/login" }),
  googleCallback
);

module.exports = router;