import api from "./client";

// Types para o sistema de warmup
export interface Campaign {
  id: string;
  name: string;
  description?: string;
  isActive: boolean;
  dailyMessageGoal: number;
  minIntervalMinutes: number;
  maxIntervalMinutes: number;
  workingHourStart: number;
  workingHourEnd: number;
  useWorkingHours: boolean;
  allowWeekends: boolean;
  randomizeMessages: boolean;
  randomizeInterval: boolean;
  enableInternalConversations: boolean;
  internalConversationRatio: number;
  minSessionsForInternal: number;
  enableAutoPauses: boolean;
  maxPauseTimeMinutes: number;
  minConversationTimeMinutes: number;
  createdAt: string;
  updatedAt: string;
  organizationId: string;
  createdById: string;
  createdBy: {
    id: string;
    name: string;
    email: string;
  };
  campaignSessions: CampaignSessionWithSession[];
  campaignContacts: CampaignContactWithContact[];
  messageTemplates: Template[];
  mediaFiles: any[];
  _count: {
    campaignSessions: number;
    campaignContacts: number;
    messageTemplates: number;
    executions: number;
  };
  // Campos derivados para compatibilidade
  status?: "active" | "paused" | "completed";
  sessions?: CampaignSessionWithSession[];
  templates?: Template[];
  contacts?: CampaignContactWithContact[];
  statistics?: CampaignStatistics;
  executions?: Execution[];
}

export interface CampaignSessionWithSession {
  id: string;
  campaignId: string;
  sessionId: string;
  isActive: boolean;
  healthScore: number;
  dailyMessagesSent: number;
  totalMessagesSent: number;
  lastMessageAt: string | null;
  lastResetDate: string;
  createdAt: string;
  updatedAt: string;
  session: {
    id: string;
    name: string;
    phone: string | null;
    status: "CONNECTING" | "CONNECTED" | "DISCONNECTED" | "FAILED" | "QR_CODE";
  };
}

export interface CampaignContactWithContact {
  id: string;
  campaignId: string;
  contactId: string;
  isActive: boolean;
  priority: number;
  createdAt: string;
  contact: {
    id: string;
    name: string;
    phone: string;
  };
}

// Interface para contatos listados pela API de campanha
export interface CampaignContactDetails {
  id: string;
  name: string;
  phone: string;
  lastInteraction?: string;
  interactionCount: number;
  averageResponseTime: number;
}

export interface CampaignSession {
  id: string;
  campaignId: string;
  sessionId: string;
  isActive: boolean;
  healthScore: number;
  dailyMessagesSent: number;
  totalMessagesSent: number;
  lastMessageAt: string | null;
  lastResetDate: string;
  createdAt: string;
  updatedAt: string;
  session: {
    id: string;
    name: string;
    phone: string | null;
    status: "CONNECTING" | "CONNECTED" | "DISCONNECTED" | "FAILED" | "QR_CODE";
  };
  // Campos para compatibilidade
  sessionName?: string;
  priority?: number;
  messagesSentToday?: number;
}

export interface CampaignSessionWithSession {
  id: string;
  sessionId: string;
  campaignId: string;
  healthScore: number;
  dailyMessagesSent: number;
  totalMessagesSent: number;
  isActive: boolean;
  session: {
    id: string;
    name: string;
    phone: string | null;
    status: "CONNECTING" | "CONNECTED" | "DISCONNECTED" | "FAILED" | "QR_CODE";
  };
}

export interface Template {
  id: string;
  name: string;
  content: string;
  messageType: "text" | "image" | "audio" | "video" | "document";
  mediaUrl?: string;
  weight: number;
  isActive: boolean;
  campaignId: string;
  createdAt: string;
  mediaFileId?: string;
  mediaFile?: MediaFile;
}

export interface MediaFile {
  id: string;
  fileName: string;
  filePath: string;
  fileType: "image" | "audio" | "video" | "document";
  fileSize: number;
  mimeType: string;
  createdAt: string;
  templates?: Array<{
    id: string;
    content: string;
    weight: number;
  }>;
}

