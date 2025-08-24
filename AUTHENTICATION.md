# Sistema de Autenticação - WhatsApp Suite

## 📋 Visão Geral

O sistema de autenticação foi adaptado para trabalhar com a API do WhatsApp SaaS, oferecendo:

- ✅ Login/Logout com JWT
- ✅ Registro de organizações
- ✅ Sistema de permissões granular
- ✅ Roles do sistema (SUPERADMIN, ADMIN, ATTENDANT)
- ✅ Middleware de autenticação automático
- ✅ Proteção de rotas baseada em permissões
- ✅ Context API para gerenciamento de estado

## 🔧 Configuração

### 1. API Base URL
O sistema está configurado para usar `http://localhost:4000` como base URL da API.

Para alterar, edite o arquivo `lib/api/client.ts`:
```typescript
const api = axios.create({
  baseURL: "http://localhost:4000", // Altere aqui
  // ...
});
```

### 2. Estrutura de Arquivos

```
lib/
├── api/
│   ├── client.ts          # Cliente HTTP com interceptors
│   └── auth.ts            # Funções de autenticação
├── middleware/
│   └── auth-middleware.tsx # Middleware de proteção de rotas
├── types/
│   └── auth.ts            # Tipos TypeScript
contexts/
└── auth-context.tsx       # Context API para estado global
app/
├── login/
│   └── page.tsx           # Página de login
├── signup/
│   └── page.tsx           # Página de cadastro
└── unauthorized/
    └── page.tsx           # Página de acesso negado
```

## 🚀 Como Usar

### 1. Login
```typescript
import { useAuth } from '@/contexts/auth-context';

function LoginComponent() {
  const { login, isLoading } = useAuth();
  
  const handleLogin = async () => {
    const result = await login(email, password);
    if (result.success) {
      // Redirecionamento automático baseado no role
    }
  };
}
```

### 2. Verificar Autenticação
```typescript
import { useAuth } from '@/contexts/auth-context';

function ProtectedComponent() {
  const { user, isAuthenticated, isLoading } = useAuth();
  
  if (isLoading) return <Loading />;
  if (!isAuthenticated) return <Redirect to="/login" />;
  
  return <div>Conteúdo protegido</div>;
}
```

### 3. Verificar Permissões
```typescript
import { hasPermission, hasRole } from '@/lib/api/auth';

// Verificar permissão específica
if (hasPermission('manage_attendants')) {
  // Mostrar botão de gerenciar atendentes
}

// Verificar role
if (hasRole('ADMIN')) {
  // Mostrar funcionalidades de admin
}
```

### 4. Proteger Rotas com HOC
```typescript
import { withAuth } from '@/lib/middleware/auth-middleware';

const ProtectedPage = withAuth(MyComponent, {
  requiredPermissions: ['manage_attendants'],
  requiredRoles: ['ADMIN'],
  fallbackPath: '/unauthorized'
});
```

### 5. Logout
```typescript
const { logout } = useAuth();

const handleLogout = async () => {
  await logout();
  // Redirecionamento automático para /login
};
```

## 🔐 Sistema de Permissões

### Roles do Sistema
- **SUPERADMIN**: Acesso total ao sistema
- **ADMIN**: Gerenciar organização e atendentes
- **ATTENDANT**: Atender conversas

### Categorias de Permissões
- `system`: Gerenciamento do sistema
- `users`: Gerenciamento de usuários
- `conversations`: Gerenciamento de conversas
- `reports`: Relatórios e analytics
- `whatsapp`: Configurações do WhatsApp
- `settings`: Configurações gerais
- `customers`: Gerenciamento de clientes

### Permissões Disponíveis
```typescript
// Sistema
'manage_organizations'
'view_global_dashboard'

// Usuários
'manage_attendants'
'view_users'
'edit_user_status'

// Conversas
'manage_conversations'
'view_all_conversations'
'view_assigned_conversations'
'attend_conversations'

// Relatórios
'view_reports'
'view_advanced_reports'
'export_reports'

// WhatsApp
'configure_whatsapp'
'manage_whatsapp_templates'

// Configurações
'manage_organization'
'manage_roles'
'manage_permissions'

// Clientes
'manage_customers'
'view_customers'
'export_customers'
```

