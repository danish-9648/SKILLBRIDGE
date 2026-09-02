
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
    Target,
    BriefcaseBusiness,
    TrendingUp,
    UserRound,
    CheckCircle2,
    ArrowRight,
    RefreshCw,
    Sparkles,
    Brain,
    Award,
    FileText,
    ChevronRight,
} from "lucide-react";

import {
    getStudentDashboard,
    getPlacementReadiness,
    getPlacementRecommendations,
} from "../services/api";

function StudentDashboard() {
    const navigate = useNavigate();

    const [dashboard, setDashboard] = useState(null);
    const [readiness, setReadiness] = useState(null);
    const [recommendations, setRecommendations] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const loadDashboard = async () => {
        try {
            setLoading(true);
            setError("");

            const [
                dashboardResponse,
                readinessResponse,
                recommendationsResponse,
            ] = await Promise.all([
                getStudentDashboard(),
                getPlacementReadiness(),
                getPlacementRecommendations(),
            ]);

            setDashboard(
                dashboardResponse?.data ||
                dashboardResponse ||
                {}
            );

            setReadiness(
                readinessResponse?.data ||
                readinessResponse ||
                {}
            );

            const recommendationData =
                recommendationsResponse?.data ||
                recommendationsResponse ||
                {};

            setRecommendations(
                Array.isArray(recommendationData?.internships)
                    ? recommendationData.internships
                    : []
            );

        } catch (err) {
            console.error(
                "Dashboard loading error:",
                err
            );

            setError(
                err?.message ||
                "Unable to load dashboard."
            );
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadDashboard();
    }, []);

    if (loading) {
        return (
            <div className="page-container">
                <div className="dashboard-loading">
                    <RefreshCw
                        size={30}
                        className="spin"
                    />

                    <h2>
                        Preparing your SkillBridge dashboard...
                    </h2>

                    <p>
                        Analyzing your skills, profile
                        and career opportunities.
                    </p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="page-container">
                <div className="dashboard-error">
                    <AlertIcon />

                    <h2>
                        Unable to load dashboard
                    </h2>

                    <p>{error}</p>

                    <button
                        className="primary-button"
                        onClick={loadDashboard}
                    >
                        <RefreshCw size={17} />
                        Try Again
                    </button>
                </div>
            </div>
        );
    }

    const student =
        dashboard?.student ||
        dashboard?.user ||
        dashboard?.profile ||
        dashboard ||
        {};

    const readinessScore = Number(
        readiness?.readinessScore ||
        readiness?.placementReadiness ||
        0
    );

    const averageSkillScore = Number(
        readiness?.averageSkillScore || 0
    );

    const profileCompletion = Number(
        readiness?.profileCompletion ||
        student?.profileCompletion ||
        0
    );

    const totalSkills = Number(
        readiness?.totalSkills ||
        student?.skills?.length ||
        0
    );

    const totalProjects = Number(
        readiness?.totalProjects ||
        student?.projects?.length ||
        0
    );

    const totalCertifications = Number(
        readiness?.totalCertifications ||
        student?.certifications?.length ||
        0
    );

    const firstName =
        student?.name?.split(" ")[0] ||
        student?.firstName ||
        "Student";

    const readinessLevel =
        readiness?.readinessLevel ||
        "NOT_READY";

    const levelLabel = {
        PLACEMENT_READY: "Placement Ready",
        ALMOST_READY: "Almost Ready",
        NEEDS_IMPROVEMENT: "Needs Improvement",
        NOT_READY: "Not Ready",
    }[readinessLevel] || "Not Ready";

    const getReadinessMessage = () => {
        if (readinessScore >= 80) {
            return "Excellent! You are looking strong for placement opportunities.";
        }

        if (readinessScore >= 60) {
            return "You're close. Strengthen your remaining skill gaps.";
        }

        if (readinessScore >= 40) {
            return "You're making progress. Keep improving your profile.";
        }

        return "Build your skills and complete your profile to improve your readiness.";
    };

    return (
        <div className="page-container">

            {/* HERO */}

            <section className="dashboard-hero">

                <div className="hero-content">

                    <div className="hero-eyebrow">
                        <Sparkles size={15} />
                        SKILLBRIDGE CAREER HUB
                    </div>

                    <h1>
                        Welcome back,{" "}
                        <span>{firstName}</span> 👋
                    </h1>

                    <p>
                        Your personalized career command
                        center. Track your skills, improve
                        your placement readiness and discover
                        opportunities matched to you.
                    </p>

                    <div className="hero-actions">

                        <button
                            className="hero-primary"
                            onClick={() =>
                                navigate("/assessment")
                            }
                        >
                            <Brain size={18} />
                            Take Assessment
                            <ArrowRight size={17} />
                        </button>

                        <button
                            className="hero-secondary"
                            onClick={() =>
                                navigate(
                                    "/ai-assistant"
                                )
                            }
                        >
                            <Sparkles size={18} />
                            Ask AI Career Assistant
                        </button>

                    </div>

                </div>

                {/* READINESS CIRCLE */}

                <div className="hero-readiness">

                    <div className="readiness-ring">

                        <div className="readiness-ring-inner">

                            <Target size={25} />

                            <strong>
                                {readinessScore}%
                            </strong>

                            <span>
                                Readiness
                            </span>

                        </div>

                    </div>

                    <div className="readiness-status">
                        <CheckCircle2 size={16} />
                        {levelLabel}
                    </div>

                </div>

            </section>


            {/* QUICK STATS */}

            <section className="dashboard-stat-grid">

                <DashboardStat
                    icon={<TrendingUp />}
                    title="Average Skill Score"
                    value={`${averageSkillScore}%`}
                    progress={averageSkillScore}
                />

                <DashboardStat
                    icon={<UserRound />}
                    title="Profile Completion"
                    value={`${profileCompletion}%`}
                    progress={profileCompletion}
                />

                <DashboardStat
                    icon={<BriefcaseBusiness />}
                    title="Projects"
                    value={totalProjects}
                    subtitle="Build 2+ strong projects"
                />

                <DashboardStat
                    icon={<Award />}
                    title="Certifications"
                    value={totalCertifications}
                    subtitle="Industry credentials"
                />

            </section>


            {/* MAIN GRID */}

            <section className="dashboard-main-grid">

                {/* PLACEMENT READINESS */}

                <div className="dashboard-card readiness-card-large">

                    <div className="dashboard-card-header">

                        <div className="dashboard-card-icon purple">
                            <Target size={22} />
                        </div>

                        <div>
                            <h2>
                                Placement Readiness
                            </h2>

                            <p>
                                Your current preparation
                                for internships and placements.
                            </p>
                        </div>

                    </div>

                    <div className="readiness-score-row">

                        <div>
                            <span className="small-label">
                                Overall Score
                            </span>

                            <strong className="large-score">
                                {readinessScore}%
                            </strong>

                            <span className="readiness-message">
                                {getReadinessMessage()}
                            </span>
                        </div>

                        <div className="mini-progress">

                            <div
                                style={{
                                    width: `${Math.min(
                                        readinessScore,
                                        100
                                    )}%`,
                                }}
                            />

                        </div>

                    </div>

                    <button
                        className="card-action-button"
                        onClick={() =>
                            navigate(
                                "/placement-readiness"
                            )
                        }
                    >
                        View Full Analysis
                        <ArrowRight size={17} />
                    </button>

                </div>


                {/* AI CAREER ASSISTANT */}

                <div className="dashboard-card ai-card">

                    <div className="ai-glow" />

                    <div className="dashboard-card-header">

                        <div className="dashboard-card-icon ai">
                            <Sparkles size={22} />
                        </div>

                        <div>
                            <h2>
                                AI Career Assistant
                            </h2>

                            <p>
                                Get personalized career
                                guidance powered by AI.
                            </p>
                        </div>

                    </div>

                    <div className="ai-suggestions">

                        <div
                            onClick={() =>
                                navigate(
                                    "/ai-assistant"
                                )
                            }
                        >
                            <Brain size={18} />

                            <span>
                                Analyze my skill gaps
                            </span>

                            <ChevronRight size={17} />
                        </div>

                        <div
                            onClick={() =>
                                navigate(
                                    "/ai-assistant"
                                )
                            }
                        >
                            <TrendingUp size={18} />

                            <span>
                                Build my career roadmap
                            </span>

                            <ChevronRight size={17} />
                        </div>

                        <div
                            onClick={() =>
                                navigate(
                                    "/ai-assistant"
                                )
                            }
                        >
                            <BriefcaseBusiness
                                size={18}
                            />

                            <span>
                                Find suitable careers
                            </span>

                            <ChevronRight size={17} />
                        </div>

                    </div>

                    <button
                        className="ai-button"
                        onClick={() =>
                            navigate(
                                "/ai-assistant"
                            )
                        }
                    >
                        <Sparkles size={17} />
                        Open AI Assistant
                    </button>

                </div>

            </section>


            {/* OPPORTUNITIES */}

            <section className="dashboard-card opportunities-card">

                <div className="section-heading">

                    <div>

                        <div className="section-eyebrow">
                            CAREER OPPORTUNITIES
                        </div>

                        <h2>
                            Recommended For You
                        </h2>

                        <p>
                            Opportunities matched with
                            your current profile and skills.
                        </p>

                    </div>

                    <button
                        className="view-all-button"
                        onClick={() =>
                            navigate(
                                "/placement-recommendations"
                            )
                        }
                    >
                        View All
                        <ArrowRight size={16} />
                    </button>

                </div>


                {recommendations.length === 0 ? (

                    <div className="empty-opportunities">

                        <BriefcaseBusiness
                            size={32}
                        />

                        <h3>
                            No recommendations yet
                        </h3>

                        <p>
                            Complete your profile and
                            assessments to unlock
                            personalized opportunities.
                        </p>

                        <button
                            className="primary-button"
                            onClick={() =>
                                navigate(
                                    "/assessment"
                                )
                            }
                        >
                            Start Assessment
                            <ArrowRight size={16} />
                        </button>

                    </div>

                ) : (

                    <div className="opportunity-list">
                        
                        {recommendations
                            .slice(0, 3)
                            .map((item, index) => {
                                const internship =
                                    item?.internship || {};

                                const matchScore = Number(
                                    item?.matchScore || 0
                                );

                                const matchedSkills =
                                    item?.matchedSkills || [];

                                const missingSkills =
                                    item?.missingSkills || [];

                                return (
                                    <div
                                        className="opportunity-item"
                                        key={
                                            internship?._id ||
                                            index
                                        }
                                    >
                                        <div className="opportunity-icon">
                                            <BriefcaseBusiness
                                                size={21}
                                            />
                                        </div>

                                        <div className="opportunity-info">
                                            <h3>
                                                {internship?.title ||
                                                    "Internship Opportunity"}
                                            </h3>

                                            <p>
                                                {internship?.domain ||
                                                    "Technology"}
                                            </p>

                                            <div className="opportunity-meta">
                                                <span>
                                                    {internship?.workMode ||
                                                        "REMOTE"}
                                                </span>

                                                <span>
                                                    {internship?.duration ||
                                                        "Flexible"}
                                                </span>

                                                <span>
                                                    {internship?.stipend ||
                                                        "Stipend Available"}
                                                </span>
                                            </div>

                                            <div className="skill-match-row">
                                                {matchedSkills
                                                    .slice(0, 3)
                                                    .map(
                                                        (
                                                            skill,
                                                            skillIndex
                                                        ) => (
                                                            <span
                                                                className="matched-skill"
                                                                key={
                                                                    skillIndex
                                                                }
                                                            >
                                                                ✓{" "}
                                                                {
                                                                    skill.name
                                                                }
                                                            </span>
                                                        )
                                                    )}

                                                {missingSkills
                                                    .slice(0, 2)
                                                    .map(
                                                        (
                                                            skill,
                                                            skillIndex
                                                        ) => (
                                                            <span
                                                                className="missing-skill"
                                                                key={
                                                                    skillIndex
                                                                }
                                                            >
                                                                ⚠ {skill}
                                                            </span>
                                                        )
                                                    )}
                                            </div>
                                        </div>

                                        <div className="match-pill">
                                            <strong>
                                                {matchScore}%
                                            </strong>

                                            <span>
                                                Match
                                            </span>
                                        </div>

                                        <button
                                            onClick={() =>
                                                navigate(
                                                    `/internships/${internship._id}`
                                                )
                                            }
                                        >
                                            <ChevronRight
                                                size={20}
                                            />
                                        </button>
                                    </div>
                                );
                            })}
                        

                    </div>

                )}

            </section>


            {/* PROFILE OVERVIEW */}

            <section className="dashboard-bottom-grid">

                <div className="dashboard-card">

                    <div className="dashboard-card-header">

                        <div className="dashboard-card-icon blue">
                            <UserRound size={22} />
                        </div>

                        <div>
                            <h2>
                                Career Profile
                            </h2>

                            <p>
                                Your current preparation
                                overview.
                            </p>
                        </div>

                    </div>

                    <div className="profile-stat-list">

                        <ProfileStat
                            label="Skills"
                            value={totalSkills}
                        />

                        <ProfileStat
                            label="Projects"
                            value={totalProjects}
                        />

                        <ProfileStat
                            label="Certifications"
                            value={totalCertifications}
                        />

                        <ProfileStat
                            label="Profile"
                            value={`${profileCompletion}%`}
                        />

                    </div>

                    <button
                        className="card-action-button"
                        onClick={() =>
                            navigate(
                                "/edit-profile"
                            )
                        }
                    >
                        Edit Profile
                        <ArrowRight size={17} />
                    </button>

                </div>


                {/* IMPROVEMENT */}

                <div className="dashboard-card improvement-card">

                    <div className="dashboard-card-header">

                        <div className="dashboard-card-icon green">
                            <CheckCircle2 size={22} />
                        </div>

                        <div>
                            <h2>
                                Keep Improving
                            </h2>

                            <p>
                                Small improvements can
                                significantly increase
                                your placement score.
                            </p>
                        </div>

                    </div>

                    <div className="improvement-list">

                        <Improvement
                            icon={<Brain size={17} />}
                            text="Complete skill assessments"
                            done={
                                averageSkillScore > 0
                            }
                        />

                        <Improvement
                            icon={<FileText size={17} />}
                            text="Complete your profile"
                            done={
                                profileCompletion >= 80
                            }
                        />

                        <Improvement
                            icon={
                                <BriefcaseBusiness
                                    size={17}
                                />
                            }
                            text="Build practical projects"
                            done={
                                totalProjects >= 2
                            }
                        />

                        <Improvement
                            icon={<Award size={17} />}
                            text="Add industry certifications"
                            done={
                                totalCertifications > 0
                            }
                        />

                    </div>

                    <button
                        className="card-action-button"
                        onClick={() =>
                            navigate(
                                "/assessment"
                            )
                        }
                    >
                        Improve My Skills
                        <ArrowRight size={17} />
                    </button>

                </div>

            </section>

        </div>
    );
}


