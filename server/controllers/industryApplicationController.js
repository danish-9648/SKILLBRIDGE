const mongoose = require("mongoose");

const Internship = require("../models/Internship");
const InternshipApplication = require("../models/InternshipApplication");
const StudentProfile = require("../models/StudentProfile");

// ============================================================
// CONSTANTS
// ============================================================

const ALLOWED_STATUSES = [
    "APPLIED",
    "UNDER_REVIEW",
    "SHORTLISTED",
    "REJECTED",
    "ACCEPTED"
];


// ============================================================
// HELPER: VALIDATE OBJECT ID
// ============================================================

const isValidObjectId = (id) => {
    return mongoose.Types.ObjectId.isValid(id);
};


// ============================================================
// HELPER: CHECK WHETHER INDUSTRY OWNS INTERNSHIP
// ============================================================

const verifyInternshipOwnership = async (
    internshipId,
    industryId
) => {

    if (
        !isValidObjectId(internshipId) ||
        !isValidObjectId(industryId)
    ) {
        return null;
    }

    return await Internship.findOne({
        _id: internshipId,
        industry: industryId
    });
};


// ============================================================
// GET INDUSTRY APPLICATION DASHBOARD
// ============================================================

const getIndustryApplicationDashboard = async (req, res) => {

    try {

        const industryId = req.user._id;

        // -----------------------------------------------------
        // Find internships created by this industry
        // -----------------------------------------------------

        const internships = await Internship.find({
            industry: industryId
        })
            .select(
                "_id title domain status applicationsCount openings"
            )
            .sort({
                createdAt: -1
            });

        const internshipIds = internships.map(
            internship => internship._id
        );


        // -----------------------------------------------------
        // If industry has no internships
        // -----------------------------------------------------

        if (internshipIds.length === 0) {

            return res.status(200).json({

                success: true,

                dashboard: {
                    totalInternships: 0,
                    openInternships: 0,
                    closedInternships: 0,
                    totalApplications: 0,

                    statusCounts: {
                        APPLIED: 0,
                        UNDER_REVIEW: 0,
                        SHORTLISTED: 0,
                        REJECTED: 0,
                        ACCEPTED: 0
                    }
                },

                internships: []
            });
        }


        // -----------------------------------------------------
        // Find applications
        // -----------------------------------------------------

        const applications =
            await InternshipApplication.find({

                internship: {
                    $in: internshipIds
                }

            });


        // -----------------------------------------------------
        // Status counts
        // -----------------------------------------------------

        const statusCounts = {

            APPLIED: 0,

            UNDER_REVIEW: 0,

            SHORTLISTED: 0,

            REJECTED: 0,

            ACCEPTED: 0
        };


        applications.forEach(application => {

            if (
                Object.prototype.hasOwnProperty.call(
                    statusCounts,
                    application.status
                )
            ) {

                statusCounts[application.status]++;
            }

        });


        // -----------------------------------------------------
        // Internship statistics
        // -----------------------------------------------------

        const totalInternships =
            internships.length;

        const openInternships =
            internships.filter(
                internship =>
                    internship.status === "OPEN"
            ).length;

        const closedInternships =
            internships.filter(
                internship =>
                    internship.status === "CLOSED"
            ).length;


        // -----------------------------------------------------
        // Response
        // -----------------------------------------------------

        return res.status(200).json({

            success: true,

            dashboard: {

                totalInternships,

                openInternships,

                closedInternships,

                totalApplications:
                    applications.length,

                statusCounts
            },

            internships

        });

    } catch (error) {

        console.error(
            "Industry Application Dashboard Error:",
            error
        );

        return res.status(500).json({

            success: false,

            message:
                "Server error while loading industry application dashboard"
        });
    }
};


// ============================================================
// GET ALL APPLICATIONS FOR INDUSTRY
// ============================================================

const getIndustryApplications = async (req, res) => {

    try {

        const industryId = req.user._id;


        // -----------------------------------------------------
        // Find internships owned by industry
        // -----------------------------------------------------

        const internships =
            await Internship.find({
                industry: industryId
            })
            .select("_id");


        const internshipIds =
            internships.map(
                internship => internship._id
            );


        // -----------------------------------------------------
        // Find applications
        // -----------------------------------------------------

        const applications =
            await InternshipApplication
                .find({

                    internship: {
                        $in: internshipIds
                    }

                })
                .populate({

                    path: "internship",

                    select:
                        "title description domain location workMode stipend status openings applicationDeadline"

                })
                .populate({

                    path: "student",

                    select:
                        "name email role createdAt"

                })
                .sort({

                    createdAt: -1

                });


        return res.status(200).json({

            success: true,

            count:
                applications.length,

            applications

        });

    } catch (error) {

        console.error(
            "Get Industry Applications Error:",
            error
        );

        return res.status(500).json({

            success: false,

            message:
                "Server error while fetching industry applications"
        });
    }
};


