
import { useEffect, useState } from "react";
import api from "../api/client.js";

export default function Decisions() {
    const [groups, setGroups] = useState([]);
    const [decisions, setDecisions] = useState([]);

    const [title, setTitle] = useState("");
    const [decision, setDecision] = useState("");
    const [reason, setReason] = useState("");
    const [description, setDescription] = useState("");
    const [groupId, setGroupId] = useState("");

    const [editingId, setEditingId] = useState(null);
    const [loading, setLoading] = useState(true);
    const [creating, setCreating] = useState(false);
    const [deletingId, setDeletingId] = useState(null);

    const [error, setError] = useState("");
    const [message, setMessage] = useState("");

    async function loadData() {
        setLoading(true);
        setError("");

        try {
            const [groupResponse, decisionResponse] = await Promise.all([
                api.post("/users/myGroups"),
                api.get("/decisions/getDecisions"),
            ]);

            setGroups(
                Array.isArray(groupResponse.data)
                    ? groupResponse.data
                    : groupResponse.data.groups || []
            );

            const data = decisionResponse.data;

            setDecisions(
                Array.isArray(data)
                    ? data
                    : data.decisions || []
            );
        } catch (err) {
            setError(
                err.response?.data?.message ||
                "Could not load your groups and decisions."
            );
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        loadData();
    }, []);

    function resetForm() {
        setTitle("");
        setDecision("");
        setReason("");
        setDescription("");
        setGroupId("");
        setEditingId(null);
    }

    function startEditing(item) {
        setEditingId(item._id);
        setTitle(item.title || "");
        setDecision(item.decision || "");
        setReason(item.reason || "");
        setDescription(item.description || "");
        setGroupId("");

        setError("");
        setMessage("");

        window.scrollTo({
            top: 0,
            behavior: "smooth",
        });
    }

    async function handleSubmit(e) {
        e.preventDefault();
        setError("");
        setMessage("");
        setCreating(true);

        try {
            const payload = {
                title: title.trim(),
                decision: decision.trim(),
                reason: reason.trim(),
                description: description.trim(),
            };

            if (editingId) {
                await api.patch(
                    `/decisions/editDecisions/${editingId}`,
                    payload
                );

                setMessage("Decision updated successfully!");
            } else {
                if (groupId) {
                    payload.groupId = groupId;
                }

                await api.post("/decisions/create", payload);

                setMessage("Decision created successfully!");
            }

            resetForm();
            await loadData();
        } catch (err) {
            setError(
                err.response?.data?.message ||
                `Could not ${editingId ? "update" : "create"} the decision.`
            );
        } finally {
            setCreating(false);
        }
    }

    async function handleDelete(id) {
        const confirmed = window.confirm(
            "Are you sure you want to delete this decision? This cannot be undone."
        );

        if (!confirmed) return;

        setError("");
        setMessage("");
        setDeletingId(id);

        try {
            await api.delete(`/decisions/deleteDecisions/${id}`);

            if (editingId === id) {
                resetForm();
            }

            setMessage("Decision deleted successfully!");
            await loadData();
        } catch (err) {
            setError(
                err.response?.data?.message ||
                "Could not delete the decision."
            );
        } finally {
            setDeletingId(null);
        }
    }

    return (
        <section>
            <h1>Decisions</h1>
            <p className="muted">
                Record decisions and keep track of why they were made.
            </p>

            {error && (
                <p className="error" role="alert">{error}</p>
            )}

            {message && (
                <p role="status">{message}</p>
            )}

            <form className="content-card" onSubmit={handleSubmit}>
                <h2>
                    {editingId ? "Edit decision" : "Create a decision"}
                </h2>

                <label htmlFor="title">Title</label>
                <input
                    id="title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="e.g. Choose project database"
                    required
                />

                <label htmlFor="decision">Decision</label>
                <input
                    id="decision"
                    value={decision}
                    onChange={(e) => setDecision(e.target.value)}
                    placeholder="What did you decide?"
                    required
                />

                <label htmlFor="reason">Reason</label>
                <textarea
                    id="reason"
                    value={reason}
                    onChange={(e) => setReason(e.target.value)}
                    placeholder="Why was this decision made?"
                    required
                />

                <label htmlFor="description">Description</label>
                <textarea
                    id="description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Add more context"
                    required
                />

                {!editingId && (
                    <>
                        <label htmlFor="group">Group (optional)</label>
                        <select
                            id="group"
                            value={groupId}
                            onChange={(e) => setGroupId(e.target.value)}
                        >
                            <option value="">
                                Personal decision — no group
                            </option>

                            {groups.map((group) => (
                                <option key={group._id} value={group._id}>
                                    {group.groupName}
                                </option>
                            ))}
                        </select>
                    </>
                )}

                <button type="submit" disabled={creating}>
                    {creating
                        ? "Saving..."
                        : editingId
                            ? "Save changes"
                            : "Create decision"}
                </button>

                {editingId && (
                    <button
                        type="button"
                        onClick={() => {
                            resetForm();
                            setError("");
                            setMessage("");
                        }}
                        disabled={creating}
                    >
                        Cancel editing
                    </button>
                )}
            </form>

            <div className="content-card">
                <h2>Your decisions</h2>

                {loading ? (
                    <p>Loading decisions...</p>
                ) : decisions.length === 0 ? (
                    <p className="muted">
                        No decisions yet. Create your first one above.
                    </p>
                ) : (
                    <div className="group-list">
                        {decisions.map((item) => (
                            <article
                                className="group-item"
                                key={item._id}
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

                                <button
                                    type="button"
                                    onClick={() => startEditing(item)}
                                    disabled={creating || deletingId !== null}
                                >
                                    Edit
                                </button>

                                <button
                                    type="button"
                                    onClick={() => handleDelete(item._id)}
                                    disabled={creating || deletingId !== null}
                                >
                                    {deletingId === item._id
                                        ? "Deleting..."
                                        : "Delete"}
                                </button>
                            </article>
                        ))}
                    </div>
                )}
            </div>
        </section>
    );
}
