import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import API from "../../api/axios";

const EditUser = () => {
    const [form, setForm] = useState({
        name: "",
        email: "",
        password: "",
        role: "",
        hotel: "",
        phone: "",
        isActive: true,
    });
    const [hotels, setHotels] = useState([]);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const navigate = useNavigate();
    const { id } = useParams();

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [userRes, hotelsRes] = await Promise.all([
                    API.get(`/users/${id}`),
                    API.get("/hotels", { params: { limit: 100 } }),
                ]);
                const user = userRes.data;
                setForm({
                    name: user.name,
                    email: user.email,
                    password: "",
                    role: user.role,
                    hotel: user.hotel?._id || "",
                    phone: user.phone || "",
                    isActive: user.isActive,
                });
                setHotels(hotelsRes.data.hotels);
            } catch (err) {
                setError("Failed to load user");
            }
        };
        fetchData();
    }, [id]);

    const handleChange = (e) => {
        const value = e.target.type === "checkbox"
            ? e.target.checked
            : e.target.value;
        setForm({ ...form, [e.target.name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");

        if (form.role !== "SuperAdmin" && !form.hotel)
            return setError("Please assign a hotel for this role");

        setLoading(true);
        try {
            const payload = { ...form };
            // Don't send empty password
            if (!payload.password) delete payload.password;
            await API.put(`/users/${id}`, payload);
            navigate("/users");
        } catch (err) {
            setError(err.response?.data?.message || "Failed to update user");
        } finally {
            setLoading(false);
        }
    };

    const getRoleColor = (role) => {
        const colors = {
            SuperAdmin: "#6d6875",
            Manager: "#4361ee",
            Receptionist: "#2a9d8f",
            Accountant: "#f4a261",
        };
        return colors[role] || "#666";
    };

    return (
        <div style={styles.container}>
            <div style={styles.card}>
                <h2 style={styles.title}>Edit User</h2>
                <p style={styles.subtitle}>Update staff account details</p>

                {error && <div style={styles.error}>{error}</div>}

                <form onSubmit={handleSubmit}>
                    <div style={styles.field}>
                        <label style={styles.label}>Full Name *</label>
                        <input
                            name="name"
                            value={form.name}
                            onChange={handleChange}
                            className="input"
                            style={styles.input}
                            pattern="^[a-zA-Z\s]+$"
                            title="Name can only contain letters and spaces"
                            required
                        />
                    </div>

                    <div style={styles.field}>
                        <label style={styles.label}>Email Address *</label>
                        <input
                            name="email"
                            type="email"
                            value={form.email}
                            onChange={handleChange}
                            className="input"
                            style={styles.input}
                            required
                        />
                    </div>

                    <div style={styles.field}>
                        <label style={styles.label}>
                            New Password
                            <span style={styles.optional}> (leave blank to keep current)</span>
                        </label>
                        <div style={styles.passwordWrapper}>
                            <input
                                name="password"
                                type={showPassword ? "text" : "password"}
                                value={form.password}
                                onChange={handleChange}
                                className="input"
                                style={{ ...styles.input, paddingRight: "44px" }}
                                placeholder="Leave blank to keep current password"
                                minLength={form.password ? 8 : 0}
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                style={styles.eyeBtn}
                                aria-label={showPassword ? "Hide password" : "Show password"}
                            >
                                {showPassword ? "Hide" : "Show"}
                            </button>
                        </div>
                    </div>

                    <div style={styles.field}>
                        <label style={styles.label}>Phone</label>
                        <input
                            name="phone"
                            value={form.phone}
                            onChange={handleChange}
                            className="input"
                            style={styles.input}
                            placeholder="e.g. 9800000000"
                        />
                    </div>

                    <div style={styles.field}>
                        <label style={styles.label}>Role *</label>
                        <select
                            name="role"
                            value={form.role}
                            onChange={handleChange}
                            className="select"
                            style={styles.input}
                        >
                            <option value="Manager">Manager</option>
                            <option value="Receptionist">Receptionist</option>
                            <option value="Accountant">Accountant</option>
                            <option value="SuperAdmin">Super Admin</option>
                        </select>
                        <div style={{
                            ...styles.roleHint,
                            borderLeft: `3px solid ${getRoleColor(form.role)}`,
                        }}>
                            {form.role === "SuperAdmin" && "Full system access — manages all hotels and users"}
                            {form.role === "Manager" && "Manages assigned hotel — rooms, guests, bookings, reports"}
                            {form.role === "Receptionist" && "Handles bookings, check in/out, invoices and payments"}
                            {form.role === "Accountant" && "View only access to invoices and payment records"}
                        </div>
                    </div>

                    {/* Hotel assignment — hide for SuperAdmin */}
                    {form.role !== "SuperAdmin" && (
                        <div style={styles.field}>
                            <label style={styles.label}>Assigned Hotel *</label>
                            <select
                                name="hotel"
                                value={form.hotel}
                                onChange={handleChange}
                                className="select"
                                style={styles.input}
                                required
                            >
                                <option value="">Select Hotel</option>
                                {hotels.map((hotel) => (
                                    <option key={hotel._id} value={hotel._id}>
                                        {hotel.name} — {hotel.city}
                                    </option>
                                ))}
                            </select>
                        </div>
                    )}

                    {form.role === "SuperAdmin" && (
                        <div style={styles.superAdminNote}>
                            Super Admin has access to all hotels — no hotel assignment needed
                        </div>
                    )}

                    {/* Active Status Toggle */}
                    <div style={styles.field}>
                        <label style={styles.label}>Account Status</label>
                        <div style={styles.statusToggle}>
                            <label style={styles.toggleLabel}>
                                <input
                                    type="checkbox"
                                    name="isActive"
                                    checked={form.isActive}
                                    onChange={handleChange}
                                    style={styles.checkbox}
                                />
                                <span style={{
                                    ...styles.statusBadge,
                                    backgroundColor: form.isActive ? "#d4edda" : "#f8d7da",
                                    color: form.isActive ? "#155724" : "#721c24",
                                }}>
                                    {form.isActive ? "Active" : "Inactive"}
                                </span>
                            </label>
                            <span style={styles.statusHint}>
                                {form.isActive
                                    ? "User can log in and access the system"
                                    : "User cannot log in — account is deactivated"}
                            </span>
                        </div>
                    </div>

                    <div style={styles.buttons}>
                        <button
                            type="button"
                            onClick={() => navigate("/users")}
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
                            {loading ? "Updating..." : "Update User"}
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
    error: { backgroundColor: "#ffe0e0", color: "#c0392b", padding: "10px", borderRadius: "6px", marginBottom: "16px", fontSize: "14px" },
    field: { marginBottom: "18px" },
    label: { display: "block", marginBottom: "6px", fontWeight: "bold", color: "#333", fontSize: "14px" },
    optional: { fontWeight: "normal", color: "#999", fontSize: "12px" },
    input: { width: "100%", padding: "10px 14px", borderRadius: "6px", border: "1px solid #ccc", fontSize: "15px", boxSizing: "border-box" },
    passwordWrapper: { position: "relative" },
    eyeBtn: { position: "absolute", right: "12px", top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer", fontSize: "16px", padding: 0 },
    roleHint: { marginTop: "8px", padding: "8px 12px", backgroundColor: "#f8f9ff", borderRadius: "6px", fontSize: "13px", color: "#666" },
    superAdminNote: { backgroundColor: "#f3e8ff", border: "1px solid #6d6875", borderRadius: "6px", padding: "10px 14px", fontSize: "13px", color: "#6d6875", marginBottom: "18px" },
    statusToggle: { display: "flex", alignItems: "center", gap: "12px" },
    toggleLabel: { display: "flex", alignItems: "center", gap: "8px", cursor: "pointer" },
    checkbox: { width: "16px", height: "16px", cursor: "pointer" },
    statusBadge: { padding: "4px 12px", borderRadius: "20px", fontSize: "13px", fontWeight: "500" },
    statusHint: { fontSize: "12px", color: "#999" },
    buttons: { display: "flex", gap: "12px", marginTop: "28px" },
    cancelBtn: { flex: 1, padding: "12px", backgroundColor: "#f0f0f0", color: "#333", border: "none", borderRadius: "6px", cursor: "pointer", fontSize: "15px" },
    submitBtn: { flex: 1, padding: "12px", backgroundColor: "#1a1a2e", color: "white", border: "none", borderRadius: "6px", cursor: "pointer", fontSize: "15px" },
};

export default EditUser;