// ============================================================
// GET APPLICATIONS FOR ONE INTERNSHIP
// ============================================================

const getInternshipApplications = async (req, res) => {

    try {

        const {
            internshipId
        } = req.params;


        const industryId =
            req.user._id;


        // -----------------------------------------------------
        // Verify internship ownership
        // -----------------------------------------------------

        const internship =
            await verifyInternshipOwnership(
                internshipId,
                industryId
            );


        if (!internship) {

            return res.status(404).json({

                success: false,

                message:
                    "Internship not found or you do not own this internship"
            });
        }


        // -----------------------------------------------------
        // Get applications
        // -----------------------------------------------------

        const applications =
            await InternshipApplication
                .find({

                    internship:
                        internship._id

                })
                .populate({

                    path: "student",

                    select:
                        "name email role createdAt"

                })
                .sort({

                    matchScore: -1,

                    createdAt: -1

                });


        return res.status(200).json({

            success: true,

            internship: {

                id:
                    internship._id,

                title:
                    internship.title,

                domain:
                    internship.domain,

                openings:
                    internship.openings,

                applicationsCount:
                    internship.applicationsCount,

                status:
                    internship.status

            },

            count:
                applications.length,

            applications

        });

    } catch (error) {

        console.error(
            "Get Internship Applications Error:",
            error
        );

        return res.status(500).json({

            success: false,

            message:
                "Server error while fetching internship applications"
        });
    }
};


// ============================================================
// GET SINGLE APPLICATION DETAILS
// ============================================================

const getApplicationDetails = async (req, res) => {

    try {

        const {
            applicationId
        } = req.params;


        // -----------------------------------------------------
        // Validate ID
        // -----------------------------------------------------

        if (!isValidObjectId(applicationId)) {

            return res.status(400).json({

                success: false,

                message:
                    "Invalid application ID"
            });
        }


        // -----------------------------------------------------
        // Find application
        // -----------------------------------------------------

        const application =
            await InternshipApplication
                .findById(applicationId)

                .populate({

                    path: "internship",

                    select:
                        "title description domain requiredSkills eligibility internshipType workMode location duration stipend openings applicationDeadline status industry"

                })

                .populate({

                    path: "student",

                    select:
                        "name email role createdAt"

                });


        if (!application) {

            return res.status(404).json({

                success: false,

                message:
                    "Application not found"
            });
        }


        // -----------------------------------------------------
        // Make sure internship exists
        // -----------------------------------------------------

        if (!application.internship) {

            return res.status(404).json({

                success: false,

                message:
                    "Associated internship not found"
            });
        }


        // -----------------------------------------------------
        // Verify ownership
        // -----------------------------------------------------

        if (
            application.internship.industry.toString() !==
            req.user._id.toString()
        ) {

            return res.status(403).json({

                success: false,

                message:
                    "You are not authorized to view this application"
            });
        }


        // -----------------------------------------------------
        // Student profile
        // -----------------------------------------------------

        const studentProfile =
            await StudentProfile.findOne({

                user:
                    application.student._id

            });


        return res.status(200).json({

            success: true,

            application,

            studentProfile:
                studentProfile || null

        });

    } catch (error) {

        console.error(
            "Get Application Details Error:",
            error
        );

        return res.status(500).json({

            success: false,

            message:
                "Server error while fetching application details"
        });
    }
};


// ============================================================
// UPDATE APPLICATION STATUS
// ============================================================

