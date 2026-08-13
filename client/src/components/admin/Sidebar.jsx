import { Link, useLocation } from "react-router-dom";

function Sidebar() {
  const location = useLocation();

  const menu = [
    {
      group: "MAIN",
      items: [{ path: "/admin", label: "Dashboard", icon: "tachometer-alt" }],
    },
    {
      group: "MANAGEMENT",
      items: [
        { path: "/admin/flights", label: "Flights", icon: "plane-departure" },
        { path: "/admin/airports", label: "Airports", icon: "map-marker-alt" },
        { path: "/admin/bookings", label: "Bookings", icon: "ticket-alt" },
        { path: "/admin/users", label: "Users", icon: "users" },
      ],
    },
  ];

  const isActive = (path) =>
    path === "/admin"
      ? location.pathname === "/admin"
      : location.pathname.startsWith(path);

  return (
    <aside
      style={{
        width: "280px",
        height: "100vh",
        background: "linear-gradient(180deg, #0f172a, #111827)",
        color: "#fff",
        display: "flex",
        flexDirection: "column",
      }}
    >
      {/* LOGO */}
      <Link
        to="/admin"
        style={{
          padding: "22px",
          display: "flex",
          alignItems: "center",
          gap: "14px",
          borderBottom: "1px solid rgba(255,255,255,0.08)",
          textDecoration: "none",
        }}
      >
        <img
          src="/logo.jpg"
          alt="logo"
          style={{
            width: "70px",
            height: "70px",
            borderRadius: "10px",
            objectFit: "cover",
            background: "#fff",
            padding: "4px",
          }}
        />

        <div>
          <div style={{ fontSize: "18px", fontWeight: "800", color: "#fff" }}>
            SkyLink
          </div>
          <div style={{ fontSize: "12px", color: "#94a3b8" }}>
            Airline Admin Panel
          </div>
        </div>
      </Link>

      {/* MENU */}
      <div style={{ flex: 1, paddingTop: "12px" }}>
        {menu.map((section, i) => (
          <div key={i} style={{ marginBottom: "18px" }}>
            <div
              style={{
                padding: "10px 22px",
                fontSize: "11px",
                color: "#64748b",
                letterSpacing: "1px",
              }}
            >
              {section.group}
            </div>

            {section.items.map((item) => {
              const active = isActive(item.path);

              return (
                <Link
                  key={item.path}
                  to={item.path}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "12px",
                    padding: "12px 18px",
                    margin: "4px 12px",
                    borderRadius: "10px",
                    textDecoration: "none",
                    transition: "0.2s",
                    background: active
                      ? "linear-gradient(135deg,#2563eb,#3b82f6)"
                      : "transparent",
                    color: active ? "#fff" : "#cbd5e1",
                  }}
                >
                  <i className={`fas fa-${item.icon}`} />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </div>
        ))}
      </div>

      {/* USER CARD */}
      <div
        style={{
          margin: "14px",
          padding: "14px",
          borderRadius: "12px",
          background: "#1e293b",
        }}
      >
        <div style={{ fontWeight: "600" }}>Administrator</div>
        <div style={{ fontSize: "12px", color: "#94a3b8" }}>
          System Control Panel
        </div>
      </div>

      {/* FOOTER */}
      <div
        style={{
          textAlign: "center",
          padding: "12px",
          fontSize: "12px",
          color: "#64748b",
        }}
      >
        Version 1.0
      </div>
    </aside>
  );
}

export default Sidebar;