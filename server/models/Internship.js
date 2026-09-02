const mongoose = require("mongoose");

const internshipSchema = new mongoose.Schema(
    {
        // =====================================================
        // INDUSTRY / COMPANY
        // =====================================================

        industry: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
            index: true
        },

        // =====================================================
        // BASIC INFORMATION
        // =====================================================

        title: {
            type: String,
            required: true,
            trim: true
        },

        description: {
            type: String,
            required: true,
            trim: true
        },

        domain: {
            type: String,
            required: true,
            trim: true,
            index: true
        },

        // =====================================================
        // REQUIRED SKILLS
        // =====================================================

        requiredSkills: {
            type: [String],
            required: true,
            validate: {
                validator: function (skills) {
                    return (
                        Array.isArray(skills) &&
                        skills.length > 0
                    );
                },
                message:
                    "At least one required skill is needed"
            }
        },

        // =====================================================
        // ELIGIBILITY
        // =====================================================

        eligibility: {
            type: String,
            default: "",
            trim: true
        },

        // =====================================================
        // INTERNSHIP TYPE
        // =====================================================

        internshipType: {
            type: String,

            enum: [
                "INTERNSHIP",
                "FULL_TIME",
                "PART_TIME",
                "APPRENTICESHIP"
            ],

            default: "INTERNSHIP"
        },

        // =====================================================
        // WORK MODE
        // =====================================================

        workMode: {
            type: String,

            enum: [
                "REMOTE",
                "ONSITE",
                "HYBRID"
            ],

            default: "REMOTE"
        },

        // =====================================================
        // LOCATION
        // =====================================================

        location: {
            type: String,
            default: "",
            trim: true
        },

        // =====================================================
        // DURATION
        // =====================================================

        duration: {
            type: String,
            default: "",
            trim: true
        },

        // =====================================================
        // STIPEND
        // =====================================================

        stipend: {
            type: String,
            default: "",
            trim: true
        },

        // =====================================================
        // OPENINGS
        // =====================================================

        openings: {
            type: Number,
            default: 1,
            min: 1
        },

        // =====================================================
        // APPLICATION COUNT
        // =====================================================

        applicationsCount: {
            type: Number,
            default: 0,
            min: 0
        },

        // =====================================================
        // APPLICATION DEADLINE
        // =====================================================

        applicationDeadline: {
            type: Date
        },

        // =====================================================
        // STATUS
        // =====================================================

        status: {
            type: String,

            enum: [
                "DRAFT",
                "OPEN",
                "CLOSED"
            ],

            default: "OPEN",

            index: true
        },

        // =====================================================
        // FEATURED
        // =====================================================

        featured: {
            type: Boolean,
            default: false
        }
    },

    {
        timestamps: true
    }
);


// ============================================================
// INDEXES
// ============================================================

internshipSchema.index({
    domain: 1,
    status: 1
});

internshipSchema.index({
    requiredSkills: 1
});

internshipSchema.index({
    industry: 1,
    createdAt: -1
});


// ============================================================
// MODEL
// ============================================================

module.exports =
    mongoose.model(
        "Internship",
        internshipSchema
    );