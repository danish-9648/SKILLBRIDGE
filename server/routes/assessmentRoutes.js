const express = require("express");

const {
    protect,
    authorize
} = require("../middleware/authMiddleware");

const {
    startAssessment,
    submitAssessment,
    getAssessmentResult
} = require("../controllers/assessmentController");

const router = express.Router();

// All assessment routes require student authentication
router.use(
    protect,
    authorize("STUDENT")
);

// Start assessment
router.post(
    "/start",
    startAssessment
);

// Submit assessment
router.post(
    "/:assessmentId/submit",
    submitAssessment
);

// Get result
router.get(
    "/:assessmentId/result",
    getAssessmentResult
);

module.exports = router;