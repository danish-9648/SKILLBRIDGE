const jwt = require("jsonwebtoken");
const User = require("../models/User");

// ============================================================
// GENERATE TOKEN
// ============================================================

const generateToken = (user) => {
    if (!process.env.JWT_SECRET) {
        throw new Error("JWT_SECRET is not defined in .env");
    }

    return jwt.sign(
        {
            id: user._id.toString(),
            role: user.role
        },
        process.env.JWT_SECRET,
        {
            expiresIn: "7d"
        }
    );
};

// ============================================================
// REGISTER
// ============================================================

const registerUser = async (req, res) => {
    try {
        console.log("=================================");
        console.log("REGISTER REQUEST");
        console.log("BODY:", req.body);
        console.log("=================================");

        const {
            name,
            email,
            password,
            role
        } = req.body || {};

        // Validate name
        if (!name || !name.trim()) {
            return res.status(400).json({
                success: false,
                message: "Name is required"
            });
        }

        // Validate email
        if (!email || !email.trim()) {
            return res.status(400).json({
                success: false,
                message: "Email is required"
            });
        }

        // Validate password
        if (!password) {
            return res.status(400).json({
                success: false,
                message: "Password is required"
            });
        }

        if (password.length < 6) {
            return res.status(400).json({
                success: false,
                message: "Password must be at least 6 characters"
            });
        }

        const normalizedEmail =
            email.trim().toLowerCase();

        // Allowed roles
        const allowedRoles = [
            "STUDENT",
            "INDUSTRY",
            "ACADEMICIAN",
            "INSTITUTION"
        ];

        const selectedRole =
            allowedRoles.includes(role)
                ? role
                : "STUDENT";

        console.log("Registration data:");
        console.log("Name:", name);
        console.log("Email:", normalizedEmail);
        console.log("Role:", selectedRole);

        // Check existing user
        const existingUser =
            await User.findOne({
                email: normalizedEmail
            });

        if (existingUser) {
            return res.status(409).json({
                success: false,
                message: "User with this email already exists"
            });
        }

        // Create user
        const user = new User({
            name: name.trim(),
            email: normalizedEmail,
            password: password,
            role: selectedRole
        });

        await user.save();

        console.log(
            "USER CREATED:",
            user._id.toString()
        );

        // Generate token
        const token = generateToken(user);

        return res.status(201).json({
            success: true,
            message: "User registered successfully",
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role
            }
        });

    } catch (error) {

        console.error("=================================");
        console.error("REGISTER ERROR");
        console.error("ERROR NAME:", error.name);
        console.error("ERROR MESSAGE:", error.message);
        console.error("ERROR STACK:");
        console.error(error.stack);
        console.error("=================================");

        if (error.code === 11000) {
            return res.status(409).json({
                success: false,
                message: "User with this email already exists"
            });
        }

        return res.status(500).json({
            success: false,
            message: "Server error during registration",
            error: error.message
        });
    }
};

// ============================================================
// LOGIN
// ============================================================

const loginUser = async (req, res) => {
    try {
        const {
            email,
            password
        } = req.body || {};

        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: "Email and password are required"
            });
        }

        const normalizedEmail =
            email.trim().toLowerCase();

        const user =
            await User.findOne({
                email: normalizedEmail
            });

        if (!user) {
            return res.status(401).json({
                success: false,
                message: "Invalid email or password"
            });
        }

        if (!user.isActive) {
            return res.status(403).json({
                success: false,
                message: "Your account has been deactivated"
            });
        }

        const passwordMatch =
            await user.comparePassword(password);

        if (!passwordMatch) {
            return res.status(401).json({
                success: false,
                message: "Invalid email or password"
            });
        }

        const token =
            generateToken(user);

        return res.status(200).json({
            success: true,
            message: "Login successful",
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role
            }
        });

    } catch (error) {

        console.error("LOGIN ERROR:");
        console.error(error);

        return res.status(500).json({
            success: false,
            message: "Server error during login",
            error: error.message
        });
    }
};

// ============================================================
// CURRENT USER
// ============================================================

const getCurrentUser = async (req, res) => {
    try {
        if (!req.user) {
            return res.status(401).json({
                success: false,
                message: "User not authenticated"
            });
        }

        return res.status(200).json({
            success: true,
            user: {
                id: req.user._id,
                name: req.user.name,
                email: req.user.email,
                role: req.user.role,
                isActive: req.user.isActive,
                createdAt: req.user.createdAt
            }
        });

    } catch (error) {

        console.error(
            "CURRENT USER ERROR:",
            error
        );

        return res.status(500).json({
            success: false,
            message: "Server error while fetching user"
        });
    }
};

// ============================================================
// EXPORT
// ============================================================

module.exports = {
    registerUser,
    loginUser,
    getCurrentUser
};