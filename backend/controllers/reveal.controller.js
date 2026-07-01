const Reveal = require("../models/Reveal");
const HrPost = require("../models/HrPost");
const User = require("../models/User");

// @route   POST /api/reveals/:hrPostId
// @access  Private
const revealNumber = async (req, res) => {
  try {
    const { hrPostId } = req.params;

    // Check if post exists
    const hrPost = await HrPost.findById(hrPostId);
    if (!hrPost) {
      return res.status(404).json({ message: "HR post not found" });
    }

    // Check if already revealed
    const existingReveal = await Reveal.findOne({
      userId: req.user._id,
      hrPostId,
    });

    if (existingReveal) {
      // Already revealed — just return the number
      return res.status(200).json({
        message: "Already revealed",
        hrPhone: hrPost.hrPhone,
      });
    }

    // Check reveals left for free users
    if (req.user.plan === "free" && req.user.revealsLeft <= 0) {
      return res.status(403).json({
        message: "Daily reveal limit reached. Upgrade to Pro for unlimited reveals.",
      });
    }

    // Create reveal record
    await Reveal.create({
      userId: req.user._id,
      hrPostId,
    });

    // Decrease reveals left for free users
    if (req.user.plan === "free") {
      await User.findByIdAndUpdate(req.user._id, {
        $inc: { revealsLeft: -1 },
      });
    }

    // Increase reveal count on post
    hrPost.revealsCount += 1;
    await hrPost.save();

    res.status(200).json({
      message: "Number revealed successfully",
      hrPhone: hrPost.hrPhone,
      revealsLeft:
        req.user.plan === "free" ? req.user.revealsLeft - 1 : "unlimited",
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { revealNumber };