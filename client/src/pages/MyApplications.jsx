import { useEffect, useState } from "react";
import {
    BriefcaseBusiness,
    CheckCircle2,
    Clock3,
    XCircle,
    Search,
    RefreshCw
} from "lucide-react";

import Sidebar from "../components/Sidebar";
import Topbar from "../components/Topbar";

import { getMyApplications } from "../services/api";

function MyApplications() {
    const [applications, setApplications] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [search, setSearch] = useState("");

    useEffect(() => {
        loadApplications();
    }, []);

    const loadApplications = async () => {
        try {
            setLoading(true);
            setError("");

            console.log("Loading student applications...");

            const response = await getMyApplications();

            console.log(
                "MY APPLICATIONS RESPONSE:",
                response
            );

            setApplications(
                response.applications || []
            );
        } catch (err) {
            console.error(
                "Application loading error:",
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

    const getInternship = (application) => {
        if (
            application &&
            application.internship &&
            typeof application.internship === "object"
        ) {
            return application.internship;
        }

        return {};
    };

    const getCompanyName = (internship) => {
        if (
            internship.industry &&
            typeof internship.industry === "object"
        ) {
            return internship.industry.name;
        }

        return (
            internship.company ||
            "Industry Partner"
        );
    };

    const getStatusIcon = (status) => {
        switch (status) {
            case "ACCEPTED":
                return <CheckCircle2 size={18} />;

            case "REJECTED":
                return <XCircle size={18} />;

            case "SHORTLISTED":
                return <CheckCircle2 size={18} />;

            case "UNDER_REVIEW":
                return <Clock3 size={18} />;

            default:
                return <Clock3 size={18} />;
        }
    };

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

    const filteredApplications =
        applications.filter((application) => {
            const internship =
                getInternship(application);

            const company =
                getCompanyName(internship);

            const searchText =
                `${internship.title || ""} ${company || ""} ${internship.domain || ""}`
                    .toLowerCase();

            return searchText.includes(
                search.toLowerCase()
            );
        });

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
                                APPLICATION CENTER
                            </span>

                            <h2>
                                My Applications
                            </h2>

                            <p>
                                Track your internship
                                applications and selection
                                progress.
                            </p>

                        </div>

                        <button
                            type="button"
                            className="secondary-button"
                            onClick={loadApplications}
                        >
                            <RefreshCw size={16} />

                            Refresh
                        </button>

                    </div>


                    {/* SEARCH */}

                    <div className="search-panel">

                        <div className="large-search">

                            <Search size={19} />

                            <input
                                type="text"
                                placeholder="Search applications..."
                                value={search}
                                onChange={(e) =>
                                    setSearch(
                                        e.target.value
                                    )
                                }
                            />

                        </div>

                    </div>


                    {/* LOADING */}

                    {loading && (
                        <div className="project-placeholder">

                            <strong>
                                Loading applications...
                            </strong>

                            <p>
                                Fetching your internship
                                applications.
                            </p>

                        </div>
                    )}


                    {/* ERROR */}

                    {!loading && error && (
                        <div className="project-placeholder">

                            <strong>
                                Unable to load applications
                            </strong>

                            <p>
                                {error}
                            </p>

                            <button
                                type="button"
                                className="secondary-button"
                                onClick={loadApplications}
                            >
                                Try Again
                            </button>

                        </div>
                    )}


                    {/* EMPTY */}

                    {!loading &&
                        !error &&
                        applications.length === 0 && (

                            <div className="project-placeholder">

                                <BriefcaseBusiness
                                    size={40}
                                />

                                <strong>
                                    No applications yet
                                </strong>

                                <p>
                                    Apply to an internship
                                    to start tracking your
                                    application here.
                                </p>

                            </div>
                        )}


                    {/* NO SEARCH RESULTS */}

                    {!loading &&
                        !error &&
                        applications.length > 0 &&
                        filteredApplications.length === 0 && (

                            <div className="project-placeholder">

                                <strong>
                                    No matching applications
                                </strong>

                                <p>
                                    Try a different search.
                                </p>

                            </div>
                        )}


                    {/* APPLICATIONS */}

                    {!loading &&
                        !error &&
                        filteredApplications.length > 0 && (

                            <div className="application-list">

                                {filteredApplications.map(
                                    (application) => {

                                        const internship =
                                            getInternship(
                                                application
                                            );

                                        const company =
                                            getCompanyName(
                                                internship
                                            );

                                        const status =
                                            application.status ||
                                            "APPLIED";

                                        const matchScore =
                                            application.matchScore ??
                                            0;

                                        return (
                                            <div
                                                className="application-card"
                                                key={
                                                    application._id ||
                                                    application.id
                                                }
                                            >

                                                {/* TOP */}

                                                <div className="application-card-top">

                                                    <div>

                                                        <span className="panel-label">
                                                            {internship.domain ||
                                                                "INTERNSHIP"}
                                                        </span>

                                                        <h3>
                                                            {
                                                                internship.title ||
                                                                "Internship"
                                                            }
                                                        </h3>

                                                        <p>
                                                            {company}
                                                        </p>

                                                    </div>


                                                    <div
                                                        className={`application-status ${getStatusClass(
                                                            status
                                                        )}`}
                                                    >
                                                        {getStatusIcon(
                                                            status
                                                        )}

                                                        {status.replace(
                                                            "_",
                                                            " "
                                                        )}
                                                    </div>

                                                </div>


                                                {/* DETAILS */}

                                                <div className="application-details">

                                                    <div>
                                                        <span>
                                                            Match Score
                                                        </span>

                                                        <strong>
                                                            {
                                                                matchScore
                                                            }
                                                            %
                                                        </strong>
                                                    </div>


                                                    <div>
                                                        <span>
                                                            Work Mode
                                                        </span>

                                                        <strong>
                                                            {
                                                                internship.workMode ||
                                                                "Not specified"
                                                            }
                                                        </strong>
                                                    </div>


                                                    <div>
                                                        <span>
                                                            Duration
                                                        </span>

                                                        <strong>
                                                            {
                                                                internship.duration ||
                                                                "Not specified"
                                                            }
                                                        </strong>
                                                    </div>


                                                    <div>
                                                        <span>
                                                            Stipend
                                                        </span>

                                                        <strong>
                                                            ₹
                                                            {
                                                                internship.stipend ||
                                                                0
                                                            }
                                                        </strong>
                                                    </div>

                                                </div>


                                                {/* SKILLS */}

                                                <div className="application-skills">

                                                    <div>

                                                        <span>
                                                            Matching Skills
                                                        </span>

                                                        <div className="skill-tags">

                                                            {(
                                                                application.matchingSkills ||
                                                                []
                                                            ).length > 0 ? (

                                                                application.matchingSkills.map(
                                                                    (
                                                                        skill,
                                                                        index
                                                                    ) => (

                                                                        <span
                                                                            className="skill-tag"
                                                                            key={
                                                                                index
                                                                            }
                                                                        >
                                                                            {typeof skill ===
                                                                            "string"
                                                                                ? skill
                                                                                : skill.name ||
                                                                                  skill.skill ||
                                                                                  "Skill"}
                                                                        </span>
                                                                    )
                                                                )

                                                            ) : (

                                                                <span className="muted-text">
                                                                    No matching skills
                                                                    recorded
                                                                </span>

                                                            )}

                                                        </div>

                                                    </div>


                                                    <div>

                                                        <span>
                                                            Missing Skills
                                                        </span>

                                                        <div className="skill-tags">

                                                            {(
                                                                application.missingSkills ||
                                                                []
                                                            ).length > 0 ? (

                                                                application.missingSkills.map(
                                                                    (
                                                                        skill,
                                                                        index
                                                                    ) => (

                                                                        <span
                                                                            className="skill-tag missing"
                                                                            key={
                                                                                index
                                                                            }
                                                                        >
                                                                            {typeof skill ===
                                                                            "string"
                                                                                ? skill
                                                                                : skill.name ||
                                                                                  skill.skill ||
                                                                                  "Skill"}
                                                                        </span>
                                                                    )
                                                                )

                                                            ) : (

                                                                <span className="muted-text">
                                                                    No missing
                                                                    skills
                                                                </span>

                                                            )}

                                                        </div>

                                                    </div>

                                                </div>


                                                {/* FOOTER */}

                                                <div className="application-card-footer">

                                                    <span>
                                                        Application ID:
                                                        {" "}
                                                        {
                                                            application._id ||
                                                            application.id
                                                        }
                                                    </span>

                                                    <span>
                                                        Applied
                                                    </span>

                                                </div>

                                            </div>
                                        );
                                    }
                                )}

                            </div>
                        )}

                </div>

            </main>

        </div>
    );
}

export default MyApplications;