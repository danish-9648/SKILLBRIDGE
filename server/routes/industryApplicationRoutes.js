const express = require("express");

const {
    protect,
    authorize
} = require("../middleware/authMiddleware");

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
// INDUSTRY AUTHENTICATION
// ============================================================

router.use(
    protect,
    authorize("INDUSTRY")
);


// ============================================================
// APPLICATION DASHBOARD
// GET /api/industry/applications/dashboard
// ============================================================

router.get(
    "/dashboard",
    getIndustryApplicationDashboard
);


// ============================================================
// BULK UPDATE APPLICATION STATUS
// PATCH /api/industry/applications/bulk/status
//
// IMPORTANT:
// This MUST come before /:applicationId/status
// ============================================================

router.patch(
    "/bulk/status",
    bulkUpdateApplicationStatus
);


// ============================================================
// APPLICATIONS FOR ONE INTERNSHIP
// GET /api/industry/applications/internships/:internshipId/applications
// ============================================================

router.get(
    "/internships/:internshipId/applications",
    getInternshipApplications
);


// ============================================================
// INTERNSHIP APPLICATION STATISTICS
// GET /api/industry/applications/internships/:internshipId/stats
// ============================================================

router.get(
    "/internships/:internshipId/stats",
    getInternshipApplicationStats
);


// ============================================================
// ALL APPLICATIONS
// GET /api/industry/applications
// ============================================================

router.get(
    "/",
    getIndustryApplications
);


// ============================================================
// UPDATE SINGLE APPLICATION STATUS
// PATCH /api/industry/applications/:applicationId/status
// ============================================================

router.patch(
    "/:applicationId/status",
    updateApplicationStatus
);


// ============================================================
// SINGLE APPLICATION DETAILS
// GET /api/industry/applications/:applicationId
// ============================================================

router.get(
    "/:applicationId",
    getApplicationDetails
);


module.exports = router;