export interface CampaignContact {
  id: string;
  campaignId: string;
  contactId: string;
  isActive: boolean;
  priority: number;
  createdAt: string;
  contact: {
    id: string;
    name: string;
    phone: string;
  };
  // Campos para compatibilidade
  contactName?: string;
  contactPhone?: string;
  messagesSent?: number;
  lastMessageAt?: string;
}

export interface CampaignStatistics {
  totalMessagesSent: number;
  messagesDelivered: number;
  messagesFailed: number;
  deliveryRate: number;
  internalConversations: number;
  externalConversations: number;
  averageHealthScore: number;
  activeSessions: number;
  totalSessions: number;
}

export interface Execution {
  id: string;
  campaignId: string;
  fromSessionId: string;
  toSessionId?: string;
  toContactId?: string;
  templateId: string;
  messageContent: string;
  messageType: string;
  executionType: "internal" | "external";
  status: "scheduled" | "sent" | "delivered" | "failed";
  scheduledAt: string;
  sentAt?: string;
  deliveredAt?: string;
  failedAt?: string;
  errorMessage?: string;
  createdAt: string;
}

export interface InternalConversationStats {
  period: string;
  totalConversations: number;
  messagesSent: number;
  averageMessagesPerConversation: number;
  sessionPairs: Array<{
    fromSession: string;
    toSession: string;
    messageCount: number;
    lastConversationAt: string;
  }>;
}

export interface HealthReport {
  summary: {
    totalCampaigns: number;
    activeCampaigns: number;
    pausedCampaigns: number;
    averageHealthScore: number;
    totalSessions: number;
    healthySessions: number;
    atRiskSessions: number;
  };
  campaigns: Array<{
    id: string;
    name: string;
    status: string;
    healthScore: number;
    sessionsCount: number;
    lastActivity: string;
  }>;
}

export interface DashboardData {
  overview: {
    totalCampaigns: number;
    activeCampaigns: number;
    totalMessagesSentToday: number;
    averageHealthScore: number;
    topPerformingCampaign: {
      id: string;
      name: string;
      healthScore: number;
    };
  };
  recentActivity: Execution[];
  healthTrends: Array<{
    date: string;
    averageHealth: number;
    messagesCount: number;
  }>;
}

