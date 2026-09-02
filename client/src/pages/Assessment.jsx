import { useEffect, useState } from "react";
import {
    Brain,
    CheckCircle2,
    ArrowRight,
    ArrowLeft,
    Loader2,
    Trophy,
    Target,
    AlertCircle
} from "lucide-react";

function Assessment() {

    const [assessmentId, setAssessmentId] = useState(null);
    const [questions, setQuestions] = useState([]);
    const [currentQuestion, setCurrentQuestion] = useState(0);
    const [answers, setAnswers] = useState({});
    const [result, setResult] = useState(null);

    const [loading, setLoading] = useState(false);
    const [starting, setStarting] = useState(false);
    const [error, setError] = useState("");

    // ========================================
    // TOKEN
    // ========================================

    const token = localStorage.getItem("token");

    // ========================================
    // START ASSESSMENT
    // ========================================

    const startAssessment = async () => {

        try {

            setStarting(true);
            setError("");

            if (!token) {
                setError("You are not logged in. Please login again.");
                return;
            }

            const response = await fetch(
                "http://localhost:5000/api/assessments/start",
                {
                    method: "POST",

                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            const data = await response.json();

            console.log("ASSESSMENT START RESPONSE:", data);

            if (!response.ok || !data.success) {
                throw new Error(
                    data.message ||
                    "Unable to start assessment"
                );
            }

            setAssessmentId(data.assessmentId);
            setQuestions(data.questions || []);
            setCurrentQuestion(0);
            setAnswers({});
            setResult(null);

        } catch (error) {

            console.error(
                "Start Assessment Error:",
                error
            );

            setError(error.message);

        } finally {

            setStarting(false);

        }
    };

    // ========================================
    // SELECT ANSWER
    // ========================================

    const selectAnswer = (questionId, answer) => {

        setAnswers((previous) => ({
            ...previous,
            [questionId]: answer
        }));

    };

    // ========================================
    // NEXT QUESTION
    // ========================================

    const nextQuestion = () => {

        if (currentQuestion < questions.length - 1) {

            setCurrentQuestion(
                currentQuestion + 1
            );

        }

    };

    // ========================================
    // PREVIOUS QUESTION
    // ========================================

    const previousQuestion = () => {

        if (currentQuestion > 0) {

            setCurrentQuestion(
                currentQuestion - 1
            );

        }

    };

    // ========================================
    // SUBMIT ASSESSMENT
    // ========================================

    const submitAssessment = async () => {

        try {

            setLoading(true);
            setError("");

            const formattedAnswers =
                questions.map((question) => ({
                    questionId: question.id,
                    selectedAnswer:
                        answers[question.id] || ""
                }));

            console.log(
                "SUBMITTING ANSWERS:",
                formattedAnswers
            );

            const response = await fetch(
                `http://localhost:5000/api/assessments/${assessmentId}/submit`,
                {
                    method: "POST",

                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`
                    },

                    body: JSON.stringify({
                        answers: formattedAnswers
                    })
                }
            );

            const data = await response.json();

            console.log(
                "ASSESSMENT SUBMIT RESPONSE:",
                data
            );

            if (!response.ok || !data.success) {

                throw new Error(
                    data.message ||
                    "Unable to submit assessment"
                );

            }

            setResult(data.result);

        } catch (error) {

            console.error(
                "Submit Assessment Error:",
                error
            );

            setError(error.message);

        } finally {

            setLoading(false);

        }

    };

    // ========================================
    // RESTART
    // ========================================

    const restartAssessment = () => {

        setAssessmentId(null);
        setQuestions([]);
        setCurrentQuestion(0);
        setAnswers({});
        setResult(null);
        setError("");

    };

    // ========================================
    // RESULT SCREEN
    // ========================================

    if (result) {

        return (
            <div className="assessment-page">

                <div className="assessment-result">

                    <div className="result-icon">
                        <Trophy size={42} />
                    </div>

                    <span className="panel-label">
                        ASSESSMENT COMPLETED
                    </span>

                    <h1>
                        Great work!
                    </h1>

                    <p>
                        Your SkillBridge assessment has
                        been successfully evaluated.
                    </p>

                    <div className="result-score">

                        <strong>
                            {result.overallScore}%
                        </strong>

                        <span>
                            Overall SkillScore
                        </span>

                    </div>

                    <div className="result-career">

                        <Target size={20} />

                        <div>
                            <span>
                                RECOMMENDED CAREER
                            </span>

                            <strong>
                                {result.recommendedCareer}
                            </strong>
                        </div>

                    </div>

                    <div className="result-columns">

                        <div>

                            <h3>
                                <CheckCircle2 size={18} />
                                Strengths
                            </h3>

                            {result.strengths?.length > 0 ? (

                                <ul>
                                    {result.strengths.map(
                                        (skill) => (
                                            <li key={skill}>
                                                {skill}
                                            </li>
                                        )
                                    )}
                                </ul>

                            ) : (

                                <p>
                                    No strengths identified.
                                </p>

                            )}

                        </div>

                        <div>

                            <h3>
                                <AlertCircle size={18} />
                                Skill Gaps
                            </h3>

                            {result.skillGaps?.length > 0 ? (

                                <ul>
                                    {result.skillGaps.map(
                                        (skill) => (
                                            <li key={skill}>
                                                {skill}
                                            </li>
                                        )
                                    )}
                                </ul>

                            ) : (

                                <p>
                                    No major skill gaps identified.
                                </p>

                            )}

                        </div>

                    </div>

                    <button
                        className="primary-button"
                        onClick={() =>
                            window.location.href = "/dashboard"
                        }
                    >
                        Go to Dashboard
                        <ArrowRight size={17} />
                    </button>

                </div>

            </div>
        );

    }

    // ========================================
    // START SCREEN
    // ========================================

    if (!assessmentId) {

        return (
            <div className="assessment-page">

                <div className="assessment-start">

                    <div className="assessment-start-icon">
                        <Brain size={42} />
                    </div>

                    <span className="panel-label">
                        SKILL INTELLIGENCE
                    </span>

                    <h1>
                        Skill Assessment
                    </h1>

                    <p>
                        Evaluate your technical and soft
                        skills and discover where you stand.
                    </p>

                    <div className="assessment-info">

                        <div>
                            <strong>
                                10+
                            </strong>

                            <span>
                                Skills
                            </span>
                        </div>

                        <div>
                            <strong>
                                AI
                            </strong>

                            <span>
                                Skill Mapping
                            </span>
                        </div>

                        <div>
                            <strong>
                                100
                            </strong>

                            <span>
                                Max Score
                            </span>
                        </div>

                    </div>

                    {error && (
                        <div className="assessment-error">
                            <AlertCircle size={17} />
                            {error}
                        </div>
                    )}

                    <button
                        className="primary-button assessment-start-button"
                        onClick={startAssessment}
                        disabled={starting}
                    >

                        {starting ? (
                            <>
                                <Loader2
                                    size={17}
                                    className="spin"
                                />
                                Starting...
                            </>
                        ) : (
                            <>
                                Start Assessment
                                <ArrowRight size={17} />
                            </>
                        )}

                    </button>

                </div>

            </div>
        );

    }

    // ========================================
    // NO QUESTIONS
    // ========================================

    if (questions.length === 0) {

        return (
            <div className="assessment-page">

                <div className="assessment-start">

                    <AlertCircle size={40} />

                    <h2>
                        No questions available
                    </h2>

                    <p>
                        The assessment could not load
                        any questions.
                    </p>

                    <button
                        className="primary-button"
                        onClick={restartAssessment}
                    >
                        Try Again
                    </button>

                </div>

            </div>
        );

    }

    // ========================================
    // CURRENT QUESTION
    // ========================================

    const question =
        questions[currentQuestion];

    const selectedAnswer =
        answers[question.id];

    const isLastQuestion =
        currentQuestion === questions.length - 1;

    const progress =
        Math.round(
            ((currentQuestion + 1) /
                questions.length) *
                100
        );

    // ========================================
    // ASSESSMENT UI
    // ========================================

    return (
        <div className="assessment-page">

            <div className="assessment-container">

                {/* HEADER */}

                <div className="assessment-header">

                    <div>

                        <span className="panel-label">
                            SKILL ASSESSMENT
                        </span>

                        <h1>
                            Evaluate Your Skills
                        </h1>

                    </div>

                    <div className="assessment-progress-text">

                        Question{" "}
                        <strong>
                            {currentQuestion + 1}
                        </strong>
                        {" "}of{" "}
                        <strong>
                            {questions.length}
                        </strong>

                    </div>

                </div>

                {/* PROGRESS */}

                <div className="progress-container">

                    <div
                        className="progress-bar"
                        style={{
                            width: `${progress}%`
                        }}
                    />

                </div>

                {/* QUESTION */}

                <div className="question-card">

                    <div className="question-top">

                        <span className="question-number">
                            QUESTION {currentQuestion + 1}
                        </span>

                        {question.skill && (
                            <span className="question-skill">
                                {question.skill}
                            </span>
                        )}

                    </div>

                    <h2>
                        {question.question}
                    </h2>

                    <div className="answer-list">

                        {question.options?.map(
                            (option, index) => {

                                const optionValue =
                                    typeof option === "string"
                                        ? option
                                        : option.value;

                                const optionLabel =
                                    typeof option === "string"
                                        ? option
                                        : option.label;

                                const selected =
                                    selectedAnswer ===
                                    optionValue;

                                return (
                                    <button
                                        key={index}
                                        className={`answer-option ${
                                            selected
                                                ? "selected"
                                                : ""
                                        }`}
                                        onClick={() =>
                                            selectAnswer(
                                                question.id,
                                                optionValue
                                            )
                                        }
                                    >

                                        <span className="option-letter">
                                            {String.fromCharCode(
                                                65 + index
                                            )}
                                        </span>

                                        <span>
                                            {optionLabel}
                                        </span>

                                        {selected && (
                                            <CheckCircle2
                                                size={20}
                                            />
                                        )}

                                    </button>
                                );

                            }
                        )}

                    </div>

                </div>

                {/* NAVIGATION */}

                <div className="assessment-navigation">

                    <button
                        className="secondary-button"
                        onClick={previousQuestion}
                        disabled={
                            currentQuestion === 0
                        }
                    >
                        <ArrowLeft size={17} />
                        Previous
                    </button>

                    {!isLastQuestion ? (

                        <button
                            className="primary-button"
                            onClick={nextQuestion}
                            disabled={!selectedAnswer}
                        >
                            Next
                            <ArrowRight size={17} />
                        </button>

                    ) : (

                        <button
                            className="primary-button"
                            onClick={submitAssessment}
                            disabled={
                                !selectedAnswer ||
                                loading
                            }
                        >

                            {loading ? (
                                <>
                                    <Loader2
                                        size={17}
                                        className="spin"
                                    />
                                    Submitting...
                                </>
                            ) : (
                                <>
                                    Submit Assessment
                                    <CheckCircle2 size={17} />
                                </>
                            )}

                        </button>

                    )}

                </div>

                {error && (
                    <div className="assessment-error">
                        <AlertCircle size={17} />
                        {error}
                    </div>
                )}

            </div>

        </div>
    );
}

export default Assessment;