import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../api";

function Navbar() {
  const navigate = useNavigate();
  const [searchCategory, setSearchCategory] = useState("Users");
  const [searchQuery, setSearchQuery] = useState("");
  const [adminUser, setAdminUser] = useState(() => JSON.parse(localStorage.getItem("user") || "null"));

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const res = await api.get("/admin/profile");
      const userData = res.data?.data || res.data;
      if (userData) {
        setAdminUser(userData);
        localStorage.setItem("user", JSON.stringify(userData));
      }
    } catch (err) {
      console.error("Error fetching navbar admin profile:", err);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    if (searchCategory === "Users") navigate(`/admin/users?search=${searchQuery}`);
    else if (searchCategory === "Flights") navigate(`/admin/flights?search=${searchQuery}`);
    else if (searchCategory === "Bookings") navigate(`/admin/bookings?search=${searchQuery}`);
  };

  return (
    <nav
      style={{
        height: "76px",
        background: "#ffffff",
        borderBottom: "1px solid #f1f5f9",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "0 32px",
        boxShadow: "0 2px 10px rgba(0, 0, 0, 0.02)",
      }}
    >
      {/* SEARCH BAR (CENTER/LEFT) */}
      <form
        onSubmit={handleSearch}
        style={{
          display: "flex",
          alignItems: "center",
          background: "#f8fafc",
          border: "1px solid #e2e8f0",
          borderRadius: "30px",
          padding: "6px 16px",
          width: "480px",
          maxWidth: "100%",
          boxShadow: "inset 0 1px 2px rgba(0,0,0,0.03)",
        }}
      >
        {/* Category Dropdown */}
        <select
          value={searchCategory}
          onChange={(e) => setSearchCategory(e.target.value)}
          style={{
            border: "none",
            background: "transparent",
            fontSize: "14px",
            fontWeight: "600",
            color: "#475569",
            cursor: "pointer",
            outline: "none",
            paddingRight: "8px",
            borderRight: "1px solid #cbd5e1",
            marginRight: "12px",
          }}
        >
          <option value="Users">Users</option>
          <option value="Flights">Flights</option>
          <option value="Bookings">Bookings</option>
        </select>

        {/* Input */}
        <input
          type="text"
          placeholder="Search..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          style={{
            border: "none",
            background: "transparent",
            outline: "none",
            flex: 1,
            fontSize: "14px",
            color: "#1e293b",
          }}
        />

        {/* Search Icon */}
        <button
          type="submit"
          style={{
            border: "none",
            background: "transparent",
            color: "#3b82f6",
            cursor: "pointer",
            fontSize: "15px",
            padding: "4px 8px",
          }}
        >
          <i className="fas fa-search" />
        </button>
      </form>

      {/* RIGHT UTILITIES & USER PROFILE */}
      <div style={{ display: "flex", alignItems: "center", gap: "20px" }}>
        {/* CHAT ICON */}
        <button
          style={{
            width: "40px",
            height: "40px",
            borderRadius: "50%",
            border: "none",
            background: "#f1f5f9",
            color: "#3b82f6",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            cursor: "pointer",
            fontSize: "16px",
            transition: "all 0.2s ease",
          }}
          title="Messages"
        >
          <i className="fas fa-comment-dots" />
        </button>

        {/* NOTIFICATION BELL */}
        <button
          style={{
            width: "40px",
            height: "40px",
            borderRadius: "50%",
            border: "none",
            background: "#f1f5f9",
            color: "#3b82f6",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            cursor: "pointer",
            fontSize: "16px",
            position: "relative",
            transition: "all 0.2s ease",
          }}
          title="Notifications"
        >
          <i className="fas fa-bell" />
          <span
            style={{
              position: "absolute",
              top: "9px",
              right: "9px",
              width: "8px",
              height: "8px",
              borderRadius: "50%",
              backgroundColor: "#ef4444",
              border: "2px solid #ffffff",
            }}
          />
        </button>

        {/* USER PROFILE DROPDOWN */}
        <div
          onClick={() => navigate("/admin/profile")}
          style={{
            display: "flex",
            alignItems: "center",
            gap: "10px",
            cursor: "pointer",
            padding: "4px 8px",
            borderRadius: "20px",
            transition: "background 0.2s ease",
          }}
        >
          {/* Avatar */}
          <div
            style={{
              width: "40px",
              height: "40px",
              borderRadius: "50%",
              background: "linear-gradient(135deg, #3b82f6, #1d4ed8)",
              color: "#ffffff",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontWeight: "700",
              fontSize: "16px",
              boxShadow: "0 2px 8px rgba(59, 130, 246, 0.3)",
            }}
          >
            {(adminUser?.name?.charAt(0) || "Q").toUpperCase()}
          </div>

          {/* User Name */}
          <span
            style={{
              fontSize: "15px",
              fontWeight: "600",
              color: "#1e293b",
              display: "flex",
              alignItems: "center",
              gap: "6px",
            }}
          >
            {adminUser?.name || "Quang Admin"}
            <i className="fas fa-chevron-down" style={{ fontSize: "11px", color: "#94a3b8" }} />
          </span>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;