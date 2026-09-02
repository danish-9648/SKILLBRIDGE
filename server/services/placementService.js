// ============================================================
// SKILLBRIDGE - PLACEMENT READINESS SERVICE
// ============================================================

const StudentProfile = require("../models/StudentProfile");
const Assessment = require("../models/Assessment");
const Internship = require("../models/Internship");

// ============================================================
// HELPER: SAFE NUMBER
// ============================================================

const safeNumber = (value, fallback = 0) => {
    const number = Number(value);

    if (Number.isNaN(number)) {
        return fallback;
    }

    return number;
};

// ============================================================
// CALCULATE SKILL SCORE
// ============================================================

const calculateSkillScore = (skills = []) => {
    if (!Array.isArray(skills) || skills.length === 0) {
        return 0;
    }

    let total = 0;
    let count = 0;

    skills.forEach((skill) => {
        let score = 0;

        if (typeof skill === "number") {
            score = skill;
        } else if (typeof skill === "object") {
            score =
                skill.score ??
                skill.level ??
                skill.proficiency ??
                0;
        }

        score = safeNumber(score);

        // Keep score between 0 and 100
        score = Math.max(0, Math.min(100, score));

        total += score;
        count++;
    });

    if (count === 0) {
        return 0;
    }

    return Math.round(total / count);
};

// ============================================================
// CALCULATE ASSESSMENT SCORE
// ============================================================

const calculateAssessmentScore = (assessments = []) => {
    if (!Array.isArray(assessments) || assessments.length === 0) {
        return 0;
    }

    let total = 0;
    let count = 0;

    assessments.forEach((assessment) => {
        const score =
            assessment.overallScore ??
            assessment.score ??
            assessment.percentage ??
            0;

        total += Math.max(
            0,
            Math.min(100, safeNumber(score))
        );

        count++;
    });

    if (count === 0) {
        return 0;
    }

    return Math.round(total / count);
};

// ============================================================
// CALCULATE INTERNSHIP EXPERIENCE SCORE
// ============================================================

const calculateExperienceScore = (profile) => {
    if (!profile) {
        return 0;
    }

    const internships =
        profile.internships ||
        profile.internshipExperience ||
        [];

    if (Array.isArray(internships) && internships.length > 0) {
        return Math.min(100, internships.length * 25);
    }

    if (
        profile.hasInternship === true ||
        profile.internshipExperience === true
    ) {
        return 50;
    }

    return 0;
};

// ============================================================
// CALCULATE PROFILE SCORE
// ============================================================

const calculateProfileScore = (profile) => {
    if (!profile) {
        return 0;
    }

    return Math.max(
        0,
        Math.min(
            100,
            safeNumber(profile.profileCompletion)
        )
    );
};

// ============================================================
// GET SKILL NAME
// ============================================================

const getSkillName = (skill) => {
    if (typeof skill === "string") {
        return skill;
    }

    if (typeof skill === "object" && skill !== null) {
        return (
            skill.name ||
            skill.skillName ||
            skill.title ||
            "Unknown Skill"
        );
    }

    return "Unknown Skill";
};

// ============================================================
// FIND STRENGTHS
// ============================================================

const findStrengths = (skills = []) => {
    if (!Array.isArray(skills)) {
        return [];
    }

    return skills
        .filter((skill) => {
            const score =
                skill?.score ??
                skill?.level ??
                skill?.proficiency ??
                0;

            return safeNumber(score) >= 70;
        })
        .map(getSkillName)
        .filter(Boolean)
        .slice(0, 5);
};

// ============================================================
// FIND SKILL GAPS
// ============================================================

const findSkillGaps = (skills = []) => {
    if (!Array.isArray(skills)) {
        return [];
    }

    return skills
        .filter((skill) => {
            const score =
                skill?.score ??
                skill?.level ??
                skill?.proficiency ??
                0;

            return safeNumber(score) < 50;
        })
        .map(getSkillName)
        .filter(Boolean)
        .slice(0, 5);
};

// ============================================================
// CAREER RECOMMENDATION
// ============================================================

const getCareerRecommendation = (profile) => {
    if (!profile) {
        return "Software Development";
    }

    const preferredDomains =
        profile.preferredDomains ||
        profile.domains ||
        [];

    if (
        Array.isArray(preferredDomains) &&
        preferredDomains.length > 0
    ) {
        const domain = String(preferredDomains[0]);

        if (
            domain.toLowerCase().includes("artificial") ||
            domain.toLowerCase().includes("machine learning") ||
            domain.toLowerCase().includes("ai")
        ) {
            return "AI / Machine Learning";
        }

        if (
            domain.toLowerCase().includes("cloud")
        ) {
            return "Cloud Computing";
        }

        if (
            domain.toLowerCase().includes("data")
        ) {
            return "Data Science / Analytics";
        }

        if (
            domain.toLowerCase().includes("cyber")
        ) {
            return "Cybersecurity";
        }

        if (
            domain.toLowerCase().includes("web") ||
            domain.toLowerCase().includes("software")
        ) {
            return "Software Development";
        }

        return domain;
    }

    return "Software Development";
};

// ============================================================
// READINESS LEVEL
// ============================================================

