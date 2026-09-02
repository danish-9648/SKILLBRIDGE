const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true
        },

        email: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            trim: true
        },

        password: {
            type: String,
            required: true,
            minlength: 6
        },

        role: {
            type: String,
            enum: [
                "STUDENT",
                "INDUSTRY",
                "ACADEMICIAN",
                "INSTITUTION",
                "ADMIN"
            ],
            default: "STUDENT"
        },

        isActive: {
            type: Boolean,
            default: true
        }
    },
    {
        timestamps: true
    }
);

// Password hashing
userSchema.pre("save", async function () {
    if (!this.isModified("password")) {
        return;
    }

    this.password = await bcrypt.hash(
        this.password,
        10
    );
});

// Password comparison
userSchema.methods.comparePassword = async function (
    enteredPassword
) {
    return bcrypt.compare(
        enteredPassword,
        this.password
    );
};

module.exports =
    mongoose.models.User ||
    mongoose.model("User", userSchema);