export function shouldBootstrapSession(params: {
  token: string | null;
  hasAuthCookie: boolean;
}): boolean {
  return !params.token && params.hasAuthCookie;
}
