
// ============================================================
// SKILLBRIDGE AI CONTROLLER
// ============================================================
//
// Features:
// 1. AI Career Chat
// 2. AI Skill Gap Analysis
// 3. Fetch logged-in student's StudentProfile
// 4. Gemini AI support
// 5. Gemini error/quota/network fallback
// 6. Rule-based Skill Gap Engine
//
// Routes:
// POST /api/ai/chat
// POST /api/ai/skill-gap
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

const GEMINI_API_KEY =
    process.env.GEMINI_API_KEY;

const MODEL =
    process.env.GEMINI_MODEL ||
    "gemini-3.6-flash";


// Create Gemini client only when API key exists
const ai = GEMINI_API_KEY
    ? new GoogleGenAI({
        apiKey: GEMINI_API_KEY
    })
    : null;


// ============================================================
// SAFE HELPERS
// ============================================================

const clean = (
    value,
    fallback = ""
) => {

    if (
        value === undefined ||
        value === null
    ) {
        return fallback;
    }

    return String(value).trim();
};


// ============================================================
// SKILL NAME
// ============================================================

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


// ============================================================
// SKILL SCORE
// ============================================================

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


// ============================================================
// SKILL LEVEL
// ============================================================

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
// GENERATE GEMINI RESPONSE
// ============================================================

