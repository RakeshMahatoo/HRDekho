const mongoose = require("mongoose");

const revealSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    hrPostId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "HrPost",
      required: true,
    },
  },
  { timestamps: true }
);

// One user can only reveal a post once
revealSchema.index({ userId: 1, hrPostId: 1 }, { unique: true });

module.exports = mongoose.model("Reveal", revealSchema);