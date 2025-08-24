'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Progress } from '@/components/ui/progress'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Separator } from '@/components/ui/separator'
import { 
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogDescription,
  DialogFooter
} from '@/components/ui/dialog'
import { 
  Users, 
  CreditCard, 
  Activity, 
  TrendingUp, 
  DollarSign,
  MessageSquare,
  Shield,
  AlertTriangle,
  CheckCircle,
  Clock,
  Building,
  Zap,
  BarChart3,
  Settings,
  Eye,
  Edit,
  Trash2,
  UserCheck,
  UserX,
  Plus,
  Brain,
  BookOpen,
  FileText,
  Search,
  Save,
  Upload,
  Download,
  Tag,
  Lightbulb
} from 'lucide-react'

interface AdminStats {
  totalUsers: number
  activeUsers: number
  revenue: number
  messagesCount: number
  subscriptions: {
    active: number
    cancelled: number
    pending: number
  }
}

interface Customer {
  id: string
  name: string
  email: string
  company: string
  plan: string
  status: 'active' | 'inactive' | 'pending'
  lastActivity: Date
  messagesUsed: number
  messagesLimit: number
  revenue: number
}

interface KnowledgeItem {
  id: string
  title: string
  category: 'produto' | 'servico' | 'empresa' | 'politicas' | 'suporte' | 'outro'
  content: string
  tags: string[]
  status: 'ativo' | 'inativo' | 'rascunho'
  createdAt: Date
  updatedAt: Date
  priority: 'alta' | 'media' | 'baixa'
  usage: number
}

interface KnowledgeCategory {
  value: string
  label: string
  description: string
  icon: React.ElementType
}

