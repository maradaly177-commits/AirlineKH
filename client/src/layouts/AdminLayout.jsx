import Sidebar from "../components/admin/Sidebar";
import Navbar from "../components/admin/Navbar";
import { Outlet } from "react-router-dom";

function AdminLayout() {
  return (
    <div
      style={{
        display: "flex",
        minHeight: "100vh",
        backgroundColor: "#f4f6f8",
        fontFamily: "'Inter', ui-sans-serif, system-ui, sans-serif",
      }}
    >
      <Sidebar />

      <div
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          minWidth: 0,
          overflowX: "hidden",
        }}
      >
        <Navbar />

        <div style={{ flex: 1, padding: "28px", overflowY: "auto" }}>
          <Outlet />
        </div>
      </div>
    </div>
  );
}

export default AdminLayout;