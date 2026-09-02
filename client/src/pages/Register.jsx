import {
    GraduationCap,
    ArrowRight
} from "lucide-react";

import {
    Link,
    useNavigate
} from "react-router-dom";

import { useState } from "react";

import { registerUser } from "../services/api";


function Register() {

    const navigate = useNavigate();

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: "",
        role: "STUDENT"
    });


    // ========================================
    // HANDLE INPUT CHANGE
    // ========================================

    const handleChange = (event) => {

        const {
            name,
            value
        } = event.target;

        setFormData((previous) => ({
            ...previous,
            [name]: value
        }));

    };


    // ========================================
    // HANDLE REGISTER
    // ========================================

    const handleRegister = async (event) => {

        event.preventDefault();

        setError("");
        setSuccess("");
        setLoading(true);


        // ------------------------------------
        // Basic validation
        // ------------------------------------

        if (
            !formData.name.trim() ||
            !formData.email.trim() ||
            !formData.password.trim()
        ) {

            setError(
                "Please fill in all required fields."
            );

            setLoading(false);

            return;
        }


        if (formData.password.length < 6) {

            setError(
                "Password must be at least 6 characters."
            );

            setLoading(false);

            return;
        }


        console.log("=================================");
        console.log("REGISTER ATTEMPT");
        console.log("Name:", formData.name);
        console.log("Email:", formData.email);
        console.log("Role:", formData.role);
        console.log("=================================");


        try {

            const response =
                await registerUser({
                    name: formData.name.trim(),
                    email: formData.email.trim(),
                    password: formData.password,
                    role: formData.role
                });


            console.log(
                "REGISTER RESPONSE:",
                response
            );


            if (
                !response ||
                !response.success
            ) {

                throw new Error(
                    response?.message ||
                    "Registration failed."
                );

            }


            // ------------------------------------
            // Save authentication information
            // ------------------------------------

            if (response.token) {

                localStorage.setItem(
                    "token",
                    response.token
                );

            }


            if (response.user) {

                localStorage.setItem(
                    "user",
                    JSON.stringify(
                        response.user
                    )
                );

            }


            setSuccess(
                "Account created successfully! Redirecting..."
            );

            setLoading(false);


            // ------------------------------------
            // Redirect according to role
            // ------------------------------------

            setTimeout(() => {

                if (
                    response.user?.role ===
                    "INDUSTRY"
                ) {

                    navigate(
                        "/industry/dashboard",
                        {
                            replace: true
                        }
                    );

                    return;
                }


                navigate(
                    "/dashboard",
                    {
                        replace: true
                    }
                );

            }, 800);


        } catch (error) {

            console.error(
                "REGISTER ERROR:",
                error
            );


            setError(
                error.message ||
                "Unable to create account."
            );

            setLoading(false);

        }

    };


    return (

        <div className="auth-page">

            {/* =====================================
                BRAND
            ===================================== */}

            <div className="auth-brand">

                <div className="brand-icon">

                    <GraduationCap
                        size={24}
                    />

                </div>

                <div>

                    <h1>
                        SkillBridge
                    </h1>

                    <span>
                        Academia × Industry
                    </span>

                </div>

            </div>


            {/* =====================================
                REGISTER CARD
            ===================================== */}

            <div className="auth-card">

                <div className="auth-heading">

                    <span className="panel-label">
                        GET STARTED
                    </span>

                    <h2>
                        Create your account
                    </h2>

                    <p>
                        Build your industry-ready
                        career profile.
                    </p>

                </div>


                {/* =====================================
                    ERROR
                ===================================== */}

                {error && (

                    <div
                        style={{
                            background: "#fee2e2",
                            color: "#b91c1c",
                            padding: "12px 14px",
                            borderRadius: "10px",
                            marginBottom: "18px",
                            fontSize: "14px",
                            border: "1px solid #fecaca"
                        }}
                    >

                        {error}

                    </div>

                )}


                {/* =====================================
                    SUCCESS
                ===================================== */}

                {success && (

                    <div
                        style={{
                            background: "#dcfce7",
                            color: "#15803d",
                            padding: "12px 14px",
                            borderRadius: "10px",
                            marginBottom: "18px",
                            fontSize: "14px",
                            border: "1px solid #bbf7d0"
                        }}
                    >

                        {success}

                    </div>

                )}


                {/* =====================================
                    FORM
                ===================================== */}

                <form
                    onSubmit={handleRegister}
                >

                    {/* NAME */}

                    <label>
                        Full name
                    </label>

                    <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        placeholder="Your full name"
                        required
                        autoComplete="name"
                    />


                    {/* EMAIL */}

                    <label>
                        Email address
                    </label>

                    <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="you@example.com"
                        required
                        autoComplete="email"
                    />


                    {/* PASSWORD */}

                    <label>
                        Password
                    </label>

                    <input
                        type="password"
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        placeholder="Create a password"
                        required
                        minLength={6}
                        autoComplete="new-password"
                    />


                    {/* ROLE */}

                    <label>
                        Register as
                    </label>

                    <select
                        name="role"
                        value={formData.role}
                        onChange={handleChange}
                        required
                        style={{
                            width: "100%",
                            padding: "12px 14px",
                            borderRadius: "10px",
                            border: "1px solid #d1d5db",
                            background: "#fff",
                            fontSize: "14px",
                            marginBottom: "16px",
                            cursor: "pointer"
                        }}
                    >

                        <option value="STUDENT">
                            Student
                        </option>

                        <option value="INDUSTRY">
                            Industry
                        </option>

                        <option value="ACADEMICIAN">
                            Academician
                        </option>

                        <option value="INSTITUTION">
                            Institution
                        </option>

                    </select>


                    {/* ROLE DESCRIPTION */}

                    <div
                        style={{
                            background: "#f8fafc",
                            border: "1px solid #e2e8f0",
                            borderRadius: "10px",
                            padding: "12px 14px",
                            marginBottom: "18px",
                            fontSize: "13px",
                            color: "#475569"
                        }}
                    >

                        {formData.role === "STUDENT" && (
                            <>
                                <strong>
                                    Student:
                                </strong>{" "}
                                Assess skills, discover
                                internships and build
                                your career profile.
                            </>
                        )}

                        {formData.role === "INDUSTRY" && (
                            <>
                                <strong>
                                    Industry:
                                </strong>{" "}
                                Post internships, review
                                applications and discover
                                skilled candidates.
                            </>
                        )}

                        {formData.role === "ACADEMICIAN" && (
                            <>
                                <strong>
                                    Academician:
                                </strong>{" "}
                                Connect academic learning
                                with industry requirements.
                            </>
                        )}

                        {formData.role === "INSTITUTION" && (
                            <>
                                <strong>
                                    Institution:
                                </strong>{" "}
                                Manage institutional
                                collaboration and
                                industry partnerships.
                            </>
                        )}

                    </div>


                    {/* SUBMIT */}

                    <button
                        type="submit"
                        className="primary-button auth-submit"
                        disabled={loading}
                    >

                        {loading ? (

                            <>
                                Creating account...
                            </>

                        ) : (

                            <>
                                Create Account
                                <ArrowRight
                                    size={17}
                                />
                            </>

                        )}

                    </button>

                </form>


                {/* =====================================
                    LOGIN LINK
                ===================================== */}

                <p className="auth-switch">

                    Already have an account?

                    {" "}

                    <Link to="/login">
                        Sign in
                    </Link>

                </p>

            </div>

        </div>

    );

}


export default Register;