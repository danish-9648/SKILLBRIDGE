// ============================================================
// SkillBridge AI SERVICE
// Google Gemini AI
// ============================================================

const dotenv = require("dotenv");

dotenv.config();

// ============================================================
// CONFIGURATION
// ============================================================

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

const GEMINI_MODEL =
    process.env.GEMINI_MODEL || "gemini-3.6-flash";

// ============================================================
// ASK AI
// ============================================================

const askAI = async (message, context = {}) => {

    try {

        // --------------------------------------------------------
        // Validate message
        // --------------------------------------------------------

        if (!message || !message.trim()) {
            throw new Error("AI message is required");
        }

        // --------------------------------------------------------
        // Validate API key
        // --------------------------------------------------------

        if (!GEMINI_API_KEY) {
            throw new Error(
                "GEMINI_API_KEY is missing from server/.env"
            );
        }

        // --------------------------------------------------------
        // SkillBridge AI instructions
        // --------------------------------------------------------

        const systemInstruction = `
You are SkillBridge AI Career Assistant.

SkillBridge is an Academia-Industry Collaboration Portal
created for SIH Problem Statement 26044.

You help:

1. Students
2. Industry users
3. Academicians

For students, help with:

- Career selection
- Skill recommendations
- Skill-gap analysis
- Learning roadmaps
- Internship preparation
- Resume improvement
- Portfolio development
- Interview preparation
- Project ideas
- Technical skills
- Soft skills

For industry users, help with:

- Candidate evaluation
- Candidate skill matching
- Internship requirements
- Internship descriptions
- Candidate selection criteria
- Skill requirements

For academicians, help with:

- Industry-relevant skills
- Curriculum improvement
- Technology trends
- Industry collaboration
- Student employability

Always give:

- Clear answers
- Practical recommendations
- Step-by-step guidance when useful
- Beginner-friendly explanations
- Concise but useful responses

Avoid unnecessary jargon.
`;

        // --------------------------------------------------------
        // User prompt
        // --------------------------------------------------------

        const userPrompt = `
USER CONTEXT:

${JSON.stringify(context, null, 2)}

USER QUESTION:

${message}
`;

        // --------------------------------------------------------
        // Gemini API URL
        // --------------------------------------------------------

        const url =
            `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent`;

        console.log(
            "🤖 Sending request to Gemini:",
            GEMINI_MODEL
        );

        // --------------------------------------------------------
        // API request
        // --------------------------------------------------------

        const response = await fetch(
            url,
            {
                method: "POST",

                headers: {
                    "Content-Type": "application/json",
                    "x-goog-api-key": GEMINI_API_KEY
                },

                body: JSON.stringify({

                    system_instruction: {
                        parts: [
                            {
                                text: systemInstruction
                            }
                        ]
                    },

                    contents: [
                        {
                            role: "user",

                            parts: [
                                {
                                    text: userPrompt
                                }
                            ]
                        }
                    ]

                })
            }
        );

        // --------------------------------------------------------
        // Read response
        // --------------------------------------------------------

        const data = await response.json();

        // --------------------------------------------------------
        // API error
        // --------------------------------------------------------

        if (!response.ok) {

            console.error(
                "❌ Gemini API Error:",
                JSON.stringify(data, null, 2)
            );

            throw new Error(
                data?.error?.message ||
                `Gemini API request failed with status ${response.status}`
            );
        }

        // --------------------------------------------------------
        // Extract response
        // --------------------------------------------------------

        const reply =
            data?.candidates?.[0]
                ?.content
                ?.parts
                ?.map(part => part.text || "")
                .join("")
                .trim();

        // --------------------------------------------------------
        // Empty response
        // --------------------------------------------------------

        if (!reply) {

            console.error(
                "❌ Empty Gemini response:",
                JSON.stringify(data, null, 2)
            );

            throw new Error(
                "AI returned an empty response"
            );
        }

        // --------------------------------------------------------
        // Success
        // --------------------------------------------------------

        console.log("✅ Gemini response received");

        return {
            success: true,
            reply
        };

    } catch (error) {

        console.error(
            "❌ AI Service Error:",
            error.message
        );

        throw error;
    }
};


// ============================================================
// EXPORT
// ============================================================

module.exports = {
    askAI
};