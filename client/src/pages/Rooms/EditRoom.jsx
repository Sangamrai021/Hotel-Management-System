import { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../../api/axios";

const AddRoom = () => {
    const [form, setForm] = useState({
        roomNumber: "",
        roomType: "Standard",
        pricePerNight: "",
        description: "",
    });
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setLoading(true);
        try {
            await API.post("/rooms", form);
            navigate("/rooms");
        } catch (err) {
            setError(err.response?.data?.message || "Failed to add room");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={styles.container}>
            <div style={styles.card}>
                <h2 style={styles.title}>Add Room</h2>

                {error && <div style={styles.error}>{error}</div>}

                <form onSubmit={handleSubmit}>
                    <div style={styles.field}>
                        <label style={styles.label}>Room Number</label>
                        <input
                            name="roomNumber"
                            value={form.roomNumber}
                            onChange={handleChange}
                            style={styles.input}
                            placeholder="e.g. 101"
                            pattern="^[a-zA-Z0-9-]+$"
                            title="Room number can only contain letters, numbers and hyphens"
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
                            placeholder="e.g. 5000"
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
                            placeholder="e.g. Sea facing room with balcony"
                        />
                    </div>

                    <div style={styles.buttons}>
                        <button type="button" onClick={() => navigate("/rooms")} style={styles.cancelBtn}>
                            Cancel
                        </button>
                        <button type="submit" style={styles.submitBtn} disabled={loading}>
                            {loading ? "Adding..." : "Add Room"}
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

export default AddRoom;