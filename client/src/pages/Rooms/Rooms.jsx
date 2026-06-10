import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import API from "../../api/axios";

const Rooms = () => {
    const [rooms, setRooms] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");
    const [roomType, setRoomType] = useState("");
    const [status, setStatus] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const navigate = useNavigate();

    const fetchRooms = async (page = 1) => {
        try {
            const res = await API.get("/rooms", {
                params: { search, roomType, status, page, limit: 10 },
            });
            setRooms(res.data.rooms);
            setTotalPages(res.data.totalPages);
            setCurrentPage(res.data.currentPage);
        } catch (error) {
            console.log(error);
            console.error("Failed to fetch rooms");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        const loadRooms = async () => {
            try {
                const res = await API.get("/rooms", {
                    params: { search, roomType, status, page: 1, limit: 10 },
                });
                setRooms(res.data.rooms);
                setTotalPages(res.data.totalPages);
                setCurrentPage(res.data.currentPage || 1);
            } catch (error) {
                console.log(error);
                console.error("Failed to fetch rooms");
            } finally {
                setLoading(false);
            }
        };

        loadRooms();
    }, [search, roomType, status]);

    const handleDelete = async (id) => {
        if (!window.confirm("Are you sure you want to delete this room?")) return;
        try {
            await API.delete(`/rooms/${id}`);
            fetchRooms(currentPage);
        } catch (err) {
            alert(err.response?.data?.message || "Failed to delete room");
        }
    };

    if (loading) return <div style={styles.center}>Loading...</div>;

    return (
        <div style={styles.container}>
            <style>{`
                .rooms-edit-btn,
                .rooms-delete-btn {
                    transition: transform 0.18s ease, box-shadow 0.18s ease, filter 0.18s ease, background-color 0.18s ease;
                }

                .rooms-edit-btn:hover,
                .rooms-delete-btn:hover {
                    transform: translateY(-2px);
                    box-shadow: 0 8px 18px rgba(0, 0, 0, 0.22);
                    filter: brightness(1.05);
                }

                .rooms-edit-btn:active,
                .rooms-delete-btn:active {
                    transform: translateY(0) scale(0.98);
                    box-shadow: none;
                }

                .rooms-edit-btn:focus-visible,
                .rooms-delete-btn:focus-visible {
                    outline: 2px solid #f4a261;
                    outline-offset: 3px;
                }

                .rooms-edit-btn:hover {
                    background-color: #5775f2;
                }

                .rooms-delete-btn:hover {
                    background-color: #ff4d5a;
                }
            `}</style>
            <div style={styles.header}>
                <h2 style={styles.title}>Rooms</h2>
            </div>

            <div style={styles.controlsRow}>
                <div style={styles.filters}>
                    <input
                        type="text"
                        placeholder="Search by room number..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        style={styles.input}
                    />
                    <select value={roomType} onChange={(e) => setRoomType(e.target.value)} style={styles.select}>
                        <option value="">All Types</option>
                        <option value="Standard">Standard</option>
                        <option value="Deluxe">Deluxe</option>
                        <option value="Suite">Suite</option>
                    </select>
                    <select value={status} onChange={(e) => setStatus(e.target.value)} style={styles.select}>
                        <option value="">All Status</option>
                        <option value="Available">Available</option>
                        <option value="Occupied">Occupied</option>
                    </select>
                </div>

                <button onClick={() => navigate("/rooms/add")} className="shared-add-btn" style={styles.addButton}>
                    + Add Room
                </button>
            </div>

            {rooms.length === 0 ? (
                <div style={styles.empty}>No rooms found.</div>
            ) : (
                <>
                    <table style={styles.table}>
                        <thead>
                            <tr style={styles.thead}>
                                <th style={styles.th}>Room No</th>
                                <th style={styles.th}>Type</th>
                                <th style={styles.th}>Price/Night</th>
                                <th style={styles.th}>Status</th>
                                <th style={styles.th}>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {rooms.map((room) => (
                                <tr key={room._id} style={styles.tr}>
                                    <td style={styles.td}>{room.roomNumber}</td>
                                    <td style={styles.td}>{room.roomType}</td>
                                    <td style={styles.td}>Rs. {room.pricePerNight.toLocaleString()}</td>
                                    <td style={styles.td}>
                                        <span style={{
                                            ...styles.badge,
                                            backgroundColor: room.status === "Available" ? "#d4edda" : "#f8d7da",
                                            color: room.status === "Available" ? "#155724" : "#721c24",
                                        }}>
                                            {room.status}
                                        </span>
                                    </td>
                                    <td style={styles.td}>
                                        <button onClick={() => navigate(`/rooms/edit/${room._id}`)} className="rooms-edit-btn" style={styles.editBtn}>
                                            Edit
                                        </button>
                                        <button onClick={() => handleDelete(room._id)} className="rooms-delete-btn" style={styles.deleteBtn}>
                                            Delete
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>

                    <div style={styles.pagination}>
                        <button
                            onClick={() => fetchRooms(currentPage - 1)}
                            disabled={currentPage === 1}
                            style={styles.pageBtn}
                        >
                            ← Previous
                        </button>
                        <span style={styles.pageInfo}>Page {currentPage} of {totalPages}</span>
                        <button
                            onClick={() => fetchRooms(currentPage + 1)}
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
    input: { padding: "8px 12px", borderRadius: "6px", border: "1px solid #ccc", fontSize: "14px", width: "220px" },
    select: { padding: "8px 12px", borderRadius: "6px", border: "1px solid #ccc", fontSize: "14px" },
    table: { width: "100%", borderCollapse: "collapse", backgroundColor: "white", borderRadius: "10px", overflow: "hidden", boxShadow: "0 2px 10px rgba(0,0,0,0.08)" },
    thead: { backgroundColor: "#1a1a2e" },
    th: { padding: "14px 16px", textAlign: "left", color: "white", fontWeight: "600" },
    tr: { borderBottom: "1px solid #f0f0f0" },
    td: { padding: "12px 16px", color: "#333" },
    badge: { padding: "4px 10px", borderRadius: "20px", fontSize: "13px", fontWeight: "500" },
    editBtn: { backgroundColor: "#4361ee", color: "white", border: "none", padding: "6px 14px", borderRadius: "6px", cursor: "pointer", marginRight: "8px" },
    deleteBtn: { backgroundColor: "#e63946", color: "white", border: "none", padding: "6px 14px", borderRadius: "6px", cursor: "pointer" },
    empty: { textAlign: "center", padding: "40px", color: "#666" },
    center: { display: "flex", justifyContent: "center", alignItems: "center", height: "80vh", fontSize: "18px" },
    pagination: { display: "flex", justifyContent: "center", alignItems: "center", gap: "20px", marginTop: "24px" },
    pageBtn: { padding: "8px 20px", backgroundColor: "#1a1a2e", color: "white", border: "none", borderRadius: "6px", cursor: "pointer", fontSize: "14px" },
    pageInfo: { fontSize: "14px", color: "#333" },
};

export default Rooms;