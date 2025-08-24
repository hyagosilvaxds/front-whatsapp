'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { 
  Bot, 
  Sparkles, 
  Rocket, 
  Flame, 
  MessageSquare, 
  Settings,
  TrendingUp,
  Users,
  Calendar,
  CheckCircle,
  AlertTriangle,
  Clock
} from 'lucide-react'

const examples = [
  {
    category: 'Disparos em Massa',
    icon: Rocket,
    color: 'bg-blue-500',
    examples: [
      'Quero enviar uma promoção para 5.000 contatos hoje às 14h',
      'Criar campanha de Black Friday para clientes VIP',
      'Configurar disparo sequencial para leads não convertidos',
      'Enviar pesquisa de satisfação para quem comprou este mês'
    ]
  },
  {
    category: 'Aquecimento',
    icon: Flame,
    color: 'bg-orange-500',
    examples: [
      'Iniciar aquecimento automático para 3 números novos',
      'Verificar status do aquecimento do número +55 11 99999-8888',
      'Configurar cronograma gradual para número recém-conectado',
      'Pausar aquecimento do número que está com limite atingido'
    ]
  },
  {
    category: 'Configurações IA',
    icon: Settings,
    color: 'bg-purple-500',
    examples: [
      'Ativar respostas automáticas para horário comercial',
      'Criar prompt personalizado para atendimento de vendas',
      'Configurar delay de 3 segundos entre mensagens',
      'Definir palavras-chave para encaminhamento automático'
    ]
  },
  {
    category: 'Análises',
    icon: TrendingUp,
    color: 'bg-green-500',
    examples: [
      'Mostrar performance dos últimos 7 dias',
      'Quais números têm melhor taxa de entrega?',
      'Relatório de conversões por campanha',
      'Análise de horários com maior engajamento'
    ]
  }
]

const recentActions = [
  {
    id: '1',
    action: 'Configurou disparo para 2.500 contatos',
    timestamp: '2 min atrás',
    status: 'success',
    details: 'Campanha "Promoção de Verão" agendada para 14h'
  },
  {
    id: '2',
    action: 'Iniciou aquecimento de 2 números',
    timestamp: '15 min atrás',
    status: 'in-progress',
    details: 'Processo gradual configurado para 14 dias'
  },
  {
    id: '3',
    action: 'Otimizou configurações de IA',
    timestamp: '1 hora atrás',
    status: 'success',
    details: 'Taxa de resposta melhorou 23%'
  }
]

interface AIAssistantIntroProps {
  onStartChat: () => void
}

