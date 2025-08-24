"use client"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { useApp } from "@/contexts/app-context"
import { 
  LayoutDashboard,
  MessageSquare, 
  Rocket, 
  Flame, 
  Users, 
  BarChart3, 
  Settings,
  Bot,
  Zap,
  QrCode,
  BrainCircuit
} from "lucide-react"

const navigationItems = [
  {
    key: "dashboard" as const,
    label: "Dashboard",
    icon: LayoutDashboard,
    category: "main"
  },
  {
    key: "chat" as const,
    label: "Atendimento", 
    icon: MessageSquare,
    badge: 5,
    category: "main"
  },
  {
    key: "bulk-sender" as const,
    label: "Disparos",
    icon: Rocket,
    badge: 2,
    category: "main"
  },
  {
    key: "warmup" as const,
    label: "Aquecimento",
    icon: Flame,
    badge: 1,
    category: "main"
  },
  {
    key: "contacts" as const,
    label: "Contatos",
    icon: Users,
    category: "main"
  },
  {
    key: "reports" as const,
    label: "Relatórios",
    icon: BarChart3,
    category: "main"
  },
  {
    key: "connect" as const,
    label: "Conectar",
    icon: QrCode,
    category: "config"
  },
  {
    key: "ai-config" as const,
    label: "Config IA",
    icon: BrainCircuit,
    category: "config"
  },
  {
    key: "settings" as const,
    label: "Configurações",
    icon: Settings,
    category: "config"
  }
]

export default function NavigationSidebar() {
  const { currentPage, navigateToPage, notifications } = useApp()

  const mainItems = navigationItems.filter(item => item.category === "main")
  const configItems = navigationItems.filter(item => item.category === "config")

  return (
    <div className="fixed left-0 top-0 h-screen w-64 bg-background border-r border-border/40 flex flex-col z-50">
      {/* Logo/Header */}
      <div className="h-16 flex items-center px-6 border-b border-border/40">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-lg flex items-center justify-center">
            <MessageSquare className="h-4 w-4 text-white" />
          </div>
          <div>
            <h1 className="font-semibold text-foreground">WhatsApp Suite</h1>
            <p className="text-xs text-muted-foreground">Gestão Completa</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <div className="flex-1 overflow-y-auto py-6">
        <nav className="px-4 space-y-2">
          {/* Main Navigation */}
          <div className="space-y-1">
            {mainItems.map((item) => {
              const Icon = item.icon
              const isActive = currentPage === item.key
              const badge = item.key === 'chat' ? notifications.unreadChats :
                          item.key === 'bulk-sender' ? notifications.runningCampaigns :
                          item.key === 'warmup' ? notifications.pendingWarmups : undefined

              return (
                <Button
                  key={item.key}
                  variant={isActive ? "secondary" : "ghost"}
                  className={cn(
                    "w-full justify-start h-10 px-3 font-medium transition-all duration-200",
                    isActive 
                      ? "bg-primary/10 text-primary border-l-2 border-primary shadow-sm" 
                      : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                  )}
                  onClick={() => navigateToPage(item.key)}
                >
                  <Icon className={cn(
                    "h-4 w-4 mr-3 transition-colors",
                    isActive ? "text-primary" : "text-muted-foreground"
                  )} />
                  <span className="flex-1 text-left">{item.label}</span>
                  {badge && badge > 0 && (
                    <Badge 
                      variant={isActive ? "default" : "secondary"} 
                      className="h-5 px-2 text-xs font-medium ml-auto"
                    >
                      {badge}
                    </Badge>
                  )}
                </Button>
              )
            })}
          </div>

          <Separator className="my-4" />

          {/* Configuration Section */}
          <div className="space-y-1">
            <h3 className="px-3 py-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              Configurações
            </h3>
            {configItems.map((item) => {
              const Icon = item.icon
              const isActive = currentPage === item.key

              return (
                <Button
                  key={item.key}
                  variant={isActive ? "secondary" : "ghost"}
                  className={cn(
                    "w-full justify-start h-10 px-3 font-medium transition-all duration-200",
                    isActive 
                      ? "bg-primary/10 text-primary border-l-2 border-primary shadow-sm" 
                      : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                  )}
                  onClick={() => navigateToPage(item.key)}
                >
                  <Icon className={cn(
                    "h-4 w-4 mr-3 transition-colors",
                    isActive ? "text-primary" : "text-muted-foreground"
                  )} />
                  <span className="flex-1 text-left">{item.label}</span>
                </Button>
              )
            })}
          </div>
        </nav>
      </div>

      {/* Status Footer */}
      <div className="p-4 border-t border-border/40">
        <div className="flex items-center gap-3 p-3 bg-muted/30 rounded-lg">
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
          <div className="flex-1">
            <p className="text-xs font-medium text-foreground">Sistema Online</p>
            <p className="text-xs text-muted-foreground">Todos os serviços ativos</p>
          </div>
        </div>
      </div>
    </div>
  )
}
