"use client";

import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { useWebSocketContext } from "@/contexts/websocket-context";
import {
  Play,
  Pause,
  Plus,
  Settings,
  TrendingUp,
  Users,
  MessageSquare,
  Activity,
  BarChart3,
  BarChart,
  Eye,
  Edit,
  Trash2,
  Download,
  Upload,
  RefreshCw,
  Heart,
  AlertTriangle,
  CheckCircle,
  Clock,
  Zap,
  Target,
  Phone,
  Calendar,
  MessageCircle,
  MoreVertical,
  Filter,
  Search,
  ArrowUp,
  ArrowDown,
  ArrowLeft,
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  Save,
  Pencil,
  Info,
  FileImage
} from "lucide-react";
import { toast, useToast } from "@/hooks/use-toast";
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
  getCampaignSessions,
  getCampaignTemplates,
  createTemplate,
  updateTemplate,
  deleteTemplate,
  importTemplates,
  createTemplateWithFile,
  getCampaignMedia,
  deleteCampaignMedia,
  getCampaignContacts,
  addContactsToCampaign,
  removeContactFromCampaign,
  getCampaignAutoReadStatus,
  toggleSessionAutoRead,
  updateSessionAutoReadSettings,
  Campaign,
  CampaignStatistics,
  DashboardData,
  HealthReport,
  Execution,
  InternalConversationStats,
  Template,
  MediaFile
} from "@/lib/api/warmup";
import { getContacts, Contact } from "@/lib/api/contacts";
import {
  getWhatsAppSessions,
  WhatsAppSession
} from "@/lib/api/whatsapp-sessions";

// Funções auxiliares para upload de arquivos
const getAcceptedFileTypes = (messageType: string): string => {
  switch (messageType) {
    case 'image':
      return 'image/jpeg,image/png,image/gif,image/webp';
    case 'audio':
      return 'audio/mp3,audio/wav,audio/ogg';
    case 'video':
      return 'video/mp4,video/avi,video/mov';
    case 'document':
      return 'application/pdf,.doc,.docx';
    default:
      return '';
  }
};

const getFileTypeDescription = (messageType: string): string => {
  switch (messageType) {
    case 'image':
      return 'JPEG, PNG, GIF, WebP';
    case 'audio':
      return 'MP3, WAV, OGG';
    case 'video':
      return 'MP4, AVI, MOV';
    case 'document':
      return 'PDF, DOC, DOCX';
    default:
      return '';
  }
};

// Funções auxiliares para mídia
const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

const getFileIcon = (type: string) => {
  if (type.startsWith('image/')) return '🖼️';
  if (type.startsWith('audio/')) return '🎵';
  if (type.startsWith('video/')) return '🎬';
  if (type.startsWith('application/pdf')) return '📄';
  if (type.includes('document') || type.includes('word')) return '📝';
  return '📎';
};

interface WarmupPageProps {}

