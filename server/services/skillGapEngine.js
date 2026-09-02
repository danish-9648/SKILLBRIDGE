// ============================================================
// SKILLBRIDGE — SKILL GAP ENGINE
// ============================================================
// Compares student's skills with requirements for a target role.
// Works without Gemini/API.
// ============================================================

const ROLE_REQUIREMENTS = {
    "Software Developer": {
        skills: {
            JavaScript: 75,
            "Data Structures and Algorithms": 70,
            Git: 65,
            React: 60,
            "Node.js": 60,
            "REST API": 65,
            MongoDB: 55,
            Testing: 50,
            Deployment: 45
        }
    },

    "Full Stack Developer": {
        skills: {
            HTML: 70,
            CSS: 70,
            JavaScript: 80,
            React: 70,
            "Node.js": 70,
            Express: 65,
            MongoDB: 60,
            "REST API": 65,
            Git: 65,
            Deployment: 55
        }
    },

    "Frontend Developer": {
        skills: {
            HTML: 80,
            CSS: 80,
            JavaScript: 80,
            React: 75,
            Git: 60,
            "REST API": 45,
            Testing: 50,
            Accessibility: 45
        }
    },

    "Backend Developer": {
        skills: {
            JavaScript: 70,
            "Node.js": 75,
            Express: 70,
            "REST API": 75,
            MongoDB: 65,
            SQL: 60,
            Git: 65,
            Testing: 55,
            Deployment: 55
        }
    },

    "Data Analyst": {
        skills: {
            Python: 75,
            SQL: 75,
            Excel: 70,
            Statistics: 65,
            "Data Visualization": 65,
            Pandas: 60,
            PowerBI: 55
        }
    },

    "AI/ML Engineer": {
        skills: {
            Python: 80,
            Mathematics: 70,
            Statistics: 70,
            "Machine Learning": 75,
            "Data Structures and Algorithms": 65,
            Pandas: 65,
            NumPy: 65,
            TensorFlow: 55,
            "Deep Learning": 55
        }
    },

    "Cloud Engineer": {
        skills: {
            Linux: 65,
            Networking: 70,
            Git: 60,
            Docker: 65,
            AWS: 70,
            Kubernetes: 55,
            "CI/CD": 60,
            Security: 55
        }
    }
};


// ============================================================
// NORMALIZE SKILL NAME
// ============================================================

function normalizeSkillName(name = "") {
    return name
        .toLowerCase()
        .trim()
        .replace(/\s+/g, " ");
}


// ============================================================
// GET STUDENT SKILLS AS MAP
// ============================================================

function createStudentSkillMap(currentSkills = []) {

    const map = {};

    if (!Array.isArray(currentSkills)) {
        return map;
    }

    currentSkills.forEach((skill) => {

        if (typeof skill === "string") {

            map[normalizeSkillName(skill)] = 50;

            return;
        }

        if (skill && typeof skill === "object") {

            const name = skill.name;

            if (!name) {
                return;
            }

            const score = Number(skill.score);

            map[normalizeSkillName(name)] =
                Number.isFinite(score) ? score : 0;
        }
    });

    return map;
}


// ============================================================
// FIND STUDENT SKILL SCORE
// ============================================================

function getStudentScore(studentSkillMap, requiredSkill) {

    const normalizedRequired =
        normalizeSkillName(requiredSkill);

    // Exact match
    if (
        Object.prototype.hasOwnProperty.call(
            studentSkillMap,
            normalizedRequired
        )
    ) {
        return studentSkillMap[normalizedRequired];
    }

    // Common aliases
    const aliases = {
        "node.js": ["nodejs", "node"],
        nodejs: ["node.js", "node"],
        express: ["express.js"],
        "express.js": ["express"],
        javascript: ["js"],
        js: ["javascript"],
        mongodb: ["mongo", "mongo db"],
        git: ["github"],
        github: ["git"],
        "rest apis": ["rest api", "rest"],
        "data structures and algorithms": [
            "dsa",
            "data structures",
            "algorithms"
        ],
        react: ["react.js"],
        "react.js": ["react"]
    };

    const possibleNames =
        aliases[normalizedRequired] || [];

    for (const alias of possibleNames) {

        if (
            Object.prototype.hasOwnProperty.call(
                studentSkillMap,
                alias
            )
        ) {
            return studentSkillMap[alias];
        }
    }

    return 0;
}


// ============================================================
// CALCULATE SKILL GAP
// ============================================================

