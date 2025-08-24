"use client"
import { Bell, ChevronDown, Search } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

export default function Topbar() {
  return (
    <div className="flex items-center gap-2 md:gap-3">
      <div className="hidden md:flex relative items-center">
        <Search className="absolute left-3 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Buscar conversas, contatos, campanhas..."
          className="pl-9 w-[360px] rounded-full bg-white/60"
          aria-label="Buscar"
        />
      </div>
      <TooltipProvider delayDuration={0}>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button variant="ghost" size="icon" aria-label="Notificações">
              <Bell className="h-5 w-5" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>Notificações</TooltipContent>
        </Tooltip>
      </TooltipProvider>
      <Button variant="ghost" className="gap-2">
        <Avatar className="h-7 w-7">
          <AvatarImage src="/placeholder.svg?height=40&width=40" alt="Avatar" />
          <AvatarFallback>AG</AvatarFallback>
        </Avatar>
        <span className="hidden sm:inline text-sm">Agente</span>
        <ChevronDown className="h-4 w-4" />
      </Button>
    </div>
  )
}
