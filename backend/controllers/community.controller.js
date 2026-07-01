const CommunityPost = require("../models/CommunityPost");

// @route   POST /api/community
// @access  Private
const createCommunityPost = async (req, res) => {
  try {
    const { type, text, tags } = req.body;

    if (!type) {
      return res.status(400).json({ message: "Post type is required" });
    }

    let mediaUrl = "";
    if (req.file) {
      mediaUrl = `/uploads/${req.file.filename}`;
    }

    if (!text && !mediaUrl) {
      return res.status(400).json({ message: "Post must have text or media" });
    }

    // Parse tags if sent as a string (from form-data)
    let parsedTags = [];
    if (tags) {
      parsedTags = typeof tags === "string" ? JSON.parse(tags) : tags;
    }

    const post = await CommunityPost.create({
      postedBy: req.user._id,
      type,
      text,
      mediaUrl,
      tags: parsedTags,
    });

    await post.populate("postedBy", "name avatar openToWork");

    res.status(201).json({
      message: "Community post created successfully",
      post,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @route   GET /api/community
// @access  Public
const getAllCommunityPosts = async (req, res) => {
  try {
    const { type, search, page = 1, limit = 10 } = req.query;

    const filter = { isActive: true };

    if (type) filter.type = type;
    if (search) {
      filter.$or = [
        { text: { $regex: search, $options: "i" } },
        { tags: { $regex: search, $options: "i" } },
      ];
    }

    const skip = (page - 1) * limit;

    const posts = await CommunityPost.find(filter)
      .populate("postedBy", "name avatar openToWork")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(Number(limit));

    const total = await CommunityPost.countDocuments(filter);

    res.status(200).json({
      posts,
      total,
      page: Number(page),
      totalPages: Math.ceil(total / limit),
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @route   GET /api/community/:id
// @access  Public
const getCommunityPostById = async (req, res) => {
  try {
    const post = await CommunityPost.findById(req.params.id).populate(
      "postedBy",
      "name avatar openToWork"
    );

    if (!post || !post.isActive) {
      return res.status(404).json({ message: "Post not found" });
    }

    res.status(200).json({ post });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @route   DELETE /api/community/:id
// @access  Private
const deleteCommunityPost = async (req, res) => {
  try {
    const post = await CommunityPost.findById(req.params.id);

    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    if (
      post.postedBy.toString() !== req.user._id.toString() &&
      req.user.role !== "admin"
    ) {
      return res.status(403).json({ message: "Not authorized to delete this post" });
    }

    post.isActive = false;
    await post.save();

    res.status(200).json({ message: "Post deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @route   GET /api/community/my/posts
// @access  Private
const getMyCommunityPosts = async (req, res) => {
  try {
    const posts = await CommunityPost.find({
      postedBy: req.user._id,
      isActive: true,
    }).sort({ createdAt: -1 });

    res.status(200).json({ posts });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createCommunityPost,
  getAllCommunityPosts,
  getCommunityPostById,
  deleteCommunityPost,
  getMyCommunityPosts,
};