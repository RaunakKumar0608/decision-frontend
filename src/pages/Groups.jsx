import { useEffect, useState } from "react";
import {
    Users,
    UserPlus,
    UserMinus,
    UsersRound,
    ArrowRight,
    GitBranch,
    Plus,
    Layers,
    Mail,
    X,
    LoaderCircle,
    CheckCircle2,
    AlertCircle,
} from "lucide-react";
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
    const [creatingGroup, setCreatingGroup] = useState(false);
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
        if (!groupName.trim()) return;

        setError("");
        setMessage("");
        setCreatingGroup(true);

        try {
            await api.post("/groups/createGroup", {
                groupName: groupName.trim(),
            });

            setGroupName("");
            setMessage("Group created successfully!");
            await loadGroups();
        } catch (err) {
            setError(
                err.response?.data?.message || "Failed to create group"
            );
        } finally {
            setCreatingGroup(false);
        }
    }

    async function openGroup(group) {
        setSelectedGroup(group);
        setMembers([]);
        setSelectedMember(null);
        setMemberDecisions([]);
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
                email,
            });

            if (selectedMember?.email === email) {
                setSelectedMember(null);
                setMemberDecisions([]);
            }

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
                params: {
                    groupId: selectedGroup._id,
                    email: member.email,
                },
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

    if (loading) {
        return (
            <section className="groups-loading">
                <LoaderCircle size={26} className="groups-spinner" />
                <p>Loading your workspace...</p>
            </section>
        );
    }

    return (
        <section className="groups-page">
            <div className="groups-page-heading">
                <div>
                    <span className="eyebrow">YOUR WORKSPACE</span>
                    <h1>My Groups</h1>
                    <p className="muted">
                        Bring your team together and organize decisions.
                    </p>
                </div>

                <div className="groups-heading-icon">
                    <UsersRound size={25} />
                </div>
            </div>

            {error && (
                <div className="groups-alert groups-alert-error">
                    <AlertCircle size={18} />
                    <span>{error}</span>
                    <button
                        type="button"
                        className="groups-alert-close"
                        onClick={() => setError("")}
                        aria-label="Dismiss error"
                    >
                        <X size={17} />
                    </button>
                </div>
            )}

            {message && (
                <div className="groups-alert groups-alert-success">
                    <CheckCircle2 size={18} />
                    <span>{message}</span>
                    <button
                        type="button"
                        className="groups-alert-close"
                        onClick={() => setMessage("")}
                        aria-label="Dismiss message"
                    >
                        <X size={17} />
                    </button>
                </div>
            )}

            <div className="groups-summary-grid">
                <article className="groups-summary-card">
                    <div className="groups-summary-top">
                        <span className="groups-summary-icon">
                            <UsersRound size={20} />
                        </span>
                        <span className="groups-summary-label">
                            Total groups
                        </span>
                    </div>
                    <h2>{groups.length}</h2>
                    <p>Your team workspaces</p>
                </article>

                <article className="groups-summary-card">
                    <div className="groups-summary-top">
                        <span className="groups-summary-icon members-icon">
                            <Users size={20} />
                        </span>
                        <span className="groups-summary-label">
                            Total memberships
                        </span>
                    </div>
                    <h2>
                        {groups.reduce(
                            (total, group) =>
                                total + (group.groupMembers?.length || 0),
                            0
                        )}
                    </h2>
                    <p>Memberships across your groups</p>
                </article>
            </div>

            <div className="groups-create-card">
                <div className="groups-create-heading">
                    <div className="groups-create-icon">
                        <Plus size={21} />
                    </div>
                    <div>
                        <h2>Create a group</h2>
                        <p>Start a new workspace for your team.</p>
                    </div>
                </div>

                <form
                    className="groups-create-form"
                    onSubmit={handleSubmit}
                >
                    <div className="groups-input-wrapper">
                        <Layers size={18} />
                        <input
                            id="groupName"
                            value={groupName}
                            onChange={(e) => setGroupName(e.target.value)}
                            placeholder="Enter a group name..."
                            aria-label="Group name"
                            required
                        />
                    </div>

                    <button
                        className="groups-primary-button"
                        type="submit"
                        disabled={creatingGroup || !groupName.trim()}
                    >
                        {creatingGroup ? (
                            <>
                                <LoaderCircle
                                    size={17}
                                    className="groups-spinner"
                                />
                                Creating...
                            </>
                        ) : (
                            <>
                                <Plus size={18} />
                                Create group
                            </>
                        )}
                    </button>
                </form>
            </div>

            <div className="groups-section-heading">
                <div>
                    <h2>Your groups</h2>
                    <p className="muted">
                        Select a group to manage its members.
                    </p>
                </div>
                <span className="groups-count">{groups.length} groups</span>
            </div>

            {groups.length === 0 ? (
                <div className="groups-empty">
                    <div className="groups-empty-icon">
                        <UsersRound size={30} />
                    </div>
                    <h3>No groups yet</h3>
                    <p>
                        Create your first group above to start collaborating
                        with your team.
                    </p>
                </div>
            ) : (
                <div className="groups-grid">
                    {groups.map((group) => (
                        <article
                            className={`groups-card ${
                                selectedGroup?._id === group._id
                                    ? "groups-card-selected"
                                    : ""
                            }`}
                            key={group._id}
                        >
                            <div className="groups-card-top">
                                <div className="groups-card-icon">
                                    <UsersRound size={22} />
                                </div>
                                <span className="groups-card-status">
                                    <span />
                                    Active
                                </span>
                            </div>

                            <h3>{group.groupName}</h3>
                            <p className="groups-card-members">
                                <Users size={16} />
                                {group.groupMembers?.length ?? 0} members
                            </p>

                            <button
                                type="button"
                                className={
                                    selectedGroup?._id === group._id
                                        ? "groups-secondary-button selected"
                                        : "groups-secondary-button"
                                }
                                onClick={() => openGroup(group)}
                            >
                                {selectedGroup?._id === group._id
                                    ? "Refresh members"
                                    : "Manage group"}
                                <ArrowRight size={17} />
                            </button>
                        </article>
                    ))}
                </div>
            )}

            {selectedGroup && (
                <div className="groups-management">
                    <div className="groups-management-heading">
                        <div className="groups-management-title">
                            <div className="groups-card-icon">
                                <UsersRound size={22} />
                            </div>
                            <div>
                                <span className="eyebrow">GROUP MANAGEMENT</span>
                                <h2>{selectedGroup.groupName}</h2>
                                <p className="muted">
                                    Manage members and explore their decisions.
                                </p>
                            </div>
                        </div>

                        <button
                            type="button"
                            className="groups-icon-button"
                            onClick={() => {
                                setSelectedGroup(null);
                                setSelectedMember(null);
                                setMemberDecisions([]);
                                setError("");
                                setMessage("");
                            }}
                            aria-label="Close group management"
                            title="Close group management"
                        >
                            <X size={19} />
                        </button>
                    </div>

                    <div className="groups-add-member">
                        <div>
                            <h3>
                                <UserPlus size={19} />
                                Add a teammate
                            </h3>
                            <p className="muted">
                                Enter the email address associated with their account.
                            </p>
                        </div>

                        <form onSubmit={addMember}>
                            <div className="groups-input-wrapper">
                                <Mail size={18} />
                                <input
                                    id="memberEmail"
                                    type="email"
                                    value={memberEmail}
                                    onChange={(e) =>
                                        setMemberEmail(e.target.value)
                                    }
                                    placeholder="member@example.com"
                                    aria-label="Member email"
                                    required
                                />
                            </div>
                            <button
                                type="submit"
                                className="groups-primary-button"
                                disabled={addingMember || !memberEmail.trim()}
                            >
                                {addingMember ? (
                                    <LoaderCircle
                                        size={17}
                                        className="groups-spinner"
                                    />
                                ) : (
                                    <UserPlus size={17} />
                                )}
                                {addingMember ? "Adding..." : "Add member"}
                            </button>
                        </form>
                    </div>

                    <div className="groups-members-heading">
                        <h3>Team members</h3>
                        <span className="groups-count">
                            {members.length} members
                        </span>
                    </div>

                    {loadingMembers ? (
                        <div className="groups-inline-loading">
                            <LoaderCircle
                                size={21}
                                className="groups-spinner"
                            />
                            <span>Loading members...</span>
                        </div>
                    ) : members.length === 0 ? (
                        <div className="groups-inline-empty">
                            <Users size={25} />
                            <p>No members returned for this group.</p>
                        </div>
                    ) : (
                        <div className="groups-member-list">
                            {members.map((member, index) => (
                                <article
                                    className="groups-member-row"
                                    key={member._id || member.id || member.email || index}
                                >
                                    <div className="groups-member-avatar">
                                        {(member.name || member.email || "?")
                                            .charAt(0)
                                            .toUpperCase()}
                                    </div>

                                    <div className="groups-member-info">
                                        <h4>
                                            {member.name ||
                                                member.email ||
                                                "Unnamed member"}
                                        </h4>
                                        <p>
                                            <Mail size={14} />
                                            {member.email || "No email available"}
                                        </p>
                                    </div>

                                    <div className="groups-member-actions">
                                        <button
                                            type="button"
                                            className="groups-view-decisions-button"
                                            onClick={() =>
                                                viewMemberDecisions(member)
                                            }
                                            disabled={
                                                !member.email || loadingDecisions
                                            }
                                        >
                                            {loadingDecisions &&
                                            selectedMember?.email === member.email ? (
                                                <LoaderCircle
                                                    size={16}
                                                    className="groups-spinner"
                                                />
                                            ) : (
                                                <GitBranch size={16} />
                                            )}
                                            View decisions
                                        </button>

                                        <button
                                            type="button"
                                            className="groups-remove-button"
                                            onClick={() =>
                                                handleRemoveMember(member)
                                            }
                                            disabled={
                                                removingMember === member.email
                                            }
                                            aria-label={`Remove ${
                                                member.name || member.email
                                            }`}
                                        >
                                            {removingMember === member.email ? (
                                                <LoaderCircle
                                                    size={16}
                                                    className="groups-spinner"
                                                />
                                            ) : (
                                                <UserMinus size={16} />
                                            )}
                                            Remove
                                        </button>
                                    </div>
                                </article>
                            ))}
                        </div>
                    )}

                    {selectedMember && (
                        <div className="groups-decisions-panel">
                            <div className="groups-decisions-heading">
                                <div>
                                    <span className="eyebrow">
                                        MEMBER ACTIVITY
                                    </span>
                                    <h3>
                                        Decisions by{" "}
                                        {selectedMember.name ||
                                            selectedMember.email}
                                    </h3>
                                    <p className="muted">
                                        Decisions created by this member in this group.
                                    </p>
                                </div>

                                <button
                                    type="button"
                                    className="groups-icon-button"
                                    onClick={() => {
                                        setSelectedMember(null);
                                        setMemberDecisions([]);
                                        setError("");
                                    }}
                                    aria-label="Close member decisions"
                                >
                                    <X size={18} />
                                </button>
                            </div>

                            {loadingDecisions ? (
                                <div className="groups-inline-loading">
                                    <LoaderCircle
                                        size={21}
                                        className="groups-spinner"
                                    />
                                    <span>Loading decisions...</span>
                                </div>
                            ) : memberDecisions.length === 0 ? (
                                <div className="groups-inline-empty">
                                    <GitBranch size={25} />
                                    <p>
                                        No decisions found for this member in this group.
                                    </p>
                                </div>
                            ) : (
                                <div className="groups-decision-list">
                                    {memberDecisions.map((item, index) => (
                                        <article
                                            className="groups-decision-card"
                                            key={item._id || index}
                                        >
                                            <div className="groups-decision-card-top">
                                                <div className="groups-decision-icon">
                                                    <GitBranch size={19} />
                                                </div>
                                                <span className="groups-decision-status">
                                                    {item.status || "Pending"}
                                                </span>
                                            </div>

                                            <h4>{item.title}</h4>

                                            <div className="groups-decision-field">
                                                <span>Decision</span>
                                                <p>{item.decision || "Not specified"}</p>
                                            </div>

                                            <div className="groups-decision-field">
                                                <span>Reason</span>
                                                <p>{item.reason || "Not specified"}</p>
                                            </div>

                                            {item.description && (
                                                <p className="groups-decision-description">
                                                    {item.description}
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
