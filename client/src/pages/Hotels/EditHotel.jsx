import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import API from "../../api/axios";

const EditHotel = () => {
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
    const { id } = useParams();

    useEffect(() => {
        const fetchHotel = async () => {
            try {
                const res = await API.get(`/hotels/${id}`);
                setForm({
                    name: res.data.name,
                    address: res.data.address,
                    city: res.data.city,
                    phone: res.data.phone,
                    email: res.data.email,
                });
            } catch (err) {
                setError("Failed to load hotel");
            }
        };
        fetchHotel();
    }, [id]);

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setLoading(true);
        try {
            await API.put(`/hotels/${id}`, form);
            navigate("/hotels");
        } catch (err) {
            setError(err.response?.data?.message || "Failed to update hotel");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={styles.container}>
            <div style={styles.card}>
                <h2 style={styles.title}>Edit Hotel</h2>
                <p style={styles.subtitle}>Update hotel details</p>

                {error && <div style={styles.error}>{error}</div>}

                <form onSubmit={handleSubmit}>
                    <div style={styles.field}>
                        <label style={styles.label}>Hotel Name *</label>
                        <input
                            name="name"
                            value={form.name}
                            onChange={handleChange}
                            style={styles.input}
                            required
                        />
                    </div>

                    <div style={styles.field}>
                        <label style={styles.label}>Address *</label>
                        <input
                            name="address"
                            value={form.address}
                            onChange={handleChange}
                            style={styles.input}
                            required
                        />
                    </div>

                    <div style={styles.field}>
                        <label style={styles.label}>City *</label>
                        <input
                            name="city"
                            value={form.city}
                            onChange={handleChange}
                            style={styles.input}
                            required
                        />
                    </div>

                    <div style={styles.field}>
                        <label style={styles.label}>Phone *</label>
                        <input
                            name="phone"
                            value={form.phone}
                            onChange={handleChange}
                            style={styles.input}
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
                            style={styles.input}
                            required
                        />
                    </div>

                    <div style={styles.buttons}>
                        <button
                            type="button"
                            onClick={() => navigate("/hotels")}
                            style={styles.cancelBtn}
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            style={styles.submitBtn}
                            disabled={loading}
                        >
                            {loading ? "Updating..." : "Update Hotel"}
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

export default EditHotel;