export // Response Types
interface CampaignsListResponse {
  data: Campaign[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface CampaignResponse {
  data: Campaign;
}

// API Functions

// Campanhas
export const getCampaigns = async (params?: {
  status?: string;
  sessionId?: string;
  page?: number;
  limit?: number;
}): Promise<CampaignsListResponse> => {
  const response = await api.get("/warmup/campaigns", { params });
  
  // Processar a resposta para adicionar campos derivados
  const campaigns = response.data.map((campaign: Campaign) => ({
    ...campaign,
    // Adicionar campos derivados para compatibilidade
    status: campaign.isActive ? "active" : "paused" as "active" | "paused" | "completed",
    sessions: campaign.campaignSessions?.map(cs => ({
      ...cs,
      sessionName: cs.session?.name || cs.sessionId,
      priority: 1,
      messagesSentToday: cs.dailyMessagesSent,
    })) || [],
    templates: campaign.messageTemplates || [],
    contacts: campaign.campaignContacts?.map(cc => ({
      ...cc,
      contactName: cc.contact?.name || cc.contactId,
      contactPhone: cc.contact?.phone || '',
      messagesSent: 0,
    })) || [],
    statistics: {
      totalMessagesSent: campaign.campaignSessions?.reduce((total, cs) => total + cs.totalMessagesSent, 0) || 0,
      messagesDelivered: campaign.campaignSessions?.reduce((total, cs) => total + cs.totalMessagesSent, 0) || 0,
      messagesFailed: 0,
      deliveryRate: 100,
      internalConversations: 0,
      externalConversations: campaign.campaignSessions?.reduce((total, cs) => total + cs.totalMessagesSent, 0) || 0,
      averageHealthScore: campaign.campaignSessions?.length > 0 
        ? campaign.campaignSessions.reduce((total, cs) => total + cs.healthScore, 0) / campaign.campaignSessions.length 
        : 100,
      activeSessions: campaign.campaignSessions?.filter(cs => cs.isActive).length || 0,
      totalSessions: campaign.campaignSessions?.length || 0,
    } as CampaignStatistics
  }));

  return {
    data: campaigns,
    pagination: {
      page: 1,
      limit: 50,
      total: campaigns.length,
      totalPages: 1
    }
  };
};

export const getCampaign = async (id: string): Promise<Campaign> => {
  const response = await api.get(`/warmup/campaigns/${id}`);
  return response.data;
};

export const createCampaign = async (data: {
  name: string;
  description?: string;
  dailyMessageGoal: number;
  enableInternalConversations?: boolean;
  internalConversationRatio?: number;
  minIntervalMinutes?: number;
  maxIntervalMinutes?: number;
  useWorkingHours?: boolean;
  workingHourStart?: number;
  workingHourEnd?: number;
  allowWeekends?: boolean;
  randomizeInterval?: boolean;
  enableAutoPauses?: boolean;
  maxPauseTimeMinutes?: number;
  minConversationTimeMinutes?: number;
  sessionIds?: string[];
  contactIds?: string[];
}) => {
  const response = await api.post("/warmup/campaigns", data);
  return response.data;
};

export const updateCampaign = async (id: string, data: Partial<Campaign>) => {
  const response = await api.patch(`/warmup/campaigns/${id}`, data);
  return response.data;
};

export const deleteCampaign = async (id: string) => {
  const response = await api.delete(`/warmup/campaigns/${id}`);
  return response.data;
};

// Controles da campanha
export const pauseCampaign = async (id: string) => {
  const response = await api.post(`/warmup/campaigns/${id}/pause`);
  return response.data;
};

export const resumeCampaign = async (id: string) => {
  const response = await api.post(`/warmup/campaigns/${id}/resume`);
  return response.data;
};

export const forceExecution = async (id: string, data?: {
  executionType?: "internal" | "external";
  templateId?: string;
}) => {
  const response = await api.post(`/warmup/campaigns/${id}/execute`, data);
  return response.data;
};

// Sessões
export const getCampaignSessions = async (campaignId: string, params?: {
  status?: string;
}) => {
  const response = await api.get(`/warmup/campaigns/${campaignId}/sessions`, { params });
  return response.data;
};

export const addSessionsToCampaign = async (campaignId: string, sessionIds: string[]) => {
  const response = await api.post(`/warmup/campaigns/${campaignId}/sessions`, { sessionIds });
  return response.data;
};

export const removeSessionFromCampaign = async (campaignId: string, sessionId: string) => {
  const response = await api.delete(`/warmup/campaigns/${campaignId}/sessions/${sessionId}`);
  return response.data;
};

// Templates
export const getCampaignTemplates = async (campaignId: string, params?: {
  type?: string;
  active?: boolean;
}) => {
  const response = await api.get(`/warmup/campaigns/${campaignId}/templates`, { params });
  return response.data;
};

export const createTemplate = async (campaignId: string, formData: FormData) => {
  const response = await api.post(`/warmup/campaigns/${campaignId}/templates`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data;
};

export const updateTemplate = async (campaignId: string, templateId: string, formData: FormData) => {
  const response = await api.put(`/warmup/campaigns/${campaignId}/templates/${templateId}`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data;
};

export const deleteTemplate = async (campaignId: string, templateId: string) => {
  const response = await api.delete(`/warmup/campaigns/${campaignId}/templates/${templateId}`);
  return response.data;
};

export const importTemplates = async (campaignId: string, templates: Template[]) => {
  const response = await api.post(`/warmup/campaigns/${campaignId}/templates/import`, {
    templates
  });
  return response.data;
};

// Template com arquivo
export const createTemplateWithFile = async (campaignId: string, data: {
  file: File;
  content: string;
  weight: number;
  variables?: string;
}) => {
  const formData = new FormData();
  formData.append('file', data.file);
  formData.append('content', data.content);
  formData.append('weight', data.weight.toString());
  if (data.variables) {
    formData.append('variables', data.variables);
  }

  const response = await api.post(`/warmup/campaigns/${campaignId}/templates/with-file`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data;
};

// Gerenciamento de mídia
export const getCampaignMedia = async (campaignId: string) => {
  const response = await api.get(`/warmup/campaigns/${campaignId}/media`);
  return response.data;
};

export const deleteCampaignMedia = async (campaignId: string, mediaId: string) => {
  const response = await api.delete(`/warmup/campaigns/${campaignId}/media/${mediaId}`);
  return response.data;
};

// Contatos
export const getCampaignContacts = async (campaignId: string) => {
  const response = await api.get(`/warmup/campaigns/${campaignId}/contacts`);
  return response.data;
};

export const addContactsToCampaign = async (campaignId: string, data: {
  contactIds: string[];
  priority?: number;
}) => {
  const response = await api.post(`/warmup/campaigns/${campaignId}/contacts`, data);
  return response.data;
};

export const removeContactFromCampaign = async (campaignId: string, contactId: string) => {
  const response = await api.delete(`/warmup/campaigns/${campaignId}/contacts/${contactId}`);
  return response.data;
};

// Estatísticas
export const getCampaignStatistics = async (campaignId: string, period?: string) => {
  const response = await api.get(`/warmup/campaigns/${campaignId}/statistics`, {
    params: { period }
  });
  return response.data;
};

export const getCampaignExecutions = async (campaignId: string, params?: {
  status?: string;
  executionType?: string;
  fromSessionId?: string;
  toSessionId?: string;
  startDate?: string;
  endDate?: string;
  page?: number;
  limit?: number;
}) => {
  const response = await api.get(`/warmup/campaigns/${campaignId}/executions`, { params });
  return response.data;
};

// Conversas internas
export const getInternalConversations = async (campaignId: string, period?: string) => {
  const response = await api.get(`/warmup/campaigns/${campaignId}/internal-conversations`, {
    params: { period }
  });
  return response.data;
};

export const forceInternalConversation = async (campaignId: string, data: {
  fromSessionId: string;
  templateId?: string;
}) => {
  const response = await api.post(`/warmup/campaigns/${campaignId}/internal-conversations/execute`, data);
  return response.data;
};

// Relatórios e dashboard
export const getHealthReport = async (organizationId?: string) => {
  const response = await api.get("/warmup/health-report", {
    params: { organizationId }
  });
  return response.data;
};

export const getDashboard = async () => {
  const response = await api.get("/warmup/dashboard");
  return response.data;
};

export const getSettings = async () => {
  const response = await api.get("/warmup/settings");
  return response.data;
};

// Auto-Read functions
export const getCampaignAutoReadStatus = async (campaignId: string) => {
  const response = await api.get(`/warmup/campaigns/${campaignId}/auto-read-status`);
  return response.data;
};

export const getSessionAutoReadSettings = async (campaignId: string, sessionId: string) => {
  const response = await api.get(`/warmup/campaigns/${campaignId}/sessions/${sessionId}/auto-read/settings`);
  return response.data;
};

export const updateSessionAutoReadSettings = async (campaignId: string, sessionId: string, settings: {
  autoReadEnabled: boolean;
  autoReadInterval: number;
  autoReadMinDelay: number;
  autoReadMaxDelay: number;
}) => {
  const response = await api.put(`/warmup/campaigns/${campaignId}/sessions/${sessionId}/auto-read/settings`, settings);
  return response.data;
};

export const toggleSessionAutoRead = async (campaignId: string, sessionId: string, enabled: boolean) => {
  const response = await api.post(`/warmup/campaigns/${campaignId}/sessions/${sessionId}/auto-read/toggle`, { enabled });
  return response.data;
};
