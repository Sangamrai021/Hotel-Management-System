import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Unauthorized = () => {
    const navigate = useNavigate();
    const { user } = useAuth();

    const getDashboardPath = () => {
        switch (user?.role) {
            case "SuperAdmin": return "/";
            case "Manager": return "/";
            case "Receptionist": return "/";
            case "Accountant": return "/";
            default: return "/login";
        }
    };

    return (
        <div style={styles.container}>
            <div style={styles.card}>
                <div style={styles.icon}></div>
                <h2 style={styles.title}>Access Denied</h2>
                <p style={styles.message}>
                    You do not have permission to view this page.
                </p>
                <p style={styles.role}>
                    Your role: <strong>{user?.role}</strong>
                </p>
                <button
                    onClick={() => navigate(getDashboardPath())}
                    style={styles.button}
                >
                    Go to Dashboard
                </button>
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
        padding: "48px",
        borderRadius: "12px",
        boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
        textAlign: "center",
        maxWidth: "400px",
        width: "100%",
    },
    icon: {
        fontSize: "64px",
        marginBottom: "16px",
    },
    title: {
        fontSize: "24px",
        color: "#1a1a2e",
        marginBottom: "12px",
    },
    message: {
        fontSize: "15px",
        color: "#666",
        marginBottom: "8px",
    },
    role: {
        fontSize: "14px",
        color: "#666",
        marginBottom: "24px",
    },
    button: {
        backgroundColor: "#1a1a2e",
        color: "white",
        border: "none",
        padding: "12px 28px",
        borderRadius: "6px",
        cursor: "pointer",
        fontSize: "15px",
    },
};

export default Unauthorized;