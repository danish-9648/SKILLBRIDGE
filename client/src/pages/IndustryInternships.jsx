
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import Sidebar from "../components/Sidebar";
import Topbar from "../components/Topbar";

import {
    createInternship,
    getMyInternships
} from "../services/api";


// ============================================================
// INITIAL FORM
// ============================================================

const initialForm = {
    title: "",
    description: "",
    domain: "",
    requiredSkills: "",
    eligibility: "",
    internshipType: "INTERNSHIP",
    workMode: "REMOTE",
    location: "",
    duration: "",
    stipend: "",
    openings: 1,
    applicationDeadline: ""
};


// ============================================================
// INDUSTRY INTERNSHIPS PAGE
// ============================================================

function IndustryInternships() {

    const navigate = useNavigate();

    const [internships, setInternships] = useState([]);

    const [form, setForm] = useState(initialForm);

    const [loading, setLoading] = useState(true);

    const [creating, setCreating] = useState(false);

    const [error, setError] = useState("");

    const [success, setSuccess] = useState("");


    // ========================================================
    // LOAD INTERNSHIPS
    // ========================================================

    const loadInternships = async () => {

        try {

            setLoading(true);
            setError("");

            const response = await getMyInternships();

            console.log(
                "MY INTERNSHIPS:",
                response
            );

            setInternships(
                Array.isArray(response?.internships)
                    ? response.internships
                    : []
            );

        } catch (err) {

            console.error(
                "Load internships error:",
                err
            );

            setError(
                err.message ||
                "Unable to load internships"
            );

        } finally {

            setLoading(false);

        }

    };


    // ========================================================
    // INITIAL LOAD
    // ========================================================

    useEffect(() => {

        loadInternships();

    }, []);


    // ========================================================
    // HANDLE FORM CHANGE
    // ========================================================

    const handleChange = (event) => {

        const {
            name,
            value
        } = event.target;

        setForm((previous) => ({
            ...previous,
            [name]: value
        }));

    };


    // ========================================================
    // CREATE INTERNSHIP
    // ========================================================

    const handleSubmit = async (event) => {

        event.preventDefault();

        setError("");
        setSuccess("");


        // ----------------------------------------------------
        // VALIDATION
        // ----------------------------------------------------

        if (!form.title.trim()) {

            setError(
                "Internship title is required."
            );

            return;
        }


        if (!form.description.trim()) {

            setError(
                "Internship description is required."
            );

            return;
        }


        if (!form.domain.trim()) {

            setError(
                "Domain is required."
            );

            return;
        }


        if (!form.requiredSkills.trim()) {

            setError(
                "At least one required skill is needed."
            );

            return;
        }


        // ----------------------------------------------------
        // CONVERT SKILLS
        // ----------------------------------------------------

        const requiredSkills =
            form.requiredSkills
                .split(",")
                .map((skill) => skill.trim())
                .filter(Boolean);


        if (requiredSkills.length === 0) {

            setError(
                "Please enter at least one required skill."
            );

            return;
        }


        // ----------------------------------------------------
        // INTERNSHIP DATA
        // ----------------------------------------------------

        const internshipData = {

            title:
                form.title.trim(),

            description:
                form.description.trim(),

            domain:
                form.domain.trim(),

            requiredSkills,

            eligibility:
                form.eligibility.trim(),

            internshipType:
                form.internshipType,

            workMode:
                form.workMode,

            location:
                form.location.trim(),

            duration:
                form.duration.trim(),

            stipend:
                form.stipend.trim(),

            openings:
                Number(form.openings) || 1,

            applicationDeadline:
                form.applicationDeadline || undefined

        };


        // ----------------------------------------------------
        // CREATE
        // ----------------------------------------------------

        try {

            setCreating(true);

            const response =
                await createInternship(
                    internshipData
                );

            console.log(
                "INTERNSHIP CREATED:",
                response
            );


            setSuccess(
                "Internship created successfully."
            );


            setForm(initialForm);


            await loadInternships();


        } catch (err) {

            console.error(
                "Create internship error:",
                err
            );

            setError(
                err.message ||
                "Unable to create internship"
            );

        } finally {

            setCreating(false);

        }

    };


    // ========================================================
    // CLEAR FORM
    // ========================================================

    const clearForm = () => {

        setForm(initialForm);

        setError("");

        setSuccess("");

    };


    // ========================================================
    // PAGE
    // ========================================================

    return (

        <div className="app-shell">

            <Sidebar />

            <main className="main-content">

                <Topbar />

                <div className="page-container">


                    {/* ==================================================
                        HEADER
                    ================================================== */}

                    <div
                        className="page-header"
                        style={{
                            marginBottom: "24px"
                        }}
                    >

                        <div>

                            <span className="panel-label">
                                OPPORTUNITY MANAGEMENT
                            </span>

                            <h2>
                                Internships
                            </h2>

                            <p>
                                Create opportunities and manage student applications.
                            </p>

                        </div>


                        <button
                            className="secondary-button"
                            onClick={() =>
                                navigate(
                                    "/industry/dashboard"
                                )
                            }
                        >
                            Back to Dashboard
                        </button>

                    </div>


                    {/* ==================================================
                        SUCCESS
                    ================================================== */}

                    {success && (

                        <div
                            style={{
                                padding: "14px 16px",
                                marginBottom: "18px",
                                borderRadius: "10px",
                                background: "#dcfce7",
                                color: "#166534"
                            }}
                        >
                            {success}
                        </div>

                    )}


                    {/* ==================================================
                        ERROR
                    ================================================== */}

                    {error && (

                        <div
                            style={{
                                padding: "14px 16px",
                                marginBottom: "18px",
                                borderRadius: "10px",
                                background: "#fee2e2",
                                color: "#991b1b"
                            }}
                        >
                            {error}
                        </div>

                    )}


                    {/* ==================================================
                        CREATE INTERNSHIP
                    ================================================== */}

                    <div
                        className="panel"
                        style={{
                            marginBottom: "28px"
                        }}
                    >

                        <div
                            style={{
                                marginBottom: "20px"
                            }}
                        >

                            <span className="panel-label">
                                CREATE OPPORTUNITY
                            </span>

                            <h3>
                                Create Internship
                            </h3>

                            <p>
                                Publish a new opportunity for students.
                            </p>

                        </div>


                        <form
                            onSubmit={handleSubmit}
                        >

                            <div
                                style={{
                                    display: "grid",
                                    gridTemplateColumns:
                                        "repeat(2, minmax(0, 1fr))",
                                    gap: "16px"
                                }}
                            >

                                {/* TITLE */}

                                <FormField
                                    label="Internship Title *"
                                >

                                    <input
                                        name="title"
                                        value={form.title}
                                        onChange={handleChange}
                                        placeholder="Full Stack Developer Intern"
                                        required
                                    />

                                </FormField>


                                {/* DOMAIN */}

                                <FormField
                                    label="Domain *"
                                >

                                    <input
                                        name="domain"
                                        value={form.domain}
                                        onChange={handleChange}
                                        placeholder="Web Development"
                                        required
                                    />

                                </FormField>


                                {/* DESCRIPTION */}

                                <div
                                    style={{
                                        gridColumn: "1 / -1"
                                    }}
                                >

                                    <FormField
                                        label="Description *"
                                    >

                                        <textarea
                                            name="description"
                                            value={form.description}
                                            onChange={handleChange}
                                            rows="5"
                                            placeholder="Describe responsibilities, requirements and learning opportunities..."
                                            required
                                        />

                                    </FormField>

                                </div>


                                {/* SKILLS */}

                                <div
                                    style={{
                                        gridColumn: "1 / -1"
                                    }}
                                >

                                    <FormField
                                        label="Required Skills *"
                                        hint="Separate skills using commas"
                                    >

                                        <input
                                            name="requiredSkills"
                                            value={form.requiredSkills}
                                            onChange={handleChange}
                                            placeholder="JavaScript, React, Node.js, MongoDB, Git"
                                            required
                                        />

                                    </FormField>

                                </div>


                                {/* ELIGIBILITY */}

                                <FormField
                                    label="Eligibility"
                                >

                                    <input
                                        name="eligibility"
                                        value={form.eligibility}
                                        onChange={handleChange}
                                        placeholder="B.Tech CSE, 2nd year or above"
                                    />

                                </FormField>


                                {/* TYPE */}

                                <FormField
                                    label="Internship Type"
                                >

                                    <select
                                        name="internshipType"
                                        value={form.internshipType}
                                        onChange={handleChange}
                                    >

                                        <option value="INTERNSHIP">
                                            Internship
                                        </option>

                                        <option value="FULL_TIME">
                                            Full Time
                                        </option>

                                        <option value="PART_TIME">
                                            Part Time
                                        </option>

                                        <option value="APPRENTICESHIP">
                                            Apprenticeship
                                        </option>

                                    </select>

                                </FormField>


                                {/* WORK MODE */}

                                <FormField
                                    label="Work Mode"
                                >

                                    <select
                                        name="workMode"
                                        value={form.workMode}
                                        onChange={handleChange}
                                    >

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

                                </FormField>


                                {/* LOCATION */}

                                <FormField
                                    label="Location"
                                >

                                    <input
                                        name="location"
                                        value={form.location}
                                        onChange={handleChange}
                                        placeholder="Lucknow"
                                    />

                                </FormField>


                                {/* DURATION */}

                                <FormField
                                    label="Duration"
                                >

                                    <input
                                        name="duration"
                                        value={form.duration}
                                        onChange={handleChange}
                                        placeholder="6 Months"
                                    />

                                </FormField>


                                {/* STIPEND */}

                                <FormField
                                    label="Stipend"
                                >

                                    <input
                                        name="stipend"
                                        value={form.stipend}
                                        onChange={handleChange}
                                        placeholder="₹15,000/month"
                                    />

                                </FormField>


                                {/* OPENINGS */}

                                <FormField
                                    label="Number of Openings"
                                >

                                    <input
                                        name="openings"
                                        type="number"
                                        min="1"
                                        value={form.openings}
                                        onChange={handleChange}
                                    />

                                </FormField>


                                {/* DEADLINE */}

                                <FormField
                                    label="Application Deadline"
                                >

                                    <input
                                        name="applicationDeadline"
                                        type="date"
                                        value={form.applicationDeadline}
                                        onChange={handleChange}
                                    />

                                </FormField>

                            </div>


                            {/* BUTTONS */}

                            <div
                                style={{
                                    marginTop: "24px",
                                    display: "flex",
                                    gap: "10px"
                                }}
                            >

                                <button
                                    type="submit"
                                    className="primary-button"
                                    disabled={creating}
                                >

                                    {creating
                                        ? "Creating..."
                                        : "Create Internship"
                                    }

                                </button>


                                <button
                                    type="button"
                                    className="secondary-button"
                                    onClick={clearForm}
                                >
                                    Clear
                                </button>

                            </div>

                        </form>

                    </div>


                    {/* ==================================================
                        MY INTERNSHIPS
                    ================================================== */}

                    <div className="panel">

                        <div
                            style={{
                                display: "flex",
                                justifyContent: "space-between",
                                alignItems: "center",
                                marginBottom: "18px"
                            }}
                        >

                            <div>

                                <span className="panel-label">
                                    YOUR OPPORTUNITIES
                                </span>

                                <h3>
                                    My Internships
                                </h3>

                            </div>


                            <button
                                className="secondary-button"
                                onClick={loadInternships}
                            >
                                Refresh
                            </button>

                        </div>


                        {/* LOADING */}

                        {loading && (

                            <div className="project-placeholder">

                                <strong>
                                    Loading internships...
                                </strong>

                            </div>

                        )}


                        {/* EMPTY */}

                        {!loading &&
                            internships.length === 0 && (

                                <div className="project-placeholder">

                                    <strong>
                                        No internships created yet.
                                    </strong>

                                    <p>
                                        Create your first internship using the form above.
                                    </p>

                                </div>

                            )}


                        {/* LIST */}

                        {!loading &&
                            internships.length > 0 && (

                                <div
                                    style={{
                                        display: "grid",
                                        gap: "16px"
                                    }}
                                >

                                    {internships.map(
                                        (internship) => (

                                            <InternshipItem
                                                key={
                                                    internship._id
                                                }
                                                internship={
                                                    internship
                                                }
                                                onViewApplications={() =>
                                                    navigate(
                                                        `/industry/applications?internshipId=${internship._id}`
                                                    )
                                                }
                                            />

                                        )
                                    )}

                                </div>

                            )}

                    </div>

                </div>

            </main>

        </div>

    );

}


