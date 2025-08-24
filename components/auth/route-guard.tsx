'use client';

import { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAuth } from '@/contexts/auth-context';

interface RouteGuardProps {
  children: React.ReactNode;
}

export default function RouteGuard({ children }: RouteGuardProps) {
  const { isAuthenticated, isLoading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  // Rotas públicas que não precisam de autenticação
  const publicRoutes = ['/login', '/signup'];
  
  // Verifica se a rota atual é pública
  const isPublicRoute = publicRoutes.includes(pathname);

  useEffect(() => {
    if (!isLoading) {
      if (isAuthenticated && isPublicRoute) {
        // Se está logado e tentando acessar rota pública (login/signup), redireciona para home
        console.log('Usuário logado tentando acessar rota pública, redirecionando para /');
        router.replace('/');
      } else if (!isAuthenticated && !isPublicRoute) {
        // Se não está logado e tentando acessar rota privada, redireciona para login
        console.log('Usuário não logado tentando acessar rota privada, redirecionando para /login');
        router.replace('/login');
      }
    }
  }, [isAuthenticated, isLoading, isPublicRoute, router, pathname]);

  // Se está carregando, mostra loading
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    );
  }

  // Se está logado e tentando acessar rota pública, não renderiza nada (vai redirecionar)
  if (isAuthenticated && isPublicRoute) {
    return null;
  }

  // Se não está logado e tentando acessar rota privada, não renderiza nada (vai redirecionar)
  if (!isAuthenticated && !isPublicRoute) {
    return null;
  }

  // Caso contrário, renderiza os filhos
  return <>{children}</>;
}
