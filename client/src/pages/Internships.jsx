
import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

import {
    Search,
    BriefcaseBusiness,
    MapPin,
    Clock3,
    Sparkles,
    Filter,
    ArrowRight,
    RefreshCw,
    SlidersHorizontal,
} from "lucide-react";

import {
    getAllInternships,
    getRecommendedInternships,
} from "../services/api";

function Internships() {
    const navigate = useNavigate();

    const [internships, setInternships] = useState([]);
    const [recommendations, setRecommendations] = useState([]);

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const [search, setSearch] = useState("");
    const [domain, setDomain] = useState("ALL");
    const [workMode, setWorkMode] = useState("ALL");
    const [sortBy, setSortBy] = useState("MATCH");

    // ============================================================
    // LOAD INTERNSHIPS
    // ============================================================

    const loadInternships = async () => {
        try {
            setLoading(true);
            setError("");

            const [allResponse, recommendedResponse] =
                await Promise.all([
                    getAllInternships(),
                    getRecommendedInternships(),
                ]);

            const allData =
                allResponse?.data ||
                allResponse ||
                {};

            const recommendedData =
                recommendedResponse?.data ||
                recommendedResponse ||
                {};

            const allList = Array.isArray(allData)
                ? allData
                : Array.isArray(allData.internships)
                ? allData.internships
                : Array.isArray(allData.results)
                ? allData.results
                : [];

            const recommendedList = Array.isArray(
                recommendedData
            )
                ? recommendedData
                : Array.isArray(
                      recommendedData.recommendations
                  )
                ? recommendedData.recommendations
                : Array.isArray(
                      recommendedData.internships
                  )
                ? recommendedData.internships
                : [];

            setInternships(allList);
            setRecommendations(recommendedList);

            console.log(
                "ALL INTERNSHIPS:",
                allList
            );

            console.log(
                "RECOMMENDED INTERNSHIPS:",
                recommendedList
            );
        } catch (err) {
            console.error(
                "Internship loading error:",
                err
            );

            setError(
                err?.message ||
                    "Unable to load internships."
            );
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadInternships();
    }, []);

    // ============================================================
    // MATCH SCORE MAP
    // ============================================================

    const matchMap = useMemo(() => {
        const map = {};

        recommendations.forEach((item) => {
            const internship =
                item?.internship ||
                item ||
                {};

            const id =
                internship?._id ||
                item?._id;

            if (id) {
                map[id] = Number(
                    item?.matchScore ??
                        item?.score ??
                        internship?.matchScore ??
                        0
                );
            }
        });

        return map;
    }, [recommendations]);

    // ============================================================
    // DOMAINS
    // ============================================================

    const domains = useMemo(() => {
        const values = internships
            .map((internship) =>
                internship?.domain?.trim()
            )
            .filter(Boolean);

        return [
            "ALL",
            ...new Set(values),
        ];
    }, [internships]);

    // ============================================================
    // FILTER + SEARCH + SORT
    // ============================================================

    const filteredInternships = useMemo(() => {
        let result = [...internships];

        const searchValue =
            search.trim().toLowerCase();

        // Search
        if (searchValue) {
            result = result.filter(
                (internship) => {
                    const title =
                        internship?.title
                            ?.toLowerCase() || "";

                    const internshipDomain =
                        internship?.domain
                            ?.toLowerCase() || "";

                    const description =
                        internship?.description
                            ?.toLowerCase() || "";

                    const skills =
                        Array.isArray(
                            internship?.requiredSkills
                        )
                            ? internship.requiredSkills
                                  .join(" ")
                                  .toLowerCase()
                            : "";

                    return (
                        title.includes(
                            searchValue
                        ) ||
                        internshipDomain.includes(
                            searchValue
                        ) ||
                        description.includes(
                            searchValue
                        ) ||
                        skills.includes(
                            searchValue
                        )
                    );
                }
            );
        }

        // Domain
        if (domain !== "ALL") {
            result = result.filter(
                (internship) =>
                    internship?.domain ===
                    domain
            );
        }

        // Work mode
        if (workMode !== "ALL") {
            result = result.filter(
                (internship) =>
                    internship?.workMode ===
                    workMode
            );
        }

        // Best match
        if (sortBy === "MATCH") {
            result.sort(
                (a, b) =>
                    (matchMap[b?._id] || 0) -
                    (matchMap[a?._id] || 0)
            );
        }

        // Latest
        if (sortBy === "LATEST") {
            result.sort(
                (a, b) =>
                    new Date(
                        b?.createdAt || 0
                    ) -
                    new Date(
                        a?.createdAt || 0
                    )
            );
        }

        // A-Z
        if (sortBy === "TITLE") {
            result.sort((a, b) =>
                String(
                    a?.title || ""
                ).localeCompare(
                    String(
                        b?.title || ""
                    )
                )
            );
        }

        return result;
    }, [
        internships,
        search,
        domain,
        workMode,
        sortBy,
        matchMap,
    ]);

    // ============================================================
    // LOADING
    // ============================================================

    if (loading) {
        return (
            <div className="page-container">
                <div className="dashboard-loading">
                    <RefreshCw
                        size={30}
                        className="spin"
                    />

                    <h2>
                        Finding opportunities
                        for you...
                    </h2>

                    <p>
                        Matching your skills
                        with available
                        internships.
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
                <div className="dashboard-error">
                    <div className="alert-icon">
                        !
                    </div>

                    <h2>
                        Unable to load
                        internships
                    </h2>

                    <p>{error}</p>

                    <button
                        className="primary-button"
                        onClick={
                            loadInternships
                        }
                    >
                        <RefreshCw
                            size={17}
                        />
                        Try Again
                    </button>
                </div>
            </div>
        );
    }

    // ============================================================
    // MAIN UI
    // ============================================================

    return (
        <div className="page-container internship-page">

            {/* =====================================================
                HERO
            ===================================================== */}

            <section className="internship-hero">
                <div>
                    <div className="hero-eyebrow">
                        <Sparkles size={15} />
                        CAREER OPPORTUNITIES
                    </div>

                    <h1>
                        Find Your Next{" "}
                        <span>
                            Opportunity
                        </span>
                    </h1>

                    <p>
                        Discover internships
                        matched with your
                        skills, interests and
                        career goals.
                    </p>
                </div>

                <div className="internship-hero-stat">
                    <BriefcaseBusiness
                        size={24}
                    />

                    <strong>
                        {internships.length}
                    </strong>

                    <span>
                        Open Opportunities
                    </span>
                </div>
            </section>

            {/* =====================================================
                SEARCH + FILTERS
            ===================================================== */}

            <section className="internship-search-card">

                <div className="internship-search">
                    <Search size={20} />

                    <input
                        type="text"
                        placeholder="Search by role, skill or domain..."
                        value={search}
                        onChange={(e) =>
                            setSearch(
                                e.target.value
                            )
                        }
                    />
                </div>

                <div className="filter-control">
                    <Filter size={17} />

                    <select
                        value={domain}
                        onChange={(e) =>
                            setDomain(
                                e.target.value
                            )
                        }
                    >
                        {domains.map(
                            (item) => (
                                <option
                                    key={item}
                                    value={item}
                                >
                                    {item ===
                                    "ALL"
                                        ? "All Domains"
                                        : item}
                                </option>
                            )
                        )}
                    </select>
                </div>

                <div className="filter-control">
                    <MapPin size={17} />

                    <select
                        value={workMode}
                        onChange={(e) =>
                            setWorkMode(
                                e.target.value
                            )
                        }
                    >
                        <option value="ALL">
                            All Work Modes
                        </option>

                        <option value="REMOTE">
                            Remote
                        </option>

                        <option value="ONSITE">
                            Onsite
                        </option>

                        <option value="HYBRID">
                            Hybrid
                        </option>
                    </select>
                </div>

                <div className="filter-control">
                    <SlidersHorizontal
                        size={17}
                    />

                    <select
                        value={sortBy}
                        onChange={(e) =>
                            setSortBy(
                                e.target.value
                            )
                        }
                    >
                        <option value="MATCH">
                            Best Match
                        </option>

                        <option value="LATEST">
                            Latest
                        </option>

                        <option value="TITLE">
                            A-Z
                        </option>
                    </select>
                </div>
            </section>

            {/* =====================================================
                RESULTS HEADER
            ===================================================== */}

            <section className="internship-results-header">
                <span>
                    {filteredInternships.length}{" "}
                    opportunities found
                </span>
            </section>

            {/* =====================================================
                EMPTY STATE
            ===================================================== */}

            {filteredInternships.length ===
            0 ? (
                <div className="empty-opportunities">
                    <BriefcaseBusiness
                        size={34}
                    />

                    <h3>
                        No internships found
                    </h3>

                    <p>
                        Try changing your
                        search or filters.
                    </p>
                </div>
            ) : (

                /* =================================================
                   INTERNSHIP GRID
                ================================================= */

                <section className="internship-grid">

                    {filteredInternships.map(
                        (internship) => {
                            const id =
                                internship?._id;

                            const matchScore =
                                Number(
                                    matchMap[id] ||
                                        0
                                );

                            const isClosed =
                                internship?.status ===
                                "CLOSED";

                            return (
                                <article
                                    className="internship-card"
                                    key={id}
                                >

                                    {/* Featured */}
                                    {internship?.featured && (
                                        <div className="featured-badge">
                                            <Sparkles
                                                size={
                                                    13
                                                }
                                            />
                                            Featured
                                        </div>
                                    )}

                                    {/* Card Top */}
                                    <div className="internship-card-top">

                                        <div className="internship-company-icon">
                                            <BriefcaseBusiness
                                                size={
                                                    23
                                                }
                                            />
                                        </div>

                                        {matchScore >
                                            0 && (
                                            <div className="match-pill">
                                                <strong>
                                                    {
                                                        matchScore
                                                    }
                                                    %
                                                </strong>

                                                <span>
                                                    Match
                                                </span>
                                            </div>
                                        )}
                                    </div>

                                    {/* Content */}
                                    <div className="internship-card-content">

                                        <h2>
                                            {internship?.title ||
                                                "Internship Opportunity"}
                                        </h2>

                                        <div className="internship-domain">
                                            {internship?.domain ||
                                                "Technology"}
                                        </div>

                                        <p>
                                            {internship?.description
                                                ? internship.description
                                                      .length >
                                                  125
                                                    ? `${internship.description.slice(
                                                          0,
                                                          125
                                                      )}...`
                                                    : internship.description
                                                : "Explore this opportunity and build real-world industry experience."}
                                        </p>

                                        {/* Meta */}
                                        <div className="internship-meta">

                                            <span>
                                                <MapPin
                                                    size={
                                                        15
                                                    }
                                                />

                                                {internship?.workMode ||
                                                    "REMOTE"}
                                            </span>

                                            <span>
                                                <Clock3
                                                    size={
                                                        15
                                                    }
                                                />

                                                {internship?.duration ||
                                                    "Flexible"}
                                            </span>
                                        </div>

                                        {/* Skills */}
                                        <div className="required-skills">

                                            {(
                                                internship?.requiredSkills ||
                                                []
                                            )
                                                .slice(
                                                    0,
                                                    4
                                                )
                                                .map(
                                                    (
                                                        skill
                                                    ) => (
                                                        <span
                                                            key={
                                                                skill
                                                            }
                                                        >
                                                            {
                                                                skill
                                                            }
                                                        </span>
                                                    )
                                                )}

                                            {(
                                                internship?.requiredSkills ||
                                                []
                                            ).length >
                                                4 && (
                                                <span>
                                                    +
                                                    {internship
                                                        .requiredSkills
                                                        .length -
                                                        4}
                                                </span>
                                            )}
                                        </div>
                                    </div>

                                    {/* Footer */}
                                    <div className="internship-card-footer">

                                        <div>
                                            <small>
                                                Stipend
                                            </small>

                                            <strong>
                                                {internship?.stipend ||
                                                    "Not specified"}
                                            </strong>
                                        </div>

                                        {/* Actions */}
                                        <div
                                            style={{
                                                display:
                                                    "flex",
                                                gap:
                                                    "8px",
                                                alignItems:
                                                    "center",
                                            }}
                                        >

                                            <button
                                                onClick={() =>
                                                    navigate(
                                                        `/internships/${id}`
                                                    )
                                                }
                                            >
                                                View Details
                                                <ArrowRight
                                                    size={
                                                        16
                                                    }
                                                />
                                            </button>

                                            <button
                                                disabled={
                                                    isClosed
                                                }
                                                onClick={() =>
                                                    navigate(
                                                        `/internships/${id}?apply=true`
                                                    )
                                                }
                                                style={{
                                                    opacity:
                                                        isClosed
                                                            ? 0.5
                                                            : 1,
                                                    cursor:
                                                        isClosed
                                                            ? "not-allowed"
                                                            : "pointer",
                                                }}
                                            >
                                                {isClosed
                                                    ? "Closed"
                                                    : "Apply Now"}
                                            </button>

                                        </div>
                                    </div>
                                </article>
                            );
                        }
                    )}
                </section>
            )}
        </div>
    );
}

export default Internships;

