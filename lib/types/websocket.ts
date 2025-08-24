// Tipos para WebSocket
export interface CampaignStatusData {
  organizationId: number;
  campaignId: string;
  name: string;
  status: 'active' | 'paused' | 'stopped' | 'waiting';
  description: string;
  nextExecution?: Date;
  activeSessions: number;
  totalSessions: number;
}

export interface CampaignLogData {
  organizationId: number;
  campaignId: string;
  campaignName: string;
  level: 'info' | 'warning' | 'error' | 'success';
  message: string;
  timestamp: Date;
  data?: any;
  sessionId?: string;
  sessionName?: string;
}

export interface ExecutionLogData {
  organizationId: number;
  campaignId: string;
  campaignName: string;
  executionId: string;
  executionType: 'internal' | 'external';
  status: 'sending' | 'sent' | 'failed';
  fromSession?: string;
  toSession?: string;
  contactName?: string;
  contactPhone?: string;
  messageContent?: string;
  scheduledAt?: Date;
  executedAt?: Date;
  timestamp: Date;
}

export interface BotHealthData {
  organizationId: number;
  campaignId: string;
  sessionId: string;
  sessionName: string;
  healthScore: number; // 0-100%
  messagesPerDay: number;
  deliveryRate: number; // 0-100%
  qualitySigma: number;
  lastUpdated: Date;
}

export interface NotificationData {
  type: string;
  message: string;
  data?: any;
  timestamp: Date;
}
