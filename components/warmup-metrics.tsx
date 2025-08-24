"use client";

import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  TrendingUp,
  TrendingDown,
  Activity,
  MessageSquare,
  Heart,
  Users,
  Target,
  BarChart3,
  RefreshCw,
  Clock,
  CheckCircle,
  AlertCircle,
  XCircle,
  ArrowUp,
  ArrowDown,
  Minus
} from "lucide-react";
import { useWarmupStats } from "@/hooks/use-warmup";

interface WarmupMetricsProps {
  campaignId?: string;
  period?: string;
  autoRefresh?: boolean;
  refreshInterval?: number;
}

export default function WarmupMetrics({
  campaignId,
  period = "today",
  autoRefresh = false,
  refreshInterval = 30000
}: WarmupMetricsProps) {
  const { stats, loading, reload } = useWarmupStats(campaignId, period);
  const [selectedPeriod, setSelectedPeriod] = useState(period);

  // Auto refresh
  useEffect(() => {
    if (autoRefresh) {
      const interval = setInterval(reload, refreshInterval);
      return () => clearInterval(interval);
    }
  }, [autoRefresh, refreshInterval, reload]);

  // Reload when period changes
  useEffect(() => {
    reload();
  }, [selectedPeriod, reload]);

  if (loading) {
    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 8 }).map((_, i) => (
          <Card key={i}>
            <CardContent className="p-6">
              <div className="animate-pulse">
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                <div className="h-8 bg-gray-200 rounded w-1/2 mb-2"></div>
                <div className="h-3 bg-gray-200 rounded w-full"></div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (!stats) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center py-12">
          <BarChart3 className="h-12 w-12 text-muted-foreground mb-4" />
          <h3 className="text-lg font-semibold mb-2">Sem dados disponíveis</h3>
          <p className="text-muted-foreground text-center mb-4">
            Não há estatísticas para exibir no momento
          </p>
          <Button onClick={reload} variant="outline">
            <RefreshCw className="h-4 w-4 mr-2" />
            Tentar Novamente
          </Button>
        </CardContent>
      </Card>
    );
  }

  const deliveryRate = stats.totalMessagesSent > 0 
    ? (stats.messagesDelivered / stats.totalMessagesSent) * 100 
    : 0;

  const failureRate = stats.totalMessagesSent > 0 
    ? (stats.messagesFailed / stats.totalMessagesSent) * 100 
    : 0;

  const internalRatio = (stats.internalConversations + stats.externalConversations) > 0
    ? (stats.internalConversations / (stats.internalConversations + stats.externalConversations)) * 100
    : 0;

  const sessionUtilization = stats.totalSessions > 0
    ? (stats.activeSessions / stats.totalSessions) * 100
    : 0;

  const metrics = [
    {
      title: "Mensagens Enviadas",
      value: stats.totalMessagesSent,
      subtitle: `${stats.messagesDelivered} entregues`,
      icon: MessageSquare,
      color: "text-blue-600",
      bgColor: "bg-blue-100",
      progress: deliveryRate,
      progressColor: deliveryRate >= 90 ? "bg-green-500" : deliveryRate >= 80 ? "bg-yellow-500" : "bg-red-500"
    },
    {
      title: "Taxa de Entrega",
      value: `${deliveryRate.toFixed(1)}%`,
      subtitle: `${stats.messagesFailed} falharam`,
      icon: CheckCircle,
      color: deliveryRate >= 90 ? "text-green-600" : deliveryRate >= 80 ? "text-yellow-600" : "text-red-600",
      bgColor: deliveryRate >= 90 ? "bg-green-100" : deliveryRate >= 80 ? "bg-yellow-100" : "bg-red-100",
      progress: deliveryRate,
      progressColor: deliveryRate >= 90 ? "bg-green-500" : deliveryRate >= 80 ? "bg-yellow-500" : "bg-red-500"
    },
    {
      title: "Saúde Média",
      value: `${stats.averageHealthScore}%`,
      subtitle: `${stats.activeSessions} sessões ativas`,
      icon: Heart,
      color: stats.averageHealthScore >= 80 ? "text-green-600" : stats.averageHealthScore >= 60 ? "text-yellow-600" : "text-red-600",
      bgColor: stats.averageHealthScore >= 80 ? "bg-green-100" : stats.averageHealthScore >= 60 ? "bg-yellow-100" : "bg-red-100",
      progress: stats.averageHealthScore,
      progressColor: stats.averageHealthScore >= 80 ? "bg-green-500" : stats.averageHealthScore >= 60 ? "bg-yellow-500" : "bg-red-500"
    },
    {
      title: "Conversas Internas",
      value: stats.internalConversations,
      subtitle: `${internalRatio.toFixed(1)}% do total`,
      icon: Users,
      color: "text-purple-600",
      bgColor: "bg-purple-100",
      progress: internalRatio,
      progressColor: "bg-purple-500"
    },
    {
      title: "Conversas Externas",
      value: stats.externalConversations,
      subtitle: `${(100 - internalRatio).toFixed(1)}% do total`,
      icon: Target,
      color: "text-orange-600",
      bgColor: "bg-orange-100",
      progress: 100 - internalRatio,
      progressColor: "bg-orange-500"
    },
    {
      title: "Sessões Utilizadas",
      value: `${stats.activeSessions}/${stats.totalSessions}`,
      subtitle: `${sessionUtilization.toFixed(0)}% utilizando`,
      icon: Activity,
      color: "text-indigo-600",
      bgColor: "bg-indigo-100",
      progress: sessionUtilization,
      progressColor: "bg-indigo-500"
    },
    {
      title: "Taxa de Falha",
      value: `${failureRate.toFixed(1)}%`,
      subtitle: `${stats.messagesFailed} mensagens`,
      icon: XCircle,
      color: failureRate <= 5 ? "text-green-600" : failureRate <= 10 ? "text-yellow-600" : "text-red-600",
      bgColor: failureRate <= 5 ? "bg-green-100" : failureRate <= 10 ? "bg-yellow-100" : "bg-red-100",
      progress: Math.min(failureRate, 100),
      progressColor: failureRate <= 5 ? "bg-green-500" : failureRate <= 10 ? "bg-yellow-500" : "bg-red-500"
    },
    {
      title: "Eficiência Geral",
      value: `${Math.round((deliveryRate + stats.averageHealthScore + sessionUtilization) / 3)}%`,
      subtitle: "Média ponderada",
      icon: TrendingUp,
      color: "text-gray-600",
      bgColor: "bg-gray-100",
      progress: (deliveryRate + stats.averageHealthScore + sessionUtilization) / 3,
      progressColor: "bg-gray-500"
    }
  ];

  return (
    <div className="space-y-6">
      {/* Header com controles */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold">Métricas em Tempo Real</h3>
          <p className="text-sm text-muted-foreground">
            Acompanhe o desempenho da campanha de aquecimento
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
            <SelectTrigger className="w-[150px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="today">Hoje</SelectItem>
              <SelectItem value="week">Esta Semana</SelectItem>
              <SelectItem value="month">Este Mês</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" size="sm" onClick={reload}>
            <RefreshCw className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Grid de Métricas */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {metrics.map((metric, index) => (
          <MetricCard key={index} metric={metric} />
        ))}
      </div>

      {/* Resumo Executivo */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5" />
            Resumo Executivo
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3">
            <div className="space-y-2">
              <h4 className="font-medium text-green-600">Pontos Fortes</h4>
              <ul className="text-sm space-y-1">
                {deliveryRate >= 90 && (
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-3 w-3 text-green-500" />
                    Excelente taxa de entrega
                  </li>
                )}
                {stats.averageHealthScore >= 80 && (
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-3 w-3 text-green-500" />
                    Saúde das sessões ótima
                  </li>
                )}
                {sessionUtilization >= 80 && (
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-3 w-3 text-green-500" />
                    Boa utilização das sessões
                  </li>
                )}
                {internalRatio >= 15 && internalRatio <= 30 && (
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-3 w-3 text-green-500" />
                    Proporção ideal de conversas internas
                  </li>
                )}
              </ul>
            </div>

            <div className="space-y-2">
              <h4 className="font-medium text-yellow-600">Atenção Necessária</h4>
              <ul className="text-sm space-y-1">
                {deliveryRate < 90 && deliveryRate >= 80 && (
                  <li className="flex items-center gap-2">
                    <AlertCircle className="h-3 w-3 text-yellow-500" />
                    Taxa de entrega pode melhorar
                  </li>
                )}
                {stats.averageHealthScore < 80 && stats.averageHealthScore >= 60 && (
                  <li className="flex items-center gap-2">
                    <AlertCircle className="h-3 w-3 text-yellow-500" />
                    Saúde das sessões em atenção
                  </li>
                )}
                {sessionUtilization < 60 && (
                  <li className="flex items-center gap-2">
                    <AlertCircle className="h-3 w-3 text-yellow-500" />
                    Muitas sessões ociosas
                  </li>
                )}
                {(internalRatio < 10 || internalRatio > 40) && (
                  <li className="flex items-center gap-2">
                    <AlertCircle className="h-3 w-3 text-yellow-500" />
                    Revisar proporção de conversas internas
                  </li>
                )}
              </ul>
            </div>

            <div className="space-y-2">
              <h4 className="font-medium text-red-600">Ação Imediata</h4>
              <ul className="text-sm space-y-1">
                {deliveryRate < 80 && (
                  <li className="flex items-center gap-2">
                    <XCircle className="h-3 w-3 text-red-500" />
                    Taxa de entrega crítica
                  </li>
                )}
                {stats.averageHealthScore < 60 && (
                  <li className="flex items-center gap-2">
                    <XCircle className="h-3 w-3 text-red-500" />
                    Saúde das sessões crítica
                  </li>
                )}
                {failureRate > 15 && (
                  <li className="flex items-center gap-2">
                    <XCircle className="h-3 w-3 text-red-500" />
                    Muitas falhas de envio
                  </li>
                )}
                {stats.activeSessions === 0 && (
                  <li className="flex items-center gap-2">
                    <XCircle className="h-3 w-3 text-red-500" />
                    Nenhuma sessão ativa
                  </li>
                )}
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

// Componente individual para cada métrica
function MetricCard({ metric }: { metric: any }) {
  const IconComponent = metric.icon;
  
  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div className={`p-2 rounded-full ${metric.bgColor}`}>
            <IconComponent className={`h-4 w-4 ${metric.color}`} />
          </div>
          <div className="text-right">
            <div className={`text-2xl font-bold ${metric.color}`}>
              {metric.value}
            </div>
          </div>
        </div>
        
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <h4 className="text-sm font-medium text-gray-600">{metric.title}</h4>
          </div>
          
          <Progress 
            value={metric.progress} 
            className="h-2"
          />
          
          <p className="text-xs text-muted-foreground">
            {metric.subtitle}
          </p>
        </div>
      </CardContent>
    </Card>
  );
}

// Componente para trending indicator
function TrendingIndicator({ value, previousValue, format = "number" }: {
  value: number;
  previousValue?: number;
  format?: "number" | "percentage";
}) {
  if (!previousValue) return null;

  const diff = value - previousValue;
  const percentChange = previousValue !== 0 ? (diff / previousValue) * 100 : 0;
  
  const isPositive = diff > 0;
  const isNeutral = diff === 0;
  
  const Icon = isNeutral ? Minus : isPositive ? ArrowUp : ArrowDown;
  const colorClass = isNeutral ? "text-gray-500" : isPositive ? "text-green-500" : "text-red-500";
  
  return (
    <div className={`flex items-center gap-1 ${colorClass}`}>
      <Icon className="h-3 w-3" />
      <span className="text-xs">
        {format === "percentage" 
          ? `${Math.abs(percentChange).toFixed(1)}%`
          : Math.abs(diff).toString()
        }
      </span>
    </div>
  );
}
