'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Checkbox } from '@/components/ui/checkbox'
import { Separator } from '@/components/ui/separator'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { useAuth } from '@/contexts/auth-context'
import { 
  MessageSquare, 
  Eye, 
  EyeOff, 
  Loader2,
  AlertCircle,
  Chrome,
  Apple
} from 'lucide-react'
import { useToast } from '@/hooks/use-toast'

export default function LoginPage() {
  const { login, isLoading, isAuthenticated } = useAuth()
  const { toast } = useToast()
  const router = useRouter()
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    rememberMe: false
  })
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')

  // Redirecionar se já estiver logado
  useEffect(() => {
    if (isAuthenticated && !isLoading) {
      console.log('Usuário já está logado, redirecionando para /')
      router.replace('/')
    }
  }, [isAuthenticated, isLoading, router])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (!formData.email || !formData.password) {
      setError('Por favor, preencha todos os campos')
      return
    }

    const result = await login(formData.email, formData.password)
    
    if (result.success) {
      toast({
        title: 'Login realizado com sucesso!',
        description: 'Redirecionando...',
      })
      router.replace('/')
      toast({
        title: 'Login realizado!',
        description: 'Bem-vindo ao WhatsApp Suite',
      })
    } else {
      setError(result.message || 'Email ou senha incorretos')
      toast({
        title: 'Erro no login',
        description: result.message || 'Verifique suas credenciais e tente novamente',
        variant: 'destructive'
      })
    }
  }

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
    if (error) setError('')
  }

  const demoCredentials = [
    { label: 'Admin', email: 'admin@whatsappsuite.com', password: 'admin123', role: 'Administrador' },
    { label: 'Usuário', email: 'user@teste.com', password: 'user123', role: 'Usuário Regular' }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-slate-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-6">
        {/* Logo e Título */}
        <div className="text-center space-y-4">
          <div className="mx-auto w-16 h-16 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-2xl flex items-center justify-center shadow-lg">
            <MessageSquare className="h-8 w-8 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">WhatsApp Suite</h1>
            <p className="text-gray-600 mt-2">Faça login para continuar</p>
          </div>
        </div>

        {/* Card de Login */}
        <Card className="shadow-xl border-0">
          <CardHeader className="space-y-1 pb-6">
            <h2 className="text-xl font-semibold text-center">Entrar na sua conta</h2>
            <p className="text-sm text-muted-foreground text-center">
              Digite suas credenciais para acessar o painel
            </p>
          </CardHeader>
          
          <CardContent className="space-y-4">
            {error && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="seu@email.com"
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  disabled={isLoading}
                  className="h-11"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Senha</Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Digite sua senha"
                    value={formData.password}
                    onChange={(e) => handleInputChange('password', e.target.value)}
                    disabled={isLoading}
                    className="h-11 pr-10"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                    onClick={() => setShowPassword(!showPassword)}
                    disabled={isLoading}
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4 text-muted-foreground" />
                    ) : (
                      <Eye className="h-4 w-4 text-muted-foreground" />
                    )}
                  </Button>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="remember"
                    checked={formData.rememberMe}
                    onCheckedChange={(checked) => handleInputChange('rememberMe', checked as boolean)}
                    disabled={isLoading}
                  />
                  <Label htmlFor="remember" className="text-sm font-normal">
                    Lembrar de mim
                  </Label>
                </div>
                <Button variant="link" className="px-0 font-normal text-sm">
                  Esqueceu a senha?
                </Button>
              </div>

              <Button 
                type="submit" 
                className="w-full h-11" 
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Entrando...
                  </>
                ) : (
                  'Entrar'
                )}
              </Button>
            </form>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <Separator className="w-full" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-background px-2 text-muted-foreground">
                  Ou continue com
                </span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <Button variant="outline" className="h-11" disabled={isLoading}>
                <Chrome className="mr-2 h-4 w-4" />
                Google
              </Button>
              <Button variant="outline" className="h-11" disabled={isLoading}>
                <Apple className="mr-2 h-4 w-4" />
                Apple
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Credenciais de Demo */}
        <Card className="bg-muted/50">
          <CardContent className="pt-6">
            <h3 className="font-medium mb-3 text-center">Credenciais de Demonstração</h3>
            <div className="grid gap-3">
              {demoCredentials.map((cred, index) => (
                <div key={index} className="flex flex-col gap-1 p-3 bg-background rounded-lg">
                  <div className="flex items-center justify-between">
                    <span className="font-medium text-sm">{cred.role}</span>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setFormData(prev => ({
                          ...prev,
                          email: cred.email,
                          password: cred.password
                        }))
                      }}
                      disabled={isLoading}
                    >
                      Usar
                    </Button>
                  </div>
                  <div className="text-xs text-muted-foreground">
                    <div>Email: {cred.email}</div>
                    <div>Senha: {cred.password}</div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Footer */}
        <div className="text-center text-sm text-muted-foreground">
          Não tem uma conta?{' '}
          <Button variant="link" className="px-0 font-normal">
            Solicitar acesso
          </Button>
        </div>
      </div>
    </div>
  )
}
