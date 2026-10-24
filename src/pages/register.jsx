
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
    KeyRound,
    ArrowLeft,
} from "lucide-react";
import api from "../api/client.js";
import { useEffect, useState } from "react";

export default function Register() {
    const navigate = useNavigate();
    const [form, setForm] = useState({
        name: "",
        email: "",
        password: "",
    });

    const [otp, setOtp] = useState("");
    const [verificationStep, setVerificationStep] = useState(false);
    const [error, setError] = useState("");
    const [message, setMessage] = useState("");
    const [loading, setLoading] = useState(false);

    const [verified, setVerified] = useState(false);

    useEffect(() => {
        if (!verified) return;

        const timer = setTimeout(() => {
            navigate("/login", {
                state: {
                    message: "Email verified successfully. You can now log in.",
                    email: form.email.trim().toLowerCase(),
                },
            });
        }, 2200);

        return () => clearTimeout(timer);
    }, [verified, navigate, form.email]);

    function updateField(e) {
        setForm({ ...form, [e.target.name]: e.target.value });
    }

    async function handleSubmit(e) {
        e.preventDefault();
        setError("");
        setMessage("");
        setLoading(true);

        try {
            const response = await api.post("/register", form);

            setVerificationStep(true);
            setMessage(
                response.data?.message ||
                "Verification code sent. Check your email."
            );
        } catch (err) {
            setError(
                err.response?.data?.message || "Registration failed"
            );
        } finally {
            setLoading(false);
        }
    }

    async function handleVerifyOtp(e) {
        e.preventDefault();
        setError("");
        setMessage("");
        setLoading(true);

        try {
            const response = await api.post("/users/verify-email", {
                email: form.email.trim().toLowerCase(),
                otp,
            });

            setMessage("Email verified successfully! Redirecting you to login...");
            setVerified(true);

        } catch (err) {
            setError(
                err.response?.data?.message ||
                "Email verification failed"
            );
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
                    <form
                        className="register-form-card"
                        onSubmit={
                            verificationStep
                                ? handleVerifyOtp
                                : handleSubmit
                        }
                    >
                        <div className="register-mobile-brand">
                            <span className="register-brand-icon">
                                <GitBranch size={22} />
                            </span>
                            <span>DecisionFlow</span>
                        </div>

                        <div className="register-form-heading">
                            <span className="register-welcome-icon">
                                {verificationStep ? (
                                    <KeyRound size={22} />
                                ) : (
                                    <UserRound size={22} />
                                )}
                            </span>

                            <h2>
                                {verificationStep
                                    ? "Verify your email"
                                    : "Create your account"}
                            </h2>

                            <p>
                                {verificationStep
                                    ? `Enter the six-digit code sent to ${form.email}`
                                    : "Get started with your own decision workspace."}
                            </p>
                        </div>

                        {error && (
                            <div className="register-error" role="alert">
                                <AlertCircle size={18} />
                                <span>{error}</span>
                            </div>
                        )}

                        {message && (
                            <div className="register-security-note" role="status">
                                <CheckCircle2 size={16} />
                                <span>{message}</span>
                            </div>
                        )}

                        {!verificationStep ? (
                            <>
                                <div className="register-field">
                                    <label htmlFor="register-name">
                                        Full name
                                    </label>
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
                                    <label htmlFor="register-email">
                                        Email address
                                    </label>
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
                                    <label htmlFor="register-password">
                                        Password
                                    </label>
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
                                            minLength={8}
                                            required
                                        />
                                    </div>
                                    <span className="register-field-hint">
                                        Use at least 8 characters and avoid
                                        reusing another password.
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
                                            Sending verification code...
                                        </>
                                    ) : (
                                        <>
                                            Create account
                                            <ArrowRight size={19} />
                                        </>
                                    )}
                                </button>
                            </>
                        ) : (
                            <>
                                <div className="register-field">
                                    <label htmlFor="register-otp">
                                        Six-digit verification code
                                    </label>

                                    <div className="register-input-wrap">
                                        <KeyRound size={18} />
                                        <input
                                            id="register-otp"
                                            name="otp"
                                            type="text"
                                            inputMode="numeric"
                                            autoComplete="one-time-code"
                                            placeholder="Enter OTP"
                                            value={otp}
                                            onChange={(e) =>
                                                setOtp(
                                                    e.target.value
                                                        .replace(/\D/g, "")
                                                        .slice(0, 6)
                                                )
                                            }
                                            pattern="[0-9]{6}"
                                            maxLength={6}
                                            disabled={loading || verified}
                                            required
                                        />
                                    </div>

                                    <span className="register-field-hint">
                                        The code expires after 10 minutes.
                                        Check your spam folder if needed.
                                    </span>
                                </div>

                                <button
                                    className="register-submit"
                                    type="submit"
                                    disabled={loading || verified || otp.length !== 6}
                                >
                                    {loading ? (
                                        <>
                                            <LoaderCircle
                                                size={19}
                                                className="register-spinner"
                                            />
                                            Verifying email...
                                        </>
                                    ) : (
                                        <>
                                            Verify email
                                            <ShieldCheck size={19} />
                                        </>
                                    )}
                                </button>

                                <button
                                    className="register-back-button"
                                    type="button"
                                    onClick={() => {
                                        setVerificationStep(false);
                                        setOtp("");
                                        setError("");
                                        setMessage("");
                                    }}

                                    disabled={loading || verified}
                                >

                                    <ArrowLeft size={17} />
                                    Back to registration
                                </button>
                            </>
                        )}

                        <p className="register-login-prompt">
                            Already have an account?{" "}
                            <Link to="/login">Sign in</Link>
                        </p>

                        <div className="register-security-note">
                            <ShieldCheck size={16} />
                            <span>
                                {verificationStep
                                    ? "Verify your email to activate your account."
                                    : "Your workspace journey starts here."}
                            </span>
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