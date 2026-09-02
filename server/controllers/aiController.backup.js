
// ============================================================
// SKILLBRIDGE AI CONTROLLER
// ============================================================
//
// Features:
// 1. AI Career Chat
// 2. AI Skill Gap Analysis
// 3. Fetch logged-in student's StudentProfile from MongoDB
// 4. Gemini 429-safe fallback
// 5. Gemini network-error fallback
// 6. Rule-based Skill Gap Engine
//
// ============================================================

const { GoogleGenAI } = require("@google/genai");

const StudentProfile = require("../models/StudentProfile");

const {
    calculateSkillGap,
    generateSkillGapReport
} = require("../services/skillGapEngine");

// ============================================================
// GEMINI CONFIGURATION
// ============================================================

const ai = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY
});

const MODEL =
    process.env.GEMINI_MODEL || "gemini-3.6-flash";

// ============================================================
// SAFE HELPERS
// ============================================================

const clean = (value, fallback = "") => {
    if (value === undefined || value === null) {
        return fallback;
    }

    return String(value).trim();
};

const skillName = (skill) => {
    if (typeof skill === "string") {
        return skill.trim();
    }

    return clean(
        skill?.name ||
        skill?.skillName ||
        skill?.title,
        "Unknown Skill"
    );
};

const skillScore = (skill) => {
    if (typeof skill === "string") {
        return 0;
    }

    const score = Number(
        skill?.score ??
        skill?.percentage ??
        skill?.marks ??
        0
    );

    if (!Number.isFinite(score)) {
        return 0;
    }

    return Math.max(
        0,
        Math.min(100, score)
    );
};

const skillLevel = (skill) => {
    if (typeof skill === "string") {
        return "Not assessed";
    }

    return clean(
        skill?.level ||
        skill?.proficiency ||
        "Not assessed"
    );
};

// ============================================================
// GEMINI REQUEST
// ============================================================

const generateAIResponse = async (prompt) => {
    try {
        if (!process.env.GEMINI_API_KEY) {
            console.log(
                "⚠️ GEMINI_API_KEY missing. Using fallback."
            );

            return null;
        }

        const response =
            await ai.models.generateContent({
                model: MODEL,
                contents: prompt
            });

        return response?.text || null;

    } catch (error) {

        console.error(
            "❌ Gemini Error:",
            error?.message || error
        );

        const message =
            String(
                error?.message || ""
            ).toLowerCase();

        // ====================================================
        // GEMINI QUOTA / 429
        // ====================================================

        if (
            error?.status === 429 ||
            message.includes("429") ||
            message.includes("resource_exhausted") ||
            message.includes("quota")
        ) {
            console.log(
                "⚠️ Gemini quota exceeded. Using fallback."
            );

            return null;
        }

        // ====================================================
        // NETWORK ERROR
        // ====================================================

        if (
            message.includes("fetch failed") ||
            message.includes("connect timeout") ||
            message.includes("network") ||
            error?.code === "UND_ERR_CONNECT_TIMEOUT" ||
            error?.cause?.code ===
                "UND_ERR_CONNECT_TIMEOUT"
        ) {
            console.log(
                "⚠️ Gemini network unavailable. Using fallback."
            );

            return null;
        }

        // ====================================================
        // OTHER GEMINI ERROR
        // ====================================================

        console.log(
            "⚠️ Gemini unavailable. Using fallback."
        );

        return null;
    }
};

// ============================================================
// CAREER FALLBACK
// ============================================================

const createCareerFallback = ({
    context = {}
}) => {

    const careerGoal =
        clean(
            context.careerGoal,
            ""
        );

    const domains =
        Array.isArray(
            context.preferredDomains
        )
            ? context.preferredDomains
            : [];

    const skills =
        Array.isArray(context.skills)
            ? context.skills
            : [];

    const assessment =
        context.assessment || null;

    const role =
        careerGoal ||
        domains[0] ||
        "Software Development";

    const skillText =
        skills.length > 0
            ? skills
                .slice(0, 6)
                .map(
                    skill =>
                        `- ${skillName(skill)}: ${skillScore(skill)}%`
                )
                .join("\n")
            : "- No assessed skills yet.";

    const assessmentScore =
        assessment?.overallScore !== undefined
            ? assessment.overallScore
            : null;

    return `## Your AI Career Insight

### 🎯 Recommended Direction

Your current career direction is **${role}**.

Focus on developing job-relevant technical skills and demonstrating them through practical projects.

### 💪 Your Strengths

${skillText}

These are the skills currently available in your SkillBridge profile.

### 📚 Skills to Improve

- Programming fundamentals
- Data Structures and Algorithms
- Git and GitHub
- Role-specific technical skills
- Practical project development
- Interview preparation

### 🚀 Next 3 Steps

1. Complete the SkillBridge assessment to identify your strongest and weakest skills.

2. Choose one important skill for **${role}** and build a practical project around it.

3. Upload and document the project on GitHub and begin applying for relevant internships.

### 💼 Career Readiness

${
    assessmentScore !== null
        ? `Your latest assessment score is **${assessmentScore}%**.`
        : "Your current internship readiness cannot be accurately measured because your assessment is not completed yet."
}

Your readiness will improve most by strengthening weak skills, building practical projects and demonstrating your abilities through GitHub.`;
};

