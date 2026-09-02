
const User = require("../models/user");
const StudentProfile = require("../models/StudentProfile");
const Internship = require("../models/Internship");
const Assessment = require("../models/Assessment");

const {
    calculateMatchFromProfile
} = require("../services/matchingService");

// ============================================================
// GET STUDENT DASHBOARD
// GET /api/students/dashboard
// ============================================================

const getStudentDashboard = async (req, res) => {
    try {
        const user = req.user;

        // --------------------------------------------------------
        // FIND OR CREATE STUDENT PROFILE
        // --------------------------------------------------------

        let studentProfile = await StudentProfile.findOne({
            user: user._id
        });

        if (!studentProfile) {
            console.log(
                "⚠️ StudentProfile not found. Creating profile for:",
                user._id
            );

            studentProfile = new StudentProfile({
                user: user._id,
                skills: [],
                preferredDomains: [],
                careerGoal: "",
                profileCompletion: 20
            });

            await studentProfile.save();

            console.log(
                "✅ StudentProfile created:",
                studentProfile._id
            );
        }

        // Convert Mongoose document to plain object
        studentProfile = studentProfile.toObject();

        // --------------------------------------------------------
        // LATEST ASSESSMENT
        // --------------------------------------------------------

        const latestAssessment = await Assessment.findOne({
            student: user._id
        })
            .sort({ createdAt: -1 })
            .lean();

        // --------------------------------------------------------
        // STUDENT SKILLS
        // --------------------------------------------------------

        const skills = Array.isArray(studentProfile.skills)
            ? studentProfile.skills
            : [];

        // --------------------------------------------------------
        // OVERALL SKILL SCORE
        // --------------------------------------------------------

        let overallSkillScore = 0;

        if (skills.length > 0) {
            const totalScore = skills.reduce(
                (sum, skill) =>
                    sum + Number(skill.score || 0),
                0
            );

            overallSkillScore = Math.round(
                totalScore / skills.length
            );
        } else if (
            latestAssessment &&
            latestAssessment.overallScore !== undefined
        ) {
            overallSkillScore = Number(
                latestAssessment.overallScore
            );
        }

        // --------------------------------------------------------
        // PROFILE COMPLETION
        // --------------------------------------------------------

        const profileCompletion = Number(
            studentProfile.profileCompletion || 20
        );

        // --------------------------------------------------------
        // GET OPEN INTERNSHIPS
        // --------------------------------------------------------

        const internships = await Internship.find({
            status: "OPEN"
        })
            .sort({ createdAt: -1 })
            .limit(20)
            .lean();

        // --------------------------------------------------------
        // CALCULATE INTERNSHIP MATCHES
        // matchingService.js is the ONLY matching engine
        // --------------------------------------------------------

        const recommendedInternships = internships.map(
            (internship) => {

                const match = calculateMatchFromProfile(
                    studentProfile,
                    internship.requiredSkills || []
                );

                return {
                    id: internship._id,

                    title:
                        internship.title ||
                        "Internship",

                    company:
                        internship.company ||
                        "Industry Partner",

                    location:
                        internship.location ||
                        "Remote",

                    duration:
                        internship.duration ||
                        "3 Months",

                    score:
                        match.matchScore,

                    matchScore:
                        match.matchScore,

                    requiredSkills:
                        internship.requiredSkills || [],

                    skills:
                        internship.requiredSkills || [],

                    matchedSkills:
                        match.matchingSkills || [],

                    missingSkills:
                        match.missingSkills || [],

                    partialSkills:
                        match.partialSkills || [],

                    skillGaps:
                        match.skillGaps || [],

                    readiness:
                        match.readiness || "LOW",

                    workMode:
                        internship.workMode ||
                        "REMOTE",

                    internshipType:
                        internship.internshipType ||
                        "INTERNSHIP",

                    domain:
                        internship.domain ||
                        "",

                    stipend:
                        internship.stipend ||
                        "",

                    openings:
                        internship.openings || 1,

                    applicationDeadline:
                        internship.applicationDeadline || null
                };
            }
        );

        // --------------------------------------------------------
        // SORT BY BEST MATCH
        // --------------------------------------------------------

        recommendedInternships.sort(
            (a, b) =>
                Number(b.matchScore || 0) -
                Number(a.matchScore || 0)
        );

        // --------------------------------------------------------
        // SHOW TOP 6 ON DASHBOARD
        // --------------------------------------------------------

        const dashboardInternships =
            recommendedInternships.slice(0, 6);

        // --------------------------------------------------------
        // CAREER GOAL
        // --------------------------------------------------------

        const careerGoal =
            studentProfile.careerGoal ||
            latestAssessment?.recommendedCareer ||
            "Career Goal not set";

        // --------------------------------------------------------
        // CAREER INSIGHT
        // --------------------------------------------------------

        const careerInsight =
            skills.length > 0
                ? `Your strongest areas include ${skills
                    .slice(0, 3)
                    .map((skill) => skill.name)
                    .join(", ")}.`
                : "Complete your skill assessment to discover your strengths.";

        // --------------------------------------------------------
        // CAREER READINESS
        // --------------------------------------------------------

        const readinessScore = Math.min(
            Math.round(
                overallSkillScore * 0.6 +
                profileCompletion * 0.4
            ),
            100
        );

        // --------------------------------------------------------
        // READINESS MESSAGE
        // --------------------------------------------------------

        let readinessMessage;

        if (readinessScore >= 80) {
            readinessMessage =
                "You are highly prepared for internship opportunities. Keep improving your weaker skills.";
        } else if (readinessScore >= 60) {
            readinessMessage =
                "You are making good progress. Strengthen your skill gaps to improve internship readiness.";
        } else {
            readinessMessage =
                "Complete your profile and strengthen your skills to improve career readiness.";
        }

        // --------------------------------------------------------
        // DASHBOARD RESPONSE
        // --------------------------------------------------------

        return res.status(200).json({
            success: true,

            data: {

                // ------------------------------------------------
                // STUDENT
                // ------------------------------------------------

                student: {
                    id: user._id,
                    name: user.name,
                    email: user.email,
                    role: user.role
                },

                // ------------------------------------------------
                // CAREER
                // ------------------------------------------------

                career: {
                    goal: careerGoal,
                    matchScore: overallSkillScore,
                    insight: careerInsight
                },

                // ------------------------------------------------
                // DASHBOARD STATS
                // ------------------------------------------------

                stats: {
                    overallSkillScore,
                    skillsAssessed: skills.length,
                    recommendedMatches:
                        recommendedInternships.length,
                    profileCompletion
                },

                // ------------------------------------------------
                // SKILLS
                // ------------------------------------------------

                skills,

                // ------------------------------------------------
                // LATEST ASSESSMENT
                // ------------------------------------------------

                assessment:
                    latestAssessment
                        ? {
                              id:
                                  latestAssessment._id,

                              status:
                                  latestAssessment.status,

                              overallScore:
                                  latestAssessment.overallScore,

                              strengths:
                                  latestAssessment.strengths || [],

                              skillGaps:
                                  latestAssessment.skillGaps || [],

                              recommendedCareer:
                                  latestAssessment.recommendedCareer
                          }
                        : null,

                // ------------------------------------------------
                // INTERNSHIPS
                // ------------------------------------------------

                internships:
                    dashboardInternships,

                // ------------------------------------------------
                // READINESS
                // ------------------------------------------------

                readiness: {
                    score: readinessScore,
                    message: readinessMessage
                }
            }
        });

    } catch (error) {

        console.error(
            "Student Dashboard Error:",
            error
        );

        return res.status(500).json({
            success: false,
            message:
                "Server error while loading student dashboard.",
            error:
                process.env.NODE_ENV === "development"
                    ? error.message
                    : undefined
        });
    }
};


