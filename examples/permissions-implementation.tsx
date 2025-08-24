/**
 * EXEMPLO DE IMPLEMENTAÇÃO DO SISTEMA DE PERMISSÕES GRANULARES
 * 
 * Este arquivo contém exemplos de como implementar o novo sistema
 * de permissões no frontend quando necessário.
 * 
 * NOTA: Estas implementações estão preparadas mas não ativas ainda.
 * NOTA: Este arquivo contém exemplos e não é compilável - serve como referência.
 */

import { useState, useEffect } from 'react';
import { 
  getUserPermissions, 
  hasPermission, 
  hasManagePermission,
  hasCreatePermission,
  hasUpdatePermission,
  hasDeletePermission,
  addUserPermissions,
  removeUserPermissions,
  getAllPermissions
} from '@/lib/api/auth';
import type { UserPermissions, Permission } from '@/lib/types/auth';

// Tipos de exemplo - substitua pelos reais quando implementar
interface User {
  id: string;
  name: string;
  email: string;
}

// Hook de exemplo - substitua pelo hook real do contexto de auth
const useAuth = () => ({
  user: null as User | null
});

// Componentes de exemplo - substitua pelos componentes reais
const ContactsList = ({ canEdit, canDelete }: { canEdit: boolean; canDelete: boolean }) => null;
const UsersList = () => null;

// ========================================
// HOOK CUSTOMIZADO PARA PERMISSÕES
// ========================================

export function useUserPermissions(userId?: string) {
  const [permissions, setPermissions] = useState<UserPermissions | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!userId) return;

    setLoading(true);
    setError(null);

    getUserPermissions(userId)
      .then(setPermissions)
      .catch((err) => {
        setError(err.message || 'Erro ao carregar permissões');
        console.error('Erro ao carregar permissões:', err);
      })
      .finally(() => setLoading(false));
  }, [userId]);

  const refreshPermissions = async () => {
    if (!userId) return;
    
    try {
      setLoading(true);
      const newPermissions = await getUserPermissions(userId);
      setPermissions(newPermissions);
      setError(null);
    } catch (err: any) {
      setError(err.message || 'Erro ao recarregar permissões');
    } finally {
      setLoading(false);
    }
  };

  return {
    permissions,
    loading,
    error,
    refreshPermissions
  };
}

// ========================================
// COMPONENTE WRAPPER PARA VERIFICAÇÃO DE PERMISSÕES
// ========================================

interface PermissionGuardProps {
  userPermissions: UserPermissions | null;
  action: string;
  resource: string;
  fallback?: React.ReactNode;
  children: React.ReactNode;
}

export function PermissionGuard({
  userPermissions,
  action,
  resource,
  fallback = null,
  children
}: PermissionGuardProps) {
  const hasAccess = hasPermission(userPermissions, action, resource);
  
  return hasAccess ? <>{children}</> : <>{fallback}</>;
}

// ========================================
// EXEMPLOS DE USO EM COMPONENTES
// ========================================

// Exemplo 1: Painel de Contatos com Verificações
export function ContactsPanelExample() {
  const { user } = useAuth(); // Assumindo que existe um hook useAuth
  const { permissions, loading } = useUserPermissions(user?.id);

  if (loading) return <div>Carregando permissões...</div>;

  return (
    <div className="contacts-panel">
      <h2>Contatos</h2>
      
      {/* Botão Criar - só aparece se tem permissão */}
      <PermissionGuard
        userPermissions={permissions}
        action="CREATE"
        resource="CONTACTS"
      >
        <button onClick={() => console.log('Criar contato')}>
          Criar Contato
        </button>
      </PermissionGuard>

      {/* Lista de contatos - só aparece se pode ler */}
      <PermissionGuard
        userPermissions={permissions}
        action="READ"
        resource="CONTACTS"
        fallback={<div>Você não tem permissão para ver contatos</div>}
      >
        <ContactsList 
          canEdit={hasUpdatePermission(permissions, 'CONTACTS')}
          canDelete={hasDeletePermission(permissions, 'CONTACTS')}
        />
      </PermissionGuard>
    </div>
  );
}

