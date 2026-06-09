import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Navbar = () => {
    const { logout } = useAuth();
    const navigate = useNavigate();
    const [showModal, setShowModal] = useState(false);


    const handleLogout = () => {
        logout();
        navigate("/login");
    };

    return (
        <>
            <nav style={styles.nav}>
                <div style={styles.brand}>Hotel Management</div>
                <div style={styles.links}>
                    <Link to="/" style={styles.link}>Dashboard</Link>
                    <Link to="/rooms" style={styles.link}>Rooms</Link>
                    <Link to="/guests" style={styles.link}>Guests</Link>
                    <Link to="/bookings" style={styles.link}>Bookings</Link>
                    <Link to="/invoices" style={styles.link}>Invoices</Link>
                    <button onClick={() => setShowModal(true)} style={styles.logout}>Logout</button>
                </div>
            </nav>

            {showModal && (
                <div style={styles.overlay}>
                    <div style={styles.modal}>
                        <h3 style={styles.modalTitle}>Confirm Logout</h3>
                        <p style={styles.modalText}>Are you sure you want to logout?</p>
                        <div style={styles.modalButtons}>
                            <button onClick={() => setShowModal(false)} style={styles.cancelBtn}>
                                Cancel
                            </button>
                            <button onClick={handleLogout} style={styles.confirmBtn}>
                                Yes, Logout
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>


    );
};

const styles = {
    nav: {
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        padding: "12px 24px",
        backgroundColor: "#1a1a2e",
        color: "white",
    },
    brand: {
        fontSize: "20px",
        fontWeight: "bold",
    },
    links: {
        display: "flex",
        gap: "20px",
        alignItems: "center",
    },
    link: {
        color: "white",
        textDecoration: "none",
        fontSize: "15px",
    },
    logout: {
        backgroundColor: "#e63946",
        color: "white",
        border: "none",
        padding: "8px 16px",
        borderRadius: "6px",
        cursor: "pointer",
        fontSize: "15px",
    },
    overlay: {
        position: "fixed",
        top: 0,
        left: 0,
        width: "100vw",
        height: "100vh",
        backgroundColor: "rgba(0,0,0,0.5)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        zIndex: 1000,
    },
    modal: {
        backgroundColor: "white",
        padding: "32px",
        borderRadius: "12px",
        boxShadow: "0 4px 20px rgba(0,0,0,0.15)",
        width: "100%",
        maxWidth: "360px",
        textAlign: "center",
    },
    modalTitle: {
        fontSize: "20px",
        color: "#1a1a2e",
        marginBottom: "12px",
    },
    modalText: {
        fontSize: "15px",
        color: "#666",
        marginBottom: "24px",
    },
    modalButtons: {
        display: "flex",
        gap: "12px",
    },
    cancelBtn: {
        flex: 1,
        padding: "10px",
        backgroundColor: "#f0f0f0",
        color: "#333",
        border: "none",
        borderRadius: "6px",
        cursor: "pointer",
        fontSize: "15px",
    },
    confirmBtn: {
        flex: 1,
        padding: "10px",
        backgroundColor: "#e63946",
        color: "white",
        border: "none",
        borderRadius: "6px",
        cursor: "pointer",
        fontSize: "15px",
    },

};

export default Navbar;