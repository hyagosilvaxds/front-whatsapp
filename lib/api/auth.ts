import api from './client';
import { jwtDecode } from 'jwt-decode';
import Cookies from "js-cookie";
import { saveToken, removeToken, getToken } from './client';
import { 
    UserData, 
    LoginResponse, 
    RegisterData, 
    Permission, 
    UserPermissions,
    AddPermissionsRequest,
    AddPermissionsResponse,
    RemovePermissionsRequest,
    RemovePermissionsResponse,
    SetupPermissionsResponse,
    DecodedToken,
    AuthResponse,
    UpdateUserData
} from '../types/auth';

export async function login({ email, password }: { email: string; password: string }): Promise<AuthResponse> {
    try {
        const response = await api.post<LoginResponse>('/auth/login', { email, password });
        console.log("Resposta do servidor:", response);

        const { access_token, user } = response.data;

        if (!access_token || typeof access_token !== 'string') {
            console.error("Token inválido ou ausente:", access_token);
            throw new Error("Token inválido ou ausente");
        }

        // Salvar token e dados do usuário
        console.log("🔄 Salvando token de acesso...");
        saveToken(access_token);
        
        // Verificar se o token foi salvo corretamente
        const savedToken = Cookies.get("jwtToken");
        console.log("✅ Verificação do token salvo:", savedToken ? `${savedToken.substring(0, 20)}...` : 'FALHOU');
        
        Cookies.set("user", JSON.stringify(user), { expires: 7, secure: false, sameSite: 'lax' });

        // Decodificar token para extrair informações
        const decodedToken = jwtDecode<DecodedToken>(access_token);
        Cookies.set("userId", decodedToken.id, { expires: 7, secure: false, sameSite: 'lax' });

        // Log dos dados salvos para debug
        console.log("=== DADOS SALVOS NO LOGIN ===");
        console.log("Token JWT:", access_token.substring(0, 50) + "...");
        console.log("Dados do usuário salvos no cookie:", user);
        console.log("Token decodificado:", decodedToken);
        
        // Verificar se os dados foram salvos corretamente
        const savedUser = Cookies.get("user");
        if (savedUser) {
            console.log("Verificação - dados do usuário recuperados do cookie:", JSON.parse(savedUser));
        }

        // Salvar role nos cookies
        saveRolesToCookie(user.role, null);
        console.log("Role salvo:", user.role);

        console.log("Usuário logado com sucesso:", response.data);
        console.log("Token decodificado:", decodedToken);
        console.log("Dados do usuário:", user);

        return { success: true, user, token: access_token };
    } catch (error: any) {
        console.error("Erro ao tentar fazer login:", error.response || error);
        const message = error.response?.data?.message || 'Credenciais inválidas';
        return { success: false, message };
    }
}

export async function register(userData: RegisterData): Promise<AuthResponse> {
    try {
        const response = await api.post('/auth/register', userData);
        console.log("Usuário registrado com sucesso:", response.data);
        return { success: true, user: response.data };
    } catch (error: any) {
        if (error.response && error.response.data && error.response.data.message) {
            return { success: false, message: error.response.data.message };
        }
        console.error("Erro ao registrar:", error);
        return { success: false, message: "Ocorreu um erro inesperado. Tente novamente." };
    }
}

export async function logout() {
    try {
        await api.post('/auth/logout');
        clearAuthData();
        console.log("Usuário deslogado com sucesso");
        return { success: true };
    } catch (error: any) {
        console.error("Erro ao fazer logout:", error);
        // Limpar dados mesmo se der erro na API
        clearAuthData();
        return { success: true };
    }
}

// Função para limpar cache (útil no logout)
export const clearUserDataCache = () => {
    userDataCache = null;
    console.log('Cache de dados do usuário limpo');
};

// Função auxiliar para limpar dados de autenticação
const clearAuthData = () => {
    removeToken();
    Cookies.remove("user");
    Cookies.remove("userId");
    Cookies.remove("USER_ROLE");
    clearUserDataCache(); // Limpar cache também
};

// Cache para evitar requisições excessivas
let userDataCache: { data: UserData; timestamp: number } | null = null;
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutos em milliseconds

