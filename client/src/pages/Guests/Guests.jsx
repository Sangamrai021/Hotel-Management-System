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
        setCurrentPage(1);
        fetchGuests(1);
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
            <div style={styles.header}>
                <h2 style={styles.title}>Guests</h2>
                <button onClick={() => navigate("/guests/add")} style={styles.addButton}>
                    + Add Guest
                </button>
            </div>

            <div style={styles.filters}>
                <input
                    type="text"
                    placeholder="Search by name, email or phone..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    style={styles.input}
                />
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
                                            style={styles.editBtn}
                                        >
                                            Edit
                                        </button>
                                        <button
                                            onClick={() => handleDelete(guest._id)}
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
    header: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" },
    title: { fontSize: "24px", color: "#1a1a2e" },
    addButton: { backgroundColor: "#1a1a2e", color: "white", border: "none", padding: "10px 20px", borderRadius: "6px", cursor: "pointer", fontSize: "15px" },
    filters: { display: "flex", gap: "12px", marginBottom: "20px" },
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