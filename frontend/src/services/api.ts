import axios from "axios";

// Crear instancia de Axios
const api = axios.create({
  baseURL: `${process.env.REACT_APP_API_URL}/api`,
});

// Agregar interceptor para incluir token en cada solicitud
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Agregar interceptor para manejar expiración del token
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