// ============================================================
// GET STUDENT PROFILE
// GET /api/students/profile
// ============================================================

const getStudentProfile = async (req, res) => {
    try {

        let profile = await StudentProfile.findOne({
            user: req.user._id
        })
            .populate(
                "user",
                "name email role"
            )
            .lean();

        // --------------------------------------------------------
        // CREATE PROFILE IF MISSING
        // --------------------------------------------------------

        if (!profile) {

            console.log(
                "⚠️ StudentProfile missing. Creating profile..."
            );

            const newProfile =
                await StudentProfile.create({
                    user: req.user._id,
                    skills: [],
                    preferredDomains: [],
                    careerGoal: "",
                    profileCompletion: 20
                });

            profile =
                await StudentProfile.findById(
                    newProfile._id
                )
                    .populate(
                        "user",
                        "name email role"
                    )
                    .lean();

            console.log(
                "✅ StudentProfile created:",
                newProfile._id
            );
        }

        return res.status(200).json({
            success: true,
            profile
        });

    } catch (error) {

        console.error(
            "Get Student Profile Error:",
            error
        );

        return res.status(500).json({
            success: false,
            message:
                "Server error while fetching profile"
        });
    }
};


// ============================================================
// UPDATE STUDENT PROFILE
// PUT /api/students/profile
// ============================================================

