import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useQueryClient } from "@tanstack/react-query";
import { useUsers, usersKeys } from "../../hooks/useUsers";
import API from "../../api/axios";

const getRoleBadgeStyle = (role) => {
    const colors = {
        SuperAdmin: { bg: "#f3e8ff", color: "#6d6875" },
        Manager: { bg: "#e8f0fe", color: "#4361ee" },
        Receptionist: { bg: "#d4edda", color: "#155724" },
        Accountant: { bg: "#fff3cd", color: "#856404" },
    };
    return colors[role] || { bg: "#f0f0f0", color: "#333" };
};

const LoadingSkeleton = () => (
  <div className="page-container">
    <div className="page-header"><div style={{ height: "24px", width: "200px" }} className="dash-skel" /></div>
    <div className="page-toolbar"><div className="dash-skel" style={{ width: "300px", height: "36px", borderRadius: "6px" }} /></div>
    <div className="page-skel-table">
      {[1, 2, 3, 4].map((i) => (
        <div key={i} className="page-skel-row">
          <div className="page-skel-cell" style={{ width: "5%" }} />
          <div className="page-skel-cell" style={{ width: "25%" }} />
          <div className="page-skel-cell" style={{ width: "14%" }} />
          <div className="page-skel-cell" style={{ width: "18%" }} />
          <div className="page-skel-cell" style={{ width: "10%" }} />
          <div className="page-skel-cell" style={{ width: "25%" }} />
        </div>
      ))}
    </div>
  </div>
);

