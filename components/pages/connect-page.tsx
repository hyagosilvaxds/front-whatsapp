"use client";

import React, { useState, useEffect, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Plus, Trash2, QrCode, Wifi, WifiOff, RefreshCw, Phone } from "lucide-react";
import {
  WhatsAppSession,
  CreateSessionData,
  createWhatsAppSession,
  getWhatsAppSessions,
  getWhatsAppSession,
  deleteWhatsAppSession,
  disconnectWhatsAppSession,
  connectWhatsAppSession,
  getSessionQRCode,
  refreshSessionQRCode,
} from "@/lib/api/whatsapp-sessions";

// Função auxiliar para tratar erros
const getErrorMessage = (error: any): string => {
  if (error?.response?.data?.message) {
    return error.response.data.message;
  }
  if (error?.message) {
    return error.message;
  }
  if (typeof error === 'string') {
    return error;
  }
  return 'Erro desconhecido';
};

export default function ConnectPage() {
  const [sessions, setSessions] = useState<WhatsAppSession[]>([]);
  const [loading, setLoading] = useState(false);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isQRDialogOpen, setIsQRDialogOpen] = useState(false);
  const [selectedSession, setSelectedSession] = useState<WhatsAppSession | null>(null);
  const [qrCodeData, setQrCodeData] = useState<string | null>(null);
  const [isPolling, setIsPolling] = useState(false);
  const [pollingInterval, setPollingInterval] = useState<NodeJS.Timeout | null>(null);
  const pollingRef = useRef<boolean>(false);
  const sessionsPolling = useRef<Set<string>>(new Set()); // Controla quais sessões estão em polling
  const [createForm, setCreateForm] = useState<CreateSessionData>({
    name: "",
    type: "MAIN",
  });
  const { toast } = useToast();

  // Função para parar polling
  const stopPolling = (sessionId?: string) => {
    if (sessionId) {
      // Para polling de uma sessão específica
      sessionsPolling.current.delete(sessionId);
      console.log(`Polling parado para sessão ${sessionId}`);
    } else {
      // Para todos os pollings (usado no cleanup)
      sessionsPolling.current.clear();
      console.log('Todos os pollings parados');
    }
    
    pollingRef.current = false;
    if (pollingInterval) {
      clearInterval(pollingInterval);
      setPollingInterval(null);
    }
    setIsPolling(false);
  };

  // Função para monitorar status da sessão
  const startPolling = async (sessionId: string) => {
    // Evita múltiplos pollings da mesma sessão
    if (sessionsPolling.current.has(sessionId)) {
      console.log(`Polling já ativo para sessão ${sessionId}`);
      return;
    }
    
    sessionsPolling.current.add(sessionId);
    console.log(`Iniciando polling para sessão ${sessionId}`);

    const poll = async () => {
      if (!sessionsPolling.current.has(sessionId)) {
        console.log(`Polling parado para sessão ${sessionId}`);
        return; // Para se o polling foi parado
      }
      
      try {
        const sessionData = await getWhatsAppSession(sessionId);
        
        // Verifica novamente se ainda deve continuar o polling
        if (!sessionsPolling.current.has(sessionId)) return;
        
        // Atualiza a sessão na lista
        setSessions(prev => prev.map(session => 
          session.sessionId === sessionId ? sessionData : session
        ));

        // Se a sessão conectou, para o polling
        if (sessionData.status === "CONNECTED") {
          console.log(`Sessão ${sessionId} conectada! Parando polling.`);
          sessionsPolling.current.delete(sessionId);
          
          // Se é a sessão do modal aberto, fecha o modal
          if (selectedSession?.sessionId === sessionId) {
            setIsQRDialogOpen(false);
            setSelectedSession(null);
            setQrCodeData(null);
            setIsPolling(false);
          }
          
          toast({
            title: "Conectado!",
            description: `WhatsApp conectado com sucesso: ${sessionData.phone || 'Número não disponível'}`,
          });
          return;
        }

        // Se falhou, para o polling
        if (sessionData.status === "FAILED") {
          console.log(`Sessão ${sessionId} falhou! Parando polling.`);
          sessionsPolling.current.delete(sessionId);
          
          if (selectedSession?.sessionId === sessionId) {
            setIsPolling(false);
          }
          
          toast({
            title: "Falha na conexão",
            description: `Sessão ${sessionData.name}: A conexão WhatsApp falhou. Tente regenerar o QR Code.`,
            variant: "destructive",
          });
          return;
        }

        // Se está conectando e é a sessão do modal, busca o QR code
        if (sessionData.status === "CONNECTING" && selectedSession?.sessionId === sessionId) {
          try {
            const qrData = await getSessionQRCode(sessionId);
            if (qrData.qrCode && qrData.qrCode !== qrCodeData) {
              setQrCodeData(qrData.qrCode);
            }
          } catch (error) {
            // QR code pode não estar disponível ainda
            console.log('QR Code ainda não disponível');
          }
        }

      } catch (error) {
        console.error(`Erro no polling da sessão ${sessionId}:`, error);
        sessionsPolling.current.delete(sessionId);
        
        if (selectedSession?.sessionId === sessionId) {
          setIsPolling(false);
        }
        return;
      }
    };

    // Executa a primeira verificação imediatamente
    await poll();

    // Só configura o polling se a sessão ainda está sendo monitorada
    if (sessionsPolling.current.has(sessionId)) {
      const interval = setInterval(async () => {
        if (sessionsPolling.current.has(sessionId)) {
          await poll();
        } else {
          clearInterval(interval);
        }
      }, 3000);
      
      // Não armazena o interval globalmente para polling de múltiplas sessões
      // Cada sessão tem seu próprio ciclo de vida
    }
  };
  const loadSessions = async () => {
    try {
      setLoading(true);
      const data = await getWhatsAppSessions();
      setSessions(data);
      
      // Verifica se há sessões em estado CONNECTING e inicia polling automático
      const connectingSessions = data.filter(session => 
        session.status === "CONNECTING" && !sessionsPolling.current.has(session.sessionId)
      );
      
      connectingSessions.forEach(session => {
        console.log(`Iniciando polling automático para sessão ${session.name} (${session.sessionId})`);
        startPolling(session.sessionId);
      });
      
    } catch (error: any) {
      console.error('Erro ao carregar sessões:', error);
      toast({
        title: "Erro ao carregar sessões",
        description: getErrorMessage(error),
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  // Criar nova sessão
  const handleCreateSession = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!createForm.name || !createForm.type) {
      toast({
        title: "Dados obrigatórios",
        description: "Nome e tipo são obrigatórios",
        variant: "destructive",
      });
      return;
    }

    try {
      // Mapeia o tipo digitado para um dos tipos válidos da API
      const typeMapping: { [key: string]: string } = {
        'principal': 'MAIN',
        'main': 'MAIN',
        'atendimento': 'MAIN',
        'suporte': 'SUPPORT',
        'support': 'SUPPORT',
        'vendas': 'SALES',
        'sales': 'SALES',
        'marketing': 'MARKETING',
        'comercial': 'SALES',
      };
      
      const normalizedType = createForm.type.toLowerCase().trim();
      const apiType = typeMapping[normalizedType] || 'MAIN'; // Default para MAIN se não encontrar
      
      const sessionData: CreateSessionData = {
        name: createForm.name.trim(),
        type: apiType as "MAIN" | "SUPPORT" | "SALES" | "MARKETING",
      };
      
      console.log('Enviando dados para API:', sessionData);
      
      await createWhatsAppSession(sessionData);
      toast({
        title: "Sucesso",
        description: "Conexão criada com sucesso",
      });
      setIsCreateDialogOpen(false);
      setCreateForm({ name: "", type: "MAIN" });
      loadSessions();
    } catch (error: any) {
      console.error('Erro detalhado ao criar sessão:', error);
      console.error('Response data:', error.response?.data);
      console.error('Status:', error.response?.status);
      
      let errorMessage = "Erro desconhecido ao criar conexão";
      
      if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error.response?.status === 400) {
        errorMessage = "Dados inválidos. Verifique se todos os campos estão preenchidos corretamente.";
      } else if (error.response?.status === 409) {
        errorMessage = "Limite de sessões atingido (máximo 5 por organização).";
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      toast({
        title: "Erro ao criar conexão",
        description: errorMessage,
        variant: "destructive",
      });
    }
  };

  // Deletar sessão
  const handleDeleteSession = async (sessionId: string) => {
    try {
      await deleteWhatsAppSession(sessionId);
      toast({
        title: "Sucesso",
        description: "Sessão deletada com sucesso",
      });
      loadSessions();
    } catch (error: any) {
      console.error('Erro ao deletar sessão:', error);
      toast({
        title: "Erro ao deletar sessão",
        description: getErrorMessage(error),
        variant: "destructive",
      });
    }
  };

  // Desconectar sessão
  const handleDisconnectSession = async (sessionId: string) => {
    try {
      await disconnectWhatsAppSession(sessionId);
      toast({
        title: "Sucesso",
        description: "Sessão desconectada com sucesso",
      });
      loadSessions();
    } catch (error: any) {
      console.error('Erro ao desconectar sessão:', error);
      toast({
        title: "Erro ao desconectar sessão",
        description: getErrorMessage(error),
        variant: "destructive",
      });
    }
  };

  // Reconectar sessão
  const handleConnectSession = async (sessionId: string) => {
    try {
      await connectWhatsAppSession(sessionId);
      toast({
        title: "Sucesso",
        description: "Reconexão iniciada com sucesso",
      });
      loadSessions();
    } catch (error: any) {
      console.error('Erro ao reconectar sessão:', error);
      toast({
        title: "Erro ao reconectar sessão",
        description: getErrorMessage(error),
        variant: "destructive",
      });
    }
  };

  // Obter QR Code
  const handleShowQRCode = async (session: WhatsAppSession) => {
    try {
      setSelectedSession(session);
      setQrCodeData(null); // Limpa QR atual
      setIsQRDialogOpen(true); // Abre o modal primeiro
      setIsPolling(true); // Ativa estado de loading para o modal
      
      // Se está no estado QR_CODE, CONNECTING ou FAILED, atualiza o QR Code primeiro
      if (session.status === "CONNECTING" || session.status === "QR_CODE" || session.status === "FAILED") {
        
        try {
          // Atualiza/regenera o QR Code
          await refreshSessionQRCode(session.sessionId);
          
          // Faz polling para aguardar o novo QR Code
          const pollForQR = async () => {
            try {
              const data = await getSessionQRCode(session.sessionId);
              if (data.qrCode) {
                setQrCodeData(data.qrCode);
                setIsPolling(false);
                
                // Inicia polling para monitorar conexão (se não estiver já ativo)
                if (!sessionsPolling.current.has(session.sessionId)) {
                  startPolling(session.sessionId);
                }
              } else {
                // Continua tentando por mais alguns segundos
                setTimeout(pollForQR, 2000);
              }
            } catch (error) {
              setIsPolling(false);
              toast({
                title: "Erro ao obter QR Code",
                description: getErrorMessage(error),
                variant: "destructive",
              });
            }
          };
          
          // Aguarda um pouco antes de começar a buscar o novo QR
          setTimeout(pollForQR, 1000);
          
        } catch (error: any) {
          setIsPolling(false);
          console.error('Erro ao atualizar QR Code:', error);
          toast({
            title: "Erro ao atualizar QR Code",
            description: getErrorMessage(error),
            variant: "destructive",
          });
        }
      } else {
        // Para sessões conectadas, apenas mostra o modal sem QR
        setQrCodeData(null);
        setIsPolling(false);
      }
      
    } catch (error: any) {
      console.error('Erro ao processar QR Code:', error);
      setIsPolling(false);
      toast({
        title: "Erro ao processar QR Code",
        description: getErrorMessage(error),
        variant: "destructive",
      });
    }
  };

  // Atualizar QR Code
  const handleRefreshQRCode = async () => {
    if (!selectedSession) return;
    
    try {
      setQrCodeData(null); // Limpa QR atual
      
      await refreshSessionQRCode(selectedSession.sessionId);
      
      // Inicia polling para aguardar novo QR Code
      setIsPolling(true);
      
      const pollForQR = async () => {
        try {
          const data = await getSessionQRCode(selectedSession.sessionId);
          if (data.qrCode) {
            setQrCodeData(data.qrCode);
            setIsPolling(false);
            toast({
              title: "Sucesso",
              description: "QR Code atualizado com sucesso",
            });
            
            // Inicia polling para monitorar conexão
            startPolling(selectedSession.sessionId);
          } else {
            // Continua tentando por mais alguns segundos
            setTimeout(pollForQR, 2000);
          }
        } catch (error) {
          setIsPolling(false);
          toast({
            title: "Erro ao atualizar QR Code",
            description: getErrorMessage(error),
            variant: "destructive",
          });
        }
      };
      
      // Aguarda um pouco antes de começar a buscar o novo QR
      setTimeout(pollForQR, 1000);
      
    } catch (error: any) {
      console.error('Erro ao atualizar QR Code:', error);
      setIsPolling(false);
      toast({
        title: "Erro ao atualizar QR Code",
        description: getErrorMessage(error),
        variant: "destructive",
      });
    }
  };

  // Obter cor do status
  const getStatusColor = (status: string) => {
    switch (status) {
      case "CONNECTED":
        return "bg-emerald-500";
      case "CONNECTING":
        return "bg-yellow-500";
      case "QR_CODE":
        return "bg-blue-500";
      case "DISCONNECTED":
        return "bg-slate-500";
      case "FAILED":
        return "bg-red-500";
      default:
        return "bg-slate-500";
    }
  };

  // Obter label do status
  const getStatusLabel = (status: string) => {
    switch (status) {
      case "CONNECTED":
        return "Conectado";
      case "CONNECTING":
        return "Conectando";
      case "QR_CODE":
        return "QR Code";
      case "DISCONNECTED":
        return "Desconectado";
      case "FAILED":
        return "Falhou";
      default:
        return status;
    }
  };

  // Obter cor do tipo
  const getTypeColor = (type: string) => {
    switch (type) {
      case "MAIN":
        return "bg-blue-500";
      case "SUPPORT":
        return "bg-purple-500";
      case "SALES":
        return "bg-green-600";
      case "MARKETING":
        return "bg-orange-500";
      default:
        return "bg-gray-500";
    }
  };

  useEffect(() => {
    loadSessions();
    
    // Cleanup function para parar polling quando o componente é desmontado
    return () => {
      pollingRef.current = false;
      stopPolling(); // Para todos os pollings
    };
  }, []);

  // Para o polling quando o modal QR é fechado
  const handleQRDialogClose = (open: boolean) => {
    setIsQRDialogOpen(open);
    if (!open) {
      // Para apenas o polling da sessão selecionada para o modal
      if (selectedSession) {
        stopPolling(selectedSession.sessionId);
      }
      setQrCodeData(null);
      setSelectedSession(null);
      setIsPolling(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
      <div className="container mx-auto px-6 py-8 space-y-8">
        {/* Header */}
        <div className="flex flex-col space-y-6">
          <div className="flex items-center justify-between">
            <div className="space-y-2">
              <h1 className="text-4xl font-bold bg-gradient-to-r from-slate-900 to-slate-600 dark:from-white dark:to-slate-300 bg-clip-text text-transparent">
                Conexões WhatsApp
              </h1>
              <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl">
                Gerencie suas conexões WhatsApp de forma simples e eficiente. Conecte, monitore e controle suas sessões em tempo real.
              </p>
            </div>
            
            <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
              <DialogTrigger asChild>
                <Button size="lg" className="bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-700 hover:to-emerald-800 text-white shadow-lg hover:shadow-xl transition-all duration-200">
                  <Plus className="w-5 h-5 mr-2" />
                  Nova Conexão
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-md">
                <DialogHeader className="space-y-3">
                  <DialogTitle className="text-2xl font-semibold text-center">
                    Criar Nova Conexão
                  </DialogTitle>
                  <DialogDescription className="text-center text-slate-600 dark:text-slate-400">
                    Configure uma nova sessão WhatsApp para sua organização
                  </DialogDescription>
                </DialogHeader>
                
                <form onSubmit={handleCreateSession} className="space-y-6 mt-6">
                  <div className="space-y-2">
                    <Label htmlFor="name" className="text-sm font-medium">
                      Nome da Conexão
                    </Label>
                    <Input
                      id="name"
                      placeholder="Ex: Atendimento Principal"
                      value={createForm.name}
                      onChange={(e) => setCreateForm({ ...createForm, name: e.target.value })}
                      className="h-12 text-base border-slate-200 focus:border-emerald-500 focus:ring-emerald-500"
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="type" className="text-sm font-medium">
                      Tipo de Conexão
                    </Label>
                    <Select
                      value={createForm.type}
                      onValueChange={(value: "MAIN" | "SUPPORT" | "SALES" | "MARKETING") => 
                        setCreateForm({ ...createForm, type: value })
                      }
                    >
                      <SelectTrigger className="h-12 text-base border-slate-200 focus:border-emerald-500 focus:ring-emerald-500">
                        <SelectValue placeholder="Selecione o tipo de conexão" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="MAIN">Principal</SelectItem>
                        <SelectItem value="SUPPORT">Suporte</SelectItem>
                        <SelectItem value="SALES">Vendas</SelectItem>
                        <SelectItem value="MARKETING">Marketing</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="flex gap-3 pt-4">
                    <Button 
                      type="button" 
                      variant="outline" 
                      onClick={() => setIsCreateDialogOpen(false)}
                      className="flex-1 h-12"
                    >
                      Cancelar
                    </Button>
                    <Button 
                      type="submit" 
                      className="flex-1 h-12 bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-700 hover:to-emerald-800"
                    >
                      Criar Conexão
                    </Button>
                  </div>
                </form>
              </DialogContent>
            </Dialog>
          </div>
          
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-white dark:bg-slate-800 rounded-xl p-4 shadow-sm border border-slate-200 dark:border-slate-700">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-600 dark:text-slate-400">Total</p>
                  <p className="text-2xl font-bold text-slate-900 dark:text-white">
                    {sessions.length}
                  </p>
                </div>
                <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center">
                  <Phone className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                </div>
              </div>
            </div>
            <div className="bg-white dark:bg-slate-800 rounded-xl p-4 shadow-sm border border-slate-200 dark:border-slate-700">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-600 dark:text-slate-400">Conectadas</p>
                  <p className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">
                    {sessions.filter(s => s.status === "CONNECTED").length}
                  </p>
                </div>
                <div className="w-10 h-10 bg-emerald-100 dark:bg-emerald-900 rounded-lg flex items-center justify-center">
                  <Wifi className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                </div>
              </div>
            </div>
            <div className="bg-white dark:bg-slate-800 rounded-xl p-4 shadow-sm border border-slate-200 dark:border-slate-700">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-600 dark:text-slate-400">Conectando</p>
                  <p className="text-2xl font-bold text-yellow-600 dark:text-yellow-400">
                    {sessions.filter(s => s.status === "CONNECTING").length}
                  </p>
                </div>
                <div className="w-10 h-10 bg-yellow-100 dark:bg-yellow-900 rounded-lg flex items-center justify-center">
                  <RefreshCw className="w-5 h-5 text-yellow-600 dark:text-yellow-400" />
                </div>
              </div>
            </div>
            <div className="bg-white dark:bg-slate-800 rounded-xl p-4 shadow-sm border border-slate-200 dark:border-slate-700">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-600 dark:text-slate-400">Desconectadas</p>
                  <p className="text-2xl font-bold text-slate-600 dark:text-slate-400">
                    {sessions.filter(s => s.status === "DISCONNECTED" || s.status === "FAILED").length}
                  </p>
                </div>
                <div className="w-10 h-10 bg-slate-100 dark:bg-slate-700 rounded-lg flex items-center justify-center">
                  <WifiOff className="w-5 h-5 text-slate-600 dark:text-slate-400" />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Lista de Sessões */}
        <div className="space-y-4">
          {loading ? (
            <div className="flex justify-center items-center py-16">
              <div className="text-center space-y-4">
                <RefreshCw className="w-8 h-8 animate-spin mx-auto text-emerald-600" />
                <p className="text-slate-600 dark:text-slate-400 font-medium">Carregando conexões...</p>
              </div>
            </div>
          ) : sessions.length === 0 ? (
            <div className="text-center py-16">
              <div className="bg-white dark:bg-slate-800 rounded-2xl p-12 shadow-sm border border-slate-200 dark:border-slate-700 max-w-md mx-auto">
                <div className="w-16 h-16 bg-slate-100 dark:bg-slate-700 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Phone className="w-8 h-8 text-slate-400" />
                </div>
                <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-3">
                  Nenhuma conexão encontrada
                </h3>
                <p className="text-slate-600 dark:text-slate-400 mb-6">
                  Crie sua primeira conexão WhatsApp para começar a atender seus clientes
                </p>
                <Button 
                  onClick={() => setIsCreateDialogOpen(true)}
                  className="bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-700 hover:to-emerald-800"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Criar Primeira Conexão
                </Button>
              </div>
            </div>
          ) : (
            <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3 auto-rows-fr">
              {sessions.map((session) => (
                <Card key={session.id} className="group bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 shadow-sm hover:shadow-lg transition-all duration-200 hover:border-emerald-200 dark:hover:border-emerald-800 flex flex-col h-full">
                  <CardHeader className="pb-4">
                    <div className="flex justify-between items-start">
                      <div className="space-y-2">
                        <CardTitle className="text-xl font-semibold text-slate-900 dark:text-white group-hover:text-emerald-700 dark:group-hover:text-emerald-400 transition-colors">
                          {session.name}
                        </CardTitle>
                        <div className="flex items-center space-x-2">
                          <Badge variant="outline" className="text-xs px-2 py-1 bg-slate-50 dark:bg-slate-700 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-600">
                            {session.type}
                          </Badge>
                          <Badge className={`text-xs px-3 py-1 font-medium ${getStatusColor(session.status)} text-white border-0`}>
                            {getStatusLabel(session.status)}
                          </Badge>
                        </div>
                      </div>
                    </div>
                  </CardHeader>
                  
                  <CardContent className="space-y-4 flex flex-col flex-grow">
                    <div className="space-y-3 flex-grow">
                      {session.phone && (
                        <div className="flex items-center space-x-3 p-3 bg-slate-50 dark:bg-slate-700/50 rounded-lg">
                          <div className="w-8 h-8 bg-emerald-100 dark:bg-emerald-900 rounded-full flex items-center justify-center">
                            <Phone className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                          </div>
                          <span className="font-medium text-slate-900 dark:text-white">{session.phone}</span>
                        </div>
                      )}
                      
                      <div className="text-xs text-slate-500 dark:text-slate-400 space-y-1">
                        {session.lastConnectedAt ? (
                          <p>
                            <span className="font-medium">Última conexão:</span>{" "}
                            {new Date(session.lastConnectedAt).toLocaleString("pt-BR")}
                          </p>
                        ) : (
                          <p className="italic">Nunca conectado</p>
                        )}
                        <p>
                          <span className="font-medium">Criado em:</span>{" "}
                          {new Date(session.createdAt).toLocaleString("pt-BR")}
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex gap-3 pt-4 border-t border-slate-200 dark:border-slate-700 mt-auto">
                      {/* Botão Principal Unificado */}
                      {session.status === "CONNECTING" ? (
                        <Button
                          size="lg"
                          className="flex-1 h-12 bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-600 hover:to-yellow-700 text-white"
                          disabled={true}
                        >
                          <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                          Conectando...
                        </Button>
                      ) : session.status === "CONNECTED" ? (
                        <Button
                          size="lg"
                          variant="outline"
                          onClick={() => handleDisconnectSession(session.sessionId)}
                          className="flex-1 h-12 border-red-200 text-red-600 hover:bg-red-50 hover:border-red-300 dark:border-red-800 dark:text-red-400 dark:hover:bg-red-900/20"
                        >
                          <WifiOff className="w-4 h-4 mr-2" />
                          Desconectar
                        </Button>
                      ) : session.status === "FAILED" ? (
                        <Button
                          size="lg"
                          onClick={() => handleShowQRCode(session)}
                          className="flex-1 h-12 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white"
                          disabled={isPolling}
                        >
                          <RefreshCw className={`w-4 h-4 mr-2 ${isPolling ? 'animate-spin' : ''}`} />
                          Regenerar QR
                        </Button>
                      ) : session.status === "DISCONNECTED" ? (
                        <Button
                          size="lg"
                          onClick={() => handleConnectSession(session.sessionId)}
                          className="flex-1 h-12 bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-700 hover:to-emerald-800 text-white"
                        >
                          <Wifi className="w-4 h-4 mr-2" />
                          Conectar
                        </Button>
                      ) : (
                        <Button
                          size="lg"
                          onClick={() => handleShowQRCode(session)}
                          className="flex-1 h-12 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white"
                        >
                          <QrCode className="w-4 h-4 mr-2" />
                          Ver QR Code
                        </Button>
                      )}
                      
                      {/* Botão Deletar */}
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button 
                            size="lg" 
                            variant="outline"
                            className="h-12 w-12 p-0 border-red-200 text-red-600 hover:bg-red-50 hover:border-red-300 dark:border-red-800 dark:text-red-400 dark:hover:bg-red-900/20"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent className="sm:max-w-md">
                          <AlertDialogHeader className="space-y-3">
                            <AlertDialogTitle className="text-xl font-semibold text-center">
                              Deletar Conexão
                            </AlertDialogTitle>
                            <AlertDialogDescription className="text-center text-slate-600 dark:text-slate-400">
                              Tem certeza que deseja deletar a conexão <strong>"{session.name}"</strong>?
                              <br />
                              <span className="text-red-600 dark:text-red-400 font-medium">
                                Esta ação não pode ser desfeita.
                              </span>
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter className="gap-3">
                            <AlertDialogCancel className="flex-1">
                              Cancelar
                            </AlertDialogCancel>
                            <AlertDialogAction
                              onClick={() => handleDeleteSession(session.sessionId)}
                              className="flex-1 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white"
                            >
                              Deletar
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>

        {/* Modal QR Code Modernizado */}
        <Dialog open={isQRDialogOpen} onOpenChange={handleQRDialogClose}>
          <DialogContent className="sm:max-w-lg">
            <DialogHeader className="space-y-3">
              <DialogTitle className="text-2xl font-semibold text-center">
                {selectedSession?.name}
              </DialogTitle>
              <DialogDescription className="text-center text-slate-600 dark:text-slate-400">
                {selectedSession?.status === "CONNECTED" ? (
                  "Conexão estabelecida com sucesso"
                ) : selectedSession?.status === "FAILED" ? (
                  "Falha na conexão. Regenere o QR Code para tentar novamente."
                ) : (
                  "Escaneie o QR Code com seu WhatsApp para conectar"
                )}
              </DialogDescription>
            </DialogHeader>
            
            <div className="space-y-6 py-4">
              {selectedSession?.status === "CONNECTED" ? (
                <div className="flex flex-col items-center space-y-6 py-8">
                  <div className="w-20 h-20 bg-emerald-100 dark:bg-emerald-900 rounded-full flex items-center justify-center">
                    <Wifi className="w-10 h-10 text-emerald-600 dark:text-emerald-400" />
                  </div>
                  <div className="text-center space-y-2">
                    <h3 className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">
                      ✅ Conectado!
                    </h3>
                    <p className="text-lg text-slate-700 dark:text-slate-300">
                      {selectedSession.phone || 'WhatsApp conectado com sucesso'}
                    </p>
                    <p className="text-sm text-slate-500 dark:text-slate-400">
                      Sua conexão WhatsApp está ativa e funcionando
                    </p>
                  </div>
                </div>
              ) : selectedSession?.status === "FAILED" ? (
                <div className="flex flex-col items-center space-y-6 py-8">
                  <div className="w-20 h-20 bg-red-100 dark:bg-red-900 rounded-full flex items-center justify-center">
                    <WifiOff className="w-10 h-10 text-red-600 dark:text-red-400" />
                  </div>
                  <div className="text-center space-y-2">
                    <h3 className="text-2xl font-bold text-red-600 dark:text-red-400">
                      ❌ Falha na Conexão
                    </h3>
                    <p className="text-slate-600 dark:text-slate-400">
                      Não foi possível conectar o WhatsApp
                    </p>
                  </div>
                  <Button 
                    onClick={handleRefreshQRCode} 
                    disabled={isPolling}
                    size="lg"
                    className="bg-gradient-to-r from-orange-600 to-orange-700 hover:from-orange-700 hover:to-orange-800 text-white"
                  >
                    <RefreshCw className={`w-5 h-5 mr-2 ${isPolling ? 'animate-spin' : ''}`} />
                    Regenerar QR Code
                  </Button>
                </div>
              ) : qrCodeData ? (
                <div className="flex flex-col items-center space-y-6">
                  <div className="bg-white p-6 rounded-2xl shadow-lg border border-slate-200">
                    <img
                      src={qrCodeData}
                      alt="QR Code WhatsApp"
                      className="w-72 h-72 rounded-xl"
                    />
                  </div>
                  <div className="text-center space-y-3">
                    <p className="text-lg font-medium text-slate-700 dark:text-slate-300">
                      {isPolling ? "Aguardando conexão..." : "Escaneie com seu WhatsApp"}
                    </p>
                    {isPolling && (
                      <div className="flex items-center justify-center space-x-2">
                        <RefreshCw className="w-4 h-4 animate-spin text-emerald-600" />
                        <span className="text-sm text-slate-500 dark:text-slate-400">
                          Monitorando conexão em tempo real...
                        </span>
                      </div>
                    )}
                  </div>
                  <Button 
                    onClick={handleRefreshQRCode} 
                    variant="outline" 
                    disabled={isPolling}
                    size="lg"
                    className="border-emerald-200 text-emerald-700 hover:bg-emerald-50 dark:border-emerald-800 dark:text-emerald-400 dark:hover:bg-emerald-900/20"
                  >
                    <RefreshCw className={`w-4 h-4 mr-2 ${isPolling ? 'animate-spin' : ''}`} />
                    Atualizar QR Code
                  </Button>
                </div>
              ) : (
                <div className="flex flex-col items-center space-y-6 py-8">
                  {isPolling ? (
                    <>
                      <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center">
                        <RefreshCw className="w-8 h-8 animate-spin text-blue-600 dark:text-blue-400" />
                      </div>
                      <div className="text-center space-y-2">
                        <h3 className="text-xl font-semibold text-slate-900 dark:text-white">
                          Gerando QR Code...
                        </h3>
                        <p className="text-slate-500 dark:text-slate-400">
                          Aguarde enquanto preparamos sua conexão
                        </p>
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="w-16 h-16 bg-slate-100 dark:bg-slate-700 rounded-full flex items-center justify-center">
                        <QrCode className="w-8 h-8 text-slate-400" />
                      </div>
                      <div className="text-center space-y-2">
                        <h3 className="text-xl font-semibold text-slate-900 dark:text-white">
                          QR Code Indisponível
                        </h3>
                        <p className="text-slate-500 dark:text-slate-400">
                          Não foi possível gerar o QR Code
                        </p>
                      </div>
                      <Button 
                        onClick={handleRefreshQRCode} 
                        variant="outline"
                        size="lg"
                      >
                        <RefreshCw className="w-4 h-4 mr-2" />
                        Tentar Gerar QR Code
                      </Button>
                    </>
                  )}
                </div>
              )}
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}