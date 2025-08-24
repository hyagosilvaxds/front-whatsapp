'use client'

import { useAuth } from '@/contexts/auth-context'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import AdminDashboardPage from '@/components/pages/admin-dashboard-page'
import AdminProfilePage from '@/components/pages/admin-profile-page'
import { Card, CardContent } from '@/components/ui/card'
import { Loader2 } from 'lucide-react'

interface AuthWrapperProps {
  children: React.ReactNode
  requireAdmin?: boolean
  fallbackComponent?: React.ComponentType
}

export function AuthWrapper({ children, requireAdmin = false, fallbackComponent }: AuthWrapperProps) {
  const { user, isLoading, isAuthenticated } = useAuth()
  const router = useRouter()

  useEffect(() => {
    // Se não está autenticado e não está carregando, redireciona para login
    if (!isLoading && !isAuthenticated) {
      router.push('/login')
      return
    }
  }, [isAuthenticated, isLoading, router])

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-slate-100 flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-emerald-600 mb-4" />
            <p className="text-muted-foreground">Carregando...</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  // Not authenticated - o useEffect já está redirecionando
  if (!isAuthenticated) {
    return null
  }

  // Authenticated but requires admin
  if (requireAdmin && user?.role !== 'ADMIN' && user?.role !== 'SUPERADMIN') {
    const FallbackComponent = fallbackComponent || (() => (
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-slate-100 flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="text-center py-12">
            <h2 className="text-2xl font-bold mb-4">Acesso Negado</h2>
            <p className="text-muted-foreground mb-6">
              Você não tem permissão para acessar esta área. 
              Apenas administradores podem visualizar este conteúdo.
            </p>
            <p className="text-sm text-muted-foreground">
              Seu perfil atual: <strong>{user?.role}</strong>
            </p>
          </CardContent>
        </Card>
      </div>
    ))
    
    return <FallbackComponent />
  }

  // Authenticated and authorized
  return <>{children}</>
}

// Componente para redirecionar baseado no tipo de usuário
export function RoleBasedRedirect() {
  const { user } = useAuth()

  if (!user) return null

  // Se for admin, mostra dashboard administrativo
  if (user.role === 'ADMIN' || user.role === 'SUPERADMIN') {
    return <AdminDashboardPage />
  }

  // Se for usuário regular, mostra dashboard normal
  return <AdminProfilePage />
}

export { AdminDashboardPage, AdminProfilePage }
