const mongoose = require("mongoose");
const Internship = require("../models/Internship");

const MONGO_URI =
    "mongodb://127.0.0.1:27017/skillbridge";

const INDUSTRY_ID =
    "6a8f0d17405fceef491b19a5";

const run = async () => {
    try {
        await mongoose.connect(MONGO_URI);

        console.log("MongoDB connected.");

        const internships = await Internship.find({
            industry: INDUSTRY_ID
        }).select(
            "_id title domain status industry"
        );

        console.log(
            `Found ${internships.length} internships.`
        );

        console.log(
            JSON.stringify(
                internships,
                null,
                2
            )
        );

        await mongoose.disconnect();
    } catch (error) {
        console.error(error);
        process.exit(1);
    }
};

run();