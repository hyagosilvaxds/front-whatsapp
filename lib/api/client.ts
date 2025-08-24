import axios from "axios";
import Cookies from "js-cookie";
import { jwtDecode } from "jwt-decode";

const api = axios.create({
  baseURL: "http://localhost:4000",
  timeout: 600000,
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use((config) => {
  const token = Cookies.get("jwtToken");
  if (token) {
    if (!config.headers) {
      config.headers = {} as import("axios").AxiosRequestHeaders;
    }
    config.headers["Authorization"] = `Bearer ${token}`;
  }
  
  return config;
});

api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response?.status === 401 || error.response?.status === 403) {
      if (typeof window !== "undefined") {
        Cookies.remove("jwtToken");

        if (!window.location.pathname.includes("/login")) {
          window.location.href = "/login";
        }
      }
    }
    return Promise.reject(error);
  }
);

export const getDecodedToken = () => {
  const token = Cookies.get("jwtToken");
  if (token) {
    try {
      return jwtDecode(token);
    } catch (error) {
      console.error("Erro ao decodificar o token JWT:", error);
      return null;
    }
  }
  return null;
};

export default api;