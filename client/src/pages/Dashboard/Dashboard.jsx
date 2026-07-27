import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import API from "../../api/axios";

const Dashboard = () => {
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const { user } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const res = await API.get("/dashboard/stats");
                setStats(res.data);
            } catch (err) {
                setError("Failed to load dashboard stats");
            } finally {
                setLoading(false);
            }
        };
        fetchStats();
    }, []);

    if (loading) return <div style={styles.center}>Loading...</div>;
    if (error) return <div style={styles.center}>{error}</div>;

    // Cards differ per role
    const getCards = () => {
        const base = [
            { label: "Total Rooms", value: stats.totalRooms, color: "#1a1a2e" },
            { label: "Occupied Rooms", value: stats.occupiedRooms, color: "#e63946" },
            { label: "Available Rooms", value: stats.availableRooms, color: "#2a9d8f" },
            { label: "Total Guests", value: stats.totalGuests, color: "#4361ee" },
            { label: "Bookings Today", value: stats.bookingsToday, color: "#f4a261" },
            {
                label: "Revenue This Month",
                value: `Rs. ${stats.revenueThisMonth.toLocaleString()}`,
                color: "#6d6875",
            },
            {
                label: "Pending Payments",
                value: stats.pendingPayments,
                color: "#e9c46a",
            },
        ];

        // Accountant sees only financial cards
        if (user?.role === "Accountant") {
            return [
                { label: "Revenue This Month", value: `Rs. ${stats.revenueThisMonth.toLocaleString()}`, color: "#6d6875" },
                { label: "Pending Payments", value: stats.pendingPayments, color: "#e63946" },
                { label: "Bookings Today", value: stats.bookingsToday, color: "#4361ee" },
            ];
        }

        return base;
    };

    const getGreeting = () => {
        const hour = new Date().getHours();
        if (hour < 12) return "Good Morning";
        if (hour < 17) return "Good Afternoon";
        return "Good Evening";
    };

    const getQuickActions = () => {
        if (user?.role === "Accountant") return null;

        return (
            <div style={styles.quickActions}>
                {["SuperAdmin", "Manager", "Receptionist"].includes(user?.role) && (
                    <button
                        onClick={() => navigate("/bookings/add")}
                        className="btn btn-primary btn-lg"
                        style={{ ...styles.actionBtn, backgroundColor: "#1a1a2e" }}
                    >
                        New Booking
                    </button>
                )}
                {["SuperAdmin", "Manager", "Receptionist"].includes(user?.role) && (
                    <button
                        onClick={() => navigate("/bookings")}
                        className="btn btn-success btn-lg"
                        style={{ ...styles.actionBtn, backgroundColor: "#2a9d8f" }}
                    >
                        Check In
                    </button>
                )}
                {["SuperAdmin", "Manager", "Receptionist"].includes(user?.role) && (
                    <button
                        onClick={() => navigate("/bookings")}
                        className="btn btn-warning btn-lg"
                        style={{ ...styles.actionBtn, backgroundColor: "#e9c46a", color: "#333" }}
                    >
                        Check Out
                    </button>
                )}
                {["SuperAdmin", "Manager", "Receptionist"].includes(user?.role) && (
                    <button
                        onClick={() => navigate("/payments")}
                        className="btn btn-edit btn-lg"
                        style={{ ...styles.actionBtn, backgroundColor: "#4361ee" }}
                    >
                        Collect Payment
                    </button>
                )}
            </div>
        );
    };

    return (
        <div style={styles.container}>
            {/* Header */}
            <div style={styles.header}>
                <div>
                    <h2 style={styles.greeting}>
                        {getGreeting()}, {user?.name?.split(" ")[0]}
                    </h2>
                    <p style={styles.subtitle}>
                        {user?.hotel?.name
                            ? `${user.hotel.name} — ${user.hotel.city}`
                            : "All Hotels Overview"}
                    </p>
                    <p style={styles.date}>
                        {new Date().toLocaleDateString("en-US", {
                            weekday: "long",
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                        })}
                    </p>
                </div>

                {/* Role Badge */}
                <div style={{
                    ...styles.roleBadge,
                    backgroundColor: getRoleBadgeColor(user?.role),
                }}>
                    {user?.role}
                </div>
            </div>

            {/* Quick Actions */}
            {getQuickActions()}

            {/* Stats Grid */}
            <div style={styles.grid}>
                {getCards().map((card, index) => (
                    <div
                        key={index}
                        className="card"
                        style={{
                            ...styles.card,
                            borderTop: `4px solid ${card.color}`,
                        }}
                    >
                        <div style={styles.cardValue}>{card.value}</div>
                        <div style={styles.cardLabel}>{card.label}</div>
                    </div>
                ))}
            </div>

            {/* Role specific notice */}
            {user?.role === "Accountant" && (
                <div style={styles.notice}>
                    You are in view-only mode. Contact your Manager for operational changes.
                </div>
            )}

            {user?.role === "SuperAdmin" && (
                <div style={styles.superAdminNotice}>
                    You have full system access across all hotels.
                    <button
                        onClick={() => navigate("/hotels")}
                        className="btn btn-primary btn-sm"
                        style={styles.noticeBtn}
                    >
                        Manage Hotels →
                    </button>
                    <button
                        onClick={() => navigate("/users")}
                        className="btn btn-primary btn-sm"
                        style={styles.noticeBtn}
                    >
                        Manage Users →
                    </button>
                </div>
            )}
        </div>
    );
};

