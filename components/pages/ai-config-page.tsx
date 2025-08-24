'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Switch } from '@/components/ui/switch'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Badge } from '@/components/ui/badge'
import { Slider } from '@/components/ui/slider'
import { Brain, Save, RefreshCw, TestTube, Settings, Bot, MessageSquare, Zap, Database, Plus } from 'lucide-react'
import { useToast } from '@/hooks/use-toast'

interface AIModel {
  id: string
  name: string
  provider: string
  maxTokens: number
  costPer1k: number
}

interface Prompt {
  id: string
  name: string
  content: string
  category: string
  isActive: boolean
}

export default function AIConfigPage() {
  const { toast } = useToast()
  
  const [aiModels] = useState<AIModel[]>([
    { id: 'gpt-4', name: 'GPT-4', provider: 'OpenAI', maxTokens: 8192, costPer1k: 0.03 },
    { id: 'gpt-3.5-turbo', name: 'GPT-3.5 Turbo', provider: 'OpenAI', maxTokens: 4096, costPer1k: 0.002 },
    { id: 'claude-3', name: 'Claude 3', provider: 'Anthropic', maxTokens: 200000, costPer1k: 0.015 },
    { id: 'gemini-pro', name: 'Gemini Pro', provider: 'Google', maxTokens: 30720, costPer1k: 0.001 }
  ])

  const [prompts, setPrompts] = useState<Prompt[]>([
    {
      id: '1',
      name: 'Atendimento Geral',
      content: 'Você é um assistente virtual especializado em atendimento ao cliente. Seja sempre educado, prestativo e objetivo. Responda de forma clara e concisa.',
      category: 'Atendimento',
      isActive: true
    },
    {
      id: '2',
      name: 'Vendas',
      content: 'Você é um consultor de vendas experiente. Seu objetivo é identificar as necessidades do cliente e oferecer soluções adequadas. Seja persuasivo mas não insistente.',
      category: 'Vendas',
      isActive: true
    },
    {
      id: '3',
      name: 'Suporte Técnico',
      content: 'Você é um especialista em suporte técnico. Ajude o cliente a resolver problemas de forma didática e passo a passo. Seja paciente e detalhado.',
      category: 'Suporte',
      isActive: false
    }
  ])

  const [config, setConfig] = useState({
    selectedModel: 'gpt-3.5-turbo',
    temperature: [0.7],
    maxTokens: [1000],
    apiKey: '',
    autoResponse: true,
    responseDelay: [2],
    contextWindow: [10],
    langchainEndpoint: '',
    useMemory: true,
    memoryK: [5]
  })

  const [newPrompt, setNewPrompt] = useState({
    name: '',
    content: '',
    category: 'Atendimento'
  })

  const handleSaveConfig = () => {
    toast({
      title: "Configurações salvas!",
      description: "As configurações da IA foram atualizadas com sucesso.",
    })
  }

  const handleTestConfig = () => {
    toast({
      title: "Testando configuração...",
      description: "Enviando mensagem de teste para validar as configurações.",
    })
    
    setTimeout(() => {
      toast({
        title: "Teste concluído!",
        description: "A IA respondeu corretamente com as configurações atuais.",
      })
    }, 3000)
  }

  const addPrompt = () => {
    if (!newPrompt.name.trim() || !newPrompt.content.trim()) return

    const prompt: Prompt = {
      id: Date.now().toString(),
      name: newPrompt.name,
      content: newPrompt.content,
      category: newPrompt.category,
      isActive: false
    }

    setPrompts(prev => [...prev, prompt])
    setNewPrompt({ name: '', content: '', category: 'Atendimento' })
    
    toast({
      title: "Prompt criado!",
      description: `O prompt "${newPrompt.name}" foi adicionado com sucesso.`,
    })
  }

  const togglePrompt = (promptId: string) => {
    setPrompts(prev => prev.map(p => 
      p.id === promptId ? { ...p, isActive: !p.isActive } : p
    ))
  }

  const deletePrompt = (promptId: string) => {
    setPrompts(prev => prev.filter(p => p.id !== promptId))
    toast({
      title: "Prompt removido",
      description: "O prompt foi excluído da lista.",
      variant: "destructive"
    })
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Configuração da IA</h1>
          <p className="text-muted-foreground mt-1">
            Configure modelos, prompts e parâmetros da inteligência artificial
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={handleTestConfig}>
            <TestTube className="h-4 w-4 mr-2" />
            Testar
          </Button>
          <Button onClick={handleSaveConfig}>
            <Save className="h-4 w-4 mr-2" />
            Salvar
          </Button>
        </div>
      </div>

      <Tabs defaultValue="models" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="models">
            <Bot className="h-4 w-4 mr-2" />
            Modelos
          </TabsTrigger>
          <TabsTrigger value="prompts">
            <MessageSquare className="h-4 w-4 mr-2" />
            Prompts
          </TabsTrigger>
          <TabsTrigger value="langchain">
            <Zap className="h-4 w-4 mr-2" />
            LangChain
          </TabsTrigger>
          <TabsTrigger value="advanced">
            <Settings className="h-4 w-4 mr-2" />
            Avançado
          </TabsTrigger>
        </TabsList>

        {/* Models Tab */}
        <TabsContent value="models" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Modelo de IA</CardTitle>
              <CardDescription>
                Selecione o modelo de inteligência artificial para processamento
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <Label>Modelo Ativo</Label>
                <Select value={config.selectedModel} onValueChange={(value) => setConfig(prev => ({ ...prev, selectedModel: value }))}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {aiModels.map((model) => (
                      <SelectItem key={model.id} value={model.id}>
                        <div className="flex items-center justify-between w-full">
                          <span>{model.name}</span>
                          <Badge variant="outline">{model.provider}</Badge>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label>Temperatura: {config.temperature[0]}</Label>
                  <Slider
                    value={config.temperature}
                    onValueChange={(value) => setConfig(prev => ({ ...prev, temperature: value }))}
                    min={0}
                    max={2}
                    step={0.1}
                    className="mt-2"
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    Controla a criatividade das respostas (0 = conservador, 2 = criativo)
                  </p>
                </div>

                <div>
                  <Label>Máximo de Tokens: {config.maxTokens[0]}</Label>
                  <Slider
                    value={config.maxTokens}
                    onValueChange={(value) => setConfig(prev => ({ ...prev, maxTokens: value }))}
                    min={100}
                    max={4000}
                    step={100}
                    className="mt-2"
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    Limita o tamanho máximo das respostas
                  </p>
                </div>
              </div>

              <div>
                <Label htmlFor="apiKey">Chave da API</Label>
                <Input
                  id="apiKey"
                  type="password"
                  placeholder="sk-..."
                  value={config.apiKey}
                  onChange={(e) => setConfig(prev => ({ ...prev, apiKey: e.target.value }))}
                />
              </div>
            </CardContent>
          </Card>

          {/* Model Comparison */}
          <Card>
            <CardHeader>
              <CardTitle>Comparação de Modelos</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left p-2">Modelo</th>
                      <th className="text-left p-2">Provider</th>
                      <th className="text-left p-2">Max Tokens</th>
                      <th className="text-left p-2">Custo/1k</th>
                    </tr>
                  </thead>
                  <tbody>
                    {aiModels.map((model) => (
                      <tr key={model.id} className="border-b">
                        <td className="p-2">{model.name}</td>
                        <td className="p-2">
                          <Badge variant="outline">{model.provider}</Badge>
                        </td>
                        <td className="p-2">{model.maxTokens.toLocaleString()}</td>
                        <td className="p-2">${model.costPer1k}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Prompts Tab */}
        <TabsContent value="prompts" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Criar Novo Prompt</CardTitle>
              <CardDescription>
                Adicione prompts personalizados para diferentes situações
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="promptName">Nome do Prompt</Label>
                  <Input
                    id="promptName"
                    placeholder="Ex: Atendimento VIP"
                    value={newPrompt.name}
                    onChange={(e) => setNewPrompt(prev => ({ ...prev, name: e.target.value }))}
                  />
                </div>
                <div>
                  <Label>Categoria</Label>
                  <Select value={newPrompt.category} onValueChange={(value) => setNewPrompt(prev => ({ ...prev, category: value }))}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Atendimento">Atendimento</SelectItem>
                      <SelectItem value="Vendas">Vendas</SelectItem>
                      <SelectItem value="Suporte">Suporte</SelectItem>
                      <SelectItem value="Marketing">Marketing</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div>
                <Label htmlFor="promptContent">Conteúdo do Prompt</Label>
                <Textarea
                  id="promptContent"
                  placeholder="Descreva como a IA deve se comportar..."
                  rows={4}
                  value={newPrompt.content}
                  onChange={(e) => setNewPrompt(prev => ({ ...prev, content: e.target.value }))}
                />
              </div>
              <Button onClick={addPrompt}>
                <Plus className="h-4 w-4 mr-2" />
                Adicionar Prompt
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Prompts Configurados</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {prompts.map((prompt) => (
                  <div key={prompt.id} className="border rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <h4 className="font-medium">{prompt.name}</h4>
                        <Badge variant="outline">{prompt.category}</Badge>
                        {prompt.isActive && <Badge variant="default">Ativo</Badge>}
                      </div>
                      <div className="flex items-center gap-2">
                        <Switch
                          checked={prompt.isActive}
                          onCheckedChange={() => togglePrompt(prompt.id)}
                        />
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => deletePrompt(prompt.id)}
                        >
                          Excluir
                        </Button>
                      </div>
                    </div>
                    <p className="text-sm text-muted-foreground">{prompt.content}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* LangChain Tab */}
        <TabsContent value="langchain" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Configuração LangChain</CardTitle>
              <CardDescription>
                Configure integração com LangChain para recursos avançados
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <Label htmlFor="langchainEndpoint">Endpoint LangChain</Label>
                <Input
                  id="langchainEndpoint"
                  placeholder="https://api.langchain.com/v1"
                  value={config.langchainEndpoint}
                  onChange={(e) => setConfig(prev => ({ ...prev, langchainEndpoint: e.target.value }))}
                />
              </div>

              <div className="flex items-center space-x-2">
                <Switch
                  id="useMemory"
                  checked={config.useMemory}
                  onCheckedChange={(checked) => setConfig(prev => ({ ...prev, useMemory: checked }))}
                />
                <Label htmlFor="useMemory">Habilitar Memória Conversacional</Label>
              </div>

              {config.useMemory && (
                <div>
                  <Label>Mensagens na Memória: {config.memoryK[0]}</Label>
                  <Slider
                    value={config.memoryK}
                    onValueChange={(value) => setConfig(prev => ({ ...prev, memoryK: value }))}
                    min={1}
                    max={20}
                    step={1}
                    className="mt-2"
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    Número de mensagens anteriores para manter em contexto
                  </p>
                </div>
              )}

              <div>
                <Label>Janela de Contexto: {config.contextWindow[0]} mensagens</Label>
                <Slider
                  value={config.contextWindow}
                  onValueChange={(value) => setConfig(prev => ({ ...prev, contextWindow: value }))}
                  min={1}
                  max={50}
                  step={1}
                  className="mt-2"
                />
                <p className="text-xs text-muted-foreground mt-1">
                  Quantas mensagens anteriores considerar para resposta
                </p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Ferramentas Ativadas</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center space-x-2">
                  <Switch id="search" defaultChecked />
                  <Label htmlFor="search">Busca na Web</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Switch id="calculator" defaultChecked />
                  <Label htmlFor="calculator">Calculadora</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Switch id="weather" />
                  <Label htmlFor="weather">Clima/Tempo</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Switch id="calendar" />
                  <Label htmlFor="calendar">Calendário</Label>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Advanced Tab */}
        <TabsContent value="advanced" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Configurações Avançadas</CardTitle>
              <CardDescription>
                Ajustes finos para comportamento da IA
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center space-x-2">
                <Switch
                  id="autoResponse"
                  checked={config.autoResponse}
                  onCheckedChange={(checked) => setConfig(prev => ({ ...prev, autoResponse: checked }))}
                />
                <Label htmlFor="autoResponse">Resposta Automática</Label>
              </div>

              <div>
                <Label>Delay de Resposta: {config.responseDelay[0]}s</Label>
                <Slider
                  value={config.responseDelay}
                  onValueChange={(value) => setConfig(prev => ({ ...prev, responseDelay: value }))}
                  min={0}
                  max={10}
                  step={0.5}
                  className="mt-2"
                />
                <p className="text-xs text-muted-foreground mt-1">
                  Tempo de espera antes de enviar resposta automática
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center space-x-2">
                  <Switch id="profanityFilter" defaultChecked />
                  <Label htmlFor="profanityFilter">Filtro de Palavrões</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Switch id="emoticons" defaultChecked />
                  <Label htmlFor="emoticons">Usar Emojis</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Switch id="typing" defaultChecked />
                  <Label htmlFor="typing">Simular Digitação</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Switch id="readReceipts" />
                  <Label htmlFor="readReceipts">Confirmação de Leitura</Label>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Logs e Monitoramento</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="text-center p-4 border rounded-lg">
                  <p className="text-2xl font-bold">1,247</p>
                  <p className="text-sm text-muted-foreground">Mensagens Processadas</p>
                </div>
                <div className="text-center p-4 border rounded-lg">
                  <p className="text-2xl font-bold">98.5%</p>
                  <p className="text-sm text-muted-foreground">Taxa de Sucesso</p>
                </div>
                <div className="text-center p-4 border rounded-lg">
                  <p className="text-2xl font-bold">1.2s</p>
                  <p className="text-sm text-muted-foreground">Tempo Médio</p>
                </div>
              </div>
              
              <div className="flex gap-2">
                <Button variant="outline" size="sm">
                  <Database className="h-4 w-4 mr-2" />
                  Ver Logs
                </Button>
                <Button variant="outline" size="sm">
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Limpar Cache
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
