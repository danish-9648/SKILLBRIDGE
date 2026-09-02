const IndustryProfile = require("../models/IndustryProfile");
const Internship = require("../models/Internship");
const Application = require("../models/InternshipApplication");

// ============================================================
// CREATE / UPDATE INDUSTRY PROFILE
// POST/PUT /api/industry/profile
// ============================================================

const createOrUpdateIndustryProfile = async (req, res) => {
    try {
        const userId = req.user._id;

        const {
            companyName,
            industryType,
            description,
            website,
            email,
            phone,
            location,
            companySize
        } = req.body;

        let profile = await IndustryProfile.findOne({
            user: userId
        });

        if (!profile) {
            profile = new IndustryProfile({
                user: userId
            });
        }

        if (companyName !== undefined) {
            profile.companyName = companyName;
        }

        if (industryType !== undefined) {
            profile.industryType = industryType;
        }

        if (description !== undefined) {
            profile.description = description;
        }

        if (website !== undefined) {
            profile.website = website;
        }

        if (email !== undefined) {
            profile.email = email;
        }

        if (phone !== undefined) {
            profile.phone = phone;
        }

        if (location !== undefined) {
            profile.location = location;
        }

        if (companySize !== undefined) {
            profile.companySize = companySize;
        }

        await profile.save();

        return res.status(200).json({
            success: true,
            message: "Industry profile saved successfully",
            profile
        });

    } catch (error) {
        console.error(
            "Industry Profile Error:",
            error
        );

        return res.status(500).json({
            success: false,
            message:
                "Server error while saving industry profile",
            error: error.message
        });
    }
};


// ============================================================
// GET INDUSTRY PROFILE
// GET /api/industry/profile
// ============================================================

const getIndustryProfile = async (req, res) => {
    try {
        const profile =
            await IndustryProfile.findOne({
                user: req.user._id
            }).populate(
                "user",
                "name email role"
            );

        if (!profile) {
            return res.status(404).json({
                success: false,
                message: "Industry profile not found"
            });
        }

        return res.status(200).json({
            success: true,
            profile
        });

    } catch (error) {
        console.error(
            "Get Industry Profile Error:",
            error
        );

        return res.status(500).json({
            success: false,
            message:
                "Server error while fetching industry profile",
            error: error.message
        });
    }
};


// ============================================================
// CREATE INTERNSHIP
// POST /api/industry/internships
// ============================================================

const createInternship = async (req, res) => {
    try {
        const {
            title,
            description,
            domain,
            requiredSkills,
            eligibility,
            internshipType,
            workMode,
            location,
            duration,
            stipend,
            openings,
            applicationDeadline
        } = req.body;


        // ========================================================
        // BASIC VALIDATION
        // ========================================================

        if (!title || !description || !domain) {
            return res.status(400).json({
                success: false,
                message:
                    "Title, description and domain are required"
            });
        }


        // ========================================================
        // NORMALIZE REQUIRED SKILLS
        // ========================================================

        let normalizedSkills = requiredSkills;


        // If frontend sends JSON string
        if (typeof normalizedSkills === "string") {
            try {
                normalizedSkills =
                    JSON.parse(normalizedSkills);
            } catch (error) {
                return res.status(400).json({
                    success: false,
                    message:
                        "requiredSkills must be a valid array"
                });
            }
        }


        // ========================================================
        // CHECK ARRAY
        // ========================================================

        if (!Array.isArray(normalizedSkills)) {
            return res.status(400).json({
                success: false,
                message:
                    "requiredSkills must be an array"
            });
        }


        // ========================================================
        // CONVERT SKILLS TO STRINGS
        // ========================================================

        normalizedSkills = normalizedSkills
            .map((skill) => {

                // Example:
                // { skill: "JavaScript" }
                // becomes "JavaScript"

                if (
                    typeof skill === "object" &&
                    skill !== null
                ) {
                    return (
                        skill.skill ||
                        skill.name ||
                        skill.title ||
                        ""
                    );
                }

                return String(skill);
            })
            .map((skill) =>
                skill.trim()
            )
            .filter(
                (skill) =>
                    skill.length > 0
            );


        // ========================================================
        // CHECK AT LEAST ONE SKILL
        // ========================================================

        if (normalizedSkills.length === 0) {
            return res.status(400).json({
                success: false,
                message:
                    "At least one required skill is needed"
            });
        }


        // ========================================================
        // CREATE INTERNSHIP
        // ========================================================

        const internship =
            await Internship.create({

                // IMPORTANT:
                // Internship belongs to logged-in industry
                industry: req.user._id,

                title: title.trim(),

                description:
                    description.trim(),

                domain:
                    domain.trim(),

                requiredSkills:
                    normalizedSkills,

                eligibility,

                internshipType,

                workMode,

                location,

                duration,

                stipend,

                openings,

                applicationDeadline
            });


        // ========================================================
        // SUCCESS RESPONSE
        // ========================================================

        return res.status(201).json({
            success: true,
            message:
                "Internship created successfully",
            internship
        });

    } catch (error) {

        console.error(
            "========================================"
        );

        console.error(
            "CREATE INTERNSHIP ERROR"
        );

        console.error(
            "Name:",
            error.name
        );

        console.error(
            "Message:",
            error.message
        );

        console.error(
            "Stack:",
            error.stack
        );

        console.error(
            "========================================"
        );


        // ========================================================
        // MONGOOSE VALIDATION ERROR
        // ========================================================

        if (
            error.name ===
            "ValidationError"
        ) {

            const errors = {};

            Object.keys(
                error.errors
            ).forEach((key) => {

                errors[key] =
                    error.errors[key]
                        .message;
            });

            return res.status(400).json({
                success: false,
                message:
                    "Internship validation failed",
                errors
            });
        }


        // ========================================================
        // OTHER ERROR
        // ========================================================

        return res.status(500).json({
            success: false,
            message:
                "Server error while creating internship",
            error:
                error.message
        });
    }
};


