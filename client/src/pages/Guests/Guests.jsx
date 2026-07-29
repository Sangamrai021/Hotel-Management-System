import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useQueryClient } from "@tanstack/react-query";
import { useGuests, guestsKeys } from "../../hooks/useGuests";
import API from "../../api/axios";

const LoadingSkeleton = () => (
  <div className="page-container">
    <div className="page-header"><div style={{ height: "24px", width: "140px" }} className="dash-skel" /></div>
    <div className="page-toolbar">
      <div className="dash-skel" style={{ width: "300px", height: "36px", borderRadius: "6px" }} />
      <div className="dash-skel" style={{ width: "120px", height: "36px", borderRadius: "6px" }} />
    </div>
    <div className="page-skel-table">
      {[1, 2, 3, 4].map((i) => (
        <div key={i} className="page-skel-row">
          <div className="page-skel-cell" style={{ width: "22%" }} />
          <div className="page-skel-cell" style={{ width: "25%" }} />
          <div className="page-skel-cell" style={{ width: "18%" }} />
          <div className="page-skel-cell" style={{ width: "15%" }} />
          <div className="page-skel-cell" style={{ width: "15%" }} />
        </div>
      ))}
    </div>
  </div>
);

const Guests = () => {
    const [search, setSearch] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const navigate = useNavigate();
    const queryClient = useQueryClient();
    const { data, isLoading } = useGuests(currentPage, search);

    const guests = data?.guests || [];
    const totalPages = data?.totalPages || 1;

    const handleDelete = async (id) => {
        if (!window.confirm("Are you sure you want to delete this guest?")) return;
        try {
            await API.delete(`/guests/${id}`);
            queryClient.invalidateQueries({ queryKey: guestsKeys.all });
        } catch (err) {
            alert(err.response?.data?.message || "Failed to delete guest");
        }
    };

    if (isLoading) return <LoadingSkeleton />;

    return (
        <div className="page-container">
            <div className="page-header">
                <div>
                    <div className="page-header-title">Guests</div>
                    <div className="page-header-sub">View and manage guest profiles</div>
                </div>
                <button onClick={() => navigate("/guests/add")} className="btn btn-primary btn-lg">
                    + Add Guest
                </button>
            </div>

            <div className="page-toolbar">
                <div className="page-toolbar-left">
                    <input
                        type="text"
                        placeholder="Search by name, email or phone..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="input"
                        style={{ minWidth: "280px" }}
                    />
                </div>
            </div>

            {guests.length === 0 ? (
                <div className="page-empty">
                    <div className="page-empty-icon">
                        <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#aaa" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" />
                            <circle cx="9" cy="7" r="4" />
                            <path d="M23 21v-2a4 4 0 00-3-3.87" />
                            <path d="M16 3.13a4 4 0 010 7.75" />
                        </svg>
                    </div>
                    <div className="page-empty-text">No guests found</div>
                    <div className="page-empty-hint">Try adjusting your search</div>
                </div>
            ) : (
                <>
                    <div className="page-table-wrap">
                        <table className="page-table table-hover">
                            <thead>
                                <tr>
                                    <th>Name</th>
                                    <th>Email</th>
                                    <th>Phone</th>
                                    <th>ID Proof</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {guests.map((guest) => (
                                    <tr key={guest._id}>
                                        <td>{guest.name}</td>
                                        <td>{guest.email}</td>
                                        <td>{guest.phone}</td>
                                        <td>{guest.idProof}</td>
                                        <td>
                                            <button onClick={() => navigate(`/guests/edit/${guest._id}`)} className="btn-icon" title="Edit">
                                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
                                            </button>
                                            <button onClick={() => handleDelete(guest._id)} className="btn-icon btn-icon-danger" title="Delete" style={{ marginLeft: "6px" }}>
                                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2"/><line x1="10" y1="11" x2="10" y2="17"/><line x1="14" y1="11" x2="14" y2="17"/></svg>
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    <div className="page-pagination">
                        <span className="page-page-info">Showing page {currentPage} of {totalPages}</span>
                        <div className="page-pg-ctrls">
                            <button
                                                    onClick={() => setCurrentPage(currentPage - 1)}
                                disabled={currentPage === 1}
                                className="btn btn-primary"
                            >
                                ← Previous
                            </button>
                            <button
                                                    onClick={() => setCurrentPage(currentPage + 1)}
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

export default Guests;
