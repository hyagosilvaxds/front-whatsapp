'use client';

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { isAuthenticated, getFullUserData } from '../api/auth';
import { UserData } from '../types/auth';

interface AuthMiddlewareProps {
  children: React.ReactNode;
  requiredPermissions?: string[];
  requiredRoles?: string[];
  fallbackPath?: string;
}

export function AuthMiddleware({ 
  children, 
  requiredPermissions = [], 
  requiredRoles = [],
  fallbackPath = '/login' 
}: AuthMiddlewareProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [userData, setUserData] = useState<UserData | null>(null);
  const router = useRouter();
  const pathname = usePathname();

  // Rotas públicas que não precisam de autenticação
  const publicRoutes = ['/login', '/signup'];

  useEffect(() => {
    const checkAuth = async () => {
      try {
        // Se a rota é pública, não verificar autenticação
        if (publicRoutes.includes(pathname)) {
          setIsLoading(false);
          return;
        }

        // Verificar se está autenticado
        if (!isAuthenticated()) {
          console.log('Usuário não autenticado, redirecionando para login');
          router.replace(fallbackPath);
          return;
        }

        // Buscar dados completos do usuário (com cache para evitar requisições excessivas)
        const user = await getFullUserData(false); // false = usar cache se disponível
        if (!user) {
          console.log('Não foi possível obter dados do usuário');
          router.replace(fallbackPath);
          return;
        }

        setUserData(user);

        // Verificar permissões se necessário
        if (requiredPermissions.length > 0) {
          const hasRequiredPermissions = await checkUserPermissions(requiredPermissions);
          if (!hasRequiredPermissions) {
            console.log('Usuário não possui permissões necessárias');
            router.replace('/unauthorized');
            return;
          }
        }

        // Por enquanto não verificar roles - comentado
        // if (requiredRoles.length > 0) {
        //   const hasRequiredRole = requiredRoles.includes(user.role);
        //   if (!hasRequiredRole) {
        //     console.log('Usuário não possui role necessário');
        //     router.replace('/unauthorized');
        //     return;
        //   }
        // }

        setIsLoading(false);
      } catch (error) {
        console.error('Erro na verificação de autenticação:', error);
        router.replace(fallbackPath);
      }
    };

    checkAuth();
  }, [pathname, router, fallbackPath, requiredPermissions, requiredRoles]);

  const checkUserPermissions = async (permissions: string[]): Promise<boolean> => {
    try {
      const { getUserPermissions } = await import('../api/auth');
      const userPermissions = await getUserPermissions();
      
      return permissions.every(permission => 
        userPermissions.permissions.some(p => p.type === permission)
      );
    } catch (error) {
      console.error('Erro ao verificar permissões:', error);
      return false;
    }
  };

  // Mostrar loading enquanto verifica autenticação
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return <>{children}</>;
}

// HOC para proteger componentes específicos
export function withAuth<T extends object>(
  Component: React.ComponentType<T>,
  options?: {
    requiredPermissions?: string[];
    requiredRoles?: string[];
    fallbackPath?: string;
  }
) {
  return function AuthenticatedComponent(props: T) {
    return (
      <AuthMiddleware
        requiredPermissions={options?.requiredPermissions}
        requiredRoles={options?.requiredRoles}
        fallbackPath={options?.fallbackPath}
      >
        <Component {...props} />
      </AuthMiddleware>
    );
  };
}

// Hook para usar dados do usuário autenticado
export function useAuth() {
  const [userData, setUserData] = useState<UserData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const { isAuthenticated: checkIsAuth, getFullUserData } = await import('../api/auth');
        
        if (checkIsAuth()) {
          setIsAuthenticated(true);
          const user = await getFullUserData(false); // false = usar cache se disponível
          setUserData(user);
        } else {
          setIsAuthenticated(false);
          setUserData(null);
        }
      } catch (error) {
        console.error('Erro ao verificar autenticação:', error);
        setIsAuthenticated(false);
        setUserData(null);
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, []);

  const logout = async () => {
    try {
      const { logout: authLogout } = await import('../api/auth');
      await authLogout();
      setUserData(null);
      setIsAuthenticated(false);
      window.location.href = '/login';
    } catch (error) {
      console.error('Erro ao fazer logout:', error);
    }
  };

  return {
    user: userData,
    isLoading,
    isAuthenticated,
    logout
  };
}
