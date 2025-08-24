import { useState, useEffect, useCallback } from "react";
import {
  getCampaigns,
  getCampaign,
  createCampaign,
  updateCampaign,
  deleteCampaign,
  pauseCampaign,
  resumeCampaign,
  forceExecution,
  getCampaignStatistics,
  getCampaignExecutions,
  getInternalConversations,
  getDashboard,
  getHealthReport,
  addSessionsToCampaign,
  removeSessionFromCampaign,
  addContactsToCampaign,
  Campaign,
  CampaignStatistics,
  DashboardData,
  HealthReport,
  Execution,
  InternalConversationStats
} from "@/lib/api/warmup";
import { toast } from "@/hooks/use-toast";

export interface UseWarmupOptions {
  autoRefresh?: boolean;
  refreshInterval?: number;
}

export function useWarmup(options: UseWarmupOptions = {}) {
  const { autoRefresh = false, refreshInterval = 30000 } = options;

  // Estados principais
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [dashboard, setDashboard] = useState<DashboardData | null>(null);
  const [healthReport, setHealthReport] = useState<HealthReport | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  // Estados para uma campanha específica
  const [selectedCampaign, setSelectedCampaign] = useState<Campaign | null>(null);
  const [campaignStats, setCampaignStats] = useState<CampaignStatistics | null>(null);
  const [campaignExecutions, setCampaignExecutions] = useState<Execution[]>([]);
  const [internalConversations, setInternalConversations] = useState<InternalConversationStats | null>(null);

  // Carregar dados iniciais
  const loadData = useCallback(async () => {
    try {
      setLoading(true);
      const [campaignsData, dashboardData, healthData] = await Promise.all([
        getCampaigns(),
        getDashboard(),
        getHealthReport()
      ]);

      setCampaigns(campaignsData.data || []);
      setDashboard(dashboardData);
      setHealthReport(healthData);
    } catch (error) {
      console.error("Erro ao carregar dados do warmup:", error);
      toast({
        title: "Erro",
        description: "Falha ao carregar dados do sistema de aquecimento",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }, []);

  // Refresh manual
  const refresh = useCallback(async () => {
    try {
      setRefreshing(true);
      await loadData();
      toast({
        title: "Dados atualizados",
        description: "As informações foram atualizadas com sucesso",
      });
    } catch (error) {
      toast({
        title: "Erro",
        description: "Falha ao atualizar os dados",
        variant: "destructive",
      });
    } finally {
      setRefreshing(false);
    }
  }, [loadData]);

  // Carregar dados de uma campanha específica
  const loadCampaignData = useCallback(async (campaignId: string, period: string = "today") => {
    try {
      const [campaign, stats, executions, internal] = await Promise.all([
        getCampaign(campaignId),
        getCampaignStatistics(campaignId, period),
        getCampaignExecutions(campaignId, { limit: 50 }),
        getInternalConversations(campaignId, period)
      ]);

      setSelectedCampaign(campaign);
      setCampaignStats(stats);
      setCampaignExecutions(executions.data || []);
      setInternalConversations(internal);
    } catch (error) {
      console.error("Erro ao carregar dados da campanha:", error);
      toast({
        title: "Erro",
        description: "Falha ao carregar dados da campanha",
        variant: "destructive",
      });
    }
  }, []);

  // Criar nova campanha
  const createNewCampaign = useCallback(async (data: any) => {
    try {
      await createCampaign(data);
      toast({
        title: "Sucesso",
        description: "Campanha criada com sucesso",
      });
      await loadData();
      return true;
    } catch (error) {
      console.error("Erro ao criar campanha:", error);
      toast({
        title: "Erro",
        description: "Falha ao criar campanha",
        variant: "destructive",
      });
      return false;
    }
  }, [loadData]);

  // Atualizar campanha
  const updateExistingCampaign = useCallback(async (id: string, data: Partial<Campaign>) => {
    try {
      await updateCampaign(id, data);
      toast({
        title: "Sucesso",
        description: "Campanha atualizada com sucesso",
      });
      await loadData();
      return true;
    } catch (error) {
      console.error("Erro ao atualizar campanha:", error);
      toast({
        title: "Erro",
        description: "Falha ao atualizar campanha",
        variant: "destructive",
      });
      return false;
    }
  }, [loadData]);

  // Ações da campanha
  const campaignAction = useCallback(async (action: string, campaignId: string) => {
    try {
      switch (action) {
        case "pause":
          await pauseCampaign(campaignId);
          toast({ title: "Campanha pausada com sucesso" });
          break;
        case "resume":
          await resumeCampaign(campaignId);
          toast({ title: "Campanha retomada com sucesso" });
          break;
        case "force":
          await forceExecution(campaignId);
          toast({ title: "Execução forçada com sucesso" });
          break;
        case "delete":
          await deleteCampaign(campaignId);
          toast({ title: "Campanha removida com sucesso" });
          break;
      }
      await loadData();
      return true;
    } catch (error) {
      console.error(`Erro ao ${action} campanha:`, error);
      toast({
        title: "Erro",
        description: `Falha ao ${action} campanha`,
        variant: "destructive",
      });
      return false;
    }
  }, [loadData]);

  // Adicionar sessões à campanha
  const addSessions = useCallback(async (campaignId: string, sessionIds: string[]) => {
    try {
      await addSessionsToCampaign(campaignId, sessionIds);
      toast({
        title: "Sucesso",
        description: `${sessionIds.length} sessão(ões) adicionada(s) com sucesso`,
      });
      await loadData();
      return true;
    } catch (error) {
      console.error("Erro ao adicionar sessões:", error);
      toast({
        title: "Erro",
        description: "Falha ao adicionar sessões",
        variant: "destructive",
      });
      return false;
    }
  }, [loadData]);

  // Remover sessão da campanha
  const removeSession = useCallback(async (campaignId: string, sessionId: string) => {
    try {
      await removeSessionFromCampaign(campaignId, sessionId);
      toast({
        title: "Sucesso",
        description: "Sessão removida com sucesso",
      });
      await loadData();
      return true;
    } catch (error) {
      console.error("Erro ao remover sessão:", error);
      toast({
        title: "Erro",
        description: "Falha ao remover sessão",
        variant: "destructive",
      });
      return false;
    }
  }, [loadData]);

  // Adicionar contatos à campanha
  const addContacts = useCallback(async (campaignId: string, contactIds: string[], priority?: number) => {
    try {
      await addContactsToCampaign(campaignId, { contactIds, priority });
      toast({
        title: "Sucesso",
        description: `${contactIds.length} contato(s) adicionado(s) com sucesso`,
      });
      await loadData();
      return true;
    } catch (error) {
      console.error("Erro ao adicionar contatos:", error);
      toast({
        title: "Erro",
        description: "Falha ao adicionar contatos",
        variant: "destructive",
      });
      return false;
    }
  }, [loadData]);

  // Filtrar campanhas
  const filterCampaigns = useCallback((searchTerm: string, statusFilter: string) => {
    return campaigns.filter(campaign => {
      const matchesSearch = campaign.name.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus = statusFilter === "all" || campaign.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [campaigns]);

  // Auto refresh
  useEffect(() => {
    loadData();
  }, [loadData]);

  useEffect(() => {
    if (autoRefresh) {
      const interval = setInterval(loadData, refreshInterval);
      return () => clearInterval(interval);
    }
  }, [autoRefresh, refreshInterval, loadData]);

  return {
    // Estados
    campaigns,
    dashboard,
    healthReport,
    selectedCampaign,
    campaignStats,
    campaignExecutions,
    internalConversations,
    loading,
    refreshing,

    // Ações
    refresh,
    loadCampaignData,
    createNewCampaign,
    updateExistingCampaign,
    campaignAction,
    addSessions,
    removeSession,
    addContacts,
    filterCampaigns,

    // Setters
    setSelectedCampaign,
  };
}

// Hook para estatísticas em tempo real
export function useWarmupStats(campaignId?: string, period: string = "today") {
  const [stats, setStats] = useState<CampaignStatistics | null>(null);
  const [loading, setLoading] = useState(false);

  const loadStats = useCallback(async () => {
    if (!campaignId) return;
    
    try {
      setLoading(true);
      const data = await getCampaignStatistics(campaignId, period);
      setStats(data);
    } catch (error) {
      console.error("Erro ao carregar estatísticas:", error);
    } finally {
      setLoading(false);
    }
  }, [campaignId, period]);

  useEffect(() => {
    loadStats();
  }, [loadStats]);

  return { stats, loading, reload: loadStats };
}

// Hook para monitoramento de saúde
export function useHealthMonitoring() {
  const [healthData, setHealthData] = useState<HealthReport | null>(null);
  const [alerts, setAlerts] = useState<Array<{
    id: string;
    type: "warning" | "error" | "info";
    message: string;
    campaignId?: string;
  }>>([]);

  const checkHealth = useCallback(async () => {
    try {
      const data = await getHealthReport();
      setHealthData(data);

      // Gerar alertas baseados na saúde
      const newAlerts: typeof alerts = [];
      
      if (data.summary.atRiskSessions > 0) {
        newAlerts.push({
          id: `health-risk-${Date.now()}`,
          type: "warning",
          message: `${data.summary.atRiskSessions} sessão(ões) em risco detectada(s)`,
        });
      }

      if (data.summary.averageHealthScore < 60) {
        newAlerts.push({
          id: `health-low-${Date.now()}`,
          type: "error",
          message: `Saúde geral baixa: ${data.summary.averageHealthScore}%`,
        });
      }

      setAlerts(newAlerts);
    } catch (error) {
      console.error("Erro ao verificar saúde:", error);
    }
  }, []);

  const dismissAlert = useCallback((alertId: string) => {
    setAlerts(prev => prev.filter(alert => alert.id !== alertId));
  }, []);

  useEffect(() => {
    checkHealth();
    const interval = setInterval(checkHealth, 60000); // Check every minute
    return () => clearInterval(interval);
  }, [checkHealth]);

  return {
    healthData,
    alerts,
    dismissAlert,
    checkHealth,
  };
}
