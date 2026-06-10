import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import API from "../../api/axios";
import Button from "../../components/Button";

const Bookings = () => {
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [status, setStatus] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const navigate = useNavigate();

    const fetchBookings = async (page = 1) => {
        try {
            const res = await API.get("/bookings", { params: { status, page, limit: 10 } });
            setBookings(res.data.bookings);
            setTotalPages(res.data.totalPages);
            setCurrentPage(res.data.currentPage || page);
        } catch (error) {
            console.log(error);
            console.error("Failed to fetch bookings");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        const loadBookings = async () => {
            try {
                const res = await API.get("/bookings", { params: { status, page: 1, limit: 10 } });
                setBookings(res.data.bookings);
                setTotalPages(res.data.totalPages);
                setCurrentPage(res.data.currentPage || 1);
            } catch (error) {
                console.log(error);
                console.error("Failed to fetch bookings");
            } finally {
                setLoading(false);
            }
        };

        loadBookings();
    }, [status]);

    const handleStatusChange = async (id, newStatus) => {
        try {
            await API.patch(`/bookings/${id}/status`, { status: newStatus });
            fetchBookings(currentPage);
        } catch (err) {
            alert(err.response?.data?.message || "Failed to update status");
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Are you sure you want to delete this booking?")) return;
        try {
            await API.delete(`/bookings/${id}`);
            fetchBookings(currentPage);
        } catch (err) {
            alert(err.response?.data?.message || "Failed to delete booking");
        }
    };

    const getStatusColor = (status) => {
        switch (status) {
            case "Booked": return { bg: "#cce5ff", color: "#004085" };
            case "CheckedIn": return { bg: "#d4edda", color: "#155724" };
            case "CheckedOut": return { bg: "#e2e3e5", color: "#383d41" };
            case "Cancelled": return { bg: "#f8d7da", color: "#721c24" };
            default: return { bg: "#f0f0f0", color: "#333" };
        }
    };

    if (loading) return <div style={styles.center}>Loading...</div>;

    return (
        <div style={styles.container}>
            <style>{`
                .bookings-add-btn {
                    transition: transform 0.18s ease, box-shadow 0.18s ease, filter 0.18s ease, background-color 0.18s ease;
                }

                .bookings-add-btn:hover {
                    transform: translateY(-2px);
                    box-shadow: 0 8px 18px rgba(0, 0, 0, 0.22);
                    filter: brightness(1.05);
                }

                .bookings-add-btn:active {
                    transform: translateY(0) scale(0.98);
                    box-shadow: none;
                }

                .bookings-add-btn:focus-visible {
                    outline: 2px solid #f4a261;
                    outline-offset: 3px;
                }
            `}</style>
            <div style={styles.header}>
                <h2 style={styles.title}>Bookings</h2>
            </div>

            <div style={styles.controlsRow}>
                <div style={styles.filters}>
                    <select value={status} onChange={(e) => setStatus(e.target.value)} style={styles.select}>
                        <option value="">All Status</option>
                        <option value="Booked">Booked</option>
                        <option value="CheckedIn">CheckedIn</option>
                        <option value="CheckedOut">CheckedOut</option>
                        <option value="Cancelled">Cancelled</option>
                    </select>
                </div>

                <button onClick={() => navigate("/bookings/add")} className="bookings-add-btn" style={styles.addButton}>
                    + Add Booking
                </button>
            </div>

            {bookings.length === 0 ? (
                <div style={styles.empty}>No bookings found.</div>
            ) : (
                <>
                    <table style={styles.table}>
                        <thead>
                            <tr style={styles.thead}>
                                <th style={styles.th}>Guest</th>
                                <th style={styles.th}>Room</th>
                                <th style={styles.th}>Check In</th>
                                <th style={styles.th}>Check Out</th>
                                <th style={styles.th}>Days</th>
                                <th style={styles.th}>Total</th>
                                <th style={styles.th}>Status</th>
                                <th style={styles.th}>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {bookings.map((booking) => {
                                const { bg, color } = getStatusColor(booking.status);
                                return (
                                    <tr key={booking._id} style={styles.tr}>
                                        <td style={styles.td}>{booking.guest?.name}</td>
                                        <td style={styles.td}>{booking.room?.roomNumber}</td>
                                        <td style={styles.td}>{new Date(booking.checkIn).toLocaleDateString()}</td>
                                        <td style={styles.td}>{new Date(booking.checkOut).toLocaleDateString()}</td>
                                        <td style={styles.td}>{booking.days}</td>
                                        <td style={styles.td}>Rs. {booking.totalAmount?.toLocaleString()}</td>
                                        <td style={styles.td}>
                                            <span style={{ ...styles.badge, backgroundColor: bg, color }}>
                                                {booking.status}
                                            </span>
                                        </td>
                                        <td style={styles.td}>
                                            <div style={{ display: "flex", gap: "6px", flexWrap: "wrap" }}>
                                                {booking.status === "Booked" && (
                                                    <Button color="#2a9d8f" size="sm" minWidth="110px" onClick={() => handleStatusChange(booking._id, "CheckedIn")}>
                                                        Check In
                                                    </Button>
                                                )}
                                                {booking.status === "CheckedIn" && (
                                                    <Button color="#e9c46a" textColor="#333" size="sm" minWidth="110px" onClick={() => handleStatusChange(booking._id, "CheckedOut")}>
                                                        Check Out
                                                    </Button>
                                                )}
                                                {booking.status === "CheckedOut" && (
                                                    <Button color="#4361ee" size="sm" minWidth="110px" onClick={() => navigate(`/invoices/${booking._id}`)}>
                                                        Invoice
                                                    </Button>
                                                )}
                                                {booking.status === "Booked" && (
                                                    <Button color="#f4a261" size="sm" minWidth="110px" onClick={() => handleStatusChange(booking._id, "Cancelled")}>
                                                        Cancel
                                                    </Button>
                                                )}
                                                {booking.status !== "CheckedIn" && (
                                                    <Button color="#e63946" size="sm" minWidth="110px" onClick={() => handleDelete(booking._id)}>
                                                        Delete
                                                    </Button>
                                                )}
                                            </div>
                                        </td>

                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>

                    <div style={styles.pagination}>
                        <button
                            onClick={() => fetchBookings(currentPage - 1)}
                            disabled={currentPage === 1}
                            style={styles.pageBtn}
                        >
                            ← Previous
                        </button>
                        <span style={styles.pageInfo}>Page {currentPage} of {totalPages}</span>
                        <button
                            onClick={() => fetchBookings(currentPage + 1)}
                            disabled={currentPage === totalPages}
                            style={styles.pageBtn}
                        >
                            Next →
                        </button>
                    </div>
                </>
            )}
        </div>
    );
};

const styles = {
    container: { padding: "24px" },
    header: { display: "flex", alignItems: "center", marginBottom: "12px" },
    title: { fontSize: "24px", color: "#1a1a2e" },
    controlsRow: { display: "flex", justifyContent: "space-between", alignItems: "center", gap: "20px", marginBottom: "20px" },
    addButton: { backgroundColor: "#1a1a2e", color: "white", border: "none", padding: "10px 20px", borderRadius: "6px", cursor: "pointer", fontSize: "15px", flexShrink: 0, whiteSpace: "nowrap" },
    filters: { display: "flex", gap: "12px", flexWrap: "wrap", alignItems: "center", flex: 1 },
    select: { padding: "8px 12px", borderRadius: "6px", border: "1px solid #ccc", fontSize: "14px" },
    table: { width: "100%", borderCollapse: "collapse", backgroundColor: "white", borderRadius: "10px", overflow: "hidden", boxShadow: "0 2px 10px rgba(0,0,0,0.08)" },
    thead: { backgroundColor: "#1a1a2e" },
    th: { padding: "14px 16px", textAlign: "left", color: "white", fontWeight: "600" },
    tr: { borderBottom: "1px solid #f0f0f0" },
    td: { padding: "12px 16px", color: "#333" },
    badge: { minWidth: "110px", padding: "4px 10px", borderRadius: "20px", fontSize: "13px", fontWeight: "500", display: "inline-flex", justifyContent: "center", alignItems: "center" },
    deleteBtn: { backgroundColor: "#e63946", color: "white", border: "none", padding: "6px 10px", borderRadius: "6px", cursor: "pointer", fontSize: "13px" },
    empty: { textAlign: "center", padding: "40px", color: "#666" },
    center: { display: "flex", justifyContent: "center", alignItems: "center", height: "80vh", fontSize: "18px" },
    pagination: { display: "flex", justifyContent: "center", alignItems: "center", gap: "20px", marginTop: "24px" },
    pageBtn: { padding: "8px 20px", backgroundColor: "#1a1a2e", color: "white", border: "none", borderRadius: "6px", cursor: "pointer", fontSize: "14px" },
    pageInfo: { fontSize: "14px", color: "#333" },
};

export default Bookings;