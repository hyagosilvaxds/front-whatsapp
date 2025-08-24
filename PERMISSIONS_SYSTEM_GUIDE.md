# Sistema de Permissões Granulares - Guia de Implementação

## 📋 Visão Geral

O sistema de permissões foi atualizado para suportar controle granular baseado em **Ações** e **Recursos**.

### 🎯 Conceitos

#### Ações (Actions)
- **CREATE**: Criar novos recursos
- **READ**: Visualizar recursos existentes  
- **UPDATE**: Modificar recursos existentes
- **DELETE**: Remover recursos
- **MANAGE**: Controle total (inclui todas as ações acima)

#### Recursos (Resources)
- **SESSIONS**: Sessões de atendimento
- **CONTACTS**: Contatos de clientes
- **MESSAGES**: Mensagens de atendimento
- **USERS**: Usuários do sistema
- **ORGANIZATIONS**: Organizações
- **REPORTS**: Relatórios e estatísticas
- **SETTINGS**: Configurações do sistema
- **INTEGRATIONS**: Integrações externas
- **BILLING**: Faturamento e pagamentos
- **AUDIT_LOGS**: Logs de auditoria
- **TEMPLATES**: Templates de mensagens
- **TAGS**: Tags para categorização

## 🔧 Funções Disponíveis

### Funções de API

```typescript
// Listar todas as permissões disponíveis
const permissions = await getAllPermissions();

// Obter permissões de um usuário específico
const userPermissions = await getUserPermissions(userId);

// Adicionar permissões a um usuário
const result = await addUserPermissions(userId, [1, 2, 3]);

// Remover permissões de um usuário
const result = await removeUserPermissions(userId, [1, 2]);

// Configurar permissões padrão do sistema (SUPER_ADMIN apenas)
const result = await setupSystemPermissions();
```

### Funções Helper

```typescript
// Verificar permissão específica
const canCreateSessions = hasPermission(userPermissions, 'CREATE', 'SESSIONS');

// Verificar permissões por tipo
const canManageUsers = hasManagePermission(userPermissions, 'USERS');
const canReadReports = hasReadPermission(userPermissions, 'REPORTS');
const canCreateContacts = hasCreatePermission(userPermissions, 'CONTACTS');
const canUpdateMessages = hasUpdatePermission(userPermissions, 'MESSAGES');
const canDeleteSessions = hasDeletePermission(userPermissions, 'SESSIONS');
```

## 💡 Exemplos de Uso

### 1. Verificar Permissões em Componentes

```typescript
import { getUserPermissions, hasPermission } from '@/lib/api/auth';

function ContactsPanel() {
  const [userPermissions, setUserPermissions] = useState(null);
  const { user } = useAuth();

  useEffect(() => {
    if (user?.id) {
      getUserPermissions(user.id).then(setUserPermissions);
    }
  }, [user]);

  const canCreateContacts = hasPermission(userPermissions, 'CREATE', 'CONTACTS');
  const canDeleteContacts = hasPermission(userPermissions, 'DELETE', 'CONTACTS');

  return (
    <div>
      {canCreateContacts && (
        <Button onClick={createContact}>Criar Contato</Button>
      )}
      
      {canDeleteContacts && (
        <Button variant="destructive" onClick={deleteContact}>
          Deletar Contato
        </Button>
      )}
    </div>
  );
}
```

### 2. Gerenciar Permissões de Usuário

```typescript
import { addUserPermissions, removeUserPermissions } from '@/lib/api/auth';

async function grantContactPermissions(userId: string) {
  try {
    const result = await addUserPermissions(userId, [
      6,  // CREATE CONTACTS
      7,  // READ CONTACTS
      8,  // UPDATE CONTACTS
      9   // DELETE CONTACTS
    ]);
    
    console.log(`Adicionadas ${result.totalAdded} permissões`);
    console.log(`Ignoradas ${result.totalSkipped} permissões`);
  } catch (error) {
    console.error('Erro ao adicionar permissões:', error);
  }
}

async function revokeContactPermissions(userId: string) {
  try {
    const result = await removeUserPermissions(userId, [8, 9]); // UPDATE e DELETE
    console.log(`Removidas ${result.totalRemoved} permissões`);
  } catch (error) {
    console.error('Erro ao remover permissões:', error);
  }
}
```

### 3. Verificações Condicionais em Rotas

```typescript
import { hasManagePermission } from '@/lib/api/auth';

function AdminUsersPage() {
  const [userPermissions, setUserPermissions] = useState(null);
  const { user } = useAuth();

  useEffect(() => {
    if (user?.id) {
      getUserPermissions(user.id).then(setUserPermissions);
    }
  }, [user]);

  // Verificar se pode gerenciar usuários
  if (!hasManagePermission(userPermissions, 'USERS')) {
    return <div>Acesso negado: Você não tem permissão para gerenciar usuários.</div>;
  }

  return (
    <div>
      {/* Interface de gerenciamento de usuários */}
    </div>
  );
}
```

## 📊 Matriz de Permissões por Role

### SUPER_ADMIN
- **Acesso Total**: Bypass de todas as verificações

### ORG_ADMIN  
- **MANAGE**: SESSIONS, CONTACTS, MESSAGES, USERS, REPORTS, SETTINGS, TEMPLATES, TAGS
- **READ**: AUDIT_LOGS, ORGANIZATIONS, BILLING
- **Limitado**: Não pode gerenciar ORGANIZATIONS, BILLING ou AUDIT_LOGS

### ORG_USER
- **CREATE/READ/UPDATE**: SESSIONS (próprias), MESSAGES (próprias)
- **READ/UPDATE**: CONTACTS
- **READ**: TEMPLATES, TAGS
- **Limitado**: Não pode deletar ou gerenciar recursos

### ORG_VIEWER
- **READ**: SESSIONS, CONTACTS, MESSAGES, TEMPLATES
- **Limitado**: Apenas visualização

## 🚨 Pontos Importantes

1. **SUPER_ADMIN**: Sempre bypassa verificações de permissão
2. **Cache**: Considere cachear permissões do usuário para performance
3. **Granularidade**: Permissões são verificadas por ação + recurso
4. **Hierarquia**: MANAGE inclui todas as outras ações do recurso
5. **Customização**: Usuários podem ter permissões extras além do role

## 🔄 Migração das Verificações Antigas

### Antes (verificações simples de role):
```typescript
if (user.role === 'ORG_ADMIN') {
  // mostrar interface admin
}
```

### Depois (verificações granulares):
```typescript
if (hasManagePermission(userPermissions, 'USERS')) {
  // mostrar interface de gestão de usuários
}

if (hasCreatePermission(userPermissions, 'REPORTS')) {
  // mostrar botão criar relatório
}
```

Esta abordagem oferece controle muito mais preciso sobre o que cada usuário pode fazer no sistema.
