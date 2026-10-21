import { NavLink, Outlet, useNavigate } from "react-router-dom";
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
        { to: "/", label: "Dashboard" },
        { to: "/decisions", label: "Decisions" },
        { to: "/groups", label: "My Groups" },
    ];

    return (
        <div className="app-shell">
            <aside className="sidebar">
                <h2>DecisionFlow</h2>
                <p className="muted">TEAM WORKSPACE</p>

                <nav>
                    {links.map((link) => (
                        <NavLink
                            key={link.to}
                            to={link.to}
                            end={link.to === "/"}
                            className={({ isActive }) =>
                                isActive ? "nav-link active" : "nav-link"
                            }
                        >
                            {link.label}
                        </NavLink>
                    ))}
                </nav>

                <button className="logout-button" onClick={handleLogout}>
                    Log out
                </button>
            </aside>

            <main className="main-content">
                <Outlet />
            </main>
        </div>
    );
}