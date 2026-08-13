import { useEffect, useState, useRef } from "react";
import api from "../../api";
import {
  Table,
  Button,
  Spinner,
  Form,
  Card,
  Badge,
  Pagination,
} from "react-bootstrap";

function Users() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);

  const [searchInput, setSearchInput] = useState("");
  const [search, setSearch] = useState("");

  const [page, setPage] = useState(1);
  const [lastPage, setLastPage] = useState(1);

  const isFetching = useRef(false);

  // =====================
  // debounce search
  // =====================
  useEffect(() => {
    const timer = setTimeout(() => {
      setSearch(searchInput);
      setPage(1);
    }, 400);

    return () => clearTimeout(timer);
  }, [searchInput]);

  // =====================
  // fetch data
  // =====================
  useEffect(() => {
    fetchUsers();
  }, [search, page]);

  const fetchUsers = async () => {
  const controller = new AbortController();

  try {
    setLoading(true);

    const res = await api.get("/admin/users", {
      params: { search, page },
      signal: controller.signal,
    });

    setUsers(res.data.data);
    setLastPage(res.data.last_page);
  } catch (err) {
    if (err.name === "CanceledError") return;
    console.error(err);
  } finally {
    setLoading(false);
  }

  return () => controller.abort();
};

  // =====================
  // delete user
  // =====================
  const handleDelete = async (id) => {
    if (!window.confirm("Delete this user?")) return;

    try {
      await api.delete(`/admin/users/${id}`);
      fetchUsers();
    } catch (err) {
      console.error(err);
    }
  };

  // =====================
  // role badge
  // =====================
  const getRoleBadge = (role) => {
    switch (role) {
      case "admin":
        return "danger";
      case "user":
        return "primary";
      default:
        return "secondary";
    }
  };

  // =====================
  // pagination
  // =====================
  const renderPagination = () => {
    let items = [];

    for (let i = 1; i <= lastPage; i++) {
      items.push(
        <Pagination.Item
          key={i}
          active={i === page}
          onClick={() => setPage(i)}
        >
          {i}
        </Pagination.Item>
      );
    }

    return <Pagination>{items}</Pagination>;
  };

  return (
    <div className="container mt-4">

      {/* HEADER */}
      <Card className="mb-3">
        <Card.Body className="d-flex justify-content-between align-items-center">
          <h4>User Management</h4>

          <Form.Control
            style={{ width: "300px" }}
            placeholder="Search name or email..."
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
          />
        </Card.Body>
      </Card>

      {/* TABLE */}
      <Card>
        <Table hover responsive className="mb-0">
          <thead className="table-dark">
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Email</th>
              <th>Role</th>
              <th>Action</th>
            </tr>
          </thead>

          <tbody>
            {loading ? (
              <tr>
                <td colSpan="5" className="text-center py-4">
                  <Spinner animation="border" />
                </td>
              </tr>
            ) : (
              users.map((u, index) => (
                <tr key={u.id}>
                  <td>{(page - 1) * 10 + index + 1}</td>
                  <td>{u.name}</td>
                  <td>{u.email}</td>

                  <td>
                    <Badge bg={getRoleBadge(u.role)}>
                      {u.role}
                    </Badge>
                  </td>

                  <td>
                    <Button
                      size="sm"
                      variant="danger"
                      onClick={() => handleDelete(u.id)}
                    >
                      Delete
                    </Button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </Table>
      </Card>

      {/* PAGINATION */}
      <div className="mt-3 d-flex justify-content-center">
        {renderPagination()}
      </div>

    </div>
  );
}

export default Users;