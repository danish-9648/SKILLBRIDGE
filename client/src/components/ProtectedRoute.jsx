import {
    Navigate,
    Outlet,
    useLocation
} from "react-router-dom";


function ProtectedRoute({
    allowedRoles = []
}) {

    const location = useLocation();

    const token =
        localStorage.getItem("token");

    const storedUser =
        localStorage.getItem("user");


    // No token
    if (!token) {

        return (
            <Navigate
                to="/login"
                replace
                state={{
                    from: location
                }}
            />
        );

    }


    let user = null;

    try {

        user =
            JSON.parse(storedUser);

    } catch {

        user = null;

    }


    // Token exists but user data is missing
    if (!user) {

        localStorage.removeItem("token");
        localStorage.removeItem("user");

        return (
            <Navigate
                to="/login"
                replace
            />
        );

    }


    // Check role
    if (
        allowedRoles.length > 0 &&
        !allowedRoles.includes(user.role)
    ) {

        if (user.role === "INDUSTRY") {

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