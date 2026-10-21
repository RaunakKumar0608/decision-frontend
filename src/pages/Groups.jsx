import { useEffect, useState } from "react";
import api from "../api/client.js";

export default function Groups() {
    const [groups, setGroups] = useState([]);
    const [groupName, setGroupName] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(true);

    async function loadGroups() {
        try {
            const response = await api.post("/users/myGroups");
            setGroups(response.data || []);
            setError("");
        } catch (err) {
            setError(err.response?.data?.message || "Failed to load groups");
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        loadGroups();
    }, []);

    async function handleSubmit(e) {
        e.preventDefault();
        setError("");

        try {
            await api.post("/groups/createGroup", { groupName });
            setGroupName("");
            setLoading(true);
            await loadGroups();
        } catch (err) {
            setError(err.response?.data?.message || "Failed to create group");
        }
    }

    return (
        <section>
            <h1>My Groups</h1>
            <p className="muted">Organize decisions with your team.</p>

            <form className="content-card" onSubmit={handleSubmit}>
                <h2>Create a group</h2>

                {error && <p className="error">{error}</p>}

                <label htmlFor="groupName">Group name</label>
                <input
                    id="groupName"
                    value={groupName}
                    onChange={(e) => setGroupName(e.target.value)}
                    placeholder="e.g. Engineering Team"
                    required
                />

                <button>Create group</button>
            </form>

            <div className="content-card">
                <h2>Your groups</h2>

                {loading ? (
                    <p>Loading groups...</p>
                ) : groups.length === 0 ? (
                    <p className="muted">No groups yet. Create one above.</p>
                ) : (
                    groups.map((group) => (
                        <article className="group-item" key={group._id}>
                            <h3>{group.groupName}</h3>
                            <p className="muted">
                                {group.groupMembers?.length ?? 0} members
                            </p>
                        </article>
                    ))
                )}
            </div>
        </section>
    );
}