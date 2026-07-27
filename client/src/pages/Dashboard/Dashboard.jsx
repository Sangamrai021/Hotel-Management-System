import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import API from "../../api/axios";

const AnimatedCounter = ({ value, duration = 1500 }) => {
  const [display, setDisplay] = useState(0);
  const raf = useRef(null);
  const start = useRef(null);

  useEffect(() => {
    if (value === undefined || value === null) return;
    if (value <= 0) { setDisplay(0); return; }

    start.current = null;
    const from = 0;
    const delta = value - from;

    const tick = (ts) => {
      if (!start.current) start.current = ts;
      const p = Math.min((ts - start.current) / duration, 1);
      const ease = 1 - Math.pow(1 - p, 3);
      setDisplay(Math.floor(from + delta * ease));
      if (p < 1) raf.current = requestAnimationFrame(tick);
      else setDisplay(value);
    };

    raf.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf.current);
  }, [value, duration]);

  return display.toLocaleString();
};

const StatCard = ({ icon, value, label, color, index, prefix = "" }) => (
  <div className="dash-kpi-card" style={{ animationDelay: `${index * 0.08}s` }}>
    <div className="dash-kpi-icon-wrap" style={{ backgroundColor: `${color}18`, color }}>
      {icon}
    </div>
    <div className="dash-kpi-body">
      <div className="dash-kpi-value" style={{ color }}>
        {prefix}<AnimatedCounter value={value} />
      </div>
      <div className="dash-kpi-label">{label}</div>
    </div>
    <div className="dash-kpi-bar" style={{ backgroundColor: color }} />
  </div>
);

const ActionCard = ({ icon, label, onClick, color }) => (
  <div className="dash-action-card" onClick={onClick} style={{ "--accent": color }}>
    <div className="dash-action-icon" style={{ backgroundColor: `${color}18`, color }}>
      {icon}
    </div>
    <div className="dash-action-label">{label}</div>
  </div>
);

const AdminCard = ({ icon, title, desc, onClick }) => (
  <div className="dash-admin-card" onClick={onClick}>
    <div className="dash-admin-icon">{icon}</div>
    <div className="dash-admin-body">
      <div className="dash-admin-title">{title}</div>
      <div className="dash-admin-desc">{desc}</div>
    </div>
    <div className="dash-admin-arrow">
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <line x1="5" y1="12" x2="19" y2="12" />
        <polyline points="12 5 19 12 12 19" />
      </svg>
    </div>
  </div>
);

const LoadingSkeleton = () => (
  <div className="dash-container">
    <div className="dash-header">
      <div className="dash-hdr-content">
        <div className="dash-hdr-left">
          <div className="dash-skel dash-skel-line" style={{ width: "200px" }} />
          <div className="dash-skel dash-skel-line" style={{ width: "160px", height: "12px", marginTop: "10px" }} />
          <div className="dash-skel dash-skel-line" style={{ width: "180px", height: "10px", marginTop: "6px" }} />
        </div>
        <div className="dash-skel" style={{ width: "90px", height: "28px", borderRadius: "20px" }} />
      </div>
    </div>
    <div className="dash-kpi-grid">
      {[1, 2, 3, 4, 5, 6].map((i) => (
        <div key={i} className="dash-skel dash-skel-card" />
      ))}
    </div>
  </div>
);

const ErrorState = ({ message, onRetry }) => (
  <div className="dash-container" style={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "calc(100vh - 60px)" }}>
    <div className="dash-error-card">
      <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#e63946" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10" />
        <line x1="12" y1="8" x2="12" y2="12" />
        <line x1="12" y1="16" x2="12.01" y2="16" />
      </svg>
      <div className="dash-error-title">Something went wrong</div>
      <div className="dash-error-msg">{message}</div>
      <button onClick={onRetry} className="btn btn-primary btn-md" style={{ marginTop: "16px" }}>Try Again</button>
    </div>
  </div>
);

const getGreeting = () => {
  const h = new Date().getHours();
  if (h < 12) return "Good Morning";
  if (h < 17) return "Good Afternoon";
  return "Good Evening";
};

const BADGE_COLORS = {
  SuperAdmin: "#6d6875",
  Manager: "#4361ee",
  Receptionist: "#2a9d8f",
  Accountant: "#f4a261",
};

const Dashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await API.get("/dashboard/stats");
        setStats(res.data);
      } catch {
        setError("Failed to load dashboard stats");
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (loading) return <LoadingSkeleton />;
  if (error) return <ErrorState message={error} onRetry={() => window.location.reload()} />;

  const today = new Date().toLocaleDateString("en-US", {
    weekday: "long", year: "numeric", month: "long", day: "numeric",
  });

  const cards = (() => {
    if (user?.role === "Accountant") {
      return [
        { id: "rev-act", icon: <DashIcons.wallet />, value: stats.revenueThisMonth, label: "Revenue This Month", color: "#6d6875", prefix: "Rs. " },
        { id: "pend-act", icon: <DashIcons.clock />, value: stats.pendingPayments, label: "Pending Payments", color: "#e63946" },
        { id: "book-act", icon: <DashIcons.calendar />, value: stats.bookingsToday, label: "Bookings Today", color: "#4361ee" },
      ];
    }

    const operational = [
      { id: "rooms", icon: <DashIcons.building />, value: stats.totalRooms, label: "Total Rooms", color: "#1a1a2e" },
      { id: "occ", icon: <DashIcons.occupied />, value: stats.occupiedRooms, label: "Occupied", color: "#e63946" },
      { id: "avail", icon: <DashIcons.available />, value: stats.availableRooms, label: "Available", color: "#2a9d8f" },
      { id: "guests", icon: <DashIcons.guests />, value: stats.totalGuests, label: "Total Guests", color: "#4361ee" },
      { id: "book-op", icon: <DashIcons.calendar />, value: stats.bookingsToday, label: "Bookings Today", color: "#f4a261" },
      { id: "pend-op", icon: <DashIcons.clock />, value: stats.pendingPayments, label: "Pending Payments", color: "#e9c46a" },
    ];

    if (user?.role === "SuperAdmin") return operational;

    return [
      ...operational.slice(0, 4),
      { id: "rev-all", icon: <DashIcons.wallet />, value: stats.revenueThisMonth, label: "Revenue This Month", color: "#6d6875", prefix: "Rs. " },
      ...operational.slice(4),
    ];
  })();

  const actions = (() => {
    if (user?.role === "Accountant") return null;
    if (!["SuperAdmin", "Manager", "Receptionist"].includes(user?.role)) return null;
    return [
      { icon: <DashIcons.plus />, label: "New Booking", onClick: () => navigate("/bookings/add"), color: "#1a1a2e" },
      { icon: <DashIcons.arrowIn />, label: "Check In", onClick: () => navigate("/bookings"), color: "#2a9d8f" },
      { icon: <DashIcons.arrowOut />, label: "Check Out", onClick: () => navigate("/bookings"), color: "#f4a261" },
      { icon: <DashIcons.wallet />, label: "Collect Payment", onClick: () => navigate("/payments"), color: "#4361ee" },
    ];
  })();

  return (
    <div className="dash-container">
      <div className="dash-header">
        <div className="dash-hdr-content">
          <div className="dash-hdr-left">
            <div className="dash-greeting">
              {getGreeting()}, <span className="dash-user">{user?.name?.split(" ")[0] || "User"}</span>
            </div>
            <div className="dash-hdr-sub">
              {user?.hotel?.name ? `${user.hotel.name} — ${user.hotel.city}` : "All Hotels Overview"}
            </div>
            <div className="dash-hdr-date">{today}</div>
          </div>
          <div className="dash-hdr-right">
            <span className="dash-role-badge" style={{ backgroundColor: BADGE_COLORS[user?.role] || "#666" }}>
              {user?.role}
            </span>
          </div>
        </div>
      </div>

      <div className="dash-kpi-grid">
        {cards.map((c, i) => (
          <StatCard key={c.id} icon={c.icon} value={c.value} label={c.label} color={c.color} index={i} prefix={c.prefix || ""} />
        ))}
      </div>

      {user?.role === "SuperAdmin" && (
        <div className="dash-rev-card">
          <div className="dash-rev-top">
            <div className="dash-rev-icon-wrap">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#d4a853" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 12V7H5a2 2 0 010-4h14v4" />
                <path d="M3 5v14a2 2 0 002 2h16v-5" />
                <path d="M18 12a2 2 0 000 4h4v-4z" />
              </svg>
            </div>
            <div>
              <div className="dash-rev-label">Revenue This Month</div>
            </div>
          </div>
          <div className="dash-rev-amount">
            Rs. <AnimatedCounter value={stats.revenueThisMonth} duration={2000} />
          </div>
          <div className="dash-rev-bar-wrap">
            <div className="dash-rev-bar-fill" style={{ width: `${Math.min((stats.revenueThisMonth / 1000000) * 100, 100)}%` }} />
          </div>
          <div className="dash-rev-bar-label">
            <span>{stats.revenueThisMonth >= 1000000 ? "Target reached!" : `${Math.round((stats.revenueThisMonth / 1000000) * 100)}% of monthly target`}</span>
            <span>Target: Rs. 1,000,000</span>
          </div>
        </div>
      )}

      {actions && actions.length > 0 && (
        <>
          <div className="dash-section-label">Quick Actions</div>
          <div className="dash-actions-grid">
            {actions.map((a, i) => (
              <ActionCard key={i} icon={a.icon} label={a.label} onClick={a.onClick} color={a.color} />
            ))}
          </div>
        </>
      )}

      {user?.role === "SuperAdmin" && (
        <>
          <div className="dash-section-label">Administration</div>
          <div className="dash-admin-grid">
            <AdminCard
              icon={
                <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="4" y="2" width="16" height="20" rx="1" />
                  <path d="M9 2v4h6V2M9 10h2v2H9zm4 0h2v2h-2zM9 14h2v2H9zm4 0h2v2h-2z" />
                </svg>
              }
              title="Manage Hotels"
              desc="View, add, edit or deactivate hotel properties"
              onClick={() => navigate("/hotels")}
            />
            <AdminCard
              icon={
                <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" />
                  <circle cx="9" cy="7" r="4" />
                </svg>
              }
              title="Manage Users"
              desc="Create and manage system users across hotels"
              onClick={() => navigate("/users")}
            />
          </div>
        </>
      )}

      {user?.role === "Accountant" && (
        <div className="dash-notice">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#c4a000" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
            <line x1="12" y1="9" x2="12" y2="13" />
            <line x1="12" y1="17" x2="12.01" y2="17" />
          </svg>
          <span>You are in view-only mode. Contact your Manager for operational changes.</span>
        </div>
      )}
    </div>
  );
};