const updateStudentProfile = async (req, res) => {

    try {

        const {
            name,
            phone,
            dateOfBirth,
            gender,
            location,
            bio,
            careerGoal,
            preferredDomains,
            skills,
            education,
            projects,
            certifications,
            achievements,
            resumeUrl
        } = req.body;

        // --------------------------------------------------------
        // UPDATE USER NAME
        // --------------------------------------------------------

        if (name !== undefined) {

            if (
                typeof name !== "string" ||
                !name.trim()
            ) {

                return res.status(400).json({
                    success: false,
                    message:
                        "Name cannot be empty"
                });
            }

            await User.findByIdAndUpdate(
                req.user._id,
                {
                    name: name.trim()
                },
                {
                    new: true
                }
            );
        }

        // --------------------------------------------------------
        // FIND OR CREATE PROFILE
        // --------------------------------------------------------

        let profile =
            await StudentProfile.findOne({
                user: req.user._id
            });

        if (!profile) {

            console.log(
                "⚠️ Creating StudentProfile during update..."
            );

            profile = new StudentProfile({
                user: req.user._id,
                skills: [],
                preferredDomains: [],
                profileCompletion: 20
            });
        }

        // --------------------------------------------------------
        // BASIC INFORMATION
        // --------------------------------------------------------

        if (phone !== undefined) {
            profile.phone = phone;
        }

        if (dateOfBirth !== undefined) {
            profile.dateOfBirth =
                dateOfBirth || null;
        }

        if (gender !== undefined) {
            profile.gender =
                gender || undefined;
        }

        if (bio !== undefined) {
            profile.bio = bio;
        }

        if (careerGoal !== undefined) {
            profile.careerGoal = careerGoal;
        }

        // --------------------------------------------------------
        // PREFERRED DOMAINS
        // --------------------------------------------------------

        if (preferredDomains !== undefined) {

            profile.preferredDomains =
                Array.isArray(preferredDomains)
                    ? preferredDomains
                    : [];
        }

        // --------------------------------------------------------
        // SKILLS
        // --------------------------------------------------------

        if (skills !== undefined) {

            if (!Array.isArray(skills)) {

                return res.status(400).json({
                    success: false,
                    message:
                        "Skills must be an array."
                });
            }

            profile.skills = skills.map(
                (skill) => ({

                    name:
                        skill.name ||
                        skill.skillName ||
                        skill.title ||
                        "Unknown Skill",

                    category:
                        skill.category ||
                        "TECHNICAL",

                    level:
                        skill.level ||
                        "BEGINNER",

                    score:
                        Math.max(
                            0,
                            Math.min(
                                100,
                                Number(
                                    skill.score ??
                                    skill.percentage ??
                                    skill.marks ??
                                    0
                                )
                            )
                        )
                })
            );
        }

        // --------------------------------------------------------
        // EDUCATION
        // --------------------------------------------------------

        if (education !== undefined) {

            profile.education =
                Array.isArray(education)
                    ? education
                    : [];
        }

        // --------------------------------------------------------
        // PROJECTS
        // --------------------------------------------------------

        if (projects !== undefined) {

            profile.projects =
                Array.isArray(projects)
                    ? projects
                    : [];
        }

        // --------------------------------------------------------
        // CERTIFICATIONS
        // --------------------------------------------------------

        if (certifications !== undefined) {

            profile.certifications =
                Array.isArray(certifications)
                    ? certifications
                    : [];
        }

        // --------------------------------------------------------
        // ACHIEVEMENTS
        // --------------------------------------------------------

        if (achievements !== undefined) {

            profile.achievements =
                Array.isArray(achievements)
                    ? achievements
                    : [];
        }

        // --------------------------------------------------------
        // RESUME
        // --------------------------------------------------------

        if (resumeUrl !== undefined) {
            profile.resumeUrl = resumeUrl;
        }

        // --------------------------------------------------------
        // LOCATION
        // --------------------------------------------------------

        if (location !== undefined) {

            profile.location = {

                city:
                    location?.city || "",

                state:
                    location?.state || "",

                country:
                    location?.country ||
                    "India"
            };
        }

        // --------------------------------------------------------
        // PROFILE COMPLETION
        // --------------------------------------------------------

        let completion = 20;

        if (profile.phone) {
            completion += 10;
        }

        if (profile.bio) {
            completion += 10;
        }

        if (profile.careerGoal) {
            completion += 10;
        }

        if (
            profile.location?.city &&
            profile.location?.state
        ) {
            completion += 10;
        }

        if (
            profile.education &&
            profile.education.length > 0
        ) {
            completion += 15;
        }

        if (
            profile.skills &&
            profile.skills.length > 0
        ) {
            completion += 15;
        }

        if (
            profile.projects &&
            profile.projects.length > 0
        ) {
            completion += 5;
        }

        if (
            profile.certifications &&
            profile.certifications.length > 0
        ) {
            completion += 5;
        }

        profile.profileCompletion =
            Math.min(completion, 100);

        // --------------------------------------------------------
        // SAVE PROFILE
        // --------------------------------------------------------

        await profile.save();

        console.log(
            "✅ StudentProfile saved:",
            profile._id
        );

        console.log(
            "📚 Saved Skills:",
            profile.skills
        );

        // --------------------------------------------------------
        // RETURN UPDATED PROFILE
        // --------------------------------------------------------

        const updatedProfile =
            await StudentProfile.findOne({
                user: req.user._id
            })
                .populate(
                    "user",
                    "name email role"
                )
                .lean();

        return res.status(200).json({

            success: true,

            message:
                "Profile updated successfully",

            profile:
                updatedProfile
        });

    } catch (error) {

        console.error(
            "Update Student Profile Error:",
            error
        );

        return res.status(500).json({

            success: false,

            message:
                "Server error while updating profile",

            error:
                process.env.NODE_ENV === "development"
                    ? error.message
                    : undefined
        });
    }
};


// ============================================================
// EXPORT
// ============================================================

module.exports = {
    getStudentDashboard,
    getStudentProfile,
    updateStudentProfile
};

