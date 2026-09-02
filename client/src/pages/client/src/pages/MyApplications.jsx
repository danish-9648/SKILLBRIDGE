import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
ArrowLeft,
BriefcaseBusiness,
Building2,
CalendarDays,
CheckCircle2,
Clock3,
FileText,
RefreshCw,
Send,
XCircle,
} from "lucide-react";

import { getMyApplications } from "../services/api";

function MyApplications() {
const navigate = useNavigate();


const [applications, setApplications] = useState([]);
const [loading, setLoading] = useState(true);
const [error, setError] = useState("");

const loadApplications = async () => {
    try {
        setLoading(true);
        setError("");

        const response =
            await getMyApplications();

        const data =
            response?.data ||
            response ||
            {};

        setApplications(
            Array.isArray(data?.applications)
                ? data.applications
                : Array.isArray(data)
                ? data
                : []
        );
    } catch (err) {
        console.error(
            "Applications loading error:",
            err
        );

        setError(
            err?.message ||
            "Unable to load applications."
        );
    } finally {
        setLoading(false);
    }
};

useEffect(() => {
    loadApplications();
}, []);

const getStatusClass = (status) => {
    const normalized =
        String(status || "")
            .toLowerCase();

    if (
        normalized === "accepted" ||
        normalized === "selected" ||
        normalized === "shortlisted"
    ) {
        return "status-success";
    }

    if (
        normalized === "rejected" ||
        normalized === "declined"
    ) {
        return "status-danger";
    }

    return "status-pending";
};

if (loading) {
    return (
        <div className="page-container">
            <div className="dashboard-loading">
                <RefreshCw
                    size={30}
                    className="spin"
                />

                <h2>
                    Loading your applications...
                </h2>
            </div>
        </div>
    );
}

if (error) {
    return (
        <div className="page-container">

            <div className="dashboard-error">

                <XCircle size={40} />

                <h2>
                    Unable to load applications
                </h2>

                <p>{error}</p>

                <button
                    className="primary-button"
                    onClick={loadApplications}
                >
                    <RefreshCw size={17} />
                    Try Again
                </button>

            </div>

        </div>
    );
}

return (
    <div className="page-container">

        <button
            className="back-button"
            onClick={() =>
                navigate(
                    "/placement-recommendations"
                )
            }
        >
            <ArrowLeft size={17} />
            Browse Opportunities
        </button>


        {/* HEADER */}

        <section className="recommendations-hero">

            <div>

                <div className="hero-eyebrow">
                    <Send size={15} />
                    APPLICATION TRACKER
                </div>

                <h1>
                    My
                    <span> Applications</span>
                </h1>

                <p>
                    Track every internship application
                    and monitor your progress with
                    industry partners.
                </p>

            </div>

            <div className="recommendation-hero-icon">
                <FileText size={45} />
            </div>

        </section>


        {/* STATS */}

        <section className="dashboard-stat-grid">

            <DashboardStat
                icon={<Send />}
                title="Total Applications"
                value={applications.length}
            />

            <DashboardStat
                icon={<Clock3 />}
                title="Pending"
                value={
                    applications.filter(
                        (item) =>
                            String(
                                item?.status ||
                                ""
                            ).toUpperCase() ===
                            "APPLIED"
                    ).length
                }
            />

            <DashboardStat
                icon={<CheckCircle2 />}
                title="Shortlisted"
                value={
                    applications.filter(
                        (item) =>
                            [
                                "SHORTLISTED",
                                "SELECTED",
                                "ACCEPTED",
                            ].includes(
                                String(
                                    item?.status ||
                                    ""
                                ).toUpperCase()
                            )
                    ).length
                }
            />

            <DashboardStat
                icon={<XCircle />}
                title="Rejected"
                value={
                    applications.filter(
                        (item) =>
                            [
                                "REJECTED",
                                "DECLINED",
                            ].includes(
                                String(
                                    item?.status ||
                                    ""
                                ).toUpperCase()
                            )
                    ).length
                }
            />

        </section>


        {/* APPLICATIONS */}

        {applications.length === 0 ? (

            <div className="empty-opportunities">

                <FileText size={40} />

                <h3>
                    No applications yet
                </h3>

                <p>
                    Explore matched internships and
                    submit your first application.
                </p>

                <button
                    className="primary-button"
                    onClick={() =>
                        navigate(
                            "/placement-recommendations"
                        )
                    }
                >
                    <BriefcaseBusiness
                        size={17}
                    />
                    Explore Opportunities
                </button>

            </div>

        ) : (

            <div className="applications-list">

                {applications.map(
                    (application, index) => {

                        const internship =
                            application?.internship ||
                            {};

                        const company =
                            internship?.industry
                                ?.name ||
                            internship?.industry
                                ?.companyName ||
                            application?.companyName ||
                            "Industry Partner";

                        const status =
                            application?.status ||
                            "APPLIED";

                        return (

                            <article
                                className="application-card"
                                key={
                                    application?._id ||
                                    index
                                }
                            >

                                <div className="application-company-icon">
                                    <Building2
                                        size={24}
                                    />
                                </div>


                                <div className="application-main">

                                    <h2>
                                        {
                                            internship?.title ||
                                            application?.internshipTitle ||
                                            "Internship Application"
                                        }
                                    </h2>

                                    <p className="application-company">
                                        <Building2
                                            size={14}
                                        />
                                        {company}
                                    </p>


                                    <div className="application-meta">

                                        <span>
                                            <BriefcaseBusiness
                                                size={14}
                                            />
                                            {
                                                internship?.domain ||
                                                "Technology"
                                            }
                                        </span>

                                        {application?.createdAt && (
                                            <span>
                                                <CalendarDays
                                                    size={14}
                                                />
                                                Applied{" "}
                                                {new Date(
                                                    application.createdAt
                                                ).toLocaleDateString(
                                                    "en-IN"
                                                )}
                                            </span>
                                        )}

                                    </div>

                                </div>


                                <div
                                    className={`application-status ${getStatusClass(
                                        status
                                    )}`}
                                >
                                    {status}
                                </div>


                                {internship?._id && (
                                    <button
                                        className="application-view-button"
                                        onClick={() =>
                                            navigate(
                                                `/internships/${internship._id}`
                                            )
                                        }
                                    >
                                        View
                                    </button>
                                )}

                            </article>

                        );
                    }
                )}

            </div>

        )}

    </div>
);


}

function DashboardStat({
icon,
title,
value,
}) {
return ( <div className="dashboard-stat">


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

        </div>

    </div>
);


}

export default MyApplications;
