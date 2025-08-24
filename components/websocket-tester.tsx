'use client'

import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useWebSocket } from '@/hooks/use-websocket';
import { useState } from 'react';

export default function WebSocketTester() {
  const { isConnected, emit } = useWebSocket({ organizationId: 1 });
  const [campaignId, setCampaignId] = useState('test-campaign-1');
  const [sessionId, setSessionId] = useState('test-session-1');

  const sendTestCampaignStatus = () => {
    emit('test-campaign-status', {
      organizationId: 1,
      campaignId,
      name: 'Campanha de Teste',
      status: 'active',
      description: 'Teste de status de campanha',
      activeSessions: 3,
      totalSessions: 5
    });
  };

  const sendTestCampaignLog = () => {
    emit('test-campaign-log', {
      organizationId: 1,
      campaignId,
      campaignName: 'Campanha de Teste',
      level: 'info',
      message: 'Teste de log da campanha',
      timestamp: new Date(),
      sessionId,
      sessionName: 'Sessão de Teste'
    });
  };

  const sendTestExecutionLog = () => {
    emit('test-execution-log', {
      organizationId: 1,
      campaignId,
      campaignName: 'Campanha de Teste',
      executionId: 'exec-' + Date.now(),
      executionType: 'external',
      status: 'sent',
      contactName: 'João Silva',
      contactPhone: '+5511999999999',
      messageContent: 'Mensagem de teste',
      timestamp: new Date()
    });
  };

  const sendTestBotHealth = () => {
    emit('test-bot-health', {
      organizationId: 1,
      campaignId,
      sessionId,
      sessionName: 'Sessão de Teste',
      healthScore: Math.floor(Math.random() * 100),
      messagesPerDay: Math.floor(Math.random() * 100),
      deliveryRate: Math.floor(Math.random() * 100),
      qualitySigma: Math.random() * 10,
      lastUpdated: new Date()
    });
  };

  const sendTestNotification = () => {
    emit('test-notification', {
      type: 'success',
      message: 'Teste de notificação em tempo real',
      timestamp: new Date(),
      data: { campaignId }
    });
  };

  if (!isConnected) {
    return (
      <Card className="w-full max-w-md mx-auto mt-8">
        <CardContent className="pt-6">
          <p className="text-center text-muted-foreground">
            WebSocket não está conectado. Aguarde a conexão...
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Testador de WebSocket</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <Label htmlFor="campaignId">ID da Campanha</Label>
              <Input
                id="campaignId"
                value={campaignId}
                onChange={(e) => setCampaignId(e.target.value)}
                placeholder="ID da campanha"
              />
            </div>
            <div>
              <Label htmlFor="sessionId">ID da Sessão</Label>
              <Input
                id="sessionId"
                value={sessionId}
                onChange={(e) => setSessionId(e.target.value)}
                placeholder="ID da sessão"
              />
            </div>
          </div>

          <div className="grid gap-2 md:grid-cols-2 lg:grid-cols-3">
            <Button onClick={sendTestCampaignStatus} variant="outline">
              Testar Status Campanha
            </Button>
            <Button onClick={sendTestCampaignLog} variant="outline">
              Testar Log Campanha
            </Button>
            <Button onClick={sendTestExecutionLog} variant="outline">
              Testar Log Execução
            </Button>
            <Button onClick={sendTestBotHealth} variant="outline">
              Testar Saúde Bot
            </Button>
            <Button onClick={sendTestNotification} variant="outline">
              Testar Notificação
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
