const StudentProfile = require("../models/StudentProfile");
const Internship = require("../models/Internship");

// ============================================================
// NORMALIZE SKILL NAME
// ============================================================

const normalizeSkill = (skill = "") => {
    return String(skill)
        .toLowerCase()
        .trim()
        .replace(/\s+/g, " ");
};


// ============================================================
// SKILL ALIASES
// ============================================================

const SKILL_ALIASES = {
    javascript: [
        "js",
        "javascript"
    ],

    react: [
        "react.js",
        "reactjs",
        "react"
    ],

    "node.js": [
        "node",
        "nodejs",
        "node.js"
    ],

    express: [
        "express.js",
        "expressjs",
        "express"
    ],

    mongodb: [
        "mongo",
        "mongo db",
        "mongodb"
    ],

    git: [
        "github",
        "git"
    ],

    "rest api": [
        "rest",
        "rest api",
        "rest apis",
        "restful api",
        "restful apis"
    ],

    html: [
        "html",
        "html5"
    ],

    css: [
        "css",
        "css3"
    ],

    "data structures and algorithms": [
        "dsa",
        "data structures",
        "algorithms",
        "data structures and algorithms"
    ]
};


// ============================================================
// GET CANONICAL SKILL NAME
// ============================================================

const getCanonicalSkill = (skill) => {

    const normalized =
        normalizeSkill(skill);

    for (const [canonical, aliases]
        of Object.entries(SKILL_ALIASES)) {

        if (aliases.includes(normalized)) {
            return canonical;
        }
    }

    return normalized;
};


// ============================================================
// BUILD STUDENT SKILL MAP
// ============================================================

const buildStudentSkillMap = (profile) => {

    const skillMap = {};

    const studentSkills =
        profile?.skills || [];

    studentSkills.forEach((skill) => {

        if (!skill || !skill.name) {
            return;
        }

        const canonicalName =
            getCanonicalSkill(skill.name);

        const score =
            Math.max(
                0,
                Math.min(
                    100,
                    Number(skill.score || 0)
                )
            );

        skillMap[canonicalName] = {
            name: skill.name,
            score,
            level:
                skill.level ||
                "BEGINNER",
            category:
                skill.category ||
                "TECHNICAL"
        };
    });

    return skillMap;
};


// ============================================================
// EXTRACT REQUIRED SKILLS
// ============================================================

const extractRequiredSkills = (
    internshipOrSkills
) => {

    if (
        internshipOrSkills &&
        !Array.isArray(internshipOrSkills) &&
        Array.isArray(
            internshipOrSkills.requiredSkills
        )
    ) {
        return internshipOrSkills.requiredSkills;
    }

    if (Array.isArray(internshipOrSkills)) {
        return internshipOrSkills;
    }

    return [];
};


// ============================================================
// CALCULATE MATCH
// ============================================================

const calculateMatch = (
    profile,
    requiredSkills = []
) => {

    const skillMap =
        buildStudentSkillMap(profile);

    const matchingSkills = [];
    const partialSkills = [];
    const missingSkills = [];

    let totalScore = 0;
    let totalRequired = 0;


    // ========================================================
    // CHECK EVERY REQUIRED SKILL
    // ========================================================

    requiredSkills.forEach(
        (requiredSkill) => {

            let requiredSkillName;

            let minimumScore = 60;

            let requiredLevel =
                "BEGINNER";


            // ------------------------------------------------
            // STRING FORMAT
            // ------------------------------------------------

            if (
                typeof requiredSkill ===
                "string"
            ) {

                requiredSkillName =
                    requiredSkill;
            }


            // ------------------------------------------------
            // OBJECT FORMAT
            // ------------------------------------------------

            else if (
                requiredSkill &&
                typeof requiredSkill ===
                "object"
            ) {

                requiredSkillName =
                    requiredSkill.name;

                minimumScore =
                    Number(
                        requiredSkill.minimumScore ||
                        60
                    );

                requiredLevel =
                    requiredSkill.requiredLevel ||
                    "BEGINNER";
            }


            if (!requiredSkillName) {
                return;
            }


            const canonicalRequiredSkill =
                getCanonicalSkill(
                    requiredSkillName
                );


            const studentSkill =
                skillMap[
                    canonicalRequiredSkill
                ];


            // =================================================
            // SKILL NOT FOUND
            // =================================================

            if (!studentSkill) {

                missingSkills.push(
                    requiredSkillName
                );

                totalRequired += 100;

                return;
            }


            // =================================================
            // SKILL FOUND
            // =================================================

            const studentScore =
                studentSkill.score;


            totalScore +=
                studentScore;

            totalRequired +=
                100;


            matchingSkills.push({

                skill:
                    requiredSkillName,

                studentSkill:
                    studentSkill.name,

                studentScore,

                minimumScore,

                level:
                    studentSkill.level,

                requiredLevel
            });


            // =================================================
            // PARTIAL SKILL
            // =================================================

            if (
                studentScore <
                minimumScore
            ) {

                partialSkills.push({

                    skill:
                        requiredSkillName,

                    studentScore,

                    requiredScore:
                        minimumScore,

                    recommendedLevel:
                        requiredLevel
                });
            }
        }
    );


    // ========================================================
    // MATCH SCORE
    // ========================================================

    const matchScore =
        totalRequired === 0
            ? 0
            : Math.round(
                (
                    totalScore /
                    totalRequired
                ) * 100
            );


    // ========================================================
    // READINESS
    // ========================================================

    let readiness =
        "NOT_READY";

    if (matchScore >= 80) {

        readiness =
            "HIGH";

    } else if (matchScore >= 60) {

        readiness =
            "MEDIUM";

    } else if (matchScore >= 40) {

        readiness =
            "LOW";
    }


    // ========================================================
    // SKILL GAP
    // ========================================================

    const skillGaps =
        requiredSkills
            .map((requiredSkill) => {

                const name =
                    typeof requiredSkill ===
                    "string"
                        ? requiredSkill
                        : requiredSkill?.name;

                if (!name) {
                    return null;
                }

                const canonical =
                    getCanonicalSkill(name);

                const studentSkill =
                    skillMap[canonical];

                if (!studentSkill) {

                    return {
                        skill: name,
                        currentScore: 0,
                        requiredScore: 60,
                        gap: 60
                    };
                }

                const requiredScore =
                    typeof requiredSkill ===
                    "object"
                        ? Number(
                            requiredSkill.minimumScore ||
                            60
                        )
                        : 60;

                return {

                    skill: name,

                    currentScore:
                        studentSkill.score,

                    requiredScore,

                    gap:
                        Math.max(
                            requiredScore -
                            studentSkill.score,
                            0
                        )
                };
            })
            .filter(Boolean);


    return {

        matchScore,

        matchingSkills,

        missingSkills,

        partialSkills,

        skillGaps,

        readiness
    };
};


