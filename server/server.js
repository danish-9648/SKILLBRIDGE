
const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");

dotenv.config();

const connectDB = require("./config/db");

// ============================================================
// ROUTES
// ============================================================

const authRoutes = require("./routes/authRoutes");
const studentRoutes = require("./routes/studentRoutes");
const assessmentRoutes = require("./routes/assessmentRoutes");
const industryRoutes = require("./routes/industryRoutes");
const internshipRoutes = require("./routes/internshipRoutes");
const industryApplicationRoutes = require("./routes/industryApplicationRoutes");
const aiRoutes = require("./routes/aiRoutes");
const placementRoutes = require("./routes/placementRoutes");
// ============================================================
// ERROR HANDLER
// ============================================================

const errorHandler = require("./middleware/errorHandler");

const app = express();

// ============================================================
// DATABASE
// ============================================================

connectDB();

// ============================================================
// CORS
// ============================================================

app.use(
    cors({
        origin: [
            "http://localhost:5173",
            "http://localhost:5174",
            "https://skillbridge-sand-three.vercel.app",
        ],

        credentials: true,

        methods: [
            "GET",
            "POST",
            "PUT",
            "PATCH",
            "DELETE",
            "OPTIONS"
        ],

        allowedHeaders: [
            "Content-Type",
            "Authorization"
        ]
    })
);

// ============================================================
// BODY PARSER
// ============================================================

app.use(express.json());

app.use(
    express.urlencoded({
        extended: true
    })
);

// ============================================================
// REQUEST LOGGER
// ============================================================

app.use((req, res, next) => {
    console.log(
        `📡 ${req.method} ${req.originalUrl}`
    );

    next();
});

// ============================================================
// HOME / HEALTH CHECK
// ============================================================

app.get("/", (req, res) => {
    res.status(200).json({
        success: true,
        message: "SkillBridge Backend is Running 🚀",
        problemStatement: "SIH Problem Statement 26044"
    });
});

// ============================================================
// API ROUTES
// ============================================================

// -------------------------
// AUTHENTICATION
// -------------------------

app.use(
    "/api/auth",
    authRoutes
);

// -------------------------
// STUDENT
// -------------------------

app.use(
    "/api/students",
    studentRoutes
);

// -------------------------
// ASSESSMENTS
// -------------------------

app.use(
    "/api/assessments",
    assessmentRoutes
);

// -------------------------
// INDUSTRY
// -------------------------

app.use(
    "/api/industry",
    industryRoutes
);

// -------------------------
// INTERNSHIPS
// -------------------------

app.use(
    "/api/internships",
    internshipRoutes
);

// -------------------------
// INDUSTRY APPLICATIONS
// -------------------------

app.use(
    "/api/industry/applications",
    industryApplicationRoutes
);

// -------------------------
// AI
// -------------------------

app.use(
    "/api/ai",
    aiRoutes
);

// -------------------------
// PLACEMENT
// -------------------------

app.use(
    "/api/placement",
    placementRoutes
);

// ============================================================
// 404 ROUTE
// ============================================================

app.use((req, res) => {
    res.status(404).json({
        success: false,
        message: `Route Not Found: ${req.method} ${req.originalUrl}`,
        path: req.originalUrl
    });
});

// ============================================================
// GLOBAL ERROR HANDLER
// ============================================================

app.use(errorHandler);
// ============================================================
// SERVER
// ============================================================

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log("======================================");
    console.log("🚀 SkillBridge Backend Started");
    console.log(`🌐 Server: http://localhost:${PORT}`);
    console.log("📚 SIH Problem Statement: 26044");
    console.log("🔐 Authentication: /api/auth");
    console.log("🎓 Students: /api/students");
    console.log("🧠 Assessments: /api/assessments");
    console.log("🏢 Industry: /api/industry");
    console.log("💼 Internships: /api/internships");
    console.log("🤖 AI: /api/ai");
    console.log("======================================");
});