import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import API from "../../api/axios";

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
            setCurrentPage(res.data.currentPage);
        } catch (error) {
            console.log(error);
            console.error("Failed to fetch bookings");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        setCurrentPage(1);
        fetchBookings(1);
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
            <div style={styles.header}>
                <h2 style={styles.title}>Bookings</h2>
                <button onClick={() => navigate("/bookings/add")} style={styles.addButton}>
                    + Add Booking
                </button>
            </div>

            <div style={styles.filters}>
                <select value={status} onChange={(e) => setStatus(e.target.value)} style={styles.select}>
                    <option value="">All Status</option>
                    <option value="Booked">Booked</option>
                    <option value="CheckedIn">CheckedIn</option>
                    <option value="CheckedOut">CheckedOut</option>
                    <option value="Cancelled">Cancelled</option>
                </select>
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
                                            {booking.status === "Booked" && (
                                                <button onClick={() => handleStatusChange(booking._id, "CheckedIn")} style={styles.checkinBtn}>
                                                    Check In
                                                </button>
                                            )}
                                            {booking.status === "CheckedIn" && (
                                                <button onClick={() => handleStatusChange(booking._id, "CheckedOut")} style={styles.checkoutBtn}>
                                                    Check Out
                                                </button>
                                            )}
                                            {booking.status === "CheckedOut" && (
                                                <button onClick={() => navigate(`/invoices/${booking._id}`)} style={styles.invoiceBtn}>
                                                    Invoice
                                                </button>
                                            )}
                                            {booking.status === "Booked" && (
                                                <button onClick={() => handleStatusChange(booking._id, "Cancelled")} style={styles.cancelBtn}>
                                                    Cancel
                                                </button>
                                            )}
                                            {booking.status !== "CheckedIn" && (
                                                <button onClick={() => handleDelete(booking._id)} style={styles.deleteBtn}>
                                                    Delete
                                                </button>
                                            )}
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
    header: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" },
    title: { fontSize: "24px", color: "#1a1a2e" },
    addButton: { backgroundColor: "#1a1a2e", color: "white", border: "none", padding: "10px 20px", borderRadius: "6px", cursor: "pointer", fontSize: "15px" },
    filters: { display: "flex", gap: "12px", marginBottom: "20px" },
    select: { padding: "8px 12px", borderRadius: "6px", border: "1px solid #ccc", fontSize: "14px" },
    table: { width: "100%", borderCollapse: "collapse", backgroundColor: "white", borderRadius: "10px", overflow: "hidden", boxShadow: "0 2px 10px rgba(0,0,0,0.08)" },
    thead: { backgroundColor: "#1a1a2e" },
    th: { padding: "14px 16px", textAlign: "left", color: "white", fontWeight: "600" },
    tr: { borderBottom: "1px solid #f0f0f0" },
    td: { padding: "12px 16px", color: "#333" },
    badge: { padding: "4px 10px", borderRadius: "20px", fontSize: "13px", fontWeight: "500" },
    checkinBtn: { backgroundColor: "#2a9d8f", color: "white", border: "none", padding: "6px 10px", borderRadius: "6px", cursor: "pointer", marginRight: "6px", fontSize: "13px" },
    checkoutBtn: { backgroundColor: "#e9c46a", color: "#333", border: "none", padding: "6px 10px", borderRadius: "6px", cursor: "pointer", marginRight: "6px", fontSize: "13px" },
    invoiceBtn: { backgroundColor: "#4361ee", color: "white", border: "none", padding: "6px 10px", borderRadius: "6px", cursor: "pointer", marginRight: "6px", fontSize: "13px" },
    cancelBtn: { backgroundColor: "#f4a261", color: "white", border: "none", padding: "6px 10px", borderRadius: "6px", cursor: "pointer", marginRight: "6px", fontSize: "13px" },
    deleteBtn: { backgroundColor: "#e63946", color: "white", border: "none", padding: "6px 10px", borderRadius: "6px", cursor: "pointer", fontSize: "13px" },
    empty: { textAlign: "center", padding: "40px", color: "#666" },
    center: { display: "flex", justifyContent: "center", alignItems: "center", height: "80vh", fontSize: "18px" },
    pagination: { display: "flex", justifyContent: "center", alignItems: "center", gap: "20px", marginTop: "24px" },
    pageBtn: { padding: "8px 20px", backgroundColor: "#1a1a2e", color: "white", border: "none", borderRadius: "6px", cursor: "pointer", fontSize: "14px" },
    pageInfo: { fontSize: "14px", color: "#333" },
};

export default Bookings;