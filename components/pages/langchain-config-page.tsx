'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Switch } from '@/components/ui/switch'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Separator } from '@/components/ui/separator'
import { Progress } from '@/components/ui/progress'
import { 
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogDescription,
  DialogFooter
} from '@/components/ui/dialog'
import { 
  Link, 
  Settings, 
  Database, 
  Zap, 
  Brain,
  Key,
  TestTube,
  Save,
  RefreshCw,
  CheckCircle,
  AlertTriangle,
  Info,
  Cpu,
  Globe,
  FileText,
  MessageSquare,
  Clock,
  BarChart3,
  Plus,
  Edit,
  Trash2,
  Eye,
  BookOpen,
  Tag,
  Building,
  Shield,
  Lightbulb
} from 'lucide-react'
import { useToast } from '@/hooks/use-toast'

interface LangChainConfig {
  provider: 'openai' | 'anthropic' | 'google' | 'local'
  apiKey: string
  model: string
  temperature: number
  maxTokens: number
  systemPrompt: string
  embeddingModel: string
  vectorStore: 'pinecone' | 'chroma' | 'faiss' | 'local'
  vectorStoreConfig: {
    apiKey?: string
    environment?: string
    indexName?: string
    dimensions?: number
  }
  retrieval: {
    topK: number
    scoreThreshold: number
    searchType: 'similarity' | 'mmr' | 'similarity_score_threshold'
  }
  responseSettings: {
    maxResponseLength: number
    includeSourcesCount: number
    responseLanguage: 'pt-BR' | 'en' | 'es'
    responseStyle: 'formal' | 'casual' | 'technical'
  }
}

interface ProductInfo {
  id: string
  title: string
  category: 'produto' | 'servico' | 'empresa' | 'politicas' | 'suporte' | 'faq'
  content: string
  tags: string[]
  status: 'ativo' | 'inativo' | 'rascunho'
  priority: 'alta' | 'media' | 'baixa'
  createdAt: Date
  updatedAt: Date
  usage: number
}

interface ProductCategory {
  value: string
  label: string
  description: string
  icon: React.ElementType
  color: string
}

