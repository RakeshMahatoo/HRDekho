const mongoose = require("mongoose");

const likeSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    postId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
    },
    postType: {
      type: String,
      required: true,
      enum: ["hr", "community"],
    },
  },
  { timestamps: true }
);

// One user can only like a post once
likeSchema.index({ userId: 1, postId: 1 }, { unique: true });

module.exports = mongoose.model("Like", likeSchema);