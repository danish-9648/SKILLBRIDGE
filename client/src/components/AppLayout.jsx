import { NavLink, Outlet, useNavigate } from "react-router-dom";
import {
    LayoutDashboard,
    ClipboardCheck,
    BriefcaseBusiness,
    FileText,
    FolderKanban,
    Target,
    Bot,
    UserRound,
    Users,
    LogOut
} from "lucide-react";

function AppLayout() {
    const navigate = useNavigate();

    let user = null;

    try {
        user = JSON.parse(localStorage.getItem("user"));
    } catch {
        user = null;
    }

    const role = user?.role;

    const studentLinks = [
        {
            to: "/dashboard",
            label: "Dashboard",
            icon: LayoutDashboard
        },
        {
            to: "/assessment",
            label: "Skill Assessment",
            icon: ClipboardCheck
        },
        {
            to: "/internships",
            label: "Internships",
            icon: BriefcaseBusiness
        },
        {
            to: "/applications",
            label: "Applications",
            icon: FileText
        },
        {
            to: "/portfolio",
            label: "Portfolio",
            icon: FolderKanban
        },
        {
            to: "/placement-readiness",
            label: "Placement Readiness",
            icon: Target
        },
        {
            to: "/placement-recommendations",
            label: "Recommendations",
            icon: Target
        },
        {
            to: "/ai-assistant",
            label: "Career Assistant",
            icon: Bot
        },
        {
            to: "/edit-profile",
            label: "Edit Profile",
            icon: UserRound
        }
    ];

    const industryLinks = [
        {
            to: "/industry/dashboard",
            label: "Dashboard",
            icon: LayoutDashboard
        },
        {
            to: "/industry/internships",
            label: "My Internships",
            icon: BriefcaseBusiness
        },
        {
            to: "/industry/applications",
            label: "Applications",
            icon: Users
        },
        {
            to: "/ai-assistant",
            label: "Career Assistant",
            icon: Bot
        }
    ];

    const links =
        role === "INDUSTRY"
            ? industryLinks
            : studentLinks;

    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");

        navigate("/login", {
            replace: true
        });
    };

    const userName = user?.name || "Student";

    const initials = userName
        .split(" ")
        .map((name) => name.charAt(0))
        .join("")
        .slice(0, 2)
        .toUpperCase();

    return (
        <div className="app-shell">

            {/* SIDEBAR */}

            <aside className="app-sidebar">

                <div className="sidebar-brand">

                    <div className="brand-logo">
                        SB
                    </div>

                    <div>
                        <h2>SkillBridge</h2>

                        <span>
                            {role === "INDUSTRY"
                                ? "Industry Portal"
                                : "Student Portal"}
                        </span>
                    </div>

                </div>


                {/* USER */}

                <div className="sidebar-user">

                    <div className="user-avatar">
                        {initials}
                    </div>

                    <div className="user-info">

                        <strong>
                            {userName}
                        </strong>

                        <span>
                            {role === "INDUSTRY"
                                ? "Industry"
                                : "Student"}
                        </span>

                    </div>

                </div>


                {/* NAVIGATION */}

                <nav className="sidebar-nav">

                    <div className="nav-section-title">
                        MENU
                    </div>

                    {links.map((link) => {

                        const Icon = link.icon;

                        return (
                            <NavLink
                                key={link.to}
                                to={link.to}
                                className={({ isActive }) =>
                                    `sidebar-link ${
                                        isActive
                                            ? "active"
                                            : ""
                                    }`
                                }
                            >
                                <Icon size={18} />

                                <span>
                                    {link.label}
                                </span>
                            </NavLink>
                        );

                    })}

                </nav>


                {/* BOTTOM */}

                <div className="sidebar-bottom">

                    <button
                        type="button"
                        className="sidebar-logout"
                        onClick={handleLogout}
                    >
                        <LogOut size={18} />

                        <span>
                            Logout
                        </span>
                    </button>

                    <div className="sidebar-footer">
                        SkillBridge
                    </div>

                </div>

            </aside>


            {/* MAIN */}

            <main className="app-main">

                <Outlet />

            </main>

        </div>
    );
}

export default AppLayout;