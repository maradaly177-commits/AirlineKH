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
    switch (status) {
      case "paid":
        return "#28a745";
      case "pending":
        return "#fd7e14";
      case "cancelled":
        return "#dc3545";
      default:
        return "#6c757d";
    }
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
          placeholder="Search passenger or flight ID..."
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setCurrentPage(1); // reset page khi search
          }}
        />
      </Form>

      {/* TABLE */}
      <Table striped bordered hover responsive>
        <thead>
          <tr>
            <th>#</th>
            <th>Passenger</th>
            <th>Flight</th>
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
                  {b.passenger ||
                    b.user?.name ||
                    b.tickets?.[0]?.passenger_name ||
                    "Unknown"}
                </td>

                <td>
                  {b.flight?.flight_code ||
                    b.flight?.code ||
                    b.flight?.flight_number ||
                    `#${b.flight?.id || "N/A"}`}
                </td>

                <td>
                  <span
                    style={{
                      padding: "4px 10px",
                      borderRadius: "8px",
                      color: "white",
                      background: getStatusColor(b.status),
                      fontSize: "12px",
                      textTransform: "capitalize",
                    }}
                  >
                    {b.status}
                  </span>
                </td>

                <td>
                  <Button
                    variant="danger"
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
              <td colSpan="5" className="text-center">
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