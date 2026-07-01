const HrPost = require("../models/HrPost");
const Like = require("../models/Like");
const Save = require("../models/Save");

// @route   POST /api/hrposts
// @access  Private
const createHrPost = async (req, res) => {
  try {
    const {
      companyName,
      hrName,
      hrPhone,
      hrEmail,
      role,
      jobTitle,
      city,
      jobDescription,
      interviewQuestions,
      salaryRange,
      companyWebsite,
    } = req.body;

    // Check required fields
    if (
      !companyName ||
      !hrName ||
      !hrPhone ||
      !role ||
      !jobTitle ||
      !city ||
      !jobDescription
    ) {
      return res.status(400).json({ message: "All required fields must be filled" });
    }

    const hrPost = await HrPost.create({
      postedBy: req.user._id,
      companyName,
      hrName,
      hrPhone,
      hrEmail,
      role,
      jobTitle,
      city,
      jobDescription,
      interviewQuestions,
      salaryRange,
      companyWebsite,
    });

    res.status(201).json({
      message: "HR post created successfully",
      hrPost,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @route   GET /api/hrposts
// @access  Public
const getAllHrPosts = async (req, res) => {
  try {
    const { role, city, search, page = 1, limit = 10 } = req.query;

    // Build filter object
    const filter = { isActive: true };

    if (role) filter.role = role;
    if (city) filter.city = { $regex: city, $options: "i" };
    if (search) {
      filter.$or = [
        { companyName: { $regex: search, $options: "i" } },
        { jobTitle: { $regex: search, $options: "i" } },
        { role: { $regex: search, $options: "i" } },
      ];
    }

    const skip = (page - 1) * limit;

    const hrPosts = await HrPost.find(filter)
      .populate("postedBy", "name avatar")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(Number(limit));

    const total = await HrPost.countDocuments(filter);

    res.status(200).json({
      hrPosts,
      total,
      page: Number(page),
      totalPages: Math.ceil(total / limit),
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @route   GET /api/hrposts/:id
// @access  Public
const getHrPostById = async (req, res) => {
  try {
    const hrPost = await HrPost.findById(req.params.id).populate(
      "postedBy",
      "name avatar"
    );

    if (!hrPost || !hrPost.isActive) {
      return res.status(404).json({ message: "HR post not found" });
    }

    res.status(200).json({ hrPost });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @route   DELETE /api/hrposts/:id
// @access  Private
const deleteHrPost = async (req, res) => {
  try {
    const hrPost = await HrPost.findById(req.params.id);

    if (!hrPost) {
      return res.status(404).json({ message: "HR post not found" });
    }

    // Only owner or admin can delete
    if (
      hrPost.postedBy.toString() !== req.user._id.toString() &&
      req.user.role !== "admin"
    ) {
      return res.status(403).json({ message: "Not authorized to delete this post" });
    }

    hrPost.isActive = false;
    await hrPost.save();

    res.status(200).json({ message: "HR post deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @route   GET /api/hrposts/company/:companyName
// @access  Public
const getPostsByCompany = async (req, res) => {
  try {
    const { companyName } = req.params;
    const { page = 1, limit = 10 } = req.query;

    const skip = (page - 1) * limit;

    const hrPosts = await HrPost.find({
      companyName: { $regex: companyName, $options: "i" },
      isActive: true,
    })
      .populate("postedBy", "name avatar")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(Number(limit));

    const total = await HrPost.countDocuments({
      companyName: { $regex: companyName, $options: "i" },
      isActive: true,
    });

    res.status(200).json({
      hrPosts,
      total,
      page: Number(page),
      totalPages: Math.ceil(total / limit),
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @route   GET /api/hrposts/my/posts
// @access  Private
const getMyHrPosts = async (req, res) => {
  try {
    const hrPosts = await HrPost.find({
      postedBy: req.user._id,
      isActive: true,
    }).sort({ createdAt: -1 });

    res.status(200).json({ hrPosts });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @route   GET /api/hrposts/companies/list
// @access  Public
const getCompaniesList = async (req, res) => {
  try {
    const companies = await HrPost.aggregate([
      { $match: { isActive: true } },
      {
        $group: {
          _id: "$companyName",
          contactsCount: { $sum: 1 },
          cities: { $addToSet: "$city" },
          roles: { $addToSet: "$role" },
          companyWebsite: { $first: "$companyWebsite" },
          latestPost: { $max: "$createdAt" },
        },
      },
      { $sort: { contactsCount: -1 } },
    ]);

    res.status(200).json({ companies });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createHrPost,
  getAllHrPosts,
  getHrPostById,
  deleteHrPost,
  getPostsByCompany,
  getMyHrPosts,
  getCompaniesList,
};