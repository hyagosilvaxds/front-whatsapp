'use client'

import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { UserData, AuthResponse } from '@/lib/types/auth'
import { 
  login as authLogin, 
  logout as authLogout, 
  getFullUserData, 
  isAuthenticated as checkIsAuthenticated,
  updateUserData
} from '@/lib/api/auth'

interface AuthContextType {
  user: UserData | null
  isLoading: boolean
  isAuthenticated: boolean
  login: (email: string, password: string) => Promise<AuthResponse>
  logout: () => Promise<void>
  updateUser: (userData: Partial<UserData>) => Promise<void>
  refreshUser: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<UserData | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const checkAuth = async () => {
      setIsLoading(true)
      
      try {
        if (checkIsAuthenticated()) {
          const userData = await getFullUserData()
          setUser(userData)
        } else {
          setUser(null)
        }
      } catch (error) {
        console.error('Erro ao verificar autenticação:', error)
        setUser(null)
      } finally {
        setIsLoading(false)
      }
    }

    checkAuth()
  }, [])

  const login = async (email: string, password: string): Promise<AuthResponse> => {
    setIsLoading(true)
    
    try {
      const result = await authLogin({ email, password })
      
      if (result.success && result.user) {
        setUser(result.user)
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

  const refreshUser = async (): Promise<void> => {
    try {
      if (checkIsAuthenticated()) {
        const userData = await getFullUserData()
        setUser(userData)
      }
    } catch (error) {
      console.error('Erro ao atualizar dados do usuário:', error)
    }
  }

  const value: AuthContextType = {
    user,
    isLoading,
    isAuthenticated: !!user && checkIsAuthenticated(),
    login,
    logout,
    updateUser,
    refreshUser
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
