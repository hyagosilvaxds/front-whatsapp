'use client'

import { useState, useRef, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { 
  Bot, 
  Send, 
  Sparkles, 
  Rocket, 
  Flame, 
  Settings, 
  BarChart3,
  MoreHorizontal,
  ArrowLeft
} from 'lucide-react'
import { useToast } from '@/hooks/use-toast'
import AIAssistantIntro from '@/components/ai-assistant-intro'

interface Message {
  id: string
  type: 'user' | 'assistant'
  content: string
  timestamp: Date
  actions?: ActionSuggestion[]
}

interface ActionSuggestion {
  id: string
  label: string
  action: string
  parameters?: any
}

export default function AIAssistantPage() {
  const { toast } = useToast()
  const [showChat, setShowChat] = useState(false)
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      type: 'assistant',
      content: 'Olá! Sou seu assistente de IA para WhatsApp Suite. Posso ajudar você a configurar disparos em massa, iniciar processos de aquecimento, configurar automações e muito mais. Como posso te ajudar hoje?',
      timestamp: new Date(),
      actions: [
        { id: 'a1', label: 'Configurar Disparo', action: 'configure_bulk_send' },
        { id: 'a2', label: 'Iniciar Aquecimento', action: 'start_warmup' },
        { id: 'a3', label: 'Ver Relatórios', action: 'view_reports' },
        { id: 'a4', label: 'Configurar IA', action: 'configure_ai' }
      ]
    }
  ])
  
  const [inputMessage, setInputMessage] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)
  const scrollAreaRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight
    }
  }, [messages])

  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return

    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content: inputMessage,
      timestamp: new Date()
    }

    setMessages(prev => [...prev, userMessage])
    setInputMessage('')
    setIsTyping(true)

    // Simular resposta da IA
    setTimeout(() => {
      const response = generateAIResponse(inputMessage)
      setMessages(prev => [...prev, response])
      setIsTyping(false)
    }, 1500)
  }

  const generateAIResponse = (userInput: string): Message => {
    const input = userInput.toLowerCase()
    
    // Respostas baseadas no contexto
    let content = ''
    let actions: ActionSuggestion[] = []

    if (input.includes('disparo') || input.includes('massa') || input.includes('enviar')) {
      content = `Entendi que você quer configurar um disparo em massa! Vou te ajudar com isso.

Para configurar seu disparo, preciso de algumas informações:

🎯 **Público-alvo**: Quantos contatos você quer alcançar?
📝 **Mensagem**: Qual será o conteúdo da mensagem?
⏰ **Timing**: Quando você quer enviar?
📊 **Configuração**: Intervalo entre mensagens para evitar bloqueios

Posso configurar tudo isso para você de forma inteligente!`

      actions = [
        { id: 'config_contacts', label: 'Configurar Contatos', action: 'configure_contacts' },
        { id: 'create_message', label: 'Criar Mensagem', action: 'create_message' },
        { id: 'schedule_send', label: 'Agendar Envio', action: 'schedule_send' }
      ]
    } else if (input.includes('aquecimento') || input.includes('warming') || input.includes('warm')) {
      content = `Perfeito! O aquecimento é essencial para manter seus números seguros.

🔥 **Processo de Aquecimento Inteligente**:

1. **Início Gradual**: Começamos com 10-20 mensagens por dia
2. **Incremento Progressivo**: Aumentamos gradualmente o volume
3. **Monitoramento**: Acompanhamos a saúde do número
4. **Proteção**: Pausamos automaticamente se detectarmos riscos

Quer que eu configure um plano de aquecimento personalizado para seus números?`

      actions = [
        { id: 'start_warmup', label: 'Iniciar Aquecimento', action: 'start_warmup' },
        { id: 'warmup_schedule', label: 'Ver Cronograma', action: 'view_warmup_schedule' },
        { id: 'number_health', label: 'Status dos Números', action: 'check_number_health' }
      ]
    } else if (input.includes('relatório') || input.includes('analytics') || input.includes('performance')) {
      content = `Ótima pergunta! Os relatórios são fundamentais para otimizar sua estratégia.

📊 **Relatórios Disponíveis**:

• **Performance Geral**: Taxa de entrega, abertura e resposta
• **Saúde dos Números**: Status de cada WhatsApp
• **Análise de Campanhas**: ROI e engajamento
• **Relatórios de Aquecimento**: Progresso dos números

Que tipo de relatório você gostaria de ver primeiro?`

      actions = [
        { id: 'general_report', label: 'Relatório Geral', action: 'view_general_report' },
        { id: 'number_status', label: 'Status dos Números', action: 'view_number_status' },
        { id: 'campaign_analysis', label: 'Análise de Campanhas', action: 'view_campaign_analysis' }
      ]
    } else if (input.includes('ia') || input.includes('inteligência') || input.includes('automação')) {
      content = `Excelente! A IA pode automatizar muito do seu trabalho no WhatsApp.

🤖 **Recursos de IA Disponíveis**:

• **Respostas Automáticas**: IA responde dúvidas comuns
• **Classificação de Leads**: Identifica prospects quentes
• **Otimização de Horários**: Melhor momento para enviar
• **Análise de Sentimento**: Entende o humor dos clientes
• **Auto-follow-up**: Sequências automáticas

Qual recurso te interessa mais?`

      actions = [
        { id: 'auto_responses', label: 'Configurar Respostas', action: 'setup_auto_responses' },
        { id: 'lead_scoring', label: 'Classificar Leads', action: 'setup_lead_scoring' },
        { id: 'optimize_timing', label: 'Otimizar Horários', action: 'optimize_send_timing' }
      ]
    } else {
      content = `Entendi! Posso te ajudar com várias coisas no WhatsApp Suite:

💬 **Disparos em Massa**: Configure campanhas inteligentes
🔥 **Aquecimento**: Mantenha seus números seguros  
📊 **Relatórios**: Analise performance e resultados
⚙️ **Configurações**: Otimize suas automações
🤖 **IA Avançada**: Respostas e análises automáticas

Sobre qual desses tópicos você gostaria de saber mais?`

      actions = [
        { id: 'bulk_help', label: 'Ajuda com Disparos', action: 'help_bulk_send' },
        { id: 'warmup_help', label: 'Ajuda com Aquecimento', action: 'help_warmup' },
        { id: 'reports_help', label: 'Ajuda com Relatórios', action: 'help_reports' },
        { id: 'ai_help', label: 'Recursos de IA', action: 'help_ai_features' }
      ]
    }

    return {
      id: Date.now().toString(),
      type: 'assistant',
      content,
      timestamp: new Date(),
      actions
    }
  }

  const handleActionClick = (action: ActionSuggestion) => {
    // Simular execução da ação
    const actionMessages: Record<string, string> = {
      configure_bulk_send: 'Abrindo configuração de disparo em massa...',
      start_warmup: 'Iniciando processo de aquecimento...',
      view_reports: 'Carregando relatórios de performance...',
      configure_ai: 'Abrindo configurações de IA...',
      configure_contacts: 'Abrindo lista de contatos...',
      create_message: 'Abrindo editor de mensagens...',
      schedule_send: 'Abrindo agendador...',
      view_warmup_schedule: 'Carregando cronograma de aquecimento...',
      check_number_health: 'Verificando saúde dos números...',
      view_general_report: 'Carregando relatório geral...',
      view_number_status: 'Verificando status dos números...',
      view_campaign_analysis: 'Carregando análise de campanhas...',
      setup_auto_responses: 'Configurando respostas automáticas...',
      setup_lead_scoring: 'Configurando classificação de leads...',
      optimize_send_timing: 'Otimizando horários de envio...'
    }

    toast({
      title: 'Ação Executada',
      description: actionMessages[action.action] || 'Executando ação...',
    })

    // Adicionar mensagem do sistema
    const systemMessage: Message = {
      id: Date.now().toString(),
      type: 'assistant',
      content: `✅ ${actionMessages[action.action] || 'Ação executada com sucesso!'}`,
      timestamp: new Date()
    }

    setMessages(prev => [...prev, systemMessage])
  }

  return (
    <>
      {!showChat ? (
        <div className="h-full flex flex-col">
          {/* Introduction */}
          <div className="flex-1 overflow-auto p-6">
            <AIAssistantIntro onStartChat={() => setShowChat(true)} />
          </div>
        </div>
      ) : (
        <div className="h-full flex flex-col">
          {/* Chat Header */}
          <div className="border-b p-4 flex items-center justify-between bg-background">
            <div className="flex items-center gap-3">
              <Button variant="ghost" size="sm" onClick={() => setShowChat(false)}>
                <ArrowLeft className="h-4 w-4" />
              </Button>
              <Avatar>
                <AvatarImage src="/ai-avatar.png" />
                <AvatarFallback>
                  <Bot className="h-4 w-4" />
                </AvatarFallback>
              </Avatar>
              <div>
                <h3 className="font-medium">Assistente WhatsApp Suite</h3>
                <p className="text-sm text-muted-foreground flex items-center gap-1">
                  <div className="w-2 h-2 bg-green-500 rounded-full" />
                  Online • Pronto para ajudar
                </p>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <Badge variant="secondary" className="flex items-center gap-1">
                <Sparkles className="h-3 w-3" />
                IA Ativa
              </Badge>
              <Button variant="outline" size="sm">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Messages Area */}
          <ScrollArea className="flex-1 p-6" ref={scrollAreaRef}>
            <div className="space-y-4 max-w-4xl mx-auto">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex gap-3 ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  {message.type === 'assistant' && (
                    <Avatar className="w-8 h-8">
                      <AvatarFallback>
                        <Bot className="h-4 w-4" />
                      </AvatarFallback>
                    </Avatar>
                  )}
                  
                  <div className={`max-w-[80%] ${message.type === 'user' ? 'order-first' : ''}`}>
                    <div
                      className={`rounded-2xl px-4 py-3 ${
                        message.type === 'user'
                          ? 'bg-primary text-primary-foreground ml-auto'
                          : 'bg-muted'
                      }`}
                    >
                      <p className="whitespace-pre-wrap">{message.content}</p>
                    </div>
                    
                    {message.actions && message.actions.length > 0 && (
                      <div className="flex flex-wrap gap-2 mt-3">
                        {message.actions.map((action) => (
                          <Button
                            key={action.id}
                            variant="outline"
                            size="sm"
                            onClick={() => handleActionClick(action)}
                            className="text-xs"
                          >
                            {action.label}
                          </Button>
                        ))}
                      </div>
                    )}
                    
                    <p className="text-xs text-muted-foreground mt-2">
                      {message.timestamp.toLocaleTimeString('pt-BR', {
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </p>
                  </div>
                  
                  {message.type === 'user' && (
                    <Avatar className="w-8 h-8">
                      <AvatarImage src="/placeholder-user.jpg" />
                      <AvatarFallback>U</AvatarFallback>
                    </Avatar>
                  )}
                </div>
              ))}
              
              {isTyping && (
                <div className="flex gap-3">
                  <Avatar className="w-8 h-8">
                    <AvatarFallback>
                      <Bot className="h-4 w-4" />
                    </AvatarFallback>
                  </Avatar>
                  <div className="bg-muted rounded-2xl px-4 py-3">
                    <div className="flex gap-1">
                      <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" />
                      <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: '0.1s' }} />
                      <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
                    </div>
                  </div>
                </div>
              )}
            </div>
          </ScrollArea>

          {/* Input Area */}
          <div className="border-t p-4 bg-background">
            <div className="max-w-4xl mx-auto">
              <div className="flex gap-2">
                <div className="flex-1 relative">
                  <Input
                    ref={inputRef}
                    value={inputMessage}
                    onChange={(e) => setInputMessage(e.target.value)}
                    placeholder="Digite sua mensagem... (ex: 'Quero configurar um disparo para 1000 contatos')"
                    onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                    className="pr-12"
                  />
                  <Button
                    size="sm"
                    onClick={handleSendMessage}
                    disabled={!inputMessage.trim() || isTyping}
                    className="absolute right-1 top-1/2 -translate-y-1/2 h-8 w-8 p-0"
                  >
                    <Send className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              
              {/* Quick Actions */}
              <div className="flex flex-wrap gap-2 mt-3">
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => setInputMessage('Quero configurar um disparo em massa')}
                  className="text-xs"
                >
                  <Rocket className="h-3 w-3 mr-1" />
                  Configurar Disparo
                </Button>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => setInputMessage('Preciso iniciar o aquecimento dos meus números')}
                  className="text-xs"
                >
                  <Flame className="h-3 w-3 mr-1" />
                  Iniciar Aquecimento
                </Button>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => setInputMessage('Quero ver os relatórios de performance')}
                  className="text-xs"
                >
                  <BarChart3 className="h-3 w-3 mr-1" />
                  Ver Relatórios
                </Button>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => setInputMessage('Como configurar a IA para respostas automáticas?')}
                  className="text-xs"
                >
                  <Settings className="h-3 w-3 mr-1" />
                  Configurar IA
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
