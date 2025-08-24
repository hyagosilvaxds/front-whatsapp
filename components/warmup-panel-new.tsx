"use client"

import { useMemo, useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { Checkbox } from "@/components/ui/checkbox"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Flame, Loader2, RefreshCw, Settings } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { Progress } from "@/components/ui/progress"
import WarmupMainPage from "./pages/warmup-page"

type NumberRow = {
  id: string
  number: string
  dailyTarget: number
  current: number
  window: string
  randomize: boolean
  status: "Aquecendo" | "Pausado" | "Concluído"
}

const seed: NumberRow[] = [
  {
    id: "n1",
    number: "+55 11 98888-0001",
    dailyTarget: 50,
    current: 18,
    window: "09:00-18:00",
    randomize: true,
    status: "Aquecendo",
  },
  {
    id: "n2",
    number: "+55 21 97777-2222",
    dailyTarget: 40,
    current: 40,
    window: "10:00-17:00",
    randomize: true,
    status: "Concluído",
  },
  {
    id: "n3",
    number: "+55 31 96666-3333",
    dailyTarget: 30,
    current: 10,
    window: "08:00-19:00",
    randomize: false,
    status: "Aquecendo",
  },
]

export default function WarmupPanel() {
  const [rows, setRows] = useState<NumberRow[]>(seed)
  const [target, setTarget] = useState<number[]>([40])
  const [randomize, setRandomize] = useState(true)
  const [loading, setLoading] = useState(false)
  const [showDetailedView, setShowDetailedView] = useState(false)
  const { toast } = useToast()

  const globalProgress = useMemo(() => {
    const total = rows.reduce((acc, r) => acc + r.dailyTarget, 0)
    const cur = rows.reduce((acc, r) => acc + Math.min(r.current, r.dailyTarget), 0)
    return Math.round((cur / Math.max(total, 1)) * 100)
  }, [rows])

  function applyToAll() {
    setRows((prev) =>
      prev.map((r) => ({
        ...r,
        dailyTarget: target[0],
        randomize,
      })),
    )
    toast({ title: "Configurações aplicadas", description: "Parâmetros replicados para todos os números." })
  }

  async function startWarmup() {
    setLoading(true)
    setTimeout(() => {
      setLoading(false)
      toast({ title: "Aquecimento atualizado", description: "Rotinas diárias agendadas." })
    }, 900)
  }

  function simulateTick() {
    setRows((prev) =>
      prev.map((r) => {
        if (r.status === "Concluído") return r
        const inc = r.randomize ? Math.ceil(Math.random() * 3) : 2
        const next = Math.min(r.dailyTarget, r.current + inc)
        const status = next >= r.dailyTarget ? "Concluído" : r.status
        return { ...r, current: next, status }
      }),
    )
  }

  const handleOpenSettings = () => {
    setShowDetailedView(true)
  }

  const handleBackToSimpleView = () => {
    setShowDetailedView(false)
  }

  // Se o usuário escolheu a visualização detalhada, mostrar o WarmupPage completo
  if (showDetailedView) {
    return (
      <div className="relative">
        <div className="absolute top-4 left-4 z-10">
          <Button variant="outline" onClick={handleBackToSimpleView}>
            ← Voltar à Visão Simples
          </Button>
        </div>
        <WarmupMainPage />
      </div>
    )
  }

  return (
    <div className="grid gap-4 md:grid-cols-[2fr_1fr]">
      <Card className="p-4 border-emerald-100/60 cursor-pointer hover:shadow-md transition-shadow" onClick={handleOpenSettings}>
        <div className="flex items-center justify-between">
          <div>
            <div className="text-sm font-medium">Números em aquecimento</div>
            <div className="text-xs text-muted-foreground">Aumente gradualmente o volume para evitar bloqueios</div>
          </div>
          <Button variant="outline" size="sm" onClick={(e) => { e.stopPropagation(); simulateTick(); }} className="rounded-full bg-transparent">
            <RefreshCw className="h-4 w-4 mr-1.5" />
            Simular progresso
          </Button>
        </div>

        <div className="mt-4 space-y-3">
          {rows.map((r) => {
            const pct = Math.round((r.current / r.dailyTarget) * 100)
            return (
              <div key={r.id} className="rounded-lg border p-3">
                <div className="flex items-center justify-between">
                  <div className="font-medium">{r.number}</div>
                  <Badge variant={r.status === "Concluído" ? "secondary" : "outline"} className="rounded-full">
                    {r.status}
                  </Badge>
                </div>
                <div className="mt-2 grid gap-2 md:grid-cols-4">
                  <div>
                    <div className="text-xs text-muted-foreground">Meta diária</div>
                    <div className="text-sm font-semibold">{r.dailyTarget}</div>
                  </div>
                  <div>
                    <div className="text-xs text-muted-foreground">Enviadas</div>
                    <div className="text-sm font-semibold">{r.current}</div>
                  </div>
                  <div>
                    <div className="text-xs text-muted-foreground">Janela</div>
                    <div className="text-sm font-semibold">{r.window}</div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Checkbox
                      id={`rand-${r.id}`}
                      checked={r.randomize}
                      onCheckedChange={(v) =>
                        setRows((prev) => prev.map((x) => (x.id === r.id ? { ...x, randomize: Boolean(v) } : x)))
                      }
                    />
                    <Label className="text-sm" htmlFor={`rand-${r.id}`}>
                      Aleatorizar
                    </Label>
                  </div>
                </div>
                <div className="mt-2">
                  <Progress value={pct} className="h-2" />
                </div>
              </div>
            )
          })}
        </div>
      </Card>

      <Card className="p-4 border-emerald-100/60">
        <div className="flex items-center gap-2">
          <Flame className="h-5 w-5 text-emerald-600" />
          <div className="text-sm font-medium">Parâmetros globais</div>
        </div>
        <div className="mt-3 grid gap-3">
          <div className="grid gap-1.5">
            <Label>Meta diária por número</Label>
            <div className="px-2">
              <Slider value={target} onValueChange={setTarget} min={10} max={200} step={5} />
            </div>
            <div className="text-xs text-muted-foreground">{target[0]} mensagens/dia</div>
          </div>
          <div className="flex items-center gap-2">
            <Checkbox id="random" checked={randomize} onCheckedChange={(v) => setRandomize(Boolean(v))} />
            <Label htmlFor="random">Aleatorizar horários e atrasos</Label>
          </div>
          <div className="text-xs text-muted-foreground bg-emerald-50 border border-emerald-100 rounded-lg p-2">
            A aleatorização simula comportamentos humanos e ajuda a reduzir bloqueios.
          </div>
          <Separator />
          <div className="grid grid-cols-2 gap-2">
            <div className="rounded-lg border p-2">
              <div className="text-xs text-muted-foreground">Progresso global</div>
              <div className="text-xl font-semibold">{globalProgress}%</div>
              <Progress value={globalProgress} className="h-2 mt-2" />
              <div className="text-xs text-muted-foreground mt-1">{globalProgress}% hoje</div>
            </div>
            <div className="rounded-lg border p-2">
              <div className="text-xs text-muted-foreground">Números ativos</div>
              <div className="text-xl font-semibold">{rows.length}</div>
            </div>
          </div>
          <Button className="rounded-full bg-emerald-600 hover:bg-emerald-700" onClick={startWarmup} disabled={loading}>
            {loading ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Flame className="h-4 w-4 mr-2" />}
            Aplicar e executar
          </Button>
          <Button variant="outline" className="rounded-full" onClick={handleOpenSettings}>
            <Settings className="h-4 w-4 mr-2" />
            Configurações Avançadas
          </Button>
        </div>
      </Card>
    </div>
  )
}
