
import { useEffect, useState } from "react";
import {
    GitBranch,
    Plus,
    Layers,
    Pencil,
    Trash2,
    X,
    Save,
    Clock3,
    CheckCircle2,
    AlertCircle,
    LoaderCircle,
    FileText,
    Lightbulb,
    Users,
} from "lucide-react";
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

        if (!title.trim() || !decision.trim() ||
            !reason.trim() || !description.trim()) {
            setError("Please fill in all required fields.");
            return;
        }

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

    function cancelEditing() {
        resetForm();
        setError("");
        setMessage("");
    }

    if (loading) {
        return (
            <section className="decisions-loading">
                <LoaderCircle
                    size={27}
                    className="decisions-spinner"
                />
                <p>Loading your decisions...</p>
            </section>
        );
    }

    return (
        <section className="decisions-page">
            <div className="decisions-page-heading">
                <div>
                    <span className="eyebrow">YOUR WORKSPACE</span>
                    <h1>Decisions</h1>
                    <p className="muted">
                        Capture what you decide, why you decide it,
                        and keep everything organized.
                    </p>
                </div>

                <div className="decisions-heading-icon">
                    <GitBranch size={26} />
                </div>
            </div>

            {error && (
                <div className="decisions-alert decisions-alert-error">
                    <AlertCircle size={18} />
                    <span>{error}</span>
                    <button
                        type="button"
                        onClick={() => setError("")}
                        aria-label="Dismiss error"
                    >
                        <X size={17} />
                    </button>
                </div>
            )}

            {message && (
                <div className="decisions-alert decisions-alert-success">
                    <CheckCircle2 size={18} />
                    <span>{message}</span>
                    <button
                        type="button"
                        onClick={() => setMessage("")}
                        aria-label="Dismiss message"
                    >
                        <X size={17} />
                    </button>
                </div>
            )}

            <div className="decisions-summary-grid">
                <article className="decisions-summary-card">
                    <div className="decisions-summary-top">
                        <span className="decisions-summary-icon">
                            <GitBranch size={20} />
                        </span>
                        <span>Total decisions</span>
                    </div>
                    <h2>{decisions.length}</h2>
                    <p>Your recorded decisions</p>
                </article>

                <article className="decisions-summary-card">
                    <div className="decisions-summary-top">
                        <span className="decisions-summary-icon decisions-groups-icon">
                            <Users size={20} />
                        </span>
                        <span>Available groups</span>
                    </div>
                    <h2>{groups.length}</h2>
                    <p>Groups you can associate with a decision</p>
                </article>
            </div>

            <div className="decisions-form-card">
                <div className="decisions-form-heading">
                    <div className="decisions-form-icon">
                        {editingId ? (
                            <Pencil size={21} />
                        ) : (
                            <Plus size={22} />
                        )}
                    </div>

                    <div>
                        <h2>
                            {editingId ? "Edit decision" : "Create a decision"}
                        </h2>
                        <p>
                            {editingId
                                ? "Update the details of your existing decision."
                                : "Record your choice and the reasoning behind it."}
                        </p>
                    </div>
                </div>

                <form onSubmit={handleSubmit}>
                    <div className="decisions-form-grid">
                        <div className="decisions-field decisions-field-full">
                            <label htmlFor="title">
                                Decision title <span>*</span>
                            </label>
                            <div className="decisions-input-wrap">
                                <FileText size={18} />
                                <input
                                    id="title"
                                    value={title}
                                    onChange={(e) => setTitle(e.target.value)}
                                    placeholder="e.g. Choose project database"
                                    required
                                />
                            </div>
                        </div>

                        <div className="decisions-field decisions-field-full">
                            <label htmlFor="decision">
                                What did you decide? <span>*</span>
                            </label>
                            <div className="decisions-input-wrap">
                                <CheckCircle2 size={18} />
                                <input
                                    id="decision"
                                    value={decision}
                                    onChange={(e) => setDecision(e.target.value)}
                                    placeholder="Describe the final decision"
                                    required
                                />
                            </div>
                        </div>

                        <div className="decisions-field decisions-field-full">
                            <label htmlFor="reason">
                                Why did you decide this? <span>*</span>
                            </label>
                            <div className="decisions-textarea-wrap">
                                <Lightbulb size={18} />
                                <textarea
                                    id="reason"
                                    value={reason}
                                    onChange={(e) => setReason(e.target.value)}
                                    placeholder="Explain your reasoning..."
                                    rows={3}
                                    required
                                />
                            </div>
                        </div>

                        <div className="decisions-field decisions-field-full">
                            <label htmlFor="description">
                                Additional details <span>*</span>
                            </label>
                            <div className="decisions-textarea-wrap">
                                <FileText size={18} />
                                <textarea
                                    id="description"
                                    value={description}
                                    onChange={(e) =>
                                        setDescription(e.target.value)
                                    }
                                    placeholder="Add context, alternatives considered, or other notes..."
                                    rows={3}
                                    required
                                />
                            </div>
                        </div>

                        {!editingId && (
                            <div className="decisions-field decisions-field-full">
                                <label htmlFor="group">
                                    Associate with a group
                                    <span className="optional-label">
                                        Optional
                                    </span>
                                </label>

                                <div className="decisions-input-wrap">
                                    <Layers size={18} />
                                    <select
                                        id="group"
                                        value={groupId}
                                        onChange={(e) =>
                                            setGroupId(e.target.value)
                                        }
                                    >
                                        <option value="">
                                            Personal decision — no group
                                        </option>

                                        {groups.map((group) => (
                                            <option
                                                key={group._id}
                                                value={group._id}
                                            >
                                                {group.groupName}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                <p className="decisions-field-hint">
                                    Group decisions can be associated with a
                                    workspace for collaboration.
                                </p>
                            </div>
                        )}
                    </div>

                    <div className="decisions-form-actions">
                        {editingId && (
                            <button
                                type="button"
                                className="decisions-cancel-button"
                                onClick={cancelEditing}
                                disabled={creating}
                            >
                                <X size={17} />
                                Cancel
                            </button>
                        )}

                        <button
                            type="submit"
                            className="decisions-submit-button"
                            disabled={creating}
                        >
                            {creating ? (
                                <LoaderCircle
                                    size={17}
                                    className="decisions-spinner"
                                />
                            ) : editingId ? (
                                <Save size={17} />
                            ) : (
                                <Plus size={18} />
                            )}

                            {creating
                                ? "Saving..."
                                : editingId
                                    ? "Save changes"
                                    : "Create decision"}
                        </button>
                    </div>
                </form>
            </div>

            <div className="decisions-list-heading">
                <div>
                    <h2>Your decisions</h2>
                    <p className="muted">
                        Review and manage the decisions you've recorded.
                    </p>
                </div>

                <span className="decisions-count">
                    {decisions.length} total
                </span>
            </div>

            {decisions.length === 0 ? (
                <div className="decisions-empty">
                    <div className="decisions-empty-icon">
                        <GitBranch size={30} />
                    </div>
                    <h3>No decisions yet</h3>
                    <p>
                        Your decisions will appear here once you create your
                        first one.
                    </p>
                </div>
            ) : (
                <div className="decisions-list">
                    {decisions.map((item) => (
                        <article
                            className="decisions-item"
                            key={item._id}
                        >
                            <div className="decisions-item-top">
                                <div className="decisions-item-icon">
                                    <GitBranch size={20} />
                                </div>

                                <span className="decisions-status">
                                    <Clock3 size={14} />
                                    {item.status || "Pending"}
                                </span>
                            </div>

                            <h3>{item.title}</h3>

                            <div className="decisions-detail">
                                <span>Decision</span>
                                <p>{item.decision}</p>
                            </div>

                            <div className="decisions-detail">
                                <span>Reason</span>
                                <p>{item.reason}</p>
                            </div>

                            {item.description && (
                                <p className="decisions-description">
                                    {item.description}
                                </p>
                            )}

                            <div className="decisions-item-actions">
                                <button
                                    type="button"
                                    className="decisions-edit-button"
                                    onClick={() => startEditing(item)}
                                    disabled={
                                        creating || deletingId !== null
                                    }
                                >
                                    <Pencil size={16} />
                                    Edit
                                </button>

                                <button
                                    type="button"
                                    className="decisions-delete-button"
                                    onClick={() => handleDelete(item._id)}
                                    disabled={
                                        creating || deletingId !== null
                                    }
                                >
                                    {deletingId === item._id ? (
                                        <LoaderCircle
                                            size={16}
                                            className="decisions-spinner"
                                        />
                                    ) : (
                                        <Trash2 size={16} />
                                    )}
                                    {deletingId === item._id
                                        ? "Deleting..."
                                        : "Delete"}
                                </button>
                            </div>
                        </article>
                    ))}
                </div>
            )}
        </section>
    );
}
