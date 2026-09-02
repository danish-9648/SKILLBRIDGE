const Assessment = require("../models/Assessment");

const {
    getQuestions,
    calculateResults,
    updateStudentSkills
} = require("../services/assessmentService");

// ========================================
// START ASSESSMENT
// ========================================

const startAssessment = async (req, res) => {
    try {
        const studentId = req.user._id;

        const assessment = await Assessment.create({
            student: studentId,
            status: "IN_PROGRESS"
        });

        return res.status(201).json({
            success: true,
            message: "Assessment started successfully",
            assessmentId: assessment._id,
            totalQuestions: getQuestions().length,
            questions: getQuestions()
        });

    } catch (error) {
        console.error(
            "Start Assessment Error:",
            error
        );

        return res.status(500).json({
            success: false,
            message: "Server error while starting assessment"
        });
    }
};

// ========================================
// SUBMIT ASSESSMENT
// ========================================

const submitAssessment = async (req, res) => {
    try {
        const studentId = req.user._id;
        const { assessmentId } = req.params;
        const { answers } = req.body;

        if (!answers || !Array.isArray(answers)) {
            return res.status(400).json({
                success: false,
                message: "Answers must be provided as an array"
            });
        }

        const assessment = await Assessment.findOne({
            _id: assessmentId,
            student: studentId
        });

        if (!assessment) {
            return res.status(404).json({
                success: false,
                message: "Assessment not found"
            });
        }

        if (assessment.status === "COMPLETED") {
            return res.status(400).json({
                success: false,
                message: "This assessment has already been completed"
            });
        }

        const results = calculateResults(answers);

        assessment.answers = results.processedAnswers;

        assessment.skillResults =
            results.skillResults;

        assessment.overallScore =
            results.overallScore;

        assessment.strengths =
            results.strengths;

        assessment.skillGaps =
            results.skillGaps;

        assessment.status = "COMPLETED";

        assessment.completedAt = new Date();

        // Update student's profile
        await updateStudentSkills(
            studentId,
            results.skillResults
        );

        // Simple career recommendation
        assessment.recommendedCareer =
            calculateCareerRecommendation(
                results.skillResults
            );

        await assessment.save();

        return res.status(200).json({
            success: true,
            message: "Assessment completed successfully",

            result: {
                assessmentId: assessment._id,
                overallScore: assessment.overallScore,
                strengths: assessment.strengths,
                skillGaps: assessment.skillGaps,
                recommendedCareer:
                    assessment.recommendedCareer,
                skillResults:
                    assessment.skillResults
            }
        });

    } catch (error) {
        console.error(
            "Submit Assessment Error:",
            error
        );

        return res.status(500).json({
            success: false,
            message: "Server error while submitting assessment"
        });
    }
};

// ========================================
// GET ASSESSMENT RESULT
// ========================================

const getAssessmentResult = async (req, res) => {
    try {
        const studentId = req.user._id;
        const { assessmentId } = req.params;

        const assessment =
            await Assessment.findOne({
                _id: assessmentId,
                student: studentId
            });

        if (!assessment) {
            return res.status(404).json({
                success: false,
                message: "Assessment not found"
            });
        }

        return res.status(200).json({
            success: true,
            result: {
                assessmentId: assessment._id,
                status: assessment.status,
                overallScore:
                    assessment.overallScore,
                strengths:
                    assessment.strengths,
                skillGaps:
                    assessment.skillGaps,
                recommendedCareer:
                    assessment.recommendedCareer,
                skillResults:
                    assessment.skillResults,
                completedAt:
                    assessment.completedAt
            }
        });

    } catch (error) {
        console.error(
            "Get Assessment Result Error:",
            error
        );

        return res.status(500).json({
            success: false,
            message:
                "Server error while fetching assessment result"
        });
    }
};

// ========================================
// CAREER RECOMMENDATION
// ========================================

const calculateCareerRecommendation = (
    skillResults
) => {
    const scoreMap = {};

    skillResults.forEach((skill) => {
        scoreMap[skill.skill] = skill.score;
    });

    const fullStackSkills = [
        "JavaScript",
        "React",
        "Node.js",
        "MongoDB"
    ];

    const softwareDeveloperSkills = [
        "JavaScript",
        "Problem Solving",
        "Git",
        "REST API"
    ];

    const fullStackScore =
        calculateAverage(
            fullStackSkills,
            scoreMap
        );

    const softwareDeveloperScore =
        calculateAverage(
            softwareDeveloperSkills,
            scoreMap
        );

    if (fullStackScore >= 65) {
        return "Full Stack Developer";
    }

    if (softwareDeveloperScore >= 60) {
        return "Software Developer";
    }

    return "Software Development Trainee";
};

// ========================================
// AVERAGE SCORE
// ========================================

const calculateAverage = (
    skills,
    scoreMap
) => {
    const availableScores = skills
        .filter(
            (skill) =>
                scoreMap[skill] !== undefined
        )
        .map(
            (skill) =>
                scoreMap[skill]
        );

    if (availableScores.length === 0) {
        return 0;
    }

    return Math.round(
        availableScores.reduce(
            (sum, score) => sum + score,
            0
        ) / availableScores.length
    );
};

module.exports = {
    startAssessment,
    submitAssessment,
    getAssessmentResult
};