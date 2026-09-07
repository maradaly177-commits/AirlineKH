import { useEffect, useState } from "react";
import api from "../../api";
import { Spinner, Alert } from "react-bootstrap";

function Profile() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [message, setMessage] = useState({ type: "", text: "" });

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      const response = await api.get("/admin/profile");
      const data = response.data?.data || response.data;

      setUser(data);
      setFormData({
        name: data.name || "",
        email: data.email || "",
        password: "",
        confirmPassword: "",
      });
    } catch (error) {
      console.error("Profile API error:", error);
      setMessage({ type: "danger", text: "Failed to load admin profile data." });
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage({ type: "", text: "" });

    if (formData.password && formData.password !== formData.confirmPassword) {
      setMessage({ type: "danger", text: "New password and confirmation do not match!" });
      return;
    }

    try {
      setSaving(true);
      const payload = {
        name: formData.name,
        email: formData.email,
      };

      if (formData.password) {
        payload.password = formData.password;
      }

      const res = await api.put("/admin/profile", payload);
      const updatedUser = res.data?.data || res.data;

      setUser(updatedUser);
      setFormData({
        ...formData,
        password: "",
        confirmPassword: "",
      });

      setMessage({ type: "success", text: "Profile settings updated successfully!" });
    } catch (err) {
      console.error(err);
      setMessage({
        type: "danger",
        text: err.response?.data?.message || "Error updating profile. Please try again.",
      });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "60vh",
        }}
      >
        <Spinner animation="border" variant="primary" />
      </div>
    );
  }

  const roleName = user?.role || user?.roles?.[0]?.name || "Admin";
  const tierName = user?.membership_tier || "Standard";

  return (
    <div style={{ maxWidth: "1400px", margin: "0 auto" }}>
      {/* HEADER & BREADCRUMBS */}
      <div style={{ marginBottom: "24px" }}>
        <h3
          style={{
            fontSize: "24px",
            fontWeight: "800",
            color: "#0f172a",
            margin: 0,
            letterSpacing: "-0.5px",
          }}
        >
          Admin Profile
        </h3>
        <div
          style={{
            fontSize: "13px",
            color: "#94a3b8",
            fontWeight: "500",
            marginTop: "4px",
          }}
        >
          Home / Dashboard / <span style={{ color: "#475569" }}>Profile</span>
        </div>
      </div>

      {/* HERO BANNER CARD */}
      <div
        style={{
          background: "linear-gradient(135deg, #1e3a8a 0%, #2563eb 50%, #0284c7 100%)",
          borderRadius: "24px",
          padding: "32px",
          color: "#ffffff",
          position: "relative",
          overflow: "hidden",
          boxShadow: "0 10px 25px rgba(37, 99, 235, 0.15)",
          marginBottom: "32px",
        }}
      >
        {/* DECORATIVE BACKGROUND */}
        <div
          style={{
            position: "absolute",
            right: "-20px",
            top: "-30px",
            opacity: 0.12,
            pointerEvents: "none",
          }}
        >
          <i className="fas fa-user-shield" style={{ fontSize: "220px", color: "#ffffff" }} />
        </div>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "24px",
            position: "relative",
            zIndex: 2,
            flexWrap: "wrap",
          }}
        >
          {/* AVATAR CIRCLE */}
          <div
            style={{
              width: "90px",
              height: "90px",
              borderRadius: "50%",
              background: "linear-gradient(135deg, #f59e0b, #eab308)",
              color: "#ffffff",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "36px",
              fontWeight: "800",
              boxShadow: "0 8px 20px rgba(0,0,0,0.2)",
              border: "4px solid rgba(255, 255, 255, 0.3)",
            }}
          >
            {(user?.name?.charAt(0) || "A").toUpperCase()}
          </div>

          <div>
            <div style={{ display: "flex", alignItems: "center", gap: "12px", flexWrap: "wrap" }}>
              <h2 style={{ fontSize: "26px", fontWeight: "800", margin: 0 }}>{user?.name}</h2>
              <span
                style={{
                  background: "rgba(255, 255, 255, 0.2)",
                  backdropFilter: "blur(10px)",
                  padding: "4px 12px",
                  borderRadius: "20px",
                  fontSize: "12px",
                  fontWeight: "700",
                  letterSpacing: "0.5px",
                  textTransform: "uppercase",
                  border: "1px solid rgba(255, 255, 255, 0.3)",
                }}
              >
                <i className="fas fa-shield-alt" style={{ marginRight: "6px" }} />
                {roleName}
              </span>
            </div>

            <div
              style={{
                fontSize: "14px",
                color: "rgba(255, 255, 255, 0.85)",
                marginTop: "6px",
                display: "flex",
                alignItems: "center",
                gap: "16px",
                flexWrap: "wrap",
              }}
            >
              <span>
                <i className="fas fa-envelope" style={{ marginRight: "6px" }} />
                {user?.email}
              </span>
              <span>•</span>
              <span>
                <i className="fas fa-crown" style={{ marginRight: "6px", color: "#fde047" }} />
                {tierName} Tier
              </span>
              <span>•</span>
              <span>
                <i className="fas fa-id-badge" style={{ marginRight: "6px" }} />
                ID #{user?.id}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* ALERT MESSAGES */}
      {message.text && (
        <Alert
          variant={message.type}
          onClose={() => setMessage({ type: "", text: "" })}
          dismissible
          style={{ borderRadius: "12px", fontWeight: "600" }}
        >
          {message.text}
        </Alert>
      )}

      {/* MAIN FORM AND INFO GRID */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(340px, 1fr))",
          gap: "24px",
        }}
      >
        {/* EDIT PROFILE FORM CARD */}
        <div
          style={{
            background: "#ffffff",
            borderRadius: "20px",
            padding: "28px",
            boxShadow: "0 10px 30px rgba(0, 0, 0, 0.03)",
            border: "1px solid #e2e8f0",
            gridColumn: "span 2",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "10px",
              marginBottom: "24px",
              borderBottom: "1px solid #f1f5f9",
              paddingBottom: "16px",
            }}
          >
            <i className="fas fa-user-edit" style={{ fontSize: "18px", color: "#2563eb" }} />
            <h5 style={{ margin: 0, fontWeight: "700", color: "#0f172a" }}>Edit Profile Details</h5>
          </div>

          <form onSubmit={handleSubmit}>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
                gap: "20px",
                marginBottom: "24px",
              }}
            >
              {/* FULL NAME */}
              <div>
                <label
                  style={{
                    fontSize: "13px",
                    fontWeight: "700",
                    color: "#475569",
                    marginBottom: "8px",
                    display: "block",
                  }}
                >
                  Full Name
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                  style={{
                    width: "100%",
                    padding: "10px 16px",
                    borderRadius: "12px",
                    border: "1px solid #cbd5e1",
                    outline: "none",
                    fontSize: "14px",
                    color: "#1e293b",
                    background: "#ffffff",
                  }}
                />
              </div>

              {/* EMAIL */}
              <div>
                <label
                  style={{
                    fontSize: "13px",
                    fontWeight: "700",
                    color: "#475569",
                    marginBottom: "8px",
                    display: "block",
                  }}
                >
                  Email Address
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                  style={{
                    width: "100%",
                    padding: "10px 16px",
                    borderRadius: "12px",
                    border: "1px solid #cbd5e1",
                    outline: "none",
                    fontSize: "14px",
                    color: "#1e293b",
                    background: "#ffffff",
                  }}
                />
              </div>

              {/* NEW PASSWORD */}
              <div>
                <label
                  style={{
                    fontSize: "13px",
                    fontWeight: "700",
                    color: "#475569",
                    marginBottom: "8px",
                    display: "block",
                  }}
                >
                  New Password <span style={{ fontWeight: "400", color: "#94a3b8" }}>(Leave blank to keep unchanged)</span>
                </label>
                <input
                  type="password"
                  name="password"
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={handleInputChange}
                  style={{
                    width: "100%",
                    padding: "10px 16px",
                    borderRadius: "12px",
                    border: "1px solid #cbd5e1",
                    outline: "none",
                    fontSize: "14px",
                    color: "#1e293b",
                    background: "#ffffff",
                  }}
                />
              </div>

              {/* CONFIRM PASSWORD */}
              <div>
                <label
                  style={{
                    fontSize: "13px",
                    fontWeight: "700",
                    color: "#475569",
                    marginBottom: "8px",
                    display: "block",
                  }}
                >
                  Confirm New Password
                </label>
                <input
                  type="password"
                  name="confirmPassword"
                  placeholder="••••••••"
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  style={{
                    width: "100%",
                    padding: "10px 16px",
                    borderRadius: "12px",
                    border: "1px solid #cbd5e1",
                    outline: "none",
                    fontSize: "14px",
                    color: "#1e293b",
                    background: "#ffffff",
                  }}
                />
              </div>
            </div>

            {/* SUBMIT BUTTON */}
            <div style={{ display: "flex", justifyContent: "flex-end" }}>
              <button
                type="submit"
                disabled={saving}
                style={{
                  background: "linear-gradient(135deg, #2563eb, #1d4ed8)",
                  color: "#ffffff",
                  border: "none",
                  padding: "12px 28px",
                  borderRadius: "12px",
                  fontSize: "14px",
                  fontWeight: "700",
                  cursor: saving ? "not-allowed" : "pointer",
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  boxShadow: "0 4px 12px rgba(37, 99, 235, 0.25)",
                }}
              >
                {saving ? (
                  <>
                    <Spinner animation="border" size="sm" />
                    <span>Saving Changes...</span>
                  </>
                ) : (
                  <>
                    <i className="fas fa-save" />
                    <span>Save Profile Changes</span>
                  </>
                )}
              </button>
            </div>
          </form>
        </div>

        {/* SYSTEM ACTIVITY & SYSTEM INFO SIDEBAR CARD */}
        <div
          style={{
            background: "#ffffff",
            borderRadius: "20px",
            padding: "28px",
            boxShadow: "0 10px 30px rgba(0, 0, 0, 0.03)",
            border: "1px solid #e2e8f0",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "10px",
              marginBottom: "20px",
              borderBottom: "1px solid #f1f5f9",
              paddingBottom: "16px",
            }}
          >
            <i className="fas fa-info-circle" style={{ fontSize: "18px", color: "#2563eb" }} />
            <h5 style={{ margin: 0, fontWeight: "700", color: "#0f172a" }}>Account Overview</h5>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                padding: "12px 16px",
                background: "#f8fafc",
                borderRadius: "12px",
              }}
            >
              <span style={{ fontSize: "13px", color: "#64748b", fontWeight: "600" }}>Account ID</span>
              <span style={{ fontSize: "14px", fontWeight: "700", color: "#0f172a" }}>#{user?.id}</span>
            </div>

            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                padding: "12px 16px",
                background: "#f8fafc",
                borderRadius: "12px",
              }}
            >
              <span style={{ fontSize: "13px", color: "#64748b", fontWeight: "600" }}>System Role</span>
              <span
                style={{
                  fontSize: "12px",
                  fontWeight: "700",
                  color: "#06b6d4",
                  background: "#ecfeff",
                  padding: "4px 10px",
                  borderRadius: "6px",
                }}
              >
                {roleName.toUpperCase()}
              </span>
            </div>

            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                padding: "12px 16px",
                background: "#f8fafc",
                borderRadius: "12px",
              }}
            >
              <span style={{ fontSize: "13px", color: "#64748b", fontWeight: "600" }}>Tier Level</span>
              <span
                style={{
                  fontSize: "12px",
                  fontWeight: "700",
                  color: "#d97706",
                  background: "#fef3c7",
                  padding: "4px 10px",
                  borderRadius: "6px",
                }}
              >
                {tierName}
              </span>
            </div>

            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                padding: "12px 16px",
                background: "#f8fafc",
                borderRadius: "12px",
              }}
            >
              <span style={{ fontSize: "13px", color: "#64748b", fontWeight: "600" }}>Registered Date</span>
              <span style={{ fontSize: "13px", fontWeight: "600", color: "#334155" }}>
                {user?.created_at || "2026-08-22 22:44:26"}
              </span>
            </div>

            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                padding: "12px 16px",
                background: "#f0fdf4",
                borderRadius: "12px",
                border: "1px solid #bbf7d0",
              }}
            >
              <span style={{ fontSize: "13px", color: "#166534", fontWeight: "600" }}>Account Status</span>
              <span style={{ fontSize: "12px", fontWeight: "700", color: "#15803d" }}>✓ Active & Verified</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Profile;