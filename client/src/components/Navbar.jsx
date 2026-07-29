import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useQueryClient } from "@tanstack/react-query";
import { useAuth } from "../context/AuthContext";
import { dashboardKeys, fetchDashboardStats } from "../hooks/useDashboardStats";
import { roomsKeys, fetchRooms } from "../hooks/useRooms";
import { guestsKeys, fetchGuests } from "../hooks/useGuests";
import { bookingsKeys, fetchBookings } from "../hooks/useBookings";
import { invoicesKeys, fetchInvoices } from "../hooks/useInvoices";
import { paymentsKeys, fetchPayments } from "../hooks/usePayments";
import { hotelsKeys, fetchHotels } from "../hooks/useHotels";
import { usersKeys, fetchUsers } from "../hooks/useUsers";

const Navbar = () => {
    const { logout, user } = useAuth();
    const navigate = useNavigate();
    const queryClient = useQueryClient();
    const [showModal, setShowModal] = useState(false);
    const [showDropdown, setShowDropdown] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    const prefetch = (queryKey, queryFn) => {
        queryClient.prefetchQuery({ queryKey, queryFn, staleTime: 30 * 1000 });
    };

    const handleLogout = () => {
        logout();
        navigate("/login");
    };

    const getRoleBadgeColor = () => {
        switch (user?.role) {
            case "SuperAdmin": return "#6d6875";
            case "Manager": return "#4361ee";
            case "Receptionist": return "#2a9d8f";
            case "Accountant": return "#f4a261";
            default: return "#666";
        }
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

        .dropdown-item:hover {
          background-color: #f8f9ff !important;
        }

        .user-avatar:hover {
          background-color: rgba(255,255,255,0.15) !important;
        }

        .nav-mobile-toggle {
          display: none;
          background: none;
          border: none;
          cursor: pointer;
          padding: 8px;
          border-radius: 6px;
          transition: background-color 0.18s ease;
        }
        .nav-mobile-toggle:hover {
          background-color: rgba(255,255,255,0.1);
        }
        .nav-mobile-toggle:active {
          transform: scale(0.95);
        }
        .nav-mobile-toggle:focus-visible {
          outline: 2px solid #f4a261;
          outline-offset: 3px;
        }

        .nav-links-wrapper {
          display: flex;
        }

        @media (max-width: 767px) {
          .nav-mobile-toggle {
            display: flex;
            align-items: center;
            justify-content: center;
          }
          .nav-links-wrapper {
            display: none;
            position: absolute;
            top: 100%;
            left: 0;
            right: 0;
            background-color: #1a1a2e;
            border-top: 1px solid rgba(255,255,255,0.08);
            padding: 12px 24px 20px;
            z-index: 300;
            box-shadow: 0 8px 24px rgba(0,0,0,0.3);
          }
          .nav-links-wrapper.open {
            display: block;
          }
          .nav-links-wrapper > div {
            flex-direction: column;
            gap: 8px;
            width: 100%;
          }
          .nav-links-wrapper .navbar-link {
            width: 100%;
            text-align: center;
          }
        }

        .nav-overlay {
          position: fixed;
          top: 0;
          left: 0;
          width: 100vw;
          height: 100vh;
          z-index: 250;
          background: transparent;
        }
      `}</style>

            <nav style={styles.nav}>
                {/* Brand */}
                <div style={styles.brand}>
                    {user?.hotel?.name || "Hotel Management"}
                </div>

                {/* Mobile Menu Toggle */}
                <button className="nav-mobile-toggle" onClick={() => setMobileMenuOpen(!mobileMenuOpen)} aria-label="Toggle navigation menu">
                    {mobileMenuOpen ? (
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#aaaacc" strokeWidth="2" strokeLinecap="round">
                            <line x1="6" y1="6" x2="18" y2="18"/>
                            <line x1="6" y1="18" x2="18" y2="6"/>
                        </svg>
                    ) : (
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#aaaacc" strokeWidth="2" strokeLinecap="round">
                            <line x1="4" y1="6" x2="20" y2="6"/>
                            <line x1="4" y1="12" x2="20" y2="12"/>
                            <line x1="4" y1="18" x2="20" y2="18"/>
                        </svg>
                    )}
                </button>

                {/* Navigation Links */}
                <div className={"nav-links-wrapper" + (mobileMenuOpen ? " open" : "")} onClick={() => mobileMenuOpen && setMobileMenuOpen(false)}>
                    <div style={styles.links}>
                    <Link to="/" className="navbar-link" style={styles.link} onMouseEnter={() => prefetch(dashboardKeys.stats(), fetchDashboardStats)}>
                        Dashboard
                    </Link>

                    {["SuperAdmin", "Manager", "Receptionist"].includes(user?.role) && (
                        <Link to="/rooms" className="navbar-link" style={styles.link} onMouseEnter={() => prefetch(roomsKeys.list(1, "", "", ""), () => fetchRooms(1, "", "", ""))}>
                            Rooms
                        </Link>
                    )}

                    {["SuperAdmin", "Manager", "Receptionist"].includes(user?.role) && (
                        <Link to="/guests" className="navbar-link" style={styles.link} onMouseEnter={() => prefetch(guestsKeys.list(1, ""), () => fetchGuests(1, ""))}>
                            Guests
                        </Link>
                    )}

                    {["SuperAdmin", "Manager", "Receptionist"].includes(user?.role) && (
                        <Link to="/bookings" className="navbar-link" style={styles.link} onMouseEnter={() => prefetch(bookingsKeys.list(1, ""), () => fetchBookings(1, ""))}>
                            Bookings
                        </Link>
                    )}

                    <Link to="/invoices" className="navbar-link" style={styles.link} onMouseEnter={() => prefetch(invoicesKeys.list(1, ""), () => fetchInvoices(1, ""))}>
                        Invoices
                    </Link>

                    <Link to="/payments" className="navbar-link" style={styles.link} onMouseEnter={() => prefetch(paymentsKeys.list(1), () => fetchPayments(1))}>
                        Payments
                    </Link>

                    {user?.role === "SuperAdmin" && (
                        <Link to="/hotels" className="navbar-link" style={styles.link} onMouseEnter={() => prefetch(hotelsKeys.list(1, ""), () => fetchHotels(1, ""))}>
                            Hotels
                        </Link>
                    )}

                    {user?.role === "SuperAdmin" && (
                        <Link to="/users" className="navbar-link" style={styles.link} onMouseEnter={() => prefetch(usersKeys.list(1, "", ""), () => fetchUsers(1, "", ""))}>
                            Users
                        </Link>
                    )}

                    {/* User Dropdown */}
                    <div style={{ position: "relative" }}>
                        <div
                            className="user-avatar"
                            onClick={(e) => { e.stopPropagation(); setShowDropdown(!showDropdown); }}
                            style={{
                                display: "flex",
                                alignItems: "center",
                                gap: "8px",
                                cursor: "pointer",
                                padding: "6px 10px",
                                borderRadius: "8px",
                                backgroundColor: "rgba(255,255,255,0.1)",
                                transition: "background-color 0.18s ease",
                            }}
                        >
                            {/* Avatar Circle */}
                            <div style={{
                                width: "32px",
                                height: "32px",
                                borderRadius: "50%",
                                backgroundColor: getRoleBadgeColor(),
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                color: "white",
                                fontWeight: "bold",
                                fontSize: "14px",
                                flexShrink: 0,
                            }}>
                                {user?.name?.charAt(0).toUpperCase()}
                            </div>

                            {/* Name and Role */}
                            <div style={{ display: "flex", flexDirection: "column", gap: "2px" }}>
                                <span style={{ color: "white", fontSize: "13px", fontWeight: "500" }}>
                                    {user?.name}
                                </span>
                                <span style={{
                                    fontSize: "10px",
                                    backgroundColor: getRoleBadgeColor(),
                                    color: "white",
                                    padding: "1px 6px",
                                    borderRadius: "10px",
                                    textAlign: "center",
                                }}>
                                    {user?.role}
                                </span>
                            </div>

                            <span style={{ color: "#aaaacc", fontSize: "10px" }}>▼</span>
                        </div>

                        {/* Dropdown Menu */}
                        {showDropdown && (
                            <>
                                {/* Overlay to close dropdown */}
                                <div
                                    style={{
                                        position: "fixed",
                                        top: 0,
                                        left: 0,
                                        width: "100vw",
                                        height: "100vh",
                                        zIndex: 400,
                                    }}
                                    onClick={(e) => { e.stopPropagation(); setShowDropdown(false); }}
                                />

                                <div style={{
                                    position: "absolute",
                                    top: "48px",
                                    right: 0,
                                    backgroundColor: "white",
                                    borderRadius: "10px",
                                    boxShadow: "0 4px 20px rgba(0,0,0,0.15)",
                                    minWidth: "220px",
                                    zIndex: 450,
                                    overflow: "hidden",
                                }}>
                                    {/* User Info Header */}
                                    <div style={{
                                        padding: "16px",
                                        backgroundColor: "#f8f9ff",
                                    }}>
                                        <div style={{ fontSize: "14px", fontWeight: "bold", color: "#1a1a2e" }}>
                                            {user?.name}
                                        </div>
                                        <div style={{ fontSize: "12px", color: "#666", marginTop: "2px" }}>
                                            {user?.email}
                                        </div>
                                        {user?.hotel && (
                                            <div style={{ fontSize: "12px", color: "#4361ee", marginTop: "4px" }}>
                                                {user.hotel.name}
                                            </div>
                                        )}
                                    </div>

                                    <div style={{ height: "1px", backgroundColor: "#f0f0f0" }} />

                                    {/* My Profile */}
                                    <button
                                        className="dropdown-item"
                                        onClick={() => { setShowDropdown(false); navigate("/profile"); }}
                                        style={{
                                            display: "block",
                                            width: "100%",
                                            padding: "12px 16px",
                                            backgroundColor: "transparent",
                                            border: "none",
                                            textAlign: "left",
                                            cursor: "pointer",
                                            fontSize: "14px",
                                            color: "#333",
                                        }}
                                    >
                                        My Profile
                                    </button>

                                    <div style={{ height: "1px", backgroundColor: "#f0f0f0" }} />

                                    {/* Logout */}
                                    <button
                                        className="dropdown-item"
                                        onClick={() => { setShowDropdown(false); setShowModal(true); }}
                                        style={{
                                            display: "block",
                                            width: "100%",
                                            padding: "12px 16px",
                                            backgroundColor: "transparent",
                                            border: "none",
                                            textAlign: "left",
                                            cursor: "pointer",
                                            fontSize: "14px",
                                            color: "#e63946",
                                        }}
                                    >
                                        Logout
                                    </button>
                                </div>
                            </>
                        )}
                    </div>
                </div>
                </div>
                {mobileMenuOpen && <div className="nav-overlay" onClick={() => setMobileMenuOpen(false)} />}
            </nav>

            {/* Logout Confirmation Modal */}
            {showModal && (
                <div style={styles.overlay}>
                    <div style={styles.modal}>
                        <h3 style={styles.modalTitle}>Confirm Logout</h3>
                        <p style={styles.modalText}>Are you sure you want to logout?</p>
                        <div style={styles.modalButtons}>
                            <button
                                onClick={() => setShowModal(false)}
                                className="logout-modal-btn logout-cancel-btn"
                                style={styles.cancelBtn}
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleLogout}
                                className="logout-modal-btn logout-confirm-btn"
                                style={styles.confirmBtn}
                            >
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
        position: "relative",
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