// Exemplo 2: Gerenciamento de Usuários
export function UserManagementExample() {
  const { user } = useAuth();
  const { permissions } = useUserPermissions(user?.id);

  // Verificar se pode gerenciar usuários
  const canManageUsers = hasManagePermission(permissions, 'USERS');

  if (!canManageUsers) {
    return (
      <div className="access-denied">
        <h2>Acesso Negado</h2>
        <p>Você não tem permissão para gerenciar usuários.</p>
      </div>
    );
  }

  return (
    <div className="user-management">
      <h2>Gerenciamento de Usuários</h2>
      
      <PermissionGuard
        userPermissions={permissions}
        action="CREATE"
        resource="USERS"
      >
        <button onClick={() => console.log('Criar usuário')}>
          Criar Usuário
        </button>
      </PermissionGuard>

      <UsersList />
    </div>
  );
}

// Exemplo 3: Hook para verificações específicas
export function usePermissionChecks(userId?: string) {
  const { permissions } = useUserPermissions(userId);

  return {
    canCreateSessions: hasCreatePermission(permissions, 'SESSIONS'),
    canManageUsers: hasManagePermission(permissions, 'USERS'),
    canViewReports: hasPermission(permissions, 'READ', 'REPORTS'),
    canManageSettings: hasManagePermission(permissions, 'SETTINGS'),
    canDeleteContacts: hasDeletePermission(permissions, 'CONTACTS'),
    // ... outras verificações conforme necessário
  };
}

// Exemplo 4: Gerenciamento de Permissões de Usuário
export function UserPermissionsManager({ targetUserId }: { targetUserId: string }) {
  const [allPermissions, setAllPermissions] = useState<Permission[]>([]);
  const { permissions: userPermissions, refreshPermissions } = useUserPermissions(targetUserId);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    getAllPermissions().then(setAllPermissions);
  }, []);

  const handleAddPermission = async (permissionId: number) => {
    try {
      setLoading(true);
      await addUserPermissions(targetUserId, [permissionId]);
      await refreshPermissions();
    } catch (error) {
      console.error('Erro ao adicionar permissão:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleRemovePermission = async (permissionId: number) => {
    try {
      setLoading(true);
      await removeUserPermissions(targetUserId, [permissionId]);
      await refreshPermissions();
    } catch (error) {
      console.error('Erro ao remover permissão:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="permissions-manager">
      <h3>Gerenciar Permissões do Usuário</h3>
      
      <div className="permissions-grid">
        {allPermissions.map((permission) => {
          const hasThisPermission = userPermissions?.allPermissions.some(
            p => p.id === permission.id
          );
          
          return (
            <div key={permission.id} className="permission-item">
              <span>{permission.action} {permission.resource}</span>
              <span className="description">{permission.description}</span>
              
              {hasThisPermission ? (
                <button 
                  onClick={() => handleRemovePermission(permission.id)}
                  disabled={loading}
                  className="remove-btn"
                >
                  Remover
                </button>
              ) : (
                <button 
                  onClick={() => handleAddPermission(permission.id)}
                  disabled={loading}
                  className="add-btn"
                >
                  Adicionar
                </button>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ========================================
// UTILITIES PARA NAVEGAÇÃO CONDICIONAL
// ========================================

// Função para verificar se usuário pode acessar uma rota
export function canAccessRoute(userPermissions: UserPermissions | null, route: string): boolean {
  const routePermissions: Record<string, { action: string; resource: string }> = {
    '/admin/users': { action: 'MANAGE', resource: 'USERS' },
    '/admin/reports': { action: 'READ', resource: 'REPORTS' },
    '/admin/settings': { action: 'MANAGE', resource: 'SETTINGS' },
    '/contacts': { action: 'READ', resource: 'CONTACTS' },
    '/sessions': { action: 'READ', resource: 'SESSIONS' },
    '/messages': { action: 'READ', resource: 'MESSAGES' },
    // ... mapear outras rotas
  };

  const required = routePermissions[route];
  if (!required) return true; // Rota não mapeada = acesso livre

  return hasPermission(userPermissions, required.action, required.resource);
}

// Filtrar itens de menu baseado em permissões
export function filterMenuByPermissions(
  menuItems: any[], 
  userPermissions: UserPermissions | null
) {
  return menuItems.filter(item => {
    if (!item.requiredPermission) return true;
    
    const { action, resource } = item.requiredPermission;
    return hasPermission(userPermissions, action, resource);
  });
}

export default {
  useUserPermissions,
  PermissionGuard,
  usePermissionChecks,
  canAccessRoute,
  filterMenuByPermissions
};
