import { BASE_URL } from "@/config";
import axios from "axios";

export const axiosAuth = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true, // ตรวจสอบว่า set เป็น true
});

// ก่อนส่งไป
axiosAuth.interceptors.request.use(
  (config) => {
    const loginFilter = localStorage.getItem("login-filter");
    const data = JSON.parse(loginFilter || "{}");
    if (data.state?.token) {
      config.headers["Authorization"] = `Bearer ${data.state.token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// หลังส่งไป
axiosAuth.interceptors.response.use(
  async (response) => {
    return response;
  },
  async (error) => {
    const originalRequest = error.config;
    // เช็คว่า Token หมดอายุหรือไม่
    if (
      error.response &&
      error.response.status === 401 &&
      !originalRequest._retry
    ) {
      originalRequest._retry = true;
      try {
        const refreshResponse = await axios.post(
          `${BASE_URL}/login/refresh`,
          {},
          { withCredentials: true }
        );
        const { token } = refreshResponse.data;

        const loginFilter = localStorage.getItem("login-filter");
        const data = JSON.parse(loginFilter || "{}");
        data.state.token = token;
        localStorage.setItem("login-filter", JSON.stringify(data));
        axiosAuth.defaults.headers.common["Authorization"] = `Bearer ${token}`;
        originalRequest.headers["Authorization"] = `Bearer ${token}`;
        // ส่งคำขอเดิมใหม่
        return axiosAuth(originalRequest);
      } catch (refreshError) {
        localStorage.clear();
        window.location.href = "/login";
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);
