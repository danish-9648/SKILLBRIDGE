
const mongoose = require("mongoose");
const Internship = require("../models/Internship");
const User = require("../models/User");

const MONGO_URI =
    process.env.MONGO_URI || "mongodb://127.0.0.1:27017/skillbridge";

const internships = [
    {
        title: "Full Stack Developer Intern",
        description:
            "Work on modern web applications using React, Node.js and MongoDB. Collaborate with developers to build and improve production-ready features.",
        domain: "Web Development",
        requiredSkills: [
            "JavaScript",
            "React",
            "Node.js",
            "MongoDB",
            "Git"
        ],
        eligibility:
            "B.Tech/BCA/MCA students with basic web development knowledge.",
        internshipType: "INTERNSHIP",
        workMode: "REMOTE",
        location: "Remote",
        duration: "3 Months",
        stipend: "₹15,000/month",
        openings: 3,
        status: "OPEN",
        featured: true
    },

    {
        title: "Frontend Developer Intern",
        description:
            "Build responsive and user-friendly interfaces using HTML, CSS, JavaScript and React.",
        domain: "Frontend Development",
        requiredSkills: [
            "HTML",
            "CSS",
            "JavaScript",
            "React",
            "Git"
        ],
        eligibility:
            "Students interested in frontend development and UI engineering.",
        internshipType: "INTERNSHIP",
        workMode: "HYBRID",
        location: "Lucknow",
        duration: "3 Months",
        stipend: "₹12,000/month",
        openings: 2,
        status: "OPEN",
        featured: true
    },

    {
        title: "Backend Developer Intern",
        description:
            "Develop REST APIs and backend services using Node.js, Express and MongoDB.",
        domain: "Backend Development",
        requiredSkills: [
            "Node.js",
            "Express",
            "MongoDB",
            "REST API",
            "Git"
        ],
        eligibility:
            "Students with knowledge of JavaScript and backend development.",
        internshipType: "INTERNSHIP",
        workMode: "REMOTE",
        location: "Remote",
        duration: "4 Months",
        stipend: "₹18,000/month",
        openings: 2,
        status: "OPEN",
        featured: true
    },

    {
        title: "Python Developer Intern",
        description:
            "Develop Python-based applications and automation tools while working with APIs and databases.",
        domain: "Python Development",
        requiredSkills: [
            "Python",
            "SQL",
            "Git",
            "REST API",
            "Problem Solving"
        ],
        eligibility:
            "Students with basic Python programming knowledge.",
        internshipType: "INTERNSHIP",
        workMode: "REMOTE",
        location: "Remote",
        duration: "3 Months",
        stipend: "₹14,000/month",
        openings: 3,
        status: "OPEN"
    },

    {
        title: "AI/ML Intern",
        description:
            "Work on machine learning projects involving data preprocessing, model development and evaluation.",
        domain: "Artificial Intelligence",
        requiredSkills: [
            "Python",
            "Machine Learning",
            "NumPy",
            "Pandas",
            "Problem Solving"
        ],
        eligibility:
            "Students interested in Artificial Intelligence and Machine Learning.",
        internshipType: "INTERNSHIP",
        workMode: "HYBRID",
        location: "Bengaluru",
        duration: "6 Months",
        stipend: "₹20,000/month",
        openings: 2,
        status: "OPEN",
        featured: true
    },

    {
        title: "Cloud Computing Intern",
        description:
            "Learn cloud deployment, application hosting and basic cloud infrastructure management.",
        domain: "Cloud Computing",
        requiredSkills: [
            "Linux",
            "Git",
            "Docker",
            "AWS",
            "Networking"
        ],
        eligibility:
            "Students interested in cloud technologies and DevOps.",
        internshipType: "INTERNSHIP",
        workMode: "REMOTE",
        location: "Remote",
        duration: "4 Months",
        stipend: "₹16,000/month",
        openings: 2,
        status: "OPEN"
    },

    {
        title: "Software Developer Intern",
        description:
            "Solve programming problems and contribute to software development projects.",
        domain: "Software Development",
        requiredSkills: [
            "JavaScript",
            "Problem Solving",
            "Git",
            "REST API"
        ],
        eligibility:
            "Computer Science and related engineering students.",
        internshipType: "INTERNSHIP",
        workMode: "ONSITE",
        location: "Noida",
        duration: "6 Months",
        stipend: "₹22,000/month",
        openings: 4,
        status: "OPEN",
        featured: true
    },

    {
        title: "Data Analyst Intern",
        description:
            "Analyze datasets, create reports and generate insights using Python and data analysis tools.",
        domain: "Data Science",
        requiredSkills: [
            "Python",
            "SQL",
            "Pandas",
            "Excel",
            "Data Analysis"
        ],
        eligibility:
            "Students interested in data analysis and business intelligence.",
        internshipType: "INTERNSHIP",
        workMode: "HYBRID",
        location: "Gurugram",
        duration: "3 Months",
        stipend: "₹15,000/month",
        openings: 2,
        status: "OPEN"
    },

    {
        title: "DevOps Intern",
        description:
            "Assist with CI/CD pipelines, containerization and cloud deployment workflows.",
        domain: "DevOps",
        requiredSkills: [
            "Linux",
            "Git",
            "Docker",
            "CI/CD",
            "AWS"
        ],
        eligibility:
            "Students interested in DevOps, automation and cloud computing.",
        internshipType: "INTERNSHIP",
        workMode: "REMOTE",
        location: "Remote",
        duration: "4 Months",
        stipend: "₹18,000/month",
        openings: 2,
        status: "OPEN"
    }
];

const seedDatabase = async () => {
    try {
        await mongoose.connect(MONGO_URI);

        console.log("MongoDB connected.");

        const industryUser = await User.findOne({
            role: "INDUSTRY"
        });

        if (!industryUser) {
            console.log(
                "No INDUSTRY user found. Please create an industry account first."
            );

            process.exit(1);
        }

        console.log(
            `Using industry user: ${industryUser._id}`
        );

        await Internship.deleteMany({});

        const internshipData = internships.map(
            (internship) => ({
                ...internship,
                industry: industryUser._id
            })
        );

        await Internship.insertMany(internshipData);

        console.log(
            `Successfully seeded ${internshipData.length} internships.`
        );

        process.exit(0);
    } catch (error) {
        console.error(
            "Internship seeding failed:",
            error
        );

        process.exit(1);
    }
};

seedDatabase();

