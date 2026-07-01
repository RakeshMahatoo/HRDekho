const Like = require("../models/Like");
const HrPost = require("../models/HrPost");
const CommunityPost = require("../models/CommunityPost");

// @route   POST /api/likes/:postType/:postId
// @access  Private
const toggleLike = async (req, res) => {
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

    // Check if already liked
    const existingLike = await Like.findOne({
      userId: req.user._id,
      postId,
      postType,
    });

    if (existingLike) {
      // Unlike
      await Like.findByIdAndDelete(existingLike._id);

      // Decrease likes count
      post.likesCount = Math.max(0, post.likesCount - 1);
      await post.save();

      return res.status(200).json({
        message: "Post unliked",
        liked: false,
        likesCount: post.likesCount,
      });
    } else {
      // Like
      await Like.create({
        userId: req.user._id,
        postId,
        postType,
      });

      // Increase likes count
      post.likesCount += 1;
      await post.save();

      return res.status(200).json({
        message: "Post liked",
        liked: true,
        likesCount: post.likesCount,
      });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @route   GET /api/likes/:postType/:postId
// @access  Private
const getLikeStatus = async (req, res) => {
  try {
    const { postType, postId } = req.params;

    const existingLike = await Like.findOne({
      userId: req.user._id,
      postId,
      postType,
    });

    res.status(200).json({
      liked: !!existingLike,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { toggleLike, getLikeStatus };