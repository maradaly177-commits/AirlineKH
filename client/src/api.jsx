import axios from "axios";

const api = axios.create({
  // Đọc URL từ client/.env, nếu không có sẽ lấy mặc định /api
  baseURL: import.meta.env.VITE_API_BASE_URL || "/api",
  withCredentials: true, // Hỗ trợ gửi Session/Cookie
});

api.interceptors.request.use((config) => {
  const token =
    localStorage.getItem("access_token") ||
    sessionStorage.getItem("access_token");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  config.headers.Accept = "application/json";

  return config;
});

export default api;