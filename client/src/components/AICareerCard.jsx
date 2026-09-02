import { useState } from "react";

import {
    Bot,
    Sparkles,
    Target,
    TrendingUp,
    BookOpen,
    AlertCircle,
    X,
    CheckCircle2,
    ArrowRight,
    BriefcaseBusiness,
    Code2,
    Rocket,
    Award,
} from "lucide-react";

function AICareerCard({
    student = {},
    career = {},
    skills = [],
    assessment = null,
}) {
    const [loading, setLoading] = useState(false);
    const [skillGapLoading, setSkillGapLoading] = useState(false);

    const [aiInsight, setAiInsight] = useState("");
    const [skillGap, setSkillGap] = useState(null);

    const [error, setError] = useState("");

    // ============================================================
    // TOKEN
    // ============================================================

    const getToken = () => {
        return localStorage.getItem("token");
    };

    // ============================================================
    // CAREER GOAL
    // ============================================================

    const getTargetRole = () => {
        const careerGoal = career?.goal?.trim();

        const invalidGoals = [
            "",
            "Career Goal not set",
            "Not provided",
            "Not set",
        ];

        if (
            careerGoal &&
            !invalidGoals.includes(careerGoal)
        ) {
            return careerGoal;
        }

        return (
            assessment?.recommendedCareer ||
            "Full Stack Developer"
        );
    };

    // ============================================================
    // STUDENT CONTEXT
    // ============================================================

    const buildContext = () => {
        return {
            name:
                student?.name ||
                "Student",

            location:
                student?.location ||
                "Not provided",

            careerGoal:
                getTargetRole(),

            preferredDomains:
                student?.preferredDomains ||
                [],

            skills:
                skills || [],

            assessment:
                assessment || null,
        };
    };

    // ============================================================
    // AI CAREER INSIGHT
    // ============================================================

    const getAIInsight = async () => {
        try {
            setLoading(true);
            setError("");
            setAiInsight("");

            const token = getToken();

            if (!token) {
                setError(
                    "Your session has expired. Please log in again."
                );
                return;
            }

            const response = await fetch(
                "http://localhost:5000/api/ai/chat",
                {
                    method: "POST",

                    headers: {
                        "Content-Type":
                            "application/json",

                        Authorization:
                            `Bearer ${token}`,
                    },

                    body: JSON.stringify({
                        message:
                            "Analyze my current career direction, strengths, weaknesses and internship readiness. Give me practical next steps based on my actual SkillBridge profile.",

                        context:
                            buildContext(),
                    }),
                }
            );

            const data =
                await response.json();

            console.log(
                "🤖 AI Career Response:",
                data
            );

            if (response.status === 401) {
                localStorage.removeItem("token");
                localStorage.removeItem("user");

                window.location.href =
                    "/login";

                return;
            }

            if (
                !response.ok ||
                !data.success
            ) {
                throw new Error(
                    data.message ||
                    "Unable to generate AI career insight."
                );
            }

            setAiInsight(
                data.reply ||
                "No AI insight was returned."
            );

        } catch (error) {
            console.error(
                "AI Career Error:",
                error
            );

            setError(
                error.message ||
                "Unable to generate AI insight."
            );
        } finally {
            setLoading(false);
        }
    };

    // ============================================================
    // SKILL GAP ANALYSIS
    // ============================================================

    const analyzeSkillGap = async () => {
        try {
            setSkillGapLoading(true);
            setError("");
            setSkillGap(null);

            const token =
                getToken();

            if (!token) {
                setError(
                    "Your session has expired. Please log in again."
                );

                return;
            }

            const targetRole =
                getTargetRole();

            console.log(
                "🎯 Skill Gap Target Role:",
                targetRole
            );

            console.log(
                "📚 Skills Sent:",
                skills
            );

            const response =
                await fetch(
                    "http://localhost:5000/api/ai/skill-gap",
                    {
                        method: "POST",

                        headers: {
                            "Content-Type":
                                "application/json",

                            Authorization:
                                `Bearer ${token}`,
                        },

                        body:
                            JSON.stringify({
                                targetRole,
                                currentSkills:
                                    skills,
                            }),
                    }
                );

            const data =
                await response.json();

            console.log(
                "🧠 Skill Gap Response:",
                data
            );

            if (response.status === 401) {
                localStorage.removeItem("token");
                localStorage.removeItem("user");

                window.location.href =
                    "/login";

                return;
            }

            if (
                !response.ok ||
                !data.success
            ) {
                throw new Error(
                    data.message ||
                    "Unable to analyze skill gap."
                );
            }

            setSkillGap(data);

        } catch (error) {
            console.error(
                "Skill Gap Error:",
                error
            );

            setError(
                error.message ||
                "Unable to analyze skill gap."
            );
        } finally {
            setSkillGapLoading(false);
        }
    };

    // ============================================================
    // CLOSE INSIGHT
    // ============================================================

    const closeInsight = () => {
        setAiInsight("");
    };

    // ============================================================
    // PRIORITY STYLE
    // ============================================================

    const getPriorityClass = (
        priority
    ) => {
        switch (priority) {
            case "HIGH":
                return "skill-gap-high";

            case "MEDIUM":
                return "skill-gap-medium";

            case "LOW":
                return "skill-gap-low";

            case "READY":
                return "skill-gap-ready";

            default:
                return "";
        }
    };

    // ============================================================
    // RENDER
    // ============================================================

    return (
        <div className="ai-career-wrapper">

            {/* ==================================================
                HEADER
            ================================================== */}

            <div className="ai-career-header">

                <div className="ai-career-title">

                    <div className="ai-icon">
                        <Bot size={25} />
                    </div>

                    <div>

                        <span className="panel-label">
                            AI CAREER COMPANION
                        </span>

                        <h2>
                            Personalized Career Intelligence
                        </h2>

                    </div>

                </div>

                <Sparkles
                    size={22}
                    className="ai-sparkle"
                />

            </div>


            {/* ==================================================
                DESCRIPTION
            ================================================== */}

            <p className="ai-career-description">

                Get personalized career guidance based on
                your skills, assessment results and career
                interests.

            </p>


            {/* ==================================================
                QUICK AI FEATURES
            ================================================== */}

            <div className="ai-feature-grid">

                <div className="ai-feature">

                    <TrendingUp size={19} />

                    <div>
                        <strong>
                            Skill recommendations
                        </strong>

                        <span>
                            Discover what to improve
                        </span>
                    </div>

                </div>


                <div className="ai-feature">

                    <Target size={19} />

                    <div>
                        <strong>
                            Career direction
                        </strong>

                        <span>
                            Find your strongest career path
                        </span>
                    </div>

                </div>


                <div className="ai-feature">

                    <Award size={19} />

                    <div>
                        <strong>
                            Career readiness
                        </strong>

                        <span>
                            Understand your job readiness
                        </span>
                    </div>

                </div>

            </div>


            {/* ==================================================
                ACTIONS
            ================================================== */}

            <div className="ai-actions">

                <button
                    className="primary-button"
                    onClick={getAIInsight}
                    disabled={loading}
                >

                    <Sparkles size={17} />

                    {loading
                        ? "Analyzing Profile..."
                        : "Get AI Career Insights"}

                </button>


                <button
                    className="secondary-button"
                    onClick={analyzeSkillGap}
                    disabled={skillGapLoading}
                >

                    <Target size={17} />

                    {skillGapLoading
                        ? "Analyzing Skills..."
                        : "Analyze My Skill Gaps"}

                </button>

            </div>


            {/* ==================================================
                ERROR
            ================================================== */}

            {error && (

                <div className="ai-error">

                    <AlertCircle size={18} />

                    <span>
                        {error}
                    </span>

                    <button
                        onClick={() =>
                            setError("")
                        }
                    >
                        <X size={17} />
                    </button>

                </div>

            )}


            {/* ==================================================
                AI INSIGHT
            ================================================== */}

            {aiInsight && (

                <div className="ai-result-card">

                    <div className="ai-result-header">

                        <div>

                            <span className="panel-label">
                                AI ANALYSIS
                            </span>

                            <h3>
                                Your AI Career Insight
                            </h3>

                        </div>

                        <button
                            className="icon-button"
                            onClick={closeInsight}
                        >
                            <X size={18} />
                        </button>

                    </div>


                    <div className="ai-result-content">

                        {aiInsight
                            .split("\n")
                            .map(
                                (line, index) => {

                                    if (
                                        !line.trim()
                                    ) {
                                        return (
                                            <br
                                                key={index}
                                            />
                                        );
                                    }

                                    if (
                                        line.startsWith(
                                            "## "
                                        )
                                    ) {
                                        return (
                                            <h3
                                                key={index}
                                            >
                                                {
                                                    line.replace(
                                                        "## ",
                                                        ""
                                                    )
                                                }
                                            </h3>
                                        );
                                    }

                                    if (
                                        line.startsWith(
                                            "### "
                                        )
                                    ) {
                                        return (
                                            <h4
                                                key={index}
                                            >
                                                {
                                                    line.replace(
                                                        "### ",
                                                        ""
                                                    )
                                                }
                                            </h4>
                                        );
                                    }

                                    return (
                                        <p
                                            key={index}
                                        >
                                            {line}
                                        </p>
                                    );
                                }
                            )}

                    </div>

                </div>

            )}


            {/* ==================================================
                SKILL GAP RESULT
            ================================================== */}

            {skillGap && (

                <div className="skill-gap-result">

                    {/* ==========================================
                        RESULT HEADER
                    ========================================== */}

                    <div className="skill-gap-result-header">

                        <div>

                            <span className="panel-label">
                                AI SKILL GAP ANALYSIS
                            </span>

                            <h3>
                                {skillGap.targetRole}
                            </h3>

                            <p>
                                Compare your current
                                capabilities with the skills
                                required for this career.
                            </p>

                        </div>

                        <div className="skill-match-circle">

                            <strong>
                                {skillGap.matchScore}%
                            </strong>

                            <span>
                                Match
                            </span>

                        </div>

                    </div>


                    {/* ==========================================
                        READINESS
                    ========================================== */}

                    <div className="readiness-banner">

                        <div className="readiness-icon">
                            <Rocket size={22} />
                        </div>

                        <div>

                            <span>
                                CAREER READINESS
                            </span>

                            <strong>
                                {skillGap.readiness}
                            </strong>

                        </div>

                    </div>


                    {/* ==========================================
                        SKILL SUMMARY
                    ========================================== */}

                    <div className="skill-gap-summary">

                        <div className="gap-summary-card">

                            <CheckCircle2
                                size={20}
                            />

                            <div>

                                <span>
                                    Strengths
                                </span>

                                <strong>
                                    {
                                        skillGap
                                            .strengths
                                            ?.length ||
                                        0
                                    }
                                </strong>

                            </div>

                        </div>


                        <div className="gap-summary-card">

                            <AlertCircle
                                size={20}
                            />

                            <div>

                                <span>
                                    High Priority
                                </span>

                                <strong>
                                    {
                                        skillGap
                                            .highPriority
                                            ?.length ||
                                        0
                                    }
                                </strong>

                            </div>

                        </div>


                        <div className="gap-summary-card">

                            <BookOpen
                                size={20}
                            />

                            <div>

                                <span>
                                    Learning Areas
                                </span>

                                <strong>
                                    {
                                        skillGap
                                            .learningPath
                                            ?.length ||
                                        0
                                    }
                                </strong>

                            </div>

                        </div>

                    </div>


                    {/* ==========================================
                        SKILL ANALYSIS
                    ========================================== */}

                    <div className="skill-analysis-section">

                        <div className="section-title">

                            <Code2 size={19} />

                            <h4>
                                Skill-by-Skill Analysis
                            </h4>

                        </div>


                        <div className="skill-analysis-list">

                            {(
                                skillGap
                                    .skillAnalysis ||
                                []
                            ).map(
                                (
                                    item,
                                    index
                                ) => (

                                    <div
                                        className="skill-analysis-item"
                                        key={`${item.skill}-${index}`}
                                    >

                                        <div className="skill-analysis-top">

                                            <strong>
                                                {
                                                    item.skill
                                                }
                                            </strong>

                                            <span
                                                className={getPriorityClass(
                                                    item.priority
                                                )}
                                            >
                                                {
                                                    item.priority
                                                }
                                            </span>

                                        </div>


                                        <div className="skill-analysis-bar">

                                            <div
                                                className="skill-current-fill"
                                                style={{
                                                    width:
                                                        `${Math.min(
                                                            item.currentScore,
                                                            100
                                                        )}%`,
                                                }}
                                            />

                                            <div
                                                className="skill-required-marker"
                                                style={{
                                                    left:
                                                        `${Math.min(
                                                            item.requiredScore,
                                                            100
                                                        )}%`,
                                                }}
                                            />

                                        </div>


                                        <div className="skill-analysis-meta">

                                            <span>
                                                Current:{" "}
                                                <strong>
                                                    {
                                                        item.currentScore
                                                    }%
                                                </strong>
                                            </span>

                                            <span>
                                                Required:{" "}
                                                <strong>
                                                    {
                                                        item.requiredScore
                                                    }%
                                                </strong>
                                            </span>

                                            <span>
                                                Gap:{" "}
                                                <strong>
                                                    {
                                                        item.gap
                                                    }%
                                                </strong>
                                            </span>

                                        </div>

                                    </div>

                                )
                            )}

                        </div>

                    </div>


                    {/* ==========================================
                        LEARNING PATH
                    ========================================== */}

                    <div className="learning-path-section">

                        <div className="section-title">

                            <BookOpen size={19} />

                            <h4>
                                Recommended Learning Path
                            </h4>

                        </div>


                        <div className="learning-path-list">

                            {(
                                skillGap
                                    .learningPath ||
                                []
                            ).map(
                                (
                                    skill,
                                    index
                                ) => (

                                    <div
                                        className="learning-path-item"
                                        key={`${skill}-${index}`}
                                    >

                                        <div className="learning-number">
                                            {index + 1}
                                        </div>

                                        <div>

                                            <strong>
                                                {skill}
                                            </strong>

                                            <span>
                                                Focus on
                                                practical
                                                projects,
                                                exercises and
                                                interview
                                                preparation.
                                            </span>

                                        </div>

                                        <ArrowRight
                                            size={17}
                                        />

                                    </div>

                                )
                            )}

                        </div>

                    </div>


                    {/* ==========================================
                        RECOMMENDED PROJECTS
                    ========================================== */}

                    <div className="project-recommendation">

                        <div className="section-title">

                            <BriefcaseBusiness
                                size={19}
                            />

                            <h4>
                                Recommended Projects
                            </h4>

                        </div>

                        <div className="project-grid">

                            <div className="project-card">

                                <span>
                                    PROJECT 01
                                </span>

                                <strong>
                                    Full Stack Job Portal
                                </strong>

                                <p>
                                    Build a complete MERN
                                    application with
                                    authentication,
                                    search, applications
                                    and dashboards.
                                </p>

                            </div>


                            <div className="project-card">

                                <span>
                                    PROJECT 02
                                </span>

                                <strong>
                                    Production REST API
                                </strong>

                                <p>
                                    Create a secure Express
                                    API with JWT
                                    authentication,
                                    validation and
                                    deployment.
                                </p>

                            </div>


                            <div className="project-card">

                                <span>
                                    PROJECT 03
                                </span>

                                <strong>
                                    Collaborative Workspace
                                </strong>

                                <p>
                                    Build a team-based
                                    application demonstrating
                                    React, Node.js,
                                    MongoDB and Git.
                                </p>

                            </div>

                        </div>

                    </div>


                    {/* ==========================================
                        NEXT ACTIONS
                    ========================================== */}

                    <div className="next-actions">

                        <div className="section-title">

                            <Rocket size={19} />

                            <h4>
                                Your Next 3 Actions
                            </h4>

                        </div>

                        <ol>

                            <li>
                                Strengthen your highest
                                priority skill gaps.
                            </li>

                            <li>
                                Build one production-level
                                Full Stack project.
                            </li>

                            <li>
                                Deploy it and add the
                                project to your portfolio
                                and GitHub.
                            </li>

                        </ol>

                    </div>

                </div>

            )}

        </div>
    );
}

export default AICareerCard;