// ============================================================
// AI CAREER CHAT
// ============================================================

const requestAI = async (req, res) => {

    try {

        const {
            message,
            context = {}
        } = req.body;

        // ====================================================
        // VALIDATION
        // ====================================================

        if (
            !message ||
            typeof message !== "string" ||
            !message.trim()
        ) {
            return res.status(400).json({
                success: false,
                message: "Message is required."
            });
        }

        console.log(
            "🤖 AI Request:",
            message
        );

        console.log(
            "👤 Context:",
            context
        );

        // ====================================================
        // PROMPT
        // ====================================================

        const prompt = `

You are the SkillBridge Career Assistant.

Answer the student's question directly.

USER QUESTION:

${message}

STUDENT PROFILE:

Name:
${context.name || "Not provided"}

Location:
${context.location || "Not provided"}

Career Goal:
${context.careerGoal || "Not provided"}

Preferred Domains:
${
    Array.isArray(context.preferredDomains)
        ? context.preferredDomains.join(", ")
        : "Not provided"
}

CURRENT SKILLS:

${
    Array.isArray(context.skills) &&
    context.skills.length > 0
        ? context.skills
            .map(
                skill =>
                    `- ${skillName(skill)}: ${skillScore(skill)}%`
            )
            .join("\n")
        : "No assessed skills."
}

ASSESSMENT:

${
    context.assessment
        ? JSON.stringify(
            context.assessment
        )
        : "No assessment completed."
}

INSTRUCTIONS:

- Give practical career advice.
- Use the student's actual information.
- Focus on employability and internships.
- Focus on practical projects.
- Identify concrete skills to improve.
- Avoid generic motivational content.
- Keep the answer concise.
- Do not mention that you are an AI.

FORMAT:

## Your AI Career Insight

### 🎯 Recommended Direction

Explain the most suitable career direction.

### 💪 Your Strengths

Mention the strongest existing areas.

### 📚 Skills to Improve

Mention the most important skills to develop.

### 🚀 Next 3 Steps

1. First practical action.
2. Second practical action.
3. Third practical action.

### 💼 Career Readiness

Give a short assessment of internship/job readiness.

`;

        // ====================================================
        // GEMINI
        // ====================================================

        const reply =
            await generateAIResponse(
                prompt
            );

        // ====================================================
        // FALLBACK
        // ====================================================

        if (!reply) {

            return res.status(200).json({
                success: true,
                source: "fallback",
                reply:
                    createCareerFallback({
                        context
                    })
            });
        }

        // ====================================================
        // GEMINI SUCCESS
        // ====================================================

        return res.status(200).json({
            success: true,
            source: "gemini",
            reply
        });

    } catch (error) {

        console.error(
            "❌ AI Controller Error:",
            error
        );

        return res.status(200).json({
            success: true,
            source: "fallback",
            reply:
                createCareerFallback({
                    context:
                        req.body?.context || {}
                })
        });
    }
};

// ============================================================
// AI SKILL GAP ANALYSIS
// ============================================================

