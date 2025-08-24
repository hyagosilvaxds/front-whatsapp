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
    
    if (input.includes('disparo') || input.includes('campanha') || input.includes('massa')) {
      return {
        id: Date.now().toString(),
        type: 'assistant',
        content: 'Perfeito! Vou te ajudar a configurar um disparo em massa. Para criar uma campanha eficiente, preciso de algumas informações:\n\n1. **Público-alvo**: Quantos contatos você quer atingir?\n2. **Mensagem**: Que tipo de conteúdo quer enviar?\n3. **Cronograma**: Quando quer iniciar o disparo?\n4. **Números**: Quais conexões WhatsApp usar?\n\nPosso configurar tudo automaticamente se você me passar essas informações!',
        timestamp: new Date(),
        actions: [
          { id: 'b1', label: 'Criar Campanha Rápida', action: 'quick_campaign' },
          { id: 'b2', label: 'Campanha Avançada', action: 'advanced_campaign' },
          { id: 'b3', label: 'Ver Templates', action: 'view_templates' }
        ]
      }
    }
    
    if (input.includes('aquecimento') || input.includes('aquec')) {
      return {
        id: Date.now().toString(),
        type: 'assistant',
        content: 'Ótima escolha! O aquecimento é essencial para manter seus números seguros. Vou te ajudar a configurar:\n\n🔥 **Processo de Aquecimento Automático**\n\n• **Fase 1**: 50 mensagens/dia (primeiros 7 dias)\n• **Fase 2**: 100 mensagens/dia (próximos 7 dias)\n• **Fase 3**: 200+ mensagens/dia (após 14 dias)\n\nQuais números você quer incluir no aquecimento? Posso começar agora mesmo!',
        timestamp: new Date(),
        actions: [
          { id: 'c1', label: 'Iniciar Aquecimento', action: 'start_warmup_process' },
          { id: 'c2', label: 'Configurar Cronograma', action: 'configure_schedule' },
          { id: 'c3', label: 'Ver Números Disponíveis', action: 'view_numbers' }
        ]
      }
    }
    
    if (input.includes('relatório') || input.includes('analytics')) {
      return {
        id: Date.now().toString(),
        type: 'assistant',
        content: 'Vou gerar um relatório completo para você! 📊\n\n**Resumo das Últimas 24h:**\n• 1.247 mensagens enviadas\n• 89% taxa de entrega\n• 23% taxa de abertura\n• 4 números em aquecimento\n\nQue tipo de análise específica você gostaria de ver?',
        timestamp: new Date(),
        actions: [
          { id: 'd1', label: 'Relatório Completo', action: 'full_report' },
          { id: 'd2', label: 'Performance por Número', action: 'number_performance' },
          { id: 'd3', label: 'Análise de Entregas', action: 'delivery_analysis' }
        ]
      }
    }

    // Resposta genérica
    return {
      id: Date.now().toString(),
      type: 'assistant',
      content: 'Entendi! Posso te ajudar com isso. Aqui estão algumas opções do que posso fazer por você:',
      timestamp: new Date(),
      actions: [
        { id: 'e1', label: 'Configurar Disparo', action: 'configure_bulk_send' },
        { id: 'e2', label: 'Gerenciar Aquecimento', action: 'manage_warmup' },
        { id: 'e3', label: 'Ver Status Geral', action: 'general_status' },
        { id: 'e4', label: 'Ajuda Detalhada', action: 'detailed_help' }
      ]
    }
  }

  const handleActionClick = (action: ActionSuggestion) => {
    toast({
      title: "Ação Executada",
      description: `Executando: ${action.label}`,
    })
    
    // Simular execução da ação
    const responseMessage: Message = {
      id: Date.now().toString(),
      type: 'assistant',
      content: `✅ **${action.label}** executada com sucesso!\n\nVou processar isso para você. Em alguns instantes você verá os resultados na tela correspondente.`,
      timestamp: new Date()
    }
    
    setMessages(prev => [...prev, responseMessage])
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
