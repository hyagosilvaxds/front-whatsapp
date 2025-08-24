"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Separator } from "@/components/ui/separator"

export default function SettingsPanel() {
  const [brand, setBrand] = useState("WhatsApp Suite")
  const [signature, setSignature] = useState("Equipe WhatsApp Suite")
  const [readReceipts, setReadReceipts] = useState(true)
  const [typingIndicator, setTypingIndicator] = useState(true)

  return (
    <div className="grid gap-4 md:grid-cols-2">
      <Card className="p-4 border-emerald-100/60">
        <div className="text-sm font-medium">Marca</div>
        <Separator className="my-3" />
        <div className="grid gap-3">
          <div className="grid gap-1.5">
            <Label htmlFor="brand">Nome</Label>
            <Input id="brand" value={brand} onChange={(e) => setBrand(e.target.value)} />
          </div>
          <div className="grid gap-1.5">
            <Label htmlFor="signature">Assinatura padrão</Label>
            <Input id="signature" value={signature} onChange={(e) => setSignature(e.target.value)} />
          </div>
          <Button className="rounded-full bg-emerald-600 hover:bg-emerald-700">Salvar</Button>
        </div>
      </Card>

      <Card className="p-4 border-emerald-100/60">
        <div className="text-sm font-medium">Mensageria</div>
        <Separator className="my-3" />
        <div className="grid gap-3">
          <div className="flex items-center gap-2">
            <Checkbox id="reads" checked={readReceipts} onCheckedChange={(v) => setReadReceipts(Boolean(v))} />
            <Label htmlFor="reads">Confirmar leitura (✓✓)</Label>
          </div>
          <div className="flex items-center gap-2">
            <Checkbox id="typing" checked={typingIndicator} onCheckedChange={(v) => setTypingIndicator(Boolean(v))} />
            <Label htmlFor="typing">Exibir indicador de digitação</Label>
          </div>
          <div className="text-xs text-muted-foreground">
            Ajustes são apenas de apresentação no frontend desta demo.
          </div>
        </div>
      </Card>
    </div>
  )
}
