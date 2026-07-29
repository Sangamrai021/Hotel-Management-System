import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useRoom } from "../../hooks/useRooms";
import API from "../../api/axios";

const EditRoom = () => {
    const { user } = useAuth();
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const { id } = useParams();

    const { data: roomData, isLoading: roomLoading } = useRoom(id);
    const [form, setForm] = useState({
        roomNumber: "",
        roomType: "Standard",
        pricePerNight: "",
        description: "",
        status: "Available",
    });
    const [hotelInfo, setHotelInfo] = useState(null);

    if (roomData && !form.roomNumber) {
        setForm({
            roomNumber: roomData.roomNumber,
            roomType: roomData.roomType,
            pricePerNight: roomData.pricePerNight,
            description: roomData.description,
            status: roomData.status,
        });
        setHotelInfo(roomData.hotel);
    }

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setLoading(true);
        try {
            await API.put(`/rooms/${id}`, form);
            navigate("/rooms");
        } catch (err) {
            setError(err.response?.data?.message || "Failed to update room");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={styles.container}>
            <div style={styles.card}>
                <h2 style={styles.title}>Edit Room</h2>

                {error && <div style={styles.error}>{error}</div>}

                {user?.role === "SuperAdmin" && hotelInfo && (
                    <div style={{ ...styles.field, display: "flex", alignItems: "center", gap: "8px", padding: "10px 14px", backgroundColor: "#f8f4ff", borderRadius: "8px", border: "1px solid #e8dfff" }}>
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#6d6875" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <rect x="4" y="2" width="16" height="20" rx="1" />
                            <path d="M9 2v4h6V2M9 10h2v2H9zm4 0h2v2h-2zM9 14h2v2H9zm4 0h2v2h-2z" />
                        </svg>
                        <span style={{ fontSize: "13px", color: "#6d6875" }}>
                            Hotel: <strong>{hotelInfo.name}</strong> — {hotelInfo.city}
                        </span>
                    </div>
                )}

                <form onSubmit={handleSubmit}>
                    <div style={styles.field}>
                        <label style={styles.label}>Room Number</label>
                        <input
                            name="roomNumber"
                            value={form.roomNumber}
                            onChange={handleChange}
                            style={styles.input}
                            pattern="^(?=.*[0-9])[a-zA-Z0-9-]+$"
                            title="Room number must contain at least one number"
                            required
                        />
                    </div>

                    <div style={styles.field}>
                        <label style={styles.label}>Room Type</label>
                        <select name="roomType" value={form.roomType} onChange={handleChange} style={styles.input}>
                            <option value="Standard">Standard</option>
                            <option value="Deluxe">Deluxe</option>
                            <option value="Suite">Suite</option>
                        </select>
                    </div>

                    <div style={styles.field}>
                        <label style={styles.label}>Price Per Night (Rs.)</label>
                        <input
                            name="pricePerNight"
                            type="number"
                            value={form.pricePerNight}
                            onChange={handleChange}
                            style={styles.input}
                            required
                        />
                    </div>

                    <div style={styles.field}>
                        <label style={styles.label}>Description (optional)</label>
                        <textarea
                            name="description"
                            value={form.description}
                            onChange={handleChange}
                            style={{ ...styles.input, height: "80px", resize: "vertical" }}
                        />
                    </div>

                    <div style={styles.field}>
                        <label style={styles.label}>Status</label>
                        <select name="status" value={form.status} onChange={handleChange} style={styles.input}>
                            <option value="Available">Available</option>
                            <option value="Occupied">Occupied</option>
                        </select>
                    </div>

                    <div style={styles.buttons}>
                        <button type="button" onClick={() => navigate("/rooms")} style={styles.cancelBtn}>
                            Cancel
                        </button>
                        <button type="submit" style={styles.submitBtn} disabled={loading}>
                            {loading ? "Updating..." : "Update Room"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

const styles = {
    container: { display: "flex", justifyContent: "center", padding: "40px 24px" },
    card: { backgroundColor: "white", padding: "36px", borderRadius: "12px", boxShadow: "0 2px 10px rgba(0,0,0,0.08)", width: "100%", maxWidth: "500px" },
    title: { fontSize: "22px", color: "#1a1a2e", marginBottom: "24px" },
    error: { backgroundColor: "#ffe0e0", color: "#c0392b", padding: "10px", borderRadius: "6px", marginBottom: "16px" },
    field: { marginBottom: "16px" },
    label: { display: "block", marginBottom: "6px", fontWeight: "bold", color: "#333" },
    input: { width: "100%", padding: "10px", borderRadius: "6px", border: "1px solid #ccc", fontSize: "15px", boxSizing: "border-box" },
    buttons: { display: "flex", gap: "12px", marginTop: "24px" },
    cancelBtn: { flex: 1, padding: "10px", backgroundColor: "#f0f0f0", color: "#333", border: "none", borderRadius: "6px", cursor: "pointer", fontSize: "15px" },
    submitBtn: { flex: 1, padding: "10px", backgroundColor: "#1a1a2e", color: "white", border: "none", borderRadius: "6px", cursor: "pointer", fontSize: "15px" },
};

export default EditRoom;