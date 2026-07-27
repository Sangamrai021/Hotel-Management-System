import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import API from "../../api/axios";

const getStatusColor = (status) => {
    switch (status) {
        case "Booked": return { bg: "#d4edda", color: "#155724" };
        case "CheckedIn": return { bg: "#cce5ff", color: "#004085" };
        case "CheckedOut": return { bg: "#e2e3e5", color: "#383d41" };
        case "Cancelled": return { bg: "#f8d7da", color: "#721c24" };
        default: return { bg: "#e2e3e5", color: "#383d41" };
    }
};

const LoadingSkeleton = () => (
  <div className="page-container">
    <div className="page-header"><div style={{ height: "24px", width: "160px" }} className="dash-skel" /></div>
    <div className="page-toolbar">
      <div className="dash-skel" style={{ width: "180px", height: "36px", borderRadius: "6px" }} />
      <div className="dash-skel" style={{ width: "120px", height: "36px", borderRadius: "6px" }} />
    </div>
    <div className="page-skel-table">
      {[1, 2, 3, 4, 5].map((i) => (
        <div key={i} className="page-skel-row">
          <div className="page-skel-cell" style={{ width: "14%" }} />
          <div className="page-skel-cell" style={{ width: "10%" }} />
          <div className="page-skel-cell" style={{ width: "12%" }} />
          <div className="page-skel-cell" style={{ width: "12%" }} />
          <div className="page-skel-cell" style={{ width: "6%" }} />
          <div className="page-skel-cell" style={{ width: "14%" }} />
          <div className="page-skel-cell" style={{ width: "10%" }} />
          <div className="page-skel-cell" style={{ width: "18%" }} />
        </div>
      ))}
    </div>
  </div>
);

const Bookings = () => {
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [status, setStatus] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const navigate = useNavigate();

    const fetchBookings = async (page = 1) => {
        try {
            const res = await API.get("/bookings", { params: { status, page, limit: 10 } });
            setBookings(res.data.bookings);
            setTotalPages(res.data.totalPages);
            setCurrentPage(res.data.currentPage);
        } catch (error) {
            console.log(error);
            console.error("Failed to fetch bookings");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        const loadBookings = async () => {
            try {
                const res = await API.get("/bookings", { params: { status, page: 1, limit: 10 } });
                setBookings(res.data.bookings);
                setTotalPages(res.data.totalPages);
                setCurrentPage(res.data.currentPage || 1);
            } catch (error) {
                console.log(error);
                console.error("Failed to fetch bookings");
            } finally {
                setLoading(false);
            }
        };
        loadBookings();
    }, [status]);

    const handleStatusUpdate = async (id, newStatus) => {
        try {
            await API.patch(`/bookings/${id}/status`, { status: newStatus });
            fetchBookings(currentPage);
        } catch (err) {
            alert(err.response?.data?.message || "Failed to update status");
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Delete this booking?")) return;
        try {
            await API.delete(`/bookings/${id}`);
            fetchBookings(currentPage);
        } catch (err) {
            alert(err.response?.data?.message || "Failed to delete booking");
        }
    };

    const handleInvoice = (bookingId) => {
        navigate(`/invoices/${bookingId}`);
    };

    if (loading) return <LoadingSkeleton />;

    return (
        <div className="page-container">
            <div className="page-header">
                <div>
                    <div className="page-header-title">Bookings</div>
                    <div className="page-header-sub">Manage reservations and check-ins</div>
                </div>
                <button onClick={() => navigate("/bookings/add")} className="btn btn-primary btn-lg">
                    + Add Booking
                </button>
            </div>

            <div className="page-toolbar">
                <div className="page-toolbar-left">
                    <select value={status} onChange={(e) => setStatus(e.target.value)} className="select" style={{ minWidth: "160px" }}>
                        <option value="">All Status</option>
                        <option value="Booked">Booked</option>
                        <option value="CheckedIn">Checked In</option>
                        <option value="CheckedOut">Checked Out</option>
                        <option value="Cancelled">Cancelled</option>
                    </select>
                </div>
            </div>

            {bookings.length === 0 ? (
                <div className="page-empty">
                    <div className="page-empty-icon">
                        <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#aaa" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                            <rect x="3" y="4" width="18" height="18" rx="2" />
                            <line x1="16" y1="2" x2="16" y2="6" />
                            <line x1="8" y1="2" x2="8" y2="6" />
                            <line x1="3" y1="10" x2="21" y2="10" />
                        </svg>
                    </div>
                    <div className="page-empty-text">No bookings found</div>
                    <div className="page-empty-hint">Create a new booking to get started</div>
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
                                    <th>Total</th>
                                    <th>Status</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {bookings.map((booking) => {
                                    const sc = getStatusColor(booking.status);
                                    return (
                                        <tr key={booking._id}>
                                            <td>{booking.guest?.name}</td>
                                            <td>{booking.room?.roomNumber}</td>
                                            <td>{new Date(booking.checkIn).toLocaleDateString()}</td>
                                            <td>{new Date(booking.checkOut).toLocaleDateString()}</td>
                                            <td>{booking.days}</td>
                                            <td>Rs. {booking.totalAmount?.toLocaleString()}</td>
                                            <td>
                                                <span className="badge" style={{ backgroundColor: sc.bg, color: sc.color }}>
                                                    {booking.status}
                                                </span>
                                            </td>
                                            <td>
                                                {booking.status === "Booked" && (
                                                    <>
                                                        <button onClick={() => handleStatusUpdate(booking._id, "CheckedIn")} className="btn-icon" title="Check In">
                                                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M15 3h4a2 2 0 012 2v14a2 2 0 01-2 2h-4"/><polyline points="10 17 15 12 10 7"/><line x1="15" y1="12" x2="3" y2="12"/></svg>
                                                        </button>
                                                        <button onClick={() => handleStatusUpdate(booking._id, "Cancelled")} className="btn-icon btn-icon-danger" title="Cancel" style={{ marginLeft: "4px" }}>
                                                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg>
                                                        </button>
                                                    </>
                                                )}
                                                {booking.status === "CheckedIn" && (
                                                    <button onClick={() => handleStatusUpdate(booking._id, "CheckedOut")} className="btn-icon" title="Check Out" style={{ marginLeft: "4px" }}>
                                                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>
                                                    </button>
                                                )}
                                                <button onClick={() => handleInvoice(booking._id)} className="btn-icon" title="Invoice" style={{ marginLeft: "4px" }}>
                                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg>
                                                </button>
                                                <button onClick={() => handleDelete(booking._id)} className="btn-icon btn-icon-danger" title="Delete" style={{ marginLeft: "4px" }}>
                                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2"/><line x1="10" y1="11" x2="10" y2="17"/><line x1="14" y1="11" x2="14" y2="17"/></svg>
                                                </button>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>

                    <div className="page-pagination">
                        <span className="page-page-info">Showing page {currentPage} of {totalPages}</span>
                        <div className="page-pg-ctrls">
                            <button
                                onClick={() => fetchBookings(currentPage - 1)}
                                disabled={currentPage === 1}
                                className="btn btn-primary"
                            >
                                ← Previous
                            </button>
                            <button
                                onClick={() => fetchBookings(currentPage + 1)}
                                disabled={currentPage === totalPages}
                                className="btn btn-primary"
                            >
                                Next →
                            </button>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
};

export default Bookings;
