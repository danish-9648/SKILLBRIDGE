import {
    GraduationCap,
    ArrowRight,
    ShieldCheck
} from "lucide-react";

import {
    Link,
    useNavigate
} from "react-router-dom";

import {
    useState
} from "react";

import {
    loginUser
} from "../services/api";


function Login() {

    const navigate = useNavigate();

    const [loading, setLoading] =
        useState(false);

    const [error, setError] =
        useState("");

    const [success, setSuccess] =
        useState("");


    const [formData, setFormData] =
        useState({
            email: "",
            password: "",
            role: "STUDENT"
        });


    // ========================================
    // HANDLE INPUT
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
    // HANDLE LOGIN
    // ========================================

    const handleLogin = async (event) => {

        event.preventDefault();

        setError("");
        setSuccess("");
        setLoading(true);


        const email =
            formData.email.trim();

        const password =
            formData.password;

        const selectedRole =
            formData.role;


        console.log("=================================");
        console.log("LOGIN ATTEMPT");
        console.log("Email:", email);
        console.log("Selected Role:", selectedRole);
        console.log("=================================");


        try {

            // --------------------------------
            // API LOGIN
            // --------------------------------

            const response =
                await loginUser({
                    email,
                    password
                });


            console.log(
                "LOGIN RESPONSE:",
                response
            );


            // --------------------------------
            // Login failed
            // --------------------------------

            if (
                !response ||
                !response.success
            ) {

                throw new Error(
                    response?.message ||
                    "Invalid email or password."
                );

            }


            // --------------------------------
            // Verify returned user
            // --------------------------------

            const user =
                response.user;


            if (!user) {

                throw new Error(
                    "Login succeeded but user information was not returned."
                );

            }


            // --------------------------------
            // IMPORTANT:
            // Verify selected role
            // against backend role
            // --------------------------------

            if (
                user.role !==
                selectedRole
            ) {

                setError(
                    `This account is registered as ${user.role}. Please select ${user.role} and try again.`
                );

                setLoading(false);

                return;
            }


            // --------------------------------
            // Save token
            // --------------------------------

            if (!response.token) {

                throw new Error(
                    "Login succeeded but no authentication token was received."
                );

            }


            localStorage.setItem(
                "token",
                response.token
            );


            // --------------------------------
            // Save user
            // --------------------------------

            localStorage.setItem(
                "user",
                JSON.stringify(user)
            );


            console.log("=================================");
            console.log("LOGIN SUCCESSFUL");
            console.log("Role:", user.role);
            console.log("=================================");


            setSuccess(
                "Login successful! Redirecting..."
            );

            setLoading(false);


            // --------------------------------
            // Redirect by role
            // --------------------------------

            setTimeout(() => {

                if (
                    user.role ===
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

            }, 700);


        } catch (error) {

            console.error(
                "LOGIN ERROR:",
                error
            );


            setError(
                error.message ||
                "Unable to login."
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
                LOGIN CARD
            ===================================== */}

            <div className="auth-card">

                <div className="auth-heading">

                    <span className="panel-label">
                        WELCOME BACK
                    </span>

                    <h2>
                        Sign in to SkillBridge
                    </h2>

                    <p>
                        Continue your career
                        development journey.
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
                    LOGIN FORM
                ===================================== */}

                <form
                    onSubmit={handleLogin}
                >

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
                        placeholder="Enter your password"
                        required
                        autoComplete="current-password"
                    />


                    {/* ROLE */}

                    <label>
                        Login as
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
                            marginBottom: "18px",
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


                    {/* LOGIN BUTTON */}

                    <button
                        type="submit"
                        className="primary-button auth-submit"
                        disabled={loading}
                    >

                        {loading ? (

                            <>
                                Signing in...
                            </>

                        ) : (

                            <>
                                Sign In
                                <ArrowRight
                                    size={17}
                                />
                            </>

                        )}

                    </button>

                </form>


                {/* =====================================
                    SECURITY
                ===================================== */}

                <div className="security-note">

                    <ShieldCheck
                        size={16}
                    />

                    Secure role-based access

                </div>


                {/* =====================================
                    REGISTER
                ===================================== */}

                <p className="auth-switch">

                    Don't have an account?

                    {" "}

                    <Link to="/register">
                        Create account
                    </Link>

                </p>

            </div>

        </div>

    );

}


export default Login;