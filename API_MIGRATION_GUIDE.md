# Guia de Migração da API de Autenticação

## Resumo das Mudanças

Este documento descreve as principais mudanças feitas no sistema de autenticação para adequar-se à nova API.

### 📋 Endpoints Atualizados

| Endpoint Antigo | Endpoint Novo | Status |
|----------------|---------------|---------|
| `POST /auth/signin` | `POST /auth/login` | ✅ Atualizado |
| `POST /auth/signup` | `POST /auth/register` | ✅ Atualizado |
| `GET /auth/me` | `GET /auth/profile` | ✅ Atualizado |
| `PATCH /user/me/edit` | `PUT /auth/profile` | ✅ Atualizado |
| `GET /auth/permissions` | - | ❌ Removido (substituído por roles) |

### 🔧 Estrutura de Resposta

#### Login Response
**Antes:**
```json
{
  "accessToken": "jwt_token",
  "user": { ... }
}
```

**Depois:**
```json
{
  "access_token": "jwt_token",
  "user": { ... }
}
```

#### User Data
**Antes:**
```typescript
interface UserData {
  id: string;
  name: string;
  email: string;
  role: string;
  isActive: boolean;
  organization?: {
    id: string;
    name: string;
    slug: string;
    plan: string;  // ❌ Removido
  };
  customRole?: { ... };  // ❌ Removido
}
```

**Depois:**
```typescript
interface UserData {
  id: string;
  name: string;
  email: string;
  role: string;
  status?: string;
  emailVerified?: boolean;
  lastLoginAt?: string;
  createdAt?: string;
  updatedAt?: string;
  organizationId?: string;
  organization?: {
    id: string;
    name: string;
    slug: string;
  };
  isSuperAdmin?: boolean;
}
```

### 🔐 Sistema de Permissões

#### Antes: Sistema Simplificado de Roles
- Apenas verificações básicas de role
- Sistema baseado em 4 roles principais

#### Depois: Sistema Híbrido (Roles + Permissões Granulares)

**Roles Base (mantidos):**
- **SUPER_ADMIN**: Administrador do SaaS
- **ORG_ADMIN**: Administrador da organização  
- **ORG_USER**: Usuário comum
- **ORG_VIEWER**: Usuário com acesso de visualização

**Sistema de Permissões Granulares (novo):**
- **Ações**: CREATE, READ, UPDATE, DELETE, MANAGE
- **Recursos**: SESSIONS, CONTACTS, MESSAGES, USERS, ORGANIZATIONS, REPORTS, SETTINGS, INTEGRATIONS, BILLING, AUDIT_LOGS, TEMPLATES, TAGS
- **Permissões Customizadas**: Usuários podem ter permissões extras além do role

**Nota:** O sistema de permissões granulares foi implementado na API mas ainda não está sendo usado no frontend.

### 📁 Arquivos Atualizados

#### `/lib/api/auth.ts`
- ✅ Atualizado endpoint `/auth/signin` → `/auth/login`
- ✅ Modificado `accessToken` → `access_token`
- ✅ Atualizado endpoint `/auth/me` → `/auth/profile`
- ✅ Substituída função `signup()` → `register()`
- ✅ Removidas funções de permissões complexas antigas
- ✅ Adicionadas funções helper: `isAdmin()`, `isSuperAdmin()`
- ✅ Adicionadas funções para gestão de usuários: `getUsers()`, `createUser()`, etc.
- ✅ Adicionadas funções de recuperação de senha: `forgotPassword()`, `resetPassword()`
- ✅ **NOVO**: Implementado sistema de permissões granulares com funções:
  - `getAllPermissions()` - Listar todas as permissões
  - `getUserPermissions(userId)` - Obter permissões de um usuário
  - `addUserPermissions(userId, permissionIds)` - Adicionar permissões
  - `removeUserPermissions(userId, permissionIds)` - Remover permissões
  - `setupSystemPermissions()` - Configurar permissões padrão
  - Funções helper: `hasPermission()`, `hasManagePermission()`, etc.

#### `/lib/types/auth.ts`
- ✅ Atualizada interface `LoginResponse`
- ✅ Atualizada interface `UserData`
- ✅ Removida interface `SignupData`, criada `RegisterData`
- ✅ **NOVO**: Adicionadas interfaces para sistema de permissões granulares:
  - `Permission` - Estrutura de uma permissão
  - `UserPermissions` - Permissões completas de um usuário
  - `PermissionAction` - Tipos de ações (CREATE, READ, UPDATE, DELETE, MANAGE)
  - `PermissionResource` - Tipos de recursos (SESSIONS, CONTACTS, etc.)
  - Interfaces para request/response de gestão de permissões

