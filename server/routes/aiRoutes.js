const express = require("express");

const router = express.Router();

// Authentication middleware
const { protect } = require("../middleware/authMiddleware");

// AI controllers
const {
    requestAI,
    analyzeSkillGap,
} = require("../controllers/aiController");

// ============================================================
// AI CAREER CHAT
// POST /api/ai/chat
// ============================================================

router.post(
    "/chat",
    protect,
    requestAI
);

// ============================================================
// AI SKILL GAP ANALYSIS
// POST /api/ai/skill-gap
// ============================================================

router.post(
    "/skill-gap",
    protect,
    analyzeSkillGap
);

// ============================================================
// EXPORT
// ============================================================

module.exports = router;