const Users = () => {
    const [search, setSearch] = useState("");
    const [roleFilter, setRoleFilter] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [deleteModal, setDeleteModal] = useState({ show: false, user: null });
    const navigate = useNavigate();
    const queryClient = useQueryClient();
    const { data, isLoading } = useUsers(currentPage, search, roleFilter);

    const users = data?.users || [];
    const totalPages = data?.totalPages || 1;

    const handleDelete = async () => {
        try {
            await API.delete(`/users/${deleteModal.user._id}`);
            setDeleteModal({ show: false, user: null });
            queryClient.invalidateQueries({ queryKey: usersKeys.all });
        } catch (err) {
            alert(err.response?.data?.message || "Failed to delete user");
        }
    };

    const handleToggleStatus = async (id, currentStatus) => {
        try {
            await API.patch(`/users/${id}/toggle-status`);
            queryClient.invalidateQueries({ queryKey: usersKeys.all });
        } catch (err) {
            alert(err.response?.data?.message || "Failed to update status");
        }
    };

    if (isLoading) return <LoadingSkeleton />;

    return (
        <div className="page-container">
            <div className="page-header">
                <div>
                    <div className="page-header-title">User Management</div>
                    <div className="page-header-sub">Manage all staff users across all hotels</div>
                </div>
                <button onClick={() => navigate("/users/add")} className="btn btn-primary btn-lg">
                    + Add New User
                </button>
            </div>

            <div className="page-toolbar">
                <div className="page-toolbar-left">
                    <input
                        type="text"
                        placeholder="Search by name or email..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="input"
                        style={{ minWidth: "260px" }}
                    />
                    <select value={roleFilter} onChange={(e) => setRoleFilter(e.target.value)} className="select" style={{ minWidth: "140px" }}>
                        <option value="">All Roles</option>
                        <option value="SuperAdmin">Super Admin</option>
                        <option value="Manager">Manager</option>
                        <option value="Receptionist">Receptionist</option>
                        <option value="Accountant">Accountant</option>
                    </select>
                </div>
            </div>

            {users.length === 0 ? (
                <div className="page-empty">
                    <div className="page-empty-icon">
                        <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#aaa" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" />
                            <circle cx="9" cy="7" r="4" />
                        </svg>
                    </div>
                    <div className="page-empty-text">No users found</div>
                    <div className="page-empty-hint">Try adjusting your search or filters</div>
                </div>
            ) : (
                <>
                    <div className="page-table-wrap">
                        <table className="page-table table-hover">
                            <thead>
                                <tr>
                                    <th style={{ width: "40px" }}>#</th>
                                    <th>User</th>
                                    <th>Role</th>
                                    <th>Hotel</th>
                                    <th>Status</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {users.map((user, index) => {
                                    const { bg, color } = getRoleBadgeStyle(user.role);
                                    return (
                                        <tr key={user._id}>
                                            <td>{(currentPage - 1) * 10 + index + 1}</td>
                                            <td>
                                                <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                                                    <div style={{ width: "34px", height: "34px", borderRadius: "50%", backgroundColor: color, display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontWeight: "bold", fontSize: "14px", flexShrink: 0 }}>
                                                        {user.name.charAt(0).toUpperCase()}
                                                    </div>
                                                    <div>
                                                        <div style={{ fontWeight: 600, color: "#1a1a2e", fontSize: "14px" }}>{user.name}</div>
                                                        <div style={{ fontSize: "12px", color: "#888" }}>{user.email}</div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td>
                                                <span className="badge" style={{ backgroundColor: bg, color }}>{user.role}</span>
                                            </td>
                                            <td>
                                                {user.hotel?.name || <span style={{ color: "#999" }}>All Hotels</span>}
                                            </td>
                                            <td>
                                                <span className="badge" style={{
                                                    backgroundColor: user.isActive ? "#d4edda" : "#f8d7da",
                                                    color: user.isActive ? "#155724" : "#721c24",
                                                }}>
                                                    {user.isActive ? "Active" : "Inactive"}
                                                </span>
                                            </td>
                                            <td>
                                                <button onClick={() => navigate(`/users/edit/${user._id}`)} className="btn-icon" title="Edit">
                                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
                                                </button>
                                                {user.role !== "SuperAdmin" && (
                                                    <>
                                                        {user.isActive ? (
                                                            <button onClick={() => handleToggleStatus(user._id, user.isActive)} className="btn-icon" title="Deactivate" style={{ marginLeft: "4px" }}>
                                                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="10" y1="15" x2="10" y2="9"/><line x1="14" y1="15" x2="14" y2="9"/></svg>
                                                            </button>
                                                        ) : (
                                                            <button onClick={() => handleToggleStatus(user._id, user.isActive)} className="btn-icon" title="Activate" style={{ marginLeft: "4px" }}>
                                                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polygon points="10 8 16 12 10 16" fill="currentColor"/></svg>
                                                            </button>
                                                        )}
                                                        <button onClick={() => setDeleteModal({ show: true, user })} className="btn-icon btn-icon-danger" title="Delete" style={{ marginLeft: "4px" }}>
                                                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2"/><line x1="10" y1="11" x2="10" y2="17"/><line x1="14" y1="11" x2="14" y2="17"/></svg>
                                                        </button>
                                                    </>
                                                )}
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
                            <button onClick={() => setCurrentPage(currentPage - 1)} disabled={currentPage === 1} className="btn btn-primary">← Previous</button>
                            <button onClick={() => setCurrentPage(currentPage + 1)} disabled={currentPage === totalPages} className="btn btn-primary">Next →</button>
                        </div>
                    </div>
                </>
            )}

            {deleteModal.show && (
                <div className="overlay">
                    <div style={{ backgroundColor: "#fff", padding: "32px", borderRadius: "12px", boxShadow: "0 4px 20px rgba(0,0,0,0.15)", width: "100%", maxWidth: "420px", textAlign: "center" }}>
                        <h3 style={{ fontSize: "20px", color: "#1a1a2e", marginBottom: "12px" }}>Delete User</h3>
                        <p style={{ fontSize: "15px", color: "#333", marginBottom: "8px" }}>
                            Are you sure you want to delete <strong>{deleteModal.user?.name}</strong>?
                        </p>
                        <p style={{ fontSize: "13px", color: "#e63946", marginBottom: "24px" }}>
                            This user will lose all access immediately.
                        </p>
                        <div style={{ display: "flex", gap: "12px" }}>
                            <button onClick={() => setDeleteModal({ show: false, user: null })} className="btn btn-cancel" style={{ flex: 1, padding: "10px", fontSize: "15px" }}>Cancel</button>
                            <button onClick={handleDelete} className="btn btn-danger" style={{ flex: 1, padding: "10px", fontSize: "15px" }}>Delete</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Users;
