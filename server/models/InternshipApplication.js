const mongoose = require("mongoose");

// ========================================
// MATCHED SKILL SCHEMA
// ========================================

const matchingSkillSchema = new mongoose.Schema(
    {
        skill: {
            type: String,
            required: true
        },

        studentScore: {
            type: Number,
            default: 0,
            min: 0,
            max: 100
        },

        minimumScore: {
            type: Number,
            default: 0,
            min: 0,
            max: 100
        },

        level: {
            type: String,
            default: "BEGINNER"
        },

        requiredLevel: {
            type: String,
            default: "BEGINNER"
        }
    },
    {
        _id: false
    }
);

// ========================================
// INTERNSHIP APPLICATION SCHEMA
// ========================================

const internshipApplicationSchema =
    new mongoose.Schema(
        {
            // ========================================
            // INTERNSHIP
            // ========================================

            internship: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Internship",
                required: true
            },

            // ========================================
            // STUDENT
            // ========================================

            student: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "User",
                required: true
            },

            // ========================================
            // MATCH SCORE
            // ========================================

            matchScore: {
                type: Number,
                default: 0,
                min: 0,
                max: 100
            },

            // ========================================
            // MATCHING SKILLS
            // ========================================

            matchingSkills: {
                type: [matchingSkillSchema],
                default: []
            },

            // ========================================
            // MISSING SKILLS
            // ========================================

            missingSkills: {
                type: [String],
                default: []
            },

            // ========================================
            // APPLICATION STATUS
            // ========================================

            status: {
                type: String,
                enum: [
                    "APPLIED",
                    "UNDER_REVIEW",
                    "SHORTLISTED",
                    "REJECTED",
                    "ACCEPTED"
                ],
                default: "APPLIED"
            },

            // ========================================
            // COVER LETTER
            // ========================================

            coverLetter: {
                type: String,
                default: ""
            }
        },

        {
            timestamps: true
        }
    );

// ========================================
// PREVENT DUPLICATE APPLICATIONS
// ========================================

internshipApplicationSchema.index(
    {
        internship: 1,
        student: 1
    },
    {
        unique: true
    }
);

// ========================================
// EXPORT MODEL
// ========================================

module.exports =
    mongoose.models.InternshipApplication ||
    mongoose.model(
        "InternshipApplication",
        internshipApplicationSchema
    );