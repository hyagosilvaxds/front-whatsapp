'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Switch } from '@/components/ui/switch'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Separator } from '@/components/ui/separator'
import { 
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Progress } from '@/components/ui/progress'
import { 
  User, 
  Building, 
  Mail, 
  Phone, 
  Calendar,
  CreditCard,
  Key,
  MessageSquare,
  Plus,
  Trash2,
  Edit,
  Eye,
  EyeOff,
  Copy,
  RefreshCw,
  Settings,
  Shield,
  Zap,
  CheckCircle,
  AlertTriangle,
  Clock
} from 'lucide-react'
import { useToast } from '@/hooks/use-toast'

interface Customer {
  id: string
  name: string
  email: string
  phone: string
  company: string
  plan: string
  status: 'active' | 'inactive' | 'pending'
  joinDate: Date
  lastActivity: Date
  messagesUsed: number
  messagesLimit: number
  apiKey: string
  connections: WhatsAppConnection[]
  avatar?: string
  notes: string
}

interface WhatsAppConnection {
  id: string
  name: string
  phone: string
  status: 'connected' | 'disconnected' | 'connecting'
  lastSeen: Date
  messagesCount: number
}

export default function AdminCustomerEditPage() {
  const { toast } = useToast()
  const [showApiKey, setShowApiKey] = useState(false)
  const [isGeneratingKey, setIsGeneratingKey] = useState(false)

  // Mock data - em produção viria da API
  const customer: Customer = {
    id: '1',
    name: 'João Silva',
    email: 'joao@empresa.com',
    phone: '+55 11 99999-9999',
    company: 'Tech Solutions Ltda',
    plan: 'Pro',
    status: 'active',
    joinDate: new Date('2024-01-15'),
    lastActivity: new Date(Date.now() - 2 * 60 * 60 * 1000),
    messagesUsed: 8500,
    messagesLimit: 10000,
    apiKey: 'wps_1234567890abcdef1234567890abcdef12345678',
    notes: 'Cliente VIP - Suporte prioritário',
    connections: [
      {
        id: '1',
        name: 'Vendas Principal',
        phone: '+55 11 91111-1111',
        status: 'connected',
        lastSeen: new Date(Date.now() - 30 * 60 * 1000),
        messagesCount: 5420
      },
      {
        id: '2',
        name: 'Suporte',
        phone: '+55 11 92222-2222',
        status: 'connected',
        lastSeen: new Date(Date.now() - 5 * 60 * 1000),
        messagesCount: 3080
      },
      {
        id: '3',
        name: 'Marketing',
        phone: '+55 11 93333-3333',
        status: 'disconnected',
        lastSeen: new Date(Date.now() - 24 * 60 * 60 * 1000),
        messagesCount: 0
      }
    ]
  }

  const plans = [
    { value: 'basic', label: 'Basic - R$ 97/mês', limit: 2000 },
    { value: 'pro', label: 'Pro - R$ 297/mês', limit: 10000 },
    { value: 'enterprise', label: 'Enterprise - R$ 897/mês', limit: 50000 }
  ]

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return <Badge className="bg-green-100 text-green-800 border-green-200">Ativo</Badge>
      case 'inactive':
        return <Badge variant="secondary">Inativo</Badge>
      case 'pending':
        return <Badge className="bg-yellow-100 text-yellow-800 border-yellow-200">Pendente</Badge>
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  const getConnectionStatusBadge = (status: string) => {
    switch (status) {
      case 'connected':
        return <Badge className="bg-green-100 text-green-800 border-green-200"><CheckCircle className="w-3 h-3 mr-1" />Conectado</Badge>
      case 'disconnected':
        return <Badge variant="secondary"><AlertTriangle className="w-3 h-3 mr-1" />Desconectado</Badge>
      case 'connecting':
        return <Badge className="bg-yellow-100 text-yellow-800 border-yellow-200"><Clock className="w-3 h-3 mr-1" />Conectando</Badge>
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  const handleGenerateApiKey = async () => {
    setIsGeneratingKey(true)
    // Simular geração de nova chave
    await new Promise(resolve => setTimeout(resolve, 1500))
    setIsGeneratingKey(false)
    toast({
      title: 'Nova API Key gerada',
      description: 'A nova chave foi gerada com sucesso. Certifique-se de atualizá-la no sistema do cliente.',
    })
  }

  const handleCopyApiKey = () => {
    navigator.clipboard.writeText(customer.apiKey)
    toast({
      title: 'API Key copiada',
      description: 'A chave foi copiada para a área de transferência.',
    })
  }

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('pt-BR') + ' às ' + date.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })
  }

  const getUsagePercentage = () => {
    return Math.round((customer.messagesUsed / customer.messagesLimit) * 100)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Avatar className="w-16 h-16">
            <AvatarImage src={customer.avatar} />
            <AvatarFallback className="text-xl">{customer.name.charAt(0)}</AvatarFallback>
          </Avatar>
          <div>
            <h1 className="text-3xl font-bold">{customer.name}</h1>
            <p className="text-muted-foreground">{customer.company}</p>
            <div className="flex items-center gap-2 mt-2">
              {getStatusBadge(customer.status)}
              <Badge variant="outline">{customer.plan}</Badge>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline">
            <Eye className="w-4 h-4 mr-2" />
            Visualizar como Cliente
          </Button>
          <Button>
            <Settings className="w-4 h-4 mr-2" />
            Salvar Alterações
          </Button>
        </div>
      </div>

      {/* Conteúdo Principal */}
      <Tabs defaultValue="general" className="space-y-6">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="general">Geral</TabsTrigger>
          <TabsTrigger value="plan">Plano</TabsTrigger>
          <TabsTrigger value="api">API</TabsTrigger>
          <TabsTrigger value="connections">Conexões</TabsTrigger>
          <TabsTrigger value="billing">Faturamento</TabsTrigger>
        </TabsList>

        {/* Aba Geral */}
        <TabsContent value="general" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="w-5 h-5" />
                  Informações Pessoais
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Nome Completo</Label>
                    <Input id="name" defaultValue={customer.name} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input id="email" type="email" defaultValue={customer.email} />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Telefone</Label>
                  <Input id="phone" defaultValue={customer.phone} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="company">Empresa</Label>
                  <Input id="company" defaultValue={customer.company} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="notes">Observações</Label>
                  <Textarea id="notes" defaultValue={customer.notes} rows={3} />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="w-5 h-5" />
                  Status da Conta
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label htmlFor="status">Status da Conta</Label>
                  <Select defaultValue={customer.status}>
                    <SelectTrigger className="w-32">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="active">Ativo</SelectItem>
                      <SelectItem value="inactive">Inativo</SelectItem>
                      <SelectItem value="pending">Pendente</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <Separator />
                
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Data de Cadastro</span>
                    <span className="text-sm text-muted-foreground">{formatDate(customer.joinDate)}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Última Atividade</span>
                    <span className="text-sm text-muted-foreground">{formatDate(customer.lastActivity)}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">ID do Cliente</span>
                    <span className="text-sm text-muted-foreground font-mono">{customer.id}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Aba Plano */}
        <TabsContent value="plan" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CreditCard className="w-5 h-5" />
                Gerenciamento de Plano
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="plan">Plano Atual</Label>
                    <Select defaultValue={customer.plan.toLowerCase()}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {plans.map((plan) => (
                          <SelectItem key={plan.value} value={plan.value}>
                            {plan.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="custom-limit">Limite Personalizado</Label>
                    <Input 
                      id="custom-limit" 
                      type="number" 
                      defaultValue={customer.messagesLimit}
                      placeholder="Ex: 15000"
                    />
                    <p className="text-xs text-muted-foreground">
                      Deixe em branco para usar o limite padrão do plano
                    </p>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <h4 className="font-medium mb-2">Uso Atual</h4>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Mensagens Usadas</span>
                        <span>{customer.messagesUsed.toLocaleString()}/{customer.messagesLimit.toLocaleString()}</span>
                      </div>
                      <Progress value={getUsagePercentage()} className="h-2" />
                      <p className="text-xs text-muted-foreground">
                        {getUsagePercentage()}% do limite mensal utilizado
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <Separator />

              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium">Zerar Contador de Mensagens</h4>
                  <p className="text-sm text-muted-foreground">Resetar o uso de mensagens do mês atual</p>
                </div>
                <Button variant="outline">
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Zerar Contador
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Aba API */}
        <TabsContent value="api" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Key className="w-5 h-5" />
                Gerenciamento de API
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="api-key">Chave da API</Label>
                  <div className="flex gap-2">
                    <Input 
                      id="api-key" 
                      type={showApiKey ? 'text' : 'password'}
                      value={customer.apiKey}
                      readOnly
                      className="font-mono"
                    />
                    <Button 
                      variant="outline" 
                      size="icon"
                      onClick={() => setShowApiKey(!showApiKey)}
                    >
                      {showApiKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </Button>
                    <Button 
                      variant="outline" 
                      size="icon"
                      onClick={handleCopyApiKey}
                    >
                      <Copy className="w-4 h-4" />
                    </Button>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <Button 
                    variant="outline" 
                    onClick={handleGenerateApiKey}
                    disabled={isGeneratingKey}
                  >
                    {isGeneratingKey ? (
                      <>
                        <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                        Gerando...
                      </>
                    ) : (
                      <>
                        <RefreshCw className="w-4 h-4 mr-2" />
                        Gerar Nova Chave
                      </>
                    )}
                  </Button>
                  <div className="text-sm text-muted-foreground">
                    ⚠️ Isso invalidará a chave atual
                  </div>
                </div>

                <Separator />

                <div className="space-y-3">
                  <h4 className="font-medium">Permissões da API</h4>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="send-messages">Enviar Mensagens</Label>
                      <Switch id="send-messages" defaultChecked />
                    </div>
                    <div className="flex items-center justify-between">
                      <Label htmlFor="read-messages">Ler Mensagens</Label>
                      <Switch id="read-messages" defaultChecked />
                    </div>
                    <div className="flex items-center justify-between">
                      <Label htmlFor="manage-contacts">Gerenciar Contatos</Label>
                      <Switch id="manage-contacts" defaultChecked />
                    </div>
                    <div className="flex items-center justify-between">
                      <Label htmlFor="webhooks">Webhooks</Label>
                      <Switch id="webhooks" />
                    </div>
                  </div>
                </div>

                <Separator />

                <div className="space-y-2">
                  <Label htmlFor="webhook-url">URL do Webhook</Label>
                  <Input 
                    id="webhook-url" 
                    placeholder="https://seusite.com/webhook"
                  />
                  <p className="text-xs text-muted-foreground">
                    URL para receber eventos em tempo real
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Aba Conexões */}
        <TabsContent value="connections" className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold">Conexões WhatsApp</h2>
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              Nova Conexão
            </Button>
          </div>

          <div className="grid gap-4">
            {customer.connections.map((connection) => (
              <Card key={connection.id}>
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <Avatar>
                        <AvatarFallback>
                          <MessageSquare className="w-4 h-4" />
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <h4 className="font-medium">{connection.name}</h4>
                        <p className="text-sm text-muted-foreground">{connection.phone}</p>
                        <div className="flex items-center gap-2 mt-1">
                          {getConnectionStatusBadge(connection.status)}
                          <span className="text-xs text-muted-foreground">
                            {connection.messagesCount.toLocaleString()} mensagens enviadas
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="text-right text-sm text-muted-foreground">
                        <p>Última atividade:</p>
                        <p>{formatDate(connection.lastSeen)}</p>
                      </div>
                      <Button variant="outline" size="sm">
                        <Settings className="w-4 h-4" />
                      </Button>
                      <Button variant="outline" size="sm" className="text-red-600">
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Aba Faturamento */}
        <TabsContent value="billing" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CreditCard className="w-5 h-5" />
                Informações de Faturamento
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h4 className="font-medium">Histórico de Pagamentos</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between items-center p-3 border rounded">
                      <div>
                        <p className="text-sm font-medium">Março 2024</p>
                        <p className="text-xs text-muted-foreground">Plano Pro</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-medium">R$ 297,00</p>
                        <Badge className="bg-green-100 text-green-800 border-green-200">Pago</Badge>
                      </div>
                    </div>
                    <div className="flex justify-between items-center p-3 border rounded">
                      <div>
                        <p className="text-sm font-medium">Fevereiro 2024</p>
                        <p className="text-xs text-muted-foreground">Plano Pro</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-medium">R$ 297,00</p>
                        <Badge className="bg-green-100 text-green-800 border-green-200">Pago</Badge>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h4 className="font-medium">Próxima Cobrança</h4>
                  <div className="p-4 bg-muted/50 rounded-lg">
                    <p className="text-lg font-bold">R$ 297,00</p>
                    <p className="text-sm text-muted-foreground">Plano Pro - Abril 2024</p>
                    <p className="text-sm text-muted-foreground">Cobrança em 15/04/2024</p>
                  </div>
                  
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm">
                      Alterar Forma de Pagamento
                    </Button>
                    <Button variant="outline" size="sm">
                      Cancelar Assinatura
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
