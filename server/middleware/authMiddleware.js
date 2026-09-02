const jwt = require("jsonwebtoken");
const User = require("../models/user");

// ========================================
// AUTHENTICATION
// ========================================

const protect = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;

        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            return res.status(401).json({
                success: false,
                message: "Not authorized. Token required."
            });
        }

        const token = authHeader.split(" ")[1];

        const decoded = jwt.verify(
            token,
            process.env.JWT_SECRET
        );

        const user = await User.findById(decoded.id)
            .select("-password");

        if (!user) {
            return res.status(401).json({
                success: false,
                message: "User no longer exists."
            });
        }

        if (!user.isActive) {
            return res.status(403).json({
                success: false,
                message: "Account is deactivated."
            });
        }

        req.user = user;

        next();

    } catch (error) {
        console.error("Authentication Error:", error.message);

        if (error.name === "JsonWebTokenError") {
            return res.status(401).json({
                success: false,
                message: "Invalid authentication token."
            });
        }

        if (error.name === "TokenExpiredError") {
            return res.status(401).json({
                success: false,
                message: "Authentication token expired."
            });
        }

        return res.status(500).json({
            success: false,
            message: "Authentication error."
        });
    }
};

// ========================================
// ROLE AUTHORIZATION
// ========================================

const authorize = (...allowedRoles) => {
    return (req, res, next) => {

        if (!req.user) {
            return res.status(401).json({
                success: false,
                message: "Authentication required."
            });
        }

        if (!allowedRoles.includes(req.user.role)) {
            return res.status(403).json({
                success: false,
                message: "You do not have permission to access this resource.",
                requiredRoles: allowedRoles,
                yourRole: req.user.role
            });
        }

        next();
    };
};

module.exports = {
    protect,
    authorize
};