export const getUserData = async (forceRefresh = false): Promise<UserData> => {
    // Verificar cache se não for refresh forçado
    if (!forceRefresh && userDataCache) {
        const now = Date.now();
        const cacheAge = now - userDataCache.timestamp;
        
        if (cacheAge < CACHE_DURATION) {
            console.log('✅ Usando dados do cache (válido por mais', Math.round((CACHE_DURATION - cacheAge) / 1000), 'segundos)');
            return userDataCache.data;
        } else {
            console.log('⏰ Cache expirado, buscando dados atualizados...');
        }
    }
    
    try {
        console.log('🔄 Buscando dados do usuário da API /auth/profile...');
        const response = await api.get<UserData>('/auth/profile');
        
        console.log('✅ Dados recebidos da API /auth/profile');
        
        // Atualizar cache
        userDataCache = {
            data: response.data,
            timestamp: Date.now()
        };
        
        // Atualizar dados do usuário no cookie
        Cookies.set("user", JSON.stringify(response.data), { expires: 7, secure: false, sameSite: 'lax' });
        console.log('💾 Dados atualizados no cookie e cache');
        
        return response.data; 
    } catch (error) {
        console.error('❌ Erro ao obter dados do usuário:', error);
        throw error;
    }
};

export const updateUserData = async (userData: UpdateUserData) => {
    try {
        const response = await api.put('/auth/profile', userData);
        
        // Limpar cache para forçar nova busca na próxima vez
        clearUserDataCache();
        
        // Atualizar dados no cookie se a atualização foi bem-sucedida
        const currentUser = getUserFromToken();
        if (currentUser) {
            const updatedUser = { ...currentUser, ...userData };
            Cookies.set("user", JSON.stringify(updatedUser), { expires: 7, secure: false, sameSite: 'lax' });
        }
        
        return response.data;
    } catch (error) {
        console.error('Erro ao atualizar dados do usuário:', error);
        throw error;
    }
};

export const isAuthenticated = (): boolean => {
    const token = getToken(); // Usar a função robusta
    console.log('🔍 Verificando autenticação - Token encontrado:', token ? `${token.substring(0, 20)}...` : 'NENHUM');
    
    if (!token) {
        console.log('❌ Nenhum token encontrado');
        return false;
    }
    
    try {
        const decoded = jwtDecode<DecodedToken>(token);
        const currentTime = Date.now() / 1000;
        
        console.log('🕒 Token expira em:', new Date(decoded.exp * 1000));
        console.log('🕒 Hora atual:', new Date());
        
        if (decoded.exp && decoded.exp < currentTime) {
            console.log('⏰ Token expirado, removendo dados de auth');
            clearAuthData();
            return false;
        }
        
        console.log('✅ Token válido');
        return true;
    } catch (error) {
        console.error('❌ Erro ao verificar autenticação:', error);
        clearAuthData();
        return false;
    }
};

export const getUserFromToken = (): UserData | null => {
    const token = Cookies.get("jwtToken");
    const userCookie = Cookies.get("user");
    
    if (!token) {
        return null;
    }
    
    try {
        // Primeiro tentar obter dados do cookie user (dados mais completos)
        if (userCookie) {
            try {
                const userData = JSON.parse(userCookie) as UserData;
                return userData;
            } catch (error) {
                console.warn('⚠️ Erro ao parsear cookie user:', error);
            }
        }
        
        // Fallback para dados do token (dados mínimos)
        const decodedToken = jwtDecode<DecodedToken>(token);
        
        return {
            id: decodedToken.id,
            email: decodedToken.email,
            name: '', // Nome não está no token, precisa buscar da API
            role: decodedToken.role,
            organization: decodedToken.organizationId ? {
                id: decodedToken.organizationId,
                name: '',
                slug: decodedToken.organizationSlug || ''
            } : null
        };
    } catch (error) {
        console.error('❌ Erro ao decodificar token:', error);
        return null;
    }
};

export const getFullUserData = async (forceRefresh = false): Promise<UserData | null> => {
    // Primeiro verificar se está autenticado
    if (!isAuthenticated()) {
        console.log('❌ Usuário não está autenticado');
        return null;
    }
    
    // Se não é refresh forçado, verificar se temos dados válidos no cookie
    if (!forceRefresh) {
        const cookieUser = getUserFromToken();
        if (cookieUser && cookieUser.name && cookieUser.organization?.name) {
            console.log('✅ Usando dados válidos do cookie (evitando requisição desnecessária)');
            return cookieUser;
        }
    }
    
    try {
        // Buscar dados da API com cache
        console.log('🔄 Buscando dados completos do usuário...');
        const apiData = await getUserData(forceRefresh);
        return apiData;
    } catch (error) {
        console.warn('⚠️ Erro ao buscar dados da API, usando dados do cookie/token:', error);
        
        const tokenData = getUserFromToken();
        if (tokenData) {
            // Se temos dados básicos no cookie, usar eles
            if (tokenData.name && tokenData.organization?.name) {
                console.log('✅ Usando dados do cookie como fallback');
                return tokenData;
            }
        }
        
        // Se não temos dados completos, mesmo com erro da API, retorna null
        // para forçar novo login
        console.error('❌ Dados incompletos e erro na API, forçando novo login');
        return null;
    }
};

