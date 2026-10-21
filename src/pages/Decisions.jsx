import { useEffect, useState } from "react";
import api from "../api/client";

export default function Groups() {
    const [groups, setGroups] = useState([]);
    const [selectedGroup, setSelectedGroup] = useState(null);
    const [members, setMembers] = useState([]);
    const [groupName, setGroupName] = useState("");
    const [loadingGroups, setLoadingGroups] = useState(true);
    const [loadingMembers, setLoadingMembers] = useState(false);
    const [error, setError] = useState("");
    const [message, setMessage] = useState("");

    async function loadGroups() {
        try {
            setLoadingGroups(true);
            setError("");

            const response = await api.post("/users/myGroups");
            setGroups(Array.isArray(response.data) ? response.data : []);
        } catch (err) {
            setError(
                err.response?.data?.message || "Could not load groups."
            );
        } finally {
            setLoadingGroups(false);
        }
    }

    useEffect(() => {
        loadGroups();
    }, []);

    async function createGroup(e) {
        e.preventDefault();
        if (!groupName.trim()) return;

        try {
            setError("");
            setMessage("");

            await api.post("/groups/createGroup", {
                groupName: groupName.trim(),
            });

            setGroupName("");
            setMessage("Group created successfully!");
            await loadGroups();
        } catch (err) {
            setError(
                err.response?.data?.message || "Could not create group."
            );
        }
    }

    async function openGroup(group) {
        setSelectedGroup(group);
        setMembers([]);
        setLoadingMembers(true);
        setError("");
        setMessage("");

        try {
            const response = await api.post("/groups/getMembers", {
                groupId: group._id,
            });

            // Supports either an array or { members: [...] } response.
            const data = response.data;
            const list = Array.isArray(data)
                ? data
                : Array.isArray(data.members)
                    ? data.members
                    : [];

            setMembers(list);
        } catch (err) {
            setError(
                err.response?.data?.message ||
                "Could not load members. Check your getMembers controller."
            );
        } finally {
            setLoadingMembers(false);
        }
    }

    return (
        <main className="page">
            <div className="page-header">
                <div>
                    <h1>Groups</h1>
                    <p>Create groups and manage their members.</p>
                </div>
            </div>

            {error && <p role="alert">{error}</p>}
            {message && <p role="status">{message}</p>}

            <section className="card">
                <h2>Create a group</h2>

                <form onSubmit={createGroup} className="form-grid">
                    <input
                        type="text"
                        value={groupName}
                        onChange={(e) => setGroupName(e.target.value)}
                        placeholder="Enter group name"
                        required
                    />

                    <button type="submit">Create group</button>
                </form>
            </section>

            <section className="card">
                <h2>Your groups</h2>

                {loadingGroups ? (
                    <p>Loading groups...</p>
                ) : groups.length === 0 ? (
                    <p>You haven't created or joined any groups yet.</p>
                ) : (
                    <div className="group-list">
                        {groups.map((group) => (
                            <button
                                key={group._id}
                                type="button"
                                className="group-item"
                                onClick={() => openGroup(group)}
                            >
                <span>
                  <strong>{group.groupName}</strong>
                  <small>
                    {group.groupMembers?.length ?? 0} members
                  </small>
                </span>

                                <span aria-hidden="true">→</span>
                            </button>
                        ))}
                    </div>
                )}
            </section>

            {selectedGroup && (
                <section className="card">
                    <h2>{selectedGroup.groupName} — Members</h2>

                    {loadingMembers ? (
                        <p>Loading members...</p>
                    ) : members.length === 0 ? (
                        <p>No members returned for this group.</p>
                    ) : (
                        <div className="group-list">
                            {members.map((member, index) => (
                                <div
                                    className="group-item"
                                    key={member._id || member.id || index}
                                >
                  <span>
                    <strong>
                      {member.name || member.email || "Group member"}
                    </strong>
                      {member.email && <small>{member.email}</small>}
                  </span>
                                </div>
                            ))}
                        </div>
                    )}
                </section>
            )}
        </main>
    );
}
