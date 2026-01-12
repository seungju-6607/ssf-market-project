import axios from "axios";

const axiosJWT = axios.create({
  baseURL: process.env.REACT_APP_API_BASE_URL
    || "https://ssf-market-project.onrender.com",
  headers: {
    "Content-Type": "application/json",
  },
});

// 🔑 모든 요청에 JWT 자동 첨부
axiosJWT.interceptors.request.use((config) => {
  const token = localStorage.getItem("accessToken");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default axiosJWT;
