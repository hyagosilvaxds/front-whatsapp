"use client"

import type React from "react"

import { useEffect, useMemo, useRef, useState } from "react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import { Switch } from "@/components/ui/switch"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/hooks/use-toast"
import { Bot, CheckCheck, ImageIcon, Mic, Paperclip, Send, Smile, Sparkles, User } from "lucide-react"

type Message = {
  id: string
  from: "me" | "contact" | "ai"
  text: string
  time: string
  status?: "sent" | "delivered" | "read"
}

type Chat = {
  id: string
  name: string
  phone: string
  avatar?: string
  lastMessage: string
  unread?: number
  tags?: string[]
  messages: Message[]
  assigned?: string
  online?: boolean
}

const demoChats: Chat[] = [
  {
    id: "1",
    name: "João Silva",
    phone: "+55 11 9 9999-0001",
    avatar: "/placeholder.svg?height=40&width=40",
    lastMessage: "Perfeito, obrigado!",
    unread: 2,
    tags: ["Lead", "Campanha A"],
    online: true,
    messages: [
      { id: "m1", from: "contact", text: "Olá! Vi sua oferta.", time: "09:12" },
      { id: "m2", from: "me", text: "Oi João! Posso ajudar com detalhes.", time: "09:13", status: "read" },
      { id: "m3", from: "contact", text: "Pode mandar o catálogo?", time: "09:14" },
    ],
    assigned: "Ana",
  },
  {
    id: "2",
    name: "Maria Oliveira",
    phone: "+55 21 9 8888-1234",
    avatar: "/placeholder.svg?height=40&width=40",
    lastMessage: "Fechamos para amanhã.",
    tags: ["Cliente"],
    messages: [
      { id: "m4", from: "me", text: "Enviei a proposta. O que achou?", time: "08:55", status: "delivered" },
      { id: "m5", from: "contact", text: "Fechamos para amanhã.", time: "09:02" },
    ],
    assigned: "Bruno",
  },
  {
    id: "3",
    name: "Carlos Tech",
    phone: "+55 31 9 7777-2222",
    avatar: "/placeholder.svg?height=40&width=40",
    lastMessage: "🎉 Pedido aprovado",
    tags: ["VIP", "Recorrente"],
    messages: [{ id: "m6", from: "contact", text: "Pedido aprovado 🎉", time: "09:20" }],
    assigned: "Você",
  },
]

