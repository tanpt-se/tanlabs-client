import { bindPublicAuthRuntime } from '@tanlabs/web-common/auth/runtime-access';

export {
  configurePublicAuthRuntime,
  type PublicAuthRoutes,
  type PublicAuthRuntime,
} from '@tanlabs/web-common/auth/public-auth-runtime';

export const getPublicAuthRuntime = bindPublicAuthRuntime('web');
