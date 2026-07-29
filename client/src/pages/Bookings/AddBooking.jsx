import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import API from "../../api/axios";

const AddBooking = () => {
    const [form, setForm] = useState({
        guest: "",
        room: "",
        checkIn: "",
        checkOut: "",
    });
    const [availability, setAvailability] = useState(null);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const { data: guestsData } = useQuery({
        queryKey: ["guests", "dropdown"],
        queryFn: () => API.get("/guests", { params: { limit: 50 } }).then(r => r.data),
        staleTime: 5 * 60 * 1000,
    });
    const { data: roomsData } = useQuery({
        queryKey: ["rooms", "dropdown"],
        queryFn: () => API.get("/rooms", { params: { status: "Available", limit: 50 } }).then(r => r.data),
        staleTime: 5 * 60 * 1000,
    });

    const guests = guestsData?.guests || [];
    const rooms = roomsData?.rooms || [];

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
        setAvailability(null);
    };

    const checkAvailability = async () => {
        if (!form.room || !form.checkIn || !form.checkOut) {
            alert("Please select room, check-in and check-out dates first");
            return;
        }
        try {
            const res = await API.get("/bookings/check-availability", {
                params: { roomId: form.room, checkIn: form.checkIn, checkOut: form.checkOut },
            });
            setAvailability(res.data.available);
        } catch (error) {
            console.log(error);
            alert("Failed to check availability");
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");

        if (new Date(form.checkOut) <= new Date(form.checkIn)) {
            setError("Check-out date must be after check-in date");
            return;
        }

        setLoading(true);
        try {
            await API.post("/bookings", form);
            navigate("/bookings");
        } catch (err) {
            setError(err.response?.data?.message || "Failed to create booking");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={styles.container}>
            <div style={styles.card}>
                <h2 style={styles.title}>Add Booking</h2>

                {error && <div style={styles.error}>{error}</div>}

                <form onSubmit={handleSubmit}>
                    <div style={styles.field}>
                        <label style={styles.label}>Guest</label>
                        <select name="guest" value={form.guest} onChange={handleChange} style={styles.input} required>
                            <option value="">Select Guest</option>
                            {guests.map((g) => (
                                <option key={g._id} value={g._id}>{g.name} — {g.email}</option>
                            ))}
                        </select>
                    </div>

                    <div style={styles.field}>
                        <label style={styles.label}>Room (Available only)</label>
                        <select name="room" value={form.room} onChange={handleChange} style={styles.input} required>
                            <option value="">Select Room</option>
                            {rooms.map((r) => (
                                <option key={r._id} value={r._id}>
                                    {r.roomNumber} — {r.roomType} — Rs. {r.pricePerNight.toLocaleString()}/night
                                </option>
                            ))}
                        </select>
                    </div>

                    <div style={styles.field}>
                        <label style={styles.label}>Check In</label>
                        <input
                            name="checkIn"
                            type="date"
                            value={form.checkIn}
                            onChange={handleChange}
                            style={styles.input}
                            required
                        />
                    </div>

                    <div style={styles.field}>
                        <label style={styles.label}>Check Out</label>
                        <input
                            name="checkOut"
                            type="date"
                            value={form.checkOut}
                            onChange={handleChange}
                            style={styles.input}
                            required
                        />
                    </div>

                    <button type="button" onClick={checkAvailability} style={styles.checkBtn}>
                        Check Availability
                    </button>

                    {availability === true && (
                        <div style={styles.available}>Room is available for selected dates</div>
                    )}
                    {availability === false && (
                        <div style={styles.notAvailable}>Room is not available for selected dates</div>
                    )}

                    <div style={styles.buttons}>
                        <button type="button" onClick={() => navigate("/bookings")} style={styles.cancelBtn}>
                            Cancel
                        </button>
                        <button type="submit" style={styles.submitBtn} disabled={loading}>
                            {loading ? "Creating..." : "Create Booking"}
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
    checkBtn: { width: "100%", padding: "10px", backgroundColor: "#2a9d8f", color: "white", border: "none", borderRadius: "6px", cursor: "pointer", fontSize: "15px", marginBottom: "12px" },
    available: { backgroundColor: "#d4edda", color: "#155724", padding: "10px", borderRadius: "6px", marginBottom: "12px", textAlign: "center" },
    notAvailable: { backgroundColor: "#f8d7da", color: "#721c24", padding: "10px", borderRadius: "6px", marginBottom: "12px", textAlign: "center" },
    buttons: { display: "flex", gap: "12px", marginTop: "24px" },
    cancelBtn: { flex: 1, padding: "10px", backgroundColor: "#f0f0f0", color: "#333", border: "none", borderRadius: "6px", cursor: "pointer", fontSize: "15px" },
    submitBtn: { flex: 1, padding: "10px", backgroundColor: "#1a1a2e", color: "white", border: "none", borderRadius: "6px", cursor: "pointer", fontSize: "15px" },
};

export default AddBooking;