import { useEffect, useState } from "react";
import api from "../../api";
import { Table, Button, Spinner, Form, Modal } from "react-bootstrap";

function Airports() {
  const [airports, setAirports] = useState([]);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");

  const [show, setShow] = useState(false);
  const [editId, setEditId] = useState(null);

  const [saving, setSaving] = useState(false);

  // ================= PAGINATION =================
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const [form, setForm] = useState({
    name: "",
    city: "",
    code: "",
  });

  useEffect(() => {
    fetchAirports();
  }, []);

  const fetchAirports = async () => {
    setLoading(true);

    try {
      const res = await api.get("/admin/airports");

      const data = Array.isArray(res.data)
        ? res.data
        : res.data?.data || [];

      setAirports(data);
    } catch (err) {
      console.log(err);
      setAirports([]);
    } finally {
      setLoading(false);
    }
  };

  // ================= ADD =================
  const handleAdd = () => {
    setEditId(null);
    setForm({ name: "", city: "", code: "" });
    setShow(true);
  };

  // ================= EDIT =================
  const handleEdit = (airport) => {
    setEditId(airport.id);
    setForm({
      name: airport.name || "",
      city: airport.city || "",
      code: airport.code || "",
    });
    setShow(true);
  };

  // ================= SAVE =================
  const handleSave = async () => {
    setSaving(true);

    try {
      const token = localStorage.getItem("access_token");

      if (editId) {
        await api.put(`/admin/airports/${editId}`, form, {
          headers: { Authorization: `Bearer ${token}` },
        });
      } else {
        await api.post("/admin/airports", form, {
          headers: { Authorization: `Bearer ${token}` },
        });
      }

      setShow(false);
      fetchAirports();
    } catch (err) {
      console.log(err);
      alert("Save failed");
    } finally {
      setSaving(false);
    }
  };

  // ================= DELETE =================
  const handleDelete = async (id) => {
    if (!window.confirm("Delete this airport?")) return;

    try {
      const token = localStorage.getItem("access_token");

      await api.delete(`/admin/airports/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      fetchAirports();
    } catch (err) {
      console.log(err);
      alert("Delete failed");
    }
  };

  // ================= FILTER =================
  const filteredAirports = airports.filter((a) => {
    const keyword = search.toLowerCase().trim();

    return (
      (a.name || "").toLowerCase().includes(keyword) ||
      (a.city || "").toLowerCase().includes(keyword) ||
      (a.code || "").toLowerCase().includes(keyword)
    );
  });

  // ================= PAGINATION FIX (QUAN TRỌNG) =================
  const totalPages = Math.max(
    1,
    Math.ceil(filteredAirports.length / itemsPerPage)
  );

  const currentPageSafe = Math.min(currentPage, totalPages);

  const indexOfFirst = (currentPageSafe - 1) * itemsPerPage;
  const indexOfLast = indexOfFirst + itemsPerPage;

  const currentAirports = filteredAirports.slice(
    indexOfFirst,
    indexOfLast
  );

  // ================= LOADING =================
  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center vh-100">
        <Spinner animation="border" />
      </div>
    );
  }

  return (
    <div className="container mt-4">
      <h2 className="mb-3">Airports Management</h2>

      {/* SEARCH + ADD */}
      <div className="d-flex gap-2 mb-3">
        <Form.Control
          type="text"
          placeholder="Search airport..."
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setCurrentPage(1);
          }}
        />

        <Button onClick={handleAdd}>+ Add Airport</Button>
      </div>

      {/* TABLE */}
      <Table bordered hover>
        <thead>
          <tr>
            <th>STT</th>
            <th>Name</th>
            <th>City</th>
            <th>Code</th>
            <th>Action</th>
          </tr>
        </thead>

        <tbody>
          {currentAirports.length > 0 ? (
            currentAirports.map((a, index) => (
              <tr key={a.id}>
                <td>{indexOfFirst + index + 1}</td>

                <td>{a.name}</td>

                <td>{a.city}</td>

                <td>
                  <span
                    style={{
                      padding: "4px 10px",
                      borderRadius: "6px",
                      background: "#2563eb",
                      color: "#fff",
                      fontSize: "12px",
                    }}
                  >
                    {a.code}
                  </span>
                </td>

                <td className="d-flex gap-2">
                  <Button
                    size="sm"
                    variant="warning"
                    onClick={() => handleEdit(a)}
                  >
                    Edit
                  </Button>

                  <Button
                    size="sm"
                    variant="danger"
                    onClick={() => handleDelete(a.id)}
                  >
                    Delete
                  </Button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="5" className="text-center">
                No airports found
              </td>
            </tr>
          )}
        </tbody>
      </Table>

      {/* PAGINATION */}
      <div className="d-flex justify-content-end mt-3">
        <div className="d-flex align-items-center gap-2">

          <Button
            size="sm"
            variant="outline-secondary"
            disabled={currentPageSafe === 1}
            onClick={() => setCurrentPage(currentPageSafe - 1)}
          >
            ‹
          </Button>

          <span style={{ fontSize: "13px" }}>
            {currentPageSafe} / {totalPages}
          </span>

          <Button
            size="sm"
            variant="outline-secondary"
            disabled={
              currentPageSafe === totalPages || totalPages === 0
            }
            onClick={() => setCurrentPage(currentPageSafe + 1)}
          >
            ›
          </Button>

        </div>
      </div>

      {/* MODAL */}
      <Modal show={show} onHide={() => setShow(false)}>
        <Modal.Header closeButton>
          <Modal.Title>
            {editId ? "Edit Airport" : "Add Airport"}
          </Modal.Title>
        </Modal.Header>

        <Modal.Body>
          <Form>
            <Form.Control
              className="mb-2"
              placeholder="Airport Name"
              value={form.name}
              onChange={(e) =>
                setForm({ ...form, name: e.target.value })
              }
            />

            <Form.Control
              className="mb-2"
              placeholder="City"
              value={form.city}
              onChange={(e) =>
                setForm({ ...form, city: e.target.value })
              }
            />

            <Form.Control
              className="mb-2"
              placeholder="Code"
              value={form.code}
              onChange={(e) =>
                setForm({ ...form, code: e.target.value })
              }
            />
          </Form>
        </Modal.Body>

        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShow(false)}>
            Close
          </Button>

          <Button onClick={handleSave} disabled={saving}>
            {saving ? "Saving..." : "Save"}
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}

export default Airports;