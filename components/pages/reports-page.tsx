"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Progress } from "@/components/ui/progress"
import { 
  BarChart3, 
  TrendingUp, 
  TrendingDown,
  MessageSquare, 
  Users, 
  Target,
  Calendar as CalendarIcon,
  Download,
  Filter,
  Eye,
  Smartphone,
  Clock,
  CheckCircle,
  AlertCircle
} from "lucide-react"
import ReportsPanel from "../reports-panel"

export default function ReportsPage() {
  const [activeTab, setActiveTab] = useState("overview")
  const [dateRange, setDateRange] = useState<Date | undefined>(new Date())

  const kpis = [
    {
      title: "Mensagens Enviadas",
      value: "12.847",
      change: "+18.2%",
      trend: "up",
      icon: MessageSquare,
      period: "vs. mês anterior"
    },
    {
      title: "Taxa de Entrega",
      value: "96.8%",
      change: "+2.1%",
      trend: "up",
      icon: CheckCircle,
      period: "vs. mês anterior"
    },
    {
      title: "Taxa de Resposta",
      value: "24.5%",
      change: "-1.3%",
      trend: "down",
      icon: TrendingUp,
      period: "vs. mês anterior"
    },
    {
      title: "Conversões",
      value: "487",
      change: "+32.4%",
      trend: "up",
      icon: Target,
      period: "vs. mês anterior"
    }
  ]

  const campaignData = [
    {
      name: "Promoção Agosto",
      sent: 2500,
      delivered: 2425,
      read: 1890,
      replied: 378,
      converted: 89,
      roi: "245%",
      status: "completed"
    },
    {
      name: "Black Friday Preview",
      sent: 5000,
      delivered: 4850,
      read: 3920,
      replied: 784,
      converted: 156,
      roi: "189%",
      status: "running"
    },
    {
      name: "Reativação Q3",
      sent: 1800,
      delivered: 1750,
      read: 1260,
      replied: 189,
      converted: 45,
      roi: "167%",
      status: "completed"
    }
  ]

  const numberHealth = [
    {
      number: "+55 11 99999-0001",
      health: 98,
      dailyLimit: 500,
      todayUsed: 87,
      status: "excellent"
    },
    {
      number: "+55 21 99999-0002", 
      health: 85,
      dailyLimit: 300,
      todayUsed: 245,
      status: "good"
    },
    {
      number: "+55 31 99999-0003",
      health: 72,
      dailyLimit: 200,
      todayUsed: 180,
      status: "warning"
    },
    {
      number: "+55 85 99999-0004",
      health: 45,
      dailyLimit: 100,
      todayUsed: 95,
      status: "critical"
    }
  ]

  const getHealthColor = (health: number) => {
    if (health >= 90) return "text-emerald-600"
    if (health >= 70) return "text-amber-600"
    if (health >= 50) return "text-orange-600"
    return "text-red-600"
  }

  const getHealthBadge = (status: string) => {
    switch (status) {
      case "excellent":
        return <Badge className="bg-emerald-100 text-emerald-700 hover:bg-emerald-100">Excelente</Badge>
      case "good":
        return <Badge className="bg-blue-100 text-blue-700 hover:bg-blue-100">Bom</Badge>
      case "warning":
        return <Badge className="bg-amber-100 text-amber-700 hover:bg-amber-100">Atenção</Badge>
      case "critical":
        return <Badge variant="destructive">Crítico</Badge>
      default:
        return <Badge variant="outline">Desconhecido</Badge>
    }
  }

  const getTrendIcon = (trend: string) => {
    return trend === "up" ? (
      <TrendingUp className="h-4 w-4 text-emerald-500" />
    ) : (
      <TrendingDown className="h-4 w-4 text-red-500" />
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Relatórios e Análises</h1>
          <p className="text-muted-foreground">
            Insights detalhados sobre performance e métricas
          </p>
        </div>
        <div className="flex gap-2">
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline">
                <CalendarIcon className="h-4 w-4 mr-2" />
                Período
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <Calendar
                mode="single"
                selected={dateRange}
                onSelect={setDateRange}
                initialFocus
              />
            </PopoverContent>
          </Popover>
          <Button variant="outline">
            <Filter className="h-4 w-4 mr-2" />
            Filtros
          </Button>
          <Button>
            <Download className="h-4 w-4 mr-2" />
            Exportar
          </Button>
        </div>
      </div>

      {/* KPIs */}
      <div className="grid gap-4 md:grid-cols-4">
        {kpis.map((kpi) => {
          const Icon = kpi.icon
          return (
            <Card key={kpi.title}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  {kpi.title}
                </CardTitle>
                <Icon className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{kpi.value}</div>
                <div className="flex items-center gap-1 text-xs text-muted-foreground">
                  {getTrendIcon(kpi.trend)}
                  <span className={kpi.trend === "up" ? "text-emerald-600" : "text-red-600"}>
                    {kpi.change}
                  </span>
                  <span>{kpi.period}</span>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* Main Content */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Visão Geral</TabsTrigger>
          <TabsTrigger value="campaigns">Campanhas</TabsTrigger>
          <TabsTrigger value="numbers">Números</TabsTrigger>
          <TabsTrigger value="advanced">Avançado</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid gap-4 lg:grid-cols-7">
            {/* Performance Chart */}
            <Card className="lg:col-span-4">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5" />
                  Performance dos Últimos 30 Dias
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-[300px] flex items-center justify-center bg-muted/30 rounded-lg">
                  <p className="text-muted-foreground">Gráfico de Performance</p>
                </div>
              </CardContent>
            </Card>

            {/* Top Metrics */}
            <Card className="lg:col-span-3">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="h-5 w-5" />
                  Métricas Principais
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>Meta Mensal</span>
                      <span>68%</span>
                    </div>
                    <Progress value={68} className="h-2" />
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>Satisfação Cliente</span>
                      <span>92%</span>
                    </div>
                    <Progress value={92} className="h-2" />
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>Números Saudáveis</span>
                      <span>87%</span>
                    </div>
                    <Progress value={87} className="h-2" />
                  </div>
                </div>
                <div className="pt-4 space-y-2">
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
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Quick Stats */}
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
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="campaigns" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Performance de Campanhas</CardTitle>
              <CardDescription>
                Análise detalhada das campanhas executadas
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {campaignData.map((campaign, index) => (
                  <Card key={index}>
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between mb-4">
                        <div>
                          <h3 className="font-medium">{campaign.name}</h3>
                          <Badge 
                            className={campaign.status === "running" ? "bg-emerald-100 text-emerald-700" : ""}
                            variant={campaign.status === "running" ? "default" : "outline"}
                          >
                            {campaign.status === "running" ? "Em Andamento" : "Concluída"}
                          </Badge>
                        </div>
                        <div className="text-right">
                          <p className="text-lg font-bold text-emerald-600">{campaign.roi}</p>
                          <p className="text-sm text-muted-foreground">ROI</p>
                        </div>
                      </div>
                      <div className="grid grid-cols-5 gap-4 text-center">
                        <div>
                          <p className="text-2xl font-bold">{campaign.sent}</p>
                          <p className="text-xs text-muted-foreground">Enviadas</p>
                        </div>
                        <div>
                          <p className="text-2xl font-bold">{campaign.delivered}</p>
                          <p className="text-xs text-muted-foreground">Entregues</p>
                        </div>
                        <div>
                          <p className="text-2xl font-bold">{campaign.read}</p>
                          <p className="text-xs text-muted-foreground">Lidas</p>
                        </div>
                        <div>
                          <p className="text-2xl font-bold">{campaign.replied}</p>
                          <p className="text-xs text-muted-foreground">Respostas</p>
                        </div>
                        <div>
                          <p className="text-2xl font-bold text-emerald-600">{campaign.converted}</p>
                          <p className="text-xs text-muted-foreground">Conversões</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="numbers" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Smartphone className="h-5 w-5" />
                Saúde dos Números
              </CardTitle>
              <CardDescription>
                Monitoramento da performance e saúde dos números WhatsApp
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {numberHealth.map((num, index) => (
                  <Card key={index}>
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <Smartphone className="h-5 w-5 text-muted-foreground" />
                          <div>
                            <h3 className="font-medium">{num.number}</h3>
                            <p className="text-sm text-muted-foreground">
                              {num.todayUsed} / {num.dailyLimit} mensagens hoje
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-4">
                          {getHealthBadge(num.status)}
                          <div className="text-right">
                            <p className={`text-lg font-bold ${getHealthColor(num.health)}`}>
                              {num.health}/100
                            </p>
                            <p className="text-xs text-muted-foreground">saúde</p>
                          </div>
                        </div>
                      </div>
                      <div className="mt-4">
                        <div className="flex justify-between text-sm mb-1">
                          <span>Uso Diário</span>
                          <span>{Math.round((num.todayUsed / num.dailyLimit) * 100)}%</span>
                        </div>
                        <Progress 
                          value={(num.todayUsed / num.dailyLimit) * 100} 
                          className="h-2" 
                        />
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="advanced">
          <ReportsPanel />
        </TabsContent>
      </Tabs>
    </div>
  )
}
