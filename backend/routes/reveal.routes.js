const express = require("express");
const router = express.Router();
const { revealNumber } = require("../controllers/reveal.controller");
const { protect } = require("../middleware/auth.middleware");

router.post("/:hrPostId", protect, revealNumber);

module.exports = router;