export default function LangChainConfigPage() {
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false)
  const [isTesting, setIsTesting] = useState(false)

  const [config, setConfig] = useState<LangChainConfig>({
    provider: 'openai',
    apiKey: '',
    model: 'gpt-4-turbo-preview',
    temperature: 0.7,
    maxTokens: 2048,
    systemPrompt: `Você é um assistente especializado em WhatsApp Business e automação de mensagens. 

Seu objetivo é ajudar usuários com:
- Configuração de disparos em massa
- Aquecimento de números WhatsApp
- Estratégias de marketing digital
- Políticas do WhatsApp Business
- Soluções técnicas da plataforma

Sempre responda em português brasileiro, seja prestativo e forneça informações precisas baseadas na base de conhecimento disponível.`,
    embeddingModel: 'text-embedding-ada-002',
    vectorStore: 'pinecone',
    vectorStoreConfig: {
      apiKey: '',
      environment: 'gcp-starter',
      indexName: 'whatsapp-suite-kb',
      dimensions: 1536
    },
    retrieval: {
      topK: 5,
      scoreThreshold: 0.7,
      searchType: 'similarity'
    },
    responseSettings: {
      maxResponseLength: 1000,
      includeSourcesCount: 3,
      responseLanguage: 'pt-BR',
      responseStyle: 'casual'
    }
  })

  const providers = [
    { value: 'openai', label: 'OpenAI GPT', icon: Brain },
    { value: 'anthropic', label: 'Anthropic Claude', icon: MessageSquare },
    { value: 'google', label: 'Google Gemini', icon: Globe },
    { value: 'local', label: 'Modelo Local', icon: Cpu }
  ]

  const models = {
    openai: ['gpt-4-turbo-preview', 'gpt-4', 'gpt-3.5-turbo', 'gpt-3.5-turbo-16k'],
    anthropic: ['claude-3-opus', 'claude-3-sonnet', 'claude-3-haiku'],
    google: ['gemini-pro', 'gemini-pro-vision'],
    local: ['llama-2-7b', 'llama-2-13b', 'codellama-7b']
  }

  const vectorStores = [
    { value: 'pinecone', label: 'Pinecone', description: 'Banco vetorial em nuvem' },
    { value: 'chroma', label: 'ChromaDB', description: 'Open-source embedding database' },
    { value: 'faiss', label: 'FAISS', description: 'Facebook AI Similarity Search' },
    { value: 'local', label: 'Local Storage', description: 'Armazenamento local' }
  ]

  const productCategories: ProductCategory[] = [
    { value: 'produto', label: 'Produtos', description: 'Funcionalidades e recursos', icon: Lightbulb, color: 'bg-blue-100 text-blue-800 border-blue-200' },
    { value: 'servico', label: 'Serviços', description: 'Serviços oferecidos', icon: Settings, color: 'bg-green-100 text-green-800 border-green-200' },
    { value: 'empresa', label: 'Empresa', description: 'Informações corporativas', icon: Building, color: 'bg-purple-100 text-purple-800 border-purple-200' },
    { value: 'politicas', label: 'Políticas', description: 'Termos e condições', icon: Shield, color: 'bg-orange-100 text-orange-800 border-orange-200' },
    { value: 'suporte', label: 'Suporte', description: 'Ajuda e tutoriais', icon: MessageSquare, color: 'bg-emerald-100 text-emerald-800 border-emerald-200' },
    { value: 'faq', label: 'FAQ', description: 'Perguntas frequentes', icon: FileText, color: 'bg-gray-100 text-gray-800 border-gray-200' }
  ]

  const [products, setProducts] = useState<ProductInfo[]>([
    {
      id: '1',
      title: 'WhatsApp Suite - Funcionalidades Principais',
      category: 'produto',
      content: 'O WhatsApp Suite é uma plataforma completa para automação de mensagens WhatsApp. Principais funcionalidades:\n\n- Disparos em massa personalizados\n- Aquecimento automático de números\n- Chatbot com IA avançada\n- Relatórios detalhados\n- API completa para integração\n- Múltiplas conexões WhatsApp\n\nA plataforma permite enviar até 50.000 mensagens por mês no plano Enterprise.',
      tags: ['whatsapp', 'automacao', 'disparos', 'chatbot'],
      status: 'ativo',
      priority: 'alta',
      createdAt: new Date('2024-01-15'),
      updatedAt: new Date('2024-03-10'),
      usage: 1247
    },
    {
      id: '2',
      title: 'Planos e Preços',
      category: 'servico',
      content: 'Oferecemos 3 planos principais:\n\n**Basic (R$ 97/mês):**\n- 2.000 mensagens/mês\n- 1 conexão WhatsApp\n- Suporte básico\n\n**Pro (R$ 297/mês):**\n- 10.000 mensagens/mês\n- 5 conexões WhatsApp\n- IA Avançada\n- Relatórios detalhados\n\n**Enterprise (R$ 897/mês):**\n- 50.000 mensagens/mês\n- Conexões ilimitadas\n- API personalizada\n- Suporte prioritário\n\nTodos os planos incluem teste gratuito de 7 dias.',
      tags: ['precos', 'planos', 'assinatura'],
      status: 'ativo',
      priority: 'alta',
      createdAt: new Date('2024-01-20'),
      updatedAt: new Date('2024-03-15'),
      usage: 892
    },
    {
      id: '3',
      title: 'Como configurar aquecimento de números',
      category: 'suporte',
      content: 'O aquecimento é essencial para evitar bloqueios. Siga estes passos:\n\n1. **Configuração inicial:**\n   - Vá em Aquecimento no menu\n   - Selecione o número a ser aquecido\n   - Defina a estratégia (conservadora/moderada/agressiva)\n\n2. **Cronograma recomendado:**\n   - Dia 1-3: 10-20 mensagens\n   - Dia 4-7: 30-50 mensagens\n   - Dia 8-14: 100-200 mensagens\n   - Após 14 dias: Volume normal\n\n3. **Dicas importantes:**\n   - Use mensagens variadas\n   - Inclua intervalos entre envios\n   - Monitore métricas de entrega\n   - Evite links externos inicialmente',
      tags: ['aquecimento', 'tutorial', 'whatsapp'],
      status: 'ativo',
      priority: 'alta',
      createdAt: new Date('2024-02-10'),
      updatedAt: new Date('2024-03-01'),
      usage: 723
    }
  ])

  const [newProduct, setNewProduct] = useState<Partial<ProductInfo>>({
    title: '',
    category: 'produto',
    content: '',
    tags: [],
    status: 'ativo',
    priority: 'media'
  })

  const [newProductTags, setNewProductTags] = useState<string>('')

  const handleSaveConfig = async () => {
    setIsLoading(true)
    try {
      // Simular salvamento da configuração
      await new Promise(resolve => setTimeout(resolve, 1500))
      toast({
        title: 'Configuração salva',
        description: 'As configurações do LangChain foram salvas com sucesso.',
      })
    } catch (error) {
      toast({
        title: 'Erro ao salvar',
        description: 'Ocorreu um erro ao salvar as configurações.',
        variant: 'destructive'
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleTestConnection = async () => {
    setIsTesting(true)
    try {
      // Simular teste de conexão
      await new Promise(resolve => setTimeout(resolve, 2000))
      toast({
        title: 'Conexão bem-sucedida',
        description: 'A conexão com o modelo de IA foi testada com sucesso.',
      })
    } catch (error) {
      toast({
        title: 'Erro na conexão',
        description: 'Não foi possível conectar com o modelo de IA.',
        variant: 'destructive'
      })
    } finally {
      setIsTesting(false)
    }
  }

  // Função para adicionar produto
  const handleAddProduct = () => {
    if (!newProduct.title || !newProduct.content || !newProduct.category) {
      toast({
        title: "Erro",
        description: "Por favor, preencha todos os campos obrigatórios.",
        variant: "destructive",
      })
      return
    }

    const productToAdd: ProductInfo = {
      id: Date.now().toString(),
      title: newProduct.title,
      content: newProduct.content,
      category: newProduct.category,
      tags: newProductTags.split(',').map(tag => tag.trim()).filter(tag => tag.length > 0),
      priority: newProduct.priority || 'media',
      status: 'ativo',
      usage: 0,
      createdAt: new Date(),
      updatedAt: new Date()
    }

    setProducts(prev => [...prev, productToAdd])
    
    // Reset form
    setNewProduct({
      title: '',
      content: '',
      category: 'produto',
      priority: 'media'
    })
    setNewProductTags('')
    
    toast({
      title: "Sucesso",
      description: "Informação adicionada à base de conhecimento!",
    })
  }

  // Função para deletar produto
  const handleDeleteProduct = (productId: string) => {
    setProducts(prev => prev.filter(p => p.id !== productId))
    toast({
      title: "Produto removido",
      description: "A informação foi removida da base de conhecimento.",
    })
  }

  // Função para obter badge de status
  const getStatusBadge = (status: string) => {
    if (status === 'ativo') {
      return <Badge className="bg-green-100 text-green-800">Ativo</Badge>
    }
    return <Badge variant="outline">Inativo</Badge>
  }

  // Função para obter badge de prioridade
  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case 'alta':
        return <Badge className="bg-red-100 text-red-800">Alta</Badge>
      case 'media':
        return <Badge className="bg-yellow-100 text-yellow-800">Média</Badge>
      case 'baixa':
        return <Badge className="bg-gray-100 text-gray-800">Baixa</Badge>
      default:
        return <Badge variant="outline">Normal</Badge>
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-3">
            <Link className="w-8 h-8" />
            Configurações LangChain
          </h1>
          <p className="text-muted-foreground">Configure a IA para responder perguntas usando sua base de conhecimento</p>
        </div>
        <div className="flex items-center gap-3">
          <Button 
            variant="outline" 
            onClick={handleTestConnection}
            disabled={isTesting}
          >
            {isTesting ? (
              <>
                <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                Testando...
              </>
            ) : (
              <>
                <TestTube className="w-4 h-4 mr-2" />
                Testar Conexão
              </>
            )}
          </Button>
          <Button 
            onClick={handleSaveConfig}
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                Salvando...
              </>
            ) : (
              <>
                <Save className="w-4 h-4 mr-2" />
                Salvar Config
              </>
            )}
          </Button>
        </div>
      </div>

      {/* Status Card */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center">
                <CheckCircle className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <h3 className="font-semibold">LangChain Status</h3>
                <p className="text-sm text-muted-foreground">Sistema operacional e conectado</p>
              </div>
            </div>
            <div className="text-right">
              <Badge className="bg-green-100 text-green-800 border-green-200">
                <CheckCircle className="w-3 h-3 mr-1" />
                Online
              </Badge>
              <p className="text-xs text-muted-foreground mt-1">
                Última sincronização: há 2 minutos
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Configurações */}
      <Tabs defaultValue="model" className="space-y-6">
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="model">Modelo IA</TabsTrigger>
          <TabsTrigger value="vector">Vector Store</TabsTrigger>
          <TabsTrigger value="knowledge">Base de Conhecimento</TabsTrigger>
          <TabsTrigger value="retrieval">Recuperação</TabsTrigger>
          <TabsTrigger value="response">Resposta</TabsTrigger>
          <TabsTrigger value="advanced">Avançado</TabsTrigger>
        </TabsList>

        {/* Aba Modelo IA */}
        <TabsContent value="model" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Brain className="w-5 h-5" />
                Configuração do Modelo de IA
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="provider">Provedor de IA</Label>
                    <Select 
                      value={config.provider} 
                      onValueChange={(value: any) => setConfig(prev => ({ ...prev, provider: value }))}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {providers.map((provider) => (
                          <SelectItem key={provider.value} value={provider.value}>
                            {provider.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="model">Modelo</Label>
                    <Select 
                      value={config.model} 
                      onValueChange={(value) => setConfig(prev => ({ ...prev, model: value }))}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {models[config.provider].map((model) => (
                          <SelectItem key={model} value={model}>
                            {model}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="api-key">API Key</Label>
                    <Input 
                      id="api-key"
                      type="password"
                      value={config.apiKey}
                      onChange={(e) => setConfig(prev => ({ ...prev, apiKey: e.target.value }))}
                      placeholder="sk-..."
                    />
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="temperature">
                      Temperatura: {config.temperature}
                    </Label>
                    <div className="px-2">
                      <input
                        type="range"
                        min="0"
                        max="2"
                        step="0.1"
                        value={config.temperature}
                        onChange={(e) => setConfig(prev => ({ ...prev, temperature: parseFloat(e.target.value) }))}
                        className="w-full"
                      />
                      <div className="flex justify-between text-xs text-muted-foreground">
                        <span>Conservador</span>
                        <span>Criativo</span>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="max-tokens">Tokens Máximos</Label>
                    <Input 
                      id="max-tokens"
                      type="number"
                      value={config.maxTokens}
                      onChange={(e) => setConfig(prev => ({ ...prev, maxTokens: parseInt(e.target.value) }))}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="embedding-model">Modelo de Embedding</Label>
                    <Input 
                      id="embedding-model"
                      value={config.embeddingModel}
                      onChange={(e) => setConfig(prev => ({ ...prev, embeddingModel: e.target.value }))}
                    />
                  </div>
                </div>
              </div>

              <Separator />

              <div className="space-y-2">
                <Label htmlFor="system-prompt">Prompt do Sistema</Label>
                <Textarea 
                  id="system-prompt"
                  value={config.systemPrompt}
                  onChange={(e) => setConfig(prev => ({ ...prev, systemPrompt: e.target.value }))}
                  rows={6}
                  placeholder="Instruções para o comportamento da IA..."
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Aba Vector Store */}
        <TabsContent value="vector" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Database className="w-5 h-5" />
                Configuração do Vector Store
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>Provedor de Vector Store</Label>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {vectorStores.map((store) => (
                      <div
                        key={store.value}
                        className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                          config.vectorStore === store.value
                            ? 'border-emerald-500 bg-emerald-50'
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                        onClick={() => setConfig(prev => ({ ...prev, vectorStore: store.value as any }))}
                      >
                        <h3 className="font-medium">{store.label}</h3>
                        <p className="text-sm text-muted-foreground">{store.description}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {config.vectorStore === 'pinecone' && (
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 p-4 bg-gray-50 rounded-lg">
                    <div className="space-y-2">
                      <Label>Pinecone API Key</Label>
                      <Input 
                        type="password"
                        placeholder="Sua API Key do Pinecone"
                        value={config.vectorStoreConfig.apiKey || ''}
                        onChange={(e) => setConfig(prev => ({
                          ...prev,
                          vectorStoreConfig: { ...prev.vectorStoreConfig, apiKey: e.target.value }
                        }))}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Environment</Label>
                      <Input 
                        placeholder="gcp-starter"
                        value={config.vectorStoreConfig.environment || ''}
                        onChange={(e) => setConfig(prev => ({
                          ...prev,
                          vectorStoreConfig: { ...prev.vectorStoreConfig, environment: e.target.value }
                        }))}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Index Name</Label>
                      <Input 
                        placeholder="whatsapp-suite-kb"
                        value={config.vectorStoreConfig.indexName || ''}
                        onChange={(e) => setConfig(prev => ({
                          ...prev,
                          vectorStoreConfig: { ...prev.vectorStoreConfig, indexName: e.target.value }
                        }))}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Dimensões</Label>
                      <Input 
                        type="number"
                        placeholder="1536"
                        value={config.vectorStoreConfig.dimensions || ''}
                        onChange={(e) => setConfig(prev => ({
                          ...prev,
                          vectorStoreConfig: { ...prev.vectorStoreConfig, dimensions: parseInt(e.target.value) }
                        }))}
                      />
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Aba Base de Conhecimento */}
        <TabsContent value="knowledge" className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold">Base de Conhecimento</h2>
              <p className="text-muted-foreground">Gerencie produtos e informações que a IA utilizará para responder perguntas</p>
            </div>
            <Dialog>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="w-4 h-4 mr-2" />
                  Adicionar Informação
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>Adicionar Nova Informação</DialogTitle>
                  <DialogDescription>
                    Adicione produtos, serviços ou informações que a IA deve conhecer
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="title">Título</Label>
                      <Input 
                        id="title" 
                        placeholder="Ex: Funcionalidade de Disparos"
                        value={newProduct.title || ''}
                        onChange={(e) => setNewProduct(prev => ({ ...prev, title: e.target.value }))}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="category">Categoria</Label>
                      <Select 
                        value={newProduct.category}
                        onValueChange={(value: any) => setNewProduct(prev => ({ ...prev, category: value }))}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione uma categoria" />
                        </SelectTrigger>
                        <SelectContent>
                          {productCategories.map((cat) => (
                            <SelectItem key={cat.value} value={cat.value}>
                              {cat.label} - {cat.description}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="content">Conteúdo</Label>
                    <Textarea 
                      id="content" 
                      placeholder="Digite o conteúdo detalhado que a IA deve conhecer..."
                      className="min-h-[200px]"
                      value={newProduct.content || ''}
                      onChange={(e) => setNewProduct(prev => ({ ...prev, content: e.target.value }))}
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="tags">Tags (separadas por vírgula)</Label>
                      <Input 
                        id="tags" 
                        placeholder="whatsapp, automacao, tutorial"
                        value={newProductTags}
                        onChange={(e) => setNewProductTags(e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="priority">Prioridade</Label>
                      <Select
                        value={newProduct.priority}
                        onValueChange={(value: any) => setNewProduct(prev => ({ ...prev, priority: value }))}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione a prioridade" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="alta">Alta - Informação crítica</SelectItem>
                          <SelectItem value="media">Média - Informação importante</SelectItem>
                          <SelectItem value="baixa">Baixa - Informação adicional</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline">Cancelar</Button>
                  <Button onClick={handleAddProduct}>
                    <Save className="w-4 h-4 mr-2" />
                    Adicionar à Base
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>

          {/* Estatísticas */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total de Itens</CardTitle>
                <BookOpen className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{products.length}</div>
                <p className="text-xs text-muted-foreground">
                  {products.filter(p => p.status === 'ativo').length} ativos
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Mais Consultado</CardTitle>
                <BarChart3 className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {products.length > 0 ? Math.max(...products.map(p => p.usage)).toLocaleString() : 0}
                </div>
                <p className="text-xs text-muted-foreground">consultas</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Categorias</CardTitle>
                <Tag className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{productCategories.length}</div>
                <p className="text-xs text-muted-foreground">tipos diferentes</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Última Atualização</CardTitle>
                <Clock className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">Agora</div>
                <p className="text-xs text-muted-foreground">sincronizado</p>
              </CardContent>
            </Card>
          </div>

          {/* Lista de Produtos/Informações */}
          <div className="space-y-4">
            {products.map((product) => {
              const CategoryIcon = productCategories.find(cat => cat.value === product.category)?.icon || FileText
              const categoryData = productCategories.find(cat => cat.value === product.category)

              return (
                <Card key={product.id}>
                  <CardContent className="pt-6">
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-4 flex-1">
                        <div className="flex-shrink-0">
                          <div className={`w-12 h-12 rounded-lg ${categoryData?.color || 'bg-gray-100'} flex items-center justify-center`}>
                            <CategoryIcon className="w-6 h-6" />
                          </div>
                        </div>
                        <div className="flex-1 space-y-2">
                          <div className="flex items-start justify-between">
                            <h3 className="font-semibold text-lg">{product.title}</h3>
                            <div className="flex items-center gap-2">
                              {getStatusBadge(product.status)}
                              {getPriorityBadge(product.priority)}
                            </div>
                          </div>
                          
                          <div className="flex items-center gap-4 text-sm text-muted-foreground">
                            <span className="flex items-center gap-1">
                              <CategoryIcon className="w-4 h-4" />
                              {categoryData?.label}
                            </span>
                            <span className="flex items-center gap-1">
                              <Eye className="w-4 h-4" />
                              {product.usage.toLocaleString()} consultas
                            </span>
                            <span className="flex items-center gap-1">
                              <Clock className="w-4 h-4" />
                              {product.updatedAt.toLocaleDateString('pt-BR')}
                            </span>
                          </div>

                          <p className="text-sm text-muted-foreground line-clamp-2">
                            {product.content.substring(0, 200)}...
                          </p>

                          <div className="flex flex-wrap gap-1">
                            {product.tags.map((tag, index) => (
                              <Badge key={index} variant="outline" className="text-xs">
                                {tag}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-2 ml-4">
                        <Button variant="outline" size="sm">
                          <Eye className="w-4 h-4" />
                        </Button>
                        <Button variant="outline" size="sm">
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="text-red-600"
                          onClick={() => handleDeleteProduct(product.id)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>

          {products.length === 0 && (
            <Card>
              <CardContent className="pt-6">
                <div className="text-center py-8">
                  <BookOpen className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-medium mb-2">Nenhuma informação cadastrada</h3>
                  <p className="text-muted-foreground mb-4">
                    Adicione produtos, serviços e informações para que a IA possa responder perguntas dos seus clientes.
                  </p>
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button>
                        <Plus className="w-4 h-4 mr-2" />
                        Adicionar Primeira Informação
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Adicionar Nova Informação</DialogTitle>
                        <DialogDescription>
                          Comece criando sua primeira entrada na base de conhecimento
                        </DialogDescription>
                      </DialogHeader>
                      {/* Mesmo formulário do dialog principal */}
                    </DialogContent>
                  </Dialog>
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        {/* Aba Recuperação */}
        <TabsContent value="retrieval" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="w-5 h-5" />
                Configurações de Recuperação
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="space-y-2">
                  <Label>Top K Resultados: {config.retrieval.topK}</Label>
                  <div className="px-2">
                    <input
                      type="range"
                      min="1"
                      max="20"
                      value={config.retrieval.topK}
                      onChange={(e) => setConfig(prev => ({
                        ...prev,
                        retrieval: { ...prev.retrieval, topK: parseInt(e.target.value) }
                      }))}
                      className="w-full"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Score Threshold: {config.retrieval.scoreThreshold}</Label>
                  <div className="px-2">
                    <input
                      type="range"
                      min="0"
                      max="1"
                      step="0.1"
                      value={config.retrieval.scoreThreshold}
                      onChange={(e) => setConfig(prev => ({
                        ...prev,
                        retrieval: { ...prev.retrieval, scoreThreshold: parseFloat(e.target.value) }
                      }))}
                      className="w-full"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Tipo de Busca</Label>
                  <Select
                    value={config.retrieval.searchType}
                    onValueChange={(value: any) => setConfig(prev => ({
                      ...prev,
                      retrieval: { ...prev.retrieval, searchType: value }
                    }))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="similarity">Similaridade</SelectItem>
                      <SelectItem value="mmr">MMR (Diversidade)</SelectItem>
                      <SelectItem value="similarity_score_threshold">Por Score</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Aba Resposta */}
        <TabsContent value="response" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MessageSquare className="w-5 h-5" />
                Configurações de Resposta
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label>Tamanho Máximo da Resposta: {config.responseSettings.maxResponseLength}</Label>
                    <div className="px-2">
                      <input
                        type="range"
                        min="100"
                        max="2000"
                        step="100"
                        value={config.responseSettings.maxResponseLength}
                        onChange={(e) => setConfig(prev => ({
                          ...prev,
                          responseSettings: { ...prev.responseSettings, maxResponseLength: parseInt(e.target.value) }
                        }))}
                        className="w-full"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label>Idioma da Resposta</Label>
                    <Select
                      value={config.responseSettings.responseLanguage}
                      onValueChange={(value: any) => setConfig(prev => ({
                        ...prev,
                        responseSettings: { ...prev.responseSettings, responseLanguage: value }
                      }))}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="pt-BR">Português (Brasil)</SelectItem>
                        <SelectItem value="en">English</SelectItem>
                        <SelectItem value="es">Español</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label>Fontes Incluídas: {config.responseSettings.includeSourcesCount}</Label>
                    <div className="px-2">
                      <input
                        type="range"
                        min="0"
                        max="10"
                        value={config.responseSettings.includeSourcesCount}
                        onChange={(e) => setConfig(prev => ({
                          ...prev,
                          responseSettings: { ...prev.responseSettings, includeSourcesCount: parseInt(e.target.value) }
                        }))}
                        className="w-full"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label>Estilo de Resposta</Label>
                    <Select
                      value={config.responseSettings.responseStyle}
                      onValueChange={(value: any) => setConfig(prev => ({
                        ...prev,
                        responseSettings: { ...prev.responseSettings, responseStyle: value }
                      }))}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="formal">Formal</SelectItem>
                        <SelectItem value="casual">Casual</SelectItem>
                        <SelectItem value="technical">Técnico</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Aba Avançado */}
        <TabsContent value="advanced" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Zap className="w-5 h-5" />
                Configurações Avançadas
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Performance</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                      <Label>Cache de Respostas</Label>
                      <Switch />
                    </div>
                    <div className="flex items-center justify-between">
                      <Label>Streaming de Resposta</Label>
                      <Switch defaultChecked />
                    </div>
                    <div className="flex items-center justify-between">
                      <Label>Paralelização</Label>
                      <Switch defaultChecked />
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Monitoramento</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                      <Label>Logs Detalhados</Label>
                      <Switch defaultChecked />
                    </div>
                    <div className="flex items-center justify-between">
                      <Label>Métricas de Uso</Label>
                      <Switch defaultChecked />
                    </div>
                    <div className="flex items-center justify-between">
                      <Label>Alertas de Erro</Label>
                      <Switch defaultChecked />
                    </div>
                  </CardContent>
                </Card>
              </div>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Estatísticas de Uso</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div className="text-center">
                      <div className="text-2xl font-bold">1,247</div>
                      <div className="text-sm text-muted-foreground">Consultas hoje</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold">98.5%</div>
                      <div className="text-sm text-muted-foreground">Taxa de sucesso</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold">1.2s</div>
                      <div className="text-sm text-muted-foreground">Tempo médio</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold">15.6k</div>
                      <div className="text-sm text-muted-foreground">Tokens usados</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
