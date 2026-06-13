export type AuthAppAudience = 'client' | 'admin';

export interface AuthAppRoutesConfig {
  login: string;
  defaultAuthenticatedRedirect: string;
  loginNextQueryParam: string;
  isPublicEntryPath: (pathname: string) => boolean;
  isAuthenticatedEntryPath: (pathname: string) => boolean;
}

export interface AuthAppCookiesConfig {
  auth: string;
  refresh: string;
  csrf: string;
  loginRateLimit?: string;
}

export interface AuthAppSessionEndedConfig {
  extraClearCookies?: readonly string[];
  normalizeReason?: (incomingReason: string | null) => { reason: string };
}

export interface AuthAppConfig {
  audience: AuthAppAudience;
  routes: AuthAppRoutesConfig;
  cookies: AuthAppCookiesConfig;
  sessionEnded?: AuthAppSessionEndedConfig;
}
