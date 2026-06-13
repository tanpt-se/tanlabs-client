import { getPublicAuthRuntime as getRuntime } from './public-auth-runtime';

export {
  configurePublicAuthRuntime,
  type PublicAuthRoutes,
  type PublicAuthRuntime,
} from './public-auth-runtime';

export type PublicAuthApp = 'admin' | 'web';

export function bindPublicAuthRuntime(app: PublicAuthApp) {
  return () => getRuntime(app);
}
