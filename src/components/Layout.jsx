
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import {
    LayoutDashboard,
    GitBranch,
    Users,
    LogOut,
    Layers,
    ChevronRight,
} from "lucide-react";
import api from "../api/client.js";

export default function Layout() {
    const navigate = useNavigate();

    async function handleLogout() {
        try {
            await api.post("/logout");
            navigate("/login");
        } catch (error) {
            alert(error.response?.data?.message || "Logout failed");
        }
    }

    const links = [
        {
            to: "/",
            label: "Dashboard",
            icon: LayoutDashboard,
        },
        {
            to: "/decisions",
            label: "Decisions",
            icon: GitBranch,
        },
        {
            to: "/groups",
            label: "My Groups",
            icon: Users,
        },
    ];

    return (
        <div className="app-shell">
            <aside className="sidebar">
                <NavLink to="/" className="brand">
                    <span className="brand-icon">
                        <Layers size={21} />
                    </span>

                    <span className="brand-name">DecisionFlow</span>
                </NavLink>

                <div className="sidebar-section-label">
                    WORKSPACE
                </div>

                <nav className="sidebar-nav">
                    {links.map(({ to, label, icon: Icon }) => (
                        <NavLink
                            key={to}
                            to={to}
                            end={to === "/"}
                            className={({ isActive }) =>
                                isActive
                                    ? "nav-link active"
                                    : "nav-link"
                            }
                        >
                            <Icon size={19} strokeWidth={1.9} />

                            <span>{label}</span>

                            <ChevronRight
                                className="nav-chevron"
                                size={15}
                            />
                        </NavLink>
                    ))}
                </nav>

                <div className="sidebar-footer">
                    <div className="sidebar-footer-copy">
                        <span className="footer-dot" />
                        <span>Workspace active</span>
                    </div>

                    <button
                        className="logout-button"
                        onClick={handleLogout}
                    >
                        <LogOut size={18} />
                        <span>Log out</span>
                    </button>
                </div>
            </aside>

            <main className="main-content">
                <Outlet />
            </main>
        </div>
    );
}