// ============================================================
// CALCULATE INTERNSHIP MATCH
// ============================================================

const calculateInternshipMatch =
    async (
        studentId,
        internshipOrSkills
    ) => {

        try {

            // ------------------------------------------------
            // GET STUDENT PROFILE
            // ------------------------------------------------

            const profile =
                await StudentProfile
                    .findOne({
                        user: studentId
                    })
                    .lean();


            // ------------------------------------------------
            // REQUIRED SKILLS
            // ------------------------------------------------

            const requiredSkills =
                extractRequiredSkills(
                    internshipOrSkills
                );


            // ------------------------------------------------
            // PROFILE NOT FOUND
            // ------------------------------------------------

            if (!profile) {

                return {

                    matchScore: 0,

                    matchingSkills: [],

                    missingSkills:
                        requiredSkills.map(
                            (skill) =>
                                typeof skill ===
                                "string"
                                    ? skill
                                    : skill?.name
                        ),

                    partialSkills: [],

                    skillGaps: [],

                    readiness:
                        "NOT_READY"
                };
            }


            // ------------------------------------------------
            // CALCULATE
            // ------------------------------------------------

            return calculateMatch(
                profile,
                requiredSkills
            );

        } catch (error) {

            console.error(
                "Matching Engine Error:",
                error
            );

            throw error;
        }
    };


// ============================================================
// CALCULATE FROM PROFILE
// ============================================================

const calculateMatchFromProfile =
    (
        profile,
        requiredSkills = []
    ) => {

        const skills =
            extractRequiredSkills(
                requiredSkills
            );

        return calculateMatch(
            profile,
            skills
        );
    };


// ============================================================
// GET RECOMMENDED INTERNSHIPS
// ============================================================

const getRecommendedInternships =
    async (studentId) => {

        try {

            // ------------------------------------------------
            // GET OPEN INTERNSHIPS
            // ------------------------------------------------

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


            // ------------------------------------------------
            // GET STUDENT PROFILE
            // ------------------------------------------------

            const profile =
                await StudentProfile
                    .findOne({
                        user: studentId
                    })
                    .lean();


            if (!profile) {
                return [];
            }


            const recommendations = [];


            // ------------------------------------------------
            // CALCULATE EVERY INTERNSHIP
            // ------------------------------------------------

            for (
                const internship
                of internships
            ) {

                const match =
                    calculateMatch(
                        profile,
                        internship.requiredSkills
                    );


                recommendations.push({

                    ...internship.toObject(),

                    matchScore:
                        match.matchScore,

                    matchingSkills:
                        match.matchingSkills,

                    missingSkills:
                        match.missingSkills,

                    partialSkills:
                        match.partialSkills,

                    skillGaps:
                        match.skillGaps,

                    readiness:
                        match.readiness
                });
            }


            // ------------------------------------------------
            // SORT BEST MATCH FIRST
            // ------------------------------------------------

            recommendations.sort(
                (a, b) =>
                    b.matchScore -
                    a.matchScore
            );


            return recommendations;

        } catch (error) {

            console.error(
                "Get Recommended Internships Error:",
                error
            );

            throw error;
        }
    };


// ============================================================
// EXPORT
// ============================================================

module.exports = {

    calculateInternshipMatch,

    calculateMatchFromProfile,

    getRecommendedInternships
};