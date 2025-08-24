"use client"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { useApp } from "@/contexts/app-context"
import { useAuth } from "@/contexts/auth-context"
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
  BrainCircuit,
  Shield,
  Link
} from "lucide-react"

const navigationItems = [
  
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
    key: "connect" as const,
    label: "Conectar WhatsApp",
    icon: QrCode,
    category: "config"
  }
]

export default function NavigationSidebar() {
  const { currentPage, navigateToPage, notifications } = useApp()
  const { user } = useAuth()

  const mainItems = navigationItems.filter(item => item.category === "main")
  const aiItems = navigationItems.filter(item => item.category === "ai")
  const configItems = navigationItems.filter(item => item.category === "config")
  const adminItems = navigationItems.filter(item => item.category === "admin")

  const isAdmin = user?.role === 'ORG_ADMIN' || user?.role === 'SUPER_ADMIN'

  const renderNavItem = (item: typeof navigationItems[0]) => {
    const Icon = item.icon
    const isActive = currentPage === item.key
    
    

    return (
      <Button
        key={item.key}
        variant={isActive ? "secondary" : "ghost"}
        className={cn(
          "w-full justify-start gap-3 h-11 px-3",
          isActive && "bg-emerald-500/10 text-emerald-700 hover:bg-emerald-500/15 border-r-2 border-emerald-500"
        )}
        onClick={() => navigateToPage(item.key)}
      >
        <Icon className="h-4 w-4 flex-shrink-0" />
        <span className="flex-1 text-left">{item.label}</span>
        {item.badge && (
          <Badge 
            variant={typeof item.badge === 'string' ? 'secondary' : 'default'}
            className={cn(
              "text-xs px-1.5 py-0.5 h-5",
              typeof item.badge === 'string' && "bg-emerald-100 text-emerald-700"
            )}
          >
            {item.badge}
          </Badge>
        )}
        
      </Button>
    )
  }

  return (
    <div className="w-full h-full bg-white border-r border-gray-200 flex flex-col">
      {/* Header */}
      <div className="p-6 border-b border-gray-100">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-xl flex items-center justify-center">
            <MessageSquare className="h-5 w-5 text-white" />
          </div>
          <div>
            <h2 className="font-semibold text-gray-900">WhatsApp Suite</h2>
            <p className="text-xs text-gray-500">Sistema de Atendimento</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <div className="flex-1 overflow-auto p-4">
        <nav className="space-y-6">
          {/* Main Navigation */}
          <div className="space-y-2">
            <div className="px-3 py-2">
              <h3 className="text-xs font-medium text-gray-500 uppercase tracking-wider">
                Principal
              </h3>
            </div>
            <div className="space-y-1">
              {mainItems.map(renderNavItem)}
            </div>
          </div>

          {/* AI Section */}
          {aiItems.length > 0 && (
            <>
              <Separator />
              <div className="space-y-2">
                <div className="px-3 py-2">
                  <h3 className="text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Inteligência Artificial
                  </h3>
                </div>
                <div className="space-y-1">
                  {aiItems.map(renderNavItem)}
                </div>
              </div>
            </>
          )}

          {/* Configuration Section */}
          {configItems.length > 0 && (
            <>
              <Separator />
              <div className="space-y-2">
                <div className="px-3 py-2">
                  <h3 className="text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Configurações
                  </h3>
                </div>
                <div className="space-y-1">
                  {configItems.map(renderNavItem)}
                </div>
              </div>
            </>
          )}

          {/* Admin Section - Only for admins */}
          {isAdmin && adminItems.length > 0 && (
            <>
              <Separator />
              <div className="space-y-2">
                <div className="px-3 py-2">
                  <h3 className="text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Administração
                  </h3>
                </div>
                <div className="space-y-1">
                  {adminItems.map(renderNavItem)}
                </div>
              </div>
            </>
          )}
        </nav>
      </div>

      {/* AI Assistant Prompt */}
      <div className="p-4 border-t border-gray-100">
        <div className="px-3 py-2 flex items-center gap-2 rounded-lg bg-emerald-50 text-emerald-700 border border-emerald-100">
          <Bot className="h-4 w-4" />
          <div className="text-xs">
            <div className="font-medium">Assistente de IA</div>
            <div className="text-muted-foreground">Sugestões em tempo real</div>
          </div>
        </div>
      </div>
    </div>
  )
}
