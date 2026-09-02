const mongoose = require("mongoose");

const skillSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true
        },

        category: {
            type: String,
            enum: [
                "TECHNICAL",
                "SOFT_SKILL",
                "TOOLS",
                "DOMAIN"
            ],
            default: "TECHNICAL"
        },

        level: {
            type: String,
            enum: [
                "BEGINNER",
                "INTERMEDIATE",
                "ADVANCED",
                "EXPERT"
            ],
            default: "BEGINNER"
        },

        score: {
            type: Number,
            min: 0,
            max: 100,
            default: 0
        }
    },
    {
        _id: false
    }
);

const educationSchema = new mongoose.Schema(
    {
        degree: {
            type: String,
            trim: true
        },

        institution: {
            type: String,
            trim: true
        },

        fieldOfStudy: {
            type: String,
            trim: true
        },

        startYear: {
            type: Number
        },

        endYear: {
            type: Number
        },

        cgpa: {
            type: Number,
            min: 0,
            max: 10
        }
    },
    {
        _id: false
    }
);

const projectSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            trim: true
        },

        description: {
            type: String,
            trim: true
        },

        technologies: [
            {
                type: String,
                trim: true
            }
        ],

        projectUrl: {
            type: String,
            trim: true
        }
    }
);

const certificationSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            trim: true
        },

        issuingOrganization: {
            type: String,
            trim: true
        },

        issueDate: {
            type: Date
        },

        credentialUrl: {
            type: String,
            trim: true
        }
    }
);

const studentProfileSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
            unique: true
        },

        phone: {
            type: String,
            trim: true
        },

        dateOfBirth: {
            type: Date
        },

        gender: {
            type: String,
            enum: [
                "MALE",
                "FEMALE",
                "OTHER",
                "PREFER_NOT_TO_SAY"
            ]
        },

        location: {
            city: {
                type: String,
                trim: true
            },

            state: {
                type: String,
                trim: true
            },

            country: {
                type: String,
                trim: true,
                default: "India"
            }
        },

        bio: {
            type: String,
            maxlength: 500
        },

        careerGoal: {
            type: String,
            trim: true
        },

        preferredDomains: [
            {
                type: String,
                trim: true
            }
        ],

        skills: [skillSchema],

        education: [educationSchema],

        projects: [projectSchema],

        certifications: [certificationSchema],

        achievements: [
            {
                type: String,
                trim: true
            }
        ],

        resumeUrl: {
            type: String,
            trim: true
        },

        profileCompletion: {
            type: Number,
            min: 0,
            max: 100,
            default: 0
        }
    },
    {
        timestamps: true
    }
);

module.exports = mongoose.model(
    "StudentProfile",
    studentProfileSchema
);