function calculateSkillGap({
    targetRole,
    currentSkills = []
}) {

    const role =
        ROLE_REQUIREMENTS[targetRole];

    if (!role) {

        return {
            success: false,
            message:
                `Unsupported target role: ${targetRole}`,
            availableRoles:
                Object.keys(ROLE_REQUIREMENTS)
        };
    }

    const studentSkillMap =
        createStudentSkillMap(currentSkills);

    const results = [];

    Object.entries(role.skills).forEach(
        ([skillName, requiredScore]) => {

            const currentScore =
                getStudentScore(
                    studentSkillMap,
                    skillName
                );

            const gap =
                Math.max(
                    requiredScore - currentScore,
                    0
                );

            let priority = "LOW";

            if (currentScore < requiredScore * 0.5) {
                priority = "HIGH";
            } else if (currentScore < requiredScore * 0.75) {
                priority = "MEDIUM";
            }

            if (gap === 0) {
                priority = "READY";
            }

            results.push({
                skill: skillName,
                currentScore,
                requiredScore,
                gap,
                priority
            });
        }
    );


    // ========================================================
    // SORT BY GAP
    // ========================================================

    results.sort((a, b) => {

        if (a.priority === "HIGH" &&
            b.priority !== "HIGH") {
            return -1;
        }

        if (b.priority === "HIGH" &&
            a.priority !== "HIGH") {
            return 1;
        }

        return b.gap - a.gap;
    });


    // ========================================================
    // CATEGORY ARRAYS
    // ========================================================

    const strengths =
        results.filter(
            item => item.priority === "READY"
        );

    const highPriority =
        results.filter(
            item => item.priority === "HIGH"
        );

    const mediumPriority =
        results.filter(
            item => item.priority === "MEDIUM"
        );

    const lowPriority =
        results.filter(
            item => item.priority === "LOW"
        );


    // ========================================================
    // OVERALL MATCH
    // ========================================================

    let totalCurrent = 0;
    let totalRequired = 0;

    results.forEach((item) => {

        totalCurrent +=
            Math.min(
                item.currentScore,
                item.requiredScore
            );

        totalRequired +=
            item.requiredScore;
    });

    const matchScore =
        totalRequired > 0
            ? Math.round(
                (totalCurrent / totalRequired) * 100
            )
            : 0;


    // ========================================================
    // READINESS
    // ========================================================

    let readiness = "BEGINNER";

    if (matchScore >= 80) {
        readiness = "JOB READY";
    } else if (matchScore >= 65) {
        readiness = "INTERNSHIP READY";
    } else if (matchScore >= 45) {
        readiness = "DEVELOPING";
    }


    // ========================================================
    // LEARNING PATH
    // ========================================================

    const learningPath =
        [
            ...highPriority,
            ...mediumPriority,
            ...lowPriority
        ]
            .slice(0, 8)
            .map(item => item.skill);


    return {

        success: true,

        targetRole,

        matchScore,

        readiness,

        totalSkills: results.length,

        strengths,

        highPriority,

        mediumPriority,

        lowPriority,

        learningPath,

        skillAnalysis: results
    };
}


// ============================================================
// GENERATE HUMAN-READABLE REPORT
// ============================================================

function generateSkillGapReport(data) {

    if (!data.success) {
        return data.message;
    }

    const formatSkills = (items) => {

        if (!items || items.length === 0) {
            return "- None";
        }

        return items
            .map(
                item =>
                    `- ${item.skill}: ${item.currentScore}% / ${item.requiredScore}%`
            )
            .join("\n");
    };


    const learningPath =
        data.learningPath.length > 0
            ? data.learningPath
                .map(
                    (skill, index) =>
                        `${index + 1}. ${skill}`
                )
                .join("\n")
            : "1. Complete your skill assessment.";


    return `## Skill Gap Analysis

### 🎯 Target Career

**${data.targetRole}**

Your current career match is **${data.matchScore}%**.

### ✅ Current Strengths

${formatSkills(data.strengths)}

### 🔴 High Priority

${formatSkills(data.highPriority)}

### 🟡 Medium Priority

${formatSkills(data.mediumPriority)}

### 🟢 Low Priority

${formatSkills(data.lowPriority)}

### 📚 Recommended Learning Path

${learningPath}

### 🛠️ Recommended Projects

1. Build a project using your highest-priority missing skill.
2. Build one complete role-specific application.
3. Deploy the project and document it on GitHub.

### 🚀 Next 3 Actions

1. Complete the SkillBridge assessment for the missing high-priority skills.
2. Start learning the first skill in your recommended learning path.
3. Build a practical project demonstrating that skill.

### 💼 Internship Readiness

**${data.readiness}**

Your current skill match is **${data.matchScore}%**.

Improve the high-priority skills first, then build practical projects that demonstrate those skills.
`;
}


// ============================================================
// EXPORT
// ============================================================

module.exports = {
    ROLE_REQUIREMENTS,
    calculateSkillGap,
    generateSkillGapReport
};