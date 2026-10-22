
import { useEffect, useState } from "react";
import api from "../api/client.js";

export default function Groups() {
    const [groups, setGroups] = useState([]);
    const [groupName, setGroupName] = useState("");
    const [selectedGroup, setSelectedGroup] = useState(null);
    const [members, setMembers] = useState([]);
    const [memberEmail, setMemberEmail] = useState("");
    const [addingMember, setAddingMember] = useState(false);
    const [removingMember, setRemovingMember] = useState("");
    const [loading, setLoading] = useState(true);
    const [loadingMembers, setLoadingMembers] = useState(false);
    const [error, setError] = useState("");
    const [message, setMessage] = useState("");
    const [memberDecisions, setMemberDecisions] = useState([]);
    const [selectedMember, setSelectedMember] = useState(null);
    const [loadingDecisions, setLoadingDecisions] = useState(false);

    async function loadGroups() {
        try {
            const response = await api.post("/users/myGroups");
            setGroups(response.data || []);
            setError("");
        } catch (err) {
            setError(
                err.response?.data?.message || "Failed to load groups"
            );
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
        setMessage("");

        try {
            await api.post("/groups/createGroup", {
                groupName: groupName.trim(),
            });

            setGroupName("");
            setLoading(true);
            setMessage("Group created successfully!");
            await loadGroups();
        } catch (err) {
            setError(
                err.response?.data?.message || "Failed to create group"
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

            const data = response.data;
            const memberList = Array.isArray(data)
                ? data
                : Array.isArray(data.members)
                    ? data.members
                    : [];

            setMembers(memberList);
        } catch (err) {
            setError(
                err.response?.data?.message || "Failed to load members"
            );
        } finally {
            setLoadingMembers(false);
        }
    }

    async function addMember(e) {
        e.preventDefault();

        if (!selectedGroup || !memberEmail.trim()) return;

        setError("");
        setMessage("");
        setAddingMember(true);

        try {
            await api.post("/groups/addMember", {
                group: selectedGroup._id,
                newMember: memberEmail.trim(),
            });

            setMemberEmail("");
            setMessage("Member added successfully!");

            await openGroup(selectedGroup);
            await loadGroups();
        } catch (err) {
            setError(
                err.response?.data?.message || "Could not add member"
            );
        } finally {
            setAddingMember(false);
        }
    }



    async function handleRemoveMember(member) {
        if (!selectedGroup) return;

        const email = member.email;

        if (!email) {
            setError("Could not identify this member's email.");
            return;
        }

        const confirmed = window.confirm(
            `Are you sure you want to remove ${
                member.name || email
            } from ${selectedGroup.groupName}?`
        );

        if (!confirmed) return;

        setError("");
        setMessage("");
        setRemovingMember(email);

        try {
            await api.post("/groups/removeMember", {
                group: selectedGroup._id,
                email: email,
            });

            await openGroup(selectedGroup);
            await loadGroups();

            setMessage("Member removed successfully.");
        } catch (err) {
            setError(
                err.response?.data?.message ||
                "Could not remove member."
            );
        } finally {
            setRemovingMember("");
        }
    }

    async function viewMemberDecisions(member) {
        if (!selectedGroup || !member.email) {
            setError("Could not identify the selected member.");
            return;
        }

        setSelectedMember(member);
        setMemberDecisions([]);
        setLoadingDecisions(true);
        setError("");
        setMessage("");

        try {
            const response = await api.get("/users/membersDecisions", {
                params:{
                    groupId: selectedGroup._id,
                    email: member.email,
                }
            });

            const data = response.data;

            setMemberDecisions(
                Array.isArray(data)
                    ? data
                    : Array.isArray(data.decisions)
                        ? data.decisions
                        : []
            );
        } catch (err) {
            setError(
                err.response?.data?.message ||
                "Could not load this member's decisions."
            );
        } finally {
            setLoadingDecisions(false);
        }
    }

    return (
        <section>
            <h1>My Groups</h1>
            <p className="muted">
                Organize decisions with your team.
            </p>

            {error && <p className="error">{error}</p>}
            {message && <p>{message}</p>}

            {/* Create a group */}
            <form className="content-card" onSubmit={handleSubmit}>
                <h2>Create a group</h2>

                <label htmlFor="groupName">Group name</label>
                <input
                    id="groupName"
                    value={groupName}
                    onChange={(e) => setGroupName(e.target.value)}
                    placeholder="e.g. Engineering Team"
                    required
                />

                <button type="submit">Create group</button>
            </form>

            {/* List groups */}
            <div className="content-card">
                <h2>Your groups</h2>

                {loading ? (
                    <p>Loading groups...</p>
                ) : groups.length === 0 ? (
                    <p className="muted">
                        No groups yet. Create one above.
                    </p>
                ) : (
                    groups.map((group) => (
                        <article className="group-item" key={group._id}>
                            <h3>{group.groupName}</h3>

                            <p className="muted">
                                {group.groupMembers?.length ?? 0} members
                            </p>

                            <button
                                type="button"
                                onClick={() => openGroup(group)}
                            >
                                View members
                            </button>
                        </article>
                    ))
                )}
            </div>

            {/* Selected group */}
            {selectedGroup && (
                <div className="content-card">
                    <h2>{selectedGroup.groupName} — Members</h2>

                    {/* Add member */}
                    <form onSubmit={addMember}>
                        <label htmlFor="memberEmail">
                            Add member by email
                        </label>

                        <input
                            id="memberEmail"
                            type="email"
                            value={memberEmail}
                            onChange={(e) => setMemberEmail(e.target.value)}
                            placeholder="member@example.com"
                            required
                        />

                        <button type="submit" disabled={addingMember}>
                            {addingMember ? "Adding..." : "Add member"}
                        </button>
                    </form>

                    {/* Members list */}
                    {loadingMembers ? (
                        <p>Loading members...</p>
                    ) : members.length === 0 ? (
                        <p className="muted">
                            No members returned.
                        </p>
                    ) : (
                        <div className="group-list">
                            {members.map((member, index) => (
                                <article
                                    className="group-item"
                                    key={member._id || member.id || index}
                                >
                                    <div className="member-info">
                                        <h3>
                                            {member.name ||
                                                member.email ||
                                                "Unnamed member"}
                                        </h3>

                                        <p className="muted">
                                            {member.email || ""}
                                        </p>
                                    </div>

                                    <button
                                        type="button"
                                        onClick={() => handleRemoveMember(member)}
                                        disabled={
                                            removingMember === member.email
                                        }
                                    >
                                        {removingMember === member.email
                                            ? "Removing..."
                                            : "Remove"}
                                    </button>

                                    <button
                                        type="button"
                                        onClick={() =>
                                            viewMemberDecisions(member)
                                        }
                                        disabled={
                                            !member.email || loadingDecisions
                                        }
                                    >
                                        {loadingDecisions &&
                                        selectedMember?.email === member.email
                                            ? "Loading..."
                                            : "View decisions"}
                                    </button>
                                </article>
                            ))}
                        </div>
                    )}

                    {/* Selected member's decisions */}
                    {selectedMember && (
                        <div className="content-card">
                            <h2>
                                Decisions by{" "}
                                {selectedMember.name ||
                                    selectedMember.email}
                            </h2>

                            {loadingDecisions ? (
                                <p>Loading decisions...</p>
                            ) : memberDecisions.length === 0 ? (
                                <p className="muted">
                                    No decisions found for this member in this
                                    group.
                                </p>
                            ) : (
                                <div className="group-list">
                                    {memberDecisions.map((item, index) => (
                                        <article
                                            className="group-item"
                                            key={item._id || index}
                                        >
                                            <h3>{item.title}</h3>

                                            <p>
                                                <strong>Decision:</strong>{" "}
                                                {item.decision}
                                            </p>

                                            <p>
                                                <strong>Reason:</strong>{" "}
                                                {item.reason}
                                            </p>

                                            <p>{item.description}</p>

                                            {item.status && (
                                                <p>
                                                    <strong>Status:</strong>{" "}
                                                    {item.status}
                                                </p>
                                            )}
                                        </article>
                                    ))}
                                </div>
                            )}
                        </div>
                    )}
                </div>
            )}
        </section>
    );

}