export const getUserProfile = async (): Promise<UserData> => {
    try {
        console.log('Fazendo requisição para /auth/profile...');
        const response = await api.get<UserData>('/auth/profile');
        console.log('Resposta de /auth/profile:', response.data);
        
        // Salvar role nos cookies
        saveRolesToCookie(response.data.role, null);
        
        return response.data;
    } catch (error) {
        console.error('Erro ao buscar dados do usuário:', error);
        throw error;
    }
};

export const savePermissionsToCookie = (permissions: Permission[]) => {
    // Função mantida para compatibilidade, mas não usada na nova API
    // O novo sistema de permissões é consultado diretamente da API
    console.log('Função savePermissionsToCookie obsoleta na nova API - use getUserPermissions()');
};

export const saveRolesToCookie = (role: string | null, customRole: any | null) => {
    try {
        if (role) {
            Cookies.set("USER_ROLE", role, { expires: 7, secure: false, sameSite: 'lax' });
        }
        console.log('Role salvo no cookie:', { role });
    } catch (error) {
        console.error('Erro ao salvar role no cookie:', error);
    }
};

export const getPermissionsFromCookie = (): Permission[] => {
    // Função mantida para compatibilidade, mas retorna array vazio
    // O novo sistema de permissões deve usar getUserPermissions() da API
    console.log('Função getPermissionsFromCookie obsoleta na nova API - use getUserPermissions()');
    return [];
};

export const getRoleFromCookie = (): string | null => {
    return Cookies.get("USER_ROLE") || null;
};

export const getCustomRoleFromCookie = (): any | null => {
    // Função mantida para compatibilidade, mas não usada na nova API
    console.log('Função getCustomRoleFromCookie obsoleta na nova API');
    return null;
};

// Função para verificar se o usuário tem um role específico
export const hasRole = (roleName: string): boolean => {
    const userRole = getRoleFromCookie();
    return userRole === roleName;
};

// Função para verificar se o usuário é admin (ORG_ADMIN ou SUPER_ADMIN)
export const isAdmin = (): boolean => {
    const userRole = getRoleFromCookie();
    return userRole === 'ORG_ADMIN' || userRole === 'SUPER_ADMIN';
};

// Função para verificar se o usuário é super admin
export const isSuperAdmin = (): boolean => {
    const userRole = getRoleFromCookie();
    return userRole === 'SUPER_ADMIN';
};

// Função para criar usuário (apenas para admins)
export const createUser = async (userData: RegisterData) => {
    try {
        const response = await api.post('/auth/register', userData);
        return response.data;
    } catch (error) {
        console.error('Erro ao criar usuário:', error);
        throw error;
    }
};

// Função para listar usuários (apenas para admins)
export const getUsers = async (organizationId?: string) => {
    try {
        const params = organizationId ? { organizationId } : {};
        const response = await api.get('/auth/users', { params });
        return response.data;
    } catch (error) {
        console.error('Erro ao buscar usuários:', error);
        throw error;
    }
};

// Função para obter usuário por ID
export const getUserById = async (userId: string) => {
    try {
        const response = await api.get(`/auth/users/${userId}`);
        return response.data;
    } catch (error) {
        console.error('Erro ao buscar usuário:', error);
        throw error;
    }
};

// Função para atualizar usuário
export const updateUser = async (userId: string, userData: Partial<UserData>) => {
    try {
        const response = await api.put(`/auth/users/${userId}`, userData);
        return response.data;
    } catch (error) {
        console.error('Erro ao atualizar usuário:', error);
        throw error;
    }
};

// Função para solicitar recuperação de senha
export const forgotPassword = async (email: string) => {
    try {
        const response = await api.post('/auth/forgot-password', { email });
        return response.data;
    } catch (error) {
        console.error('Erro ao solicitar recuperação de senha:', error);
        throw error;
    }
};

// Função para redefinir senha
export const resetPassword = async (token: string, password: string) => {
    try {
        const response = await api.post('/auth/reset-password', { token, password });
        return response.data;
    } catch (error) {
        console.error('Erro ao redefinir senha:', error);
        throw error;
    }
};

// Função para deletar usuário
export const deleteUser = async (userId: string) => {
    try {
        const response = await api.delete(`/auth/users/${userId}`);
        return response.data;
    } catch (error) {
        console.error('Erro ao deletar usuário:', error);
        throw error;
    }
};

// ========================================
// SISTEMA DE PERMISSÕES GRANULARES
// ========================================

