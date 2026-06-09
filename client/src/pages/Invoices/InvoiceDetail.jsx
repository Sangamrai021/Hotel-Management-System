import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import API from "../../api/axios";

const printStyles = `
  @media print {
    body * { visibility: hidden; }
    #invoice, #invoice * { visibility: visible; }
    #invoice { position: fixed; top: 0; left: 0; width: 100%; }
    .no-print { display: none !important; }
  }
`;

const InvoiceDetail = () => {
    const [invoice, setInvoice] = useState(null);
    const [loading, setLoading] = useState(true);
    const [generating, setGenerating] = useState(false);
    const [error, setError] = useState("");
    const { bookingId } = useParams();
    const navigate = useNavigate();

    useEffect(() => {
        const fetchInvoice = async () => {
            try {
                const res = await API.get(`/invoices/booking/${bookingId}`);
                setInvoice(res.data);
            } catch (err) {
                if (err.response?.status === 404) {
                    setInvoice(null);
                } else {
                    setError("Failed to load invoice");
                }
            } finally {
                setLoading(false);
            }
        };
        fetchInvoice();
    }, [bookingId]);

    const handleGenerate = async () => {
        setGenerating(true);
        try {
            const res = await API.post(`/invoices/booking/${bookingId}`);
            setInvoice(res.data);
        } catch (err) {
            setError(err.response?.data?.message || "Failed to generate invoice");
        } finally {
            setGenerating(false);
        }
    };

    const handlePrint = () => {
        window.print();
    };

    if (loading) return <div style={styles.center}>Loading...</div>;
    if (error) return <div style={styles.center}>{error}</div>;

    if (!invoice) {
        return (
            <div style={styles.center}>
                <div style={{ textAlign: "center" }}>
                    <p style={{ fontSize: "18px", marginBottom: "20px", color: "#666" }}>
                        No invoice generated yet for this booking.
                    </p>
                    <button onClick={handleGenerate} style={styles.generateBtn} disabled={generating}>
                        {generating ? "Generating..." : "Generate Invoice"}
                    </button>
                </div>
            </div>
        );
    }

    return (
        <>
            <style>{printStyles}</style>
            <div style={styles.container}>
                <div style={styles.actions} className="no-print">
                    <button onClick={() => navigate("/invoices")} style={styles.backBtn}>
                        ← Back
                    </button>
                    <button onClick={handlePrint} style={styles.printBtn}>
                        🖨️ Print / Download PDF
                    </button>
                </div>

                <div style={styles.invoice} id="invoice">
                    <div style={styles.invoiceHeader}>
                        <h1 style={styles.hotelName}>Hotel Management</h1>
                        <h2 style={styles.invoiceTitle}>INVOICE</h2>
                    </div>

                    <div style={styles.divider} />

                    <div style={styles.row}>
                        <span style={styles.label}>Invoice Date</span>
                        <span style={styles.value}>{new Date(invoice.invoiceDate).toLocaleDateString()}</span>
                    </div>

                    <div style={styles.divider} />

                    <div style={styles.row}>
                        <span style={styles.label}>Guest Name</span>
                        <span style={styles.value}>{invoice.guestName}</span>
                    </div>
                    <div style={styles.row}>
                        <span style={styles.label}>Room No</span>
                        <span style={styles.value}>{invoice.roomNumber}</span>
                    </div>
                    <div style={styles.row}>
                        <span style={styles.label}>Room Type</span>
                        <span style={styles.value}>{invoice.roomType}</span>
                    </div>

                    <div style={styles.divider} />

                    <div style={styles.row}>
                        <span style={styles.label}>Check In</span>
                        <span style={styles.value}>{new Date(invoice.checkIn).toLocaleDateString()}</span>
                    </div>
                    <div style={styles.row}>
                        <span style={styles.label}>Check Out</span>
                        <span style={styles.value}>{new Date(invoice.checkOut).toLocaleDateString()}</span>
                    </div>
                    <div style={styles.row}>
                        <span style={styles.label}>Days</span>
                        <span style={styles.value}>{invoice.days}</span>
                    </div>

                    <div style={styles.divider} />

                    <div style={styles.row}>
                        <span style={styles.label}>Price Per Night</span>
                        <span style={styles.value}>Rs. {invoice.pricePerNight?.toLocaleString()}</span>
                    </div>

                    <div style={styles.divider} />

                    <div style={{ ...styles.row, ...styles.totalRow }}>
                        <span style={styles.totalLabel}>Total Amount</span>
                        <span style={styles.totalValue}>Rs. {invoice.totalAmount?.toLocaleString()}</span>
                    </div>

                    <div style={styles.divider} />

                    <p style={styles.footer}>Thank you for staying with us!</p>
                </div>
            </div>
        </>
    );
};

const styles = {
    container: { padding: "24px", display: "flex", flexDirection: "column", alignItems: "center" },
    actions: { display: "flex", justifyContent: "space-between", width: "100%", maxWidth: "500px", marginBottom: "20px" },
    backBtn: { backgroundColor: "#f0f0f0", color: "#333", border: "none", padding: "10px 20px", borderRadius: "6px", cursor: "pointer", fontSize: "15px" },
    printBtn: { backgroundColor: "#1a1a2e", color: "white", border: "none", padding: "10px 20px", borderRadius: "6px", cursor: "pointer", fontSize: "15px" },
    generateBtn: { backgroundColor: "#2a9d8f", color: "white", border: "none", padding: "12px 28px", borderRadius: "6px", cursor: "pointer", fontSize: "16px" },
    invoice: { backgroundColor: "white", padding: "40px", borderRadius: "12px", boxShadow: "0 2px 10px rgba(0,0,0,0.08)", width: "100%", maxWidth: "500px" },
    invoiceHeader: { textAlign: "center", marginBottom: "20px" },
    hotelName: { fontSize: "22px", color: "#1a1a2e", marginBottom: "4px" },
    invoiceTitle: { fontSize: "16px", color: "#666", fontWeight: "normal", letterSpacing: "4px" },
    divider: { borderTop: "1px dashed #ccc", margin: "16px 0" },
    row: { display: "flex", justifyContent: "space-between", marginBottom: "10px" },
    label: { color: "#666", fontSize: "15px" },
    value: { color: "#1a1a2e", fontWeight: "500", fontSize: "15px" },
    totalRow: { marginTop: "8px" },
    totalLabel: { fontSize: "18px", fontWeight: "bold", color: "#1a1a2e" },
    totalValue: { fontSize: "18px", fontWeight: "bold", color: "#2a9d8f" },
    footer: { textAlign: "center", color: "#666", marginTop: "20px", fontSize: "14px" },
    center: { display: "flex", justifyContent: "center", alignItems: "center", height: "80vh", fontSize: "18px" },
};

export default InvoiceDetail;