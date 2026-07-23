import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
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
    const [paymentModal, setPaymentModal] = useState(false);
    const [paymentForm, setPaymentForm] = useState({ method: "Cash", transactionId: "" });
    const [paymentLoading, setPaymentLoading] = useState(false);
    const [paymentSuccess, setPaymentSuccess] = useState(false);
    const { bookingId } = useParams();
    const navigate = useNavigate();
    const { user } = useAuth();

    const canCollectPayment = ["SuperAdmin", "Manager", "Receptionist"].includes(user?.role);

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

    useEffect(() => {
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

    const handleCollectPayment = async () => {
        if (paymentForm.method !== "Cash" && !paymentForm.transactionId)
            return alert("Transaction ID is required for digital payments");

        setPaymentLoading(true);
        try {
            await API.post("/payments/collect", {
                invoiceId: invoice._id,
                method: paymentForm.method,
                transactionId: paymentForm.transactionId || null,
            });
            setPaymentSuccess(true);
            setPaymentModal(false);
            fetchInvoice();
        } catch (err) {
            alert(err.response?.data?.message || "Failed to collect payment");
        } finally {
            setPaymentLoading(false);
        }
    };

    const getMethodIcon = (method) => {
        switch (method) {
            case "Cash": return "C";
            case "Khalti": return "K";
            case "eSewa": return "E";
            default: return "•";
        }
    };

    if (loading) return <div style={styles.center}>Loading...</div>;
    if (error) return <div style={styles.center}>{error}</div>;

    if (!invoice) {
        return (
            <div style={styles.center}>
                <div style={{ textAlign: "center" }}>
                    <div style={{ fontSize: "64px", marginBottom: "16px" }}>Invoice</div>
                    <p style={{ fontSize: "18px", marginBottom: "8px", color: "#333" }}>
                        No invoice generated yet
                    </p>
                    <p style={{ fontSize: "14px", color: "#666", marginBottom: "24px" }}>
                        Generate an invoice for this booking
                    </p>
                    {canCollectPayment && (
                        <button
                            onClick={handleGenerate}
                            style={styles.generateBtn}
                            disabled={generating}
                        >
                            {generating ? "Generating..." : "Generate Invoice"}
                        </button>
                    )}
                </div>
            </div>
        );
    }

    return (
        <>
            <style>{printStyles}</style>
            <div style={styles.container}>

                {/* Actions Bar */}
                <div style={styles.actions} className="no-print">
                    <button
                        onClick={() => navigate("/invoices")}
                        style={styles.backBtn}
                    >
                        ← Back to Invoices
                    </button>
                    <div style={styles.actionRight}>
                        {/* Payment Status Badge */}
                        <span style={{
                            ...styles.paymentBadge,
                            backgroundColor: invoice.paymentStatus === "Paid" ? "#d4edda" : "#fff3cd",
                            color: invoice.paymentStatus === "Paid" ? "#155724" : "#856404",
                        }}>
                            {invoice.paymentStatus === "Paid" ? "Paid" : "Pending"}
                        </span>
                        <button
                            onClick={() => window.print()}
                            style={styles.printBtn}
                        >
                            Print / PDF
                        </button>
                    </div>
                </div>

                <div style={styles.layout}>

                    {/* Left — Invoice Document */}
                    <div style={styles.invoiceWrapper}>
                        <div style={styles.invoice} id="invoice">
                            {/* Hotel Header */}
                            <div style={styles.invoiceHeader}>
                                <h1 style={styles.hotelName}>
                                    {invoice.hotel?.name || "Hotel Management"}
                                </h1>
                                <p style={styles.hotelDetail}>{invoice.hotel?.address}</p>
                                <p style={styles.hotelDetail}>Phone: {invoice.hotel?.phone}</p>
                                <p style={styles.hotelDetail}>Email: {invoice.hotel?.email}</p>
                            </div>

                            <div style={styles.divider} />

                            <div style={styles.invoiceMeta}>
                                <div>
                                    <div style={styles.invoiceLabel}>INVOICE</div>
                                    <div style={styles.invoiceNumber}>
                                        INV-{invoice._id.slice(-8).toUpperCase()}
                                    </div>
                                </div>
                                <div style={{ textAlign: "right" }}>
                                    <div style={styles.invoiceLabel}>DATE</div>
                                    <div style={styles.invoiceNumber}>
                                        {new Date(invoice.invoiceDate).toLocaleDateString()}
                                    </div>
                                </div>
                            </div>

                            <div style={styles.divider} />

                            <div style={styles.row}>
                                <span style={styles.rowLabel}>Guest Name</span>
                                <span style={styles.rowValue}>{invoice.guestName}</span>
                            </div>
                            <div style={styles.row}>
                                <span style={styles.rowLabel}>Room No</span>
                                <span style={styles.rowValue}>{invoice.roomNumber}</span>
                            </div>
                            <div style={styles.row}>
                                <span style={styles.rowLabel}>Room Type</span>
                                <span style={styles.rowValue}>{invoice.roomType}</span>
                            </div>

                            <div style={styles.divider} />

                            <div style={styles.row}>
                                <span style={styles.rowLabel}>Check In</span>
                                <span style={styles.rowValue}>
                                    {new Date(invoice.checkIn).toLocaleDateString()}
                                </span>
                            </div>
                            <div style={styles.row}>
                                <span style={styles.rowLabel}>Check Out</span>
                                <span style={styles.rowValue}>
                                    {new Date(invoice.checkOut).toLocaleDateString()}
                                </span>
                            </div>
                            <div style={styles.row}>
                                <span style={styles.rowLabel}>Days</span>
                                <span style={styles.rowValue}>{invoice.days}</span>
                            </div>

                            <div style={styles.divider} />

                            <div style={styles.row}>
                                <span style={styles.rowLabel}>Price Per Night</span>
                                <span style={styles.rowValue}>
                                    Rs. {invoice.pricePerNight?.toLocaleString()}
                                </span>
                            </div>

                            <div style={styles.divider} />

                            <div style={{ ...styles.row, ...styles.totalRow }}>
                                <span style={styles.totalLabel}>Total Amount</span>
                                <span style={styles.totalValue}>
                                    Rs. {invoice.totalAmount?.toLocaleString()}
                                </span>
                            </div>

                            <div style={styles.divider} />

                            <div style={styles.row}>
                                <span style={styles.rowLabel}>Payment Status</span>
                                <span style={{
                                    fontWeight: "bold",
                                    color: invoice.paymentStatus === "Paid" ? "#2a9d8f" : "#f4a261",
                                }}>
                                    {invoice.paymentStatus === "Paid" ? "PAID" : "PENDING"}
                                </span>
                            </div>

                            {invoice.paymentStatus === "Paid" && invoice.paymentMethod && (
                                <div style={styles.row}>
                                    <span style={styles.rowLabel}>Payment Method</span>
                                    <span style={styles.rowValue}>
                                        {getMethodIcon(invoice.paymentMethod)} {invoice.paymentMethod}
                                    </span>
                                </div>
                            )}

                            {invoice.transactionId && (
                                <div style={styles.row}>
                                    <span style={styles.rowLabel}>Transaction ID</span>
                                    <span style={styles.rowValue}>{invoice.transactionId}</span>
                                </div>
                            )}

                            {invoice.paidAt && (
                                <div style={styles.row}>
                                    <span style={styles.rowLabel}>Paid At</span>
                                    <span style={styles.rowValue}>
                                        {new Date(invoice.paidAt).toLocaleString()}
                                    </span>
                                </div>
                            )}

                            <div style={styles.divider} />

                            <p style={styles.footer}>
                                Thank you for staying with us!
                                <br />
                                We hope to see you again.
                            </p>
                        </div>
                    </div>

                    {/* Right — Payment Panel */}
                    <div style={styles.rightPanel} className="no-print">

                        {/* Payment Status Card */}
                        <div style={{
                            ...styles.paymentStatusCard,
                            backgroundColor: invoice.paymentStatus === "Paid" ? "#d4edda" : "#fff3cd",
                            border: `1px solid ${invoice.paymentStatus === "Paid" ? "#2a9d8f" : "#e9c46a"}`,
                        }}>
                            <div style={styles.paymentStatusIcon}>
                                {invoice.paymentStatus === "Paid" ? "Paid" : "Pending"}
                            </div>
                            <div style={styles.paymentStatusText}>
                                {invoice.paymentStatus === "Paid"
                                    ? "PAYMENT RECEIVED"
                                    : "PAYMENT PENDING"}
                            </div>
                            <div style={styles.paymentStatusAmount}>
                                Rs. {invoice.totalAmount?.toLocaleString()}
                            </div>
                        </div>

                        {/* Collect Payment Button */}
                        {invoice.paymentStatus === "Pending" && canCollectPayment && (
                            <button
                                onClick={() => {
                                    setPaymentModal(true);
                                    setPaymentForm({ method: "Cash", transactionId: "" });
                                    setPaymentSuccess(false);
                                }}
                                style={styles.collectBtn}
                            >
                                Collect Payment
                            </button>
                        )}

                        {/* Payment Details if Paid */}
                        {invoice.paymentStatus === "Paid" && (
                            <div style={styles.paidDetails}>
                                <h4 style={styles.paidDetailsTitle}>Payment Details</h4>
                                <div style={styles.paidRow}>
                                    <span style={styles.paidLabel}>Method</span>
                                    <span style={styles.paidValue}>
                                        {getMethodIcon(invoice.paymentMethod)} {invoice.paymentMethod}
                                    </span>
                                </div>
                                {invoice.transactionId && (
                                    <div style={styles.paidRow}>
                                        <span style={styles.paidLabel}>Trans ID</span>
                                        <span style={styles.paidValue}>{invoice.transactionId}</span>
                                    </div>
                                )}
                                {invoice.paidAt && (
                                    <div style={styles.paidRow}>
                                        <span style={styles.paidLabel}>Paid At</span>
                                        <span style={styles.paidValue}>
                                            {new Date(invoice.paidAt).toLocaleDateString()}
                                        </span>
                                    </div>
                                )}
                            </div>
                        )}

                        {/* Booking Summary */}
                        <div style={styles.summaryCard}>
                            <h4 style={styles.summaryTitle}>Booking Summary</h4>
                            <div style={styles.paidRow}>
                                <span style={styles.paidLabel}>Hotel</span>
                                <span style={styles.paidValue}>{invoice.hotel?.name}</span>
                            </div>
                            <div style={styles.paidRow}>
                                <span style={styles.paidLabel}>Guest</span>
                                <span style={styles.paidValue}>{invoice.guestName}</span>
                            </div>
                            <div style={styles.paidRow}>
                                <span style={styles.paidLabel}>Room</span>
                                <span style={styles.paidValue}>
                                    {invoice.roomNumber} — {invoice.roomType}
                                </span>
                            </div>
                            <div style={styles.paidRow}>
                                <span style={styles.paidLabel}>Days</span>
                                <span style={styles.paidValue}>{invoice.days} nights</span>
                            </div>
                        </div>

                        {/* Accountant notice */}
                        {user?.role === "Accountant" && invoice.paymentStatus === "Pending" && (
                            <div style={styles.accountantNotice}>
                                View Only — Contact Manager or Receptionist to collect payment
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Collect Payment Modal */}
            {paymentModal && (
                <div style={styles.overlay}>
                    <div style={styles.modal}>
                        <h3 style={styles.modalTitle}>Collect Payment</h3>

                        <div style={styles.modalInfo}>
                            <div style={styles.modalRow}>
                                <span style={styles.modalLabel}>Guest</span>
                                <span style={styles.modalValue}>{invoice.guestName}</span>
                            </div>
                            <div style={styles.modalRow}>
                                <span style={styles.modalLabel}>Room</span>
                                <span style={styles.modalValue}>{invoice.roomNumber}</span>
                            </div>
                            <div style={styles.modalRow}>
                                <span style={styles.modalLabel}>Amount</span>
                                <span style={styles.modalAmount}>
                                    Rs. {invoice.totalAmount?.toLocaleString()}
                                </span>
                            </div>
                        </div>

                        {/* Method Selection */}
                        <div style={styles.methodLabel}>Payment Method</div>
                        <div style={styles.methodCards}>
                            {["Cash", "Khalti", "eSewa"].map((method) => (
                                <div
                                    key={method}
                                    onClick={() => setPaymentForm({ method, transactionId: "" })}
                                    style={{
                                        ...styles.methodCard,
                                        border: paymentForm.method === method
                                            ? "2px solid #4361ee"
                                            : "2px solid #e0e0e0",
                                        backgroundColor: paymentForm.method === method
                                            ? "#f0f4ff"
                                            : "white",
                                    }}
                                >
                                    <div style={styles.methodIcon}>{getMethodIcon(method)}</div>
                                    <div style={styles.methodName}>{method}</div>
                                </div>
                            ))}
                        </div>

                        {/* Transaction ID */}
                        {paymentForm.method !== "Cash" && (
                            <div style={styles.transField}>
                                <label style={styles.transLabel}>Transaction ID *</label>
                                <input
                                    value={paymentForm.transactionId}
                                    onChange={(e) => setPaymentForm({
                                        ...paymentForm,
                                        transactionId: e.target.value,
                                    })}
                                    style={styles.transInput}
                                    placeholder={`Enter ${paymentForm.method} transaction ID`}
                                />
                            </div>
                        )}

                        {paymentForm.method === "Cash" && (
                            <div style={styles.cashNote}>
                                Cash payment — no transaction ID required
                            </div>
                        )}

                        <div style={styles.modalButtons}>
                            <button
                                onClick={() => setPaymentModal(false)}
                                style={styles.cancelBtn}
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleCollectPayment}
                                style={styles.confirmBtn}
                                disabled={paymentLoading}
                            >
                                {paymentLoading ? "Processing..." : "Confirm Payment"}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

const styles = {
    container: { padding: "24px", backgroundColor: "#f0f2f5", minHeight: "calc(100vh - 60px)" },
    actions: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" },
    actionRight: { display: "flex", alignItems: "center", gap: "12px" },
    backBtn: { backgroundColor: "#f0f0f0", color: "#333", border: "none", padding: "10px 20px", borderRadius: "6px", cursor: "pointer", fontSize: "14px" },
    paymentBadge: { padding: "6px 16px", borderRadius: "20px", fontSize: "13px", fontWeight: "500" },
    printBtn: { backgroundColor: "#1a1a2e", color: "white", border: "none", padding: "10px 20px", borderRadius: "6px", cursor: "pointer", fontSize: "14px" },
    layout: { display: "flex", gap: "24px", alignItems: "flex-start" },
    invoiceWrapper: { flex: "0 0 480px" },
    invoice: { backgroundColor: "white", padding: "40px", borderRadius: "12px", boxShadow: "0 2px 10px rgba(0,0,0,0.08)" },
    invoiceHeader: { textAlign: "center", marginBottom: "20px" },
    hotelName: { fontSize: "20px", color: "#1a1a2e", marginBottom: "6px" },
    hotelDetail: { fontSize: "13px", color: "#666", marginBottom: "2px" },
    invoiceMeta: { display: "flex", justifyContent: "space-between", marginBottom: "8px" },
    invoiceLabel: { fontSize: "11px", color: "#999", letterSpacing: "2px", marginBottom: "4px" },
    invoiceNumber: { fontSize: "15px", fontWeight: "bold", color: "#1a1a2e" },
    divider: { borderTop: "1px dashed #ccc", margin: "16px 0" },
    row: { display: "flex", justifyContent: "space-between", marginBottom: "10px" },
    rowLabel: { color: "#666", fontSize: "14px" },
    rowValue: { color: "#1a1a2e", fontWeight: "500", fontSize: "14px" },
    totalRow: { marginTop: "8px" },
    totalLabel: { fontSize: "18px", fontWeight: "bold", color: "#1a1a2e" },
    totalValue: { fontSize: "18px", fontWeight: "bold", color: "#2a9d8f" },
    footer: { textAlign: "center", color: "#666", marginTop: "20px", fontSize: "13px", fontStyle: "italic", lineHeight: "1.6" },
    rightPanel: { flex: 1, display: "flex", flexDirection: "column", gap: "16px" },
    paymentStatusCard: { padding: "24px", borderRadius: "12px", textAlign: "center" },
    paymentStatusIcon: { fontSize: "40px", marginBottom: "8px" },
    paymentStatusText: { fontSize: "14px", fontWeight: "bold", color: "#333", marginBottom: "4px" },
    paymentStatusAmount: { fontSize: "24px", fontWeight: "bold", color: "#1a1a2e" },
    collectBtn: { width: "100%", padding: "14px", backgroundColor: "#1a1a2e", color: "white", border: "none", borderRadius: "8px", cursor: "pointer", fontSize: "15px", fontWeight: "500" },
    paidDetails: { backgroundColor: "white", padding: "20px", borderRadius: "12px", boxShadow: "0 2px 10px rgba(0,0,0,0.06)" },
    paidDetailsTitle: { fontSize: "14px", color: "#1a1a2e", marginBottom: "14px", fontWeight: "bold" },
    paidRow: { display: "flex", justifyContent: "space-between", marginBottom: "8px" },
    paidLabel: { fontSize: "13px", color: "#666" },
    paidValue: { fontSize: "13px", color: "#1a1a2e", fontWeight: "500" },
    summaryCard: { backgroundColor: "white", padding: "20px", borderRadius: "12px", boxShadow: "0 2px 10px rgba(0,0,0,0.06)" },
    summaryTitle: { fontSize: "14px", color: "#1a1a2e", marginBottom: "14px", fontWeight: "bold" },
    accountantNotice: { backgroundColor: "#fff3cd", borderLeft: "4px solid #e9c46a", padding: "12px 16px", borderRadius: "6px", fontSize: "13px", color: "#856404" },
    generateBtn: { backgroundColor: "#2a9d8f", color: "white", border: "none", padding: "12px 28px", borderRadius: "8px", cursor: "pointer", fontSize: "15px" },
    overlay: { position: "fixed", top: 0, left: 0, width: "100vw", height: "100vh", backgroundColor: "rgba(0,0,0,0.5)", display: "flex", justifyContent: "center", alignItems: "center", zIndex: 1000 },
    modal: { backgroundColor: "white", padding: "32px", borderRadius: "12px", boxShadow: "0 4px 20px rgba(0,0,0,0.15)", width: "100%", maxWidth: "420px" },
    modalTitle: { fontSize: "20px", color: "#1a1a2e", marginBottom: "20px" },
    modalInfo: { backgroundColor: "#f8f9ff", borderRadius: "8px", padding: "16px", marginBottom: "20px" },
    modalRow: { display: "flex", justifyContent: "space-between", marginBottom: "8px" },
    modalLabel: { fontSize: "13px", color: "#666" },
    modalValue: { fontSize: "13px", color: "#1a1a2e", fontWeight: "500" },
    modalAmount: { fontSize: "20px", fontWeight: "bold", color: "#1a1a2e" },
    methodLabel: { fontSize: "14px", fontWeight: "bold", color: "#333", marginBottom: "10px" },
    methodCards: { display: "flex", gap: "10px", marginBottom: "16px" },
    methodCard: { flex: 1, padding: "12px", borderRadius: "8px", textAlign: "center", cursor: "pointer", transition: "all 0.2s" },
    methodIcon: { fontSize: "24px", marginBottom: "4px" },
    methodName: { fontSize: "12px", fontWeight: "bold", color: "#333" },
    transField: { marginBottom: "16px" },
    transLabel: { display: "block", marginBottom: "6px", fontSize: "13px", fontWeight: "bold", color: "#333" },
    transInput: { width: "100%", padding: "10px", borderRadius: "6px", border: "1px solid #ccc", fontSize: "14px", boxSizing: "border-box" },
    cashNote: { backgroundColor: "#d4edda", color: "#155724", padding: "10px", borderRadius: "6px", fontSize: "13px", marginBottom: "16px" },
    modalButtons: { display: "flex", gap: "12px", marginTop: "20px" },
    cancelBtn: { flex: 1, padding: "10px", backgroundColor: "#f0f0f0", color: "#333", border: "none", borderRadius: "6px", cursor: "pointer", fontSize: "15px" },
    confirmBtn: { flex: 1, padding: "10px", backgroundColor: "#2a9d8f", color: "white", border: "none", borderRadius: "6px", cursor: "pointer", fontSize: "15px" },
    center: { display: "flex", justifyContent: "center", alignItems: "center", height: "80vh", fontSize: "18px", flexDirection: "column" },
};

export default InvoiceDetail;