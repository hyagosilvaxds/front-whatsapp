"use client"

import type React from "react"

import { Bot, Flame, MessageSquare, Rocket, Settings, Users, BarChart3 } from "lucide-react"
import { cn } from "@/lib/utils"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"

type NavItem = {
  key: string
  label: string
  icon: React.ElementType
  hint?: string
}

const items: NavItem[] = [
  { key: "chat", label: "Atendimento", icon: MessageSquare },
  { key: "disparos", label: "Disparos", icon: Rocket },
  { key: "aquecimento", label: "Aquecimento", icon: Flame },
  { key: "contatos", label: "Contatos", icon: Users },
  { key: "relatorios", label: "Relatórios", icon: BarChart3 },
  { key: "config", label: "Configurações", icon: Settings },
]

export default function NavSidebar({ onNavigate }: { onNavigate?: (key: string) => void }) {
  const [active, setActive] = useState("chat")

  function handleClick(key: string) {
    setActive(key)
    // opcional: sincronizar com Tabs via hash
    const el = document.querySelector(`[data-state="active"][data-radix-collection-item]`)
    onNavigate?.(key)
    // Mudar aba via clique programático
    const trigger = document.querySelector<HTMLButtonElement>(`button[data-value="${key}"]`)
    trigger?.click()
  }

  return (
    <nav className="sticky top-[64px]">
      <div className="rounded-xl border bg-white/80 backdrop-blur p-2 shadow-sm">
        <div className="px-2 py-2">
          <div className="text-xs font-medium text-muted-foreground uppercase">Navegação</div>
        </div>
        <Separator />
        <ul className="p-2 space-y-1">
          {items.map((item) => {
            const Icon = item.icon
            const isActive = active === item.key
            return (
              <li key={item.key}>
                <Button
                  variant={isActive ? "secondary" : "ghost"}
                  className={cn(
                    "w-full justify-start gap-2 rounded-lg",
                    isActive && "bg-emerald-500/10 text-emerald-700 hover:bg-emerald-500/15",
                  )}
                  onClick={() => handleClick(item.key)}
                  data-value={item.key}
                  aria-label={item.label}
                >
                  <Icon className="h-4 w-4" />
                  <span>{item.label}</span>
                </Button>
              </li>
            )
          })}
        </ul>
        <Separator className="my-2" />
        <div className="px-3 py-2 flex items-center gap-2 rounded-lg bg-emerald-50 text-emerald-700 border border-emerald-100">
          <Bot className="h-4 w-4" />
          <div className="text-xs">
            <div className="font-medium">Assistente de IA</div>
            <div className="text-muted-foreground">Sugestões em tempo real</div>
          </div>
        </div>
      </div>
    </nav>
  )
}
