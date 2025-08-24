"use client";

import React, { useState, useEffect, useRef } from "react";
import { 
  Users, 
  Search, 
  Plus, 
  Edit, 
  Trash2, 
  Eye,
  Download, 
  Upload,
  Filter,
  X,
  Phone,
  Mail,
  MapPin,
  Calendar,
  FileText,
  Tag as TagIcon,
  ExternalLink,
  RefreshCw
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger,
  DialogFooter 
} from "@/components/ui/dialog";
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "@/hooks/use-toast";
import { 
  Contact, 
  Tag,
  CreateContactData,
  UpdateContactData,
  CreateTagData,
  ContactsListParams,
  getContacts,
  createContact,
  updateContact,
  deleteContact,
  getTags,
  createTag,
  downloadTemplate,
  exportContacts,
  importContacts
} from "@/lib/api/contacts";

export default function ContactsPage() {
  // Estados principais
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [tags, setTags] = useState<Tag[]>([]);
  const [loading, setLoading] = useState(true);
  const [totalContacts, setTotalContacts] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // Estados de filtros e busca
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedTag, setSelectedTag] = useState<string>("all");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [sortBy, setSortBy] = useState("createdAt");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const itemsPerPage = 12;

  // Estados de modais
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isTagModalOpen, setIsTagModalOpen] = useState(false);
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null);

  // Estados de formulários
  const [createForm, setCreateForm] = useState<CreateContactData>({
    name: "",
    phone: "",
    email: "",
    document: "",
    address: "",
    city: "",
    state: "",
    zipCode: "",
    notes: "",
    isActive: true,
    tagIds: []
  });

  const [editForm, setEditForm] = useState<UpdateContactData>({});

  const [tagForm, setTagForm] = useState<CreateTagData>({
    name: "",
    color: "#3b82f6",
    description: ""
  });

  // Estados de upload
  const [uploadFile, setUploadFile] = useState<File | null>(null);
  const [importing, setImporting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Carregar dados iniciais
  useEffect(() => {
    loadContacts();
    loadTags();
  }, [currentPage, searchTerm, selectedTag, statusFilter, sortBy, sortOrder]);

  const loadContacts = async () => {
    try {
      setLoading(true);
      const params: ContactsListParams = {
        page: currentPage,
        limit: itemsPerPage,
        sortBy,
        sortOrder,
      };

      if (searchTerm) params.search = searchTerm;
      if (selectedTag && selectedTag !== "all") params.tagId = selectedTag;
      if (statusFilter !== "all") params.isActive = statusFilter === "active";

      const response = await getContacts(params);
      setContacts(response.data);
      setTotalContacts(response.meta.total);
      setTotalPages(response.meta.totalPages);
    } catch (error: any) {
      toast({
        title: "Erro",
        description: "Erro ao carregar contatos",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const loadTags = async () => {
    try {
      const tagsData = await getTags();
      setTags(tagsData);
    } catch (error: any) {
      console.error("Erro ao carregar tags:", error);
    }
  };

  // Handlers do CRUD
  const handleCreateContact = async () => {
    try {
      if (!createForm.name || !createForm.phone) {
        toast({
          title: "Dados obrigatórios",
          description: "Nome e telefone são obrigatórios",
          variant: "destructive",
        });
        return;
      }

      await createContact(createForm);
      toast({
        title: "Sucesso",
        description: "Contato criado com sucesso",
      });
      
      setIsCreateModalOpen(false);
      setCreateForm({
        name: "",
        phone: "",
        email: "",
        document: "",
        address: "",
        city: "",
        state: "",
        zipCode: "",
        notes: "",
        isActive: true,
        tagIds: []
      });
      loadContacts();
    } catch (error: any) {
      toast({
        title: "Erro",
        description: error.response?.data?.message || "Erro ao criar contato",
        variant: "destructive",
      });
    }
  };

  const handleEditContact = async () => {
    if (!selectedContact) return;

    try {
      await updateContact(selectedContact.id, editForm);
      toast({
        title: "Sucesso",
        description: "Contato atualizado com sucesso",
      });
      
      setIsEditModalOpen(false);
      setEditForm({});
      setSelectedContact(null);
      loadContacts();
    } catch (error: any) {
      toast({
        title: "Erro",
        description: error.response?.data?.message || "Erro ao atualizar contato",
        variant: "destructive",
      });
    }
  };

  const handleDeleteContact = async (contact: Contact) => {
    try {
      await deleteContact(contact.id);
      toast({
        title: "Sucesso",
        description: "Contato removido com sucesso",
      });
      loadContacts();
    } catch (error: any) {
      toast({
        title: "Erro",
        description: error.response?.data?.message || "Erro ao remover contato",
        variant: "destructive",
      });
    }
  };

  const handleCreateTag = async () => {
    try {
      if (!tagForm.name || !tagForm.color) {
        toast({
          title: "Dados obrigatórios",
          description: "Nome e cor são obrigatórios",
          variant: "destructive",
        });
        return;
      }

      await createTag(tagForm);
      toast({
        title: "Sucesso",
        description: "Tag criada com sucesso",
      });
      
      setIsTagModalOpen(false);
      setTagForm({ name: "", color: "#3b82f6", description: "" });
      loadTags();
    } catch (error: any) {
      toast({
        title: "Erro",
        description: error.response?.data?.message || "Erro ao criar tag",
        variant: "destructive",
      });
    }
  };

  // Handlers de importação/exportação
  const handleDownloadTemplate = async () => {
    try {
      const blob = await downloadTemplate();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = "template-contatos.xlsx";
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
      toast({
        title: "Sucesso",
        description: "Template baixado com sucesso",
      });
    } catch (error: any) {
      toast({
        title: "Erro",
        description: "Erro ao baixar template",
        variant: "destructive",
      });
    }
  };

  const handleExportContacts = async (format: 'xlsx' | 'csv' = 'xlsx') => {
    try {
      const blob = await exportContacts({ 
        format,
        includeInactive: statusFilter === "inactive" || statusFilter === "all",
        tagIds: selectedTag !== "all" ? [selectedTag] : undefined
      });
      
      const today = new Date().toISOString().split('T')[0];
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `contatos-${today}.${format}`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
      
      toast({
        title: "Sucesso",
        description: "Contatos exportados com sucesso",
      });
    } catch (error: any) {
      toast({
        title: "Erro",
        description: "Erro ao exportar contatos",
        variant: "destructive",
      });
    }
  };

  const handleImportContacts = async () => {
    if (!uploadFile) {
      toast({
        title: "Erro",
        description: "Selecione um arquivo para importar",
        variant: "destructive",
      });
      return;
    }

    try {
      setImporting(true);
      const result = await importContacts(uploadFile);
      
      toast({
        title: "Importação concluída",
        description: `${result.summary.success} contatos importados com sucesso. ${result.summary.errors} erros.`,
      });
      
      setIsImportModalOpen(false);
      setUploadFile(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
      loadContacts();
    } catch (error: any) {
      toast({
        title: "Erro",
        description: error.response?.data?.message || "Erro ao importar contatos",
        variant: "destructive",
      });
    } finally {
      setImporting(false);
    }
  };

  // Handlers de modais
  const openEditModal = (contact: Contact) => {
    setSelectedContact(contact);
    setEditForm({
      name: contact.name,
      phone: contact.phone,
      email: contact.email || "",
      document: contact.document || "",
      address: contact.address || "",
      city: contact.city || "",
      state: contact.state || "",
      zipCode: contact.zipCode || "",
      notes: contact.notes || "",
      isActive: contact.isActive,
      tagIds: contact.contactTags.map(ct => ct.tagId)
    });
    setIsEditModalOpen(true);
  };

  const openViewModal = (contact: Contact) => {
    setSelectedContact(contact);
    setIsViewModalOpen(true);
  };

  // Handlers de filtros
  const clearFilters = () => {
    setSearchTerm("");
    setSelectedTag("all");
    setStatusFilter("all");
    setCurrentPage(1);
  };

  const handleSearch = (term: string) => {
    setSearchTerm(term);
    setCurrentPage(1);
  };

  // Utilitários
  const formatPhone = (phone: string | null | undefined) => {
    if (!phone) return '';
    const cleaned = phone.replace(/\D/g, '');
    if (cleaned.length === 11) {
      return `(${cleaned.slice(0, 2)}) ${cleaned.slice(2, 7)}-${cleaned.slice(7)}`;
    }
    return phone;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR');
  };

  return (
    <div className="flex-1 space-y-6 p-6">
      {/* Cabeçalho */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl flex items-center justify-center">
              <Users className="w-6 h-6 text-white" />
            </div>
            Contatos
          </h1>
          <p className="text-slate-600 dark:text-slate-400">
            Gerencie seus contatos e organize por tags
          </p>
        </div>

        <div className="flex flex-wrap gap-3">
          <Button
            onClick={handleDownloadTemplate}
            variant="outline"
            className="gap-2"
          >
            <Download className="w-4 h-4" />
            Template
          </Button>

          <Dialog open={isImportModalOpen} onOpenChange={setIsImportModalOpen}>
            <DialogTrigger asChild>
              <Button variant="outline" className="gap-2">
                <Upload className="w-4 h-4" />
                Importar
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle>Importar Contatos</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <Input
                  ref={fileInputRef}
                  type="file"
                  accept=".xlsx,.xls,.csv"
                  onChange={(e) => setUploadFile(e.target.files?.[0] || null)}
                />
                <p className="text-sm text-muted-foreground">
                  Formatos aceitos: .xlsx, .xls, .csv
                </p>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsImportModalOpen(false)}>
                  Cancelar
                </Button>
                <Button onClick={handleImportContacts} disabled={importing || !uploadFile}>
                  {importing ? "Importando..." : "Importar"}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>

          <Button
            onClick={() => handleExportContacts('xlsx')}
            variant="outline"
            className="gap-2"
          >
            <Download className="w-4 h-4" />
            Exportar
          </Button>

          <Dialog open={isTagModalOpen} onOpenChange={setIsTagModalOpen}>
            <DialogTrigger asChild>
              <Button variant="outline" className="gap-2">
                <TagIcon className="w-4 h-4" />
                Nova Tag
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle>Nova Tag</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="tag-name">Nome</Label>
                  <Input
                    id="tag-name"
                    value={tagForm.name}
                    onChange={(e) => setTagForm(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="Nome da tag"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="tag-color">Cor</Label>
                  <Input
                    id="tag-color"
                    type="color"
                    value={tagForm.color}
                    onChange={(e) => setTagForm(prev => ({ ...prev, color: e.target.value }))}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="tag-description">Descrição</Label>
                  <Textarea
                    id="tag-description"
                    value={tagForm.description}
                    onChange={(e) => setTagForm(prev => ({ ...prev, description: e.target.value }))}
                    placeholder="Descrição da tag"
                  />
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsTagModalOpen(false)}>
                  Cancelar
                </Button>
                <Button onClick={handleCreateTag}>
                  Criar Tag
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>

          <Dialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
            <DialogTrigger asChild>
              <Button className="gap-2">
                <Plus className="w-4 h-4" />
                Novo Contato
              </Button>
            </DialogTrigger>
          </Dialog>
        </div>
      </div>

      {/* Filtros e Busca */}
      <Card className="border-0 shadow-sm">
        <CardContent className="p-6">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <Input
                  placeholder="Buscar por nome, telefone, email ou documento..."
                  value={searchTerm}
                  onChange={(e) => handleSearch(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            <div className="flex gap-3">
              <Select value={selectedTag} onValueChange={setSelectedTag}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Todas as tags" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todas as tags</SelectItem>
                  {tags.map((tag) => (
                    <SelectItem key={tag.id} value={tag.id}>
                      <div className="flex items-center gap-2">
                        <div 
                          className="w-3 h-3 rounded-full" 
                          style={{ backgroundColor: tag.color }}
                        />
                        {tag.name}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-32">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos</SelectItem>
                  <SelectItem value="active">Ativos</SelectItem>
                  <SelectItem value="inactive">Inativos</SelectItem>
                </SelectContent>
              </Select>

              {(searchTerm || selectedTag !== "all" || statusFilter !== "all") && (
                <Button variant="ghost" onClick={clearFilters} className="gap-2">
                  <X className="w-4 h-4" />
                  Limpar
                </Button>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Estatísticas */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="border-0 shadow-sm">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600 dark:text-slate-400">
                  Total de Contatos
                </p>
                <p className="text-2xl font-bold text-slate-900 dark:text-white">
                  {totalContacts}
                </p>
              </div>
              <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center">
                <Users className="w-6 h-6 text-blue-600 dark:text-blue-400" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-sm">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600 dark:text-slate-400">
                  Tags Criadas
                </p>
                <p className="text-2xl font-bold text-slate-900 dark:text-white">
                  {tags.length}
                </p>
              </div>
              <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900 rounded-lg flex items-center justify-center">
                <TagIcon className="w-6 h-6 text-purple-600 dark:text-purple-400" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-sm">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600 dark:text-slate-400">
                  Contatos Ativos
                </p>
                <p className="text-2xl font-bold text-slate-900 dark:text-white">
                  {contacts.filter(c => c.isActive).length}
                </p>
              </div>
              <div className="w-12 h-12 bg-green-100 dark:bg-green-900 rounded-lg flex items-center justify-center">
                <FileText className="w-6 h-6 text-green-600 dark:text-green-400" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Lista de Contatos */}
      {loading ? (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {[...Array(6)].map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardContent className="p-6">
                <div className="space-y-4">
                  <div className="h-4 bg-slate-200 rounded w-3/4"></div>
                  <div className="h-4 bg-slate-200 rounded w-1/2"></div>
                  <div className="h-4 bg-slate-200 rounded w-2/3"></div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : contacts.length === 0 ? (
        <Card className="text-center p-12">
          <Users className="w-16 h-16 text-slate-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">
            Nenhum contato encontrado
          </h3>
          <p className="text-slate-600 dark:text-slate-400 mb-6">
            {searchTerm || selectedTag !== "all" || statusFilter !== "all" ? 
              "Tente ajustar os filtros para encontrar contatos" : 
              "Comece criando seu primeiro contato"
            }
          </p>
          <Button onClick={() => setIsCreateModalOpen(true)} className="gap-2">
            <Plus className="w-4 h-4" />
            Criar Primeiro Contato
          </Button>
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {contacts.map((contact) => (
            <ContactCard 
              key={contact.id} 
              contact={contact}
              onEdit={() => openEditModal(contact)}
              onView={() => openViewModal(contact)}
              onDelete={() => handleDeleteContact(contact)}
              formatPhone={formatPhone}
              formatDate={formatDate}
            />
          ))}
        </div>
      )}

      {/* Paginação */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-4">
          <Button
            variant="outline"
            onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
            disabled={currentPage === 1}
          >
            Anterior
          </Button>
          
          <span className="text-sm text-slate-600">
            Página {currentPage} de {totalPages}
          </span>
          
          <Button
            variant="outline"
            onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
            disabled={currentPage === totalPages}
          >
            Próxima
          </Button>
        </div>
      )}

      {/* Modals */}
      <CreateContactModal
        open={isCreateModalOpen}
        onOpenChange={setIsCreateModalOpen}
        createForm={createForm}
        setCreateForm={setCreateForm}
        tags={tags}
        onSubmit={handleCreateContact}
      />

      <EditContactModal
        open={isEditModalOpen}
        onOpenChange={setIsEditModalOpen}
        contact={selectedContact}
        editForm={editForm}
        setEditForm={setEditForm}
        tags={tags}
        onSubmit={handleEditContact}
      />

      <ViewContactModal
        open={isViewModalOpen}
        onOpenChange={setIsViewModalOpen}
        contact={selectedContact}
        onEdit={() => {
          setIsViewModalOpen(false);
          if (selectedContact) openEditModal(selectedContact);
        }}
        formatPhone={formatPhone}
        formatDate={formatDate}
      />
    </div>
  );
}

// Componente do Card de Contato
function ContactCard({
  contact,
  onEdit,
  onView,
  onDelete,
  formatPhone,
  formatDate
}: {
  contact: Contact;
  onEdit: () => void;
  onView: () => void;
  onDelete: () => void;
  formatPhone: (phone: string | null | undefined) => string;
  formatDate: (date: string) => string;
}) {
  return (
    <Card className="group hover:shadow-lg transition-all duration-300 border border-slate-200 dark:border-slate-800">
      <CardHeader className="pb-4">
        <div className="flex justify-between items-start">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center text-white font-semibold">
              {contact.name.charAt(0).toUpperCase()}
            </div>
            <div>
              <h3 className="font-semibold text-slate-900 dark:text-white">
                {contact.name}
              </h3>
              <Badge variant={contact.isActive ? "default" : "secondary"} className="text-xs">
                {contact.isActive ? "Ativo" : "Inativo"}
              </Badge>
            </div>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-3">
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
            <Phone className="w-4 h-4" />
            <span>{formatPhone(contact.phone)}</span>
          </div>
          
          {contact.email && (
            <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
              <Mail className="w-4 h-4" />
              <span className="truncate">{contact.email}</span>
            </div>
          )}
          
          <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
            <Calendar className="w-4 h-4" />
            <span>Criado em {formatDate(contact.createdAt)}</span>
          </div>
        </div>

        {contact.contactTags.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {contact.contactTags.slice(0, 2).map((ct) => (
              <Badge 
                key={ct.tag.id} 
                variant="outline" 
                className="text-xs px-2 py-1"
                style={{ 
                  borderColor: ct.tag.color, 
                  color: ct.tag.color 
                }}
              >
                {ct.tag.name}
              </Badge>
            ))}
            {contact.contactTags.length > 2 && (
              <Badge variant="outline" className="text-xs px-2 py-1">
                +{contact.contactTags.length - 2}
              </Badge>
            )}
          </div>
        )}

        <div className="flex gap-2 pt-3 border-t border-slate-100 dark:border-slate-800">
          <Button
            variant="ghost"
            size="sm"
            onClick={onView}
            className="flex-1 gap-2"
          >
            <Eye className="w-4 h-4" />
            Ver
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={onEdit}
            className="flex-1 gap-2"
          >
            <Edit className="w-4 h-4" />
            Editar
          </Button>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                className="gap-2 text-red-600 hover:text-red-700 hover:bg-red-50"
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Confirmar exclusão</AlertDialogTitle>
                <AlertDialogDescription>
                  Tem certeza que deseja excluir o contato "{contact.name}"? Esta ação não pode ser desfeita.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancelar</AlertDialogCancel>
                <AlertDialogAction onClick={onDelete} className="bg-red-600 hover:bg-red-700">
                  Excluir
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </CardContent>
    </Card>
  );
}

// Modal de Criação de Contato
function CreateContactModal({
  open,
  onOpenChange,
  createForm,
  setCreateForm,
  tags,
  onSubmit
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  createForm: CreateContactData;
  setCreateForm: React.Dispatch<React.SetStateAction<CreateContactData>>;
  tags: Tag[];
  onSubmit: () => void;
}) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">Novo Contato</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="create-name">Nome *</Label>
              <Input
                id="create-name"
                value={createForm.name}
                onChange={(e) => setCreateForm(prev => ({ ...prev, name: e.target.value }))}
                placeholder="Nome completo"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="create-phone">Telefone *</Label>
              <Input
                id="create-phone"
                value={createForm.phone}
                onChange={(e) => setCreateForm(prev => ({ ...prev, phone: e.target.value }))}
                placeholder="(11) 99999-9999"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="create-email">Email</Label>
              <Input
                id="create-email"
                type="email"
                value={createForm.email}
                onChange={(e) => setCreateForm(prev => ({ ...prev, email: e.target.value }))}
                placeholder="email@exemplo.com"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="create-document">Documento</Label>
              <Input
                id="create-document"
                value={createForm.document}
                onChange={(e) => setCreateForm(prev => ({ ...prev, document: e.target.value }))}
                placeholder="CPF ou CNPJ"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="create-notes">Observações</Label>
            <Textarea
              id="create-notes"
              value={createForm.notes}
              onChange={(e) => setCreateForm(prev => ({ ...prev, notes: e.target.value }))}
              placeholder="Observações sobre o contato"
              rows={3}
            />
          </div>

          <div className="flex items-center space-x-2">
            <Switch
              id="create-active"
              checked={createForm.isActive}
              onCheckedChange={(checked) => setCreateForm(prev => ({ ...prev, isActive: checked }))}
            />
            <Label htmlFor="create-active">Contato ativo</Label>
          </div>
        </div>

        <DialogFooter className="gap-3">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancelar
          </Button>
          <Button onClick={onSubmit}>
            Criar Contato
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

// Modal de Edição de Contato
function EditContactModal({
  open,
  onOpenChange,
  contact,
  editForm,
  setEditForm,
  tags,
  onSubmit
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  contact: Contact | null;
  editForm: UpdateContactData;
  setEditForm: React.Dispatch<React.SetStateAction<UpdateContactData>>;
  tags: Tag[];
  onSubmit: () => void;
}) {
  if (!contact) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">Editar Contato</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="edit-name">Nome *</Label>
              <Input
                id="edit-name"
                value={editForm.name || ""}
                onChange={(e) => setEditForm(prev => ({ ...prev, name: e.target.value }))}
                placeholder="Nome completo"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="edit-phone">Telefone *</Label>
              <Input
                id="edit-phone"
                value={editForm.phone || ""}
                onChange={(e) => setEditForm(prev => ({ ...prev, phone: e.target.value }))}
                placeholder="(11) 99999-9999"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="edit-email">Email</Label>
              <Input
                id="edit-email"
                type="email"
                value={editForm.email || ""}
                onChange={(e) => setEditForm(prev => ({ ...prev, email: e.target.value }))}
                placeholder="email@exemplo.com"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="edit-document">Documento</Label>
              <Input
                id="edit-document"
                value={editForm.document || ""}
                onChange={(e) => setEditForm(prev => ({ ...prev, document: e.target.value }))}
                placeholder="CPF ou CNPJ"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="edit-notes">Observações</Label>
            <Textarea
              id="edit-notes"
              value={editForm.notes || ""}
              onChange={(e) => setEditForm(prev => ({ ...prev, notes: e.target.value }))}
              placeholder="Observações sobre o contato"
              rows={3}
            />
          </div>

          <div className="flex items-center space-x-2">
            <Switch
              id="edit-active"
              checked={editForm.isActive ?? true}
              onCheckedChange={(checked) => setEditForm(prev => ({ ...prev, isActive: checked }))}
            />
            <Label htmlFor="edit-active">Contato ativo</Label>
          </div>
        </div>

        <DialogFooter className="gap-3">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancelar
          </Button>
          <Button onClick={onSubmit}>
            Salvar Alterações
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

// Modal de Visualização de Contato
function ViewContactModal({
  open,
  onOpenChange,
  contact,
  onEdit,
  formatPhone,
  formatDate
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  contact: Contact | null;
  onEdit: () => void;
  formatPhone: (phone: string | null | undefined) => string;
  formatDate: (date: string) => string;
}) {
  if (!contact) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">Detalhes do Contato</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-3">
              <h4 className="font-semibold text-slate-900 dark:text-white">Informações Básicas</h4>
              <div className="space-y-2">
                <p><span className="font-medium">Nome:</span> {contact.name}</p>
                <p><span className="font-medium">Telefone:</span> {formatPhone(contact.phone)}</p>
                {contact.email && (
                  <p><span className="font-medium">Email:</span> {contact.email}</p>
                )}
                {contact.document && (
                  <p><span className="font-medium">Documento:</span> {contact.document}</p>
                )}
              </div>
            </div>

            <div className="space-y-3">
              <h4 className="font-semibold text-slate-900 dark:text-white">Status e Datas</h4>
              <div className="space-y-2">
                <p><span className="font-medium">Status:</span> 
                  <Badge variant={contact.isActive ? "default" : "secondary"} className="ml-2">
                    {contact.isActive ? "Ativo" : "Inativo"}
                  </Badge>
                </p>
                <p><span className="font-medium">Criado em:</span> {formatDate(contact.createdAt)}</p>
                <p><span className="font-medium">Atualizado em:</span> {formatDate(contact.updatedAt)}</p>
              </div>
            </div>
          </div>

          {contact.notes && (
            <Card className="p-4">
              <h4 className="font-semibold text-slate-900 dark:text-white mb-2">Observações</h4>
              <p className="text-slate-600 dark:text-slate-400">{contact.notes}</p>
            </Card>
          )}

          {contact.contactTags.length > 0 && (
            <Card className="p-4">
              <h4 className="font-semibold text-slate-900 dark:text-white mb-3">Tags</h4>
              <div className="flex flex-wrap gap-2">
                {contact.contactTags.map((ct) => (
                  <Badge 
                    key={ct.tag.id} 
                    variant="outline"
                    style={{ 
                      borderColor: ct.tag.color, 
                      color: ct.tag.color 
                    }}
                  >
                    {ct.tag.name}
                  </Badge>
                ))}
              </div>
            </Card>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Fechar
          </Button>
          <Button onClick={onEdit} className="gap-2">
            <Edit className="w-4 h-4" />
            Editar Contato
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
