import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
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
                        : err.response?.data?.message || "Could not load dashboard."
                );
            } finally {
                setLoading(false);
            }
        }

        loadDashboard();
    }, []);

    if (loading) return <p>Loading your workspace...</p>;

    if (error) {
        return (
            <section>
                <h1>Dashboard</h1>
                <p className="error">{error}</p>
                <Link to="/login">Go to login</Link>
            </section>
        );
    }

    return (
        <section>
            <div className="page-heading">
                <div>
                    <h1>Dashboard</h1>
                    <p className="muted">Your team's decisions at a glance.</p>
                </div>

                <Link className="primary-link" to="/decisions">
                    View decisions
                </Link>
            </div>

            <div className="stats-grid">
                <article className="stat-card">
                    <p>Total decisions</p>
                    <h2>{decisions.length}</h2>
                </article>

                <article className="stat-card">
                    <p>Your groups</p>
                    <h2>{groups.length}</h2>
                </article>
            </div>

            <div className="content-card">
                <h2>Recent decisions</h2>

                {decisions.length === 0 ? (
                    <p className="muted">No decisions found. Create your first one.</p>
                ) : (
                    decisions.slice(0, 5).map((item) => (
                        <article className="decision-item" key={item._id}>
                            <h3>{item.title}</h3>
                            <p>{item.description}</p>
                            <span className="status">
                {item.status || "Pending"}
              </span>
                        </article>
                    ))
                )}
            </div>

            <div className="content-card">
                <h2>Your groups</h2>

                {groups.length === 0 ? (
                    <p className="muted">You haven't joined any groups yet.</p>
                ) : (
                    groups.map((group) => (
                        <div className="group-item" key={group._id}>
                            {group.groupName}
                        </div>
                    ))
                )}
            </div>
        </section>
    );
}