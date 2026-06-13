import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:5000/api", // backend URL
  withCredentials: true
});

// 🔥 Request interceptor (token auto attach)
api.interceptors.request.use((config) => {
  const user = JSON.parse(localStorage.getItem("ks_user"));

  if (user?.token) {
    config.headers.Authorization = `Bearer ${user.token}`;
  }

  return config;
});

export default api;