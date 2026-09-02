
const StudentProfile = require("../models/StudentProfile");
const questions = require("./assessmentQuestions");

// ============================================================
// NORMALIZE SKILL NAME
// ============================================================

const normalizeSkillName = (name) => {
    if (!name) return "";

    return String(name)
        .trim()
        .toLowerCase()
        .replace(/\s+/g, " ");
};

// ============================================================
// GET PUBLIC QUESTIONS
// ============================================================

const getQuestions = () => {
    return questions.map((question) => ({
        id: question.id,
        skill: question.skill,
        category: question.category,
        question: question.question,
        options: question.options
    }));
};

// ============================================================
// CALCULATE LEVEL
// ============================================================

const calculateLevel = (score) => {
    if (score >= 90) return "EXPERT";
    if (score >= 75) return "ADVANCED";
    if (score >= 50) return "INTERMEDIATE";
    return "BEGINNER";
};

// ============================================================
// CALCULATE ASSESSMENT RESULTS
// ============================================================

const calculateResults = (answers) => {
    const skillMap = {};

    let totalPoints = 0;
    let earnedPoints = 0;

    const processedAnswers = answers
        .map((answer) => {
            const question = questions.find(
                (q) => q.id === answer.questionId
            );

            if (!question) {
                return null;
            }

            const isCorrect =
                answer.selectedAnswer ===
                question.correctAnswer;

            const points = isCorrect ? 1 : 0;

            totalPoints += 1;

            if (isCorrect) {
                earnedPoints += 1;
            }

            // Create skill bucket
            if (!skillMap[question.skill]) {
                skillMap[question.skill] = {
                    skill: question.skill,
                    category: question.category,
                    correctAnswers: 0,
                    totalQuestions: 0
                };
            }

            skillMap[question.skill].totalQuestions += 1;

            if (isCorrect) {
                skillMap[question.skill].correctAnswers += 1;
            }

            return {
                questionId: question.id,
                skill: question.skill,
                selectedAnswer: answer.selectedAnswer,
                correct: isCorrect,
                points
            };
        })
        .filter(Boolean);

    // ========================================================
    // SKILL RESULTS
    // ========================================================

    const skillResults = Object.values(skillMap).map((result) => {
        const score =
            result.totalQuestions === 0
                ? 0
                : Math.round(
                    (result.correctAnswers /
                        result.totalQuestions) *
                    100
                );

        return {
            skill: result.skill,
            category: result.category,
            score,
            correctAnswers: result.correctAnswers,
            totalQuestions: result.totalQuestions,
            level: calculateLevel(score)
        };
    });

    // ========================================================
    // OVERALL SCORE
    // ========================================================

    const overallScore =
        totalPoints === 0
            ? 0
            : Math.round(
                (earnedPoints / totalPoints) * 100
            );

    // ========================================================
    // STRENGTHS
    // ========================================================

    const strengths = skillResults
        .filter((skill) => skill.score >= 75)
        .sort((a, b) => b.score - a.score)
        .map((skill) => skill.skill);

    // ========================================================
    // SKILL GAPS
    // ========================================================

    const skillGaps = skillResults
        .filter((skill) => skill.score < 60)
        .sort((a, b) => a.score - b.score)
        .map((skill) => skill.skill);

    return {
        processedAnswers,
        skillResults,
        overallScore,
        strengths,
        skillGaps
    };
};

// ============================================================
// UPDATE STUDENT PROFILE WITH ASSESSMENT RESULTS
// ============================================================

const updateStudentSkills = async (
    studentId,
    skillResults
) => {
    console.log("\n========================================");
    console.log("🧠 Updating Student Skill Profile");
    console.log("Student:", studentId);
    console.log("========================================");

    // ========================================================
    // FIND PROFILE
    // ========================================================

    let profile = await StudentProfile.findOne({
        user: studentId
    });

    // ========================================================
    // CREATE PROFILE IF MISSING
    // ========================================================

    if (!profile) {
        console.log(
            "⚠️ StudentProfile not found. Creating..."
        );

        profile = new StudentProfile({
            user: studentId,
            skills: [],
            preferredDomains: [],
            careerGoal: "",
            profileCompletion: 20
        });
    }

    // ========================================================
    // SAFETY CHECK
    // ========================================================

    if (!Array.isArray(profile.skills)) {
        profile.skills = [];
    }

    // ========================================================
    // UPDATE SKILLS
    // ========================================================

    for (const result of skillResults) {
        const normalizedResultSkill =
            normalizeSkillName(result.skill);

        const existingSkill =
            profile.skills.find(
                (skill) =>
                    normalizeSkillName(skill.name) ===
                    normalizedResultSkill
            );

        if (existingSkill) {
            console.log(
                `📊 Updating ${result.skill}: ${existingSkill.score}% → ${result.score}%`
            );

            existingSkill.score =
                Number(result.score);

            existingSkill.level =
                result.level;

            existingSkill.category =
                result.category;
        } else {
            console.log(
                `➕ Adding new skill: ${result.skill}`
            );

            profile.skills.push({
                name: result.skill,
                category: result.category || "TECHNICAL",
                score: Number(result.score),
                level: result.level || "BEGINNER"
            });
        }
    }

    // ========================================================
    // UPDATE PROFILE COMPLETION
    // ========================================================

    if (profile.skills.length > 0) {
        const completedSkills =
            profile.skills.filter(
                (skill) =>
                    Number(skill.score || 0) > 0
            ).length;

        const skillCompletion =
            Math.round(
                (completedSkills /
                    profile.skills.length) *
                100
            );

        profile.profileCompletion =
            Math.max(
                Number(profile.profileCompletion || 0),
                skillCompletion
            );
    }

    // ========================================================
    // SAVE
    // ========================================================

    await profile.save();

    console.log("\n✅ StudentProfile saved successfully");

    // ========================================================
    // VERIFY
    // ========================================================

    const verifiedProfile =
        await StudentProfile.findOne({
            user: studentId
        }).lean();

    console.log("📚 Skills now stored in MongoDB:");

    verifiedProfile.skills.forEach((skill, index) => {
        console.log(
            `   ${index + 1}. ${skill.name} → ${skill.score}% (${skill.level})`
        );
    });

    console.log(
        "📊 Total skills:",
        verifiedProfile.skills.length
    );

    console.log("========================================\n");

    return verifiedProfile;
};

// ============================================================
// EXPORT
// ============================================================

module.exports = {
    getQuestions,
    calculateResults,
    updateStudentSkills,
    calculateLevel,
    normalizeSkillName
};

