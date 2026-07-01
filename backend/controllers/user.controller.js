const User = require("../models/User");

// @route   GET /api/users/:id
// @access  Public
const getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select("-password");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({ user });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @route   PATCH /api/users/profile
// @access  Private
// const updateProfile = async (req, res) => {
//   try {
//     const { name, avatar, openToWork, bio } = req.body;

//     const user = await User.findById(req.user._id);

//     if (!user) {
//       return res.status(404).json({ message: "User not found" });
//     }

//     if (name) user.name = name;
//     if (avatar !== undefined) user.avatar = avatar;
//     if (openToWork !== undefined) user.openToWork = openToWork;

//     await user.save();

//     res.status(200).json({
//       message: "Profile updated successfully",
//       user: {
//         _id: user._id,
//         name: user.name,
//         email: user.email,
//         avatar: user.avatar,
//         role: user.role,
//         plan: user.plan,
//         openToWork: user.openToWork,
//         revealsLeft: user.revealsLeft,
//       },
//     });
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// };

const updateProfile = async (req, res) => {
  try {
    const { name, avatar, openToWork, bio } = req.body;

    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (name) user.name = name;
    if (avatar !== undefined) user.avatar = avatar;
    if (openToWork !== undefined) user.openToWork = openToWork;
    if (bio !== undefined) user.bio = bio;

    await user.save();

    res.status(200).json({
      message: "Profile updated successfully",
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        avatar: user.avatar,
        role: user.role,
        plan: user.plan,
        openToWork: user.openToWork,
        revealsLeft: user.revealsLeft,
        bio: user.bio,
      },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @route   GET /api/users (admin only)
// @access  Private/Admin
const getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select("-password").sort({ createdAt: -1 });
    res.status(200).json({ users });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @route   PATCH /api/users/:id/plan (admin only)
// @access  Private/Admin
const updateUserPlan = async (req, res) => {
  try {
    const { plan } = req.body;

    if (!["free", "pro", "recruiter"].includes(plan)) {
      return res.status(400).json({ message: "Invalid plan" });
    }

    const user = await User.findByIdAndUpdate(
      req.params.id,
      { plan, revealsLeft: plan === "free" ? 5 : 999999 },
      { new: true }
    ).select("-password");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({
      message: "User plan updated successfully",
      user,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getUserProfile,
  updateProfile,
  getAllUsers,
  updateUserPlan,
};