import { useEffect, useMemo, useState } from "react";
import {
    Search,
    RefreshCw,
    CheckCircle2,
    XCircle,
    Clock3,
    Users,
    BriefcaseBusiness,
    Sparkles,
    Eye,
    X
} from "lucide-react";

import Sidebar from "../components/Sidebar";
import Topbar from "../components/Topbar";

import {
    getIndustryApplicationDashboard,
    getIndustryApplications,
    updateApplicationStatus
} from "../services/api";

function IndustryApplications() {
    const [dashboard, setDashboard] = useState(null);
    const [applications, setApplications] = useState([]);

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const [search, setSearch] = useState("");
    const [statusFilter, setStatusFilter] = useState("ALL");

    const [updatingId, setUpdatingId] = useState(null);
    const [selectedApplication, setSelectedApplication] = useState(null);

    // ============================================================
    // LOAD DATA
    // ============================================================

    const loadData = async () => {
        try {
            setLoading(true);
            setError("");

            const dashboardResponse =
                await getIndustryApplicationDashboard();

            const applicationResponse =
                await getIndustryApplications();

            console.log(
                "INDUSTRY DASHBOARD:",
                dashboardResponse
            );

            console.log(
                "INDUSTRY APPLICATIONS:",
                applicationResponse
            );

            setDashboard(
                dashboardResponse?.dashboard || null
            );

            setApplications(
                Array.isArray(applicationResponse?.applications)
                    ? applicationResponse.applications
                    : []
            );
        } catch (err) {
            console.error(
                "Industry applications error:",
                err
            );

            setError(
                err.message ||
                    "Unable to load applications"
            );
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadData();
    }, []);

    // ============================================================
    // GET APPLICATION ID SAFELY
    // ============================================================

    const getApplicationId = (application) => {
        if (!application) return null;

        return (
            application._id ||
            application.id ||
            application.applicationId ||
            application.application?._id ||
            application.application?.id ||
            null
        );
    };

    // ============================================================
    // UPDATE APPLICATION STATUS
    // ============================================================

    const handleStatusUpdate = async (
        application,
        status
    ) => {
        const applicationId =
            getApplicationId(application);

        console.log(
            "Application object:",
            application
        );

        console.log(
            "Resolved Application ID:",
            applicationId
        );

        if (!applicationId) {
            alert(
                "Application ID is missing. Please check the backend application response."
            );

            return;
        }

        try {
            setUpdatingId(applicationId);

            await updateApplicationStatus(
                applicationId,
                status
            );

            await loadData();

            if (selectedApplication) {
                setSelectedApplication(null);
            }
        } catch (err) {
            console.error(
                "Status update error:",
                err
            );

            alert(
                err.message ||
                    "Unable to update application status"
            );
        } finally {
            setUpdatingId(null);
        }
    };

    // ============================================================
    // SEARCH + FILTER
    // ============================================================

    const filteredApplications = useMemo(() => {
        return applications.filter(
            (application) => {
                const student =
                    application?.student || {};

                const internship =
                    application?.internship || {};

                const studentName =
                    student.name || "";

                const studentEmail =
                    student.email || "";

                const internshipTitle =
                    internship.title || "";

                const searchText =
                    `${studentName} ${studentEmail} ${internshipTitle}`
                        .toLowerCase();

                const matchesSearch =
                    searchText.includes(
                        search.toLowerCase()
                    );

                const matchesStatus =
                    statusFilter === "ALL" ||
                    application.status ===
                        statusFilter;

                return (
                    matchesSearch &&
                    matchesStatus
                );
            }
        );
    }, [
        applications,
        search,
        statusFilter
    ]);

    // ============================================================
    // STATUS CLASS
    // ============================================================

    const getStatusClass = (status) => {
        switch (status) {
            case "ACCEPTED":
                return "status-accepted";

            case "REJECTED":
                return "status-rejected";

            case "SHORTLISTED":
                return "status-shortlisted";

            case "UNDER_REVIEW":
                return "status-review";

            default:
                return "status-applied";
        }
    };

    // ============================================================
    // STATUS ICON
    // ============================================================

    const getStatusIcon = (status) => {
        switch (status) {
            case "ACCEPTED":
                return (
                    <CheckCircle2 size={15} />
                );

            case "REJECTED":
                return (
                    <XCircle size={15} />
                );

            case "UNDER_REVIEW":
                return (
                    <Clock3 size={15} />
                );

            case "SHORTLISTED":
                return (
                    <Sparkles size={15} />
                );

            default:
                return (
                    <Clock3 size={15} />
                );
        }
    };

    // ============================================================
    // FORMAT STATUS
    // ============================================================

    const formatStatus = (status) => {
        if (!status) return "APPLIED";

        return status
            .replaceAll("_", " ")
            .toLowerCase()
            .replace(/\b\w/g, (letter) =>
                letter.toUpperCase()
            );
    };

    // ============================================================
    // GET SKILLS
    // ============================================================

    const getStudentSkills = (student) => {
        if (!student) return [];

        if (Array.isArray(student.skills)) {
            return student.skills;
        }

        return [];
    };

    // ============================================================
    // GET MATCH SCORE
    // ============================================================

    const getMatchScore = (application) => {
        const score =
            application?.matchScore ??
            application?.matchPercentage ??
            application?.score ??
            0;

        return Number(score) || 0;
    };

    // ============================================================
    // LOADING
    // ============================================================

    if (loading) {
        return (
            <div className="app-shell">
                <Sidebar />

                <main className="main-content">
                    <Topbar />

                    <div className="page-container">
                        <div className="project-placeholder">
                            <strong>
                                Loading applications...
                            </strong>

                            <p>
                                Fetching applications received
                                from students.
                            </p>
                        </div>
                    </div>
                </main>
            </div>
        );
    }

    // ============================================================
    // MAIN UI
    // ============================================================

    return (
        <div className="app-shell">
            <Sidebar />

            <main className="main-content">
                <Topbar />

                <div className="page-container">

                    {/* HEADER */}

                    <div className="page-header">
                        <div>
                            <span className="panel-label">
                                TALENT MANAGEMENT
                            </span>

                            <h2>
                                Applications
                            </h2>

                            <p>
                                Review candidates,
                                compare skills,
                                and manage internship
                                applications.
                            </p>
                        </div>

                        <button
                            type="button"
                            className="secondary-button"
                            onClick={loadData}
                            disabled={loading}
                        >
                            <RefreshCw size={16} />

                            Refresh
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
                                Unable to load applications
                            </strong>

                            <p>
                                {error}
                            </p>

                            <button
                                type="button"
                                className="secondary-button"
                                onClick={loadData}
                            >
                                Try Again
                            </button>
                        </div>
                    )}

                    {!error && (
                        <>

                            {/* ====================================================
                                STATISTICS
                            ==================================================== */}

                            <div
                                style={{
                                    display: "grid",
                                    gridTemplateColumns:
                                        "repeat(4, minmax(0, 1fr))",
                                    gap: "16px",
                                    marginBottom: "24px"
                                }}
                            >

                                <div className="metric-card">
                                    <div className="metric-icon">
                                        <BriefcaseBusiness
                                            size={20}
                                        />
                                    </div>

                                    <span>
                                        Total Internships
                                    </span>

                                    <strong>
                                        {
                                            dashboard?.totalInternships ??
                                            0
                                        }
                                    </strong>
                                </div>

                                <div className="metric-card">
                                    <div className="metric-icon">
                                        <Users size={20} />
                                    </div>

                                    <span>
                                        Total Applications
                                    </span>

                                    <strong>
                                        {
                                            dashboard?.totalApplications ??
                                            0
                                        }
                                    </strong>
                                </div>

                                <div className="metric-card">
                                    <div className="metric-icon">
                                        <Clock3 size={20} />
                                    </div>

                                    <span>
                                        Under Review
                                    </span>

                                    <strong>
                                        {
                                            dashboard
                                                ?.statusCounts
                                                ?.UNDER_REVIEW ??
                                            0
                                        }
                                    </strong>
                                </div>

                                <div className="metric-card">
                                    <div className="metric-icon">
                                        <CheckCircle2
                                            size={20}
                                        />
                                    </div>

                                    <span>
                                        Accepted
                                    </span>

                                    <strong>
                                        {
                                            dashboard
                                                ?.statusCounts
                                                ?.ACCEPTED ??
                                            0
                                        }
                                    </strong>
                                </div>
                            </div>

                            {/* ====================================================
                                AI TALENT INSIGHT
                            ==================================================== */}

                            <div
                                style={{
                                    padding: "20px",
                                    marginBottom: "24px",
                                    borderRadius: "16px",
                                    border:
                                        "1px solid var(--border-color, #e5e7eb)",
                                    background:
                                        "linear-gradient(135deg, rgba(99,102,241,0.08), rgba(139,92,246,0.04))"
                                }}
                            >
                                <div
                                    style={{
                                        display: "flex",
                                        alignItems: "center",
                                        gap: "10px",
                                        marginBottom: "8px"
                                    }}
                                >
                                    <Sparkles
                                        size={20}
                                    />

                                    <strong>
                                        AI Talent Insights
                                    </strong>
                                </div>

                                <p
                                    style={{
                                        margin: 0,
                                        opacity: 0.75
                                    }}
                                >
                                    AI-powered candidate
                                    ranking and skill-gap
                                    analysis will appear
                                    here as we build the
                                    SkillBridge intelligence
                                    layer.
                                </p>
                            </div>

                            {/* ====================================================
                                SEARCH / FILTER
                            ==================================================== */}

                            <div className="search-panel">

                                <div className="large-search">
                                    <Search size={18} />

                                    <input
                                        value={search}
                                        onChange={(e) =>
                                            setSearch(
                                                e.target.value
                                            )
                                        }
                                        placeholder="Search student or internship..."
                                    />
                                </div>

                                <select
                                    value={statusFilter}
                                    onChange={(e) =>
                                        setStatusFilter(
                                            e.target.value
                                        )
                                    }
                                    className="filter-button"
                                >
                                    <option value="ALL">
                                        All Statuses
                                    </option>

                                    <option value="APPLIED">
                                        Applied
                                    </option>

                                    <option value="UNDER_REVIEW">
                                        Under Review
                                    </option>

                                    <option value="SHORTLISTED">
                                        Shortlisted
                                    </option>

                                    <option value="ACCEPTED">
                                        Accepted
                                    </option>

                                    <option value="REJECTED">
                                        Rejected
                                    </option>
                                </select>
                            </div>

                            {/* RESULTS COUNT */}

                            <p className="results-count">
                                Showing{" "}
                                <strong>
                                    {
                                        filteredApplications.length
                                    }
                                </strong>{" "}
                                applications
                            </p>

                            {/* EMPTY */}

                            {filteredApplications.length ===
                                0 && (
                                <div className="project-placeholder">
                                    <strong>
                                        No applications found
                                    </strong>

                                    <p>
                                        Students who apply
                                        for your internships
                                        will appear here.
                                    </p>
                                </div>
                            )}

                            {/* ====================================================
                                APPLICATION LIST
                            ==================================================== */}

                            {filteredApplications.length >
                                0 && (
                                <div
                                    style={{
                                        display: "grid",
                                        gap: "14px"
                                    }}
                                >
                                    {filteredApplications.map(
                                        (application) => {
                                            const student =
                                                application?.student ||
                                                {};

                                            const internship =
                                                application?.internship ||
                                                {};

                                            const applicationId =
                                                getApplicationId(
                                                    application
                                                );

                                            const status =
                                                application?.status ||
                                                "APPLIED";

                                            const matchScore =
                                                getMatchScore(
                                                    application
                                                );

                                            const skills =
                                                getStudentSkills(
                                                    student
                                                );

                                            return (
                                                <div
                                                    key={
                                                        applicationId ||
                                                        Math.random()
                                                    }
                                                    className="opportunity-card"
                                                >

                                                    {/* TOP */}

                                                    <div
                                                        style={{
                                                            display:
                                                                "flex",
                                                            justifyContent:
                                                                "space-between",
                                                            gap: "20px",
                                                            alignItems:
                                                                "flex-start"
                                                        }}
                                                    >

                                                        {/* STUDENT */}

                                                        <div>
                                                            <span className="panel-label">
                                                                CANDIDATE
                                                            </span>

                                                            <h3>
                                                                {
                                                                    student.name ||
                                                                    "Unknown Student"
                                                                }
                                                            </h3>

                                                            <p>
                                                                {
                                                                    student.email ||
                                                                    "No email available"
                                                                }
                                                            </p>
                                                        </div>

                                                        {/* STATUS */}

                                                        <div
                                                            className={getStatusClass(
                                                                status
                                                            )}
                                                            style={{
                                                                display:
                                                                    "flex",
                                                                alignItems:
                                                                    "center",
                                                                gap: "6px"
                                                            }}
                                                        >
                                                            {getStatusIcon(
                                                                status
                                                            )}

                                                            {formatStatus(
                                                                status
                                                            )}
                                                        </div>
                                                    </div>

                                                    {/* INTERNSHIP */}

                                                    <div
                                                        style={{
                                                            marginTop:
                                                                "18px",
                                                            padding:
                                                                "14px",
                                                            border:
                                                                "1px solid var(--border-color, #e5e7eb)",
                                                            borderRadius:
                                                                "12px"
                                                        }}
                                                    >
                                                        <span className="panel-label">
                                                            INTERNSHIP
                                                        </span>

                                                        <strong
                                                            style={{
                                                                display:
                                                                    "block",
                                                                marginTop:
                                                                    "5px"
                                                            }}
                                                        >
                                                            {
                                                                internship.title ||
                                                                "Internship"
                                                            }
                                                        </strong>

                                                        <span
                                                            style={{
                                                                display:
                                                                    "block",
                                                                marginTop:
                                                                    "4px"
                                                            }}
                                                        >
                                                            {
                                                                internship.domain ||
                                                                "General"
                                                            }
                                                        </span>
                                                    </div>

                                                    {/* INFORMATION */}

                                                    <div
                                                        style={{
                                                            display:
                                                                "grid",
                                                            gridTemplateColumns:
                                                                "repeat(3, minmax(0, 1fr))",
                                                            gap: "16px",
                                                            marginTop:
                                                                "18px"
                                                        }}
                                                    >

                                                        {/* MATCH SCORE */}

                                                        <div>
                                                            <span className="panel-label">
                                                                MATCH SCORE
                                                            </span>

                                                            <strong
                                                                style={{
                                                                    display:
                                                                        "block",
                                                                    fontSize:
                                                                        "24px",
                                                                    marginTop:
                                                                        "4px"
                                                                }}
                                                            >
                                                                {
                                                                    matchScore
                                                                }
                                                                %
                                                            </strong>
                                                        </div>

                                                        {/* SKILLS */}

                                                        <div>
                                                            <span className="panel-label">
                                                                SKILLS
                                                            </span>

                                                            <div
                                                                style={{
                                                                    display:
                                                                        "flex",
                                                                    gap:
                                                                        "6px",
                                                                    flexWrap:
                                                                        "wrap",
                                                                    marginTop:
                                                                        "7px"
                                                                }}
                                                            >
                                                                {skills.length >
                                                                0 ? (
                                                                    skills
                                                                        .slice(
                                                                            0,
                                                                            4
                                                                        )
                                                                        .map(
                                                                            (
                                                                                skill,
                                                                                index
                                                                            ) => (
                                                                                <span
                                                                                    key={
                                                                                        skill?._id ||
                                                                                        skill?.id ||
                                                                                        index
                                                                                    }
                                                                                    style={{
                                                                                        padding:
                                                                                            "5px 9px",
                                                                                        borderRadius:
                                                                                            "999px",
                                                                                        background:
                                                                                            "rgba(99,102,241,0.08)",
                                                                                        fontSize:
                                                                                            "12px"
                                                                                    }}
                                                                                >
                                                                                    {typeof skill ===
                                                                                    "string"
                                                                                        ? skill
                                                                                        : skill.name ||
                                                                                          skill.skillName ||
                                                                                          "Skill"}
                                                                                </span>
                                                                            )
                                                                        )
                                                                ) : (
                                                                    <span>
                                                                        No skills
                                                                        listed
                                                                    </span>
                                                                )}
                                                            </div>
                                                        </div>

                                                        {/* DATE */}

                                                        <div>
                                                            <span className="panel-label">
                                                                APPLICATION DATE
                                                            </span>

                                                            <strong
                                                                style={{
                                                                    display:
                                                                        "block",
                                                                    marginTop:
                                                                        "6px"
                                                                }}
                                                            >
                                                                {application.createdAt
                                                                    ? new Date(
                                                                          application.createdAt
                                                                      ).toLocaleDateString()
                                                                    : "—"}
                                                            </strong>
                                                        </div>
                                                    </div>

                                                    {/* ACTIONS */}

                                                    <div
                                                        style={{
                                                            display:
                                                                "flex",
                                                            gap:
                                                                "10px",
                                                            marginTop:
                                                                "20px",
                                                            flexWrap:
                                                                "wrap"
                                                        }}
                                                    >

                                                        {/* VIEW */}

                                                        <button
                                                            type="button"
                                                            className="secondary-button"
                                                            onClick={() =>
                                                                setSelectedApplication(
                                                                    application
                                                                )
                                                            }
                                                        >
                                                            <Eye
                                                                size={
                                                                    15
                                                                }
                                                            />

                                                            View
                                                        </button>

                                                        {/* REVIEW */}

                                                        {status !==
                                                            "UNDER_REVIEW" &&
                                                            status !==
                                                                "ACCEPTED" &&
                                                            status !==
                                                                "REJECTED" && (
                                                                <button
                                                                    type="button"
                                                                    className="secondary-button"
                                                                    disabled={
                                                                        updatingId ===
                                                                        applicationId
                                                                    }
                                                                    onClick={() =>
                                                                        handleStatusUpdate(
                                                                            application,
                                                                            "UNDER_REVIEW"
                                                                        )
                                                                    }
                                                                >
                                                                    <Clock3
                                                                        size={
                                                                            15
                                                                        }
                                                                    />

                                                                    Review
                                                                </button>
                                                            )}

                                                        {/* SHORTLIST */}

                                                        {status !==
                                                            "SHORTLISTED" &&
                                                            status !==
                                                                "ACCEPTED" &&
                                                            status !==
                                                                "REJECTED" && (
                                                                <button
                                                                    type="button"
                                                                    className="secondary-button"
                                                                    disabled={
                                                                        updatingId ===
                                                                        applicationId
                                                                    }
                                                                    onClick={() =>
                                                                        handleStatusUpdate(
                                                                            application,
                                                                            "SHORTLISTED"
                                                                        )
                                                                    }
                                                                >
                                                                    <Sparkles
                                                                        size={
                                                                            15
                                                                        }
                                                                    />

                                                                    Shortlist
                                                                </button>
                                                            )}

                                                        {/* ACCEPT */}

                                                        {status !==
                                                            "ACCEPTED" &&
                                                            status !==
                                                                "REJECTED" && (
                                                                <button
                                                                    type="button"
                                                                    className="primary-button"
                                                                    disabled={
                                                                        updatingId ===
                                                                        applicationId
                                                                    }
                                                                    onClick={() =>
                                                                        handleStatusUpdate(
                                                                            application,
                                                                            "ACCEPTED"
                                                                        )
                                                                    }
                                                                >
                                                                    <CheckCircle2
                                                                        size={
                                                                            15
                                                                        }
                                                                    />

                                                                    Accept
                                                                </button>
                                                            )}

                                                        {/* REJECT */}

                                                        {status !==
                                                            "REJECTED" &&
                                                            status !==
                                                                "ACCEPTED" && (
                                                                <button
                                                                    type="button"
                                                                    className="secondary-button"
                                                                    disabled={
                                                                        updatingId ===
                                                                        applicationId
                                                                    }
                                                                    onClick={() =>
                                                                        handleStatusUpdate(
                                                                            application,
                                                                            "REJECTED"
                                                                        )
                                                                    }
                                                                >
                                                                    <XCircle
                                                                        size={
                                                                            15
                                                                        }
                                                                    />

                                                                    Reject
                                                                </button>
                                                            )}
                                                    </div>
                                                </div>
                                            );
                                        }
                                    )}
                                </div>
                            )}
                        </>
                    )}
                </div>
            </main>

            {/* ============================================================
                APPLICATION DETAILS MODAL
            ============================================================ */}

            {selectedApplication && (
                <div
                    style={{
                        position: "fixed",
                        inset: 0,
                        background:
                            "rgba(0,0,0,0.45)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        zIndex: 9999,
                        padding: "20px"
                    }}
                    onClick={() =>
                        setSelectedApplication(null)
                    }
                >
                    <div
                        style={{
                            width: "100%",
                            maxWidth: "650px",
                            maxHeight: "85vh",
                            overflowY: "auto",
                            background:
                                "var(--card-bg, #ffffff)",
                            borderRadius: "18px",
                            padding: "24px",
                            boxShadow:
                                "0 25px 60px rgba(0,0,0,0.2)"
                        }}
                        onClick={(e) =>
                            e.stopPropagation()
                        }
                    >

                        {/* MODAL HEADER */}

                        <div
                            style={{
                                display: "flex",
                                justifyContent:
                                    "space-between",
                                alignItems:
                                    "flex-start",
                                gap: "20px"
                            }}
                        >
                            <div>
                                <span className="panel-label">
                                    CANDIDATE PROFILE
                                </span>

                                <h2
                                    style={{
                                        margin:
                                            "6px 0"
                                    }}
                                >
                                    {
                                        selectedApplication
                                            ?.student
                                            ?.name ||
                                        "Unknown Student"
                                    }
                                </h2>

                                <p>
                                    {
                                        selectedApplication
                                            ?.student
                                            ?.email ||
                                        "No email"
                                    }
                                </p>
                            </div>

                            <button
                                type="button"
                                className="secondary-button"
                                onClick={() =>
                                    setSelectedApplication(
                                        null
                                    )
                                }
                            >
                                <X size={16} />
                            </button>
                        </div>

                        {/* INTERNSHIP */}

                        <div
                            style={{
                                marginTop: "20px",
                                padding: "16px",
                                border:
                                    "1px solid var(--border-color, #e5e7eb)",
                                borderRadius: "12px"
                            }}
                        >
                            <span className="panel-label">
                                APPLIED INTERNSHIP
                            </span>

                            <h3
                                style={{
                                    margin:
                                        "6px 0"
                                }}
                            >
                                {
                                    selectedApplication
                                        ?.internship
                                        ?.title ||
                                    "Internship"
                                }
                            </h3>

                            <p>
                                {
                                    selectedApplication
                                        ?.internship
                                        ?.domain ||
                                    "General"
                                }
                            </p>
                        </div>

                        {/* AI MATCH */}

                        <div
                            style={{
                                marginTop: "16px",
                                padding: "16px",
                                borderRadius: "12px",
                                background:
                                    "rgba(99,102,241,0.07)"
                            }}
                        >
                            <div
                                style={{
                                    display:
                                        "flex",
                                    alignItems:
                                        "center",
                                    gap: "8px"
                                }}
                            >
                                <Sparkles
                                    size={18}
                                />

                                <strong>
                                    AI Match Score
                                </strong>
                            </div>

                            <strong
                                style={{
                                    display:
                                        "block",
                                    fontSize:
                                        "32px",
                                    marginTop:
                                        "8px"
                                }}
                            >
                                {
                                    getMatchScore(
                                        selectedApplication
                                    )
                                }
                                %
                            </strong>

                            <p
                                style={{
                                    marginBottom:
                                        0
                                }}
                            >
                                This score will
                                become AI-driven
                                once the SkillBridge
                                recommendation
                                engine is connected.
                            </p>
                        </div>

                        {/* SKILLS */}

                        <div
                            style={{
                                marginTop: "20px"
                            }}
                        >
                            <span className="panel-label">
                                CANDIDATE SKILLS
                            </span>

                            <div
                                style={{
                                    display:
                                        "flex",
                                    gap: "8px",
                                    flexWrap:
                                        "wrap",
                                    marginTop:
                                        "10px"
                                }}
                            >
                                {getStudentSkills(
                                    selectedApplication?.student
                                ).length >
                                0 ? (
                                    getStudentSkills(
                                        selectedApplication?.student
                                    ).map(
                                        (
                                            skill,
                                            index
                                        ) => (
                                            <span
                                                key={
                                                    skill?._id ||
                                                    skill?.id ||
                                                    index
                                                }
                                                style={{
                                                    padding:
                                                        "7px 12px",
                                                    borderRadius:
                                                        "999px",
                                                    background:
                                                        "rgba(99,102,241,0.08)"
                                                }}
                                            >
                                                {typeof skill ===
                                                "string"
                                                    ? skill
                                                    : skill.name ||
                                                      skill.skillName ||
                                                      "Skill"}
                                            </span>
                                        )
                                    )
                                ) : (
                                    <p>
                                        No skills
                                        available.
                                    </p>
                                )}
                            </div>
                        </div>

                        {/* COVER LETTER */}

                        <div
                            style={{
                                marginTop: "20px"
                            }}
                        >
                            <span className="panel-label">
                                COVER LETTER
                            </span>

                            <div
                                style={{
                                    marginTop:
                                        "8px",
                                    padding:
                                        "14px",
                                    border:
                                        "1px solid var(--border-color, #e5e7eb)",
                                    borderRadius:
                                        "12px",
                                    lineHeight:
                                        1.6
                                }}
                            >
                                {
                                    selectedApplication?.coverLetter ||
                                    "No cover letter provided."
                                }
                            </div>
                        </div>

                        {/* MODAL ACTIONS */}

                        <div
                            style={{
                                display:
                                    "flex",
                                gap: "10px",
                                marginTop:
                                    "24px",
                                flexWrap:
                                    "wrap"
                            }}
                        >
                            <button
                                type="button"
                                className="secondary-button"
                                disabled={
                                    updatingId ===
                                    getApplicationId(
                                        selectedApplication
                                    )
                                }
                                onClick={() =>
                                    handleStatusUpdate(
                                        selectedApplication,
                                        "SHORTLISTED"
                                    )
                                }
                            >
                                <Sparkles
                                    size={15}
                                />

                                Shortlist
                            </button>

                            <button
                                type="button"
                                className="primary-button"
                                disabled={
                                    updatingId ===
                                    getApplicationId(
                                        selectedApplication
                                    )
                                }
                                onClick={() =>
                                    handleStatusUpdate(
                                        selectedApplication,
                                        "ACCEPTED"
                                    )
                                }
                            >
                                <CheckCircle2
                                    size={15}
                                />

                                Accept
                            </button>

                            <button
                                type="button"
                                className="secondary-button"
                                disabled={
                                    updatingId ===
                                    getApplicationId(
                                        selectedApplication
                                    )
                                }
                                onClick={() =>
                                    handleStatusUpdate(
                                        selectedApplication,
                                        "REJECTED"
                                    )
                                }
                            >
                                <XCircle
                                    size={15}
                                />

                                Reject
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default IndustryApplications;