const mongoose = require("mongoose");

const hrPostSchema = new mongoose.Schema(
  {
    postedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    companyName: {
      type: String,
      required: true,
      trim: true,
    },
    hrName: {
      type: String,
      required: true,
      trim: true,
    },
    hrPhone: {
      type: String,
      required: true,
      trim: true,
    },
    hrEmail: {
      type: String,
      trim: true,
      default: "",
    },
    role: {
      type: String,
      required: true,
      enum: [
        "Frontend",
        "Backend",
        "Full Stack",
        "DevOps",
        "Data",
        "Design",
        "Mobile",
        "Other",
      ],
    },
    jobTitle: {
      type: String,
      required: true,
      trim: true,
    },
    city: {
      type: String,
      required: true,
      trim: true,
    },
    jobDescription: {
      type: String,
      required: true,
      trim: true,
    },
    interviewQuestions: {
      type: String,
      default: "",
    },
    salaryRange: {
      type: String,
      default: "",
    },
    companyWebsite: {
      type: String,
      default: "",
    },
    likesCount: {
      type: Number,
      default: 0,
    },
    revealsCount: {
      type: Number,
      default: 0,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("HrPost", hrPostSchema);