// Função para listar todas as permissões disponíveis no sistema
export const getAllPermissions = async (): Promise<Permission[]> => {
    try {
        const response = await api.get<Permission[]>('/auth/permissions');
        return response.data;
    } catch (error) {
        console.error('Erro ao buscar todas as permissões:', error);
        throw error;
    }
};

// Função para obter permissões de um usuário específico
export const getUserPermissions = async (userId: string): Promise<UserPermissions> => {
    try {
        const response = await api.get<UserPermissions>(`/auth/users/${userId}/permissions`);
        return response.data;
    } catch (error) {
        console.error('Erro ao buscar permissões do usuário:', error);
        throw error;
    }
};

// Função para adicionar permissões específicas a um usuário
export const addUserPermissions = async (userId: string, permissionIds: number[]): Promise<AddPermissionsResponse> => {
    try {
        const response = await api.post<AddPermissionsResponse>(`/auth/users/${userId}/permissions`, {
            permissionIds
        });
        return response.data;
    } catch (error) {
        console.error('Erro ao adicionar permissões ao usuário:', error);
        throw error;
    }
};

// Função para remover permissões específicas de um usuário
export const removeUserPermissions = async (userId: string, permissionIds: number[]): Promise<RemovePermissionsResponse> => {
    try {
        const response = await api.delete<RemovePermissionsResponse>(`/auth/users/${userId}/permissions`, {
            data: { permissionIds }
        });
        return response.data;
    } catch (error) {
        console.error('Erro ao remover permissões do usuário:', error);
        throw error;
    }
};

// Função para configurar permissões padrão do sistema (apenas SUPER_ADMIN)
export const setupSystemPermissions = async (): Promise<SetupPermissionsResponse> => {
    try {
        const response = await api.post<SetupPermissionsResponse>('/auth/setup-permissions');
        return response.data;
    } catch (error) {
        console.error('Erro ao configurar permissões do sistema:', error);
        throw error;
    }
};

// Função helper para verificar se usuário tem uma permissão específica
export const hasPermission = (userPermissions: UserPermissions | null, action: string, resource: string): boolean => {
    if (!userPermissions) return false;
    
    // SUPER_ADMIN tem acesso total (bypass)
    if (userPermissions.role === 'SUPER_ADMIN') {
        return true;
    }
    
    // Verificar se existe a permissão nas permissões combinadas
    return userPermissions.allPermissions.some(
        permission => permission.action === action && permission.resource === resource
    );
};

// Função helper para verificar se usuário tem permissão de MANAGE em um recurso
export const hasManagePermission = (userPermissions: UserPermissions | null, resource: string): boolean => {
    return hasPermission(userPermissions, 'MANAGE', resource);
};

// Função helper para verificar se usuário tem permissão de READ em um recurso
export const hasReadPermission = (userPermissions: UserPermissions | null, resource: string): boolean => {
    return hasPermission(userPermissions, 'READ', resource);
};

// Função helper para verificar se usuário tem permissão de CREATE em um recurso
export const hasCreatePermission = (userPermissions: UserPermissions | null, resource: string): boolean => {
    return hasPermission(userPermissions, 'CREATE', resource);
};

// Função helper para verificar se usuário tem permissão de UPDATE em um recurso
export const hasUpdatePermission = (userPermissions: UserPermissions | null, resource: string): boolean => {
    return hasPermission(userPermissions, 'UPDATE', resource);
};

// Função helper para verificar se usuário tem permissão de DELETE em um recurso
export const hasDeletePermission = (userPermissions: UserPermissions | null, resource: string): boolean => {
    return hasPermission(userPermissions, 'DELETE', resource);
};

// Função utilitária para debug - mostra todos os dados salvos
export const debugAuthData = () => {
    console.log('=== DEBUG - DADOS DE AUTENTICAÇÃO ===');
    
    const token = Cookies.get("jwtToken");
    const user = Cookies.get("user");
    const userId = Cookies.get("userId");
    const userRole = Cookies.get("USER_ROLE");
    
    console.log('Token JWT:', token ? token.substring(0, 50) + "..." : 'Não encontrado');
    console.log('User ID:', userId);
    console.log('User Role:', userRole);
    
    if (user) {
        try {
            const userData = JSON.parse(user);
            console.log('Dados do usuário:', userData);
        } catch (e) {
            console.log('Erro ao parsear dados do usuário:', user);
        }
    } else {
        console.log('Dados do usuário: Não encontrados');
    }
    
    if (token) {
        try {
            const decoded = jwtDecode(token);
            console.log('Token decodificado:', decoded);
        } catch (e) {
            console.log('Erro ao decodificar token:', e);
        }
    }
    
    console.log('=== FIM DEBUG ===');
};



