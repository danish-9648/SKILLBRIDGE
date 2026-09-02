require("dotenv").config();

const mongoose = require("mongoose");

const connectDB = require("./config/db");
const User = require("./models/user");

async function resetStudentPassword() {
    try {
        // Connect to MongoDB
        await connectDB();

        // ==========================================
        // CHANGE THESE VALUES
        // ==========================================

        const email = "student@test.com";
        const newPassword = "Student@123";

        // ==========================================
        // FIND STUDENT USER
        // ==========================================

        const user = await User.findOne({
            email: email.toLowerCase(),
            role: "STUDENT"
        });

        if (!user) {
            console.log("❌ Student user not found");
            console.log("Email:", email);

            await mongoose.connection.close();
            return;
        }

        console.log("✅ Student user found");
        console.log("Name:", user.name);
        console.log("Email:", user.email);
        console.log("Role:", user.role);

        // ==========================================
        // RESET PASSWORD
        // User model automatically hashes password
        // ==========================================

        user.password = newPassword;

        await user.save();

        // ==========================================
        // SUCCESS
        // ==========================================

        console.log("");
        console.log("======================================");
        console.log("✅ STUDENT PASSWORD RESET SUCCESSFUL");
        console.log("======================================");
        console.log("Email:", user.email);
        console.log("New Password:", newPassword);
        console.log("Role:", user.role);
        console.log("======================================");

        await mongoose.connection.close();

    } catch (error) {
        console.error("❌ Password reset failed:");
        console.error(error);

        try {
            await mongoose.connection.close();
        } catch (e) {}
    }
}

resetStudentPassword();