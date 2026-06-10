import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import API from "../../api/axios";

const Login = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setLoading(true);

        try {
            const res = await API.post("/auth/login", { email, password });
            login(res.data.token);
            navigate("/");
        } catch (err) {
            setError(err.response?.data?.message || "Login failed");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={styles.container}>
            <div style={styles.card}>
                <h1 style={styles.title}>Everest View Hotel</h1>
                <p style={styles.subtitle}>Admin Login</p>

                {error && <div style={styles.error}>{error}</div>}

                <form onSubmit={handleSubmit}>
                    <div style={styles.field}>
                        <label style={styles.label}>Email</label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            style={styles.input}
                            placeholder="admin@gmail.com"
                            required
                        />
                    </div>

                    <div style={styles.field}>
                        <label style={styles.label}>Password</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            style={styles.input}
                            placeholder="••••••••"
                            required
                        />
                    </div>

                    <button type="submit" className="shared-login-btn" style={styles.button} disabled={loading}>
                        {loading ? "Logging in..." : "Login"}
                    </button>
                </form>
            </div>
        </div>
    );
};

const styles = {
    container: {
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
        backgroundColor: "#f0f2f5",
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
    },
    subtitle: {
        textAlign: "center",
        color: "#666",
        marginBottom: "24px",
    },
    error: {
        backgroundColor: "#ffe0e0",
        color: "#c0392b",
        padding: "10px",
        borderRadius: "6px",
        marginBottom: "16px",
        textAlign: "center",
    },
    field: {
        marginBottom: "16px",
    },
    label: {
        display: "block",
        marginBottom: "6px",
        fontWeight: "bold",
        color: "#333",
    },
    input: {
        width: "100%",
        padding: "10px",
        borderRadius: "6px",
        border: "1px solid #ccc",
        fontSize: "15px",
        boxSizing: "border-box",
    },
    button: {
        width: "100%",
        padding: "12px",
        backgroundColor: "#1a1a2e",
        color: "white",
        border: "none",
        borderRadius: "6px",
        fontSize: "16px",
        cursor: "pointer",
        marginTop: "8px",
    },
};

export default Login;