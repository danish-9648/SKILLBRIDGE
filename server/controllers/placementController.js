// ============================================================
// SKILLBRIDGE - PLACEMENT CONTROLLER
// ============================================================

const StudentProfile = require("../models/StudentProfile");
const {
    getRecommendedInternships
} = require("../services/placementRecommendationService");
// ============================================================
// GET PLACEMENT READINESS
// GET /api/placement/readiness
// ============================================================

const getPlacementReadiness = async (req, res) => {
    try {
        // ----------------------------------------------------
        // Get logged-in user's ID
        // ----------------------------------------------------

        const userId = req.user._id;

        // ----------------------------------------------------
        // Find student's profile
        // ----------------------------------------------------

        const student = await StudentProfile.findOne({
            user: userId
        });

        if (!student) {
            return res.status(404).json({
                success: false,
                message: "Student profile not found."
            });
        }

        // ----------------------------------------------------
        // Student data
        // ----------------------------------------------------

        const skills = student.skills || [];

        const profileCompletion =
            student.profileCompletion || 0;

        const education =
            student.education || [];

        const projects =
            student.projects || [];

        const certifications =
            student.certifications || [];

        // ----------------------------------------------------
        // Calculate average skill score
        // ----------------------------------------------------

        let averageSkillScore = 0;

        if (skills.length > 0) {
            const totalSkillScore = skills.reduce(
                (total, skill) => {
                    return total + (skill.score || 0);
                },
                0
            );

            averageSkillScore =
                totalSkillScore / skills.length;
        }

        // ----------------------------------------------------
        // Calculate project score
        // ----------------------------------------------------

        let projectScore = 0;

        if (projects.length >= 3) {
            projectScore = 100;
        } else if (projects.length === 2) {
            projectScore = 75;
        } else if (projects.length === 1) {
            projectScore = 50;
        }

        // ----------------------------------------------------
        // Calculate certification score
        // ----------------------------------------------------

        let certificationScore = 0;

        if (certifications.length >= 3) {
            certificationScore = 100;
        } else if (certifications.length === 2) {
            certificationScore = 75;
        } else if (certifications.length === 1) {
            certificationScore = 50;
        }

        // ----------------------------------------------------
        // Calculate education score
        // ----------------------------------------------------

        let educationScore = 0;

        if (education.length > 0) {
            educationScore = 100;
        }

        // ----------------------------------------------------
        // FINAL PLACEMENT READINESS SCORE
        //
        // Skills          = 50%
        // Profile         = 20%
        // Projects        = 15%
        // Education       = 10%
        // Certifications  = 5%
        // ----------------------------------------------------

        const readinessScore = Math.round(
            (averageSkillScore * 0.50) +
            (profileCompletion * 0.20) +
            (projectScore * 0.15) +
            (educationScore * 0.10) +
            (certificationScore * 0.05)
        );

        // ----------------------------------------------------
        // Determine readiness level
        // ----------------------------------------------------

        let readinessLevel;

        if (readinessScore >= 80) {
            readinessLevel = "PLACEMENT_READY";
        } else if (readinessScore >= 60) {
            readinessLevel = "ALMOST_READY";
        } else if (readinessScore >= 40) {
            readinessLevel = "NEEDS_IMPROVEMENT";
        } else {
            readinessLevel = "NOT_READY";
        }

        // ----------------------------------------------------
        // Find skill gaps
        // ----------------------------------------------------

        const skillGaps = skills
            .filter(
                skill => (skill.score || 0) < 60
            )
            .map(skill => ({
                name: skill.name,
                score: skill.score || 0,
                level: skill.level
            }));

        // ----------------------------------------------------
        // Strong skills
        // ----------------------------------------------------

        const strongSkills = skills
            .filter(
                skill => (skill.score || 0) >= 70
            )
            .map(skill => ({
                name: skill.name,
                score: skill.score || 0,
                level: skill.level
            }));

        // ----------------------------------------------------
        // Recommendations
        // ----------------------------------------------------

        const recommendations = [];

        if (averageSkillScore < 60) {
            recommendations.push(
                "Improve your technical skills through assessments and hands-on projects."
            );
        }

        if (projects.length < 2) {
            recommendations.push(
                "Build at least 2 strong projects for your placement portfolio."
            );
        }

        if (certifications.length === 0) {
            recommendations.push(
                "Consider completing relevant industry certifications."
            );
        }

        if (profileCompletion < 80) {
            recommendations.push(
                "Complete your student profile to improve your placement readiness."
            );
        }

        if (education.length === 0) {
            recommendations.push(
                "Add your education details to your profile."
            );
        }

        if (recommendations.length === 0) {
            recommendations.push(
                "Excellent progress! Continue practicing coding and interview skills."
            );
        }

        // ----------------------------------------------------
        // Return response
        // ----------------------------------------------------

        return res.status(200).json({
            success: true,

            data: {
                readinessScore,

                readinessLevel,

                averageSkillScore:
                    Math.round(averageSkillScore),

                profileCompletion,

                totalSkills:
                    skills.length,

                totalProjects:
                    projects.length,

                totalCertifications:
                    certifications.length,

                skillGaps,

                strongSkills,

                recommendations
            }
        });

    } catch (error) {

        console.error(
            "Placement Readiness Error:",
            error
        );

        return res.status(500).json({
            success: false,
            message:
                "Failed to calculate placement readiness.",
            error: error.message
        });
    }
};


