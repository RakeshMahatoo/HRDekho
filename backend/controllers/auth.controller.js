const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const { sendResetEmail } = require("../config/email");
// Generate JWT token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};

// @route   POST /api/auth/register
// @access  Public
const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Check all fields
    if (!name || !email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "Email already registered" });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create user
    const user = await User.create({
      name,
      email,
      password: hashedPassword,
    });

    // Generate token
    const token = generateToken(user._id);

    res.status(201).json({
      message: "User registered successfully",
      token,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        plan: user.plan,
        openToWork: user.openToWork,
        revealsLeft: user.revealsLeft,
      },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @route   POST /api/auth/login
// @access  Public
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check all fields
    if (!email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // Check if user exists
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    // Check password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    // Generate token
    const token = generateToken(user._id);

    res.status(200).json({
      message: "Login successful",
      token,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        plan: user.plan,
        openToWork: user.openToWork,
        revealsLeft: user.revealsLeft,
      },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @route   GET /api/auth/me
// @access  Private
const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select("-password");
    res.status(200).json({ user });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @route   POST /api/auth/forgot-password
// @access  Public
const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ message: "Email is required" });
    }

    const user = await User.findOne({ email });
    if (!user) {
      // Don't reveal if email exists or not
      return res
        .status(200)
        .json({ message: "If this email exists, a reset link has been sent" });
    }

    // Generate reset token
    const resetToken = crypto.randomBytes(32).toString("hex");
    const resetExpires = Date.now() + 60 * 60 * 1000; // 1 hour

    // Save to user
    user.resetPasswordToken = resetToken;
    user.resetPasswordExpires = resetExpires;
    await user.save();

    // Send email
    const resetLink = `${process.env.FRONTEND_URL}/reset-password/${resetToken}`;
    await sendResetEmail(user.email, resetLink);

    res
      .status(200)
      .json({ message: "If this email exists, a reset link has been sent" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @route   POST /api/auth/reset-password/:token
// @access  Public
const resetPassword = async (req, res) => {
  try {
    const { token } = req.params;
    const { password } = req.body;

    if (!password) {
      return res.status(400).json({ message: "Password is required" });
    }

    if (password.length < 6) {
      return res
        .status(400)
        .json({ message: "Password must be at least 6 characters" });
    }

    // Find user with valid token
    const user = await User.findOne({
      resetPasswordToken: token,
      resetPasswordExpires: { $gt: Date.now() },
    });

    if (!user) {
      return res
        .status(400)
        .json({ message: "Reset link is invalid or has expired" });
    }

    // Hash new password
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(password, salt);
    user.resetPasswordToken = "";
    user.resetPasswordExpires = null;
    await user.save();

    res
      .status(200)
      .json({ message: "Password reset successfully. You can now log in." });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};



// @route   GET /api/auth/google/callback
// @access  Public
const googleCallback = async (req, res) => {
  try {
    const user = req.user;

    // Generate JWT token
    const token = generateToken(user._id);

    // Redirect to frontend with token
    res.redirect(
      `${process.env.FRONTEND_URL}/google-auth?token=${token}&name=${encodeURIComponent(user.name)}&email=${encodeURIComponent(user.email)}&plan=${user.plan}&openToWork=${user.openToWork}&revealsLeft=${user.revealsLeft}&_id=${user._id}`,
    );
  } catch (error) {
    res.redirect(`${process.env.FRONTEND_URL}/login?error=google_auth_failed`);
  }
};

module.exports = {
  register,
  login,
  getMe,
  forgotPassword,
  resetPassword,
  googleCallback,
};