#### `/app/signup/page.tsx`
- ✅ Atualizada para usar função `register()` ao invés de `signup()`
- ✅ Corrigidos estados de loading
- ✅ Ajustado para nova estrutura de dados

#### `/components/navigation-sidebar.tsx`
- ✅ Atualizada verificação de admin: `role === 'admin'` → `role === 'ORG_ADMIN' || role === 'SUPER_ADMIN'`

#### `/components/pages/admin-profile-page.tsx`
- ✅ Atualizadas verificações de roles para novos padrões
- ✅ Removida referência ao campo `plan` que não existe mais

### 🆕 Novas Funcionalidades

#### Gestão de Usuários (Admins apenas)
```typescript
// Listar usuários
const users = await getUsers();

// Criar usuário
const newUser = await createUser({
  name: "João Silva",
  email: "joao@empresa.com", 
  password: "senha123",
  organizationId: "org_id",
  role: "ORG_USER"
});

// Atualizar usuário
await updateUser(userId, { name: "Novo Nome", role: "ORG_ADMIN" });

// Deletar usuário
await deleteUser(userId);
```

#### Recuperação de Senha
```typescript
// Solicitar reset
await forgotPassword("usuario@email.com");

// Resetar senha
await resetPassword("reset_token", "nova_senha");
```

#### Sistema de Permissões Granulares (Novo)
```typescript
// Listar todas as permissões disponíveis
const permissions = await getAllPermissions();

// Obter permissões de um usuário
const userPermissions = await getUserPermissions(userId);

// Adicionar permissões específicas a um usuário
await addUserPermissions(userId, [1, 2, 3, 15]);

// Remover permissões específicas de um usuário
await removeUserPermissions(userId, [15]);

// Configurar permissões padrão do sistema (SUPER_ADMIN apenas)
await setupSystemPermissions();

// Verificar permissões (helpers)
const canCreateSessions = hasPermission(userPermissions, 'CREATE', 'SESSIONS');
const canManageUsers = hasManagePermission(userPermissions, 'USERS');
```

#### Verificações de Role Simplificadas
```typescript
// Verificar se é admin
if (isAdmin()) {
  // Código para admins
}

// Verificar se é super admin
if (isSuperAdmin()) {
  // Código para super admins
}

// Verificar role específico
if (hasRole('ORG_ADMIN')) {
  // Código para org admins
}
```

### 🔄 Funções Obsoletas

Estas funções foram mantidas para compatibilidade, mas não são mais utilizadas:

- ✅ `getPermissionsFromCookie()` - retorna array vazio (use `getUserPermissions()`)
- ✅ `savePermissionsToCookie()` - não faz nada (permissões vêm da API)
- ✅ `getCustomRoleFromCookie()` - retorna `null` (roles customizados não existem)

**Novas funções recomendadas:**
- `getUserPermissions(userId)` - para obter permissões de usuário
- `hasPermission(userPermissions, action, resource)` - para verificações específicas
- `hasManagePermission(userPermissions, resource)` - para verificar permissão de gestão

### 🚨 Pontos de Atenção

1. **Signup/Register**: A função de registro agora é apenas para admins criarem usuários, não para auto-registro
2. **Roles**: Verificar todos os lugares onde roles são checados para usar os novos padrões
3. **Organization Plan**: Campo removido da estrutura de organização
4. **Permissões**: Sistema simplificado - migrar verificações complexas para verificações de role

### ✅ Próximos Passos

1. Testar fluxo completo de login/logout
2. Testar criação de usuários por admins
3. Verificar se todas as verificações de permissão foram migradas
4. Testar recuperação de senha
5. Validar interface de gestão de usuários
6. **NOVO**: Implementar verificações de permissões granulares no frontend
7. **NOVO**: Criar interfaces para gestão de permissões de usuários
8. **NOVO**: Configurar permissões padrão do sistema

### 🐛 Debugging

Para debug, use a função utilitária:
```typescript
import { debugAuthData } from '@/lib/api/auth';
debugAuthData(); // Imprime todos os dados de auth no console
```
