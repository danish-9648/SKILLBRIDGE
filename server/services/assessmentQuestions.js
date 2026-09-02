// ============================================================
// SKILLBRIDGE ASSESSMENT QUESTIONS
// ============================================================

const questions = [

    // ========================================================
    // JAVASCRIPT
    // ========================================================

    {
        id: 1,
        skill: "JavaScript",
        category: "TECHNICAL",
        question: "Which keyword is used to declare a block-scoped variable?",
        options: [
            "var",
            "let",
            "define",
            "variable"
        ],
        correctAnswer: "let"
    },

    {
        id: 2,
        skill: "JavaScript",
        category: "TECHNICAL",
        question: "What does Array.map() return?",
        options: [
            "The original array only",
            "A new array",
            "A string",
            "A boolean"
        ],
        correctAnswer: "A new array"
    },

    {
        id: 3,
        skill: "JavaScript",
        category: "TECHNICAL",
        question: "Which method converts JSON text into a JavaScript object?",
        options: [
            "JSON.parse()",
            "JSON.stringify()",
            "JSON.convert()",
            "JSON.object()"
        ],
        correctAnswer: "JSON.parse()"
    },


    // ========================================================
    // REACT
    // ========================================================

    {
        id: 4,
        skill: "React",
        category: "TECHNICAL",
        question: "Which hook is commonly used to manage component state?",
        options: [
            "useState",
            "useRoute",
            "useServer",
            "useHTML"
        ],
        correctAnswer: "useState"
    },

    {
        id: 5,
        skill: "React",
        category: "TECHNICAL",
        question: "Which hook is commonly used for side effects?",
        options: [
            "useEffect",
            "useState",
            "useComponent",
            "useSideEffect"
        ],
        correctAnswer: "useEffect"
    },

    {
        id: 6,
        skill: "React",
        category: "TECHNICAL",
        question: "What is JSX?",
        options: [
            "A database",
            "A syntax extension for JavaScript",
            "A CSS framework",
            "A backend server"
        ],
        correctAnswer: "A syntax extension for JavaScript"
    },


    // ========================================================
    // NODE.JS
    // ========================================================

    {
        id: 7,
        skill: "Node.js",
        category: "TECHNICAL",
        question: "Node.js is primarily used to run JavaScript where?",
        options: [
            "Only inside HTML",
            "On the server",
            "Only inside CSS",
            "Only inside MongoDB"
        ],
        correctAnswer: "On the server"
    },

    {
        id: 8,
        skill: "Node.js",
        category: "TECHNICAL",
        question: "Which package is commonly used to create HTTP servers with Node.js?",
        options: [
            "Express",
            "React",
            "Mongoose",
            "Vite"
        ],
        correctAnswer: "Express"
    },


    // ========================================================
    // MONGODB
    // ========================================================

    {
        id: 9,
        skill: "MongoDB",
        category: "TECHNICAL",
        question: "MongoDB is what type of database?",
        options: [
            "Relational database",
            "Document database",
            "Graph database",
            "Spreadsheet"
        ],
        correctAnswer: "Document database"
    },

    {
        id: 10,
        skill: "MongoDB",
        category: "TECHNICAL",
        question: "What format is commonly used to represent MongoDB documents?",
        options: [
            "JSON/BSON",
            "HTML",
            "CSS",
            "XML only"
        ],
        correctAnswer: "JSON/BSON"
    },


    // ========================================================
    // GIT
    // ========================================================

    {
        id: 11,
        skill: "Git",
        category: "TOOLS",
        question: "Which command creates a new Git repository?",
        options: [
            "git init",
            "git start",
            "git create",
            "git new"
        ],
        correctAnswer: "git init"
    },

    {
        id: 12,
        skill: "Git",
        category: "TOOLS",
        question: "Which command uploads local commits to a remote repository?",
        options: [
            "git upload",
            "git push",
            "git send",
            "git commit"
        ],
        correctAnswer: "git push"
    },


    // ========================================================
    // REST API
    // ========================================================

    {
        id: 13,
        skill: "REST API",
        category: "TECHNICAL",
        question: "Which HTTP method is commonly used to retrieve data?",
        options: [
            "GET",
            "POST",
            "DELETE",
            "PATCH"
        ],
        correctAnswer: "GET"
    },

    {
        id: 14,
        skill: "REST API",
        category: "TECHNICAL",
        question: "Which HTTP status code normally represents a successful request?",
        options: [
            "200",
            "404",
            "500",
            "401"
        ],
        correctAnswer: "200"
    },


    // ========================================================
    // HTML
    // ========================================================

    {
        id: 15,
        skill: "HTML",
        category: "TECHNICAL",
        question: "What does HTML stand for?",
        options: [
            "HyperText Markup Language",
            "HighText Machine Language",
            "Hyperlink Text Management Language",
            "Home Tool Markup Language"
        ],
        correctAnswer: "HyperText Markup Language"
    },

    {
        id: 16,
        skill: "HTML",
        category: "TECHNICAL",
        question: "Which HTML element is used for the largest heading?",
        options: [
            "<h1>",
            "<heading>",
            "<head>",
            "<h6>"
        ],
        correctAnswer: "<h1>"
    },


    // ========================================================
    // CSS
    // ========================================================

    {
        id: 17,
        skill: "CSS",
        category: "TECHNICAL",
        question: "Which CSS property changes text color?",
        options: [
            "font-color",
            "color",
            "text-color",
            "foreground"
        ],
        correctAnswer: "color"
    },

    {
        id: 18,
        skill: "CSS",
        category: "TECHNICAL",
        question: "Which layout system is commonly used for one-dimensional layouts?",
        options: [
            "Flexbox",
            "SQL",
            "BSON",
            "JWT"
        ],
        correctAnswer: "Flexbox"
    },


    // ========================================================
    // EXPRESS
    // ========================================================

    {
        id: 19,
        skill: "Express",
        category: "TECHNICAL",
        question: "Express.js is primarily used for what?",
        options: [
            "Building Node.js web servers and APIs",
            "Creating databases",
            "Styling webpages",
            "Building mobile hardware"
        ],
        correctAnswer: "Building Node.js web servers and APIs"
    },

    {
        id: 20,
        skill: "Express",
        category: "TECHNICAL",
        question: "Which method defines a GET route in Express?",
        options: [
            "app.get()",
            "app.fetch()",
            "app.routeGet()",
            "server.getRoute()"
        ],
        correctAnswer: "app.get()"
    },


    // ========================================================
    // DEPLOYMENT
    // ========================================================

    {
        id: 21,
        skill: "Deployment",
        category: "TOOLS",
        question: "What does deployment mean in software development?",
        options: [
            "Making an application available for users",
            "Deleting source code",
            "Writing only CSS",
            "Creating a database schema"
        ],
        correctAnswer: "Making an application available for users"
    },

    {
        id: 22,
        skill: "Deployment",
        category: "TOOLS",
        question: "Which environment is commonly used to host a production web application?",
        options: [
            "A cloud/server environment",
            "Only Microsoft Word",
            "Only a local text editor",
            "A calculator"
        ],
        correctAnswer: "A cloud/server environment"
    },


    // ========================================================
    // PROBLEM SOLVING
    // ========================================================

    {
        id: 23,
        skill: "Problem Solving",
        category: "SOFT_SKILL",
        question: "What should you generally do first when debugging a program?",
        options: [
            "Understand and reproduce the problem",
            "Delete the project",
            "Rewrite everything",
            "Ignore the error"
        ],
        correctAnswer: "Understand and reproduce the problem"
    },


    // ========================================================
    // COMMUNICATION
    // ========================================================

    {
        id: 24,
        skill: "Communication",
        category: "SOFT_SKILL",
        question: "Which is an effective way to communicate a technical problem?",
        options: [
            "Clearly explain the problem, context and evidence",
            "Give no details",
            "Blame another developer",
            "Ignore the issue"
        ],
        correctAnswer:
            "Clearly explain the problem, context and evidence"
    },


    // ========================================================
    // TEAMWORK
    // ========================================================

    {
        id: 25,
        skill: "Teamwork",
        category: "SOFT_SKILL",
        question: "What is a good practice when working with a development team?",
        options: [
            "Communicate progress and blockers",
            "Hide problems",
            "Never use version control",
            "Work without communicating"
        ],
        correctAnswer:
            "Communicate progress and blockers"
    },


    // ========================================================
    // ADAPTABILITY
    // ========================================================

    {
        id: 26,
        skill: "Adaptability",
        category: "SOFT_SKILL",
        question: "What is an important developer skill when technology changes?",
        options: [
            "Ability to learn and adapt",
            "Avoiding new technologies",
            "Never changing your approach",
            "Ignoring industry trends"
        ],
        correctAnswer:
            "Ability to learn and adapt"
    }
];

module.exports = questions;