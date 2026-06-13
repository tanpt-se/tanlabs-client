export type DeepWiden<T> = T extends string
  ? string
  : T extends readonly (infer U)[]
    ? readonly DeepWiden<U>[]
    : T extends object
      ? { [K in keyof T]: DeepWiden<T[K]> }
      : T;

export type UserStatus = 'ACTIVE' | 'LOCKED' | 'DISABLED';

export type SessionStatus = 'ACTIVE' | 'REVOKED' | 'EXPIRED' | 'COMPROMISED';

export interface TokenPayload {
  jti?: string;
  permissions?: string[];
  role?: string;
  email?: string;
  user_id?: string;
  session_id?: string;
  exp?: number;
}

export interface CurrentUserSummary {
  id: string;
  email: string;
  permissions?: string[];
  role: string;
  status: UserStatus;
  twoFactorEnabled: boolean;
}
