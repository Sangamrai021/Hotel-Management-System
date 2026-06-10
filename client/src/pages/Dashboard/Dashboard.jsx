import { useState, useEffect } from "react";
import API from "../../api/axios";

const Dashboard = () => {
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const res = await API.get("/dashboard/stats");
                setStats(res.data);
            } catch (error) {
                console.log(error);
                setError("Failed to load dashboard stats");
            } finally {
                setLoading(false);
            }
        };
        fetchStats();
    }, []);

    if (loading) return <div style={styles.center}>Loading...</div>;
    if (error) return <div style={styles.center}>{error}</div>;

    const cards = [
        { label: "Total Rooms", value: stats.totalRooms, color: "#4361ee" },
        { label: "Occupied Rooms", value: stats.occupiedRooms, color: "#e63946" },
        { label: "Available Rooms", value: stats.availableRooms, color: "#2a9d8f" },
        { label: "Total Guests", value: stats.totalGuests, color: "#e9c46a" },
        { label: "Bookings Today", value: stats.bookingsToday, color: "#f4a261" },
        { label: "Revenue This Month", value: `Rs. ${stats.revenueThisMonth.toLocaleString()}`, color: "#6d6875" },
    ];

    return (
        <div style={styles.container}>
            <style>{`
                .dashboard-card {
                    transition: transform 0.2s ease, box-shadow 0.2s ease, background-color 0.2s ease;
                    cursor: pointer;
                }

                .dashboard-card:hover {
                    transform: translateY(-4px);
                    box-shadow: 0 10px 24px rgba(0, 0, 0, 0.16);
                    background-color: #fafbff;
                }

                .dashboard-card:focus-visible {
                    outline: 2px solid #1a1a2e;
                    outline-offset: 3px;
                }
            `}</style>
            <h2 style={styles.title}>Dashboard</h2>
            <div style={styles.grid}>
                {cards.map((card, index) => (
                    <div key={index} className="dashboard-card" tabIndex={0} style={{ ...styles.card, borderTop: `4px solid ${card.color}` }}>
                        <div style={styles.cardValue}>{card.value}</div>
                        <div style={styles.cardLabel}>{card.label}</div>
                    </div>
                ))}
            </div>
        </div>
    );
};

const styles = {
    container: {
        padding: "24px",
    },
    title: {
        fontSize: "24px",
        marginBottom: "24px",
        color: "#1a1a2e",
    },
    grid: {
        display: "grid",
        gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))",
        gap: "20px",
    },
    card: {
        backgroundColor: "white",
        padding: "24px",
        borderRadius: "10px",
        boxShadow: "0 2px 10px rgba(0,0,0,0.08)",
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
    center: {
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "80vh",
        fontSize: "18px",
    },
};

export default Dashboard;