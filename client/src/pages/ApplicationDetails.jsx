
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import Sidebar from "../components/Sidebar";
import Topbar from "../components/Topbar";

import {
    getApplicationDetails,
    updateApplicationStatus
} from "../services/api";

function ApplicationDetails() {
    const { applicationId } = useParams();
    const navigate = useNavigate();

    const [application, setApplication] = useState(null);
    const [studentProfile, setStudentProfile] = useState(null);

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const loadApplication = async () => {
        try {
            setLoading(true);
            setError("");

            if (!applicationId) {
                throw new Error("Application ID is missing");
            }

            console.log(
                "Loading application:",
                applicationId
            );

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
                "Unable to load application details"
            );

        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadApplication();
    }, [applicationId]);

    const changeStatus = async (status) => {
        try {
            if (!applicationId) {
                return;
            }

            await updateApplicationStatus(
                applicationId,
                status
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
        }
    };

    if (loading) {
        return (
            <div className="app-shell">

                <Sidebar />

                <main className="main-content">

                    <Topbar />

                    <div className="page-container">

                        <div className="project-placeholder">

                            <strong>
                                Loading application...
                            </strong>

                            <p>
                                Fetching applicant details.
                            </p>

                        </div>

                    </div>

                </main>

            </div>
        );
    }

    if (error) {
        return (
            <div className="app-shell">

                <Sidebar />

                <main className="main-content">

                    <Topbar />

                    <div className="page-container">

                        <div className="project-placeholder">

                            <strong>
                                Unable to load application
                            </strong>

                            <p>
                                {error}
                            </p>

                            <button
                                type="button"
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

    if (!application) {
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

                            <button
                                type="button"
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

    const student =
        application.student || {};

    const internship =
        application.internship || {};

    const matchingSkills =
        application.matchingSkills || [];

    const missingSkills =
        application.missingSkills || [];

    const profileSkills =
        studentProfile?.skills || [];

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
                                APPLICANT REVIEW
                            </span>

                            <h2>
                                {student.name ||
                                    "Student Application"}
                            </h2>

                            <p>
                                Review candidate profile,
                                skills and internship match.
                            </p>

                        </div>

                        <button
                            type="button"
                            className="secondary-button"
                            onClick={() =>
                                navigate(
                                    "/industry/applications"
                                )
                            }
                        >
                            ← Back
                        </button>

                    </div>


                    {/* CANDIDATE SUMMARY */}

                    <div className="stats-grid">

                        <div className="stat-card">

                            <span>
                                Match Score
                            </span>

                            <strong>
                                {application.matchScore ?? 0}%
                            </strong>

                        </div>

                        <div className="stat-card">

                            <span>
                                Application Status
                            </span>

                            <strong>
                                {application.status ||
                                    "APPLIED"}
                            </strong>

                        </div>

                        <div className="stat-card">

                            <span>
                                Matching Skills
                            </span>

                            <strong>
                                {matchingSkills.length}
                            </strong>

                        </div>

                        <div className="stat-card">

                            <span>
                                Missing Skills
                            </span>

                            <strong>
                                {missingSkills.length}
                            </strong>

                        </div>

                    </div>


                    {/* STUDENT */}

                    <div className="panel-card">

                        <span className="panel-label">
                            CANDIDATE
                        </span>

                        <h3>
                            {student.name ||
                                "Student"}
                        </h3>

                        <p>
                            {student.email ||
                                "Email unavailable"}
                        </p>

                        <p>
                            Role:{" "}
                            {student.role ||
                                "STUDENT"}
                        </p>

                    </div>


                    {/* INTERNSHIP */}

                    <div className="panel-card">

                        <span className="panel-label">
                            INTERNSHIP
                        </span>

                        <h3>
                            {internship.title ||
                                "Internship"}
                        </h3>

                        <p>
                            Domain:{" "}
                            {internship.domain ||
                                "Not specified"}
                        </p>

                        <p>
                            Work Mode:{" "}
                            {internship.workMode ||
                                "Not specified"}
                        </p>

                        <p>
                            Duration:{" "}
                            {internship.duration ||
                                "Not specified"}
                        </p>

                        <p>
                            Stipend:{" "}
                            {internship.stipend ||
                                "Not specified"}
                        </p>

                    </div>


                    {/* SKILL MATCH */}

                    <div className="panel-card">

                        <span className="panel-label">
                            SKILL ANALYSIS
                        </span>

                        <h3>
                            Skill Match
                        </h3>

                        <div className="skill-section">

                            <h4>
                                Matching Skills
                            </h4>

                            {matchingSkills.length >
                            0 ? (

                                <div className="skill-list">

                                    {matchingSkills.map(
                                        (skill, index) => (

                                            <span
                                                className="skill-tag"
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

                            ) : (

                                <p>
                                    No matching skills
                                    recorded.
                                </p>

                            )}

                            <h4>
                                Missing Skills
                            </h4>

                            {missingSkills.length >
                            0 ? (

                                <div className="skill-list">

                                    {missingSkills.map(
                                        (skill, index) => (

                                            <span
                                                className="skill-tag"
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

                            ) : (

                                <p>
                                    No missing skills.
                                </p>

                            )}

                        </div>

                    </div>


                    {/* STUDENT PROFILE */}

                    <div className="panel-card">

                        <span className="panel-label">
                            STUDENT PROFILE
                        </span>

                        <h3>
                            Profile Information
                        </h3>

                        {studentProfile ? (

                            <>

                                <p>
                                    Location:{" "}
                                    {studentProfile.location ||
                                        "Not specified"}
                                </p>

                                <p>
                                    Education:{" "}
                                    {studentProfile.education ||
                                        "Not specified"}
                                </p>

                                <p>
                                    Preferred Domains:{" "}
                                    {Array.isArray(
                                        studentProfile.preferredDomains
                                    )
                                        ? studentProfile.preferredDomains.join(
                                              ", "
                                          )
                                        : "Not specified"}
                                </p>

                                <h4>
                                    Student Skills
                                </h4>

                                {profileSkills.length >
                                0 ? (

                                    <div className="skill-list">

                                        {profileSkills.map(
                                            (skill, index) => (

                                                <span
                                                    className="skill-tag"
                                                    key={index}
                                                >
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

                                ) : (

                                    <p>
                                        No skills listed.
                                    </p>

                                )}

                            </>

                        ) : (

                            <p>
                                Student profile information
                                is not available.
                            </p>

                        )}

                    </div>


                    {/* COVER LETTER */}

                    <div className="panel-card">

                        <span className="panel-label">
                            COVER LETTER
                        </span>

                        <h3>
                            Candidate Message
                        </h3>

                        <p>
                            {application.coverLetter ||
                                "No cover letter submitted."}
                        </p>

                    </div>


                    {/* ACTIONS */}

                    <div className="panel-card">

                        <span className="panel-label">
                            APPLICATION DECISION
                        </span>

                        <h3>
                            Update Application
                        </h3>

                        <div className="button-row">

                            <button
                                type="button"
                                className="secondary-button"
                                onClick={() =>
                                    changeStatus(
                                        "UNDER_REVIEW"
                                    )
                                }
                            >
                                Mark Under Review
                            </button>

                            <button
                                type="button"
                                className="secondary-button"
                                onClick={() =>
                                    changeStatus(
                                        "SHORTLISTED"
                                    )
                                }
                            >
                                Shortlist
                            </button>

                            <button
                                type="button"
                                className="primary-button"
                                onClick={() =>
                                    changeStatus(
                                        "ACCEPTED"
                                    )
                                }
                            >
                                Accept
                            </button>

                            <button
                                type="button"
                                className="secondary-button"
                                onClick={() =>
                                    changeStatus(
                                        "REJECTED"
                                    )
                                }
                            >
                                Reject
                            </button>

                        </div>

                    </div>

                </div>

            </main>

        </div>
    );
}

export default ApplicationDetails;

