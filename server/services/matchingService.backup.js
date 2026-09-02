const StudentProfile = require("../models/StudentProfile");
const Internship = require("../models/Internship");

// ============================================================
// SKILLBRIDGE INTERNSHIP MATCHING ENGINE
// ============================================================
//
// Purpose:
// 1. Read the student's real skills from MongoDB
// 2. Compare them with internship required skills
// 3. Support common skill aliases
// 4. Calculate a realistic match percentage
// 5. Identify matching, partial and missing skills
// 6. Rank recommended internships by match score
//
// ============================================================


// ============================================================
// NORMALIZE SKILL NAME
// ============================================================

const normalizeSkill = (skill = "") => {
    return String(skill)
        .trim()
        .toLowerCase()
        .replace(/\s+/g, " ")
        .replace(/[._-]/g, " ");
};


// ============================================================
// SKILL ALIASES
// ============================================================

const SKILL_ALIASES = {

    javascript: [
        "js",
        "javascript",
        "java script"
    ],

    react: [
        "react",
        "reactjs",
        "react js",
        "react.js"
    ],

    "node js": [
        "node",
        "nodejs",
        "node js",
        "node.js"
    ],

    express: [
        "express",
        "expressjs",
        "express js",
        "express.js"
    ],

    mongodb: [
        "mongo",
        "mongodb",
        "mongo db"
    ],

    git: [
        "git",
        "github"
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

    sql: [
        "sql",
        "mysql",
        "postgresql",
        "postgres"
    ],

    python: [
        "python"
    ],

    "data structures and algorithms": [
        "dsa",
        "data structures",
        "algorithms",
        "data structures and algorithms"
    ],

    "machine learning": [
        "ml",
        "machine learning"
    ],

    "deep learning": [
        "dl",
        "deep learning"
    ],

    tensorflow: [
        "tensorflow"
    ],

    docker: [
        "docker"
    ],

    aws: [
        "aws",
        "amazon web services"
    ],

    kubernetes: [
        "kubernetes",
        "k8s"
    ],

    "ci cd": [
        "ci cd",
        "ci/cd",
        "cicd",
        "continuous integration",
        "continuous deployment"
    ]
};


// ============================================================
// GET CANONICAL SKILL NAME
// ============================================================

const getCanonicalSkill = (skill) => {

    const normalized =
        normalizeSkill(skill);

    for (
        const [canonical, aliases]
        of Object.entries(SKILL_ALIASES)
    ) {

        if (
            aliases.includes(normalized) ||
            normalized === canonical
        ) {
            return canonical;
        }
    }

    return normalized;
};


// ============================================================
// EXTRACT REQUIRED SKILLS
// ============================================================

const extractRequiredSkills = (requiredSkills) => {

    // Internship object
    if (
        requiredSkills &&
        !Array.isArray(requiredSkills) &&
        Array.isArray(
            requiredSkills.requiredSkills
        )
    ) {
        return requiredSkills.requiredSkills;
    }

    // Direct array
    if (
        Array.isArray(requiredSkills)
    ) {
        return requiredSkills;
    }

    return [];
};


// ============================================================
// GET REQUIRED SKILL DETAILS
// ============================================================

const getRequiredSkillDetails = (
    requiredSkill
) => {

    if (
        typeof requiredSkill === "string"
    ) {

        return {

            name: requiredSkill,

            minimumScore: 0,

            requiredLevel: "BEGINNER"

        };
    }


    if (
        requiredSkill &&
        typeof requiredSkill === "object"
    ) {

        return {

            name:
                requiredSkill.name ||
                requiredSkill.skill ||
                "",

            minimumScore:
                Number(
                    requiredSkill.minimumScore || 0
                ),

            requiredLevel:
                requiredSkill.requiredLevel ||
                "BEGINNER"

        };
    }


    return {

        name: "",

        minimumScore: 0,

        requiredLevel: "BEGINNER"

    };
};


// ============================================================
// BUILD STUDENT SKILL MAP
// ============================================================

const createStudentSkillMap = (
    profile
) => {

    const skillMap = {};

    const studentSkills =
        Array.isArray(profile?.skills)
            ? profile.skills
            : [];


    studentSkills.forEach(
        (skill) => {

            if (
                !skill ||
                !skill.name
            ) {
                return;
            }


            const canonical =
                getCanonicalSkill(
                    skill.name
                );


            const score = Math.max(
                0,
                Math.min(
                    100,
                    Number(skill.score || 0)
                )
            );


            skillMap[canonical] = {

                name:
                    skill.name,

                score,

                level:
                    skill.level ||
                    "BEGINNER",

                category:
                    skill.category ||
                    "TECHNICAL"

            };

        }
    );


    return skillMap;
};


// ============================================================
// CALCULATE MATCH
// ============================================================

const calculateMatch = (
    profile,
    requiredSkills = []
) => {

    const studentSkillMap =
        createStudentSkillMap(
            profile
        );


    const matchingSkills = [];
    const partialSkills = [];
    const missingSkills = [];


    let totalScore = 0;

    let totalPossible = 0;


    // ========================================================
    // CHECK REQUIRED SKILLS
    // ========================================================

    requiredSkills.forEach(
        (requiredSkill) => {

            const details =
                getRequiredSkillDetails(
                    requiredSkill
                );


            if (!details.name) {
                return;
            }


            const canonicalRequired =
                getCanonicalSkill(
                    details.name
                );


            const studentSkill =
                studentSkillMap[
                    canonicalRequired
                ];


            const requiredScore =
                details.minimumScore > 0
                    ? details.minimumScore
                    : 100;


            totalPossible +=
                requiredScore;


            // ------------------------------------------------
            // SKILL NOT FOUND
            // ------------------------------------------------

            if (!studentSkill) {

                missingSkills.push(
                    details.name
                );

                return;
            }


            const studentScore =
                studentSkill.score;


            // ------------------------------------------------
            // SCORE CONTRIBUTION
            // ------------------------------------------------

            const contribution =
                Math.min(
                    studentScore,
                    requiredScore
                );


            totalScore +=
                contribution;


            // ------------------------------------------------
            // REQUIRED SCORE CHECK
            // ------------------------------------------------

            const minimumScore =
                details.minimumScore > 0
                    ? details.minimumScore
                    : 60;


            const scoreReady =
                studentScore >=
                minimumScore;


            // ------------------------------------------------
            // FULL MATCH
            // ------------------------------------------------

            if (scoreReady) {

                matchingSkills.push({

                    skill:
                        details.name,

                    studentScore,

                    minimumScore,

                    level:
                        studentSkill.level,

                    requiredLevel:
                        details.requiredLevel

                });

            }

            // ------------------------------------------------
            // PARTIAL MATCH
            // ------------------------------------------------

            else {

                partialSkills.push({

                    skill:
                        details.name,

                    studentScore,

                    requiredScore:
                        minimumScore,

                    requiredLevel:
                        details.requiredLevel,

                    gap:
                        Math.max(
                            minimumScore -
                            studentScore,
                            0
                        )

                });

            }

        }
    );


    // ========================================================
    // CALCULATE MATCH SCORE
    // ========================================================

    let matchScore = 0;


    if (
        totalPossible > 0
    ) {

        matchScore =
            Math.round(
                (
                    totalScore /
                    totalPossible
                ) * 100
            );

    }


    matchScore =
        Math.max(
            0,
            Math.min(
                100,
                matchScore
            )
        );


    // ========================================================
    // READINESS
    // ========================================================

    let readiness =
        "NOT_READY";


    if (
        matchScore >= 85
    ) {

        readiness =
            "EXCELLENT";

    } else if (
        matchScore >= 70
    ) {

        readiness =
            "HIGH";

    } else if (
        matchScore >= 50
    ) {

        readiness =
            "MEDIUM";

    } else if (
        matchScore >= 30
    ) {

        readiness =
            "LOW";
    }


    // ========================================================
    // RETURN RESULT
    // ========================================================

    return {

        matchScore,

        matchingSkills,

        missingSkills,

        partialSkills,

        readiness,

        totalRequiredSkills:
            requiredSkills.length,

        matchedSkillCount:
            matchingSkills.length,

        partialSkillCount:
            partialSkills.length,

        missingSkillCount:
            missingSkills.length

    };
};


// ============================================================
// CALCULATE INTERNSHIP MATCH
// ============================================================

const calculateInternshipMatch =
    async (
        studentId,
        internshipOrSkills = []
    ) => {

        try {

            // ------------------------------------------------
            // FIND STUDENT PROFILE
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
                        requiredSkills
                            .map(
                                (skill) => {

                                    const details =
                                        getRequiredSkillDetails(
                                            skill
                                        );

                                    return details.name;

                                }
                            )
                            .filter(Boolean),

                    partialSkills: [],

                    readiness:
                        "NOT_READY",

                    totalRequiredSkills:
                        requiredSkills.length,

                    matchedSkillCount: 0,

                    partialSkillCount: 0,

                    missingSkillCount:
                        requiredSkills.length

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
                "❌ Matching Engine Error:",
                error
            );

            throw error;
        }
    };


