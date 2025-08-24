"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Download, Upload } from "lucide-react"

type Contact = { id: string; name: string; phone: string; tags: string[] }

const seed: Contact[] = [
  { id: "c1", name: "João Silva", phone: "+55 11 99999-0001", tags: ["Lead"] },
  { id: "c2", name: "Maria Oliveira", phone: "+55 21 98888-7777", tags: ["Cliente"] },
  { id: "c3", name: "Carlos Tech", phone: "+55 31 97777-1234", tags: ["VIP", "Recorrente"] },
]

export default function ContactsPanel() {
  const [contacts, setContacts] = useState<Contact[]>(seed)
  const [filter, setFilter] = useState("")

  const filtered = contacts.filter(
    (c) => c.name.toLowerCase().includes(filter.toLowerCase()) || c.phone.includes(filter),
  )

  return (
    <div className="grid gap-4 md:grid-cols-[2fr_1fr]">
      <Card className="p-4 border-emerald-100/60">
        <div className="flex items-center justify-between gap-2">
          <div className="text-sm font-medium">Contatos</div>
          <div className="flex gap-2">
            <Button variant="outline" className="rounded-full bg-transparent">
              <Upload className="h-4 w-4 mr-2" />
              Importar
            </Button>
            <Button variant="outline" className="rounded-full bg-transparent">
              <Download className="h-4 w-4 mr-2" />
              Exportar
            </Button>
          </div>
        </div>
        <div className="mt-3">
          <Input placeholder="Buscar por nome/telefone" value={filter} onChange={(e) => setFilter(e.target.value)} />
        </div>
        <ScrollArea className="mt-3 h-[60dvh]">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-muted-foreground">
                <th className="py-2">Nome</th>
                <th>Telefone</th>
                <th>Tags</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((c) => (
                <tr key={c.id} className="border-t">
                  <td className="py-3">{c.name}</td>
                  <td>{c.phone}</td>
                  <td>
                    <div className="flex gap-1">
                      {c.tags.map((t) => (
                        <Badge key={t} variant="outline" className="rounded-full">
                          {t}
                        </Badge>
                      ))}
                    </div>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={3} className="py-6 text-center text-muted-foreground">
                    Nenhum contato encontrado
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </ScrollArea>
      </Card>
      <Card className="p-4 border-emerald-100/60">
        <div className="text-sm font-medium">Adicionar contato</div>
        <Separator className="my-3" />
        <form
          className="grid gap-3"
          onSubmit={(e) => {
            e.preventDefault()
            const form = e.currentTarget as HTMLFormElement
            const fd = new FormData(form)
            const name = String(fd.get("name") || "")
            const phone = String(fd.get("phone") || "")
            if (!name || !phone) return
            setContacts((prev) => [{ id: crypto.randomUUID(), name, phone, tags: [] }, ...prev])
            form.reset()
          }}
        >
          <div className="grid gap-1.5">
            <Label htmlFor="name">Nome</Label>
            <Input id="name" name="name" placeholder="Ex: Ana Souza" />
          </div>
          <div className="grid gap-1.5">
            <Label htmlFor="phone">Telefone</Label>
            <Input id="phone" name="phone" placeholder="+55 11 9 0000-0000" />
          </div>
          <Button type="submit" className="rounded-full bg-emerald-600 hover:bg-emerald-700">
            Adicionar
          </Button>
        </form>
      </Card>
    </div>
  )
}
