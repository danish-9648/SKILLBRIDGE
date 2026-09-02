
const express = require("express");

const router = express.Router();

const {
    getPlacementReadiness,
    getPlacementRecommendations
} = require("../controllers/placementController");

const {
    protect
} = require("../middleware/authMiddleware");


// ============================================================
// PLACEMENT READINESS
// GET /api/placement/readiness
// ============================================================

router.get(
    "/readiness",
    protect,
    getPlacementReadiness
);


// ============================================================
// PLACEMENT RECOMMENDATIONS
// GET /api/placement/recommendations
// ============================================================

router.get(
    "/recommendations",
    protect,
    getPlacementRecommendations
);


module.exports = router;