// ============================================================
// CALCULATE MATCH FROM PROFILE
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
    async (
        studentId
    ) => {

        // ----------------------------------------------------
        // GET OPEN INTERNSHIPS
        // ----------------------------------------------------

        const internships =
            await Internship
                .find({
                    status: "OPEN"
                })
                .populate(
                    "industry",
                    "name email"
                )
                .sort({
                    createdAt: -1
                });


        // ----------------------------------------------------
        // GET STUDENT PROFILE
        // ----------------------------------------------------

        const profile =
            await StudentProfile
                .findOne({
                    user: studentId
                })
                .lean();


        // ----------------------------------------------------
        // PROFILE NOT FOUND
        // ----------------------------------------------------

        if (!profile) {

            return [];

        }


        // ----------------------------------------------------
        // CALCULATE EVERY INTERNSHIP
        // ----------------------------------------------------

        const recommendations =
            internships.map(
                (internship) => {

                    const match =
                        calculateMatch(
                            profile,
                            internship.requiredSkills
                        );


                    return {

                        ...internship.toObject(),

                        matchScore:
                            match.matchScore,

                        matchingSkills:
                            match.matchingSkills,

                        missingSkills:
                            match.missingSkills,

                        partialSkills:
                            match.partialSkills,

                        readiness:
                            match.readiness,

                        totalRequiredSkills:
                            match.totalRequiredSkills,

                        matchedSkillCount:
                            match.matchedSkillCount,

                        partialSkillCount:
                            match.partialSkillCount,

                        missingSkillCount:
                            match.missingSkillCount

                    };

                }
            );


        // ----------------------------------------------------
        // SORT
        // ----------------------------------------------------

        recommendations.sort(
            (a, b) => {

                // Highest match first
                if (
                    b.matchScore !==
                    a.matchScore
                ) {

                    return (
                        b.matchScore -
                        a.matchScore
                    );

                }


                // If same score,
                // newest internship first

                return (
                    new Date(
                        b.createdAt
                    ) -
                    new Date(
                        a.createdAt
                    )
                );

            }
        );


        return recommendations;

    };


// ============================================================
// EXPORT
// ============================================================

module.exports = {

    calculateInternshipMatch,

    calculateMatchFromProfile,

    getRecommendedInternships

};