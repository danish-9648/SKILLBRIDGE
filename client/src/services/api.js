
const API_BASE_URL =
    import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api";

const request = async (endpoint, options = {}) => {
    const token = localStorage.getItem("token");

    const headers = {
        "Content-Type": "application/json",
        ...(options.headers || {}),
    };

    if (token) {
        headers.Authorization = `Bearer ${token}`;
    }

    const response = await fetch(
        `${API_BASE_URL}${endpoint}`,
        {
            ...options,
            headers,
        }
    );

    const contentType =
        response.headers.get("content-type");

    let data;

    if (
        contentType &&
        contentType.includes("application/json")
    ) {
        data = await response.json();
    } else {
        const text = await response.text();

        data = {
            message: text,
        };
    }

    if (!response.ok) {
        throw new Error(
            data?.message ||
                `Request failed with status ${response.status}`
        );
    }

    return data;
};

/* ============================================================
   AUTH
============================================================ */

export const registerUser = async (userData) => {
    return request("/auth/register", {
        method: "POST",
        body: JSON.stringify(userData),
    });
};

export const loginUser = async (credentials) => {
    return request("/auth/login", {
        method: "POST",
        body: JSON.stringify(credentials),
    });
};

export const getCurrentUser = async () => {
    return request("/auth/me");
};

export const logoutUser = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
};

/* ============================================================
   STUDENT
============================================================ */

export const getStudentDashboard = async () => {
    return request("/students/dashboard");
};

export const getStudentProfile = async () => {
    return request("/students/profile");
};

export const updateStudentProfile = async (profileData) => {
    return request("/students/profile", {
        method: "PUT",
        body: JSON.stringify(profileData),
    });
};

export const addStudentSkill = async (skillData) => {
    return request("/students/skills", {
        method: "POST",
        body: JSON.stringify(skillData),
    });
};

export const removeStudentSkill = async (skillId) => {
    if (!skillId) {
        throw new Error("Skill ID is required.");
    }

    return request(
        `/students/skills/${skillId}`,
        {
            method: "DELETE",
        }
    );
};

/* ============================================================
   PLACEMENT
============================================================ */

export const getPlacementReadiness = async () => {
    return request("/placement/readiness");
};

export const getPlacementRecommendations = async () => {
    return request("/placement/recommendations");
};

/* ============================================================
   ASSESSMENTS
============================================================ */

export const getAssessmentQuestions = async (skillId) => {
    if (!skillId) {
        throw new Error("Skill ID is required.");
    }

    return request(
        `/assessments/questions/${skillId}`
    );
};

export const startAssessment = async (skillId) => {
    if (!skillId) {
        throw new Error("Skill ID is required.");
    }

    return request("/assessments/start", {
        method: "POST",
        body: JSON.stringify({
            skillId,
        }),
    });
};

export const submitAssessment = async (
    assessmentId,
    answers
) => {
    if (!assessmentId) {
        throw new Error(
            "Assessment ID is required."
        );
    }

    if (!Array.isArray(answers)) {
        throw new Error(
            "Answers must be an array."
        );
    }

    return request(
        `/assessments/${assessmentId}/submit`,
        {
            method: "POST",
            body: JSON.stringify({
                answers,
            }),
        }
    );
};

export const getAssessmentResult = async (
    assessmentId
) => {
    if (!assessmentId) {
        throw new Error(
            "Assessment ID is required."
        );
    }

    return request(
        `/assessments/${assessmentId}`
    );
};

export const getMyAssessments = async () => {
    return request("/assessments/my");
};

/* ============================================================
   STUDENT INTERNSHIPS
============================================================ */

export const getAllInternships = async () => {
    return request("/internships");
};

export const getRecommendedInternships = async () => {
    return request(
        "/internships/recommendations"
    );
};

export const getInternshipDetails = async (
    internshipId
) => {
    if (!internshipId) {
        throw new Error(
            "Internship ID is required."
        );
    }

    return request(
        `/internships/${internshipId}`
    );
};

export const applyForInternship = async (
    internshipId,
    coverLetter = ""
) => {
    if (!internshipId) {
        throw new Error(
            "Internship ID is required."
        );
    }

    return request(
        `/internships/${internshipId}/apply`,
        {
            method: "POST",
            body: JSON.stringify({
                coverLetter,
            }),
        }
    );
};

export const getMyApplications = async () => {
    return request(
        "/internships/applications"
    );
};

/* ============================================================
   INDUSTRY
============================================================ */

export const getIndustryDashboard = async () => {
    return request("/industry/dashboard");
};

