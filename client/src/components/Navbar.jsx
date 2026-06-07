import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Navbar = () => {
    const { logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate("/login");
    };

    return (
        <nav style={styles.nav}>
            <div style={styles.brand}>🏨 Hotel Management</div>
            <div style={styles.links}>
                <Link to="/" style={styles.link}>Dashboard</Link>
                <Link to="/rooms" style={styles.link}>Rooms</Link>
                <Link to="/guests" style={styles.link}>Guests</Link>
                <Link to="/bookings" style={styles.link}>Bookings</Link>
                <Link to="/invoices" style={styles.link}>Invoices</Link>
                <button onClick={handleLogout} style={styles.logout}>Logout</button>
            </div>
        </nav>
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
};

export default Navbar;