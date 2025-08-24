"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Separator } from "@/components/ui/separator"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useApp } from "@/contexts/app-context"
import { 
  MessageSquare, 
  Rocket, 
  Flame, 
  Users, 
  BarChart3, 
  TrendingUp,
  Clock,
  CheckCircle,
  AlertCircle,
  Zap,
  ArrowRight,
  Target,
  DollarSign,
  Activity,
  Calendar,
  Bell,
  Settings,
  Plus,
  Eye,
  Phone,
  Mail,
  Globe,
  Star,
  Award,
  Smartphone
} from "lucide-react"

export default function DashboardPage() {
  const { navigateToPage, notifications } = useApp()

  const stats = [
    {
      title: "Conversas Ativas",
      value: "24",
      change: "+12%",
      trend: "up",
      icon: MessageSquare,
      color: "emerald",
      description: "Últimas 24h"
    },
    {
      title: "Campanhas Ativas", 
      value: "3",
      change: "+5 esta semana",
      trend: "up",
      icon: Rocket,
      color: "blue",
      description: "Em execução"
    },
    {
      title: "Taxa de Resposta",
      value: "87%",
      change: "+8% vs. mês anterior",
      trend: "up", 
      icon: TrendingUp,
      color: "purple",
      description: "Média mensal"
    },
    {
      title: "Números Aquecidos",
      value: "12/15",
      change: "3 em aquecimento",
      trend: "neutral",
      icon: Flame,
      color: "orange",
      description: "Status atual"
    },
    {
      title: "Receita do Mês",
      value: "R$ 48.5K",
      change: "+23% vs. mês anterior",
      trend: "up",
      icon: DollarSign,
      color: "green",
      description: "Agosto 2025"
    },
    {
      title: "Ticket Médio",
      value: "R$ 187",
      change: "+15% vs. mês anterior",
      trend: "up",
      icon: Target,
      color: "indigo",
      description: "Por conversão"
    }
  ]

  const quickActions = [
    {
      title: "Iniciar Atendimento",
      description: "Responder mensagens pendentes",
      icon: MessageSquare,
      action: () => navigateToPage('chat'),
      urgent: notifications.unreadChats > 0,
      badge: notifications.unreadChats > 0 ? notifications.unreadChats : undefined
    },
    {
      title: "Nova Campanha",
      description: "Criar disparos em massa",
      icon: Rocket,
      action: () => navigateToPage('bulk-sender'),
      urgent: false
    },
    {
      title: "Aquecer Números",
      description: "Gerenciar números WhatsApp",
      icon: Flame,
      action: () => navigateToPage('warmup'),
      urgent: notifications.pendingWarmups > 0,
      badge: notifications.pendingWarmups > 0 ? notifications.pendingWarmups : undefined
    },
    {
      title: "Ver Relatórios",
      description: "Análises e métricas",
      icon: BarChart3,
      action: () => navigateToPage('reports'),
      urgent: false
    }
  ]

  const recentActivity = [
    {
      type: "message",
      title: "Nova mensagem de Maria Santos",
      description: "Interessada no produto premium",
      time: "2 min atrás",
      status: "pending",
      avatar: "/placeholder-user.jpg",
      priority: "high"
    },
    {
      type: "campaign",
      title: "Campanha 'Promoção Agosto' finalizada",
      description: "89% de entrega, 156 conversões",
      time: "1 hora atrás", 
      status: "success",
      priority: "medium"
    },
    {
      type: "warmup",
      title: "Número +55 11 99999-0001 aquecido",
      description: "Pronto para campanhas de alto volume",
      time: "3 horas atrás",
      status: "success",
      priority: "low"
    },
    {
      type: "warning",
      title: "Limite de API próximo ao máximo",
      description: "87% do limite mensal utilizado",
      time: "5 horas atrás",
      status: "warning",
      priority: "high"
    },
    {
      type: "contact",
      title: "45 novos contatos adicionados",
      description: "Importação automática via webhook",
      time: "6 horas atrás",
      status: "info",
      priority: "low"
    }
  ]

  const topContacts = [
    {
      name: "Maria Santos",
      phone: "+55 11 99999-0001",
      avatar: "/placeholder-user.jpg",
      conversions: 8,
      revenue: 2340.00,
      lastContact: "2 min atrás",
      tags: ["VIP", "Premium"]
    },
    {
      name: "João Silva",
      phone: "+55 21 99999-0002", 
      avatar: "/placeholder-user.jpg",
      conversions: 5,
      revenue: 1250.00,
      lastContact: "1 hora atrás",
      tags: ["Cliente"]
    },
    {
      name: "Ana Costa",
      phone: "+55 31 99999-0003",
      avatar: "/placeholder-user.jpg",
      conversions: 3,
      revenue: 890.00,
      lastContact: "3 horas atrás",
      tags: ["Lead"]
    }
  ]

  const upcomingTasks = [
    {
      id: "1",
      title: "Revisar campanha Black Friday",
      description: "Preparar conteúdo e audiência",
      dueDate: "Hoje, 16:00",
      priority: "high",
      type: "campaign"
    },
    {
      id: "2",
      title: "Follow-up com leads quentes",
      description: "15 contatos aguardando retorno",
      dueDate: "Amanhã, 09:00",
      priority: "medium",
      type: "contact"
    },
    {
      id: "3",
      title: "Análise de performance semanal",
      description: "Relatório para apresentação",
      dueDate: "Segunda, 14:00",
      priority: "low",
      type: "report"
    }
  ]

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground">
          Visão geral das suas operações no WhatsApp
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {stats.map((stat) => {
          const Icon = stat.icon
          return (
            <Card key={stat.title} className="relative overflow-hidden">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  {stat.title}
                </CardTitle>
                <Icon className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.value}</div>
                <p className="text-xs text-muted-foreground mt-1">
                  {stat.change}
                </p>
                <p className="text-xs text-muted-foreground/70 mt-1">
                  {stat.description}
                </p>
              </CardContent>
              <div className={`absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-${stat.color}-500 to-${stat.color}-600`} />
            </Card>
          )
        })}
      </div>

      <div className="grid gap-6 lg:grid-cols-12">
        {/* Quick Actions */}
        <Card className="lg:col-span-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Zap className="h-5 w-5" />
              Ações Rápidas
            </CardTitle>
            <CardDescription>
              Acesso rápido às principais funcionalidades
            </CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4 md:grid-cols-2">
            {quickActions.map((action) => {
              const Icon = action.icon
              return (
                <Button
                  key={action.title}
                  variant={action.urgent ? "default" : "outline"}
                  className="h-auto p-4 justify-start"
                  onClick={action.action}
                >
                  <div className="flex items-start gap-3 w-full">
                    <Icon className="h-5 w-5 mt-1 flex-shrink-0" />
                    <div className="text-left flex-1">
                      <div className="flex items-center gap-2">
                        <span className="font-medium">{action.title}</span>
                        {action.badge && (
                          <Badge variant="destructive" className="h-5 px-2">
                            {action.badge}
                          </Badge>
                        )}
                      </div>
                      <div className="text-sm opacity-70 mt-1">
                        {action.description}
                      </div>
                    </div>
                    <ArrowRight className="h-4 w-4 opacity-50" />
                  </div>
                </Button>
              )
            })}
          </CardContent>
        </Card>

        {/* Upcoming Tasks */}
        <Card className="lg:col-span-4">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Próximas Tarefas
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {upcomingTasks.map((task) => (
              <div key={task.id} className="flex items-start gap-3 p-3 rounded-lg border">
                <div className={`h-2 w-2 rounded-full mt-2 ${
                  task.priority === 'high' ? 'bg-red-500' :
                  task.priority === 'medium' ? 'bg-amber-500' : 'bg-blue-500'
                }`} />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium">{task.title}</p>
                  <p className="text-xs text-muted-foreground mt-1">{task.description}</p>
                  <p className="text-xs text-muted-foreground mt-1">{task.dueDate}</p>
                </div>
              </div>
            ))}
            <Button variant="outline" className="w-full mt-3">
              <Plus className="h-4 w-4 mr-2" />
              Nova Tarefa
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Main Dashboard Grid */}
      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Visão Geral</TabsTrigger>
          <TabsTrigger value="performance">Performance</TabsTrigger>
          <TabsTrigger value="contacts">Top Contatos</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid gap-6 lg:grid-cols-7">
            {/* Recent Activity */}
            <Card className="lg:col-span-4">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Activity className="h-5 w-5" />
                  Atividade Recente
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {recentActivity.map((activity, index) => (
                  <div key={index} className="flex items-start gap-3">
                    <div className="mt-1">
                      {activity.status === "success" && (
                        <CheckCircle className="h-4 w-4 text-emerald-500" />
                      )}
                      {activity.status === "warning" && (
                        <AlertCircle className="h-4 w-4 text-amber-500" />
                      )}
                      {activity.status === "pending" && (
                        <Clock className="h-4 w-4 text-blue-500" />
                      )}
                      {activity.status === "info" && (
                        <Bell className="h-4 w-4 text-blue-500" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between">
                        <div>
                          <p className="text-sm font-medium leading-none">
                            {activity.title}
                          </p>
                          <p className="text-xs text-muted-foreground mt-1">
                            {activity.description}
                          </p>
                        </div>
                        {activity.priority === "high" && (
                          <Badge variant="destructive" className="ml-2">
                            Urgente
                          </Badge>
                        )}
                      </div>
                      <p className="text-xs text-muted-foreground mt-1">
                        {activity.time}
                      </p>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Performance Overview */}
            <Card className="lg:col-span-3">
              <CardHeader>
                <CardTitle>Performance do Mês</CardTitle>
                <CardDescription>
                  Métricas principais de agosto 2025
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span>Meta Mensal</span>
                      <span>68% • R$ 34K / R$ 50K</span>
                    </div>
                    <Progress value={68} className="h-2" />
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span>Satisfação Cliente</span>
                      <span>92% • 4.6/5.0</span>
                    </div>
                    <Progress value={92} className="h-2" />
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span>Números Saudáveis</span>
                      <span>87% • 13/15</span>
                    </div>
                    <Progress value={87} className="h-2" />
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span>Taxa Conversão</span>
                      <span>24.5% • +3.2% vs mês</span>
                    </div>
                    <Progress value={75} className="h-2" />
                  </div>
                </div>
                
                <Separator />
                
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm">Receita Total</span>
                    <span className="font-medium">R$ 48.567</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">Ticket Médio</span>
                    <span className="font-medium">R$ 187</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">ROI Médio</span>
                    <span className="font-medium text-emerald-600">234%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">Campanhas Ativas</span>
                    <span className="font-medium">3</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="performance" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-3">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Hoje</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm">Mensagens Enviadas</span>
                  <span className="font-medium">847</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm">Respostas Recebidas</span>
                  <span className="font-medium">156</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm">Novos Contatos</span>
                  <span className="font-medium">23</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm">Conversões</span>
                  <span className="font-medium text-emerald-600">12</span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Esta Semana</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm">Campanhas Ativas</span>
                  <span className="font-medium">3</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm">Taxa de Conversão</span>
                  <span className="font-medium">18.7%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm">Receita Gerada</span>
                  <span className="font-medium">R$ 12.456</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm">NPS Score</span>
                  <span className="font-medium text-emerald-600">87</span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Este Mês</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm">Crescimento Base</span>
                  <span className="font-medium text-emerald-600">+23%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm">Campanhas Executadas</span>
                  <span className="font-medium">8</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm">ROI Acumulado</span>
                  <span className="font-medium text-emerald-600">267%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm">Economia em Ads</span>
                  <span className="font-medium text-emerald-600">R$ 8.9K</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="contacts" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Star className="h-5 w-5" />
                Top Contatos por Performance
              </CardTitle>
              <CardDescription>
                Seus contatos mais valiosos e engajados
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {topContacts.map((contact, index) => (
                  <div key={contact.phone} className="flex items-center gap-4 p-4 rounded-lg border">
                    <div className="flex items-center gap-3">
                      <div className={`w-6 h-6 rounded-full flex items-center justify-center text-white text-sm font-bold ${
                        index === 0 ? 'bg-yellow-500' : 
                        index === 1 ? 'bg-gray-400' : 'bg-amber-600'
                      }`}>
                        {index + 1}
                      </div>
                      <Avatar className="h-10 w-10">
                        <AvatarImage src={contact.avatar} alt={contact.name} />
                        <AvatarFallback>{contact.name.charAt(0)}</AvatarFallback>
                      </Avatar>
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium">{contact.name}</p>
                          <p className="text-sm text-muted-foreground">{contact.phone}</p>
                        </div>
                        <div className="text-right">
                          <p className="font-medium text-emerald-600">
                            R$ {contact.revenue.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            {contact.conversions} conversões
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center justify-between mt-2">
                        <div className="flex gap-1">
                          {contact.tags.map((tag) => (
                            <Badge key={tag} variant="outline" className="text-xs">
                              {tag}
                            </Badge>
                          ))}
                        </div>
                        <p className="text-xs text-muted-foreground">
                          Último contato: {contact.lastContact}
                        </p>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" onClick={() => navigateToPage('chat')}>
                        <MessageSquare className="h-4 w-4" />
                      </Button>
                      <Button variant="outline" size="sm">
                        <Phone className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
