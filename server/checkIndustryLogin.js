require("dotenv").config();

const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const connectDB = require("./config/db");
const User = require("./models/user");

async function checkIndustryLogin() {
    try {
        await connectDB();

        // ==========================================
        // USE THE SAME EMAIL & PASSWORD
        // YOU USED DURING RESET
        // ==========================================

        const email = "industry@technova.com";
        const password = "123456";

        // ==========================================
        // FIND USER
        // ==========================================

        const user = await User.findOne({
            email: email.toLowerCase()
        });

        if (!user) {
            console.log("❌ INDUSTRY USER NOT FOUND");
            console.log("Email:", email);

            await mongoose.connection.close();
            return;
        }

        console.log("");
        console.log("========== USER FOUND ==========");
        console.log("Name:", user.name);
        console.log("Email:", user.email);
        console.log("Role:", user.role);
        console.log("Active:", user.isActive);
        console.log("Password hash exists:", !!user.password);

        // ==========================================
        // CHECK PASSWORD
        // ==========================================

        const passwordMatch = await bcrypt.compare(
            password,
            user.password
        );

        console.log("");
        console.log("========== PASSWORD CHECK ==========");
        console.log("Password Match:", passwordMatch);

        console.log("");
        console.log("========== ROLE CHECK ==========");
        console.log(
            "Is INDUSTRY:",
            user.role === "INDUSTRY"
        );

        await mongoose.connection.close();

    } catch (error) {
        console.error("❌ ERROR:", error);

        try {
            await mongoose.connection.close();
        } catch (e) {}
    }
}

checkIndustryLogin();