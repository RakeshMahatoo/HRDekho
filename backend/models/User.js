const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
    },
    avatar: {
      type: String,
      default: "",
    },
    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },
    openToWork: {
      type: Boolean,
      default: false,
    },
    plan: {
      type: String,
      enum: ["free", "pro", "recruiter"],
      default: "free",
    },
    revealsLeft: {
      type: Number,
      default: 5,
    },
    bio: {
      type: String,
      default: "",
      maxlength: 500,
      trim: true,
    },
    resetPasswordToken: {
      type: String,
      default: "",
    },
    resetPasswordExpires: {
      type: Date,
      default: null,
    },
  },
  { timestamps: true },
);

module.exports = mongoose.model("User", userSchema);
