import {
    Routes,
    Route,
    Navigate
} from "react-router-dom";

import ProtectedRoute from "./components/ProtectedRoute";
import AppLayout from "./components/AppLayout";

import Login from "./pages/Login";
import Register from "./pages/Register";

import StudentDashboard from "./pages/StudentDashboard";
import Assessment from "./pages/Assessment";
import Internships from "./pages/Internships";
import Applications from "./pages/Applications";
import Portfolio from "./pages/Portfolio";
import EditProfile from "./pages/EditProfile";

import PlacementReadiness from "./pages/PlacementReadiness";
import PlacementRecommendations from "./pages/PlacementRecommendations";

import IndustryDashboard from "./pages/IndustryDashboard";
import IndustryApplications from "./pages/IndustryApplications";
import IndustryApplicationDetails from "./pages/IndustryApplicationDetails";
import IndustryInternships from "./pages/IndustryInternships";
import InternshipDetails from "./pages/InternshipDetails";
import MyApplications from "./pages/MyApplications";
import AIAssistant from "./pages/AIAssistant";


function App() {
    return (
        <Routes>

            {/* =====================================================
                PUBLIC ROUTES
            ===================================================== */}

            <Route
                path="/login"
                element={<Login />}
            />

            <Route
                path="/register"
                element={<Register />}
            />


            {/* =====================================================
                STUDENT ROUTES
            ===================================================== */}

            <Route
                element={
                    <ProtectedRoute
                        allowedRoles={["STUDENT"]}
                    />
                }
            >

                <Route
                    element={<AppLayout />}
                >

                    <Route
                        path="/dashboard"
                        element={<StudentDashboard />}
                    />

                    <Route
                        path="/assessment"
                        element={<Assessment />}
                    />

                    <Route
                        path="/internships"
                        element={<Internships />}
                    />

                    <Route
                        path="/applications"
                        element={<Applications />}
                    />

                    <Route
                        path="/portfolio"
                        element={<Portfolio />}
                    />

                    <Route
                        path="/edit-profile"
                        element={<EditProfile />}
                    />

                    <Route
                        path="/placement-readiness"
                        element={<PlacementReadiness />}
                    />

                    <Route
                        path="/placement-recommendations"
                        element={
                            <PlacementRecommendations />
                        }
                    />

                    <Route
                        path="/ai-assistant"
                        element={<AIAssistant />}
                    />

                </Route>

            </Route>


            {/* =====================================================
                INDUSTRY ROUTES
            ===================================================== */}

            <Route
                element={
                    <ProtectedRoute
                        allowedRoles={["INDUSTRY"]}
                    />
                }
            >

                <Route
                    element={<AppLayout />}
                >

                    <Route
                        path="/industry/dashboard"
                        element={<IndustryDashboard />}
                    />

                    <Route
                        path="/industry/internships"
                        element={<IndustryInternships />}
                    />

                    <Route
                        path="/industry/applications"
                        element={<IndustryApplications />}
                    />

                    <Route
                        path="/industry/applications/:applicationId"
                        element={
                            <IndustryApplicationDetails />
                        }
                    />
                    <Route
                        path="/internships/:internshipId"
                        element={<InternshipDetails />}
                    />
                    <Route
                        path="/my-applications"
                        element={<MyApplications />}
                    />
                    <Route
                        path="/ai-assistant"
                        element={<AIAssistant />}
                    />

                </Route>

            </Route>


            {/* =====================================================
                DEFAULT ROUTE
            ===================================================== */}

            <Route
                path="/"
                element={<DefaultRedirect />}
            />


            {/* =====================================================
                404
            ===================================================== */}

            <Route
                path="*"
                element={
                    <Navigate
                        to="/"
                        replace
                    />
                }
            />

        </Routes>
    );
}


/* ================================================================
   DEFAULT REDIRECT
================================================================ */

function DefaultRedirect() {

    const token =
        localStorage.getItem("token");

    if (!token) {
        return (
            <Navigate
                to="/login"
                replace
            />
        );
    }

    let user = null;

    try {
        user = JSON.parse(
            localStorage.getItem("user")
        );
    } catch {
        user = null;
    }

    if (user?.role === "INDUSTRY") {
        return (
            <Navigate
                to="/industry/dashboard"
                replace
            />
        );
    }

    if (user?.role === "STUDENT") {
        return (
            <Navigate
                to="/dashboard"
                replace
            />
        );
    }

    localStorage.removeItem("token");
    localStorage.removeItem("user");

    return (
        <Navigate
            to="/login"
            replace
        />
    );
}

export default App;