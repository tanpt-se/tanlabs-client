import { api } from '@/shared/http/client';

type TwoFactorState = {
  enabled: boolean;
  verified: boolean;
  method: 'totp' | null;
};

export function fetchMyAccountHydration() {
  return Promise.all([
    api.get<{ identities: Array<{ provider: string; providerEmail?: string | null }> }>(
      '/users/me/linked-identities',
    ),
    api.get<{ twoFactor: TwoFactorState }>('/auth/2fa'),
  ]);
}

export function startGoogleLinkRequest() {
  return api.post<{ url: string }>('/users/me/social-link/google');
}

export function unlinkGoogleRequest(password: string) {
  return api.delete<{ success: boolean }>('/users/me/social-link/google', {
    body: JSON.stringify({ password }),
  });
}

export function logoutAllDevicesRequest() {
  return api.delete<{ success: boolean; revokedCount: number }>('/auth/sessions');
}

export function beginTwoFactorSetupRequest(password: string) {
  return api.post<{
    twoFactor: TwoFactorState;
    totpSetup: { secret: string; otpauthUrl: string };
    recentAuthToken: string;
  }>('/auth/2fa/totp/setup', { password });
}

export function verifyTwoFactorSetupRequest(code: string, recentAuthToken: string) {
  return api.post<{ success: boolean; twoFactor: TwoFactorState }>('/auth/2fa/totp/verify', {
    code,
    recentAuthToken,
  });
}

export function disableTwoFactorRequest(password: string, code: string) {
  return api.post<{ success: boolean; twoFactor: TwoFactorState }>('/auth/2fa/disable', {
    password,
    code,
  });
}

export function changePasswordRequest(currentPassword: string, newPassword: string) {
  return api.post<{ success: boolean }>('/users/me/change-password', {
    currentPassword,
    newPassword,
  });
}
