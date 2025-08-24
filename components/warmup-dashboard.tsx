"use client";

import React, { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Activity,
  BarChart3,
  Settings,
  MessageSquare,
  Users,
  Phone,
  FileText,
  Target,
  TrendingUp,
  Heart,
  AlertTriangle
} from "lucide-react";

// Importar nossos componentes criados
import WarmupPage from "./pages/warmup-page";
import WarmupMetrics from "./warmup-metrics";
import WarmupSettings from "./warmup-settings";
import TemplateManager from "./warmup-template-manager";
import SessionContactManager from "./warmup-session-contact-manager";
import { useWarmup, useHealthMonitoring } from "@/hooks/use-warmup";

interface WarmupDashboardProps {
  campaignId?: string;
}

export default function WarmupDashboard({ campaignId }: WarmupDashboardProps) {
  const [activeTab, setActiveTab] = useState("overview");
  
  const {
    campaigns,
    selectedCampaign,
    dashboard,
    healthReport,
    loading,
    refresh,
    setSelectedCampaign
  } = useWarmup({ autoRefresh: true, refreshInterval: 30000 });

  const { alerts, dismissAlert } = useHealthMonitoring();

  // Se um campaignId específico foi fornecido, selecionar essa campanha
  React.useEffect(() => {
    if (campaignId && campaigns.length > 0) {
      const campaign = campaigns.find(c => c.id === campaignId);
      if (campaign) {
        setSelectedCampaign(campaign);
      }
    }
  }, [campaignId, campaigns, setSelectedCampaign]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto mb-4"></div>
          <h2 className="text-xl font-semibold mb-2">Carregando Sistema de Aquecimento</h2>
          <p className="text-gray-600">Preparando o dashboard...</p>
        </div>
      </div>
    );
  }

  // Se não há campanha selecionada e não há campaignId, mostrar a página principal
  if (!selectedCampaign && !campaignId) {
    return <WarmupPage />;
  }

  return (
    <div className="flex-1 space-y-6 p-6">
      {/* Header com informações da campanha */}
      {selectedCampaign && (
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">{selectedCampaign.name}</h1>
            <div className="flex items-center gap-4 mt-2">
              <Badge variant={selectedCampaign.status === "active" ? "default" : "secondary"}>
                {selectedCampaign.status === "active" ? "Ativa" : 
                 selectedCampaign.status === "paused" ? "Pausada" : "Concluída"}
              </Badge>
              <span className="text-sm text-muted-foreground">
                {selectedCampaign.campaignSessions?.length || 0} sessões
              </span>
              <span className="text-sm text-muted-foreground">
                Meta: {selectedCampaign.dailyMessageGoal} mensagens/dia
              </span>
              {selectedCampaign.statistics && (
                <span className={`text-sm font-medium ${
                  selectedCampaign.statistics.averageHealthScore >= 80 ? "text-green-600" :
                  selectedCampaign.statistics.averageHealthScore >= 60 ? "text-yellow-600" : "text-red-600"
                }`}>
                  Saúde: {selectedCampaign.statistics.averageHealthScore}%
                </span>
              )}
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" onClick={() => setSelectedCampaign(null)}>
              Voltar à Lista
            </Button>
            <Button variant="outline" onClick={refresh}>
              Atualizar
            </Button>
          </div>
        </div>
      )}

      {/* Alertas de Saúde */}
      {alerts.length > 0 && (
        <div className="space-y-2">
          {alerts.map((alert) => (
            <Card key={alert.id} className={`border-l-4 ${
              alert.type === "error" ? "border-red-500" :
              alert.type === "warning" ? "border-yellow-500" : "border-blue-500"
            }`}>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <AlertTriangle className={`h-4 w-4 ${
                      alert.type === "error" ? "text-red-500" :
                      alert.type === "warning" ? "text-yellow-500" : "text-blue-500"
                    }`} />
                    <span className="font-medium">{alert.message}</span>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => dismissAlert(alert.id)}
                  >
                    Dispensar
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Tabs principais */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="overview" className="flex items-center gap-2">
            <BarChart3 className="h-4 w-4" />
            Visão Geral
          </TabsTrigger>
          <TabsTrigger value="sessions" className="flex items-center gap-2">
            <Phone className="h-4 w-4" />
            Sessões & Contatos
          </TabsTrigger>
          <TabsTrigger value="templates" className="flex items-center gap-2">
            <FileText className="h-4 w-4" />
            Templates
          </TabsTrigger>
          <TabsTrigger value="metrics" className="flex items-center gap-2">
            <Activity className="h-4 w-4" />
            Métricas
          </TabsTrigger>
          <TabsTrigger value="settings" className="flex items-center gap-2">
            <Settings className="h-4 w-4" />
            Configurações
          </TabsTrigger>
        </TabsList>

        {/* Tab Overview - Resumo da campanha */}
        <TabsContent value="overview" className="space-y-6">
          {selectedCampaign && (
            <>
              {/* Cards de resumo rápido */}
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Mensagens Hoje</CardTitle>
                    <MessageSquare className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">
                      {selectedCampaign.statistics?.totalMessagesSent || 0}
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Meta: {selectedCampaign.dailyMessageGoal}
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Sessões Ativas</CardTitle>
                    <Users className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">
                      {selectedCampaign.statistics?.activeSessions || 0}
                    </div>
                    <p className="text-xs text-muted-foreground">
                      de {selectedCampaign.statistics?.totalSessions || 0} total
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Taxa de Entrega</CardTitle>
                    <Target className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">
                      {selectedCampaign.statistics?.deliveryRate?.toFixed(1) || 0}%
                    </div>
                    <p className="text-xs text-muted-foreground">
                      {selectedCampaign.statistics?.messagesDelivered || 0} entregues
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Saúde Média</CardTitle>
                    <Heart className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className={`text-2xl font-bold ${
                      (selectedCampaign.statistics?.averageHealthScore || 0) >= 80 ? "text-green-600" :
                      (selectedCampaign.statistics?.averageHealthScore || 0) >= 60 ? "text-yellow-600" : "text-red-600"
                    }`}>
                      {selectedCampaign.statistics?.averageHealthScore || 0}%
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Todas as sessões
                    </p>
                  </CardContent>
                </Card>
              </div>

              {/* Métricas detalhadas */}
              <WarmupMetrics 
                campaignId={selectedCampaign.id} 
                autoRefresh={true}
              />
            </>
          )}
        </TabsContent>

        {/* Tab Sessões & Contatos */}
        <TabsContent value="sessions" className="space-y-6">
          {selectedCampaign && (
            <SessionContactManager 
              campaignId={selectedCampaign.id}
              onUpdate={refresh}
            />
          )}
        </TabsContent>

        {/* Tab Templates */}
        <TabsContent value="templates" className="space-y-6">
          {selectedCampaign && (
            <TemplateManager 
              campaignId={selectedCampaign.id}
              onTemplateChange={refresh}
            />
          )}
        </TabsContent>

        {/* Tab Métricas */}
        <TabsContent value="metrics" className="space-y-6">
          {selectedCampaign && (
            <WarmupMetrics 
              campaignId={selectedCampaign.id} 
              autoRefresh={true}
              refreshInterval={15000}
            />
          )}
        </TabsContent>

        {/* Tab Configurações */}
        <TabsContent value="settings" className="space-y-6">
          {selectedCampaign && (
            <WarmupSettings 
              campaign={selectedCampaign}
              onUpdate={(updatedCampaign) => {
                setSelectedCampaign(updatedCampaign);
                refresh();
              }}
            />
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
