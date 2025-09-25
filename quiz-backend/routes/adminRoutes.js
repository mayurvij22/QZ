const express = require("express");
const router = express.Router();
const adminController = require("../controllers/adminController");

// ✅ Correct import of your middleware
const { requireAuth, requireAdmin } = require("../middleware/authMiddleware");

// Protect all admin routes
router.use(requireAuth);   // user must be logged in
router.use(requireAdmin);  // user must be admin

// Get all quiz stats
router.get("/quizzes", adminController.getQuizzesWithStats);

module.exports = router;
