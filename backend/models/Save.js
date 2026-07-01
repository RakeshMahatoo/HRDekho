const mongoose = require("mongoose");

const saveSchema = new mongoose.Schema(
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
    status: {
      type: String,
      enum: ["saved", "contacted", "applied"],
      default: "saved",
    },
  },
  { timestamps: true }
);

// One user can only save a post once
saveSchema.index({ userId: 1, postId: 1 }, { unique: true });

module.exports = mongoose.model("Save", saveSchema);