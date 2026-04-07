import axios from "axios";

export const api = axios.create({
  baseURL: "http://127.0.0.1:8000/api",
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config as (typeof error.config & {
      _retry?: boolean;
    });

    const status = error.response?.status;
    if (status !== 401 || originalRequest?._retry) {
      return Promise.reject(error);
    }

    const refreshToken = localStorage.getItem("refreshToken");
    if (!refreshToken) {
      localStorage.removeItem("token");
      localStorage.removeItem("isAuthenticated");
      return Promise.reject(error);
    }

    originalRequest._retry = true;

    try {
      const response = await axios.post("http://127.0.0.1:8000/api/auth/refresh/", {
        refresh: refreshToken,
      });

      const nextAccessToken = response.data?.access;
      if (!nextAccessToken) {
        throw new Error("Refresh token response missing access token");
      }

      localStorage.setItem("token", nextAccessToken);
      originalRequest.headers = originalRequest.headers ?? {};
      originalRequest.headers.Authorization = `Bearer ${nextAccessToken}`;

      return api(originalRequest);
    } catch (refreshError) {
      localStorage.removeItem("token");
      localStorage.removeItem("refreshToken");
      localStorage.removeItem("isAuthenticated");
      return Promise.reject(refreshError);
    }
  },
);
