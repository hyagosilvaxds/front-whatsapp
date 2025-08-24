'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Checkbox } from '@/components/ui/checkbox'
import { Upload, Download, FileSpreadsheet, CheckCircle, AlertCircle, Loader2 } from 'lucide-react'
import { downloadTemplate, exportContacts, importContacts, downloadFile, ContactFilters } from '@/lib/api/contacts'
import { useAuth } from '@/contexts/auth-context'
import { useToast } from '@/hooks/use-toast'

interface ImportExportPanelProps {
  filters?: ContactFilters
  onDataChange?: () => void
}

export default function ImportExportPanel({ filters = {}, onDataChange }: ImportExportPanelProps) {
  const { user, organizationId } = useAuth()
  const { toast } = useToast()
  
  const [importing, setImporting] = useState(false)
  const [exporting, setExporting] = useState(false)
  const [downloadingTemplate, setDownloadingTemplate] = useState(false)
  const [importProgress, setImportProgress] = useState(0)
  const [importFile, setImportFile] = useState<File | null>(null)
  const [overwriteExisting, setOverwriteExisting] = useState(false)
  const [importResult, setImportResult] = useState<any>(null)
  
  // Exportação
  const [exportOptions, setExportOptions] = useState({
    includeActive: true,
    includeInactive: false,
    includeTags: true,
    includeStats: false
  })

  // Download do template
  const handleDownloadTemplate = async () => {
    try {
      setDownloadingTemplate(true)
      const blob = await downloadTemplate()
      downloadFile(blob, 'template-contatos.xlsx')
      
      toast({
        title: 'Template baixado',
        description: 'O template foi baixado com sucesso'
      })
    } catch (error: any) {
      toast({
        title: 'Erro ao baixar template',
        description: error.message,
        variant: 'destructive'
      })
    } finally {
      setDownloadingTemplate(false)
    }
  }

  // Exportar contatos
  const handleExportContacts = async () => {
    try {
      setExporting(true)
      
      // Construir filtros baseado nas opções
      const exportFilters: ContactFilters = { ...filters }
      
      // Aplicar filtros de status se necessário
      if (exportOptions.includeActive && !exportOptions.includeInactive) {
        // Lógica para filtrar apenas ativos
      } else if (!exportOptions.includeActive && exportOptions.includeInactive) {
        // Lógica para filtrar apenas inativos
      }
      
      const blob = await exportContacts(exportFilters)
      const filename = `contatos-${new Date().toISOString().split('T')[0]}.xlsx`
      downloadFile(blob, filename)
      
      toast({
        title: 'Contatos exportados',
        description: `Arquivo ${filename} foi baixado com sucesso`
      })
    } catch (error: any) {
      toast({
        title: 'Erro ao exportar contatos',
        description: error.message,
        variant: 'destructive'
      })
    } finally {
      setExporting(false)
    }
  }

  // Selecionar arquivo para importação
  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      if (file.type === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' || 
          file.name.endsWith('.xlsx')) {
        setImportFile(file)
        setImportResult(null)
      } else {
        toast({
          title: 'Arquivo inválido',
          description: 'Por favor, selecione um arquivo Excel (.xlsx)',
          variant: 'destructive'
        })
      }
    }
  }

  // Importar contatos
  const handleImportContacts = async () => {
    if (!importFile) return

    try {
      setImporting(true)
      setImportProgress(0)
      
      // Simular progresso
      const progressInterval = setInterval(() => {
        setImportProgress(prev => {
          if (prev >= 90) {
            clearInterval(progressInterval)
            return prev
          }
          return prev + 10
        })
      }, 300)

      const result = await importContacts(importFile, overwriteExisting)
      
      clearInterval(progressInterval)
      setImportProgress(100)
      setImportResult(result)
      
      // Recarregar dados
      onDataChange?.()
      
      toast({
        title: 'Importação concluída',
        description: `${result.summary.created} contatos criados, ${result.summary.updated} atualizados`
      })
      
      // Limpar arquivo após sucesso
      setImportFile(null)
    } catch (error: any) {
      toast({
        title: 'Erro na importação',
        description: error.message,
        variant: 'destructive'
      })
    } finally {
      setImporting(false)
      setImportProgress(0)
    }
  }

  return (
    <div className="grid gap-6 md:grid-cols-2">
      {/* Importar Contatos */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Upload className="h-5 w-5" />
            Importar Contatos
          </CardTitle>
          <CardDescription>
            Faça upload de um arquivo Excel com seus contatos
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Upload de arquivo */}
          <div className="border-2 border-dashed border-muted rounded-lg p-6 text-center">
            <FileSpreadsheet className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
            {importFile ? (
              <div className="space-y-2">
                <p className="text-sm font-medium">{importFile.name}</p>
                <p className="text-xs text-muted-foreground">
                  {(importFile.size / 1024 / 1024).toFixed(2)} MB
                </p>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setImportFile(null)}
                >
                  Remover
                </Button>
              </div>
            ) : (
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">
                  Arraste um arquivo aqui ou clique para selecionar
                </p>
                <label htmlFor="import-file">
                  <Button variant="outline" className="cursor-pointer" asChild>
                    <span>Selecionar Arquivo</span>
                  </Button>
                </label>
                <input
                  id="import-file"
                  type="file"
                  accept=".xlsx"
                  onChange={handleFileSelect}
                  className="hidden"
                />
              </div>
            )}
          </div>

          {/* Opções de importação */}
          <div className="space-y-3">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="overwrite"
                checked={overwriteExisting}
                onCheckedChange={(checked) => setOverwriteExisting(checked as boolean)}
              />
              <label htmlFor="overwrite" className="text-sm">
                Sobrescrever contatos existentes
              </label>
            </div>
          </div>

          {/* Progresso de importação */}
          {importing && (
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span>Importando contatos...</span>
                <span>{importProgress}%</span>
              </div>
              <Progress value={importProgress} />
            </div>
          )}

          {/* Resultado da importação */}
          {importResult && (
            <Alert>
              <CheckCircle className="h-4 w-4" />
              <AlertDescription>
                <div className="space-y-1">
                  <p className="font-medium">{importResult.message}</p>
                  <div className="text-sm space-y-1">
                    <p>Total processado: {importResult.summary.totalProcessed}</p>
                    <p>Criados: {importResult.summary.created}</p>
                    <p>Atualizados: {importResult.summary.updated}</p>
                    {importResult.summary.errors > 0 && (
                      <p className="text-red-600">Erros: {importResult.summary.errors}</p>
                    )}
                  </div>
                </div>
              </AlertDescription>
            </Alert>
          )}

          {/* Informações sobre o formato */}
          <div className="space-y-2 text-sm">
            <p className="font-medium">Formatos suportados:</p>
            <ul className="text-muted-foreground space-y-1">
              <li>• Excel (.xlsx)</li>
              <li>• Máximo 10.000 contatos</li>
              <li>• Encoding UTF-8</li>
            </ul>
          </div>

          {/* Botões */}
          <div className="space-y-2">
            <Button
              onClick={handleDownloadTemplate}
              variant="outline"
              className="w-full"
              disabled={downloadingTemplate}
            >
              {downloadingTemplate && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
              <Download className="h-4 w-4 mr-2" />
              Baixar Template
            </Button>
            
            <Button
              onClick={handleImportContacts}
              className="w-full"
              disabled={!importFile || importing}
            >
              {importing && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
              <Upload className="h-4 w-4 mr-2" />
              Importar Contatos
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Exportar Contatos */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Download className="h-5 w-5" />
            Exportar Contatos
          </CardTitle>
          <CardDescription>
            Baixe seus contatos em formato Excel
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Opções de exportação */}
          <div className="space-y-3">
            <p className="font-medium text-sm">Incluir:</p>
            
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="export-active"
                  checked={exportOptions.includeActive}
                  onCheckedChange={(checked) => 
                    setExportOptions(prev => ({ ...prev, includeActive: checked as boolean }))
                  }
                />
                <label htmlFor="export-active" className="text-sm">Contatos ativos</label>
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="export-inactive"
                  checked={exportOptions.includeInactive}
                  onCheckedChange={(checked) => 
                    setExportOptions(prev => ({ ...prev, includeInactive: checked as boolean }))
                  }
                />
                <label htmlFor="export-inactive" className="text-sm">Contatos inativos</label>
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="export-tags"
                  checked={exportOptions.includeTags}
                  onCheckedChange={(checked) => 
                    setExportOptions(prev => ({ ...prev, includeTags: checked as boolean }))
                  }
                />
                <label htmlFor="export-tags" className="text-sm">Incluir tags</label>
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="export-stats"
                  checked={exportOptions.includeStats}
                  onCheckedChange={(checked) => 
                    setExportOptions(prev => ({ ...prev, includeStats: checked as boolean }))
                  }
                />
                <label htmlFor="export-stats" className="text-sm">Incluir estatísticas</label>
              </div>
            </div>
          </div>

          {/* Informações sobre a exportação */}
          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertDescription className="text-sm">
              A exportação incluirá todos os contatos que atendem aos filtros atuais aplicados na listagem.
            </AlertDescription>
          </Alert>

          {/* Botão de exportação */}
          <Button
            onClick={handleExportContacts}
            className="w-full"
            disabled={exporting || (!exportOptions.includeActive && !exportOptions.includeInactive)}
          >
            {exporting && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
            <Download className="h-4 w-4 mr-2" />
            Exportar Excel
          </Button>

          {(!exportOptions.includeActive && !exportOptions.includeInactive) && (
            <p className="text-sm text-red-500 text-center">
              Selecione ao menos uma opção de status
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
