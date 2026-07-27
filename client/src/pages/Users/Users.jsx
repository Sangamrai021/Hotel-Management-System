import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import API from "../../api/axios";

const Users = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");
    const [roleFilter, setRoleFilter] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [deleteModal, setDeleteModal] = useState({ show: false, user: null });
    const navigate = useNavigate();

    const fetchUsers = async (page = 1) => {
        try {
            const res = await API.get("/users", {
                params: { search, role: roleFilter, page, limit: 10 },
            });
            setUsers(res.data.users);
            setTotalPages(res.data.totalPages);
            setCurrentPage(res.data.currentPage);
        } catch (error) {
            console.error("Failed to fetch users");
            console.log(error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        setCurrentPage(1);
        fetchUsers(1);
    }, [search, roleFilter]);

    const handleDelete = async () => {
        try {
            await API.delete(`/users/${deleteModal.user._id}`);
            setDeleteModal({ show: false, user: null });
            fetchUsers(currentPage);
        } catch (err) {
            alert(err.response?.data?.message || "Failed to delete user");
        }
    };

    const handleToggleStatus = async (id, currentStatus) => {
        try {
            await API.patch(`/users/${id}/toggle-status`);
            fetchUsers(currentPage);
        } catch (err) {
            alert(err.response?.data?.message || "Failed to update status");
        }
    };

    const getRoleBadgeStyle = (role) => {
        const colors = {
            SuperAdmin: { bg: "#f3e8ff", color: "#6d6875" },
            Manager: { bg: "#e8f0fe", color: "#4361ee" },
            Receptionist: { bg: "#d4edda", color: "#155724" },
            Accountant: { bg: "#fff3cd", color: "#856404" },
        };
        return colors[role] || { bg: "#f0f0f0", color: "#333" };
    };

    if (loading) return <div style={styles.center}>Loading...</div>;

    return (
        <div style={styles.container}>
            {/* Header */}
            <div style={styles.header}>
                <div>
                    <h2 style={styles.title}>User Management</h2>
                    <p style={styles.subtitle}>Manage all staff users across all hotels</p>
                </div>
                <button
                    onClick={() => navigate("/users/add")}
                    className="btn btn-primary btn-lg"
                    style={styles.addButton}
                >
                    + Add New User
                </button>
            </div>

            {/* Filters */}
            <div style={styles.filters}>
                <input
                    type="text"
                    placeholder="Search by name or email..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="input"
                    style={styles.input}
                />
                <select
                    value={roleFilter}
                    onChange={(e) => setRoleFilter(e.target.value)}
                    className="select"
                    style={styles.select}
                >
                    <option value="">All Roles</option>
                    <option value="SuperAdmin">Super Admin</option>
                    <option value="Manager">Manager</option>
                    <option value="Receptionist">Receptionist</option>
                    <option value="Accountant">Accountant</option>
                </select>
            </div>

            {/* Table */}
            {users.length === 0 ? (
                <div style={styles.empty}>No users found.</div>
            ) : (
                <>
                    <table className="table-hover" style={styles.table}>
                        <thead>
                            <tr style={styles.thead}>
                                <th style={styles.th}>#</th>
                                <th style={styles.th}>User</th>
                                <th style={styles.th}>Role</th>
                                <th style={styles.th}>Hotel</th>
                                <th style={styles.th}>Status</th>
                                <th style={styles.th}>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {users.map((user, index) => {
                                const { bg, color } = getRoleBadgeStyle(user.role);
                                return (
                                    <tr key={user._id} style={styles.tr}>
                                        <td style={styles.td}>{index + 1}</td>
                                        <td style={styles.td}>
                                            <div style={styles.userCell}>
                                                <div style={{
                                                    ...styles.avatar,
                                                    backgroundColor: color,
                                                }}>
                                                    {user.name.charAt(0).toUpperCase()}
                                                </div>
                                                <div>
                                                    <div style={styles.userName}>{user.name}</div>
                                                    <div style={styles.userEmail}>{user.email}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td style={styles.td}>
                                                <span className="badge" style={{
                                                    ...styles.badge,
                                                    backgroundColor: bg,
                                                    color,
                                                }}>
                                                    {user.role}
                                                </span>
                                        </td>
                                        <td style={styles.td}>
                                            {user.hotel
                                                ? `${user.hotel.name}`
                                                : <span style={{ color: "#999" }}>All Hotels</span>
                                            }
                                        </td>
                                        <td style={styles.td}>
                                            <span className="badge" style={{
                                                ...styles.badge,
                                                backgroundColor: user.isActive ? "#d4edda" : "#f8d7da",
                                                color: user.isActive ? "#155724" : "#721c24",
                                            }}>
                                                {user.isActive ? "Active" : "Inactive"}
                                            </span>
                                        </td>
                                        <td style={styles.td}>
                                            <button
                                                onClick={() => navigate(`/users/edit/${user._id}`)}
                                                className="btn btn-edit btn-sm"
                                                style={styles.editBtn}
                                            >
                                                Edit
                                            </button>
                                            <button
                                                onClick={() => handleToggleStatus(user._id, user.isActive)}
                                                className="btn btn-sm"
                                                style={{
                                                    ...styles.toggleBtn,
                                                    backgroundColor: user.isActive ? "#f4a261" : "#2a9d8f",
                                                }}
                                            >
                                                {user.isActive ? "Deactivate" : "Activate"}
                                            </button>
                                            <button
                                                onClick={() => setDeleteModal({ show: true, user })}
                                                className="btn btn-danger btn-sm"
                                                style={styles.deleteBtn}
                                            >
                                                Delete
                                            </button>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>

                    {/* Pagination */}
                    <div style={styles.pagination}>
                        <span style={styles.pageInfo}>Showing page {currentPage} of {totalPages}</span>
                        <div style={styles.paginationControls}>
                            <button
                                onClick={() => fetchUsers(currentPage - 1)}
                                disabled={currentPage === 1}
                                                className="btn btn-primary"
                                                style={styles.pageBtn}
                                            >
                                                ← Previous
                                            </button>
                                            <button
                                                onClick={() => fetchUsers(currentPage + 1)}
                                                disabled={currentPage === totalPages}
                                                className="btn btn-primary"
                                                style={styles.pageBtn}
                                            >
                                                Next →
                                            </button>
                        </div>
                    </div>
                </>
            )}

            {/* Delete Modal */}
            {deleteModal.show && (
                <div className="overlay" style={styles.overlay}>
                    <div style={styles.modal}>
                        <h3 style={styles.modalTitle}>Delete User</h3>
                        <p style={styles.modalText}>
                            Are you sure you want to delete{" "}
                            <strong>{deleteModal.user?.name}</strong>?
                        </p>
                        <p style={styles.modalWarning}>
                            This user will lose all access immediately.
                        </p>
                        <div style={styles.modalButtons}>
                            <button
                                onClick={() => setDeleteModal({ show: false, user: null })}
                                            className="btn btn-cancel"
                                            style={styles.cancelBtn}
                                        >
                                            Cancel
                                        </button>
                                        <button onClick={handleDelete} className="btn btn-danger" style={styles.confirmBtn}>
                                Delete
                            </button>
                        </div>
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
    addButton: { backgroundColor: "#1a1a2e", color: "white", border: "none", padding: "12px 24px", borderRadius: "8px", cursor: "pointer", fontSize: "15px", fontWeight: "500" },
    filters: { display: "flex", gap: "12px", marginBottom: "20px" },
    input: { padding: "10px 16px", borderRadius: "8px", border: "1px solid #ccc", fontSize: "14px", width: "300px", backgroundColor: "white" },
    select: { padding: "10px 16px", borderRadius: "8px", border: "1px solid #ccc", fontSize: "14px", backgroundColor: "white" },
    table: { width: "100%", borderCollapse: "collapse", backgroundColor: "white", borderRadius: "12px", overflow: "hidden", boxShadow: "0 2px 10px rgba(0,0,0,0.06)" },
    thead: { backgroundColor: "#1a1a2e" },
    th: { padding: "14px 16px", textAlign: "left", color: "white", fontWeight: "600", fontSize: "13px" },
    tr: { borderBottom: "1px solid #f0f0f0" },
    td: { padding: "14px 16px", color: "#333", fontSize: "14px" },
    userCell: { display: "flex", alignItems: "center", gap: "12px" },
    avatar: { width: "36px", height: "36px", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", color: "white", fontWeight: "bold", fontSize: "15px", flexShrink: 0 },
    userName: { fontWeight: "bold", color: "#1a1a2e", fontSize: "14px" },
    userEmail: { fontSize: "12px", color: "#666", marginTop: "2px" },
    badge: { padding: "4px 10px", borderRadius: "20px", fontSize: "12px", fontWeight: "500" },
    editBtn: { backgroundColor: "#4361ee", color: "white", border: "none", padding: "6px 12px", borderRadius: "6px", cursor: "pointer", marginRight: "6px", fontSize: "12px" },
    toggleBtn: { color: "white", border: "none", padding: "6px 12px", borderRadius: "6px", cursor: "pointer", marginRight: "6px", fontSize: "12px" },
    deleteBtn: { backgroundColor: "#e63946", color: "white", border: "none", padding: "6px 12px", borderRadius: "6px", cursor: "pointer", fontSize: "12px" },
    empty: { textAlign: "center", padding: "60px", color: "#666", backgroundColor: "white", borderRadius: "12px" },
    pagination: { display: "flex", justifyContent: "space-between", alignItems: "center", gap: "20px", marginTop: "24px" },
    paginationControls: { display: "flex", alignItems: "center", gap: "12px" },
    pageBtn: { padding: "8px 20px", backgroundColor: "#1a1a2e", color: "white", border: "none", borderRadius: "6px", cursor: "pointer", fontSize: "14px" },
    pageInfo: { fontSize: "14px", color: "#333", fontWeight: "500" },
    overlay: { position: "fixed", top: 0, left: 0, width: "100vw", height: "100vh", backgroundColor: "rgba(0,0,0,0.5)", display: "flex", justifyContent: "center", alignItems: "center", zIndex: 1000 },
    modal: { backgroundColor: "white", padding: "32px", borderRadius: "12px", boxShadow: "0 4px 20px rgba(0,0,0,0.15)", width: "100%", maxWidth: "420px", textAlign: "center" },
    modalTitle: { fontSize: "20px", color: "#1a1a2e", marginBottom: "12px" },
    modalText: { fontSize: "15px", color: "#333", marginBottom: "8px" },
    modalWarning: { fontSize: "13px", color: "#e63946", marginBottom: "24px" },
    modalButtons: { display: "flex", gap: "12px" },
    cancelBtn: { flex: 1, padding: "10px", backgroundColor: "#f0f0f0", color: "#333", border: "none", borderRadius: "6px", cursor: "pointer", fontSize: "15px" },
    confirmBtn: { flex: 1, padding: "10px", backgroundColor: "#e63946", color: "white", border: "none", borderRadius: "6px", cursor: "pointer", fontSize: "15px" },
    center: { display: "flex", justifyContent: "center", alignItems: "center", height: "80vh", fontSize: "18px" },
};

export default Users;