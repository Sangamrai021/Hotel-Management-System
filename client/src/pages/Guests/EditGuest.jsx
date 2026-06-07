import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import API from "../../api/axios";

const EditGuest = () => {
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
    const navigate = useNavigate();
    const { id } = useParams();

    useEffect(() => {
        const fetchGuest = async () => {
            try {
                const res = await API.get(`/guests/${id}`);
                setForm({
                    name: res.data.name,
                    email: res.data.email,
                    phone: res.data.phone,
                    address: res.data.address,
                    idProof: res.data.idProof,
                    idNumber: res.data.idNumber,
                });
            } catch (err) {
                setError("Failed to load guest");
            }
        };
        fetchGuest();
    }, [id]);

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setLoading(true);
        try {
            await API.put(`/guests/${id}`, form);
            navigate("/guests");
        } catch (err) {
            setError(err.response?.data?.message || "Failed to update guest");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={styles.container}>
            <div style={styles.card}>
                <h2 style={styles.title}>Edit Guest</h2>

                {error && <div style={styles.error}>{error}</div>}

                <form onSubmit={handleSubmit}>
                    <div style={styles.field}>
                        <label style={styles.label}>Full Name</label>
                        <input
                            name="name"
                            value={form.name}
                            onChange={handleChange}
                            style={styles.input}
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
                            {loading ? "Updating..." : "Update Guest"}
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

export default EditGuest;