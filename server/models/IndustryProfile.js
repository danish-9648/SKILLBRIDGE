const mongoose = require("mongoose");

const industryProfileSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
            unique: true
        },

        companyName: {
            type: String,
            required: true,
            trim: true
        },

        industryType: {
            type: String,
            trim: true
        },

        description: {
            type: String,
            maxlength: 1000
        },

        website: {
            type: String,
            trim: true
        },

        email: {
            type: String,
            trim: true
        },

        phone: {
            type: String,
            trim: true
        },

        location: {
            city: String,
            state: String,
            country: {
                type: String,
                default: "India"
            }
        },

        companySize: {
            type: String,
            enum: [
                "STARTUP",
                "SMALL",
                "MEDIUM",
                "LARGE",
                "ENTERPRISE"
            ]
        },

        verificationStatus: {
            type: String,
            enum: [
                "PENDING",
                "VERIFIED",
                "REJECTED"
            ],
            default: "PENDING"
        }
    },
    {
        timestamps: true
    }
);

module.exports = mongoose.model(
    "IndustryProfile",
    industryProfileSchema
);