import { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import API from "../../api/axios";

const Profile = () => {
    const { user, login, token } = useAuth();
    const [activeTab, setActiveTab] = useState("profile");
    const [form, setForm] = useState({ name: "", phone: "" });
    const [passwordForm, setPasswordForm] = useState({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
    });
    const [profileSuccess, setProfileSuccess] = useState("");
    const [profileError, setProfileError] = useState("");
    const [passwordSuccess, setPasswordSuccess] = useState("");
    const [passwordError, setPasswordError] = useState("");
    const [loading, setLoading] = useState(false);
    const [showCurrentPass, setShowCurrentPass] = useState(false);
    const [showNewPass, setShowNewPass] = useState(false);
    const [showConfirmPass, setShowConfirmPass] = useState(false);

    useEffect(() => {
        if (user) {
            setForm({ name: user.name || "", phone: user.phone || "" });
        }
    }, [user]);

    const getRoleBadgeColor = () => {
        switch (user?.role) {
            case "SuperAdmin": return "#6d6875";
            case "Manager": return "#4361ee";
            case "Receptionist": return "#2a9d8f";
            case "Accountant": return "#f4a261";
            default: return "#666";
        }
    };

    const getPasswordStrength = (password) => {
        if (!password) return { strength: 0, label: "", color: "#f0f0f0" };
        let score = 0;
        if (password.length >= 8) score++;
        if (/[A-Z]/.test(password)) score++;
        if (/[0-9]/.test(password)) score++;
        if (/[^a-zA-Z0-9]/.test(password)) score++;
        if (score <= 1) return { strength: 25, label: "Weak", color: "#e63946" };
        if (score === 2) return { strength: 50, label: "Fair", color: "#f4a261" };
        if (score === 3) return { strength: 75, label: "Good", color: "#e9c46a" };
        return { strength: 100, label: "Strong", color: "#2a9d8f" };
    };

    const handleProfileSubmit = async (e) => {
        e.preventDefault();
        setProfileError("");
        setProfileSuccess("");
        setLoading(true);
        try {
            const res = await API.put("/auth/profile", form);
            // Update stored user data
            login(token, { ...user, name: res.data.name, phone: res.data.phone });
            setProfileSuccess("Profile updated successfully!");
        } catch (err) {
            setProfileError(err.response?.data?.message || "Failed to update profile");
        } finally {
            setLoading(false);
        }
    };

    const handlePasswordSubmit = async (e) => {
        e.preventDefault();
        setPasswordError("");
        setPasswordSuccess("");

        if (passwordForm.newPassword !== passwordForm.confirmPassword)
            return setPasswordError("New passwords do not match");

        if (passwordForm.newPassword.length < 8)
            return setPasswordError("New password must be at least 8 characters");

        setLoading(true);
        try {
            await API.put("/auth/change-password", {
                currentPassword: passwordForm.currentPassword,
                newPassword: passwordForm.newPassword,
            });
            setPasswordSuccess("Password changed successfully!");
            setPasswordForm({ currentPassword: "", newPassword: "", confirmPassword: "" });
        } catch (err) {
            setPasswordError(err.response?.data?.message || "Failed to change password");
        } finally {
            setLoading(false);
        }
    };

    const strength = getPasswordStrength(passwordForm.newPassword);

    return (
        <div style={styles.container}>
            <div style={styles.wrapper}>

                {/* Left — Profile Card */}
                    <div className="card-static" style={styles.profileCard}>
                    {/* Avatar */}
                    <div style={{
                        ...styles.avatar,
                        backgroundColor: getRoleBadgeColor(),
                    }}>
                        {user?.name?.charAt(0).toUpperCase()}
                    </div>

                    <h3 style={styles.profileName}>{user?.name}</h3>
                    <p style={styles.profileEmail}>{user?.email}</p>

                    <span style={{
                        ...styles.roleBadge,
                        backgroundColor: getRoleBadgeColor(),
                    }}>
                        {user?.role}
                    </span>

                    {user?.hotel && (
                        <p style={styles.hotelName}>
                            {user.hotel.name}
                        </p>
                    )}

                    <div style={styles.divider} />

                    <div style={styles.metaRow}>
                        <span style={styles.metaLabel}>Member since</span>
                    </div>
                    <div style={styles.metaRow}>
                        <span style={styles.metaLabel}>{user?.phone || "No phone added"}</span>
                    </div>
                </div>

                {/* Right — Tabs */}
                    <div className="card-static" style={styles.rightPanel}>
                    {/* Tabs */}
                    <div style={styles.tabs}>
                        <button
                            onClick={() => setActiveTab("profile")}
                            className="tab-btn"
                            style={{
                                ...styles.tab,
                                borderBottom: activeTab === "profile"
                                    ? "3px solid #1a1a2e"
                                    : "3px solid transparent",
                                color: activeTab === "profile" ? "#1a1a2e" : "#666",
                                fontWeight: activeTab === "profile" ? "bold" : "normal",
                            }}
                        >
                            Profile Information
                        </button>
                        <button
                            onClick={() => setActiveTab("password")}
                            className="tab-btn"
                            style={{
                                ...styles.tab,
                                borderBottom: activeTab === "password"
                                    ? "3px solid #1a1a2e"
                                    : "3px solid transparent",
                                color: activeTab === "password" ? "#1a1a2e" : "#666",
                                fontWeight: activeTab === "password" ? "bold" : "normal",
                            }}
                        >
                            Change Password
                        </button>
                    </div>

                    {/* Profile Tab */}
                    {activeTab === "profile" && (
                        <div style={styles.tabContent}>
                            {profileSuccess && (
                                <div style={styles.success}>{profileSuccess}</div>
                            )}
                            {profileError && (
                                <div style={styles.error}>{profileError}</div>
                            )}

                            <form onSubmit={handleProfileSubmit}>
                                <div style={styles.field}>
                                    <label style={styles.label}>Full Name *</label>
                                    <input
                                        value={form.name}
                                        onChange={(e) => setForm({ ...form, name: e.target.value })}
                                    className="input"
                                    style={styles.input}
                                    pattern="^[a-zA-Z\s]+$"
                                        title="Name can only contain letters and spaces"
                                        required
                                    />
                                </div>

                                <div style={styles.field}>
                                    <label style={styles.label}>Email Address</label>
                                    <input
                                        value={user?.email}
                                        className="input"
                                        style={{ ...styles.input, ...styles.readOnly }}
                                        disabled
                                    />
                                    <span style={styles.hint}>Email cannot be changed</span>
                                </div>

                                <div style={styles.field}>
                                    <label style={styles.label}>Phone Number</label>
                                    <input
                                        value={form.phone}
                                        onChange={(e) => setForm({ ...form, phone: e.target.value })}
                                        className="input"
                                        style={styles.input}
                                        placeholder="e.g. 9800000000"
                                    />
                                </div>

                                <div style={styles.field}>
                                    <label style={styles.label}>Assigned Hotel</label>
                                    <input
                                        value={user?.hotel?.name || "All Hotels (Super Admin)"}
                                        className="input"
                                        style={{ ...styles.input, ...styles.readOnly }}
                                        disabled
                                    />
                                    <span style={styles.hint}>Hotel assignment managed by Super Admin</span>
                                </div>

                                <div style={styles.field}>
                                    <label style={styles.label}>Role</label>
                                    <input
                                        value={user?.role}
                                        className="input"
                                        style={{ ...styles.input, ...styles.readOnly }}
                                        disabled
                                    />
                                    <span style={styles.hint}>Role managed by Super Admin</span>
                                </div>

                                <button
                                    type="submit"
                                    className="btn btn-primary btn-full"
                                    style={styles.submitBtn}
                                    disabled={loading}
                                >
                                    {loading ? "Updating..." : "Update Profile"}
                                </button>
                            </form>
                        </div>
                    )}

                    {/* Password Tab */}
                    {activeTab === "password" && (
                        <div style={styles.tabContent}>
                            {passwordSuccess && (
                                <div style={styles.success}>{passwordSuccess}</div>
                            )}
                            {passwordError && (
                                <div style={styles.error}>{passwordError}</div>
                            )}

                            <form onSubmit={handlePasswordSubmit}>
                                <div style={styles.field}>
                                    <label style={styles.label}>Current Password *</label>
                                    <div style={styles.passwordWrapper}>
                                        <input
                                            type={showCurrentPass ? "text" : "password"}
                                            value={passwordForm.currentPassword}
                                            onChange={(e) => setPasswordForm({
                                                ...passwordForm,
                                                currentPassword: e.target.value,
                                            })}
                                            className="input"
                                            style={{ ...styles.input, paddingRight: "44px" }}
                                            placeholder="Enter current password"
                                            required
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowCurrentPass(!showCurrentPass)}
                                            className="btn-ghost"
                                            style={styles.eyeBtn}
                                        >
                                            {showCurrentPass ? "Hide" : "Show"}
                                        </button>
                                    </div>
                                </div>

                                <div style={styles.field}>
                                    <label style={styles.label}>New Password *</label>
                                    <div style={styles.passwordWrapper}>
                                        <input
                                            type={showNewPass ? "text" : "password"}
                                            value={passwordForm.newPassword}
                                            onChange={(e) => setPasswordForm({
                                                ...passwordForm,
                                                newPassword: e.target.value,
                                            })}
                                            className="input"
                                            style={{ ...styles.input, paddingRight: "44px" }}
                                            placeholder="Minimum 8 characters"
                                            required
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowNewPass(!showNewPass)}
                                            className="btn-ghost"
                                            style={styles.eyeBtn}
                                        >
                                            {showNewPass ? "Hide" : "Show"}
                                        </button>
                                    </div>

                                    {/* Password Strength Bar */}
                                    {passwordForm.newPassword && (
                                        <div style={styles.strengthContainer}>
                                            <div style={styles.strengthBar}>
                                                <div style={{
                                                    ...styles.strengthFill,
                                                    width: `${strength.strength}%`,
                                                    backgroundColor: strength.color,
                                                }} />
                                            </div>
                                            <span style={{ ...styles.strengthLabel, color: strength.color }}>
                                                {strength.label}
                                            </span>
                                        </div>
                                    )}

                                    {/* Requirements */}
                                    <div style={styles.requirements}>
                                        <div style={styles.req}>
                                            {passwordForm.newPassword.length >= 8 ? "Yes" : "No"} At least 8 characters
                                        </div>
                                        <div style={styles.req}>
                                            {/[A-Z]/.test(passwordForm.newPassword) ? "Yes" : "No"} Contains uppercase letter
                                        </div>
                                        <div style={styles.req}>
                                            {/[0-9]/.test(passwordForm.newPassword) ? "Yes" : "No"} Contains number
                                        </div>
                                        <div style={styles.req}>
                                            {/[^a-zA-Z0-9]/.test(passwordForm.newPassword) ? "Yes" : "No"} Contains special character
                                        </div>
                                    </div>
                                </div>

                                <div style={styles.field}>
                                    <label style={styles.label}>Confirm New Password *</label>
                                    <div style={styles.passwordWrapper}>
                                        <input
                                            type={showConfirmPass ? "text" : "password"}
                                            value={passwordForm.confirmPassword}
                                            onChange={(e) => setPasswordForm({
                                                ...passwordForm,
                                                confirmPassword: e.target.value,
                                            })}
                                            className="input"
                                            style={{ ...styles.input, paddingRight: "44px" }}
                                            placeholder="Repeat new password"
                                            required
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowConfirmPass(!showConfirmPass)}
                                            className="btn-ghost"
                                            style={styles.eyeBtn}
                                        >
                                            {showConfirmPass ? "Hide" : "Show"}
                                        </button>
                                    </div>
                                    {passwordForm.confirmPassword && (
                                        <div style={{
                                            fontSize: "13px",
                                            marginTop: "6px",
                                            color: passwordForm.newPassword === passwordForm.confirmPassword
                                                ? "#2a9d8f"
                                                : "#e63946",
                                        }}>
                                            {passwordForm.newPassword === passwordForm.confirmPassword
                                                ? "Passwords match"
                                                : "Passwords do not match"}
                                        </div>
                                    )}
                                </div>

                                <button
                                    type="submit"
                                    className="btn btn-primary btn-full"
                                    style={styles.submitBtn}
                                    disabled={loading}
                                >
                                    {loading ? "Changing..." : "Change Password"}
                                </button>
                            </form>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

const styles = {
    container: { padding: "24px", backgroundColor: "#f0f2f5", minHeight: "calc(100vh - 60px)" },
    wrapper: { display: "flex", gap: "24px", maxWidth: "1000px", margin: "0 auto" },
    profileCard: { backgroundColor: "white", padding: "32px", borderRadius: "12px", boxShadow: "0 2px 10px rgba(0,0,0,0.06)", width: "280px", flexShrink: 0, textAlign: "center", height: "fit-content" },
    avatar: { width: "80px", height: "80px", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", color: "white", fontWeight: "bold", fontSize: "32px", margin: "0 auto 16px" },
    profileName: { fontSize: "18px", fontWeight: "bold", color: "#1a1a2e", marginBottom: "4px" },
    profileEmail: { fontSize: "13px", color: "#666", marginBottom: "12px" },
    roleBadge: { color: "white", padding: "4px 16px", borderRadius: "20px", fontSize: "13px", fontWeight: "500", display: "inline-block", marginBottom: "12px" },
    hotelName: { fontSize: "13px", color: "#4361ee", marginBottom: "8px" },
    divider: { height: "1px", backgroundColor: "#f0f0f0", margin: "16px 0" },
    metaRow: { marginBottom: "8px" },
    metaLabel: { fontSize: "13px", color: "#666" },
    rightPanel: { flex: 1, backgroundColor: "white", borderRadius: "12px", boxShadow: "0 2px 10px rgba(0,0,0,0.06)", overflow: "hidden" },
    tabs: { display: "flex", borderBottom: "1px solid #f0f0f0", padding: "0 24px" },
    tab: { padding: "18px 20px", border: "none", backgroundColor: "transparent", cursor: "pointer", fontSize: "14px", transition: "all 0.2s" },
    tabContent: { padding: "28px" },
    success: { backgroundColor: "#d4edda", color: "#155724", padding: "12px", borderRadius: "6px", marginBottom: "20px", fontSize: "14px" },
    error: { backgroundColor: "#ffe0e0", color: "#c0392b", padding: "12px", borderRadius: "6px", marginBottom: "20px", fontSize: "14px" },
    field: { marginBottom: "20px" },
    label: { display: "block", marginBottom: "6px", fontWeight: "bold", color: "#333", fontSize: "14px" },
    input: { width: "100%", padding: "10px 14px", borderRadius: "6px", border: "1px solid #ccc", fontSize: "15px", boxSizing: "border-box" },
    readOnly: { backgroundColor: "#f8f9ff", color: "#999", cursor: "not-allowed" },
    hint: { fontSize: "12px", color: "#999", marginTop: "4px", display: "block" },
    passwordWrapper: { position: "relative" },
    eyeBtn: { position: "absolute", right: "12px", top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer", fontSize: "16px", padding: 0 },
    strengthContainer: { display: "flex", alignItems: "center", gap: "10px", marginTop: "8px" },
    strengthBar: { flex: 1, height: "6px", backgroundColor: "#f0f0f0", borderRadius: "3px", overflow: "hidden" },
    strengthFill: { height: "100%", borderRadius: "3px", transition: "all 0.3s" },
    strengthLabel: { fontSize: "12px", fontWeight: "bold", minWidth: "50px" },
    requirements: { marginTop: "10px", display: "flex", flexDirection: "column", gap: "4px" },
    req: { fontSize: "12px", color: "#666" },
    submitBtn: { width: "100%", padding: "12px", backgroundColor: "#1a1a2e", color: "white", border: "none", borderRadius: "6px", cursor: "pointer", fontSize: "15px", fontWeight: "500" },
};

export default Profile;