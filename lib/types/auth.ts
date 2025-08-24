// Tipos para o sistema de autenticação

export interface UserData {
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
    } | null;
    isSuperAdmin?: boolean;
}

export interface LoginResponse {
    user: UserData;
    access_token: string;
}

export interface RegisterData {
    name: string;
    email: string;
    password: string;
    organizationId: string;
    role: string;
}

// Tipos de ações do sistema de permissões
export type PermissionAction = 'CREATE' | 'READ' | 'UPDATE' | 'DELETE' | 'MANAGE';

// Tipos de recursos do sistema de permissões
export type PermissionResource = 
    | 'SESSIONS'
    | 'CONTACTS'
    | 'MESSAGES'
    | 'USERS'
    | 'ORGANIZATIONS'
    | 'REPORTS'
    | 'SETTINGS'
    | 'INTEGRATIONS'
    | 'BILLING'
    | 'AUDIT_LOGS'
    | 'TEMPLATES'
    | 'TAGS';

// Sistema de permissões granulares
export interface Permission {
    id: number;
    action: PermissionAction;
    resource: PermissionResource;
    description: string;
    createdAt: string;
    updatedAt: string;
}

export interface UserPermissions {
    userId: string;
    role: string;
    rolePermissions: RolePermission[];
    userPermissions: UserCustomPermission[];
    allPermissions: AllPermission[];
}

export interface RolePermission {
    id: number;
    roleId: string;
    permissionId: number;
    permission: Permission;
    createdAt: string;
}

export interface UserCustomPermission {
    id: number;
    userId: string;
    permissionId: number;
    permission: Permission;
    grantedAt: string;
    grantedBy: {
        id: string;
        name: string;
        email: string;
    };
}

export interface AllPermission extends Permission {
    source: 'role' | 'custom';
}

export interface AddPermissionsRequest {
    permissionIds: number[];
}

export interface AddPermissionsResponse {
    message: string;
    userId: string;
    addedPermissions: Permission[];
    skippedPermissions: {
        id: number;
        reason: string;
    }[];
    totalAdded: number;
    totalSkipped: number;
}

export interface RemovePermissionsRequest {
    permissionIds: number[];
}

export interface RemovePermissionsResponse {
    message: string;
    userId: string;
    removedPermissions: Permission[];
    skippedPermissions: {
        id: number;
        reason: string;
    }[];
    totalRemoved: number;
    totalSkipped: number;
}

export interface SetupPermissionsResponse {
    message: string;
    rolesConfigured: {
        role: string;
        permissionsCount: number;
        permissions: string[];
    }[];
    totalPermissionsCreated: number;
    executionTime: string;
}

// Token JWT decodificado
export interface DecodedToken {
    id: string;
    email: string;
    role: string;
    organizationId?: string;
    organizationSlug?: string;
    iat: number;
    exp: number;
}

// Dados para criação de atendente
export interface CreateAttendantData {
    name: string;
    email: string;
    password: string;
    role: string;
    customRoleId?: string;
}

// Resposta de autenticação genérica
export interface AuthResponse {
    success: boolean;
    user?: UserData;
    token?: string;
    message?: string;
}

// Dados para atualização de usuário
export interface UpdateUserData {
    name?: string;
    email?: string;
    phone?: string;
    avatar?: string;
}

// Tipos de roles do sistema
export type SystemRole = 'SUPERADMIN' | 'ADMIN' | 'ATTENDANT';

// Categorias de permissões
export type PermissionCategory = 
    | 'system'
    | 'users' 
    | 'conversations' 
    | 'reports' 
    | 'whatsapp' 
    | 'settings' 
    | 'customers';

// Tipos de permissões comuns
export type PermissionType = 
    // Sistema
    | 'manage_organizations'
    | 'view_global_dashboard'
    
    // Usuários
    | 'manage_attendants'
    | 'view_users'
    | 'edit_user_status'
    
    // Conversas
    | 'manage_conversations'
    | 'view_all_conversations'
    | 'view_assigned_conversations'
    | 'attend_conversations'
    
    // Relatórios
    | 'view_reports'
    | 'view_advanced_reports'
    | 'export_reports'
    
    // WhatsApp
    | 'configure_whatsapp'
    | 'manage_whatsapp_templates'
    
    // Configurações
    | 'manage_organization'
    | 'manage_roles'
    | 'manage_permissions'
    
    // Clientes
    | 'manage_customers'
    | 'view_customers'
    | 'export_customers';
