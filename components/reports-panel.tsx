"use client"

import { Card } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Progress } from "@/components/ui/progress"

export default function ReportsPanel() {
  return (
    <div className="grid gap-4 md:grid-cols-3">
      <Card className="p-4 border-emerald-100/60">
        <div className="text-sm text-muted-foreground">Conversões</div>
        <div className="mt-1 text-2xl font-semibold">12.4%</div>
        <div className="mt-3">
          <div className="text-xs text-muted-foreground mb-1">Meta semanal</div>
          <Progress value={62} className="h-2" />
        </div>
      </Card>
      <Card className="p-4 border-emerald-100/60">
        <div className="text-sm text-muted-foreground">Respostas</div>
        <div className="mt-1 text-2xl font-semibold">1.2k</div>
        <div className="mt-3">
          <div className="text-xs text-muted-foreground mb-1">Campanha atual</div>
          <Progress value={45} className="h-2" />
        </div>
      </Card>
      <Card className="p-4 border-emerald-100/60">
        <div className="text-sm text-muted-foreground">Tempo médio 1ª resposta</div>
        <div className="mt-1 text-2xl font-semibold">1m 42s</div>
        <div className="mt-3">
          <div className="text-xs text-muted-foreground mb-1">Objetivo</div>
          <Progress value={80} className="h-2" />
        </div>
      </Card>

      <Card className="p-4 md:col-span-3 border-emerald-100/60">
        <div className="text-sm font-medium">Resumo</div>
        <Separator className="my-3" />
        <div className="grid md:grid-cols-4 gap-3">
          <Stat label="Mensagens enviadas" value="24.320" delta="+8%" />
          <Stat label="Mensagens falhas" value="312" delta="-2%" />
          <Stat label="Atendimentos ativos" value="48" delta="+3%" />
          <Stat label="Satisfação (CSAT)" value="4.7/5" delta="+0.1" />
        </div>
      </Card>
    </div>
  )
}

function Stat({ label, value, delta }: { label: string; value: string; delta: string }) {
  const positive = delta.startsWith("+")
  return (
    <div className="rounded-lg border p-3">
      <div className="text-xs text-muted-foreground">{label}</div>
      <div className="text-lg font-semibold">{value}</div>
      <div className={`text-xs ${positive ? "text-emerald-600" : "text-red-600"}`}>{delta} vs. semana passada</div>
    </div>
  )
}
