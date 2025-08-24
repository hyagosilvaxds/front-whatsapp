'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { 
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { 
  Users, 
  Search, 
  Plus, 
  Edit, 
  Trash2, 
  Eye,
  UserCheck,
  UserX,
  Crown,
  Building,
  Mail,
  Calendar,
  MoreHorizontal,
  Filter
} from 'lucide-react'
import { useToast } from '@/hooks/use-toast'

interface User {
  id: string
  name: string
  email: string
  role: 'admin' | 'user'
  status: 'active' | 'inactive' | 'pending'
  company: string
  plan: string
  joinDate: Date
  lastActivity: Date
  messagesUsed: number
  messagesLimit: number
  avatar?: string
}

export default function AdminUsersPage() {
  const { toast } = useToast()
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedFilter, setSelectedFilter] = useState('all')
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)

  const mockUsers: User[] = [
    {
      id: '1',
      name: 'João Silva',
      email: 'joao@empresa.com',
      role: 'user',
      status: 'active',
      company: 'Tech Solutions',
      plan: 'Pro',
      joinDate: new Date('2024-01-15'),
      lastActivity: new Date(Date.now() - 2 * 60 * 60 * 1000),
      messagesUsed: 8500,
      messagesLimit: 10000,
      avatar: '/placeholder-user.jpg'
    },
    {
      id: '2',
      name: 'Maria Santos',
      email: 'maria@startup.com',
      role: 'user',
      status: 'active',
      company: 'StartupXYZ',
      plan: 'Enterprise',
      joinDate: new Date('2024-02-20'),
      lastActivity: new Date(Date.now() - 30 * 60 * 1000),
      messagesUsed: 25000,
      messagesLimit: 50000,
      avatar: '/placeholder-user.jpg'
    },
    {
      id: '3',
      name: 'Pedro Costa',
      email: 'pedro@loja.com',
      role: 'user',
      status: 'pending',
      company: 'Loja Online',
      plan: 'Basic',
      joinDate: new Date('2024-03-10'),
      lastActivity: new Date(Date.now() - 24 * 60 * 60 * 1000),
      messagesUsed: 1200,
      messagesLimit: 2000,
      avatar: '/placeholder-user.jpg'
    },
    {
      id: '4',
      name: 'Ana Oliveira',
      email: 'ana@consultoria.com',
      role: 'admin',
      status: 'active',
      company: 'Consultoria ABC',
      plan: 'Enterprise',
      joinDate: new Date('2023-12-01'),
      lastActivity: new Date(Date.now() - 1 * 60 * 60 * 1000),
      messagesUsed: 15000,
      messagesLimit: 50000,
      avatar: '/placeholder-user.jpg'
    }
  ]

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return <Badge className="bg-green-100 text-green-800 border-green-200">Ativo</Badge>
      case 'inactive':
        return <Badge variant="secondary">Inativo</Badge>
      case 'pending':
        return <Badge className="bg-yellow-100 text-yellow-800 border-yellow-200">Pendente</Badge>
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  const getRoleBadge = (role: string) => {
    switch (role) {
      case 'admin':
        return (
          <Badge className="bg-purple-100 text-purple-800 border-purple-200">
            <Crown className="w-3 h-3 mr-1" />
            Admin
          </Badge>
        )
      case 'user':
        return <Badge variant="outline">Usuário</Badge>
      default:
        return <Badge variant="outline">{role}</Badge>
    }
  }

  const getPlanBadge = (plan: string) => {
    switch (plan) {
      case 'Basic':
        return <Badge variant="outline">Basic</Badge>
      case 'Pro':
        return <Badge className="bg-blue-100 text-blue-800 border-blue-200">Pro</Badge>
      case 'Enterprise':
        return <Badge className="bg-purple-100 text-purple-800 border-purple-200">Enterprise</Badge>
      default:
        return <Badge variant="outline">{plan}</Badge>
    }
  }

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('pt-BR')
  }

  const getUsagePercentage = (used: number, limit: number) => {
    return Math.round((used / limit) * 100)
  }

  const filteredUsers = mockUsers.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         user.company.toLowerCase().includes(searchQuery.toLowerCase())
    
    const matchesFilter = selectedFilter === 'all' || 
                         user.status === selectedFilter ||
                         user.role === selectedFilter ||
                         user.plan.toLowerCase() === selectedFilter
    
    return matchesSearch && matchesFilter
  })

  const handleDeleteUser = (userId: string) => {
    toast({
      title: 'Usuário removido',
      description: 'O usuário foi removido do sistema com sucesso.',
    })
  }

  const handleToggleStatus = (userId: string, currentStatus: string) => {
    const newStatus = currentStatus === 'active' ? 'inactive' : 'active'
    toast({
      title: 'Status atualizado',
      description: `Status do usuário alterado para ${newStatus === 'active' ? 'ativo' : 'inativo'}.`,
    })
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Gerenciamento de Usuários</h1>
          <p className="text-muted-foreground">Gerencie contas de usuários e permissões</p>
        </div>
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              Novo Usuário
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Criar Novo Usuário</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Nome</Label>
                <Input id="name" placeholder="Nome completo" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" placeholder="email@exemplo.com" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="company">Empresa</Label>
                <Input id="company" placeholder="Nome da empresa" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="role">Função</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione a função" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="user">Usuário</SelectItem>
                    <SelectItem value="admin">Administrador</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="plan">Plano</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o plano" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="basic">Basic</SelectItem>
                    <SelectItem value="pro">Pro</SelectItem>
                    <SelectItem value="enterprise">Enterprise</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex gap-2 pt-4">
                <Button onClick={() => setIsCreateDialogOpen(false)} variant="outline" className="flex-1">
                  Cancelar
                </Button>
                <Button onClick={() => setIsCreateDialogOpen(false)} className="flex-1">
                  Criar Usuário
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Filtros e Busca */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar usuários por nome, email ou empresa..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="flex gap-2">
              <Select value={selectedFilter} onValueChange={setSelectedFilter}>
                <SelectTrigger className="w-40">
                  <Filter className="w-4 h-4 mr-2" />
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos</SelectItem>
                  <SelectItem value="active">Ativos</SelectItem>
                  <SelectItem value="inactive">Inativos</SelectItem>
                  <SelectItem value="pending">Pendentes</SelectItem>
                  <SelectItem value="admin">Admins</SelectItem>
                  <SelectItem value="user">Usuários</SelectItem>
                  <SelectItem value="basic">Basic</SelectItem>
                  <SelectItem value="pro">Pro</SelectItem>
                  <SelectItem value="enterprise">Enterprise</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Lista de Usuários */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="w-5 h-5" />
            Usuários ({filteredUsers.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {filteredUsers.map((user) => (
              <div key={user.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors">
                <div className="flex items-center gap-4">
                  <Avatar className="w-12 h-12">
                    <AvatarImage src={user.avatar} />
                    <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <h4 className="font-medium">{user.name}</h4>
                      {getStatusBadge(user.status)}
                      {getRoleBadge(user.role)}
                      {getPlanBadge(user.plan)}
                    </div>
                    <p className="text-sm text-muted-foreground flex items-center gap-1">
                      <Mail className="w-3 h-3" />
                      {user.email}
                    </p>
                    <p className="text-xs text-muted-foreground flex items-center gap-1">
                      <Building className="w-3 h-3" />
                      {user.company}
                    </p>
                    <p className="text-xs text-muted-foreground flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      Desde {formatDate(user.joinDate)}
                    </p>
                  </div>
                </div>
                
                <div className="text-right space-y-1">
                  <p className="text-sm font-medium">
                    {user.messagesUsed.toLocaleString()}/{user.messagesLimit.toLocaleString()}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {getUsagePercentage(user.messagesUsed, user.messagesLimit)}% usado
                  </p>
                  <div className="w-20 h-2 bg-muted rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-primary rounded-full transition-all"
                      style={{ width: `${getUsagePercentage(user.messagesUsed, user.messagesLimit)}%` }}
                    />
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  <Button variant="outline" size="sm" title="Visualizar">
                    <Eye className="w-4 h-4" />
                  </Button>
                  <Button variant="outline" size="sm" title="Editar">
                    <Edit className="w-4 h-4" />
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    title={user.status === 'active' ? 'Desativar' : 'Ativar'}
                    onClick={() => handleToggleStatus(user.id, user.status)}
                  >
                    {user.status === 'active' ? (
                      <UserX className="w-4 h-4 text-orange-600" />
                    ) : (
                      <UserCheck className="w-4 h-4 text-green-600" />
                    )}
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    title="Remover"
                    onClick={() => handleDeleteUser(user.id)}
                    className="text-red-600 hover:text-red-700"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            ))}
            
            {filteredUsers.length === 0 && (
              <div className="text-center py-12">
                <Users className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium mb-2">Nenhum usuário encontrado</h3>
                <p className="text-muted-foreground">
                  Tente ajustar os filtros ou termos de busca.
                </p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
