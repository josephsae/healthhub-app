import axios from "axios";

const api = axios.create({
  baseURL: `${process.env.REACT_APP_API_URL}/api`,
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
  (error) => {
    if (
      error.response &&
      (error.response.status === 401 || error.response.status === 403)
    ) {
      localStorage.removeItem("token"); 
      window.location.href = "/login"; 
    }
    return Promise.reject(error);
  }
);

export default api;