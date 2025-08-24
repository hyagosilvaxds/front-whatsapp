'use client'

import { useAuth } from '@/contexts/auth-context'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Separator } from '@/components/ui/separator'
import { 
  User, 
  Building, 
  Crown, 
  Calendar,
  MessageSquare,
  BarChart3,
  Settings,
  LogOut,
  Shield,
  Zap
} from 'lucide-react'

export default function AdminProfilePage() {
  const { user, logout } = useAuth()

  if (!user) return null

  // Verificações de role atualizadas para nova API
  const isAdmin = user.role === 'ORG_ADMIN' || user.role === 'SUPER_ADMIN'
  const isSuperAdmin = user.role === 'SUPER_ADMIN'

  const adminFeatures = [
    {
      icon: Shield,
      title: 'Gerenciamento de Usuários',
      description: 'Controle total sobre contas e permissões'
    },
    {
      icon: BarChart3,
      title: 'Analytics Avançados',
      description: 'Relatórios detalhados e métricas do sistema'
    },
    {
      icon: Settings,
      title: 'Configurações do Sistema',
      description: 'Ajustes globais e configurações de segurança'
    },
    {
      icon: Zap,
      title: 'Monitoramento em Tempo Real',
      description: 'Status do sistema e performance'
    }
  ]

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Perfil do Administrador</h1>
          <p className="text-muted-foreground">Gerencie suas informações e configurações</p>
        </div>
        <Button variant="outline" onClick={logout}>
          <LogOut className="w-4 h-4 mr-2" />
          Sair
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Informações do Perfil */}
        <div className="lg:col-span-1 space-y-6">
          <Card>
            <CardContent className="pt-6">
              <div className="flex flex-col items-center space-y-4">
                <Avatar className="w-24 h-24">
                  <AvatarImage src="/placeholder-user.jpg" />
                  <AvatarFallback className="text-2xl">
                    {user.name.charAt(0)}
                  </AvatarFallback>
                </Avatar>
                
                <div className="text-center">
                  <h3 className="text-xl font-semibold">{user.name}</h3>
                  <p className="text-muted-foreground">{user.email}</p>
                  <div className="flex items-center justify-center gap-2 mt-2">
                    {isSuperAdmin ? (
                      <Badge className="bg-red-100 text-red-800 border-red-200">
                        <Crown className="w-3 h-3 mr-1" />
                        Super Admin
                      </Badge>
                    ) : isAdmin ? (
                      <Badge className="bg-purple-100 text-purple-800 border-purple-200">
                        <Crown className="w-3 h-3 mr-1" />
                        Administrador
                      </Badge>
                    ) : (
                      <Badge variant="secondary">
                        <User className="w-3 h-3 mr-1" />
                        {user.role}
                      </Badge>
                    )}
                  </div>
                </div>

                <Button className="w-full">
                  <Settings className="w-4 h-4 mr-2" />
                  Editar Perfil
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Informações da Empresa */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Building className="w-5 h-5" />
                Empresa
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div>
                <p className="text-sm text-muted-foreground">Nome</p>
                <p className="font-medium">{user.organization?.name || 'Sem organização'}</p>
              </div>
              <Separator />
              <div>
                <p className="text-sm text-muted-foreground">Plano</p>
                <div className="flex items-center gap-2 mt-1">
                  <Badge className="bg-purple-100 text-purple-800 border-purple-200">
                    STANDARD
                  </Badge>
                  <Badge className="bg-green-100 text-green-800 border-green-200">
                    Ativo
                  </Badge>
                </div>
              </div>
              <Separator />
              <div>
                <p className="text-sm text-muted-foreground">Último acesso</p>
                <p className="font-medium flex items-center gap-1">
                  <Calendar className="w-4 h-4" />
                  {user.lastLoginAt ? new Date(user.lastLoginAt).toLocaleDateString('pt-BR') : 'Nunca'}
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Recursos Administrativos */}
        <div className="lg:col-span-2 space-y-6">
          {isAdmin && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Crown className="w-5 h-5 text-purple-600" />
                  Recursos Administrativos
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {adminFeatures.map((feature, index) => (
                    <div key={index} className="p-4 border rounded-lg hover:bg-muted/50 transition-colors">
                      <div className="flex items-start gap-3">
                        <div className="p-2 bg-purple-100 rounded-lg">
                          <feature.icon className="w-5 h-5 text-purple-600" />
                        </div>
                        <div className="space-y-1">
                          <h4 className="font-medium">{feature.title}</h4>
                          <p className="text-sm text-muted-foreground">{feature.description}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Estatísticas Rápidas */}
          <Card>
            <CardHeader>
              <CardTitle>Visão Geral</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="text-center p-4 border rounded-lg">
                  <MessageSquare className="w-8 h-8 mx-auto mb-2 text-blue-600" />
                  <p className="text-2xl font-bold">2.4M</p>
                  <p className="text-sm text-muted-foreground">Mensagens Enviadas</p>
                </div>
                <div className="text-center p-4 border rounded-lg">
                  <User className="w-8 h-8 mx-auto mb-2 text-green-600" />
                  <p className="text-2xl font-bold">1,247</p>
                  <p className="text-sm text-muted-foreground">Usuários Ativos</p>
                </div>
                <div className="text-center p-4 border rounded-lg">
                  <BarChart3 className="w-8 h-8 mx-auto mb-2 text-purple-600" />
                  <p className="text-2xl font-bold">98.5%</p>
                  <p className="text-sm text-muted-foreground">Uptime do Sistema</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Ações Rápidas */}
          <Card>
            <CardHeader>
              <CardTitle>Ações Rápidas</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                <Button variant="outline" className="h-auto py-4 flex flex-col items-center gap-2">
                  <User className="w-6 h-6" />
                  <span>Gerenciar Usuários</span>
                </Button>
                <Button variant="outline" className="h-auto py-4 flex flex-col items-center gap-2">
                  <BarChart3 className="w-6 h-6" />
                  <span>Ver Relatórios</span>
                </Button>
                <Button variant="outline" className="h-auto py-4 flex flex-col items-center gap-2">
                  <Settings className="w-6 h-6" />
                  <span>Configurações</span>
                </Button>
                <Button variant="outline" className="h-auto py-4 flex flex-col items-center gap-2">
                  <Shield className="w-6 h-6" />
                  <span>Segurança</span>
                </Button>
                <Button variant="outline" className="h-auto py-4 flex flex-col items-center gap-2">
                  <MessageSquare className="w-6 h-6" />
                  <span>Sistema</span>
                </Button>
                <Button variant="outline" className="h-auto py-4 flex flex-col items-center gap-2">
                  <Zap className="w-6 h-6" />
                  <span>Performance</span>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
