export interface RouteGuards {
  isPublicEntryPath: (pathname: string) => boolean;
  isAuthenticatedEntryPath: (pathname: string) => boolean;
  sanitizeNextPath: (value: string | string[] | null | undefined) => string | null;
  resolveAuthenticatedRedirect: (value: string | string[] | null | undefined) => string;
}

export function createRouteGuards(params: {
  publicEntryPaths: readonly string[];
  authenticatedEntryPaths: readonly string[];
  defaultRedirect: string;
}): RouteGuards {
  const { publicEntryPaths, authenticatedEntryPaths, defaultRedirect } = params;

  function isPublicEntryPath(pathname: string): boolean {
    return publicEntryPaths.includes(pathname);
  }

  function isAuthenticatedEntryPath(pathname: string): boolean {
    return authenticatedEntryPaths.some(
      (entryPath) => pathname === entryPath || pathname.startsWith(`${entryPath}/`),
    );
  }

  function sanitizeNextPath(value: string | string[] | null | undefined): string | null {
    const candidate = Array.isArray(value) ? value[0] : value;
    if (!candidate) {
      return null;
    }

    if (!candidate.startsWith('/') || candidate.startsWith('//')) {
      return null;
    }

    const [path] = candidate.split('?');
    if (!path || !isAuthenticatedEntryPath(path)) {
      return null;
    }

    return candidate;
  }

  function resolveAuthenticatedRedirect(value: string | string[] | null | undefined): string {
    return sanitizeNextPath(value) ?? defaultRedirect;
  }

  return {
    isPublicEntryPath,
    isAuthenticatedEntryPath,
    sanitizeNextPath,
    resolveAuthenticatedRedirect,
  };
}
