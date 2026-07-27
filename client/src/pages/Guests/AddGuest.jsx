import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import API from "../../api/axios";

const AddGuest = () => {
    const { user } = useAuth();
    const [form, setForm] = useState({
        name: "",
        email: "",
        phone: "",
        address: "",
        idProof: "Citizenship",
        idNumber: "",
    });
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const [hotels, setHotels] = useState([]);
    const [selectedHotel, setSelectedHotel] = useState("");
    const navigate = useNavigate();

    useEffect(() => {
        if (user?.role === "SuperAdmin") {
            API.get("/hotels", { params: { limit: 100 } })
                .then((res) => setHotels(res.data.hotels || res.data))
                .catch(() => {});
        }
    }, [user]);

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setLoading(true);
        try {
            const payload = { ...form };
            if (user?.role === "SuperAdmin") payload.hotelId = selectedHotel;
            await API.post("/guests", payload);
            navigate("/guests");
        } catch (err) {
            setError(err.response?.data?.message || "Failed to add guest");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={styles.container}>
            <div style={styles.card}>
                <h2 style={styles.title}>Add Guest</h2>

                {error && <div style={styles.error}>{error}</div>}

                {user?.role === "SuperAdmin" && (
                    <div style={styles.field}>
                        <label style={styles.label}>Hotel *</label>
                        <select
                            value={selectedHotel}
                            onChange={(e) => setSelectedHotel(e.target.value)}
                            style={styles.input}
                            required
                        >
                            <option value="">Select Hotel</option>
                            {hotels.map((h) => (
                                <option key={h._id} value={h._id}>{h.name} — {h.city}</option>
                            ))}
                        </select>
                    </div>
                )}

                <form onSubmit={handleSubmit}>
                    <div style={styles.field}>
                        <label style={styles.label}>Full Name</label>
                        <input
                            name="name"
                            value={form.name}
                            onChange={handleChange}
                            style={styles.input}
                            placeholder="e.g. John Doe"
                            pattern="^[a-zA-Z\s]+$"
                            title="Name can only contain letters and spaces"
                            required
                        />
                    </div>

                    <div style={styles.field}>
                        <label style={styles.label}>Email</label>
                        <input
                            name="email"
                            type="email"
                            value={form.email}
                            onChange={handleChange}
                            style={styles.input}
                            placeholder="e.g. john@gmail.com"
                            pattern="^[^\s@]+@[^\s@]{4,}\.[^\s@]{2,}$"
                            title="Please enter a valid email address (e.g. john@gmail.com)"
                            required
                        />
                    </div>

                    <div style={styles.field}>
                        <label style={styles.label}>Phone (10 digits)</label>
                        <input
                            name="phone"
                            value={form.phone}
                            onChange={handleChange}
                            style={styles.input}
                            placeholder="e.g. 9800000000"
                            pattern="^(97|98)[0-9]{8}$"
                            title="Phone number must start with 97 or 98 and be exactly 10 digits"
                            required
                        />
                    </div>

                    <div style={styles.field}>
                        <label style={styles.label}>Address (optional)</label>
                        <input
                            name="address"
                            value={form.address}
                            onChange={handleChange}
                            style={styles.input}
                            placeholder="e.g. Kathmandu"
                        />
                    </div>

                    <div style={styles.field}>
                        <label style={styles.label}>ID Proof Type</label>
                        <select name="idProof" value={form.idProof} onChange={handleChange} style={styles.input}>
                            <option value="Citizenship">Citizenship</option>
                            <option value="Passport">Passport</option>
                            <option value="License">License</option>
                        </select>
                    </div>

                    <div style={styles.field}>
                        <label style={styles.label}>ID Number</label>
                        <input
                            name="idNumber"
                            value={form.idNumber}
                            onChange={handleChange}
                            style={styles.input}
                            placeholder="e.g. 12346789"
                            pattern="^[0-9]+$"
                            title="ID number must contain numbers only"
                            required
                        />
                    </div>

                    <div style={styles.buttons}>
                        <button type="button" onClick={() => navigate("/guests")} style={styles.cancelBtn}>
                            Cancel
                        </button>
                        <button type="submit" style={styles.submitBtn} disabled={loading}>
                            {loading ? "Adding..." : "Add Guest"}
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

export default AddGuest;