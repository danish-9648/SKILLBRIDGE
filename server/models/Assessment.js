const mongoose = require("mongoose");

const answerSchema = new mongoose.Schema(
    {
        questionId: {
            type: String,
            required: true
        },

        skill: {
            type: String,
            required: true
        },

        selectedAnswer: {
            type: String,
            required: true
        },

        correct: {
            type: Boolean,
            default: false
        },

        points: {
            type: Number,
            default: 0
        }
    },
    {
        _id: false
    }
);

const skillResultSchema = new mongoose.Schema(
    {
        skill: {
            type: String,
            required: true
        },

        category: {
            type: String,
            required: true
        },

        score: {
            type: Number,
            min: 0,
            max: 100,
            default: 0
        },

        correctAnswers: {
            type: Number,
            default: 0
        },

        totalQuestions: {
            type: Number,
            default: 0
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
        }
    },
    {
        _id: false
    }
);

const assessmentSchema = new mongoose.Schema(
    {
        student: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        },

        status: {
            type: String,
            enum: [
                "IN_PROGRESS",
                "COMPLETED"
            ],
            default: "IN_PROGRESS"
        },

        answers: [answerSchema],

        skillResults: [skillResultSchema],

        overallScore: {
            type: Number,
            min: 0,
            max: 100,
            default: 0
        },

        strengths: [
            {
                type: String
            }
        ],

        skillGaps: [
            {
                type: String
            }
        ],

        recommendedCareer: {
            type: String,
            default: null
        },

        startedAt: {
            type: Date,
            default: Date.now
        },

        completedAt: {
            type: Date
        }
    },
    {
        timestamps: true
    }
);

module.exports = mongoose.model(
    "Assessment",
    assessmentSchema
);