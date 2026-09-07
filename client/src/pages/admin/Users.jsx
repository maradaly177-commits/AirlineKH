import { useEffect, useState } from "react";
import api from "../../api";
import { Table, Spinner } from "react-bootstrap";

function Users() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("All Users");
  const [sortDir, setSortDir] = useState("asc"); // 'asc' = 1 -> N, 'desc' = N -> 1
  const [page, setPage] = useState(1);
  const [lastPage, setLastPage] = useState(1);
  const [totalUsers, setTotalUsers] = useState(0);

  // Fetch users when search, roleFilter, sortDir, or page changes
  useEffect(() => {
    const timer = setTimeout(() => {
      fetchUsers();
    }, 300);

    return () => clearTimeout(timer);
  }, [search, roleFilter, sortDir, page]);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const res = await api.get("/admin/users", {
        params: {
          search,
          role: roleFilter,
          sort: sortDir,
          page,
        },
      });

      setUsers(res.data.data || []);
      setLastPage(res.data.last_page || 1);
      setTotalUsers(res.data.total || 0);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const toggleSortDir = () => {
    setSortDir((prev) => (prev === "asc" ? "desc" : "asc"));
    setPage(1);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this user?")) return;
    try {
      await api.delete(`/admin/users/${id}`);
      fetchUsers();
    } catch (err) {
      console.error(err);
    }
  };

  const handleDownloadData = () => {
    const csvContent =
      "data:text/csv;charset=utf-8," +
      ["ID,Name,Email,Tier,Role,Created At"].join(",") +
      "\n" +
      users
        .map(
          (u) =>
            `${u.id},"${u.name}","${u.email}","${u.membership_tier || "Standard"}","${u.role}","${
              u.created_at || ""
            }"`
        )
        .join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute(
      "download",
      `users_${roleFilter.toLowerCase().replace(/\s+/g, "_")}.csv`
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Helper avatar colors
  const avatarColors = [
    "#f59e0b",
    "#10b981",
    "#3b82f6",
    "#8b5cf6",
    "#ec4899",
    "#06b6d4",
    "#f97316",
  ];

  // Helper membership tier badge color
  const getTierBadgeStyle = (tier = "Standard") => {
    const t = tier.toLowerCase();
    if (t === "vip" || t === "platinum") {
      return { background: "#7c3aed", color: "#ffffff" };
    }
    if (t === "gold") {
      return { background: "#d97706", color: "#ffffff" };
    }
    return { background: "#e2e8f0", color: "#334155" };
  };

  return (
    <div style={{ maxWidth: "1600px", margin: "0 auto" }}>
      {/* TOP HEADER & BREADCRUMBS */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "24px",
          flexWrap: "wrap",
          gap: "16px",
        }}
      >
        <div>
          <h3
            style={{
              fontSize: "24px",
              fontWeight: "800",
              color: "#0f172a",
              margin: 0,
              letterSpacing: "-0.5px",
            }}
          >
            Users Data
          </h3>
          <div
            style={{
              fontSize: "13px",
              color: "#94a3b8",
              fontWeight: "500",
              marginTop: "4px",
            }}
          >
            Home / Dashboard / <span style={{ color: "#475569" }}>Users Data</span>
          </div>
        </div>

        {/* TOP RIGHT ACTION BAR */}
        <div style={{ display: "flex", alignItems: "center", gap: "16px", flexWrap: "wrap" }}>
          {/* SEARCH INPUT */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              background: "#ffffff",
              border: "1px solid #e2e8f0",
              borderRadius: "12px",
              padding: "6px 14px",
              width: "240px",
            }}
          >
            <input
              type="text"
              placeholder="Search name or email..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
              style={{
                border: "none",
                background: "transparent",
                outline: "none",
                fontSize: "13px",
                width: "100%",
                color: "#1e293b",
              }}
            />
            <i className="fas fa-search" style={{ color: "#94a3b8", fontSize: "13px" }} />
          </div>

          {/* DOWNLOAD DATA BUTTON */}
          <button
            onClick={handleDownloadData}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              background: "transparent",
              border: "none",
              color: "#475569",
              fontSize: "14px",
              fontWeight: "600",
              cursor: "pointer",
            }}
          >
            <i className="fas fa-download" style={{ fontSize: "14px", color: "#64748b" }} />
            <span>Download Data</span>
          </button>

          {/* FILTER BUTTON & DROPDOWN */}
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <i className="fas fa-filter" style={{ color: "#64748b", fontSize: "14px" }} />
            <span style={{ fontSize: "14px", fontWeight: "600", color: "#475569" }}>Filter</span>
            <select
              value={roleFilter}
              onChange={(e) => {
                setRoleFilter(e.target.value);
                setPage(1);
              }}
              style={{
                border: "1px solid #e2e8f0",
                background: "#ffffff",
                borderRadius: "12px",
                padding: "8px 16px",
                fontSize: "14px",
                fontWeight: "600",
                color: "#334155",
                cursor: "pointer",
                outline: "none",
                boxShadow: "0 1px 3px rgba(0,0,0,0.02)",
              }}
            >
              <option value="All Users">All Users</option>
              <option value="Admin">Admin</option>
              <option value="User">User</option>
            </select>
          </div>
        </div>
      </div>

      {/* MAIN DATA TABLE CARD */}
      <div
        style={{
          background: "#ffffff",
          borderRadius: "20px",
          boxShadow: "0 10px 30px rgba(0, 0, 0, 0.03)",
          border: "1px solid rgba(226, 232, 240, 0.8)",
          overflow: "hidden",
        }}
      >
        <Table hover responsive style={{ marginBottom: 0, verticalAlign: "middle" }}>
          <thead>
            <tr style={{ background: "#fafafa", borderBottom: "1px solid #f1f5f9" }}>
              {/* ID SORTABLE HEADER */}
              <th
                onClick={toggleSortDir}
                style={{
                  padding: "18px 24px",
                  color: "#334155",
                  fontSize: "12px",
                  fontWeight: "700",
                  border: "none",
                  cursor: "pointer",
                  userSelect: "none",
                }}
                title="Click to toggle ID sorting (1->N or N->1)"
              >
                ID{" "}
                <i
                  className={`fas ${sortDir === "asc" ? "fa-sort-up" : "fa-sort-down"}`}
                  style={{ fontSize: "12px", marginLeft: "4px", color: "#2563eb" }}
                />
              </th>
              <th style={{ padding: "18px 24px", color: "#94a3b8", fontSize: "12px", fontWeight: "600", border: "none" }}>
                Full Name <i className="fas fa-sort" style={{ fontSize: "10px", marginLeft: "4px", color: "#cbd5e1" }} />
              </th>
              <th style={{ padding: "18px 24px", color: "#94a3b8", fontSize: "12px", fontWeight: "600", border: "none" }}>
                Email
              </th>
              <th style={{ padding: "18px 24px", color: "#94a3b8", fontSize: "12px", fontWeight: "600", border: "none" }}>
                Tier
              </th>
              <th style={{ padding: "18px 24px", color: "#94a3b8", fontSize: "12px", fontWeight: "600", border: "none" }}>
                Role <i className="fas fa-sort" style={{ fontSize: "10px", marginLeft: "4px", color: "#cbd5e1" }} />
              </th>
              <th style={{ padding: "18px 24px", color: "#94a3b8", fontSize: "12px", fontWeight: "600", border: "none" }}>
                Status <i className="fas fa-sort" style={{ fontSize: "10px", marginLeft: "4px", color: "#cbd5e1" }} />
              </th>
              <th style={{ padding: "18px 24px", color: "#94a3b8", fontSize: "12px", fontWeight: "600", border: "none" }}>
                Created Date <i className="fas fa-sort" style={{ fontSize: "10px", marginLeft: "4px", color: "#cbd5e1" }} />
              </th>
              <th style={{ padding: "18px 24px", color: "#94a3b8", fontSize: "12px", fontWeight: "600", border: "none", textAlign: "right" }}>
                Action
              </th>
            </tr>
          </thead>

          <tbody>
            {loading ? (
              <tr>
                <td colSpan="8" className="text-center py-5">
                  <Spinner animation="border" variant="primary" />
                </td>
              </tr>
            ) : users.length === 0 ? (
              <tr>
                <td colSpan="8" className="text-center py-5 text-muted">
                  No users found
                </td>
              </tr>
            ) : (
              users.map((u, idx) => {
                const avatarColor = avatarColors[idx % avatarColors.length];
                const isRoleAdmin = u.role === "admin";
                const isRoleUser = u.role === "user" || u.role === "member";
                const tierStyle = getTierBadgeStyle(u.membership_tier);

                return (
                  <tr
                    key={u.id}
                    style={{
                      borderBottom: idx !== users.length - 1 ? "1px solid #f8fafc" : "none",
                      transition: "background 0.2s ease",
                    }}
                  >
                    {/* REAL DATABASE ID */}
                    <td style={{ padding: "16px 24px", fontSize: "14px", fontWeight: "700", color: "#1e293b" }}>
                      {u.id}
                    </td>

                    {/* FULL NAME WITH AVATAR */}
                    <td style={{ padding: "16px 24px" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                        <div
                          style={{
                            width: "36px",
                            height: "36px",
                            borderRadius: "50%",
                            background: avatarColor,
                            color: "#ffffff",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            fontWeight: "700",
                            fontSize: "14px",
                            boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
                          }}
                        >
                          {(u.name?.charAt(0) || "U").toUpperCase()}
                        </div>
                        <span style={{ fontSize: "14px", fontWeight: "700", color: "#1e293b" }}>
                          {u.name}
                        </span>
                      </div>
                    </td>

                    {/* EMAIL */}
                    <td style={{ padding: "16px 24px", fontSize: "14px", color: "#475569" }}>
                      {u.email}
                    </td>

                    {/* MEMBERSHIP TIER (REAL DB FIELD) */}
                    <td style={{ padding: "16px 24px" }}>
                      <span
                        style={{
                          display: "inline-block",
                          padding: "4px 12px",
                          borderRadius: "6px",
                          fontSize: "12px",
                          fontWeight: "700",
                          background: tierStyle.background,
                          color: tierStyle.color,
                        }}
                      >
                        {u.membership_tier || "Standard"}
                      </span>
                    </td>

                    {/* ROLE BADGE FROM DATABASE */}
                    <td style={{ padding: "16px 24px" }}>
                      <span
                        style={{
                          display: "inline-block",
                          padding: "5px 14px",
                          borderRadius: "8px",
                          fontSize: "12px",
                          fontWeight: "700",
                          color: "#ffffff",
                          backgroundColor: isRoleAdmin ? "#06b6d4" : isRoleUser ? "#22c55e" : "#f97316",
                        }}
                      >
                        {isRoleAdmin ? "Admin" : isRoleUser ? "User" : u.role}
                      </span>
                    </td>

                    {/* STATUS BADGE */}
                    <td style={{ padding: "16px 24px" }}>
                      <span
                        style={{
                          display: "inline-block",
                          padding: "5px 14px",
                          borderRadius: "8px",
                          fontSize: "12px",
                          fontWeight: "700",
                          color: "#ffffff",
                          backgroundColor: "#6366f1",
                        }}
                      >
                        Active
                      </span>
                    </td>

                    {/* REAL CREATED_AT DATE FROM DB */}
                    <td style={{ padding: "16px 24px", fontSize: "13px", color: "#64748b" }}>
                      {u.created_at || "—"}
                    </td>

                    {/* ACTION */}
                    <td style={{ padding: "16px 24px", textAlign: "right" }}>
                      <button
                        onClick={() => handleDelete(u.id)}
                        style={{
                          border: "none",
                          background: "#fee2e2",
                          color: "#ef4444",
                          width: "32px",
                          height: "32px",
                          borderRadius: "8px",
                          display: "inline-flex",
                          alignItems: "center",
                          justifyContent: "center",
                          cursor: "pointer",
                          transition: "all 0.2s ease",
                        }}
                        title="Delete User"
                      >
                        <i className="fas fa-trash-alt" style={{ fontSize: "13px" }} />
                      </button>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </Table>

        {/* TABLE FOOTER / PAGINATION */}
        <div
          style={{
            padding: "16px 24px",
            background: "#ffffff",
            borderTop: "1px solid #f1f5f9",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <div style={{ fontSize: "14px", color: "#94a3b8", fontWeight: "500" }}>
            Showing {users.length > 0 ? (page - 1) * 10 + 1 : 0}-
            {Math.min(page * 10, totalUsers)} of {totalUsers} Users (Page {page} of {lastPage})
          </div>

          {/* NAV ARROWS AND PAGE NUMBERS */}
          <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
            <button
              disabled={page <= 1}
              onClick={() => setPage(page - 1)}
              style={{
                border: "1px solid #e2e8f0",
                background: page <= 1 ? "#f8fafc" : "#ffffff",
                color: page <= 1 ? "#cbd5e1" : "#475569",
                borderRadius: "8px",
                width: "36px",
                height: "36px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                cursor: page <= 1 ? "not-allowed" : "pointer",
              }}
              title="Previous Page"
            >
              <i className="fas fa-chevron-left" style={{ fontSize: "12px" }} />
            </button>

            {Array.from({ length: lastPage }, (_, i) => i + 1).map((p) => (
              <button
                key={p}
                onClick={() => setPage(p)}
                style={{
                  border: p === page ? "none" : "1px solid #e2e8f0",
                  background: p === page ? "#2563eb" : "#ffffff",
                  color: p === page ? "#ffffff" : "#475569",
                  borderRadius: "8px",
                  width: "36px",
                  height: "36px",
                  fontSize: "13px",
                  fontWeight: "600",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  cursor: page <= 1 ? "pointer" : "pointer",
                }}
              >
                {p}
              </button>
            ))}

            <button
              disabled={page >= lastPage}
              onClick={() => setPage(page + 1)}
              style={{
                border: "1px solid #e2e8f0",
                background: page >= lastPage ? "#f8fafc" : "#ffffff",
                color: page >= lastPage ? "#cbd5e1" : "#475569",
                borderRadius: "8px",
                width: "36px",
                height: "36px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                cursor: page >= lastPage ? "not-allowed" : "pointer",
              }}
              title="Next Page"
            >
              <i className="fas fa-chevron-right" style={{ fontSize: "12px" }} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Users;