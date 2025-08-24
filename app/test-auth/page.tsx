'use client';

import { useAuth } from '@/contexts/auth-context';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { debugAuthData } from '@/lib/api/auth';

export default function AuthTestPage() {
  const { user, isLoading, isAuthenticated } = useAuth();

  const handleDebug = () => {
    debugAuthData();
  };

  if (isLoading) {
    return (
      <div className="p-8">
        <Card>
          <CardContent className="p-6">
            <p>Carregando...</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="p-8 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Teste de Autenticação</h1>
        <Button onClick={handleDebug} variant="outline">
          Debug Auth Data
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Status da Autenticação */}
        <Card>
          <CardHeader>
            <CardTitle>Status da Autenticação</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <span>Está autenticado:</span>
              <Badge variant={isAuthenticated ? "default" : "destructive"}>
                {isAuthenticated ? "SIM" : "NÃO"}
              </Badge>
            </div>
            
            <div className="flex items-center justify-between">
              <span>Carregando:</span>
              <Badge variant={isLoading ? "secondary" : "outline"}>
                {isLoading ? "SIM" : "NÃO"}
              </Badge>
            </div>
            
            <div className="flex items-center justify-between">
              <span>Usuário encontrado:</span>
              <Badge variant={user ? "default" : "destructive"}>
                {user ? "SIM" : "NÃO"}
              </Badge>
            </div>
          </CardContent>
        </Card>

        {/* Dados do Usuário */}
        <Card>
          <CardHeader>
            <CardTitle>Dados do Usuário</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {user ? (
              <>
                <div>
                  <span className="text-sm text-muted-foreground">ID:</span>
                  <p className="font-mono text-sm">{user.id}</p>
                </div>
                
                <Separator />
                
                <div>
                  <span className="text-sm text-muted-foreground">Nome:</span>
                  <p className="font-medium">{user.name}</p>
                </div>
                
                <div>
                  <span className="text-sm text-muted-foreground">Email:</span>
                  <p className="font-medium">{user.email}</p>
                </div>
                
                <div>
                  <span className="text-sm text-muted-foreground">Role:</span>
                  <Badge>{user.role}</Badge>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Ativo:</span>
                  <Badge variant={user.isActive ? "default" : "secondary"}>
                    {user.isActive ? "SIM" : "NÃO"}
                  </Badge>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Online:</span>
                  <Badge variant={user.isOnline ? "default" : "secondary"}>
                    {user.isOnline ? "SIM" : "NÃO"}
                  </Badge>
                </div>
                
                {user.lastLoginAt && (
                  <div>
                    <span className="text-sm text-muted-foreground">Último login:</span>
                    <p className="text-sm">{new Date(user.lastLoginAt).toLocaleString('pt-BR')}</p>
                  </div>
                )}
              </>
            ) : (
              <p className="text-muted-foreground">Nenhum dado de usuário disponível</p>
            )}
          </CardContent>
        </Card>

        {/* Dados da Organização */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Dados da Organização</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {user?.organization ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div>
                  <span className="text-sm text-muted-foreground">ID:</span>
                  <p className="font-mono text-sm">{user.organization.id}</p>
                </div>
                
                <div>
                  <span className="text-sm text-muted-foreground">Nome:</span>
                  <p className="font-medium">{user.organization.name}</p>
                </div>
                
                <div>
                  <span className="text-sm text-muted-foreground">Slug:</span>
                  <p className="font-mono text-sm">{user.organization.slug}</p>
                </div>
                
                <div>
                  <span className="text-sm text-muted-foreground">Plano:</span>
                  <Badge variant="outline">{user.organization.plan}</Badge>
                </div>
              </div>
            ) : (
              <p className="text-muted-foreground">Nenhum dado de organização disponível</p>
            )}
          </CardContent>
        </Card>

        {/* Dados Raw (JSON) */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Dados Raw (JSON)</CardTitle>
          </CardHeader>
          <CardContent>
            {user ? (
              <pre className="bg-muted p-4 rounded-lg text-xs overflow-auto max-h-64">
                {JSON.stringify(user, null, 2)}
              </pre>
            ) : (
              <p className="text-muted-foreground">Nenhum dado disponível</p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
