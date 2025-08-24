'use client'

import React from 'react';
import { useWebSocketContext } from '@/contexts/websocket-context';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Activity, RefreshCw, Zap, Heart } from 'lucide-react';

export default function WebSocketTest() {
  const { 
    isConnected, 
    error, 
    campaignStatuses, 
    campaignLogs, 
    executionLogs, 
    botHealthData,
    notifications,
    clearLogs,
    clearNotifications 
  } = useWebSocketContext();

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Teste do WebSocket</h1>
        <div className="flex items-center gap-2">
          <Badge variant={isConnected ? "default" : "destructive"}>
            <Activity className="h-3 w-3 mr-1" />
            {isConnected ? 'Conectado' : 'Desconectado'}
          </Badge>
          <Button size="sm" onClick={clearLogs}>
            <RefreshCw className="h-3 w-3 mr-1" />
            Limpar Logs
          </Button>
        </div>
      </div>

      {error && (
        <Card>
          <CardHeader>
            <CardTitle className="text-red-600">Erro de Conexão</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm">{error}</p>
          </CardContent>
        </Card>
      )}

      <div className="grid gap-6 md:grid-cols-2">
        {/* Status das Campanhas */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="h-4 w-4" />
              Status das Campanhas ({campaignStatuses.size})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {Array.from(campaignStatuses.values()).map((status, index) => (
                <div key={index} className="p-2 border rounded">
                  <div className="flex items-center justify-between">
                    <span className="font-medium">{status.name}</span>
                    <Badge variant={
                      status.status === 'active' ? 'default' :
                      status.status === 'paused' || status.status === 'waiting' ? 'outline' :
                      'secondary'
                    }>
                      {status.status}
                    </Badge>
                  </div>
                  <div className="text-xs text-muted-foreground mt-1">
                    Sessões: {status.activeSessions}/{status.totalSessions}
                  </div>
                </div>
              ))}
              {campaignStatuses.size === 0 && (
                <p className="text-sm text-muted-foreground">Nenhum status de campanha recebido</p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Logs da Campanha */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Zap className="h-4 w-4" />
              Logs da Campanha ({campaignLogs.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 max-h-60 overflow-y-auto">
              {campaignLogs.slice(0, 10).map((log, index) => (
                <div key={index} className="p-2 border rounded">
                  <div className="flex items-center justify-between">
                    <Badge variant={
                      log.level === 'error' ? 'destructive' :
                      log.level === 'warning' ? 'outline' :
                      log.level === 'success' ? 'default' :
                      'secondary'
                    }>
                      {log.level}
                    </Badge>
                    <span className="text-xs text-muted-foreground">
                      {new Date(log.timestamp).toLocaleTimeString()}
                    </span>
                  </div>
                  <p className="text-sm mt-1">{log.message}</p>
                  <p className="text-xs text-muted-foreground">
                    Campanha: {log.campaignName}
                  </p>
                </div>
              ))}
              {campaignLogs.length === 0 && (
                <p className="text-sm text-muted-foreground">Nenhum log de campanha recebido</p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Logs de Execução */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Zap className="h-4 w-4" />
              Logs de Execução ({executionLogs.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 max-h-60 overflow-y-auto">
              {executionLogs.slice(0, 10).map((log, index) => (
                <div key={index} className="p-2 border rounded">
                  <div className="flex items-center justify-between">
                    <Badge variant={
                      log.status === 'failed' ? 'destructive' :
                      log.status === 'sent' ? 'default' :
                      'outline'
                    }>
                      {log.status}
                    </Badge>
                    <span className="text-xs text-muted-foreground">
                      {new Date(log.timestamp).toLocaleTimeString()}
                    </span>
                  </div>
                  <p className="text-sm mt-1">
                    {log.executionType === 'internal' ? 'Conversa Interna' : 'Mensagem Externa'}
                  </p>
                  {log.contactName && (
                    <p className="text-xs text-muted-foreground">
                      Para: {log.contactName}
                    </p>
                  )}
                </div>
              ))}
              {executionLogs.length === 0 && (
                <p className="text-sm text-muted-foreground">Nenhum log de execução recebido</p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Saúde dos Bots */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Heart className="h-4 w-4" />
              Saúde dos Bots ({botHealthData.size})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {Array.from(botHealthData.values()).map((health, index) => (
                <div key={index} className="p-2 border rounded">
                  <div className="flex items-center justify-between">
                    <span className="font-medium">{health.sessionName}</span>
                    <Badge variant={
                      health.healthScore >= 80 ? 'default' :
                      health.healthScore >= 60 ? 'outline' :
                      'destructive'
                    }>
                      {health.healthScore}%
                    </Badge>
                  </div>
                  <div className="text-xs text-muted-foreground mt-1">
                    Mensagens/dia: {health.messagesPerDay} | Entrega: {health.deliveryRate}%
                  </div>
                </div>
              ))}
              {botHealthData.size === 0 && (
                <p className="text-sm text-muted-foreground">Nenhum dado de saúde recebido</p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Notificações */}
      {notifications.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>Notificações ({notifications.length})</span>
              <Button size="sm" variant="outline" onClick={clearNotifications}>
                Limpar
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {notifications.slice(0, 5).map((notification, index) => (
                <div key={index} className="p-2 border rounded">
                  <div className="flex items-center justify-between">
                    <span className="font-medium">{notification.type}</span>
                    <span className="text-xs text-muted-foreground">
                      {new Date(notification.timestamp).toLocaleTimeString()}
                    </span>
                  </div>
                  <p className="text-sm mt-1">{notification.message}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
