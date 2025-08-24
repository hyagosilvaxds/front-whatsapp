'use client'

import React, { createContext, useContext, useState, useEffect } from 'react';
import { useWebSocket } from '@/hooks/use-websocket';
import { 
  CampaignStatusData, 
  CampaignLogData, 
  ExecutionLogData, 
  BotHealthData, 
  NotificationData 
} from '@/lib/types/websocket';

interface WebSocketContextData {
  isConnected: boolean;
  error: string | null;
  
  // Dados em tempo real
  campaignStatuses: Map<string, CampaignStatusData>;
  campaignLogs: CampaignLogData[];
  executionLogs: ExecutionLogData[];
  botHealthData: Map<string, BotHealthData>;
  notifications: NotificationData[];
  
  // Ações
  clearLogs: () => void;
  clearNotifications: () => void;
  markNotificationAsRead: (index: number) => void;
}

const WebSocketContext = createContext<WebSocketContextData | undefined>(undefined);

interface WebSocketProviderProps {
  children: React.ReactNode;
  organizationId?: number;
  enabled?: boolean;
}

export function WebSocketProvider({ 
  children, 
  organizationId, 
  enabled = true 
}: WebSocketProviderProps) {
  // Estados para armazenar dados em tempo real
  const [campaignStatuses, setCampaignStatuses] = useState<Map<string, CampaignStatusData>>(new Map());
  const [campaignLogs, setCampaignLogs] = useState<CampaignLogData[]>([]);
  const [executionLogs, setExecutionLogs] = useState<ExecutionLogData[]>([]);
  const [botHealthData, setBotHealthData] = useState<Map<string, BotHealthData>>(new Map());
  const [notifications, setNotifications] = useState<NotificationData[]>([]);

  // Hook do WebSocket
  const { isConnected, error, registerEventHandlers } = useWebSocket({
    organizationId,
    enabled
  });

  // Registrar event handlers
  useEffect(() => {
    registerEventHandlers({
      onCampaignStatus: (data) => {
        setCampaignStatuses(prev => {
          const newMap = new Map(prev);
          newMap.set(data.campaignId, data);
          return newMap;
        });
      },

      onCampaignLog: (data) => {
        setCampaignLogs(prev => {
          const newLogs = [data, ...prev];
          // Manter apenas os últimos 100 logs para performance
          return newLogs.slice(0, 100);
        });
      },

      onExecutionLog: (data) => {
        setExecutionLogs(prev => {
          const newLogs = [data, ...prev];
          // Manter apenas os últimos 200 logs de execução
          return newLogs.slice(0, 200);
        });
      },

      onBotHealth: (data) => {
        setBotHealthData(prev => {
          const newMap = new Map(prev);
          const key = `${data.campaignId}-${data.sessionId}`;
          newMap.set(key, data);
          return newMap;
        });
      },

      onNotification: (data) => {
        setNotifications(prev => {
          const newNotifications = [data, ...prev];
          // Manter apenas as últimas 50 notificações
          return newNotifications.slice(0, 50);
        });
      }
    });
  }, [registerEventHandlers]);

  // Funções de ação
  const clearLogs = () => {
    setCampaignLogs([]);
    setExecutionLogs([]);
  };

  const clearNotifications = () => {
    setNotifications([]);
  };

  const markNotificationAsRead = (index: number) => {
    setNotifications(prev => prev.filter((_, i) => i !== index));
  };

  const contextValue: WebSocketContextData = {
    isConnected,
    error,
    campaignStatuses,
    campaignLogs,
    executionLogs,
    botHealthData,
    notifications,
    clearLogs,
    clearNotifications,
    markNotificationAsRead
  };

  return (
    <WebSocketContext.Provider value={contextValue}>
      {children}
    </WebSocketContext.Provider>
  );
}

export function useWebSocketContext() {
  const context = useContext(WebSocketContext);
  if (context === undefined) {
    throw new Error('useWebSocketContext deve ser usado dentro de um WebSocketProvider');
  }
  return context;
}
