import Sidebar from "../components/admin/Sidebar";
import Navbar from "../components/admin/Navbar";
import { Outlet } from "react-router-dom";

function AdminLayout() {
  return (
    <div style={{ display: "flex", minHeight: "100vh" }}>
      
      <Sidebar />

      <div
        style={{
          flex: 1,
          background: "#f8fafc",
        }}
      >
        <Navbar />

        <div style={{ padding: "24px" }}>
          <Outlet />
        </div>
      </div>

    </div>
  );
}

export default AdminLayout;