export default function AIAssistantIntro({ onStartChat }: AIAssistantIntroProps) {
  return (
    <div className="space-y-6">
      {/* Hero Section */}
      <div className="text-center py-12 bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl border">
        <div className="max-w-3xl mx-auto px-6">
          <div className="flex justify-center mb-6">
            <div className="relative">
              <Bot className="h-16 w-16 text-primary" />
              <Sparkles className="h-6 w-6 text-yellow-500 absolute -top-1 -right-1 animate-pulse" />
            </div>
          </div>
          
          <h1 className="text-4xl font-bold mb-4">
            Assistente IA do WhatsApp Suite
          </h1>
          
          <p className="text-xl text-muted-foreground mb-8">
            Configure disparos, gerencie aquecimentos e otimize suas campanhas 
            através de conversas naturais com inteligência artificial
          </p>
          
          <div className="flex justify-center gap-4">
            <Button size="lg" onClick={onStartChat} className="text-lg px-8">
              <MessageSquare className="h-5 w-5 mr-2" />
              Iniciar Conversa
            </Button>
            <Button size="lg" variant="outline" className="text-lg px-8">
              <Bot className="h-5 w-5 mr-2" />
              Ver Exemplos
            </Button>
          </div>
        </div>
      </div>

      {/* Features Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="text-center">
          <CardContent className="pt-6">
            <Rocket className="h-12 w-12 mx-auto text-blue-500 mb-4" />
            <h3 className="font-semibold mb-2">Disparos Inteligentes</h3>
            <p className="text-sm text-muted-foreground">
              Configure campanhas completas apenas conversando
            </p>
          </CardContent>
        </Card>

        <Card className="text-center">
          <CardContent className="pt-6">
            <Flame className="h-12 w-12 mx-auto text-orange-500 mb-4" />
            <h3 className="font-semibold mb-2">Aquecimento Automático</h3>
            <p className="text-sm text-muted-foreground">
              Processos otimizados para manter seus números seguros
            </p>
          </CardContent>
        </Card>

        <Card className="text-center">
          <CardContent className="pt-6">
            <Settings className="h-12 w-12 mx-auto text-purple-500 mb-4" />
            <h3 className="font-semibold mb-2">Configuração Fácil</h3>
            <p className="text-sm text-muted-foreground">
              Ajuste parâmetros complexos com linguagem natural
            </p>
          </CardContent>
        </Card>

        <Card className="text-center">
          <CardContent className="pt-6">
            <TrendingUp className="h-12 w-12 mx-auto text-green-500 mb-4" />
            <h3 className="font-semibold mb-2">Análises Dinâmicas</h3>
            <p className="text-sm text-muted-foreground">
              Insights personalizados sobre performance
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Examples Section */}
      <Tabs defaultValue="disparos" className="space-y-6">
        <div>
          <h2 className="text-2xl font-bold mb-4">Exemplos do que você pode fazer</h2>
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="disparos">Disparos</TabsTrigger>
            <TabsTrigger value="aquecimento">Aquecimento</TabsTrigger>
            <TabsTrigger value="config">Config IA</TabsTrigger>
            <TabsTrigger value="analises">Análises</TabsTrigger>
          </TabsList>
        </div>

        {examples.map((category, index) => (
          <TabsContent key={index} value={category.category.toLowerCase().replace(' ', '').replace('í', 'i')}>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <category.icon className={`h-5 w-5 text-white`} />
                  <span className={`w-8 h-8 rounded-full flex items-center justify-center ${category.color}`}>
                    <category.icon className="h-4 w-4 text-white" />
                  </span>
                  {category.category}
                </CardTitle>
                <CardDescription>
                  Exemplos de comandos que você pode usar
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-3">
                  {category.examples.map((example, idx) => (
                    <Button
                      key={idx}
                      variant="outline"
                      className="justify-start h-auto p-4 text-left"
                      onClick={onStartChat}
                    >
                      <MessageSquare className="h-4 w-4 mr-3 text-muted-foreground shrink-0" />
                      <span className="text-sm">{example}</span>
                    </Button>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        ))}
      </Tabs>

      {/* Recent Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Ações Recentes da IA</CardTitle>
          <CardDescription>
            Últimas tarefas executadas pelo assistente
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {recentActions.map((action) => (
              <div key={action.id} className="flex items-center gap-4 p-4 border rounded-lg">
                <div className="flex-shrink-0">
                  {action.status === 'success' && (
                    <CheckCircle className="h-5 w-5 text-green-500" />
                  )}
                  {action.status === 'in-progress' && (
                    <Clock className="h-5 w-5 text-yellow-500" />
                  )}
                  {action.status === 'error' && (
                    <AlertTriangle className="h-5 w-5 text-red-500" />
                  )}
                </div>
                
                <div className="flex-1">
                  <p className="font-medium">{action.action}</p>
                  <p className="text-sm text-muted-foreground">{action.details}</p>
                </div>
                
                <div className="text-sm text-muted-foreground">
                  {action.timestamp}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-3xl font-bold text-blue-600">1,247</p>
              <p className="text-sm text-muted-foreground">Tarefas Executadas</p>
              <Progress value={87} className="mt-2" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-3xl font-bold text-green-600">98.5%</p>
              <p className="text-sm text-muted-foreground">Taxa de Sucesso</p>
              <Progress value={98} className="mt-2" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-3xl font-bold text-purple-600">1.2s</p>
              <p className="text-sm text-muted-foreground">Tempo Médio</p>
              <Progress value={75} className="mt-2" />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
