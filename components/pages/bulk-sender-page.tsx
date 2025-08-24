"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { 
  Rocket, 
  Plus, 
  Play, 
  Pause, 
  BarChart3, 
  Users, 
  MessageSquare,
  Calendar,
  Clock,
  Target,
  TrendingUp,
  CheckCircle,
  AlertCircle
} from "lucide-react"
import BulkSender from "../bulk-sender"

export default function BulkSenderPage() {
  const [activeTab, setActiveTab] = useState("campaigns")

  const campaigns = [
    {
      id: "1",
      name: "Promoção Agosto 2025",
      status: "running",
      progress: 65,
      sent: 650,
      total: 1000,
      responses: 87,
      conversionRate: 13.4,
      startDate: "2025-08-01",
      endDate: "2025-08-15"
    },
    {
      id: "2", 
      name: "Campanha Black Friday",
      status: "scheduled",
      progress: 0,
      sent: 0,
      total: 2500,
      responses: 0,
      conversionRate: 0,
      startDate: "2025-08-20",
      endDate: "2025-08-25"
    },
    {
      id: "3",
      name: "Reativação de Clientes",
      status: "completed",
      progress: 100,
      sent: 1500,
      total: 1500,
      responses: 234,
      conversionRate: 15.6,
      startDate: "2025-07-15",
      endDate: "2025-07-30"
    }
  ]

  const stats = [
    {
      title: "Campanhas Ativas",
      value: "2",
      change: "+1 esta semana",
      icon: Rocket,
      color: "emerald"
    },
    {
      title: "Mensagens Enviadas",
      value: "8.5K",
      change: "+23% vs. mês anterior", 
      icon: MessageSquare,
      color: "blue"
    },
    {
      title: "Taxa de Resposta",
      value: "18.7%",
      change: "+2.3% vs. média",
      icon: TrendingUp,
      color: "purple"
    },
    {
      title: "Conversões",
      value: "124",
      change: "Meta: 150",
      icon: Target,
      color: "orange"
    }
  ]

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "running":
        return <Badge className="bg-emerald-100 text-emerald-700 hover:bg-emerald-100">Em Andamento</Badge>
      case "scheduled":
        return <Badge variant="outline">Agendada</Badge>
      case "completed":
        return <Badge variant="secondary">Concluída</Badge>
      case "paused":
        return <Badge variant="destructive">Pausada</Badge>
      default:
        return <Badge variant="outline">Desconhecido</Badge>
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "running":
        return <Play className="h-4 w-4 text-emerald-500" />
      case "scheduled":
        return <Clock className="h-4 w-4 text-blue-500" />
      case "completed":
        return <CheckCircle className="h-4 w-4 text-emerald-500" />
      case "paused":
        return <Pause className="h-4 w-4 text-red-500" />
      default:
        return <AlertCircle className="h-4 w-4 text-gray-500" />
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Disparos em Massa</h1>
          <p className="text-muted-foreground">
            Crie e gerencie campanhas de mensagens em massa
          </p>
        </div>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Nova Campanha
        </Button>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        {stats.map((stat) => {
          const Icon = stat.icon
          return (
            <Card key={stat.title}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  {stat.title}
                </CardTitle>
                <Icon className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.value}</div>
                <p className="text-xs text-muted-foreground">
                  {stat.change}
                </p>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* Main Content */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="campaigns">Campanhas</TabsTrigger>
          <TabsTrigger value="create">Criar Nova</TabsTrigger>
          <TabsTrigger value="analytics">Análises</TabsTrigger>
        </TabsList>

        <TabsContent value="campaigns" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Campanhas Recentes</CardTitle>
              <CardDescription>
                Gerencie todas as suas campanhas de disparo
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {campaigns.map((campaign) => (
                  <Card key={campaign.id}>
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          {getStatusIcon(campaign.status)}
                          <div>
                            <h3 className="font-medium">{campaign.name}</h3>
                            <p className="text-sm text-muted-foreground">
                              {campaign.sent} / {campaign.total} mensagens
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-4">
                          {getStatusBadge(campaign.status)}
                          <div className="text-right">
                            <p className="text-sm font-medium">{campaign.conversionRate}%</p>
                            <p className="text-xs text-muted-foreground">conversão</p>
                          </div>
                          <Button variant="outline" size="sm">
                            Ver Detalhes
                          </Button>
                        </div>
                      </div>
                      {campaign.status === "running" && (
                        <div className="mt-3">
                          <div className="flex justify-between text-sm mb-1">
                            <span>Progresso</span>
                            <span>{campaign.progress}%</span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div 
                              className="bg-emerald-500 h-2 rounded-full transition-all"
                              style={{ width: `${campaign.progress}%` }}
                            />
                          </div>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="create">
          <BulkSender />
        </TabsContent>

        <TabsContent value="analytics" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5" />
                  Performance Mensal
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Julho 2025</span>
                    <span className="text-2xl font-bold">8.234</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Agosto 2025</span>
                    <span className="text-2xl font-bold text-emerald-600">12.567</span>
                  </div>
                  <div className="text-sm text-emerald-600">
                    +52% de crescimento
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  Audiência Total
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="text-3xl font-bold">15.432</div>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Leads Ativos</span>
                      <span>8.234 (53%)</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Clientes</span>
                      <span>4.567 (30%)</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Prospects</span>
                      <span>2.631 (17%)</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Melhores Campanhas</CardTitle>
              <CardDescription>
                Top 5 campanhas por taxa de conversão
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {[
                  { name: "Reativação VIP", conversion: 24.5, sent: 1200 },
                  { name: "Oferta Relâmpago", conversion: 19.8, sent: 2400 },
                  { name: "Black Friday Preview", conversion: 18.3, sent: 3600 },
                  { name: "Lançamento Produto", conversion: 16.2, sent: 1800 },
                  { name: "Pesquisa Satisfação", conversion: 14.7, sent: 900 }
                ].map((campaign, index) => (
                  <div key={index} className="flex items-center justify-between p-3 rounded-lg bg-muted/30">
                    <div>
                      <p className="font-medium">{campaign.name}</p>
                      <p className="text-sm text-muted-foreground">{campaign.sent} mensagens</p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-emerald-600">{campaign.conversion}%</p>
                      <p className="text-xs text-muted-foreground">conversão</p>
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