export default function ChatPanel() {
  const [chats, setChats] = useState<Chat[]>(demoChats)
  const [activeId, setActiveId] = useState(chats[0]?.id)
  const [input, setInput] = useState("")
  const [aiOn, setAiOn] = useState(true)
  const [typing, setTyping] = useState<null | "ai" | "contact">(null)
  const { toast } = useToast()
  const scrollRef = useRef<HTMLDivElement>(null)

  const activeChat = useMemo(() => chats.find((c) => c.id === activeId)!, [chats, activeId])

  useEffect(() => {
    // auto scroll
    const el = scrollRef.current
    if (el) el.scrollTop = el.scrollHeight
  }, [activeId, chats, typing])

  function sendMessage(text: string) {
    if (!text.trim()) return
    const now = new Date()
    const time = String(now.getHours()).padStart(2, "0") + ":" + String(now.getMinutes()).padStart(2, "0")
    setChats((prev) =>
      prev.map((c) =>
        c.id === activeId
          ? {
              ...c,
              lastMessage: text,
              messages: [...c.messages, { id: crypto.randomUUID(), from: "me", text, time, status: "sent" }],
            }
          : c,
      ),
    )
    setInput("")
    if (aiOn) {
      // simular IA resposta
      setTyping("ai")
      setTimeout(() => {
        setChats((prev) =>
          prev.map((c) =>
            c.id === activeId
              ? {
                  ...c,
                  messages: [
                    ...c.messages,
                    {
                      id: crypto.randomUUID(),
                      from: "ai",
                      text: "Sugestão IA: Posso ajudar com detalhes e enviar um resumo personalizado. Quer que eu conduza a conversa?",
                      time,
                    },
                  ],
                }
              : c,
          ),
        )
        setTyping(null)
      }, 900)
    }
  }

  function assignToMe() {
    setChats((prev) => prev.map((c) => (c.id === activeId ? { ...c, assigned: "Você" } : c)))
    toast({ title: "Conversa atribuída a você" })
  }

  return (
    <div className="grid grid-rows-[auto_1fr_auto] md:grid-cols-[320px_1fr] gap-4">
      {/* Lista de conversas */}
      <Card className="row-span-3 md:row-span-1 md:col-span-1 overflow-hidden border-emerald-100/60">
        <div className="p-3 border-b bg-white/70">
          <div className="text-sm font-medium">Conversas</div>
          <div className="text-xs text-muted-foreground">Filtre e selecione um chat</div>
        </div>
        <div className="p-2">
          <Input placeholder="Buscar..." className="h-9" />
        </div>
        <ScrollArea className="h-[calc(70dvh)] md:h-[calc(75dvh)]">
          <ul className="p-2 space-y-1">
            {chats.map((c) => (
              <li key={c.id}>
                <button
                  className={`w-full text-left rounded-lg px-2 py-2 hover:bg-emerald-50/70 transition ${
                    activeId === c.id ? "bg-emerald-50/70 ring-1 ring-emerald-100" : ""
                  }`}
                  onClick={() => setActiveId(c.id)}
                >
                  <div className="flex items-center gap-3">
                    <Avatar className="h-9 w-9">
                      <AvatarImage src={c.avatar || "/placeholder.svg"} alt={c.name} />
                      <AvatarFallback>{c.name.slice(0, 2).toUpperCase()}</AvatarFallback>
                    </Avatar>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <div className="truncate font-medium">{c.name}</div>
                        {c.online && <span className="h-2 w-2 rounded-full bg-emerald-500" aria-label="online" />}
                        {c.tags?.slice(0, 1).map((t) => (
                          <Badge key={t} variant="secondary" className="h-5 px-2 rounded-full">
                            {t}
                          </Badge>
                        ))}
                      </div>
                      <div className="text-xs text-muted-foreground truncate">{c.lastMessage}</div>
                    </div>
                    {c.unread ? (
                      <span className="text-[10px] bg-emerald-500 text-white rounded-full px-2 py-0.5">{c.unread}</span>
                    ) : null}
                  </div>
                </button>
              </li>
            ))}
          </ul>
        </ScrollArea>
      </Card>

      {/* Header da conversa */}
      <Card className="col-span-1 overflow-hidden border-emerald-100/60">
        <div className="flex items-center justify-between px-4 py-3">
          <div className="flex items-center gap-3">
            <Avatar className="h-9 w-9">
              <AvatarImage src={activeChat.avatar || "/placeholder.svg"} alt={activeChat.name} />
              <AvatarFallback>{activeChat.name.slice(0, 2).toUpperCase()}</AvatarFallback>
            </Avatar>
            <div>
              <div className="font-medium">{activeChat.name}</div>
              <div className="text-xs text-muted-foreground">{activeChat.phone}</div>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <Label htmlFor="ai-switch" className="text-xs text-muted-foreground">
                Assistente IA
              </Label>
              <Switch id="ai-switch" checked={aiOn} onCheckedChange={setAiOn} aria-label="Ativar assistente de IA" />
            </div>
            <Button variant="outline" size="sm" onClick={assignToMe} className="rounded-full bg-transparent">
              <User className="h-4 w-4 mr-1.5" />
              Atribuir a mim
            </Button>
          </div>
        </div>
        <Separator />
        {/* Mensagens */}
        <div className="h-[48dvh] md:h-[60dvh]">
          <ScrollArea className="h-full" ref={scrollRef as any}>
            <div className="p-4 space-y-4">
              {activeChat.messages.map((m) => (
                <MessageBubble key={m.id} message={m} />
              ))}
              {typing === "ai" && (
                <div className="flex items-end gap-2 max-w-[70%]">
                  <div className="h-8 w-8 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-700">
                    <Bot className="h-4 w-4" />
                  </div>
                  <div className="rounded-2xl bg-emerald-50 px-3 py-2 text-sm text-emerald-900 border border-emerald-100 shadow-sm">
                    Digitando...
                  </div>
                </div>
              )}
            </div>
          </ScrollArea>
        </div>
        <Separator />
        {/* Composer */}
        <div className="p-3">
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" className="rounded-full">
              <Paperclip className="h-5 w-5" />
              <span className="sr-only">Anexar</span>
            </Button>
            <Button variant="ghost" size="icon" className="rounded-full">
              <ImageIcon className="h-5 w-5" />
              <span className="sr-only">Imagem</span>
            </Button>
            <Button variant="ghost" size="icon" className="rounded-full">
              <Smile className="h-5 w-5" />
              <span className="sr-only">Emoji</span>
            </Button>
            <Input
              placeholder="Escreva uma mensagem..."
              className="flex-1"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault()
                  sendMessage(input)
                }
              }}
              aria-label="Mensagem"
            />
            <Button variant="ghost" size="icon" className="rounded-full">
              <Mic className="h-5 w-5" />
              <span className="sr-only">Gravar áudio</span>
            </Button>
            <Button onClick={() => sendMessage(input)} className="rounded-full bg-emerald-600 hover:bg-emerald-700">
              <Send className="h-4 w-4 mr-1.5" />
              Enviar
            </Button>
          </div>
          {/* Sugestões IA */}
          {aiOn && (
            <div className="mt-2 flex flex-wrap gap-2">
              <Suggestion onClick={(t) => setInput(t)}>
                <Sparkles className="h-3.5 w-3.5 mr-1" />
                Resumo do histórico
              </Suggestion>
              <Suggestion onClick={(t) => setInput(t)}>Enviar catálogo</Suggestion>
              <Suggestion onClick={(t) => setInput(t)}>Propor chamada rápida</Suggestion>
            </div>
          )}
        </div>
      </Card>

      {/* Lateral de detalhes */}
      <Card className="row-span-2 md:row-span-1 md:col-span-1 overflow-hidden border-emerald-100/60">
        <div className="p-4">
          <div className="text-sm font-medium">Detalhes</div>
          <div className="mt-2 grid gap-2 text-sm">
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Atribuído</span>
              <Badge variant="secondary" className="rounded-full">
                {activeChat.assigned ?? "—"}
              </Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Tags</span>
              <div className="flex gap-1">
                {(activeChat.tags ?? []).map((t) => (
                  <Badge key={t} variant="outline" className="rounded-full">
                    {t}
                  </Badge>
                ))}
                {(!activeChat.tags || activeChat.tags.length === 0) && <span className="text-muted-foreground">—</span>}
              </div>
            </div>
            <Separator />
            <div>
              <div className="text-xs font-medium uppercase text-muted-foreground">Respostas rápidas</div>
              <div className="mt-2 flex flex-wrap gap-2">
                {["Olá! Como posso ajudar?", "Segue proposta 👇", "Posso te ligar em 5 min?"].map((r) => (
                  <Badge
                    key={r}
                    variant="outline"
                    className="cursor-pointer hover:bg-emerald-50"
                    onClick={() => sendMessage(r)}
                  >
                    {r}
                  </Badge>
                ))}
              </div>
            </div>
          </div>
        </div>
      </Card>
    </div>
  )
}

