import { useEffect, useState } from "react";
import { Save, ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

import Sidebar from "../components/Sidebar";
import Topbar from "../components/Topbar";


function EditProfile() {

    const navigate = useNavigate();

    const [loading, setLoading] =
        useState(true);

    const [saving, setSaving] =
        useState(false);

    const [message, setMessage] =
        useState("");

    const [error, setError] =
        useState("");


    const [form, setForm] = useState({

        name: "",

        phone: "",

        dateOfBirth: "",

        gender: "",

        city: "",

        state: "",

        country: "India",

        bio: "",

        careerGoal: "",

        preferredDomains: ""

    });


    // ========================================
    // LOAD PROFILE
    // ========================================

    useEffect(() => {

        const loadProfile = async () => {

            try {

                const token =
                    localStorage.getItem("token");

                const response =
                    await fetch(
                        "http://localhost:5000/api/students/profile",
                        {
                            headers: {
                                Authorization:
                                    `Bearer ${token}`
                            }
                        }
                    );

                const data =
                    await response.json();

                if (!response.ok ||
                    !data.success) {

                    throw new Error(
                        data.message ||
                        "Unable to load profile"
                    );
                }


                const profile =
                    data.profile;


                setForm({

                    name:
                        profile.user?.name ||
                        "",

                    phone:
                        profile.phone ||
                        "",

                    dateOfBirth:
                        profile.dateOfBirth
                            ? profile.dateOfBirth
                                .substring(0, 10)
                            : "",

                    gender:
                        profile.gender ||
                        "",

                    city:
                        profile.location?.city ||
                        "",

                    state:
                        profile.location?.state ||
                        "",

                    country:
                        profile.location?.country ||
                        "India",

                    bio:
                        profile.bio ||
                        "",

                    careerGoal:
                        profile.careerGoal ||
                        "",

                    preferredDomains:
                        profile.preferredDomains
                            ?.join(", ") ||
                        ""

                });

            } catch (err) {

                console.error(
                    "Profile Load Error:",
                    err
                );

                setError(
                    err.message ||
                    "Unable to load profile"
                );

            } finally {

                setLoading(false);

            }
        };


        loadProfile();

    }, []);


    // ========================================
    // HANDLE INPUT
    // ========================================

    const handleChange = (event) => {

        const {
            name,
            value
        } = event.target;

        setForm(previous => ({
            ...previous,
            [name]: value
        }));

    };


    // ========================================
    // SAVE PROFILE
    // ========================================

    const handleSubmit = async (event) => {

        event.preventDefault();

        setSaving(true);

        setMessage("");

        setError("");


        try {

            const token =
                localStorage.getItem("token");


            const response =
                await fetch(
                    "http://localhost:5000/api/students/profile",
                    {
                        method: "PUT",

                        headers: {

                            "Content-Type":
                                "application/json",

                            Authorization:
                                `Bearer ${token}`
                        },

                        body: JSON.stringify({

                            name:
                                form.name,

                            phone:
                                form.phone,

                            dateOfBirth:
                                form.dateOfBirth,

                            gender:
                                form.gender,

                            location: {

                                city:
                                    form.city,

                                state:
                                    form.state,

                                country:
                                    form.country

                            },

                            bio:
                                form.bio,

                            careerGoal:
                                form.careerGoal,

                            preferredDomains:
                                form.preferredDomains
                                    .split(",")
                                    .map(item =>
                                        item.trim()
                                    )
                                    .filter(Boolean)

                        })
                    }
                );


            const data =
                await response.json();


            if (!response.ok ||
                !data.success) {

                throw new Error(
                    data.message ||
                    "Unable to update profile"
                );

            }


            // Update local user data
            if (data.profile?.user) {

                localStorage.setItem(
                    "user",
                    JSON.stringify({
                        id:
                            data.profile.user._id,

                        name:
                            data.profile.user.name,

                        email:
                            data.profile.user.email,

                        role:
                            data.profile.user.role
                    })
                );

            }


            setMessage(
                "Profile updated successfully!"
            );


            setTimeout(() => {

                navigate("/portfolio");

            }, 1000);


        } catch (err) {

            console.error(
                "Profile Update Error:",
                err
            );

            setError(
                err.message ||
                "Unable to update profile"
            );

        } finally {

            setSaving(false);

        }

    };


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

                        <p>
                            Loading profile...
                        </p>

                    </div>

                </main>

            </div>
        );

    }


    // ========================================
    // PAGE
    // ========================================

    return (

        <div className="app-shell">

            <Sidebar />

            <main className="main-content">

                <Topbar />

                <div className="page-container">


                    <div className="edit-profile-header">

                        <button
                            type="button"
                            className="secondary-button"
                            onClick={() =>
                                navigate("/portfolio")
                            }
                        >

                            <ArrowLeft
                                size={16}
                            />

                            Back to Portfolio

                        </button>


                        <div>

                            <span className="panel-label">
                                PROFILE SETTINGS
                            </span>

                            <h2>
                                Edit Your Profile
                            </h2>

                            <p>
                                Keep your professional
                                profile up to date.
                            </p>

                        </div>

                    </div>


                    {message && (

                        <div className="profile-success">
                            {message}
                        </div>

                    )}


                    {error && (

                        <div className="profile-error">
                            {error}
                        </div>

                    )}


                    <form
                        className="edit-profile-form"
                        onSubmit={handleSubmit}
                    >


                        {/* BASIC INFORMATION */}

                        <section className="portfolio-card">

                            <h3>
                                Basic Information
                            </h3>


                            <div className="form-grid">

                                <div className="form-group">

                                    <label>
                                        Full Name
                                    </label>

                                    <input
                                        type="text"
                                        name="name"
                                        value={form.name}
                                        onChange={handleChange}
                                        placeholder="Your full name"
                                    />

                                </div>


                                <div className="form-group">

                                    <label>
                                        Phone
                                    </label>

                                    <input
                                        type="text"
                                        name="phone"
                                        value={form.phone}
                                        onChange={handleChange}
                                        placeholder="9876543210"
                                    />

                                </div>


                                <div className="form-group">

                                    <label>
                                        Date of Birth
                                    </label>

                                    <input
                                        type="date"
                                        name="dateOfBirth"
                                        value={form.dateOfBirth}
                                        onChange={handleChange}
                                    />

                                </div>


                                <div className="form-group">

                                    <label>
                                        Gender
                                    </label>

                                    <select
                                        name="gender"
                                        value={form.gender}
                                        onChange={handleChange}
                                    >

                                        <option value="">
                                            Select Gender
                                        </option>

                                        <option value="MALE">
                                            Male
                                        </option>

                                        <option value="FEMALE">
                                            Female
                                        </option>

                                        <option value="OTHER">
                                            Other
                                        </option>

                                        <option value="PREFER_NOT_TO_SAY">
                                            Prefer not to say
                                        </option>

                                    </select>

                                </div>

                            </div>

                        </section>



                        {/* LOCATION */}

                        <section className="portfolio-card">

                            <h3>
                                Location
                            </h3>


                            <div className="form-grid">

                                <div className="form-group">

                                    <label>
                                        City
                                    </label>

                                    <input
                                        type="text"
                                        name="city"
                                        value={form.city}
                                        onChange={handleChange}
                                        placeholder="Lucknow"
                                    />

                                </div>


                                <div className="form-group">

                                    <label>
                                        State
                                    </label>

                                    <input
                                        type="text"
                                        name="state"
                                        value={form.state}
                                        onChange={handleChange}
                                        placeholder="Uttar Pradesh"
                                    />

                                </div>


                                <div className="form-group">

                                    <label>
                                        Country
                                    </label>

                                    <input
                                        type="text"
                                        name="country"
                                        value={form.country}
                                        onChange={handleChange}
                                    />

                                </div>

                            </div>

                        </section>



                        {/* CAREER */}

                        <section className="portfolio-card">

                            <h3>
                                Career Information
                            </h3>


                            <div className="form-group">

                                <label>
                                    Career Goal
                                </label>

                                <input
                                    type="text"
                                    name="careerGoal"
                                    value={form.careerGoal}
                                    onChange={handleChange}
                                    placeholder="Full Stack Developer"
                                />

                            </div>


                            <div className="form-group">

                                <label>
                                    Preferred Domains
                                </label>

                                <input
                                    type="text"
                                    name="preferredDomains"
                                    value={
                                        form.preferredDomains
                                    }
                                    onChange={handleChange}
                                    placeholder="Web Development, AI, Cloud Computing"
                                />

                                <small>
                                    Separate multiple domains with commas.
                                </small>

                            </div>


                            <div className="form-group">

                                <label>
                                    Professional Bio
                                </label>

                                <textarea
                                    name="bio"
                                    value={form.bio}
                                    onChange={handleChange}
                                    rows="5"
                                    maxLength="500"
                                    placeholder="Tell recruiters about yourself..."
                                />

                            </div>

                        </section>



                        {/* SAVE */}

                        <div className="form-actions">

                            <button
                                type="button"
                                className="secondary-button"
                                onClick={() =>
                                    navigate("/portfolio")
                                }
                            >
                                Cancel
                            </button>


                            <button
                                type="submit"
                                className="primary-button"
                                disabled={saving}
                            >

                                <Save
                                    size={17}
                                />

                                {saving
                                    ? "Saving..."
                                    : "Save Changes"}

                            </button>

                        </div>

                    </form>

                </div>

            </main>

        </div>
    );
}

export default EditProfile;