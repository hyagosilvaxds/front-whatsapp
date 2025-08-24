"use client"

import { useMemo, useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { Slider } from "@/components/ui/slider"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { useToast } from "@/hooks/use-toast"
import { CalendarIcon, Loader2, Rocket, Upload } from "lucide-react"

export default function BulkSender() {
  const [name, setName] = useState("Campanha Promo Agosto")
  const [senderPool, setSenderPool] = useState(["+55 11 98888-0001", "+55 21 97777-2222"])
  const [message, setMessage] = useState("Olá {{nome}}, tudo bem? Temos uma oferta especial para você hoje! 🎉")
  const [scheduleDate, setScheduleDate] = useState<Date | undefined>(undefined)
  const [rate, setRate] = useState<number[]>([20])
  const [variables] = useState(["{{nome}}", "{{pedido}}", "{{cidade}}"])
  const [trackReplies, setTrackReplies] = useState(true)
  const [rotating, setRotating] = useState(true)
  const [processing, setProcessing] = useState(false)
  const [audienceCount, setAudienceCount] = useState(1200)
  const { toast } = useToast()

  const charCount = message.length
  const preview = useMemo(
    () => message.replaceAll("{{nome}}", "Ana").replaceAll("{{pedido}}", "#4567").replaceAll("{{cidade}}", "São Paulo"),
    [message],
  )

  async function handleStart() {
    setProcessing(true)
    setTimeout(() => {
      setProcessing(false)
      toast({
        title: "Campanha agendada",
        description: "Seus disparos foram programados com sucesso.",
      })
    }, 1200)
  }

  return (
    <div className="grid gap-4 md:grid-cols-[2fr_1fr]">
      <Card className="p-4 border-emerald-100/60">
        <div className="grid gap-3">
          <div className="grid gap-1.5">
            <Label htmlFor="camp-name">Nome da campanha</Label>
            <Input id="camp-name" value={name} onChange={(e) => setName(e.target.value)} />
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div className="grid gap-1.5">
              <Label>Remetentes (pool)</Label>
              <div className="flex flex-wrap gap-2">
                {senderPool.map((s, i) => (
                  <Badge key={i} variant="secondary" className="rounded-full">
                    {s}
                  </Badge>
                ))}
                <Button variant="outline" size="sm" className="rounded-full bg-transparent">
                  + Adicionar
                </Button>
              </div>
            </div>
            <div className="grid gap-1.5">
              <Label>Importar contatos</Label>
              <div className="flex gap-2">
                <Button variant="outline" className="rounded-full bg-transparent">
                  <Upload className="h-4 w-4 mr-2" />
                  CSV/Excel
                </Button>
                <div className="text-sm text-muted-foreground self-center">{audienceCount} contatos</div>
              </div>
            </div>
          </div>

          <Separator />

          <div className="grid gap-1.5">
            <Label htmlFor="msg">Mensagem</Label>
            <Textarea
              id="msg"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              rows={5}
              placeholder="Escreva sua mensagem..."
            />
            <div className="flex items-center justify-between text-xs text-muted-foreground">
              <div className="flex items-center gap-2">
                <span>Variáveis:</span>
                {variables.map((v) => (
                  <Badge
                    key={v}
                    variant="outline"
                    className="cursor-pointer hover:bg-emerald-50"
                    onClick={() => setMessage((m) => (m.includes(v) ? m : m + " " + v))}
                  >
                    {v}
                  </Badge>
                ))}
              </div>
              <span>{charCount} caracteres</span>
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-4">
            <div className="grid gap-2">
              <Label>Agendamento</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="justify-start rounded-full bg-transparent">
                    <CalendarIcon className="h-4 w-4 mr-2" />
                    {scheduleDate ? scheduleDate.toLocaleString() : "Escolher data e hora"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <div className="p-2">
                    <Calendar mode="single" selected={scheduleDate} onSelect={setScheduleDate} />
                  </div>
                </PopoverContent>
              </Popover>
            </div>
            <div className="grid gap-2">
              <Label>Envios por minuto</Label>
              <div className="px-2">
                <Slider value={rate} onValueChange={setRate} step={5} min={5} max={100} />
              </div>
              <div className="text-xs text-muted-foreground">{rate[0]} msg/min</div>
            </div>
            <div className="grid gap-2">
              <Label>Opções</Label>
              <div className="flex items-center gap-2">
                <Checkbox id="track" checked={trackReplies} onCheckedChange={(v) => setTrackReplies(Boolean(v))} />
                <Label htmlFor="track" className="text-sm">
                  Rastrear respostas
                </Label>
              </div>
              <div className="flex items-center gap-2">
                <Checkbox id="rotate" checked={rotating} onCheckedChange={(v) => setRotating(Boolean(v))} />
                <Label htmlFor="rotate" className="text-sm">
                  Rotacionar remetentes
                </Label>
              </div>
            </div>
          </div>
        </div>
      </Card>

      <Card className="p-4 border-emerald-100/60">
        <div className="text-sm font-medium">Pré-visualização</div>
        <div className="mt-3 rounded-xl border bg-emerald-50/50 p-3 text-sm">
          <div className="mb-1 text-muted-foreground">Mensagem simulada:</div>
          <div className="rounded-2xl bg-white border px-3 py-2 shadow-sm">{preview}</div>
        </div>
        <div className="mt-4 grid grid-cols-2 gap-3 text-sm">
          <div className="rounded-lg border p-3">
            <div className="text-muted-foreground">Contatos</div>
            <div className="text-lg font-semibold">{audienceCount}</div>
          </div>
          <div className="rounded-lg border p-3">
            <div className="text-muted-foreground">Velocidade</div>
            <div className="text-lg font-semibold">{rate[0]} msg/min</div>
          </div>
          <div className="rounded-lg border p-3">
            <div className="text-muted-foreground">Rotação</div>
            <div className="text-lg font-semibold">{rotating ? "Ativa" : "Desativada"}</div>
          </div>
          <div className="rounded-lg border p-3">
            <div className="text-muted-foreground">Agendamento</div>
            <div className="text-lg font-semibold">{scheduleDate ? scheduleDate.toLocaleDateString() : "Imediato"}</div>
          </div>
        </div>
        <Button
          className="mt-4 w-full rounded-full bg-emerald-600 hover:bg-emerald-700"
          onClick={handleStart}
          disabled={processing}
        >
          {processing ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Rocket className="h-4 w-4 mr-2" />}
          Iniciar disparo
        </Button>
      </Card>
    </div>
  )
}
