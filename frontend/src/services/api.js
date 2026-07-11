import axios from "axios";
import { toast } from "react-toastify";

const API_URL = import.meta.env.VITE_API_URL || "/api";

const api = axios.create({
  baseURL: API_URL,
  withCredentials: true, // send httpOnly cookie (dev / same-origin)
});

// Request interceptor: attach Bearer token (works cross-origin in production)
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("cpp_token");
  if (token) {
    config.headers = config.headers || {};
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response interceptor: handle global errors & auto-logout
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response?.status;
    const message =
      error.response?.data?.message || "Something went wrong. Please try again.";

    if (status === 401) {
      // Token expired or unauthorized -> clear local auth state
      localStorage.removeItem("remember");
      localStorage.removeItem("cpp_token");
      // Reload only if we are not already on the login page
      if (window.location.pathname !== "/login") {
        window.dispatchEvent(new Event("auth:logout"));
        setTimeout(() => {
          window.location.href = "/login";
        }, 800);
      }
    } else if (status === 403) {
      toast.error(message);
    }
    return Promise.reject(error);
  }
);

export default api;
