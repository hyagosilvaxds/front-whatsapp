import axios from "axios";
import Cookies from "js-cookie";
import { jwtDecode } from "jwt-decode";

// Configuração dinâmica da baseURL
const getBaseURL = () => {
  if (typeof window !== "undefined") {
    // Se estamos no cliente, usar o hostname atual
    const hostname = window.location.hostname;
    console.log('🌐 Cliente detectado - hostname:', hostname);
    
    if (hostname === "localhost" || hostname === "127.0.0.1") {
      console.log('🏠 Usando localhost:4000');
      return "http://localhost:4000";
    } else {
      // Para rede local, usar o IP do servidor
      console.log('🌐 Usando rede local: 10.10.10.39:4000');
      return "http://10.10.10.39:4000";
    }
  }
  // Fallback para servidor (SSR)
  const fallbackUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";
  console.log('⚙️ SSR - usando fallback:', fallbackUrl);
  return fallbackUrl;
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
    
    // Para rede local (IP) - configurações mais permissivas
    return {
      secure: false,
      sameSite: 'lax' as const,
      expires: 7,
      path: "/",
      // Para IPs, não definir domain e usar configurações mais permissivas
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
  console.log('🔐 Token encontrado:', token ? `${token.substring(0, 20)}...` : 'NENHUM');
  console.log('🎯 URL da requisição:', config.url);
  console.log('🌐 Base URL:', config.baseURL);
  
  if (token) {
    if (!config.headers) {
      config.headers = {} as import("axios").AxiosRequestHeaders;
    }
    config.headers["Authorization"] = `Bearer ${token}`;
    console.log('✅ Authorization header adicionado');
  } else {
    console.log('❌ Nenhum token encontrado nos cookies');
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
  console.log('💾 Salvando token com opções:', options);
  console.log('🌐 Hostname atual:', typeof window !== "undefined" ? window.location.hostname : 'SSR');
  Cookies.set("jwtToken", token, options);
  
  // Verificar se foi salvo corretamente
  const savedToken = Cookies.get("jwtToken");
  console.log('✅ Token salvo e verificado:', savedToken ? `${savedToken.substring(0, 20)}...` : 'FALHOU');
};

// Função para remover token
export const removeToken = () => {
  const options = getCookieOptions();
  Cookies.remove("jwtToken", options);
  // Também tentar remover sem opções como fallback
  Cookies.remove("jwtToken");
};

// Função de debug para verificar cookies
export const debugCookies = () => {
  console.log('🍪 Debug de Cookies:');
  console.log('- jwtToken:', Cookies.get("jwtToken") ? `${Cookies.get("jwtToken")?.substring(0, 20)}...` : 'NENHUM');
  console.log('- user:', Cookies.get("user") ? 'PRESENTE' : 'NENHUM');
  console.log('- userId:', Cookies.get("userId") || 'NENHUM');
  console.log('- USER_ROLE:', Cookies.get("USER_ROLE") || 'NENHUM');
  console.log('- Todos os cookies:', document.cookie);
};

export default api;