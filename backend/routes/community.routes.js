const express = require("express");
const router = express.Router();
const {
  createCommunityPost,
  getAllCommunityPosts,
  getCommunityPostById,
  deleteCommunityPost,
  getMyCommunityPosts,
} = require("../controllers/community.controller");
const { protect } = require("../middleware/auth.middleware");
const upload = require("../config/multer");

router.post("/", protect, upload.single("media"), createCommunityPost);
router.get("/", getAllCommunityPosts);
router.get("/my/posts", protect, getMyCommunityPosts);
router.get("/:id", getCommunityPostById);
router.delete("/:id", protect, deleteCommunityPost);

module.exports = router;