/* ============================================================
   COMPONENTS
============================================================ */

function DashboardStat({
    icon,
    title,
    value,
    progress,
    subtitle,
}) {
    return (
        <div className="dashboard-stat">

            <div className="stat-icon">
                {icon}
            </div>

            <div className="stat-content">

                <span>
                    {title}
                </span>

                <strong>
                    {value}
                </strong>

                {progress !== undefined ? (
                    <div className="stat-progress">

                        <div
                            style={{
                                width: `${Math.min(
                                    progress,
                                    100
                                )}%`,
                            }}
                        />

                    </div>
                ) : (
                    <small>
                        {subtitle}
                    </small>
                )}

            </div>

        </div>
    );
}


function ProfileStat({
    label,
    value,
}) {
    return (
        <div className="profile-stat">

            <span>
                {label}
            </span>

            <strong>
                {value}
            </strong>

        </div>
    );
}


function Improvement({
    icon,
    text,
    done,
}) {
    return (
        <div className="improvement-item">

            <div className="improvement-icon">
                {icon}
            </div>

            <span>
                {text}
            </span>

            <CheckCircle2
                size={18}
                className={
                    done
                        ? "improvement-done"
                        : "improvement-pending"
                }
            />

        </div>
    );
}


function AlertIcon() {
    return (
        <div className="alert-icon">
            !
        </div>
    );
}


export default StudentDashboard;

