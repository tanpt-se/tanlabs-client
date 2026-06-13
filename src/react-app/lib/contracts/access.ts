export const SUPER_ADMIN_ROLE = 'super_admin';
export const ADMIN_ROLE = 'admin';
export const DEFAULT_CLIENT_ROLE = 'user';

export const adminPermissionKeys = {
  revokeSessions: 'admin.session.revoke',
} as const;

export const clientPermissionKeys = {
  viewDashboard: 'client.dashboard.read',
  viewSessions: 'client.session.read',
  manageAccount: 'client.account.read',
} as const;

export const adminPermissionCatalog = Object.values(adminPermissionKeys);
export const clientPermissionCatalog = Object.values(clientPermissionKeys);
export const sharedPermissionCatalog = [
  ...adminPermissionCatalog,
  ...clientPermissionCatalog,
] as const;

export type SharedPermissionKey = (typeof sharedPermissionCatalog)[number];

function getPermissionNamespace(permission: string): string | null {
  const [namespace] = permission.split('.');
  return namespace || null;
}

export function isSuperAdmin(role?: string | null): boolean {
  return role === SUPER_ADMIN_ROLE;
}

export function hasPermission(params: {
  role?: string | null;
  permissions?: readonly string[] | null;
  permission: string;
}): boolean {
  return isSuperAdmin(params.role) || Boolean(params.permissions?.includes(params.permission));
}

export function hasAnyPermission(params: {
  role?: string | null;
  permissions?: readonly string[] | null;
  permissionsToCheck: readonly string[];
}): boolean {
  return (
    isSuperAdmin(params.role) ||
    params.permissionsToCheck.some((permission) =>
      Boolean(params.permissions?.includes(permission)),
    )
  );
}

export function isAdminAudience(params: {
  role?: string | null;
  permissions?: readonly string[] | null;
}): boolean {
  return (
    isSuperAdmin(params.role) ||
    params.role === ADMIN_ROLE ||
    Boolean(
      params.permissions?.some((permission) => getPermissionNamespace(permission) === 'admin'),
    )
  );
}

export function isClientAudience(params: {
  role?: string | null;
  permissions?: readonly string[] | null;
}): boolean {
  return (
    isSuperAdmin(params.role) ||
    params.role === DEFAULT_CLIENT_ROLE ||
    Boolean(
      params.permissions?.some((permission) => getPermissionNamespace(permission) === 'client'),
    )
  );
}
