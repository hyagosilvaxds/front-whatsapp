import api from "./client";

export interface WhatsAppSession {
  id: string;
  name: string;
  sessionId: string;
  phone: string | null;
  qrCode: string | null;
  status: "CONNECTING" | "CONNECTED" | "DISCONNECTED" | "FAILED" | "QR_CODE";
  type: "MAIN" | "SUPPORT" | "SALES" | "MARKETING";
  isActive: boolean;
  lastConnectedAt: string | null;
  lastDisconnectedAt: string | null;
  createdAt: string;
}

export interface CreateSessionData {
  name: string;
  type: "MAIN" | "SUPPORT" | "SALES" | "MARKETING";
}

export interface SessionListParams {
  status?: string;
  type?: string;
  isActive?: boolean;
}

// Criar nova sessão WhatsApp
export const createWhatsAppSession = async (data: CreateSessionData): Promise<WhatsAppSession> => {
  const response = await api.post("/whatsapp/sessions", data);
  return response.data;
};

// Listar todas as sessões WhatsApp
export const getWhatsAppSessions = async (params?: SessionListParams): Promise<WhatsAppSession[]> => {
  const response = await api.get("/whatsapp/sessions", { params });
  return response.data;
};

// Obter sessão específica
export const getWhatsAppSession = async (sessionId: string): Promise<WhatsAppSession> => {
  const response = await api.get(`/whatsapp/sessions/${sessionId}`);
  return response.data;
};

// Obter QR Code da sessão
export const getSessionQRCode = async (sessionId: string): Promise<{ qrCode: string | null; message?: string }> => {
  const response = await api.get(`/whatsapp/sessions/${sessionId}/qr`);
  return response.data;
};

// Deletar sessão
export const deleteWhatsAppSession = async (sessionId: string): Promise<{ message: string }> => {
  const response = await api.delete(`/whatsapp/sessions/${sessionId}`);
  return response.data;
};

// Desconectar sessão
export const disconnectWhatsAppSession = async (sessionId: string): Promise<{ message: string; status: string }> => {
  const response = await api.post(`/whatsapp/sessions/${sessionId}/disconnect`);
  return response.data;
};

// Reconectar sessão
export const connectWhatsAppSession = async (sessionId: string): Promise<{ message: string; status: string }> => {
  const response = await api.post(`/whatsapp/sessions/${sessionId}/connect`);
  return response.data;
};

// Atualizar QR Code
export const refreshSessionQRCode = async (sessionId: string): Promise<{ message: string; status: string }> => {
  const response = await api.post(`/whatsapp/sessions/${sessionId}/qr/refresh`);
  return response.data;
};