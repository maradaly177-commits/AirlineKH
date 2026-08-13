import { Navigate, Outlet } from "react-router-dom";

export default function RequireAdmin() {
  const rawUser =
    localStorage.getItem("user") ||
    sessionStorage.getItem("user");

  if (!rawUser) return <Navigate to="/login" replace />;

  let user;
  try {
    user = JSON.parse(rawUser);
  } catch {
    return <Navigate to="/login" replace />;
  }

  // chuẩn hoá role
  const role =
    user?.role ??
    user?.roles?.[0]?.id ??
    user?.roles?.[0]?.name;

  const isAdmin =
    Number(role) === 1 ||
    role === "admin";

  return isAdmin ? <Outlet /> : <Navigate to="/" replace />;
}