// ============================================================
// SKILLBRIDGE CAREER MATCHING ENGINE
// ============================================================
//
// Purpose:
// 1. Compare student skills with career requirements
// 2. Calculate career match percentage
// 3. Identify strengths
// 4. Identify skill gaps
// 5. Recommend the best career
// 6. Provide internship-ready information
//
// ============================================================


// ============================================================
// CAREER DATABASE
// ============================================================

const CAREERS = [
    {
        id: "software-developer",
        title: "Software Developer",

        skills: {
            JavaScript: 70,
            Python: 65,
            Java: 65,
            "Data Structures": 60,
            "Problem Solving": 65,
            Git: 55,
            "REST APIs": 60,
            Databases: 60
        }
    },

    {
        id: "full-stack-developer",
        title: "Full Stack Developer",

        skills: {
            HTML: 60,
            CSS: 60,
            JavaScript: 75,
            React: 70,
            "Node.js": 70,
            Express: 65,
            MongoDB: 65,
            "REST APIs": 65,
            Git: 55,
            Deployment: 45
        }
    },

    {
        id: "frontend-developer",
        title: "Frontend Developer",

        skills: {
            HTML: 70,
            CSS: 70,
            JavaScript: 75,
            React: 70,
            "UI/UX": 50,
            Git: 50,
            Responsive: 55
        }
    },

    {
        id: "backend-developer",
        title: "Backend Developer",

        skills: {
            JavaScript: 65,
            "Node.js": 70,
            Express: 70,
            "REST APIs": 75,
            MongoDB: 65,
            SQL: 55,
            Git: 55,
            Authentication: 60
        }
    },

    {
        id: "python-developer",
        title: "Python Developer",

        skills: {
            Python: 75,
            "Data Structures": 60,
            "Problem Solving": 65,
            Git: 50,
            SQL: 55,
            "REST APIs": 55
        }
    },

    {
        id: "data-analyst",
        title: "Data Analyst",

        skills: {
            Python: 65,
            SQL: 75,
            Excel: 65,
            Statistics: 70,
            "Data Visualization": 65,
            Pandas: 65,
            "Problem Solving": 60
        }
    },

    {
        id: "ai-ml-engineer",
        title: "AI/ML Engineer",

        skills: {
            Python: 80,
            Mathematics: 65,
            Statistics: 70,
            "Machine Learning": 75,
            "Data Structures": 55,
            Pandas: 60,
            NumPy: 60,
            "Deep Learning": 60
        }
    },

    {
        id: "cloud-devops-engineer",
        title: "Cloud/DevOps Engineer",

        skills: {
            Linux: 65,
            Git: 65,
            Docker: 70,
            AWS: 65,
            CICD: 65,
            Networking: 60,
            Kubernetes: 50,
            "Cloud Computing": 65
        }
    }
];


// ============================================================
// NORMALIZE SKILL NAME
// ============================================================

function normalizeSkillName(skill) {

    if (!skill) {
        return "";
    }

    return skill
        .toString()
        .trim()
        .toLowerCase()
        .replace(/\s+/g, " ");
}


// ============================================================
// GET STUDENT SKILL SCORE
// ============================================================

function getStudentSkillScore(
    currentSkills,
    requiredSkill
) {

    if (!Array.isArray(currentSkills)) {
        return 0;
    }

    const required = normalizeSkillName(
        requiredSkill
    );

    const skill = currentSkills.find((item) => {

        const name =
            typeof item === "string"
                ? item
                : item?.name;

        return (
            normalizeSkillName(name) === required
        );
    });

    if (!skill) {
        return 0;
    }

    if (typeof skill === "string") {
        return 50;
    }

    const score = Number(
        skill.score ??
        skill.percentage ??
        skill.levelScore ??
        0
    );

    return Math.max(
        0,
        Math.min(100, score)
    );
}


// ============================================================
// CALCULATE CAREER MATCH
// ============================================================

