import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../api/client.js";

export default function Register() {
    const navigate = useNavigate();
    const [form, setForm] = useState({
        name: "",
        email: "",
        password: "",
    });
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    function updateField(e) {
        setForm({ ...form, [e.target.name]: e.target.value });
    }

    async function handleSubmit(e) {
        e.preventDefault();
        setError("");
        setLoading(true);

        try {
            await api.post("/register", form);
            navigate("/login");
        } catch (err) {
            setError(err.response?.data?.message || "Registration failed");
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="auth-page">
            <form className="auth-card" onSubmit={handleSubmit}>
                <h1>Create your account</h1>
                <p className="muted">Start tracking decisions with your team.</p>

                {error && <p className="error">{error}</p>}

                <label>Name</label>
                <input
                    name="name"
                    value={form.name}
                    onChange={updateField}
                    required
                />

                <label>Email</label>
                <input
                    name="email"
                    type="email"
                    value={form.email}
                    onChange={updateField}
                    required
                />

                <label>Password</label>
                <input
                    name="password"
                    type="password"
                    value={form.password}
                    onChange={updateField}
                    required
                />

                <button disabled={loading}>
                    {loading ? "Creating account..." : "Register"}
                </button>

                <p>
                    Already registered? <Link to="/login">Sign in</Link>
                </p>
            </form>
        </div>
    );
}