function MessageBubble({ message }: { message: Message }) {
  const isMe = message.from === "me"
  const isAI = message.from === "ai"
  return (
    <div className={`flex ${isMe ? "justify-end" : "justify-start"}`}>
      <div
        className={`max-w-[75%] rounded-2xl px-3 py-2 text-sm shadow-sm border ${
          isMe
            ? "bg-emerald-600 text-white border-emerald-700"
            : isAI
              ? "bg-emerald-50 text-emerald-900 border-emerald-100"
              : "bg-white text-foreground border-emerald-100"
        }`}
      >
        <div>{message.text}</div>
        <div
          className={`mt-1 flex items-center gap-1 text-[10px] ${isMe ? "text-emerald-50/80" : "text-muted-foreground"}`}
        >
          <span>{message.time}</span>
          {isMe && message.status && (
            <>
              <CheckCheck className={`h-3 w-3 ${message.status === "read" ? "text-white" : "opacity-60"}`} />
              <span className="capitalize">{message.status}</span>
            </>
          )}
          {isAI && (
            <span className="inline-flex items-center gap-1">
              <Bot className="h-3 w-3" /> IA
            </span>
          )}
        </div>
      </div>
    </div>
  )
}

function Suggestion({
  children,
  onClick,
}: {
  children: React.ReactNode
  onClick: (text: string) => void
}) {
  const text = typeof children === "string" ? children : "Sugestão"
  return (
    <button
      onClick={() => onClick(text)}
      className="text-xs px-2.5 py-1.5 rounded-full border bg-white hover:bg-emerald-50 transition shadow-sm"
      aria-label={`Sugestão: ${text}`}
      title={text}
    >
      {children}
    </button>
  )
}
