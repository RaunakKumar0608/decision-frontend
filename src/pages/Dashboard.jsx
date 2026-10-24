
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
    ArrowRight,
    GitBranch,
    Users,
    Plus,
    Layers,
    Sparkles,
    Clock3,
} from "lucide-react";
import api from "../api/client.js";

export default function Dashboard() {
    const [decisions, setDecisions] = useState([]);
    const [groups, setGroups] = useState([]);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function loadDashboard() {
            try {
                const [decisionResponse, groupResponse] = await Promise.all([
                    api.get("/decisions/getDecisions"),
                    api.post("/users/myGroups"),
                ]);

                setDecisions(decisionResponse.data.decisions || []);
                setGroups(groupResponse.data || []);
            } catch (err) {
                setError(
                    err.response?.status === 401
                        ? "Your session is missing or has expired. Please log in."
                        : err.response?.data?.message ||
                        "Could not load dashboard."
                );
            } finally {
                setLoading(false);
            }
        }

        loadDashboard();
    }, []);

    if (loading) {
        return (
            <div className="dashboard-loading">
                <div className="loading-spinner" />
                <p>Preparing your workspace...</p>
            </div>
        );
    }

    if (error) {
        return (
            <section>
                <div className="page-heading">
                    <div>
                        <h1>Dashboard</h1>
                        <p className="muted">Your workspace at a glance.</p>
                    </div>
                </div>
                <p className="error">{error}</p>
                <Link className="primary-link" to="/login">
                    Go to login
                </Link>
            </section>
        );
    }

    return (
        <section className="dashboard">
            <div className="page-heading dashboard-heading">
                <div>
                    <div className="eyebrow">
                        <Sparkles size={14} />
                        YOUR WORKSPACE
                    </div>
                    <h1>Welcome to your dashboard</h1>
                    <p className="muted">
                        Keep track of decisions and stay connected with your team.
                    </p>
                </div>

                <Link className="primary-link dashboard-main-action" to="/decisions">
                    <Plus size={17} />
                    New decision
                </Link>
            </div>

            <div className="dashboard-stats">
                <article className="dashboard-stat decision-stat">
                    <div className="dashboard-stat-top">
                        <span className="dashboard-stat-icon">
                            <GitBranch size={21} />
                        </span>
                        <span className="dashboard-stat-label">PERSONAL DECISIONS</span>
                    </div>

                    <div className="dashboard-stat-number">{decisions.length}</div>
                    <p>Decisions you've created</p>

                    <Link to="/decisions" className="dashboard-stat-link">
                        View decisions <ArrowRight size={15} />
                    </Link>
                </article>

                <article className="dashboard-stat group-stat">
                    <div className="dashboard-stat-top">
                        <span className="dashboard-stat-icon">
                            <Users size={21} />
                        </span>
                        <span className="dashboard-stat-label">YOUR GROUPS</span>
                    </div>

                    <div className="dashboard-stat-number">{groups.length}</div>
                    <p>Teams you're part of</p>

                    <Link to="/groups" className="dashboard-stat-link">
                        Explore groups <ArrowRight size={15} />
                    </Link>
                </article>
            </div>

            <div className="dashboard-section-heading">
                <div>
                    <h2>Recent decisions</h2>
                    <p className="muted">Your latest decisions, all in one place.</p>
                </div>

                <Link to="/decisions" className="text-link">
                    View all <ArrowRight size={15} />
                </Link>
            </div>

            <div className="content-card dashboard-decisions-card">
                {decisions.length === 0 ? (
                    <div className="dashboard-empty">
                        <span className="dashboard-empty-icon">
                            <GitBranch size={25} />
                        </span>
                        <h3>Your first decision starts here</h3>
                        <p className="muted">
                            Record a decision, explain your reasoning, and keep
                            everything organized.
                        </p>
                        <Link className="primary-link" to="/decisions">
                            <Plus size={16} />
                            Create a decision
                        </Link>
                    </div>
                ) : (
                    decisions.slice(0, 5).map((item) => (
                        <article className="dashboard-decision-row" key={item._id}>
                            <span className="dashboard-decision-icon">
                                <GitBranch size={18} />
                            </span>

                            <div className="dashboard-decision-content">
                                <h3>{item.title}</h3>
                                <p>{item.description || item.reason}</p>
                            </div>

                            <span className="status">
                                {item.status || "Pending"}
                            </span>
                        </article>
                    ))
                )}
            </div>

            <div className="dashboard-section-heading dashboard-groups-heading">
                <div>
                    <h2>Your groups</h2>
                    <p className="muted">Work together on shared decisions.</p>
                </div>

                <Link to="/groups" className="text-link">
                    View all <ArrowRight size={15} />
                </Link>
            </div>

            <div className="dashboard-groups-grid">
                {groups.length === 0 ? (
                    <div className="content-card dashboard-empty dashboard-group-empty">
                        <span className="dashboard-empty-icon">
                            <Users size={25} />
                        </span>
                        <h3>Bring your team together</h3>
                        <p className="muted">
                            Create a group to organize decisions with other members.
                        </p>
                        <Link className="primary-link" to="/groups">
                            <Plus size={16} />
                            Create a group
                        </Link>
                    </div>
                ) : (
                    groups.slice(0, 4).map((group) => (
                        <Link
                            to="/groups"
                            className="dashboard-group-card"
                            key={group._id}
                        >
                            <span className="dashboard-group-icon">
                                <Layers size={20} />
                            </span>

                            <div className="dashboard-group-info">
                                <h3>{group.groupName}</h3>
                                <p>
                                    <Users size={14} />
                                    {group.groupMembers?.length || 0} members
                                </p>
                            </div>

                            <ArrowRight
                                size={17}
                                className="dashboard-group-arrow"
                            />
                        </Link>
                    ))
                )}
            </div>

            <div className="dashboard-footer-note">
                <Clock3 size={15} />
                <span>Your workspace, organized around better decisions.</span>
            </div>
        </section>
    );
}
