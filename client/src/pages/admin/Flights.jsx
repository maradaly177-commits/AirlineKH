import { useEffect, useState, useCallback } from "react";
import api from "../../api";
import {
  Table,
  Button,
  Modal,
  Form,
  Spinner,
  Badge,
  Card,
  Row,
  Col,
  Pagination,
} from "react-bootstrap";

function Flights() {
  const [flights, setFlights] = useState([]);
  const [loading, setLoading] = useState(false);

  const [show, setShow] = useState(false);
  const [editId, setEditId] = useState(null);

  const [searchInput, setSearchInput] = useState("");
  const [search, setSearch] = useState("");

  const [dateInput, setDateInput] = useState("");
  const [dateFilter, setDateFilter] = useState("");

  const [page, setPage] = useState(1);
  const [lastPage, setLastPage] = useState(1);

  const [saving, setSaving] = useState(false);

  const [airports, setAirports] = useState([]);

  const emptyForm = {
    flight_number: "",
    departure_airport_id: "",
    arrival_airport_id: "",
    departure_time: "",
    arrival_time: "",
    aircraft_id: "",
    base_price: "",
    available_seats: "",
    status: "scheduled",
  };

  const [form, setForm] = useState(emptyForm);

  // debounce search & date
  useEffect(() => {
    const t = setTimeout(() => {
      setSearch(searchInput);
      setDateFilter(dateInput);
      setPage(1);
    }, 400);

    return () => clearTimeout(t);
  }, [searchInput, dateInput]);

  // FETCH FLIGHTS
  const fetchFlights = useCallback(async () => {
    try {
      setLoading(true);

      const token = localStorage.getItem("access_token");

      const res = await api.get("/admin/flights", {
        params: { search, date: dateFilter, page },
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setFlights(res.data.data || []);
      setLastPage(res.data.meta?.last_page || 1);
    } catch (err) {
      console.log(err);
      setFlights([]);
    } finally {
      setLoading(false);
    }
  }, [search, dateFilter, page]);

  useEffect(() => {
    fetchFlights();
  }, [fetchFlights]);

  // FETCH AIRPORTS (ĐÚNG BACKEND)
  const fetchAirports = async () => {
    try {
      const token = localStorage.getItem("access_token");

      const res = await api.get("/airports", {
        headers: { Authorization: `Bearer ${token}` },
      });

      setAirports(res.data || []);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    fetchAirports();
  }, []);

  // ADD
  const handleAdd = () => {
    setEditId(null);
    setForm(emptyForm);
    setShow(true);
  };

  // EDIT
  const handleEdit = (f) => {
    setEditId(f.id);

    setForm({
      flight_number: f.flight_number || "",
      departure_airport_id: f.departure_airport_id || "",
      arrival_airport_id: f.arrival_airport_id || "",
      departure_time: f.departure_time?.slice(0, 16) || "",
      arrival_time: f.arrival_time?.slice(0, 16) || "",
      aircraft_id: f.aircraft_id || "",
      base_price: f.base_price || "",
      available_seats: f.available_seats || "",
      status: f.status || "scheduled",
    });

    setShow(true);
  };

  // SAVE
  const handleSave = async () => {
    try {
      setSaving(true);

      const token = localStorage.getItem("access_token");

      const payload = {
        flight_number: form.flight_number,
        departure_airport_id: Number(form.departure_airport_id),
        arrival_airport_id: Number(form.arrival_airport_id),
        aircraft_id: Number(form.aircraft_id),
        base_price: Number(form.base_price),
        available_seats: Number(form.available_seats),
        status: form.status,

        departure_time: form.departure_time
          ? form.departure_time.replace("T", " ") + ":00"
          : null,

        arrival_time: form.arrival_time
          ? form.arrival_time.replace("T", " ") + ":00"
          : null,
      };

      if (editId) {
        await api.put(`/admin/flights/${editId}`, payload, {
          headers: { Authorization: `Bearer ${token}` },
        });
      } else {
        await api.post("/admin/flights", payload, {
          headers: { Authorization: `Bearer ${token}` },
        });
      }

      setShow(false);
      fetchFlights();
    } catch (err) {
      console.log(err.response?.data || err);
    } finally {
      setSaving(false);
    }
  };

  // DELETE
  const handleDelete = async (id) => {
    if (!window.confirm("Delete this flight?")) return;

    const token = localStorage.getItem("access_token");

    await api.delete(`/admin/flights/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    setFlights((prev) => prev.filter((f) => f.id !== id));
  };

  const statusBadge = (status) => {
    const map = {
      scheduled: "success",
      delayed: "warning",
      cancelled: "danger",
    };
    return <Badge bg={map[status] || "secondary"}>{status}</Badge>;
  };

  return (
    <div className="container mt-4">

      <Card className="p-3 mb-3">
        <Row>
          <Col md={8}>
            <h4>Flight Management</h4>
          </Col>

          <Col md={6} className="d-flex gap-2 justify-content-end">
            <Form.Control
              type="date"
              value={dateInput}
              onChange={(e) => setDateInput(e.target.value)}
              title="Lọc theo ngày bay"
            />
            <Form.Control
              placeholder="Search Flight No..."
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
            />
            <Button onClick={handleAdd}>+ Add</Button>
          </Col>
        </Row>
      </Card>

      {loading ? (
        <div className="text-center">
          <Spinner animation="border" />
        </div>
      ) : (
        <Table hover responsive>
          <thead>
            <tr>
              <th>#</th>
              <th>Flight No</th>
              <th>Route</th>
              <th>Time</th>
              <th>Price</th>
              <th>Seats</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>

          <tbody>
            {flights.map((f, i) => (
              <tr key={f.id}>
                <td>{(page - 1) * 10 + i + 1}</td>
                <td>{f.flight_number}</td>

                  <td>
                    {airports.find(a => a.id === f.departure_airport_id)?.city || airports.find(a => a.id === f.departure_airport_id)?.name || "?"}
                    {" → "}
                    {airports.find(a => a.id === f.arrival_airport_id)?.city || airports.find(a => a.id === f.arrival_airport_id)?.name || "?"}
                  </td>

                <td>
                  {f.departure_time?.slice(0, 16)} <br />
                  {f.arrival_time?.slice(0, 16)}
                </td>

                <td>{f.base_price}</td>
                <td>{f.available_seats}</td>
                <td>{statusBadge(f.status)}</td>

                <td>
                  <Button size="sm" onClick={() => handleEdit(f)}>
                    Edit
                  </Button>{" "}
                  <Button
                    size="sm"
                    variant="danger"
                    onClick={() => handleDelete(f.id)}
                  >
                    Delete
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}

      <Pagination className="justify-content-center">
        {Array.from({ length: lastPage }, (_, i) => (
          <Pagination.Item
            key={i + 1}
            active={page === i + 1}
            onClick={() => setPage(i + 1)}
          >
            {i + 1}
          </Pagination.Item>
        ))}
      </Pagination>

      <Modal show={show} onHide={() => setShow(false)} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>
            {editId ? "Edit Flight" : "Add Flight"}
          </Modal.Title>
        </Modal.Header>

        <Modal.Body>
          <Row>

            <Col md={6}>
              <Form.Label>Flight Number</Form.Label>
              <Form.Control
                value={form.flight_number}
                onChange={(e) =>
                  setForm({ ...form, flight_number: e.target.value })
                }
              />
            </Col>

            <Col md={6}>
              <Form.Label>Aircraft ID</Form.Label>
              <Form.Control
                value={form.aircraft_id}
                onChange={(e) =>
                  setForm({ ...form, aircraft_id: e.target.value })
                }
              />
            </Col>

            <Col md={6}>
              <Form.Label>Departure Airport</Form.Label>
              <Form.Select
                value={form.departure_airport_id}
                onChange={(e) =>
                  setForm({ ...form, departure_airport_id: e.target.value })
                }
              >
                <option value="">Select</option>
                {airports.map((a) => (
                  <option key={a.id} value={a.id}>
                    {a.code} - {a.name}
                  </option>
                ))}
              </Form.Select>
            </Col>

            <Col md={6}>
              <Form.Label>Arrival Airport</Form.Label>
              <Form.Select
                value={form.arrival_airport_id}
                onChange={(e) =>
                  setForm({ ...form, arrival_airport_id: e.target.value })
                }
              >
                <option value="">Select</option>
                {airports.map((a) => (
                  <option key={a.id} value={a.id}>
                    {a.code} - {a.name}
                  </option>
                ))}
              </Form.Select>
            </Col>

            <Col md={6}>
              <Form.Label>Departure Time</Form.Label>
              <Form.Control
                type="datetime-local"
                value={form.departure_time}
                onChange={(e) =>
                  setForm({ ...form, departure_time: e.target.value })
                }
              />
            </Col>

            <Col md={6}>
              <Form.Label>Arrival Time</Form.Label>
              <Form.Control
                type="datetime-local"
                value={form.arrival_time}
                onChange={(e) =>
                  setForm({ ...form, arrival_time: e.target.value })
                }
              />
            </Col>

            <Col md={6}>
              <Form.Label>Price</Form.Label>
              <Form.Control
                value={form.base_price}
                onChange={(e) =>
                  setForm({ ...form, base_price: e.target.value })
                }
              />
            </Col>

            <Col md={6}>
              <Form.Label>Seats</Form.Label>
              <Form.Control
                value={form.available_seats}
                onChange={(e) =>
                  setForm({ ...form, available_seats: e.target.value })
                }
              />
            </Col>
            <Col md={6}>
              <Form.Label>Status</Form.Label>
              <Form.Select
                value={form.status}
                onChange={(e) =>
                  setForm({ ...form, status: e.target.value })
                }
              >
                <option value="scheduled">Scheduled</option>
                <option value="delayed">Delayed</option>
                <option value="cancelled">Cancelled</option>
              </Form.Select>
            </Col>

          </Row>
        </Modal.Body>

        <Modal.Footer>
          <Button onClick={() => setShow(false)}>Close</Button>
          <Button onClick={handleSave} disabled={saving}>
            {saving ? "Saving..." : "Save"}
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}

export default Flights;