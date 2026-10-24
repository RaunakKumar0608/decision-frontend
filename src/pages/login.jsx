
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
    GitBranch,
    Mail,
    LockKeyhole,
    ArrowRight,
    ShieldCheck,
    Sparkles,
    AlertCircle,
    LoaderCircle,
} from "lucide-react";
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
        <div className="login-page">
            <div className="login-layout">
                <section className="login-showcase">
                    <Link to="/login" className="login-brand">
                        <span className="login-brand-icon">
                            <GitBranch size={23} />
                        </span>
                        <span>DecisionFlow</span>
                    </Link>

                    <div className="login-showcase-content">
                        <span className="login-eyebrow">
                            <Sparkles size={15} />
                            YOUR SPACE FOR BETTER DECISIONS
                        </span>

                        <h1>
                            Think clearly.
                            <br />
                            <span>Decide confidently.</span>
                        </h1>

                        <p>
                            Bring your thoughts, decisions, and team together
                            in one organized workspace.
                        </p>

                        <div className="login-feature-list">
                            <div className="login-feature">
                                <span className="login-feature-icon">
                                    <GitBranch size={19} />
                                </span>
                                <div>
                                    <strong>Keep your decisions organized</strong>
                                    <span>Capture the choice and the reasoning behind it.</span>
                                </div>
                            </div>

                            <div className="login-feature">
                                <span className="login-feature-icon">
                                    <ShieldCheck size={19} />
                                </span>
                                <div>
                                    <strong>Work together with your team</strong>
                                    <span>Bring group decisions into one workspace.</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <p className="login-showcase-footer">
                        Make every decision count.
                    </p>
                </section>

                <section className="login-form-section">
                    <form className="login-form-card" onSubmit={handleSubmit}>
                        <div className="login-mobile-brand">
                            <span className="login-brand-icon">
                                <GitBranch size={22} />
                            </span>
                            <span>DecisionFlow</span>
                        </div>

                        <div className="login-form-heading">
                            <span className="login-welcome-icon">
                                <LockKeyhole size={22} />
                            </span>
                            <h2>Welcome back</h2>
                            <p>Sign in to continue to your workspace.</p>
                        </div>

                        {error && (
                            <div className="login-error" role="alert">
                                <AlertCircle size={18} />
                                <span>{error}</span>
                            </div>
                        )}

                        <div className="login-field">
                            <label htmlFor="login-email">Email address</label>
                            <div className="login-input-wrap">
                                <Mail size={18} />
                                <input
                                    id="login-email"
                                    type="email"
                                    placeholder="you@example.com"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    autoComplete="email"
                                    required
                                />
                            </div>
                        </div>

                        <div className="login-field">
                            <label htmlFor="login-password">Password</label>
                            <div className="login-input-wrap">
                                <LockKeyhole size={18} />
                                <input
                                    id="login-password"
                                    type="password"
                                    placeholder="Enter your password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    autoComplete="current-password"
                                    required
                                />
                            </div>
                        </div>

                        <button
                            className="login-submit"
                            type="submit"
                            disabled={loading}
                        >
                            {loading ? (
                                <>
                                    <LoaderCircle size={19} className="login-spinner" />
                                    Signing in...
                                </>
                            ) : (
                                <>
                                    Sign in to your workspace
                                    <ArrowRight size={19} />
                                </>
                            )}
                        </button>

                        <p className="login-register-prompt">
                            Don't have an account?{" "}
                            <Link to="/register">Create one</Link>
                        </p>

                        <div className="login-security-note">
                            <ShieldCheck size={16} />
                            <span>Your workspace is waiting for you.</span>
                        </div>
                    </form>

                    <p className="login-bottom-note">
                        DecisionFlow · Your decisions, all in one place
                    </p>
                </section>
            </div>
        </div>
    );
}
