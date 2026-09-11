import axios from "axios";

const envBase = import.meta.env.VITE_API_BASE_URL || "/api";
const isProdHost = typeof window !== "undefined" && !window.location.hostname.includes("localhost") && !window.location.hostname.includes("127.0.0.1");
const resolvedBaseURL = (isProdHost && envBase.includes("127.0.0.1")) ? "/api" : envBase;

const api = axios.create({
  baseURL: resolvedBaseURL,
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