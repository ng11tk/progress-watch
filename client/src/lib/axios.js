import axios from "axios";
import { API_BASE_URL } from "../config";

// Create axios instance with default config
const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor
api.interceptors.request.use(
  (config) => {
    // You can add auth tokens or other headers here if needed
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // Handle common errors
    if (error.response?.status === 401) {
      // Avoid redirect loop if already on auth pages
      const currentPath = window.location.pathname;
      if (currentPath !== "/login" && currentPath !== "/signup") {
        // Clear any stored auth data
        localStorage.removeItem("token");
        sessionStorage.clear();
        // Redirect to login on unauthorized
        window.location.href = "/login";
      }
    }
    return Promise.reject(error);
  }
);

export default api;