const updateApplicationStatus = async (req, res) => {

    try {

        const {
            applicationId
        } = req.params;

        const {
            status
        } = req.body;


        // -----------------------------------------------------
        // Validate application ID
        // -----------------------------------------------------

        if (!isValidObjectId(applicationId)) {

            return res.status(400).json({

                success: false,

                message:
                    "Invalid application ID"
            });
        }


        // -----------------------------------------------------
        // Validate status
        // -----------------------------------------------------

        if (
            !status ||
            !ALLOWED_STATUSES.includes(status)
        ) {

            return res.status(400).json({

                success: false,

                message:
                    "Invalid application status",

                allowedStatuses:
                    ALLOWED_STATUSES

            });
        }


        // -----------------------------------------------------
        // Find application
        // -----------------------------------------------------

        const application =
            await InternshipApplication
                .findById(applicationId)
                .populate(
                    "internship",
                    "title industry openings applicationsCount status"
                );


        if (!application) {

            return res.status(404).json({

                success: false,

                message:
                    "Application not found"
            });
        }


        // -----------------------------------------------------
        // Verify internship
        // -----------------------------------------------------

        if (!application.internship) {

            return res.status(404).json({

                success: false,

                message:
                    "Associated internship not found"
            });
        }


        // -----------------------------------------------------
        // Verify ownership
        // -----------------------------------------------------

        if (
            application.internship.industry.toString() !==
            req.user._id.toString()
        ) {

            return res.status(403).json({

                success: false,

                message:
                    "You are not authorized to modify this application"
            });
        }


        // -----------------------------------------------------
        // Prevent accepting beyond openings
        // -----------------------------------------------------

        if (
            status === "ACCEPTED" &&
            application.status !== "ACCEPTED"
        ) {

            const acceptedCount =
                await InternshipApplication.countDocuments({

                    internship:
                        application.internship._id,

                    status:
                        "ACCEPTED"

                });


            const openings =
                Number(
                    application.internship.openings || 1
                );


            if (acceptedCount >= openings) {

                return res.status(400).json({

                    success: false,

                    message:
                        "All available internship openings have already been filled",

                    openings,

                    acceptedCount

                });
            }
        }


        // -----------------------------------------------------
        // Update status
        // -----------------------------------------------------

        application.status =
            status;


        await application.save();


        // -----------------------------------------------------
        // Response
        // -----------------------------------------------------

        return res.status(200).json({

            success: true,

            message:
                `Application status updated to ${status}`,

            application: {

                id:
                    application._id,

                internship:
                    application.internship.title,

                status:
                    application.status,

                matchScore:
                    application.matchScore,

                updatedAt:
                    application.updatedAt

            }

        });

    } catch (error) {

        console.error(
            "Update Application Status Error:",
            error
        );

        return res.status(500).json({

            success: false,

            message:
                "Server error while updating application status"
        });
    }
};


// ============================================================
// BULK UPDATE APPLICATION STATUS
// ============================================================

const bulkUpdateApplicationStatus = async (req, res) => {

    try {

        const {
            applicationIds,
            status
        } = req.body;


        // -----------------------------------------------------
        // Validate IDs
        // -----------------------------------------------------

        if (
            !Array.isArray(applicationIds) ||
            applicationIds.length === 0
        ) {

            return res.status(400).json({

                success: false,

                message:
                    "applicationIds must be a non-empty array"
            });
        }


        // -----------------------------------------------------
        // Validate status
        // -----------------------------------------------------

        if (!ALLOWED_STATUSES.includes(status)) {

            return res.status(400).json({

                success: false,

                message:
                    "Invalid application status",

                allowedStatuses:
                    ALLOWED_STATUSES
            });
        }


        // -----------------------------------------------------
        // Validate every ID
        // -----------------------------------------------------

        const invalidId =
            applicationIds.some(
                id => !isValidObjectId(id)
            );


        if (invalidId) {

            return res.status(400).json({

                success: false,

                message:
                    "One or more application IDs are invalid"
            });
        }


        // -----------------------------------------------------
        // Find applications
        // -----------------------------------------------------

        const applications =
            await InternshipApplication
                .find({

                    _id: {
                        $in: applicationIds
                    }

                })
                .populate(
                    "internship",
                    "industry openings"
                );


        // -----------------------------------------------------
        // Make sure all applications exist
        // -----------------------------------------------------

        if (
            applications.length !==
            applicationIds.length
        ) {

            return res.status(404).json({

                success: false,

                message:
                    "One or more applications were not found"
            });
        }


        // -----------------------------------------------------
        // Security check
        // -----------------------------------------------------

        const unauthorized =
            applications.some(
                application =>
                    !application.internship ||
                    application.internship.industry.toString() !==
                    req.user._id.toString()
            );


        if (unauthorized) {

            return res.status(403).json({

                success: false,

                message:
                    "One or more applications do not belong to your internships"
            });
        }


        // -----------------------------------------------------
        // Check openings when accepting
        // -----------------------------------------------------

        if (status === "ACCEPTED") {

            const internshipGroups = {};


            applications.forEach(application => {

                const internshipId =
                    application.internship._id.toString();


                if (
                    !internshipGroups[internshipId]
                ) {

                    internshipGroups[internshipId] = [];
                }


                internshipGroups[internshipId].push(
                    application
                );

            });


            for (
                const internshipId
                of Object.keys(internshipGroups)
            ) {

                const group =
                    internshipGroups[internshipId];


                const internship =
                    group[0].internship;


                const acceptedCount =
                    await InternshipApplication.countDocuments({

                        internship:
                            internshipId,

                        status:
                            "ACCEPTED"

                    });


                const newAccepted =
                    group.filter(
                        application =>
                            application.status !==
                            "ACCEPTED"
                    ).length;


                const openings =
                    Number(
                        internship.openings || 1
                    );


                if (
                    acceptedCount +
                    newAccepted >
                    openings
                ) {

                    return res.status(400).json({

                        success: false,

                        message:
                            "Accepting these applications exceeds the available internship openings",

                        internshipId,

                        openings,

                        acceptedCount,

                        requestedAcceptances:
                            newAccepted

                    });
                }
            }
        }


        // -----------------------------------------------------
        // Update applications
        // -----------------------------------------------------

        const result =
            await InternshipApplication.updateMany(

                {
                    _id: {
                        $in: applicationIds
                    }
                },

                {
                    $set: {
                        status
                    }
                }

            );


        return res.status(200).json({

            success: true,

            message:
                `${result.modifiedCount} application(s) updated successfully`,

            modifiedCount:
                result.modifiedCount,

            status

        });

    } catch (error) {

        console.error(
            "Bulk Update Application Error:",
            error
        );

        return res.status(500).json({

            success: false,

            message:
                "Server error while updating applications"
        });
    }
};


