import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import API from "../../api/axios";

const Invoices = () => {
    const [invoices, setInvoices] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchInvoices = async () => {
            try {
                const res = await API.get("/invoices");
                setInvoices(res.data.invoices);
            } catch {
                console.error("Failed to fetch invoices");
            } finally {
                setLoading(false);
            }
        };
        fetchInvoices();
    }, []);

    if (loading) return <div style={styles.center}>Loading...</div>;

    return (
        <div style={styles.container}>
            <div style={styles.header}>
                <h2 style={styles.title}>Invoices</h2>
            </div>

            {invoices.length === 0 ? (
                <div style={styles.empty}>No invoices found. Generate one from the Bookings page.</div>
            ) : (
                <table style={styles.table}>
                    <thead>
                        <tr style={styles.thead}>
                            <th style={styles.th}>Guest</th>
                            <th style={styles.th}>Room</th>
                            <th style={styles.th}>Check In</th>
                            <th style={styles.th}>Check Out</th>
                            <th style={styles.th}>Days</th>
                            <th style={styles.th}>Total Amount</th>
                            <th style={styles.th}>Invoice Date</th>
                            <th style={styles.th}>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {invoices.map((invoice) => (
                            <tr key={invoice._id} style={styles.tr}>
                                <td style={styles.td}>{invoice.guestName}</td>
                                <td style={styles.td}>{invoice.roomNumber}</td>
                                <td style={styles.td}>{new Date(invoice.checkIn).toLocaleDateString()}</td>
                                <td style={styles.td}>{new Date(invoice.checkOut).toLocaleDateString()}</td>
                                <td style={styles.td}>{invoice.days}</td>
                                <td style={styles.td}>Rs. {invoice.totalAmount?.toLocaleString()}</td>
                                <td style={styles.td}>{new Date(invoice.invoiceDate).toLocaleDateString()}</td>
                                <td style={styles.td}>
                                    <button
                                        onClick={() => navigate(`/invoices/${invoice.booking}`)}
                                        className="shared-view-btn"
                                        style={styles.viewBtn}
                                    >
                                        View
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </div>
    );
};

const styles = {
    container: { padding: "24px" },
    header: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" },
    title: { fontSize: "24px", color: "#1a1a2e" },
    table: { width: "100%", borderCollapse: "collapse", backgroundColor: "white", borderRadius: "10px", overflow: "hidden", boxShadow: "0 2px 10px rgba(0,0,0,0.08)" },
    thead: { backgroundColor: "#1a1a2e" },
    th: { padding: "14px 16px", textAlign: "left", color: "white", fontWeight: "600" },
    tr: { borderBottom: "1px solid #f0f0f0" },
    td: { padding: "12px 16px", color: "#333" },
    viewBtn: { backgroundColor: "#4361ee", color: "white", border: "none", padding: "6px 14px", borderRadius: "6px", cursor: "pointer" },
    empty: { textAlign: "center", padding: "40px", color: "#666" },
    center: { display: "flex", justifyContent: "center", alignItems: "center", height: "80vh", fontSize: "18px" },
};

export default Invoices;