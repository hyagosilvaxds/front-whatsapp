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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Settings,
  Clock,
  MessageSquare,
  Users,
  Calendar,
  BarChart3,
  Zap,
  Shield,
  Info,
  Save,
  RotateCcw,
  AlertTriangle,
  CheckCircle
} from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { updateCampaign, Campaign } from "@/lib/api/warmup";

interface WarmupSettingsProps {
  campaign: Campaign;
  onUpdate?: (campaign: Campaign) => void;
}

export default function WarmupSettings({ campaign, onUpdate }: WarmupSettingsProps) {
  const [settings, setSettings] = useState({
    // Básicas
    name: campaign.name,
    description: campaign.description || "",
    dailyMessageGoal: campaign.dailyMessageGoal,
    
    // Conversas Internas
    enableInternalConversations: campaign.enableInternalConversations,
    internalConversationRatio: campaign.internalConversationRatio,
    
    // Intervalos
    minIntervalMinutes: campaign.minIntervalMinutes,
    maxIntervalMinutes: campaign.maxIntervalMinutes,
    randomizeInterval: campaign.randomizeInterval,
    
    // Horário de Funcionamento
    useWorkingHours: campaign.useWorkingHours,
    workingHourStart: campaign.workingHourStart,
    workingHourEnd: campaign.workingHourEnd,
    allowWeekends: campaign.allowWeekends,
    
    // Configurações Avançadas
    isActive: campaign.isActive,
  });

  const [hasChanges, setHasChanges] = useState(false);
  const [saving, setSaving] = useState(false);

  // Detectar mudanças
  useEffect(() => {
    const originalSettings = {
      name: campaign.name,
      description: campaign.description || "",
      dailyMessageGoal: campaign.dailyMessageGoal,
      enableInternalConversations: campaign.enableInternalConversations,
      internalConversationRatio: campaign.internalConversationRatio,
      minIntervalMinutes: campaign.minIntervalMinutes,
      maxIntervalMinutes: campaign.maxIntervalMinutes,
      randomizeInterval: campaign.randomizeInterval,
      useWorkingHours: campaign.useWorkingHours,
      workingHourStart: campaign.workingHourStart,
      workingHourEnd: campaign.workingHourEnd,
      allowWeekends: campaign.allowWeekends,
      isActive: campaign.isActive,
    };

    const changed = JSON.stringify(settings) !== JSON.stringify(originalSettings);
    setHasChanges(changed);
  }, [settings, campaign]);

  const handleSave = async () => {
    try {
      setSaving(true);
      
      // Validações
      if (!settings.name.trim()) {
        toast({
          title: "Erro",
          description: "Nome da campanha é obrigatório",
          variant: "destructive",
        });
        return;
      }

      if (settings.dailyMessageGoal < 1 || settings.dailyMessageGoal > 100) {
        toast({
          title: "Erro",
          description: "Meta diária deve estar entre 1 e 100 mensagens",
          variant: "destructive",
        });
        return;
      }

      if (settings.minIntervalMinutes >= settings.maxIntervalMinutes) {
        toast({
          title: "Erro",
          description: "Intervalo mínimo deve ser menor que o máximo",
          variant: "destructive",
        });
        return;
      }

      const updatedCampaign = await updateCampaign(campaign.id, settings);
      
      toast({
        title: "Sucesso",
        description: "Configurações salvas com sucesso",
      });

      onUpdate?.(updatedCampaign);
      setHasChanges(false);
    } catch (error) {
      console.error("Erro ao salvar configurações:", error);
      toast({
        title: "Erro",
        description: "Falha ao salvar configurações",
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  const handleReset = () => {
    setSettings({
      name: campaign.name,
      description: campaign.description || "",
      dailyMessageGoal: campaign.dailyMessageGoal,
      enableInternalConversations: campaign.enableInternalConversations,
      internalConversationRatio: campaign.internalConversationRatio,
      minIntervalMinutes: campaign.minIntervalMinutes,
      maxIntervalMinutes: campaign.maxIntervalMinutes,
      randomizeInterval: campaign.randomizeInterval,
      useWorkingHours: campaign.useWorkingHours,
      workingHourStart: campaign.workingHourStart,
      workingHourEnd: campaign.workingHourEnd,
      allowWeekends: campaign.allowWeekends,
      isActive: campaign.isActive,
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold flex items-center gap-2">
            <Settings className="h-5 w-5" />
            Configurações da Campanha
          </h3>
          <p className="text-sm text-muted-foreground">
            Ajuste os parâmetros de aquecimento para otimizar os resultados
          </p>
        </div>
        <div className="flex items-center gap-2">
          {hasChanges && (
            <Button variant="outline" onClick={handleReset}>
              <RotateCcw className="h-4 w-4 mr-2" />
              Desfazer
            </Button>
          )}
          <Button onClick={handleSave} disabled={!hasChanges || saving}>
            <Save className="h-4 w-4 mr-2" />
            {saving ? "Salvando..." : "Salvar"}
          </Button>
        </div>
      </div>

      {hasChanges && (
        <Alert>
          <Info className="h-4 w-4" />
          <AlertDescription>
            Você tem alterações não salvas. Clique em "Salvar" para aplicar as mudanças.
          </AlertDescription>
        </Alert>
      )}

      <Tabs defaultValue="basic" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="basic">Básico</TabsTrigger>
          <TabsTrigger value="internal">Conversas Internas</TabsTrigger>
          <TabsTrigger value="timing">Horários</TabsTrigger>
          <TabsTrigger value="advanced">Avançado</TabsTrigger>
        </TabsList>

        {/* Tab Básico */}
        <TabsContent value="basic" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MessageSquare className="h-4 w-4" />
                Informações Básicas
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="campaign-name">Nome da Campanha</Label>
                <Input
                  id="campaign-name"
                  value={settings.name}
                  onChange={(e) => setSettings({ ...settings, name: e.target.value })}
                  placeholder="Nome da campanha"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="campaign-description">Descrição</Label>
                <Textarea
                  id="campaign-description"
                  value={settings.description}
                  onChange={(e) => setSettings({ ...settings, description: e.target.value })}
                  placeholder="Descreva o objetivo desta campanha..."
                  rows={3}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="daily-goal">
                  Meta Diária de Mensagens: {settings.dailyMessageGoal}
                </Label>
                <Slider
                  value={[settings.dailyMessageGoal]}
                  onValueChange={(value) => setSettings({ ...settings, dailyMessageGoal: value[0] })}
                  max={100}
                  min={1}
                  step={1}
                  className="w-full"
                />
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>1 mensagem</span>
                  <span>100 mensagens</span>
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <Switch
                  id="campaign-active"
                  checked={settings.isActive}
                  onCheckedChange={(checked) => setSettings({ ...settings, isActive: checked })}
                />
                <Label htmlFor="campaign-active">
                  Campanha ativa
                </Label>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Tab Conversas Internas */}
        <TabsContent value="internal" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-4 w-4" />
                Configurações de Conversas Internas
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center space-x-2">
                <Switch
                  id="enable-internal"
                  checked={settings.enableInternalConversations}
                  onCheckedChange={(checked) => 
                    setSettings({ ...settings, enableInternalConversations: checked })
                  }
                />
                <Label htmlFor="enable-internal">
                  Habilitar conversas entre sessões
                </Label>
              </div>

              {settings.enableInternalConversations && (
                <div className="space-y-4 pl-6 border-l-2 border-muted">
                  <Alert>
                    <Info className="h-4 w-4" />
                    <AlertDescription>
                      Conversas internas simulam interações naturais entre suas próprias sessões, 
                      melhorando a reputação dos números. Recomendado: 15-25% do total.
                    </AlertDescription>
                  </Alert>

                  <div className="space-y-2">
                    <Label>
                      Proporção de Conversas Internas: {Math.round(settings.internalConversationRatio * 100)}%
                    </Label>
                    <Slider
                      value={[settings.internalConversationRatio]}
                      onValueChange={(value) => 
                        setSettings({ ...settings, internalConversationRatio: value[0] })
                      }
                      max={0.5}
                      min={0.1}
                      step={0.05}
                      className="w-full"
                    />
                    <div className="flex justify-between text-xs text-muted-foreground">
                      <span>10% (Mínimo)</span>
                      <span>50% (Máximo)</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-4 text-center">
                    <div className="p-3 bg-green-50 rounded border">
                      <Badge variant="outline" className="text-green-600 border-green-600">
                        Recomendado
                      </Badge>
                      <p className="text-sm mt-1">15-25%</p>
                      <p className="text-xs text-muted-foreground">Equilibrio ideal</p>
                    </div>
                    <div className="p-3 bg-yellow-50 rounded border">
                      <Badge variant="outline" className="text-yellow-600 border-yellow-600">
                        Atenção
                      </Badge>
                      <p className="text-sm mt-1">10-15% ou 25-35%</p>
                      <p className="text-xs text-muted-foreground">Monitore resultados</p>
                    </div>
                    <div className="p-3 bg-red-50 rounded border">
                      <Badge variant="outline" className="text-red-600 border-red-600">
                        Evitar
                      </Badge>
                      <p className="text-sm mt-1">&lt;10% ou &gt;35%</p>
                      <p className="text-xs text-muted-foreground">Pode prejudicar</p>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Tab Horários */}
        <TabsContent value="timing" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-4 w-4" />
                Configurações de Tempo
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Intervalos */}
              <div className="space-y-4">
                <h4 className="font-medium">Intervalos entre Mensagens</h4>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="min-interval">Intervalo Mínimo (minutos)</Label>
                    <Input
                      id="min-interval"
                      type="number"
                      min="5"
                      max="120"
                      value={settings.minIntervalMinutes}
                      onChange={(e) => setSettings({ 
                        ...settings, 
                        minIntervalMinutes: parseInt(e.target.value) || 5 
                      })}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="max-interval">Intervalo Máximo (minutos)</Label>
                    <Input
                      id="max-interval"
                      type="number"
                      min="10"
                      max="180"
                      value={settings.maxIntervalMinutes}
                      onChange={(e) => setSettings({ 
                        ...settings, 
                        maxIntervalMinutes: parseInt(e.target.value) || 45 
                      })}
                    />
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <Switch
                    id="randomize"
                    checked={settings.randomizeInterval}
                    onCheckedChange={(checked) => 
                      setSettings({ ...settings, randomizeInterval: checked })
                    }
                  />
                  <Label htmlFor="randomize">
                    Randomizar intervalos (recomendado)
                  </Label>
                </div>

                <Alert>
                  <Info className="h-4 w-4" />
                  <AlertDescription>
                    Intervalos aleatórios tornam o comportamento mais natural. 
                    Use intervalos maiores para números novos ou sensíveis.
                  </AlertDescription>
                </Alert>
              </div>

              <Separator />

              {/* Horário Comercial */}
              <div className="space-y-4">
                <h4 className="font-medium">Horário de Funcionamento</h4>
                
                <div className="flex items-center space-x-2">
                  <Switch
                    id="working-hours"
                    checked={settings.useWorkingHours}
                    onCheckedChange={(checked) => 
                      setSettings({ ...settings, useWorkingHours: checked })
                    }
                  />
                  <Label htmlFor="working-hours">
                    Respeitar horário comercial
                  </Label>
                </div>

                {settings.useWorkingHours && (
                  <div className="space-y-4 pl-6 border-l-2 border-muted">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="start-hour">Horário de Início</Label>
                        <Select
                          value={settings.workingHourStart.toString()}
                          onValueChange={(value) => 
                            setSettings({ ...settings, workingHourStart: parseInt(value) })
                          }
                        >
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
                        <Label htmlFor="end-hour">Horário de Término</Label>
                        <Select
                          value={settings.workingHourEnd.toString()}
                          onValueChange={(value) => 
                            setSettings({ ...settings, workingHourEnd: parseInt(value) })
                          }
                        >
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

                    <div className="flex items-center space-x-2">
                      <Switch
                        id="weekends"
                        checked={settings.allowWeekends}
                        onCheckedChange={(checked) => 
                          setSettings({ ...settings, allowWeekends: checked })
                        }
                      />
                      <Label htmlFor="weekends">
                        Permitir envios nos fins de semana
                      </Label>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Tab Avançado */}
        <TabsContent value="advanced" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-4 w-4" />
                Configurações Avançadas
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <Alert>
                <AlertTriangle className="h-4 w-4" />
                <AlertDescription>
                  Estas configurações afetam diretamente o comportamento da campanha. 
                  Altere apenas se você entende as implicações.
                </AlertDescription>
              </Alert>

              {/* Resumo das Configurações */}
              <div className="space-y-4">
                <h4 className="font-medium">Resumo da Configuração</h4>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Volume Diário</Label>
                    <div className="text-lg font-bold">{settings.dailyMessageGoal} mensagens/dia</div>
                    <p className="text-xs text-muted-foreground">
                      {Math.round(settings.dailyMessageGoal * settings.internalConversationRatio)} internas + {" "}
                      {Math.round(settings.dailyMessageGoal * (1 - settings.internalConversationRatio))} externas
                    </p>
                  </div>

                  <div className="space-y-2">
                    <Label>Frequência Estimada</Label>
                    <div className="text-lg font-bold">
                      {Math.round((settings.minIntervalMinutes + settings.maxIntervalMinutes) / 2)} min/msg
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Intervalo médio entre mensagens
                    </p>
                  </div>

                  <div className="space-y-2">
                    <Label>Período Ativo</Label>
                    <div className="text-lg font-bold">
                      {settings.useWorkingHours 
                        ? `${settings.workingHourStart}h às ${settings.workingHourEnd}h`
                        : "24h"
                      }
                    </div>
                    <p className="text-xs text-muted-foreground">
                      {settings.allowWeekends ? "Todos os dias" : "Segunda a sexta"}
                    </p>
                  </div>

                  <div className="space-y-2">
                    <Label>Conversas Internas</Label>
                    <div className="text-lg font-bold">
                      {settings.enableInternalConversations 
                        ? `${Math.round(settings.internalConversationRatio * 100)}%`
                        : "Desabilitadas"
                      }
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Proporção do total de conversas
                    </p>
                  </div>
                </div>
              </div>

              <Separator />

              {/* Validações e Alertas */}
              <div className="space-y-3">
                <h4 className="font-medium">Validações</h4>
                
                <div className="space-y-2">
                  {settings.minIntervalMinutes >= settings.maxIntervalMinutes && (
                    <Alert className="border-red-200">
                      <AlertTriangle className="h-4 w-4 text-red-600" />
                      <AlertDescription className="text-red-700">
                        Intervalo mínimo deve ser menor que o máximo
                      </AlertDescription>
                    </Alert>
                  )}

                  {settings.dailyMessageGoal > 50 && (
                    <Alert className="border-yellow-200">
                      <AlertTriangle className="h-4 w-4 text-yellow-600" />
                      <AlertDescription className="text-yellow-700">
                        Volume alto de mensagens pode afetar a saúde das sessões
                      </AlertDescription>
                    </Alert>
                  )}

                  {settings.enableInternalConversations && settings.internalConversationRatio > 0.35 && (
                    <Alert className="border-yellow-200">
                      <AlertTriangle className="h-4 w-4 text-yellow-600" />
                      <AlertDescription className="text-yellow-700">
                        Proporção muito alta de conversas internas pode parecer artificial
                      </AlertDescription>
                    </Alert>
                  )}

                  {settings.minIntervalMinutes < 10 && (
                    <Alert className="border-yellow-200">
                      <AlertTriangle className="h-4 w-4 text-yellow-600" />
                      <AlertDescription className="text-yellow-700">
                        Intervalos muito baixos podem ser detectados como spam
                      </AlertDescription>
                    </Alert>
                  )}

                  {!settings.randomizeInterval && (
                    <Alert className="border-blue-200">
                      <Info className="h-4 w-4 text-blue-600" />
                      <AlertDescription className="text-blue-700">
                        Recomendamos manter a randomização para comportamento mais natural
                      </AlertDescription>
                    </Alert>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
