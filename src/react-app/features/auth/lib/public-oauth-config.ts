import { useSyncExternalStore } from 'react';

export type PublicOAuthConfig = {
  googleEnabled: boolean;
  facebookEnabled: boolean;
};

const DEFAULT_PUBLIC_OAUTH_CONFIG: PublicOAuthConfig = {
  googleEnabled: false,
  facebookEnabled: false,
};

type PublicAuthConfigResponse = {
  oauth: {
    google: { enabled: boolean };
    facebook: { enabled: boolean };
  };
};

const listeners = new Set<() => void>();
let snapshot: PublicOAuthConfig = DEFAULT_PUBLIC_OAUTH_CONFIG;

function emitChange() {
  for (const listener of listeners) {
    listener();
  }
}

export function getPublicOAuthConfig(): PublicOAuthConfig {
  return snapshot;
}

export function subscribePublicOAuthConfig(listener: () => void): () => void {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

export function setPublicOAuthConfig(next: PublicOAuthConfig): void {
  snapshot = next;
  emitChange();
}

export function usePublicOAuthConfig(): PublicOAuthConfig {
  return useSyncExternalStore(subscribePublicOAuthConfig, getPublicOAuthConfig, getPublicOAuthConfig);
}

export async function fetchPublicOAuthConfig(apiBaseUrl: string): Promise<PublicOAuthConfig> {
  try {
    const response = await fetch(`${apiBaseUrl}/auth/public-config`, {
      credentials: 'include',
    });
    if (!response.ok) {
      return DEFAULT_PUBLIC_OAUTH_CONFIG;
    }

    const data = (await response.json()) as PublicAuthConfigResponse;
    return {
      googleEnabled: data.oauth.google.enabled,
      facebookEnabled: data.oauth.facebook.enabled,
    };
  } catch {
    return DEFAULT_PUBLIC_OAUTH_CONFIG;
  }
}
