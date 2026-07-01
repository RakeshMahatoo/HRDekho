const Comment = require("../models/Comment");
const HrPost = require("../models/HrPost");
const CommunityPost = require("../models/CommunityPost");

// @route   POST /api/comments/:postType/:postId
// @access  Private
const addComment = async (req, res) => {
  try {
    const { postType, postId } = req.params;
    const { text } = req.body;

    if (!text) {
      return res.status(400).json({ message: "Comment text is required" });
    }

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

    const comment = await Comment.create({
      userId: req.user._id,
      postId,
      postType,
      text,
    });

    // Populate user info
    await comment.populate("userId", "name avatar");

    res.status(201).json({
      message: "Comment added successfully",
      comment,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @route   GET /api/comments/:postType/:postId
// @access  Public
const getComments = async (req, res) => {
  try {
    const { postType, postId } = req.params;

    const comments = await Comment.find({ postId, postType })
      .populate("userId", "name avatar")
      .sort({ createdAt: -1 });

    res.status(200).json({ comments });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @route   DELETE /api/comments/:id
// @access  Private
const deleteComment = async (req, res) => {
  try {
    const comment = await Comment.findById(req.params.id);

    if (!comment) {
      return res.status(404).json({ message: "Comment not found" });
    }

    // Only owner or admin can delete
    if (
      comment.userId.toString() !== req.user._id.toString() &&
      req.user.role !== "admin"
    ) {
      return res.status(403).json({ message: "Not authorized to delete this comment" });
    }

    await Comment.findByIdAndDelete(req.params.id);

    res.status(200).json({ message: "Comment deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { addComment, getComments, deleteComment };