const express = require("express");

const {
    protect,
    authorize
} = require("../middleware/authMiddleware");

const {
    createOrUpdateIndustryProfile,
    getIndustryProfile,
    createInternship,
    getMyInternships
} = require("../controllers/industryController");

const {
    getIndustryApplicationDashboard,
    getIndustryApplications,
    getInternshipApplications,
    getApplicationDetails,
    updateApplicationStatus,
    bulkUpdateApplicationStatus,
    getInternshipApplicationStats
} = require("../controllers/industryApplicationController");

const router = express.Router();

// ============================================================
// ALL INDUSTRY ROUTES
// ============================================================

router.use(
    protect,
    authorize("INDUSTRY")
);

// ============================================================
// INDUSTRY DASHBOARD
// ============================================================

router.get(
    "/dashboard",
    (req, res) => {
        res.status(200).json({
            success: true,
            message: "Welcome to Industry Dashboard",
            user: {
                id: req.user._id,
                name: req.user.name,
                email: req.user.email,
                role: req.user.role
            }
        });
    }
);

// ============================================================
// INDUSTRY PROFILE
// ============================================================

router.get(
    "/profile",
    getIndustryProfile
);

router.put(
    "/profile",
    createOrUpdateIndustryProfile
);

// ============================================================
// INTERNSHIPS
// ============================================================

router.post(
    "/internships",
    createInternship
);

router.get(
    "/internships",
    getMyInternships
);

// ============================================================
// APPLICATION MANAGEMENT
// ============================================================

// Application dashboard
router.get(
    "/applications/dashboard",
    getIndustryApplicationDashboard
);

// All applications belonging to this industry
router.get(
    "/applications",
    getIndustryApplications
);

// Applications for a specific internship
router.get(
    "/applications/internship/:internshipId",
    getInternshipApplications
);

// Statistics for a specific internship
router.get(
    "/applications/internship/:internshipId/stats",
    getInternshipApplicationStats
);

// Single application details
router.get(
    "/applications/:applicationId",
    getApplicationDetails
);

// Update one application status
router.put(
    "/applications/:applicationId/status",
    updateApplicationStatus
);

// Bulk update applications
router.put(
    "/applications/bulk-status",
    bulkUpdateApplicationStatus
);

module.exports = router;