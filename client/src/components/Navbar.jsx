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
            <style>{`
                .navbar-link,
                .navbar-logout {
                    transition: transform 0.18s ease, background-color 0.18s ease, color 0.18s ease, box-shadow 0.18s ease, opacity 0.18s ease, border-color 0.18s ease;
                }

                .navbar-link:hover {
                    background-color: rgba(255, 255, 255, 0.18);
                    color: #ffffff;
                    transform: translateY(-2px) scale(1.03);
                    box-shadow: 0 8px 18px rgba(0, 0, 0, 0.28);
                    border: 1px solid rgba(255, 255, 255, 0.18);
                    border-radius: 6px;
                }

                .navbar-link:active,
                .navbar-logout:active {
                    transform: translateY(0) scale(0.98);
                    box-shadow: none;
                }

                .navbar-link:focus-visible,
                .navbar-logout:focus-visible {
                    outline: 2px solid #f4a261;
                    outline-offset: 3px;
                }

                .navbar-logout:hover {
                    background-color: #ff5c6a;
                    transform: translateY(-2px) scale(1.03);
                    box-shadow: 0 8px 18px rgba(0, 0, 0, 0.28);
                    filter: saturate(1.05);
                }

                .logout-modal-btn {
                    transition: transform 0.18s ease, box-shadow 0.18s ease, filter 0.18s ease, background-color 0.18s ease;
                }

                .logout-modal-btn:hover {
                    transform: translateY(-2px);
                    box-shadow: 0 8px 18px rgba(0, 0, 0, 0.18);
                    filter: brightness(1.04);
                }

                .logout-modal-btn:active {
                    transform: translateY(0) scale(0.98);
                    box-shadow: none;
                }

                .logout-modal-btn:focus-visible {
                    outline: 2px solid #f4a261;
                    outline-offset: 3px;
                }

                .logout-cancel-btn:hover {
                    background-color: #e2e2e2;
                }

                .logout-confirm-btn:hover {
                    background-color: #d62839;
                }
            `}</style>
            <nav style={styles.nav}>
                <div style={styles.brand}>Everest View Hotel</div>
                <div style={styles.links}>
                    <Link to="/" className="navbar-link" style={styles.link}>Dashboard</Link>
                    <Link to="/rooms" className="navbar-link" style={styles.link}>Rooms</Link>
                    <Link to="/guests" className="navbar-link" style={styles.link}>Guests</Link>
                    <Link to="/bookings" className="navbar-link" style={styles.link}>Bookings</Link>
                    <Link to="/invoices" className="navbar-link" style={styles.link}>Invoices</Link>
                    <button onClick={() => setShowModal(true)} className="navbar-logout" style={styles.logout}>Logout</button>
                </div>
            </nav>

            {showModal && (
                <div style={styles.overlay}>
                    <div style={styles.modal}>
                        <h3 style={styles.modalTitle}>Confirm Logout</h3>
                        <p style={styles.modalText}>Are you sure you want to logout?</p>
                        <div style={styles.modalButtons}>
                            <button onClick={() => setShowModal(false)} className="logout-modal-btn logout-cancel-btn" style={styles.cancelBtn}>
                                Cancel
                            </button>
                            <button onClick={handleLogout} className="logout-modal-btn logout-confirm-btn" style={styles.confirmBtn}>
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
        padding: "8px 12px",
        borderRadius: "6px",
        border: "1px solid transparent",
    },
    logout: {
        backgroundColor: "#e63946",
        color: "white",
        border: "1px solid transparent",
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