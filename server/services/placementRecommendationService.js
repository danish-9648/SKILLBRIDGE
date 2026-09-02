
const Internship = require("../models/Internship");

// ============================================================
// NORMALIZE SKILL
// ============================================================

const normalizeSkill = (skill) => {
    return String(skill || "")
        .trim()
        .toLowerCase();
};


// ============================================================
// CALCULATE INTERNSHIP MATCH
// ============================================================

const calculateInternshipMatch = (
    studentSkills,
    requiredSkills
) => {

    if (
        !Array.isArray(requiredSkills) ||
        requiredSkills.length === 0
    ) {
        return {
            matchScore: 0,
            matchedSkills: [],
            missingSkills: []
        };
    }


    // --------------------------------------------------------
    // Create student skill map
    // --------------------------------------------------------

    const studentSkillMap = new Map();

    studentSkills.forEach((skill) => {

        const skillName =
            normalizeSkill(skill.name);

        const score =
            Number(skill.score || 0);

        studentSkillMap.set(
            skillName,
            score
        );

    });


    // --------------------------------------------------------
    // Compare required skills
    // --------------------------------------------------------

    const matchedSkills = [];
    const missingSkills = [];

    let totalScore = 0;


    requiredSkills.forEach((requiredSkill) => {

        const skillName =
            normalizeSkill(requiredSkill);

        const studentScore =
            studentSkillMap.get(skillName);


        if (
            studentScore !== undefined &&
            studentScore >= 50
        ) {

            matchedSkills.push({
                name: requiredSkill,
                score: studentScore
            });

            totalScore += studentScore;

        } else {

            missingSkills.push(
                requiredSkill
            );

        }

    });


    // --------------------------------------------------------
    // Match score
    // --------------------------------------------------------

    const matchScore = Math.round(
        totalScore /
        requiredSkills.length
    );


    return {
        matchScore,
        matchedSkills,
        missingSkills
    };
};


// ============================================================
// GET RECOMMENDED INTERNSHIPS
// ============================================================

const getRecommendedInternships = async (
    student
) => {

    // --------------------------------------------------------
    // Get open internships
    // --------------------------------------------------------

    const internships =
        await Internship.find({
            status: "OPEN"
        })
        .populate(
            "industry",
            "name companyName email"
        )
        .sort({
            featured: -1,
            createdAt: -1
        });


    // --------------------------------------------------------
    // Student skills
    // --------------------------------------------------------

    const studentSkills =
        student.skills || [];


    // --------------------------------------------------------
    // Calculate recommendation
    // --------------------------------------------------------

    const recommendations =
        internships.map((internship) => {

            const result =
                calculateInternshipMatch(
                    studentSkills,
                    internship.requiredSkills
                );


            return {

                internship,

                matchScore:
                    result.matchScore,

                matchedSkills:
                    result.matchedSkills,

                missingSkills:
                    result.missingSkills

            };

        });


    // --------------------------------------------------------
    // Sort highest match first
    // --------------------------------------------------------

    recommendations.sort(
        (a, b) =>
            b.matchScore -
            a.matchScore
    );


    // --------------------------------------------------------
    // Return top 10
    // --------------------------------------------------------

    return recommendations.slice(
        0,
        10
    );
};


module.exports = {

    calculateInternshipMatch,

    getRecommendedInternships

};