// ============================================================
// GET INDUSTRY'S INTERNSHIPS
// GET /api/industry/internships
// ============================================================

const getMyInternships = async (req, res) => {
    try {

        const internships =
            await Internship.find({
                industry: req.user._id
            })
                .sort({
                    createdAt: -1
                });


        return res.status(200).json({
            success: true,
            count:
                internships.length,
            internships
        });

    } catch (error) {

        console.error(
            "Get My Internships Error:",
            error
        );

        return res.status(500).json({
            success: false,
            message:
                "Server error while fetching internships",
            error:
                error.message
        });
    }
};


// ============================================================
// INDUSTRY DASHBOARD
// GET /api/industry/dashboard
// ============================================================

const getIndustryDashboard = async (req, res) => {
    try {

        // ========================================================
        // 1. AUTHENTICATION CHECK
        // ========================================================

        if (
            !req.user ||
            !req.user._id
        ) {
            return res.status(401).json({
                success: false,
                message:
                    "User authentication required."
            });
        }


        const industryId =
            req.user._id;


        // ========================================================
        // DEBUG INFORMATION
        // ========================================================

        console.log(
            "========================================"
        );

        console.log(
            "INDUSTRY DASHBOARD"
        );

        console.log(
            "Industry ID:",
            industryId
        );

        console.log(
            "Industry Role:",
            req.user.role
        );

        console.log(
            "========================================"
        );


        // ========================================================
        // 2. GET INDUSTRY INTERNSHIPS
        // ========================================================

        const internships =
            await Internship.find({
                industry: industryId
            })
                .sort({
                    createdAt: -1
                })
                .lean();


        console.log(
            "Internships found:",
            internships.length
        );


        // ========================================================
        // 3. INTERNSHIP COUNTS
        // ========================================================

        const totalInternships =
            internships.length;


        const openInternships =
            internships.filter(
                (internship) =>
                    internship.status === "OPEN"
            ).length;


        const closedInternships =
            internships.filter(
                (internship) =>
                    internship.status === "CLOSED"
            ).length;


        // ========================================================
        // 4. GET APPLICATIONS
        // ========================================================

        const internshipIds =
            internships.map(
                (internship) =>
                    internship._id
            );


        let applications = [];


        if (
            internshipIds.length > 0
        ) {

            applications =
                await Application.find({
                    internship: {
                        $in: internshipIds
                    }
                }).lean();
        }


        // ========================================================
        // 5. TOTAL APPLICATIONS
        // ========================================================

        const totalApplications =
            applications.length;


        // ========================================================
        // 6. APPLICATION STATUS COUNTS
        // ========================================================

        const statusCounts = {

            APPLIED: 0,

            UNDER_REVIEW: 0,

            SHORTLISTED: 0,

            REJECTED: 0,

            ACCEPTED: 0
        };


        applications.forEach(
            (application) => {

                const status =
                    application.status;


                if (
                    Object.prototype.hasOwnProperty.call(
                        statusCounts,
                        status
                    )
                ) {

                    statusCounts[
                        status
                    ]++;
                }
            }
        );


        // ========================================================
        // 7. RETURN DASHBOARD
        // ========================================================

        return res.status(200).json({

            success: true,

            dashboard: {

                totalInternships,

                openInternships,

                closedInternships,

                totalApplications,

                statusCounts
            },

            internships
        });


    } catch (error) {

        console.error(
            "========================================"
        );

        console.error(
            "INDUSTRY DASHBOARD ERROR"
        );

        console.error(
            "Name:",
            error.name
        );

        console.error(
            "Message:",
            error.message
        );

        console.error(
            "Stack:",
            error.stack
        );

        console.error(
            "========================================"
        );


        return res.status(500).json({

            success: false,

            message:
                "Server error while loading industry dashboard",

            error:
                error.message
        });
    }
};


// ============================================================
// EXPORT
// ============================================================

module.exports = {

    createOrUpdateIndustryProfile,

    getIndustryProfile,

    createInternship,

    getMyInternships,

    getIndustryDashboard
};