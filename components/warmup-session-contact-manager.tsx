"use client";

import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Plus,
  Trash2,
  Users,
  Phone,
  Activity,
  Heart,
  MessageSquare,
  Search,
  Filter,
  UserPlus,
  AlertCircle,
  CheckCircle,
  Clock
} from "lucide-react";
import { toast } from "@/hooks/use-toast";
import {
  getCampaignSessions,
  getCampaignContacts,
  addSessionsToCampaign,
  removeSessionFromCampaign,
  addContactsToCampaign,
  CampaignSession,
  CampaignContact
} from "@/lib/api/warmup";

interface SessionContactManagerProps {
  campaignId: string;
  onUpdate?: () => void;
}

export default function SessionContactManager({ campaignId, onUpdate }: SessionContactManagerProps) {
  const [sessions, setSessions] = useState<CampaignSession[]>([]);
  const [contacts, setContacts] = useState<CampaignContact[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Estados para modais
  const [addSessionDialogOpen, setAddSessionDialogOpen] = useState(false);
  const [addContactDialogOpen, setAddContactDialogOpen] = useState(false);
  
  // Estados para filtros
  const [sessionSearch, setSessionSearch] = useState("");
  const [contactSearch, setContactSearch] = useState("");
  const [sessionStatusFilter, setSessionStatusFilter] = useState("all");
  const [healthFilter, setHealthFilter] = useState("all");

  // Estados para seleção múltipla
  const [selectedSessions, setSelectedSessions] = useState<string[]>([]);
  const [selectedContacts, setSelectedContacts] = useState<string[]>([]);

  // Mock data para sessões disponíveis (normalmente viria de uma API)
  const [availableSessions] = useState([
    { id: "session_1", name: "Vendas Principal", phone: "+55 11 99999-0001", isConnected: true },
    { id: "session_2", name: "Atendimento", phone: "+55 11 99999-0002", isConnected: true },
    { id: "session_3", name: "Marketing", phone: "+55 11 99999-0003", isConnected: false },
    { id: "session_4", name: "Suporte", phone: "+55 11 99999-0004", isConnected: true },
  ]);

  // Mock data para contatos disponíveis
  const [availableContacts] = useState([
    { id: "contact_1", name: "João Silva", phone: "+55 11 88888-0001" },
    { id: "contact_2", name: "Maria Santos", phone: "+55 11 88888-0002" },
    { id: "contact_3", name: "Pedro Oliveira", phone: "+55 11 88888-0003" },
    { id: "contact_4", name: "Ana Costa", phone: "+55 11 88888-0004" },
    { id: "contact_5", name: "Carlos Pereira", phone: "+55 11 88888-0005" },
  ]);

  useEffect(() => {
    loadData();
  }, [campaignId]);

  const loadData = async () => {
    try {
      setLoading(true);
      const [sessionsData, contactsData] = await Promise.all([
        getCampaignSessions(campaignId),
        getCampaignContacts(campaignId)
      ]);
      
      setSessions(sessionsData.data || []);
      setContacts(contactsData.data || []);
    } catch (error) {
      console.error("Erro ao carregar dados:", error);
      toast({
        title: "Erro",
        description: "Falha ao carregar sessões e contatos",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleAddSessions = async () => {
    if (selectedSessions.length === 0) {
      toast({
        title: "Erro",
        description: "Selecione pelo menos uma sessão",
        variant: "destructive",
      });
      return;
    }

    try {
      await addSessionsToCampaign(campaignId, selectedSessions);
      toast({
        title: "Sucesso",
        description: `${selectedSessions.length} sessão(ões) adicionada(s) com sucesso`,
      });
      
      setAddSessionDialogOpen(false);
      setSelectedSessions([]);
      await loadData();
      onUpdate?.();
    } catch (error) {
      console.error("Erro ao adicionar sessões:", error);
      toast({
        title: "Erro",
        description: "Falha ao adicionar sessões",
        variant: "destructive",
      });
    }
  };

  const handleRemoveSession = async (sessionId: string) => {
    try {
      await removeSessionFromCampaign(campaignId, sessionId);
      toast({
        title: "Sucesso",
        description: "Sessão removida com sucesso",
      });
      
      await loadData();
      onUpdate?.();
    } catch (error) {
      console.error("Erro ao remover sessão:", error);
      toast({
        title: "Erro",
        description: "Falha ao remover sessão",
        variant: "destructive",
      });
    }
  };

  const handleAddContacts = async () => {
    if (selectedContacts.length === 0) {
      toast({
        title: "Erro",
        description: "Selecione pelo menos um contato",
        variant: "destructive",
      });
      return;
    }

    try {
      await addContactsToCampaign(campaignId, { contactIds: selectedContacts });
      toast({
        title: "Sucesso",
        description: `${selectedContacts.length} contato(s) adicionado(s) com sucesso`,
      });
      
      setAddContactDialogOpen(false);
      setSelectedContacts([]);
      await loadData();
      onUpdate?.();
    } catch (error) {
      console.error("Erro ao adicionar contatos:", error);
      toast({
        title: "Erro",
        description: "Falha ao adicionar contatos",
        variant: "destructive",
      });
    }
  };

  const getHealthColor = (health: number) => {
    if (health >= 80) return "text-green-500";
    if (health >= 60) return "text-yellow-500";
    return "text-red-500";
  };

  const getHealthIcon = (health: number) => {
    if (health >= 80) return <CheckCircle className="h-4 w-4 text-green-500" />;
    if (health >= 60) return <AlertCircle className="h-4 w-4 text-yellow-500" />;
    return <AlertCircle className="h-4 w-4 text-red-500" />;
  };

  const filteredSessions = sessions.filter(session => {
    const matchesSearch = session.sessionName.toLowerCase().includes(sessionSearch.toLowerCase());
    const matchesStatus = sessionStatusFilter === "all" || 
      (sessionStatusFilter === "active" && session.isActive) ||
      (sessionStatusFilter === "inactive" && !session.isActive);
    const matchesHealth = healthFilter === "all" ||
      (healthFilter === "healthy" && session.healthScore >= 80) ||
      (healthFilter === "warning" && session.healthScore >= 60 && session.healthScore < 80) ||
      (healthFilter === "danger" && session.healthScore < 60);
    
    return matchesSearch && matchesStatus && matchesHealth;
  });

  const filteredContacts = contacts.filter(contact =>
    contact.contactName.toLowerCase().includes(contactSearch.toLowerCase()) ||
    contact.contactPhone.includes(contactSearch)
  );

  const availableSessionsToAdd = availableSessions.filter(session =>
    !sessions.some(s => s.sessionId === session.id) && session.isConnected
  );

  const availableContactsToAdd = availableContacts.filter(contact =>
    !contacts.some(c => c.contactId === contact.id)
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto"></div>
          <p className="mt-2 text-sm text-gray-600">Carregando dados...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Tabs defaultValue="sessions" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="sessions" className="flex items-center gap-2">
            <Phone className="h-4 w-4" />
            Sessões ({sessions.length})
          </TabsTrigger>
          <TabsTrigger value="contacts" className="flex items-center gap-2">
            <Users className="h-4 w-4" />
            Contatos ({contacts.length})
          </TabsTrigger>
        </TabsList>

        {/* Tab de Sessões */}
        <TabsContent value="sessions" className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="relative">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Buscar sessões..."
                  value={sessionSearch}
                  onChange={(e) => setSessionSearch(e.target.value)}
                  className="pl-8 w-[300px]"
                />
              </div>
              <Select value={sessionStatusFilter} onValueChange={setSessionStatusFilter}>
                <SelectTrigger className="w-[140px]">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos</SelectItem>
                  <SelectItem value="active">Ativas</SelectItem>
                  <SelectItem value="inactive">Inativas</SelectItem>
                </SelectContent>
              </Select>
              <Select value={healthFilter} onValueChange={setHealthFilter}>
                <SelectTrigger className="w-[140px]">
                  <SelectValue placeholder="Saúde" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todas</SelectItem>
                  <SelectItem value="healthy">Saudáveis</SelectItem>
                  <SelectItem value="warning">Atenção</SelectItem>
                  <SelectItem value="danger">Risco</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <Dialog open={addSessionDialogOpen} onOpenChange={setAddSessionDialogOpen}>
              <DialogTrigger asChild>
                <Button disabled={availableSessionsToAdd.length === 0}>
                  <Plus className="h-4 w-4 mr-2" />
                  Adicionar Sessões
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Adicionar Sessões à Campanha</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  {availableSessionsToAdd.length === 0 ? (
                    <p className="text-muted-foreground text-center py-4">
                      Nenhuma sessão disponível para adicionar
                    </p>
                  ) : (
                    <>
                      <p className="text-sm text-muted-foreground">
                        Selecione as sessões que deseja adicionar à campanha:
                      </p>
                      <ScrollArea className="max-h-[300px]">
                        <div className="space-y-2">
                          {availableSessionsToAdd.map((session) => (
                            <div key={session.id} className="flex items-center space-x-2 p-2 border rounded">
                              <Checkbox
                                id={session.id}
                                checked={selectedSessions.includes(session.id)}
                                onCheckedChange={(checked) => {
                                  if (checked) {
                                    setSelectedSessions([...selectedSessions, session.id]);
                                  } else {
                                    setSelectedSessions(selectedSessions.filter(id => id !== session.id));
                                  }
                                }}
                              />
                              <Label htmlFor={session.id} className="flex-1 cursor-pointer">
                                <div className="flex items-center justify-between">
                                  <div>
                                    <p className="font-medium">{session.name}</p>
                                    <p className="text-sm text-muted-foreground">{session.phone}</p>
                                  </div>
                                  <Badge variant="outline" className="text-green-600">
                                    Conectada
                                  </Badge>
                                </div>
                              </Label>
                            </div>
                          ))}
                        </div>
                      </ScrollArea>
                      <div className="flex justify-end gap-2">
                        <Button variant="outline" onClick={() => {
                          setAddSessionDialogOpen(false);
                          setSelectedSessions([]);
                        }}>
                          Cancelar
                        </Button>
                        <Button onClick={handleAddSessions} disabled={selectedSessions.length === 0}>
                          Adicionar {selectedSessions.length} Sessão(ões)
                        </Button>
                      </div>
                    </>
                  )}
                </div>
              </DialogContent>
            </Dialog>
          </div>

          {/* Lista de Sessões */}
          {filteredSessions.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12">
                <Phone className="h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="text-lg font-semibold mb-2">Nenhuma sessão encontrada</h3>
                <p className="text-muted-foreground text-center mb-4">
                  {sessions.length === 0 
                    ? "Adicione sessões WhatsApp para começar a campanha"
                    : "Tente ajustar os filtros para encontrar sessões"
                  }
                </p>
                {sessions.length === 0 && availableSessionsToAdd.length > 0 && (
                  <Button onClick={() => setAddSessionDialogOpen(true)}>
                    <Plus className="h-4 w-4 mr-2" />
                    Adicionar Primeira Sessão
                  </Button>
                )}
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-4">
              {filteredSessions.map((session) => (
                <Card key={session.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="flex flex-col items-center">
                          {getHealthIcon(session.healthScore)}
                          <span className={`text-xs font-medium ${getHealthColor(session.healthScore)}`}>
                            {session.healthScore}%
                          </span>
                        </div>
                        <div>
                          <h4 className="font-semibold">{session.sessionName}</h4>
                          <p className="text-sm text-muted-foreground">{session.sessionId}</p>
                          <div className="flex items-center gap-4 mt-1">
                            <div className="flex items-center gap-1">
                              <MessageSquare className="h-3 w-3" />
                              <span className="text-xs">{session.messagesSentToday} hoje</span>
                            </div>
                            {session.lastMessageAt && (
                              <div className="flex items-center gap-1">
                                <Clock className="h-3 w-3" />
                                <span className="text-xs">
                                  {new Date(session.lastMessageAt).toLocaleString("pt-BR")}
                                </span>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant={session.isActive ? "default" : "secondary"}>
                          {session.isActive ? "Ativa" : "Inativa"}
                        </Badge>
                        <Badge variant="outline">
                          Prioridade: {session.priority}
                        </Badge>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => handleRemoveSession(session.sessionId)}
                          className="text-red-500 hover:text-red-700"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        {/* Tab de Contatos */}
        <TabsContent value="contacts" className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="relative">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar contatos..."
                value={contactSearch}
                onChange={(e) => setContactSearch(e.target.value)}
                className="pl-8 w-[300px]"
              />
            </div>
            
            <Dialog open={addContactDialogOpen} onOpenChange={setAddContactDialogOpen}>
              <DialogTrigger asChild>
                <Button disabled={availableContactsToAdd.length === 0}>
                  <UserPlus className="h-4 w-4 mr-2" />
                  Adicionar Contatos
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle>Adicionar Contatos à Campanha</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  {availableContactsToAdd.length === 0 ? (
                    <p className="text-muted-foreground text-center py-4">
                      Nenhum contato disponível para adicionar
                    </p>
                  ) : (
                    <>
                      <div className="flex items-center justify-between">
                        <p className="text-sm text-muted-foreground">
                          Selecione os contatos que deseja adicionar à campanha:
                        </p>
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => setSelectedContacts(availableContactsToAdd.map(c => c.id))}
                          >
                            Selecionar Todos
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => setSelectedContacts([])}
                          >
                            Limpar Seleção
                          </Button>
                        </div>
                      </div>
                      <ScrollArea className="max-h-[400px]">
                        <div className="grid grid-cols-2 gap-2">
                          {availableContactsToAdd.map((contact) => (
                            <div key={contact.id} className="flex items-center space-x-2 p-2 border rounded">
                              <Checkbox
                                id={contact.id}
                                checked={selectedContacts.includes(contact.id)}
                                onCheckedChange={(checked) => {
                                  if (checked) {
                                    setSelectedContacts([...selectedContacts, contact.id]);
                                  } else {
                                    setSelectedContacts(selectedContacts.filter(id => id !== contact.id));
                                  }
                                }}
                              />
                              <Label htmlFor={contact.id} className="flex-1 cursor-pointer">
                                <div>
                                  <p className="font-medium text-sm">{contact.name}</p>
                                  <p className="text-xs text-muted-foreground">{contact.phone}</p>
                                </div>
                              </Label>
                            </div>
                          ))}
                        </div>
                      </ScrollArea>
                      <div className="flex justify-end gap-2">
                        <Button variant="outline" onClick={() => {
                          setAddContactDialogOpen(false);
                          setSelectedContacts([]);
                        }}>
                          Cancelar
                        </Button>
                        <Button onClick={handleAddContacts} disabled={selectedContacts.length === 0}>
                          Adicionar {selectedContacts.length} Contato(s)
                        </Button>
                      </div>
                    </>
                  )}
                </div>
              </DialogContent>
            </Dialog>
          </div>

          {/* Lista de Contatos */}
          {filteredContacts.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12">
                <Users className="h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="text-lg font-semibold mb-2">Nenhum contato encontrado</h3>
                <p className="text-muted-foreground text-center mb-4">
                  {contacts.length === 0 
                    ? "Adicione contatos para que as sessões possam enviar mensagens"
                    : "Tente ajustar o termo de busca"
                  }
                </p>
                {contacts.length === 0 && availableContactsToAdd.length > 0 && (
                  <Button onClick={() => setAddContactDialogOpen(true)}>
                    <UserPlus className="h-4 w-4 mr-2" />
                    Adicionar Primeiros Contatos
                  </Button>
                )}
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-4">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Nome</TableHead>
                    <TableHead>Telefone</TableHead>
                    <TableHead>Prioridade</TableHead>
                    <TableHead>Mensagens Enviadas</TableHead>
                    <TableHead>Última Mensagem</TableHead>
                    <TableHead className="w-[100px]">Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredContacts.map((contact) => (
                    <TableRow key={contact.id}>
                      <TableCell className="font-medium">{contact.contactName}</TableCell>
                      <TableCell>{contact.contactPhone}</TableCell>
                      <TableCell>
                        <Badge variant="outline">
                          {contact.priority}
                        </Badge>
                      </TableCell>
                      <TableCell>{contact.messagesSent}</TableCell>
                      <TableCell>
                        {contact.lastMessageAt 
                          ? new Date(contact.lastMessageAt).toLocaleString("pt-BR", {
                              day: "2-digit",
                              month: "2-digit",
                              hour: "2-digit",
                              minute: "2-digit"
                            })
                          : "Nunca"
                        }
                      </TableCell>
                      <TableCell>
                        <Button
                          size="sm"
                          variant="ghost"
                          className="text-red-500 hover:text-red-700"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
