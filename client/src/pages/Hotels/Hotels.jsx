import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import API from "../../api/axios";

const Hotels = () => {
    const [hotels, setHotels] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [deleteModal, setDeleteModal] = useState({ show: false, hotel: null });
    const navigate = useNavigate();

    const fetchHotels = async (page = 1) => {
        try {
            const res = await API.get("/hotels", {
                params: { search, page, limit: 10 },
            });
            setHotels(res.data.hotels);
            setTotalPages(res.data.totalPages);
            setCurrentPage(res.data.currentPage);
        } catch (error) {
            console.error("Failed to fetch hotels");
            console.log(error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        setCurrentPage(1);
        fetchHotels(1);
    }, [search]);

    const handleDelete = async () => {
        try {
            await API.delete(`/hotels/${deleteModal.hotel._id}`);
            setDeleteModal({ show: false, hotel: null });
            fetchHotels(currentPage);
        } catch (err) {
            alert(err.response?.data?.message || "Failed to delete hotel");
        }
    };

    if (loading) return <div style={styles.center}>Loading...</div>;

    return (
        <div style={styles.container}>
            {/* Header */}
            <div style={styles.header}>
                <div>
                    <h2 style={styles.title}>🏨 Hotel Management</h2>
                    <p style={styles.subtitle}>Manage all hotels in the system</p>
                </div>
                <button
                    onClick={() => navigate("/hotels/add")}
                    style={styles.addButton}
                >
                    + Add New Hotel
                </button>
            </div>

            {/* Search */}
            <div style={styles.filters}>
                <input
                    type="text"
                    placeholder="Search by hotel name or city..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    style={styles.input}
                />
            </div>

            {/* Table */}
            {hotels.length === 0 ? (
                <div style={styles.empty}>No hotels found.</div>
            ) : (
                <>
                    <table style={styles.table}>
                        <thead>
                            <tr style={styles.thead}>
                                <th style={styles.th}>#</th>
                                <th style={styles.th}>Hotel Name</th>
                                <th style={styles.th}>City</th>
                                <th style={styles.th}>Phone</th>
                                <th style={styles.th}>Email</th>
                                <th style={styles.th}>Rooms</th>
                                <th style={styles.th}>Staff</th>
                                <th style={styles.th}>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {hotels.map((hotel, index) => (
                                <tr key={hotel._id} style={styles.tr}>
                                    <td style={styles.td}>{index + 1}</td>
                                    <td style={styles.td}>
                                        <div style={styles.hotelName}>🏨 {hotel.name}</div>
                                        <div style={styles.hotelAddress}>{hotel.address}</div>
                                    </td>
                                    <td style={styles.td}>{hotel.city}</td>
                                    <td style={styles.td}>{hotel.phone}</td>
                                    <td style={styles.td}>{hotel.email}</td>
                                    <td style={styles.td}>{hotel.roomCount || 0}</td>
                                    <td style={styles.td}>{hotel.staffCount || 0}</td>
                                    <td style={styles.td}>
                                        <button
                                            onClick={() => navigate(`/hotels/edit/${hotel._id}`)}
                                            style={styles.editBtn}
                                        >
                                            Edit
                                        </button>
                                        <button
                                            onClick={() => setDeleteModal({ show: true, hotel })}
                                            style={styles.deleteBtn}
                                        >
                                            Delete
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>

                    {/* Pagination */}
                    <div style={styles.pagination}>
                        <span style={styles.pageInfo}>Showing page {currentPage} of {totalPages}</span>
                        <div style={styles.paginationControls}>
                            <button
                                onClick={() => fetchHotels(currentPage - 1)}
                                disabled={currentPage === 1}
                                className="shared-page-btn"
                                style={styles.pageBtn}
                            >
                                ← Previous
                            </button>
                            <button
                                onClick={() => fetchHotels(currentPage + 1)}
                                disabled={currentPage === totalPages}
                                className="shared-page-btn"
                                style={styles.pageBtn}
                            >
                                Next →
                            </button>
                        </div>
                    </div>
                </>
            )}

            {/* Delete Modal */}
            {deleteModal.show && (
                <div style={styles.overlay}>
                    <div style={styles.modal}>
                        <h3 style={styles.modalTitle}>⚠️ Delete Hotel</h3>
                        <p style={styles.modalText}>
                            Are you sure you want to delete{" "}
                            <strong>{deleteModal.hotel?.name}</strong>?
                        </p>
                        <p style={styles.modalWarning}>
                            This action cannot be undone. Remove all staff from this hotel first.
                        </p>
                        <div style={styles.modalButtons}>
                            <button
                                onClick={() => setDeleteModal({ show: false, hotel: null })}
                                style={styles.cancelBtn}
                            >
                                Cancel
                            </button>
                            <button onClick={handleDelete} style={styles.confirmBtn}>
                                Delete
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

const styles = {
    container: { padding: "24px", backgroundColor: "#f0f2f5", minHeight: "calc(100vh - 60px)" },
    header: { display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "20px", backgroundColor: "white", padding: "24px", borderRadius: "12px", boxShadow: "0 2px 10px rgba(0,0,0,0.06)" },
    title: { fontSize: "24px", color: "#1a1a2e", marginBottom: "4px" },
    subtitle: { fontSize: "14px", color: "#666" },
    addButton: { backgroundColor: "#1a1a2e", color: "white", border: "none", padding: "12px 24px", borderRadius: "8px", cursor: "pointer", fontSize: "15px", fontWeight: "500" },
    filters: { marginBottom: "20px" },
    input: { padding: "10px 16px", borderRadius: "8px", border: "1px solid #ccc", fontSize: "14px", width: "320px", backgroundColor: "white" },
    table: { width: "100%", borderCollapse: "collapse", backgroundColor: "white", borderRadius: "12px", overflow: "hidden", boxShadow: "0 2px 10px rgba(0,0,0,0.06)" },
    thead: { backgroundColor: "#1a1a2e" },
    th: { padding: "14px 16px", textAlign: "left", color: "white", fontWeight: "600", fontSize: "13px" },
    tr: { borderBottom: "1px solid #f0f0f0" },
    td: { padding: "14px 16px", color: "#333", fontSize: "14px" },
    hotelName: { fontWeight: "bold", color: "#1a1a2e", marginBottom: "2px" },
    hotelAddress: { fontSize: "12px", color: "#666" },
    editBtn: { backgroundColor: "#4361ee", color: "white", border: "none", padding: "6px 14px", borderRadius: "6px", cursor: "pointer", marginRight: "8px", fontSize: "13px" },
    deleteBtn: { backgroundColor: "#e63946", color: "white", border: "none", padding: "6px 14px", borderRadius: "6px", cursor: "pointer", fontSize: "13px" },
    empty: { textAlign: "center", padding: "60px", color: "#666", backgroundColor: "white", borderRadius: "12px" },
    pagination: { display: "flex", justifyContent: "space-between", alignItems: "center", gap: "20px", marginTop: "24px" },
    paginationControls: { display: "flex", alignItems: "center", gap: "12px" },
    pageBtn: { padding: "8px 20px", backgroundColor: "#1a1a2e", color: "white", border: "none", borderRadius: "6px", cursor: "pointer", fontSize: "14px" },
    pageInfo: { fontSize: "14px", color: "#333", fontWeight: "500" },
    overlay: { position: "fixed", top: 0, left: 0, width: "100vw", height: "100vh", backgroundColor: "rgba(0,0,0,0.5)", display: "flex", justifyContent: "center", alignItems: "center", zIndex: 1000 },
    modal: { backgroundColor: "white", padding: "32px", borderRadius: "12px", boxShadow: "0 4px 20px rgba(0,0,0,0.15)", width: "100%", maxWidth: "420px", textAlign: "center" },
    modalTitle: { fontSize: "20px", color: "#1a1a2e", marginBottom: "12px" },
    modalText: { fontSize: "15px", color: "#333", marginBottom: "8px" },
    modalWarning: { fontSize: "13px", color: "#e63946", marginBottom: "24px" },
    modalButtons: { display: "flex", gap: "12px" },
    cancelBtn: { flex: 1, padding: "10px", backgroundColor: "#f0f0f0", color: "#333", border: "none", borderRadius: "6px", cursor: "pointer", fontSize: "15px" },
    confirmBtn: { flex: 1, padding: "10px", backgroundColor: "#e63946", color: "white", border: "none", borderRadius: "6px", cursor: "pointer", fontSize: "15px" },
    center: { display: "flex", justifyContent: "center", alignItems: "center", height: "80vh", fontSize: "18px" },
};

export default Hotels;