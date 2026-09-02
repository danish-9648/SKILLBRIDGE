import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
ArrowLeft,
ArrowRight,
BriefcaseBusiness,
Building2,
CalendarDays,
CheckCircle2,
Clock3,
MapPin,
RefreshCw,
Search,
Sparkles,
Target,
XCircle,
} from "lucide-react";

import { getPlacementRecommendations } from "../services/api";

function PlacementRecommendations() {
const navigate = useNavigate();

const [internships, setInternships] = useState([]);
const [skillRecommendations, setSkillRecommendations] = useState([]);
const [loading, setLoading] = useState(true);
const [error, setError] = useState("");
const [searchTerm, setSearchTerm] = useState("");
const [selectedDomain, setSelectedDomain] = useState("ALL");

const loadRecommendations = async () => {
    try {
        setLoading(true);
        setError("");

        const response = await getPlacementRecommendations();

        const data =
            response?.data ||
            response ||
            {};

        setSkillRecommendations(
            Array.isArray(data?.recommendations)
                ? data.recommendations
                : []
        );

        setInternships(
            Array.isArray(data?.internships)
                ? data.internships
                : []
        );
    } catch (err) {
        console.error(
            "Placement recommendations error:",
            err
        );

        setError(
            err?.message ||
            "Unable to load placement recommendations."
        );
    } finally {
        setLoading(false);
    }
};

useEffect(() => {
    loadRecommendations();
}, []);

const domains = [
    "ALL",
    ...new Set(
        internships
            .map(
                (item) =>
                    item?.internship?.domain ||
                    item?.domain
            )
            .filter(Boolean)
    ),
];

const filteredInternships = internships.filter(
    (item) => {
        const internship =
            item?.internship ||
            item ||
            {};

        const title =
            internship?.title ||
            "";

        const domain =
            internship?.domain ||
            "";

        const company =
            internship?.industry?.name ||
            internship?.industry?.companyName ||
            "Company";

        const matchesSearch =
            title
                .toLowerCase()
                .includes(searchTerm.toLowerCase()) ||
            domain
                .toLowerCase()
                .includes(searchTerm.toLowerCase()) ||
            company
                .toLowerCase()
                .includes(searchTerm.toLowerCase());

        const matchesDomain =
            selectedDomain === "ALL" ||
            domain === selectedDomain;

        return (
            matchesSearch &&
            matchesDomain
        );
    }
);

if (loading) {
    return (
        <div className="page-container">
            <div className="dashboard-loading">
                <RefreshCw
                    size={30}
                    className="spin"
                />

                <h2>
                    Finding your best opportunities...
                </h2>

                <p>
                    SkillBridge is matching your skills
                    with available internships.
                </p>
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
                    Unable to load opportunities
                </h2>

                <p>{error}</p>

                <button
                    className="primary-button"
                    onClick={loadRecommendations}
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

        {/* BACK BUTTON */}

        <button
            className="back-button"
            onClick={() =>
                navigate("/student-dashboard")
            }
        >
            <ArrowLeft size={17} />
            Back to Dashboard
        </button>


        {/* HERO */}

        <section className="recommendations-hero">

            <div>

                <div className="hero-eyebrow">
                    <Sparkles size={15} />
                    AI-POWERED OPPORTUNITY MATCHING
                </div>

                <h1>
                    Opportunities
                    <span> Matched For You</span>
                </h1>

                <p>
                    SkillBridge analyzes your skills,
                    assessment performance and profile
                    to find opportunities that fit your
                    career goals.
                </p>

            </div>

            <div className="recommendation-hero-icon">
                <Target size={45} />
            </div>

        </section>


        {/* SEARCH */}

        <section className="recommendation-toolbar">

            <div className="recommendation-search">

                <Search size={19} />

                <input
                    type="text"
                    placeholder="Search internships, domains or companies..."
                    value={searchTerm}
                    onChange={(e) =>
                        setSearchTerm(
                            e.target.value
                        )
                    }
                />

            </div>


            <div className="domain-filters">

                {domains.map((domain) => (
                    <button
                        key={domain}
                        className={
                            selectedDomain === domain
                                ? "domain-filter active"
                                : "domain-filter"
                        }
                        onClick={() =>
                            setSelectedDomain(
                                domain
                            )
                        }
                    >
                        {domain === "ALL"
                            ? "All Opportunities"
                            : domain}
                    </button>
                ))}

            </div>

        </section>


        {/* SKILL RECOMMENDATIONS */}

        {skillRecommendations.length > 0 && (

            <section className="skill-recommendation-panel">

                <div className="section-heading">

                    <div>
                        <div className="section-eyebrow">
                            CAREER IMPROVEMENT
                        </div>

                        <h2>
                            Before You Apply
                        </h2>

                        <p>
                            Improve these areas to
                            increase your opportunity
                            match score.
                        </p>
                    </div>

                </div>

                <div className="skill-recommendation-list">

                    {skillRecommendations
                        .filter(
                            (item) =>
                                item?.type ===
                                "SKILL"
                        )
                        .slice(0, 4)
                        .map(
                            (item, index) => (
                                <div
                                    className="skill-recommendation"
                                    key={
                                        item?.skill ||
                                        index
                                    }
                                >

                                    <div className="skill-rec-icon">
                                        <Target
                                            size={18}
                                        />
                                    </div>

                                    <div>
                                        <strong>
                                            {item?.skill}
                                        </strong>

                                        <p>
                                            {item?.message}
                                        </p>
                                    </div>

                                    <span
                                        className={`priority-badge ${String(
                                            item?.priority ||
                                            ""
                                        ).toLowerCase()}`}
                                    >
                                        {item?.priority}
                                    </span>

                                </div>
                            )
                        )}

                </div>

            </section>
        )}


        {/* RESULTS HEADER */}

        <div className="recommendations-results-header">

            <div>
                <span className="section-eyebrow">
                    AVAILABLE OPPORTUNITIES
                </span>

                <h2>
                    {filteredInternships.length}{" "}
                    Opportunities Found
                </h2>
            </div>

            <button
                className="refresh-button"
                onClick={loadRecommendations}
            >
                <RefreshCw size={16} />
                Refresh
            </button>

        </div>


        {/* INTERNSHIPS */}

        {filteredInternships.length === 0 ? (

            <div className="empty-opportunities">

                <BriefcaseBusiness
                    size={40}
                />

                <h3>
                    No matching opportunities
                </h3>

                <p>
                    Try another search or improve
                    your skills to unlock more
                    opportunities.
                </p>

            </div>

        ) : (

            <div className="recommendation-grid">

                {filteredInternships.map(
                    (item, index) => {

                        const internship =
                            item?.internship ||
                            item ||
                            {};

                        const matchScore =
                            Number(
                                item?.matchScore ??
                                item?.score ??
                                internship?.matchScore ??
                                0
                            );

                        const matchedSkills =
                            Array.isArray(
                                item?.matchedSkills
                            )
                                ? item.matchedSkills
                                : [];

                        const missingSkills =
                            Array.isArray(
                                item?.missingSkills
                            )
                                ? item.missingSkills
                                : [];

                        const company =
                            internship?.industry
                                ?.name ||
                            internship?.industry
                                ?.companyName ||
                            "Industry Partner";

                        return (

                            <article
                                className="recommendation-card"
                                key={
                                    internship?._id ||
                                    item?._id ||
                                    index
                                }
                            >

                                {/* CARD TOP */}

                                <div className="recommendation-card-top">

                                    <div className="recommendation-company-icon">
                                        <Building2
                                            size={22}
                                        />
                                    </div>

                                    <div className="recommendation-match">

                                        <strong>
                                            {matchScore}%
                                        </strong>

                                        <span>
                                            Match
                                        </span>

                                    </div>

                                </div>


                                {/* TITLE */}

                                <h3>
                                    {internship?.title ||
                                        "Internship Opportunity"}
                                </h3>

                                <div className="recommendation-company">
                                    <Building2
                                        size={15}
                                    />
                                    {company}
                                </div>


                                {/* META */}

                                <div className="recommendation-meta">

                                    <span>
                                        <BriefcaseBusiness
                                            size={15}
                                        />
                                        {internship?.domain ||
                                            "Technology"}
                                    </span>

                                    <span>
                                        <MapPin
                                            size={15}
                                        />
                                        {internship?.workMode ||
                                            "Remote"}
                                    </span>

                                    {internship?.duration && (
                                        <span>
                                            <Clock3
                                                size={15}
                                            />
                                            {
                                                internship.duration
                                            }
                                        </span>
                                    )}

                                </div>


                                {/* DESCRIPTION */}

                                <p className="recommendation-description">

                                    {internship?.description ||
                                        "Explore this opportunity and see how your skills match the requirements."}

                                </p>


                                {/* SKILLS */}

                                <div className="recommendation-skills">

                                    {matchedSkills.length >
                                        0 && (

                                        <div>

                                            <span className="skill-label matched">
                                                <CheckCircle2
                                                    size={14}
                                                />
                                                Matched Skills
                                            </span>

                                            <div className="skill-chip-list">

                                                {matchedSkills
                                                    .slice(
                                                        0,
                                                        4
                                                    )
                                                    .map(
                                                        (
                                                            skill,
                                                            skillIndex
                                                        ) => (
                                                            <span
                                                                className="skill-chip matched"
                                                                key={
                                                                    skill?.name ||
                                                                    skillIndex
                                                                }
                                                            >
                                                                {skill?.name ||
                                                                    skill}
                                                            </span>
                                                        )
                                                    )}

                                            </div>

                                        </div>

                                    )}


                                    {missingSkills.length >
                                        0 && (

                                        <div>

                                            <span className="skill-label missing">
                                                <XCircle
                                                    size={14}
                                                />
                                                Skill Gaps
                                            </span>

                                            <div className="skill-chip-list">

                                                {missingSkills
                                                    .slice(
                                                        0,
                                                        4
                                                    )
                                                    .map(
                                                        (
                                                            skill,
                                                            skillIndex
                                                        ) => (
                                                            <span
                                                                className="skill-chip missing"
                                                                key={
                                                                    skill ||
                                                                    skillIndex
                                                                }
                                                            >
                                                                {skill}
                                                            </span>
                                                        )
                                                    )}

                                            </div>

                                        </div>

                                    )}

                                </div>


                                {/* DEADLINE */}

                                {internship?.applicationDeadline && (

                                    <div className="recommendation-deadline">

                                        <CalendarDays
                                            size={15}
                                        />

                                        Apply by{" "}
                                        {new Date(
                                            internship.applicationDeadline
                                        ).toLocaleDateString(
                                            "en-IN",
                                            {
                                                day: "numeric",
                                                month: "short",
                                                year: "numeric",
                                            }
                                        )}

                                    </div>

                                )}


                                {/* ACTIONS */}

                                <div className="recommendation-actions">

                                    <button
                                        className="secondary-card-button"
                                        onClick={() =>
                                            navigate(
                                                `/internships/${internship?._id}`
                                            )
                                        }
                                    >
                                        View Details
                                        <ArrowRight
                                            size={16}
                                        />
                                    </button>

                                    <button
                                        className="primary-card-button"
                                        onClick={() =>
                                            navigate(
                                                `/internships/${internship?._id}`
                                            )
                                        }
                                    >
                                        Apply Now
                                    </button>

                                </div>

                            </article>

                        );
                    }
                )}

            </div>

        )}

    </div>
);

}

export default PlacementRecommendations;