const express = require("express");

const router = express.Router();

const {
    protect,
    authorize
} = require("../middleware/authMiddleware");

const {
    getStudentDashboard,
    getStudentProfile,
    updateStudentProfile
} = require("../controllers/studentController");


// ========================================
// ALL STUDENT ROUTES
// ========================================

router.use(
    protect,
    authorize("STUDENT")
);


// ========================================
// DASHBOARD
// GET /api/students/dashboard
// ========================================

router.get(
    "/dashboard",
    getStudentDashboard
);


// ========================================
// GET PROFILE
// GET /api/students/profile
// ========================================

router.get(
    "/profile",
    getStudentProfile
);


// ========================================
// UPDATE PROFILE
// PUT /api/students/profile
// ========================================

router.put(
    "/profile",
    updateStudentProfile
);


module.exports = router;