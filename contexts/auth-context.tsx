'use client'

import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { UserData, AuthResponse } from '@/lib/types/auth'
import { 
  login as authLogin, 
  logout as authLogout, 
  getFullUserData, 
  isAuthenticated as checkIsAuthenticated,
  updateUserData,
  debugAuthData
} from '@/lib/api/auth'
import { debugCookies } from '@/lib/api/client'

interface AuthContextType {
  user: UserData | null
  organizationId: string | null
  isLoading: boolean
  isAuthenticated: boolean
  login: (email: string, password: string) => Promise<AuthResponse>
  logout: () => Promise<void>
  updateUser: (userData: Partial<UserData>) => Promise<void>
  refreshUser: (forceRefresh?: boolean) => Promise<void>
  debugAuth: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<UserData | null>(null)
  const [organizationId, setOrganizationId] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [lastRefresh, setLastRefresh] = useState<number>(0)

  // Limite para evitar refresh muito frequente (30 segundos)
  const REFRESH_COOLDOWN = 30 * 1000;

  useEffect(() => {
    const checkAuth = async () => {
      setIsLoading(true)
      
      try {
        console.log('🔍 Verificação inicial de autenticação (AuthContext)');
        
        // Debug dos cookies
        debugCookies();
        
        if (checkIsAuthenticated()) {
          console.log('✅ Token válido encontrado, buscando dados do usuário...');
          // Na verificação inicial, usar cache se disponível (não forçar refresh)
          const userData = await getFullUserData(false)
          if (userData) {
            console.log('✅ Dados do usuário carregados no contexto');
            console.log('👤 Dados do usuário:', userData);
            console.log('🏢 OrganizationId:', userData.organization?.id);
            setUser(userData)
            setOrganizationId(userData.organization?.id || null)
          } else {
            console.log('❌ Não foi possível obter dados do usuário');
            setUser(null)
            setOrganizationId(null)
          }
        } else {
          console.log('❌ Usuário não autenticado');
          setUser(null)
          setOrganizationId(null)
        }
      } catch (error) {
        console.error('❌ Erro ao verificar autenticação:', error)
        setUser(null)
        setOrganizationId(null)
      } finally {
        setIsLoading(false)
      }
    }

    // Executar apenas uma vez no mount
    checkAuth()
  }, []) // Dependências vazias para executar apenas uma vez

  const login = async (email: string, password: string): Promise<AuthResponse> => {
    setIsLoading(true)
    
    try {
      const result = await authLogin({ email, password })
      
      if (result.success && result.user) {
        setUser(result.user)
        setOrganizationId(result.user.organization?.id || null)
      }
      
      return result
    } catch (error: any) {
      console.error('Erro no login:', error)
      return { 
        success: false, 
        message: error.message || 'Erro ao fazer login' 
      }
    } finally {
      setIsLoading(false)
    }
  }

  const logout = async (): Promise<void> => {
    setIsLoading(true)
    
    try {
      await authLogout()
      setUser(null)
      setOrganizationId(null)
    } catch (error) {
      console.error('Erro no logout:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const updateUser = async (userData: Partial<UserData>): Promise<void> => {
    try {
      await updateUserData(userData)
      
      // Atualizar o estado local
      if (user) {
        setUser({ ...user, ...userData })
      }
    } catch (error) {
      console.error('Erro ao atualizar usuário:', error)
      throw error
    }
  }

  const refreshUser = async (forceRefresh = false): Promise<void> => {
    try {
      // Verificar cooldown para evitar refresh muito frequente
      const now = Date.now();
      if (!forceRefresh && (now - lastRefresh) < REFRESH_COOLDOWN) {
        console.log('⏱️ Refresh em cooldown, ignorando chamada (último refresh há', Math.round((now - lastRefresh) / 1000), 'segundos)');
        return;
      }
      
      if (checkIsAuthenticated()) {
        console.log('🔄 Atualizando dados do usuário...', forceRefresh ? '(forçando refresh)' : '(usando cache se disponível)');
        const userData = await getFullUserData(forceRefresh)
        setUser(userData)
        setOrganizationId(userData?.organization?.id || null)
        setLastRefresh(now)
      }
    } catch (error) {
      console.error('❌ Erro ao atualizar dados do usuário:', error)
    }
  }

  const value: AuthContextType = {
    user,
    organizationId,
    isLoading,
    isAuthenticated: !!user && checkIsAuthenticated(),
    login,
    logout,
    updateUser,
    refreshUser,
    debugAuth: debugAuthData
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth deve ser usado dentro de um AuthProvider')
  }
  return context
}
