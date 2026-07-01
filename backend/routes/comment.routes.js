const express = require("express");
const router = express.Router();
const {
  addComment,
  getComments,
  deleteComment,
} = require("../controllers/comment.controller");
const { protect } = require("../middleware/auth.middleware");

router.post("/:postType/:postId", protect, addComment);
router.get("/:postType/:postId", getComments);
router.delete("/:id", protect, deleteComment);

module.exports = router;