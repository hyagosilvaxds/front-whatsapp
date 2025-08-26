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

// Função auxiliar para ler token de forma mais robusta
export const getToken = (): string | null => {
  if (typeof window === "undefined") return null;
  
  // Tentar primeiro com js-cookie
  let token = Cookies.get("jwtToken");
  
  // Se não encontrou, tentar via document.cookie diretamente
  if (!token) {
    const allCookies = document.cookie;
    const tokenMatch = allCookies.match(/jwtToken=([^;]+)/);
    if (tokenMatch) {
      token = decodeURIComponent(tokenMatch[1]);
    }
  }
  
  return token || null;
};

api.interceptors.request.use((config) => {
  const token = getToken(); // Usar a função robusta
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
  console.log('💾 Salvando token...');
  console.log('🌐 Hostname atual:', typeof window !== "undefined" ? window.location.hostname : 'SSR');
  
  if (typeof window === "undefined") return;
  
  const hostname = window.location.hostname;
  
  // Para rede local (IP), usar método manual mais confiável
  if (hostname !== "localhost" && hostname !== "127.0.0.1") {
    console.log('🌐 Detectado rede local, usando método manual de cookie');
    
    // Método manual mais confiável para rede local
    const expires = new Date();
    expires.setDate(expires.getDate() + 7); // 7 dias
    
    const cookieString = `jwtToken=${token}; expires=${expires.toUTCString()}; path=/; SameSite=Lax`;
    document.cookie = cookieString;
    
    console.log('📝 Cookie string:', cookieString);
    
    // Verificar se foi salvo
    let savedToken = Cookies.get("jwtToken");
    console.log('✅ Primeira verificação:', savedToken ? `${savedToken.substring(0, 20)}...` : 'FALHOU');
    
    // Se ainda não funcionou, tentar método ainda mais direto
    if (!savedToken) {
      console.log('⚠️ Método manual falhou, tentando direto no document.cookie...');
      document.cookie = `jwtToken=${token}; path=/`;
      
      // Verificar via document.cookie diretamente
      const allCookies = document.cookie;
      const tokenMatch = allCookies.match(/jwtToken=([^;]+)/);
      if (tokenMatch) {
        console.log('✅ Token encontrado via document.cookie:', tokenMatch[1].substring(0, 20) + '...');
      } else {
        console.log('❌ Token não encontrado mesmo via document.cookie');
        console.log('📋 Todos os cookies:', allCookies);
      }
    }
    
  } else {
    // Para localhost, usar js-cookie normalmente
    Cookies.set("jwtToken", token, {
      expires: 7,
      path: "/",
      secure: false,
      sameSite: 'lax'
    });
  }
  
  // Verificação final
  const finalToken = Cookies.get("jwtToken");
  console.log('🏁 Verificação final:', finalToken ? `${finalToken.substring(0, 20)}...` : 'FALHOU');
};

// Função para remover token
export const removeToken = () => {
  console.log('🗑️ Removendo token...');
  
  // Tentar múltiplas formas de remover o cookie
  Cookies.remove("jwtToken");
  Cookies.remove("jwtToken", { path: "/" });
  
  if (typeof window !== "undefined") {
    // Método adicional para limpar cookie via document.cookie
    document.cookie = "jwtToken=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
  }
  
  // Verificar se foi removido
  const remainingToken = Cookies.get("jwtToken");
  console.log('🗑️ Token removido:', remainingToken ? 'FALHOU' : 'SUCESSO');
};

// Função de debug para verificar cookies
export const debugCookies = () => {
  console.log('🍪 Debug de Cookies:');
  
  const robustToken = getToken();
  const jsToken = Cookies.get("jwtToken");
  
  console.log('- jwtToken (js-cookie):', jsToken ? `${jsToken.substring(0, 20)}...` : 'NENHUM');
  console.log('- jwtToken (robusto):', robustToken ? `${robustToken.substring(0, 20)}...` : 'NENHUM');
  console.log('- user:', Cookies.get("user") ? 'PRESENTE' : 'NENHUM');
  console.log('- userId:', Cookies.get("userId") || 'NENHUM');
  console.log('- USER_ROLE:', Cookies.get("USER_ROLE") || 'NENHUM');
  console.log('- Todos os cookies:', document.cookie);
};

export default api;