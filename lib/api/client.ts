import axios from "axios";
import Cookies from "js-cookie";
import { jwtDecode } from "jwt-decode";

// Configuração dinâmica da baseURL
const getBaseURL = () => {
  if (typeof window !== "undefined") {
    // Se estamos no cliente, usar o hostname atual
    const hostname = window.location.hostname;
    if (hostname === "localhost" || hostname === "127.0.0.1") {
      return "http://localhost:4000";
    } else {
      // Para rede local, usar o IP do servidor
      return "http://10.10.10.39:4000";
    }
  }
  // Fallback para servidor (SSR)
  return process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";
};

// Configuração de cookies com domínio correto
const getCookieOptions = () => {
  if (typeof window !== "undefined") {
    const hostname = window.location.hostname;
    
    // Para localhost
    if (hostname === "localhost" || hostname === "127.0.0.1") {
      return {
        secure: false,
        sameSite: 'lax' as const,
        expires: 7,
        path: "/"
      };
    }
    
    // Para rede local (IP)
    return {
      secure: false,
      sameSite: 'lax' as const,
      expires: 7,
      path: "/"
      // Não definir domain para IPs, deixar o navegador gerenciar
    };
  }
  
  return {
    secure: false,
    sameSite: 'lax' as const,
    expires: 7,
    path: "/"
  };
};

const api = axios.create({
  baseURL: getBaseURL(),
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
        // Remover cookie com as mesmas opções que foi criado
        const options = getCookieOptions();
        Cookies.remove("jwtToken", options);
        // Também tentar remover sem opções como fallback
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

// Função para salvar token com configurações corretas
export const saveToken = (token: string) => {
  const options = getCookieOptions();
  Cookies.set("jwtToken", token, options);
};

// Função para remover token
export const removeToken = () => {
  const options = getCookieOptions();
  Cookies.remove("jwtToken", options);
  // Também tentar remover sem opções como fallback
  Cookies.remove("jwtToken");
};

export default api;