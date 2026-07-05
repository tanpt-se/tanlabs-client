export const DEFAULT_CLIENT_ROLE = 'user';

export const clientPermissionKeys = {
  viewDashboard: 'client.dashboard.read',
  viewSessions: 'client.session.read',
  manageAccount: 'client.account.read',
} as const;

export const clientPermissionCatalog = Object.values(clientPermissionKeys);

export type ClientPermissionKey = (typeof clientPermissionCatalog)[number];

function getPermissionNamespace(permission: string): string | null {
  const [namespace] = permission.split('.');
  return namespace || null;
}

export function hasPermission(params: {
  role?: string | null;
  permissions?: readonly string[] | null;
  permission: string;
}): boolean {
  return Boolean(params.permissions?.includes(params.permission));
}

export function isClientAudience(params: {
  role?: string | null;
  permissions?: readonly string[] | null;
}): boolean {
  return (
    params.role === DEFAULT_CLIENT_ROLE ||
    Boolean(
      params.permissions?.some((permission) => getPermissionNamespace(permission) === 'client'),
    )
  );
}