const analyzeSkillGap = async (req, res) => {

    try {

        const {
            targetRole,
            currentSkills
        } = req.body;

        // ====================================================
        // VALIDATE TARGET ROLE
        // ====================================================

        if (
            !targetRole ||
            typeof targetRole !== "string" ||
            !targetRole.trim()
        ) {

            return res.status(400).json({
                success: false,
                message:
                    "Target role is required."
            });
        }

        console.log(
            "🧠 Skill Gap Analysis:",
            targetRole
        );

        // ====================================================
        // GET LOGGED-IN USER
        // ====================================================

        if (!req.user || !req.user._id) {

            console.log(
                "❌ No authenticated user found."
            );

            return res.status(401).json({
                success: false,
                message:
                    "Authentication required."
            });
        }

        console.log(
            "👤 Logged-in User ID:",
            req.user._id
        );

        // ====================================================
        // FETCH STUDENT PROFILE FROM MONGODB
        // ====================================================

        const studentProfile =
            await StudentProfile.findOne({
                user: req.user._id
            }).lean();

        // ====================================================
        // HANDLE MISSING PROFILE
        // ====================================================

        if (!studentProfile) {

            console.log(
                "⚠️ No StudentProfile found for user:",
                req.user._id
            );

            return res.status(200).json({
                success: true,
                source: "skill-gap-engine",
                targetRole:
                    targetRole.trim(),
                matchScore: 0,
                readiness: {
                    score: 0,
                    label: "Profile Incomplete"
                },
                strengths: [],
                highPriority: [],
                mediumPriority: [],
                lowPriority: [],
                learningPath: [],
                skillAnalysis: [],
                reply:
                    `## Skill Gap Analysis

### 🎯 Target Career

**${targetRole.trim()}**

### ⚠️ Student Profile Not Found

Your account is authenticated, but no StudentProfile is linked to this account yet.

Please complete your student profile first.

Once your StudentProfile is created, SkillBridge will automatically use your saved skills for skill-gap analysis.`
            });
        }

        // ====================================================
        // GET SKILLS FROM MONGODB
        // ====================================================

        const mongoSkills =
            Array.isArray(
                studentProfile.skills
            )
                ? studentProfile.skills
                : [];

        // ====================================================
        // SKILL SOURCE PRIORITY
        // ====================================================
        //
        // 1. MongoDB StudentProfile.skills
        // 2. Frontend currentSkills
        // 3. Empty array
        //
        // MongoDB is preferred because it contains
        // the logged-in student's actual profile data.
        // ====================================================

        let skills = mongoSkills;

        if (
            skills.length === 0 &&
            Array.isArray(currentSkills) &&
            currentSkills.length > 0
        ) {
            skills = currentSkills;
        }

        console.log(
            "📚 Student Skills Used:",
            skills
        );

        console.log(
            "📊 Number of Skills:",
            skills.length
        );

        // ====================================================
        // PRINT EACH SKILL
        // ====================================================

        if (skills.length > 0) {

            skills.forEach(
                (skill, index) => {

                    console.log(
                        `   ${index + 1}. ${skillName(skill)} | Score: ${skillScore(skill)}% | Level: ${skillLevel(skill)}`
                    );

                }
            );

        } else {

            console.log(
                "⚠️ Student currently has no skills."
            );
        }

        // ====================================================
        // CALCULATE SKILL GAP
        // ====================================================

        const analysis =
            calculateSkillGap({

                targetRole:
                    targetRole.trim(),

                currentSkills:
                    skills

            });

        // ====================================================
        // INVALID ROLE
        // ====================================================

        if (!analysis.success) {

            return res.status(400).json({

                success: false,

                message:
                    analysis.message ||
                    "Unable to analyze this role.",

                availableRoles:
                    analysis.availableRoles ||
                    []

            });
        }

        // ====================================================
        // GENERATE REPORT
        // ====================================================

        const report =
            generateSkillGapReport(
                analysis
            );

        console.log(
            "✅ Skill Gap calculated:",
            analysis.matchScore + "%"
        );

        // ====================================================
        // RESPONSE
        // ====================================================

        return res.status(200).json({

            success: true,

            source:
                "skill-gap-engine",

            targetRole:
                analysis.targetRole,

            matchScore:
                analysis.matchScore,

            readiness:
                analysis.readiness,

            strengths:
                analysis.strengths,

            highPriority:
                analysis.highPriority,

            mediumPriority:
                analysis.mediumPriority,

            lowPriority:
                analysis.lowPriority,

            learningPath:
                analysis.learningPath,

            skillAnalysis:
                analysis.skillAnalysis,

            // Useful debugging information
            skillsUsed:
                skills.map(skill => ({
                    name:
                        skillName(skill),

                    score:
                        skillScore(skill),

                    level:
                        skillLevel(skill)
                })),

            reply:
                report
        });

    } catch (error) {

        console.error(
            "❌ Skill Gap Engine Error:",
            error
        );

        return res.status(500).json({

            success: false,

            message:
                "Unable to calculate skill gap.",

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

    requestAI,

    analyzeSkillGap

};