function calculateCareerMatch(
    career,
    currentSkills
) {

    const requiredSkills =
        Object.entries(career.skills);

    if (requiredSkills.length === 0) {
        return {
            score: 0,
            strengths: [],
            gaps: [],
            priorities: {
                high: [],
                medium: [],
                low: []
            }
        };
    }

    let totalScore = 0;

    const strengths = [];
    const gaps = [];

    const high = [];
    const medium = [];
    const low = [];

    requiredSkills.forEach(
        ([skillName, requiredScore]) => {

            const studentScore =
                getStudentSkillScore(
                    currentSkills,
                    skillName
                );

            // ------------------------------------------------
            // MATCH CONTRIBUTION
            // ------------------------------------------------

            const contribution =
                Math.min(
                    studentScore /
                    requiredScore,
                    1
                );

            totalScore += contribution;

            // ------------------------------------------------
            // STRONG SKILL
            // ------------------------------------------------

            if (
                studentScore >=
                requiredScore
            ) {

                strengths.push({
                    skill: skillName,
                    score: studentScore,
                    required: requiredScore
                });

                return;
            }

            // ------------------------------------------------
            // GAP
            // ------------------------------------------------

            const gap =
                Math.max(
                    requiredScore -
                    studentScore,
                    0
                );

            gaps.push({
                skill: skillName,
                currentScore: studentScore,
                requiredScore,
                gap
            });

            // ------------------------------------------------
            // PRIORITY
            // ------------------------------------------------

            if (
                studentScore <
                requiredScore * 0.5
            ) {

                high.push({
                    skill: skillName,
                    currentScore: studentScore,
                    requiredScore
                });

            } else if (
                studentScore <
                requiredScore * 0.75
            ) {

                medium.push({
                    skill: skillName,
                    currentScore: studentScore,
                    requiredScore
                });

            } else {

                low.push({
                    skill: skillName,
                    currentScore: studentScore,
                    requiredScore
                });
            }
        }
    );

    const score =
        Math.round(
            (totalScore /
                requiredSkills.length) *
                100
        );

    // Sort biggest gaps first

    gaps.sort(
        (a, b) =>
            b.gap - a.gap
    );

    high.sort(
        (a, b) =>
            b.requiredScore -
            a.currentScore -
            (a.requiredScore -
                b.currentScore)
    );

    medium.sort(
        (a, b) =>
            b.requiredScore -
            b.currentScore -
            (a.requiredScore -
                a.currentScore)
    );

    return {
        score,
        strengths,
        gaps,
        priorities: {
            high,
            medium,
            low
        }
    };
}


// ============================================================
// MATCH ALL CAREERS
// ============================================================

function matchCareers(
    currentSkills = []
) {

    const results =
        CAREERS.map((career) => {

            const match =
                calculateCareerMatch(
                    career,
                    currentSkills
                );

            return {
                id: career.id,
                title: career.title,

                matchScore:
                    match.score,

                strengths:
                    match.strengths,

                skillGaps:
                    match.gaps,

                priorities:
                    match.priorities
            };
        });

    // Highest match first

    results.sort(
        (a, b) =>
            b.matchScore -
            a.matchScore
    );

    return results;
}


// ============================================================
// GET BEST CAREER
// ============================================================

function getBestCareer(
    currentSkills = []
) {

    const careers =
        matchCareers(
            currentSkills
        );

    return (
        careers[0] || {
            id: null,
            title: "Career Not Determined",
            matchScore: 0,
            strengths: [],
            skillGaps: [],
            priorities: {
                high: [],
                medium: [],
                low: []
            }
        }
    );
}


// ============================================================
// GENERATE LEARNING PATH
// ============================================================

function generateLearningPath(
    career
) {

    const title =
        career?.title ||
        "your target career";

    const gaps =
        career?.skillGaps || [];

    const topGaps =
        gaps
            .slice(0, 6)
            .map(
                (item) =>
                    item.skill
            );

    return [
        "Strengthen programming fundamentals.",
        ...topGaps.map(
            (skill) =>
                `Learn and practice ${skill}.`
        ),
        "Build a practical project using the target technologies.",
        "Practice interview questions and problem solving.",
        "Publish your projects on GitHub.",
        `Prepare specifically for ${title} internships.`
    ];
}


