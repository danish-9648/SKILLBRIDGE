import { useEffect, useState } from "react";
import {
useNavigate,
useParams,
} from "react-router-dom";

import {
ArrowLeft,
ArrowRight,
BriefcaseBusiness,
Building2,
CalendarDays,
CheckCircle2,
Clock3,
MapPin,
Send,
Sparkles,
Target,
XCircle,
} from "lucide-react";

import {
getInternshipDetails,
applyForInternship,
} from "../services/api";

function InternshipDetails() {


const navigate = useNavigate();

const { internshipId } = useParams();


/* ============================================================
   STATE
============================================================ */

const [internship, setInternship] =
    useState(null);

const [matchScore, setMatchScore] =
    useState(0);

const [matchedSkills, setMatchedSkills] =
    useState([]);

const [missingSkills, setMissingSkills] =
    useState([]);

const [coverLetter, setCoverLetter] =
    useState("");

const [loading, setLoading] =
    useState(true);

const [applying, setApplying] =
    useState(false);

const [error, setError] =
    useState("");

const [success, setSuccess] =
    useState("");


/* ============================================================
   LOAD INTERNSHIP
============================================================ */

const loadInternship = async () => {

    try {

        setLoading(true);
        setError("");

        const response =
            await getInternshipDetails(
                internshipId
            );

        const data =
            response?.data ||
            response ||
            {};

        const internshipData =
            data?.internship ||
            data?.result?.internship ||
            data?.result ||
            data;


        setInternship(
            internshipData
        );


        const score =
            data?.matchScore ??
            data?.result?.matchScore ??
            internshipData?.matchScore ??
            0;

        setMatchScore(
            Number(score)
        );


        setMatchedSkills(
            Array.isArray(
                data?.matchedSkills
            )
                ? data.matchedSkills
                : Array.isArray(
                      data?.result
                          ?.matchedSkills
                  )
                ? data.result.matchedSkills
                : []
        );


        setMissingSkills(
            Array.isArray(
                data?.missingSkills
            )
                ? data.missingSkills
                : Array.isArray(
                      data?.result
                          ?.missingSkills
                  )
                ? data.result.missingSkills
                : []
        );

    } catch (err) {

        console.error(
            "Internship details error:",
            err
        );

        setError(
            err?.message ||
                "Unable to load internship details."
        );

    } finally {

        setLoading(false);

    }
};


useEffect(() => {

    if (internshipId) {
        loadInternship();
    }

}, [internshipId]);


/* ============================================================
   APPLY
============================================================ */

const handleApply = async (event) => {

    event.preventDefault();

    try {

        setApplying(true);
        setError("");
        setSuccess("");


        const response =
            await applyForInternship(
                internshipId,
                coverLetter.trim()
            );


        setSuccess(
            response?.message ||
                response?.data?.message ||
                "Application submitted successfully!"
        );


        setCoverLetter("");

    } catch (err) {

        console.error(
            "Application error:",
            err
        );

        setError(
            err?.message ||
                "Unable to submit application."
        );

    } finally {

        setApplying(false);

    }
};


/* ============================================================
   LOADING
============================================================ */

if (loading) {

    return (
        <div className="page-container">

            <div className="dashboard-loading">

                <Target
                    size={32}
                    className="spin"
                />

                <h2>
                    Loading opportunity...
                </h2>

                <p>
                    Preparing the internship
                    details for you.
                </p>

            </div>

        </div>
    );
}


/* ============================================================
   ERROR
============================================================ */

if (error && !internship) {

    return (
        <div className="page-container">

            <div className="dashboard-error">

                <XCircle size={40} />

                <h2>
                    Unable to load opportunity
                </h2>

                <p>
                    {error}
                </p>

                <button
                    className="primary-button"
                    onClick={() =>
                        navigate(
                            "/internships"
                        )
                    }
                >
                    <ArrowLeft size={17} />

                    Back to Internships
                </button>

            </div>

        </div>
    );
}


if (!internship) {
    return null;
}


/* ============================================================
   DATA
============================================================ */

const company =
    internship?.industry?.name ||
    internship?.industry?.companyName ||
    internship?.industry?.company ||
    "Industry Partner";


const skills =
    Array.isArray(
        internship?.requiredSkills
    )
        ? internship.requiredSkills
        : [];


const isClosed =
    internship?.status === "CLOSED";


/* ============================================================
   UI
============================================================ */

return (

    <div className="page-container">


        {/* ====================================================
            BACK BUTTON
        ==================================================== */}

        <button
            className="back-button"
            onClick={() =>
                navigate(
                    "/internships"
                )
            }
        >
            <ArrowLeft size={17} />

            Back to Internships
        </button>


        {/* ====================================================
            HERO
        ==================================================== */}

        <section className="internship-detail-hero">

            <div className="internship-detail-heading">

                <div className="recommendation-company-icon large">
                    <Building2 size={28} />
                </div>


                <div>

                    <div className="hero-eyebrow">

                        <Sparkles size={14} />

                        MATCHED OPPORTUNITY

                    </div>


                    <h1>
                        {internship.title ||
                            "Internship Opportunity"}
                    </h1>


                    <p className="company-name">

                        <Building2 size={16} />

                        {company}

                    </p>

                </div>

            </div>


            <div className="detail-match-card">

                <Target size={22} />

                <strong>
                    {matchScore}%
                </strong>

                <span>
                    Skill Match
                </span>

            </div>

        </section>


        {/* ====================================================
            MAIN GRID
        ==================================================== */}

        <div className="internship-detail-grid">


            {/* =================================================
                LEFT CONTENT
            ================================================= */}

            <main>


                {/* ABOUT ROLE */}

                <section className="dashboard-card">

                    <div className="section-heading">

                        <div>

                            <div className="section-eyebrow">
                                ABOUT THE ROLE
                            </div>

                            <h2>
                                Internship Overview
                            </h2>

                        </div>

                    </div>


                    <p className="detail-description">

                        {internship.description ||
                            "No description provided."}

                    </p>

                </section>


                {/* REQUIRED SKILLS */}

                <section className="dashboard-card">

                    <div className="dashboard-card-header">

                        <div className="dashboard-card-icon purple">

                            <BriefcaseBusiness
                                size={22}
                            />

                        </div>


                        <div>

                            <h2>
                                Required Skills
                            </h2>

                            <p>
                                Skills expected
                                for this
                                opportunity.
                            </p>

                        </div>

                    </div>


                    <div className="required-skill-list">

                        {skills.length === 0 ? (

                            <p>
                                No specific skills
                                listed.
                            </p>

                        ) : (

                            skills.map(
                                (
                                    skill,
                                    index
                                ) => {

                                    const matched =
                                        matchedSkills.some(
                                            (item) =>
                                                String(
                                                    item?.name ||
                                                        item
                                                ).toLowerCase() ===
                                                String(
                                                    skill
                                                ).toLowerCase()
                                        );


                                    return (

                                        <div
                                            className={
                                                matched
                                                    ? "required-skill matched"
                                                    : "required-skill"
                                            }
                                            key={`${skill}-${index}`}
                                        >

                                            {matched ? (

                                                <CheckCircle2
                                                    size={
                                                        17
                                                    }
                                                />

                                            ) : (

                                                <XCircle
                                                    size={
                                                        17
                                                    }
                                                />

                                            )}

                                            <span>
                                                {skill}
                                            </span>

                                        </div>

                                    );

                                }
                            )

                        )}

                    </div>

                </section>


                {/* MATCH ANALYSIS */}

                <section className="dashboard-card">

                    <div className="dashboard-card-header">

                        <div className="dashboard-card-icon blue">

                            <Target size={22} />

                        </div>


                        <div>

                            <h2>
                                Your Match Analysis
                            </h2>

                            <p>
                                Understand why this
                                opportunity was
                                recommended.
                            </p>

                        </div>

                    </div>


                    {matchedSkills.length > 0 && (

                        <div className="match-analysis-section">

                            <h3>

                                <CheckCircle2
                                    size={17}
                                />

                                Skills You Have

                            </h3>


                            <div className="skill-chip-list">

                                {matchedSkills.map(
                                    (
                                        skill,
                                        index
                                    ) => (

                                        <span
                                            className="skill-chip matched"
                                            key={index}
                                        >
                                            {skill?.name ||
                                                skill}
                                        </span>

                                    )
                                )}

                            </div>

                        </div>

                    )}


                    {missingSkills.length > 0 && (

                        <div className="match-analysis-section">

                            <h3>

                                <XCircle
                                    size={17}
                                />

                                Skills To Improve

                            </h3>


                            <div className="skill-chip-list">

                                {missingSkills.map(
                                    (
                                        skill,
                                        index
                                    ) => (

                                        <span
                                            className="skill-chip missing"
                                            key={index}
                                        >
                                            {skill}
                                        </span>

                                    )
                                )}

                            </div>

                        </div>

                    )}


                    {matchedSkills.length === 0 &&
                        missingSkills.length === 0 && (

                            <p>
                                Complete your skill
                                assessment to get a
                                more detailed match
                                analysis.
                            </p>

                        )}

                </section>

            </main>


            {/* =================================================
                RIGHT SIDEBAR
            ================================================= */}

            <aside>


                {/* OPPORTUNITY DETAILS */}

                <section className="dashboard-card internship-info-card">

                    <h2>
                        Opportunity Details
                    </h2>


                    <DetailItem
                        icon={
                            <BriefcaseBusiness />
                        }
                        label="Domain"
                        value={
                            internship.domain ||
                            "Technology"
                        }
                    />


                    <DetailItem
                        icon={<Target />}
                        label="Type"
                        value={
                            internship.internshipType ||
                            "INTERNSHIP"
                        }
                    />


                    <DetailItem
                        icon={<MapPin />}
                        label="Work Mode"
                        value={
                            internship.workMode ||
                            "REMOTE"
                        }
                    />


                    <DetailItem
                        icon={<MapPin />}
                        label="Location"
                        value={
                            internship.location ||
                            "Not specified"
                        }
                    />


                    <DetailItem
                        icon={<Clock3 />}
                        label="Duration"
                        value={
                            internship.duration ||
                            "Not specified"
                        }
                    />


                    <DetailItem
                        icon={<Sparkles />}
                        label="Stipend"
                        value={
                            internship.stipend ||
                            "Not specified"
                        }
                    />


                    {internship.applicationDeadline && (

                        <DetailItem
                            icon={
                                <CalendarDays />
                            }
                            label="Apply By"
                            value={new Date(
                                internship.applicationDeadline
                            ).toLocaleDateString(
                                "en-IN",
                                {
                                    day: "numeric",
                                    month: "short",
                                    year: "numeric",
                                }
                            )}
                        />

                    )}

                </section>


                {/* =================================================
                    APPLY CARD
                ================================================= */}

                <section className="dashboard-card apply-card">

                    <div className="dashboard-card-header">

                        <div className="dashboard-card-icon green">

                            <Send size={21} />

                        </div>


                        <div>

                            <h2>
                                Apply Now
                            </h2>

                            <p>
                                Send your application
                                to the industry
                                partner.
                            </p>

                        </div>

                    </div>


                    {/* SUCCESS */}

                    {success && (

                        <div className="application-success">

                            <CheckCircle2
                                size={18}
                            />

                            {success}

                        </div>

                    )}


                    {/* ERROR */}

                    {error && internship && (

                        <div className="application-error">

                            <XCircle
                                size={18}
                            />

                            {error}

                        </div>

                    )}


                    {isClosed ? (

                        <div className="application-error">

                            <XCircle size={18} />

                            This internship is
                            currently closed.

                        </div>

                    ) : (

                        <form
                            onSubmit={handleApply}
                        >

                            <label>
                                Cover Letter
                            </label>


                            <textarea
                                value={
                                    coverLetter
                                }
                                onChange={(event) =>
                                    setCoverLetter(
                                        event.target
                                            .value
                                    )
                                }
                                placeholder="Tell the company why you are interested in this opportunity..."
                                rows={7}
                            />


                            <small>
                                A strong cover letter
                                can improve your
                                application.
                            </small>


                            <button
                                type="submit"
                                className="primary-card-button apply-submit"
                                disabled={
                                    applying
                                }
                            >

                                {applying ? (

                                    <>
                                        <Target
                                            size={17}
                                            className="spin"
                                        />

                                        Submitting...
                                    </>

                                ) : (

                                    <>
                                        <Send
                                            size={17}
                                        />

                                        Submit Application
                                    </>

                                )}

                            </button>

                        </form>

                    )}


                    {/* MY APPLICATIONS */}

                    <button
                        className="applications-link"
                        onClick={() =>
                            navigate(
                                "/my-applications"
                            )
                        }
                    >

                        View My Applications

                        <ArrowRight
                            size={16}
                        />

                    </button>

                </section>

            </aside>

        </div>

    </div>
);
```

}

/* ================================================================
DETAIL ITEM
================================================================ */

function DetailItem({
icon,
label,
value,
}) {

```
return (

    <div className="detail-item">

        <div className="detail-item-icon">
            {icon}
        </div>


        <div>

            <span>
                {label}
            </span>

            <strong>
                {value}
            </strong>

        </div>

    </div>
);


}

export default InternshipDetails;