// ============================================================
// FORM FIELD
// ============================================================

function FormField({
    label,
    hint,
    children
}) {

    return (

        <div
            style={{
                display: "flex",
                flexDirection: "column",
                gap: "7px"
            }}
        >

            <label>

                <strong>
                    {label}
                </strong>

            </label>

            {children}

            {hint && (

                <small>
                    {hint}
                </small>

            )}

        </div>

    );

}


// ============================================================
// INTERNSHIP ITEM
// ============================================================

function InternshipItem({
    internship,
    onViewApplications
}) {

    const isOpen =
        internship.status === "OPEN";


    return (

        <div
            style={{
                padding: "20px",
                border:
                    "1px solid var(--border-color, #e5e7eb)",
                borderRadius: "14px"
            }}
        >

            {/* TOP */}

            <div
                style={{
                    display: "flex",
                    justifyContent: "space-between",
                    gap: "20px"
                }}
            >

                <div>

                    <span className="panel-label">
                        {internship.domain}
                    </span>

                    <h3>
                        {internship.title}
                    </h3>

                    <p>
                        {internship.description}
                    </p>

                </div>


                <span
                    style={{
                        height: "fit-content",
                        padding: "6px 12px",
                        borderRadius: "999px",
                        fontSize: "12px",
                        fontWeight: "600",
                        background:
                            isOpen
                                ? "#dcfce7"
                                : "#f1f5f9",
                        color:
                            isOpen
                                ? "#166534"
                                : "#475569"
                    }}
                >
                    {internship.status}
                </span>

            </div>


            {/* SKILLS */}

            <div
                style={{
                    display: "flex",
                    gap: "7px",
                    flexWrap: "wrap",
                    marginTop: "14px"
                }}
            >

                {Array.isArray(
                    internship.requiredSkills
                ) &&
                    internship.requiredSkills.map(
                        (skill, index) => (

                            <span
                                key={index}
                                style={{
                                    padding: "5px 10px",
                                    borderRadius: "999px",
                                    background:
                                        "rgba(99,102,241,0.08)",
                                    fontSize: "12px"
                                }}
                            >
                                {skill}
                            </span>

                        )
                    )}

            </div>


            {/* DETAILS */}

            <div
                style={{
                    display: "grid",
                    gridTemplateColumns:
                        "repeat(auto-fit, minmax(150px, 1fr))",
                    gap: "16px",
                    marginTop: "18px"
                }}
            >

                <Info
                    label="Work Mode"
                    value={internship.workMode}
                />

                <Info
                    label="Location"
                    value={
                        internship.location ||
                        "Not specified"
                    }
                />

                <Info
                    label="Duration"
                    value={
                        internship.duration ||
                        "Not specified"
                    }
                />

                <Info
                    label="Stipend"
                    value={
                        internship.stipend ||
                        "Not specified"
                    }
                />

                <Info
                    label="Openings"
                    value={internship.openings}
                />

                <Info
                    label="Deadline"
                    value={
                        internship.applicationDeadline
                            ? new Date(
                                internship.applicationDeadline
                            ).toLocaleDateString()
                            : "Not specified"
                    }
                />

            </div>


            {/* ACTION */}

            <div
                style={{
                    marginTop: "20px",
                    paddingTop: "16px",
                    borderTop:
                        "1px solid var(--border-color, #e5e7eb)"
                }}
            >

                <button
                    className="primary-button"
                    onClick={onViewApplications}
                >
                    View Applications
                </button>

            </div>

        </div>

    );

}


// ============================================================
// INFO
// ============================================================

function Info({
    label,
    value
}) {

    return (

        <div>

            <span className="panel-label">
                {label}
            </span>

            <strong
                style={{
                    display: "block",
                    marginTop: "4px"
                }}
            >
                {value}
            </strong>

        </div>

    );

}


export default IndustryInternships;

