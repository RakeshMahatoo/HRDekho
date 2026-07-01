const express = require("express");
const router = express.Router();
const { toggleLike, getLikeStatus } = require("../controllers/like.controller");
const { protect } = require("../middleware/auth.middleware");

router.post("/:postType/:postId", protect, toggleLike);
router.get("/:postType/:postId", protect, getLikeStatus);

module.exports = router;