const getRoleBadgeColor = (role) => {
    switch (role) {
        case "SuperAdmin": return "#6d6875";
        case "Manager": return "#4361ee";
        case "Receptionist": return "#2a9d8f";
        case "Accountant": return "#f4a261";
        default: return "#666";
    }
};

const styles = {
    container: {
        padding: "24px",
        backgroundColor: "#f0f2f5",
        minHeight: "calc(100vh - 60px)",
    },
    header: {
        display: "flex",
        justifyContent: "space-between",
        alignItems: "flex-start",
        marginBottom: "24px",
        backgroundColor: "white",
        padding: "24px",
        borderRadius: "12px",
        boxShadow: "0 2px 10px rgba(0,0,0,0.06)",
    },
    greeting: {
        fontSize: "24px",
        color: "#1a1a2e",
        marginBottom: "4px",
    },
    subtitle: {
        fontSize: "14px",
        color: "#4361ee",
        marginBottom: "4px",
    },
    date: {
        fontSize: "13px",
        color: "#999",
    },
    roleBadge: {
        color: "white",
        padding: "8px 20px",
        borderRadius: "20px",
        fontSize: "14px",
        fontWeight: "bold",
    },
    quickActions: {
        display: "flex",
        gap: "12px",
        marginBottom: "24px",
        flexWrap: "wrap",
    },
    actionBtn: {
        padding: "12px 24px",
        color: "white",
        border: "none",
        borderRadius: "8px",
        cursor: "pointer",
        fontSize: "14px",
        fontWeight: "500",
        boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
    },
    grid: {
        display: "grid",
        gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))",
        gap: "20px",
        marginBottom: "24px",
    },
    card: {
        backgroundColor: "white",
        padding: "24px",
        borderRadius: "10px",
        boxShadow: "0 2px 10px rgba(0,0,0,0.06)",
    },
    cardValue: {
        fontSize: "32px",
        fontWeight: "bold",
        color: "#1a1a2e",
        marginBottom: "8px",
    },
    cardLabel: {
        fontSize: "14px",
        color: "#666",
    },
    notice: {
        backgroundColor: "#fff3cd",
        border: "1px solid #e9c46a",
        borderLeft: "4px solid #e9c46a",
        padding: "14px 20px",
        borderRadius: "8px",
        fontSize: "14px",
        color: "#856404",
    },
    superAdminNotice: {
        backgroundColor: "#f3e8ff",
        border: "1px solid #6d6875",
        borderLeft: "4px solid #6d6875",
        padding: "14px 20px",
        borderRadius: "8px",
        fontSize: "14px",
        color: "#6d6875",
        display: "flex",
        alignItems: "center",
        gap: "16px",
        flexWrap: "wrap",
    },
    noticeBtn: {
        backgroundColor: "#6d6875",
        color: "white",
        border: "none",
        padding: "6px 16px",
        borderRadius: "6px",
        cursor: "pointer",
        fontSize: "13px",
    },
    center: {
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "80vh",
        fontSize: "18px",
    },
};

export default Dashboard;