import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import {
    Target,
    TrendingUp,
    CheckCircle2,
    AlertCircle,
    BriefcaseBusiness,
    UserRound,
    RefreshCw
} from "lucide-react";

import {
    getPlacementReadiness
} from "../services/api";


function PlacementReadiness() {

    const navigate = useNavigate();

    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");


    // ============================================================
    // LOAD PLACEMENT READINESS
    // ============================================================

    const loadReadiness = async () => {

        try {

            setLoading(true);
            setError("");

            const response =
                await getPlacementReadiness();

            console.log(
                "Placement Readiness Response:",
                response
            );

            setData(
                response?.data ||
                response
            );

        } catch (err) {

            console.error(
                "Placement readiness error:",
                err
            );

            setError(
                err?.message ||
                "Unable to load placement readiness."
            );

        } finally {

            setLoading(false);

        }

    };


    // ============================================================
    // INITIAL LOAD
    // ============================================================

    useEffect(() => {
        loadReadiness();
    }, []);


    // ============================================================
    // LOADING
    // ============================================================

    if (loading) {

        return (

            <div className="page-container">

                <div className="loading-state">

                    <RefreshCw
                        size={24}
                        className="spin"
                    />

                    <h2>
                        Analyzing your placement readiness...
                    </h2>

                    <p>
                        We're reviewing your skills,
                        profile and placement preparation.
                    </p>

                </div>

            </div>

        );

    }


    // ============================================================
    // ERROR
    // ============================================================

    if (error) {

        return (

            <div className="page-container">

                <div className="error-state">

                    <AlertCircle size={30} />

                    <h2>
                        Unable to load readiness
                    </h2>

                    <p>
                        {error}
                    </p>

                    <button
                        type="button"
                        onClick={loadReadiness}
                    >

                        <RefreshCw size={17} />

                        Try Again

                    </button>

                </div>

            </div>

        );

    }


    // ============================================================
    // BACKEND DATA
    // ============================================================

    const readinessScore =
        Number(data?.readinessScore || 0);

    const readinessLevel =
        data?.readinessLevel ||
        "NOT_READY";

    const averageSkillScore =
        Number(data?.averageSkillScore || 0);

    const profileCompletion =
        Number(data?.profileCompletion || 0);

    const totalSkills =
        Number(data?.totalSkills || 0);

    const totalProjects =
        Number(data?.totalProjects || 0);

    const totalCertifications =
        Number(data?.totalCertifications || 0);

    const skillGaps =
        Array.isArray(data?.skillGaps)
            ? data.skillGaps
            : [];

    const strongSkills =
        Array.isArray(data?.strongSkills)
            ? data.strongSkills
            : [];

    const recommendations =
        Array.isArray(data?.recommendations)
            ? data.recommendations
            : [];


    // ============================================================
    // READINESS LABEL
    // ============================================================

    const levelLabel = {

        PLACEMENT_READY:
            "Placement Ready",

        ALMOST_READY:
            "Almost Ready",

        NEEDS_IMPROVEMENT:
            "Needs Improvement",

        NOT_READY:
            "Not Ready"

    }[readinessLevel] || "Not Ready";


    // ============================================================
    // SCORE MESSAGE
    // ============================================================

    let scoreMessage =
        "Keep building your skills and placement profile.";

    if (readinessScore >= 80) {

        scoreMessage =
            "You're looking strong for placement opportunities.";

    } else if (readinessScore >= 60) {

        scoreMessage =
            "You're close. Strengthen your remaining gaps.";

    } else if (readinessScore >= 40) {

        scoreMessage =
            "You're making progress. Keep improving your profile.";

    }


    // ============================================================
    // RENDER
    // ============================================================

    return (

        <div className="page-container">


            {/* ==================================================
                HEADER
            ================================================== */}

            <div className="page-header">

                <div>

                    <div className="eyebrow">
                        CAREER READINESS
                    </div>

                    <h1>
                        Placement Readiness
                    </h1>

                    <p>
                        Understand how prepared you are
                        for internships and placement opportunities.
                    </p>

                </div>


                <button
                    type="button"
                    className="secondary-button"
                    onClick={loadReadiness}
                >

                    <RefreshCw size={17} />

                    Refresh Analysis

                </button>

            </div>


            {/* ==================================================
                HERO SCORE
            ================================================== */}

            <section className="readiness-hero">

                <div className="score-circle">

                    <Target size={28} />

                    <strong>
                        {readinessScore}%
                    </strong>

                    <span>
                        Readiness
                    </span>

                </div>


                <div className="readiness-summary">

                    <span className="status-badge">

                        <CheckCircle2 size={16} />

                        {levelLabel}

                    </span>


                    <h2>
                        Placement Preparation
                    </h2>


                    <p>
                        {scoreMessage}
                    </p>

                </div>

            </section>


            {/* ==================================================
                METRICS
            ================================================== */}

            <section className="readiness-grid">


                {/* SKILLS */}

                <div className="readiness-card">

                    <div className="card-icon">

                        <TrendingUp size={21} />

                    </div>

                    <span>
                        Average Skill Score
                    </span>

                    <strong>
                        {averageSkillScore}%
                    </strong>

                    <div className="progress">

                        <div
                            style={{
                                width:
                                    `${Math.min(
                                        averageSkillScore,
                                        100
                                    )}%`
                            }}
                        />

                    </div>

                </div>


                {/* PROFILE */}

                <div className="readiness-card">

                    <div className="card-icon">

                        <UserRound size={21} />

                    </div>

                    <span>
                        Profile Completion
                    </span>

                    <strong>
                        {profileCompletion}%
                    </strong>

                    <div className="progress">

                        <div
                            style={{
                                width:
                                    `${Math.min(
                                        profileCompletion,
                                        100
                                    )}%`
                            }}
                        />

                    </div>

                </div>


                {/* PROJECTS */}

                <div className="readiness-card">

                    <div className="card-icon">

                        <BriefcaseBusiness size={21} />

                    </div>

                    <span>
                        Projects
                    </span>

                    <strong>
                        {totalProjects}
                    </strong>

                    <p>
                        Recommended: 2+
                    </p>

                </div>


                {/* CERTIFICATIONS */}

                <div className="readiness-card">

                    <div className="card-icon">

                        <CheckCircle2 size={21} />

                    </div>

                    <span>
                        Certifications
                    </span>

                    <strong>
                        {totalCertifications}
                    </strong>

                    <p>
                        Industry certifications
                    </p>

                </div>

            </section>


            {/* ==================================================
                STRENGTHS + SKILL GAPS
            ================================================== */}

            <section className="analysis-grid">


                {/* STRENGTHS */}

                <div className="analysis-card">

                    <div className="analysis-header">

                        <div>

                            <h2>
                                Your Strengths
                            </h2>

                            <p>
                                Skills where you are performing strongly.
                            </p>

                        </div>

                        <CheckCircle2 size={22} />

                    </div>


                    {strongSkills.length > 0 ? (

                        <div className="skill-tags">

                            {strongSkills.map(
                                (skill, index) => (

                                    <span
                                        key={
                                            `${skill.name}-${index}`
                                        }
                                        className="strength-tag"
                                    >

                                        {skill.name}

                                        {typeof skill.score === "number"
                                            ? ` (${skill.score}%)`
                                            : ""
                                        }

                                    </span>

                                )
                            )}

                        </div>

                    ) : (

                        <div className="empty-analysis">

                            <p>
                                Complete more assessments
                                to identify your strongest skills.
                            </p>

                        </div>

                    )}

                </div>


                {/* SKILL GAPS */}

                <div className="analysis-card">

                    <div className="analysis-header">

                        <div>

                            <h2>
                                Skill Gaps
                            </h2>

                            <p>
                                Skills that need improvement.
                            </p>

                        </div>

                        <AlertCircle size={22} />

                    </div>


                    {skillGaps.length > 0 ? (

                        <div className="skill-tags">

                            {skillGaps.map(
                                (skill, index) => (

                                    <span
                                        key={
                                            `${skill.name}-${index}`
                                        }
                                        className="gap-tag"
                                    >

                                        {skill.name}

                                        {" - "}

                                        {skill.score}%

                                    </span>

                                )
                            )}

                        </div>

                    ) : (

                        <div className="empty-analysis">

                            <p>
                                No major skill gaps detected.
                            </p>

                        </div>

                    )}

                </div>

            </section>


            {/* ==================================================
                RECOMMENDATIONS
            ================================================== */}

            <section className="recommendations-section">

                <div className="section-heading">

                    <div>

                        <h2>
                            Recommended Actions
                        </h2>

                        <p>
                            Based on your current placement readiness.
                        </p>

                    </div>


                    {/* STEP 4 BUTTON */}

                    <button
                        type="button"
                        className="secondary-button"
                        onClick={() =>
                            navigate(
                                "/placement-recommendations"
                            )
                        }
                    >

                        <BriefcaseBusiness size={17} />

                        View Opportunities

                    </button>

                </div>


                {recommendations.length === 0 ? (

                    <div className="empty-analysis">

                        <CheckCircle2 size={28} />

                        <p>
                            Your profile is progressing well.
                        </p>

                    </div>

                ) : (

                    <div className="recommendation-list">

                        {recommendations.map(
                            (
                                recommendation,
                                index
                            ) => (

                                <div
                                    className="recommendation-card"
                                    key={index}
                                >

                                    <div>

                                        <div className="card-icon">

                                            <Target
                                                size={20}
                                            />

                                        </div>

                                        <h3>
                                            Recommendation {index + 1}
                                        </h3>

                                        <p>
                                            {recommendation}
                                        </p>

                                    </div>

                                </div>

                            )
                        )}

                    </div>

                )}

            </section>


            {/* ==================================================
                PROFILE SUMMARY
            ================================================== */}

            <section className="analysis-card">

                <div className="analysis-header">

                    <div>

                        <h2>
                            Profile Summary
                        </h2>

                        <p>
                            Your current placement preparation data.
                        </p>

                    </div>

                    <Target size={22} />

                </div>


                <div className="skill-tags">

                    <span className="strength-tag">

                        {totalSkills} Skills

                    </span>


                    <span className="strength-tag">

                        {totalProjects} Projects

                    </span>


                    <span className="strength-tag">

                        {totalCertifications} Certifications

                    </span>


                    <span className="strength-tag">

                        {profileCompletion}% Profile

                    </span>

                </div>

            </section>

        </div>

    );

}


export default PlacementReadiness;