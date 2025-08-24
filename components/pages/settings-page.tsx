"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Switch } from "@/components/ui/switch"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { 
  Settings, 
  User, 
  Bell, 
  Shield, 
  Smartphone,
  CreditCard,
  Users,
  MessageSquare,
  Bot,
  Palette,
  Globe,
  Key,
  Zap,
  Save
} from "lucide-react"
import SettingsPanel from "../settings-panel"

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState("profile")
  const [notifications, setNotifications] = useState({
    email: true,
    push: true,
    sms: false,
    campaigns: true,
    numbers: true,
    reports: false
  })

  const profile = {
    name: "João Silva",
    email: "joao@empresa.com",
    phone: "+55 11 99999-0000",
    avatar: "/placeholder-user.jpg",
    company: "Minha Empresa Ltda",
    role: "Administrador"
  }

  const plans = [
    {
      name: "Starter",
      current: false,
      price: "R$ 97",
      features: ["5 números", "1.000 mensagens/mês", "Suporte básico"]
    },
    {
      name: "Professional",
      current: true,
      price: "R$ 297",
      features: ["15 números", "10.000 mensagens/mês", "IA incluída", "Suporte prioritário"]
    },
    {
      name: "Enterprise",
      current: false,
      price: "R$ 697",
      features: ["Números ilimitados", "100.000 mensagens/mês", "API personalizada", "Suporte 24/7"]
    }
  ]

  const connectedNumbers = [
    {
      id: "1",
      phone: "+55 11 99999-0001",
      name: "Principal",
      status: "connected",
      addedDate: "2025-07-15"
    },
    {
      id: "2",
      phone: "+55 21 99999-0002",
      name: "Vendas",
      status: "connected", 
      addedDate: "2025-07-20"
    },
    {
      id: "3",
      phone: "+55 31 99999-0003",
      name: "Suporte",
      status: "disconnected",
      addedDate: "2025-08-01"
    }
  ]

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Configurações</h1>
        <p className="text-muted-foreground">
          Gerencie sua conta, preferências e integrações
        </p>
      </div>

      {/* Main Content */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="profile">Perfil</TabsTrigger>
          <TabsTrigger value="notifications">Notificações</TabsTrigger>
          <TabsTrigger value="numbers">Números</TabsTrigger>
          <TabsTrigger value="billing">Faturamento</TabsTrigger>
          <TabsTrigger value="integrations">Integrações</TabsTrigger>
          <TabsTrigger value="advanced">Avançado</TabsTrigger>
        </TabsList>

        <TabsContent value="profile" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="h-5 w-5" />
                  Informações Pessoais
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-4">
                  <Avatar className="h-16 w-16">
                    <AvatarImage src={profile.avatar} alt={profile.name} />
                    <AvatarFallback>{profile.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div>
                    <Button variant="outline" size="sm">
                      Alterar Foto
                    </Button>
                    <p className="text-xs text-muted-foreground mt-1">
                      JPG, PNG até 2MB
                    </p>
                  </div>
                </div>
                <div className="grid gap-3">
                  <div>
                    <Label htmlFor="name">Nome Completo</Label>
                    <Input id="name" defaultValue={profile.name} />
                  </div>
                  <div>
                    <Label htmlFor="email">Email</Label>
                    <Input id="email" type="email" defaultValue={profile.email} />
                  </div>
                  <div>
                    <Label htmlFor="phone">Telefone</Label>
                    <Input id="phone" defaultValue={profile.phone} />
                  </div>
                  <div>
                    <Label htmlFor="company">Empresa</Label>
                    <Input id="company" defaultValue={profile.company} />
                  </div>
                </div>
                <Button className="w-full">
                  <Save className="h-4 w-4 mr-2" />
                  Salvar Alterações
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="h-5 w-5" />
                  Segurança
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="current-password">Senha Atual</Label>
                  <Input id="current-password" type="password" />
                </div>
                <div>
                  <Label htmlFor="new-password">Nova Senha</Label>
                  <Input id="new-password" type="password" />
                </div>
                <div>
                  <Label htmlFor="confirm-password">Confirmar Senha</Label>
                  <Input id="confirm-password" type="password" />
                </div>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium">Autenticação 2FA</p>
                      <p className="text-xs text-muted-foreground">
                        Adicione uma camada extra de segurança
                      </p>
                    </div>
                    <Switch />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium">Login por SMS</p>
                      <p className="text-xs text-muted-foreground">
                        Receba códigos por SMS
                      </p>
                    </div>
                    <Switch />
                  </div>
                </div>
                <Button className="w-full">
                  Atualizar Senha
                </Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="notifications" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bell className="h-5 w-5" />
                Preferências de Notificação
              </CardTitle>
              <CardDescription>
                Configure como e quando receber notificações
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <h4 className="text-sm font-medium mb-3">Canais de Notificação</h4>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium">Email</p>
                      <p className="text-xs text-muted-foreground">
                        Receber notificações por email
                      </p>
                    </div>
                    <Switch 
                      checked={notifications.email}
                      onCheckedChange={(checked) => 
                        setNotifications(prev => ({ ...prev, email: checked }))
                      }
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium">Push</p>
                      <p className="text-xs text-muted-foreground">
                        Notificações no navegador
                      </p>
                    </div>
                    <Switch 
                      checked={notifications.push}
                      onCheckedChange={(checked) => 
                        setNotifications(prev => ({ ...prev, push: checked }))
                      }
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium">SMS</p>
                      <p className="text-xs text-muted-foreground">
                        Alertas críticos por SMS
                      </p>
                    </div>
                    <Switch 
                      checked={notifications.sms}
                      onCheckedChange={(checked) => 
                        setNotifications(prev => ({ ...prev, sms: checked }))
                      }
                    />
                  </div>
                </div>
              </div>

              <div>
                <h4 className="text-sm font-medium mb-3">Tipos de Notificação</h4>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium">Campanhas</p>
                      <p className="text-xs text-muted-foreground">
                        Início, conclusão e problemas
                      </p>
                    </div>
                    <Switch 
                      checked={notifications.campaigns}
                      onCheckedChange={(checked) => 
                        setNotifications(prev => ({ ...prev, campaigns: checked }))
                      }
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium">Números</p>
                      <p className="text-xs text-muted-foreground">
                        Alertas de saúde e bloqueios
                      </p>
                    </div>
                    <Switch 
                      checked={notifications.numbers}
                      onCheckedChange={(checked) => 
                        setNotifications(prev => ({ ...prev, numbers: checked }))
                      }
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium">Relatórios</p>
                      <p className="text-xs text-muted-foreground">
                        Relatórios semanais e mensais
                      </p>
                    </div>
                    <Switch 
                      checked={notifications.reports}
                      onCheckedChange={(checked) => 
                        setNotifications(prev => ({ ...prev, reports: checked }))
                      }
                    />
                  </div>
                </div>
              </div>

              <Button className="w-full">
                <Save className="h-4 w-4 mr-2" />
                Salvar Preferências
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="numbers" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Smartphone className="h-5 w-5" />
                Números Conectados
              </CardTitle>
              <CardDescription>
                Gerencie seus números WhatsApp Business
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {connectedNumbers.map((number) => (
                  <Card key={number.id}>
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <Smartphone className="h-5 w-5 text-muted-foreground" />
                          <div>
                            <h3 className="font-medium">{number.phone}</h3>
                            <p className="text-sm text-muted-foreground">
                              {number.name} • Adicionado em {new Date(number.addedDate).toLocaleDateString('pt-BR')}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <Badge 
                            variant={number.status === "connected" ? "default" : "outline"}
                            className={number.status === "connected" ? "bg-emerald-100 text-emerald-700" : ""}
                          >
                            {number.status === "connected" ? "Conectado" : "Desconectado"}
                          </Badge>
                          <Button variant="outline" size="sm">
                            Configurar
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
              <div className="mt-6">
                <Button>
                  <Smartphone className="h-4 w-4 mr-2" />
                  Conectar Novo Número
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="billing" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-3">
            {plans.map((plan) => (
              <Card key={plan.name} className={plan.current ? "border-emerald-200 bg-emerald-50/30" : ""}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">{plan.name}</CardTitle>
                    {plan.current && (
                      <Badge className="bg-emerald-100 text-emerald-700">Atual</Badge>
                    )}
                  </div>
                  <div className="text-2xl font-bold">{plan.price}<span className="text-sm font-normal">/mês</span></div>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-sm">
                    {plan.features.map((feature, index) => (
                      <li key={index} className="flex items-center gap-2">
                        <div className="h-1 w-1 bg-emerald-500 rounded-full" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                  <Button 
                    className="w-full mt-4" 
                    variant={plan.current ? "outline" : "default"}
                    disabled={plan.current}
                  >
                    {plan.current ? "Plano Atual" : "Fazer Upgrade"}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CreditCard className="h-5 w-5" />
                Método de Pagamento
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="h-8 w-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded flex items-center justify-center text-white text-xs font-bold">
                    VISA
                  </div>
                  <div>
                    <p className="font-medium">•••• •••• •••• 1234</p>
                    <p className="text-sm text-muted-foreground">Expira em 12/2027</p>
                  </div>
                </div>
                <Button variant="outline" size="sm">
                  Editar
                </Button>
              </div>
              <Button variant="outline">
                <CreditCard className="h-4 w-4 mr-2" />
                Adicionar Cartão
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="integrations" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Bot className="h-5 w-5" />
                  Inteligência Artificial
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium">Assistente IA</p>
                    <p className="text-xs text-muted-foreground">
                      Respostas automáticas inteligentes
                    </p>
                  </div>
                  <Switch defaultChecked />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium">Auto-categorização</p>
                    <p className="text-xs text-muted-foreground">
                      Classificar contatos automaticamente
                    </p>
                  </div>
                  <Switch defaultChecked />
                </div>
                <div>
                  <Label htmlFor="ai-prompt">Prompt Personalizado</Label>
                  <Textarea 
                    id="ai-prompt" 
                    placeholder="Defina como a IA deve responder..."
                    className="mt-1"
                  />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Zap className="h-5 w-5" />
                  Webhooks
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="webhook-url">URL do Webhook</Label>
                  <Input 
                    id="webhook-url" 
                    placeholder="https://sua-api.com/webhook"
                  />
                </div>
                <div>
                  <Label>Eventos</Label>
                  <div className="space-y-2 mt-2">
                    <div className="flex items-center space-x-2">
                      <input type="checkbox" id="webhook-messages" defaultChecked />
                      <Label htmlFor="webhook-messages" className="text-sm">Novas mensagens</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <input type="checkbox" id="webhook-campaigns" />
                      <Label htmlFor="webhook-campaigns" className="text-sm">Status campanhas</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <input type="checkbox" id="webhook-contacts" />
                      <Label htmlFor="webhook-contacts" className="text-sm">Novos contatos</Label>
                    </div>
                  </div>
                </div>
                <Button className="w-full">
                  Testar Webhook
                </Button>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Key className="h-5 w-5" />
                API e Integrações
              </CardTitle>
              <CardDescription>
                Conecte o WhatsApp Suite com outras ferramentas
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="api-key">Chave da API</Label>
                <div className="flex gap-2">
                  <Input 
                    id="api-key" 
                    value="sk-1234567890abcdef..." 
                    type="password"
                    readOnly
                  />
                  <Button variant="outline">Copiar</Button>
                  <Button variant="outline">Gerar Nova</Button>
                </div>
              </div>
              <div className="grid gap-4 md:grid-cols-3">
                <div className="p-4 border rounded-lg text-center">
                  <div className="h-8 w-8 mx-auto mb-2 bg-blue-500 rounded flex items-center justify-center text-white">
                    Z
                  </div>
                  <p className="font-medium">Zapier</p>
                  <Button variant="outline" size="sm" className="mt-2">
                    Conectar
                  </Button>
                </div>
                <div className="p-4 border rounded-lg text-center">
                  <div className="h-8 w-8 mx-auto mb-2 bg-purple-500 rounded flex items-center justify-center text-white">
                    M
                  </div>
                  <p className="font-medium">Make</p>
                  <Button variant="outline" size="sm" className="mt-2">
                    Conectar
                  </Button>
                </div>
                <div className="p-4 border rounded-lg text-center">
                  <div className="h-8 w-8 mx-auto mb-2 bg-orange-500 rounded flex items-center justify-center text-white">
                    H
                  </div>
                  <p className="font-medium">HubSpot</p>
                  <Button variant="outline" size="sm" className="mt-2">
                    Conectar
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="advanced">
          <SettingsPanel />
        </TabsContent>
      </Tabs>
    </div>
  )
}