export default function AdminDashboardPage() {
  const stats: AdminStats = {
    totalUsers: 1247,
    activeUsers: 892,
    revenue: 45680,
    messagesCount: 2340000,
    subscriptions: {
      active: 892,
      cancelled: 89,
      pending: 23
    }
  }

  const recentCustomers: Customer[] = [
    {
      id: '1',
      name: 'João Silva',
      email: 'joao@empresa.com',
      company: 'Tech Solutions',
      plan: 'Pro',
      status: 'active',
      lastActivity: new Date(Date.now() - 2 * 60 * 60 * 1000),
      messagesUsed: 8500,
      messagesLimit: 10000,
      revenue: 297
    },
    {
      id: '2',
      name: 'Maria Santos',
      email: 'maria@startup.com',
      company: 'StartupXYZ',
      plan: 'Enterprise',
      status: 'active',
      lastActivity: new Date(Date.now() - 30 * 60 * 1000),
      messagesUsed: 25000,
      messagesLimit: 50000,
      revenue: 897
    },
    {
      id: '3',
      name: 'Pedro Costa',
      email: 'pedro@loja.com',
      company: 'Loja Online',
      plan: 'Basic',
      status: 'pending',
      lastActivity: new Date(Date.now() - 24 * 60 * 60 * 1000),
      messagesUsed: 1200,
      messagesLimit: 2000,
      revenue: 97
    },
    {
      id: '4',
      name: 'Ana Oliveira',
      email: 'ana@consultoria.com',
      company: 'Consultoria ABC',
      plan: 'Pro',
      status: 'inactive',
      lastActivity: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
      messagesUsed: 5600,
      messagesLimit: 10000,
      revenue: 297
    }
  ]

  const knowledgeCategories: KnowledgeCategory[] = [
    { value: 'produto', label: 'Produtos', description: 'Informações sobre produtos e features', icon: Lightbulb },
    { value: 'servico', label: 'Serviços', description: 'Descrição de serviços oferecidos', icon: Settings },
    { value: 'empresa', label: 'Empresa', description: 'Informações gerais da empresa', icon: Building },
    { value: 'politicas', label: 'Políticas', description: 'Termos de uso, privacidade, etc.', icon: Shield },
    { value: 'suporte', label: 'Suporte', description: 'Procedimentos e soluções', icon: MessageSquare },
    { value: 'outro', label: 'Outros', description: 'Outras informações relevantes', icon: FileText }
  ]

  const knowledgeItems: KnowledgeItem[] = [
    {
      id: '1',
      title: 'WhatsApp Suite - Funcionalidades Principais',
      category: 'produto',
      content: 'O WhatsApp Suite é uma plataforma completa para automação de mensagens WhatsApp. Principais funcionalidades:\n\n- Disparos em massa personalizados\n- Aquecimento automático de números\n- Chatbot com IA avançada\n- Relatórios detalhados\n- API completa para integração\n- Múltiplas conexões WhatsApp\n\nA plataforma permite enviar até 50.000 mensagens por mês no plano Enterprise.',
      tags: ['whatsapp', 'automacao', 'disparos', 'chatbot'],
      status: 'ativo',
      createdAt: new Date('2024-01-15'),
      updatedAt: new Date('2024-03-10'),
      priority: 'alta',
      usage: 1247
    },
    {
      id: '2',
      title: 'Planos e Preços',
      category: 'servico',
      content: 'Oferecemos 3 planos principais:\n\n**Basic (R$ 97/mês):**\n- 2.000 mensagens/mês\n- 1 conexão WhatsApp\n- Suporte básico\n\n**Pro (R$ 297/mês):**\n- 10.000 mensagens/mês\n- 5 conexões WhatsApp\n- IA Avançada\n- Relatórios detalhados\n\n**Enterprise (R$ 897/mês):**\n- 50.000 mensagens/mês\n- Conexões ilimitadas\n- API personalizada\n- Suporte prioritário\n\nTodos os planos incluem teste gratuito de 7 dias.',
      tags: ['precos', 'planos', 'assinatura'],
      status: 'ativo',
      createdAt: new Date('2024-01-20'),
      updatedAt: new Date('2024-03-15'),
      priority: 'alta',
      usage: 892
    },
    {
      id: '3',
      title: 'Sobre a TechSolutions',
      category: 'empresa',
      content: 'A TechSolutions é uma empresa brasileira especializada em soluções de automação para WhatsApp Business. Fundada em 2023, já atendemos mais de 1.200 empresas em todo o Brasil.\n\n**Nossa Missão:**\nSimplificar a comunicação empresarial através de tecnologia inovadora.\n\n**Valores:**\n- Inovação constante\n- Atendimento humanizado\n- Segurança de dados\n- Resultados mensuráveis\n\n**Localização:**\nSão Paulo, SP - Brasil\n\n**Suporte:**\nDisponível 24/7 para clientes Enterprise\nHorário comercial para demais planos',
      tags: ['empresa', 'historia', 'missao', 'valores'],
      status: 'ativo',
      createdAt: new Date('2024-02-01'),
      updatedAt: new Date('2024-02-15'),
      priority: 'media',
      usage: 456
    },
    {
      id: '4',
      title: 'Como configurar aquecimento de números',
      category: 'suporte',
      content: 'O aquecimento é essencial para evitar bloqueios. Siga estes passos:\n\n1. **Configuração inicial:**\n   - Vá em Aquecimento no menu\n   - Selecione o número a ser aquecido\n   - Defina a estratégia (conservadora/moderada/agressiva)\n\n2. **Cronograma recomendado:**\n   - Dia 1-3: 10-20 mensagens\n   - Dia 4-7: 30-50 mensagens\n   - Dia 8-14: 100-200 mensagens\n   - Após 14 dias: Volume normal\n\n3. **Dicas importantes:**\n   - Use mensagens variadas\n   - Inclua intervalos entre envios\n   - Monitore métricas de entrega\n   - Evite links externos inicialmente\n\n⚠️ IMPORTANTE: Nunca pule etapas do aquecimento.',
      tags: ['aquecimento', 'tutorial', 'whatsapp', 'configuracao'],
      status: 'ativo',
      createdAt: new Date('2024-02-10'),
      updatedAt: new Date('2024-03-01'),
      priority: 'alta',
      usage: 723
    },
    {
      id: '5',
      title: 'Política de Reembolso',
      category: 'politicas',
      content: 'Nossa política de reembolso garante total tranquilidade:\n\n**Período de Garantia:** 30 dias\n\n**Condições para reembolso:**\n- Solicitação dentro de 30 dias da compra\n- Uso inferior a 10% do limite de mensagens\n- Sem violação dos termos de uso\n\n**Processo:**\n1. Abrir ticket no suporte\n2. Justificar motivo do reembolso\n3. Análise em até 48h úteis\n4. Reembolso em até 7 dias úteis\n\n**Não elegível:**\n- Bloqueios por má conduta\n- Uso de conteúdo inadequado\n- Após 30 dias da compra\n\nPara solicitar reembolso: suporte@whatsappsuite.com',
      tags: ['reembolso', 'politica', 'garantia', 'suporte'],
      status: 'ativo',
      createdAt: new Date('2024-01-25'),
      updatedAt: new Date('2024-02-20'),
      priority: 'media',
      usage: 234
    }
  ]

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return <Badge className="bg-green-100 text-green-800 border-green-200"><CheckCircle className="w-3 h-3 mr-1" />Ativo</Badge>
      case 'inactive':
        return <Badge variant="secondary"><UserX className="w-3 h-3 mr-1" />Inativo</Badge>
      case 'pending':
        return <Badge className="bg-yellow-100 text-yellow-800 border-yellow-200"><Clock className="w-3 h-3 mr-1" />Pendente</Badge>
      default:
        return <Badge variant="outline">{status}</Badge>
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

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value)
  }

  const formatDate = (date: Date) => {
    return new Intl.RelativeTimeFormat('pt-BR', { numeric: 'auto' }).format(
      Math.ceil((date.getTime() - Date.now()) / (1000 * 60 * 60 * 24)),
      'day'
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Painel Administrativo</h1>
          <p className="text-muted-foreground">Gerencie usuários, assinaturas e monitore o sistema</p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" size="sm">
            <BarChart3 className="w-4 h-4 mr-2" />
            Relatórios
          </Button>
          <Button size="sm">
            <Settings className="w-4 h-4 mr-2" />
            Configurações
          </Button>
        </div>
      </div>

      {/* Cards de Estatísticas */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total de Usuários</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalUsers.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-green-600">+12%</span> vs mês anterior
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Usuários Ativos</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.activeUsers.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-green-600">+8%</span> vs mês anterior
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Receita Mensal</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(stats.revenue)}</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-green-600">+23%</span> vs mês anterior
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Mensagens Enviadas</CardTitle>
            <MessageSquare className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{(stats.messagesCount / 1000000).toFixed(1)}M</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-green-600">+15%</span> vs mês anterior
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Conteúdo Principal */}
      <Tabs defaultValue="customers" className="space-y-6">
        <TabsList className="grid w-full grid-cols-7">
          <TabsTrigger value="customers">Clientes</TabsTrigger>
          <TabsTrigger value="plans">Planos</TabsTrigger>
          <TabsTrigger value="apis">APIs</TabsTrigger>
          <TabsTrigger value="connections">Conexões</TabsTrigger>
          <TabsTrigger value="knowledge">Base de Conhecimento</TabsTrigger>
          <TabsTrigger value="system">Sistema</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        {/* Aba Clientes */}
        <TabsContent value="customers" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="w-5 h-5" />
                Clientes Recentes
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentCustomers.map((customer) => (
                  <div key={customer.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center gap-4">
                      <Avatar>
                        <AvatarImage src={`/placeholder-user.jpg`} />
                        <AvatarFallback>{customer.name.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <p className="font-medium">{customer.name}</p>
                          {getStatusBadge(customer.status)}
                          {getPlanBadge(customer.plan)}
                        </div>
                        <p className="text-sm text-muted-foreground">{customer.email}</p>
                        <p className="text-xs text-muted-foreground flex items-center gap-1">
                          <Building className="w-3 h-3" />
                          {customer.company}
                        </p>
                      </div>
                    </div>
                    
                    <div className="text-right space-y-1">
                      <p className="text-sm font-medium">{formatCurrency(customer.revenue)}/mês</p>
                      <p className="text-xs text-muted-foreground">
                        {customer.messagesUsed.toLocaleString()}/{customer.messagesLimit.toLocaleString()} mensagens
                      </p>
                      <Progress 
                        value={(customer.messagesUsed / customer.messagesLimit) * 100} 
                        className="w-20 h-2"
                      />
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <Button variant="outline" size="sm">
                        <Eye className="w-4 h-4" />
                      </Button>
                      <Button variant="outline" size="sm">
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button variant="outline" size="sm" className="text-red-600 hover:text-red-700">
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Aba Planos */}
        <TabsContent value="plans" className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold">Gerenciamento de Planos</h2>
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              Novo Plano
            </Button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Plano Basic */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2">
                    <Badge variant="outline">Basic</Badge>
                  </CardTitle>
                  <Button variant="outline" size="sm">
                    <Edit className="w-4 h-4" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-3xl font-bold">R$ 97/mês</div>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-600" />
                    2.000 mensagens/mês
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-600" />
                    1 conexão WhatsApp
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-600" />
                    Suporte básico
                  </li>
                </ul>
                <div className="pt-4 border-t">
                  <p className="text-sm text-muted-foreground">89 usuários ativos</p>
                </div>
              </CardContent>
            </Card>

            {/* Plano Pro */}
            <Card className="border-blue-200 bg-blue-50/50">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2">
                    <Badge className="bg-blue-100 text-blue-800 border-blue-200">Pro</Badge>
                    <Badge className="bg-green-100 text-green-800 border-green-200">Popular</Badge>
                  </CardTitle>
                  <Button variant="outline" size="sm">
                    <Edit className="w-4 h-4" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-3xl font-bold">R$ 297/mês</div>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-600" />
                    10.000 mensagens/mês
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-600" />
                    5 conexões WhatsApp
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-600" />
                    IA Avançada
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-600" />
                    Relatórios detalhados
                  </li>
                </ul>
                <div className="pt-4 border-t">
                  <p className="text-sm text-muted-foreground">456 usuários ativos</p>
                </div>
              </CardContent>
            </Card>

            {/* Plano Enterprise */}
            <Card className="border-purple-200 bg-purple-50/50">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2">
                    <Badge className="bg-purple-100 text-purple-800 border-purple-200">Enterprise</Badge>
                  </CardTitle>
                  <Button variant="outline" size="sm">
                    <Edit className="w-4 h-4" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-3xl font-bold">R$ 897/mês</div>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-600" />
                    50.000 mensagens/mês
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-600" />
                    Conexões ilimitadas
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-600" />
                    API personalizada
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-600" />
                    Suporte prioritário
                  </li>
                </ul>
                <div className="pt-4 border-t">
                  <p className="text-sm text-muted-foreground">67 usuários ativos</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Aba APIs */}
        <TabsContent value="apis" className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold">Gerenciamento de APIs</h2>
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              Nova API Key
            </Button>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Chaves de API por Cliente</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentCustomers.map((customer) => (
                  <div key={customer.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center gap-4">
                      <Avatar>
                        <AvatarImage src="/placeholder-user.jpg" />
                        <AvatarFallback>{customer.name.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium">{customer.name}</p>
                        <p className="text-sm text-muted-foreground">{customer.company}</p>
                        <p className="text-xs text-muted-foreground">
                          API: wps_{"*".repeat(16) + customer.id.slice(-4)}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant="outline">
                        {customer.plan}
                      </Badge>
                      <Button variant="outline" size="sm">
                        <Eye className="w-4 h-4" />
                      </Button>
                      <Button variant="outline" size="sm">
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button variant="outline" size="sm">
                        <Zap className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Aba Conexões */}
        <TabsContent value="connections" className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold">Gerenciamento de Conexões WhatsApp</h2>
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              Nova Conexão
            </Button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MessageSquare className="w-5 h-5" />
                  Conexões por Status
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="flex items-center gap-2">
                      <div className="w-3 h-3 bg-green-500 rounded-full" />
                      Conectadas
                    </span>
                    <span className="font-bold">1,247</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="flex items-center gap-2">
                      <div className="w-3 h-3 bg-yellow-500 rounded-full" />
                      Conectando
                    </span>
                    <span className="font-bold">23</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="flex items-center gap-2">
                      <div className="w-3 h-3 bg-red-500 rounded-full" />
                      Desconectadas
                    </span>
                    <span className="font-bold">89</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Conexões Recentes</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {recentCustomers.slice(0, 3).map((customer) => (
                    <div key={customer.id} className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <Avatar className="w-8 h-8">
                          <AvatarFallback className="text-xs">{customer.name.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="text-sm font-medium">{customer.company}</p>
                          <p className="text-xs text-muted-foreground">+55 11 9****-{customer.id.slice(-4)}</p>
                        </div>
                      </div>
                      <Badge className="bg-green-100 text-green-800 border-green-200">
                        <div className="w-2 h-2 bg-green-500 rounded-full mr-1" />
                        Online
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Todas as Conexões</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentCustomers.map((customer) => (
                  <div key={customer.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center gap-4">
                      <Avatar>
                        <AvatarImage src="/placeholder-user.jpg" />
                        <AvatarFallback>{customer.name.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium">{customer.name}</p>
                        <p className="text-sm text-muted-foreground">{customer.company}</p>
                        <p className="text-xs text-muted-foreground">
                          WhatsApp: +55 11 9****-{customer.id.slice(-4)}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <p className="text-sm font-medium">{customer.messagesUsed.toLocaleString()} msgs</p>
                        <p className="text-xs text-muted-foreground">Último envio: {formatDate(customer.lastActivity)}</p>
                      </div>
                      <Badge className="bg-green-100 text-green-800 border-green-200">
                        <div className="w-2 h-2 bg-green-500 rounded-full mr-1" />
                        Conectado
                      </Badge>
                      <div className="flex items-center gap-2">
                        <Button variant="outline" size="sm">
                          <Eye className="w-4 h-4" />
                        </Button>
                        <Button variant="outline" size="sm">
                          <Settings className="w-4 h-4" />
                        </Button>
                        <Button variant="outline" size="sm" className="text-red-600">
                          <UserX className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Aba Assinaturas (renomeada) */}
        <TabsContent value="subscriptions" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-green-600" />
                  Assinaturas Ativas
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-green-600">{stats.subscriptions.active}</div>
                <p className="text-sm text-muted-foreground">+5% este mês</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <AlertTriangle className="w-5 h-5 text-yellow-600" />
                  Pendentes
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-yellow-600">{stats.subscriptions.pending}</div>
                <p className="text-sm text-muted-foreground">Aguardando pagamento</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <UserX className="w-5 h-5 text-red-600" />
                  Canceladas
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-red-600">{stats.subscriptions.cancelled}</div>
                <p className="text-sm text-muted-foreground">-2% este mês</p>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Aba Base de Conhecimento */}
        <TabsContent value="knowledge" className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold">Base de Conhecimento da IA</h2>
              <p className="text-muted-foreground">Gerencie informações que a IA utilizará para responder sobre produtos, serviços e empresa</p>
            </div>
            <Dialog>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="w-4 h-4 mr-2" />
                  Novo Conteúdo
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>Adicionar Conteúdo à Base de Conhecimento</DialogTitle>
                  <DialogDescription>
                    Crie novo conteúdo que será usado pela IA para responder perguntas dos clientes
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="title">Título</Label>
                      <Input id="title" placeholder="Ex: Como funciona o aquecimento" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="category">Categoria</Label>
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione uma categoria" />
                        </SelectTrigger>
                        <SelectContent>
                          {knowledgeCategories.map((cat) => (
                            <SelectItem key={cat.value} value={cat.value}>
                              {cat.label} - {cat.description}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="content">Conteúdo</Label>
                    <Textarea 
                      id="content" 
                      placeholder="Digite o conteúdo detalhado que a IA deve conhecer..."
                      className="min-h-[200px]"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="tags">Tags (separadas por vírgula)</Label>
                      <Input id="tags" placeholder="whatsapp, automacao, tutorial" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="priority">Prioridade</Label>
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione a prioridade" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="alta">Alta - Informação crítica</SelectItem>
                          <SelectItem value="media">Média - Informação importante</SelectItem>
                          <SelectItem value="baixa">Baixa - Informação adicional</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline">Cancelar</Button>
                  <Button>
                    <Save className="w-4 h-4 mr-2" />
                    Salvar Conteúdo
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>

          {/* Estatísticas da Base de Conhecimento */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total de Conteúdos</CardTitle>
                <BookOpen className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{knowledgeItems.length}</div>
                <p className="text-xs text-muted-foreground">
                  {knowledgeItems.filter(item => item.status === 'ativo').length} ativos
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Mais Usado</CardTitle>
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {Math.max(...knowledgeItems.map(item => item.usage)).toLocaleString()}
                </div>
                <p className="text-xs text-muted-foreground">consultas este mês</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Categorias</CardTitle>
                <Tag className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{knowledgeCategories.length}</div>
                <p className="text-xs text-muted-foreground">diferentes tipos</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">IA Ativa</CardTitle>
                <Brain className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600">Online</div>
                <p className="text-xs text-muted-foreground">respondendo consultas</p>
              </CardContent>
            </Card>
          </div>

          {/* Filtros e Busca */}
          <Card>
            <CardHeader>
              <CardTitle>Filtrar Conteúdo</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-4">
                <div className="flex-1 min-w-[300px]">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                    <Input placeholder="Buscar por título, conteúdo ou tags..." className="pl-10" />
                  </div>
                </div>
                <Select defaultValue="all">
                  <SelectTrigger className="w-[180px]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todas as categorias</SelectItem>
                    {knowledgeCategories.map((cat) => (
                      <SelectItem key={cat.value} value={cat.value}>{cat.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Select defaultValue="all">
                  <SelectTrigger className="w-[150px]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todos os status</SelectItem>
                    <SelectItem value="ativo">Ativo</SelectItem>
                    <SelectItem value="inativo">Inativo</SelectItem>
                    <SelectItem value="rascunho">Rascunho</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Lista de Conteúdos */}
          <div className="space-y-4">
            {knowledgeItems.map((item) => {
              const CategoryIcon = knowledgeCategories.find(cat => cat.value === item.category)?.icon || FileText
              
              const getStatusBadge = (status: string) => {
                switch (status) {
                  case 'ativo':
                    return <Badge className="bg-green-100 text-green-800 border-green-200">Ativo</Badge>
                  case 'inativo':
                    return <Badge variant="secondary">Inativo</Badge>
                  case 'rascunho':
                    return <Badge className="bg-yellow-100 text-yellow-800 border-yellow-200">Rascunho</Badge>
                  default:
                    return <Badge variant="outline">{status}</Badge>
                }
              }

              const getPriorityBadge = (priority: string) => {
                switch (priority) {
                  case 'alta':
                    return <Badge className="bg-red-100 text-red-800 border-red-200">Alta</Badge>
                  case 'media':
                    return <Badge className="bg-yellow-100 text-yellow-800 border-yellow-200">Média</Badge>
                  case 'baixa':
                    return <Badge className="bg-gray-100 text-gray-800 border-gray-200">Baixa</Badge>
                  default:
                    return <Badge variant="outline">{priority}</Badge>
                }
              }

              return (
                <Card key={item.id}>
                  <CardContent className="pt-6">
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-4 flex-1">
                        <div className="flex-shrink-0">
                          <div className="w-10 h-10 rounded-lg bg-emerald-100 flex items-center justify-center">
                            <CategoryIcon className="w-5 h-5 text-emerald-600" />
                          </div>
                        </div>
                        <div className="flex-1 space-y-2">
                          <div className="flex items-start justify-between">
                            <h3 className="font-semibold text-lg">{item.title}</h3>
                            <div className="flex items-center gap-2">
                              {getStatusBadge(item.status)}
                              {getPriorityBadge(item.priority)}
                            </div>
                          </div>
                          
                          <div className="flex items-center gap-4 text-sm text-muted-foreground">
                            <span className="flex items-center gap-1">
                              <CategoryIcon className="w-4 h-4" />
                              {knowledgeCategories.find(cat => cat.value === item.category)?.label}
                            </span>
                            <span className="flex items-center gap-1">
                              <Eye className="w-4 h-4" />
                              {item.usage.toLocaleString()} consultas
                            </span>
                            <span className="flex items-center gap-1">
                              <Clock className="w-4 h-4" />
                              Atualizado: {item.updatedAt.toLocaleDateString('pt-BR')}
                            </span>
                          </div>

                          <p className="text-sm text-muted-foreground line-clamp-2">
                            {item.content.substring(0, 200)}...
                          </p>

                          <div className="flex flex-wrap gap-1">
                            {item.tags.map((tag, index) => (
                              <Badge key={index} variant="outline" className="text-xs">
                                {tag}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-2 ml-4">
                        <Button variant="outline" size="sm">
                          <Eye className="w-4 h-4" />
                        </Button>
                        <Button variant="outline" size="sm">
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button variant="outline" size="sm" className="text-red-600">
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>

          {/* Ações em Massa */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="w-5 h-5" />
                Ações em Massa
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-4">
                <Button variant="outline">
                  <Upload className="w-4 h-4 mr-2" />
                  Importar Conteúdo
                </Button>
                <Button variant="outline">
                  <Download className="w-4 h-4 mr-2" />
                  Exportar Base
                </Button>
                <Button variant="outline">
                  <Brain className="w-4 h-4 mr-2" />
                  Treinar IA
                </Button>
                <Button variant="outline">
                  <Zap className="w-4 h-4 mr-2" />
                  Testar Respostas
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Aba Sistema */}
        <TabsContent value="system" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="w-5 h-5" />
                  Status do Sistema
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <span>API Principal</span>
                  <Badge className="bg-green-100 text-green-800 border-green-200">
                    <CheckCircle className="w-3 h-3 mr-1" />
                    Online
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span>Base de Dados</span>
                  <Badge className="bg-green-100 text-green-800 border-green-200">
                    <CheckCircle className="w-3 h-3 mr-1" />
                    Online
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span>WhatsApp API</span>
                  <Badge className="bg-green-100 text-green-800 border-green-200">
                    <CheckCircle className="w-3 h-3 mr-1" />
                    Online
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span>Servidor de Arquivos</span>
                  <Badge className="bg-yellow-100 text-yellow-800 border-yellow-200">
                    <Clock className="w-3 h-3 mr-1" />
                    Lento
                  </Badge>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Zap className="w-5 h-5" />
                  Performance
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>CPU</span>
                    <span>45%</span>
                  </div>
                  <Progress value={45} />
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Memória</span>
                    <span>72%</span>
                  </div>
                  <Progress value={72} />
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Armazenamento</span>
                    <span>34%</span>
                  </div>
                  <Progress value={34} />
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Aba Analytics */}
        <TabsContent value="analytics" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Analytics em Desenvolvimento</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Gráficos e análises detalhadas serão implementados nesta seção.
              </p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
