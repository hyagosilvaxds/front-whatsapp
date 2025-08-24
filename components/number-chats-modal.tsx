"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"
import { 
  MessageSquare, 
  Search, 
  Filter, 
  Calendar,
  CheckCheck,
  Clock,
  User,
  Phone,
  Download,
  Eye
} from "lucide-react"

interface NumberChatsModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  phoneNumber: string
}

export default function NumberChatsModal({ open, onOpenChange, phoneNumber }: NumberChatsModalProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedChat, setSelectedChat] = useState<string | null>(null)

  // Mock data for conversations from this specific number
  const conversations = [
    {
      id: "1",
      contactName: "Maria Santos",
      contactPhone: "+55 11 99888-7777",
      avatar: "/placeholder-user.jpg",
      lastMessage: "Obrigada pelo atendimento!",
      lastMessageTime: "14:32",
      messagesCount: 15,
      status: "completed",
      date: "2025-08-09",
      messages: [
        { id: "m1", from: "system", text: `Conversa iniciada via ${phoneNumber}`, time: "14:20", type: "system" },
        { id: "m2", from: "contact", text: "Olá! Vi sua oferta no Instagram.", time: "14:20" },
        { id: "m3", from: "me", text: "Olá Maria! Que bom te ver aqui. Como posso te ajudar?", time: "14:21" },
        { id: "m4", from: "contact", text: "Gostaria de saber mais sobre o produto premium", time: "14:22" },
        { id: "m5", from: "me", text: "Claro! O produto premium inclui...", time: "14:23" },
        { id: "m6", from: "contact", text: "Perfeito! Qual o valor?", time: "14:25" },
        { id: "m7", from: "me", text: "O investimento é de R$ 297 com desconto especial", time: "14:26" },
        { id: "m8", from: "contact", text: "Vou levar! Como faço o pagamento?", time: "14:28" },
        { id: "m9", from: "me", text: "Ótimo! Vou te enviar o link de pagamento", time: "14:29" },
        { id: "m10", from: "contact", text: "Obrigada pelo atendimento!", time: "14:32" }
      ]
    },
    {
      id: "2", 
      contactName: "João Silva",
      contactPhone: "+55 21 99777-6666",
      avatar: "/placeholder-user.jpg",
      lastMessage: "Ainda estou pensando...",
      lastMessageTime: "13:45",
      messagesCount: 8,
      status: "pending",
      date: "2025-08-09",
      messages: [
        { id: "m1", from: "system", text: `Conversa iniciada via ${phoneNumber}`, time: "13:30", type: "system" },
        { id: "m2", from: "contact", text: "Oi, vi seu anúncio", time: "13:30" },
        { id: "m3", from: "me", text: "Olá João! Como posso ajudar?", time: "13:31" },
        { id: "m4", from: "contact", text: "Queria saber sobre preços", time: "13:32" },
        { id: "m5", from: "me", text: "Temos várias opções! Qual seu interesse?", time: "13:33" },
        { id: "m6", from: "contact", text: "O básico mesmo", time: "13:35" },
        { id: "m7", from: "me", text: "O plano básico sai por R$ 97. Te interessa?", time: "13:36" },
        { id: "m8", from: "contact", text: "Ainda estou pensando...", time: "13:45" }
      ]
    },
    {
      id: "3",
      contactName: "Ana Costa", 
      contactPhone: "+55 31 99666-5555",
      avatar: "/placeholder-user.jpg",
      lastMessage: "Quando vocês fazem entrega?",
      lastMessageTime: "12:15",
      messagesCount: 5,
      status: "active",
      date: "2025-08-09",
      messages: [
        { id: "m1", from: "system", text: `Conversa iniciada via ${phoneNumber}`, time: "12:10", type: "system" },
        { id: "m2", from: "contact", text: "Olá! Vocês entregam em BH?", time: "12:10" },
        { id: "m3", from: "me", text: "Sim Ana! Entregamos em toda BH", time: "12:11" },
        { id: "m4", from: "contact", text: "Que ótimo!", time: "12:12" },
        { id: "m5", from: "contact", text: "Quando vocês fazem entrega?", time: "12:15" }
      ]
    }
  ]

  const filteredConversations = conversations.filter(conv => 
    conv.contactName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    conv.contactPhone.includes(searchQuery)
  )

  const selectedConversation = conversations.find(conv => conv.id === selectedChat)

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "completed":
        return <Badge className="bg-emerald-100 text-emerald-700 hover:bg-emerald-100">Finalizada</Badge>
      case "active":
        return <Badge className="bg-blue-100 text-blue-700 hover:bg-blue-100">Ativa</Badge>
      case "pending":
        return <Badge className="bg-amber-100 text-amber-700 hover:bg-amber-100">Pendente</Badge>
      default:
        return <Badge variant="outline">Desconhecida</Badge>
    }
  }

  const stats = {
    total: conversations.length,
    completed: conversations.filter(c => c.status === "completed").length,
    active: conversations.filter(c => c.status === "active").length,
    pending: conversations.filter(c => c.status === "pending").length,
    totalMessages: conversations.reduce((acc, conv) => acc + conv.messagesCount, 0)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-6xl h-[80vh]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <MessageSquare className="h-5 w-5" />
            Conversas do Número {phoneNumber}
          </DialogTitle>
          <DialogDescription>
            Visualize todas as conversas realizadas através deste número
          </DialogDescription>
        </DialogHeader>

        {/* Stats */}
        <div className="grid grid-cols-5 gap-3 mb-4">
          <Card>
            <CardContent className="p-3 text-center">
              <div className="text-lg font-bold text-blue-600">{stats.total}</div>
              <div className="text-xs text-muted-foreground">Total</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-3 text-center">
              <div className="text-lg font-bold text-emerald-600">{stats.completed}</div>
              <div className="text-xs text-muted-foreground">Finalizadas</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-3 text-center">
              <div className="text-lg font-bold text-blue-600">{stats.active}</div>
              <div className="text-xs text-muted-foreground">Ativas</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-3 text-center">
              <div className="text-lg font-bold text-amber-600">{stats.pending}</div>
              <div className="text-xs text-muted-foreground">Pendentes</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-3 text-center">
              <div className="text-lg font-bold text-purple-600">{stats.totalMessages}</div>
              <div className="text-xs text-muted-foreground">Mensagens</div>
            </CardContent>
          </Card>
        </div>

        <div className="flex gap-4 h-full">
          {/* Conversations List */}
          <div className="w-1/3">
            <Card className="h-full">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">Conversas</CardTitle>
                  <Badge variant="secondary">{filteredConversations.length}</Badge>
                </div>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Buscar contatos..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-9"
                  />
                </div>
              </CardHeader>
              <CardContent className="p-0">
                <ScrollArea className="h-[400px]">
                  <div className="space-y-1 p-3">
                    {filteredConversations.map((conv) => (
                      <div
                        key={conv.id}
                        className={`p-3 rounded-lg cursor-pointer transition-colors hover:bg-muted/50 ${
                          selectedChat === conv.id ? 'bg-emerald-50 border border-emerald-200' : ''
                        }`}
                        onClick={() => setSelectedChat(conv.id)}
                      >
                        <div className="flex items-start gap-3">
                          <Avatar className="h-8 w-8">
                            <AvatarImage src={conv.avatar} alt={conv.contactName} />
                            <AvatarFallback>{conv.contactName.charAt(0)}</AvatarFallback>
                          </Avatar>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between">
                              <p className="text-sm font-medium truncate">{conv.contactName}</p>
                              <span className="text-xs text-muted-foreground">{conv.lastMessageTime}</span>
                            </div>
                            <p className="text-xs text-muted-foreground truncate mt-1">
                              {conv.lastMessage}
                            </p>
                            <div className="flex items-center justify-between mt-2">
                              {getStatusBadge(conv.status)}
                              <div className="flex items-center gap-1 text-xs text-muted-foreground">
                                <MessageSquare className="h-3 w-3" />
                                {conv.messagesCount}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>
          </div>

          {/* Chat View */}
          <div className="flex-1">
            <Card className="h-full">
              {selectedConversation ? (
                <>
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <Avatar className="h-8 w-8">
                          <AvatarImage src={selectedConversation.avatar} alt={selectedConversation.contactName} />
                          <AvatarFallback>{selectedConversation.contactName.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium">{selectedConversation.contactName}</p>
                          <p className="text-xs text-muted-foreground">{selectedConversation.contactPhone}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        {getStatusBadge(selectedConversation.status)}
                        <Button variant="outline" size="sm">
                          <Phone className="h-4 w-4 mr-2" />
                          Ligar
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  <Separator />
                  <CardContent className="p-0">
                    <ScrollArea className="h-[350px] p-4">
                      <div className="space-y-3">
                        {selectedConversation.messages.map((message) => (
                          <div key={message.id}>
                            {message.type === "system" ? (
                              <div className="text-center">
                                <div className="inline-block px-3 py-1 bg-muted rounded-full text-xs text-muted-foreground">
                                  {message.text}
                                </div>
                              </div>
                            ) : (
                              <div className={`flex ${message.from === "me" ? "justify-end" : "justify-start"}`}>
                                <div
                                  className={`max-w-[70%] rounded-lg px-3 py-2 ${
                                    message.from === "me"
                                      ? "bg-emerald-500 text-white"
                                      : "bg-muted"
                                  }`}
                                >
                                  <p className="text-sm">{message.text}</p>
                                  <div className={`flex items-center justify-end gap-1 mt-1 ${
                                    message.from === "me" ? "text-emerald-100" : "text-muted-foreground"
                                  }`}>
                                    <span className="text-xs">{message.time}</span>
                                    {message.from === "me" && (
                                      <CheckCheck className="h-3 w-3" />
                                    )}
                                  </div>
                                </div>
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    </ScrollArea>
                  </CardContent>
                </>
              ) : (
                <CardContent className="h-full flex items-center justify-center">
                  <div className="text-center text-muted-foreground">
                    <MessageSquare className="h-12 w-12 mx-auto mb-2 opacity-50" />
                    <p>Selecione uma conversa para visualizar</p>
                  </div>
                </CardContent>
              )}
            </Card>
          </div>
        </div>

        <div className="flex justify-between items-center pt-4 border-t">
          <div className="text-sm text-muted-foreground">
            {filteredConversations.length} conversas encontradas
          </div>
          <div className="flex gap-2">
            <Button variant="outline">
              <Download className="h-4 w-4 mr-2" />
              Exportar Conversas
            </Button>
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Fechar
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