## 🛡️ Middleware de Autenticação

O middleware é aplicado automaticamente no `layout.tsx` principal e:

1. **Verifica autenticação**: Se o token JWT é válido
2. **Valida permissões**: Se o usuário tem acesso à rota
3. **Redireciona automaticamente**: Para login ou página de erro
4. **Rotas públicas**: Login, signup e home page não precisam de auth

### Rotas Públicas (não precisam de autenticação)
- `/`
- `/login`
- `/signup`

### Proteção Automática
Todas as outras rotas são automaticamente protegidas pelo middleware.

## 🔄 Fluxo de Autenticação

1. **Usuário acessa rota protegida**
2. **Middleware verifica token JWT**
3. **Se não autenticado**: Redireciona para `/login`
4. **Se autenticado**: Busca dados do usuário e permissões
5. **Verifica permissões necessárias**: Para a rota específica
6. **Se não autorizado**: Redireciona para `/unauthorized`
7. **Se autorizado**: Permite acesso à rota

## 📝 Endpoints da API

### Autenticação Básica
- `POST /auth/signin` - Login
- `POST /auth/signup` - Registro de organização
- `POST /auth/logout` - Logout
- `GET /auth/me` - Dados do usuário logado

### Permissões
- `GET /auth/permissions` - Permissões do usuário
- `GET /auth/permissions/all` - Todas as permissões disponíveis

### Gerenciamento
- `POST /auth/create-attendant` - Criar atendente
- `PATCH /user/me/edit` - Atualizar dados do usuário

## 🔧 Configurações Avançadas

### Customizar Timeout de Token
```typescript
// lib/api/client.ts
const api = axios.create({
  timeout: 600000, // 10 minutos
});
```

### Interceptors HTTP
O sistema inclui interceptors automáticos para:
- **Request**: Adicionar token JWT ao header Authorization
- **Response**: Redirecionar para login se token inválido (401/403)

### Cookies Utilizados
- `jwtToken`: Token JWT de autenticação
- `user`: Dados completos do usuário
- `userId`: ID do usuário
- `PERMISSIONS`: Permissões do usuário
- `USER_ROLE`: Role do usuário
- `CUSTOM_ROLE`: Role customizada (se aplicável)

## 🐛 Debugging

### Logs no Console
O sistema gera logs detalhados no console para debugging:
- Login/logout events
- Verificações de autenticação
- Erros de permissão
- Chamadas da API

### Verificar Estado da Autenticação
```typescript
import { isAuthenticated, getUserFromToken, getPermissionsFromCookie } from '@/lib/api/auth';

console.log('Autenticado:', isAuthenticated());
console.log('Usuário:', getUserFromToken());
console.log('Permissões:', getPermissionsFromCookie());
```

## 🔄 Migration do Sistema Antigo

Se você tinha um sistema de autenticação anterior, o novo sistema:
1. **Substitui completamente** o sistema anterior
2. **Mantém compatibilidade** com o Context API
3. **Adiciona novas funcionalidades** de permissões
4. **Requer atualização** das páginas de login/signup

## 🚨 Importante

1. **Limpar localStorage**: Depois da migração, usuários devem fazer login novamente
2. **API deve estar rodando**: O sistema depende da API em `localhost:4000`
3. **Tokens JWT**: São validados automaticamente e renovados conforme necessário
4. **HTTPS em produção**: Certifique-se de usar HTTPS em produção para segurança dos tokens

## 📞 Suporte

Para problemas ou dúvidas sobre o sistema de autenticação, verifique:
1. Console do navegador para erros
2. Network tab para chamadas da API
3. Cookies para verificar se os dados estão sendo salvos
4. Estado do AuthContext no React DevTools
