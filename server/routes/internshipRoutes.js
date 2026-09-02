const express = require("express");

const {
    protect,
    authorize
} = require("../middleware/authMiddleware");

const {
    getAllInternships,
    getRecommendations,
    getInternshipDetails,
    applyForInternship,
    getMyApplications
} = require("../controllers/internshipController");

const router = express.Router();

// All student internship routes
router.use(
    protect,
    authorize("STUDENT")
);

// All open internships
router.get(
    "/",
    getAllInternships
);

// Recommended internships
router.get(
    "/recommendations",
    getRecommendations
);

// My applications
router.get(
    "/applications",
    getMyApplications
);

// Internship details
router.get(
    "/:id",
    getInternshipDetails
);

// Apply
router.post(
    "/:id/apply",
    applyForInternship
);

module.exports = router;