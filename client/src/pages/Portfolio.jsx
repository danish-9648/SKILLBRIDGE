import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import {
    UserRound,
    Code2,
    ExternalLink,
    Plus,
    MapPin,
    GraduationCap,
    Award,
    Briefcase,
    Loader2
} from "lucide-react";

import Sidebar from "../components/Sidebar";
import Topbar from "../components/Topbar";

function Portfolio() {
    const navigate = useNavigate();
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    // ========================================
    // LOAD STUDENT PROFILE
    // ========================================

    useEffect(() => {

        const fetchProfile = async () => {

            try {

                const token =
                    localStorage.getItem("token");

                if (!token) {
                    setError("Please login again.");
                    setLoading(false);
                    return;
                }

                const response = await fetch(
                    "http://localhost:5000/api/students/profile",
                    {
                        method: "GET",

                        headers: {
                            Authorization:
                                `Bearer ${token}`
                        }
                    }
                );

                const data = await response.json();

                console.log(
                    "PORTFOLIO PROFILE:",
                    data
                );

                if (!response.ok || !data.success) {

                    throw new Error(
                        data.message ||
                        "Unable to load profile"
                    );

                }

                setProfile(data.profile);

            } catch (err) {

                console.error(
                    "Portfolio Error:",
                    err
                );

                setError(
                    err.message ||
                    "Unable to load portfolio"
                );

            } finally {

                setLoading(false);

            }

        };

        fetchProfile();

    }, []);


    // ========================================
    // LOADING
    // ========================================

    if (loading) {

        return (
            <div className="app-shell">

                <Sidebar />

                <main className="main-content">

                    <Topbar />

                    <div className="page-container">

                        <div className="portfolio-loading">

                            <Loader2
                                size={32}
                                className="loading-spinner"
                            />

                            <p>
                                Loading your portfolio...
                            </p>

                        </div>

                    </div>

                </main>

            </div>
        );

    }


    // ========================================
    // ERROR
    // ========================================

    if (error) {

        return (
            <div className="app-shell">

                <Sidebar />

                <main className="main-content">

                    <Topbar />

                    <div className="page-container">

                        <div className="portfolio-error">

                            <h2>
                                Unable to load portfolio
                            </h2>

                            <p>
                                {error}
                            </p>

                            <button
                                type="button"
                                className="secondary-button"
                                onClick={() =>
                                    window.location.reload()
                                }
                            >
                                Try Again
                            </button>

                        </div>

                    </div>

                </main>

            </div>
        );

    }


    // ========================================
    // PROFILE DATA
    // ========================================

    const skills =
        profile?.skills || [];

    const education =
        profile?.education || [];

    const projects =
        profile?.projects || [];

    const certifications =
        profile?.certifications || [];

    const achievements =
        profile?.achievements || [];


    const initials =
        profile?.user?.name
            ? profile.user.name
                .split(" ")
                .map(word => word[0])
                .join("")
                .slice(0, 2)
                .toUpperCase()
            : "DS";


    return (

        <div className="app-shell">

            {/* SIDEBAR */}
            <Sidebar />


            {/* MAIN CONTENT */}
            <main className="main-content">

                {/* TOPBAR */}
                <Topbar />


                {/* PAGE */}
                <div className="page-container">


                    {/* ========================================
                        PORTFOLIO HEADER
                    ======================================== */}

                    <div className="portfolio-header">

                        <div className="portfolio-avatar">

                            {initials}

                        </div>


                        <div className="portfolio-header-info">

                            <span className="panel-label">
                                DIGITAL PORTFOLIO
                            </span>

                            <h2>

                                {profile?.user?.name ||
                                    "Student"}

                            </h2>

                            <p>

                                {profile?.careerGoal ||
                                    "Career Goal not set"}

                            </p>


                            {profile?.location?.city && (

                                <span className="portfolio-location">

                                    <MapPin size={15} />

                                    {profile.location.city}

                                    {profile.location.state
                                        ? `, ${profile.location.state}`
                                        : ""}

                                </span>

                            )}

                        </div>


                        <button
                            type="button"
                            className="secondary-button"
                            onClick={() => navigate("/edit-profile")}
                        >
                            Edit Profile
                        </button>

                    </div>



                    {/* ========================================
                        PROFILE COMPLETION
                    ======================================== */}

                    <section className="portfolio-card">

                        <div className="portfolio-card-heading">

                            <h3>
                                Profile Strength
                            </h3>

                            <strong>
                                {profile?.profileCompletion || 0}%
                            </strong>

                        </div>


                        <div className="profile-progress">

                            <div
                                className="profile-progress-bar"
                                style={{
                                    width:
                                        `${profile?.profileCompletion || 0}%`
                                }}
                            />

                        </div>

                        <p>
                            Complete your portfolio to improve
                            your visibility to industry recruiters.
                        </p>

                    </section>



                    {/* ========================================
                        GRID
                    ======================================== */}

                    <div className="portfolio-grid">


                        {/* ========================================
                            ABOUT
                        ======================================== */}

                        <section className="portfolio-card">

                            <div className="portfolio-card-heading">

                                <h3>
                                    About
                                </h3>

                                <UserRound size={20} />

                            </div>


                            <p>

                                {profile?.bio ||
                                    "No bio added yet."}

                            </p>


                            {profile?.careerGoal && (

                                <div className="portfolio-career">

                                    <strong>
                                        Career Goal
                                    </strong>

                                    <span>
                                        {profile.careerGoal}
                                    </span>

                                </div>

                            )}

                        </section>



                        {/* ========================================
                            SKILLS
                        ======================================== */}

                        <section className="portfolio-card">

                            <div className="portfolio-card-heading">

                                <h3>
                                    Skills
                                </h3>

                                <Code2 size={20} />

                            </div>


                            {skills.length === 0 ? (

                                <div className="project-placeholder">

                                    <p>
                                        No skills added yet.
                                    </p>

                                </div>

                            ) : (

                                <div className="skill-tags">

                                    {skills.map(
                                        (skill, index) => (

                                            <span
                                                key={index}
                                                title={
                                                    `${skill.level} • ${skill.score}%`
                                                }
                                            >

                                                {skill.name}

                                            </span>

                                        )
                                    )}

                                </div>

                            )}

                        </section>



                        {/* ========================================
                            PROJECTS
                        ======================================== */}

                        <section className="portfolio-card">

                            <div className="portfolio-card-heading">

                                <h3>
                                    Projects
                                </h3>

                                <button type="button">

                                    <Plus size={16} />

                                    Add

                                </button>

                            </div>


                            {projects.length === 0 ? (

                                <div className="project-placeholder">

                                    <Code2 size={30} />

                                    <strong>
                                        Build your first showcase project
                                    </strong>

                                    <p>
                                        Add projects to strengthen
                                        your digital portfolio.
                                    </p>

                                    <button
                                        type="button"
                                        className="secondary-button"
                                    >

                                        <Plus size={16} />

                                        Add Project

                                    </button>

                                </div>

                            ) : (

                                <div className="portfolio-project-list">

                                    {projects.map(
                                        (project, index) => (

                                            <div
                                                className="portfolio-project"
                                                key={index}
                                            >

                                                <h4>
                                                    {project.title}
                                                </h4>

                                                <p>
                                                    {project.description}
                                                </p>


                                                {project.technologies &&
                                                    project.technologies.length > 0 && (

                                                        <div className="skill-tags">

                                                            {project.technologies.map(
                                                                (
                                                                    technology,
                                                                    techIndex
                                                                ) => (

                                                                    <span
                                                                        key={techIndex}
                                                                    >
                                                                        {technology}
                                                                    </span>

                                                                )
                                                            )}

                                                        </div>

                                                    )}


                                                {project.projectUrl && (

                                                    <a
                                                        href={
                                                            project.projectUrl
                                                        }
                                                        target="_blank"
                                                        rel="noreferrer"
                                                    >

                                                        View Project

                                                        <ExternalLink
                                                            size={14}
                                                        />

                                                    </a>

                                                )}

                                            </div>

                                        )
                                    )}

                                </div>

                            )}

                        </section>



                        {/* ========================================
                            EDUCATION
                        ======================================== */}

                        <section className="portfolio-card">

                            <div className="portfolio-card-heading">

                                <h3>
                                    Education
                                </h3>

                                <GraduationCap size={20} />

                            </div>


                            {education.length === 0 ? (

                                <p>
                                    No education information added.
                                </p>

                            ) : (

                                education.map(
                                    (edu, index) => (

                                        <div
                                            className="education-item"
                                            key={index}
                                        >

                                            <strong>

                                                {edu.degree ||
                                                    "Degree"}

                                            </strong>


                                            <p>

                                                {edu.institution ||
                                                    "Institution"}

                                            </p>


                                            {edu.fieldOfStudy && (

                                                <span>

                                                    {edu.fieldOfStudy}

                                                </span>

                                            )}


                                            {(edu.startYear ||
                                                edu.endYear) && (

                                                <span>

                                                    {edu.startYear ||
                                                        "—"}

                                                    {" — "}

                                                    {edu.endYear ||
                                                        "Present"}

                                                </span>

                                            )}


                                            {edu.cgpa !== undefined && (

                                                <span>

                                                    CGPA: {edu.cgpa}

                                                </span>

                                            )}

                                        </div>

                                    )
                                )

                            )}

                        </section>



                        {/* ========================================
                            CERTIFICATIONS
                        ======================================== */}

                        <section className="portfolio-card">

                            <div className="portfolio-card-heading">

                                <h3>
                                    Certifications
                                </h3>

                                <Award size={20} />

                            </div>


                            {certifications.length === 0 ? (

                                <div className="project-placeholder">

                                    <strong>
                                        No certifications yet
                                    </strong>

                                    <p>
                                        Add verified certifications
                                        to improve your profile.
                                    </p>

                                    <button
                                        type="button"
                                        className="secondary-button"
                                    >

                                        <Plus size={16} />

                                        Add Certification

                                    </button>

                                </div>

                            ) : (

                                <div>

                                    {certifications.map(
                                        (certificate, index) => (

                                            <div
                                                className="certification-item"
                                                key={index}
                                            >

                                                <strong>

                                                    {certificate.name}

                                                </strong>

                                                <p>

                                                    {
                                                        certificate.issuingOrganization
                                                    }

                                                </p>


                                                {certificate.credentialUrl && (

                                                    <a
                                                        href={
                                                            certificate.credentialUrl
                                                        }
                                                        target="_blank"
                                                        rel="noreferrer"
                                                    >

                                                        Verify

                                                        <ExternalLink
                                                            size={14}
                                                        />

                                                    </a>

                                                )}

                                            </div>

                                        )
                                    )}

                                </div>

                            )}

                        </section>



                        {/* ========================================
                            ACHIEVEMENTS
                        ======================================== */}

                        <section className="portfolio-card">

                            <div className="portfolio-card-heading">

                                <h3>
                                    Achievements
                                </h3>

                                <Briefcase size={20} />

                            </div>


                            {achievements.length === 0 ? (

                                <p>
                                    No achievements added yet.
                                </p>

                            ) : (

                                <ul className="achievement-list">

                                    {achievements.map(
                                        (achievement, index) => (

                                            <li key={index}>
                                                {achievement}
                                            </li>

                                        )
                                    )}

                                </ul>

                            )}

                        </section>



                        {/* ========================================
                            PROFESSIONAL LINKS
                        ======================================== */}

                        <section className="portfolio-card">

                            <div className="portfolio-card-heading">

                                <h3>
                                    Professional Links
                                </h3>

                            </div>


                            <div className="professional-links">

                                <div>

                                    <span>
                                        GitHub Profile
                                    </span>

                                    <ExternalLink
                                        size={15}
                                    />

                                </div>


                                <div>

                                    <span>
                                        LinkedIn Profile
                                    </span>

                                    <ExternalLink
                                        size={15}
                                    />

                                </div>

                            </div>

                        </section>

                    </div>

                </div>

            </main>

        </div>

    );

}

export default Portfolio;