const DashIcons = {
  building: () => (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <rect x="4" y="2" width="16" height="20" rx="1" />
      <path d="M9 2v4h6V2M9 10h2v2H9zm4 0h2v2h-2zM9 14h2v2H9zm4 0h2v2h-2z" />
    </svg>
  ),
  occupied: () => (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M15 3h4a2 2 0 012 2v14a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h4" />
      <path d="M10 17l4-5-4-5" />
      <line x1="14" y1="12" x2="4" y2="12" />
    </svg>
  ),
  available: () => (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M9 11l3 3L22 4" />
      <path d="M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11" />
    </svg>
  ),
  guests: () => (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M23 21v-2a4 4 0 00-3-3.87" />
      <path d="M16 3.13a4 4 0 010 7.75" />
    </svg>
  ),
  calendar: () => (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="4" width="18" height="18" rx="2" />
      <line x1="16" y1="2" x2="16" y2="6" />
      <line x1="8" y1="2" x2="8" y2="6" />
      <line x1="3" y1="10" x2="21" y2="10" />
      <circle cx="12" cy="15" r="1" />
    </svg>
  ),
  clock: () => (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" />
      <polyline points="12 6 12 12 16 14" />
    </svg>
  ),
  wallet: () => (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 12V7H5a2 2 0 010-4h14v4" />
      <path d="M3 5v14a2 2 0 002 2h16v-5" />
      <path d="M18 12a2 2 0 000 4h4v-4z" />
    </svg>
  ),
  plus: () => (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="9" />
      <line x1="12" y1="8" x2="12" y2="16" />
      <line x1="8" y1="12" x2="16" y2="12" />
    </svg>
  ),
  arrowIn: () => (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M15 3h4a2 2 0 012 2v14a2 2 0 01-2 2h-4M10 17l5-5-5-5M15 12H3" />
    </svg>
  ),
  arrowOut: () => (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4M15 3h4a2 2 0 012 2v14a2 2 0 01-2 2h-4M10 17l5-5-5-5M15 12H3" />
    </svg>
  ),
};

export default Dashboard;
