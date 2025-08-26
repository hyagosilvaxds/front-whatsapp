import { useEffect, useRef, useState } from 'react';
import { io, Socket } from 'socket.io-client';
import { 
  CampaignStatusData, 
  CampaignLogData, 
  ExecutionLogData, 
  BotHealthData, 
  NotificationData 
} from '@/lib/types/websocket';

interface UseWebSocketProps {
  organizationId?: number;
  enabled?: boolean;
  url?: string;
}

interface WebSocketEvents {
  onCampaignStatus?: (data: CampaignStatusData) => void;
  onCampaignLog?: (data: CampaignLogData) => void;
  onExecutionLog?: (data: ExecutionLogData) => void;
  onBotHealth?: (data: BotHealthData) => void;
  onNotification?: (data: NotificationData) => void;
}

export function useWebSocket({ 
  organizationId, 
  enabled = true, 
  url = 'ws://10.10.10.39:4000' 
}: UseWebSocketProps = {}) {
  const [isConnected, setIsConnected] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const socketRef = useRef<Socket | null>(null);
  const eventHandlersRef = useRef<WebSocketEvents>({});

  // Conectar ao WebSocket
  useEffect(() => {
    if (!enabled) return;

    try {
      const socket = io(url, {
        autoConnect: true,
        reconnection: true,
        reconnectionAttempts: 5,
        reconnectionDelay: 1000,
      });

      socketRef.current = socket;

      // Eventos de conexão
      socket.on('connect', () => {
        console.log('[WebSocket] Conectado ao servidor');
        setIsConnected(true);
        setError(null);

        // Se temos organizationId, registrar interesse nos eventos
        if (organizationId) {
          socket.emit('join-organization', { organizationId });
        }
      });

      socket.on('disconnect', (reason) => {
        console.log('[WebSocket] Desconectado:', reason);
        setIsConnected(false);
      });

      socket.on('connect_error', (err) => {
        console.error('[WebSocket] Erro de conexão:', err);
        setError(`Erro de conexão: ${err.message}`);
        setIsConnected(false);
      });

      // Eventos específicos da aplicação
      socket.on('campaign-status', (data: CampaignStatusData) => {
        console.log('[WebSocket] Campaign Status:', data);
        if (eventHandlersRef.current.onCampaignStatus) {
          eventHandlersRef.current.onCampaignStatus(data);
        }
      });

      socket.on('campaign-log', (data: CampaignLogData) => {
        console.log('[WebSocket] Campaign Log:', data);
        if (eventHandlersRef.current.onCampaignLog) {
          eventHandlersRef.current.onCampaignLog(data);
        }
      });

      socket.on('execution-log', (data: ExecutionLogData) => {
        console.log('[WebSocket] Execution Log:', data);
        if (eventHandlersRef.current.onExecutionLog) {
          eventHandlersRef.current.onExecutionLog(data);
        }
      });

      socket.on('bot-health', (data: BotHealthData) => {
        console.log('[WebSocket] Bot Health:', data);
        if (eventHandlersRef.current.onBotHealth) {
          eventHandlersRef.current.onBotHealth(data);
        }
      });

      socket.on('notification', (data: NotificationData) => {
        console.log('[WebSocket] Notification:', data);
        if (eventHandlersRef.current.onNotification) {
          eventHandlersRef.current.onNotification(data);
        }
      });

    } catch (err) {
      console.error('[WebSocket] Erro ao inicializar:', err);
      setError(`Erro ao inicializar: ${err instanceof Error ? err.message : 'Erro desconhecido'}`);
    }

    // Cleanup
    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect();
        socketRef.current = null;
      }
    };
  }, [enabled, url, organizationId]);

  // Função para registrar event handlers
  const registerEventHandlers = (handlers: WebSocketEvents) => {
    eventHandlersRef.current = { ...eventHandlersRef.current, ...handlers };
  };

  // Função para emitir eventos
  const emit = (event: string, data?: any) => {
    if (socketRef.current && isConnected) {
      socketRef.current.emit(event, data);
    } else {
      console.warn('[WebSocket] Tentativa de emitir evento sem conexão:', event);
    }
  };

  // Função para se juntar a uma organização
  const joinOrganization = (orgId: number) => {
    emit('join-organization', { organizationId: orgId });
  };

  // Função para sair de uma organização
  const leaveOrganization = (orgId: number) => {
    emit('leave-organization', { organizationId: orgId });
  };

  return {
    isConnected,
    error,
    registerEventHandlers,
    emit,
    joinOrganization,
    leaveOrganization,
    socket: socketRef.current
  };
}
