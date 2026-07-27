import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import API from "../../api/axios";

const Login = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [showDemo, setShowDemo] = useState(false);

    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setLoading(true);
        try {
            const res = await API.post("/auth/login", { email, password });
            login(res.data.token, res.data.user);
            navigate("/");
        } catch (err) {
            setError(err.response?.data?.message || "Login failed");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={styles.bg}>
            {/* Decorative glow */}
            <div style={styles.glow} />

            <div style={styles.card}>
                {/* Left — Brand Panel */}
                <div style={styles.brandPanel}>
                    <div style={styles.diamondPattern} />
                    <div style={styles.brandContent}>
                        <div style={styles.brandLogo}>
                            <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
                                <rect x="4" y="20" width="40" height="24" rx="2" fill="rgba(255,255,255,0.12)" />
                                <rect x="8" y="24" width="12" height="16" rx="1" fill="rgba(255,255,255,0.08)" />
                                <rect x="22" y="24" width="10" height="16" rx="1" fill="rgba(212,168,83,0.25)" />
                                <rect x="34" y="24" width="6" height="16" rx="1" fill="rgba(255,255,255,0.08)" />
                                <rect x="12" y="8" width="24" height="14" rx="2" fill="rgba(212,168,83,0.2)" />
                                <path d="M14 12h20v2H14z" fill="rgba(212,168,83,0.3)" />
                                <rect x="16" y="16" width="6" height="4" rx="1" fill="rgba(255,255,255,0.08)" />
                                <rect x="26" y="16" width="6" height="4" rx="1" fill="rgba(255,255,255,0.08)" />
                            </svg>
                        </div>

                        <h1 style={styles.brandTitle}>Hotel Management</h1>
                        <div style={styles.versionBadge}>v2.0</div>
                        <p style={styles.brandTagline}>
                            Manage your hotel operations with elegance and efficiency
                        </p>

                        <div style={styles.featureList}>
                            {[
                                "Role Based Access Control",
                                "Multi Hotel Support",
                                "Payment Integration",
                                "Real Time Dashboard",
                            ].map((f, i) => (
                                <div key={i} style={styles.featureItem}>
                                    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" style={{ flexShrink: 0 }}>
                                        <circle cx="7" cy="7" r="6" stroke="#d4a853" strokeWidth="1.5" />
                                        <path d="M4.5 7l2 2 3-3.5" stroke="#d4a853" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
                                    </svg>
                                    <span>{f}</span>
                                </div>
                            ))}
                        </div>

                        {/* Demo Credentials Toggle */}
                        <div style={styles.demoWrapper}>
                            <button
                                onClick={() => setShowDemo(!showDemo)}
                                style={styles.demoToggle}
                            >
                                <svg
                                    width="12" height="12" viewBox="0 0 12 12" fill="none"
                                    style={{
                                        transform: showDemo ? "rotate(90deg)" : "rotate(0deg)",
                                        transition: "transform 0.25s ease",
                                    }}
                                >
                                    <path d="M4 2l4 4-4 4" stroke="#d4a853" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                                Demo Credentials
                            </button>

                            {showDemo && (
                                <div style={styles.demoTable}>
                                    {[
                                        { role: "Super Admin", email: "superadmin@hotel.com" },
                                        { role: "Manager", email: "manager@hotel.com" },
                                        { role: "Receptionist", email: "reception@hotel.com" },
                                        { role: "Accountant", email: "accounts@hotel.com" },
                                    ].map((d, i) => (
                                        <div key={i} style={styles.demoRow}>
                                            <span style={styles.demoRole}>{d.role}</span>
                                            <span style={styles.demoEmail}>{d.email}</span>
                                        </div>
                                    ))}
                                    <div style={styles.demoFooter}>
                                        Password: role + 123
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Right — Form Panel */}
                <div style={styles.formPanel}>
                    <div style={styles.formContent}>
                        <h2 style={styles.formTitle}>Welcome Back</h2>
                        <p style={styles.formSubtitle}>Sign in to your account</p>

                        {error && (
                            <div style={styles.errorBanner}>
                                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" style={{ flexShrink: 0 }}>
                                    <circle cx="8" cy="8" r="7" stroke="#c0392b" strokeWidth="1.2" />
                                    <path d="M8 4.5v4" stroke="#c0392b" strokeWidth="1.2" strokeLinecap="round" />
                                    <circle cx="8" cy="11" r="0.8" fill="#c0392b" />
                                </svg>
                                <span>{error}</span>
                            </div>
                        )}

                        <form onSubmit={handleSubmit} style={{ width: "100%" }}>
                            <div style={styles.field}>
                                <label style={styles.label}>Email Address</label>
                                <div className="login-input-wrap" style={styles.inputWrap}>
                                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" style={styles.inputIcon} color="#999">
                                        <rect x="1.5" y="3.5" width="13" height="9" rx="2" stroke="currentColor" strokeWidth="1.2" />
                                        <path d="M1.5 4.5l6.5 5 6.5-5" stroke="currentColor" strokeWidth="1.2" strokeLinejoin="round" />
                                    </svg>
                                    <input
                                        type="email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        className="login-input"
                                        placeholder="your@email.com"
                                        required
                                    />
                                </div>
                            </div>

                            <div style={styles.field}>
                                <label style={styles.label}>Password</label>
                                <div className="login-input-wrap" style={styles.inputWrap}>
                                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" style={styles.inputIcon} color="#999">
                                        <rect x="3" y="6" width="10" height="8" rx="1.5" stroke="currentColor" strokeWidth="1.2" />
                                        <path d="M5.5 6V4.5a2.5 2.5 0 015 0V6" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
                                        <circle cx="8" cy="9.5" r="1" fill="currentColor" />
                                        <path d="M8 9.5v1.5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
                                    </svg>
                                    <input
                                        type={showPassword ? "text" : "password"}
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        className="login-input"
                                        style={{ paddingRight: "44px" }}
                                        placeholder="Enter your password"
                                        required
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="login-eye-btn"
                                        style={styles.eyeBtn}
                                        aria-label={showPassword ? "Hide password" : "Show password"}
                                    >
                                        {!showPassword ? (
                                            <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                                                <path d="M1.5 9s3-5.5 7.5-5.5S16.5 9 16.5 9s-3 5.5-7.5 5.5S1.5 9 1.5 9z" stroke="#999" strokeWidth="1.2" />
                                                <circle cx="9" cy="9" r="2.5" stroke="#999" strokeWidth="1.2" />
                                            </svg>
                                        ) : (
                                            <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                                                <path d="M1.5 9s3-5.5 7.5-5.5S16.5 9 16.5 9s-3 5.5-7.5 5.5S1.5 9 1.5 9z" stroke="#999" strokeWidth="1.2" />
                                                <circle cx="9" cy="9" r="2.5" stroke="#999" strokeWidth="1.2" />
                                                <path d="M3 3l12 12" stroke="#999" strokeWidth="1.2" strokeLinecap="round" />
                                            </svg>
                                        )}
                                    </button>
                                </div>
                            </div>

                            <button
                                type="submit"
                                className="login-submit-btn"
                                style={styles.submitBtn}
                                disabled={loading}
                            >
                                {loading ? (
                                    <span style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                                        <svg width="18" height="18" viewBox="0 0 18 18" fill="none" style={{ animation: "spin 0.8s linear infinite" }}>
                                            <circle cx="9" cy="9" r="7" stroke="rgba(255,255,255,0.3)" strokeWidth="2" />
                                            <path d="M9 2a7 7 0 016.24 3.76" stroke="white" strokeWidth="2" strokeLinecap="round" />
                                        </svg>
                                        Signing in...
                                    </span>
                                ) : (
                                    "Sign In"
                                )}
                            </button>
                        </form>

                        <div style={styles.footer}>
                            <span style={styles.footerText}>
                                Hotel Management System &copy; {new Date().getFullYear()}
                            </span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Keyframes for animations */}
            <style>{`
                @keyframes spin {
                    to { transform: rotate(360deg); }
                }
                @keyframes fadeUp {
                    from { opacity: 0; transform: translateY(30px) scale(0.97); }
                    to { opacity: 1; transform: translateY(0) scale(1); }
                }
                @keyframes glowPulse {
                    0%, 100% { opacity: 0.3; transform: scale(1); }
                    50% { opacity: 0.5; transform: scale(1.05); }
                }
            `}</style>
        </div>
    );
};