export default function WarmupPage({}: WarmupPageProps) {
  // Context do WebSocket para atualizações em tempo real
  const { 
    isConnected, 
    error: wsError,
    campaignStatuses, 
    campaignLogs, 
    executionLogs, 
    botHealthData, 
    notifications 
  } = useWebSocketContext();

  // Estados principais
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [selectedCampaign, setSelectedCampaign] = useState<Campaign | null>(null);
  const [dashboard, setDashboard] = useState<DashboardData | null>(null);
  const [healthReport, setHealthReport] = useState<HealthReport | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  
  // Estados para visualização
  const [viewMode, setViewMode] = useState<'list' | 'details'>('list');
  
  // Estados para sessões WhatsApp
  const [whatsappSessions, setWhatsappSessions] = useState<WhatsAppSession[]>([]);
  const [selectedSessions, setSelectedSessions] = useState<string[]>([]);
  const [campaignSessions, setCampaignSessions] = useState<any[]>([]);

  // Estados para modals e dialogs
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [settingsDialogOpen, setSettingsDialogOpen] = useState(false);
  const [statsDialogOpen, setStatsDialogOpen] = useState(false);
  const [executionsSheetOpen, setExecutionsSheetOpen] = useState(false);
  const [sessionsSheetOpen, setSessionsSheetOpen] = useState(false);
  const [detailsModalOpen, setDetailsModalOpen] = useState(false);
  const [campaignDetails, setCampaignDetails] = useState<Campaign | null>(null);
  const [loadingDetails, setLoadingDetails] = useState(false);
  
  // Estados para confirmação de exclusão
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [campaignToDelete, setCampaignToDelete] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);
  
  // Estado para cards expandidos
  const [expandedCampaignId, setExpandedCampaignId] = useState<string | null>(null);

  // Estados para filtros e busca
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [periodFilter, setPeriodFilter] = useState<string>("today");

  // Estados para formulários
  const [newCampaign, setNewCampaign] = useState({
    name: "",
    description: "",
    dailyMessageGoal: 10,
    enableInternalConversations: false,
    internalConversationRatio: 0.2,
    minIntervalMinutes: 15,
    maxIntervalMinutes: 45,
    useWorkingHours: true,
    workingHourStart: 8,
    workingHourEnd: 18,
    allowWeekends: false,
    randomizeInterval: true,
    enableAutoPauses: false,
    maxPauseTimeMinutes: 45,
    minConversationTimeMinutes: 30,
    sessionIds: [] as string[],
    contactIds: [] as string[],
  });

  // Carregar dados iniciais
  useEffect(() => {
    loadInitialData();
  }, []);

  // Atualizar campanhas com dados do WebSocket
  useEffect(() => {
    if (campaignStatuses.size > 0) {
      setCampaigns(prevCampaigns => 
        prevCampaigns.map(campaign => {
          const wsStatus = campaignStatuses.get(campaign.id);
          if (wsStatus) {
            // Mapear status do WebSocket para tipo Campaign
            let mappedStatus: "active" | "paused" | "completed" | undefined;
            switch (wsStatus.status) {
              case 'active':
                mappedStatus = 'active';
                break;
              case 'paused':
              case 'waiting':
                mappedStatus = 'paused';
                break;
              case 'stopped':
                mappedStatus = 'completed';
                break;
              default:
                mappedStatus = campaign.status;
            }

            return {
              ...campaign,
              status: mappedStatus,
              isActive: wsStatus.status === 'active',
              updatedAt: new Date().toISOString(),
              // Adicionar informações extras se necessário
              _wsData: {
                activeSessions: wsStatus.activeSessions,
                totalSessions: wsStatus.totalSessions,
                nextExecution: wsStatus.nextExecution,
                lastWebSocketUpdate: new Date()
              }
            };
          }
          return campaign;
        })
      );
    }
  }, [campaignStatuses]);

  // Mostrar notificações do WebSocket
  useEffect(() => {
    if (notifications.length > 0) {
      const latestNotification = notifications[0];
      toast({
        title: latestNotification.type,
        description: latestNotification.message,
        variant: latestNotification.type === 'error' ? 'destructive' : 'default',
      });
    }
  }, [notifications]);

  const loadInitialData = async () => {
    try {
      setLoading(true);
      const [campaignsData, dashboardData, healthData, sessionsData] = await Promise.all([
        getCampaigns(),
        getDashboard(),
        getHealthReport(),
        getWhatsAppSessions({ isActive: true })
      ]);

      setCampaigns(campaignsData.data || []);
      setDashboard(dashboardData);
      setHealthReport(healthData);
      setWhatsappSessions(sessionsData || []);
    } catch (error) {
      console.error("Erro ao carregar dados:", error);
      toast({
        title: "Erro",
        description: "Falha ao carregar dados do sistema de aquecimento",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const refreshData = async () => {
    try {
      setRefreshing(true);
      await loadInitialData();
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
  };

  const handleCreateCampaign = async () => {
    try {
      if (!newCampaign.name.trim()) {
        toast({
          title: "Erro",
          description: "Nome da campanha é obrigatório",
          variant: "destructive",
        });
        return;
      }

      await createCampaign(newCampaign);
      
      toast({
        title: "Sucesso",
        description: "Campanha criada com sucesso",
      });

      setCreateDialogOpen(false);
      setNewCampaign({
        name: "",
        description: "",
        dailyMessageGoal: 10,
        enableInternalConversations: false,
        internalConversationRatio: 0.2,
        minIntervalMinutes: 15,
        maxIntervalMinutes: 45,
        useWorkingHours: true,
        workingHourStart: 8,
        workingHourEnd: 18,
        allowWeekends: false,
        randomizeInterval: true,
        enableAutoPauses: false,
        maxPauseTimeMinutes: 45,
        minConversationTimeMinutes: 30,
        sessionIds: [],
        contactIds: [],
      });

      await loadInitialData();
    } catch (error) {
      console.error("Erro ao criar campanha:", error);
      toast({
        title: "Erro",
        description: "Falha ao criar campanha",
        variant: "destructive",
      });
    }
  };

  const handleCampaignAction = async (action: string, campaignId: string) => {
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
          // Abrir modal de confirmação em vez de deletar diretamente
          setCampaignToDelete(campaignId);
          setDeleteConfirmOpen(true);
          return; // Não recarregar dados ainda
      }
      await loadInitialData();
    } catch (error) {
      console.error(`Erro ao ${action} campanha:`, error);
      toast({
        title: "Erro",
        description: `Falha ao ${action} campanha`,
        variant: "destructive",
      });
    }
  };

  // Função para confirmar exclusão
  const handleConfirmDelete = async () => {
    if (!campaignToDelete) return;
    
    try {
      setDeleting(true);
      await deleteCampaign(campaignToDelete);
      toast({ title: "Campanha removida com sucesso" });
      await loadInitialData();
      setDeleteConfirmOpen(false);
      setCampaignToDelete(null);
    } catch (error) {
      console.error("Erro ao deletar campanha:", error);
      toast({
        title: "Erro",
        description: "Falha ao deletar campanha",
        variant: "destructive",
      });
    } finally {
      setDeleting(false);
    }
  };

  // Função para alternar expansão do card
  const toggleCampaignExpansion = (campaignId: string) => {
    const newExpandedId = expandedCampaignId === campaignId ? null : campaignId;
    setExpandedCampaignId(newExpandedId);
    
    // Carregar sessões quando expandir
    if (newExpandedId) {
      loadCampaignSessions(newExpandedId);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-500";
      case "paused":
        return "bg-yellow-500";
      case "completed":
        return "bg-blue-500";
      default:
        return "bg-gray-500";
    }
  };

  const getHealthColor = (health: number) => {
    if (health >= 80) return "text-green-500";
    if (health >= 60) return "text-yellow-500";
    return "text-red-500";
  };

  // Gerenciamento de sessões
  const loadCampaignSessions = async (campaignId: string) => {
    try {
      const sessions = await getCampaignSessions(campaignId);
      setCampaignSessions(sessions.data || []);
    } catch (error) {
      console.error("Erro ao carregar sessões da campanha:", error);
      toast({
        title: "Erro",
        description: "Falha ao carregar sessões da campanha",
        variant: "destructive",
      });
    }
  };

  const handleAddSessions = async (campaignId: string, sessionIds: string[]) => {
    try {
      await addSessionsToCampaign(campaignId, sessionIds);
      toast({
        title: "Sucesso",
        description: "Sessões adicionadas à campanha com sucesso",
      });
      await loadCampaignSessions(campaignId);
      await loadInitialData();
    } catch (error) {
      console.error("Erro ao adicionar sessões:", error);
      toast({
        title: "Erro",
        description: "Falha ao adicionar sessões à campanha",
        variant: "destructive",
      });
    }
  };

  const handleRemoveSession = async (campaignId: string, sessionId: string) => {
    try {
      await removeSessionFromCampaign(campaignId, sessionId);
      toast({
        title: "Sucesso",
        description: "Sessão removida da campanha com sucesso",
      });
      await loadCampaignSessions(campaignId);
      await loadInitialData();
    } catch (error) {
      console.error("Erro ao remover sessão:", error);
      toast({
        title: "Erro",
        description: "Falha ao remover sessão da campanha",
        variant: "destructive",
      });
    }
  };

  // Navegação entre visualizações
  const handleViewCampaignDetails = (campaign: Campaign) => {
    setSelectedCampaign(campaign);
    loadCampaignSessions(campaign.id);
    setViewMode('details');
  };

  const handleOpenDetailsModal = async (campaign: Campaign) => {
    try {
      setLoadingDetails(true);
      setDetailsModalOpen(true);
      
      // Buscar detalhes completos da campanha
      const campaignDetails = await getCampaign(campaign.id);
      setCampaignDetails(campaignDetails);
    } catch (error) {
      console.error("Erro ao carregar detalhes da campanha:", error);
      toast({
        title: "Erro",
        description: "Falha ao carregar detalhes da campanha",
        variant: "destructive",
      });
      setDetailsModalOpen(false);
    } finally {
      setLoadingDetails(false);
    }
  };

  const handleBackToList = () => {
    setViewMode('list');
    setSelectedCampaign(null);
    setCampaignSessions([]);
  };

  const filteredCampaigns = campaigns.filter(campaign => {
    const matchesSearch = campaign.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" || campaign.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <RefreshCw className="h-8 w-8 animate-spin mx-auto mb-4" />
          <p>Carregando sistema de aquecimento...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 space-y-6 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Sistema de Aquecimento</h1>
          <p className="text-muted-foreground">
            Gerencie campanhas de aquecimento para WhatsApp
          </p>
        </div>
        <div className="flex items-center gap-2">
          {/* Indicador WebSocket */}
          <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-muted/50">
            <div className={`w-2 h-2 rounded-full ${isConnected ? 'bg-green-500' : 'bg-red-500'}`} />
            <span className="text-xs font-medium">
              {isConnected ? 'Tempo Real' : 'Offline'}
            </span>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={refreshData}
            disabled={refreshing}
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${refreshing ? "animate-spin" : ""}`} />
            Atualizar
          </Button>
          <Dialog open={createDialogOpen} onOpenChange={setCreateDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Nova Campanha
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Criar Nova Campanha</DialogTitle>
              </DialogHeader>
              <CreateCampaignForm 
                campaign={newCampaign}
                setCampaign={setNewCampaign}
                onSubmit={handleCreateCampaign}
              />
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Status do WebSocket */}
      {!isConnected && (
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            Conexão WebSocket perdida. Atualizações em tempo real não estão disponíveis.
            {wsError && ` Erro: ${wsError}`}
          </AlertDescription>
        </Alert>
      )}

      {/* Notificações em tempo real */}
      {notifications.length > 0 && (
        <Alert>
          <Activity className="h-4 w-4" />
          <AlertDescription>
            {notifications[0].message}
            <Badge variant="outline" className="ml-2">
              {new Date(notifications[0].timestamp).toLocaleTimeString('pt-BR')}
            </Badge>
          </AlertDescription>
        </Alert>
      )}

      {/* Dashboard Overview */}
      {dashboard && (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total de Campanhas</CardTitle>
              <Target className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{dashboard.overview.totalCampaigns}</div>
              <p className="text-xs text-muted-foreground">
                {dashboard.overview.activeCampaigns} ativas
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Mensagens Hoje</CardTitle>
              <MessageSquare className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{dashboard.overview.totalMessagesSentToday}</div>
              <p className="text-xs text-muted-foreground">
                Enviadas hoje
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Saúde Média</CardTitle>
              <Heart className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className={`text-2xl font-bold ${getHealthColor(dashboard.overview.averageHealthScore)}`}>
                {dashboard.overview.averageHealthScore}%
              </div>
              <Progress value={dashboard.overview.averageHealthScore} className="mt-2" />
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Top Campanha</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-sm font-medium truncate">
                {dashboard.overview.topPerformingCampaign?.name || "N/A"}
              </div>
              <div className={`text-lg font-bold ${getHealthColor(dashboard.overview.topPerformingCampaign?.healthScore || 0)}`}>
                {dashboard.overview.topPerformingCampaign?.healthScore || 0}%
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Filtros e Busca */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1">
          <div className="relative">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Buscar campanhas..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-8"
            />
          </div>
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos</SelectItem>
            <SelectItem value="active">Ativo</SelectItem>
            <SelectItem value="paused">Pausado</SelectItem>
            <SelectItem value="completed">Concluído</SelectItem>
          </SelectContent>
        </Select>
        <Select value={periodFilter} onValueChange={setPeriodFilter}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Período" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="today">Hoje</SelectItem>
            <SelectItem value="week">Esta Semana</SelectItem>
            <SelectItem value="month">Este Mês</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Lista de Campanhas */}
      <div className="grid gap-4">
        {filteredCampaigns.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <Target className="h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold mb-2">Nenhuma campanha encontrada</h3>
              <p className="text-muted-foreground text-center mb-4">
                {campaigns.length === 0 
                  ? "Crie sua primeira campanha de aquecimento para começar"
                  : "Tente ajustar os filtros para encontrar campanhas"
                }
              </p>
              {campaigns.length === 0 && (
                <Button onClick={() => setCreateDialogOpen(true)}>
                  <Plus className="h-4 w-4 mr-2" />
                  Criar Primeira Campanha
                </Button>
              )}
            </CardContent>
          </Card>
        ) : (
          filteredCampaigns.map((campaign) => (
            <CampaignCard
              key={campaign.id}
              campaign={campaign}
              isExpanded={expandedCampaignId === campaign.id}
              onToggleExpand={() => toggleCampaignExpansion(campaign.id)}
              onAction={handleCampaignAction}
              onSelect={() => handleOpenDetailsModal(campaign)}
              onOpenStats={() => {
                setSelectedCampaign(campaign);
                setStatsDialogOpen(true);
              }}
              onOpenExecutions={() => {
                setSelectedCampaign(campaign);
                setExecutionsSheetOpen(true);
              }}
              onOpenSessions={() => {
                setSelectedCampaign(campaign);
                loadCampaignSessions(campaign.id);
                setSessionsSheetOpen(true);
              }}
              whatsappSessions={whatsappSessions}
              campaignSessions={campaign.campaignSessions || []}
              onAddSessions={handleAddSessions}
              onRemoveSession={handleRemoveSession}
              onRefreshSessions={loadCampaignSessions}
            />
          ))
        )}
      </div>

      {/* Dialog de Estatísticas */}
      <Dialog open={statsDialogOpen} onOpenChange={setStatsDialogOpen}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>
              Estatísticas - {selectedCampaign?.name}
            </DialogTitle>
          </DialogHeader>
          {selectedCampaign && (
            <CampaignStats 
              campaignId={selectedCampaign.id} 
              period={periodFilter} 
            />
          )}
        </DialogContent>
      </Dialog>

      {/* Sheet de Execuções */}
      <Sheet open={executionsSheetOpen} onOpenChange={setExecutionsSheetOpen}>
        <SheetContent className="w-[800px] sm:w-[900px]">
          <SheetHeader>
            <SheetTitle>
              Histórico de Execuções - {selectedCampaign?.name}
            </SheetTitle>
          </SheetHeader>
          {selectedCampaign && (
            <ExecutionHistory campaignId={selectedCampaign.id} />
          )}
        </SheetContent>
      </Sheet>

      {/* Sheet de Gerenciamento de Sessões */}
      <Sheet open={sessionsSheetOpen} onOpenChange={setSessionsSheetOpen}>
        <SheetContent className="w-[700px] sm:w-[800px]">
          <SheetHeader>
            <SheetTitle>
              Gerenciar Sessões - {selectedCampaign?.name}
            </SheetTitle>
          </SheetHeader>
          {selectedCampaign && (
            <div className="mt-6">
              <CampaignSessionsManager
                campaign={selectedCampaign}
                campaignSessions={campaignSessions}
                whatsappSessions={whatsappSessions}
                onAddSessions={(sessionIds) => handleAddSessions(selectedCampaign.id, sessionIds)}
                onRemoveSession={(sessionId) => handleRemoveSession(selectedCampaign.id, sessionId)}
                onRefresh={() => loadCampaignSessions(selectedCampaign.id)}
              />
            </div>
          )}
        </SheetContent>
      </Sheet>

      {/* Modal de Detalhes e Edição da Campanha */}
      <Dialog open={detailsModalOpen} onOpenChange={setDetailsModalOpen}>
        <DialogContent className="max-w-[98vw] w-[98vw] max-h-[95vh] overflow-hidden p-0">
          <DialogHeader className="px-6 py-4 border-b">
            <DialogTitle className="flex items-center gap-2 text-xl">
              <Info className="h-6 w-6" />
              Configurações da Campanha
            </DialogTitle>
          </DialogHeader>
          {loadingDetails ? (
            <div className="flex items-center justify-center py-24">
              <div className="text-center">
                <RefreshCw className="h-12 w-12 animate-spin text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">Carregando detalhes da campanha...</p>
              </div>
            </div>
          ) : campaignDetails ? (
            <CampaignDetailsModal 
              campaign={campaignDetails}
              onUpdate={async () => {
                await loadInitialData();
                if (campaignDetails) {
                  const updatedCampaign = await getCampaign(campaignDetails.id);
                  setCampaignDetails(updatedCampaign);
                }
              }}
              onClose={() => setDetailsModalOpen(false)}
            />
          ) : null}
        </DialogContent>
      </Dialog>

      {/* Modal de Confirmação de Exclusão */}
      <Dialog open={deleteConfirmOpen} onOpenChange={setDeleteConfirmOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-lg">
              <AlertTriangle className="h-5 w-5 text-red-500" />
              Confirmar Exclusão
            </DialogTitle>
            <DialogDescription>
              Tem certeza que deseja excluir esta campanha? Esta ação não pode ser desfeita.
            </DialogDescription>
          </DialogHeader>
          
          <div className="flex items-center gap-3 p-4 bg-red-50 rounded-lg border border-red-200">
            <AlertTriangle className="h-8 w-8 text-red-500 flex-shrink-0" />
            <div>
              <p className="font-medium text-red-800">Atenção!</p>
              <p className="text-sm text-red-700">
                Todos os dados da campanha, incluindo histórico de execuções, sessões vinculadas e estatísticas serão permanentemente removidos.
              </p>
            </div>
          </div>

          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => {
                setDeleteConfirmOpen(false);
                setCampaignToDelete(null);
              }}
              disabled={deleting}
            >
              Cancelar
            </Button>
            <Button 
              variant="destructive"
              onClick={handleConfirmDelete}
              disabled={deleting}
            >
              {deleting ? (
                <>
                  <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                  Excluindo...
                </>
              ) : (
                <>
                  <Trash2 className="h-4 w-4 mr-2" />
                  Excluir Campanha
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

// Componente para visualização em lista das campanhas
function CampaignListView({ 
  campaigns, 
  searchTerm, 
  setSearchTerm, 
  statusFilter, 
  setStatusFilter,
  refreshing,
  refreshData,
  createDialogOpen,
  setCreateDialogOpen,
  newCampaign,
  setNewCampaign,
  selectedSessions,
  setSelectedSessions,
  whatsappSessions,
  handleCreateCampaign,
  handleCampaignAction,
  onViewDetails
}: {
  campaigns: Campaign[];
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  statusFilter: string;
  setStatusFilter: (filter: string) => void;
  refreshing: boolean;
  refreshData: () => void;
  createDialogOpen: boolean;
  setCreateDialogOpen: (open: boolean) => void;
  newCampaign: any;
  setNewCampaign: (campaign: any) => void;
  selectedSessions: string[];
  setSelectedSessions: (sessions: string[]) => void;
  whatsappSessions: WhatsAppSession[];
  handleCreateCampaign: () => void;
  handleCampaignAction: (action: string, campaignId: string) => void;
  onViewDetails: (campaign: Campaign) => void;
}) {
  return (
    <>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Sistema de Aquecimento</h1>
          <p className="text-muted-foreground">
            Gerencie campanhas de aquecimento para WhatsApp
          </p>
        </div>
        <div className="flex items-center gap-4">
          <Button
            variant="outline"
            onClick={refreshData}
            disabled={refreshing}
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${refreshing ? 'animate-spin' : ''}`} />
            Atualizar
          </Button>
          <Dialog open={createDialogOpen} onOpenChange={setCreateDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Nova Campanha
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-4xl max-h-[85vh] overflow-hidden flex flex-col">
              <DialogHeader>
                <DialogTitle>Criar Nova Campanha de Aquecimento</DialogTitle>
              </DialogHeader>
              <div className="flex-1 overflow-hidden">
                <CreateCampaignForm 
                  campaign={newCampaign}
                  setCampaign={setNewCampaign}
                  onSubmit={handleCreateCampaign}
                />
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Filtros e Busca */}
      <div className="flex items-center gap-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            placeholder="Buscar campanhas..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-40">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos Status</SelectItem>
            <SelectItem value="active">Ativas</SelectItem>
            <SelectItem value="paused">Pausadas</SelectItem>
            <SelectItem value="completed">Concluídas</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Grid de Campanhas */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {campaigns.map((campaign) => (
          <Card key={campaign.id} className="hover:shadow-md transition-shadow cursor-pointer" onClick={() => onViewDetails(campaign)}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className={`w-3 h-3 rounded-full ${getStatusColor(campaign.status || 'paused')}`} />
                  <div>
                    <CardTitle className="text-lg">{campaign.name}</CardTitle>
                    <p className="text-sm text-muted-foreground">
                      {campaign.description || "Campanha de aquecimento"}
                    </p>
                  </div>
                </div>
                <Badge variant={campaign.status === "active" ? "default" : "secondary"} className="capitalize">
                  {campaign.status}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {/* Estatísticas principais */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Mensagens Enviadas</p>
                    <p className="text-lg font-semibold">{campaign.statistics?.totalMessagesSent || 0}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Sessões Ativas</p>
                    <p className="text-lg font-semibold">
                      {campaign.statistics?.activeSessions || 0}/{campaign.statistics?.totalSessions || 0}
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Meta Diária</p>
                    <p className="text-lg font-semibold">{campaign.dailyMessageGoal}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Score de Saúde</p>
                    <p className={`text-lg font-semibold ${getHealthColor(campaign.statistics?.averageHealthScore || 100)}`}>
                      {Math.round(campaign.statistics?.averageHealthScore || 100)}%
                    </p>
                  </div>
                </div>

                {/* Progress bar */}
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span>Progresso Diário</span>
                    <span>{campaign.statistics?.totalMessagesSent || 0}/{campaign.dailyMessageGoal}</span>
                  </div>
                  <Progress 
                    value={((campaign.statistics?.totalMessagesSent || 0) / campaign.dailyMessageGoal) * 100} 
                    className="h-2" 
                  />
                </div>

                {/* Actions */}
                <div className="flex items-center justify-between pt-2">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Clock className="h-4 w-4" />
                    <span>{campaign.workingHourStart}h - {campaign.workingHourEnd}h</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Button 
                      size="sm" 
                      variant={campaign.status === "active" ? "destructive" : "default"}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleCampaignAction(campaign.status === "active" ? "pause" : "resume", campaign.id);
                      }}
                    >
                      {campaign.status === "active" ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                    </Button>
                    <Button 
                      size="sm" 
                      variant="ghost" 
                      onClick={(e) => {
                        e.stopPropagation();
                        handleCampaignAction("delete", campaign.id);
                      }}
                      className="text-red-500 hover:text-red-700"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {campaigns.length === 0 && (
        <Card className="p-12 text-center">
          <div className="mx-auto max-w-sm">
            <Target className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">Nenhuma campanha encontrada</h3>
            <p className="text-muted-foreground mb-4">
              {searchTerm || statusFilter !== "all" 
                ? "Tente ajustar os filtros de busca" 
                : "Comece criando sua primeira campanha de aquecimento"
              }
            </p>
            {!searchTerm && statusFilter === "all" && (
              <Button onClick={() => setCreateDialogOpen(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Criar Primeira Campanha
              </Button>
            )}
          </div>
        </Card>
      )}
    </>
  );
}

// Componente de Edição da Campanha
interface EditCampaignFormProps {
  campaign: Campaign;
  campaignSessions: WhatsAppSession[];
  whatsappSessions: WhatsAppSession[];
  onSave: () => void;
  onCancel: () => void;
  onAddSessions: (sessionIds: string[]) => void;
  onRemoveSession: (sessionId: string) => void;
}

function EditCampaignForm({ 
  campaign, 
  campaignSessions, 
  whatsappSessions, 
  onSave, 
  onCancel,
  onAddSessions,
  onRemoveSession 
}: EditCampaignFormProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [editData, setEditData] = useState({
    name: campaign.name,
    description: campaign.description || '',
    messageCount: 1,
    dailyLimit: 10,
    intervalMin: 5,
    intervalMax: 15,
    activePeriodStart: '09:00',
    activePeriodEnd: '18:00',
    isActive: campaign.isActive,
    selectedSessions: campaignSessions.map(s => s.id),
    selectedContacts: [],
    templates: []
  });

  const steps = [
    { title: "Informações", description: "Dados gerais da campanha" },
    { title: "Sessões", description: "WhatsApp conectados" },
    { title: "Contatos", description: "Lista de destinatários" },
    { title: "Mensagens", description: "Templates e conteúdo" }
  ];

  const canProceed = () => {
    switch (currentStep) {
      case 0:
        return editData.name.trim() !== '' && 
               editData.messageCount > 0 && 
               editData.dailyLimit > 0;
      case 1:
        return editData.selectedSessions.length > 0;
      case 2:
        return editData.selectedContacts.length > 0;
      case 3:
        return editData.templates.length > 0;
      default:
        return false;
    }
  };

  const handleSave = () => {
    // Aqui seria implementada a lógica para salvar as alterações
    console.log('Salvando alterações da campanha:', editData);
    onSave();
  };

  return (
    <div className="space-y-6">
      {/* Progress Indicator */}
      <div className="flex items-center justify-between">
        {steps.map((step, index) => (
          <div key={index} className="flex items-center">
            <div className={`
              w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium
              ${index <= currentStep 
                ? 'bg-blue-600 text-white' 
                : 'bg-gray-200 text-gray-600'
              }
            `}>
              {index + 1}
            </div>
            <div className="ml-2 hidden sm:block">
              <div className="text-sm font-medium">{step.title}</div>
              <div className="text-xs text-gray-500">{step.description}</div>
            </div>
            {index < steps.length - 1 && (
              <div className={`
                w-12 h-0.5 mx-4
                ${index < currentStep ? 'bg-blue-600' : 'bg-gray-200'}
              `} />
            )}
          </div>
        ))}
      </div>

      {/* Step Content */}
      <div className="min-h-[400px]">
        {currentStep === 0 && (
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="edit-name">Nome da Campanha</Label>
                <Input
                  id="edit-name"
                  value={editData.name}
                  onChange={(e) => setEditData({...editData, name: e.target.value})}
                  placeholder="Nome da campanha"
                />
              </div>
              <div>
                <Label htmlFor="edit-messageCount">Mensagens por Contato</Label>
                <Input
                  id="edit-messageCount"
                  type="number"
                  value={editData.messageCount}
                  onChange={(e) => setEditData({...editData, messageCount: parseInt(e.target.value)})}
                  min="1"
                />
              </div>
            </div>
            
            <div>
              <Label htmlFor="edit-description">Descrição</Label>
              <Textarea
                id="edit-description"
                value={editData.description}
                onChange={(e) => setEditData({...editData, description: e.target.value})}
                placeholder="Descrição da campanha"
                rows={3}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="edit-dailyLimit">Limite Diário</Label>
                <Input
                  id="edit-dailyLimit"
                  type="number"
                  value={editData.dailyLimit}
                  onChange={(e) => setEditData({...editData, dailyLimit: parseInt(e.target.value)})}
                  min="1"
                />
              </div>
              <div className="flex items-center space-x-2">
                <Switch
                  id="edit-isActive"
                  checked={editData.isActive}
                  onCheckedChange={(checked) => setEditData({...editData, isActive: checked})}
                />
                <Label htmlFor="edit-isActive">Campanha Ativa</Label>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label>Intervalo Mínimo (minutos)</Label>
                <Slider
                  value={[editData.intervalMin]}
                  onValueChange={([value]) => setEditData({...editData, intervalMin: value})}
                  max={120}
                  min={0}
                  step={1}
                  className="mt-2"
                />
                <div className="text-sm text-gray-500 mt-1">{editData.intervalMin} minutos</div>
              </div>
              <div>
                <Label>Intervalo Máximo (minutos)</Label>
                <Slider
                  value={[editData.intervalMax]}
                  onValueChange={([value]) => setEditData({...editData, intervalMax: value})}
                  max={240}
                  min={editData.intervalMin}
                  step={1}
                  className="mt-2"
                />
                <div className="text-sm text-gray-500 mt-1">{editData.intervalMax} minutos</div>
              </div>
            </div>
          </div>
        )}

        {currentStep === 1 && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-medium">Sessões WhatsApp</h3>
              <span className="text-sm text-gray-500">
                {editData.selectedSessions.length} selecionadas
              </span>
            </div>
            
            <div className="grid gap-3">
              {whatsappSessions.map((session) => (
                <div
                  key={session.id}
                  className={`
                    p-4 border rounded-lg cursor-pointer transition-colors
                    ${editData.selectedSessions.includes(session.id)
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 hover:border-gray-300'
                    }
                  `}
                  onClick={() => {
                    const newSelected = editData.selectedSessions.includes(session.id)
                      ? editData.selectedSessions.filter(id => id !== session.id)
                      : [...editData.selectedSessions, session.id];
                    setEditData({...editData, selectedSessions: newSelected});
                  }}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className={`
                        w-3 h-3 rounded-full
                        ${session.status === 'CONNECTED' ? 'bg-green-500' : 'bg-red-500'}
                      `} />
                      <div>
                        <div className="font-medium">{session.name}</div>
                        <div className="text-sm text-gray-500">{session.phone}</div>
                      </div>
                    </div>
                    <div className="text-sm text-gray-500 capitalize">{session.status}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {currentStep === 2 && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-medium">Contatos</h3>
              <span className="text-sm text-gray-500">
                {editData.selectedContacts.length} selecionados
              </span>
            </div>
            
            <div className="border rounded-lg p-4 text-center text-gray-500">
              <p>Componente de seleção de contatos será implementado aqui</p>
              <p className="text-sm mt-1">Por enquanto, {editData.selectedContacts.length} contatos estão selecionados</p>
            </div>
          </div>
        )}

        {currentStep === 3 && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-medium">Templates de Mensagens</h3>
              <Button variant="outline" size="sm">
                <Plus className="h-4 w-4 mr-1" />
                Adicionar Template
              </Button>
            </div>
            
            <div className="space-y-3">
              {editData.templates.map((template: any, index) => (
                <div key={index} className="border rounded-lg p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="font-medium">Template {index + 1}</div>
                      <div className="text-sm text-gray-600 mt-1 line-clamp-2">
                        {template.content || template.message || 'Conteúdo do template'}
                      </div>
                    </div>
                    <Button variant="ghost" size="sm">
                      <Pencil className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
              
              {editData.templates.length === 0 && (
                <div className="border rounded-lg p-4 text-center text-gray-500">
                  <p>Nenhum template configurado</p>
                  <p className="text-sm mt-1">Clique em "Adicionar Template" para começar</p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Navigation */}
      <div className="flex justify-between pt-4 border-t">
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={() => setCurrentStep(Math.max(0, currentStep - 1))}
            disabled={currentStep === 0}
          >
            <ChevronLeft className="h-4 w-4 mr-1" />
            Anterior
          </Button>
        </div>
        
        <div className="flex gap-2">
          <Button variant="outline" onClick={onCancel}>
            Cancelar
          </Button>
          
          {currentStep < steps.length - 1 ? (
            <Button
              onClick={() => setCurrentStep(currentStep + 1)}
              disabled={!canProceed()}
            >
              Próximo
              <ChevronRight className="h-4 w-4 ml-1" />
            </Button>
          ) : (
            <Button onClick={handleSave} disabled={!canProceed()}>
              <Save className="h-4 w-4 mr-1" />
              Salvar Alterações
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}

// Componente para visualização detalhada da campanha
function CampaignDetailsView({
  campaign,
  campaignSessions,
  whatsappSessions,
  onBack,
  onAddSessions,
  onRemoveSession,
  onRefreshSessions,
  onCampaignAction,
  isConnected,
  wsError,
  campaignLogs,
  executionLogs,
  botHealthData
}: {
  campaign: Campaign;
  campaignSessions: any[];
  whatsappSessions: WhatsAppSession[];
  onBack: () => void;
  onAddSessions: (sessionIds: string[]) => void;
  onRemoveSession: (sessionId: string) => void;
  onRefreshSessions: () => void;
  onCampaignAction: (action: string, campaignId: string) => void;
  isConnected: boolean;
  wsError: string | null;
  campaignLogs: any[];
  executionLogs: any[];
  botHealthData: Map<string, any>;
}) {
  const isActive = campaign.status === "active";
  const statistics = campaign.statistics;
  const [editDialogOpen, setEditDialogOpen] = useState(false);

  return (
    <div className="space-y-6">
      {/* Header com navegação */}
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="sm" onClick={onBack}>
          <ArrowUp className="h-4 w-4 mr-2 rotate-[-90deg]" />
          Voltar
        </Button>
        <div className="flex-1">
          <div className="flex items-center gap-3">
            <div className={`w-3 h-3 rounded-full ${getStatusColor(campaign.status || 'paused')}`} />
            <h1 className="text-3xl font-bold tracking-tight">{campaign.name}</h1>
            <Badge variant={isActive ? "default" : "secondary"} className="capitalize">
              {campaign.status}
            </Badge>
          </div>
          <p className="text-muted-foreground mt-1">
            {campaign.description || "Campanha de aquecimento WhatsApp"}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setEditDialogOpen(true)}
          >
            <Settings className="h-4 w-4 mr-2" />
            Editar Campanha
          </Button>
          <Button
            variant={isActive ? "destructive" : "default"}
            size="sm"
            onClick={() => onCampaignAction(isActive ? "pause" : "resume", campaign.id)}
          >
            {isActive ? (
              <>
                <Pause className="h-4 w-4 mr-2" />
                Pausar
              </>
            ) : (
              <>
                <Play className="h-4 w-4 mr-2" />
                Iniciar
              </>
            )}
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => onCampaignAction("force", campaign.id)}
          >
            <Zap className="h-4 w-4 mr-2" />
            Executar Agora
          </Button>
        </div>
      </div>

      {/* Grid de estatísticas principais */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
        {/* Card de Status WebSocket */}
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">WebSocket</p>
                <p className={`text-2xl font-bold ${isConnected ? 'text-green-600' : 'text-red-600'}`}>
                  {isConnected ? 'Online' : 'Offline'}
                </p>
              </div>
              <Activity className={`h-8 w-8 ${isConnected ? 'text-green-600' : 'text-red-600'}`} />
            </div>
            <div className="mt-4 flex items-center text-sm">
              <div className={`h-2 w-2 rounded-full mr-2 ${isConnected ? 'bg-green-600' : 'bg-red-600'}`} />
              <span className="text-muted-foreground">
                {isConnected ? 'Tempo real ativo' : 'Desconectado'}
              </span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Mensagens Enviadas</p>
                <p className="text-2xl font-bold">{statistics?.totalMessagesSent || 0}</p>
              </div>
              <MessageSquare className="h-8 w-8 text-blue-600" />
            </div>
            <div className="mt-4 flex items-center text-sm">
              <TrendingUp className="h-4 w-4 text-green-600 mr-1" />
              <span className="text-green-600">
                {statistics?.deliveryRate || 100}% entregues
              </span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Sessões Ativas</p>
                <p className="text-2xl font-bold">
                  {statistics?.activeSessions || 0}/{statistics?.totalSessions || 0}
                </p>
              </div>
              <Phone className="h-8 w-8 text-green-600" />
            </div>
            <div className="mt-4">
              <Progress 
                value={statistics?.totalSessions ? (statistics.activeSessions / statistics.totalSessions) * 100 : 0} 
                className="h-2" 
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Score de Saúde</p>
                <p className={`text-2xl font-bold ${getHealthColor(statistics?.averageHealthScore || 100)}`}>
                  {Math.round(statistics?.averageHealthScore || 100)}%
                </p>
              </div>
              <Heart className="h-8 w-8 text-red-500" />
            </div>
            <div className="mt-4">
              <Progress 
                value={statistics?.averageHealthScore || 100} 
                className="h-2" 
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Meta Diária</p>
                <p className="text-2xl font-bold">{campaign.dailyMessageGoal}</p>
              </div>
              <Target className="h-8 w-8 text-purple-600" />
            </div>
            <div className="mt-4 flex items-center text-sm">
              <Clock className="h-4 w-4 text-muted-foreground mr-1" />
              <span className="text-muted-foreground">
                {campaign.workingHourStart}h - {campaign.workingHourEnd}h
              </span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tabs para organizar todas as funcionalidades */}
      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="grid w-full grid-cols-7">
          <TabsTrigger value="overview" className="flex items-center gap-2">
            <BarChart3 className="h-4 w-4" />
            Visão Geral
          </TabsTrigger>
          <TabsTrigger value="realtime" className="flex items-center gap-2">
            <Activity className={`h-4 w-4 ${isConnected ? 'text-green-600' : 'text-red-600'}`} />
            Tempo Real
            {isConnected && <div className="w-2 h-2 rounded-full bg-green-500 ml-1" />}
          </TabsTrigger>
          <TabsTrigger value="settings" className="flex items-center gap-2">
            <Settings className="h-4 w-4" />
            Configurações
          </TabsTrigger>
          <TabsTrigger value="sessions" className="flex items-center gap-2">
            <Phone className="h-4 w-4" />
            Sessões
          </TabsTrigger>
          <TabsTrigger value="templates" className="flex items-center gap-2">
            <MessageSquare className="h-4 w-4" />
            Templates
          </TabsTrigger>
          <TabsTrigger value="contacts" className="flex items-center gap-2">
            <Users className="h-4 w-4" />
            Contatos
          </TabsTrigger>
          <TabsTrigger value="executions" className="flex items-center gap-2">
            <Activity className="h-4 w-4" />
            Histórico
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid gap-6 lg:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5" />
                  Estatísticas Detalhadas
                </CardTitle>
              </CardHeader>
              <CardContent>
                <CampaignStats campaignId={campaign.id} period="today" />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Activity className="h-5 w-5" />
                  Atividade Recente
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 rounded-full bg-green-500" />
                    <div className="flex-1">
                      <p className="text-sm font-medium">Campanha iniciada</p>
                      <p className="text-xs text-muted-foreground">
                        {new Date(campaign.createdAt).toLocaleString('pt-BR')}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 rounded-full bg-blue-500" />
                    <div className="flex-1">
                      <p className="text-sm font-medium">Última atualização</p>
                      <p className="text-xs text-muted-foreground">
                        {new Date(campaign.updatedAt).toLocaleString('pt-BR')}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 rounded-full bg-purple-500" />
                    <div className="flex-1">
                      <p className="text-sm font-medium">Criado por</p>
                      <p className="text-xs text-muted-foreground">
                        {campaign.createdBy?.name || "Sistema"}
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="realtime" className="space-y-6">
          {/* TODO: Implementar funcionalidade de tempo real quando o componente for integrado */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Activity className="h-5 w-5" />
                Monitoramento em Tempo Real
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8 text-muted-foreground">
                <Activity className="h-8 w-8 mx-auto mb-2 opacity-50" />
                <p>Monitoramento em tempo real será implementado em breve</p>
                <p className="text-xs mt-1">Esta funcionalidade estará disponível na próxima versão</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="settings" className="space-y-6">
          <CampaignSettings campaign={campaign} onUpdate={(updatedCampaign) => {
            // Atualizar campanha
            console.log('Campaign updated:', updatedCampaign);
          }} />
        </TabsContent>

        <TabsContent value="sessions" className="space-y-6">
          <CampaignSessionsManager
            campaign={campaign}
            campaignSessions={campaignSessions}
            whatsappSessions={whatsappSessions}
            onAddSessions={onAddSessions}
            onRemoveSession={onRemoveSession}
            onRefresh={onRefreshSessions}
          />
        </TabsContent>

        <TabsContent value="templates" className="space-y-6">
          <div className="text-center py-8">
            <p className="text-muted-foreground">Templates são gerenciados no card expandido</p>
          </div>
        </TabsContent>

        <TabsContent value="contacts" className="space-y-6">
          <div className="text-center py-8">
            <p className="text-muted-foreground">Contatos serão implementados em breve</p>
          </div>
        </TabsContent>

        <TabsContent value="executions" className="space-y-6">
          <ExecutionHistory campaignId={campaign.id} />
        </TabsContent>
      </Tabs>

      {/* Modal de Edição Completa da Campanha */}
      <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Settings className="h-5 w-5" />
              Editar Campanha - {campaign.name}
            </DialogTitle>
          </DialogHeader>
          
          <EditCampaignForm 
            campaign={campaign}
            campaignSessions={campaignSessions}
            whatsappSessions={whatsappSessions}
            onSave={() => {
              setEditDialogOpen(false);
              // Aqui seria chamada a função para recarregar os dados da campanha
            }}
            onCancel={() => setEditDialogOpen(false)}
            onAddSessions={onAddSessions}
            onRemoveSession={onRemoveSession}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}

// Componente para configurações da campanha
function CampaignSettings({ 
  campaign, 
  onUpdate 
}: { 
  campaign: Campaign; 
  onUpdate: (updatedCampaign: Campaign) => void; 
}) {
  const [formData, setFormData] = useState({
    name: campaign.name,
    description: campaign.description || '',
    dailyMessageGoal: campaign.dailyMessageGoal,
    minIntervalMinutes: campaign.minIntervalMinutes,
    maxIntervalMinutes: campaign.maxIntervalMinutes,
    useWorkingHours: campaign.useWorkingHours,
    workingHourStart: campaign.workingHourStart,
    workingHourEnd: campaign.workingHourEnd,
    allowWeekends: campaign.allowWeekends,
    randomizeInterval: campaign.randomizeInterval,
    enableInternalConversations: campaign.enableInternalConversations,
    internalConversationRatio: campaign.internalConversationRatio,
  });

  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    setSaving(true);
    try {
      const updatedCampaign = await updateCampaign(campaign.id, formData);
      onUpdate(updatedCampaign);
      toast({
        title: "Configurações salvas",
        description: "As configurações da campanha foram atualizadas com sucesso.",
      });
    } catch (error) {
      console.error('Erro ao salvar configurações:', error);
      toast({
        title: "Erro",
        description: "Não foi possível salvar as configurações.",
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Configurações Básicas</CardTitle>
          <p className="text-sm text-muted-foreground">
            Configure os parâmetros principais da campanha de aquecimento
          </p>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="name">Nome da Campanha</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="dailyGoal">Meta Diária de Mensagens</Label>
              <Input
                id="dailyGoal"
                type="number"
                min="1"
                max="100"
                value={formData.dailyMessageGoal}
                onChange={(e) => setFormData({ ...formData, dailyMessageGoal: parseInt(e.target.value) })}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Descrição</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              rows={3}
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Intervalos e Horários</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="minInterval">Intervalo Mínimo (minutos)</Label>
              <Input
                id="minInterval"
                type="number"
                min="0"
                max="120"
                value={formData.minIntervalMinutes}
                onChange={(e) => setFormData({ ...formData, minIntervalMinutes: parseInt(e.target.value) })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="maxInterval">Intervalo Máximo (minutos)</Label>
              <Input
                id="maxInterval"
                type="number"
                min="10"
                max="180"
                value={formData.maxIntervalMinutes}
                onChange={(e) => setFormData({ ...formData, maxIntervalMinutes: parseInt(e.target.value) })}
              />
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <Switch
              id="useWorkingHours"
              checked={formData.useWorkingHours}
              onCheckedChange={(checked) => setFormData({ ...formData, useWorkingHours: checked })}
            />
            <Label htmlFor="useWorkingHours">Respeitar horário comercial</Label>
          </div>

          {formData.useWorkingHours && (
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="startHour">Horário de Início</Label>
                <Select value={formData.workingHourStart.toString()} onValueChange={(value) => setFormData({ ...formData, workingHourStart: parseInt(value) })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {Array.from({ length: 24 }, (_, i) => (
                      <SelectItem key={i} value={i.toString()}>
                        {i.toString().padStart(2, '0')}:00
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="endHour">Horário de Término</Label>
                <Select value={formData.workingHourEnd.toString()} onValueChange={(value) => setFormData({ ...formData, workingHourEnd: parseInt(value) })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {Array.from({ length: 24 }, (_, i) => (
                      <SelectItem key={i} value={i.toString()}>
                        {i.toString().padStart(2, '0')}:00
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}

          <div className="flex items-center space-x-2">
            <Switch
              id="allowWeekends"
              checked={formData.allowWeekends}
              onCheckedChange={(checked) => setFormData({ ...formData, allowWeekends: checked })}
            />
            <Label htmlFor="allowWeekends">Permitir envios nos fins de semana</Label>
          </div>

          <div className="flex items-center space-x-2">
            <Switch
              id="randomizeInterval"
              checked={formData.randomizeInterval}
              onCheckedChange={(checked) => setFormData({ ...formData, randomizeInterval: checked })}
            />
            <Label htmlFor="randomizeInterval">Aleatorizar intervalos</Label>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Conversas Internas</CardTitle>
          <p className="text-sm text-muted-foreground">
            Configure conversas automáticas entre as sessões da campanha
          </p>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center space-x-2">
            <Switch
              id="enableInternal"
              checked={formData.enableInternalConversations}
              onCheckedChange={(checked) => setFormData({ ...formData, enableInternalConversations: checked })}
            />
            <Label htmlFor="enableInternal">Habilitar conversas internas</Label>
          </div>

          {formData.enableInternalConversations && (
            <div className="space-y-2">
              <Label htmlFor="internalRatio">
                Proporção de conversas internas: {Math.round(formData.internalConversationRatio * 100)}%
              </Label>
              <Slider
                id="internalRatio"
                min={0}
                max={0.8}
                step={0.1}
                value={[formData.internalConversationRatio]}
                onValueChange={(value) => setFormData({ ...formData, internalConversationRatio: value[0] })}
                className="w-full"
              />
              <p className="text-xs text-muted-foreground">
                Porcentagem de mensagens que serão trocadas entre as próprias sessões da campanha
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      <div className="flex justify-end">
        <Button onClick={handleSave} disabled={saving}>
          {saving ? (
            <>
              <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
              Salvando...
            </>
          ) : (
            <>
              <CheckCircle className="h-4 w-4 mr-2" />
              Salvar Configurações
            </>
          )}
        </Button>
      </div>
    </div>
  );
}

// Função auxiliar para obter o ícone do status de execução
function getExecutionStatusIcon(status: string) {
  switch (status) {
    case "delivered":
      return <CheckCircle className="h-4 w-4 text-green-500" />;
    case "sent":
      return <CheckCircle className="h-4 w-4 text-blue-500" />;
    case "failed":
      return <AlertTriangle className="h-4 w-4 text-red-500" />;
    default:
      return <Clock className="h-4 w-4 text-yellow-500" />;
  }
}

// Componente para formulário de criação de campanha simplificado
function CreateCampaignForm({ 
  campaign, 
  setCampaign, 
  onSubmit
}: { 
  campaign: any; 
  setCampaign: (campaign: any) => void; 
  onSubmit: () => void;
}) {

  const steps = [
    { number: 1, title: 'Informações', description: 'Configure os dados básicos da campanha' }
  ];

  const handleFinish = () => {
    // Finalizar criação da campanha
    onSubmit();
  };

  const canProceed = () => {
    return campaign.name && campaign.dailyMessageGoal;
  };

  return (
    <div className="h-full flex flex-col">
      {/* Título */}
      <div className="text-center mb-6">
        <h3 className="text-xl font-semibold">{steps[0].title}</h3>
        <p className="text-sm text-muted-foreground">{steps[0].description}</p>
      </div>

      {/* Conteúdo Rolável */}
      <ScrollArea className="flex-1 pr-4">
        <div className="space-y-4">
        {/* Informações Básicas da Campanha */}
        <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Nome da Campanha *</Label>
              <Input
                id="name"
                value={campaign.name}
                onChange={(e) => setCampaign({ ...campaign, name: e.target.value })}
                placeholder="Ex: Aquecimento Vendas Q4"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Descrição</Label>
              <Textarea
                id="description"
                value={campaign.description}
                onChange={(e) => setCampaign({ ...campaign, description: e.target.value })}
                placeholder="Descreva o objetivo desta campanha..."
                rows={3}
              />
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="dailyGoal">Meta Diária de Mensagens *</Label>
                <Input
                  id="dailyGoal"
                  type="number"
                  min="1"
                  max="100"
                  value={campaign.dailyMessageGoal}
                  onChange={(e) => setCampaign({ 
                    ...campaign, 
                    dailyMessageGoal: parseInt(e.target.value) || 1 
                  })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="minInterval">Intervalo Mínimo (min)</Label>
                <Input
                  id="minInterval"
                  type="number"
                  min="0"
                  max="120"
                  value={campaign.minIntervalMinutes ?? 15}
                  onChange={(e) => setCampaign({ 
                    ...campaign, 
                    minIntervalMinutes: parseInt(e.target.value) >= 0 ? parseInt(e.target.value) : 0
                  })}
                />
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="maxInterval">Intervalo Máximo (min)</Label>
                <Input
                  id="maxInterval"
                  type="number"
                  min="1"
                  max="240"
                  value={campaign.maxIntervalMinutes || 45}
                  onChange={(e) => setCampaign({ 
                    ...campaign, 
                    maxIntervalMinutes: parseInt(e.target.value) || 45 
                  })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="internalRatio">Taxa de Conversas Internas (%)</Label>
                <Input
                  id="internalRatio"
                  type="number"
                  min="0"
                  max="100"
                  value={(campaign.internalConversationRatio || 0.2) * 100}
                  onChange={(e) => setCampaign({ 
                    ...campaign, 
                    internalConversationRatio: (parseInt(e.target.value) || 20) / 100 
                  })}
                />
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <Switch
                  id="internal"
                  checked={campaign.enableInternalConversations || false}
                  onCheckedChange={(checked) => setCampaign({ 
                    ...campaign, 
                    enableInternalConversations: checked 
                  })}
                />
                <Label htmlFor="internal">Habilitar conversas internas</Label>
              </div>

              <div className="flex items-center space-x-2">
                <Switch
                  id="workingHours"
                  checked={campaign.useWorkingHours || true}
                  onCheckedChange={(checked) => setCampaign({ 
                    ...campaign, 
                    useWorkingHours: checked 
                  })}
                />
                <Label htmlFor="workingHours">Usar horário comercial</Label>
              </div>

              {campaign.useWorkingHours && (
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="startHour">Horário de Início</Label>
                    <Input
                      id="startHour"
                      type="number"
                      min="0"
                      max="23"
                      value={campaign.workingHourStart || 8}
                      onChange={(e) => setCampaign({ 
                        ...campaign, 
                        workingHourStart: parseInt(e.target.value) || 8 
                      })}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="endHour">Horário de Fim</Label>
                    <Input
                      id="endHour"
                      type="number"
                      min="0"
                      max="23"
                      value={campaign.workingHourEnd || 18}
                      onChange={(e) => setCampaign({ 
                        ...campaign, 
                        workingHourEnd: parseInt(e.target.value) || 18 
                      })}
                    />
                  </div>
                </div>
              )}

              <div className="flex items-center space-x-2">
                <Switch
                  id="allowWeekends"
                  checked={campaign.allowWeekends || false}
                  onCheckedChange={(checked) => setCampaign({ 
                    ...campaign, 
                    allowWeekends: checked 
                  })}
                />
                <Label htmlFor="allowWeekends">Permitir fins de semana</Label>
              </div>

              <div className="flex items-center space-x-2">
                <Switch
                  id="randomizeInterval"
                  checked={campaign.randomizeInterval ?? true}
                  onCheckedChange={(checked) => setCampaign({ 
                    ...campaign, 
                    randomizeInterval: checked 
                  })}
                />
                <Label htmlFor="randomizeInterval">Aleatorizar intervalos</Label>
              </div>

              <div className="flex items-center space-x-2">
                <Switch
                  id="enableAutoPauses"
                  checked={campaign.enableAutoPauses ?? false}
                  onCheckedChange={(checked) => setCampaign({ 
                    ...campaign, 
                    enableAutoPauses: checked 
                  })}
                />
                <Label htmlFor="enableAutoPauses">Habilitar pausas automáticas</Label>
              </div>

              {campaign.enableAutoPauses && (
                <div className="grid gap-4 md:grid-cols-2 pl-6">
                  <div className="space-y-2">
                    <Label htmlFor="maxPauseTime">Tempo Máximo de Pausa (min)</Label>
                    <Input
                      id="maxPauseTime"
                      type="number"
                      min="1"
                      max="240"
                      value={campaign.maxPauseTimeMinutes || 45}
                      onChange={(e) => setCampaign({ 
                        ...campaign, 
                        maxPauseTimeMinutes: parseInt(e.target.value) || 45 
                      })}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="minConversationTime">Tempo Mínimo de Conversa (min)</Label>
                    <Input
                      id="minConversationTime"
                      type="number"
                      min="1"
                      max="120"
                      value={campaign.minConversationTimeMinutes || 30}
                      onChange={(e) => setCampaign({ 
                        ...campaign, 
                        minConversationTimeMinutes: parseInt(e.target.value) || 30 
                      })}
                    />
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </ScrollArea>

      {/* Botão de Criar Campanha - Fixo na parte inferior */}
      <div className="flex justify-end pt-4 border-t mt-6 bg-white">
        <Button
          onClick={handleFinish}
          disabled={!canProceed()}
          className="w-full md:w-auto"
        >
          <CheckCircle className="h-4 w-4 mr-2" />
          Criar Campanha
        </Button>
      </div>
    </div>
  );
}

// Componente do Card de Campanha
function CampaignCard({ 
  campaign, 
  isExpanded = false,
  onToggleExpand,
  onAction, 
  onSelect, 
  onOpenStats, 
  onOpenExecutions,
  onOpenSessions,
  whatsappSessions = [],
  campaignSessions = [],
  onAddSessions,
  onRemoveSession,
  onRefreshSessions
}: {
  campaign: Campaign;
  isExpanded?: boolean;
  onToggleExpand?: () => void;
  onAction: (action: string, campaignId: string) => void;
  onSelect: () => void;
  onOpenStats: () => void;
  onOpenExecutions: () => void;
  onOpenSessions: () => void;
  whatsappSessions?: WhatsAppSession[];
  campaignSessions?: any[];
  onAddSessions?: (campaignId: string, sessionIds: string[]) => void;
  onRemoveSession?: (campaignId: string, sessionId: string) => void;
  onRefreshSessions?: (campaignId: string) => void;
}) {
  const isActive = campaign.status === "active";
  const isPaused = campaign.status === "paused";

  // Estados locais para o card expandido
  const [editData, setEditData] = useState({
    name: campaign.name,
    description: campaign.description || '',
    dailyMessageGoal: campaign.dailyMessageGoal,
    enableInternalConversations: campaign.enableInternalConversations,
    internalConversationRatio: campaign.internalConversationRatio,
    minIntervalMinutes: campaign.minIntervalMinutes,
    maxIntervalMinutes: campaign.maxIntervalMinutes,
    useWorkingHours: campaign.useWorkingHours,
    workingHourStart: campaign.workingHourStart,
    workingHourEnd: campaign.workingHourEnd,
    allowWeekends: campaign.allowWeekends,
    randomizeInterval: campaign.randomizeInterval,
    enableAutoPauses: campaign.enableAutoPauses,
    maxPauseTimeMinutes: campaign.maxPauseTimeMinutes,
    minConversationTimeMinutes: campaign.minConversationTimeMinutes,
  });
  const [saving, setSaving] = useState(false);
  
  // Estados para gerenciar sessões
  const [showAddSessionsDialog, setShowAddSessionsDialog] = useState(false);
  const [selectedNewSessions, setSelectedNewSessions] = useState<string[]>([]);
  const [loadingSessions, setLoadingSessions] = useState(false);

  // Estados para gerenciar templates
  const [templates, setTemplates] = useState<Template[]>([]);
  const [templatesLoading, setTemplatesLoading] = useState(false);
  const [templateDialog, setTemplateDialog] = useState(false);
  const [importTemplatesDialog, setImportTemplatesDialog] = useState(false);
  const [editingTemplate, setEditingTemplate] = useState<Template | null>(null);
  const [showAllTemplates, setShowAllTemplates] = useState(false);
  const [newTemplate, setNewTemplate] = useState({
    name: '',
    content: '',
    messageType: 'text' as "text" | "image" | "audio" | "video" | "document",
    weight: 1,
    isActive: true,
    mediaUrl: '',
    file: null as File | null
  });
  const [jsonTemplates, setJsonTemplates] = useState('');

  // Estados para gerenciar mídia
  const [mediaFiles, setMediaFiles] = useState<MediaFile[]>([]);
  const [mediaLoading, setMediaLoading] = useState(false);
  const [mediaDialog, setMediaDialog] = useState(false);

  // Funções de Template
  const loadCampaignTemplates = async (campaignId: string, loadAll = false) => {
    try {
      setTemplatesLoading(true);
      const response = await getCampaignTemplates(campaignId);
      const allTemplates = response.data || [];
      
      if (loadAll || showAllTemplates) {
        // Carregar todos os templates
        const sortedTemplates = allTemplates
          .sort((a: any, b: any) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        setTemplates(sortedTemplates);
      } else {
        // Limitar a apenas os últimos 3 templates para melhor performance
        const latestTemplates = allTemplates
          .sort((a: any, b: any) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
          .slice(0, 3);
        setTemplates(latestTemplates);
      }
    } catch (error) {
      console.error("Erro ao carregar templates:", error);
      toast({
        title: "Erro",
        description: "Falha ao carregar templates da campanha",
        variant: "destructive",
      });
    } finally {
      setTemplatesLoading(false);
    }
  };

  // Função para alternar entre mostrar todos os templates ou apenas os últimos 3
  const toggleShowAllTemplates = async () => {
    const newShowAll = !showAllTemplates;
    setShowAllTemplates(newShowAll);
    if (campaign.id) {
      await loadCampaignTemplates(campaign.id, newShowAll);
    }
  };

  const handleCreateTemplate = async () => {
    if (!campaign.id || !newTemplate.content) return;

    try {
      setTemplatesLoading(true);
      
      // Se há arquivo, usa a API com upload
      if (newTemplate.file) {
        await createTemplateWithFile(campaign.id, {
          file: newTemplate.file,
          content: newTemplate.content,
          weight: newTemplate.weight,
          variables: JSON.stringify({ name: newTemplate.name })
        });
      } else {
        // Caso contrário, usa a API tradicional
        const formData = new FormData();
        formData.append('name', newTemplate.name);
        formData.append('content', newTemplate.content);
        formData.append('messageType', newTemplate.messageType);
        formData.append('weight', newTemplate.weight.toString());
        formData.append('isActive', newTemplate.isActive.toString());
        if (newTemplate.mediaUrl) {
          formData.append('mediaUrl', newTemplate.mediaUrl);
        }

        await createTemplate(campaign.id, formData);
      }
      
      toast({
        title: "Sucesso",
        description: "Template criado com sucesso",
      });
      
      setTemplateDialog(false);
      setNewTemplate({
        name: '',
        content: '',
        messageType: 'text',
        weight: 1,
        isActive: true,
        mediaUrl: '',
        file: null
      });
      await loadCampaignTemplates(campaign.id);
    } catch (error) {
      console.error("Erro ao criar template:", error);
      toast({
        title: "Erro",
        description: "Falha ao criar template",
        variant: "destructive",
      });
    } finally {
      setTemplatesLoading(false);
    }
  };

  // Funções para gerenciamento de mídia
  const loadCampaignMedia = async (campaignId: string) => {
    setMediaLoading(true);
    try {
      const media = await getCampaignMedia(campaignId);
      setMediaFiles(media);
    } catch (error) {
      console.error('Erro ao carregar mídia:', error);
      toast({
        title: "Erro",
        description: "Erro ao carregar arquivos de mídia",
        variant: "destructive",
      });
    } finally {
      setMediaLoading(false);
    }
  };

  const handleDeleteMedia = async (campaignId: string, mediaId: string) => {
    try {
      await deleteCampaignMedia(campaignId, mediaId);
      setMediaFiles(mediaFiles.filter(media => media.id !== mediaId));
      toast({
        title: "Sucesso",
        description: "Arquivo de mídia removido com sucesso",
      });
    } catch (error) {
      console.error('Erro ao deletar mídia:', error);
      toast({
        title: "Erro",
        description: "Erro ao remover arquivo de mídia",
        variant: "destructive",
      });
    }
  };

  const handleUpdateTemplate = async () => {
    if (!campaign.id || !editingTemplate || !newTemplate.name || !newTemplate.content) return;

    try {
      setTemplatesLoading(true);
      
      const formData = new FormData();
      formData.append('name', newTemplate.name);
      formData.append('content', newTemplate.content);
      formData.append('messageType', newTemplate.messageType);
      formData.append('weight', newTemplate.weight.toString());
      formData.append('isActive', newTemplate.isActive.toString());
      if (newTemplate.mediaUrl) {
        formData.append('mediaUrl', newTemplate.mediaUrl);
      }

      await updateTemplate(campaign.id, editingTemplate.id, formData);
      
      toast({
        title: "Sucesso",
        description: "Template atualizado com sucesso",
      });
      
      setTemplateDialog(false);
      setEditingTemplate(null);
      setNewTemplate({
        name: '',
        content: '',
        messageType: 'text',
        weight: 1,
        isActive: true,
        mediaUrl: '',
        file: null
      });
      await loadCampaignTemplates(campaign.id);
    } catch (error) {
      console.error("Erro ao atualizar template:", error);
      toast({
        title: "Erro",
        description: "Falha ao atualizar template",
        variant: "destructive",
      });
    } finally {
      setTemplatesLoading(false);
    }
  };

  const handleDeleteTemplate = async (templateId: string) => {
    if (!campaign.id || !confirm("Tem certeza que deseja excluir este template?")) return;

    try {
      setTemplatesLoading(true);
      await deleteTemplate(campaign.id, templateId);
      
      toast({
        title: "Sucesso",
        description: "Template excluído com sucesso",
      });
      
      await loadCampaignTemplates(campaign.id);
    } catch (error) {
      console.error("Erro ao excluir template:", error);
      toast({
        title: "Erro",
        description: "Falha ao excluir template",
        variant: "destructive",
      });
    } finally {
      setTemplatesLoading(false);
    }
  };

  const handleImportTemplates = async () => {
    if (!campaign.id || !jsonTemplates.trim()) return;

    try {
      setTemplatesLoading(true);
      const templates = JSON.parse(jsonTemplates);
      
      if (!Array.isArray(templates)) {
        throw new Error("O JSON deve conter um array de templates");
      }

      await importTemplates(campaign.id, templates);
      
      toast({
        title: "Sucesso",
        description: `${templates.length} template(s) importado(s) com sucesso`,
      });
      
      setImportTemplatesDialog(false);
      setJsonTemplates('');
      await loadCampaignTemplates(campaign.id);
    } catch (error) {
      console.error("Erro ao importar templates:", error);
      toast({
        title: "Erro",
        description: error instanceof Error ? error.message : "Falha ao importar templates",
        variant: "destructive",
      });
    } finally {
      setTemplatesLoading(false);
    }
  };

  // Carregar templates quando a campanha for expandida
  useEffect(() => {
    if (isExpanded) {
      loadCampaignTemplates(campaign.id);
    }
  }, [isExpanded, campaign.id]);

  // Filtrar sessões disponíveis (não estão na campanha)
  const usedSessionIds = campaignSessions.map(cs => cs.sessionId || cs.id);
  const availableSessions = whatsappSessions.filter(
    session => !usedSessionIds.includes(session.id) && session.status === "CONNECTED"
  );

  const handleSave = async () => {
    try {
      setSaving(true);
      await updateCampaign(campaign.id, editData);
      toast({
        title: "Configurações salvas",
        description: "As configurações da campanha foram atualizadas com sucesso.",
      });
    } catch (error) {
      console.error('Erro ao salvar configurações:', error);
      toast({
        title: "Erro",
        description: "Não foi possível salvar as configurações.",
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  // Funções para gerenciar sessões
  const handleAddSessions = async () => {
    if (selectedNewSessions.length > 0 && onAddSessions) {
      setLoadingSessions(true);
      try {
        await onAddSessions(campaign.id, selectedNewSessions);
        setSelectedNewSessions([]);
        setShowAddSessionsDialog(false);
        
        // Atualizar as sessões automaticamente
        if (onRefreshSessions) {
          await onRefreshSessions(campaign.id);
        }
        
        toast({
          title: "Sessões adicionadas",
          description: `${selectedNewSessions.length} sessão(ões) adicionada(s) com sucesso.`,
        });
      } catch (error) {
        console.error('Erro ao adicionar sessões:', error);
        toast({
          title: "Erro",
          description: "Não foi possível adicionar as sessões.",
          variant: "destructive",
        });
      } finally {
        setLoadingSessions(false);
      }
    }
  };

  const handleRemoveSession = async (sessionId: string) => {
    if (onRemoveSession) {
      setLoadingSessions(true);
      try {
        await onRemoveSession(campaign.id, sessionId);
        
        // Atualizar as sessões automaticamente
        if (onRefreshSessions) {
          await onRefreshSessions(campaign.id);
        }
        
        toast({
          title: "Sessão removida",
          description: "Sessão removida da campanha com sucesso.",
        });
      } catch (error) {
        console.error('Erro ao remover sessão:', error);
        toast({
          title: "Erro",
          description: "Não foi possível remover a sessão.",
          variant: "destructive",
        });
      } finally {
        setLoadingSessions(false);
      }
    }
  };

  const handleRefreshSessions = async () => {
    if (onRefreshSessions) {
      setLoadingSessions(true);
      try {
        await onRefreshSessions(campaign.id);
        toast({
          title: "Sessões atualizadas",
          description: "Lista de sessões atualizada com sucesso.",
        });
      } catch (error) {
        console.error('Erro ao atualizar sessões:', error);
        toast({
          title: "Erro",
          description: "Não foi possível atualizar as sessões.",
          variant: "destructive",
        });
      } finally {
        setLoadingSessions(false);
      }
    }
  };

  return (
    <Card className={`hover:shadow-md transition-all duration-300 ${isExpanded ? 'shadow-lg' : ''}`}>
      {/* Header do card - sempre visível */}
      <CardHeader className="cursor-pointer" onClick={onToggleExpand}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className={`w-3 h-3 rounded-full ${getStatusColor(campaign.status || 'paused')}`} />
            <div>
              <CardTitle className="text-lg">{campaign.name}</CardTitle>
              {campaign.description && (
                <p className="text-sm text-muted-foreground">{campaign.description}</p>
              )}
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant={isActive ? "default" : isPaused ? "secondary" : "outline"}>
              {campaign.status === "active" ? "Ativo" : 
               campaign.status === "paused" ? "Pausado" : "Concluído"}
            </Badge>
            {isExpanded ? <ChevronRight className="h-4 w-4 rotate-90 transition-transform" /> : <ChevronRight className="h-4 w-4" />}
          </div>
        </div>
      </CardHeader>
      
      {/* Conteúdo básico - sempre visível */}
      <CardContent>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
          <div className="text-center">
            <div className="text-2xl font-bold">{campaign.campaignSessions?.length || 0}</div>
            <div className="text-xs text-muted-foreground">Sessões</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold">{campaign.dailyMessageGoal}</div>
            <div className="text-xs text-muted-foreground">Meta Diária</div>
          </div>
          <div className="text-center">
            <div className={`text-2xl font-bold ${getHealthColor(campaign.statistics?.averageHealthScore || 0)}`}>
              {campaign.statistics?.averageHealthScore || 0}%
            </div>
            <div className="text-xs text-muted-foreground">Saúde Média</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold">{campaign.statistics?.totalMessagesSent || 0}</div>
            <div className="text-xs text-muted-foreground">Mensagens Enviadas</div>
          </div>
        </div>

        {/* Botões de ação - sempre visíveis */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {isActive && (
              <Button
                size="sm"
                variant="outline"
                onClick={(e) => {
                  e.stopPropagation();
                  onAction("pause", campaign.id);
                }}
              >
                <Pause className="h-4 w-4 mr-1" />
                Pausar
              </Button>
            )}
            
            {isPaused && (
              <Button
                size="sm"
                variant="outline"
                onClick={(e) => {
                  e.stopPropagation();
                  onAction("resume", campaign.id);
                }}
              >
                <Play className="h-4 w-4 mr-1" />
                Retomar
              </Button>
            )}
          </div>

          <div className="flex items-center gap-2">
            <Button 
              size="sm" 
              variant="ghost" 
              onClick={(e) => {
                e.stopPropagation();
                onAction("delete", campaign.id);
              }}
              className="text-red-500 hover:text-red-700"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Conteúdo expandido - configurações da campanha */}
        {isExpanded && (
          <div className="mt-6 pt-6 border-t">
            <Tabs defaultValue="config" className="w-full">
              <TabsList className="grid w-full grid-cols-5">
                <TabsTrigger value="config" className="flex items-center gap-2">
                  <Settings className="h-4 w-4" />
                  Configurações
                </TabsTrigger>
                <TabsTrigger value="sessions" className="flex items-center gap-2">
                  <Phone className="h-4 w-4" />
                  Sessões ({campaignSessions.length})
                </TabsTrigger>
                <TabsTrigger value="contacts" className="flex items-center gap-2">
                  <Users className="h-4 w-4" />
                  Contatos
                </TabsTrigger>
                <TabsTrigger value="templates" className="flex items-center gap-2">
                  <MessageSquare className="h-4 w-4" />
                  Templates
                </TabsTrigger>
                <TabsTrigger value="health" className="flex items-center gap-2">
                  <Heart className="h-4 w-4" />
                  Saúde
                </TabsTrigger>
              </TabsList>

              <TabsContent value="config" className="space-y-6 mt-6">
                {/* Configurações Básicas */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Configurações Básicas</CardTitle>
                    <p className="text-sm text-muted-foreground">
                      Configure os parâmetros principais da campanha de aquecimento
                    </p>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid gap-4 md:grid-cols-2">
                      <div className="space-y-2">
                        <Label htmlFor="name">Nome da Campanha</Label>
                        <Input
                          id="name"
                          value={editData.name}
                          onChange={(e) => setEditData({ ...editData, name: e.target.value })}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="dailyGoal">Meta Diária de Mensagens</Label>
                        <Input
                          id="dailyGoal"
                          type="number"
                          min="1"
                          value={editData.dailyMessageGoal}
                          onChange={(e) => setEditData({ ...editData, dailyMessageGoal: parseInt(e.target.value) || 1 })}
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="description">Descrição</Label>
                      <Textarea
                        id="description"
                        value={editData.description}
                        onChange={(e) => setEditData({ ...editData, description: e.target.value })}
                        rows={3}
                      />
                    </div>
                  </CardContent>
                </Card>

                {/* Intervalos e Horários */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Intervalos e Horários</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid gap-4 md:grid-cols-2">
                      <div className="space-y-2">
                        <Label htmlFor="minInterval">Intervalo Mínimo (minutos)</Label>
                        <Input
                          id="minInterval"
                          type="number"
                          min="0"
                          value={editData.minIntervalMinutes}
                          onChange={(e) => setEditData({ ...editData, minIntervalMinutes: parseInt(e.target.value) || 0 })}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="maxInterval">Intervalo Máximo (minutos)</Label>
                        <Input
                          id="maxInterval"
                          type="number"
                          min="1"
                          value={editData.maxIntervalMinutes}
                          onChange={(e) => setEditData({ ...editData, maxIntervalMinutes: parseInt(e.target.value) || 1 })}
                        />
                      </div>
                    </div>

                    <div className="flex items-center space-x-2">
                      <Switch
                        id="useWorkingHours"
                        checked={editData.useWorkingHours}
                        onCheckedChange={(checked) => setEditData({ ...editData, useWorkingHours: checked })}
                      />
                      <Label htmlFor="useWorkingHours">Usar horário comercial</Label>
                    </div>

                    {editData.useWorkingHours && (
                      <div className="grid gap-4 md:grid-cols-2">
                        <div className="space-y-2">
                          <Label htmlFor="startTime">Horário de Início</Label>
                          <Input
                            id="startTime"
                            type="number"
                            min="0"
                            max="23"
                            value={editData.workingHourStart}
                            onChange={(e) => setEditData({ ...editData, workingHourStart: parseInt(e.target.value) || 0 })}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="endTime">Horário de Fim</Label>
                          <Input
                            id="endTime"
                            type="number"
                            min="0"
                            max="23"
                            value={editData.workingHourEnd}
                            onChange={(e) => setEditData({ ...editData, workingHourEnd: parseInt(e.target.value) || 0 })}
                          />
                        </div>
                      </div>
                    )}

                    <div className="flex items-center space-x-2">
                      <Switch
                        id="allowWeekends"
                        checked={editData.allowWeekends}
                        onCheckedChange={(checked) => setEditData({ ...editData, allowWeekends: checked })}
                      />
                      <Label htmlFor="allowWeekends">Permitir fins de semana</Label>
                    </div>

                    <div className="flex items-center space-x-2">
                      <Switch
                        id="randomizeInterval"
                        checked={editData.randomizeInterval}
                        onCheckedChange={(checked) => setEditData({ ...editData, randomizeInterval: checked })}
                      />
                      <Label htmlFor="randomizeInterval">Randomizar intervalos</Label>
                    </div>
                  </CardContent>
                </Card>

                {/* Conversas Internas */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Conversas Internas</CardTitle>
                    <p className="text-sm text-muted-foreground">
                      Configure conversas automáticas entre as sessões da campanha
                    </p>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center space-x-2">
                      <Switch
                        id="enableInternal"
                        checked={editData.enableInternalConversations}
                        onCheckedChange={(checked) => setEditData({ ...editData, enableInternalConversations: checked })}
                      />
                      <Label htmlFor="enableInternal">Habilitar conversas internas</Label>
                    </div>

                    {editData.enableInternalConversations && (
                      <div className="space-y-2">
                        <Label htmlFor="internalRatio">Proporção de conversas internas ({Math.round(editData.internalConversationRatio * 100)}%)</Label>
                        <Slider
                          id="internalRatio"
                          min={0}
                          max={1}
                          step={0.1}
                          value={[editData.internalConversationRatio]}
                          onValueChange={(value) => setEditData({ ...editData, internalConversationRatio: value[0] })}
                        />
                      </div>
                    )}
                  </CardContent>
                </Card>

                {/* Pausas Automáticas */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Pausas Automáticas</CardTitle>
                    <p className="text-sm text-muted-foreground">
                      Configure pausas automáticas baseadas no tempo de conversa
                    </p>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center space-x-2">
                      <Switch
                        id="enableAutoPauses"
                        checked={editData.enableAutoPauses}
                        onCheckedChange={(checked) => setEditData({ ...editData, enableAutoPauses: checked })}
                      />
                      <Label htmlFor="enableAutoPauses">Habilitar pausas automáticas</Label>
                    </div>

                    {editData.enableAutoPauses && (
                      <div className="grid gap-4 md:grid-cols-2">
                        <div className="space-y-2">
                          <Label htmlFor="maxPauseTime">Tempo máximo de pausa (minutos)</Label>
                          <Input
                            id="maxPauseTime"
                            type="number"
                            min="1"
                            value={editData.maxPauseTimeMinutes}
                            onChange={(e) => setEditData({ ...editData, maxPauseTimeMinutes: parseInt(e.target.value) || 45 })}
                          />
                          <p className="text-xs text-muted-foreground">
                            Tempo máximo que a sessão ficará pausada
                          </p>
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="minConversationTime">Tempo mínimo de conversa (minutos)</Label>
                          <Input
                            id="minConversationTime"
                            type="number"
                            min="1"
                            value={editData.minConversationTimeMinutes}
                            onChange={(e) => setEditData({ ...editData, minConversationTimeMinutes: parseInt(e.target.value) || 30 })}
                          />
                          <p className="text-xs text-muted-foreground">
                            Tempo mínimo de conversa antes de pausar
                          </p>
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>

                {/* Auto-Read de Mensagens */}
                <SessionAutoReadCard campaignId={campaign.id} />

                {/* Botão de salvar */}
                <div className="flex justify-end">
                  <Button onClick={handleSave} disabled={saving}>
                    {saving ? (
                      <>
                        <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                        Salvando...
                      </>
                    ) : (
                      <>
                        <Save className="h-4 w-4 mr-2" />
                        Salvar Configurações
                      </>
                    )}
                  </Button>
                </div>
              </TabsContent>

              <TabsContent value="sessions" className="space-y-6 mt-6">
                {/* Gerenciamento de Sessões */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-lg font-semibold">Sessões WhatsApp</h3>
                      <p className="text-sm text-muted-foreground">
                        {campaignSessions.length} sessão(ões) configurada(s) nesta campanha
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={handleRefreshSessions}
                        disabled={loadingSessions}
                      >
                        <RefreshCw className={`h-4 w-4 mr-2 ${loadingSessions ? 'animate-spin' : ''}`} />
                        Atualizar
                      </Button>
                        <Button 
                          size="sm" 
                          onClick={() => setShowAddSessionsDialog(true)}
                          disabled={loadingSessions}
                        >
                          <Plus className="h-4 w-4 mr-2" />
                          Adicionar Sessões ({availableSessions.length})
                        </Button>
                    </div>
                  </div>

                  {/* Lista de sessões atuais */}
                  <div className="grid gap-3">
                    {campaignSessions.map((campaignSession) => {
                      const session = whatsappSessions.find(s => s.id === (campaignSession.sessionId || campaignSession.id));
                      const isConnected = session?.status === "CONNECTED";
                      const healthScore = campaignSession.healthScore || 0;
                      
                      return (
                        <div key={campaignSession.id || campaignSession.sessionId} 
                             className={`flex items-center justify-between p-4 border rounded-lg transition-all hover:shadow-sm ${
                               isConnected ? 'border-green-200 bg-green-50/50' : 'border-gray-200 bg-gray-50/50'
                             }`}>
                          <div className="flex items-center space-x-3">
                            <div className={`w-3 h-3 rounded-full ${
                              isConnected ? "bg-green-500 animate-pulse" : "bg-gray-400"
                            }`} />
                            <div>
                              <div className="font-medium flex items-center gap-2">
                                {session?.name || campaignSession.sessionId}
                                {isConnected && (
                                  <Badge variant="default" className="text-xs bg-green-500">
                                    Online
                                  </Badge>
                                )}
                              </div>
                              <div className="text-sm text-muted-foreground">
                                {session?.phone || "Telefone não disponível"}
                              </div>
                              <div className="flex items-center gap-2 mt-1">
                                <Badge variant={isConnected ? "default" : "secondary"} className="text-xs">
                                  {session?.status || "UNKNOWN"}
                                </Badge>
                                <Badge variant="outline" className="text-xs">
                                  {session?.type || "N/A"}
                                </Badge>
                                {healthScore > 0 && (
                                  <Badge variant="outline" className={`text-xs ${getHealthColor(healthScore)}`}>
                                    {healthScore}% saúde
                                  </Badge>
                                )}
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center gap-4">
                            <div className="text-right text-sm">
                              <div className="font-medium">
                                Score: <span className={getHealthColor(healthScore)}>
                                  {healthScore}%
                                </span>
                              </div>
                              <div className="text-muted-foreground">
                                {campaignSession.dailyMessagesSent || 0} msgs hoje
                              </div>
                              <div className="text-xs text-muted-foreground">
                                {campaignSession.totalMessagesSent || 0} total
                              </div>
                            </div>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleRemoveSession(campaignSession.sessionId || campaignSession.id)}
                              className="text-red-600 hover:text-red-700 hover:border-red-300"
                              disabled={loadingSessions}
                              title="Remover sessão da campanha"
                            >
                              {loadingSessions ? (
                                <RefreshCw className="h-4 w-4 animate-spin" />
                              ) : (
                                <Trash2 className="h-4 w-4" />
                              )}
                            </Button>
                          </div>
                        </div>
                      );
                    })}
                    
                    {campaignSessions.length === 0 && (
                      <div className="text-center py-8 text-muted-foreground border-2 border-dashed rounded-lg">
                        <Phone className="h-8 w-8 mx-auto mb-2 opacity-50" />
                        <p>Nenhuma sessão configurada</p>
                        <p className="text-xs mt-1">Adicione sessões WhatsApp para começar o aquecimento</p>
                        {availableSessions.length > 0 && (
                          <Button 
                            size="sm" 
                            className="mt-3"
                            onClick={() => setShowAddSessionsDialog(true)}
                          >
                            <Plus className="h-4 w-4 mr-2" />
                            Adicionar Primeira Sessão
                          </Button>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Dialog para adicionar sessões */}
                  <Dialog open={showAddSessionsDialog} onOpenChange={setShowAddSessionsDialog}>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Adicionar Sessões à Campanha</DialogTitle>
                      </DialogHeader>
                      <div className="space-y-4">
                        <p className="text-sm text-muted-foreground">
                          Selecione as sessões WhatsApp que deseja adicionar a esta campanha:
                        </p>
                        
                        {availableSessions.length === 0 ? (
                          <div className="text-center py-8 text-muted-foreground">
                            <Phone className="h-8 w-8 mx-auto mb-2 opacity-50" />
                            <p className="font-medium">Nenhuma sessão disponível</p>
                            <p className="text-xs mt-1">Todas as sessões conectadas já estão sendo usadas nesta campanha</p>
                            <p className="text-xs mt-1">Conecte novas sessões WhatsApp ou remova sessões de outras campanhas</p>
                          </div>
                        ) : (
                          <div className="grid gap-3 max-h-64 overflow-y-auto">
                            {availableSessions.map((session) => (
                              <div key={session.id} className="flex items-center space-x-3 p-3 border rounded-lg">
                                <input
                                  type="checkbox"
                                  id={`add-session-${session.id}`}
                                  checked={selectedNewSessions.includes(session.id)}
                                  onChange={(e) => {
                                    const newSelected = e.target.checked
                                      ? [...selectedNewSessions, session.id]
                                      : selectedNewSessions.filter(id => id !== session.id);
                                    setSelectedNewSessions(newSelected);
                                  }}
                                  className="rounded"
                                />
                                <label htmlFor={`add-session-${session.id}`} className="flex-1 cursor-pointer">
                                  <div className="font-medium">{session.name}</div>
                                  <div className="text-sm text-muted-foreground">
                                    {session.phone || session.sessionId}
                                  </div>
                                  <div className="flex items-center gap-2 mt-1">
                                    <Badge variant="default" className="text-xs">
                                      {session.status}
                                    </Badge>
                                    <Badge variant="outline" className="text-xs">
                                      {session.type}
                                    </Badge>
                                  </div>
                                </label>
                              </div>
                            ))}
                          </div>
                        )}
                        
                        <div className="flex justify-end gap-2">
                          <Button variant="outline" onClick={() => {
                            setShowAddSessionsDialog(false);
                            setSelectedNewSessions([]);
                          }}>
                            Cancelar
                          </Button>
                          <Button 
                            onClick={handleAddSessions}
                            disabled={selectedNewSessions.length === 0 || loadingSessions}
                          >
                            {loadingSessions ? (
                              <>
                                <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                                Adicionando...
                              </>
                            ) : (
                              <>
                                Adicionar {selectedNewSessions.length} Sessão(ões)
                              </>
                            )}
                          </Button>
                        </div>
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>
              </TabsContent>

              <TabsContent value="contacts" className="space-y-6 mt-6">
                <CampaignContactsManager 
                  campaign={campaign} 
                  onContactsUpdated={() => {
                    // Atualizar contatos se necessário
                  }}
                />
              </TabsContent>

              <TabsContent value="templates" className="space-y-6 mt-6">
                {/* Cabeçalho dos Templates */}
                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="text-lg font-semibold">Templates de Mensagem</h3>
                    <p className="text-sm text-muted-foreground">
                      {showAllTemplates 
                        ? "Mostrando todos os templates da campanha" 
                        : "Mostrando os últimos 3 templates para melhor performance"
                      }
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setImportTemplatesDialog(true)}
                      disabled={templatesLoading}
                    >
                      <Upload className="h-4 w-4 mr-2" />
                      Importar JSON
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        if (campaign.id) {
                          loadCampaignMedia(campaign.id.toString());
                          setMediaDialog(true);
                        }
                      }}
                      disabled={templatesLoading}
                    >
                      <FileImage className="h-4 w-4 mr-2" />
                      Gerenciar Mídia
                    </Button>
                    <Button
                      size="sm"
                      onClick={() => {
                        setNewTemplate({
                          name: '',
                          content: '',
                          messageType: 'text',
                          weight: 1,
                          isActive: true,
                          mediaUrl: '',
                          file: null
                        });
                        setEditingTemplate(null);
                        setTemplateDialog(true);
                      }}
                      disabled={templatesLoading}
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Novo Template
                    </Button>
                  </div>
                </div>

                {/* Lista de Templates */}
                <div className="border rounded-lg overflow-hidden">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Nome</TableHead>
                        <TableHead>Tipo</TableHead>
                        <TableHead>Peso</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Conteúdo</TableHead>
                        <TableHead className="text-right">Ações</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {templatesLoading ? (
                        <TableRow>
                          <TableCell colSpan={6} className="text-center py-8">
                            <div className="flex items-center justify-center">
                              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary mr-2"></div>
                              Carregando templates...
                            </div>
                          </TableCell>
                        </TableRow>
                      ) : templates.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                            Nenhum template encontrado. Crie seu primeiro template!
                          </TableCell>
                        </TableRow>
                      ) : (
                        templates.map((template) => (
                          <TableRow key={template.id}>
                            <TableCell className="font-medium">{template.name}</TableCell>
                            <TableCell>
                              <Badge variant="outline" className="capitalize">
                                {template.messageType}
                              </Badge>
                            </TableCell>
                            <TableCell>{template.weight}</TableCell>
                            <TableCell>
                              <Badge variant={template.isActive ? "default" : "secondary"}>
                                {template.isActive ? "Ativo" : "Inativo"}
                              </Badge>
                            </TableCell>
                            <TableCell className="max-w-xs truncate" title={template.content}>
                              {template.content.length > 50 
                                ? `${template.content.substring(0, 50)}...` 
                                : template.content
                              }
                            </TableCell>
                            <TableCell className="text-right">
                              <div className="flex gap-1 justify-end">
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => {
                                    setNewTemplate({
                                      name: template.name,
                                      content: template.content,
                                      messageType: template.messageType,
                                      weight: template.weight,
                                      isActive: template.isActive,
                                      mediaUrl: template.mediaUrl || '',
                                      file: null
                                    });
                                    setEditingTemplate(template);
                                    setTemplateDialog(true);
                                  }}
                                  disabled={templatesLoading}
                                >
                                  <Edit className="h-4 w-4" />
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => handleDeleteTemplate(template.id)}
                                  disabled={templatesLoading}
                                  className="text-destructive hover:text-destructive"
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </div>
                            </TableCell>
                          </TableRow>
                        ))
                      )}
                    </TableBody>
                  </Table>
                </div>

                {/* Botão para carregar todos os templates */}
                {!showAllTemplates && (
                  <div className="flex justify-center pt-4">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={toggleShowAllTemplates}
                      disabled={templatesLoading}
                      className="gap-2"
                    >
                      <RefreshCw className="h-4 w-4" />
                      Ver todos os templates
                    </Button>
                  </div>
                )}

                {showAllTemplates && (
                  <div className="flex justify-center pt-4">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={toggleShowAllTemplates}
                      disabled={templatesLoading}
                      className="gap-2"
                    >
                      <RefreshCw className="h-4 w-4" />
                      Mostrar apenas os últimos 3
                    </Button>
                  </div>
                )}

                {/* Dialog para Criar/Editar Template */}
                <Dialog open={templateDialog} onOpenChange={setTemplateDialog}>
                  <DialogContent className="max-w-2xl">
                    <DialogHeader>
                      <DialogTitle>
                        {editingTemplate ? "Editar Template" : "Novo Template"}
                      </DialogTitle>
                      <DialogDescription>
                        {editingTemplate 
                          ? "Edite as informações do template de mensagem."
                          : "Crie um novo template de mensagem para a campanha."
                        }
                      </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="template-name">Nome</Label>
                          <Input
                            id="template-name"
                            placeholder="Nome do template"
                            value={newTemplate.name}
                            onChange={(e) => setNewTemplate(prev => ({ ...prev, name: e.target.value }))}
                          />
                        </div>
                        <div>
                          <Label htmlFor="template-type">Tipo de Mensagem</Label>
                          <Select
                            value={newTemplate.messageType}
                            onValueChange={(value: "text" | "image" | "audio" | "video" | "document") => 
                              setNewTemplate(prev => ({ ...prev, messageType: value }))
                            }
                          >
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="text">Texto</SelectItem>
                              <SelectItem value="image">Imagem</SelectItem>
                              <SelectItem value="audio">Áudio</SelectItem>
                              <SelectItem value="video">Vídeo</SelectItem>
                              <SelectItem value="document">Documento</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="template-weight">Peso (1-10)</Label>
                          <Input
                            id="template-weight"
                            type="number"
                            min="1"
                            max="10"
                            value={newTemplate.weight}
                            onChange={(e) => setNewTemplate(prev => ({ ...prev, weight: parseInt(e.target.value) || 1 }))}
                          />
                        </div>
                        <div className="flex items-center space-x-2 pt-6">
                          <Switch
                            id="template-active"
                            checked={newTemplate.isActive}
                            onCheckedChange={(checked) => setNewTemplate(prev => ({ ...prev, isActive: checked }))}
                          />
                          <Label htmlFor="template-active">Template ativo</Label>
                        </div>
                      </div>

                      {newTemplate.messageType !== 'text' && (
                        <div className="space-y-4">
                          <div>
                            <Label>Mídia</Label>
                            <Tabs defaultValue="upload" className="w-full">
                              <TabsList className="grid w-full grid-cols-2">
                                <TabsTrigger value="upload">Upload de Arquivo</TabsTrigger>
                                <TabsTrigger value="url">URL da Mídia</TabsTrigger>
                              </TabsList>
                              
                              <TabsContent value="upload" className="space-y-2">
                                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                                  <input
                                    type="file"
                                    id="file-upload"
                                    className="hidden"
                                    accept={getAcceptedFileTypes(newTemplate.messageType)}
                                    onChange={(e) => {
                                      const file = e.target.files?.[0];
                                      if (file) {
                                        setNewTemplate(prev => ({ ...prev, file, mediaUrl: '' }));
                                      }
                                    }}
                                  />
                                  <label
                                    htmlFor="file-upload"
                                    className="cursor-pointer flex flex-col items-center space-y-2"
                                  >
                                    <Upload className="h-8 w-8 text-gray-400" />
                                    {newTemplate.file ? (
                                      <div>
                                        <p className="text-sm font-medium text-green-600">{newTemplate.file.name}</p>
                                        <p className="text-xs text-gray-500">
                                          {(newTemplate.file.size / 1024 / 1024).toFixed(2)} MB
                                        </p>
                                      </div>
                                    ) : (
                                      <div>
                                        <p className="text-sm font-medium">Clique para fazer upload</p>
                                        <p className="text-xs text-gray-500">
                                          {getFileTypeDescription(newTemplate.messageType)}
                                        </p>
                                      </div>
                                    )}
                                  </label>
                                </div>
                                {newTemplate.file && (
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => setNewTemplate(prev => ({ ...prev, file: null }))}
                                    className="w-full"
                                  >
                                    <Trash2 className="h-4 w-4 mr-2" />
                                    Remover Arquivo
                                  </Button>
                                )}
                              </TabsContent>
                              
                              <TabsContent value="url" className="space-y-2">
                                <Input
                                  placeholder="URL do arquivo de mídia"
                                  value={newTemplate.mediaUrl}
                                  onChange={(e) => setNewTemplate(prev => ({ ...prev, mediaUrl: e.target.value, file: null }))}
                                />
                                <p className="text-xs text-gray-500">
                                  Cole a URL de um arquivo hospedado online
                                </p>
                              </TabsContent>
                            </Tabs>
                          </div>
                        </div>
                      )}

                      <div>
                        <Label htmlFor="template-content">Conteúdo da Mensagem</Label>
                        <Textarea
                          id="template-content"
                          placeholder="Digite o conteúdo da mensagem..."
                          value={newTemplate.content}
                          onChange={(e) => setNewTemplate(prev => ({ ...prev, content: e.target.value }))}
                          rows={4}
                        />
                      </div>
                    </div>
                    <DialogFooter>
                      <Button variant="outline" onClick={() => setTemplateDialog(false)}>
                        Cancelar
                      </Button>
                      <Button
                        onClick={editingTemplate ? handleUpdateTemplate : handleCreateTemplate}
                        disabled={templatesLoading || !newTemplate.name || !newTemplate.content}
                      >
                        {templatesLoading ? (
                          <>
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                            {editingTemplate ? "Atualizando..." : "Criando..."}
                          </>
                        ) : (
                          editingTemplate ? "Atualizar Template" : "Criar Template"
                        )}
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>

                {/* Dialog para Importar Templates JSON */}
                <Dialog open={importTemplatesDialog} onOpenChange={setImportTemplatesDialog}>
                  <DialogContent className="max-w-2xl max-h-[80vh] overflow-hidden flex flex-col">
                    <DialogHeader className="flex-shrink-0">
                      <DialogTitle>Importar Templates JSON</DialogTitle>
                      <DialogDescription>
                        Cole o JSON com os templates que deseja importar para a campanha.
                      </DialogDescription>
                    </DialogHeader>
                    <div className="flex-1 overflow-auto space-y-4 pr-2">
                      <div>
                        <Label htmlFor="json-templates">JSON dos Templates</Label>
                        <Textarea
                          id="json-templates"
                          placeholder='[{"name": "Template 1", "content": "Olá!", "messageType": "text", "weight": 1, "isActive": true}]'
                          value={jsonTemplates}
                          onChange={(e) => setJsonTemplates(e.target.value)}
                          rows={12}
                          className="min-h-[300px] resize-none"
                        />
                        <p className="text-xs text-muted-foreground mt-2">
                          Exemplo de formato JSON válido:
                        </p>
                        <pre className="text-xs bg-muted p-3 rounded mt-1 overflow-auto max-h-32">
{`[
  {
    "name": "Saudação Amigável",
    "content": "Olá! Como você está?",
    "messageType": "text",
    "weight": 1,
    "isActive": true
  },
  {
    "name": "Template com Mídia",
    "content": "Confira esta imagem!",
    "messageType": "image",
    "mediaUrl": "https://exemplo.com/imagem.jpg",
    "weight": 2,
    "isActive": true
  }
]`}
                        </pre>
                      </div>
                    </div>
                    <DialogFooter className="flex-shrink-0 mt-4">
                      <Button variant="outline" onClick={() => setImportTemplatesDialog(false)}>
                        Cancelar
                      </Button>
                      <Button
                        onClick={handleImportTemplates}
                        disabled={templatesLoading || !jsonTemplates.trim()}
                      >
                        {templatesLoading ? (
                          <>
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                            Importando...
                          </>
                        ) : (
                          "Importar Templates"
                        )}
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>

                {/* Dialog para Gerenciar Mídia */}
                <Dialog open={mediaDialog} onOpenChange={setMediaDialog}>
                  <DialogContent className="max-w-4xl">
                    <DialogHeader>
                      <DialogTitle>Gerenciar Arquivos de Mídia</DialogTitle>
                      <DialogDescription>
                        Visualize e gerencie os arquivos de mídia da campanha
                      </DialogDescription>
                    </DialogHeader>
                    
                    <div className="space-y-4">
                      {mediaLoading ? (
                        <div className="flex items-center justify-center py-8">
                          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mr-2"></div>
                          <span>Carregando arquivos...</span>
                        </div>
                      ) : mediaFiles.length === 0 ? (
                        <div className="text-center py-8 text-muted-foreground">
                          <FileImage className="h-12 w-12 mx-auto mb-2 opacity-50" />
                          <p>Nenhum arquivo de mídia encontrado</p>
                          <p className="text-sm">Os arquivos aparecerão aqui quando você criar templates com mídia</p>
                        </div>
                      ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                          {mediaFiles.map((media) => (
                            <div key={media.id} className="border rounded-lg p-4 space-y-3">
                              <div className="flex items-center gap-2">
                                <span className="text-2xl">{getFileIcon(media.mimeType)}</span>
                                <div className="flex-1 min-w-0">
                                  <p className="font-medium text-sm truncate">{media.fileName}</p>
                                  <p className="text-xs text-muted-foreground">{formatFileSize(media.fileSize)}</p>
                                </div>
                              </div>
                              
                              <div className="text-xs space-y-1">
                                <p><span className="font-medium">Tipo:</span> {media.fileType}</p>
                                <p><span className="font-medium">MIME:</span> {media.mimeType}</p>
                                <p><span className="font-medium">Criado:</span> {new Date(media.createdAt).toLocaleDateString()}</p>
                              </div>

                              {media.templates && media.templates.length > 0 && (
                                <div className="text-xs">
                                  <p className="font-medium mb-1">Usado em {media.templates.length} template(s):</p>
                                  <div className="space-y-1">
                                    {media.templates.map((template, idx) => (
                                      <p key={idx} className="text-muted-foreground truncate">
                                        • {template.content.substring(0, 30)}...
                                      </p>
                                    ))}
                                  </div>
                                </div>
                              )}

                              <div className="flex gap-2">
                                <Button
                                  variant="outline"
                                  size="sm"
                                  className="flex-1"
                                  onClick={() => window.open(media.filePath, '_blank')}
                                >
                                  <Eye className="h-3 w-3 mr-1" />
                                  Ver
                                </Button>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  className="text-red-600 hover:text-red-700 hover:bg-red-50"
                                  onClick={() => {
                                    if (campaign.id && window.confirm('Tem certeza que deseja excluir este arquivo? Esta ação não pode ser desfeita.')) {
                                      handleDeleteMedia(campaign.id.toString(), media.id);
                                    }
                                  }}
                                >
                                  <Trash2 className="h-3 w-3" />
                                </Button>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>

                    <DialogFooter>
                      <Button variant="outline" onClick={() => setMediaDialog(false)}>
                        Fechar
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </TabsContent>

              <TabsContent value="health" className="space-y-6 mt-6">
                {/* Indicadores de Saúde */}
                <div className="space-y-4">
                  <div>
                    <h3 className="text-lg font-semibold">Saúde das Sessões</h3>
                    <p className="text-sm text-muted-foreground">
                      Monitoramento da saúde e performance das sessões na campanha
                    </p>
                  </div>

                  <div className="grid gap-4">
                    {campaignSessions.map((campaignSession) => {
                      const session = whatsappSessions.find(s => s.id === (campaignSession.sessionId || campaignSession.id));
                      const healthScore = campaignSession.healthScore || 0;
                      
                      return (
                        <Card key={campaignSession.id || campaignSession.sessionId}>
                          <CardContent className="p-4">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center space-x-3">
                                <div className={`w-3 h-3 rounded-full ${
                                  session?.status === "CONNECTED" ? "bg-green-500" : "bg-gray-400"
                                }`} />
                                <div>
                                  <div className="font-medium">{session?.name || campaignSession.sessionId}</div>
                                  <div className="text-sm text-muted-foreground">
                                    {session?.phone || "Telefone não disponível"}
                                  </div>
                                </div>
                              </div>
                              <div className="text-right">
                                <div className={`text-2xl font-bold ${getHealthColor(healthScore)}`}>
                                  {healthScore}%
                                </div>
                                <div className="text-xs text-muted-foreground">Score de Saúde</div>
                              </div>
                            </div>
                            
                            <div className="mt-4">
                              <Progress value={healthScore} className="h-2" />
                            </div>
                            
                            <div className="grid grid-cols-3 gap-4 mt-4 text-center">
                              <div>
                                <div className="text-lg font-semibold">{campaignSession.dailyMessagesSent || 0}</div>
                                <div className="text-xs text-muted-foreground">Msgs Hoje</div>
                              </div>
                              <div>
                                <div className="text-lg font-semibold">{campaignSession.totalMessagesSent || 0}</div>
                                <div className="text-xs text-muted-foreground">Total Enviadas</div>
                              </div>
                              <div>
                                <div className="text-lg font-semibold text-green-600">{campaignSession.deliveryRate || 0}%</div>
                                <div className="text-xs text-muted-foreground">Taxa Entrega</div>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      );
                    })}
                    
                    {campaignSessions.length === 0 && (
                      <div className="text-center py-8 text-muted-foreground">
                        <Heart className="h-8 w-8 mx-auto mb-2 opacity-50" />
                        <p>Nenhuma sessão para monitorar</p>
                        <p className="text-xs mt-1">Adicione sessões para ver informações de saúde</p>
                      </div>
                    )}
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

// Componente de Estatísticas da Campanha
function CampaignStats({ campaignId, period }: { campaignId: string; period: string }) {
  const [stats, setStats] = useState<CampaignStatistics | null>(null);
  const [internalStats, setInternalStats] = useState<InternalConversationStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadStats();
  }, [campaignId, period]);

  const loadStats = async () => {
    try {
      setLoading(true);
      const [statsData, internalData] = await Promise.all([
        getCampaignStatistics(campaignId, period),
        getInternalConversations(campaignId, period)
      ]);
      setStats(statsData);
      setInternalStats(internalData);
    } catch (error) {
      console.error("Erro ao carregar estatísticas:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <RefreshCw className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (!stats) return null;

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold">{stats.totalMessagesSent || 0}</div>
            <div className="text-sm text-muted-foreground">Total Enviadas</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-green-600">{stats.messagesDelivered || 0}</div>
            <div className="text-sm text-muted-foreground">Entregues</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-red-600">{stats.messagesFailed || 0}</div>
            <div className="text-sm text-muted-foreground">Falharam</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold">{(stats.deliveryRate || 0).toFixed(1)}%</div>
            <div className="text-sm text-muted-foreground">Taxa de Entrega</div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardHeader>
            <CardTitle>Conversas por Tipo</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span>Externas:</span>
                <span className="font-bold">{stats.externalConversations || 0}</span>
              </div>
              <div className="flex justify-between">
                <span>Internas:</span>
                <span className="font-bold">{stats.internalConversations || 0}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Sessões</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span>Ativas:</span>
                <span className="font-bold text-green-600">{stats.activeSessions || 0}</span>
              </div>
              <div className="flex justify-between">
                <span>Total:</span>
                <span className="font-bold">{stats.totalSessions || 0}</span>
              </div>
              <div className="flex justify-between">
                <span>Saúde Média:</span>
                <span className={`font-bold ${getHealthColor(stats.averageHealthScore || 100)}`}>
                  {Math.round(stats.averageHealthScore || 100)}%
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {internalStats && (
        <Card>
          <CardHeader>
            <CardTitle>Conversas Internas Detalhadas</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="grid grid-cols-3 gap-4 text-center">
                <div>
                  <div className="text-2xl font-bold">{internalStats.totalConversations || 0}</div>
                  <div className="text-sm text-muted-foreground">Total de Conversas</div>
                </div>
                <div>
                  <div className="text-2xl font-bold">{internalStats.messagesSent || 0}</div>
                  <div className="text-sm text-muted-foreground">Mensagens Internas</div>
                </div>
                <div>
                  <div className="text-2xl font-bold">{(internalStats.averageMessagesPerConversation || 0).toFixed(1)}</div>
                  <div className="text-sm text-muted-foreground">Média por Conversa</div>
                </div>
              </div>

              {internalStats.sessionPairs && internalStats.sessionPairs.length > 0 && (
                <div>
                  <h4 className="font-semibold mb-2">Pares de Sessões Mais Ativos</h4>
                  <div className="space-y-2">
                    {(internalStats.sessionPairs || []).slice(0, 5).map((pair, index) => (
                      <div key={index} className="flex justify-between items-center p-2 bg-muted rounded">
                        <span className="text-sm">{pair.fromSession} → {pair.toSession}</span>
                        <span className="font-bold">{pair.messageCount || 0} msgs</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

// Componente de Histórico de Execuções
function ExecutionHistory({ campaignId }: { campaignId: string }) {
  const [executions, setExecutions] = useState<Execution[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    status: "all",
    executionType: "all",
    page: 1,
    limit: 50
  });

  useEffect(() => {
    loadExecutions();
  }, [campaignId, filters]);

  const loadExecutions = async () => {
    try {
      setLoading(true);
      const params = {
        ...filters,
        status: filters.status === "all" ? undefined : filters.status,
        executionType: filters.executionType === "all" ? undefined : filters.executionType,
      };
      const data = await getCampaignExecutions(campaignId, params);
      setExecutions(data.data || []);
    } catch (error) {
      console.error("Erro ao carregar execuções:", error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "sent":
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case "delivered":
        return <CheckCircle className="h-4 w-4 text-blue-500" />;
      case "failed":
        return <AlertTriangle className="h-4 w-4 text-red-500" />;
      default:
        return <Clock className="h-4 w-4 text-yellow-500" />;
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <RefreshCw className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Filtros */}
      <div className="flex gap-4">
        <Select
          value={filters.status}
          onValueChange={(value) => setFilters({ ...filters, status: value })}
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos</SelectItem>
            <SelectItem value="scheduled">Agendado</SelectItem>
            <SelectItem value="sent">Enviado</SelectItem>
            <SelectItem value="delivered">Entregue</SelectItem>
            <SelectItem value="failed">Falhou</SelectItem>
          </SelectContent>
        </Select>

        <Select
          value={filters.executionType}
          onValueChange={(value) => setFilters({ ...filters, executionType: value })}
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Tipo" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos</SelectItem>
            <SelectItem value="internal">Interno</SelectItem>
            <SelectItem value="external">Externo</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Tabela de Execuções */}
      <ScrollArea className="h-[500px]">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Data/Hora</TableHead>
              <TableHead>Tipo</TableHead>
              <TableHead>De</TableHead>
              <TableHead>Para</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Mensagem</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {executions.map((execution) => (
              <TableRow key={execution.id}>
                <TableCell>
                  {new Date(execution.createdAt).toLocaleString("pt-BR")}
                </TableCell>
                <TableCell>
                  <Badge variant={execution.executionType === "internal" ? "secondary" : "outline"}>
                    {execution.executionType === "internal" ? "Interno" : "Externo"}
                  </Badge>
                </TableCell>
                <TableCell className="font-medium">
                  {execution.fromSessionId}
                </TableCell>
                <TableCell>
                  {execution.toSessionId || execution.toContactId || "N/A"}
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    {getStatusIcon(execution.status)}
                    <span className="capitalize">{execution.status}</span>
                  </div>
                </TableCell>
                <TableCell className="max-w-[300px] truncate">
                  {execution.messageContent}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </ScrollArea>
    </div>
  );
}

function getStatusColor(status: string) {
  switch (status) {
    case "active":
      return "bg-green-500";
    case "paused":
      return "bg-yellow-500";
    case "completed":
      return "bg-blue-500";
    default:
      return "bg-gray-500";
  }
}

function getHealthColor(health: number) {
  if (health >= 80) return "text-green-500";
  if (health >= 60) return "text-yellow-500";
  return "text-red-500";
}

// Componente para gerenciar sessões de uma campanha existente
function CampaignSessionsManager({
  campaign,
  campaignSessions,
  whatsappSessions,
  onAddSessions,
  onRemoveSession,
  onRefresh
}: {
  campaign: Campaign;
  campaignSessions: any[];
  whatsappSessions: WhatsAppSession[];
  onAddSessions: (sessionIds: string[]) => void;
  onRemoveSession: (sessionId: string) => void;
  onRefresh: () => void;
}) {
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [selectedNewSessions, setSelectedNewSessions] = useState<string[]>([]);

  const usedSessionIds = campaignSessions.map(cs => cs.sessionId);
  const availableSessions = whatsappSessions.filter(
    session => !usedSessionIds.includes(session.id) && session.status === "CONNECTED"
  );

  const handleAddSessions = () => {
    if (selectedNewSessions.length > 0) {
      onAddSessions(selectedNewSessions);
      setSelectedNewSessions([]);
      setShowAddDialog(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold">Sessões da Campanha</h3>
          <p className="text-sm text-muted-foreground">
            {campaignSessions.length} sessão(ões) configurada(s)
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={onRefresh}>
            <RefreshCw className="h-4 w-4 mr-2" />
            Atualizar
          </Button>
          {availableSessions.length < 0 && (
            <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
              <DialogTrigger asChild>
                <Button size="sm">
                  <Plus className="h-4 w-4 mr-2" />
                  Adicionar Sessões
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Adicionar Sessões à Campanha</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <p className="text-sm text-muted-foreground">
                    Selecione as sessões WhatsApp que deseja adicionar a esta campanha:
                  </p>
                  <div className="grid gap-3 max-h-64 overflow-y-auto">
                    {availableSessions.map((session) => (
                      <div key={session.id} className="flex items-center space-x-3 p-3 border rounded-lg">
                        <input
                          type="checkbox"
                          id={`add-session-${session.id}`}
                          checked={selectedNewSessions.includes(session.id)}
                          onChange={(e) => {
                            const newSelected = e.target.checked
                              ? [...selectedNewSessions, session.id]
                              : selectedNewSessions.filter(id => id !== session.id);
                            setSelectedNewSessions(newSelected);
                          }}
                          className="rounded"
                        />
                        <label htmlFor={`add-session-${session.id}`} className="flex-1 cursor-pointer">
                          <div className="font-medium">{session.name}</div>
                          <div className="text-sm text-muted-foreground">
                            {session.phone || session.sessionId}
                          </div>
                          <div className="flex items-center gap-2 mt-1">
                            <Badge variant="default" className="text-xs">
                              {session.status}
                            </Badge>
                            <Badge variant="outline" className="text-xs">
                              {session.type}
                            </Badge>
                          </div>
                        </label>
                      </div>
                    ))}
                  </div>
                  <div className="flex justify-end gap-2">
                    <Button variant="outline" onClick={() => setShowAddDialog(false)}>
                      Cancelar
                    </Button>
                    <Button 
                      onClick={handleAddSessions}
                      disabled={selectedNewSessions.length === 0}
                    >
                      Adicionar {selectedNewSessions.length} Sessão(ões)
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          )}
        </div>
      </div>

      {/* Lista de sessões atuais */}
      <div className="grid gap-3">
        {campaignSessions.map((campaignSession) => {
          const session = whatsappSessions.find(s => s.id === campaignSession.sessionId);
          return (
            <div key={campaignSession.id} className="flex items-center justify-between p-4 border rounded-lg">
              <div className="flex items-center space-x-3">
                <div className={`w-3 h-3 rounded-full ${
                  session?.status === "CONNECTED" ? "bg-green-500" : "bg-gray-400"
                }`} />
                <div>
                  <div className="font-medium">{session?.name || campaignSession.sessionId}</div>
                  <div className="text-sm text-muted-foreground">
                    {session?.phone || "Telefone não disponível"}
                  </div>
                  <div className="flex items-center gap-2 mt-1">
                    <Badge variant={session?.status === "CONNECTED" ? "default" : "secondary"} className="text-xs">
                      {session?.status || "UNKNOWN"}
                    </Badge>
                    <Badge variant="outline" className="text-xs">
                      {session?.type || "N/A"}
                    </Badge>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="text-right text-sm">
                  <div className="font-medium">
                    Score: <span className={getHealthColor(campaignSession.healthScore || 0)}>
                      {campaignSession.healthScore || 0}%
                    </span>
                  </div>
                  <div className="text-muted-foreground">
                    {campaignSession.dailyMessagesSent || 0} msgs hoje
                  </div>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onRemoveSession(campaignSession.sessionId)}
                  className="text-red-600 hover:text-red-700"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          );
        })}
        {campaignSessions.length === 0 && (
          <div className="text-center py-8 text-muted-foreground border-2 border-dashed rounded-lg">
            <Phone className="h-8 w-8 mx-auto mb-2 opacity-50" />
            <p>Nenhuma sessão configurada</p>
            <p className="text-xs mt-1">Adicione sessões WhatsApp para começar o aquecimento</p>
          </div>
        )}
      </div>
    </div>
  );
}

// Componente do Modal de Detalhes da Campanha
function CampaignDetailsModal({
  campaign,
  onUpdate,
  onClose
}: {
  campaign: Campaign;
  onUpdate: () => void;
  onClose: () => void;
}) {
  const [activeTab, setActiveTab] = useState("overview");
  const [isEditing, setIsEditing] = useState(false);
  const [executions, setExecutions] = useState<Execution[]>([]);
  const [loadingExecutions, setLoadingExecutions] = useState(false);
  const [statistics, setStatistics] = useState<CampaignStatistics | null>(null);
  const [loadingStats, setLoadingStats] = useState(false);
  const [editData, setEditData] = useState({
    name: campaign.name,
    description: campaign.description || '',
    dailyMessageGoal: campaign.dailyMessageGoal,
    enableInternalConversations: campaign.enableInternalConversations,
    internalConversationRatio: campaign.internalConversationRatio,
    minIntervalMinutes: campaign.minIntervalMinutes,
    maxIntervalMinutes: campaign.maxIntervalMinutes,
    useWorkingHours: campaign.useWorkingHours,
    workingHourStart: campaign.workingHourStart,
    workingHourEnd: campaign.workingHourEnd,
    allowWeekends: campaign.allowWeekends,
    randomizeInterval: campaign.randomizeInterval,
    enableAutoPauses: campaign.enableAutoPauses,
    maxPauseTimeMinutes: campaign.maxPauseTimeMinutes,
    minConversationTimeMinutes: campaign.minConversationTimeMinutes,
  });
  const [saving, setSaving] = useState(false);

  // Carregar dados quando necessário
  useEffect(() => {
    if (activeTab === "executions" && !executions.length) {
      loadExecutions();
    }
    if (activeTab === "statistics" && !statistics) {
      loadStatistics();
    }
  }, [activeTab]);

  const loadExecutions = async () => {
    try {
      setLoadingExecutions(true);
      const response = await getCampaignExecutions(campaign.id, { limit: 100 });
      setExecutions(response.data || []);
    } catch (error) {
      console.error("Erro ao carregar execuções:", error);
      toast({
        title: "Erro",
        description: "Falha ao carregar histórico de execuções",
        variant: "destructive",
      });
    } finally {
      setLoadingExecutions(false);
    }
  };

  const loadStatistics = async () => {
    try {
      setLoadingStats(true);
      const statsData = await getCampaignStatistics(campaign.id);
      setStatistics(statsData);
    } catch (error) {
      console.error("Erro ao carregar estatísticas:", error);
      toast({
        title: "Erro",
        description: "Falha ao carregar estatísticas",
        variant: "destructive",
      });
    } finally {
      setLoadingStats(false);
    }
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      await updateCampaign(campaign.id, editData);
      toast({
        title: "Sucesso",
        description: "Campanha atualizada com sucesso",
      });
      setIsEditing(false);
      onUpdate();
    } catch (error) {
      console.error("Erro ao atualizar campanha:", error);
      toast({
        title: "Erro",
        description: "Falha ao atualizar campanha",
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    setEditData({
      name: campaign.name,
      description: campaign.description || '',
      dailyMessageGoal: campaign.dailyMessageGoal,
      enableInternalConversations: campaign.enableInternalConversations,
      internalConversationRatio: campaign.internalConversationRatio,
      minIntervalMinutes: campaign.minIntervalMinutes,
      maxIntervalMinutes: campaign.maxIntervalMinutes,
      useWorkingHours: campaign.useWorkingHours,
      workingHourStart: campaign.workingHourStart,
      workingHourEnd: campaign.workingHourEnd,
      allowWeekends: campaign.allowWeekends,
      randomizeInterval: campaign.randomizeInterval,
      enableAutoPauses: campaign.enableAutoPauses,
      maxPauseTimeMinutes: campaign.maxPauseTimeMinutes,
      minConversationTimeMinutes: campaign.minConversationTimeMinutes,
    });
    setIsEditing(false);
  };

  const getStatusBadge = () => {
    if (campaign.isActive) {
      return <Badge variant="default" className="bg-green-500">Ativo</Badge>;
    }
    return <Badge variant="secondary" className="bg-yellow-500 text-yellow-900">Pausado</Badge>;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
  <div className="flex h-[100vh] w-full">
      {/* Sidebar com informações principais */}
      <div className="w-72 border-r bg-muted/30 p-4 space-y-4 flex-shrink-0">
        {/* Header da campanha */}
        <div className="space-y-3">
          <div className="flex items-center gap-3">
            <div className={`w-4 h-4 rounded-full ${campaign.isActive ? 'bg-green-500' : 'bg-yellow-500'} animate-pulse`} />
            <h2 className="text-lg font-bold truncate">{campaign.name}</h2>
          </div>
          {getStatusBadge()}
          {campaign.description && (
            <p className="text-sm text-muted-foreground leading-relaxed">{campaign.description}</p>
          )}
        </div>

        {/* Estatísticas rápidas */}
        <div className="space-y-3">
          <h3 className="font-semibold text-xs text-muted-foreground uppercase tracking-wide">Resumo</h3>
          <div className="grid grid-cols-2 gap-2">
            <Card className="p-2">
              <div className="text-center">
                <div className="text-lg font-bold text-blue-600">{campaign.campaignSessions?.length || 0}</div>
                <div className="text-xs text-muted-foreground">Sessões</div>
              </div>
            </Card>
            <Card className="p-2">
              <div className="text-center">
                <div className="text-lg font-bold text-green-600">{campaign.campaignContacts?.length || 0}</div>
                <div className="text-xs text-muted-foreground">Contatos</div>
              </div>
            </Card>
            <Card className="p-2">
              <div className="text-center">
                <div className="text-lg font-bold text-purple-600">{campaign.messageTemplates?.length || 0}</div>
                <div className="text-xs text-muted-foreground">Templates</div>
              </div>
            </Card>
            <Card className="p-2">
              <div className="text-center">
                <div className="text-lg font-bold text-orange-600">{campaign.dailyMessageGoal}</div>
                <div className="text-xs text-muted-foreground">Meta Diária</div>
              </div>
            </Card>
          </div>
        </div>

        {/* Health Score */}
        <div className="space-y-3">
          <h3 className="font-semibold text-xs text-muted-foreground uppercase tracking-wide">Saúde</h3>
          <Card className="p-3">
            <div className="text-center space-y-2">
              <div className={`text-xl font-bold ${getHealthColor(
                campaign.campaignSessions?.length > 0 
                  ? campaign.campaignSessions.reduce((total, session) => total + session.healthScore, 0) / campaign.campaignSessions.length 
                  : 0
              )}`}>
                {campaign.campaignSessions?.length > 0 
                  ? Math.round(campaign.campaignSessions.reduce((total, session) => total + session.healthScore, 0) / campaign.campaignSessions.length)
                  : 0}%
              </div>
              <div className="text-xs text-muted-foreground">Score Médio</div>
              <Progress 
                value={campaign.campaignSessions?.length > 0 
                  ? campaign.campaignSessions.reduce((total, session) => total + session.healthScore, 0) / campaign.campaignSessions.length 
                  : 0} 
                className="h-1" 
              />
            </div>
          </Card>
        </div>

        {/* Informações de criação */}
        <div className="space-y-3">
          <h3 className="font-semibold text-xs text-muted-foreground uppercase tracking-wide">Informações</h3>
          <div className="space-y-2 text-xs">
            <div className="flex items-center gap-2">
              <Calendar className="h-3 w-3 text-muted-foreground" />
              <span className="text-muted-foreground">Criado:</span>
            </div>
            <div className="text-xs font-medium pl-5">{formatDate(campaign.createdAt)}</div>
            <div className="flex items-center gap-2">
              <RefreshCw className="h-3 w-3 text-muted-foreground" />
              <span className="text-muted-foreground">Atualizado:</span>
            </div>
            <div className="text-xs font-medium pl-5">{formatDate(campaign.updatedAt)}</div>
            {campaign.createdBy && (
              <>
                <div className="flex items-center gap-2">
                  <Users className="h-3 w-3 text-muted-foreground" />
                  <span className="text-muted-foreground">Criado por:</span>
                </div>
                <div className="text-xs font-medium pl-5">{campaign.createdBy.name}</div>
              </>
            )}
          </div>
        </div>

        {/* Botões de ação */}
        <div className="space-y-2 pt-4 border-t">
          {isEditing ? (
            <>
              <Button onClick={handleSave} disabled={saving} className="w-full" size="sm">
                {saving ? (
                  <>
                    <RefreshCw className="h-4 w-4 animate-spin mr-2" />
                    Salvando...
                  </>
                ) : (
                  <>
                    <Save className="h-4 w-4 mr-2" />
                    Salvar
                  </>
                )}
              </Button>
              <Button variant="outline" onClick={handleCancel} disabled={saving} className="w-full" size="sm">
                Cancelar
              </Button>
            </>
          ) : (
            <Button onClick={() => setIsEditing(true)} variant="outline" className="w-full" size="sm">
              <Pencil className="h-4 w-4 mr-2" />
              Editar
            </Button>
          )}
        </div>
      </div>

      {/* Área principal com tabs */}
  <div className="flex-1 flex flex-col w-0 overflow-x-auto">
        {/* Tabs navigation */}
        <div className="border-b px-6 py-3 flex-shrink-0">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-6">
              <TabsTrigger value="overview" className="flex items-center gap-2">
                <Eye className="h-4 w-4" />
                Visão Geral
              </TabsTrigger>
              <TabsTrigger value="statistics" className="flex items-center gap-2">
                <BarChart3 className="h-4 w-4" />
                Estatísticas
              </TabsTrigger>
              <TabsTrigger value="sessions" className="flex items-center gap-2">
                <Phone className="h-4 w-4" />
                Sessões
              </TabsTrigger>
              <TabsTrigger value="contacts" className="flex items-center gap-2">
                <Users className="h-4 w-4" />
                Contatos
              </TabsTrigger>
              <TabsTrigger value="templates" className="flex items-center gap-2">
                <MessageSquare className="h-4 w-4" />
                Templates
              </TabsTrigger>
              <TabsTrigger value="executions" className="flex items-center gap-2">
                <Activity className="h-4 w-4" />
                Histórico
              </TabsTrigger>
            </TabsList>

            {/* Tab content */}
            <div className="p-6 overflow-auto max-h-[calc(85vh-120px)]">
              {/* Visão Geral */}
              <TabsContent value="overview" className="space-y-6 mt-0">
                <div className="grid gap-4 lg:grid-cols-2">
                  {/* Configurações básicas */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Settings className="h-5 w-5" />
                        Configurações Básicas
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      {isEditing ? (
                        <div className="space-y-4">
                          <div>
                            <Label htmlFor="name">Nome da Campanha</Label>
                            <Input
                              id="name"
                              value={editData.name}
                              onChange={(e) => setEditData({ ...editData, name: e.target.value })}
                            />
                          </div>
                          <div>
                            <Label htmlFor="description">Descrição</Label>
                            <Textarea
                              id="description"
                              value={editData.description}
                              onChange={(e) => setEditData({ ...editData, description: e.target.value })}
                              rows={3}
                            />
                          </div>
                          <div>
                            <Label htmlFor="dailyGoal">Meta Diária de Mensagens</Label>
                            <Input
                              id="dailyGoal"
                              type="number"
                              value={editData.dailyMessageGoal}
                              onChange={(e) => setEditData({ ...editData, dailyMessageGoal: parseInt(e.target.value) })}
                            />
                          </div>
                        </div>
                      ) : (
                        <div className="space-y-4">
                          <div className="flex justify-between items-center py-2 border-b">
                            <span className="font-medium">Meta Diária:</span>
                            <Badge variant="outline">{campaign.dailyMessageGoal} mensagens</Badge>
                          </div>
                          <div className="flex justify-between items-center py-2 border-b">
                            <span className="font-medium">Intervalo:</span>
                            <Badge variant="outline">{campaign.minIntervalMinutes}-{campaign.maxIntervalMinutes} min</Badge>
                          </div>
                          <div className="flex justify-between items-center py-2 border-b">
                            <span className="font-medium">Horário Comercial:</span>
                            <Badge variant={campaign.useWorkingHours ? "default" : "secondary"}>
                              {campaign.useWorkingHours ? 'Ativo' : 'Inativo'}
                            </Badge>
                          </div>
                          {campaign.useWorkingHours && (
                            <div className="flex justify-between items-center py-2 border-b pl-4">
                              <span className="text-muted-foreground">Horário:</span>
                              <span className="text-sm font-medium">{campaign.workingHourStart}h - {campaign.workingHourEnd}h</span>
                            </div>
                          )}
                          <div className="flex justify-between items-center py-2 border-b">
                            <span className="font-medium">Fins de Semana:</span>
                            <Badge variant={campaign.allowWeekends ? "default" : "secondary"}>
                              {campaign.allowWeekends ? 'Permitido' : 'Não permitido'}
                            </Badge>
                          </div>
                          <div className="flex justify-between items-center py-2">
                            <span className="font-medium">Conversas Internas:</span>
                            <Badge variant={campaign.enableInternalConversations ? "default" : "secondary"}>
                              {campaign.enableInternalConversations ? 'Ativo' : 'Inativo'}
                            </Badge>
                          </div>
                          {campaign.enableInternalConversations && (
                            <div className="flex justify-between items-center py-2 pl-4">
                              <span className="text-muted-foreground">Proporção:</span>
                              <span className="text-sm font-medium">{Math.round(campaign.internalConversationRatio * 100)}%</span>
                            </div>
                          )}
                        </div>
                      )}
                    </CardContent>
                  </Card>

                  {/* Configurações avançadas */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Zap className="h-5 w-5" />
                        Configurações Avançadas
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      {isEditing ? (
                        <div className="space-y-4">
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <Label htmlFor="minInterval">Intervalo Mínimo (min)</Label>
                              <Input
                                id="minInterval"
                                type="number"
                                min="0"
                                value={editData.minIntervalMinutes}
                                onChange={(e) => setEditData({ ...editData, minIntervalMinutes: parseInt(e.target.value) })}
                              />
                            </div>
                            <div>
                              <Label htmlFor="maxInterval">Intervalo Máximo (min)</Label>
                              <Input
                                id="maxInterval"
                                type="number"
                                value={editData.maxIntervalMinutes}
                                onChange={(e) => setEditData({ ...editData, maxIntervalMinutes: parseInt(e.target.value) })}
                              />
                            </div>
                          </div>
                          
                          <div className="space-y-3">
                            <div className="flex items-center space-x-2">
                              <Switch
                                id="useWorkingHours"
                                checked={editData.useWorkingHours}
                                onCheckedChange={(checked) => setEditData({ ...editData, useWorkingHours: checked })}
                              />
                              <Label htmlFor="useWorkingHours">Usar horário comercial</Label>
                            </div>
                            
                            {editData.useWorkingHours && (
                              <div className="grid grid-cols-2 gap-4 ml-6">
                                <div>
                                  <Label htmlFor="workingStart">Início (hora)</Label>
                                  <Input
                                    id="workingStart"
                                    type="number"
                                    min="0"
                                    max="23"
                                    value={editData.workingHourStart}
                                    onChange={(e) => setEditData({ ...editData, workingHourStart: parseInt(e.target.value) })}
                                  />
                                </div>
                                <div>
                                  <Label htmlFor="workingEnd">Fim (hora)</Label>
                                  <Input
                                    id="workingEnd"
                                    type="number"
                                    min="0"
                                    max="23"
                                    value={editData.workingHourEnd}
                                    onChange={(e) => setEditData({ ...editData, workingHourEnd: parseInt(e.target.value) })}
                                  />
                                </div>
                              </div>
                            )}
                            
                            <div className="flex items-center space-x-2">
                              <Switch
                                id="allowWeekends"
                                checked={editData.allowWeekends}
                                onCheckedChange={(checked) => setEditData({ ...editData, allowWeekends: checked })}
                              />
                              <Label htmlFor="allowWeekends">Permitir fins de semana</Label>
                            </div>
                            
                            <div className="flex items-center space-x-2">
                              <Switch
                                id="randomizeInterval"
                                checked={editData.randomizeInterval}
                                onCheckedChange={(checked) => setEditData({ ...editData, randomizeInterval: checked })}
                              />
                              <Label htmlFor="randomizeInterval">Intervalos aleatórios</Label>
                            </div>
                            
                            <div className="flex items-center space-x-2">
                              <Switch
                                id="enableInternal"
                                checked={editData.enableInternalConversations}
                                onCheckedChange={(checked) => setEditData({ ...editData, enableInternalConversations: checked })}
                              />
                              <Label htmlFor="enableInternal">Conversas internas</Label>
                            </div>
                            
                            {editData.enableInternalConversations && (
                              <div className="ml-6">
                                <Label htmlFor="internalRatio">Proporção de conversas internas (%)</Label>
                                <Input
                                  id="internalRatio"
                                  type="number"
                                  min="0"
                                  max="100"
                                  value={Math.round(editData.internalConversationRatio * 100)}
                                  onChange={(e) => setEditData({ 
                                    ...editData, 
                                    internalConversationRatio: parseInt(e.target.value) / 100 
                                  })}
                                />
                              </div>
                            )}
                          </div>
                        </div>
                      ) : (
                        <div className="space-y-3">
                          <div className="flex flex-wrap gap-2">
                            <Badge variant={campaign.randomizeInterval ? "default" : "secondary"}>
                              {campaign.randomizeInterval ? "Intervalos Aleatórios" : "Intervalos Fixos"}
                            </Badge>
                            <Badge variant={campaign.useWorkingHours ? "default" : "secondary"}>
                              {campaign.useWorkingHours ? "Horário Comercial" : "24h"}
                            </Badge>
                            <Badge variant={campaign.allowWeekends ? "default" : "secondary"}>
                              {campaign.allowWeekends ? "Fins de Semana" : "Dias Úteis"}
                            </Badge>
                            {campaign.enableInternalConversations && (
                              <Badge variant="default" className="bg-blue-500">
                                Conversas Internas ({Math.round(campaign.internalConversationRatio * 100)}%)
                              </Badge>
                            )}
                          </div>
                          
                          <div className="pt-4 space-y-3">
                            <h4 className="font-semibold text-sm">Intervalo de Mensagens</h4>
                            <div className="flex items-center justify-between">
                              <span className="text-sm text-muted-foreground">Mínimo:</span>
                              <span className="font-medium">{campaign.minIntervalMinutes} minutos</span>
                            </div>
                            <div className="flex items-center justify-between">
                              <span className="text-sm text-muted-foreground">Máximo:</span>
                              <span className="font-medium">{campaign.maxIntervalMinutes} minutos</span>
                            </div>
                          </div>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              {/* Estatísticas */}
              <TabsContent value="statistics" className="space-y-6 mt-0">
                {loadingStats ? (
                  <div className="flex items-center justify-center py-12">
                    <RefreshCw className="h-8 w-8 animate-spin text-muted-foreground" />
                  </div>
                ) : (
                  <div className="space-y-6">
                    {/* Métricas principais */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <Card>
                        <CardContent className="p-6">
                          <div className="flex items-center justify-between space-y-0 pb-2">
                            <div className="text-sm font-medium text-muted-foreground">
                              Total Enviadas
                            </div>
                            <MessageSquare className="h-4 w-4 text-muted-foreground" />
                          </div>
                          <div className="text-2xl font-bold">
                            {campaign.campaignSessions?.reduce((total, session) => total + session.totalMessagesSent, 0) || 0}
                          </div>
                          <p className="text-xs text-muted-foreground">
                            {campaign.dailyMessageGoal ? `Meta: ${campaign.dailyMessageGoal}/dia` : ''}
                          </p>
                        </CardContent>
                      </Card>
                      
                      <Card>
                        <CardContent className="p-6">
                          <div className="flex items-center justify-between space-y-0 pb-2">
                            <div className="text-sm font-medium text-muted-foreground">
                              Enviadas Hoje
                            </div>
                            <CheckCircle className="h-4 w-4 text-muted-foreground" />
                          </div>
                          <div className="text-2xl font-bold text-green-600">
                            {campaign.campaignSessions?.reduce((total, session) => total + session.dailyMessagesSent, 0) || 0}
                          </div>
                          <p className="text-xs text-muted-foreground">
                            {campaign.dailyMessageGoal ? `${Math.round(((campaign.campaignSessions?.reduce((total, session) => total + session.dailyMessagesSent, 0) || 0) / campaign.dailyMessageGoal) * 100)}% da meta` : ''}
                          </p>
                        </CardContent>
                      </Card>
                      
                      <Card>
                        <CardContent className="p-6">
                          <div className="flex items-center justify-between space-y-0 pb-2">
                            <div className="text-sm font-medium text-muted-foreground">
                              Sessões Ativas
                            </div>
                            <Activity className="h-4 w-4 text-muted-foreground" />
                          </div>
                          <div className="text-2xl font-bold text-blue-600">
                            {campaign.campaignSessions?.filter(session => session.isActive).length || 0}
                          </div>
                          <p className="text-xs text-muted-foreground">
                            Total: {campaign.campaignSessions?.length || 0} sessões
                          </p>
                        </CardContent>
                      </Card>
                      
                      <Card>
                        <CardContent className="p-6">
                          <div className="flex items-center justify-between space-y-0 pb-2">
                            <div className="text-sm font-medium text-muted-foreground">
                              Meta Diária
                            </div>
                            <Target className="h-4 w-4 text-muted-foreground" />
                          </div>
                          <div className="text-2xl font-bold text-purple-600">
                            {Math.round(((campaign.campaignSessions?.reduce((total, session) => total + session.dailyMessagesSent, 0) || 0) / campaign.dailyMessageGoal) * 100)}%
                          </div>
                          <p className="text-xs text-muted-foreground">
                            progresso hoje
                          </p>
                        </CardContent>
                      </Card>
                    </div>

                    <div className="grid gap-6 lg:grid-cols-2">
                      {/* Estatísticas detalhadas */}
                      <Card>
                        <CardHeader>
                          <CardTitle className="flex items-center gap-2">
                            <BarChart className="h-5 w-5" />
                            Performance Detalhada
                          </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                          <div className="space-y-3">
                            <div className="flex items-center justify-between py-2 border-b">
                              <span className="text-sm font-medium">Média por Sessão</span>
                              <Badge variant="outline">
                                {campaign.campaignSessions?.length ? 
                                  Math.round(campaign.campaignSessions.reduce((total, session) => total + session.totalMessagesSent, 0) / campaign.campaignSessions.length) : 0
                                } msg
                              </Badge>
                            </div>
                            <div className="flex items-center justify-between py-2 border-b">
                              <span className="text-sm font-medium">Score Médio de Saúde</span>
                              <Badge variant="outline" className="text-green-600">
                                {campaign.campaignSessions?.length ? 
                                  Math.round(campaign.campaignSessions.reduce((total, session) => total + session.healthScore, 0) / campaign.campaignSessions.length) : 0
                                }%
                              </Badge>
                            </div>
                            <div className="flex items-center justify-between py-2 border-b">
                              <span className="text-sm font-medium">Contatos Vinculados</span>
                              <Badge variant="outline">
                                {campaign.campaignContacts?.length || 0}
                              </Badge>
                            </div>
                            <div className="flex items-center justify-between py-2 border-b">
                              <span className="text-sm font-medium">Templates Ativos</span>
                              <Badge variant="outline" className="text-blue-600">
                                {campaign.messageTemplates?.length || 0}
                              </Badge>
                            </div>
                            <div className="flex items-center justify-between py-2">
                              <span className="text-sm font-medium">Eficiência</span>
                              <Badge variant="outline" className="text-purple-600">
                                {campaign.campaignSessions?.length ? 
                                  Math.round((campaign.campaignSessions.reduce((total, session) => total + session.totalMessagesSent, 0) / campaign.campaignSessions.length) * 100) / 100 : 0
                                } msg/sessão
                              </Badge>
                            </div>
                          </div>
                        </CardContent>
                      </Card>

                      {/* Configurações de envio */}
                      <Card>
                        <CardHeader>
                          <CardTitle className="flex items-center gap-2">
                            <Settings className="h-5 w-5" />
                            Configurações Atuais
                          </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                          <div className="space-y-3">
                            <div className="flex items-center justify-between py-2 border-b">
                              <span className="text-sm font-medium">Intervalo</span>
                              <Badge variant="secondary">
                                {campaign.minIntervalMinutes}-{campaign.maxIntervalMinutes} min
                              </Badge>
                            </div>
                            <div className="flex items-center justify-between py-2 border-b">
                              <span className="text-sm font-medium">Meta Diária</span>
                              <Badge variant="default">
                                {campaign.dailyMessageGoal} mensagens
                              </Badge>
                            </div>
                            <div className="flex items-center justify-between py-2 border-b">
                              <span className="text-sm font-medium">Horário</span>
                              <Badge variant={campaign.useWorkingHours ? "default" : "secondary"}>
                                {campaign.useWorkingHours ? 
                                  `${campaign.workingHourStart}h-${campaign.workingHourEnd}h` : 
                                  '24h'
                                }
                              </Badge>
                            </div>
                            <div className="flex items-center justify-between py-2 border-b">
                              <span className="text-sm font-medium">Fins de Semana</span>
                              <Badge variant={campaign.allowWeekends ? "default" : "secondary"}>
                                {campaign.allowWeekends ? 'Permitido' : 'Bloqueado'}
                              </Badge>
                            </div>
                            <div className="flex items-center justify-between py-2">
                              <span className="text-sm font-medium">Aleatorização</span>
                              <Badge variant={campaign.randomizeInterval ? "default" : "secondary"}>
                                {campaign.randomizeInterval ? 'Ativa' : 'Inativa'}
                              </Badge>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </div>

                    {/* Progress da meta diária */}
                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <TrendingUp className="h-5 w-5" />
                          Progresso da Meta Diária
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          <div className="flex items-center justify-between">
                            <span className="text-sm font-medium">Progresso Hoje</span>
                            <span className="text-sm text-muted-foreground">
                              {campaign.campaignSessions?.reduce((total, session) => total + session.dailyMessagesSent, 0) || 0} / {campaign.dailyMessageGoal}
                            </span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div 
                              className="bg-blue-600 h-2 rounded-full transition-all duration-300" 
                              style={{ 
                                width: `${Math.min(100, ((campaign.campaignSessions?.reduce((total, session) => total + session.dailyMessagesSent, 0) || 0) / campaign.dailyMessageGoal) * 100)}%` 
                              }}
                            ></div>
                          </div>
                          <div className="grid grid-cols-3 gap-4 text-center">
                            <div>
                              <div className="text-lg font-bold text-blue-600">
                                {campaign.campaignSessions?.reduce((total, session) => total + session.dailyMessagesSent, 0) || 0}
                              </div>
                              <div className="text-xs text-muted-foreground">Enviadas hoje</div>
                            </div>
                            <div>
                              <div className="text-lg font-bold text-green-600">
                                {campaign.campaignSessions?.filter(session => session.isActive).length || 0}
                              </div>
                              <div className="text-xs text-muted-foreground">Sessões ativas</div>
                            </div>
                            <div>
                              <div className="text-lg font-bold text-purple-600">
                                {campaign.campaignSessions?.length ? 
                                  Math.round(campaign.campaignSessions.reduce((total, session) => total + session.healthScore, 0) / campaign.campaignSessions.length) : 0
                                }%
                              </div>
                              <div className="text-xs text-muted-foreground">Score médio</div>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                )}
              </TabsContent>

              {/* Sessões */}
              <TabsContent value="sessions" className="space-y-4 mt-0">
                <Card>
                  <CardHeader>
                    <CardTitle>Sessões WhatsApp ({campaign.campaignSessions?.length || 0})</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {campaign.campaignSessions && campaign.campaignSessions.length > 0 ? (
                      <div className="space-y-3">
                        {campaign.campaignSessions.map((campaignSession) => (
                          <div key={campaignSession.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors">
                            <div className="flex items-center gap-4">
                              <div className={`w-3 h-3 rounded-full ${
                                campaignSession.session.status === "CONNECTED" ? "bg-green-500" : "bg-red-500"
                              } animate-pulse`} />
                              <div className="flex items-center gap-3">
                                <Phone className="h-5 w-5 text-muted-foreground" />
                                <div>
                                  <div className="font-medium">{campaignSession.session.name}</div>
                                  <div className="text-sm text-muted-foreground">{campaignSession.session.phone}</div>
                                </div>
                              </div>
                            </div>
                            <div className="flex items-center gap-6">
                              <div className="text-center">
                                <div className={`text-lg font-bold ${getHealthColor(campaignSession.healthScore)}`}>
                                  {campaignSession.healthScore}%
                                </div>
                                <div className="text-xs text-muted-foreground">Score</div>
                              </div>
                              <div className="text-center">
                                <div className="text-lg font-bold">{campaignSession.dailyMessagesSent}</div>
                                <div className="text-xs text-muted-foreground">Hoje</div>
                              </div>
                              <div className="text-center">
                                <div className="text-lg font-bold">{campaignSession.totalMessagesSent}</div>
                                <div className="text-xs text-muted-foreground">Total</div>
                              </div>
                              <Badge variant={campaignSession.isActive ? "default" : "secondary"}>
                                {campaignSession.isActive ? "Ativo" : "Inativo"}
                              </Badge>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-12 text-muted-foreground">
                        <Phone className="h-12 w-12 mx-auto mb-4 opacity-50" />
                        <p>Nenhuma sessão conectada</p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Contatos */}
              <TabsContent value="contacts" className="space-y-4 mt-0">
                <Card>
                  <CardHeader>
                    <CardTitle>Contatos ({campaign.campaignContacts?.length || 0})</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {campaign.campaignContacts && campaign.campaignContacts.length > 0 ? (
                      <div className="space-y-3">
                        {campaign.campaignContacts.map((campaignContact) => (
                          <div key={campaignContact.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors">
                            <div className="flex items-center gap-3">
                              <Users className="h-5 w-5 text-muted-foreground" />
                              <div>
                                <div className="font-medium">{campaignContact.contact.name}</div>
                                <div className="text-sm text-muted-foreground">{campaignContact.contact.phone}</div>
                              </div>
                            </div>
                            <div className="flex items-center gap-3">
                              <div className="text-center">
                                <div className="text-sm font-medium">Prioridade</div>
                                <div className="text-lg font-bold">{campaignContact.priority}</div>
                              </div>
                              <Badge variant={campaignContact.isActive ? "default" : "secondary"}>
                                {campaignContact.isActive ? "Ativo" : "Inativo"}
                              </Badge>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-12 text-muted-foreground">
                        <Users className="h-12 w-12 mx-auto mb-4 opacity-50" />
                        <p>Nenhum contato adicionado</p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Templates */}
              <TabsContent value="templates" className="space-y-4 mt-0">
                <Card>
                  <CardHeader>
                    <CardTitle>Templates de Mensagem ({campaign.messageTemplates?.length || 0})</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {campaign.messageTemplates && campaign.messageTemplates.length > 0 ? (
                      <div className="space-y-3">
                        {campaign.messageTemplates.map((template) => (
                          <div key={template.id} className="p-4 border rounded-lg space-y-3">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-3">
                                <MessageSquare className="h-5 w-5 text-muted-foreground" />
                                <div className="font-medium">{template.name}</div>
                              </div>
                              <div className="flex items-center gap-2">
                                <Badge variant="outline">{template.messageType}</Badge>
                                <Badge variant={template.isActive ? "default" : "secondary"}>
                                  {template.isActive ? "Ativo" : "Inativo"}
                                </Badge>
                                <div className="text-sm">
                                  Peso: <span className="font-medium">{template.weight}</span>
                                </div>
                              </div>
                            </div>
                            <div className="text-sm bg-muted p-3 rounded border-l-4 border-blue-500">
                              {template.content}
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-12 text-muted-foreground">
                        <MessageSquare className="h-12 w-12 mx-auto mb-4 opacity-50" />
                        <p>Nenhum template criado</p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Histórico de Execuções */}
              <TabsContent value="executions" className="space-y-4 mt-0">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                      <span>Histórico de Execuções</span>
                      <Button variant="outline" size="sm" onClick={loadExecutions} disabled={loadingExecutions}>
                        <RefreshCw className={`h-4 w-4 mr-2 ${loadingExecutions ? 'animate-spin' : ''}`} />
                        Atualizar
                      </Button>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {loadingExecutions ? (
                      <div className="flex items-center justify-center py-12">
                        <RefreshCw className="h-8 w-8 animate-spin text-muted-foreground" />
                      </div>
                    ) : executions.length > 0 ? (
                      <div className="space-y-3 max-h-96 overflow-auto">
                        {executions.map((execution) => (
                          <div key={execution.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors">
                            <div className="flex items-center gap-3">
                              {getExecutionStatusIcon(execution.status)}
                              <div>
                                <div className="font-medium">
                                  {execution.executionType === "internal" ? "Conversa Interna" : "Mensagem Externa"}
                                </div>
                                <div className="text-sm text-muted-foreground max-w-md truncate">
                                  {execution.messageContent}
                                </div>
                              </div>
                            </div>
                            <div className="text-right">
                              <div className="text-sm font-medium">{formatDate(execution.scheduledAt)}</div>
                              <Badge variant={
                                execution.status === "delivered" ? "default" :
                                execution.status === "sent" ? "secondary" :
                                execution.status === "failed" ? "destructive" : "outline"
                              }>
                                {execution.status}
                              </Badge>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-12 text-muted-foreground">
                        <Activity className="h-12 w-12 mx-auto mb-4 opacity-50" />
                        <p>Nenhuma execução registrada</p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>
            </div>
          </Tabs>
        </div>
      </div>
    </div>
  );
}

// Componente para gerenciar contatos da campanha
function CampaignContactsManager({ 
  campaign, 
  onContactsUpdated 
}: { 
  campaign: Campaign; 
  onContactsUpdated: () => void; 
}) {
  const [campaignContacts, setCampaignContacts] = useState<any[]>([]);
  const [allContacts, setAllContacts] = useState<Contact[]>([]);
  const [loading, setLoading] = useState(true);
  const [addContactsDialog, setAddContactsDialog] = useState(false);
  const [selectedContacts, setSelectedContacts] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [adding, setAdding] = useState(false);
  const [removing, setRemoving] = useState<string | null>(null);

  useEffect(() => {
    loadContactsData();
  }, [campaign.id]);

  const loadContactsData = async () => {
    try {
      setLoading(true);
      const [campaignContactsResponse, allContactsResponse] = await Promise.all([
        getCampaignContacts(campaign.id),
        getContacts({ page: 1, limit: 1000, isActive: true })
      ]);
      
      setCampaignContacts(campaignContactsResponse.data || []);
      setAllContacts(allContactsResponse.data || []);
    } catch (error) {
      console.error("Erro ao carregar contatos:", error);
      toast({
        title: "Erro",
        description: "Não foi possível carregar os contatos.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleAddContacts = async () => {
    if (selectedContacts.length === 0) return;

    try {
      setAdding(true);
      await addContactsToCampaign(campaign.id, {
        contactIds: selectedContacts,
        priority: 1
      });
      
      toast({
        title: "Sucesso",
        description: `${selectedContacts.length} contato(s) adicionado(s) à campanha.`,
      });
      
      setSelectedContacts([]);
      setAddContactsDialog(false);
      setSearchTerm("");
      await loadContactsData();
      onContactsUpdated();
    } catch (error) {
      console.error("Erro ao adicionar contatos:", error);
      toast({
        title: "Erro",
        description: "Não foi possível adicionar os contatos.",
        variant: "destructive",
      });
    } finally {
      setAdding(false);
    }
  };

  const handleRemoveContact = async (contactId: string) => {
    try {
      setRemoving(contactId);
      await removeContactFromCampaign(campaign.id, contactId);
      
      toast({
        title: "Sucesso",
        description: "Contato removido da campanha com sucesso.",
      });
      
      await loadContactsData();
      onContactsUpdated();
    } catch (error) {
      console.error("Erro ao remover contato:", error);
      toast({
        title: "Erro",
        description: "Não foi possível remover o contato.",
        variant: "destructive",
      });
    } finally {
      setRemoving(null);
    }
  };

  const availableContacts = allContacts.filter(contact => 
    !campaignContacts.some(cc => cc.id === contact.id) &&
    contact.isActive &&
    (searchTerm === "" || 
     contact.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
     contact.phone.includes(searchTerm))
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <RefreshCw className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Cabeçalho */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold">Contatos da Campanha</h3>
          <p className="text-sm text-muted-foreground">
            {campaignContacts.length} contato(s) configurado(s) nesta campanha
          </p>
        </div>
        <Button 
          size="sm" 
          onClick={() => setAddContactsDialog(true)}
          disabled={loading}
        >
          <Plus className="h-4 w-4 mr-2" />
          Adicionar Contatos ({availableContacts.length})
        </Button>
      </div>

      {/* Lista de contatos atuais */}
      <div className="space-y-3">
        {campaignContacts.length > 0 ? (
          campaignContacts.map((contact) => {
            return (
              <Card key={contact.id}>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                        <Users className="h-5 w-5 text-blue-600" />
                      </div>
                      <div>
                        <div className="font-medium">{contact.name}</div>
                        <div className="text-sm text-muted-foreground">{contact.phone}</div>
                        <div className="flex gap-2 mt-1">
                          {contact.interactionCount > 0 && (
                            <Badge variant="secondary" className="text-xs">
                              {contact.interactionCount} mensagens
                            </Badge>
                          )}
                          {contact.lastInteraction && (
                            <Badge variant="outline" className="text-xs">
                              Última: {new Date(contact.lastInteraction).toLocaleDateString('pt-BR')}
                            </Badge>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-destructive hover:text-destructive"
                        disabled={removing === contact.id}
                        onClick={() => handleRemoveContact(contact.id)}
                      >
                        {removing === contact.id ? (
                          <RefreshCw className="h-4 w-4 animate-spin" />
                        ) : (
                          <Trash2 className="h-4 w-4" />
                        )}
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })
        ) : (
          <div className="text-center py-8 text-muted-foreground">
            <Users className="h-8 w-8 mx-auto mb-2 opacity-50" />
            <p>Nenhum contato adicionado</p>
            <p className="text-xs mt-1">Clique em "Adicionar Contatos" para começar</p>
          </div>
        )}
      </div>

      {/* Dialog para adicionar contatos */}
      <Dialog open={addContactsDialog} onOpenChange={setAddContactsDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Adicionar Contatos à Campanha</DialogTitle>
            <DialogDescription>
              Selecione os contatos que deseja adicionar à campanha de warmup.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            {/* Busca */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar contatos por nome ou telefone..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>

            {/* Lista de contatos disponíveis */}
            <ScrollArea className="h-[400px] border rounded-lg p-4">
              {availableContacts.length > 0 ? (
                <div className="space-y-2">
                  {availableContacts.map((contact) => (
                    <div key={contact.id} className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        id={`contact-${contact.id}`}
                        checked={selectedContacts.includes(contact.id)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setSelectedContacts([...selectedContacts, contact.id]);
                          } else {
                            setSelectedContacts(selectedContacts.filter(id => id !== contact.id));
                          }
                        }}
                        className="rounded border-gray-300"
                      />
                      <label 
                        htmlFor={`contact-${contact.id}`}
                        className="flex-1 cursor-pointer p-2 rounded hover:bg-gray-50"
                      >
                        <div className="font-medium">{contact.name}</div>
                        <div className="text-sm text-muted-foreground">{contact.phone}</div>
                        {contact.email && (
                          <div className="text-xs text-muted-foreground">{contact.email}</div>
                        )}
                      </label>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  <Users className="h-8 w-8 mx-auto mb-2 opacity-50" />
                  <p>Nenhum contato disponível</p>
                  <p className="text-xs mt-1">Todos os contatos já foram adicionados ou não há contatos cadastrados</p>
                </div>
              )}
            </ScrollArea>
          </div>

          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => {
                setAddContactsDialog(false);
                setSelectedContacts([]);
                setSearchTerm("");
              }}
            >
              Cancelar
            </Button>
            <Button 
              onClick={handleAddContacts}
              disabled={selectedContacts.length === 0 || adding}
            >
              {adding ? (
                <>
                  <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                  Adicionando...
                </>
              ) : (
                <>
                  Adicionar {selectedContacts.length} Contato(s)
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

// Componente para configurações de Auto-Read de mensagens (usado na seção de configurações globais)
function SessionAutoReadCard({ campaignId }: { campaignId: string }) {
  const [campaignSessions, setCampaignSessions] = useState<any[]>([]);
  const [campaignStatus, setCampaignStatus] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [expandedSession, setExpandedSession] = useState<string | null>(null);
  const { toast } = useToast();

  // Carregar status da campanha e sessões
  useEffect(() => {
    loadCampaignAutoReadStatus();
  }, [campaignId]);

  const loadCampaignAutoReadStatus = async () => {
    try {
      setLoading(true);
      const data = await getCampaignAutoReadStatus(campaignId);
      setCampaignStatus(data);
      setCampaignSessions(data.sessions || []);
    } catch (error) {
      console.error('Erro ao carregar status de auto-read:', error);
      toast({
        title: "Erro",
        description: "Falha ao carregar configurações de auto-read",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const toggleSessionAutoReadHandler = async (sessionId: string, enabled: boolean) => {
    try {
      await toggleSessionAutoRead(campaignId, sessionId, enabled);
      toast({
        title: "Sucesso",
        description: `Auto-read ${enabled ? 'ativado' : 'desativado'} para a sessão`,
      });
      loadCampaignAutoReadStatus();
    } catch (error) {
      console.error('Erro ao alterar auto-read:', error);
      toast({
        title: "Erro",
        description: "Falha ao alterar configuração de auto-read",
        variant: "destructive",
      });
    }
  };

  const updateSessionAutoReadSettingsHandler = async (sessionId: string, settings: any) => {
    try {
      await updateSessionAutoReadSettings(campaignId, sessionId, settings);
      toast({
        title: "Sucesso",
        description: "Configurações de auto-read atualizadas",
      });
      loadCampaignAutoReadStatus();
    } catch (error) {
      console.error('Erro ao atualizar configurações:', error);
      toast({
        title: "Erro",
        description: "Falha ao atualizar configurações de auto-read",
        variant: "destructive",
      });
    }
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Eye className="h-5 w-5" />
            Auto-Read de Mensagens
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-8">
            <RefreshCw className="h-6 w-6 animate-spin mr-2" />
            Carregando configurações...
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Eye className="h-5 w-5" />
          Auto-Read de Mensagens
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          Configure a leitura automática de mensagens para simular atividade humana
        </p>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Resumo geral */}
        {campaignStatus && (
          <div className="grid grid-cols-3 gap-4 p-4 bg-muted/30 rounded-lg">
            <div className="text-center">
              <div className="text-2xl font-bold">{campaignStatus.totalSessions}</div>
              <div className="text-xs text-muted-foreground">Total de Sessões</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">{campaignStatus.sessionsAutoReadEnabled}</div>
              <div className="text-xs text-muted-foreground">Com Auto-Read</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold">{campaignStatus.percentageEnabled}%</div>
              <div className="text-xs text-muted-foreground">Cobertura</div>
            </div>
          </div>
        )}

        {/* Lista de sessões */}
        <div className="space-y-3">
          {campaignSessions.map((session) => (
            <div key={session.sessionId} className="border rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className={`w-3 h-3 rounded-full ${session.autoReadEnabled ? 'bg-green-500' : 'bg-gray-400'}`} />
                  <div>
                    <div className="font-medium">{session.sessionName}</div>
                    <div className="text-sm text-muted-foreground">ID: {session.sessionId}</div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Switch
                    checked={session.autoReadEnabled}
                    onCheckedChange={(enabled) => toggleSessionAutoReadHandler(session.sessionId, enabled)}
                  />
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setExpandedSession(
                      expandedSession === session.sessionId ? null : session.sessionId
                    )}
                  >
                    <Settings className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              {/* Configurações expandidas */}
              {expandedSession === session.sessionId && (
                <div className="mt-4 pt-4 border-t space-y-4">
                  <SessionAutoReadForm
                    session={session}
                    onUpdate={(settings) => updateSessionAutoReadSettingsHandler(session.sessionId, settings)}
                  />
                </div>
              )}
            </div>
          ))}
        </div>

        {campaignSessions.length === 0 && (
          <div className="text-center py-8 text-muted-foreground">
            <Eye className="h-8 w-8 mx-auto mb-2 opacity-50" />
            <p>Nenhuma sessão encontrada</p>
            <p className="text-xs mt-1">Adicione sessões à campanha para configurar auto-read</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

// Componente para formulário de configurações de auto-read de uma sessão
function SessionAutoReadForm({ 
  session, 
  onUpdate 
}: { 
  session: any; 
  onUpdate: (settings: any) => void; 
}) {
  const [formData, setFormData] = useState({
    autoReadEnabled: session.autoReadEnabled || false,
    autoReadInterval: session.autoReadInterval || 60,
    autoReadMinDelay: session.autoReadMinDelay || 10,
    autoReadMaxDelay: session.autoReadMaxDelay || 30,
  });

  const handleSave = () => {
    onUpdate(formData);
  };

  return (
    <div className="space-y-4">
      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="interval">Intervalo de Verificação (segundos)</Label>
          <Input
            id="interval"
            type="number"
            min="30"
            max="300"
            value={formData.autoReadInterval}
            onChange={(e) => setFormData({ ...formData, autoReadInterval: parseInt(e.target.value) })}
          />
          <p className="text-xs text-muted-foreground">
            Frequência para verificar novas mensagens (30-300 segundos)
          </p>
        </div>

        <div className="space-y-2">
          <Label>Atraso para Leitura</Label>
          <div className="grid grid-cols-2 gap-2">
            <div>
              <Label className="text-xs text-muted-foreground">Mín (seg)</Label>
              <Input
                type="number"
                min="1"
                max="60"
                value={formData.autoReadMinDelay}
                onChange={(e) => setFormData({ ...formData, autoReadMinDelay: parseInt(e.target.value) })}
              />
            </div>
            <div>
              <Label className="text-xs text-muted-foreground">Máx (seg)</Label>
              <Input
                type="number"
                min="5"
                max="120"
                value={formData.autoReadMaxDelay}
                onChange={(e) => setFormData({ ...formData, autoReadMaxDelay: parseInt(e.target.value) })}
              />
            </div>
          </div>
          <p className="text-xs text-muted-foreground">
            Atraso aleatório antes de marcar mensagem como lida
          </p>
        </div>
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
        <div className="text-sm">
          <strong>Configuração Atual:</strong>
        </div>
        <div className="text-xs text-muted-foreground mt-1">
          • Verifica mensagens a cada {formData.autoReadInterval} segundos<br/>
          • Atraso aleatório entre {formData.autoReadMinDelay}-{formData.autoReadMaxDelay} segundos para leitura<br/>
          • Simula comportamento humano natural
        </div>
      </div>

      <div className="flex justify-end">
        <Button onClick={handleSave} size="sm">
          <CheckCircle className="h-4 w-4 mr-2" />
          Salvar Configurações
        </Button>
      </div>
    </div>
  );
}
