'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Separator } from '@/components/ui/separator'
import { 
  QrCode, 
  Smartphone, 
  Plus, 
  Trash2, 
  Settings, 
  CheckCircle, 
  XCircle, 
  Clock, 
  Signal,
  RefreshCw,
  AlertCircle,
  Loader2,
  Power,
  PowerOff
} from 'lucide-react'
import { useToast } from '@/hooks/use-toast'
import { useAuth } from '@/contexts/auth-context'
import {
  WhatsAppSession,
  createWhatsAppSession,
  getWhatsAppSessions,
  updateWhatsAppSession,
  deleteWhatsAppSession,
  getWhatsAppSessionQRCode,
  reconnectWhatsAppSession,
  getSessionStatusLabel,
  getSessionStatusColor,
  isSessionActive,
  sessionNeedsQRCode,
  canReconnectSession,
  pollSessionStatus
} from '@/lib/api/whatsapp-sessions'

export default function ConnectPage() {
  const { toast } = useToast()
  const { user } = useAuth()
  const [sessions, setSessions] = useState<WhatsAppSession[]>([])
  const [loading, setLoading] = useState(true)
  const [creating, setCreating] = useState(false)
  const [newSessionName, setNewSessionName] = useState('')
  const [showCreateDialog, setShowCreateDialog] = useState(false)
  const [showQRDialog, setShowQRDialog] = useState(false)
  const [selectedSession, setSelectedSession] = useState<WhatsAppSession | null>(null)
  const [qrCodeData, setQrCodeData] = useState<string | null>(null)
  const [qrLoading, setQrLoading] = useState(false)
  const [pollingIntervals, setPollingIntervals] = useState<Map<string, NodeJS.Timeout>>(new Map())

  // Carregar sessões ao montar o componente
  useEffect(() => {
    loadSessions()
    return () => {
      // Limpar todos os intervalos de polling ao desmontar
      pollingIntervals.forEach(interval => clearInterval(interval))
    }
  }, [])

  // Função para carregar todas as sessões
  const loadSessions = async () => {
    try {
      setLoading(true)
      const sessionsData = await getWhatsAppSessions()
      setSessions(sessionsData)
      
      // Iniciar polling para sessões que estão conectando ou aguardando QR
      sessionsData.forEach(session => {
        if (session.status === 'CONNECTING' || session.status === 'QR_PENDING') {
          startPollingForSession(session.id)
        }
      })
    } catch (error: any) {
      console.error('Erro ao carregar sessões:', error)
      toast({
        title: 'Erro ao carregar sessões',
        description: error.message,
        variant: 'destructive'
      })
    } finally {
      setLoading(false)
    }
  }

  // Função para iniciar polling de uma sessão específica
  const startPollingForSession = (sessionId: string) => {
    // Não iniciar se já existe um polling para esta sessão
    if (pollingIntervals.has(sessionId)) {
      return
    }

    const { startPolling, stopPolling } = pollSessionStatus(
      sessionId,
      3000, // 3 segundos
      (updatedSession) => {
        setSessions(prev => 
          prev.map(session => 
            session.id === sessionId ? updatedSession : session
          )
        )
        
        // Parar polling se sessão conectou ou deu erro
        if (['CONNECTED', 'ERROR', 'DISCONNECTED'].includes(updatedSession.status)) {
          stopPollingForSession(sessionId)
        }
      }
    )

    startPolling()
    setPollingIntervals(prev => new Map(prev.set(sessionId, setTimeout(stopPolling, 300000)))) // Parar após 5 minutos
  }

  // Função para parar polling de uma sessão específica
  const stopPollingForSession = (sessionId: string) => {
    const interval = pollingIntervals.get(sessionId)
    if (interval) {
      clearInterval(interval)
      setPollingIntervals(prev => {
        const newMap = new Map(prev)
        newMap.delete(sessionId)
        return newMap
      })
    }
  }

  // Função para criar nova sessão
  const handleCreateSession = async () => {
    if (!newSessionName.trim()) {
      toast({
        title: 'Nome obrigatório',
        description: 'Por favor, informe um nome para a sessão',
        variant: 'destructive'
      })
      return
    }

    try {
      setCreating(true)
      const organizationId = user?.role === 'SUPERADMIN' ? user.organization?.id : undefined
      const newSession = await createWhatsAppSession(
        { name: newSessionName.trim() },
        organizationId
      )
      
      setSessions(prev => [...prev, newSession])
      setNewSessionName('')
      setShowCreateDialog(false)
      
      // Iniciar polling para a nova sessão
      startPollingForSession(newSession.id)
      
      toast({
        title: 'Sessão criada com sucesso',
        description: `A sessão "${newSession.name}" foi criada e está conectando`,
      })
    } catch (error: any) {
      toast({
        title: 'Erro ao criar sessão',
        description: error.message,
        variant: 'destructive'
      })
    } finally {
      setCreating(false)
    }
  }

  // Função para obter QR Code
  const handleGetQRCode = async (session: WhatsAppSession) => {
    try {
      setQrLoading(true)
      setSelectedSession(session)
      setShowQRDialog(true)
      
      const qrResponse = await getWhatsAppSessionQRCode(session.id)
      setQrCodeData(qrResponse.qrCode)
      
      // Iniciar polling para atualizar status
      startPollingForSession(session.id)
    } catch (error: any) {
      toast({
        title: 'Erro ao obter QR Code',
        description: error.message,
        variant: 'destructive'
      })
      setShowQRDialog(false)
    } finally {
      setQrLoading(false)
    }
  }

  // Função para reconectar sessão
  const handleReconnect = async (session: WhatsAppSession) => {
    try {
      await reconnectWhatsAppSession(session.id)
      
      // Atualizar status local
      setSessions(prev => 
        prev.map(s => 
          s.id === session.id 
            ? { ...s, status: 'CONNECTING' as const }
            : s
        )
      )
      
      // Iniciar polling
      startPollingForSession(session.id)
      
      toast({
        title: 'Reconexão iniciada',
        description: `Reconectando a sessão "${session.name}"`,
      })
    } catch (error: any) {
      toast({
        title: 'Erro ao reconectar',
        description: error.message,
        variant: 'destructive'
      })
    }
  }

  // Função para ativar/desativar sessão
  const handleToggleSession = async (session: WhatsAppSession) => {
    try {
      const updatedSession = await updateWhatsAppSession(
        session.id,
        { isActive: !session.isActive },
        user?.role === 'SUPERADMIN' ? session.organizationId : undefined
      )
      
      setSessions(prev => 
        prev.map(s => s.id === session.id ? updatedSession : s)
      )
      
      toast({
        title: updatedSession.isActive ? 'Sessão ativada' : 'Sessão desativada',
        description: `A sessão "${session.name}" foi ${updatedSession.isActive ? 'ativada' : 'desativada'}`,
      })
    } catch (error: any) {
      toast({
        title: 'Erro ao atualizar sessão',
        description: error.message,
        variant: 'destructive'
      })
    }
  }

  // Função para excluir sessão
  const handleDeleteSession = async (session: WhatsAppSession) => {
    if (!confirm(`Tem certeza que deseja excluir a sessão "${session.name}"?`)) {
      return
    }

    try {
      await deleteWhatsAppSession(
        session.id,
        user?.role === 'SUPERADMIN' ? session.organizationId : undefined
      )
      
      setSessions(prev => prev.filter(s => s.id !== session.id))
      stopPollingForSession(session.id)
      
      toast({
        title: 'Sessão excluída',
        description: `A sessão "${session.name}" foi excluída com sucesso`,
      })
    } catch (error: any) {
      toast({
        title: 'Erro ao excluir sessão',
        description: error.message,
        variant: 'destructive'
      })
    }
  }

  // Função para obter ícone do status
  const getStatusIcon = (status: WhatsAppSession['status']) => {
    switch (status) {
      case 'CONNECTED':
        return <CheckCircle className="h-4 w-4 text-green-500" />
      case 'DISCONNECTED':
        return <XCircle className="h-4 w-4 text-gray-500" />
      case 'CONNECTING':
        return <Loader2 className="h-4 w-4 text-blue-500 animate-spin" />
      case 'QR_PENDING':
        return <QrCode className="h-4 w-4 text-orange-500" />
      case 'ERROR':
        return <AlertCircle className="h-4 w-4 text-red-500" />
      default:
        return <Clock className="h-4 w-4 text-gray-500" />
    }
  }

  if (loading) {
    return (
      <div className="container mx-auto p-6">
        <div className="flex items-center justify-center h-64">
          <Loader2 className="h-8 w-8 animate-spin" />
          <span className="ml-2">Carregando sessões...</span>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Conectar WhatsApp</h1>
          <p className="text-muted-foreground mt-1">
            Gerencie suas conexões do WhatsApp para atendimento
          </p>
        </div>
        
        <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              Nova Conexão
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Criar Nova Conexão</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="sessionName">Nome da Sessão</Label>
                <Input
                  id="sessionName"
                  placeholder="Ex: Atendimento Principal"
                  value={newSessionName}
                  onChange={(e) => setNewSessionName(e.target.value)}
                />
              </div>
              <div className="flex justify-end space-x-2">
                <Button
                  variant="outline"
                  onClick={() => setShowCreateDialog(false)}
                  disabled={creating}
                >
                  Cancelar
                </Button>
                <Button
                  onClick={handleCreateSession}
                  disabled={creating || !newSessionName.trim()}
                >
                  {creating && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                  Criar Sessão
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Lista de Sessões */}
      <div className="grid gap-4">
        {sessions.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center h-64">
              <Smartphone className="h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold mb-2">Nenhuma sessão encontrada</h3>
              <p className="text-muted-foreground text-center mb-4">
                Crie sua primeira conexão do WhatsApp para começar o atendimento
              </p>
              <Button onClick={() => setShowCreateDialog(true)}>
                <Plus className="w-4 h-4 mr-2" />
                Criar Primeira Conexão
              </Button>
            </CardContent>
          </Card>
        ) : (
          sessions.map((session) => (
            <Card key={session.id}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    {getStatusIcon(session.status)}
                    <div>
                      <CardTitle className="text-lg">{session.name}</CardTitle>
                      <CardDescription>
                        {session.phone ? `Conectado: ${session.phone}` : 'Aguardando conexão'}
                      </CardDescription>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Badge 
                      variant={session.status === 'CONNECTED' ? 'default' : 'secondary'}
                      className={`${
                        session.status === 'CONNECTED' ? 'bg-green-100 text-green-700' :
                        session.status === 'ERROR' ? 'bg-red-100 text-red-700' :
                        session.status === 'QR_PENDING' ? 'bg-orange-100 text-orange-700' :
                        'bg-gray-100 text-gray-700'
                      }`}
                    >
                      {getSessionStatusLabel(session.status)}
                    </Badge>
                    
                    {session.isActive ? (
                      <Power className="h-4 w-4 text-green-500" />
                    ) : (
                      <PowerOff className="h-4 w-4 text-gray-500" />
                    )}
                  </div>
                </div>
              </CardHeader>
              
              <CardContent>
                <div className="space-y-4">
                  {/* Informações da sessão */}
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-muted-foreground">Criado por:</span>
                      <p className="font-medium">{session.createdBy.name}</p>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Organização:</span>
                      <p className="font-medium">{session.organization.name}</p>
                    </div>
                    {session.lastConnected && (
                      <div>
                        <span className="text-muted-foreground">Última conexão:</span>
                        <p className="font-medium">
                          {new Date(session.lastConnected).toLocaleString('pt-BR')}
                        </p>
                      </div>
                    )}
                    <div>
                      <span className="text-muted-foreground">Status:</span>
                      <p className="font-medium">{session.isActive ? 'Ativa' : 'Inativa'}</p>
                    </div>
                  </div>

                  <Separator />

                  {/* Ações */}
                  <div className="flex items-center justify-between">
                    <div className="flex space-x-2">
                      {sessionNeedsQRCode(session) && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleGetQRCode(session)}
                        >
                          <QrCode className="w-4 h-4 mr-2" />
                          Ver QR Code
                        </Button>
                      )}
                      
                      {canReconnectSession(session) && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleReconnect(session)}
                        >
                          <RefreshCw className="w-4 h-4 mr-2" />
                          Reconectar
                        </Button>
                      )}
                      
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleToggleSession(session)}
                      >
                        {session.isActive ? (
                          <>
                            <PowerOff className="w-4 h-4 mr-2" />
                            Desativar
                          </>
                        ) : (
                          <>
                            <Power className="w-4 h-4 mr-2" />
                            Ativar
                          </>
                        )}
                      </Button>
                    </div>
                    
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => handleDeleteSession(session)}
                    >
                      <Trash2 className="w-4 h-4 mr-2" />
                      Excluir
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {/* Dialog do QR Code */}
      <Dialog open={showQRDialog} onOpenChange={setShowQRDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Conectar WhatsApp</DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4">
            {selectedSession && (
              <Alert>
                <QrCode className="h-4 w-4" />
                <AlertDescription>
                  Escaneie o QR Code abaixo com o WhatsApp da sessão "{selectedSession.name}"
                </AlertDescription>
              </Alert>
            )}
            
            <div className="flex justify-center">
              {qrLoading ? (
                <div className="flex flex-col items-center space-y-4">
                  <Loader2 className="h-8 w-8 animate-spin" />
                  <p className="text-muted-foreground">Gerando QR Code...</p>
                </div>
              ) : qrCodeData ? (
                <div className="flex flex-col items-center space-y-4">
                  <img 
                    src={qrCodeData} 
                    alt="QR Code WhatsApp" 
                    className="w-64 h-64 border rounded-lg"
                  />
                  <p className="text-sm text-muted-foreground text-center">
                    1. Abra o WhatsApp no seu telefone<br />
                    2. Toque em Configurações &gt; Aparelhos conectados<br />
                    3. Toque em "Conectar um aparelho"<br />
                    4. Aponte seu telefone para esta tela para capturar o código
                  </p>
                </div>
              ) : (
                <div className="text-center">
                  <AlertCircle className="h-8 w-8 text-red-500 mx-auto mb-2" />
                  <p className="text-muted-foreground">Erro ao gerar QR Code</p>
                </div>
              )}
            </div>
            
            <div className="flex justify-end">
              <Button
                variant="outline"
                onClick={() => {
                  setShowQRDialog(false)
                  setQrCodeData(null)
                  setSelectedSession(null)
                }}
              >
                Fechar
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