const styles = {
    bg: {
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "linear-gradient(135deg, #0c0c24 0%, #1a1a3e 40%, #2d1f3d 100%)",
        position: "relative",
        overflow: "hidden",
        padding: "20px",
    },
    glow: {
        position: "absolute",
        width: "600px",
        height: "600px",
        borderRadius: "50%",
        background: "radial-gradient(circle, rgba(212,168,83,0.12) 0%, transparent 70%)",
        top: "50%",
        left: "50%",
        transform: "translate(-50%, -50%)",
        animation: "glowPulse 6s ease-in-out infinite",
        pointerEvents: "none",
    },
    card: {
        display: "flex",
        width: "100%",
        maxWidth: "880px",
        minHeight: "560px",
        borderRadius: "20px",
        overflow: "hidden",
        boxShadow: "0 25px 60px rgba(0,0,0,0.5), 0 0 0 1px rgba(255,255,255,0.05)",
        animation: "fadeUp 0.6s ease-out",
        position: "relative",
        zIndex: 1,
    },

    // ---- Left Panel ----
    brandPanel: {
        flex: "0 0 42%",
        background: "linear-gradient(160deg, #12122e 0%, #1a1a3e 50%, #1f1a38 100%)",
        position: "relative",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "40px 32px",
    },
    diamondPattern: {
        position: "absolute",
        inset: 0,
        backgroundImage: `
            linear-gradient(45deg, rgba(255,255,255,0.02) 25%, transparent 25%),
            linear-gradient(-45deg, rgba(255,255,255,0.02) 25%, transparent 25%),
            linear-gradient(45deg, transparent 75%, rgba(255,255,255,0.02) 75%),
            linear-gradient(-45deg, transparent 75%, rgba(255,255,255,0.02) 75%)
        `,
        backgroundSize: "40px 40px",
        backgroundPosition: "0 0, 0 20px, 20px -20px, -20px 0px",
        pointerEvents: "none",
    },
    brandContent: {
        position: "relative",
        zIndex: 1,
        width: "100%",
        display: "flex",
        flexDirection: "column",
        gap: 0,
    },
    brandLogo: {
        marginBottom: "20px",
        display: "flex",
        alignItems: "center",
        gap: "12px",
    },
    brandTitle: {
        fontSize: "26px",
        fontWeight: "700",
        color: "white",
        letterSpacing: "-0.3px",
        margin: 0,
    },
    versionBadge: {
        display: "inline-block",
        marginTop: "6px",
        padding: "3px 12px",
        borderRadius: "20px",
        backgroundColor: "rgba(212,168,83,0.15)",
        color: "#d4a853",
        fontSize: "12px",
        fontWeight: "600",
        letterSpacing: "1px",
        border: "1px solid rgba(212,168,83,0.25)",
        alignSelf: "flex-start",
    },
    brandTagline: {
        fontSize: "14px",
        color: "#9999bb",
        lineHeight: "1.6",
        marginTop: "12px",
        marginBottom: "24px",
    },
    featureList: {
        display: "flex",
        flexDirection: "column",
        gap: "12px",
    },
    featureItem: {
        display: "flex",
        alignItems: "center",
        gap: "10px",
        fontSize: "14px",
        color: "#ccccee",
    },
    demoWrapper: {
        marginTop: "auto",
        paddingTop: "28px",
    },
    demoToggle: {
        display: "flex",
        alignItems: "center",
        gap: "8px",
        background: "none",
        border: "none",
        color: "#d4a853",
        fontSize: "13px",
        fontWeight: "600",
        cursor: "pointer",
        padding: "6px 0",
        letterSpacing: "0.3px",
        textTransform: "uppercase",
        transition: "opacity 0.2s",
    },
    demoTable: {
        marginTop: "12px",
        display: "flex",
        flexDirection: "column",
        gap: "6px",
    },
    demoRow: {
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        padding: "6px 10px",
        borderRadius: "6px",
        backgroundColor: "rgba(255,255,255,0.04)",
    },
    demoRole: {
        fontSize: "12px",
        color: "#9fa8d4",
        fontWeight: "500",
    },
    demoEmail: {
        fontSize: "12px",
        color: "white",
        fontFamily: "monospace",
    },
    demoFooter: {
        marginTop: "6px",
        fontSize: "11px",
        color: "rgba(255,255,255,0.35)",
        padding: "6px 10px",
        textAlign: "center",
        fontStyle: "italic",
    },

    // ---- Right Panel ----
    formPanel: {
        flex: 1,
        background: "white",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "48px 44px",
    },
    formContent: {
        width: "100%",
        maxWidth: "380px",
        display: "flex",
        flexDirection: "column",
        alignItems: "flex-start",
    },
    formTitle: {
        fontSize: "24px",
        fontWeight: "700",
        color: "#1a1a2e",
        margin: 0,
        marginBottom: "4px",
    },
    formSubtitle: {
        fontSize: "14px",
        color: "#999",
        margin: 0,
        marginBottom: "24px",
    },
    errorBanner: {
        display: "flex",
        alignItems: "center",
        gap: "8px",
        width: "100%",
        padding: "10px 14px",
        borderRadius: "8px",
        backgroundColor: "#fef0f0",
        border: "1px solid #f5c6cb",
        color: "#c0392b",
        fontSize: "13px",
        marginBottom: "16px",
    },
    field: {
        width: "100%",
        marginBottom: "18px",
    },
    label: {
        display: "block",
        marginBottom: "6px",
        fontWeight: "600",
        color: "#1a1a2e",
        fontSize: "13px",
    },
    inputWrap: {
        position: "relative",
        display: "flex",
        alignItems: "center",
    },
    inputIcon: {
        position: "absolute",
        left: "12px",
        top: "50%",
        transform: "translateY(-50%)",
        zIndex: 1,
        pointerEvents: "none",
        transition: "stroke 0.2s ease",
    },
    input: {
        width: "100%",
        padding: "12px 12px 12px 40px",
        borderRadius: "8px",
        border: "1.5px solid #e0e0e0",
        fontSize: "14px",
        fontFamily: "inherit",
        boxSizing: "border-box",
        outline: "none",
        backgroundColor: "#fafafa",
        transition: "border-color 0.2s ease, box-shadow 0.2s ease, background-color 0.2s ease",
    },
    eyeBtn: {
        position: "absolute",
        right: "10px",
        top: "50%",
        transform: "translateY(-50%)",
        background: "none",
        border: "none",
        cursor: "pointer",
        padding: "6px",
        borderRadius: "6px",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        transition: "background-color 0.2s ease",
    },
    submitBtn: {
        width: "100%",
        padding: "13px",
        backgroundColor: "#1a1a2e",
        color: "white",
        border: "none",
        borderRadius: "8px",
        fontSize: "15px",
        fontWeight: "600",
        cursor: "pointer",
        marginTop: "8px",
        fontFamily: "inherit",
        transition: "transform 0.2s ease, box-shadow 0.2s ease, background-color 0.2s ease, filter 0.2s ease",
    },
    footer: {
        width: "100%",
        textAlign: "center",
        marginTop: "32px",
    },
    footerText: {
        fontSize: "11px",
        color: "#ccc",
    },
};

export default Login;
