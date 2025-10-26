// frontend/src/lib/api.js
import axios from "axios";

// Create an Axios instance
export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:5001/api",
  withCredentials: true, // allows sending cookies if needed
  headers: {
    "Content-Type": "application/json",
  },
});

// Automatically attach Bearer token (from localStorage)
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("ml_token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Handle global errors (401, 403, etc.)
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      const { status, data } = error.response;

      if (status === 401) {
        console.warn("Unauthorized — clearing session.");
        localStorage.removeItem("ml_token");
        localStorage.removeItem("ml_user");
        window.location.href = "/signin";
      }

      // Show clean error messages
      return Promise.reject(
        new Error(data.message || `Request failed with status ${status}`)
      );
    }
    return Promise.reject(error);
  }
);

// Helper methods for cleaner syntax
export const request = {
  get: (url, config) => api.get(url, config).then((res) => res.data),
  post: (url, body, config) => api.post(url, body, config).then((res) => res.data),
  put: (url, body, config) => api.put(url, body, config).then((res) => res.data),
  patch: (url, body, config) => api.patch(url, body, config).then((res) => res.data),
  delete: (url, config) => api.delete(url, config).then((res) => res.data),
};
