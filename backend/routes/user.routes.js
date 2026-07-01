const express = require("express");
const router = express.Router();
const {
  getUserProfile,
  updateProfile,
  getAllUsers,
  updateUserPlan,
} = require("../controllers/user.controller");
const { protect, adminOnly } = require("../middleware/auth.middleware");

router.get("/", protect, adminOnly, getAllUsers);
router.patch("/profile", protect, updateProfile);
router.patch("/:id/plan", protect, adminOnly, updateUserPlan);
router.get("/:id", getUserProfile);

module.exports = router;