const getReadinessLevel = (score) => {
    if (score >= 85) {
        return "EXCELLENT";
    }

    if (score >= 70) {
        return "JOB READY";
    }

    if (score >= 50) {
        return "DEVELOPING";
    }

    return "BEGINNER";
};

// ============================================================
// RECOMMENDATIONS
// ============================================================

const generateRecommendations = ({
    profileScore,
    skillScore,
    assessmentScore,
    experienceScore,
    skillGaps
}) => {
    const recommendations = [];

    if (profileScore < 80) {
        recommendations.push(
            "Complete your student profile."
        );
    }

    if (skillScore < 70) {
        recommendations.push(
            "Improve your core technical skills."
        );
    }

    if (assessmentScore < 70) {
        recommendations.push(
            "Complete skill assessments to validate your knowledge."
        );
    }

    if (experienceScore < 50) {
        recommendations.push(
            "Gain practical experience through internships or projects."
        );
    }

    if (skillGaps.length > 0) {
        recommendations.push(
            `Improve weak skills: ${skillGaps.join(", ")}.`
        );
    }

    if (recommendations.length === 0) {
        recommendations.push(
            "You are progressing well. Start applying for suitable opportunities."
        );
    }

    return recommendations;
};

// ============================================================
// MAIN FUNCTION
// ============================================================

const getPlacementReadiness = async (userId) => {
    if (!userId) {
        throw new Error("User ID is required.");
    }

    // --------------------------------------------------------
    // FIND STUDENT PROFILE
    // --------------------------------------------------------

    const profile = await StudentProfile.findOne({
        $or: [
            { user: userId },
            { student: userId }
        ]
    }).lean();

    // --------------------------------------------------------
    // FIND ASSESSMENTS
    // --------------------------------------------------------

    let assessments = [];

    try {
        assessments = await Assessment.find({
            user: userId
        }).lean();
    } catch (error) {
        console.log(
            "Assessment lookup skipped:",
            error.message
        );
    }

    // --------------------------------------------------------
    // CALCULATE COMPONENT SCORES
    // --------------------------------------------------------

    const skills = profile?.skills || [];

    const profileScore =
        calculateProfileScore(profile);

    const skillScore =
        calculateSkillScore(skills);

    const assessmentScore =
        calculateAssessmentScore(assessments);

    const experienceScore =
        calculateExperienceScore(profile);

    // --------------------------------------------------------
    // OVERALL SCORE
    // --------------------------------------------------------

    const overallScore = Math.round(
        profileScore * 0.20 +
        skillScore * 0.35 +
        assessmentScore * 0.30 +
        experienceScore * 0.15
    );

    // --------------------------------------------------------
    // STRENGTHS & GAPS
    // --------------------------------------------------------

    const strengths =
        findStrengths(skills);

    const skillGaps =
        findSkillGaps(skills);

    // --------------------------------------------------------
    // CAREER
    // --------------------------------------------------------

    const recommendedCareer =
        getCareerRecommendation(profile);

    // --------------------------------------------------------
    // READINESS
    // --------------------------------------------------------

    const readinessLevel =
        getReadinessLevel(overallScore);

    // --------------------------------------------------------
    // RECOMMENDATIONS
    // --------------------------------------------------------

    const recommendations =
        generateRecommendations({
            profileScore,
            skillScore,
            assessmentScore,
            experienceScore,
            skillGaps
        });

    // --------------------------------------------------------
    // RETURN RESULT
    // --------------------------------------------------------

    return {
        overallScore,

        readinessLevel,

        recommendedCareer,

        scores: {
            profile: profileScore,
            skills: skillScore,
            assessments: assessmentScore,
            experience: experienceScore
        },

        strengths,

        skillGaps,

        recommendations,

        completedAssessments:
            assessments.length,

        skillCount:
            skills.length
    };
};

// ============================================================
// RECOMMENDED INTERNSHIPS
// ============================================================

const getRecommendedInternships = async (userId) => {
    if (!userId) {
        throw new Error("User ID is required.");
    }

    const profile = await StudentProfile.findOne({
        $or: [
            { user: userId },
            { student: userId }
        ]
    }).lean();

    if (!profile) {
        return [];
    }

    const skills = (profile.skills || [])
        .map(getSkillName)
        .filter(Boolean);

    const preferredDomains =
        profile.preferredDomains || [];

    const query = {};

    const conditions = [];

    if (skills.length > 0) {
        conditions.push({
            skills: {
                $in: skills
            }
        });
    }

    if (
        Array.isArray(preferredDomains) &&
        preferredDomains.length > 0
    ) {
        conditions.push({
            domain: {
                $in: preferredDomains
            }
        });
    }

    if (conditions.length > 0) {
        query.$or = conditions;
    }

    try {
        return await Internship.find(query)
            .sort({
                createdAt: -1
            })
            .limit(10)
            .lean();
    } catch (error) {
        console.error(
            "Internship recommendation error:",
            error
        );

        return [];
    }
};

// ============================================================
// EXPORTS
// ============================================================

module.exports = {
    getPlacementReadiness,
    getRecommendedInternships,
    calculateSkillScore,
    calculateAssessmentScore,
    getReadinessLevel
};