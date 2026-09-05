import { useEffect, useState } from "react";
import api from "../../api";
import { Table, Spinner } from "react-bootstrap";

function Payments() {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [sortDir, setSortDir] = useState("desc");
  const [page, setPage] = useState(1);
  const [lastPage, setLastPage] = useState(1);
  const [totalPayments, setTotalPayments] = useState(0);

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchPayments();
    }, 300);

    return () => clearTimeout(timer);
  }, [search, statusFilter, sortDir, page]);

  const fetchPayments = async () => {
    try {
      setLoading(true);
      const res = await api.get("/admin/payments", {
        params: {
          search,
          status: statusFilter,
          sort: sortDir,
          page,
        },
      });

      setPayments(res.data.data || []);
      setLastPage(res.data.last_page || 1);
      setTotalPayments(res.data.total || 0);
    } catch (err) {
      console.error("Fetch payments error:", err);
    } finally {
      setLoading(false);
    }
  };

  const toggleSortDir = () => {
    setSortDir((prev) => (prev === "asc" ? "desc" : "asc"));
    setPage(1);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this payment record?")) return;
    try {
      await api.delete(`/admin/payments/${id}`);
      fetchPayments();
    } catch (err) {
      console.error(err);
    }
  };

  const handleDownloadData = () => {
    const csvContent =
      "data:text/csv;charset=utf-8," +
      ["ID,Transaction ID,Customer Name,Customer Email,Booking ID,Amount,Method,Status,Paid At"].join(",") +
      "\n" +
      payments
        .map(
          (p) =>
            `${p.id},"${p.transaction_id}","${p.customer_name}","${p.customer_email}",${p.booking_id},${p.amount},"${p.payment_method}","${p.status}","${p.paid_at || ""}"`
        )
        .join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute(
      "download",
      `payments_${statusFilter.toLowerCase()}.csv`
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Helper formatting for VND currency
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(amount || 0);
  };

  // Helper avatar colors
  const avatarColors = [
    "#3b82f6",
    "#10b981",
    "#f59e0b",
    "#8b5cf6",
    "#ec4899",
    "#06b6d4",
  ];

  // Helper method badges
  const getMethodBadge = (method = "VNPAY") => {
    const m = method.toUpperCase();
    if (m.includes("VNPAY")) {
      return { bg: "#eff6ff", color: "#1d4ed8", border: "#bfdbfe", icon: "fa-university" };
    }
    if (m.includes("MOMO")) {
      return { bg: "#fdf2f8", color: "#be185d", border: "#fbcfe8", icon: "fa-wallet" };
    }
    return { bg: "#f8fafc", color: "#334155", border: "#e2e8f0", icon: "fa-credit-card" };
  };

  // Helper status badges
  const getStatusBadge = (status = "success") => {
    const s = status.toLowerCase();
    if (s === "success" || s === "paid") {
      return { bg: "#dcfce7", color: "#15803d", label: "Success" };
    }
    if (s === "pending") {
      return { bg: "#fef3c7", color: "#b45309", label: "Pending" };
    }
    return { bg: "#fee2e2", color: "#b91c1c", label: "Failed" };
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
            Payment Transactions
          </h3>
          <div
            style={{
              fontSize: "13px",
              color: "#94a3b8",
              fontWeight: "500",
              marginTop: "4px",
            }}
          >
            Home / Dashboard / <span style={{ color: "#475569" }}>Payment</span>
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
              width: "260px",
            }}
          >
            <input
              type="text"
              placeholder="Search code, user or email..."
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
            <span>Download CSV</span>
          </button>

          {/* FILTER DROPDOWN */}
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <i className="fas fa-filter" style={{ color: "#64748b", fontSize: "14px" }} />
            <span style={{ fontSize: "14px", fontWeight: "600", color: "#475569" }}>Status</span>
            <select
              value={statusFilter}
              onChange={(e) => {
                setStatusFilter(e.target.value);
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
              <option value="All">All Statuses</option>
              <option value="success">Success</option>
              <option value="pending">Pending</option>
              <option value="failed">Failed</option>
            </select>
          </div>
        </div>
      </div>

      {/* STATS OVERVIEW CARDS */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
          gap: "16px",
          marginBottom: "24px",
        }}
      >
        <div
          style={{
            background: "#ffffff",
            padding: "20px",
            borderRadius: "16px",
            border: "1px solid #e2e8f0",
            boxShadow: "0 4px 12px rgba(0,0,0,0.02)",
          }}
        >
          <div style={{ fontSize: "12px", fontWeight: "600", color: "#64748b" }}>TOTAL TRANSACTIONS</div>
          <div style={{ fontSize: "24px", fontWeight: "800", color: "#0f172a", marginTop: "4px" }}>
            {totalPayments}
          </div>
        </div>

        <div
          style={{
            background: "#ffffff",
            padding: "20px",
            borderRadius: "16px",
            border: "1px solid #e2e8f0",
            boxShadow: "0 4px 12px rgba(0,0,0,0.02)",
          }}
        >
          <div style={{ fontSize: "12px", fontWeight: "600", color: "#64748b" }}>ACTIVE GATEWAYS</div>
          <div style={{ fontSize: "18px", fontWeight: "700", color: "#2563eb", marginTop: "6px" }}>
            VNPay, MoMo, Visa/Master
          </div>
        </div>

        <div
          style={{
            background: "#ffffff",
            padding: "20px",
            borderRadius: "16px",
            border: "1px solid #e2e8f0",
            boxShadow: "0 4px 12px rgba(0,0,0,0.02)",
          }}
        >
          <div style={{ fontSize: "12px", fontWeight: "600", color: "#64748b" }}>PAYMENT STATUS</div>
          <div style={{ fontSize: "14px", fontWeight: "700", color: "#16a34a", marginTop: "6px" }}>
            ✓ Real-time Sync Active
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
              >
                ID{" "}
                <i
                  className={`fas ${sortDir === "asc" ? "fa-sort-up" : "fa-sort-down"}`}
                  style={{ fontSize: "12px", marginLeft: "4px", color: "#2563eb" }}
                />
              </th>
              <th style={{ padding: "18px 24px", color: "#94a3b8", fontSize: "12px", fontWeight: "600", border: "none" }}>
                Txn Ref Code
              </th>
              <th style={{ padding: "18px 24px", color: "#94a3b8", fontSize: "12px", fontWeight: "600", border: "none" }}>
                Customer Name
              </th>
              <th style={{ padding: "18px 24px", color: "#94a3b8", fontSize: "12px", fontWeight: "600", border: "none" }}>
                Booking Ref
              </th>
              <th style={{ padding: "18px 24px", color: "#94a3b8", fontSize: "12px", fontWeight: "600", border: "none" }}>
                Amount
              </th>
              <th style={{ padding: "18px 24px", color: "#94a3b8", fontSize: "12px", fontWeight: "600", border: "none" }}>
                Method
              </th>
              <th style={{ padding: "18px 24px", color: "#94a3b8", fontSize: "12px", fontWeight: "600", border: "none" }}>
                Status
              </th>
              <th style={{ padding: "18px 24px", color: "#94a3b8", fontSize: "12px", fontWeight: "600", border: "none" }}>
                Paid At
              </th>
              <th style={{ padding: "18px 24px", color: "#94a3b8", fontSize: "12px", fontWeight: "600", border: "none", textAlign: "right" }}>
                Action
              </th>
            </tr>
          </thead>

          <tbody>
            {loading ? (
              <tr>
                <td colSpan="9" className="text-center py-5">
                  <Spinner animation="border" variant="primary" />
                </td>
              </tr>
            ) : payments.length === 0 ? (
              <tr>
                <td colSpan="9" className="text-center py-5 text-muted">
                  No payment transactions found
                </td>
              </tr>
            ) : (
              payments.map((p, idx) => {
                const avatarColor = avatarColors[idx % avatarColors.length];
                const methodBadge = getMethodBadge(p.payment_method);
                const statusBadge = getStatusBadge(p.status);

                return (
                  <tr
                    key={p.id}
                    style={{
                      borderBottom: idx !== payments.length - 1 ? "1px solid #f8fafc" : "none",
                      transition: "background 0.2s ease",
                    }}
                  >
                    {/* PAY ID */}
                    <td style={{ padding: "16px 24px", fontSize: "14px", fontWeight: "700", color: "#1e293b" }}>
                      #{p.id}
                    </td>

                    {/* TXN CODE */}
                    <td style={{ padding: "16px 24px" }}>
                      <span
                        style={{
                          fontFamily: "monospace",
                          fontWeight: "700",
                          fontSize: "13px",
                          color: "#3b82f6",
                          background: "#eff6ff",
                          padding: "4px 8px",
                          borderRadius: "6px",
                        }}
                      >
                        {p.transaction_id}
                      </span>
                    </td>

                    {/* CUSTOMER */}
                    <td style={{ padding: "16px 24px" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                        <div
                          style={{
                            width: "34px",
                            height: "34px",
                            borderRadius: "50%",
                            background: avatarColor,
                            color: "#ffffff",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            fontWeight: "700",
                            fontSize: "13px",
                          }}
                        >
                          {(p.customer_name?.charAt(0) || "C").toUpperCase()}
                        </div>
                        <div>
                          <div style={{ fontSize: "14px", fontWeight: "700", color: "#1e293b" }}>
                            {p.customer_name}
                          </div>
                          <div style={{ fontSize: "12px", color: "#94a3b8" }}>{p.customer_email}</div>
                        </div>
                      </div>
                    </td>

                    {/* BOOKING REF */}
                    <td style={{ padding: "16px 24px", fontSize: "14px", fontWeight: "600", color: "#475569" }}>
                      #BK-{p.booking_id}
                    </td>

                    {/* AMOUNT */}
                    <td style={{ padding: "16px 24px", fontSize: "14px", fontWeight: "800", color: "#0f172a" }}>
                      {formatCurrency(p.amount)}
                    </td>

                    {/* METHOD */}
                    <td style={{ padding: "16px 24px" }}>
                      <span
                        style={{
                          display: "inline-flex",
                          alignItems: "center",
                          gap: "6px",
                          padding: "4px 10px",
                          borderRadius: "8px",
                          fontSize: "12px",
                          fontWeight: "700",
                          background: methodBadge.bg,
                          color: methodBadge.color,
                          border: `1px solid ${methodBadge.border}`,
                        }}
                      >
                        <i className={`fas ${methodBadge.icon}`} style={{ fontSize: "11px" }} />
                        {p.payment_method}
                      </span>
                    </td>

                    {/* STATUS */}
                    <td style={{ padding: "16px 24px" }}>
                      <span
                        style={{
                          display: "inline-block",
                          padding: "4px 12px",
                          borderRadius: "8px",
                          fontSize: "12px",
                          fontWeight: "700",
                          background: statusBadge.bg,
                          color: statusBadge.color,
                        }}
                      >
                        {statusBadge.label}
                      </span>
                    </td>

                    {/* PAID AT */}
                    <td style={{ padding: "16px 24px", fontSize: "13px", color: "#64748b" }}>
                      {p.paid_at || "—"}
                    </td>

                    {/* ACTION */}
                    <td style={{ padding: "16px 24px", textAlign: "right" }}>
                      <button
                        onClick={() => handleDelete(p.id)}
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
                        title="Delete Payment Log"
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
            Showing {payments.length > 0 ? (page - 1) * 10 + 1 : 0}-
            {Math.min(page * 10, totalPayments)} of {totalPayments} Payments (Page {page} of {lastPage})
          </div>

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
                  cursor: "pointer",
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
            >
              <i className="fas fa-chevron-right" style={{ fontSize: "12px" }} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Payments;
