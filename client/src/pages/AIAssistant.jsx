import { useState } from "react";
import {
    Send,
    Bot,
    User,
    Sparkles,
    Loader2,
} from "lucide-react";

import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

import { requestAI } from "../services/api";

import "./AIAssistant.css";

function AIAssistant() {
    const [message, setMessage] = useState("");

    const [messages, setMessages] = useState([
        {
            role: "assistant",
            content: `## Hello! 👋

I'm your **SkillBridge AI Career Assistant**.

I can help you with:

- Career planning
- Skill development
- Internship preparation
- Interview preparation
- Project ideas
- Learning roadmaps

What would you like to work on today?`,
        },
    ]);

    const [loading, setLoading] = useState(false);

    const quickQuestions = [
        "What career should I choose based on my skills?",
        "Create a roadmap for becoming a full-stack developer.",
        "What skills should I learn for internships?",
        "Help me prepare for a technical interview.",
        "Suggest projects that will improve my resume.",
    ];

    // ============================================================
    // SEND MESSAGE
    // ============================================================

    const handleSend = async (event) => {
        if (event) {
            event.preventDefault();
        }

        const trimmedMessage = message.trim();

        if (!trimmedMessage || loading) {
            return;
        }

        setMessages((previous) => [
            ...previous,
            {
                role: "user",
                content: trimmedMessage,
            },
        ]);

        setMessage("");
        setLoading(true);

        try {
            let user = null;

            try {
                user = JSON.parse(
                    localStorage.getItem("user")
                );
            } catch {
                user = null;
            }

            const context = {
                role: user?.role || "STUDENT",
                name: user?.name || "",
                email: user?.email || "",
                location: user?.location || "",
                preferredDomains:
                    user?.preferredDomains || [],
                skills:
                    user?.skills || [],
            };

            console.log(
                "🤖 Sending AI request:",
                trimmedMessage
            );

            const response = await requestAI(
                trimmedMessage,
                context
            );

            console.log(
                "🤖 AI RESPONSE:",
                response
            );

            const reply =
                response?.reply ||
                response?.data?.reply ||
                response?.message;

            if (!reply) {
                throw new Error(
                    "AI response did not contain a reply"
                );
            }

            setMessages((previous) => [
                ...previous,
                {
                    role: "assistant",
                    content: reply,
                },
            ]);
        } catch (error) {
            console.error(
                "AI Assistant Error:",
                error
            );

            setMessages((previous) => [
                ...previous,
                {
                    role: "assistant",
                    content:
                        "Sorry, I couldn't process your request right now. Please make sure the SkillBridge backend is running and try again.",
                },
            ]);
        } finally {
            setLoading(false);
        }
    };

    // ============================================================
    // KEYBOARD HANDLER
    // ============================================================

    const handleKeyDown = (event) => {
        if (
            event.key === "Enter" &&
            !event.shiftKey
        ) {
            event.preventDefault();
            handleSend(event);
        }
    };

    // ============================================================
    // MARKDOWN RENDERER
    // ============================================================

    const renderMarkdown = (content) => {
        return (
            <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                components={{
                    h1: ({ children }) => (
                        <h1 className="ai-heading">
                            {children}
                        </h1>
                    ),

                    h2: ({ children }) => (
                        <h2 className="ai-heading">
                            {children}
                        </h2>
                    ),

                    h3: ({ children }) => (
                        <h3 className="ai-heading">
                            {children}
                        </h3>
                    ),

                    p: ({ children }) => (
                        <p className="ai-paragraph">
                            {children}
                        </p>
                    ),

                    ul: ({ children }) => (
                        <ul className="ai-list">
                            {children}
                        </ul>
                    ),

                    ol: ({ children }) => (
                        <ol className="ai-list ai-numbered-list">
                            {children}
                        </ol>
                    ),

                    li: ({ children }) => (
                        <li className="ai-list-item">
                            {children}
                        </li>
                    ),

                    strong: ({ children }) => (
                        <strong className="ai-bold">
                            {children}
                        </strong>
                    ),

                    em: ({ children }) => (
                        <em className="ai-italic">
                            {children}
                        </em>
                    ),

                    code: ({
                        inline,
                        className,
                        children,
                        ...props
                    }) => {
                        if (inline) {
                            return (
                                <code
                                    className="ai-inline-code"
                                    {...props}
                                >
                                    {children}
                                </code>
                            );
                        }

                        return (
                            <pre className="ai-code-block">
                                <code
                                    className={className}
                                    {...props}
                                >
                                    {String(children).replace(
                                        /\n$/,
                                        ""
                                    )}
                                </code>
                            </pre>
                        );
                    },

                    blockquote: ({ children }) => (
                        <blockquote className="ai-quote">
                            {children}
                        </blockquote>
                    ),

                    hr: () => (
                        <hr className="ai-divider" />
                    ),

                    a: ({ children, href }) => (
                        <a
                            className="ai-link"
                            href={href}
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            {children}
                        </a>
                    ),

                    table: ({ children }) => (
                        <div className="ai-table-wrapper">
                            <table className="ai-table">
                                {children}
                            </table>
                        </div>
                    ),

                    th: ({ children }) => (
                        <th>{children}</th>
                    ),

                    td: ({ children }) => (
                        <td>{children}</td>
                    ),
                }}
            >
                {content}
            </ReactMarkdown>
        );
    };

    // ============================================================
    // UI
    // ============================================================

    return (
        <div className="page-container">

            {/* HEADER */}

            <div className="page-header">
                <div>
                    <span className="panel-label">
                        AI CAREER COMPANION
                    </span>

                    <h2>
                        SkillBridge AI Assistant
                    </h2>

                    <p>
                        Get personalized guidance
                        for skills, careers,
                        internships, projects and
                        interview preparation.
                    </p>
                </div>
            </div>

            {/* AI CHAT */}

            <div className="ai-assistant-container">

                {/* QUICK QUESTIONS */}

                <div className="ai-quick-questions">

                    {quickQuestions.map(
                        (question, index) => (
                            <button
                                key={index}
                                type="button"
                                className="ai-quick-button"
                                onClick={() =>
                                    setMessage(
                                        question
                                    )
                                }
                                disabled={loading}
                            >
                                <Sparkles size={15} />

                                <span>
                                    {question}
                                </span>
                            </button>
                        )
                    )}

                </div>

                {/* CHAT WINDOW */}

                <div className="ai-chat-window">

                    {/* MESSAGES */}

                    <div className="ai-messages">

                        {messages.map(
                            (item, index) => {
                                const isUser =
                                    item.role ===
                                    "user";

                                return (
                                    <div
                                        key={index}
                                        className={`ai-message-row ${
                                            isUser
                                                ? "user-row"
                                                : "assistant-row"
                                        }`}
                                    >

                                        {/* AI AVATAR */}

                                        {!isUser && (
                                            <div className="ai-avatar">
                                                <Bot size={19} />
                                            </div>
                                        )}

                                        {/* MESSAGE */}

                                        <div
                                            className={`ai-message-bubble ${
                                                isUser
                                                    ? "user-message"
                                                    : "assistant-message"
                                            }`}
                                        >
                                            {isUser ? (
                                                <div className="user-message-text">
                                                    {
                                                        item.content
                                                    }
                                                </div>
                                            ) : (
                                                <div className="ai-message-content">
                                                    {renderMarkdown(
                                                        item.content
                                                    )}
                                                </div>
                                            )}
                                        </div>

                                        {/* USER AVATAR */}

                                        {isUser && (
                                            <div className="user-avatar">
                                                <User size={18} />
                                            </div>
                                        )}

                                    </div>
                                );
                            }
                        )}

                        {/* LOADING */}

                        {loading && (
                            <div className="ai-message-row assistant-row">

                                <div className="ai-avatar">
                                    <Bot size={19} />
                                </div>

                                <div className="assistant-message ai-loading-message">

                                    <div className="ai-typing">
                                        <span></span>
                                        <span></span>
                                        <span></span>
                                    </div>

                                    <span className="ai-thinking-text">
                                        SkillBridge AI is thinking...
                                    </span>

                                </div>

                            </div>
                        )}

                    </div>

                    {/* INPUT */}

                    <form
                        onSubmit={handleSend}
                        className="ai-input-area"
                    >

                        <div className="ai-input-wrapper">

                            <textarea
                                value={message}
                                onChange={(event) =>
                                    setMessage(
                                        event.target.value
                                    )
                                }
                                onKeyDown={
                                    handleKeyDown
                                }
                                placeholder="Ask SkillBridge AI..."
                                rows={1}
                                disabled={loading}
                                className="ai-textarea"
                            />

                            <button
                                type="submit"
                                disabled={
                                    loading ||
                                    !message.trim()
                                }
                                className="ai-send-button"
                            >
                                {loading ? (
                                    <Loader2
                                        size={18}
                                        className="spin"
                                    />
                                ) : (
                                    <Send size={18} />
                                )}
                            </button>

                        </div>

                        <div className="ai-input-hint">
                            Press Enter to send •
                            Shift + Enter for a
                            new line
                        </div>

                    </form>

                </div>

            </div>

        </div>
    );
}

export default AIAssistant;