const express = require("express");
const router = express.Router();
const {
  createHrPost,
  getAllHrPosts,
  getHrPostById,
  deleteHrPost,
  getPostsByCompany,
  getMyHrPosts,
  getCompaniesList,
} = require("../controllers/hrpost.controller");
const { protect } = require("../middleware/auth.middleware");

router.post("/", protect, createHrPost);
router.get("/", getAllHrPosts);
router.get("/my/posts", protect, getMyHrPosts);
router.get("/companies/list", getCompaniesList);
router.get("/company/:companyName", getPostsByCompany);
router.get("/:id", getHrPostById);
router.delete("/:id", protect, deleteHrPost);

module.exports = router;