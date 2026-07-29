import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useInvoices } from "../../hooks/useInvoices";

const LoadingSkeleton = () => (
  <div className="page-container">
    <div className="page-header"><div style={{ height: "24px", width: "140px" }} className="dash-skel" /></div>
    <div className="page-skel-table" style={{ marginTop: "20px" }}>
      {[1, 2, 3, 4].map((i) => (
        <div key={i} className="page-skel-row">
          <div className="page-skel-cell" style={{ width: "16%" }} />
          <div className="page-skel-cell" style={{ width: "12%" }} />
          <div className="page-skel-cell" style={{ width: "12%" }} />
          <div className="page-skel-cell" style={{ width: "12%" }} />
          <div className="page-skel-cell" style={{ width: "6%" }} />
          <div className="page-skel-cell" style={{ width: "14%" }} />
          <div className="page-skel-cell" style={{ width: "14%" }} />
          <div className="page-skel-cell" style={{ width: "10%" }} />
        </div>
      ))}
    </div>
  </div>
);

const Invoices = () => {
    const [currentPage, setCurrentPage] = useState(1);
    const [search, setSearch] = useState("");
    const navigate = useNavigate();
    const { data, isLoading } = useInvoices(currentPage, search);

    const invoices = data?.invoices || [];
    const totalPages = data?.totalPages || 1;

    if (isLoading) return <LoadingSkeleton />;

    return (
        <div className="page-container">
            <div className="page-header">
                <div>
                    <div className="page-header-title">Invoices</div>
                    <div className="page-header-sub">View all generated invoices</div>
                </div>
            </div>

            <div className="page-toolbar">
                <div className="page-toolbar-left">
                    <input
                        type="text"
                        placeholder="Search by guest name or room..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="input"
                        style={{ minWidth: "240px" }}
                    />
                </div>
            </div>

            {invoices.length === 0 ? (
                <div className="page-empty">
                    <div className="page-empty-icon">
                        <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#aaa" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" />
                            <polyline points="14 2 14 8 20 8" />
                            <line x1="16" y1="13" x2="8" y2="13" />
                            <line x1="16" y1="17" x2="8" y2="17" />
                            <polyline points="10 9 9 9 8 9" />
                        </svg>
                    </div>
                    <div className="page-empty-text">No invoices found</div>
                    <div className="page-empty-hint">Generate one from the Bookings page</div>
                </div>
            ) : (
                <>
                    <div className="page-table-wrap">
                        <table className="page-table table-hover">
                            <thead>
                                <tr>
                                    <th>Guest</th>
                                    <th>Room</th>
                                    <th>Check In</th>
                                    <th>Check Out</th>
                                    <th>Days</th>
                                    <th>Total Amount</th>
                                    <th>Invoice Date</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {invoices.map((invoice) => (
                                    <tr key={invoice._id}>
                                        <td>{invoice.guestName}</td>
                                        <td>{invoice.roomNumber}</td>
                                        <td>{new Date(invoice.checkIn).toLocaleDateString()}</td>
                                        <td>{new Date(invoice.checkOut).toLocaleDateString()}</td>
                                        <td>{invoice.days}</td>
                                        <td>Rs. {invoice.totalAmount?.toLocaleString()}</td>
                                        <td>{new Date(invoice.invoiceDate).toLocaleDateString()}</td>
                                        <td>
                                            <button onClick={() => navigate(`/invoices/${invoice.booking}`)} className="btn-icon" title="View">
                                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {totalPages > 1 && (
                        <div className="page-pagination">
                            <span className="page-page-info">Showing page {currentPage} of {totalPages}</span>
                            <div className="page-pg-ctrls">
                                <button onClick={() => setCurrentPage(currentPage - 1)} disabled={currentPage === 1} className="btn btn-primary">← Previous</button>
                                <button onClick={() => setCurrentPage(currentPage + 1)} disabled={currentPage === totalPages} className="btn btn-primary">Next →</button>
                            </div>
                        </div>
                    )}
                </>
            )}
        </div>
    );
};

export default Invoices;
