'use client'

import { useState, useEffect } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { X, Plus, Loader2 } from 'lucide-react'
import { Contact, CreateContactData, UpdateContactData, isValidEmail, isValidPhone, formatPhone, createContact, updateContact } from '@/lib/api/contacts'
import { useToast } from '@/hooks/use-toast'
import { useAuth } from '@/contexts/auth-context'

interface ContactDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  contact?: Contact | null
  mode: 'create' | 'edit'
  onSuccess?: () => void
}

export default function ContactDialog({ open, onOpenChange, contact, mode, onSuccess }: ContactDialogProps) {
  const { user, organizationId } = useAuth()
  const { toast } = useToast()
  
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    company: '',
    position: '',
    city: '',
    state: '',
    notes: '',
    birthDate: ''
  })
  const [tags, setTags] = useState<string[]>([])
  const [newTag, setNewTag] = useState('')
  const [errors, setErrors] = useState<Record<string, string>>({})

  // Resetar formulário quando abrir/fechar ou mudar contato
  useEffect(() => {
    if (open) {
      if (mode === 'edit' && contact) {
        setFormData({
          name: contact.name || '',
          email: contact.email || '',
          phone: contact.phone || '',
          company: contact.company || '',
          position: contact.position || '',
          city: contact.city || '',
          state: contact.state || '',
          notes: contact.notes || '',
          birthDate: contact.birthDate ? new Date(contact.birthDate).toISOString().split('T')[0] : ''
        })
        setTags(contact.tags || [])
      } else {
        setFormData({
          name: '',
          email: '',
          phone: '',
          company: '',
          position: '',
          city: '',
          state: '',
          notes: '',
          birthDate: ''
        })
        setTags([])
      }
      setNewTag('')
      setErrors({})
    }
  }, [open, contact, mode])

  // Validar formulário
  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.name.trim()) {
      newErrors.name = 'Nome é obrigatório'
    }

    if (formData.email && !isValidEmail(formData.email)) {
      newErrors.email = 'Email inválido'
    }

    if (formData.phone && !isValidPhone(formData.phone)) {
      newErrors.phone = 'Telefone inválido'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  // Adicionar tag
  const addTag = () => {
    if (newTag && !tags.includes(newTag)) {
      setTags([...tags, newTag])
      setNewTag('')
    }
  }

  // Remover tag
  const removeTag = (tagToRemove: string) => {
    setTags(tags.filter(tag => tag !== tagToRemove))
  }

  // Atualizar campo do formulário
  const updateField = (field: keyof typeof formData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    
    // Limpar erro do campo quando usuário começar a digitar
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }))
    }
  }

  // Submeter formulário
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm()) return

    setLoading(true)
    
    try {
      const contactData: CreateContactData | UpdateContactData = {
        name: formData.name.trim(),
        email: formData.email.trim() || undefined,
        phone: formData.phone.trim() || undefined,
        company: formData.company.trim() || undefined,
        position: formData.position.trim() || undefined,
        city: formData.city.trim() || undefined,
        state: formData.state.trim() || undefined,
        notes: formData.notes.trim() || undefined,
        birthDate: formData.birthDate || undefined,
        tags: tags.length > 0 ? tags : undefined
      }

      if (mode === 'create') {
        const orgId = user?.role === 'SUPERADMIN' ? (organizationId || undefined) : undefined
        const newContact = await createContact(contactData as CreateContactData, orgId)
        toast({
          title: 'Contato criado',
          description: `${newContact.name} foi criado com sucesso`
        })
      } else if (contact) {
        const updatedContact = await updateContact(contact.id, contactData as UpdateContactData)
        toast({
          title: 'Contato atualizado',
          description: `${updatedContact.name} foi atualizado com sucesso`
        })
      }

      onOpenChange(false)
      onSuccess?.()
    } catch (error: any) {
      toast({
        title: mode === 'create' ? 'Erro ao criar contato' : 'Erro ao atualizar contato',
        description: error.message,
        variant: 'destructive'
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-5xl w-[90vw] h-[85vh] max-h-[85vh] overflow-hidden flex flex-col">
        <DialogHeader className="flex-shrink-0 pb-4">
          <DialogTitle>
            {mode === 'create' ? 'Novo Contato' : 'Editar Contato'}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="flex flex-col h-full">
          <div className="flex-1 overflow-y-auto pr-2 space-y-6 min-h-0">
            {/* Informações Básicas */}
            <Card>
              <CardContent className="p-4 space-y-4">
                <h3 className="font-medium">Informações Básicas</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="name">Nome *</Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) => updateField('name', e.target.value)}
                      placeholder="Nome completo"
                      className={errors.name ? 'border-red-500' : ''}
                    />
                    {errors.name && (
                      <p className="text-red-500 text-sm mt-1">{errors.name}</p>
                    )}
                  </div>

                  <div>
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => updateField('email', e.target.value)}
                      placeholder="email@exemplo.com"
                      className={errors.email ? 'border-red-500' : ''}
                    />
                    {errors.email && (
                      <p className="text-red-500 text-sm mt-1">{errors.email}</p>
                    )}
                  </div>

                  <div>
                    <Label htmlFor="phone">Telefone</Label>
                    <Input
                      id="phone"
                      value={formData.phone}
                      onChange={(e) => updateField('phone', e.target.value)}
                      placeholder="(11) 99999-9999"
                      className={errors.phone ? 'border-red-500' : ''}
                    />
                    {errors.phone && (
                      <p className="text-red-500 text-sm mt-1">{errors.phone}</p>
                    )}
                  </div>

                  <div>
                    <Label htmlFor="birthDate">Data de Nascimento</Label>
                    <Input
                      id="birthDate"
                      type="date"
                      value={formData.birthDate}
                      onChange={(e) => updateField('birthDate', e.target.value)}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Informações Profissionais */}
            <Card>
              <CardContent className="p-4 space-y-4">
                <h3 className="font-medium">Informações Profissionais</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="company">Empresa</Label>
                    <Input
                      id="company"
                      value={formData.company}
                      onChange={(e) => updateField('company', e.target.value)}
                      placeholder="Nome da empresa"
                    />
                  </div>

                  <div>
                    <Label htmlFor="position">Cargo</Label>
                    <Input
                      id="position"
                      value={formData.position}
                      onChange={(e) => updateField('position', e.target.value)}
                      placeholder="Cargo ou função"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Localização */}
            <Card>
              <CardContent className="p-4 space-y-4">
                <h3 className="font-medium">Localização</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="city">Cidade</Label>
                    <Input
                      id="city"
                      value={formData.city}
                      onChange={(e) => updateField('city', e.target.value)}
                      placeholder="Cidade"
                    />
                  </div>

                  <div>
                    <Label htmlFor="state">Estado</Label>
                    <Input
                      id="state"
                      value={formData.state}
                      onChange={(e) => updateField('state', e.target.value)}
                      placeholder="Estado"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Tags */}
            <Card>
              <CardContent className="p-4 space-y-4">
                <h3 className="font-medium">Tags</h3>
                
                <div className="flex flex-wrap gap-2">
                  {tags.map((tag) => (
                    <Badge key={tag} variant="secondary" className="flex items-center gap-1">
                      {tag}
                      <button
                        type="button"
                        onClick={() => removeTag(tag)}
                        className="ml-1 text-red-500 hover:text-red-700"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </Badge>
                  ))}
                </div>

                <div className="flex gap-2">
                  <Input
                    value={newTag}
                    onChange={(e) => setNewTag(e.target.value)}
                    placeholder="Nova tag"
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault()
                        addTag()
                      }
                    }}
                  />
                  <Button
                    type="button"
                    onClick={addTag}
                    size="sm"
                    variant="outline"
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Observações */}
            <Card>
              <CardContent className="p-4 space-y-4">
                <h3 className="font-medium">Observações</h3>
                
                <Textarea
                  value={formData.notes}
                  onChange={(e) => updateField('notes', e.target.value)}
                  placeholder="Observações adicionais sobre o contato..."
                  rows={4}
                />
              </CardContent>
            </Card>
          </div>

          {/* Botões de Ação */}
          <div className="flex justify-end gap-2 pt-4 border-t mt-4 flex-shrink-0">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={loading}
            >
              Cancelar
            </Button>
            <Button type="submit" disabled={loading}>
              {loading && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
              {mode === 'create' ? 'Criar Contato' : 'Salvar Alterações'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
