"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { 
  Search, 
  Filter, 
  MessageSquare, 
  Phone, 
  Video, 
  MoreHorizontal,
  Send,
  Paperclip,
  Smile,
  Mic,
  CheckCheck,
  Clock,
  User,
  Bot
} from "lucide-react"
import ChatPanel from "../chat-panel"

export default function ChatPage() {
  const [selectedChat, setSelectedChat] = useState<string | null>("1")
  const [searchQuery, setSearchQuery] = useState("")

  const chats = [
    {
      id: "1",
      name: "Maria Santos",
      phone: "+55 11 99999-0001",
      avatar: "/placeholder-user.jpg",
      lastMessage: "Perfeito, obrigado!",
      time: "09:45",
      unread: 2,
      status: "online",
      tags: ["Lead", "Premium"]
    },
    {
      id: "2", 
      name: "João Silva",
      phone: "+55 11 99999-0002",
      avatar: "/placeholder-user.jpg",
      lastMessage: "Quando posso agendar?",
      time: "09:30",
      unread: 0,
      status: "offline",
      tags: ["Cliente"]
    },
    {
      id: "3",
      name: "Ana Costa",
      phone: "+55 21 99999-0003", 
      avatar: "/placeholder-user.jpg",
      lastMessage: "Estou interessada no produto",
      time: "08:15",
      unread: 1,
      status: "online",
      tags: ["Novo Lead"]
    }
  ]

  const filteredChats = chats.filter(chat => 
    chat.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    chat.phone.includes(searchQuery)
  )

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Atendimento</h1>
          <p className="text-muted-foreground">
            Gerencie todas as suas conversas do WhatsApp
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <Filter className="h-4 w-4 mr-2" />
            Filtros
          </Button>
          <Button size="sm">
            <MessageSquare className="h-4 w-4 mr-2" />
            Nova Conversa
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <MessageSquare className="h-4 w-4 text-emerald-500" />
              <div>
                <p className="text-sm font-medium">Conversas Ativas</p>
                <p className="text-2xl font-bold">24</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-amber-500" />
              <div>
                <p className="text-sm font-medium">Não Lidas</p>
                <p className="text-2xl font-bold">5</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <User className="h-4 w-4 text-blue-500" />
              <div>
                <p className="text-sm font-medium">Tempo Resp. Médio</p>
                <p className="text-2xl font-bold">2m</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Bot className="h-4 w-4 text-purple-500" />
              <div>
                <p className="text-sm font-medium">IA Ativa</p>
                <p className="text-2xl font-bold">87%</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Chat Interface */}
      <div className="grid lg:grid-cols-7 gap-6 h-[600px]">
        {/* Chat List */}
        <Card className="lg:col-span-2">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg">Conversas</CardTitle>
              <Badge variant="secondary">{filteredChats.length}</Badge>
            </div>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar conversas..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
              />
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <ScrollArea className="h-[480px]">
              <div className="space-y-1 p-3">
                {filteredChats.map((chat) => (
                  <div
                    key={chat.id}
                    className={`p-3 rounded-lg cursor-pointer transition-colors hover:bg-muted/50 ${
                      selectedChat === chat.id ? 'bg-emerald-50 border border-emerald-200' : ''
                    }`}
                    onClick={() => setSelectedChat(chat.id)}
                  >
                    <div className="flex items-start gap-3">
                      <div className="relative">
                        <Avatar className="h-10 w-10">
                          <AvatarImage src={chat.avatar} alt={chat.name} />
                          <AvatarFallback>{chat.name.charAt(0)}</AvatarFallback>
                        </Avatar>
                        {chat.status === 'online' && (
                          <div className="absolute -bottom-1 -right-1 h-3 w-3 bg-emerald-500 border-2 border-white rounded-full" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <p className="text-sm font-medium truncate">{chat.name}</p>
                          <span className="text-xs text-muted-foreground">{chat.time}</span>
                        </div>
                        <p className="text-xs text-muted-foreground truncate mt-1">
                          {chat.lastMessage}
                        </p>
                        <div className="flex items-center justify-between mt-2">
                          <div className="flex gap-1">
                            {chat.tags.map((tag) => (
                              <Badge key={tag} variant="outline" className="text-xs px-1 py-0">
                                {tag}
                              </Badge>
                            ))}
                          </div>
                          {chat.unread > 0 && (
                            <Badge variant="destructive" className="h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs">
                              {chat.unread}
                            </Badge>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </CardContent>
        </Card>

        {/* Chat Area */}
        <Card className="lg:col-span-5">
          <CardContent className="p-0 h-full">
            <ChatPanel />
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
