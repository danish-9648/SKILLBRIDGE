import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import Sidebar from "../components/Sidebar";
import Topbar from "../components/Topbar";

import {
    getApplicationDetails,
    updateApplicationStatus
} from "../services/api";


// ============================================================
// INDUSTRY APPLICATION DETAILS
// ============================================================

function IndustryApplicationDetails() {

    const { applicationId } = useParams();

    const navigate = useNavigate();

    const [application, setApplication] =
        useState(null);

    const [studentProfile, setStudentProfile] =
        useState(null);

    const [loading, setLoading] =
        useState(true);

    const [error, setError] =
        useState("");

    const [updating, setUpdating] =
        useState(false);


    // ========================================================
    // LOAD APPLICATION
    // ========================================================

    useEffect(() => {

        loadApplication();

    }, [applicationId]);


    const loadApplication = async () => {

        try {

            setLoading(true);
            setError("");

            const response =
                await getApplicationDetails(
                    applicationId
                );

            console.log(
                "APPLICATION DETAILS:",
                response
            );

            setApplication(
                response.application || null
            );

            setStudentProfile(
                response.studentProfile || null
            );

        } catch (err) {

            console.error(
                "Application details error:",
                err
            );

            setError(
                err.message ||
                "Unable to load application"
            );

        } finally {

            setLoading(false);

        }

    };


    // ========================================================
    // UPDATE STATUS
    // ========================================================

    const handleStatusUpdate = async (status) => {

        try {

            setUpdating(true);

            const response =
                await updateApplicationStatus(
                    applicationId,
                    status
                );

            console.log(
                "STATUS UPDATED:",
                response
            );

            await loadApplication();

        } catch (err) {

            console.error(
                "Status update error:",
                err
            );

            alert(
                err.message ||
                "Unable to update application"
            );

        } finally {

            setUpdating(false);

        }

    };


    // ========================================================
    // LOADING
    // ========================================================

    if (loading) {

        return (

            <div className="app-shell">

                <Sidebar />

                <main className="main-content">

                    <Topbar />

                    <div className="page-container">

                        <div className="project-placeholder">

                            <strong>
                                Loading applicant...
                            </strong>

                            <p>
                                Fetching application details.
                            </p>

                        </div>

                    </div>

                </main>

            </div>

        );

    }


    // ========================================================
    // ERROR
    // ========================================================

    if (error || !application) {

        return (

            <div className="app-shell">

                <Sidebar />

                <main className="main-content">

                    <Topbar />

                    <div className="page-container">

                        <div className="project-placeholder">

                            <strong>
                                Application not found
                            </strong>

                            <p>
                                {error ||
                                    "The application could not be found."}
                            </p>

                            <button
                                className="secondary-button"
                                onClick={() =>
                                    navigate(
                                        "/industry/applications"
                                    )
                                }
                            >
                                Back to Applications
                            </button>

                        </div>

                    </div>

                </main>

            </div>

        );

    }


    // ========================================================
    // DATA
    // ========================================================

    const student =
        application.student || {};

    const internship =
        application.internship || {};

    const matchingSkills =
        application.matchingSkills || [];

    const missingSkills =
        application.missingSkills || [];

    const studentSkills =
        studentProfile?.skills || [];


    // ========================================================
    // PAGE
    // ========================================================

    return (

        <div className="app-shell">

            <Sidebar />

            <main className="main-content">

                <Topbar />

                <div className="page-container">


                    {/* ====================================================
                        BACK
                    ==================================================== */}

                    <button
                        className="secondary-button"
                        onClick={() =>
                            navigate(
                                "/industry/applications"
                            )
                        }
                    >
                        ← Back to Applications
                    </button>


                    {/* ====================================================
                        HEADER
                    ==================================================== */}

                    <div className="page-header">

                        <div>

                            <span className="panel-label">
                                CANDIDATE REVIEW
                            </span>

                            <h2>
                                {student.name ||
                                    "Student Applicant"}
                            </h2>

                            <p>
                                Application for{" "}
                                <strong>
                                    {internship.title ||
                                        "Internship"}
                                </strong>
                            </p>

                        </div>

                    </div>


                    {/* ====================================================
                        CANDIDATE OVERVIEW
                    ==================================================== */}

                    <div className="details-grid">


                        {/* -----------------------------------------------
                            STUDENT INFORMATION
                        ----------------------------------------------- */}

                        <div className="panel">

                            <div className="panel-header">

                                <div>

                                    <span className="panel-label">
                                        CANDIDATE
                                    </span>

                                    <h3>
                                        Student Information
                                    </h3>

                                </div>

                            </div>


                            <div className="candidate-profile">

                                <div className="candidate-avatar large">

                                    {student.name
                                        ? student.name
                                            .charAt(0)
                                            .toUpperCase()
                                        : "S"}

                                </div>


                                <div>

                                    <h3>
                                        {student.name ||
                                            "Student"}
                                    </h3>

                                    <p>
                                        {student.email ||
                                            "No email available"}
                                    </p>

                                    <p>
                                        Role:{" "}
                                        {student.role ||
                                            "STUDENT"}
                                    </p>

                                </div>

                            </div>


                            {studentProfile && (

                                <div className="profile-information">

                                    {studentProfile.location && (

                                        <div>

                                            <span>
                                                Location
                                            </span>

                                            <strong>
                                                {typeof studentProfile.location ===
                                                "string"
                                                    ? studentProfile.location
                                                    : `${studentProfile.location.city || ""}, ${studentProfile.location.state || ""}`}
                                            </strong>

                                        </div>

                                    )}


                                    {studentProfile.preferredDomains &&
                                        studentProfile.preferredDomains.length >
                                        0 && (

                                            <div>

                                                <span>
                                                    Preferred Domains
                                                </span>

                                                <strong>
                                                    {studentProfile.preferredDomains.join(
                                                        ", "
                                                    )}
                                                </strong>

                                            </div>

                                        )}

                                </div>

                            )}

                        </div>


                        {/* -----------------------------------------------
                            MATCH SCORE
                        ----------------------------------------------- */}

                        <div className="panel">

                            <div className="panel-header">

                                <div>

                                    <span className="panel-label">
                                        AI MATCHING
                                    </span>

                                    <h3>
                                        Candidate Fit
                                    </h3>

                                </div>

                            </div>


                            <div className="big-match-score">

                                <strong>
                                    {application.matchScore ??
                                        0}%
                                </strong>

                                <span>
                                    Skill Match
                                </span>

                            </div>


                            <div className="skill-summary">

                                <div>

                                    <span>
                                        Matching Skills
                                    </span>

                                    <strong>
                                        {matchingSkills.length}
                                    </strong>

                                </div>


                                <div>

                                    <span>
                                        Missing Skills
                                    </span>

                                    <strong>
                                        {missingSkills.length}
                                    </strong>

                                </div>

                            </div>

                        </div>

                    </div>


                    {/* ====================================================
                        SKILLS
                    ==================================================== */}

                    <div className="details-grid">


                        {/* -----------------------------------------------
                            MATCHING SKILLS
                        ----------------------------------------------- */}

                        <div className="panel">

                            <div className="panel-header">

                                <div>

                                    <span className="panel-label">
                                        SKILL MATCH
                                    </span>

                                    <h3>
                                        Matching Skills
                                    </h3>

                                </div>

                            </div>


                            {matchingSkills.length === 0 ? (

                                <p>
                                    No matching skills found.
                                </p>

                            ) : (

                                <div className="skill-tags">

                                    {matchingSkills.map(
                                        (skill, index) => (

                                            <span
                                                className="skill-tag success"
                                                key={index}
                                            >
                                                ✓{" "}
                                                {typeof skill ===
                                                "string"
                                                    ? skill
                                                    : skill.name ||
                                                      skill.skill ||
                                                      "Skill"}
                                            </span>

                                        )
                                    )}

                                </div>

                            )}

                        </div>


                        {/* -----------------------------------------------
                            MISSING SKILLS
                        ----------------------------------------------- */}

                        <div className="panel">

                            <div className="panel-header">

                                <div>

                                    <span className="panel-label">
                                        SKILL GAP
                                    </span>

                                    <h3>
                                        Missing Skills
                                    </h3>

                                </div>

                            </div>


                            {missingSkills.length === 0 ? (

                                <p>
                                    Excellent! No major skill gaps
                                    identified.
                                </p>

                            ) : (

                                <div className="skill-tags">

                                    {missingSkills.map(
                                        (skill, index) => (

                                            <span
                                                className="skill-tag warning"
                                                key={index}
                                            >
                                                +{" "}
                                                {typeof skill ===
                                                "string"
                                                    ? skill
                                                    : skill.name ||
                                                      skill.skill ||
                                                      "Skill"}
                                            </span>

                                        )
                                    )}

                                </div>

                            )}

                        </div>

                    </div>


                    {/* ====================================================
                        STUDENT SKILLS
                    ==================================================== */}

                    <div className="panel">

                        <div className="panel-header">

                            <div>

                                <span className="panel-label">
                                    STUDENT PROFILE
                                </span>

                                <h3>
                                    All Student Skills
                                </h3>

                            </div>

                        </div>


                        {studentSkills.length === 0 ? (

                            <p>
                                No skills have been added to
                                this student's profile.
                            </p>

                        ) : (

                            <div className="skill-list">

                                {studentSkills.map(
                                    (skill, index) => {

                                        const skillName =
                                            typeof skill ===
                                            "string"
                                                ? skill
                                                : skill.name ||
                                                  skill.skill ||
                                                  "Skill";

                                        const level =
                                            typeof skill ===
                                            "object"
                                                ? skill.level
                                                : null;

                                        const score =
                                            typeof skill ===
                                            "object"
                                                ? skill.score
                                                : null;

                                        return (

                                            <div
                                                className="skill-row"
                                                key={index}
                                            >

                                                <strong>
                                                    {skillName}
                                                </strong>

                                                {level && (

                                                    <span>
                                                        {level}
                                                    </span>

                                                )}

                                                {score !==
                                                    null &&
                                                    score !==
                                                    undefined && (

                                                        <span>
                                                            Score:{" "}
                                                            {score}
                                                        </span>

                                                    )}

                                            </div>

                                        );

                                    }
                                )}

                            </div>

                        )}

                    </div>


                    {/* ====================================================
                        INTERNSHIP
                    ==================================================== */}

                    <div className="panel">

                        <div className="panel-header">

                            <div>

                                <span className="panel-label">
                                    OPPORTUNITY
                                </span>

                                <h3>
                                    Internship Details
                                </h3>

                            </div>

                        </div>


                        <div className="internship-information">

                            <div>

                                <span>
                                    Position
                                </span>

                                <strong>
                                    {internship.title ||
                                        "Internship"}
                                </strong>

                            </div>


                            <div>

                                <span>
                                    Domain
                                </span>

                                <strong>
                                    {internship.domain ||
                                        "Not specified"}
                                </strong>

                            </div>


                            <div>

                                <span>
                                    Work Mode
                                </span>

                                <strong>
                                    {internship.workMode ||
                                        "Not specified"}
                                </strong>

                            </div>


                            <div>

                                <span>
                                    Duration
                                </span>

                                <strong>
                                    {internship.duration ||
                                        "Not specified"}
                                </strong>

                            </div>

                        </div>

                    </div>


                    {/* ====================================================
                        COVER LETTER
                    ==================================================== */}

                    <div className="panel">

                        <div className="panel-header">

                            <div>

                                <span className="panel-label">
                                    APPLICATION
                                </span>

                                <h3>
                                    Cover Letter
                                </h3>

                            </div>

                        </div>


                        <div className="cover-letter">

                            {application.coverLetter ? (

                                <p>
                                    {application.coverLetter}
                                </p>

                            ) : (

                                <p>
                                    No cover letter was submitted.
                                </p>

                            )}

                        </div>

                    </div>


                    {/* ====================================================
                        STATUS + ACTIONS
                    ==================================================== */}

                    <div className="panel">

                        <div className="panel-header">

                            <div>

                                <span className="panel-label">
                                    DECISION
                                </span>

                                <h3>
                                    Application Status
                                </h3>

                            </div>

                            <span className="application-status">

                                {application.status ||
                                    "APPLIED"}

                            </span>

                        </div>


                        <div className="application-actions large-actions">

                            {application.status !==
                                "UNDER_REVIEW" &&
                                application.status !==
                                "ACCEPTED" &&
                                application.status !==
                                "REJECTED" && (

                                    <button
                                        className="secondary-button"
                                        disabled={updating}
                                        onClick={() =>
                                            handleStatusUpdate(
                                                "UNDER_REVIEW"
                                            )
                                        }
                                    >
                                        Mark Under Review
                                    </button>

                                )}


                            {application.status !==
                                "SHORTLISTED" &&
                                application.status !==
                                "ACCEPTED" &&
                                application.status !==
                                "REJECTED" && (

                                    <button
                                        className="secondary-button"
                                        disabled={updating}
                                        onClick={() =>
                                            handleStatusUpdate(
                                                "SHORTLISTED"
                                            )
                                        }
                                    >
                                        Shortlist
                                    </button>

                                )}


                            {application.status ===
                                "SHORTLISTED" && (

                                    <button
                                        className="primary-button"
                                        disabled={updating}
                                        onClick={() =>
                                            handleStatusUpdate(
                                                "ACCEPTED"
                                            )
                                        }
                                    >
                                        Accept Candidate
                                    </button>

                                )}


                            {application.status !==
                                "REJECTED" &&
                                application.status !==
                                "ACCEPTED" && (

                                    <button
                                        className="danger-button"
                                        disabled={updating}
                                        onClick={() =>
                                            handleStatusUpdate(
                                                "REJECTED"
                                            )
                                        }
                                    >
                                        Reject Candidate
                                    </button>

                                )}

                        </div>

                    </div>

                </div>

            </main>

        </div>

    );

}


export default IndustryApplicationDetails;