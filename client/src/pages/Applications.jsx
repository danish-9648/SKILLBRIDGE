import { useEffect, useState } from "react";
import {
    BriefcaseBusiness,
    MapPin,
    CalendarDays,
    CheckCircle2,
    Clock3,
    XCircle,
    Loader2
} from "lucide-react";

import Sidebar from "../components/Sidebar";
import Topbar from "../components/Topbar";
import { getMyApplications } from "../services/api";

function Applications() {
    const [applications, setApplications] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        loadApplications();
    }, []);

    const loadApplications = async () => {
        try {
            setLoading(true);
            setError("");

            const response = await getMyApplications();

            console.log(
                "MY APPLICATIONS:",
                response
            );

            setApplications(
                response.applications || []
            );

        } catch (err) {
            console.error(
                "Applications Error:",
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

    const getStatusIcon = (status) => {
        switch (status) {
            case "ACCEPTED":
                return <CheckCircle2 size={16} />;

            case "REJECTED":
                return <XCircle size={16} />;

            case "UNDER_REVIEW":
            case "SHORTLISTED":
                return <Clock3 size={16} />;

            default:
                return <Clock3 size={16} />;
        }
    };

    const getStatusClass = (status) => {
        switch (status) {
            case "ACCEPTED":
                return "status-success";

            case "REJECTED":
                return "status-danger";

            case "SHORTLISTED":
                return "status-primary";

            case "UNDER_REVIEW":
                return "status-warning";

            default:
                return "status-neutral";
        }
    };

    return (
        <div className="app-shell">

            <Sidebar />

            <main className="main-content">

                <Topbar />

                <div className="page-container">

                    <div className="page-header">

                        <div>

                            <span className="panel-label">
                                APPLICATION TRACKER
                            </span>

                            <h2>
                                My Applications
                            </h2>

                            <p>
                                Track the internships you have
                                applied for and monitor their status.
                            </p>

                        </div>

                    </div>


                    {/* LOADING */}

                    {loading && (

                        <div className="empty-state">

                            <Loader2
                                size={32}
                                className="loading-spinner"
                            />

                            <h3>
                                Loading applications...
                            </h3>

                            <p>
                                Fetching your internship applications.
                            </p>

                        </div>

                    )}


                    {/* ERROR */}

                    {!loading && error && (

                        <div className="empty-state">

                            <XCircle size={36} />

                            <h3>
                                Unable to load applications
                            </h3>

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


                    {/* NO APPLICATIONS */}

                    {!loading &&
                        !error &&
                        applications.length === 0 && (

                            <div className="empty-state">

                                <BriefcaseBusiness
                                    size={42}
                                />

                                <h3>
                                    No applications yet
                                </h3>

                                <p>
                                    Apply for an internship from
                                    the opportunity marketplace.
                                </p>

                            </div>

                        )}


                    {/* APPLICATION LIST */}

                    {!loading &&
                        !error &&
                        applications.length > 0 && (

                            <div className="applications-list">

                                {applications.map(
                                    (application) => {

                                        const internship =
                                            application.internship || {};

                                        return (

                                            <div
                                                className="application-card"
                                                key={application._id}
                                            >

                                                {/* HEADER */}

                                                <div className="application-header">

                                                    <div className="application-company-icon">

                                                        <BriefcaseBusiness
                                                            size={22}
                                                        />

                                                    </div>

                                                    <div className="application-title">

                                                        <span className="panel-label">
                                                            {internship.domain ||
                                                                "INTERNSHIP"}
                                                        </span>

                                                        <h3>
                                                            {internship.title ||
                                                                "Internship"}
                                                        </h3>

                                                        <p>
                                                            {internship.industry?.name ||
                                                                "Industry Partner"}
                                                        </p>

                                                    </div>

                                                    <div
                                                        className={`application-status ${getStatusClass(
                                                            application.status
                                                        )}`}
                                                    >
                                                        {getStatusIcon(
                                                            application.status
                                                        )}

                                                        {String(
                                                            application.status ||
                                                            "APPLIED"
                                                        ).replace(
                                                            "_",
                                                            " "
                                                        )}
                                                    </div>

                                                </div>


                                                {/* DETAILS */}

                                                <div className="application-details">

                                                    <span>
                                                        <MapPin
                                                            size={16}
                                                        />

                                                        {internship.location?.city ||
                                                            "Location not specified"}
                                                    </span>

                                                    <span>
                                                        <CalendarDays
                                                            size={16}
                                                        />

                                                        {internship.duration ||
                                                            "Duration not specified"}
                                                    </span>

                                                    <span>
                                                        ₹
                                                        {internship.stipend ||
                                                            0}
                                                        /month
                                                    </span>

                                                </div>


                                                {/* MATCH */}

                                                <div className="application-match">

                                                    <div>

                                                        <strong>
                                                            {application.matchScore ??
                                                                0}%
                                                        </strong>

                                                        <span>
                                                            Skill Match
                                                        </span>

                                                    </div>

                                                    <div className="match-progress">

                                                        <div
                                                            className="match-progress-fill"
                                                            style={{
                                                                width: `${Math.min(
                                                                    100,
                                                                    application.matchScore ||
                                                                        0
                                                                )}%`
                                                            }}
                                                        />

                                                    </div>

                                                </div>


                                                {/* SKILLS */}

                                                <div className="application-skills">

                                                    <div>

                                                        <strong>
                                                            Matching Skills
                                                        </strong>

                                                        <div className="skill-tags">

                                                            {(
                                                                application.matchingSkills ||
                                                                []
                                                            ).map(
                                                                (
                                                                    skill,
                                                                    index
                                                                ) => (

                                                                    <span
                                                                        key={
                                                                            index
                                                                        }
                                                                    >
                                                                        {typeof skill ===
                                                                        "string"
                                                                            ? skill
                                                                            : skill.skill}
                                                                    </span>

                                                                )
                                                            )}

                                                            {(
                                                                application.matchingSkills ||
                                                                []
                                                            ).length ===
                                                                0 && (

                                                                <small>
                                                                    No matching
                                                                    skills recorded
                                                                </small>

                                                            )}

                                                        </div>

                                                    </div>


                                                    <div>

                                                        <strong>
                                                            Missing Skills
                                                        </strong>

                                                        <div className="skill-tags">

                                                            {(
                                                                application.missingSkills ||
                                                                []
                                                            ).map(
                                                                (
                                                                    skill,
                                                                    index
                                                                ) => (

                                                                    <span
                                                                        key={
                                                                            index
                                                                        }
                                                                    >
                                                                        {typeof skill ===
                                                                        "string"
                                                                            ? skill
                                                                            : skill.skill}
                                                                    </span>

                                                                )
                                                            )}

                                                            {(
                                                                application.missingSkills ||
                                                                []
                                                            ).length ===
                                                                0 && (

                                                                <small>
                                                                    No skill gaps
                                                                    identified
                                                                </small>

                                                            )}

                                                        </div>

                                                    </div>

                                                </div>


                                                {/* FOOTER */}

                                                <div className="application-footer">

                                                    <span>
                                                        Applied on{" "}
                                                        {application.createdAt
                                                            ? new Date(
                                                                  application.createdAt
                                                              ).toLocaleDateString(
                                                                  "en-IN",
                                                                  {
                                                                      day: "2-digit",
                                                                      month: "short",
                                                                      year: "numeric"
                                                                  }
                                                              )
                                                            : "N/A"}
                                                    </span>

                                                    <span>
                                                        {internship.openings ||
                                                            0}{" "}
                                                        openings
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

export default Applications;