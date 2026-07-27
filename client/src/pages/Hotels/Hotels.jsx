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

    if (loading) return (
        <div className="page-container">
            <div className="page-header"><div style={{ height: "24px", width: "200px" }} className="dash-skel" /></div>
            <div className="page-toolbar"><div className="dash-skel" style={{ width: "320px", height: "36px", borderRadius: "6px" }} /></div>
            <div className="page-skel-table">
                {[1, 2, 3].map((i) => (
                    <div key={i} className="page-skel-row">
                        <div className="page-skel-cell" style={{ width: "5%" }} />
                        <div className="page-skel-cell" style={{ width: "20%" }} />
                        <div className="page-skel-cell" style={{ width: "12%" }} />
                        <div className="page-skel-cell" style={{ width: "14%" }} />
                        <div className="page-skel-cell" style={{ width: "20%" }} />
                        <div className="page-skel-cell" style={{ width: "8%" }} />
                        <div className="page-skel-cell" style={{ width: "8%" }} />
                        <div className="page-skel-cell" style={{ width: "12%" }} />
                    </div>
                ))}
            </div>
        </div>
    );

    return (
        <div className="page-container">
            {/* Header */}
            <div className="page-header">
                <div>
                    <div className="page-header-title">Hotel Management</div>
                    <div className="page-header-sub">Manage all hotels in the system</div>
                </div>
                <button onClick={() => navigate("/hotels/add")} className="btn btn-primary btn-lg">
                    + Add New Hotel
                </button>
            </div>

            {/* Search */}
            <div className="page-toolbar">
                <div className="page-toolbar-left">
                    <input
                        type="text"
                        placeholder="Search by hotel name or city..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="input"
                        style={{ minWidth: "300px" }}
                    />
                </div>
            </div>

            {hotels.length === 0 ? (
                <div className="page-empty">
                    <div className="page-empty-icon">
                        <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#aaa" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                            <rect x="4" y="2" width="16" height="20" rx="1" />
                            <path d="M9 2v4h6V2M9 10h2v2H9zm4 0h2v2h-2zM9 14h2v2H9zm4 0h2v2h-2z" />
                        </svg>
                    </div>
                    <div className="page-empty-text">No hotels found</div>
                    <div className="page-empty-hint">Add a new hotel to get started</div>
                </div>
            ) : (
                <>
                    <div className="page-table-wrap">
                        <table className="page-table table-hover">
                            <thead>
                                <tr>
                                    <th style={{ width: "40px" }}>#</th>
                                    <th>Hotel Name</th>
                                    <th>City</th>
                                    <th>Phone</th>
                                    <th>Email</th>
                                    <th>Rooms</th>
                                    <th>Staff</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {hotels.map((hotel, index) => (
                                    <tr key={hotel._id}>
                                        <td>{(currentPage - 1) * 10 + index + 1}</td>
                                        <td>
                                            <div style={{ fontWeight: 600, color: "#1a1a2e", marginBottom: "2px" }}>{hotel.name}</div>
                                            <div style={{ fontSize: "12px", color: "#999" }}>{hotel.address}</div>
                                        </td>
                                        <td>{hotel.city}</td>
                                        <td>{hotel.phone}</td>
                                        <td>{hotel.email}</td>
                                        <td>{hotel.roomCount || 0}</td>
                                        <td>{hotel.staffCount || 0}</td>
                                        <td>
                                            <button onClick={() => navigate(`/hotels/edit/${hotel._id}`)} className="btn btn-edit btn-sm">Edit</button>
                                            <button onClick={() => setDeleteModal({ show: true, hotel })} className="btn btn-danger btn-sm" style={{ marginLeft: "6px" }}>Delete</button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    <div className="page-pagination">
                        <span className="page-page-info">Showing page {currentPage} of {totalPages}</span>
                        <div className="page-pg-ctrls">
                            <button onClick={() => fetchHotels(currentPage - 1)} disabled={currentPage === 1} className="btn btn-primary">← Previous</button>
                            <button onClick={() => fetchHotels(currentPage + 1)} disabled={currentPage === totalPages} className="btn btn-primary">Next →</button>
                        </div>
                    </div>
                </>
            )}

            {/* Delete Modal */}
            {deleteModal.show && (
                <div className="overlay" style={styles.overlay}>
                    <div style={styles.modal}>
                        <h3 style={styles.modalTitle}>Delete Hotel</h3>
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
                                className="btn btn-cancel"
                                style={styles.cancelBtn}
                            >
                                Cancel
                            </button>
                            <button onClick={handleDelete} className="btn btn-danger" style={styles.confirmBtn}>
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