// ============================================================
// GET APPLICATION STATISTICS FOR ONE INTERNSHIP
// ============================================================

const getInternshipApplicationStats = async (req, res) => {

    try {

        const {
            internshipId
        } = req.params;


        // -----------------------------------------------------
        // Verify ownership
        // -----------------------------------------------------

        const internship =
            await verifyInternshipOwnership(

                internshipId,

                req.user._id

            );


        if (!internship) {

            return res.status(404).json({

                success: false,

                message:
                    "Internship not found or unauthorized"
            });
        }


        // -----------------------------------------------------
        // Status statistics
        // -----------------------------------------------------

        const stats =
            await InternshipApplication.aggregate([

                {
                    $match: {

                        internship:
                            internship._id

                    }
                },

                {
                    $group: {

                        _id:
                            "$status",

                        count: {
                            $sum: 1
                        }

                    }
                }

            ]);


        const statusCounts = {

            APPLIED: 0,

            UNDER_REVIEW: 0,

            SHORTLISTED: 0,

            REJECTED: 0,

            ACCEPTED: 0

        };


        stats.forEach(item => {

            if (
                Object.prototype.hasOwnProperty.call(
                    statusCounts,
                    item._id
                )
            ) {

                statusCounts[item._id] =
                    item.count;
            }

        });


        // -----------------------------------------------------
        // Match score statistics
        // -----------------------------------------------------

        const matchStats =
            await InternshipApplication.aggregate([

                {
                    $match: {

                        internship:
                            internship._id

                    }
                },

                {
                    $group: {

                        _id: null,

                        averageMatchScore: {
                            $avg:
                                "$matchScore"
                        },

                        highestMatchScore: {
                            $max:
                                "$matchScore"
                        },

                        lowestMatchScore: {
                            $min:
                                "$matchScore"
                        }

                    }
                }

            ]);


        const scoreStats =
            matchStats[0] || {};


        // -----------------------------------------------------
        // Response
        // -----------------------------------------------------

        return res.status(200).json({

            success: true,

            internship: {

                id:
                    internship._id,

                title:
                    internship.title,

                openings:
                    internship.openings,

                applicationsCount:
                    internship.applicationsCount

            },

            statusCounts,

            matchScore: {

                average:
                    scoreStats.averageMatchScore || 0,

                highest:
                    scoreStats.highestMatchScore || 0,

                lowest:
                    scoreStats.lowestMatchScore || 0

            }

        });

    } catch (error) {

        console.error(
            "Internship Application Stats Error:",
            error
        );

        return res.status(500).json({

            success: false,

            message:
                "Server error while calculating application statistics"
        });
    }
};


// ============================================================
// EXPORT
// ============================================================

module.exports = {

    getIndustryApplicationDashboard,

    getIndustryApplications,

    getInternshipApplications,

    getApplicationDetails,

    updateApplicationStatus,

    bulkUpdateApplicationStatus,

    getInternshipApplicationStats

};