import { useEffect, useState } from "react";
import api from "../../api";
import { Table, Button, Spinner, Form } from "react-bootstrap";

function Bookings() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  // ✅ PAGINATION STATE
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    setLoading(true);

    try {
      const token = localStorage.getItem("access_token");

      const response = await api.get("/admin/bookings", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setBookings(response.data.data || []);
    } catch (error) {
      console.log("API error:", error);
      setBookings([]);
    } finally {
      setLoading(false);
    }
  };

  const deleteBooking = async (id) => {
    const confirmDelete = window.confirm("Delete this booking?");
    if (!confirmDelete) return;

    try {
      const token = localStorage.getItem("access_token");

      await api.delete(`/admin/bookings/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setBookings((prev) => prev.filter((b) => b.id !== id));
    } catch (error) {
      console.log("Delete error:", error);
    }
  };

  // ================= FILTER =================
  const filteredBookings = bookings.filter((b) => {
    const keyword = search.toLowerCase();

    const passenger =
      (b.passenger ||
        b.user?.name ||
        b.tickets?.[0]?.passenger_name ||
        "")
        .toLowerCase();

    const flight =
      (b.flight?.flight_code ||
        b.flight?.code ||
        b.flight?.flight_number ||
        b.flight?.id?.toString() ||
        "")
        .toLowerCase();

    const route =
      `${b.flight?.from || b.flight?.departureAirport?.city || ""} ${
        b.flight?.to || b.flight?.arrivalAirport?.city || ""
      }`.toLowerCase();

    const price =
      (b.total_price || b.price || "").toString().toLowerCase();

    return (
      passenger.includes(keyword) ||
      flight.includes(keyword) ||
      route.includes(keyword) ||
      price.includes(keyword)
    );
  });

  // ================= PAGINATION =================
  const indexOfLast = currentPage * itemsPerPage;
  const indexOfFirst = indexOfLast - itemsPerPage;
  const currentBookings = filteredBookings.slice(indexOfFirst, indexOfLast);

  const totalPages = Math.ceil(filteredBookings.length / itemsPerPage);

  const changePage = (page) => {
    setCurrentPage(page);
  };

  // ================= STATUS COLOR =================
  const getStatusColor = (status) => {
    const s = String(status).toLowerCase();
    if (s === "paid" || s === "completed" || s === "success") return "#10b981";
    if (s === "pending") return "#f59e0b";
    if (s === "cancelled") return "#ef4444";
    return "#6b7280";
  };

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center vh-100">
        <Spinner animation="border" />
      </div>
    );
  }

  return (
    <div className="container mt-4">
      <h2 className="mb-3">Admin Bookings Management</h2>

      {/* SEARCH */}
      <Form className="mb-3">
        <Form.Control
          type="text"
          placeholder="Search passenger, PNR code, or flight..."
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setCurrentPage(1); // reset page khi search
          }}
        />
      </Form>

      {/* TABLE */}
      <Table striped bordered hover responsive align="middle">
        <thead>
          <tr>
            <th>#</th>
            <th>PNR Code</th>
            <th>Passenger</th>
            <th>Flight & Route</th>
            <th>Total Price</th>
            <th>Status</th>
            <th>Action</th>
          </tr>
        </thead>

        <tbody>
          {currentBookings.length > 0 ? (
            currentBookings.map((b, index) => (
              <tr key={b.id}>
                <td>{indexOfFirst + index + 1}</td>

                <td>
                  <strong>{b.pnr_code || b.pnr || `#${b.id}`}</strong>
                </td>

                <td>
                  {b.passenger ||
                    b.user?.name ||
                    b.tickets?.[0]?.passenger_name ||
                    "Guest Customer"}
                </td>

                <td>
                  <div>
                    <strong>
                      {b.flight?.flight_number || b.flight?.flight_code || b.flight?.code || "N/A"}
                    </strong>
                  </div>
                  <small className="text-muted">
                    {b.flight?.departureAirport?.city || b.flight?.departure_airport?.city || ""}
                    {b.flight?.departureAirport || b.flight?.arrivalAirport ? " → " : ""}
                    {b.flight?.arrivalAirport?.city || b.flight?.arrival_airport?.city || ""}
                  </small>
                </td>

                <td>
                  <strong>
                    {Number(b.total_amount || b.total_price || 0).toLocaleString("vi-VN")} ₫
                  </strong>
                </td>

                <td>
                  <span
                    style={{
                      padding: "5px 12px",
                      borderRadius: "12px",
                      color: "white",
                      background: getStatusColor(b.status),
                      fontSize: "12px",
                      fontWeight: "600",
                      textTransform: "uppercase",
                      letterSpacing: "0.5px",
                    }}
                  >
                    {b.status}
                  </span>
                </td>

                <td>
                  <Button
                    variant="outline-danger"
                    size="sm"
                    onClick={() => deleteBooking(b.id)}
                  >
                    Delete
                  </Button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="7" className="text-center py-4 text-muted">
                No bookings found
              </td>
            </tr>
          )}
        </tbody>
      </Table>

      {/* PAGINATION UI */}
      <div className="d-flex justify-content-end mt-3">
      <div
        className="d-flex align-items-center gap-2 px-2 py-1"
        style={{
          border: "1px solid #ddd",
          borderRadius: "6px",
          fontSize: "13px",
          background: "#fff",
        }}
      >
    <Button
      size="sm"
      variant="light"
      disabled={currentPage === 1}
      onClick={() => setCurrentPage(currentPage - 1)}
      style={{ padding: "2px 8px", fontSize: "12px" }}
    >
      ‹
    </Button>

    <span style={{ minWidth: "60px", textAlign: "center" }}>
      {currentPage} / {totalPages || 1}
    </span>

    <Button
      size="sm"
      variant="light"
      disabled={currentPage === totalPages || totalPages === 0}
      onClick={() => setCurrentPage(currentPage + 1)}
      style={{ padding: "2px 8px", fontSize: "12px" }}
    >
      ›
    </Button>
  </div>
</div>
    </div>
  );
}

export default Bookings;