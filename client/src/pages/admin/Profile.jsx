import { useEffect, useState } from "react";
import api from "../../api";
import { Card, Spinner } from "react-bootstrap";

function Profile() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const response = await api.get("/admin/profile");

      // 🔥 FIX QUAN TRỌNG (Laravel thường trả { data: user })
      const data = response.data?.data || response.data;

      setUser(data);
    } catch (error) {
      console.log("Profile API error:", error.response?.data || error.message);

      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="d-flex justify-content-center mt-5">
        <Spinner animation="border" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="container mt-4">
        <h4>Không tải được thông tin user</h4>
      </div>
    );
  }

  const roleName = user.roles?.[0]?.name || "N/A";

  return (
    <div className="container mt-4">
      <h2>My Profile</h2>

      <Card className="mt-3 shadow-sm">
        <Card.Body>
          <p><strong>ID:</strong> {user.id}</p>
          <p><strong>Name:</strong> {user.name}</p>
          <p><strong>Email:</strong> {user.email}</p>
          <p><strong>Role:</strong> {roleName}</p>
          <p><strong>Membership:</strong> {user.membership_tier}</p>
        </Card.Body>
      </Card>
    </div>
  );
}

export default Profile;