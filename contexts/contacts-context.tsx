'use client'

import React, { createContext, useContext, useState, useEffect, useCallback, useMemo, useRef, ReactNode } from 'react'
import { 
  Contact, 
  ContactFilters, 
  ContactsResponse,
  ContactStats,
  getContacts,
  getContactStats,
  createContact,
  updateContact,
  deleteContact,
  deleteContacts as deleteContactsAPI,
  CreateContactData,
  UpdateContactData
} from '@/lib/api/contacts'
import { useAuth } from './auth-context'
import { useToast } from '@/hooks/use-toast'

interface ContactsContextType {
  // Estado
  contacts: Contact[]
  stats: ContactStats | null
  loading: boolean
  pagination: {
    page: number
    limit: number
    total: number
    totalPages: number
  }
  
  // Filtros
  filters: ContactFilters
  setFilters: (filters: ContactFilters) => void
  
  // Seleção
  selectedContacts: string[]
  setSelectedContacts: (ids: string[]) => void
  selectAllContacts: () => void
  clearSelection: () => void
  
  // Ações CRUD
  loadContacts: () => Promise<void>
  loadStats: () => Promise<void>
  addContact: (data: CreateContactData) => Promise<Contact>
  editContact: (id: string, data: UpdateContactData) => Promise<Contact>
  removeContact: (id: string) => Promise<void>
  removeSelectedContacts: () => Promise<void>
  
  // Busca
  searchContacts: (query: string) => void
  
  // Paginação
  setPage: (page: number) => void
  setLimit: (limit: number) => void
}

const ContactsContext = createContext<ContactsContextType | undefined>(undefined)

export const useContacts = () => {
  const context = useContext(ContactsContext)
  if (context === undefined) {
    throw new Error('useContacts deve ser usado dentro de ContactsProvider')
  }
  return context
}

interface ContactsProviderProps {
  children: ReactNode
}

