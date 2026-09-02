import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import Sidebar from "../components/Sidebar";
import Topbar from "../components/Topbar";

import {
    getIndustryApplicationDashboard,
    getMyInternships
} from "../services/api";

function IndustryDashboard() {
    const navigate = useNavigate();

    const [dashboard, setDashboard] = useState(null);
    const [internships, setInternships] = useState([]);

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const loadDashboard = async () => {
        try {
            setLoading(true);
            setError("");

            const dashboardResponse =
                await getIndustryApplicationDashboard();

            const internshipResponse =
                await getMyInternships();

            setDashboard(
                dashboardResponse?.dashboard || null
            );

            setInternships(
                Array.isArray(
                    internshipResponse?.internships
                )
                    ? internshipResponse.internships
                    : []
            );

        } catch (err) {
            console.error(
                "Industry Dashboard Error:",
                err
            );

            setError(
                err.message ||
                "Unable to load industry dashboard"
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
            <div className="app-shell">
                <Sidebar />

                <main className="main-content">
                    <Topbar />

                    <div className="page-container">
                        <div className="project-placeholder">
                            <strong>
                                Loading industry dashboard...
                            </strong>

                            <p>
                                Fetching your internships and applications.
                            </p>
                        </div>
                    </div>
                </main>
            </div>
        );
    }

    return (
        <div className="app-shell">
            <Sidebar />

            <main className="main-content">
                <Topbar />

                <div className="page-container">

                    {/* HEADER */}

                    <div
                        className="page-header"
                        style={{
                            marginBottom: "24px"
                        }}
                    >
                        <div>
                            <span className="panel-label">
                                INDUSTRY PORTAL
                            </span>

                            <h2>
                                Industry Dashboard
                            </h2>

                            <p>
                                Manage internships and evaluate student talent.
                            </p>
                        </div>

                        <button
                            className="primary-button"
                            onClick={() =>
                                navigate(
                                    "/industry/internships"
                                )
                            }
                        >
                            + Manage Internships
                        </button>
                    </div>

                    {/* ERROR */}

                    {error && (
                        <div
                            className="project-placeholder"
                            style={{
                                marginBottom: "20px"
                            }}
                        >
                            <strong>
                                Unable to load dashboard
                            </strong>

                            <p>
                                {error}
                            </p>

                            <button
                                className="secondary-button"
                                onClick={loadDashboard}
                            >
                                Try Again
                            </button>
                        </div>
                    )}

                    {/* STATISTICS */}

                    {!error && (
                        <>
                            <div
                                style={{
                                    display: "grid",
                                    gridTemplateColumns:
                                        "repeat(auto-fit, minmax(180px, 1fr))",
                                    gap: "16px",
                                    marginBottom: "24px"
                                }}
                            >
                                <MetricCard
                                    title="Total Internships"
                                    value={
                                        dashboard?.totalInternships ??
                                        internships.length
                                    }
                                />

                                <MetricCard
                                    title="Open Internships"
                                    value={
                                        dashboard?.openInternships ??
                                        internships.filter(
                                            item =>
                                                item.status === "OPEN"
                                        ).length
                                    }
                                />

                                <MetricCard
                                    title="Applications"
                                    value={
                                        dashboard?.totalApplications ??
                                        0
                                    }
                                />

                                <MetricCard
                                    title="Shortlisted"
                                    value={
                                        dashboard
                                            ?.statusCounts
                                            ?.SHORTLISTED ??
                                        0
                                    }
                                />

                                <MetricCard
                                    title="Accepted"
                                    value={
                                        dashboard
                                            ?.statusCounts
                                            ?.ACCEPTED ??
                                        0
                                    }
                                />
                            </div>

                            {/* QUICK ACTIONS */}

                            <div
                                style={{
                                    display: "grid",
                                    gridTemplateColumns:
                                        "repeat(auto-fit, minmax(250px, 1fr))",
                                    gap: "16px",
                                    marginBottom: "24px"
                                }}
                            >
                                <ActionCard
                                    title="Manage Internships"
                                    description="Create and manage opportunities for students."
                                    buttonText="Open Internships"
                                    onClick={() =>
                                        navigate(
                                            "/industry/internships"
                                        )
                                    }
                                />

                                <ActionCard
                                    title="Review Applications"
                                    description="View candidates who applied to your opportunities."
                                    buttonText="View Applications"
                                    onClick={() =>
                                        navigate(
                                            "/industry/applications"
                                        )
                                    }
                                />
                            </div>

                            {/* RECENT INTERNSHIPS */}

                            <div className="panel">
                                <div
                                    style={{
                                        display: "flex",
                                        justifyContent:
                                            "space-between",
                                        alignItems: "center",
                                        marginBottom: "18px"
                                    }}
                                >
                                    <div>
                                        <span className="panel-label">
                                            OPPORTUNITIES
                                        </span>

                                        <h3>
                                            Your Internships
                                        </h3>
                                    </div>

                                    <button
                                        className="secondary-button"
                                        onClick={() =>
                                            navigate(
                                                "/industry/internships"
                                            )
                                        }
                                    >
                                        View All
                                    </button>
                                </div>

                                {internships.length === 0 ? (
                                    <div className="project-placeholder">
                                        <strong>
                                            No internships yet
                                        </strong>

                                        <p>
                                            Create your first internship opportunity.
                                        </p>

                                        <button
                                            className="primary-button"
                                            onClick={() =>
                                                navigate(
                                                    "/industry/internships"
                                                )
                                            }
                                        >
                                            Create Internship
                                        </button>
                                    </div>
                                ) : (
                                    <div
                                        style={{
                                            display: "grid",
                                            gap: "12px"
                                        }}
                                    >
                                        {internships
                                            .slice(0, 5)
                                            .map(
                                                internship => (
                                                    <div
                                                        key={
                                                            internship._id
                                                        }
                                                        style={{
                                                            padding:
                                                                "16px",
                                                            border:
                                                                "1px solid var(--border-color, #e5e7eb)",
                                                            borderRadius:
                                                                "12px"
                                                        }}
                                                    >
                                                        <div
                                                            style={{
                                                                display:
                                                                    "flex",
                                                                justifyContent:
                                                                    "space-between",
                                                                gap:
                                                                    "16px"
                                                            }}
                                                        >
                                                            <div>
                                                                <strong>
                                                                    {
                                                                        internship.title
                                                                    }
                                                                </strong>

                                                                <p
                                                                    style={{
                                                                        margin:
                                                                            "5px 0 0"
                                                                    }}
                                                                >
                                                                    {
                                                                        internship.domain
                                                                    }
                                                                </p>
                                                            </div>

                                                            <span
                                                                style={{
                                                                    fontSize:
                                                                        "12px",
                                                                    padding:
                                                                        "5px 10px",
                                                                    borderRadius:
                                                                        "999px",
                                                                    background:
                                                                        internship.status ===
                                                                        "OPEN"
                                                                            ? "#dcfce7"
                                                                            : "#f1f5f9"
                                                                }}
                                                            >
                                                                {
                                                                    internship.status
                                                                }
                                                            </span>
                                                        </div>

                                                        <p
                                                            style={{
                                                                margin:
                                                                    "10px 0 0"
                                                            }}
                                                        >
                                                            Required skills:{" "}
                                                            {Array.isArray(
                                                                internship.requiredSkills
                                                            )
                                                                ? internship.requiredSkills.join(
                                                                      ", "
                                                                  )
                                                                : "Not specified"}
                                                        </p>
                                                    </div>
                                                )
                                            )}
                                    </div>
                                )}
                            </div>
                        </>
                    )}
                </div>
            </main>
        </div>
    );
}


/* ============================================================
   METRIC CARD
============================================================ */

function MetricCard({
    title,
    value
}) {
    return (
        <div className="metric-card">
            <span>
                {title}
            </span>

            <strong>
                {value}
            </strong>
        </div>
    );
}


/* ============================================================
   ACTION CARD
============================================================ */

function ActionCard({
    title,
    description,
    buttonText,
    onClick
}) {
    return (
        <div className="opportunity-card">
            <h3>
                {title}
            </h3>

            <p>
                {description}
            </p>

            <button
                className="secondary-button"
                onClick={onClick}
            >
                {buttonText}
            </button>
        </div>
    );
}


export default IndustryDashboard;