import { useNavigate } from "react-router-dom";
import { colors } from "../../styles/theme";

function Navbar() {
  const navigate = useNavigate();

  const user = JSON.parse(localStorage.getItem("user") || "null");

  const handleLogout = async () => {
  try {
    const token =
      localStorage.getItem("token") ||
      sessionStorage.getItem("token");

    await fetch("http://127.0.0.1:8000/api/auth/logout", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });
  } catch (err) {
    console.log("Logout API lỗi nhưng vẫn clear local");
  }

  localStorage.clear();
  sessionStorage.clear();

  navigate("/login");
};

  return (
    <nav
      style={{
        height: "60px",
        background: colors.white,
        borderBottom: "1px solid #eee",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "0 20px",
        boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
      }}
    >
      {/* BRAND */}
      <div
        onClick={() => navigate("/admin")}
        style={{
          fontSize: "18px",
          fontWeight: "700",
          color: colors.dark,
          cursor: "pointer",
        }}
      >
        SkyLink Admin
      </div>

      {/* USER AREA */}
      <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>

        {/* AVATAR → PROFILE */}
        <div
          onClick={() => navigate("/admin/profile")}
          style={{
            width: "36px",
            height: "36px",
            borderRadius: "50%",
            background: colors.primary,
            color: colors.white,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontWeight: "bold",
            cursor: "pointer",
          }}
          title="My Profile"
        >
          {(user?.name?.charAt(0) || "A").toUpperCase()}
        </div>

        {/* NAME */}
        <span style={{ fontSize: "14px", color: colors.gray }}>
          {user?.name || "Admin"}
        </span>

        {/* LOGOUT */}
        <button
          onClick={handleLogout}
          style={{
            padding: "6px 12px",
            border: "none",
            background: colors.danger,
            color: colors.white,
            borderRadius: "6px",
            cursor: "pointer",
            fontSize: "13px",
          }}
        >
          Logout
        </button>
      </div>
    </nav>
  );
}

export default Navbar;