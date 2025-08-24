"use client";

import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Slider } from "@/components/ui/slider";
import {
  Plus,
  Edit,
  Trash2,
  FileText,
  Image,
  Video,
  FileAudio,
  File,
  Eye,
  Upload,
  MoreVertical,
  Copy
} from "lucide-react";
import { toast } from "@/hooks/use-toast";
import {
  getCampaignTemplates,
  createTemplate,
  Template
} from "@/lib/api/warmup";

interface TemplateManagerProps {
  campaignId: string;
  onTemplateChange?: () => void;
}

export default function TemplateManager({ campaignId, onTemplateChange }: TemplateManagerProps) {
  const [templates, setTemplates] = useState<Template[]>([]);
  const [loading, setLoading] = useState(true);
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState<Template | null>(null);
  const [previewDialogOpen, setPreviewDialogOpen] = useState(false);

  // Estados do formulário
  const [newTemplate, setNewTemplate] = useState({
    name: "",
    content: "",
    messageType: "text" as "text" | "image" | "audio" | "video" | "document",
    weight: 1,
    isActive: true,
  });
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  // Carregar templates
  useEffect(() => {
    loadTemplates();
  }, [campaignId]);

  const loadTemplates = async () => {
    try {
      setLoading(true);
      const data = await getCampaignTemplates(campaignId);
      setTemplates(data.data || []);
    } catch (error) {
      console.error("Erro ao carregar templates:", error);
      toast({
        title: "Erro",
        description: "Falha ao carregar templates",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCreateTemplate = async () => {
    try {
      if (!newTemplate.name.trim() || !newTemplate.content.trim()) {
        toast({
          title: "Erro",
          description: "Nome e conteúdo são obrigatórios",
          variant: "destructive",
        });
        return;
      }

      const formData = new FormData();
      formData.append("name", newTemplate.name);
      formData.append("content", newTemplate.content);
      formData.append("messageType", newTemplate.messageType);
      formData.append("weight", newTemplate.weight.toString());
      formData.append("isActive", newTemplate.isActive.toString());

      if (selectedFile) {
        formData.append("file", selectedFile);
      }

      await createTemplate(campaignId, formData);
      
      toast({
        title: "Sucesso",
        description: "Template criado com sucesso",
      });

      setCreateDialogOpen(false);
      resetForm();
      await loadTemplates();
      onTemplateChange?.();
    } catch (error) {
      console.error("Erro ao criar template:", error);
      toast({
        title: "Erro",
        description: "Falha ao criar template",
        variant: "destructive",
      });
    }
  };

  const resetForm = () => {
    setNewTemplate({
      name: "",
      content: "",
      messageType: "text",
      weight: 1,
      isActive: true,
    });
    setSelectedFile(null);
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "image":
        return <Image className="h-4 w-4" />;
      case "video":
        return <Video className="h-4 w-4" />;
      case "audio":
        return <FileAudio className="h-4 w-4" />;
      case "document":
        return <File className="h-4 w-4" />;
      default:
        return <FileText className="h-4 w-4" />;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case "image":
        return "bg-purple-100 text-purple-800";
      case "video":
        return "bg-red-100 text-red-800";
      case "audio":
        return "bg-blue-100 text-blue-800";
      case "document":
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-green-100 text-green-800";
    }
  };

  const previewTemplate = (template: Template) => {
    setSelectedTemplate(template);
    setPreviewDialogOpen(true);
  };

  const copyTemplate = (template: Template) => {
    setNewTemplate({
      name: `${template.name} (Cópia)`,
      content: template.content,
      messageType: template.messageType,
      weight: template.weight,
      isActive: template.isActive,
    });
    setCreateDialogOpen(true);
  };

  const parseTemplateVariables = (content: string) => {
    const variables = content.match(/\{[^}]+\}/g) || [];
    return [...new Set(variables)];
  };

  const renderPreviewContent = (template: Template) => {
    let content = template.content;
    
    // Substituir variáveis por valores de exemplo
    content = content.replace(/\{nome\}/g, "João Silva");
    content = content.replace(/\{telefone\}/g, "+55 11 99999-9999");
    content = content.replace(/\{saudacao\}/g, "Boa tarde");
    
    return content;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto"></div>
          <p className="mt-2 text-sm text-gray-600">Carregando templates...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold">Templates de Mensagens</h3>
          <p className="text-sm text-muted-foreground">
            Gerencie os modelos de mensagens para a campanha
          </p>
        </div>
        <Dialog open={createDialogOpen} onOpenChange={setCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Novo Template
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Criar Novo Template</DialogTitle>
            </DialogHeader>
            <CreateTemplateForm 
              template={newTemplate}
              setTemplate={setNewTemplate}
              selectedFile={selectedFile}
              setSelectedFile={setSelectedFile}
              onSubmit={handleCreateTemplate}
              onCancel={() => {
                setCreateDialogOpen(false);
                resetForm();
              }}
            />
          </DialogContent>
        </Dialog>
      </div>

      {/* Lista de Templates */}
      {templates.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <FileText className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">Nenhum template encontrado</h3>
            <p className="text-muted-foreground text-center mb-4">
              Crie templates de mensagem para personalizar suas campanhas de aquecimento
            </p>
            <Button onClick={() => setCreateDialogOpen(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Criar Primeiro Template
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {templates.map((template) => (
            <Card key={template.id} className="hover:shadow-md transition-shadow">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded ${getTypeColor(template.messageType)}`}>
                      {getTypeIcon(template.messageType)}
                    </div>
                    <div>
                      <CardTitle className="text-base">{template.name}</CardTitle>
                      <div className="flex items-center gap-2 mt-1">
                        <Badge variant={template.isActive ? "default" : "secondary"}>
                          {template.isActive ? "Ativo" : "Inativo"}
                        </Badge>
                        <Badge variant="outline">
                          Peso: {template.weight}
                        </Badge>
                        <Badge variant="outline" className={getTypeColor(template.messageType)}>
                          {template.messageType}
                        </Badge>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => previewTemplate(template)}
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => copyTemplate(template)}
                    >
                      <Copy className="h-4 w-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => {
                        setSelectedTemplate(template);
                        setEditDialogOpen(true);
                      }}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      className="text-red-500 hover:text-red-700"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div>
                    <p className="text-sm text-muted-foreground line-clamp-3">
                      {template.content}
                    </p>
                  </div>
                  
                  {template.mediaUrl && (
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Upload className="h-4 w-4" />
                      Contém mídia anexada
                    </div>
                  )}

                  <div className="flex items-center gap-4 text-xs text-muted-foreground">
                    <span>Criado em: {new Date(template.createdAt).toLocaleDateString("pt-BR")}</span>
                    {parseTemplateVariables(template.content).length > 0 && (
                      <span>
                        Variáveis: {parseTemplateVariables(template.content).join(", ")}
                      </span>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Dialog de Preview */}
      <Dialog open={previewDialogOpen} onOpenChange={setPreviewDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Preview do Template</DialogTitle>
          </DialogHeader>
          {selectedTemplate && (
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <div className={`p-2 rounded ${getTypeColor(selectedTemplate.messageType)}`}>
                  {getTypeIcon(selectedTemplate.messageType)}
                </div>
                <div>
                  <h4 className="font-semibold">{selectedTemplate.name}</h4>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline">
                      {selectedTemplate.messageType}
                    </Badge>
                    <Badge variant="outline">
                      Peso: {selectedTemplate.weight}
                    </Badge>
                  </div>
                </div>
              </div>

              <div className="border rounded-lg p-4 bg-muted">
                <h5 className="font-medium mb-2">Conteúdo Original:</h5>
                <p className="text-sm whitespace-pre-wrap">{selectedTemplate.content}</p>
              </div>

              <div className="border rounded-lg p-4 bg-blue-50">
                <h5 className="font-medium mb-2">Preview com Dados de Exemplo:</h5>
                <p className="text-sm whitespace-pre-wrap">{renderPreviewContent(selectedTemplate)}</p>
              </div>

              {parseTemplateVariables(selectedTemplate.content).length > 0 && (
                <div className="border rounded-lg p-4">
                  <h5 className="font-medium mb-2">Variáveis Disponíveis:</h5>
                  <div className="flex flex-wrap gap-2">
                    {parseTemplateVariables(selectedTemplate.content).map((variable, index) => (
                      <Badge key={index} variant="secondary">
                        {variable}
                      </Badge>
                    ))}
                  </div>
                  <p className="text-xs text-muted-foreground mt-2">
                    Variáveis serão substituídas automaticamente durante o envio
                  </p>
                </div>
              )}

              {selectedTemplate.mediaUrl && (
                <div className="border rounded-lg p-4">
                  <h5 className="font-medium mb-2">Mídia Anexada:</h5>
                  <div className="flex items-center gap-2">
                    <Upload className="h-4 w-4" />
                    <span className="text-sm">Arquivo de mídia disponível</span>
                  </div>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}

// Componente do formulário de criação de template
function CreateTemplateForm({
  template,
  setTemplate,
  selectedFile,
  setSelectedFile,
  onSubmit,
  onCancel
}: {
  template: any;
  setTemplate: (template: any) => void;
  selectedFile: File | null;
  setSelectedFile: (file: File | null) => void;
  onSubmit: () => void;
  onCancel: () => void;
}) {
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validar tamanho (10MB)
      if (file.size > 10 * 1024 * 1024) {
        toast({
          title: "Erro",
          description: "Arquivo muito grande. Máximo 10MB permitido.",
          variant: "destructive",
        });
        return;
      }

      setSelectedFile(file);
      
      // Auto-detectar tipo baseado no arquivo
      const fileType = file.type;
      if (fileType.startsWith("image/")) {
        setTemplate({ ...template, messageType: "image" });
      } else if (fileType.startsWith("video/")) {
        setTemplate({ ...template, messageType: "video" });
      } else if (fileType.startsWith("audio/")) {
        setTemplate({ ...template, messageType: "audio" });
      } else {
        setTemplate({ ...template, messageType: "document" });
      }
    }
  };

  return (
    <ScrollArea className="max-h-[600px] pr-4">
      <div className="space-y-6">
        {/* Informações Básicas */}
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="template-name">Nome do Template *</Label>
            <Input
              id="template-name"
              value={template.name}
              onChange={(e) => setTemplate({ ...template, name: e.target.value })}
              placeholder="Ex: Saudação Matinal"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="template-content">Conteúdo da Mensagem *</Label>
            <Textarea
              id="template-content"
              value={template.content}
              onChange={(e) => setTemplate({ ...template, content: e.target.value })}
              placeholder="Olá {nome}! {saudacao}, como está?"
              rows={4}
            />
            <p className="text-xs text-muted-foreground">
              Use variáveis como {"{nome}"}, {"{telefone}"} e {"{saudacao}"} para personalizar
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="message-type">Tipo de Mensagem</Label>
            <Select
              value={template.messageType}
              onValueChange={(value) => setTemplate({ ...template, messageType: value })}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="text">Texto</SelectItem>
                <SelectItem value="image">Imagem</SelectItem>
                <SelectItem value="video">Vídeo</SelectItem>
                <SelectItem value="audio">Áudio</SelectItem>
                <SelectItem value="document">Documento</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {template.messageType !== "text" && (
            <div className="space-y-2">
              <Label htmlFor="template-file">Arquivo de Mídia</Label>
              <Input
                id="template-file"
                type="file"
                onChange={handleFileChange}
                accept={
                  template.messageType === "image" ? "image/*" :
                  template.messageType === "video" ? "video/*" :
                  template.messageType === "audio" ? "audio/*" :
                  ".pdf,.doc,.docx"
                }
              />
              {selectedFile && (
                <p className="text-sm text-green-600">
                  Arquivo selecionado: {selectedFile.name} ({(selectedFile.size / 1024 / 1024).toFixed(2)}MB)
                </p>
              )}
            </div>
          )}
        </div>

        {/* Configurações Avançadas */}
        <div className="space-y-4">
          <h4 className="font-medium">Configurações</h4>
          
          <div className="space-y-2">
            <Label>Peso do Template: {template.weight}</Label>
            <Slider
              value={[template.weight]}
              onValueChange={(value) => setTemplate({ ...template, weight: value[0] })}
              max={10}
              min={1}
              step={1}
              className="w-full"
            />
            <p className="text-xs text-muted-foreground">
              Templates com maior peso são selecionados com mais frequência
            </p>
          </div>

          <div className="flex items-center space-x-2">
            <Switch
              id="template-active"
              checked={template.isActive}
              onCheckedChange={(checked) => setTemplate({ ...template, isActive: checked })}
            />
            <Label htmlFor="template-active">
              Template ativo
            </Label>
          </div>
        </div>

        {/* Preview */}
        {template.content && (
          <div className="space-y-2">
            <Label>Preview:</Label>
            <div className="border rounded-lg p-3 bg-muted">
              <p className="text-sm whitespace-pre-wrap">
                {template.content
                  .replace(/\{nome\}/g, "João Silva")
                  .replace(/\{telefone\}/g, "+55 11 99999-9999")
                  .replace(/\{saudacao\}/g, "Boa tarde")
                }
              </p>
            </div>
          </div>
        )}

        {/* Botões */}
        <div className="flex justify-end gap-2 pt-4">
          <Button variant="outline" onClick={onCancel}>
            Cancelar
          </Button>
          <Button onClick={onSubmit}>
            Criar Template
          </Button>
        </div>
      </div>
    </ScrollArea>
  );
}
