import axios from "axios";

const API = axios.create({
  baseURL:
    import.meta.env.VITE_API_URL ||
    "https://prepmateai-backend-38q2.onrender.com/api",
});

API.interceptors.request.use((req) => {
  const token = localStorage.getItem("token");

  if (token) {
    req.headers.Authorization = `Bearer ${token}`;
  }

  return req;
});

API.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401 && localStorage.getItem("token")) {
      localStorage.removeItem("token");
      window.dispatchEvent(new Event("authChange"));
    }
    return Promise.reject(err);
  }
);

export const apiError = (err, fallback = "Something went wrong") => {
  const detail = err.response?.data?.detail;
  return typeof detail === "string" ? detail : fallback;
};

export default API;
