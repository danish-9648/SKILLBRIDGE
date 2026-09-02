import { Navigate, Outlet } from "react-router-dom";

function ProtectedRoute({
    allowedRoles = []
}) {

    const token =
        localStorage.getItem("token");

    const storedUser =
        localStorage.getItem("user");

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

        user = storedUser
            ? JSON.parse(storedUser)
            : null;

    } catch {

        user = null;

    }

    /*
    ========================================
    ROLE PROTECTION
    ========================================
    */

    if (
        allowedRoles.length > 0 &&
        (!user ||
            !allowedRoles.includes(
                user.role
            ))
    ) {

        if (user?.role === "INDUSTRY") {

            return (
                <Navigate
                    to="/industry/dashboard"
                    replace
                />
            );

        }

        return (
            <Navigate
                to="/dashboard"
                replace
            />
        );

    }

    return <Outlet />;

}

export default ProtectedRoute;