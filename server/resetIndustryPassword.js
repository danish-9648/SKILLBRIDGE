require("dotenv").config();

const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const connectDB = require("./config/db");
const User = require("./models/user");

async function resetIndustryPassword() {
    try {
        await connectDB();

        // ==========================================
        // CHANGE THESE VALUES
        // ==========================================

        const email = "industry@technova.com";
        const newPassword = "123456";

        // ==========================================
        // FIND INDUSTRY USER
        // ==========================================

        const user = await User.findOne({
            email: email.toLowerCase(),
            role: "INDUSTRY"
        });

        if (!user) {
            console.log("❌ Industry user not found");
            console.log("Email:", email);

            await mongoose.connection.close();
            return;
        }

        console.log("✅ Industry user found");
        console.log("Name:", user.name);
        console.log("Email:", user.email);
        console.log("Role:", user.role);

        // ==========================================
        // RESET PASSWORD
        // ==========================================

        user.password = await bcrypt.hash(newPassword, 10);

        await user.save();

        console.log("");
        console.log("======================================");
        console.log("✅ PASSWORD RESET SUCCESSFUL");
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

resetIndustryPassword();