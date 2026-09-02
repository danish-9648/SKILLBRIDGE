const Internship =
    require("../models/Internship");

const InternshipApplication =
    require("../models/InternshipApplication");

const StudentProfile =
    require("../models/StudentProfile");

const {
    calculateInternshipMatch,
    getRecommendedInternships
} = require("../services/matchingService");


// ========================================
// GET ALL INTERNSHIPS
// ========================================

const getAllInternships =
    async (req, res) => {

        try {

            const internships =
                await Internship.find({
                    status: "OPEN"
                })
                .populate(
                    "industry",
                    "name email"
                )
                .sort({
                    createdAt: -1
                });


            res.status(200).json({

                success: true,

                count:
                    internships.length,

                internships
            });

        } catch (error) {

            console.error(
                "Get Internships Error:",
                error
            );

            res.status(500).json({

                success: false,

                message:
                    "Server error while fetching internships"
            });
        }
    };


// ========================================
// RECOMMENDED INTERNSHIPS
// ========================================

const getRecommendations =
    async (req, res) => {

        try {

            const recommendations =
                await getRecommendedInternships(
                    req.user._id
                );


            res.status(200).json({

                success: true,

                count:
                    recommendations.length,

                recommendations
            });

        } catch (error) {

            console.error(
                "Recommendation Error:",
                error
            );

            res.status(500).json({

                success: false,

                message:
                    "Server error while generating recommendations"
            });
        }
    };


// ========================================
// GET INTERNSHIP DETAILS
// ========================================

const getInternshipDetails =
    async (req, res) => {

        try {

            const internship =
                await Internship.findById(
                    req.params.id
                )
                .populate(
                    "industry",
                    "name email"
                );


            if (!internship) {

                return res.status(404).json({

                    success: false,

                    message:
                        "Internship not found"
                });
            }


            const match =
                await calculateInternshipMatch(
                    req.user._id,

                    internship
                );


            res.status(200).json({

                success: true,

                internship,

                match
            });

        } catch (error) {

            console.error(
                "Internship Details Error:",
                error
            );

            res.status(500).json({

                success: false,

                message:
                    "Server error while fetching internship"
            });
        }
    };


// ========================================
// APPLY FOR INTERNSHIP
// ========================================

const applyForInternship =
    async (req, res) => {

        try {

            const {
                coverLetter
            } = req.body || {};


            // --------------------------------
            // Find internship
            // --------------------------------

            const internship =
                await Internship.findById(
                    req.params.id
                );


            if (!internship) {

                return res.status(404).json({

                    success: false,

                    message:
                        "Internship not found"
                });
            }


            // --------------------------------
            // Check status
            // --------------------------------

            if (
                internship.status !==
                "OPEN"
            ) {

                return res.status(400).json({

                    success: false,

                    message:
                        "This internship is no longer accepting applications"
                });
            }


            // --------------------------------
            // Check deadline
            // --------------------------------

            if (
                internship.applicationDeadline &&
                new Date(
                    internship.applicationDeadline
                ) < new Date()
            ) {

                return res.status(400).json({

                    success: false,

                    message:
                        "The application deadline has passed"
                });
            }


            // --------------------------------
            // Check existing application
            // --------------------------------

            const existingApplication =
                await InternshipApplication.findOne({

                    internship:
                        internship._id,

                    student:
                        req.user._id
                });


            if (existingApplication) {

                return res.status(409).json({

                    success: false,

                    message:
                        "You have already applied for this internship",

                    application: {

                        id:
                            existingApplication._id,

                        status:
                            existingApplication.status,

                        matchScore:
                            existingApplication.matchScore
                    }
                });
            }


            // --------------------------------
            // Calculate match
            // --------------------------------

            const match =
                await calculateInternshipMatch(

                    req.user._id,

                    internship
                );


            // --------------------------------
            // Create application
            // --------------------------------

            const application =
                await InternshipApplication.create({

                    internship:
                        internship._id,

                    student:
                        req.user._id,

                    matchScore:
                        match.matchScore,

                    matchingSkills:
                        match.matchingSkills,

                    missingSkills:
                        match.missingSkills,

                    coverLetter:
                        coverLetter || ""
                });


            // --------------------------------
            // Update application count
            // --------------------------------

            internship.applicationsCount =
                Number(
                    internship.applicationsCount || 0
                ) + 1;


            await internship.save();


            // --------------------------------
            // Success response
            // --------------------------------

            return res.status(201).json({

                success: true,

                message:
                    "Internship application submitted successfully",

                application: {

                    id:
                        application._id,

                    matchScore:
                        application.matchScore,

                    matchingSkills:
                        application.matchingSkills,

                    missingSkills:
                        application.missingSkills,

                    status:
                        application.status
                }
            });

        } catch (error) {

            console.error(
                "Apply Internship Error:",
                error
            );


            return res.status(500).json({

                success: false,

                message:
                    "Server error while applying for internship"
            });
        }
    };


// ========================================
// GET MY APPLICATIONS
// ========================================

const getMyApplications =
    async (req, res) => {

        try {

            const applications =
                await InternshipApplication
                    .find({

                        student:
                            req.user._id
                    })
                    .populate(
                        "internship"
                    )
                    .sort({

                        createdAt: -1
                    });


            res.status(200).json({

                success: true,

                count:
                    applications.length,

                applications
            });

        } catch (error) {

            console.error(
                "Get Applications Error:",
                error
            );


            res.status(500).json({

                success: false,

                message:
                    "Server error while fetching applications"
            });
        }
    };


module.exports = {

    getAllInternships,

    getRecommendations,

    getInternshipDetails,

    applyForInternship,

    getMyApplications
};