const generateAIResponse = async (
    prompt
) => {

    try {

        // --------------------------------------------------------
        // Check API key
        // --------------------------------------------------------

        if (!GEMINI_API_KEY) {

            console.log(
                "⚠️ GEMINI_API_KEY missing. Using fallback."
            );

            return null;
        }


        // --------------------------------------------------------
        // Check Gemini client
        // --------------------------------------------------------

        if (!ai) {

            console.log(
                "⚠️ Gemini client unavailable. Using fallback."
            );

            return null;
        }


        // --------------------------------------------------------
        // Send request
        // --------------------------------------------------------

        console.log(
            "🤖 Sending request to Gemini:",
            MODEL
        );

        const response =
            await ai.models.generateContent({

                model: MODEL,

                contents: prompt

            });


        // --------------------------------------------------------
        // Extract response
        // --------------------------------------------------------

        const text =
            response?.text;

        if (
            !text ||
            !text.trim()
        ) {

            console.log(
                "⚠️ Gemini returned an empty response."
            );

            return null;
        }

        return text.trim();

    } catch (error) {

        console.error(
            "❌ Gemini Error:",
            error?.message ||
            error
        );


        const message =
            String(
                error?.message ||
                ""
            ).toLowerCase();


        // --------------------------------------------------------
        // RATE LIMIT / QUOTA
        // --------------------------------------------------------

        if (
            message.includes("429") ||
            message.includes("quota") ||
            message.includes("rate limit") ||
            message.includes("resource exhausted")
        ) {

            console.log(
                "⚠️ Gemini quota/rate limit reached. Using fallback."
            );

            return null;
        }


        // --------------------------------------------------------
        // NETWORK ERROR
        // --------------------------------------------------------

        if (
            message.includes("fetch failed") ||
            message.includes("network") ||
            message.includes("timeout") ||
            message.includes("connect") ||
            error?.code ===
                "UND_ERR_CONNECT_TIMEOUT" ||
            error?.cause?.code ===
                "UND_ERR_CONNECT_TIMEOUT"
        ) {

            console.log(
                "⚠️ Gemini network unavailable. Using fallback."
            );

            return null;
        }


        // --------------------------------------------------------
        // OTHER ERROR
        // --------------------------------------------------------

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
        Array.isArray(
            context.skills
        )
            ? context.skills
            : [];


    const assessment =
        context.assessment ||
        null;


    const role =
        careerGoal ||
        domains[0] ||
        "Software Development";


    // --------------------------------------------------------
    // Strengths
    // --------------------------------------------------------

    const sortedSkills =
        [...skills]
            .sort(
                (a, b) =>
                    skillScore(b) -
                    skillScore(a)
            );


    const strengthSkills =
        sortedSkills
            .filter(
                skill =>
                    skillScore(skill) >= 70
            )
            .slice(0, 5);


    const skillText =
        strengthSkills.length > 0

            ? strengthSkills
                .map(
                    skill =>
                        `- ${skillName(skill)}: ${skillScore(skill)}%`
                )
                .join("\n")

            : "- No strong assessed skills yet.";


    // --------------------------------------------------------
    // Weak skills
    // --------------------------------------------------------

    const weakSkills =
        sortedSkills
            .filter(
                skill =>
                    skillScore(skill) < 70
            )
            .sort(
                (a, b) =>
                    skillScore(a) -
                    skillScore(b)
            )
            .slice(0, 5);


    const improvementText =
        weakSkills.length > 0

            ? weakSkills
                .map(
                    skill =>
                        `- ${skillName(skill)}: ${skillScore(skill)}%`
                )
                .join("\n")

            : `- Continue strengthening skills required for ${role}.`;


    // --------------------------------------------------------
    // Assessment score
    // --------------------------------------------------------

    const assessmentScore =
        assessment?.overallScore !== undefined
            ? Number(
                assessment.overallScore
            )
            : null;


    // --------------------------------------------------------
    // Readiness
    // --------------------------------------------------------

    let readiness =
        "Developing";

    if (
        assessmentScore !== null
    ) {

        if (
            assessmentScore >= 80
        ) {
            readiness =
                "Strong internship/job readiness";

        } else if (
            assessmentScore >= 60
        ) {
            readiness =
                "Moderate internship readiness";

        } else {

            readiness =
                "Needs further skill development";
        }
    }


    return `## Your AI Career Insight

### 🎯 Recommended Direction

Your current career direction is **${role}**.

Based on your SkillBridge profile, focus on strengthening job-relevant technical skills and demonstrating them through practical projects.

### 💪 Your Strengths

${skillText}

### 📚 Skills to Improve

${improvementText}

### 🚀 Next 3 Steps

1. Strengthen your weakest job-relevant skill through structured practice.
2. Build a practical project related to **${role}**.
3. Deploy the project and document it on GitHub for your portfolio.

### 💼 Career Readiness

${assessmentScore !== null
        ? `Your latest assessment score is **${assessmentScore}%**. Your current readiness is **${readiness}**.`
        : "Complete the SkillBridge assessment to measure your current career readiness."
    }

Focus on closing your biggest skill gaps, building projects and gaining internship experience.
`;
};


// ============================================================
// AI CAREER CHAT
// POST /api/ai/chat
// ============================================================

const requestAI = async (
    req,
    res
) => {

    try {

        const {
            message,
            context = {}
        } = req.body;


        // --------------------------------------------------------
        // VALIDATION
        // --------------------------------------------------------

        if (
            !message ||
            typeof message !== "string" ||
            !message.trim()
        ) {

            return res.status(400).json({

                success: false,

                message:
                    "Message is required."
            });
        }


        console.log(
            "\n========================================"
        );

        console.log(
            "🤖 AI Career Chat"
        );

        console.log(
            "Question:",
            message
        );

        console.log(
            "========================================"
        );


        // --------------------------------------------------------
        // Build skill information
        // --------------------------------------------------------

        const skills =
            Array.isArray(
                context.skills
            )
                ? context.skills
                : [];


        const skillText =
            skills.length > 0

                ? skills
                    .map(
                        skill =>
                            `- ${skillName(skill)}: ${skillScore(skill)}% (${skillLevel(skill)})`
                    )
                    .join("\n")

                : "No assessed skills.";


        // --------------------------------------------------------
        // Build prompt
        // --------------------------------------------------------

        const prompt = `
You are the SkillBridge Career Assistant.

SkillBridge is an Academia-Industry Collaboration Portal created for SIH Problem Statement 26044.

Answer the student's question directly.

USER QUESTION:

${message}

STUDENT PROFILE:

Name:
${clean(context.name, "Not provided")}

Location:
${clean(context.location, "Not provided")}

Career Goal:
${clean(context.careerGoal, "Not provided")}

Preferred Domains:
${
    Array.isArray(
        context.preferredDomains
    )
        ? context.preferredDomains.join(", ")
        : "Not provided"
}

CURRENT SKILLS:

${skillText}

ASSESSMENT:

${
    context.assessment
        ? JSON.stringify(
            context.assessment,
            null,
            2
        )
        : "No assessment completed."
}

INSTRUCTIONS:

- Give practical career advice.
- Use the student's actual information.
- Focus on employability and internships.
- Identify concrete skills to improve.
- Recommend practical projects when useful.
- Avoid generic motivational content.
- Keep the answer concise but useful.
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


        // --------------------------------------------------------
        // Gemini
        // --------------------------------------------------------

        const reply =
            await generateAIResponse(
                prompt
            );


        // --------------------------------------------------------
        // Fallback
        // --------------------------------------------------------

        if (!reply) {

            console.log(
                "ℹ️ Returning career fallback."
            );

            return res.status(200).json({

                success: true,

                source:
                    "fallback",

                reply:
                    createCareerFallback({
                        context
                    })
            });
        }


        // --------------------------------------------------------
        // Gemini success
        // --------------------------------------------------------

        return res.status(200).json({

            success: true,

            source:
                "gemini",

            reply
        });

    } catch (error) {

        console.error(
            "AI Career Chat Error:",
            error
        );

        return res.status(500).json({

            success: false,

            message:
                "Server error while processing AI request."
        });
    }
};


// ============================================================
// AI SKILL GAP ANALYSIS
// POST /api/ai/skill-gap
// ============================================================

const analyzeSkillGap = async (
    req,
    res
) => {

    try {

        const {
            targetRole,
            currentSkills = []
        } = req.body;


        // --------------------------------------------------------
        // Validate target role
        // --------------------------------------------------------

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
            "\n========================================"
        );

        console.log(
            "🧠 Skill Gap Analysis:",
            targetRole
        );


        // --------------------------------------------------------
        // Logged-in user
        // --------------------------------------------------------

        if (
            !req.user ||
            !req.user._id
        ) {

            return res.status(401).json({

                success: false,

                message:
                    "Authentication required."
            });
        }


        const userId =
            req.user._id;


        console.log(
            "👤 Logged-in User ID:",
            userId
        );


        // --------------------------------------------------------
        // Find StudentProfile
        // --------------------------------------------------------

        const studentProfile =
            await StudentProfile.findOne({

                user:
                    userId

            }).lean();


        // --------------------------------------------------------
        // Profile not found
        // --------------------------------------------------------

        if (!studentProfile) {

            console.log(
                "⚠️ No StudentProfile found for user:",
                userId
            );


            return res.status(200).json({

                success: true,

                source:
                    "skill-gap-engine",

                targetRole:
                    targetRole.trim(),

                matchScore:
                    0,

                readiness: {
                    score: 0,
                    label:
                        "Profile Incomplete"
                },

                strengths: [],

                highPriority: [],

                mediumPriority: [],

                lowPriority: [],

                learningPath: [],

                skillAnalysis: [],

                skillsUsed: [],

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


        // --------------------------------------------------------
        // MongoDB skills
        // --------------------------------------------------------

        const mongoSkills =
            Array.isArray(
                studentProfile.skills
            )
                ? studentProfile.skills
                : [];


        // --------------------------------------------------------
        // Frontend skills fallback
        // --------------------------------------------------------

        let skills =
            mongoSkills;


        if (
            skills.length === 0 &&
            Array.isArray(currentSkills) &&
            currentSkills.length > 0
        ) {

            skills =
                currentSkills;

            console.log(
                "ℹ️ MongoDB profile has no skills. Using frontend skills."
            );
        }


        // --------------------------------------------------------
        // Print skills
        // --------------------------------------------------------

        console.log(
            "📚 Student Skills Used:",
            skills
        );

        console.log(
            "📊 Number of Skills:",
            skills.length
        );


        if (
            skills.length > 0
        ) {

            skills.forEach(
                (
                    skill,
                    index
                ) => {

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


        // --------------------------------------------------------
        // Calculate skill gap
        // --------------------------------------------------------

        const analysis =
            calculateSkillGap({

                targetRole:
                    targetRole.trim(),

                currentSkills:
                    skills

            });


        // --------------------------------------------------------
        // Invalid role
        // --------------------------------------------------------

        if (
            !analysis.success
        ) {

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


        // --------------------------------------------------------
        // Generate report
        // --------------------------------------------------------

        const report =
            generateSkillGapReport(
                analysis
            );


        console.log(
            "✅ Skill Gap calculated:",
            analysis.matchScore + "%"
        );


        console.log(
            "🎯 Readiness:",
            analysis.readiness
        );


        console.log(
            "========================================\n"
        );


        // --------------------------------------------------------
        // Final response
        // --------------------------------------------------------

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

            skillsUsed:
                skills.map(
                    skill => ({

                        name:
                            skillName(skill),

                        score:
                            skillScore(skill),

                        level:
                            skillLevel(skill)

                    })
                ),

            reply:
                report
        });

    } catch (error) {

        console.error(
            "Skill Gap Analysis Error:",
            error
        );


        return res.status(500).json({

            success: false,

            message:
                "Server error while calculating skill gap.",

            error:
                process.env.NODE_ENV ===
                "development"

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

