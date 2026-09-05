import { Link, useLocation, useNavigate } from "react-router-dom";

function Sidebar() {
  const location = useLocation();
  const navigate = useNavigate();

  const menuItems = [
    { path: "/admin", label: "Home", icon: "fa-home" },
    { path: "/admin/users", label: "Users management", icon: "fa-users" },
    { path: "/admin/bookings", label: "Reservation", icon: "fa-calendar-alt" },
    { path: "/admin/flights", label: "Flights", icon: "fa-plane" },
    { path: "/admin/airports", label: "Airports", icon: "fa-map-marker-alt" },
    { path: "/admin/payments", label: "Payment", icon: "fa-credit-card" },
    { path: "/admin", label: "Profits", icon: "fa-sack-dollar" },
    { path: "/admin", label: "Offers", icon: "fa-percent" },
    { path: "/admin", label: "Reports", icon: "fa-file-invoice" },
    { path: "/admin/profile", label: "Setting", icon: "fa-cog" },
  ];

  const isActive = (path) =>
    path === "/admin"
      ? location.pathname === "/admin"
      : location.pathname.startsWith(path);

  const handleLogout = () => {
    localStorage.clear();
    sessionStorage.clear();
    navigate("/login");
  };

  return (
    <aside
      style={{
        width: "260px",
        minWidth: "260px",
        height: "100vh",
        position: "sticky",
        top: 0,
        background: "linear-gradient(185deg, #1e40af 0%, #1e3a8a 45%, #172554 100%)",
        color: "#fff",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        boxShadow: "4px 0 25px rgba(15, 23, 42, 0.15)",
        zIndex: 100,
        overflow: "hidden",
      }}
    >
      {/* BACKGROUND DECORATIVE WATERMARK */}
      <div
        style={{
          position: "absolute",
          bottom: "-40px",
          left: "-40px",
          opacity: 0.08,
          pointerEvents: "none",
        }}
      >
        <svg width="300" height="300" viewBox="0 0 24 24" fill="white">
          <path d="M21 16v-2l-8-5V3.5c0-.83-.67-1.5-1.5-1.5S10 2.67 10 3.5V9l-8 5v2l8-2.5V19l-2 1.5V22l3.5-1 3.5 1v-1.5L13 19v-5.5l8 2.5z" />
        </svg>
      </div>

      <div>
        {/* LOGO AREA */}
        <Link
          to="/admin"
          style={{
            padding: "24px 20px 20px 24px",
            display: "flex",
            alignItems: "center",
            gap: "14px",
            textDecoration: "none",
          }}
        >
          {/* Logo Badge */}
          <div
            style={{
              width: "44px",
              height: "44px",
              borderRadius: "14px",
              background: "linear-gradient(135deg, #f59e0b, #eab308)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              boxShadow: "0 6px 16px rgba(245, 158, 11, 0.4)",
            }}
          >
            <i className="fas fa-paper-plane" style={{ color: "#fff", fontSize: "20px" }} />
          </div>

          <div>
            <div
              style={{
                fontSize: "22px",
                fontWeight: "800",
                color: "#ffffff",
                letterSpacing: "-0.5px",
                lineHeight: "1.2",
              }}
            >
              SkyLink
            </div>
            <div style={{ fontSize: "11px", color: "rgba(255, 255, 255, 0.7)", fontWeight: "500" }}>
              Fly with confidence
            </div>
          </div>
        </Link>

        {/* MENU ITEMS */}
        <nav style={{ padding: "10px 14px" }}>
          {menuItems.map((item, idx) => {
            const active = isActive(item.path) && (idx === 0 ? location.pathname === "/admin" : true);
            return (
              <Link
                key={idx}
                to={item.path}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "14px",
                  padding: "12px 18px",
                  marginBottom: "4px",
                  borderRadius: "14px",
                  textDecoration: "none",
                  fontSize: "15px",
                  fontWeight: active ? "600" : "500",
                  transition: "all 0.2s ease",
                  background: active
                    ? "rgba(255, 255, 255, 0.2)"
                    : "transparent",
                  color: active ? "#ffffff" : "rgba(255, 255, 255, 0.8)",
                  boxShadow: active ? "0 4px 15px rgba(0, 0, 0, 0.1)" : "none",
                  backdropFilter: active ? "blur(10px)" : "none",
                }}
              >
                <i
                  className={`fas ${item.icon}`}
                  style={{
                    fontSize: "17px",
                    width: "22px",
                    textAlign: "center",
                    color: active ? "#ffffff" : "rgba(255, 255, 255, 0.75)",
                  }}
                />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>
      </div>

      {/* LOGOUT BUTTON AT BOTTOM */}
      <div style={{ padding: "16px 14px 24px 14px" }}>
        <button
          onClick={handleLogout}
          style={{
            width: "100%",
            display: "flex",
            alignItems: "center",
            gap: "14px",
            padding: "12px 18px",
            borderRadius: "14px",
            border: "none",
            background: "rgba(239, 68, 68, 0.15)",
            color: "#fca5a5",
            cursor: "pointer",
            fontSize: "15px",
            fontWeight: "600",
            transition: "all 0.2s ease",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = "rgba(239, 68, 68, 0.3)";
            e.currentTarget.style.color = "#ffffff";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = "rgba(239, 68, 68, 0.15)";
            e.currentTarget.style.color = "#fca5a5";
          }}
        >
          <i className="fas fa-sign-out-alt" style={{ fontSize: "17px", width: "22px", textAlign: "center" }} />
          <span>Logout</span>
        </button>
      </div>
    </aside>
  );
}

export default Sidebar;