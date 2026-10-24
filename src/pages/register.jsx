
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
    GitBranch,
    UserRound,
    Mail,
    LockKeyhole,
    ArrowRight,
    ShieldCheck,
    Sparkles,
    AlertCircle,
    LoaderCircle,
    UsersRound,
    CheckCircle2,
} from "lucide-react";
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
        <div className="register-page">
            <div className="register-layout">
                <section className="register-showcase">
                    <Link to="/login" className="register-brand">
                        <span className="register-brand-icon">
                            <GitBranch size={23} />
                        </span>
                        <span>DecisionFlow</span>
                    </Link>

                    <div className="register-showcase-content">
                        <span className="register-eyebrow">
                            <Sparkles size={15} />
                            YOUR NEXT CHAPTER STARTS HERE
                        </span>

                        <h1>
                            Turn your thoughts
                            <br />
                            into <span>clear decisions.</span>
                        </h1>

                        <p>
                            Create your workspace, organize your thinking,
                            and make better decisions with the people who
                            matter.
                        </p>

                        <div className="register-benefits">
                            <div className="register-benefit">
                                <span className="register-benefit-icon">
                                    <CheckCircle2 size={19} />
                                </span>
                                <div>
                                    <strong>Capture your reasoning</strong>
                                    <span>Keep the why behind every decision.</span>
                                </div>
                            </div>

                            <div className="register-benefit">
                                <span className="register-benefit-icon">
                                    <UsersRound size={19} />
                                </span>
                                <div>
                                    <strong>Bring your team together</strong>
                                    <span>Organize group decisions in one place.</span>
                                </div>
                            </div>

                            <div className="register-benefit">
                                <span className="register-benefit-icon">
                                    <ShieldCheck size={19} />
                                </span>
                                <div>
                                    <strong>Build your personal workspace</strong>
                                    <span>Keep your decisions structured and accessible.</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <p className="register-showcase-footer">
                        A little clarity goes a long way.
                    </p>
                </section>

                <section className="register-form-section">
                    <form className="register-form-card" onSubmit={handleSubmit}>
                        <div className="register-mobile-brand">
                            <span className="register-brand-icon">
                                <GitBranch size={22} />
                            </span>
                            <span>DecisionFlow</span>
                        </div>

                        <div className="register-form-heading">
                            <span className="register-welcome-icon">
                                <UserRound size={22} />
                            </span>
                            <h2>Create your account</h2>
                            <p>Get started with your own decision workspace.</p>
                        </div>

                        {error && (
                            <div className="register-error" role="alert">
                                <AlertCircle size={18} />
                                <span>{error}</span>
                            </div>
                        )}

                        <div className="register-field">
                            <label htmlFor="register-name">Full name</label>
                            <div className="register-input-wrap">
                                <UserRound size={18} />
                                <input
                                    id="register-name"
                                    name="name"
                                    type="text"
                                    placeholder="Enter your name"
                                    value={form.name}
                                    onChange={updateField}
                                    autoComplete="name"
                                    required
                                />
                            </div>
                        </div>

                        <div className="register-field">
                            <label htmlFor="register-email">Email address</label>
                            <div className="register-input-wrap">
                                <Mail size={18} />
                                <input
                                    id="register-email"
                                    name="email"
                                    type="email"
                                    placeholder="you@example.com"
                                    value={form.email}
                                    onChange={updateField}
                                    autoComplete="email"
                                    required
                                />
                            </div>
                        </div>

                        <div className="register-field">
                            <label htmlFor="register-password">Password</label>
                            <div className="register-input-wrap">
                                <LockKeyhole size={18} />
                                <input
                                    id="register-password"
                                    name="password"
                                    type="password"
                                    placeholder="Create a password"
                                    value={form.password}
                                    onChange={updateField}
                                    autoComplete="new-password"
                                    required
                                />
                            </div>
                            <span className="register-field-hint">
                                Choose a password that you don't use elsewhere.
                            </span>
                        </div>

                        <button
                            className="register-submit"
                            type="submit"
                            disabled={loading}
                        >
                            {loading ? (
                                <>
                                    <LoaderCircle
                                        size={19}
                                        className="register-spinner"
                                    />
                                    Creating account...
                                </>
                            ) : (
                                <>
                                    Create account
                                    <ArrowRight size={19} />
                                </>
                            )}
                        </button>

                        <p className="register-login-prompt">
                            Already have an account?{" "}
                            <Link to="/login">Sign in</Link>
                        </p>

                        <div className="register-security-note">
                            <ShieldCheck size={16} />
                            <span>Your workspace journey starts here.</span>
                        </div>
                    </form>

                    <p className="register-bottom-note">
                        DecisionFlow · Your decisions, all in one place
                    </p>
                </section>
            </div>
        </div>
    );
}
