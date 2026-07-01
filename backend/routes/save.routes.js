const express = require("express");
const router = express.Router();
const {
  toggleSave,
  getMySaves,
  updateSaveStatus,
} = require("../controllers/save.controller");
const { protect } = require("../middleware/auth.middleware");

router.post("/:postType/:postId", protect, toggleSave);
router.get("/my", protect, getMySaves);
router.patch("/:postType/:postId/status", protect, updateSaveStatus);

module.exports = router;