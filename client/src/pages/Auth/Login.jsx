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

    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setLoading(true);

        try {
            const res = await API.post("/auth/login", { email, password });
            // Pass both token and user data to AuthContext
            login(res.data.token, res.data.user);
            navigate("/");
        } catch (err) {
            setError(err.response?.data?.message || "Login failed");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={styles.container}>
            <div style={styles.left}>
                <div style={styles.leftContent}>
                    <div style={styles.hotelIcon}>🏨</div>
                    <h1 style={styles.hotelName}>Hotel Management System</h1>
                    <p style={styles.hotelVersion}>Version 2.0</p>
                    <p style={styles.hotelTagline}>
                        Manage your hotel operations efficiently from one place
                    </p>
                    <div style={styles.features}>
                        <div style={styles.feature}>✅ Role Based Access Control</div>
                        <div style={styles.feature}>✅ Multi Hotel Support</div>
                        <div style={styles.feature}>✅ Payment Integration</div>
                        <div style={styles.feature}>✅ Real Time Dashboard</div>
                    </div>

                    <div style={styles.demoBox}>
                        <div style={styles.demoTitle}>Demo Credentials</div>
                        <div style={styles.demoRow}>
                            <span style={styles.demoRole}>Super Admin</span>
                            <span style={styles.demoEmail}>superadmin@hotel.com</span>
                        </div>
                        <div style={styles.demoRow}>
                            <span style={styles.demoRole}>Manager</span>
                            <span style={styles.demoEmail}>manager@hotel.com</span>
                        </div>
                        <div style={styles.demoRow}>
                            <span style={styles.demoRole}>Receptionist</span>
                            <span style={styles.demoEmail}>reception@hotel.com</span>
                        </div>
                        <div style={styles.demoRow}>
                            <span style={styles.demoRole}>Accountant</span>
                            <span style={styles.demoEmail}>accounts@hotel.com</span>
                        </div>
                        <div style={styles.demoPassword}>All passwords: role + 123</div>
                    </div>
                </div>
            </div>

            <div style={styles.right}>
                <div style={styles.card}>
                    <h2 style={styles.title}>Welcome Back</h2>
                    <p style={styles.subtitle}>Sign in to your account</p>

                    {error && <div style={styles.error}>{error}</div>}

                    <form onSubmit={handleSubmit}>
                        <div style={styles.field}>
                            <label style={styles.label}>Email Address</label>
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                style={styles.input}
                                placeholder="your@email.com"
                                required
                            />
                        </div>

                        <div style={styles.field}>
                            <label style={styles.label}>Password</label>
                            <div style={styles.passwordWrapper}>
                                <input
                                    type={showPassword ? "text" : "password"}
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    style={{ ...styles.input, paddingRight: "44px" }}
                                    placeholder="••••••••"
                                    required
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    style={styles.eyeBtn}
                                >
                                    {showPassword ? "🙈" : "👁️"}
                                </button>
                            </div>
                        </div>

                        <button
                            type="submit"
                            style={styles.button}
                            disabled={loading}
                        >
                            {loading ? "Signing in..." : "Sign In"}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

const styles = {
    container: {
        display: "flex",
        height: "100vh",
        overflow: "hidden",
    },
    left: {
        width: "60%",
        backgroundColor: "#1a1a2e",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "40px",
    },
    leftContent: {
        maxWidth: "480px",
    },
    hotelIcon: {
        fontSize: "56px",
        marginBottom: "16px",
    },
    hotelName: {
        fontSize: "32px",
        fontWeight: "bold",
        color: "white",
        marginBottom: "8px",
    },
    hotelVersion: {
        fontSize: "14px",
        color: "#9fa8d4",
        marginBottom: "16px",
    },
    hotelTagline: {
        fontSize: "16px",
        color: "#aaaacc",
        fontStyle: "italic",
        marginBottom: "32px",
        lineHeight: "1.6",
    },
    features: {
        display: "flex",
        flexDirection: "column",
        gap: "12px",
        marginBottom: "40px",
    },
    feature: {
        fontSize: "15px",
        color: "white",
    },
    demoBox: {
        backgroundColor: "rgba(255,255,255,0.08)",
        borderRadius: "10px",
        padding: "20px",
        border: "1px solid rgba(255,255,255,0.1)",
    },
    demoTitle: {
        fontSize: "13px",
        fontWeight: "bold",
        color: "#e9c46a",
        marginBottom: "12px",
        textTransform: "uppercase",
        letterSpacing: "1px",
    },
    demoRow: {
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: "8px",
    },
    demoRole: {
        fontSize: "13px",
        color: "#9fa8d4",
        fontWeight: "500",
        minWidth: "100px",
    },
    demoEmail: {
        fontSize: "13px",
        color: "white",
    },
    demoPassword: {
        fontSize: "12px",
        color: "#666",
        marginTop: "12px",
        borderTop: "1px solid rgba(255,255,255,0.1)",
        paddingTop: "10px",
    },
    right: {
        width: "40%",
        backgroundColor: "#f0f2f5",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "40px",
    },
    card: {
        backgroundColor: "white",
        padding: "40px",
        borderRadius: "12px",
        boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
        width: "100%",
        maxWidth: "400px",
    },
    title: {
        textAlign: "center",
        marginBottom: "4px",
        color: "#1a1a2e",
        fontSize: "26px",
    },
    subtitle: {
        textAlign: "center",
        color: "#666",
        marginBottom: "28px",
        fontSize: "14px",
    },
    error: {
        backgroundColor: "#ffe0e0",
        color: "#c0392b",
        padding: "10px",
        borderRadius: "6px",
        marginBottom: "16px",
        textAlign: "center",
        fontSize: "14px",
    },
    field: {
        marginBottom: "20px",
    },
    label: {
        display: "block",
        marginBottom: "6px",
        fontWeight: "bold",
        color: "#333",
        fontSize: "14px",
    },
    input: {
        width: "100%",
        padding: "12px",
        borderRadius: "6px",
        border: "1px solid #ccc",
        fontSize: "15px",
        boxSizing: "border-box",
        outline: "none",
    },
    passwordWrapper: {
        position: "relative",
    },
    eyeBtn: {
        position: "absolute",
        right: "12px",
        top: "50%",
        transform: "translateY(-50%)",
        background: "none",
        border: "none",
        cursor: "pointer",
        fontSize: "16px",
        padding: 0,
    },
    button: {
        width: "100%",
        padding: "14px",
        backgroundColor: "#1a1a2e",
        color: "white",
        border: "none",
        borderRadius: "6px",
        fontSize: "16px",
        cursor: "pointer",
        marginTop: "8px",
        fontWeight: "500",
    },
};

export default Login;