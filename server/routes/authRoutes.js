const express = require("express");

const {
    registerUser,
    loginUser,
    getCurrentUser
} = require("../controllers/authController");

const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

// ========================================
// PUBLIC ROUTES
// ========================================

// Register
router.post("/register", registerUser);

// Login
router.post("/login", loginUser);

// ========================================
// PROTECTED ROUTES
// ========================================

// Current logged-in user
router.get("/me", protect, getCurrentUser);

module.exports = router;