// ============================================================
// CAREER READINESS
// ============================================================

function calculateCareerReadiness(
    currentSkills = [],
    career = null
) {

    if (!career) {
        return {
            score: 0,
            level: "NOT_READY",
            message:
                "Complete your skill assessment and choose a career target."
        };
    }

    const skillCount =
        Array.isArray(currentSkills)
            ? currentSkills.length
            : 0;

    const matchScore =
        career.matchScore || 0;

    let projectScore = 0;

    // We cannot know actual projects here,
    // so projects should later come from the portfolio.

    if (skillCount >= 5) {
        projectScore = 10;
    }

    const readiness =
        Math.min(
            Math.round(
                matchScore * 0.8 +
                projectScore
            ),
            100
        );

    let level =
        "BEGINNER";

    if (readiness >= 75) {
        level = "INTERNSHIP_READY";
    } else if (readiness >= 55) {
        level = "NEARLY_READY";
    } else if (readiness >= 30) {
        level = "DEVELOPING";
    }

    return {
        score: readiness,
        level,

        message:
            readiness >= 75
                ? "You are showing strong internship readiness. Focus on projects, GitHub and interview preparation."
                : readiness >= 55
                ? "You are approaching internship readiness. Strengthen your skill gaps and build practical projects."
                : "You are still developing your career foundation. Complete assessments, strengthen core skills and build projects."
    };
}


// ============================================================
// COMPLETE CAREER ANALYSIS
// ============================================================

function analyzeStudentCareer(
    currentSkills = []
) {

    const careers =
        matchCareers(
            currentSkills
        );

    const bestCareer =
        careers[0];

    const readiness =
        calculateCareerReadiness(
            currentSkills,
            bestCareer
        );

    const learningPath =
        generateLearningPath(
            bestCareer
        );

    return {

        recommendedCareer: {
            id: bestCareer.id,

            title:
                bestCareer.title,

            matchScore:
                bestCareer.matchScore
        },

        strengths:
            bestCareer.strengths,

        skillGaps:
            bestCareer.skillGaps,

        priorities:
            bestCareer.priorities,

        learningPath,

        careerReadiness:
            readiness,

        allCareerMatches:
            careers
    };
}


// ============================================================
// FIND CAREER BY NAME
// ============================================================

function findCareer(
    targetRole
) {

    if (!targetRole) {
        return null;
    }

    const search =
        normalizeSkillName(
            targetRole
        );

    return (
        CAREERS.find(
            (career) =>
                normalizeSkillName(
                    career.title
                ) === search
        ) || null
    );
}


// ============================================================
// ANALYZE SPECIFIC TARGET ROLE
// ============================================================

function analyzeTargetCareer(
    targetRole,
    currentSkills = []
) {

    const career =
        findCareer(
            targetRole
        );

    if (!career) {

        return {
            success: false,

            message:
                `Career "${targetRole}" is not available in the SkillBridge career database.`,

            availableCareers:
                CAREERS.map(
                    (item) =>
                        item.title
                )
        };
    }

    const match =
        calculateCareerMatch(
            career,
            currentSkills
        );

    const result = {

        success: true,

        targetCareer: {
            id: career.id,
            title: career.title
        },

        matchScore:
            match.score,

        strengths:
            match.strengths,

        skillGaps:
            match.gaps,

        priorities:
            match.priorities,

        learningPath:
            generateLearningPath({
                title: career.title,
                skillGaps: match.gaps
            }),

        internshipReadiness:
            calculateCareerReadiness(
                currentSkills,
                {
                    title: career.title,
                    matchScore: match.score,
                    skillGaps: match.gaps
                }
            )
    };

    return result;
}


// ============================================================
// EXPORT
// ============================================================

module.exports = {

    CAREERS,

    matchCareers,

    getBestCareer,

    analyzeStudentCareer,

    analyzeTargetCareer,

    calculateCareerMatch,

    calculateCareerReadiness,

    generateLearningPath,

    findCareer

};