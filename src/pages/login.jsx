import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../api/client.js";

export default function Login() {
    const navigate = useNavigate();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    async function handleSubmit(e) {
        e.preventDefault();
        setError("");
        setLoading(true);

        try {
            await api.post("/login", { email, password });
            navigate("/");
        } catch (err) {
            setError(err.response?.data?.message || "Unable to log in");
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="auth-page">
            <form className="auth-card" onSubmit={handleSubmit}>
                <h1>Welcome back</h1>
                <p className="muted">Sign in to your decision workspace.</p>

                {error && <p className="error">{error}</p>}

                <label>Email</label>
                <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                />

                <label>Password</label>
                <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                />

                <button disabled={loading}>
                    {loading ? "Signing in..." : "Sign in"}
                </button>

                <p>
                    Don't have an account? <Link to="/register">Register</Link>
                </p>
            </form>
        </div>
    );
}