export function ContactsProvider({ children }: { children: ReactNode }) {
  const { user, isAuthenticated } = useAuth()
  const { toast } = useToast()
  
  // Estado
  const [contacts, setContacts] = useState<Contact[]>([])
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0
  })
  const [stats, setStats] = useState<ContactStats>({
    total: 0,
    byMonth: {},
    byTags: {}
  })
  const [loading, setLoading] = useState(false)
  const [loadingStats, setLoadingStats] = useState(false)
  const [selectedContacts, setSelectedContacts] = useState<string[]>([])
  const [filters, setFilters] = useState<ContactFilters>({
    page: 1,
    limit: 10,
    search: '',
    company: '',
    city: '',
    state: '',
    tags: ''
  })
  
  // Refs para debounce
  const loadContactsTimeoutRef = useRef<NodeJS.Timeout | null>(null)

  // Filtros estáveis com organizationId do usuário
  const stableFilters = useMemo(() => {
    const baseFilters = {
      page: filters.page,
      limit: filters.limit,
      search: filters.search,
      company: filters.company,
      city: filters.city,
      state: filters.state,
      tags: filters.tags
    }

    // Adicionar organizationId baseado no role do usuário
    if (user?.role === 'SUPERADMIN') {
      // SUPERADMIN pode filtrar por organizationId específica ou ver todas
      return {
        ...baseFilters,
        organizationId: filters.organizationId // Permite filtro opcional
      }
    } else {
      // Outros usuários só veem da própria organização
      return {
        ...baseFilters,
        organizationId: user?.organization?.id
      }
    }
  }, [
    filters.page, 
    filters.limit, 
    filters.search, 
    filters.company, 
    filters.city, 
    filters.state, 
    filters.tags,
    filters.organizationId,
    user?.role,
    user?.organization?.id
  ])

  // Carregar contatos com debounce
  const loadContacts = useCallback(async (immediate = false) => {
    // Cancelar timeout anterior se existir
    if (loadContactsTimeoutRef.current) {
      clearTimeout(loadContactsTimeoutRef.current)
    }

    const executeLoad = async () => {
      try {
        setLoading(true)
        console.log('📞 Carregando contatos com filtros:', stableFilters)
        console.log('👤 Usuário atual:', { role: user?.role, organizationId: user?.organization?.id })
        
        const response = await getContacts(stableFilters)
        
        console.log('🔄 Resposta da API no contexto:', response)
        console.log('📊 Dados dos contatos:', response.data)
        console.log('� Paginação:', response.pagination)
        
        setContacts(response.data)
        setContacts(response.data)
        setPagination(response.pagination)
      } catch (error: any) {
        console.error('Erro ao carregar contatos:', error)
        toast({
          title: 'Erro ao carregar contatos',
          description: error.message,
          variant: 'destructive'
        })
      } finally {
        setLoading(false)
      }
    }

    if (immediate) {
      executeLoad()
    } else {
      // Debounce de 300ms para buscas
      loadContactsTimeoutRef.current = setTimeout(executeLoad, 300)
    }
  }, [user?.role, stableFilters, toast])
  
  // Carregar estatísticas
  const loadStats = useCallback(async () => {
    try {
      const organizationId = user?.role === 'SUPERADMIN' ? stableFilters.organizationId : user?.organization?.id
      console.log('📊 Carregando estatísticas para organizationId:', organizationId)
      const response = await getContactStats(organizationId)
      setStats(response)
    } catch (error: any) {
      console.error('Erro ao carregar estatísticas:', error)
    }
  }, [user?.role, user?.organization?.id, stableFilters.organizationId])

  // Adicionar contato
  const addContact = async (data: CreateContactData): Promise<Contact> => {
    try {
      const organizationId = user?.role === 'SUPERADMIN' ? filters.organizationId : undefined
      const newContact = await createContact(data, organizationId)
      
      // Recarregar lista
      await loadContacts()
      await loadStats()
      
      toast({
        title: 'Contato criado',
        description: `${newContact.name} foi adicionado com sucesso`
      })
      
      return newContact
    } catch (error: any) {
      toast({
        title: 'Erro ao criar contato',
        description: error.message,
        variant: 'destructive'
      })
      throw error
    }
  }
  
  // Editar contato
  const editContact = async (id: string, data: UpdateContactData): Promise<Contact> => {
    try {
      const organizationId = user?.role === 'SUPERADMIN' ? filters.organizationId : undefined
      const updatedContact = await updateContact(id, data, organizationId)
      
      // Atualizar na lista local
      setContacts(prev => 
        prev.map(contact => 
          contact.id === id ? updatedContact : contact
        )
      )
      
      toast({
        title: 'Contato atualizado',
        description: `${updatedContact.name} foi atualizado com sucesso`
      })
      
      return updatedContact
    } catch (error: any) {
      toast({
        title: 'Erro ao atualizar contato',
        description: error.message,
        variant: 'destructive'
      })
      throw error
    }
  }
  
  // Remover contato
  const removeContact = async (id: string): Promise<void> => {
    try {
      const contact = (contacts || []).find(c => c.id === id)
      const organizationId = user?.role === 'SUPERADMIN' ? contact?.organizationId : undefined
      
      await deleteContact(id, organizationId)
      
      // Remover da lista local
      setContacts(prev => prev.filter(c => c.id !== id))
      setSelectedContacts(prev => prev.filter(selectedId => selectedId !== id))
      
      await loadStats()
      
      toast({
        title: 'Contato removido',
        description: `${contact?.name || 'Contato'} foi removido com sucesso`
      })
    } catch (error: any) {
      toast({
        title: 'Erro ao remover contato',
        description: error.message,
        variant: 'destructive'
      })
      throw error
    }
  }
  
  // Remover contatos selecionados
  const removeSelectedContacts = async (): Promise<void> => {
    if (selectedContacts.length === 0) return
    
    try {
      const organizationId = user?.role === 'SUPERADMIN' ? filters.organizationId : undefined
      await deleteContactsAPI(selectedContacts, organizationId)
      
      // Remover da lista local
      setContacts(prev => prev.filter(c => !selectedContacts.includes(c.id)))
      setSelectedContacts([])
      
      await loadStats()
      
      toast({
        title: 'Contatos removidos',
        description: `${selectedContacts.length} contatos foram removidos com sucesso`
      })
    } catch (error: any) {
      toast({
        title: 'Erro ao remover contatos',
        description: error.message,
        variant: 'destructive'
      })
      throw error
    }
  }
  
  // Buscar contatos
  const searchContacts = useCallback((query: string) => {
    setFilters(prev => ({ ...prev, search: query, page: 1 }))
  }, [])
  
  // Seleção
  const selectAllContacts = useCallback(() => {
    setSelectedContacts((contacts || []).map(c => c.id))
  }, [contacts])
  
  const clearSelection = useCallback(() => {
    setSelectedContacts([])
  }, [])
  
  // Paginação
  const setPage = useCallback((page: number) => {
    setFilters(prev => ({ ...prev, page }))
  }, [])
  
  const setLimit = useCallback((limit: number) => {
    setFilters(prev => ({ ...prev, limit, page: 1 }))
  }, [])
  
  // Atualizar filtros
  const updateFilters = useCallback((newFilters: ContactFilters) => {
    setFilters(prev => ({ ...prev, ...newFilters, page: 1 }))
  }, [])
  
  // Efeitos
  useEffect(() => {
    let mounted = true
    
    if (isAuthenticated && user && mounted) {
      loadContacts(true) // Carregamento imediato na inicialização
      loadStats()
    }

    return () => {
      mounted = false
      // Limpar timeout ao desmontar
      if (loadContactsTimeoutRef.current) {
        clearTimeout(loadContactsTimeoutRef.current)
      }
    }
  }, [isAuthenticated, user, loadContacts, loadStats])

  // Efeito para mudanças nos filtros (com debounce)
  useEffect(() => {
    if (isAuthenticated && user) {
      loadContacts(false) // Com debounce para filtros
    }
  }, [stableFilters.search, stableFilters.company, stableFilters.city, stableFilters.state, stableFilters.tags])

  // Efeito para mudanças de página (imediato)
  useEffect(() => {
    if (isAuthenticated && user) {
      loadContacts(true) // Imediato para paginação
    }
  }, [stableFilters.page, stableFilters.limit])
  
  const value: ContactsContextType = {
    // Estado
    contacts,
    stats,
    loading,
    pagination,
    
    // Filtros
    filters,
    setFilters: updateFilters,
    
    // Seleção
    selectedContacts,
    setSelectedContacts,
    selectAllContacts,
    clearSelection,
    
    // Ações CRUD
    loadContacts,
    loadStats,
    addContact,
    editContact,
    removeContact,
    removeSelectedContacts,
    
    // Busca
    searchContacts,
    
    // Paginação
    setPage,
    setLimit
  }
  
  return (
    <ContactsContext.Provider value={value}>
      {children}
    </ContactsContext.Provider>
  )
}
