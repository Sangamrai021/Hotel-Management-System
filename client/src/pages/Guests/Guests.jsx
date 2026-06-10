import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import API from "../../api/axios";

const Guests = () => {
    const [guests, setGuests] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const navigate = useNavigate();

    const fetchGuests = async (page = 1) => {
        try {
            const res = await API.get("/guests", { params: { search, page, limit: 10 } });
            setGuests(res.data.guests);
            setTotalPages(res.data.totalPages);
            setCurrentPage(res.data.currentPage);
        } catch (error) {
            console.log(error);
            console.error("Failed to fetch guests");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        const loadGuests = async () => {
            try {
                const res = await API.get("/guests", { params: { search, page: 1, limit: 10 } });
                setGuests(res.data.guests);
                setTotalPages(res.data.totalPages);
                setCurrentPage(res.data.currentPage || 1);
            } catch (error) {
                console.log(error);
                console.error("Failed to fetch guests");
            } finally {
                setLoading(false);
            }
        };

        loadGuests();
    }, [search]);

    const handleDelete = async (id) => {
        if (!window.confirm("Are you sure you want to delete this guest?")) return;
        try {
            await API.delete(`/guests/${id}`);
            fetchGuests(currentPage);
        } catch (err) {
            alert(err.response?.data?.message || "Failed to delete guest");
        }
    };

    if (loading) return <div style={styles.center}>Loading...</div>;

    return (
        <div style={styles.container}>
            <style>{`
                .guests-edit-btn,
                .guests-delete-btn {
                    transition: transform 0.18s ease, box-shadow 0.18s ease, filter 0.18s ease, background-color 0.18s ease;
                }

                .guests-edit-btn:hover,
                .guests-delete-btn:hover {
                    transform: translateY(-2px);
                    box-shadow: 0 8px 18px rgba(0, 0, 0, 0.22);
                    filter: brightness(1.05);
                }

                .guests-edit-btn:active,
                .guests-delete-btn:active {
                    transform: translateY(0) scale(0.98);
                    box-shadow: none;
                }

                .guests-edit-btn:focus-visible,
                .guests-delete-btn:focus-visible {
                    outline: 2px solid #f4a261;
                    outline-offset: 3px;
                }

                .guests-edit-btn:hover {
                    background-color: #5775f2;
                }

                .guests-delete-btn:hover {
                    background-color: #ff4d5a;
                }
            `}</style>
            <div style={styles.header}>
                <h2 style={styles.title}>Guests</h2>
            </div>

            <div style={styles.controlsRow}>
                <div style={styles.filters}>
                    <input
                        type="text"
                        placeholder="Search by name, email or phone..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        style={styles.input}
                    />
                </div>

                <button onClick={() => navigate("/guests/add")} className="shared-add-btn" style={styles.addButton}>
                    + Add Guest
                </button>
            </div>

            {guests.length === 0 ? (
                <div style={styles.empty}>No guests found.</div>
            ) : (
                <>
                    <table style={styles.table}>
                        <thead>
                            <tr style={styles.thead}>
                                <th style={styles.th}>Name</th>
                                <th style={styles.th}>Email</th>
                                <th style={styles.th}>Phone</th>
                                <th style={styles.th}>ID Proof</th>
                                <th style={styles.th}>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {guests.map((guest) => (
                                <tr key={guest._id} style={styles.tr}>
                                    <td style={styles.td}>{guest.name}</td>
                                    <td style={styles.td}>{guest.email}</td>
                                    <td style={styles.td}>{guest.phone}</td>
                                    <td style={styles.td}>{guest.idProof}</td>
                                    <td style={styles.td}>
                                        <button
                                            onClick={() => navigate(`/guests/edit/${guest._id}`)}
                                            className="guests-edit-btn"
                                            style={styles.editBtn}
                                        >
                                            Edit
                                        </button>
                                        <button
                                            onClick={() => handleDelete(guest._id)}
                                            className="guests-delete-btn"
                                            style={styles.deleteBtn}
                                        >
                                            Delete
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>

                    <div style={styles.pagination}>
                        <button
                            onClick={() => fetchGuests(currentPage - 1)}
                            disabled={currentPage === 1}
                            style={styles.pageBtn}
                        >
                            ← Previous
                        </button>
                        <span style={styles.pageInfo}>Page {currentPage} of {totalPages}</span>
                        <button
                            onClick={() => fetchGuests(currentPage + 1)}
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
    input: { padding: "8px 12px", borderRadius: "6px", border: "1px solid #ccc", fontSize: "14px", width: "300px" },
    table: { width: "100%", borderCollapse: "collapse", backgroundColor: "white", borderRadius: "10px", overflow: "hidden", boxShadow: "0 2px 10px rgba(0,0,0,0.08)" },
    thead: { backgroundColor: "#1a1a2e" },
    th: { padding: "14px 16px", textAlign: "left", color: "white", fontWeight: "600" },
    tr: { borderBottom: "1px solid #f0f0f0" },
    td: { padding: "12px 16px", color: "#333" },
    editBtn: { backgroundColor: "#4361ee", color: "white", border: "none", padding: "6px 14px", borderRadius: "6px", cursor: "pointer", marginRight: "8px" },
    deleteBtn: { backgroundColor: "#e63946", color: "white", border: "none", padding: "6px 14px", borderRadius: "6px", cursor: "pointer" },
    empty: { textAlign: "center", padding: "40px", color: "#666" },
    center: { display: "flex", justifyContent: "center", alignItems: "center", height: "80vh", fontSize: "18px" },
    pagination: { display: "flex", justifyContent: "center", alignItems: "center", gap: "20px", marginTop: "24px" },
    pageBtn: { padding: "8px 20px", backgroundColor: "#1a1a2e", color: "white", border: "none", borderRadius: "6px", cursor: "pointer", fontSize: "14px" },
    pageInfo: { fontSize: "14px", color: "#333" },
};

export default Guests;