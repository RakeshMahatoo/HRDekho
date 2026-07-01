const Save = require("../models/Save");
const HrPost = require("../models/HrPost");
const CommunityPost = require("../models/CommunityPost");

// @route   POST /api/saves/:postType/:postId
// @access  Private
const toggleSave = async (req, res) => {
  try {
    const { postType, postId } = req.params;

    if (!["hr", "community"].includes(postType)) {
      return res.status(400).json({ message: "Invalid post type" });
    }

    // Check if post exists
    const post =
      postType === "hr"
        ? await HrPost.findById(postId)
        : await CommunityPost.findById(postId);

    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    // Check if already saved
    const existingSave = await Save.findOne({
      userId: req.user._id,
      postId,
      postType,
    });

    if (existingSave) {
      await Save.findByIdAndDelete(existingSave._id);
      return res.status(200).json({
        message: "Post unsaved",
        saved: false,
      });
    } else {
      await Save.create({
        userId: req.user._id,
        postId,
        postType,
      });
      return res.status(200).json({
        message: "Post saved",
        saved: true,
      });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @route   GET /api/saves/my
// @access  Private
// const getMySaves = async (req, res) => {
//   try {
//     const saves = await Save.find({ userId: req.user._id })
//       .populate({
//         path: "postId",
//         select: "companyName hrName role jobTitle city type text createdAt",
//       })
//       .sort({ createdAt: -1 });

//     res.status(200).json({ saves });
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// };

// @route   GET /api/saves/my
// @access  Private
const getMySaves = async (req, res) => {
  try {
    const HrPost = require("../models/HrPost");
    const CommunityPost = require("../models/CommunityPost");

    const saves = await Save.find({ userId: req.user._id }).sort({ createdAt: -1 });

    // Manually populate based on postType since it can be two different models
    const populatedSaves = await Promise.all(
      saves.map(async (save) => {
        let post;
        if (save.postType === "hr") {
          post = await HrPost.findById(save.postId).select(
            "companyName hrName role jobTitle city createdAt"
          );
        } else {
          post = await CommunityPost.findById(save.postId).select(
            "type text createdAt"
          );
        }

        return {
          ...save.toObject(),
          postId: post,
        };
      })
    );

    res.status(200).json({ saves: populatedSaves });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @route   PATCH /api/saves/:postType/:postId/status
// @access  Private
const updateSaveStatus = async (req, res) => {
  try {
    const { postType, postId } = req.params;
    const { status } = req.body;

    if (!["saved", "contacted", "applied"].includes(status)) {
      return res.status(400).json({ message: "Invalid status" });
    }

    const save = await Save.findOneAndUpdate(
      { userId: req.user._id, postId, postType },
      { status },
      { new: true }
    );

    if (!save) {
      return res.status(404).json({ message: "Saved post not found" });
    }

    res.status(200).json({
      message: "Status updated successfully",
      save,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { toggleSave, getMySaves, updateSaveStatus };