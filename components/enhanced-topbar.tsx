"use client"

import { useState } from "react"
import { useRouter } from 'next/navigation'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { 
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { useApp } from "@/contexts/app-context"
import { useAuth } from "@/contexts/auth-context"
import { 
  Search, 
  Bell, 
  Settings, 
  User, 
  LogOut,
  Moon,
  Sun,
  MessageSquare,
  Rocket,
  AlertTriangle,
  Command
} from "lucide-react"
import { useToast } from "@/hooks/use-toast"

export default function EnhancedTopbar() {
  const { notifications, navigateToPage } = useApp()
  const { user, logout } = useAuth()
  const { toast } = useToast()
  const router = useRouter()
  const [searchQuery, setSearchQuery] = useState("")
  const [theme, setTheme] = useState<"light" | "dark">("light")

  // Dados do usuário com fallback para dados mockados se necessário
  const userData = user || {
    name: "João Silva",
    email: "joao@empresa.com",
    avatar: "/placeholder-user.jpg"
  }

  const handleLogout = async () => {
    try {
      await logout()
      toast({
        title: "Logout realizado com sucesso",
        description: "Você foi desconectado do sistema",
      })
      router.replace('/login')
    } catch (error) {
      toast({
        title: "Erro ao fazer logout",
        description: "Tente novamente",
        variant: "destructive"
      })
    }
  }

  const recentNotifications = [
    {
      id: "1",
      type: "message",
      title: "Nova mensagem de Maria Santos",
      description: "Interessada no produto premium",
      time: "2 min atrás",
      unread: true,
    },
    {
      id: "2",
      type: "campaign",
      title: "Campanha finalizada",
      description: "Black Friday - 500 mensagens enviadas",
      time: "15 min atrás",
      unread: true,
    },
    {
      id: "3",
      type: "warning",
      title: "Atenção: Limite de API",
      description: "80% do limite mensal atingido",
      time: "1 hora atrás",
      unread: false,
    }
  ]

  const searchSuggestions = [
    "João Silva",
    "Campanha Black Friday",
    "Relatório semanal",
    "Configurar webhook",
    "Backup de conversas"
  ]

  const toggleTheme = () => {
    setTheme(theme === "light" ? "dark" : "light")
  }

  return (
    <header className="w-full h-16 px-6 lg:pl-[304px] flex items-center justify-between bg-background/95 backdrop-blur-sm border-b border-border/40 shadow-sm">
      {/* Search Bar */}
      <div className="flex-1 max-w-md">
        <Popover>
          <PopoverTrigger asChild>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar conversas, contatos, campanhas..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 bg-muted/50 border-none focus:bg-background transition-colors"
              />
              <kbd className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground opacity-100">
                <Command className="h-3 w-3" />K
              </kbd>
            </div>
          </PopoverTrigger>
          <PopoverContent className="w-80 p-2" align="start">
            <div className="space-y-1">
              <p className="text-sm font-medium px-2 py-1 text-muted-foreground">Sugestões</p>
              {searchSuggestions.map((suggestion, index) => (
                <Button
                  key={index}
                  variant="ghost"
                  className="w-full justify-start text-sm"
                  onClick={() => setSearchQuery(suggestion)}
                >
                  <Search className="h-4 w-4 mr-2" />
                  {suggestion}
                </Button>
              ))}
            </div>
          </PopoverContent>
        </Popover>
      </div>

      {/* Right Actions */}
      <div className="flex items-center gap-2">
        {/* Theme Toggle */}
        <Button variant="ghost" size="icon" onClick={toggleTheme}>
          {theme === "light" ? (
            <Moon className="h-4 w-4" />
          ) : (
            <Sun className="h-4 w-4" />
          )}
        </Button>

        {/* Notifications */}
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="ghost" size="icon" className="relative">
              <Bell className="h-4 w-4" />
              {recentNotifications.filter(n => n.unread).length > 0 && (
                <Badge 
                  variant="destructive" 
                  className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs"
                >
                  {recentNotifications.filter(n => n.unread).length}
                </Badge>
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-80 p-0" align="end">
            <div className="flex items-center justify-between p-4 border-b">
              <h4 className="font-semibold">Notificações</h4>
              <Button variant="ghost" size="sm" className="text-xs">
                Marcar todas como lidas
              </Button>
            </div>
            <div className="max-h-80 overflow-y-auto">
              {recentNotifications.map((notification) => (
                <div
                  key={notification.id}
                  className={`p-4 border-b last:border-b-0 hover:bg-muted/50 cursor-pointer ${
                    notification.unread ? "bg-muted/30" : ""
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div className="mt-1">
                      {notification.type === "message" && <MessageSquare className="h-4 w-4 text-blue-500" />}
                      {notification.type === "campaign" && <Rocket className="h-4 w-4 text-green-500" />}
                      {notification.type === "warning" && <AlertTriangle className="h-4 w-4 text-orange-500" />}
                    </div>
                    <div className="flex-1 space-y-1">
                      <p className="text-sm font-medium">{notification.title}</p>
                      <p className="text-xs text-muted-foreground">{notification.description}</p>
                      <p className="text-xs text-muted-foreground">{notification.time}</p>
                    </div>
                    {notification.unread && (
                      <div className="w-2 h-2 bg-blue-500 rounded-full mt-2" />
                    )}
                  </div>
                </div>
              ))}
            </div>
          </PopoverContent>
        </Popover>

        {/* User Menu */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="relative h-9 w-9 rounded-full">
              <Avatar className="h-9 w-9">
                <AvatarImage src={userData.avatar} alt={userData.name} />
                <AvatarFallback className="bg-primary/10 text-primary">
                  {userData.name.split(' ').map(n => n[0]).join('').toUpperCase()}
                </AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56" align="end">
            <DropdownMenuLabel className="font-normal">
              <div className="flex flex-col space-y-1">
                <p className="text-sm font-medium leading-none">{userData.name}</p>
                <p className="text-xs leading-none text-muted-foreground">{userData.email}</p>
                {user?.role && (
                  <Badge variant="secondary" className="text-xs w-fit mt-1">
                    {user.role}
                  </Badge>
                )}
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => navigateToPage('settings')}>
              <Settings className="mr-2 h-4 w-4" />
              <span>Configurações</span>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => navigateToPage('admin-profile')}>
              <User className="mr-2 h-4 w-4" />
              <span>Perfil</span>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem 
              className="text-red-600 focus:text-red-600 focus:bg-red-50"
              onClick={handleLogout}
            >
              <LogOut className="mr-2 h-4 w-4" />
              <span>Sair</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  )
}