export const getIndustryProfile = async () => {
    return request("/industry/profile");
};

export const updateIndustryProfile = async (
    profileData
) => {
    return request("/industry/profile", {
        method: "PUT",
        body: JSON.stringify(profileData),
    });
};

export const createInternship = async (
    internshipData
) => {
    return request("/industry/internships", {
        method: "POST",
        body: JSON.stringify(internshipData),
    });
};

export const getMyInternships = async () => {
    return request("/industry/internships");
};

/* ============================================================
   INDUSTRY APPLICATIONS
============================================================ */

export const getIndustryApplicationDashboard =
    async () => {
        return request(
            "/industry/applications/dashboard"
        );
    };

export const getIndustryApplications =
    async () => {
        return request(
            "/industry/applications"
        );
    };

export const getInternshipApplications =
    async (internshipId) => {
        if (!internshipId) {
            throw new Error(
                "Internship ID is required."
            );
        }

        return request(
            `/industry/applications/internships/${internshipId}/applications`
        );
    };

export const getApplicationDetails =
    async (applicationId) => {
        if (!applicationId) {
            throw new Error(
                "Application ID is required."
            );
        }

        return request(
            `/industry/applications/${applicationId}`
        );
    };

export const updateApplicationStatus =
    async (
        applicationId,
        status
    ) => {
        if (!applicationId) {
            throw new Error(
                "Application ID is required."
            );
        }

        return request(
            `/industry/applications/${applicationId}/status`,
            {
                method: "PATCH",
                body: JSON.stringify({
                    status,
                }),
            }
        );
    };

export const bulkUpdateApplicationStatus =
    async (
        applicationIds,
        status
    ) => {
        if (
            !Array.isArray(applicationIds) ||
            applicationIds.length === 0
        ) {
            throw new Error(
                "At least one application ID is required."
            );
        }

        return request(
            "/industry/applications/bulk/status",
            {
                method: "PATCH",
                body: JSON.stringify({
                    applicationIds,
                    status,
                }),
            }
        );
    };

export const getInternshipApplicationStats =
    async (internshipId) => {
        if (!internshipId) {
            throw new Error(
                "Internship ID is required."
            );
        }

        return request(
            `/industry/applications/internships/${internshipId}/stats`
        );
    };

/* ============================================================
   AI
============================================================ */

export const requestAI = async (
    message,
    context = {}
) => {
    if (!message) {
        throw new Error(
            "Message is required."
        );
    }

    return request("/ai/chat", {
        method: "POST",
        body: JSON.stringify({
            message,
            context,
        }),
    });
};

export const analyzeSkillGap = async (data) => {
    return request("/ai/skill-gap", {
        method: "POST",
        body: JSON.stringify(data),
    });
};

export const generateCareerRoadmap =
    async (data) => {
        return request(
            "/ai/career-roadmap",
            {
                method: "POST",
                body: JSON.stringify(data),
            }
        );
    };

/* ============================================================
   UTILITIES
============================================================ */

export const getToken = () => {
    return localStorage.getItem("token");
};

export const getStoredUser = () => {
    const user =
        localStorage.getItem("user");

    if (!user) {
        return null;
    }

    try {
        return JSON.parse(user);
    } catch {
        return null;
    }
};

export const isAuthenticated = () => {
    return Boolean(
        localStorage.getItem("token")
    );
};

/* ============================================================
   DEFAULT API OBJECT
============================================================ */

const api = {
    registerUser,
    loginUser,
    getCurrentUser,
    logoutUser,

    getStudentDashboard,
    getStudentProfile,
    updateStudentProfile,
    addStudentSkill,
    removeStudentSkill,

    getPlacementReadiness,
    getPlacementRecommendations,

    getAssessmentQuestions,
    startAssessment,
    submitAssessment,
    getAssessmentResult,
    getMyAssessments,

    getAllInternships,
    getRecommendedInternships,
    getInternshipDetails,
    applyForInternship,
    getMyApplications,

    getIndustryDashboard,
    getIndustryProfile,
    updateIndustryProfile,
    createInternship,
    getMyInternships,

    getIndustryApplicationDashboard,
    getIndustryApplications,
    getInternshipApplications,
    getApplicationDetails,
    updateApplicationStatus,
    bulkUpdateApplicationStatus,
    getInternshipApplicationStats,

    requestAI,
    analyzeSkillGap,
    generateCareerRoadmap,

    getToken,
    getStoredUser,
    isAuthenticated,
};

export default api;

