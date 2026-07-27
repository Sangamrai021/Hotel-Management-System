import { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../../api/axios";

const AddHotel = () => {
    const [form, setForm] = useState({
        name: "",
        address: "",
        city: "",
        phone: "",
        email: "",
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
            await API.post("/hotels", form);
            navigate("/hotels");
        } catch (err) {
            setError(err.response?.data?.message || "Failed to add hotel");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={styles.container}>
                <div className="card-static" style={styles.card}>
                <h2 style={styles.title}>Add New Hotel</h2>
                <p style={styles.subtitle}>Fill in the details to add a new hotel</p>

                {error && <div style={styles.error}>{error}</div>}

                <form onSubmit={handleSubmit}>
                    <div style={styles.field}>
                        <label style={styles.label}>Hotel Name *</label>
                        <input
                            name="name"
                            value={form.name}
                            onChange={handleChange}
                            className="input"
                            style={styles.input}
                            placeholder="e.g. Hotel Himalaya"
                            required
                        />
                    </div>

                    <div style={styles.field}>
                        <label style={styles.label}>Address *</label>
                        <input
                            name="address"
                            value={form.address}
                            onChange={handleChange}
                            className="input"
                            style={styles.input}
                            placeholder="e.g. Thamel, Kathmandu"
                            required
                        />
                    </div>

                    <div style={styles.field}>
                        <label style={styles.label}>City *</label>
                        <input
                            name="city"
                            value={form.city}
                            onChange={handleChange}
                            className="input"
                            style={styles.input}
                            placeholder="e.g. Kathmandu"
                            required
                        />
                    </div>

                    <div style={styles.field}>
                        <label style={styles.label}>Phone *</label>
                        <input
                            name="phone"
                            value={form.phone}
                            onChange={handleChange}
                            className="input"
                            style={styles.input}
                            placeholder="e.g. 9800000000"
                            pattern="^[0-9]{10}$"
                            title="Phone must be exactly 10 digits"
                            required
                        />
                    </div>

                    <div style={styles.field}>
                        <label style={styles.label}>Email *</label>
                        <input
                            name="email"
                            type="email"
                            value={form.email}
                            onChange={handleChange}
                            className="input"
                            style={styles.input}
                            placeholder="e.g. info@hotel.com"
                            required
                        />
                    </div>

                    <div style={styles.buttons}>
                        <button
                            type="button"
                            onClick={() => navigate("/hotels")}
                            className="btn btn-cancel"
                            style={styles.cancelBtn}
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="btn btn-primary"
                            style={styles.submitBtn}
                            disabled={loading}
                        >
                            {loading ? "Adding..." : "Add Hotel"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

const styles = {
    container: { display: "flex", justifyContent: "center", padding: "40px 24px", backgroundColor: "#f0f2f5", minHeight: "calc(100vh - 60px)" },
    card: { backgroundColor: "white", padding: "36px", borderRadius: "12px", boxShadow: "0 2px 10px rgba(0,0,0,0.08)", width: "100%", maxWidth: "500px" },
    title: { fontSize: "22px", color: "#1a1a2e", marginBottom: "4px" },
    subtitle: { fontSize: "14px", color: "#666", marginBottom: "28px" },
    error: { backgroundColor: "#ffe0e0", color: "#c0392b", padding: "10px", borderRadius: "6px", marginBottom: "16px" },
    field: { marginBottom: "18px" },
    label: { display: "block", marginBottom: "6px", fontWeight: "bold", color: "#333", fontSize: "14px" },
    input: { width: "100%", padding: "10px 14px", borderRadius: "6px", border: "1px solid #ccc", fontSize: "15px", boxSizing: "border-box" },
    buttons: { display: "flex", gap: "12px", marginTop: "28px" },
    cancelBtn: { flex: 1, padding: "12px", backgroundColor: "#f0f0f0", color: "#333", border: "none", borderRadius: "6px", cursor: "pointer", fontSize: "15px" },
    submitBtn: { flex: 1, padding: "12px", backgroundColor: "#1a1a2e", color: "white", border: "none", borderRadius: "6px", cursor: "pointer", fontSize: "15px" },
};

export default AddHotel;
