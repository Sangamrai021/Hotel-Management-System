import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import API from "../../api/axios";

const Payments = () => {
    const [invoices, setInvoices] = useState([]);
    const [payments, setPayments] = useState([]);
    const [summary, setSummary] = useState(null);
    const [activeTab, setActiveTab] = useState("pending");
    const [loading, setLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [paymentModal, setPaymentModal] = useState({ show: false, invoice: null });
    const [paymentForm, setPaymentForm] = useState({ method: "Cash", transactionId: "" });
    const [paymentLoading, setPaymentLoading] = useState(false);
    const [paymentSuccess, setPaymentSuccess] = useState(null);
    const { user } = useAuth();
    const navigate = useNavigate();

    const fetchData = async (page = 1) => {
        try {
            setLoading(true);
            const [invoicesRes, paymentsRes, summaryRes] = await Promise.all([
                API.get("/invoices", {
                    params: {
                        paymentStatus: activeTab === "pending" ? "Pending" : activeTab === "collected" ? "Paid" : undefined,
                        page,
                        limit: 10,
                    },
                }),
                API.get("/payments", { params: { page, limit: 10 } }),
                API.get("/payments/summary"),
            ]);
            setInvoices(invoicesRes.data.invoices);
            setTotalPages(invoicesRes.data.totalPages);
            setCurrentPage(invoicesRes.data.currentPage);
            setPayments(paymentsRes.data.payments);
            setSummary(summaryRes.data);
        } catch (err) {
            console.error("Failed to fetch payment data");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData(1);
    }, [activeTab]);

    const handleCollectPayment = async () => {
        if (paymentForm.method !== "Cash" && !paymentForm.transactionId)
            return alert("Transaction ID is required for digital payments");

        setPaymentLoading(true);
        try {
            const res = await API.post("/payments/collect", {
                invoiceId: paymentModal.invoice._id,
                method: paymentForm.method,
                transactionId: paymentForm.transactionId || null,
            });
            setPaymentSuccess(res.data);
            fetchData(currentPage);
        } catch (err) {
            alert(err.response?.data?.message || "Failed to collect payment");
        } finally {
            setPaymentLoading(false);
        }
    };

    const canCollectPayment = ["SuperAdmin", "Manager", "Receptionist"].includes(user?.role);

    const getMethodIcon = (method) => {
        switch (method) {
            case "Cash": return "C";
            case "Khalti": return "K";
            case "eSewa": return "E";
            default: return "•";
        }
    };

    if (loading) return (
        <div className="page-container">
            <div className="page-header"><div style={{ height: "24px", width: "200px" }} className="dash-skel" /></div>
            <div className="dash-kpi-grid">
                {[1, 2, 3, 4].map((i) => <div key={i} className="dash-skel dash-skel-card" />)}
            </div>
            <div className="page-skel-table">
                {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="page-skel-row">
                        <div className="page-skel-cell" style={{ width: "16%" }} />
                        <div className="page-skel-cell" style={{ width: "12%" }} />
                        <div className="page-skel-cell" style={{ width: "12%" }} />
                        <div className="page-skel-cell" style={{ width: "16%" }} />
                        <div className="page-skel-cell" style={{ width: "10%" }} />
                        <div className="page-skel-cell" style={{ width: "14%" }} />
                        <div className="page-skel-cell" style={{ width: "10%" }} />
                        <div className="page-skel-cell" style={{ width: "10%" }} />
                    </div>
                ))}
            </div>
        </div>
    );

    return (
        <div className="page-container">
            {/* Header */}
            <div className="page-header">
                <div>
                    <div className="page-header-title">Payment Collection</div>
                    <div className="page-header-sub">Collect and manage guest payments</div>
                </div>
            </div>

            {/* Summary Cards */}
            {summary && (
                <div style={styles.grid}>
                    <div style={{ ...styles.card, borderTop: "4px solid #6d6875" }}>
                        <div style={styles.cardValue}>
                            Rs. {summary.revenueThisMonth?.toLocaleString() || 0}
                        </div>
                        <div style={styles.cardLabel}>Revenue This Month</div>
                    </div>
                    <div style={{ ...styles.card, borderTop: "4px solid #2a9d8f" }}>
                        <div style={styles.cardValue}>
                            Rs. {summary.revenueToday?.toLocaleString() || 0}
                        </div>
                        <div style={styles.cardLabel}>Collected Today</div>
                    </div>
                    <div style={{ ...styles.card, borderTop: "4px solid #e63946" }}>
                        <div style={styles.cardValue}>{summary.pendingInvoices || 0}</div>
                        <div style={styles.cardLabel}>Pending Payments</div>
                    </div>
                    <div style={{ ...styles.card, borderTop: "4px solid #4361ee" }}>
                        <div style={styles.cardValue}>{summary.todayPaymentCount || 0}</div>
                        <div style={styles.cardLabel}>Collections Today</div>
                    </div>
                </div>
            )}

            {/* Tabs */}
            <div style={styles.tabs}>
                {["pending", "collected", "all"].map((tab) => (
                    <button
                        key={tab}
                        onClick={() => setActiveTab(tab)}
                        style={{
                            ...styles.tab,
                            borderBottom: activeTab === tab ? "3px solid #1a1a2e" : "3px solid transparent",
                            color: activeTab === tab ? "#1a1a2e" : "#666",
                            fontWeight: activeTab === tab ? "bold" : "normal",
                        }}
                    >
                        {tab === "pending" && `Pending (${summary?.pendingInvoices || 0})`}
                        {tab === "collected" && "Collected"}
                        {tab === "all" && "All"}
                    </button>
                ))}
            </div>

            {/* Table */}
            {invoices.length === 0 ? (
                <div className="page-empty">
                    <div className="page-empty-icon">
                        <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#aaa" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M21 12V7H5a2 2 0 010-4h14v4" />
                            <path d="M3 5v14a2 2 0 002 2h16v-5" />
                            <path d="M18 12a2 2 0 000 4h4v-4z" />
                        </svg>
                    </div>
                    <div className="page-empty-text">
                        {activeTab === "pending" ? "No pending payments" : "No payments found"}
                    </div>
                    <div className="page-empty-hint">
                        {activeTab === "pending" ? "All invoices are paid!" : "Payments appear here once collected"}
                    </div>
                </div>
            ) : (
                <>
                    <table className="table-hover" style={styles.table}>
                        <thead>
                            <tr style={styles.thead}>
                                <th style={styles.th}>#</th>
                                <th style={styles.th}>Guest</th>
                                <th style={styles.th}>Room</th>
                                <th style={styles.th}>Invoice</th>
                                <th style={styles.th}>Amount</th>
                                <th style={styles.th}>Method</th>
                                <th style={styles.th}>Status</th>
                                {canCollectPayment && <th style={styles.th}>Action</th>}
                            </tr>
                        </thead>
                        <tbody>
                            {invoices.map((invoice, index) => (
                                <tr key={invoice._id} style={styles.tr}>
                                    <td style={styles.td}>{index + 1}</td>
                                    <td style={styles.td}>
                                        <div style={styles.guestName}>{invoice.guestName}</div>
                                    </td>
                                    <td style={styles.td}>
                                        <div style={styles.roomNumber}>{invoice.roomNumber}</div>
                                        <div style={styles.roomType}>{invoice.roomType}</div>
                                    </td>
                                    <td style={styles.td}>
                                        <div style={styles.invoiceNum}>
                                            INV-{invoice._id.slice(-6).toUpperCase()}
                                        </div>
                                        <div style={styles.invoiceDate}>
                                            {new Date(invoice.invoiceDate).toLocaleDateString()}
                                        </div>
                                    </td>
                                    <td style={styles.td}>
                                        <div style={styles.amount}>
                                            Rs. {invoice.totalAmount?.toLocaleString()}
                                        </div>
                                    </td>
                                    <td style={styles.td}>
                                        {invoice.paymentMethod
                                            ? `${getMethodIcon(invoice.paymentMethod)} ${invoice.paymentMethod}`
                                            : <span style={{ color: "#999" }}>—</span>}
                                    </td>
                                    <td style={styles.td}>
                                        <span style={{
                                            ...styles.badge,
                                            backgroundColor: invoice.paymentStatus === "Paid" ? "#d4edda" : "#fff3cd",
                                            color: invoice.paymentStatus === "Paid" ? "#155724" : "#856404",
                                        }}>
                                            {invoice.paymentStatus === "Paid" ? "Paid" : "Pending"}
                                        </span>
                                    </td>
                                    {canCollectPayment && (
                                        <td style={styles.td}>
                                            {invoice.paymentStatus === "Pending" ? (
                                                <button
                                                    onClick={() => {
                                                        setPaymentModal({ show: true, invoice });
                                                        setPaymentForm({ method: "Cash", transactionId: "" });
                                                        setPaymentSuccess(null);
                                                    }}
                                                                                    className="btn btn-primary btn-sm"
                    style={styles.collectBtn}
                                                >
                                                    Collect
                                                </button>
                                            ) : (
                                                <button
                                                    onClick={() => navigate(`/invoices/${invoice.booking}`)}
                                                    className="btn btn-edit btn-sm"
                                                    style={styles.viewBtn}
                                                >
                                                    View
                                                </button>
                                            )}
                                        </td>
                                    )}
                                </tr>
                            ))}
                        </tbody>
                    </table>

                    {/* Pagination */}
                    <div                     style={styles.pagination}>
                        <button
                            onClick={() => fetchData(currentPage - 1)}
                            disabled={currentPage === 1}
                            className="btn btn-primary"
                            style={styles.pageBtn}
                        >
                            ← Previous
                        </button>
                        <span style={styles.pageInfo}>
                            Page {currentPage} of {totalPages}
                        </span>
                        <button
                            onClick={() => fetchData(currentPage + 1)}
                            disabled={currentPage === totalPages}
                            className="btn btn-primary"
                            style={styles.pageBtn}
                        >
                            Next →
                        </button>
                    </div>
                </>
            )}

            {/* Payment Method Breakdown */}
            {summary?.methodBreakdown?.length > 0 && (
                <div style={styles.breakdown}>
                    <h3 style={styles.breakdownTitle}>Payment Methods — This Month</h3>
                    <div style={styles.breakdownGrid}>
                        {summary.methodBreakdown.map((item) => (
                            <div key={item._id} style={styles.breakdownCard}>
                                <div style={styles.breakdownIcon}>
                                    {getMethodIcon(item._id)}
                                </div>
                                <div style={styles.breakdownMethod}>{item._id}</div>
                                <div style={styles.breakdownAmount}>
                                    Rs. {item.total?.toLocaleString()}
                                </div>
                                <div style={styles.breakdownCount}>{item.count} payments</div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Collect Payment Modal */}
            {paymentModal.show && (
                <div style={styles.overlay}>
                    <div style={styles.modal}>
                        {paymentSuccess ? (
                            // Success State
                            <div style={styles.successContainer}>
                                <div style={styles.successIcon}></div>
                                <h3 style={styles.successTitle}>Payment Successful!</h3>
                                <p style={styles.successAmount}>
                                    Rs. {paymentModal.invoice?.totalAmount?.toLocaleString()} collected
                                </p>
                                <p style={styles.successMethod}>
                                    via {paymentSuccess.payment?.method}
                                </p>
                                {paymentSuccess.payment?.transactionId && (
                                    <p style={styles.successTrans}>
                                        Trans ID: {paymentSuccess.payment.transactionId}
                                    </p>
                                )}
                                <button
                                    onClick={() => {
                                        setPaymentModal({ show: false, invoice: null });
                                        setPaymentSuccess(null);
                                    }}
                                className="btn btn-primary"
                                style={styles.closeBtn}
                            >
                                Close
                            </button>
                            </div>
                        ) : (
                            // Payment Form
                            <>
                                <h3 style={styles.modalTitle}>Collect Payment</h3>

                                <div style={styles.modalInfo}>
                                    <div style={styles.modalInfoRow}>
                                        <span style={styles.modalInfoLabel}>Guest</span>
                                        <span style={styles.modalInfoValue}>
                                            {paymentModal.invoice?.guestName}
                                        </span>
                                    </div>
                                    <div style={styles.modalInfoRow}>
                                        <span style={styles.modalInfoLabel}>Room</span>
                                        <span style={styles.modalInfoValue}>
                                            {paymentModal.invoice?.roomNumber}
                                        </span>
                                    </div>
                                    <div style={styles.modalInfoRow}>
                                        <span style={styles.modalInfoLabel}>Amount</span>
                                        <span style={styles.modalAmount}>
                                            Rs. {paymentModal.invoice?.totalAmount?.toLocaleString()}
                                        </span>
                                    </div>
                                </div>

                                {/* Payment Method Selection */}
                                <div style={styles.methodLabel}>Payment Method</div>
                                <div style={styles.methodCards}>
                                    {["Cash", "Khalti", "eSewa"].map((method) => (
                                        <div
                                            key={method}
                                            onClick={() => setPaymentForm({ ...paymentForm, method, transactionId: "" })}
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

                                {/* Transaction ID for digital payments */}
                                {paymentForm.method !== "Cash" && (
                                    <div style={styles.field}>
                                        <label style={styles.fieldLabel}>
                                            Transaction ID *
                                        </label>
                                        <input
                                            value={paymentForm.transactionId}
                                            onChange={(e) => setPaymentForm({
                                                ...paymentForm,
                                                transactionId: e.target.value,
                                            })}
                                            style={styles.fieldInput}
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
                                        onClick={() => setPaymentModal({ show: false, invoice: null })}
                                className="btn btn-cancel"
                                style={styles.cancelBtn}
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleCollectPayment}
                                className="btn btn-success"
                                style={styles.confirmBtn}
                                disabled={paymentLoading}
                            >
                                {paymentLoading ? "Processing..." : "Confirm Payment"}
                            </button>
                                </div>
                            </>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

const styles = {
    container: { padding: "24px", backgroundColor: "#f0f2f5", minHeight: "calc(100vh - 60px)" },
    header: { display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "20px", backgroundColor: "white", padding: "24px", borderRadius: "12px", boxShadow: "0 2px 10px rgba(0,0,0,0.06)" },
    title: { fontSize: "24px", color: "#1a1a2e", marginBottom: "4px" },
    subtitle: { fontSize: "14px", color: "#666" },
    grid: { display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: "16px", marginBottom: "24px" },
    card: { backgroundColor: "white", padding: "20px", borderRadius: "10px", boxShadow: "0 2px 10px rgba(0,0,0,0.06)" },
    cardValue: { fontSize: "24px", fontWeight: "bold", color: "#1a1a2e", marginBottom: "6px" },
    cardLabel: { fontSize: "13px", color: "#666" },
    tabs: { display: "flex", gap: "0", marginBottom: "20px", backgroundColor: "white", borderRadius: "10px", padding: "0 16px", boxShadow: "0 2px 10px rgba(0,0,0,0.06)", borderBottom: "1px solid #f0f0f0" },
    tab: { padding: "16px 24px", border: "none", backgroundColor: "transparent", cursor: "pointer", fontSize: "14px", transition: "all 0.2s" },
    table: { width: "100%", borderCollapse: "collapse", backgroundColor: "white", borderRadius: "12px", overflow: "hidden", boxShadow: "0 2px 10px rgba(0,0,0,0.06)" },
    thead: { backgroundColor: "#1a1a2e" },
    th: { padding: "14px 16px", textAlign: "left", color: "white", fontWeight: "600", fontSize: "13px" },
    tr: { borderBottom: "1px solid #f0f0f0" },
    td: { padding: "14px 16px", color: "#333", fontSize: "14px" },
    guestName: { fontWeight: "bold", color: "#1a1a2e" },
    roomNumber: { fontWeight: "bold", color: "#1a1a2e" },
    roomType: { fontSize: "12px", color: "#666" },
    invoiceNum: { fontWeight: "bold", color: "#4361ee", fontSize: "13px" },
    invoiceDate: { fontSize: "12px", color: "#666" },
    amount: { fontWeight: "bold", color: "#1a1a2e", fontSize: "15px" },
    badge: { padding: "4px 10px", borderRadius: "20px", fontSize: "12px", fontWeight: "500" },
    collectBtn: { backgroundColor: "#1a1a2e", color: "white", border: "none", padding: "6px 14px", borderRadius: "6px", cursor: "pointer", fontSize: "13px" },
    viewBtn: { backgroundColor: "#4361ee", color: "white", border: "none", padding: "6px 14px", borderRadius: "6px", cursor: "pointer", fontSize: "13px" },
    empty: { textAlign: "center", padding: "60px", color: "#666", backgroundColor: "white", borderRadius: "12px", boxShadow: "0 2px 10px rgba(0,0,0,0.06)" },
    pagination: { display: "flex", justifyContent: "center", alignItems: "center", gap: "20px", marginTop: "24px" },
    pageBtn: { padding: "8px 20px", backgroundColor: "#1a1a2e", color: "white", border: "none", borderRadius: "6px", cursor: "pointer", fontSize: "14px" },
    pageInfo: { fontSize: "14px", color: "#333" },
    breakdown: { marginTop: "24px", backgroundColor: "white", padding: "24px", borderRadius: "12px", boxShadow: "0 2px 10px rgba(0,0,0,0.06)" },
    breakdownTitle: { fontSize: "16px", color: "#1a1a2e", marginBottom: "16px" },
    breakdownGrid: { display: "flex", gap: "16px", flexWrap: "wrap" },
    breakdownCard: { backgroundColor: "#f8f9ff", padding: "16px 24px", borderRadius: "10px", textAlign: "center", minWidth: "140px" },
    breakdownIcon: { fontSize: "28px", marginBottom: "8px" },
    breakdownMethod: { fontWeight: "bold", color: "#1a1a2e", fontSize: "14px" },
    breakdownAmount: { color: "#2a9d8f", fontWeight: "bold", fontSize: "15px", marginTop: "4px" },
    breakdownCount: { color: "#999", fontSize: "12px", marginTop: "2px" },
    overlay: { position: "fixed", top: 0, left: 0, width: "100vw", height: "100vh", backgroundColor: "rgba(0,0,0,0.5)", display: "flex", justifyContent: "center", alignItems: "center", zIndex: 1000 },
    modal: { backgroundColor: "white", padding: "32px", borderRadius: "12px", boxShadow: "0 4px 20px rgba(0,0,0,0.15)", width: "100%", maxWidth: "440px" },
    modalTitle: { fontSize: "20px", color: "#1a1a2e", marginBottom: "20px" },
    modalInfo: { backgroundColor: "#f8f9ff", borderRadius: "8px", padding: "16px", marginBottom: "20px" },
    modalInfoRow: { display: "flex", justifyContent: "space-between", marginBottom: "8px" },
    modalInfoLabel: { fontSize: "13px", color: "#666" },
    modalInfoValue: { fontSize: "13px", color: "#1a1a2e", fontWeight: "500" },
    modalAmount: { fontSize: "18px", fontWeight: "bold", color: "#1a1a2e" },
    methodLabel: { fontSize: "14px", fontWeight: "bold", color: "#333", marginBottom: "10px" },
    methodCards: { display: "flex", gap: "10px", marginBottom: "16px" },
    methodCard: { flex: 1, padding: "12px", borderRadius: "8px", textAlign: "center", cursor: "pointer", transition: "all 0.2s" },
    methodIcon: { fontSize: "24px", marginBottom: "4px" },
    methodName: { fontSize: "12px", fontWeight: "bold", color: "#333" },
    field: { marginBottom: "16px" },
    fieldLabel: { display: "block", marginBottom: "6px", fontSize: "13px", fontWeight: "bold", color: "#333" },
    fieldInput: { width: "100%", padding: "10px", borderRadius: "6px", border: "1px solid #ccc", fontSize: "14px", boxSizing: "border-box" },
    cashNote: { backgroundColor: "#d4edda", color: "#155724", padding: "10px", borderRadius: "6px", fontSize: "13px", marginBottom: "16px" },
    modalButtons: { display: "flex", gap: "12px", marginTop: "20px" },
    cancelBtn: { flex: 1, padding: "10px", backgroundColor: "#f0f0f0", color: "#333", border: "none", borderRadius: "6px", cursor: "pointer", fontSize: "15px" },
    confirmBtn: { flex: 1, padding: "10px", backgroundColor: "#2a9d8f", color: "white", border: "none", borderRadius: "6px", cursor: "pointer", fontSize: "15px" },
    successContainer: { textAlign: "center", padding: "20px 0" },
    successIcon: { fontSize: "64px", marginBottom: "16px" },
    successTitle: { fontSize: "22px", color: "#1a1a2e", marginBottom: "8px" },
    successAmount: { fontSize: "24px", fontWeight: "bold", color: "#2a9d8f", marginBottom: "4px" },
    successMethod: { fontSize: "14px", color: "#666", marginBottom: "4px" },
    successTrans: { fontSize: "13px", color: "#999", marginBottom: "24px" },
    closeBtn: { backgroundColor: "#1a1a2e", color: "white", border: "none", padding: "12px 32px", borderRadius: "8px", cursor: "pointer", fontSize: "15px" },
    center: { display: "flex", justifyContent: "center", alignItems: "center", height: "80vh", fontSize: "18px" },
};

export default Payments;