// ============================================================
// GET PLACEMENT RECOMMENDATIONS
// GET /api/placement/recommendations
// ============================================================


const getPlacementRecommendations = async (
    req,
    res
) => {

    try {

        // ========================================================
        // GET USER
        // ========================================================

        const userId = req.user._id;


        // ========================================================
        // GET STUDENT PROFILE
        // ========================================================

        const student =
            await StudentProfile.findOne({
                user: userId
            });


        if (!student) {

            return res.status(404).json({

                success: false,

                message:
                    "Student profile not found."

            });

        }


        // ========================================================
        // GET INTERNSHIP RECOMMENDATIONS
        // ========================================================

        const internships =
            await getRecommendedInternships(
                student
            );


        // ========================================================
        // SKILL RECOMMENDATIONS
        // ========================================================

        const recommendations = [];


        const skills =
            student.skills || [];


        skills.forEach((skill) => {

            const score =
                Number(skill.score || 0);


            if (score < 40) {

                recommendations.push({

                    type: "SKILL",

                    priority: "HIGH",

                    skill: skill.name,

                    score,

                    message:
                        `Focus strongly on improving ${skill.name} fundamentals.`

                });

            }

            else if (score < 60) {

                recommendations.push({

                    type: "SKILL",

                    priority: "MEDIUM",

                    skill: skill.name,

                    score,

                    message:
                        `Practice ${skill.name} through projects and assessments.`

                });

            }

            else if (score < 75) {

                recommendations.push({

                    type: "SKILL",

                    priority: "LOW",

                    skill: skill.name,

                    score,

                    message:
                        `Continue improving your ${skill.name} proficiency.`

                });

            }

        });


        // ========================================================
        // PROJECT RECOMMENDATION
        // ========================================================

        if (
            (student.projects || []).length < 2
        ) {

            recommendations.push({

                type: "PROJECT",

                priority: "HIGH",

                message:
                    "Build at least 2 practical projects for your placement portfolio."

            });

        }


        // ========================================================
        // CERTIFICATION
        // ========================================================

        if (
            (student.certifications || []).length === 0
        ) {

            recommendations.push({

                type: "CERTIFICATION",

                priority: "MEDIUM",

                message:
                    "Add an industry-relevant certification to strengthen your profile."

            });

        }


        // ========================================================
        // PROFILE
        // ========================================================

        if (
            (student.profileCompletion || 0) < 80
        ) {

            recommendations.push({

                type: "PROFILE",

                priority: "MEDIUM",

                message:
                    "Complete your profile to improve your placement readiness."

            });

        }


        // ========================================================
        // RESPONSE
        // ========================================================

        return res.status(200).json({

            success: true,

            data: {

                recommendations,

                internships

            }

        });

    }

    catch (error) {

        console.error(
            "Placement Recommendations Error:",
            error
        );


        return res.status(500).json({

            success: false,

            message:
                "Failed to generate placement recommendations.",

            error:
                error.message

        });

    }

};



module.exports = {
    getPlacementReadiness,
    getPlacementRecommendations
};

