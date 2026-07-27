import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import API from "../../api/axios";

const LoadingSkeleton = () => (
  <div className="page-container">
    <div className="page-header"><div style={{ height: "24px", width: "160px" }} className="dash-skel" /></div>
    <div className="page-toolbar">
      <div className="dash-skel" style={{ width: "220px", height: "36px", borderRadius: "6px" }} />
      <div className="dash-skel" style={{ width: "120px", height: "36px", borderRadius: "6px" }} />
    </div>
    <div className="page-skel-table">
      {[1, 2, 3, 4, 5].map((i) => (
        <div key={i} className="page-skel-row">
          <div className="page-skel-cell" style={{ width: "15%" }} />
          <div className="page-skel-cell" style={{ width: "15%" }} />
          <div className="page-skel-cell" style={{ width: "20%" }} />
          <div className="page-skel-cell" style={{ width: "15%" }} />
          <div className="page-skel-cell" style={{ width: "25%" }} />
        </div>
      ))}
    </div>
  </div>
);

const Rooms = () => {
    const [rooms, setRooms] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");
    const [roomType, setRoomType] = useState("");
    const [status, setStatus] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const navigate = useNavigate();

    const fetchRooms = async (page = 1) => {
        try {
            const res = await API.get("/rooms", {
                params: { search, roomType, status, page, limit: 10 },
            });
            setRooms(res.data.rooms);
            setTotalPages(res.data.totalPages);
            setCurrentPage(res.data.currentPage);
        } catch (error) {
            console.log(error);
            console.error("Failed to fetch rooms");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        const loadRooms = async () => {
            try {
                const res = await API.get("/rooms", {
                    params: { search, roomType, status, page: 1, limit: 10 },
                });
                setRooms(res.data.rooms);
                setTotalPages(res.data.totalPages);
                setCurrentPage(res.data.currentPage || 1);
            } catch (error) {
                console.log(error);
                console.error("Failed to fetch rooms");
            } finally {
                setLoading(false);
            }
        };

        loadRooms();
    }, [search, roomType, status]);

    const handleDelete = async (id) => {
        if (!window.confirm("Are you sure you want to delete this room?")) return;
        try {
            await API.delete(`/rooms/${id}`);
            fetchRooms(currentPage);
        } catch (err) {
            alert(err.response?.data?.message || "Failed to delete room");
        }
    };

    if (loading) return <LoadingSkeleton />;

    return (
        <div className="page-container">
            <div className="page-header">
                <div>
                    <div className="page-header-title">Rooms</div>
                    <div className="page-header-sub">Manage all room inventory</div>
                </div>
                <button onClick={() => navigate("/rooms/add")} className="btn btn-primary btn-lg">
                    + Add Room
                </button>
            </div>

            <div className="page-toolbar">
                <div className="page-toolbar-left">
                    <input
                        type="text"
                        placeholder="Search by room number..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="input"
                        style={{ minWidth: "200px" }}
                    />
                    <select value={roomType} onChange={(e) => setRoomType(e.target.value)} className="select" style={{ minWidth: "130px" }}>
                        <option value="">All Types</option>
                        <option value="Standard">Standard</option>
                        <option value="Deluxe">Deluxe</option>
                        <option value="Suite">Suite</option>
                    </select>
                    <select value={status} onChange={(e) => setStatus(e.target.value)} className="select" style={{ minWidth: "130px" }}>
                        <option value="">All Status</option>
                        <option value="Available">Available</option>
                        <option value="Occupied">Occupied</option>
                    </select>
                </div>
            </div>

            {rooms.length === 0 ? (
                <div className="page-empty">
                    <div className="page-empty-icon">
                        <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#aaa" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                            <rect x="4" y="2" width="16" height="20" rx="1" />
                            <path d="M9 2v4h6V2M9 10h2v2H9zm4 0h2v2h-2zM9 14h2v2H9zm4 0h2v2h-2z" />
                        </svg>
                    </div>
                    <div className="page-empty-text">No rooms found</div>
                    <div className="page-empty-hint">Try adjusting your search or filters</div>
                </div>
            ) : (
                <>
                    <div className="page-table-wrap">
                        <table className="page-table table-hover">
                            <thead>
                                <tr>
                                    <th>Room No</th>
                                    <th>Type</th>
                                    <th>Price/Night</th>
                                    <th>Status</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {rooms.map((room) => (
                                    <tr key={room._id}>
                                        <td>{room.roomNumber}</td>
                                        <td>{room.roomType}</td>
                                        <td>Rs. {room.pricePerNight.toLocaleString()}</td>
                                        <td>
                                            <span className="badge" style={{
                                                backgroundColor: room.status === "Available" ? "#d4edda" : "#f8d7da",
                                                color: room.status === "Available" ? "#155724" : "#721c24",
                                            }}>
                                                {room.status}
                                            </span>
                                        </td>
                                        <td>
                                            <button onClick={() => navigate(`/rooms/edit/${room._id}`)} className="btn-icon" title="Edit">
                                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
                                            </button>
                                            <button onClick={() => handleDelete(room._id)} className="btn-icon btn-icon-danger" title="Delete" style={{ marginLeft: "6px" }}>
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
                                onClick={() => fetchRooms(currentPage - 1)}
                                disabled={currentPage === 1}
                                className="btn btn-primary"
                            >
                                ← Previous
                            </button>
                            <button
                                onClick={() => fetchRooms(currentPage + 1)}
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

export default Rooms;
